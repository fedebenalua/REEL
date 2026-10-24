// El cerebro, la persona, la casa y el cuarto de este vídeo. El mismo cerebro en todos los planos.
import * as k from "#kit";

const az = k.azar(17);
export const MOTAS = Array.from({ length: 36 }, () => ({
  x: az() * 1080, y: az() * 1920, r: 1.2 + az() * 2.2, v: 12 + az() * 28, f: az() * 6.28, c: az() < 0.5 ? "255,186,110" : "130,190,255",
}));

export function fondo(g, arriba, abajo) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, arriba);
  gr.addColorStop(1, abajo);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
}

export function motas(g, t, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (const m of MOTAS) {
    const y = (m.y - t * m.v) % 1920;
    const yy = y < 0 ? y + 1920 : y;
    g.fillStyle = `rgba(${m.c},${0.28 * al})`;
    g.beginPath();
    g.arc(m.x, yy, m.r, 0, 6.28);
    g.fill();
  }
  g.restore();
}

export function velo(g, al = 0.78) {
  const v = g.createLinearGradient(0, 180, 0, 560);
  v.addColorStop(0, `rgba(6,3,14,${al})`);
  v.addColorStop(1, "rgba(6,3,14,0)");
  g.fillStyle = v;
  g.fillRect(0, 0, 1080, 580);
}

// Silueta de perfil, frente a la izquierda. El lóbulo temporal baja a la izquierda,
// el cerebelo es el bulto de atrás y abajo, y entre los dos hay una muesca.
export function trazoCerebro(g) {
  g.beginPath();
  g.moveTo(-150, 20);
  g.bezierCurveTo(-196, -10, -188, -78, -130, -118);
  g.bezierCurveTo(-70, -162, 10, -168, 78, -132);
  g.bezierCurveTo(145, -98, 188, -40, 176, 18);
  g.bezierCurveTo(168, 52, 142, 58, 124, 72);
  g.bezierCurveTo(168, 86, 184, 132, 128, 154);
  g.bezierCurveTo(86, 170, 58, 142, 54, 116);
  g.bezierCurveTo(36, 156, -24, 168, -78, 132);
  g.bezierCurveTo(-128, 100, -156, 62, -150, 20);
  g.closePath();
}

const SURCOS = [
  [[-120, -78], [-40, -28], [36, -92]],
  [[-90, -18], [0, 28], [70, -16]],
  [[-20, -120], [48, -52], [118, -78]],
  [[-60, 18], [16, 62], [86, 22]],
  [[28, -8], [96, 36], [146, 4]],
  [[-140, -8], [-70, 36], [-8, 8]],
  [[-100, -100], [-20, -70], [40, -110]],
];

export const ZONA = { habla: [-118, 8], brazo: [6, -48] };

const PIEZAS = [
  { dx: -150, dy: -70, rot: -0.22, poly: [[-250, -180], [-20, -180], [10, 20], [-90, 70], [-250, 40]] },
  { dx: -90, dy: 130, rot: 0.18, poly: [[-200, 10], [20, 0], [40, 170], [-190, 170]] },
  { dx: 40, dy: -140, rot: -0.08, poly: [[-40, -180], [150, -180], [130, 20], [-50, 30]] },
  { dx: 170, dy: -20, rot: 0.2, poly: [[60, -160], [230, -90], [220, 70], [40, 50]] },
  { dx: 120, dy: 140, rot: 0.28, poly: [[20, 40], [210, 30], [210, 180], [10, 175]] },
];

function poligono(g, pts) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  g.closePath();
}

function cuerpo(g, vivo) {
  const claro = k.mezColor("#3a1438", "#c4496a", vivo);
  const luz = k.mezColor("#6e2a58", "#ffb089", vivo);
  trazoCerebro(g);
  const gr = g.createRadialGradient(-80, -70, 20, 20, 10, 280);
  gr.addColorStop(0, luz);
  gr.addColorStop(0.45, claro);
  gr.addColorStop(1, "#1a0a22");
  g.fillStyle = gr;
  g.fill();
  g.save();
  trazoCerebro(g);
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.45;
  g.drawImage(k.manchas, -240, -180, 460, 360);
  g.restore();
  g.save();
  trazoCerebro(g);
  g.clip();
  g.lineCap = "round";
  g.lineJoin = "round";
  for (const s of SURCOS) {
    g.beginPath();
    g.moveTo(s[0][0], s[0][1]);
    g.quadraticCurveTo(s[1][0], s[1][1], s[2][0], s[2][1]);
    g.strokeStyle = "rgba(18,4,20,0.72)";
    g.lineWidth = 11;
    g.stroke();
    g.beginPath();
    g.moveTo(s[0][0], s[0][1] - 7);
    g.quadraticCurveTo(s[1][0], s[1][1] - 7, s[2][0], s[2][1] - 7);
    g.strokeStyle = `rgba(255,214,196,${0.28 + vivo * 0.25})`;
    g.lineWidth = 4;
    g.stroke();
  }
  // cerebelo, atrás y abajo, dentro de la silueta
  g.beginPath();
  g.ellipse(112, 96, 52, 36, -0.35, 0, 6.28);
  const cg = g.createRadialGradient(100, 64, 4, 118, 78, 58);
  cg.addColorStop(0, k.mezColor("#7a4060", "#ffb0a0", vivo));
  cg.addColorStop(1, "#3a1830");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.beginPath();
  g.ellipse(112, 96, 52, 36, -0.35, 0, 6.28);
  g.clip();
  g.strokeStyle = "rgba(40,8,24,0.75)";
  g.lineWidth = 3;
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(55, 96 + i * 10);
    g.lineTo(175, 88 + i * 10);
    g.stroke();
  }
  g.restore();
  const br = g.createRadialGradient(-120, -90, 10, -40, -20, 160);
  br.addColorStop(0, "rgba(255,236,220,0.42)");
  br.addColorStop(1, "rgba(255,236,220,0)");
  g.fillStyle = br;
  g.fillRect(-240, -180, 460, 360);
  g.restore();
  trazoCerebro(g);
  g.strokeStyle = `rgba(255,196,214,${0.35 + vivo * 0.35})`;
  g.lineWidth = 4;
  g.stroke();
}

function glowZona(g, p, cantidad, color, muerte) {
  const al = Math.max(0, cantidad * (1 - muerte));
  if (al < 0.02 && muerte < 0.02) return;
  const r = 78;
  const gr = g.createRadialGradient(p[0], p[1], 4, p[0], p[1], r);
  gr.addColorStop(0, `rgba(255,244,220,${0.95 * al})`);
  gr.addColorStop(0.35, `rgba(${color},${0.7 * al})`);
  gr.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = gr;
  g.beginPath();
  g.arc(p[0], p[1], r, 0, 6.28);
  g.fill();
  if (muerte > 0.02) {
    g.save();
    g.translate(p[0], p[1]);
    g.rotate(-0.6);
    g.globalAlpha = Math.min(1, muerte * 1.3);
    g.strokeStyle = "rgba(40,0,10,0.9)";
    g.lineWidth = 5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-36, -8);
    g.lineTo(-8, 6);
    g.lineTo(10, -4);
    g.lineTo(40, 14);
    g.stroke();
    g.strokeStyle = "rgba(255,60,40,0.8)";
    g.lineWidth = 2;
    g.stroke();
    g.restore();
  }
}

const REDES = [
  { a: [-160, 10], c: [-40, -120], b: [70, -20], col: "90,220,255" },
  { a: [-90, 50], c: [20, 120], b: [140, 40], col: "255,120,190" },
  { a: [-130, -40], c: [10, -10], b: [150, -60], col: "255,196,80" },
  { a: [-40, 80], c: [80, 10], b: [40, -90], col: "120,255,210" },
  { a: [20, 40], c: [120, 90], b: [160, 10], col: "190,150,255" },
];

function puntoCurva(a, c, b, u) {
  const x = (1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0];
  const y = (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1];
  return [x, y];
}

function pintaDomo(g, vivo) {
  g.beginPath();
  g.ellipse(0, -16, 172, 108, 0, 0, 6.28);
  const gr = g.createRadialGradient(-50, -60, 16, 10, -10, 180);
  gr.addColorStop(0, k.mezColor("#ffd2c6", "#ffe6d4", vivo));
  gr.addColorStop(0.5, k.mezColor("#d86a84", "#f0b0a0", vivo));
  gr.addColorStop(1, k.mezColor("#4a1834", "#7a3858", vivo));
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.28;
  g.drawImage(k.manchas, -180, -140, 360, 260);
  g.restore();
}

function pintaTemporal(g, vivo) {
  g.save();
  g.translate(-36, 58);
  g.rotate(-0.2);
  g.beginPath();
  g.ellipse(0, 0, 108, 46, 0, 0, 6.28);
  const gr = g.createRadialGradient(-20, -10, 4, 0, 0, 100);
  gr.addColorStop(0, k.mezColor("#f0b0a8", "#ffd0c4", vivo));
  gr.addColorStop(1, k.mezColor("#6a2848", "#8a4060", vivo));
  g.fillStyle = gr;
  g.fill();
  g.restore();
}

function cerebelo(g, x, y, vivo) {
  g.save();
  g.translate(x, y);
  g.rotate(-0.45);
  g.beginPath();
  g.ellipse(0, 0, 58, 40, 0, 0, 6.28);
  const gr = g.createRadialGradient(-16, -14, 4, 0, 0, 58);
  gr.addColorStop(0, k.mezColor("#e8a0b0", "#ffd0c0", vivo));
  gr.addColorStop(1, "#4a2038");
  g.fillStyle = gr;
  g.fill();
  g.save();
  g.clip();
  g.strokeStyle = "rgba(50,12,28,0.7)";
  g.lineWidth = 3;
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(-60, i * 11);
    g.lineTo(60, i * 11 - 4);
    g.stroke();
  }
  g.restore();
  g.restore();
}

function surcos(g, al) {
  if (al < 0.03) return;
  g.save();
  g.globalAlpha = al;
  g.lineCap = "round";
  g.lineWidth = 7;
  g.strokeStyle = "rgba(40,8,24,0.55)";
  for (const s of SURCOS) {
    g.beginPath();
    g.moveTo(s[0][0], s[0][1]);
    g.quadraticCurveTo(s[1][0], s[1][1], s[2][0], s[2][1]);
    g.stroke();
  }
  g.restore();
}

// cx, cy, s: centro y escala. o: t, separa, vivo, nucleo, habla, hablaOff, brazoZ, brazoOff, redes, crisis
export function cerebro(g, cx, cy, s, o = {}) {
  const t = o.t || 0;
  const vivo = o.vivo || 0;
  const separa = o.separa || 0;
  g.save();
  g.translate(cx, cy);
  const respira = 1 + 0.012 * Math.sin(t * 2.2);
  g.scale(s * respira, s * respira);
  // sombra
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath();
  g.ellipse(16, 36, 150, 36, 0, 0, 6.28);
  g.fill();
  // mitad de atrás del domo
  g.save();
  g.translate(190 * separa, -24 * separa);
  g.rotate(0.18 * separa);
  g.beginPath();
  g.rect(0, -200, 220, 400);
  g.clip();
  pintaDomo(g, vivo);
  g.restore();
  // mitad de delante
  g.save();
  g.translate(-200 * separa, -16 * separa);
  g.rotate(-0.2 * separa);
  g.beginPath();
  g.rect(-230, -200, 230, 400);
  g.clip();
  pintaDomo(g, vivo);
  g.restore();
  g.save();
  g.translate(-60 * separa, 180 * separa);
  pintaTemporal(g, vivo);
  g.restore();
  g.save();
  g.translate(160 * separa, 170 * separa);
  cerebelo(g, 108, 78, vivo);
  g.restore();
  if (separa < 0.15) {
    g.fillStyle = k.mezColor("#6a3050", "#c48898", vivo);
    k.redondo(g, 28, 70, 34, 78, 12);
    g.fill();
  }
  surcos(g, 1 - separa);
  // brillo de volumen, solo cuando está entero
  if (separa < 0.4) {
    const br = g.createRadialGradient(-90, -80, 8, -20, -10, 140);
    br.addColorStop(0, `rgba(255,236,220,${0.28 * (1 - separa)})`);
    br.addColorStop(1, "rgba(255,236,220,0)");
    g.fillStyle = br;
    g.beginPath();
    g.ellipse(-20, -20, 120, 90, -0.3, 0, 6.28);
    g.fill();
  }
  g.save();
  g.globalCompositeOperation = "lighter";
  glowZona(g, ZONA.habla, o.habla || 0, "255,170,70", o.hablaOff || 0);
  glowZona(g, ZONA.brazo, o.brazoZ || 0, "90,210,255", o.brazoOff || 0);
  const nucleo = o.nucleo || 0;
  if (nucleo > 0.02) {
    const p = ZONA.habla;
    const pul = 0.88 + 0.12 * Math.sin(t * 4.2);
    const rr = 70;
    const ng = g.createRadialGradient(p[0] - 8, p[1] - 8, 4, p[0], p[1], rr);
    ng.addColorStop(0, `rgba(255,248,220,${0.95 * nucleo * pul})`);
    ng.addColorStop(0.45, `rgba(255,150,40,${0.8 * nucleo})`);
    ng.addColorStop(1, "rgba(255,120,20,0)");
    g.fillStyle = ng;
    g.beginPath();
    g.arc(p[0], p[1], rr, 0, 6.28);
    g.fill();
  }
  const redes = o.redes || 0;
  const crisis = o.crisis || 0;
  if (redes > 0.02) {
    REDES.forEach((r, i) => {
      const fase = (1 - crisis) * (0.28 + 0.72 * (0.5 + 0.5 * Math.sin(t * 1.3 + i * 1.4)));
      const al = redes * Math.min(1, fase + crisis);
      g.strokeStyle = `rgba(${crisis > 0.2 ? "255,240,230" : r.col},${0.15 + 0.85 * al})`;
      g.lineWidth = 6 + crisis * 6;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(r.a[0], r.a[1]);
      g.quadraticCurveTo(r.c[0], r.c[1], r.b[0], r.b[1]);
      g.stroke();
      const u = ((separa > 0 ? 0 : t) * 0.28 + i * 0.17) % 1;
      const q = puntoCurva(r.a, r.c, r.b, u);
      k.brillo(g, q[0], q[1], 28, "blanca", al * 0.8);
    });
  }
  g.restore();
  if ((o.crisis || 0) > 0.02) {
    g.strokeStyle = `rgba(255,70,60,${0.7 * o.crisis})`;
    g.lineWidth = 14;
    g.beginPath();
    g.ellipse(0, -10, 175, 145, 0, 0, 6.28);
    g.stroke();
  }
  g.restore();
}

export function zonaPantalla(cx, cy, s, nombre) {
  const p = ZONA[nombre];
  return [cx + p[0] * s, cy + p[1] * s];
}

// Persona de frente. x,y = centro de la cabeza. alto = de la cabeza a los pies.
// o: t, anda (0-1), boca (0-1), brazo (0 caído suave / el otro lado sostiene; 0 a 1 cae), al
export function persona(g, x, y, alto, o = {}) {
  const t = o.t || 0;
  const anda = o.anda || 0;
  const boca = o.boca || 0;
  const brazo = o.brazo ?? 0.15;
  const paso = Math.sin(t * 7.2) * anda;
  const r = alto * 0.105;
  g.save();
  // sombra en el suelo
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(x, y + alto * 0.98, alto * 0.22, alto * 0.045, 0, 0, 6.28);
  g.fill();
  // piernas
  const caderaY = y + alto * 0.48;
  pierna(g, x - alto * 0.07, caderaY, alto * 0.46, paso);
  pierna(g, x + alto * 0.07, caderaY, alto * 0.46, -paso);
  // torso
  const torso = g.createLinearGradient(x - 80, y, x + 80, y + alto * 0.5);
  torso.addColorStop(0, "#7cf0e2");
  torso.addColorStop(0.4, "#14b8a6");
  torso.addColorStop(1, "#0c6e68");
  g.fillStyle = torso;
  k.redondo(g, x - alto * 0.16, y + r * 0.95, alto * 0.32, alto * 0.36, 36);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)";
  k.redondo(g, x - alto * 0.1, y + r * 1.15, alto * 0.1, alto * 0.16, 16);
  g.fill();
  // cuello
  g.fillStyle = "#e7a784";
  k.redondo(g, x - 16, y + r * 0.72, 32, r * 0.7, 10);
  g.fill();
  // cabeza
  const piel = g.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
  piel.addColorStop(0, "#ffd3b6");
  piel.addColorStop(0.7, "#f0b08e");
  piel.addColorStop(1, "#d4896c");
  g.fillStyle = piel;
  g.beginPath();
  g.arc(x, y, r, 0, 6.28);
  g.fill();
  // pelo
  g.fillStyle = "#2a1814";
  g.beginPath();
  g.arc(x, y - r * 0.08, r, Math.PI * 1.05, Math.PI * 1.95);
  g.quadraticCurveTo(x + r * 0.2, y - r * 0.1, x - r * 0.85, y + r * 0.15);
  g.fill();
  g.beginPath();
  g.ellipse(x - r * 0.1, y - r * 0.72, r * 0.72, r * 0.42, -0.1, Math.PI, 0);
  g.fill();
  // ojos
  const parpadeo = Math.sin(t * 1.7) > 0.97 ? 0.15 : 1;
  ojo(g, x - r * 0.32, y - r * 0.02, r, parpadeo);
  ojo(g, x + r * 0.28, y - r * 0.02, r, parpadeo);
  // boca
  g.strokeStyle = "#9a4450";
  g.fillStyle = "#6e2434";
  g.lineWidth = 3;
  g.beginPath();
  const by = y + r * 0.42;
  g.ellipse(x, by, r * 0.22, r * (0.06 + boca * 0.12), 0, 0, Math.PI);
  if (boca > 0.25) g.fill();
  else g.stroke();
  // brazos
  brazoDibuja(g, x, y, alto, -1, 0.25 + paso * 0.3);
  brazoDibuja(g, x, y, alto, 1, brazo);
  g.restore();
}

// Tumbada, cabeza a la izquierda. x,y es el centro de la cabeza.
export function personaTumbada(g, x, y, largo) {
  const r = 64;
  g.save();
  // almohada
  g.fillStyle = "#f2d2b0";
  k.redondo(g, x - 90, y - 20, 150, 90, 28);
  g.fill();
  // piernas
  g.fillStyle = "#2a3a68";
  k.redondo(g, x + largo * 0.42, y + 10, largo * 0.4, 46, 18);
  g.fill();
  g.fillStyle = "#f4f1ea";
  k.redondo(g, x + largo * 0.78, y + 18, 54, 28, 8);
  g.fill();
  // torso
  const torso = g.createLinearGradient(x, y, x + largo * 0.45, y + 40);
  torso.addColorStop(0, "#7cf0e2");
  torso.addColorStop(1, "#0e7a72");
  g.fillStyle = torso;
  k.redondo(g, x + 40, y - 10, largo * 0.46, 86, 30);
  g.fill();
  // brazo encima
  g.fillStyle = "#14b8a6";
  k.redondo(g, x + 70, y + 20, largo * 0.28, 32, 14);
  g.fill();
  g.fillStyle = "#f0b08e";
  g.beginPath();
  g.arc(x + 70 + largo * 0.28, y + 36, 16, 0, 6.28);
  g.fill();
  // cabeza
  const piel = g.createRadialGradient(x - 16, y - 10, 8, x, y + 16, r);
  piel.addColorStop(0, "#ffd3b6");
  piel.addColorStop(1, "#e09878");
  g.fillStyle = piel;
  g.beginPath();
  g.arc(x, y + 16, r, 0, 6.28);
  g.fill();
  g.fillStyle = "#2a1814";
  g.beginPath();
  g.arc(x - 6, y - 4, r * 0.92, Math.PI * 0.85, Math.PI * 1.7);
  g.fill();
  // ojos cerrados
  g.strokeStyle = "#6a4038";
  g.lineWidth = 4;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x + 16, y + 10);
  g.quadraticCurveTo(x + 30, y + 16, x + 44, y + 10);
  g.moveTo(x + 16, y + 28);
  g.quadraticCurveTo(x + 30, y + 34, x + 44, y + 28);
  g.stroke();
  g.restore();
}

function ojo(g, x, y, r, abierto) {
  g.save();
  g.translate(x, y);
  g.scale(1, abierto);
  g.fillStyle = "#fff";
  g.beginPath();
  g.ellipse(0, 0, r * 0.16, r * 0.11, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#1c2438";
  g.beginPath();
  g.arc(r * 0.02, 0, r * 0.06, 0, 6.28);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(r * 0.04, -r * 0.02, r * 0.02, 0, 6.28);
  g.fill();
  g.restore();
}

function pierna(g, x, y, largo, paso) {
  g.save();
  g.translate(x, y);
  g.rotate(paso * 0.45);
  const w = 34;
  const gr = g.createLinearGradient(-w, 0, w, 0);
  gr.addColorStop(0, "#1a2444");
  gr.addColorStop(0.5, "#31406e");
  gr.addColorStop(1, "#161c30");
  g.fillStyle = gr;
  k.redondo(g, -w / 2, 0, w, largo, 16);
  g.fill();
  g.fillStyle = "#f4f1ea";
  k.redondo(g, -w / 2 - 4, largo - 16, w + 14, 22, 8);
  g.fill();
  g.fillStyle = "#c9c2b6";
  g.fillRect(-w / 2 - 4, largo + 2, w + 14, 6);
  g.restore();
}

function anguloBrazo(caida) {
  return -2.25 + caida * 2.55;
}
function anguloAnte(caida) {
  return -0.55 + caida * 1.35;
}

function brazoDibuja(g, x, y, alto, lado, caida) {
  const hombroX = x + lado * alto * 0.15;
  const hombroY = y + alto * 0.2;
  const ang = lado < 0 ? 0.45 : anguloBrazo(caida);
  const largo = alto * 0.34;
  g.save();
  g.translate(hombroX, hombroY);
  g.rotate(ang);
  const gr = g.createLinearGradient(-16, 0, 16, 0);
  gr.addColorStop(0, "#0e8f86");
  gr.addColorStop(0.5, "#2ad4c4");
  gr.addColorStop(1, "#0a5c58");
  g.fillStyle = gr;
  k.redondo(g, -15, 0, 30, largo * 0.58, 14);
  g.fill();
  g.translate(0, largo * 0.55);
  g.rotate(lado < 0 ? 0.3 : anguloAnte(caida));
  g.fillStyle = "#f0b08e";
  k.redondo(g, -13, 0, 26, largo * 0.46, 12);
  g.fill();
  g.beginPath();
  g.arc(0, largo * 0.48, 16, 0, 6.28);
  g.fill();
  g.restore();
}

export function mano(x, y, alto, caida) {
  const hombroX = x + alto * 0.15;
  const hombroY = y + alto * 0.2;
  const largo = alto * 0.34;
  const a1 = anguloBrazo(caida);
  const a2 = a1 + anguloAnte(caida);
  const codo = largo * 0.55;
  const ante = largo * 0.48;
  const ex = hombroX + Math.sin(a1) * codo;
  const ey = hombroY + Math.cos(a1) * codo;
  return [ex + Math.sin(a2) * ante, ey + Math.cos(a2) * ante];
}

export function vaso(g, x, y, s, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha = al;
  g.fillStyle = "rgba(186,230,240,0.35)";
  k.redondo(g, -28, -50, 56, 78, 8);
  g.fill();
  g.strokeStyle = "rgba(230,250,255,0.8)";
  g.lineWidth = 3;
  g.stroke();
  g.fillStyle = "rgba(255,176,70,0.85)";
  k.redondo(g, -24, -8, 48, 32, 6);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-18, -46, 8, 60);
  g.restore();
}

export function sofa(g, x, y, w) {
  g.save();
  g.translate(x, y);
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  gr.addColorStop(0, "#6d2a4a");
  gr.addColorStop(0.5, "#b84b6e");
  gr.addColorStop(1, "#5a203c");
  g.fillStyle = gr;
  k.redondo(g, -w / 2, -40, w, 150, 36);
  g.fill();
  g.fillStyle = "#3d1428";
  k.redondo(g, -w / 2 - 18, -90, 50, 160, 18);
  g.fill();
  k.redondo(g, w / 2 - 32, -90, 50, 160, 18);
  g.fill();
  g.fillStyle = "#f2d2b0";
  k.redondo(g, -w / 2 + 40, -100, 120, 70, 20);
  g.fill();
  g.restore();
}

export function botella(g, x, y, h, t) {
  const w = h * 0.38;
  const slosh = Math.sin(t * 3) * 4;
  g.save();
  g.translate(x, y);
  // tapa
  g.fillStyle = "#1d6fe0";
  k.redondo(g, -w * 0.22, -h * 0.52, w * 0.44, h * 0.1, 6);
  g.fill();
  g.fillStyle = "#8ec2ff";
  g.fillRect(-w * 0.16, -h * 0.5, w * 0.1, h * 0.06);
  // cuerpo de vidrio
  g.fillStyle = "rgba(190,230,245,0.22)";
  k.redondo(g, -w / 2, -h * 0.38, w, h * 0.9, 18);
  g.fill();
  g.strokeStyle = "rgba(220,245,255,0.75)";
  g.lineWidth = 3;
  g.stroke();
  // agua
  g.save();
  k.redondo(g, -w / 2, -h * 0.38, w, h * 0.9, 18);
  g.clip();
  g.fillStyle = "rgba(70,170,230,0.55)";
  g.beginPath();
  g.moveTo(-w, h * 0.15 + slosh);
  g.quadraticCurveTo(0, h * 0.08 - slosh, w, h * 0.15 + slosh);
  g.lineTo(w, h);
  g.lineTo(-w, h);
  g.fill();
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.55)";
  k.redondo(g, -w * 0.32, -h * 0.28, w * 0.12, h * 0.55, 8);
  g.fill();
  g.restore();
}

export function llamaCalor(g, x, y, radio, t, fase, al = 1) {
  if (al < 0.02) return;
  const pul = 0.9 + 0.1 * Math.sin(t * 6 + fase);
  k.brillo(g, x, y, radio * 3.2 * pul, "fuego", 0.55 * al);
  g.save();
  g.globalCompositeOperation = "lighter";
  const gr = g.createRadialGradient(x - radio * 0.2, y - radio * 0.2, 4, x, y, radio);
  gr.addColorStop(0, `rgba(255,250,230,${al})`);
  gr.addColorStop(0.4, `rgba(255,170,50,${0.95 * al})`);
  gr.addColorStop(1, "rgba(255,80,20,0)");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(x, y, radio * pul, 0, 6.28);
  g.fill();
  g.restore();
}

export function factura(g, x, y, h, al = 1) {
  if (al < 0.02 || h < 4) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(x, y);
  const w = 280;
  g.fillStyle = "#f6ecd2";
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 12;
  k.redondo(g, -w / 2, 0, w, h, 12);
  g.fill();
  g.shadowColor = "transparent";
  g.fillStyle = "#1c140c";
  const n = Math.max(1, Math.floor(h / 28));
  for (let i = 0; i < n; i++) {
    const yy = 28 + i * 26;
    if (yy > h - 20) break;
    g.globalAlpha = al * (i === 2 ? 1 : 0.45);
    g.fillStyle = i === 2 ? "#e07a14" : "#1c140c";
    g.fillRect(-w / 2 + 28, yy, i === 2 ? 180 : 140 - (i % 3) * 18, 8);
  }
  g.restore();
}

export function casa(g, t, acerca, vacio) {
  fondo(g, "#141833", "#070814");
  // luna
  g.fillStyle = "#f4e7c4";
  g.beginPath();
  g.arc(220, 640, 54, 0, 6.28);
  g.fill();
  g.fillStyle = "#141833";
  g.beginPath();
  g.arc(240, 624, 44, 0, 6.28);
  g.fill();
  motas(g, t, 0.6);
  const z = k.mez(1, 1.28, acerca);
  g.save();
  g.translate(540, 1100);
  g.scale(z, z);
  g.translate(-540, -1100);
  // farola
  g.fillStyle = "#2a3148";
  g.fillRect(150, 980, 16, 420);
  k.brillo(g, 158, 960, 180, "amarilla", 0.7);
  g.fillStyle = "#ffe1a0";
  g.beginPath();
  g.arc(158, 960, 22, 0, 6.28);
  g.fill();
  // casa
  g.fillStyle = "#4a2848";
  g.beginPath();
  g.moveTo(250, 860);
  g.lineTo(540, 620);
  g.lineTo(830, 860);
  g.closePath();
  g.fill();
  g.fillStyle = "#f0d2a4";
  g.beginPath();
  g.moveTo(300, 820);
  g.lineTo(540, 660);
  g.lineTo(780, 820);
  g.closePath();
  g.fill();
  const pared = g.createLinearGradient(280, 800, 820, 1400);
  pared.addColorStop(0, "#31457a");
  pared.addColorStop(1, "#1a2448");
  g.fillStyle = pared;
  g.fillRect(300, 840, 480, 520);
  // ventanas oscuras
  ventana(g, 390, 960, 0.08 + (1 - vacio) * 0.05);
  ventana(g, 690, 960, 0.07);
  ventana(g, 690, 1140, 0.06);
  // recibidor
  const luz = 0.35 + acerca * 0.65;
  ventana(g, 390, 1140, luz);
  // puerta
  g.fillStyle = "#6b3418";
  k.redondo(g, 490, 1120, 110, 230, 10);
  g.fill();
  g.fillStyle = "#e8c27a";
  g.beginPath();
  g.arc(575, 1240, 7, 0, 6.28);
  g.fill();
  const puerta = g.createRadialGradient(545, 1220, 10, 545, 1240, 160);
  puerta.addColorStop(0, `rgba(255,190,90,${0.55 * luz})`);
  puerta.addColorStop(1, "rgba(255,190,90,0)");
  g.fillStyle = puerta;
  g.fillRect(420, 1080, 250, 320);
  // planta
  g.fillStyle = "#1e6b45";
  g.beginPath();
  g.ellipse(860, 1320, 46, 18, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#27a35a";
  g.beginPath();
  g.ellipse(840, 1270, 28, 40, -0.4, 0, 6.28);
  g.fill();
  g.beginPath();
  g.ellipse(880, 1260, 26, 44, 0.5, 0, 6.28);
  g.fill();
  // charco de luz en la acera
  g.fillStyle = `rgba(255,186,90,${0.28 * luz})`;
  g.beginPath();
  g.ellipse(545, 1480, 150, 28, 0, 0, 6.28);
  g.fill();
  g.restore();
}

function ventana(g, x, y, luz) {
  g.fillStyle = luz > 0.3 ? "#ffd089" : "#0c1224";
  k.redondo(g, x, y, 96, 78, 8);
  g.fill();
  if (luz > 0.3) {
    k.brillo(g, x + 48, y + 36, 200, "amarilla", luz);
    g.fillStyle = "rgba(255,220,150,0.35)";
    g.fillRect(x + 10, y + 10, 30, 50);
  } else {
    g.strokeStyle = "rgba(180,200,230,0.25)";
    g.lineWidth = 3;
    g.beginPath();
    g.moveTo(x + 48, y);
    g.lineTo(x + 48, y + 78);
    g.moveTo(x, y + 39);
    g.lineTo(x + 96, y + 39);
    g.stroke();
  }
}

export function libro(g, x, y, abierto) {
  g.save();
  g.translate(x, y);
  const w = 340 * (0.7 + 0.3 * abierto);
  g.fillStyle = "#6b2a22";
  k.redondo(g, -w - 16, -40, w * 2 + 32, 460, 18);
  g.fill();
  g.fillStyle = "#f3e2c2";
  k.redondo(g, -w, -20, w - 8, 420, 8);
  g.fill();
  k.redondo(g, 8, -20, w - 8, 420, 8);
  g.fill();
  g.fillStyle = "rgba(90,50,30,0.35)";
  g.fillRect(-6, -20, 12, 420);
  // lomo
  g.fillStyle = "#4a1c18";
  g.fillRect(-24, -40, 48, 460);
  g.restore();
}
