// Lo que comparten los planos: una gasolinera de noche vista de lado, que se puede ver en corte (como con rayos X).
// El tanque enterrado con su bomba, el surtidor con su pantalla, la manguera, la pistola (que se vuelve de cristal y
// enseña lo de dentro: el estrechamiento, el tubito de la punta, la membrana, el muelle y la válvula) y el coche rojo
// con su cuello de llenado, su depósito y su filtro de carbón.
// Todo en 2D, en milímetros del mundo (el suelo en y = 0, y hacia abajo); vista() pone la cámara.
import * as k from "#kit";

const { azar, suave: su, tramo: tr, mez, redondo } = k;

// ---------------------------------------------------------------- colores
export const GASOLINA = "255,176,30", GAS_CLARO = "255,226,120", AIRE = "200,240,255", VAPOR = "90,170,255", VACIO = "170,90,255", ROJO = "255,50,50";

// ---------------------------------------------------------------- la cámara 2D
// Mira al punto (cx, cy) del mundo con zoom Z (px por mm): lo que está en (cx, cy) sale en el centro de la pantalla.
let Zact = 1;
export function vista(g, Z, cx, cy) { Zact = Z; g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
const px = (n) => n / Zact; // n píxeles de pantalla, en mm del mundo
// Una cámara que pasa por claves [t, [Z, cx, cy]] sin tirones (el zoom, en log, para que se aleje con ritmo parejo).
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(claves.map(([t, c]) => [t, c[1]])), Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
// De una cámara a otra con u (0 a 1), el zoom en log.
export const mezCam = (a, b, u) => [Math.exp(mez(Math.log(a[0]), Math.log(b[0]), u)), mez(a[1], b[1], u), mez(a[2], b[2], u)];

// ---------------------------------------------------------------- la geometría
export const BOCA = { x: 750, y: -850 };                 // la boca del depósito, en el costado del coche
const A45 = Math.PI / 4, C45 = Math.cos(A45), S45 = Math.sin(A45);
export const CUELLO_L = 467;                              // largo del cuello, de la boca al depósito
export const enCuello = (s) => ({ x: BOCA.x + s * C45, y: BOCA.y + s * S45 });
export const CUELLO_R = 40;                               // radio por dentro
// La pistola: su origen (donde el caño sale del cuerpo) y su giro. El caño se dobla 28° y acaba en PUNTA_L.
export const PIS_ROT = 0.2967;                            // 17°
const DOBLA = 0.4887;                                     // 28°
const PUNTA_L = { x: 30 + 210 * Math.cos(DOBLA), y: 210 * Math.sin(DOBLA) };
export const METIDO = 110;                                // lo que entra el caño en el cuello
const pisPos = (() => {
  const tip = enCuello(METIDO), c = Math.cos(PIS_ROT), s = Math.sin(PIS_ROT);
  return { x: tip.x - (PUNTA_L.x * c - PUNTA_L.y * s), y: tip.y - (PUNTA_L.x * s + PUNTA_L.y * c) };
})();
export const PISTOLA = pisPos;
// De la pistola al mundo.
export function dePistola(p, sale = 0) {
  const c = Math.cos(PIS_ROT), s = Math.sin(PIS_ROT), o = deOrigen(sale);
  return { x: o.x + p.x * c - p.y * s, y: o.y + p.x * s + p.y * c };
}
const deOrigen = (sale) => ({ x: pisPos.x - sale * C45 - sale * 0.6, y: pisPos.y - sale * S45 - sale * 0.5 });
export const PUNTA = enCuello(METIDO);
// El agujerito: debajo del caño, a 14 mm de la punta.
const AGU_L = { x: PUNTA_L.x - 14 * Math.cos(DOBLA) + 10.5 * Math.sin(DOBLA), y: PUNTA_L.y - 14 * Math.sin(DOBLA) + 10.5 * Math.cos(DOBLA) - 1 };
export const AGUJERITO = dePistola(AGU_L);
export const MEMBRANA = dePistola({ x: -70, y: -50 });
export const MUELLE = dePistola({ x: -112, y: 0 });
export const VALVULA = dePistola({ x: -150, y: 0 });

// El coche: de lado, la cola a la izquierda (x = -210) y el morro a la derecha.
export const DEPOSITO = { x0: 950, x1: 1760, y0: -520, y1: -240 };
export const FILTRO = { x0: 1880, x1: 2180, y0: -760, y1: -560 };
// El tanque enterrado de la gasolinera y el surtidor.
export const TANQUE = { x0: -3700, x1: -200, cy: 1750, r: 820 };
export const BOMBA = { x: -2050, y: 2380 };
export const SURT = { x0: -2550, x1: -1550, y0: -2250, y1: -120 };
export const PANTALLA = { x0: -2420, x1: -1680, y0: -2080, y1: -1500 };
export const SALIDA_MANG = { x: -1550, y: -1350 };
export const ENTRADA_MANG = dePistola({ x: -250, y: 0 });

// ---------------------------------------------------------------- el fondo
const azF = azar(808);
const LUCES = Array.from({ length: 40 }, () => ({ x: azF() * 1080, y: azF() * 1920, r: 30 + azF() * 90, c: ["255,170,60", "90,170,255", "255,90,160", "120,255,200"][Math.floor(azF() * 4)], f: azF() * 6 }));
// La noche de la gasolinera, en pantalla: azul oscuro con la luz blanca de la marquesina arriba y luces desenfocadas.
// rayos: de 0 a 1, el mundo se vuelve el de los rayos X (más azul y con una rejilla).
export function fondo(g, t, rayos = 0, camY = 0) {
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, k.mezColor("#0b1430", "#06121f", rayos)); bg.addColorStop(0.55, k.mezColor("#121a3a", "#081a2a", rayos)); bg.addColorStop(1, k.mezColor("#1d1430", "#04101a", rayos));
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "lighter";
  for (const l of LUCES) {
    const y = ((l.y - camY * 0.05) % 1920 + 1920) % 1920, a = (0.08 + 0.05 * Math.sin(t * 1.5 + l.f)) * (1 - rayos * 0.6);
    const gr = g.createRadialGradient(l.x, y, 0, l.x, y, l.r); gr.addColorStop(0, `rgba(${l.c},${a})`); gr.addColorStop(1, `rgba(${l.c},0)`);
    g.fillStyle = gr; g.fillRect(l.x - l.r, y - l.r, l.r * 2, l.r * 2);
  }
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.07; g.drawImage(k.manchas, -200, -200, 1500, 2400);
  if (rayos > 0.01) {
    g.globalAlpha = 0.10 * rayos; g.strokeStyle = "rgb(120,200,255)"; g.lineWidth = 1.5;
    for (let x = 0; x <= 1080; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke(); }
    for (let y = 0; y <= 1920; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke(); }
  }
  g.restore();
}
export function vineta(g, al = 0.55) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 560, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.5) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(4,8,18,${al})`); vg.addColorStop(0.6, `rgba(4,8,18,${al * 0.7})`); vg.addColorStop(1, "rgba(4,8,18,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
// Un fogonazo en pantalla (el clac).
export function destello(g, x, y, al, color = "255,240,200") {
  if (al <= 0.01) return;
  g.save(); sinVista(g); k.brillo(g, x, y, 1500, color, al); g.restore();
}

// ---------------------------------------------------------------- el suelo y el tanque enterrado
const tierraTex = k.tenir(k.ruido(256, 404, 5, 4, "manchas"), "#6a4a30");
export function suelo(g, t, rayos = 0) {
  // la tierra en corte (solo con rayos), con el tanque dentro
  if (rayos > 0.01) {
    g.save(); g.globalAlpha *= rayos;
    const tg = g.createLinearGradient(0, 0, 0, 3200); tg.addColorStop(0, "#3a2a1c"); tg.addColorStop(1, "#1a110a");
    g.fillStyle = tg; g.fillRect(-9000, 0, 18000, 4000);
    g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.6; g.drawImage(tierraTex, -9000, 0, 18000, 4000);
    g.restore();
  } else {
    g.fillStyle = "#07090f"; g.fillRect(-9000, 0, 18000, 4000);
  }
  // el pavimento: una losa de hormigón con el reflejo de las luces
  const pg = g.createLinearGradient(0, -20, 0, 160); pg.addColorStop(0, "#5a5f6c"); pg.addColorStop(1, "#262a33");
  g.fillStyle = pg; g.fillRect(-9000, 0, 18000, 160);
  g.save(); g.globalCompositeOperation = "lighter";
  const rg = g.createLinearGradient(0, 0, 0, 160); rg.addColorStop(0, "rgba(200,220,255,0.35)"); rg.addColorStop(1, "rgba(200,220,255,0)");
  g.fillStyle = rg; g.fillRect(-9000, 0, 18000, 40); g.restore();
  // la isleta del surtidor
  redondo(g, SURT.x0 - 260, -140, SURT.x1 - SURT.x0 + 520, 160, 40); g.fillStyle = "#c9ccd4"; g.fill();
  g.fillStyle = "#e8b318"; for (let x = SURT.x0 - 220; x < SURT.x1 + 240; x += 260) g.fillRect(x, -110, 130, 40);
}
// El tanque enterrado: un cilindro de acero tumbado, lleno de gasolina, con la bomba al fondo y el tubo que sube.
// gira: el ángulo de la hélice de la bomba; sube: de 0 a 1, la gasolina que sube por el tubo hasta el surtidor.
export function tanque(g, t, { gira = 0, sube = 0, al = 1 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const { x0, x1, cy, r } = TANQUE;
  // el cuerpo
  redondo(g, x0, cy - r, x1 - x0, 2 * r, r * 0.9);
  const cg = g.createLinearGradient(0, cy - r, 0, cy + r); cg.addColorStop(0, "#9aa4b4"); cg.addColorStop(0.3, "#5c6574"); cg.addColorStop(1, "#262b33");
  g.fillStyle = cg; g.fill();
  // la gasolina dentro (en corte), con su superficie que se mueve
  g.save(); redondo(g, x0 + 60, cy - r + 60, x1 - x0 - 120, 2 * r - 120, r * 0.85); g.clip();
  g.fillStyle = "#1b1206"; g.fillRect(x0, cy - r, x1 - x0, 2 * r);
  const ny = cy - r * 0.45;
  g.beginPath(); g.moveTo(x0, ny);
  for (let x = x0; x <= x1; x += 60) g.lineTo(x, ny + Math.sin(x * 0.004 + t * 2) * 14);
  g.lineTo(x1, cy + r); g.lineTo(x0, cy + r); g.closePath();
  const gg = g.createLinearGradient(0, ny, 0, cy + r); gg.addColorStop(0, `rgb(${GAS_CLARO})`); gg.addColorStop(0.15, `rgb(${GASOLINA})`); gg.addColorStop(1, "#7a3e00");
  g.fillStyle = gg; g.fill();
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.35; g.drawImage(k.causticas, x0 + ((t * 300) % 1600) - 1600, ny, 1600, 1200); g.drawImage(k.causticas, x0 + ((t * 300) % 1600), ny, 1600, 1200); g.drawImage(k.causticas, x0 + ((t * 300) % 1600) + 1600, ny, 1600, 1200); g.drawImage(k.causticas, x0 + ((t * 300) % 1600) + 3200, ny, 1600, 1200);
  g.restore();
  // los aros del tanque y su borde de luz
  g.strokeStyle = "rgba(20,24,30,0.7)"; g.lineWidth = 40;
  for (let x = x0 + 700; x < x1 - 300; x += 900) { g.beginPath(); g.moveTo(x, cy - r + 20); g.lineTo(x, cy + r - 20); g.stroke(); }
  redondo(g, x0, cy - r, x1 - x0, 2 * r, r * 0.9); g.strokeStyle = "rgba(220,235,255,0.5)"; g.lineWidth = 18; g.stroke();
  // el tubo que sube de la bomba al surtidor
  const tx = BOMBA.x, top = SURT.y1 - 400;
  g.fillStyle = "#3a404a"; g.fillRect(tx - 60, top, 120, BOMBA.y - top);
  g.beginPath(); g.rect(tx - 60, top, 120, BOMBA.y - top); k.metal(g, tx - 60, tx + 60, ["#4a515c", "#c9d1dc", "#7a838f", "#e6ebf1", "#3a4049"]);
  if (sube > 0.001) {
    const h = (BOMBA.y - top) * su(sube), y = BOMBA.y - h;
    g.save(); g.beginPath(); g.rect(tx - 40, y, 80, h); g.clip();
    const fg = g.createLinearGradient(tx - 40, 0, tx + 40, 0); fg.addColorStop(0, `rgb(${GASOLINA})`); fg.addColorStop(0.5, `rgb(${GAS_CLARO})`); fg.addColorStop(1, "#b86a00");
    g.fillStyle = fg; g.fillRect(tx - 40, y, 80, h);
    g.fillStyle = "rgba(255,255,255,0.45)";
    for (let i = 0; i < 40; i++) { const yy = BOMBA.y - ((i * 170 + t * 2600) % (BOMBA.y - top)); if (yy > y) g.fillRect(tx - 6, yy, 12, 60); }
    g.restore();
    k.brillo(g, tx, y, 600, GASOLINA, 0.8);
  }
  // la bomba, en el fondo: un cilindro con su hélice que gira
  g.save(); g.translate(BOMBA.x, BOMBA.y);
  redondo(g, -150, -260, 300, 380, 60); k.metal(g, -150, 150, ["#2d3440", "#9eb0c6", "#56657a", "#d9e3ef", "#252c36"]);
  g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 8; g.stroke();
  for (let i = 0; i < 4; i++) {
    const a = gira + i * Math.PI / 2, w = Math.cos(a) * 120;
    g.fillStyle = Math.sin(a) > 0 ? "#e7eef7" : "#7d8a9b";
    g.beginPath(); g.ellipse(w / 2, 40, Math.abs(w / 2) + 4, 26, 0, 0, 6.2832); g.fill();
  }
  k.brillo(g, 0, -40, 500, "120,200,255", 0.35 + 0.2 * Math.sin(t * 10));
  g.restore();
  g.restore();
}

// ---------------------------------------------------------------- el surtidor
// Un mueble alto, blanco y verde, con su pantalla de euros y litros encendida. corre: si los números se mueven.
const vetasSurt = k.ruido(256, 515, 4, 3, "lineas");
export function surtidor(g, t, { euros = 0, litros = 0, flujo = 0, verde = 0 } = {}) {
  const { x0, x1, y0, y1 } = SURT, w = x1 - x0;
  // la sombra
  g.save(); g.globalAlpha *= 0.5; g.fillStyle = "#000"; g.beginPath(); g.ellipse((x0 + x1) / 2, y1 + 10, w * 0.7, 60, 0, 0, 6.2832); g.fill(); g.restore();
  // el cuerpo
  redondo(g, x0, y0, w, y1 - y0, 70);
  const cg = g.createLinearGradient(x0, 0, x1, 0); cg.addColorStop(0, "#dfe4ea"); cg.addColorStop(0.35, "#ffffff"); cg.addColorStop(0.8, "#c3cad3"); cg.addColorStop(1, "#8c95a1");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.12; g.drawImage(vetasSurt, x0, y0, w, y1 - y0); g.restore();
  // la franja verde (la de la gasolina sin plomo) y la placa «95»
  redondo(g, x0, y0 + 1000, w, 330, 0); const vg = g.createLinearGradient(x0, 0, x1, 0); vg.addColorStop(0, "#0b8a3e"); vg.addColorStop(0.4, "#20c060"); vg.addColorStop(1, "#06652c"); g.fillStyle = vg; g.fill();
  g.save(); g.font = "900 230px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText("95", (x0 + x1) / 2, y0 + 1170); g.restore();
  // el hueco de la pistola, en el costado
  redondo(g, x1 - 40, y0 + 1400, 70, 420, 30); g.fillStyle = "#3a414c"; g.fill();
  // la pantalla
  const P = PANTALLA, pw = P.x1 - P.x0, ph = P.y1 - P.y0;
  redondo(g, P.x0 - 20, P.y0 - 20, pw + 40, ph + 40, 40); g.fillStyle = "#1a1f27"; g.fill();
  redondo(g, P.x0, P.y0, pw, ph, 26); const pg = g.createLinearGradient(0, P.y0, 0, P.y1); pg.addColorStop(0, "#081a10"); pg.addColorStop(1, "#03100a"); g.fillStyle = pg; g.fill();
  const cifra = (txt, y, tam, col) => {
    g.save(); g.font = `800 ${tam}px Figtree`; g.textAlign = "right"; g.textBaseline = "middle";
    g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 40; g.fillStyle = `rgb(${col})`; g.fillText(txt, P.x1 - 60, y); g.restore();
  };
  g.save(); g.font = "700 64px Figtree"; g.textBaseline = "middle"; g.fillStyle = "rgba(150,255,190,0.75)";
  g.fillText("EUROS", P.x0 + 40, P.y0 + 90); g.fillText("LITROS", P.x0 + 40, P.y0 + 400); g.restore();
  const colE = k.mezRgb("120,255,170", "160,255,120", verde);
  cifra(k.fmt(euros, 2), P.y0 + 200, 170, colE);
  cifra(k.fmt(litros, 2), P.y0 + 490, 110, "120,255,170");
  if (verde > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, (P.x0 + P.x1) / 2, P.y0 + 200, 900, "80,255,120", 0.5 * verde); g.restore(); }
  // el brillo del cristal
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.25; redondo(g, P.x0 + 30, P.y0 + 20, pw * 0.45, 30, 15); g.fillStyle = "#fff"; g.fill(); g.restore();
  // la luz que echa la pantalla
  k.brillo(g, (P.x0 + P.x1) / 2, (P.y0 + P.y1) / 2, 2200, "80,255,150", 0.18);
  if (flujo > 0.01) k.brillo(g, BOMBA.x, -400, 700, GASOLINA, 0.25 * flujo);
}

// ---------------------------------------------------------------- la manguera
function puntoManguera(u, sale = 0) {
  const a = SALIDA_MANG, b = sale ? dePistola({ x: -250, y: 0 }, sale) : ENTRADA_MANG;
  const c1 = { x: a.x + 300, y: a.y + 1300 }, c2 = { x: b.x - 900, y: b.y + 900 };
  const m = 1 - u;
  return { x: m * m * m * a.x + 3 * m * m * u * c1.x + 3 * m * u * u * c2.x + u * u * u * b.x, y: m * m * m * a.y + 3 * m * m * u * c1.y + 3 * m * u * u * c2.y + u * u * u * b.y };
}
export { puntoManguera };
// lleno: de 0 a 1, hasta dónde ha llegado la gasolina por la manguera (se ve con rayos).
export function manguera(g, t, { lleno = 0, rayos = 0, sale = 0, corre = 0 } = {}) {
  const N = 60, pts = [];
  for (let i = 0; i <= N; i++) pts.push(puntoManguera(i / N, sale));
  const trazo = (w, col, hasta = 1) => { g.strokeStyle = col; g.lineWidth = w; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); pts.forEach((p, i) => { if (i / N <= hasta + 1e-6) (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); }); g.stroke(); };
  trazo(46, "#05070b"); trazo(40, "#1d222a"); trazo(14, "rgba(255,255,255,0.18)");
  if (rayos > 0.01 && lleno > 0.001) {
    g.save(); g.globalAlpha *= rayos; trazo(26, `rgb(${GASOLINA})`, lleno); g.globalCompositeOperation = "lighter"; trazo(8, `rgba(${GAS_CLARO},0.8)`, lleno); g.restore();
    const p = puntoManguera(Math.min(1, lleno), sale); if (lleno < 1) k.brillo(g, p.x, p.y, 300, GASOLINA, 0.8 * rayos);
    // rayas que corren hacia la pistola
    if (corre > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= rayos * corre; g.fillStyle = "rgba(255,250,220,0.9)";
      for (let i = 0; i < 70; i++) { const u = ((i / 70) + t * 0.55) % 1; if (u > lleno) continue; const a = puntoManguera(u, sale), b = puntoManguera(Math.min(1, u + 0.006), sale); g.lineWidth = 5; g.strokeStyle = "rgba(255,250,220,0.85)"; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
      g.restore();
    }
  }
}

// ---------------------------------------------------------------- el coche
// De lado, rojo, la cola a la izquierda. rayos: de 0 a 1, la chapa se vuelve de cristal y se ve lo de dentro (el
// cuello, el depósito, el filtro), que dibuja interior() aparte.
const chapaTex = k.ruido(256, 616, 3, 3, "manchas");
function caminoCoche(g) {
  g.beginPath();
  g.moveTo(-170, -320);
  g.bezierCurveTo(-215, -420, -225, -620, -205, -720);           // la cola
  g.bezierCurveTo(-190, -900, -170, -990, -60, -1010);
  g.lineTo(380, -1030);                                           // el maletero
  g.bezierCurveTo(600, -1060, 760, -1250, 980, -1400);            // la luna de atrás
  g.bezierCurveTo(1100, -1460, 1300, -1470, 2300, -1460);         // el techo
  g.bezierCurveTo(2600, -1450, 2850, -1250, 3150, -1080);         // el parabrisas
  g.bezierCurveTo(3500, -1010, 4000, -990, 4150, -900);           // el capó
  g.bezierCurveTo(4260, -820, 4260, -480, 4180, -340);            // el morro
  g.lineTo(3880, -320);
  g.arc(3500, -330, 390, -0.05, Math.PI + 0.05, true);            // el paso de rueda de delante
  g.lineTo(1080, -310);
  g.arc(700, -330, 390, -0.05, Math.PI + 0.05, true);             // el de atrás
  g.closePath();
}
function rueda(g, x, y, t) {
  g.beginPath(); g.arc(x, y, 330, 0, 6.2832); g.fillStyle = "#101216"; g.fill();
  g.beginPath(); g.arc(x, y, 210, 0, 6.2832); k.metal(g, x - 210, x + 210, ["#4b525d", "#d7dee8", "#7a8492", "#f1f4f8", "#3d434c"]);
  g.fillStyle = "#2a2f37"; for (let i = 0; i < 5; i++) { const a = i * 1.2566; g.beginPath(); g.ellipse(x + Math.cos(a) * 120, y + Math.sin(a) * 120, 48, 30, a, 0, 6.2832); g.fill(); }
  g.beginPath(); g.arc(x, y, 50, 0, 6.2832); g.fillStyle = "#9aa3ae"; g.fill();
}
export function coche(g, t, { rayos = 0, tapa = 1 } = {}) {
  // la sombra en el suelo
  g.save(); g.globalAlpha *= 0.6; const sg = g.createRadialGradient(2000, 0, 200, 2000, 0, 2600); sg.addColorStop(0, "rgba(0,0,0,0.8)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(-800, -120, 5600, 240); g.restore();
  g.save(); g.globalAlpha *= 1 - 0.75 * rayos; rueda(g, 700, -330, t); rueda(g, 3500, -330, t); g.restore();
  // la chapa: opaca, o de cristal con rayos
  g.save(); g.globalAlpha *= 1 - 0.85 * rayos;
  caminoCoche(g);
  const cg = g.createLinearGradient(0, -1470, 0, -300); cg.addColorStop(0, "#ff6a5a"); cg.addColorStop(0.35, "#e0202a"); cg.addColorStop(0.7, "#a3101a"); cg.addColorStop(1, "#4a060c");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.15; g.drawImage(chapaTex, -300, -1500, 4600, 1300);
  g.globalCompositeOperation = "lighter"; g.globalAlpha = (1 - 0.85 * rayos) * 0.5;
  // el reflejo largo de la marquesina en la chapa
  const rf = g.createLinearGradient(0, -1000, 0, -860); rf.addColorStop(0, "rgba(255,255,255,0)"); rf.addColorStop(0.5, "rgba(255,240,240,0.55)"); rf.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = rf; g.fillRect(-300, -1000, 4600, 140);
  g.restore();
  // las ventanillas
  g.beginPath(); g.moveTo(560, -1060); g.bezierCurveTo(760, -1220, 900, -1330, 1080, -1380); g.lineTo(2280, -1390); g.bezierCurveTo(2520, -1380, 2720, -1230, 2930, -1080); g.closePath();
  const wg = g.createLinearGradient(0, -1390, 0, -1060); wg.addColorStop(0, "#2a3b55"); wg.addColorStop(1, "#0b1220"); g.fillStyle = wg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "lighter"; g.fillStyle = "rgba(180,210,255,0.22)"; g.beginPath(); g.moveTo(900, -1400); g.lineTo(1200, -1400); g.lineTo(950, -1050); g.lineTo(650, -1050); g.closePath(); g.fill(); g.restore();
  g.fillStyle = "#14080a"; g.fillRect(1700, -1390, 60, 330);
  // la línea de la puerta, el piloto de atrás y el faro
  g.strokeStyle = "rgba(40,0,6,0.7)"; g.lineWidth = 10; g.beginPath(); g.moveTo(1700, -1060); g.lineTo(1720, -420); g.stroke();
  redondo(g, -215, -900, 90, 200, 30); g.fillStyle = "#ff2030"; g.fill(); k.brillo(g, -170, -800, 500, "255,40,50", 0.6);
  redondo(g, 4120, -880, 80, 130, 30); g.fillStyle = "#fff6d8"; g.fill();
  // el borde de luz de arriba
  caminoCoche(g); g.strokeStyle = "rgba(255,200,200,0.35)"; g.lineWidth = px(3); g.stroke();
  g.restore();
  // con rayos: el contorno de la chapa, brillante
  if (rayos > 0.01) { g.save(); g.globalAlpha *= rayos; caminoCoche(g); g.strokeStyle = "rgba(255,120,120,0.9)"; g.lineWidth = Math.max(8, px(3)); g.stroke(); g.restore(); }
  // la boca del depósito: la tapita abierta y el agujero
  g.save(); g.translate(BOCA.x, BOCA.y);
  g.save(); g.globalAlpha *= 1 - 0.85 * rayos;
  g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); g.fillStyle = "#1a0306"; g.fill();
  g.beginPath(); g.arc(0, 0, 50, 0, 6.2832); const bg = g.createRadialGradient(-10, -10, 4, 0, 0, 44); bg.addColorStop(0, "#000"); bg.addColorStop(1, "#3a3f48"); g.fillStyle = bg; g.fill(); g.restore();
  if (tapa > 0) { g.save(); g.globalAlpha *= 1 - 0.85 * rayos; g.translate(-82, 6); g.scale(0.22, 1); g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); const tg = g.createLinearGradient(-70, 0, 70, 0); tg.addColorStop(0, "#3a0408"); tg.addColorStop(1, "#c41c26"); g.fillStyle = tg; g.fill(); g.strokeStyle = "rgba(0,0,0,0.6)"; g.lineWidth = 6; g.stroke(); g.restore(); }
  g.restore();
}

// ---------------------------------------------------------------- dentro del coche (con rayos)
// El cuello, del costado al depósito, con la gasolina que sube. nivel: hasta dónde llega la gasolina en el cuello
// (en mm desde la boca: CUELLO_L, vacío; 0, a ras de la boca; negativo, rebosa).
const az1 = azar(77);
const BURB = Array.from({ length: 70 }, () => ({ s: az1(), d: az1() * 2 - 1, r: 1.2 + az1() * 3.5, v: 0.4 + az1() * 0.8, f: az1() }));
// La superficie del líquido en el cuello: la altura (y del mundo) a la que llega.
export const yNivel = (nivel) => enCuello(Math.max(-60, nivel)).y;
function caminoCuello(g, extra = 0) {
  // un tubo inclinado, del costado (s = -40) al depósito (s = CUELLO_L + 30)
  const r = CUELLO_R + extra, a = enCuello(-40), b = enCuello(CUELLO_L + 40);
  g.beginPath();
  g.moveTo(a.x + r * S45, a.y - r * C45); g.lineTo(b.x + r * S45, b.y - r * C45);
  g.lineTo(b.x - r * S45, b.y + r * C45); g.lineTo(a.x - r * S45, a.y + r * C45); g.closePath();
}
export function cuello(g, t, { nivel = CUELLO_L, agita = 0, al = 1 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  // la pared del tubo (metal oscuro, en corte) y el hueco
  caminoCuello(g, 6); g.fillStyle = "#4b5563"; g.fill();
  caminoCuello(g); g.fillStyle = "#0a1018"; g.fill();
  // la gasolina: todo lo que queda por debajo de la superficie, dentro del tubo
  g.save(); caminoCuello(g); g.clip();
  const yS = yNivel(nivel), x0 = BOCA.x - 200, x1 = BOCA.x + CUELLO_L + 200;
  g.beginPath(); g.moveTo(x0, yS);
  for (let x = x0; x <= x1; x += 2) g.lineTo(x, yS + Math.sin(x * 0.25 + t * 18) * (0.6 + 2.2 * agita) + Math.sin(x * 0.11 - t * 11) * 1.2 * agita);
  g.lineTo(x1, yS + 900); g.lineTo(x0, yS + 900); g.closePath();
  const gg = g.createLinearGradient(0, yS - 4, 0, yS + 140); gg.addColorStop(0, `rgb(${GAS_CLARO})`); gg.addColorStop(0.12, `rgb(${GASOLINA})`); gg.addColorStop(1, "#8a4300");
  g.fillStyle = gg; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.45; g.drawImage(k.causticas, BOCA.x - 100 + ((t * 40) % 300), yS - 40, 700, 700);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = al;
  // burbujas que suben (con la gasolina agitada)
  for (const b of BURB) {
    const life = ((t * b.v * 1.6 + b.f) % 1), yy = yS + 6 + (1 - life) * 150, xx = enCuello(0).x + (yy - BOCA.y) + b.d * (CUELLO_R - 4) * 1.41;
    const a = agita * Math.min(1, life * 4) * 0.9;
    if (a < 0.02) continue;
    g.beginPath(); g.arc(xx, yy, b.r, 0, 6.2832); g.strokeStyle = `rgba(255,250,220,${a})`; g.lineWidth = 0.7; g.stroke();
    g.fillStyle = `rgba(255,255,255,${a * 0.5})`; g.beginPath(); g.arc(xx - b.r * 0.3, yy - b.r * 0.3, b.r * 0.35, 0, 6.2832); g.fill();
  }
  g.restore();
  // la línea brillante de la superficie
  g.strokeStyle = "rgba(255,245,200,0.9)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x0, yS); g.lineTo(x1, yS); g.stroke();
  g.restore();
  // el brillo del borde del tubo
  caminoCuello(g, 6); g.strokeStyle = "rgba(160,210,255,0.55)"; g.lineWidth = Math.max(1.2, px(2)); g.stroke();
  g.restore();
}
// El chorro que sale de la punta de la pistola y cae por el cuello hasta la gasolina. fuerza: de 0 a 1.
export function chorro(g, t, { fuerza = 1, nivel = CUELLO_L } = {}) {
  if (fuerza <= 0.01) return;
  const p = PUNTA, fin = enCuello(Math.max(METIDO + 2, nivel)), L = Math.hypot(fin.x - p.x, fin.y - p.y);
  if (L < 2) return;
  g.save(); g.translate(p.x, p.y); g.rotate(A45);
  g.beginPath(); g.rect(0, -8 * fuerza, L, 16 * fuerza);
  const cg = g.createLinearGradient(0, -9, 0, 9); cg.addColorStop(0, `rgba(${GASOLINA},0.85)`); cg.addColorStop(0.45, `rgba(${GAS_CLARO},0.95)`); cg.addColorStop(1, `rgba(${GASOLINA},0.8)`);
  g.fillStyle = cg; g.fill();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) { const x = ((i * 37 + t * 900) % (L + 30)) - 30, y = Math.sin(i * 2.1) * 5 * fuerza; g.fillStyle = "rgba(255,255,230,0.6)"; g.fillRect(x, y - 0.8, Math.max(0, Math.min(22, L - x)), 1.6); }
  g.restore();
  // la espuma donde cae, y gotas que saltan
  k.brillo(g, fin.x, fin.y, 160, GAS_CLARO, 0.7 * fuerza);
  const az = azar(55);
  for (let i = 0; i < 26; i++) {
    const v = 0.35 + az() * 0.5, a = -Math.PI / 2 + (az() - 0.5) * 2.2, f = az(), r = 0.8 + az() * 1.8;
    const w = ((t * 2.2 + f) % 1) * v;
    const x = fin.x + Math.cos(a) * 130 * w, y = fin.y + Math.sin(a) * 130 * w + 300 * w * w;
    if (y > fin.y + 2) continue;
    g.fillStyle = `rgba(${GAS_CLARO},${fuerza * (1 - w / v) * 0.95})`; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill();
  }
}

// El depósito del coche (con rayos): una caja de plástico negro con la gasolina dentro. nivel: de 0 a 1, lo lleno;
// hueco: de 0 a 1, cuánto se ve el hueco de los vapores (azul) arriba.
export function deposito(g, t, { nivel = 0.85, hueco = 1, agita = 0, al = 1 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const { x0, x1, y0, y1 } = DEPOSITO;
  redondo(g, x0 - 18, y0 - 18, x1 - x0 + 36, y1 - y0 + 36, 80); g.fillStyle = "#2a2f38"; g.fill();
  redondo(g, x0, y0, x1 - x0, y1 - y0, 66); g.fillStyle = "#0a1018"; g.fill();
  g.save(); redondo(g, x0, y0, x1 - x0, y1 - y0, 66); g.clip();
  const yS = mez(y1, y0, nivel);
  // el hueco de los vapores: azul, con el vapor que se mueve
  if (hueco > 0.01) {
    const hg = g.createLinearGradient(0, y0, 0, yS); hg.addColorStop(0, `rgba(${VAPOR},${0.55 * hueco})`); hg.addColorStop(1, `rgba(${VAPOR},${0.25 * hueco})`);
    g.fillStyle = hg; g.fillRect(x0, y0, x1 - x0, yS - y0);
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha *= 0.4 * hueco;
    for (let i = 0; i < 9; i++) { const x = x0 + ((i * 140 + t * 60) % (x1 - x0)), y = y0 + (yS - y0) * (0.3 + 0.4 * Math.sin(i * 1.7 + t)); k.brillo(g, x, y, 160, VAPOR, 0.7); }
    g.restore();
  }
  g.beginPath(); g.moveTo(x0, yS);
  for (let x = x0; x <= x1; x += 10) g.lineTo(x, yS + Math.sin(x * 0.03 + t * 6) * (2 + 8 * agita));
  g.lineTo(x1, y1); g.lineTo(x0, y1); g.closePath();
  const gg = g.createLinearGradient(0, yS, 0, y1); gg.addColorStop(0, `rgb(${GAS_CLARO})`); gg.addColorStop(0.1, `rgb(${GASOLINA})`); gg.addColorStop(1, "#7a3a00");
  g.fillStyle = gg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "screen"; g.globalAlpha *= 0.4; g.drawImage(k.causticas, x0 - ((t * 80) % 400), yS, 1300, 700); g.restore();
  g.restore();
  redondo(g, x0 - 18, y0 - 18, x1 - x0 + 36, y1 - y0 + 36, 80); g.strokeStyle = "rgba(160,210,255,0.55)"; g.lineWidth = Math.max(4, px(2)); g.stroke();
  g.restore();
}
// El tubo de vapores, de lo alto del depósito al filtro. liquido: de 0 a 1, hasta dónde ha subido la gasolina.
export const TUBO_V = [{ x: 1600, y: -520 }, { x: 1600, y: -660 }, { x: FILTRO.x0, y: -660 }];
export function tuboVapor(g, t, { liquido = 0, vapor = 1, al = 1 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const traza = (w, col) => { g.strokeStyle = col; g.lineWidth = w; g.lineJoin = "round"; g.beginPath(); TUBO_V.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.stroke(); };
  traza(44, "#2a2f38"); traza(30, "#0a1018");
  const L1 = 140, L2 = FILTRO.x0 - 1600, L = L1 + L2;
  const punto = (d) => (d <= L1 ? { x: 1600, y: -520 - d } : { x: 1600 + (d - L1), y: -660 });
  // el vapor azul que corre hacia el filtro
  if (vapor > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 14; i++) { const d = ((i * 37 + t * 220) % L); const p = punto(d); k.brillo(g, p.x, p.y, 70, VAPOR, 0.5 * vapor); }
    g.restore();
  }
  // la gasolina que sube por el tubo
  if (liquido > 0.001) {
    const d = L * liquido;
    g.strokeStyle = `rgb(${GASOLINA})`; g.lineWidth = 26; g.lineCap = "butt"; g.beginPath(); g.moveTo(1600, -520);
    if (d <= L1) g.lineTo(1600, -520 - d); else { g.lineTo(1600, -660); g.lineTo(1600 + d - L1, -660); }
    g.stroke();
    const p = punto(d); k.brillo(g, p.x, p.y, 160, GASOLINA, 0.9);
  }
  g.restore();
}
// El filtro de carbón: una caja con granos negros que atrapan el vapor. empapa: de 0 a 1, la gasolina líquida dentro;
// roto: de 0 a 1, se agrieta y se enciende en rojo.
const azC = azar(919);
const GRANOS = Array.from({ length: 260 }, () => ({ x: azC(), y: azC(), r: 7 + azC() * 9, a: azC() * 6, s: azC() }));
export function filtro(g, t, { empapa = 0, roto = 0, vapor = 1, al = 1, gotas = 1 } = {}) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const { x0, x1, y0, y1 } = FILTRO, w = x1 - x0, h = y1 - y0;
  redondo(g, x0 - 14, y0 - 14, w + 28, h + 28, 34); k.metal(g, x0 - 14, x1 + 14, ["#1f242c", "#59626f", "#2e343d", "#6a7380", "#1a1e24"]);
  redondo(g, x0, y0, w, h, 24); g.fillStyle = "#07090c"; g.fill();
  g.save(); redondo(g, x0, y0, w, h, 24); g.clip();
  // la gasolina que lo inunda desde la entrada (a la izquierda, arriba) hacia abajo
  const nivelE = mez(y0 - 10, y1 + 20, 1) ;
  if (empapa > 0.01) {
    const yS = mez(y1, y0, su(empapa));
    const gg = g.createLinearGradient(0, yS, 0, y1); gg.addColorStop(0, `rgba(${GAS_CLARO},0.9)`); gg.addColorStop(0.2, `rgba(${GASOLINA},0.95)`); gg.addColorStop(1, "rgba(120,60,0,0.95)");
    g.fillStyle = gg; g.fillRect(x0, yS, w, y1 - yS);
  }
  // los granos de carbón
  for (const gr of GRANOS) {
    const x = x0 + 10 + gr.x * (w - 20), y = y0 + 10 + gr.y * (h - 20);
    const moj = empapa > 0.01 && y > mez(y1, y0, su(empapa)) ? 1 : 0;
    g.beginPath(); g.ellipse(x, y, gr.r, gr.r * 0.75, gr.a, 0, 6.2832);
    g.fillStyle = moj ? `rgb(${k.mezRgb("40,24,6", "90,50,8", gr.s)})` : `rgb(${k.mezRgb("18,20,24", "48,52,60", gr.s)})`; g.fill();
    g.fillStyle = moj ? "rgba(255,210,120,0.55)" : "rgba(200,220,255,0.35)"; g.beginPath(); g.arc(x - gr.r * 0.3, y - gr.r * 0.3, gr.r * 0.3, 0, 6.2832); g.fill();
  }
  // el vapor atrapado: puntitos azules que se pegan a los granos
  if (vapor > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 40; i++) { const gr = GRANOS[i * 5], x = x0 + 10 + gr.x * (w - 20), y = y0 + 10 + gr.y * (h - 20); k.brillo(g, x, y, 36, VAPOR, vapor * (0.45 + 0.35 * Math.sin(t * 3 + i))); }
    g.restore();
  }
  // roto: grietas rojas que se encienden
  if (roto > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    const rg = g.createRadialGradient((x0 + x1) / 2, (y0 + y1) / 2, 10, (x0 + x1) / 2, (y0 + y1) / 2, w); rg.addColorStop(0, `rgba(${ROJO},${0.5 * roto})`); rg.addColorStop(1, `rgba(${ROJO},0)`);
    g.fillStyle = rg; g.fillRect(x0, y0, w, h);
    g.restore();
  }
  g.restore();
  if (roto > 0.01) {
    g.save(); g.strokeStyle = `rgba(255,90,70,${roto})`; g.lineWidth = 4; g.lineCap = "round";
    const grieta = [[x0 + w * 0.3, y0 - 14], [x0 + w * 0.36, y0 + h * 0.2], [x0 + w * 0.3, y0 + h * 0.38], [x0 + w * 0.42, y0 + h * 0.6]];
    g.beginPath(); grieta.forEach((p, i) => { if (i / (grieta.length - 1) <= roto + 0.01) (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); }); g.stroke();
    const gr2 = [[x1 + 14, y0 + h * 0.4], [x1 - w * 0.12, y0 + h * 0.5], [x1 - w * 0.08, y0 + h * 0.7]];
    g.beginPath(); gr2.forEach((p, i) => { if (i / (gr2.length - 1) <= roto + 0.01) (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); }); g.stroke();
    g.restore();
    k.brillo(g, (x0 + x1) / 2, (y0 + y1) / 2, 900, ROJO, 0.45 * roto);
    // gotas que caen por debajo
    for (let i = 0; i < 4; i++) { const u = ((t * 0.9 + i * 0.27) % 1), x = x0 + w * (0.2 + i * 0.2), y = y1 + 20 + u * 260; g.fillStyle = `rgba(${GASOLINA},${gotas * roto * (1 - u)})`; g.beginPath(); g.ellipse(x, y, 7, 11, 0, 0, 6.2832); g.fill(); }
  }
  redondo(g, x0 - 14, y0 - 14, w + 28, h + 28, 34); g.strokeStyle = roto > 0.01 ? `rgba(255,${Math.round(mez(210, 80, roto))},${Math.round(mez(255, 70, roto))},0.6)` : "rgba(160,210,255,0.55)"; g.lineWidth = Math.max(4, px(2)); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la pistola
// Dibujada en su sitio (metida en la boca del depósito) o sacada (sale, en mm). Por fuera: cuerpo de metal con la
// funda verde y el gatillo. cristal: de 0 a 1, se vuelve de cristal y se ve lo de dentro:
//   flujo: la gasolina que corre por dentro (rayas que van hacia la punta), de 0 a 1;
//   aire: las burbujas que suben por el tubito desde el agujerito de la punta, de 0 a 1;
//   vacio: la cámara de la membrana se vuelve violeta, de 0 a 1;
//   membrana: de 0 a 1, cuánto se ha hundido; muelle: de 0 a 1, cuánto se ha soltado (cierra la válvula);
//   gatillo: de 0 (suelto) a 1 (apretado).
const LLAVE = { x: 30, y: 0 };
function caminoCano(g, r) {
  // el caño: recto 30 mm y luego doblado, de radio r
  const c = Math.cos(DOBLA), s = Math.sin(DOBLA);
  g.beginPath();
  g.moveTo(-2, -r); g.lineTo(30 + r * Math.tan(DOBLA / 2), -r);
  g.lineTo(PUNTA_L.x + r * s, PUNTA_L.y - r * c);
  g.lineTo(PUNTA_L.x - r * s, PUNTA_L.y + r * c);
  g.lineTo(30 - r * Math.tan(DOBLA / 2), r);
  g.lineTo(-2, r); g.closePath();
}
function caminoCuerpo(g) {
  g.beginPath();
  g.moveTo(-205, -36); g.bezierCurveTo(-150, -44, -40, -40, -8, -30);
  g.quadraticCurveTo(4, -26, 4, -10); g.lineTo(4, 22); g.quadraticCurveTo(2, 34, -14, 36);
  g.bezierCurveTo(-60, 40, -150, 44, -205, 38);
  g.quadraticCurveTo(-218, 0, -205, -36); g.closePath();
}
function caminoFunda(g) {
  // la funda verde sobre la parte de atrás (donde se agarra)
  g.beginPath();
  g.moveTo(-262, -30); g.bezierCurveTo(-230, -52, -160, -56, -110, -46);
  g.lineTo(-104, -32); g.bezierCurveTo(-160, -38, -220, -34, -246, -18);
  g.lineTo(-246, 18); g.bezierCurveTo(-220, 34, -170, 46, -140, 50);
  g.lineTo(-150, 62); g.bezierCurveTo(-200, 60, -250, 46, -268, 22);
  g.quadraticCurveTo(-278, 0, -262, -30); g.closePath();
}
const gatilloAng = (gat) => mez(0.32, 0.05, gat);
function caminoGatillo(g, gat) {
  // la palanca, bajo el cuerpo: gira en (-18, 34)
  g.save(); g.translate(-18, 34); g.rotate(gatilloAng(gat));
  g.beginPath(); g.moveTo(0, -4); g.bezierCurveTo(-60, -2, -120, 0, -168, 6); g.quadraticCurveTo(-176, 12, -168, 18); g.bezierCurveTo(-120, 14, -60, 12, 0, 10); g.closePath();
  g.restore();
}
function caminoGuarda(g) {
  g.beginPath();
  g.moveTo(-6, 34); g.bezierCurveTo(2, 80, -10, 104, -40, 106); g.lineTo(-200, 104); g.bezierCurveTo(-232, 100, -240, 70, -232, 34);
}
const metalPis = ["#58606c", "#e3e8ef", "#8d97a4", "#f6f8fb", "#4a5059"];
const azP = azar(321);
const RAYAS = Array.from({ length: 40 }, () => ({ f: azP(), y: azP() * 2 - 1, l: 8 + azP() * 14 }));
const BURP = Array.from({ length: 22 }, () => ({ f: azP(), r: 0.9 + azP() * 1.4 }));
// El camino de la gasolina por dentro (de la manguera a la punta), en coordenadas de la pistola, con su radio.
const RUTA = (() => {
  const l = [];
  for (let x = -250; x <= 0; x += 2) { const r = x > -60 && x < -20 ? mez(11, 5.5, Math.sin(((x + 60) / 40) * Math.PI)) : x <= -150 ? 12 : 11; l.push({ x, y: 0, r }); }
  for (let d = 2; d <= 30; d += 2) l.push({ x: d, y: 0, r: 8.5 });
  for (let d = 2; d <= 210; d += 2) l.push({ x: 30 + d * Math.cos(DOBLA), y: d * Math.sin(DOBLA), r: 8.5 });
  return l;
})();
// El tubito del aire: del agujerito, por dentro del caño (pegado a su pared de arriba), hasta la membrana.
const TUBITO = (() => {
  const l = [], c = Math.cos(DOBLA), s = Math.sin(DOBLA);
  // de la punta hacia atrás, por la pared de arriba del caño
  for (let d = 196; d >= 0; d -= 4) l.push({ x: 30 + d * c + 7 * s, y: d * s - 7 * c });
  l.push({ x: 14, y: -7 }); l.push({ x: -6, y: -14 }); l.push({ x: -30, y: -26 }); l.push({ x: -50, y: -38 }); l.push({ x: -58, y: -44 });
  return l;
})();
export function pistola(g, t, { cristal = 0, flujo = 0, aire = 0, vacio = 0, membrana = 0, muelle = 0, gatillo = 1, sale = 0, al = 1, brillo = 0, valvula = null, venturi = 0 } = {}) {
  const abre = valvula ?? (1 - muelle) * gatillo;
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const o = deOrigen(sale);
  g.translate(o.x, o.y); g.rotate(PIS_ROT);
  const op = 1 - cristal; // lo opaco
  // ---- por fuera
  if (op > 0.01) {
    g.save(); g.globalAlpha *= op;
    // el cuello de la manguera
    redondo(g, -300, -22, 70, 44, 10); k.metal(g, -300, -230, ["#202329", "#5b616b", "#2a2e35"]);
    // el caño de acero: el tramo recto y el doblado, cada uno con su brillo a lo largo
    const tubo = (L) => {
      const cg = g.createLinearGradient(0, -10.5, 0, 10.5); cg.addColorStop(0, "#9aa4b0"); cg.addColorStop(0.18, "#ffffff"); cg.addColorStop(0.45, "#c3ccd6"); cg.addColorStop(0.8, "#59626e"); cg.addColorStop(1, "#2c3138");
      g.fillStyle = cg; g.fillRect(-1, -10.5, L + 2, 21);
    };
    g.save(); g.translate(-2, 0); tubo(34); g.restore();
    g.save(); g.translate(30, 0); g.rotate(DOBLA); tubo(210);
    // la punta, con su borde, y el anillo de muelle cerca de ella
    g.fillStyle = "#1b1f25"; g.fillRect(206, -9, 4, 18);
    g.fillStyle = "#05070a"; g.beginPath(); g.ellipse(196, 9.5, 2.6, 1.4, 0, 0, 6.2832); g.fill();
    for (let i = 0; i < 9; i++) { const x = 120 + i * 6; g.fillStyle = "#e9eef4"; g.fillRect(x, -12.5, 3.2, 25); g.fillStyle = "#59626e"; g.fillRect(x + 3.2, -12.5, 1.6, 25); }
    g.restore();
    // el muelle de la punta (la espiral anti-tirones), de metal
    caminoGuarda(g); g.strokeStyle = "#2a2e35"; g.lineWidth = 9; g.lineCap = "round"; g.stroke(); g.strokeStyle = "#7b8491"; g.lineWidth = 4; g.stroke();
    caminoGatillo(g, gatillo); const lg = g.createLinearGradient(0, 30, 0, 60); lg.addColorStop(0, "#d7dde5"); lg.addColorStop(1, "#5b636e"); g.fillStyle = lg; g.fill(); g.strokeStyle = "rgba(0,0,0,0.5)"; g.lineWidth = 1.2; g.stroke();
    caminoCuerpo(g); const bg = g.createLinearGradient(0, -44, 0, 40); bg.addColorStop(0, "#f4f6f9"); bg.addColorStop(0.3, "#b9c1cc"); bg.addColorStop(0.75, "#6b7480"); bg.addColorStop(1, "#353a42"); g.fillStyle = bg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.25; g.drawImage(k.red, -220, -50, 240, 100); g.restore();
    // la tapa de la membrana
    g.beginPath(); g.ellipse(-70, -40, 30, 10, 0, 0, 6.2832); k.metal(g, -100, -40, metalPis);
    caminoFunda(g); const fg = g.createLinearGradient(0, -56, 0, 62); fg.addColorStop(0, "#6dff9e"); fg.addColorStop(0.3, "#16c65a"); fg.addColorStop(0.75, "#07843a"); fg.addColorStop(1, "#033d1b"); g.fillStyle = fg; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.3; g.drawImage(k.manchas, -280, -60, 200, 130); g.restore();
    // brillos
    g.strokeStyle = "rgba(255,255,255,0.6)"; g.lineWidth = 2; g.lineCap = "round";
    g.beginPath(); g.moveTo(-190, -38); g.bezierCurveTo(-140, -42, -60, -40, -16, -30); g.stroke();
    g.beginPath(); g.moveTo(-250, -30); g.bezierCurveTo(-220, -46, -170, -50, -124, -44); g.stroke();
    g.restore();
  }
  // ---- de cristal: el contorno y lo de dentro
  if (cristal > 0.01) {
    g.save(); g.globalAlpha *= cristal;
    const lw = Math.max(1.1, px(2.2));
    // el cristal: casi transparente, con su borde claro
    const cristalDe = (camino, x0, x1) => {
      camino(); const cg = g.createLinearGradient(0, -50, 0, 50); cg.addColorStop(0, "rgba(200,235,255,0.42)"); cg.addColorStop(0.25, "rgba(150,200,240,0.16)"); cg.addColorStop(0.7, "rgba(120,170,230,0.12)"); cg.addColorStop(1, "rgba(170,215,255,0.3)"); g.fillStyle = cg; g.fill();
      g.strokeStyle = "rgba(120,200,255,0.35)"; g.lineWidth = lw * 3; g.stroke(); g.strokeStyle = "rgba(225,245,255,0.95)"; g.lineWidth = lw; g.stroke(); };
    cristalDe(() => { redondo(g, -300, -22, 70, 44, 10); }, -300, -230);
    cristalDe(() => caminoFunda(g), -280, -100);
    cristalDe(() => caminoCuerpo(g), -210, 0);
    cristalDe(() => caminoCano(g, 10.5), 0, 220);
    cristalDe(() => caminoGatillo(g, gatillo), -190, 0);
    caminoGuarda(g); g.strokeStyle = "rgba(200,235,255,0.6)"; g.lineWidth = lw; g.stroke();
    // el canal de la gasolina: oscuro, y la gasolina que corre si hay flujo
    g.lineCap = "round"; g.lineJoin = "round";
    const canal = (col, extra) => { g.strokeStyle = col; for (let i = 1; i < RUTA.length; i++) { const a = RUTA[i - 1], b = RUTA[i]; g.lineWidth = (a.r + extra) * 2; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); } };
    canal("rgba(150,200,240,0.5)", 1.2);
    canal("rgba(6,12,22,0.92)", 0);
    // la válvula: un disco que se pega a su asiento cuando se cierra (muelle)
    const vx = -150 - 10 * abre;
    // la gasolina dentro: llena el canal hasta la válvula siempre; pasa de la válvula si fluye
    g.save();
    const llenoHasta = flujo > 0.01 ? RUTA.length : RUTA.findIndex((p) => p.x >= -152);
    g.strokeStyle = `rgba(${GASOLINA},${0.55 + 0.4 * Math.max(flujo, 0.3)})`;
    for (let i = 1; i < llenoHasta; i++) { const a = RUTA[i - 1], b = RUTA[i]; g.lineWidth = a.r * 2 - 2; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke(); }
    if (flujo > 0.01) {
      // las rayas que corren hacia la punta (más deprisa en el estrechamiento)
      g.globalCompositeOperation = "lighter";
      for (const r of RAYAS) {
        const u = (r.f + t * 1.4) % 1, i = Math.min(RUTA.length - 2, Math.floor(u * (RUTA.length - 1))), p = RUTA[i], q = RUTA[i + 1];
        const ang = Math.atan2(q.y - p.y, q.x - p.x), lar = r.l * (12 / p.r);
        g.save(); g.translate(p.x - Math.sin(ang) * r.y * p.r * 0.6, p.y + Math.cos(ang) * r.y * p.r * 0.6); g.rotate(ang);
        g.fillStyle = `rgba(255,250,220,${0.7 * flujo})`; g.fillRect(-lar, -0.7, lar, 1.4); g.restore();
      }
    }
    g.restore();
    // el estrechamiento, encendido cuando la gasolina pasa deprisa
    if (venturi > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, -40, 0, 70, GAS_CLARO, venturi); g.restore(); }
    // el disco de la válvula y su asiento
    g.fillStyle = "#c9d3df"; g.fillRect(-148, -14, 3, 28);
    g.fillStyle = "#e9eef5"; redondo(g, vx - 6, -11, 6, 22, 2); g.fill();
    g.strokeStyle = "rgba(200,235,255,0.9)"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(vx - 3, 0); g.lineTo(-112, 0); g.stroke();
    // el muelle: una espiral entre la válvula y el pestillo, que se estira cuando se suelta
    const mx0 = -140, mx1 = mez(-112, -96, muelle);
    g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 1.2; g.beginPath();
    for (let i = 0; i <= 60; i++) { const u = i / 60, x = mez(mx0, mx1, u) - 60 - 0 + 60, y = Math.sin(u * Math.PI * 14) * 9; (i ? g.lineTo(x, y - 24) : g.moveTo(x, y - 24)); }
    g.stroke();
    // el pestillo: un pasador bajo la membrana que la membrana levanta
    const sube = membrana * 7;
    g.fillStyle = "rgba(230,240,255,0.95)"; g.fillRect(-73, -40 - sube, 6, 30);
    // la cámara de la membrana: un hueco redondo arriba, que se pone violeta con el vacío
    g.beginPath(); g.ellipse(-70, -44, 26, 12, 0, 0, 6.2832); g.fillStyle = `rgba(${k.mezRgb("10,16,28", VACIO, vacio * 0.8)},0.95)`; g.fill();
    if (vacio > 0.01) k.brillo(g, -70, -44, 90, VACIO, 0.8 * vacio);
    // la membrana: una lámina que se curva hacia arriba
    g.strokeStyle = "rgba(255,170,220,0.95)"; g.lineWidth = 2.2; g.beginPath(); g.moveTo(-94, -40); g.quadraticCurveTo(-70, -40 - 14 * membrana, -46, -40); g.stroke();
    // el tubito del aire
    g.strokeStyle = "rgba(150,200,240,0.55)"; g.lineWidth = 4.2; g.beginPath(); TUBITO.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.stroke();
    g.strokeStyle = vacio > 0.01 ? `rgba(${k.mezRgb("8,14,24", VACIO, vacio * 0.6)},1)` : "rgba(8,14,24,1)"; g.lineWidth = 2.4; g.stroke();
    // el pasito del estrechamiento a la cámara
    g.strokeStyle = "rgba(150,200,240,0.55)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-40, -6); g.lineTo(-58, -36); g.stroke();
    // las burbujas de aire que suben por el tubito
    if (aire > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter";
      for (const b of BURP) {
        const u = (b.f + t * 0.9) % 1, i = Math.min(TUBITO.length - 1, Math.floor(u * TUBITO.length)), p = TUBITO[i];
        g.fillStyle = `rgba(${AIRE},${0.95 * aire})`; g.beginPath(); g.arc(p.x, p.y, b.r, 0, 6.2832); g.fill();
      }
      g.restore();
    }
    // el agujerito
    g.fillStyle = "#04070c"; g.beginPath(); g.arc(AGU_L.x, AGU_L.y, 2.2, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(220,240,255,0.95)"; g.lineWidth = 0.8; g.stroke();
    // un reflejo largo en el cristal
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(-240, -36); g.bezierCurveTo(-180, -48, -80, -48, -20, -34); g.stroke();
    g.restore();
  }
  if (brillo > 0.01) k.brillo(g, -60, 0, 600, "255,240,200", brillo);
  g.restore();
}
// Dónde queda en el mundo un punto de la pistola (para la cámara).
export const AGU_LOCAL = AGU_L;
export { TUBITO };
