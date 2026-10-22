// El campo al atardecer, en 3D (metros; el suelo en y = 0, la cámara mira hacia +z): el cielo con el sol bajo delante,
// los árboles lejos, el suelo y las matas de hierba alta que pasan junto a la cámara. Y tú, de cuerpo entero, de pie en
// el campo. campo(g, t, cam, ...) dibuja todo; lo que haya en el mundo (tú, tu perro) se le pasa en «cosas» para que
// la hierba lo tape o no según lo lejos que esté.
import * as k from "#kit";

const { azar, lienzo, mez, tramo, suave } = k;

// ---------------------------------------------------------------- la cámara
export const camara = (pos, mira) => k.mira(pos, mira);
// Dónde cae en pantalla un punto del mundo, y a qué escala sale algo (px por metro).
export const pon = (cam, X) => { const p = k.proyecta(cam, X); return p && { ...p, s: k.F / p.z }; };

// ---------------------------------------------------------------- lo de lejos
// El horizonte en pantalla: dónde cae un punto muy lejano delante de la cámara.
function horizonte(cam) {
  const p = k.proyecta(cam, [cam.p[0] + cam.e.f[0] * 1e5, 0, cam.p[2] + cam.e.f[2] * 1e5]);
  return p ? p.y : -1e4;
}
const ARBOLADA = (() => {
  // una franja de árboles lejanos (2400 × 300 px), oscura a contraluz, con el borde dorado
  const l = lienzo(2400, 300), c = l.getContext("2d"), az = azar(4040);
  c.fillStyle = "#5a6a48";
  c.beginPath(); c.moveTo(0, 300);
  for (let x = 0; x <= 2400; x += 30) c.lineTo(x, 170 - Math.abs(Math.sin(x / 160)) * 60 - az() * 40 - (Math.sin(x / 47) > 0.6 ? 50 : 0));
  c.lineTo(2400, 300); c.closePath(); c.fill();
  c.globalCompositeOperation = "source-atop";
  const lg = c.createLinearGradient(0, 60, 0, 300); lg.addColorStop(0, "rgba(255,200,130,0.5)"); lg.addColorStop(0.5, "rgba(255,200,130,0.1)"); lg.addColorStop(1, "rgba(60,70,40,0.4)");
  c.fillStyle = lg; c.fillRect(0, 0, 2400, 300);
  return l;
})();
// La hierba lejana, una textura de briznas finas que se repite.
const PASTO = k.ruido(512, 4242, 120, 2, "lineas");

// noche: de 0 (la tarde) a 1 (de noche, con la luna).
function cielo(g, cam, noche) {
  const yh = horizonte(cam);
  const top = Math.min(yh - 1600, -200);
  const cg = g.createLinearGradient(0, top, 0, yh);
  cg.addColorStop(0, k.mezColor("#3f6fb8", "#060a22", noche)); cg.addColorStop(0.55, k.mezColor("#8fb2dc", "#101a44", noche)); cg.addColorStop(0.85, k.mezColor("#f2c890", "#1c2858", noche)); cg.addColorStop(1, k.mezColor("#ffcf84", "#24305e", noche));
  g.fillStyle = cg; g.fillRect(0, Math.min(0, top), 1080, Math.max(0, yh - Math.min(0, top)) + 2);
  // el sol bajo, delante, un poco a la izquierda; de noche, la luna arriba a la derecha y estrellas
  const sol = k.proyecta(cam, [cam.p[0] - 1500, 400, cam.p[2] + 1e4]);
  if (sol && noche < 1) { k.brillo(g, sol.x, sol.y, 1500, "255,200,120", 0.75 * (1 - noche)); k.brillo(g, sol.x, sol.y, 380, "255,240,200", 0.9 * (1 - noche)); }
  if (noche > 0) {
    const az = azar(12);
    for (let i = 0; i < 70; i++) { const x = az() * 1080, y = yh - 200 - az() * 2000; g.fillStyle = `rgba(255,255,255,${(0.35 + az() * 0.6) * noche})`; g.beginPath(); g.arc(x, y, 1.5 + az() * 2.5, 0, 6.2832); g.fill(); }
    const luna = k.proyecta(cam, [cam.p[0] + 3000, 3500, cam.p[2] + 1e4]);
    if (luna) { k.brillo(g, luna.x, luna.y, 420, "200,220,255", 0.8 * noche); g.fillStyle = `rgba(244,242,230,${noche})`; g.beginPath(); g.arc(luna.x, luna.y, 46, 0, 6.2832); g.fill(); }
  }
  // los árboles
  g.save(); g.globalAlpha = 1 - 0.6 * noche;
  const ancho = 2400 * (k.F / 1400);
  g.drawImage(ARBOLADA, 540 - ancho / 2 - cam.p[0] * 2, yh - 300 * 0.9, ancho, 300);
  g.restore();
  return yh;
}
// El suelo hasta el borde de abajo: dorado y verde, más claro lejos (la luz rasante).
function suelo(g, cam, yh, noche) {
  const sg = g.createLinearGradient(0, yh, 0, yh + 1200);
  sg.addColorStop(0, k.mezColor("#c8b062", "#1c2a2a", noche)); sg.addColorStop(0.15, k.mezColor("#8a9a40", "#14221e", noche)); sg.addColorStop(1, k.mezColor("#4a7428", "#0a140e", noche));
  g.fillStyle = sg; g.fillRect(0, yh - 2, 1080, Math.max(0, 1922 - yh + 2));
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18;
  g.drawImage(PASTO, 0, yh, 1080, Math.max(1, 1920 - yh)); g.restore();
}

// ---------------------------------------------------------------- las matas de hierba
const MATAS = (() => {
  const az = azar(777), l = [];
  for (let i = 0; i < 2600; i++) {
    const z = Math.pow(az(), 1.7) * 60 - 8, x = (az() - 0.5) * (8 + Math.max(0, z) * 2.2);
    l.push({ x, z, h: 0.25 + az() * 0.3, n: 4 + (az() * 5 | 0), sem: az() * 1000, tono: az() });
  }
  return l;
})();
function mata(g, t, p, m, noche, viento) {
  const s = p.s, az = azar(m.sem | 0);
  g.lineCap = "round";
  for (let i = 0; i < m.n; i++) {
    const h = m.h * (0.6 + az() * 0.5) * s, dx = (az() - 0.5) * 0.12 * s, curva = (az() - 0.5) * 0.5 + Math.sin(t * 1.6 + m.sem + i) * 0.06 * viento;
    const x0 = p.x + dx, y0 = p.y;
    const col = k.mezRgb(m.tono < 0.5 ? "176,170,80" : "120,150,60", "30,50,40", noche);
    g.strokeStyle = `rgb(${col})`; g.lineWidth = Math.min(12, Math.max(1, 0.006 * s));
    g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + curva * h * 0.3, y0 - h * 0.6, x0 + curva * h, y0 - h); g.stroke();
    // el borde dorado a contraluz
    if (noche < 0.9) { g.strokeStyle = `rgba(255,214,140,${0.45 * (1 - noche)})`; g.lineWidth = Math.min(5, Math.max(0.6, 0.0025 * s)); g.stroke(); }
  }
}

// ---------------------------------------------------------------- árboles sueltos por el campo
const ARBOL = (() => {
  // un árbol de 8 m: 300 × 400 px (37,5 px por metro), con el pie en (150, 400)
  const l = lienzo(300, 400), c = l.getContext("2d"), az = azar(321);
  c.fillStyle = "#3a2a1a"; c.fillRect(140, 220, 20, 180);
  for (let i = 0; i < 18; i++) {
    const x = 150 + (az() - 0.5) * 180, y = 150 + (az() - 0.5) * 150, r = 40 + az() * 50;
    const gr = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gr.addColorStop(0, "#9ab050"); gr.addColorStop(1, "#3a5226");
    c.fillStyle = gr; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
  }
  return l;
})();
const ARBOLES_CAMPO = (() => { const az = azar(99), l = []; for (let i = 0; i < 26; i++) { const z = 40 + az() * 900; l.push([(az() - 0.5) * z * 1.3 + (az() < 0.5 ? -20 : 20), 0, z, 0.8 + az() * 0.5]); } return l; })();

// ---------------------------------------------------------------- tú
// De pie, de frente: 1,75 m. Sprite de 0,5 px por mm (875 px), con los brazos aparte para moverlos.
const ESC_P = 500; // px por metro en el sprite
const CUERPO_P = (() => {
  const l = lienzo(400, 900), c = l.getContext("2d");
  c.translate(200, 880); // los pies
  // las zapatillas
  for (const s of [-1, 1]) { const zg = c.createLinearGradient(0, -40, 0, 0); zg.addColorStop(0, "#f4f4f4"); zg.addColorStop(1, "#b8b8b8"); c.fillStyle = zg; k.redondo(c, s * 52 - 34, -42, 68, 42, 18); c.fill(); c.fillStyle = "#d24a3a"; c.fillRect(s * 52 - 34, -10, 68, 10); }
  // las piernas (vaqueros)
  for (const s of [-1, 1]) {
    c.beginPath(); c.moveTo(s * 8, -440); c.lineTo(s * 78, -440); c.lineTo(s * 74, -40); c.lineTo(s * 26, -40); c.closePath();
    const lg = c.createLinearGradient(s * 8, 0, s * 78, 0); lg.addColorStop(0, "#1f3f7a"); lg.addColorStop(0.5, "#3d6cc0"); lg.addColorStop(1, "#16305e");
    c.fillStyle = lg; c.fill();
  }
  // el jersey rojo
  c.beginPath(); c.moveTo(-95, -760); c.bezierCurveTo(-110, -700, -100, -560, -92, -420); c.quadraticCurveTo(0, -405, 92, -420); c.bezierCurveTo(100, -560, 110, -700, 95, -760); c.quadraticCurveTo(0, -790, -95, -760); c.closePath();
  const jg = c.createLinearGradient(-100, 0, 100, 0); jg.addColorStop(0, "#8a1a1e"); jg.addColorStop(0.4, "#d8343a"); jg.addColorStop(1, "#7a1418");
  c.fillStyle = jg; c.fill();
  // el cuello y la cabeza
  c.fillStyle = "#c88a6a"; c.fillRect(-22, -800, 44, 40);
  c.fillStyle = "#3a2214"; c.beginPath(); c.ellipse(0, -858, 60, 66, 0, 0, 6.2832); c.fill();
  const fg = c.createRadialGradient(-12, -850, 8, 0, -845, 64); fg.addColorStop(0, "#f4c8a8"); fg.addColorStop(1, "#b8785a");
  c.fillStyle = fg; c.beginPath(); c.ellipse(0, -838, 50, 60, 0, 0, 6.2832); c.fill();
  c.fillStyle = "#4a2c1a"; c.beginPath(); c.moveTo(-58, -850); c.bezierCurveTo(-52, -920, 52, -925, 60, -855); c.bezierCurveTo(30, -880, -10, -870, -58, -850); c.fill();
  c.fillStyle = "#2a1a10"; for (const s of [-1, 1]) { c.beginPath(); c.arc(s * 20, -840, 6, 0, 6.2832); c.fill(); }
  c.strokeStyle = "#8a3a30"; c.lineWidth = 5; c.lineCap = "round"; c.beginPath(); c.moveTo(-18, -805); c.quadraticCurveTo(0, -795, 18, -805); c.stroke();
  // la luz del sol de delante (le da de frente: un poco más claro)
  return l;
})();
// Tú en el mundo, con los pies en P (x, 0, z). brazos: 0 colgando, 1 saludando con los dos brazos; movil: de 0 a 1,
// sostienes el móvil con la linterna hacia delante; agacha: de 0 a 1, te agachas (para recibir a tu perro).
export function tu(g, t, cam, P, { brazos = 0, movil = 0, agacha = 0, noche = 0 } = {}) {
  const p = pon(cam, P); if (!p) return;
  const s = p.s / ESC_P;
  g.save(); g.translate(p.x, p.y); g.scale(s, s * (1 - 0.25 * agacha));
  // los brazos: del hombro (±95, -750) a la mano
  const brazo = (lado) => {
    const sw = Math.sin(t * 9 + (lado > 0 ? 0 : 1.2));
    const ang = mez(0.12, 2.6 + 0.35 * sw, brazos) * lado; // 0: cuelga; 2.6 rad: arriba
    const largo = 360, mx = lado * 95 + Math.sin(ang) * largo, my = -750 + Math.cos(ang) * largo;
    const fx = mez(mx, lado * 40, movil * (lado < 0 ? 1 : 0)), fy = mez(my, -560, movil * (lado < 0 ? 1 : 0));
    g.strokeStyle = "#b82a30"; g.lineWidth = 46; g.lineCap = "round";
    g.beginPath(); g.moveTo(lado * 92, -740); g.lineTo(fx, fy); g.stroke();
    g.fillStyle = "#e8b090"; g.beginPath(); g.arc(fx, fy, 24, 0, 6.2832); g.fill();
    return [fx, fy];
  };
  g.drawImage(CUERPO_P, -200, -880);
  brazo(1); const [mx, my] = brazo(-1);
  if (movil > 0.01) { g.fillStyle = "#222"; k.redondo(g, mx - 22, my - 40, 44, 70, 8); g.fill(); }
  if (noche > 0.01) { g.fillStyle = `rgba(4,8,20,${0.85 * noche})`; g.globalCompositeOperation = "source-atop"; g.fillRect(-300, -1000, 600, 1100); g.globalCompositeOperation = "source-over"; }
  g.restore();
  // la linterna del móvil
  if (movil > 0.01) k.brillo(g, p.x + mx * s, p.y + my * s, 260 * s * 2, "255,250,230", movil);
  return { x: p.x, y: p.y, s };
}

// ---------------------------------------------------------------- todo junto
// cosas: [{ X: [x, y, z] (dónde está, para ordenarlo con la hierba), dibuja() }]. borroso: px de desenfoque de todo
// lo que está más lejos que «nitido» metros (lo que ve tu perro). hierba: de 0 a 1.
const CAPA = lienzo(1080, 1920);
export function campo(g, t, cam, { cosas = [], noche = 0, borroso = 0, nitido = 1.2, hierba = 1, viento = 1, delante = null } = {}) {
  const c = borroso > 0.3 ? CAPA.getContext("2d") : g;
  if (c !== g) { c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = "none"; c.globalCompositeOperation = "source-over"; }
  const yh = cielo(c, cam, noche);
  suelo(c, cam, yh, noche);
  // la hierba y las cosas, de lejos a cerca; lo que está más cerca que «nitido» se dibuja después del desenfoque
  const lista = [];
  if (hierba > 0) for (const m of MATAS) {
    const X = [m.x, 0, m.z];
    const p = pon(cam, X); if (!p || p.x < -200 || p.x > 1280 || p.y < -100 || p.y > 2300) continue;
    lista.push({ z: p.z, dibuja: (cc) => { cc.save(); cc.globalAlpha *= hierba; mata(cc, t, p, m, noche, viento); cc.restore(); } });
  }
  for (const o of cosas) { const p = k.proyecta(cam, o.X); if (p) lista.push({ z: p.z, dibuja: o.dibuja }); }
  for (const A of ARBOLES_CAMPO) {
    const p = pon(cam, A); if (!p || p.x < -600 || p.x > 1700) continue;
    const h = 8 * A[3] * p.s;
    lista.push({ z: p.z, dibuja: (cc) => { cc.save(); cc.globalAlpha *= 1 - 0.7 * noche; cc.drawImage(ARBOL, p.x - h * 0.375, p.y - h, h * 0.75, h); cc.restore(); } });
  }
  lista.sort((a, b) => b.z - a.z);
  let i = 0;
  if (c !== g) {
    for (; i < lista.length && lista[i].z > nitido; i++) lista[i].dibuja(c);
    g.save(); g.filter = `blur(${borroso.toFixed(1)}px)`; g.drawImage(CAPA, -borroso * 2, -borroso * 2, 1080 + borroso * 4, 1920 + borroso * 4); g.restore();
  }
  for (; i < lista.length; i++) lista[i].dibuja(g);
  // la luz de la tarde por encima de todo
  if (noche < 1) {
    g.save(); g.globalCompositeOperation = "soft-light";
    const lg = g.createRadialGradient(400, yh, 50, 400, yh, 1600); lg.addColorStop(0, `rgba(255,200,120,${0.5 * (1 - noche)})`); lg.addColorStop(1, "rgba(0,0,0,0.1)");
    g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920); g.restore();
  }
  return yh;
}
