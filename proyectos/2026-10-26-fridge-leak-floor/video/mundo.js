// La nevera, el agua, la mano y la cocina. Lo que se repite, una sola vez.
import * as k from "#kit";

const TAU = Math.PI * 2;
const az = k.azar(41);

export function camara(g, c) {
  g.setTransform(c.s, 0, 0, c.s, 540 - c.x * c.s, 1020 - c.y * c.s);
}
const mezCam = (a, b, u) => ({ x: k.mez(a.x, b.x, u), y: k.mez(a.y, b.y, u), s: Math.exp(k.mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, k.suave(k.tramo(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}
export const quieto = (t, hasta) => Math.min(t, hasta - 0.22);

export function velo(g, a = 0.84) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 40, 0, 640);
  gr.addColorStop(0, `rgba(10, 18, 32, ${a})`);
  gr.addColorStop(0.5, `rgba(10, 18, 32, ${a * 0.42})`);
  gr.addColorStop(1, "rgba(10, 18, 32, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 680);
  g.restore();
}
export function viñeta(g, a = 0.35) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1000, 380, 540, 1080, 1200);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(8, 14, 24, ${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

export const HOOK = { x: -150, y: 470, s: 3.15 };

const gotasChorro = Array.from({ length: 48 }, () => ({
  u: az(), x: (az() - 0.5) * 2, s: 10 + az() * 22, vel: 0.55 + az() * 0.9, fase: az(),
}));
const gotasVuelo = Array.from({ length: 26 }, () => ({
  ang: az() * TAU, vel: 80 + az() * 220, s: 8 + az() * 16, fase: az(),
}));

export function cocinaFondo(g) {
  const pared = g.createLinearGradient(-900, -1400, 700, 400);
  pared.addColorStop(0, "#fff1d4");
  pared.addColorStop(0.45, "#ffd19a");
  pared.addColorStop(1, "#f0a15a");
  g.fillStyle = pared;
  g.fillRect(-2200, -2200, 4400, 4400);
  const sol = g.createRadialGradient(-520, -780, 20, -300, -400, 900);
  sol.addColorStop(0, "rgba(255, 248, 220, 0.9)");
  sol.addColorStop(1, "rgba(255, 248, 220, 0)");
  g.fillStyle = sol;
  g.fillRect(-1600, -1600, 2200, 1800);
  g.save();
  g.beginPath();
  g.rect(-1500, 500, 3000, 1600);
  g.clip();
  for (let i = -2; i < 8; i++) {
    const y = 500 + i * 78;
    const pg = g.createLinearGradient(0, y, 0, y + 78);
    pg.addColorStop(0, i % 2 ? "#e7a85a" : "#f2c27a");
    pg.addColorStop(0.45, i % 2 ? "#c47a32" : "#d9924a");
    pg.addColorStop(1, i % 2 ? "#a86428" : "#c4843c");
    g.fillStyle = pg;
    g.fillRect(-1500, y, 3000, 74);
    g.strokeStyle = "rgba(90, 48, 16, 0.28)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(-1500, y + 74);
    g.lineTo(1500, y + 74);
    g.stroke();
  }
  g.restore();
  g.save();
  g.globalAlpha = 0.16;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -800, -900, 2000, 2200);
  g.restore();
}

function puerta(g, x, y, w, h, tono, congelador) {
  const gr = g.createLinearGradient(x, y, x + w, y + h);
  gr.addColorStop(0, tono[0]);
  gr.addColorStop(0.35, tono[1]);
  gr.addColorStop(1, tono[2]);
  g.fillStyle = gr;
  k.redondo(g, x, y, w, h, 22);
  g.fill();
  g.save();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "screen";
  g.fillStyle = "#ffffff";
  k.redondo(g, x + 18, y + 28, w * 0.22, h * 0.72, 16);
  g.fill();
  g.restore();
  if (congelador) {
    g.fillStyle = "rgba(150, 210, 255, 0.16)";
    k.redondo(g, x + 28, y + 70, w - 56, h * 0.42, 12);
    g.fill();
  }
  const hx = congelador ? x + w - 46 : x + 28;
  const hg = g.createLinearGradient(hx, y + 180, hx + 22, y + 180);
  hg.addColorStop(0, "#8a6a22");
  hg.addColorStop(0.4, "#ffe7a2");
  hg.addColorStop(1, "#b1842e");
  g.fillStyle = hg;
  k.redondo(g, hx, y + 200, 22, 280, 10);
  g.fill();
}

export function nevera(g, luz = 1) {
  g.save();
  g.translate(0, 40);
  g.fillStyle = "rgba(40, 24, 10, 0.28)";
  g.beginPath();
  g.ellipse(10, 530, 360, 36, 0, 0, TAU);
  g.fill();
  const cuerpo = g.createLinearGradient(-360, -700, 360, 500);
  cuerpo.addColorStop(0, "#f7fbff");
  cuerpo.addColorStop(0.4, "#d5dee8");
  cuerpo.addColorStop(1, "#8ea0b3");
  g.fillStyle = cuerpo;
  k.redondo(g, -350, -690, 720, 1180, 28);
  g.fill();
  g.fillStyle = "#6e8296";
  g.beginPath();
  g.moveTo(370, -660);
  g.lineTo(448, -710);
  g.lineTo(448, 430);
  g.lineTo(370, 470);
  g.closePath();
  g.fill();
  const techo = g.createLinearGradient(-350, -760, 400, -640);
  techo.addColorStop(0, "#ffffff");
  techo.addColorStop(1, "#c5d0dc");
  g.fillStyle = techo;
  g.beginPath();
  g.moveTo(-350, -670);
  g.lineTo(-300, -760);
  g.lineTo(430, -760);
  g.lineTo(370, -670);
  g.closePath();
  g.fill();
  puerta(g, -328, -650, 330, 1040, ["#f4f8fb", "#c9d5e2", "#7f93a8"], true);
  puerta(g, 16, -650, 332, 1040, ["#fffdf8", "#e7eef6", "#9aabbd"], false);
  g.globalAlpha = 0.55 + 0.45 * luz;
  g.fillStyle = "rgba(120, 230, 255, 0.0)";
  g.restore();
  if (luz < 0.98) {
    g.save();
    g.globalAlpha = 1 - luz;
    g.fillStyle = "rgba(20, 28, 40, 0.28)";
    k.redondo(g, -350, -650, 720, 1180, 28);
    g.fill();
    g.restore();
  }
}

export function chorroPuerta(g, t, fuerza = 1) {
  if (fuerza < 0.02) return;
  const ox = -150, oy = 400;
  g.save();
  g.globalAlpha *= fuerza;
  for (let i = 0; i < 16; i++) {
    const u = i / 15;
    const wob = Math.sin(t * 9 + u * 6) * 16 * u;
    const x = ox + wob + u * 20;
    const y = oy + u * 210;
    const w = 26 + u * 90;
    const h = 18 + u * 8;
    const gr = g.createLinearGradient(x - w, y, x + w, y);
    gr.addColorStop(0, "rgba(180, 245, 255, 0.15)");
    gr.addColorStop(0.45, "rgba(70, 200, 255, 0.82)");
    gr.addColorStop(1, "rgba(220, 250, 255, 0.2)");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(x, y, w, h, 0, 0, TAU);
    g.fill();
  }
  g.globalCompositeOperation = "lighter";
  for (const q of gotasChorro) {
    const u = (q.u + t * q.vel) % 1;
    const x = ox + q.x * (30 + u * 80) + Math.sin(t * 8 + q.fase * 6) * 10;
    const y = oy + u * 240;
    g.fillStyle = `rgba(230, 250, 255, ${0.35 + 0.55 * (1 - u)})`;
    g.beginPath();
    g.ellipse(x, y, q.s * 0.45, q.s, 0.4, 0, TAU);
    g.fill();
  }
  for (const q of gotasVuelo) {
    const u = (q.fase + t * 0.85) % 1;
    const x = ox + Math.cos(q.ang) * q.vel * u;
    const y = oy + 40 + Math.sin(q.ang) * 40 * u + 420 * u * u;
    g.fillStyle = `rgba(210, 245, 255, ${0.8 * (1 - u)})`;
    g.beginPath();
    g.arc(x, y, q.s * (1 - u * 0.4), 0, TAU);
    g.fill();
  }
  g.restore();
  k.brillo(g, ox, oy + 60, 120, "cian", 0.22 * fuerza);
}

export function charco(g, radio, t, mancha = 0) {
  if (radio < 4) return;
  g.save();
  g.translate(-80, 620);
  const suelo = g.createRadialGradient(0, 0, 20, 0, 0, radio);
  suelo.addColorStop(0, `rgba(40, 28, 16, ${0.15 + mancha * 0.55})`);
  suelo.addColorStop(1, "rgba(40, 28, 16, 0)");
  g.fillStyle = suelo;
  g.beginPath();
  g.ellipse(0, 10, radio * 1.15, radio * 0.42, 0, 0, TAU);
  g.fill();
  const ag = g.createRadialGradient(-radio * 0.2, -8, 10, 0, 0, radio);
  ag.addColorStop(0, "rgba(190, 240, 255, 0.78)");
  ag.addColorStop(0.55, "rgba(40, 150, 210, 0.55)");
  ag.addColorStop(1, "rgba(20, 80, 120, 0.15)");
  g.fillStyle = ag;
  g.beginPath();
  g.ellipse(0, 0, radio, radio * 0.38, 0, 0, TAU);
  g.fill();
  g.save();
  g.globalAlpha = 0.45;
  g.globalCompositeOperation = "screen";
  g.beginPath();
  g.ellipse(0, 0, radio, radio * 0.38, 0, 0, TAU);
  g.clip();
  g.drawImage(k.causticas, -radio + (t * 40) % 80, -radio * 0.4, radio * 2, radio);
  g.restore();
  g.strokeStyle = "rgba(230, 250, 255, 0.8)";
  g.lineWidth = 6;
  g.beginPath();
  g.ellipse(0, 0, radio * 0.96, radio * 0.36, 0, 0, TAU);
  g.stroke();
  g.restore();
}

export function mano(g, x, y, s, rot, cierra = 0) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(s, s);
  const piel = g.createLinearGradient(-40, -80, 50, 90);
  piel.addColorStop(0, "#ffe0c4");
  piel.addColorStop(0.5, "#f0b48a");
  piel.addColorStop(1, "#c48462");
  g.fillStyle = piel;
  g.beginPath();
  g.ellipse(0, 20, 58, 46, -0.2, 0, TAU);
  g.fill();
  const dedos = [-34, -12, 10, 30];
  dedos.forEach((dx, i) => {
    g.save();
    g.translate(dx, -10);
    g.rotate((dx / 90) + cierra * 0.5);
    k.redondo(g, -13, -78 - (i === 2 ? 10 : 0), 26, 84, 12);
    g.fill();
    g.restore();
  });
  g.save();
  g.translate(-48, 8);
  g.rotate(-0.8 - cierra * 0.4);
  k.redondo(g, -12, -64, 28, 70, 13);
  g.fill();
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.beginPath();
  g.ellipse(-16, -6, 16, 22, -0.6, 0, TAU);
  g.fill();
  g.restore();
}

export function enchufePared(g, fuera, t) {
  cocinaFondo(g);
  g.save();
  g.translate(80, 40);
  g.fillStyle = "#f4efe6";
  k.redondo(g, -150, -190, 300, 340, 28);
  g.fill();
  g.strokeStyle = "#d9d0c2";
  g.lineWidth = 8;
  k.redondo(g, -150, -190, 300, 340, 28);
  g.stroke();
  g.fillStyle = "#2a3138";
  k.redondo(g, -46, -70, 36, 70, 8);
  g.fill();
  k.redondo(g, 12, -70, 36, 70, 8);
  g.fill();
  g.fillStyle = "#1b1f24";
  g.beginPath();
  g.arc(0, 70, 16, 0, TAU);
  g.fill();
  const px = k.mez(0, 250, fuera);
  const py = k.mez(0, 70, fuera);
  g.strokeStyle = "#1c1f24";
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(px, py + 70);
  g.quadraticCurveTo(px + 80, 280, 420, 360);
  g.stroke();
  g.fillStyle = "#f7f4ee";
  k.redondo(g, px - 78, py - 70, 156, 150, 22);
  g.fill();
  g.fillStyle = "#cfc6b8";
  g.fillRect(px - 78, py + 20, 156, 28);
  g.strokeStyle = "#c5ced6";
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(px - 34, py - 78);
  g.lineTo(px - 36, py - 168 - fuera * 10);
  g.moveTo(px + 34, py - 78);
  g.lineTo(px + 38, py - 168 - fuera * 10);
  g.stroke();
  g.restore();
  if (fuera > 0.25 && fuera < 0.7) k.fogonazo(g, 80, -20, (fuera - 0.25) * 1.6, 360, "255,236,180");
  mano(g, 210 + fuera * 230, 150 + fuera * 40, 1.7, 0.35, 0.55);
}

export function cajaFria(g) {
  const gr = g.createLinearGradient(-700, -900, 500, 800);
  gr.addColorStop(0, "#16385c");
  gr.addColorStop(0.5, "#0c2340");
  gr.addColorStop(1, "#071422");
  g.fillStyle = gr;
  g.fillRect(-1400, -1600, 2800, 3200);
  const luz = g.createRadialGradient(0, -200, 40, 0, 0, 900);
  luz.addColorStop(0, "rgba(150, 210, 255, 0.2)");
  luz.addColorStop(1, "rgba(150, 210, 255, 0)");
  g.fillStyle = luz;
  g.fillRect(-1400, -1600, 2800, 3200);
  g.fillStyle = "#12304e";
  g.fillRect(-520, -780, 1040, 1280);
  g.strokeStyle = "rgba(190, 230, 255, 0.25)";
  g.lineWidth = 8;
  g.strokeRect(-520, -780, 1040, 1280);
}

export function bobinas(g, t, derretido) {
  g.save();
  g.translate(0, -520);
  for (let i = 0; i < 6; i++) {
    const y = i * 54;
    g.strokeStyle = "#d5e4ee";
    g.lineWidth = 34;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-420, y);
    for (let x = -420; x <= 420; x += 70) g.quadraticCurveTo(x + 18, y + (i % 2 ? 28 : -28), x + 36, y);
    g.stroke();
    g.strokeStyle = `rgba(255,255,255,${0.9 * (1 - derretido * 0.65)})`;
    g.lineWidth = 16 * (1 - derretido * 0.5);
    g.stroke();
    if (derretido < 0.85) {
      g.fillStyle = `rgba(244, 252, 255, ${0.9 - derretido})`;
      g.beginPath();
      g.ellipse(-180 + i * 60, y - 8, 34, 22, 0, 0, TAU);
      g.fill();
    }
  }
  g.restore();
  if (derretido > 0.12) {
    const u = (t * 0.55) % 1;
    g.fillStyle = "#e9f8ff";
    g.beginPath();
    g.ellipse(20, -480 + u * 180, 22, 34, 0, 0, TAU);
    g.fill();
  }
}

export function agujero(g, x, y, s, tapado) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "#061018";
  g.beginPath();
  g.ellipse(0, 0, 92, 48, 0, 0, TAU);
  g.fill();
  g.strokeStyle = "#c5d4e2";
  g.lineWidth = 14;
  g.stroke();
  g.fillStyle = "rgba(90, 190, 235, 0.45)";
  g.beginPath();
  g.ellipse(0, 10, 58, 22, 0, 0, TAU);
  g.fill();
  if (tapado > 0.02) {
    g.globalAlpha = tapado;
    g.fillStyle = "#f7fcff";
    g.beginPath();
    g.ellipse(0, -6, 120 * tapado, 64 * tapado, 0, 0, TAU);
    g.fill();
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * TAU;
      g.fillStyle = i % 2 ? "#d7f3ff" : "#ffffff";
      g.beginPath();
      g.ellipse(Math.cos(a) * 52, Math.sin(a) * 26 - 8, 26, 36, a, 0, TAU);
      g.fill();
    }
  }
  g.restore();
}

export function cesta(g, x, y, s) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.strokeStyle = "#d5dde6";
  g.lineWidth = 8;
  g.fillStyle = "rgba(230, 240, 248, 0.2)";
  k.redondo(g, -220, -70, 440, 150, 18);
  g.fill();
  g.stroke();
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(i * 48, -60);
    g.lineTo(i * 48, 70);
    g.stroke();
  }
  g.restore();
}

export function tecnico(g, u) {
  const x = k.mez(980, 0, u);
  g.save();
  g.translate(x, 20);
  g.scale(2.45, 2.45);
  g.globalAlpha = Math.min(1, u * 1.4);
  g.fillStyle = "#243044";
  k.redondo(g, -90, -40, 180, 280, 30);
  g.fill();
  g.fillStyle = "#ff7a18";
  k.redondo(g, -78, -24, 156, 160, 16);
  g.fill();
  g.fillStyle = "#f0c7a4";
  g.beginPath();
  g.arc(0, -110, 58, 0, TAU);
  g.fill();
  g.fillStyle = "#2a211c";
  g.beginPath();
  g.arc(0, -128, 52, Math.PI, TAU);
  g.fill();
  g.fillStyle = "#e7b48e";
  k.redondo(g, 70, 20, 36, 140, 16);
  g.fill();
  g.fillStyle = "#e23b2f";
  k.redondo(g, 78, 120, 92, 70, 12);
  g.fill();
  g.fillStyle = "#f2d36b";
  g.fillRect(96, 142, 56, 10);
  g.restore();
}

export function detras(g, t, cerrado) {
  const pared = g.createLinearGradient(-800, -900, 600, 700);
  pared.addColorStop(0, "#ffe7b8");
  pared.addColorStop(1, "#f3a15c");
  g.fillStyle = pared;
  g.fillRect(-1400, -1600, 2800, 3200);
  g.fillStyle = "#8d97a3";
  k.redondo(g, -340, -620, 680, 980, 20);
  g.fill();
  g.strokeStyle = "#1c2228";
  g.lineWidth = 14;
  for (let i = 0; i < 14; i++) {
    g.beginPath();
    g.moveTo(-300, -540 + i * 58);
    g.lineTo(300, -540 + i * 58);
    g.stroke();
  }
  const abierto = 1 - cerrado;
  g.strokeStyle = "#1f5cff";
  g.lineWidth = 74;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-460, -40);
  g.quadraticCurveTo(-80, 20, 160, 120);
  g.stroke();
  g.strokeStyle = "rgba(190, 220, 255, 0.55)";
  g.lineWidth = 16;
  g.stroke();
  if (abierto > 0.05) {
    const ox = 170, oy = 130;
    g.save();
    g.globalAlpha = abierto;
    for (let i = 0; i < 12; i++) {
      const u = (i / 12 + t * 0.9) % 1;
      g.fillStyle = `rgba(140, 230, 255, ${0.85 * (1 - u)})`;
      g.beginPath();
      g.ellipse(ox + u * 30, oy + u * 340, 28 + u * 36, 20, 0.5, 0, TAU);
      g.fill();
    }
    g.restore();
    k.brillo(g, ox, oy + 60, 280, "cian", 0.55 * abierto);
  }
  g.save();
  g.translate(-460, -40);
  g.rotate(-0.9 + cerrado * 1.5);
  const vg = g.createLinearGradient(-40, -90, 40, 90);
  vg.addColorStop(0, "#fff3c4");
  vg.addColorStop(0.45, "#e6b43c");
  vg.addColorStop(1, "#7a5814");
  g.fillStyle = vg;
  k.redondo(g, -22, -110, 44, 220, 18);
  g.fill();
  g.beginPath();
  g.arc(0, 0, 28, 0, TAU);
  g.fillStyle = "#f8e7b0";
  g.fill();
  g.restore();
  if (cerrado > 0.08) mano(g, -430, 30, 1.85, -0.2 + cerrado, 0.5);
}

export function taza(g, x, y, s, nivel, polvo) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "rgba(40, 22, 10, 0.35)";
  g.beginPath();
  g.ellipse(0, 168, 100, 22, 0, 0, TAU);
  g.fill();
  g.beginPath();
  g.moveTo(-78, -130);
  g.lineTo(-96, 140);
  g.quadraticCurveTo(0, 186, 96, 140);
  g.lineTo(78, -130);
  g.closePath();
  g.fillStyle = "#f4f7fb";
  g.fill();
  if (nivel > 0.02) {
    g.save();
    g.clip();
    const yy = k.mez(140, -80, nivel);
    const agua = g.createLinearGradient(0, yy, 0, 180);
    agua.addColorStop(0, polvo > 0.45 ? "#f7f4ea" : "#9ad8f2");
    agua.addColorStop(1, polvo > 0.45 ? "#d9dde4" : "#2f8fbe");
    g.fillStyle = agua;
    g.fillRect(-120, yy, 240, 340);
    g.restore();
  }
  g.beginPath();
  g.moveTo(-78, -130);
  g.lineTo(-96, 140);
  g.quadraticCurveTo(0, 186, 96, 140);
  g.lineTo(78, -130);
  g.closePath();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 10;
  g.stroke();
  g.strokeStyle = "#d5dde8";
  g.lineWidth = 14;
  g.beginPath();
  g.arc(108, 8, 42, -1.15, 1.15);
  g.stroke();
  if (polvo > 0.05 && nivel < 0.7) {
    g.fillStyle = `rgba(255,255,255,${0.35 + polvo * 0.65})`;
    g.beginPath();
    g.ellipse(0, k.mez(40, -40, nivel), 48, 16, 0, 0, TAU);
    g.fill();
  }
  g.restore();
}

export function vapor(g, x, y, t, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  for (let i = 0; i < 5; i++) {
    const u = (t * 0.45 + i * 0.2) % 1;
    g.fillStyle = `rgba(255,255,255,${0.35 * (1 - u)})`;
    g.beginPath();
    g.ellipse(x + Math.sin(t * 2 + i) * 18, y - u * 180, 22 + u * 16, 18, 0, 0, TAU);
    g.fill();
  }
  g.restore();
}

export function olla(g, x, y, s, hervor, al) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha = al;
  g.fillStyle = "#b9c2cc";
  k.redondo(g, -120, -40, 240, 150, 20);
  g.fill();
  k.metal(g, -120, 120);
  g.fillStyle = "#8e99a6";
  g.fillRect(-150, -55, 36, 16);
  g.fillRect(114, -55, 36, 16);
  if (hervor > 0.2) {
    for (let i = 0; i < 6; i++) {
      const bx = -70 + i * 28;
      const by = -50 - ((i * 17) % 30) * hervor;
      g.fillStyle = "rgba(255,255,255,0.8)";
      g.beginPath();
      g.arc(bx, by, 10 + hervor * 8, 0, TAU);
      g.fill();
    }
  }
  g.restore();
}

export function pera(g, x, y, s, rot, aprieta) {
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(s, s);
  const bulbo = g.createRadialGradient(-20, -70, 8, 0, -40, 70);
  bulbo.addColorStop(0, "#ffb0b6");
  bulbo.addColorStop(0.5, "#e23d4a");
  bulbo.addColorStop(1, "#8e1524");
  g.fillStyle = bulbo;
  g.beginPath();
  g.ellipse(0, -36 * (1 - aprieta * 0.25), 58, 70 * (1 - aprieta * 0.35), 0, 0, TAU);
  g.fill();
  g.fillStyle = "rgba(190, 230, 245, 0.85)";
  k.redondo(g, -16, 20, 32, 210, 12);
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 4;
  g.stroke();
  g.restore();
}

export function bandeja(g, x, y, nivel, splash) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#1a1e24";
  g.beginPath();
  g.ellipse(0, 0, 360, 96, 0, 0, TAU);
  g.fill();
  g.fillStyle = "#2c333c";
  g.beginPath();
  g.ellipse(0, -10, 320, 70, 0, 0, TAU);
  g.fill();
  if (nivel > 0.02) {
    g.fillStyle = "rgba(90, 205, 245, 0.92)";
    g.beginPath();
    g.ellipse(0, -10, 290 * Math.min(1, nivel), 54 * Math.min(1, nivel), 0, 0, TAU);
    g.fill();
  }
  if (splash > 0.02 && splash < 1) {
    g.strokeStyle = `rgba(210, 245, 255, ${1 - splash})`;
    g.lineWidth = 8;
    g.beginPath();
    g.ellipse(0, -20, 40 + splash * 200, 16 + splash * 50, 0, 0, TAU);
    g.stroke();
    k.brillo(g, 0, -30, 220, "cian", (1 - splash) * 0.7);
  }
  g.restore();
}

export function tuboBajada(g, u) {
  g.strokeStyle = "rgba(170, 220, 245, 0.9)";
  g.lineWidth = 36;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(0, 80);
  g.lineTo(0, 80 + u * 520);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.45)";
  g.lineWidth = 8;
  g.stroke();
}
