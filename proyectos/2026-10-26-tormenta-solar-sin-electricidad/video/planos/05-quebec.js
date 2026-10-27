// «En 1989, Quebec se quedó a oscuras en menos de dos minutos: seis millones de personas.»
// Otro sitio: Quebec de noche, en invierno, con nieve, miles de ventanas encendidas, el castillo de tejados verdes en
// medio y una aurora suave encima. Corte en «En».
// - «En 1989»: la ciudad encendida, con su resplandor naranja en el cielo; «1989» en su pastilla.
// - «Quebec se quedó a oscuras»: se apaga barrio a barrio, de lejos a cerca y de izquierda a derecha; el resplandor se
//   apaga con ella y queda la aurora. Mientras, un reloj corre de 0:00 a 1:15.
// - «seis millones de personas»: la cámara se aleja y se ven más barrios a los lados, todos a oscuras; «6 millones».
import * as k from "#kit";
import { v } from "#voz";
import { auroras, AURORA_VERDE } from "../mundo.js";

const f5 = v.frase(5);
export const desde = f5.inicio;

const { suave, tramo, azar } = k;
const T0 = f5.inicio, Tano = f5.t("1989"), Tque = f5.t("quebec"), Tosc = f5.t("oscuras"), Tmin = f5.t("minutos"), Tseis = f5.t("seis"), Tfin = f5.fin;
// cuándo se apaga cada banda de la ciudad (capa 0 lejos, 2 cerca)
const T_APAGA = Tosc - 0.15, DUR = Tmin + 0.25 - T_APAGA;
const apagaBanda = (capa, b) => T_APAGA + DUR * (0.08 + capa * 0.28 + (b / 16) * 0.32);
export const apagones = [0, 1, 2].map((c) => apagaBanda(c, 8));

// ---------------------------------------------------------------- la ciudad, pintada una vez (encendida y apagada)
const AN = 1600, AL = 1000, BASE = 980;
function capa(semilla, n, hMin, hMax, wMin, wMax, ventana, color, castillo = false) {
  const az = azar(semilla), edificios = [];
  let x = -20;
  while (x < AN) { const w = wMin + az() * (wMax - wMin); edificios.push({ x, w, h: hMin + Math.pow(az(), 1.6) * (hMax - hMin), techo: az() }); x += w + az() * 6; }
  const pinta = (encendida) => {
    const l = k.lienzo(AN, AL), c = l.getContext("2d"), azv = azar(semilla + 7);
    for (const e of edificios) {
      const y0 = BASE - e.h;
      const bg = c.createLinearGradient(e.x, 0, e.x + e.w, 0);
      bg.addColorStop(0, color[0]); bg.addColorStop(1, color[1]);
      c.fillStyle = bg; c.fillRect(e.x, y0, e.w, e.h);
      // la nieve del tejado
      c.fillStyle = "rgba(220,232,255,0.85)"; c.fillRect(e.x - 1, y0 - 3, e.w + 2, 4);
      if (e.techo > 0.75) { c.beginPath(); c.moveTo(e.x, y0); c.lineTo(e.x + e.w / 2, y0 - e.w * 0.35); c.lineTo(e.x + e.w, y0); c.closePath(); c.fillStyle = color[0]; c.fill(); c.strokeStyle = "rgba(220,232,255,0.8)"; c.lineWidth = 2; c.stroke(); }
      // las ventanas
      const [vw, vh, sx, sy] = ventana;
      for (let yy = y0 + sy * 0.8; yy < BASE - sy; yy += sy) for (let xx = e.x + sx * 0.5; xx < e.x + e.w - vw - 1; xx += sx) {
        const r = azv();
        if (encendida && r < 0.62) { c.fillStyle = r < 0.1 ? "rgb(255,240,200)" : r < 0.4 ? "rgb(255,200,110)" : "rgb(250,170,80)"; c.fillRect(xx, yy, vw, vh); }
        else { c.fillStyle = "rgba(10,16,30,0.9)"; c.fillRect(xx, yy, vw, vh); }
      }
    }
    if (castillo) {
      // el castillo de tejados verdes (como el Château Frontenac), en medio
      const cx = 800, y0 = BASE - 420;
      c.fillStyle = "#3a3640"; c.fillRect(cx - 150, y0, 300, 420);
      c.fillStyle = "#2f2b34"; c.fillRect(cx - 40, y0 - 120, 80, 120);
      const verde = (x0, yb, w, h) => { const tg = c.createLinearGradient(x0, 0, x0 + w, 0); tg.addColorStop(0, "#2f6a58"); tg.addColorStop(0.5, "#5fa88c"); tg.addColorStop(1, "#244e42"); c.fillStyle = tg; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x0 + w * 0.15, yb - h); c.lineTo(x0 + w * 0.85, yb - h); c.lineTo(x0 + w, yb); c.closePath(); c.fill(); };
      verde(cx - 160, y0, 320, 60); verde(cx - 48, y0 - 120, 96, 110);
      for (const tx of [-150, 130]) { c.fillStyle = "#3a3640"; c.fillRect(cx + tx, y0 - 40, 20, 460); c.fillStyle = "#4f957c"; c.beginPath(); c.moveTo(cx + tx - 4, y0 - 40); c.lineTo(cx + tx + 10, y0 - 110); c.lineTo(cx + tx + 24, y0 - 40); c.closePath(); c.fill(); }
      for (let yy = y0 + 24; yy < BASE - 20; yy += 26) for (let xx = cx - 136; xx < cx + 130; xx += 22) {
        const r = azv(); c.fillStyle = encendida && r < 0.75 ? (r < 0.2 ? "rgb(255,236,190)" : "rgb(255,196,110)") : "rgba(10,16,30,0.9)"; c.fillRect(xx, yy, 9, 13);
      }
    }
    return l;
  };
  return { on: pinta(true), off: pinta(false) };
}
const CAPAS = [
  capa(41, 0, 50, 190, 26, 64, [3, 4, 7, 9], ["#0e1426", "#0a0f1c"]),
  capa(42, 0, 110, 360, 48, 104, [5, 7, 11, 15], ["#141b2e", "#0d1322"], true),
  capa(43, 0, 180, 600, 90, 170, [8, 11, 17, 22], ["#1a2236", "#0f1524"]),
];
const azN = azar(99);
const NIEVE = Array.from({ length: 220 }, () => ({ x: azN() * 1200, y: azN() * 1920, v: 60 + azN() * 120, s: 2 + azN() * 4, f: azN() * 6 }));

export function dibuja(g, t) {
  // la cámara se aleja en «seis millones»
  const zoom = k.mez(1.1, 1, tramo(t, T0, Tseis - 0.2)) * k.mez(1, 0.62, suave(tramo(t, Tseis - 0.2, Tseis + 1.1)));
  const encendida = 1 - suave(tramo(t, T_APAGA, T_APAGA + DUR + 0.3));
  // el cielo, con el resplandor naranja de la ciudad encendida
  const cg = g.createLinearGradient(0, 0, 0, 1300);
  cg.addColorStop(0, "#030612"); cg.addColorStop(0.6, "#0a1430"); cg.addColorStop(1, k.mezColor("#18213a", "#5a3a2c", encendida));
  g.fillStyle = cg; g.fillRect(0, 0, 1080, 1920);
  auroras(g, t, 0.55, 760, AURORA_VERDE);
  // las capas de la ciudad, de lejos a cerca; cada banda se apaga en su momento
  const suelo = 1360;
  CAPAS.forEach((c, q) => {
    const esc = zoom * (0.75 + q * 0.2), ancho = AN * esc, x0 = 540 - ancho / 2, y0 = suelo - BASE * esc + q * 30 * zoom;
    g.drawImage(c.off, x0, y0, ancho, AL * esc);
    for (let b = 0; b < 16; b++) {
      const al = 1 - suave(tramo(t, apagaBanda(q, b), apagaBanda(q, b) + 0.12));
      if (al <= 0.01) continue;
      g.globalAlpha = al;
      g.drawImage(c.on, (b * AN) / 16, 0, AN / 16, AL, x0 + (b * ancho) / 16, y0, ancho / 16 + 0.5, AL * esc);
      g.globalAlpha = 1;
    }
    // la neblina entre capas
    const ng = g.createLinearGradient(0, y0 + BASE * esc - 260 * esc, 0, y0 + BASE * esc);
    ng.addColorStop(0, "rgba(20,30,60,0)"); ng.addColorStop(1, `rgba(20,30,60,${0.35 - q * 0.1})`);
    g.fillStyle = ng; g.fillRect(0, y0 + BASE * esc - 260 * esc, 1080, 260 * esc);
  });
  // el suelo nevado
  const sg = g.createLinearGradient(0, suelo, 0, 1920);
  sg.addColorStop(0, k.mezColor("#4a5a7a", "#8a7060", encendida * 0.6)); sg.addColorStop(0.4, "#1c2438"); sg.addColorStop(1, "#0a0e18");
  g.fillStyle = sg; g.fillRect(0, suelo + 28 * zoom, 1080, 1920);
  // las farolas de la calle, una fila de luces naranjas
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 18; i++) {
    const x = 540 + (i - 8.5) * 120 * zoom, b = Math.floor(((x - (540 - AN * zoom * 1.15 / 2)) / (AN * zoom * 1.15)) * 16);
    const al = 1 - suave(tramo(t, apagaBanda(2, b), apagaBanda(2, b) + 0.12));
    k.brillo(g, x, suelo + 30 * zoom, 110 * zoom, "255,170,80", 0.9 * al);
  }
  // el resplandor de la ciudad
  k.brillo(g, 540, suelo - 150, 2200, "255,150,80", 0.28 * encendida);
  g.restore();
  // la nieve que cae
  g.fillStyle = "rgba(230,238,255,0.7)";
  for (const n of NIEVE) { const y = (n.y + t * n.v) % 1920, x = n.x + Math.sin(t * 1.3 + n.f) * 20 - 60; g.beginPath(); g.arc(x, y, n.s * 0.5, 0, Math.PI * 2); g.fill(); }
  // el año, el reloj y las personas
  const alA = suave(tramo(t, Tano - 0.05, Tano + 0.2)) * (1 - suave(tramo(t, Tque + 0.3, Tque + 0.6)));
  k.pastilla(g, 540, 590, "1989", "", "255,236,190", alA, 120);
  const seg = Math.round(75 * suave(tramo(t, T_APAGA, Tmin + 0.25))), alR = suave(tramo(t, T_APAGA, T_APAGA + 0.25)) * (1 - suave(tramo(t, Tseis - 0.25, Tseis)));
  k.pastilla(g, 540, 590, `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`, "", "255,255,255", alR, 120);
  const alP = suave(tramo(t, Tseis, Tseis + 0.25));
  k.pastilla(g, 540, 590, "6 millones", "", "255,220,160", alP, 100);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,6,18,0.5)"); vg.addColorStop(1, "rgba(3,6,18,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
