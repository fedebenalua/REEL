// El salón, el perro de perfil y lo que hay por dentro. El mismo perro en todos los planos.
import * as k from "#kit";

const { azar, lienzo, manchas, suave, tramo } = k;

export const PIEL = {
  luz: "#ffe3bf", medio: "#f07830", sombra: "#a33c12", oscuro: "#6e240c",
  pecho: "#fff6ea", nariz: "#241410",
  collar: "#2f6bff", chapa: "#ffe27a",
  lengua: "#ff8b94", dentro: "#f3b2aa",
};

export const DOG = { x: 430, y: 1165, s: 1.72 };

const azP = azar(71);
export const MOTAS = Array.from({ length: 22 }, () => ({
  x: 80 + azP() * 1400,
  y: 280 + azP() * 700,
  r: 3 + azP() * 5,
  f: azP() * 6.28,
  v: 12 + azP() * 28,
}));

const bufs = [];
export function conAlfa(g, al, fn) {
  if (al <= 0.02) return;
  if (al >= 0.985) { fn(g); return; }
  const b = bufs.pop() || lienzo(1080, 1920);
  const c = b.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, 1080, 1920);
  fn(c);
  g.save();
  g.globalAlpha *= al;
  g.drawImage(b, 0, 0);
  g.restore();
  bufs.push(b);
}

export function conCam(g, cam, fn) {
  g.save();
  g.translate(540, 960);
  g.scale(cam.z, cam.z);
  g.translate(-cam.fx, -cam.fy);
  fn();
  g.restore();
}

export function velo(g, al = 0.86) {
  if (al <= 0.02) return;
  const vg = g.createLinearGradient(0, 180, 0, 780);
  vg.addColorStop(0, `rgba(24, 12, 28, ${al})`);
  vg.addColorStop(0.46, `rgba(24, 12, 28, ${al * 0.9})`);
  vg.addColorStop(0.68, `rgba(24, 12, 28, ${al * 0.4})`);
  vg.addColorStop(1, "rgba(24, 12, 28, 0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 820);
}

function bulto(g, x, y, rx, ry, luz, medio, sombra, rot = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.beginPath();
  g.ellipse(0, 0, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
  const R = Math.max(rx, ry);
  const gr = g.createRadialGradient(-rx * 0.42, -ry * 0.5, R * 0.04, rx * 0.2, ry * 0.15, R * 1.35);
  gr.addColorStop(0, luz);
  gr.addColorStop(0.48, medio);
  gr.addColorStop(1, sombra);
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

function pelaje(g, x, y, rx, ry, al = 0.28) {
  g.save();
  g.beginPath();
  g.ellipse(x, y, Math.max(1, rx), Math.max(1, ry), 0, 0, Math.PI * 2);
  g.clip();
  g.globalAlpha *= al;
  g.globalCompositeOperation = "multiply";
  g.drawImage(manchas, x - rx, y - ry, rx * 2, ry * 2);
  g.restore();
}

function capsula(g, ax, ay, bx, by, r, luz, medio, sombra) {
  const n = 5;
  for (let i = n; i >= 0; i--) {
    const u = i / n;
    bulto(g, ax + (bx - ax) * u, ay + (by - ay) * u, r, r * 0.92, luz, medio, sombra);
  }
}

// La rodilla del perro, doblada hacia atrás (el lado de la cola).
function articulacion(h, p, l1, l2) {
  const dx = p[0] - h[0], dy = p[1] - h[1];
  const d = Math.hypot(dx, dy) || 1;
  const L = Math.min(d, l1 + l2 - 2);
  const a = (l1 * l1 - l2 * l2 + L * L) / (2 * L);
  const alto = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / d, uy = dy / d;
  return [h[0] + ux * a + uy * alto, h[1] + uy * a - ux * alto];
}

// 0 = pata abajo, 0,5 = en el costado. `ampl` 1 llega al costado; por encima, más lejos.
export function pataLocal(fase, ampl) {
  const f = ((fase % 1) + 1) % 1;
  const llega = Math.pow(Math.sin(f * Math.PI), 0.72);
  const a = Math.max(0, ampl);
  const resto = Math.min(a, 1);
  const extra = Math.max(0, a - 1);
  const x = -128 + (78 - (-128)) * llega * resto + extra * 36;
  const y = 228 + (-28 - 228) * llega * resto - extra * 46;
  return [x, y, llega];
}

export function mundoDe(local) {
  return [DOG.x + local[0] * DOG.s, DOG.y + local[1] * DOG.s];
}

export function ritmo(t, desfase = 0.22) {
  const x = (t * 4 + desfase) % 1;
  return x < 0 ? x + 1 : x;
}

function pataDibujo(g, fase, ampl, p, al = 1) {
  if (al <= 0.02) return;
  const [px, py] = pataLocal(fase, ampl);
  const cadera = [-158, 18];
  const rod = articulacion(cadera, [px, py], 118, 128);
  g.save();
  g.globalAlpha *= al;
  capsula(g, cadera[0], cadera[1], rod[0], rod[1], 26, p.luz, p.medio, p.sombra);
  capsula(g, rod[0], rod[1], px, py, 20, p.luz, p.medio, p.oscuro);
  bulto(g, cadera[0], cadera[1], 32, 28, p.luz, p.medio, p.sombra);
  bulto(g, px, py + 4, 36, 26, p.luz, p.medio, p.oscuro, -0.35);
  g.fillStyle = "#fff6ee";
  for (let i = 0; i < 3; i++) {
    g.beginPath();
    g.ellipse(px + 6 + i * 12, py + 12, 7.5, 10, 0.2, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

export function perroLado(g, o = {}) {
  const p = o.piel || PIEL;
  const s = o.s || DOG.s;
  const x = o.x ?? DOG.x;
  const y = o.y ?? DOG.y;
  const fase = o.fase ?? 0;
  const ampl = o.ampl ?? 0.85;
  const lengua = o.lengua ?? 0;
  const zona = o.zona ?? 0;
  const barriga = o.barriga ?? 0;
  const luz = o.luz ?? 0;
  const alegre = o.alegre ?? 0;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  if (luz < 0.5) {
    g.save();
    g.globalAlpha *= 0.28;
    g.fillStyle = "#5a3018";
    g.beginPath();
    g.ellipse(10, 250, 210, 26, 0, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  const cola = Math.sin((o.t || 0) * 3.2) * 0.35;
  g.save();
  g.translate(-210, -20);
  g.rotate(-0.9 + cola);
  g.strokeStyle = luz > 0.5 ? "#7a3414" : p.medio;
  g.lineWidth = 26;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(-50, -80, -10, -130);
  g.stroke();
  g.restore();

  // la pata de atrás del otro lado, quieta: así se ve que solo dispara la de este
  g.save();
  g.globalAlpha *= luz > 0.5 ? 0.45 : 0.7;
  capsula(g, -120, 36, -108, 150, 18, p.sombra, p.oscuro, p.oscuro);
  capsula(g, -108, 150, -100, 236, 15, p.sombra, p.oscuro, p.oscuro);
  bulto(g, -100, 242, 22, 15, p.sombra, p.oscuro, p.oscuro);
  g.restore();

  capsula(g, 145, 48, 160, 150, 16, p.sombra, p.oscuro, p.oscuro);
  capsula(g, 160, 150, 168, 240, 14, p.sombra, p.oscuro, p.oscuro);
  bulto(g, 168, 246, 20, 14, p.sombra, p.oscuro, p.oscuro);

  const cuerpo = luz > 0.5 ? "#ff9a3c" : p.medio;
  const cuerpoLuz = luz > 0.5 ? "#ffe08a" : p.luz;
  const cuerpoSombra = luz > 0.5 ? "#d06018" : p.sombra;
  bulto(g, 0, 10, 196, 102, cuerpoLuz, cuerpo, cuerpoSombra);
  pelaje(g, 0, 10, 196, 102, luz > 0.5 ? 0.15 : 0.32);
  bulto(g, 40, 58, 100, 62, p.pecho, "#f3d2b4", "#e4b898");

  if (barriga > 0.02) {
    g.save();
    g.globalAlpha *= 0.85 * barriga;
    k.brillo(g, 36, 78, 150, "naranja", 0.9);
    g.restore();
  }
  if (zona > 0.02) {
    g.save();
    g.globalAlpha *= zona;
    k.brillo(g, 18, -18, 170, "amarilla", 1);
    g.restore();
  }

  capsula(g, 155, 42, 172, 150, 20, p.luz, p.medio, p.sombra);
  capsula(g, 172, 150, 184, 242, 16, p.luz, p.medio, p.oscuro);
  bulto(g, 184, 250, 26, 16, p.luz, p.medio, p.oscuro);

  // cuello, collar, cabeza
  bulto(g, 168, -8, 62, 52, cuerpoLuz, cuerpo, cuerpoSombra, 0.4);
  if (luz < 0.5) {
    g.save();
    g.translate(168, -6);
    g.rotate(0.5);
    k.redondo(g, -46, -16, 96, 32, 16);
    g.fillStyle = p.collar;
    g.fill();
    bulto(g, 8, 2, 13, 15, p.chapa, "#e8b84a", "#b88820");
    g.restore();
  }

  const oreja = 0.08 + Math.sin((o.t || 0) * 2.1) * 0.04 * (1 - alegre * 0.5);
  g.save();
  g.translate(232, -108);
  g.rotate(-0.35 + oreja);
  bulto(g, -8, 36, 28, 58, p.medio, p.sombra, p.oscuro, 0.2);
  bulto(g, -4, 40, 14, 40, p.dentro, "#e89898", "#d07880");
  g.restore();

  bulto(g, 250, -78, 86, 72, cuerpoLuz, cuerpo, cuerpoSombra);
  pelaje(g, 250, -78, 86, 72, luz > 0.5 ? 0.12 : 0.26);
  bulto(g, 318, -58, 48, 32, luz > 0.5 ? "#c48a74" : p.pecho, "#f0d2ba", "#e2bea4");
  bulto(g, 358, -52, 18, 13, "#3a241c", p.nariz, "#140c0a");
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath();
  g.ellipse(352, -56, 5, 3, -0.5, 0, Math.PI * 2);
  g.fill();

  // ojo
  const cierra = alegre * 0.55;
  g.save();
  g.translate(274, -96);
  g.fillStyle = "#fffaf4";
  g.beginPath();
  g.ellipse(0, 0, 16, 16 - cierra * 8, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1c120e";
  g.beginPath();
  g.ellipse(2, 1, 8, 8 - cierra * 3, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(-1, -2, 3, 3, 0, 0, Math.PI * 2);
  g.fill();
  if (cierra > 0.05) {
    g.strokeStyle = p.oscuro;
    g.lineWidth = 4;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-16, -2);
    g.quadraticCurveTo(0, 8 + cierra * 6, 16, -2);
    g.stroke();
  }
  g.restore();

  const bocaY = -34;
  g.strokeStyle = "rgba(90, 28, 22, 0.9)";
  g.lineWidth = 4;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(300, bocaY);
  g.quadraticCurveTo(324, bocaY + 10 + lengua * 8, 346, bocaY + 2);
  g.stroke();
  if (lengua > 0.05) {
    g.save();
    g.globalAlpha *= lengua;
    g.fillStyle = p.lengua;
    g.beginPath();
    g.ellipse(328, bocaY + 16, 12, 10 + lengua * 8, 0.2, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#ffb0b4";
    g.beginPath();
    g.ellipse(328, bocaY + 14, 5, 8, 0.2, 0, Math.PI * 2);
    g.fill();
    g.restore();
  }

  // sin estela de otra pata: a este ritmo se lee el movimiento solo
  const pataP = luz > 0.5
    ? { luz: "#ffe7a8", medio: "#ffb03a", sombra: "#e07010", oscuro: "#a84808" }
    : p;
  pataDibujo(g, fase, ampl, pataP, 1);

  if (luz > 0.5) sistema(g, o);

  g.restore();
}

function sistema(g, o) {
  const pulso = o.pulso ?? 0;
  const cerebro = o.cerebro ?? 0.35;
  const late = o.late ?? 0;
  // el camino del aviso: del costado a la médula, sin subir a la cabeza
  const piel = [18, -8];
  const med = [-20, -78];
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const x = piel[0] + (med[0] - piel[0]) * u;
    const y = piel[1] + (med[1] - piel[1]) * u + Math.sin(u * Math.PI) * 16;
    const aqui = Math.exp(-Math.pow((u - pulso) * 4.2, 2));
    k.brillo(g, x, y, 28 + aqui * 36, "cian", 0.25 + aqui * 0.85);
  }
  const columna = [[230, -92], [150, -108], [60, -112], [-30, -96], [-120, -70], [-190, -48]];
  columna.forEach((c, i) => {
    const cerca = Math.exp(-Math.pow(i - 3, 2) / 3);
    k.brillo(g, c[0], c[1], 46 + late * 30 * (i > 1 && i < 5 ? 1 : 0.3), i > 1 && i < 5 ? "amarilla" : "naranja", 0.35 + cerca * 0.4 + late * 0.35);
  });
  g.save();
  g.strokeStyle = "rgba(255, 210, 120, 0.9)";
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  columna.forEach((c, i) => (i ? g.lineTo(c[0], c[1]) : g.moveTo(c[0], c[1])));
  g.stroke();
  g.restore();
  k.brillo(g, 268, -96, 120, "violeta", cerebro);
  k.brillo(g, -24, -96, 70 + late * 40, "amarilla", 0.55 + late * 0.45);
}

export function mano(g, x, y, s, t, al = 1) {
  if (al <= 0.02) return;
  const menea = Math.sin(t * Math.PI * 8) * 5;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  g.scale(s, s);
  // manga de camisa, para que se entienda que es una persona
  bulto(g, 78, 18, 62, 40, "#ff7d62", "#e44532", "#a82018", 0.4);
  bulto(g, 28, 8, 36, 28, "#fff6ee", "#f0c2a8", "#d49878");
  // palma
  bulto(g, 0, 6, 40, 34, "#ffe8d8", "#f3c0a4", "#d89878");
  // cuatro dedos hacia la izquierda, donde está el perro
  for (let i = 0; i < 4; i++) {
    const y0 = -22 + i * 15;
    capsula(g, -6, y0, -62, y0 - 6 + menea * (i - 1.5) * 0.15, 9, "#ffe8d8", "#f3c0a4", "#d89878");
    bulto(g, -66, y0 - 6, 10, 8, "#fff1e6", "#f0b898", "#d09070");
  }
  // pulgar
  capsula(g, 16, 22, 8, 52, 10, "#ffe8d8", "#f0b898", "#d09070");
  g.restore();
}

export function salon(g, t) {
  const pared = g.createLinearGradient(0, 0, 400, 1600);
  pared.addColorStop(0, "#c8f1ff");
  pared.addColorStop(0.42, "#fff6e8");
  pared.addColorStop(1, "#ffe0c2");
  g.fillStyle = pared;
  g.fillRect(-500, -400, 2600, 2400);

  // ventana y sol
  g.save();
  g.translate(180, 620);
  k.redondo(g, 0, 0, 280, 420, 18);
  g.fillStyle = "#9fd8ff";
  g.fill();
  const cielo = g.createLinearGradient(0, 0, 0, 420);
  cielo.addColorStop(0, "#b7ecff");
  cielo.addColorStop(1, "#fff1c4");
  g.fillStyle = cielo;
  g.fill();
  g.strokeStyle = "#fff6ea";
  g.lineWidth = 14;
  g.beginPath();
  g.moveTo(140, 8);
  g.lineTo(140, 412);
  g.moveTo(8, 210);
  g.lineTo(272, 210);
  g.stroke();
  g.restore();

  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    g.globalAlpha = 0.09;
    g.fillStyle = "#fff4d0";
    g.beginPath();
    g.moveTo(250, 700);
    g.lineTo(80 + i * 180, 1500);
    g.lineTo(220 + i * 180, 1500);
    g.closePath();
    g.fill();
  }
  g.restore();

  // suelo
  const suelo = g.createLinearGradient(0, 1320, 0, 1900);
  suelo.addColorStop(0, "#e8a15a");
  suelo.addColorStop(1, "#c47a38");
  g.fillStyle = suelo;
  g.fillRect(-500, 1360, 2600, 700);
  g.strokeStyle = "rgba(120, 60, 20, 0.28)";
  g.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    g.beginPath();
    g.moveTo(-400, 1400 + i * 48);
    g.lineTo(1800, 1400 + i * 48);
    g.stroke();
  }

  // sofá
  g.save();
  g.translate(980, 1180);
  bulto(g, 0, -40, 340, 210, "#6aa6ff", "#2a5ad8", "#16348a");
  bulto(g, -250, -150, 70, 160, "#8ebcff", "#3a6ae0", "#1c3c96");
  bulto(g, 250, -150, 70, 160, "#8ebcff", "#3a6ae0", "#1c3c96");
  bulto(g, 0, 80, 300, 70, "#d6e6ff", "#8eb4f0", "#5a84c8");
  g.restore();

  // alfombra
  g.save();
  g.translate(520, 1460);
  k.redondo(g, -340, -70, 760, 180, 40);
  g.fillStyle = "#1f9a86";
  g.fill();
  g.globalAlpha = 0.45;
  g.fillStyle = "#ffd36a";
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.ellipse(i * 90, 10, 28, 48, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();

  // maceta
  g.save();
  g.translate(120, 1120);
  bulto(g, 0, 80, 46, 36, "#f0a070", "#d07040", "#a04820");
  bulto(g, -10, 10, 36, 22, "#3ecf78", "#1e9a48", "#0e6a30", -0.6);
  bulto(g, 18, -10, 40, 26, "#7aee9a", "#2eb85c", "#147838", 0.5);
  bulto(g, 0, -36, 30, 34, "#b6ff72", "#46c85a", "#1e8840", 0.1);
  g.restore();

  for (const m of MOTAS) {
    const yy = m.y + Math.sin(t * 0.8 + m.f) * 16;
    g.fillStyle = "rgba(255, 244, 210, 0.45)";
    g.beginPath();
    g.ellipse(m.x, yy, m.r, m.r, 0, 0, Math.PI * 2);
    g.fill();
  }
}

export function oscuro(g) {
  const gr = g.createLinearGradient(0, 0, 400, 1920);
  gr.addColorStop(0, "#3a1248");
  gr.addColorStop(0.45, "#1a1840");
  gr.addColorStop(1, "#0c1c28");
  g.fillStyle = gr;
  g.fillRect(-600, -500, 2800, 3000);
  const az = azar(19);
  for (let i = 0; i < 40; i++) {
    const x = -200 + az() * 1600;
    const y = -100 + az() * 1800;
    k.brillo(g, x, y, 8 + az() * 16, az() > 0.5 ? "violeta" : "cian", 0.15 + az() * 0.2);
  }
}

// La rodilla de casa. uGolpe 0–1 el martillo, uSalta 0–1 la pierna.
export function rodilla(g, uGolpe, uSalta) {
  const sube = suave(Math.min(1, uSalta));
  const pieX = k.mez(430, 120, sube);
  const pieY = k.mez(1560, 1180, sube);
  const rodX = 700, rodY = 860;

  // muslo, vaquero
  g.save();
  g.translate(760, 280);
  g.rotate(0.35);
  bulto(g, 0, 220, 150, 280, "#6aa8ff", "#2f6bff", "#1a3e9a");
  g.strokeStyle = "rgba(255,255,255,0.25)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(-40, 40);
  g.lineTo(-20, 420);
  g.stroke();
  g.restore();

  capsula(g, rodX, rodY + 30, pieX, pieY - 30, 52, "#ffe0cc", "#f0b898", "#d09070");
  // pie
  g.save();
  g.translate(pieX, pieY);
  g.rotate(-0.3 - sube * 0.4);
  bulto(g, 10, 0, 92, 40, "#ffe6d2", "#f2c2a4", "#d09878");
  g.restore();

  // rodilla y rótula
  bulto(g, rodX, rodY, 92, 78, "#ffe8d6", "#f3c4a8", "#d09878");
  bulto(g, rodX + 8, rodY - 8, 36, 28, "#fff6ee", "#f6d2bc", "#e2b498");
  // el tendón, justo debajo, donde golpea el martillo
  bulto(g, rodX + 6, rodY + 62, 16, 22, "#f8d0ba", "#e8b098", "#c88870");

  // martillo
  const ang = k.mez(-0.9, 0.35, suave(Math.min(1, uGolpe)));
  g.save();
  g.translate(rodX + 150, rodY - 40);
  g.rotate(ang);
  g.strokeStyle = "#d7dee8";
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 0);
  g.lineTo(150, -20);
  g.stroke();
  g.translate(168, -24);
  bulto(g, 0, 0, 46, 28, "#ff6a5a", "#e23a34", "#a01818", 0.2);
  k.brillo(g, -10, 4, 40, "blanca", uGolpe > 0.92 ? (uGolpe - 0.92) * 8 : 0);
  g.restore();

  if (uSalta > 0.05 && uSalta < 0.7) {
    k.brillo(g, rodX + 10, rodY + 60, 180, "amarilla", Math.sin(Math.min(1, uSalta) * Math.PI) * 0.8);
  }
}

export const llegaSuave = (t, a, b) => suave(tramo(t, a, b));
