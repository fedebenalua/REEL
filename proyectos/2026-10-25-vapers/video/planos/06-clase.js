// «En España, la mitad de los chavales de catorce a dieciocho ya lo ha probado.»
// La clase, vista desde el fondo: cuatro filas de pupitres con chavales de espaldas, la pizarra al frente, la luz de
// las ventanas entrando por la izquierda.
// - «En»: corte aquí; la clase quieta, con un ligero balanceo de cabezas.
// - «mitad»: uno de cada dos se enciende: una nubecita rosa y azul le sube de la cabeza, y su silueta coge color.
// - «catorce a dieciocho»: «14-18 años»; «probado»: todo reposa. Corte en «Y».
import * as k from "#kit";
import { v } from "#voz";
import { fondo, nube, velo, ROSA, AZUL, LILA } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tmit = f7.t("mitad"), Tcat = f7.t("catorce"), Tdie = f7.t("dieciocho"), Tpro = f7.t("probado"), Fin = f7.fin;
export const momentos = { mitad: Tmit, edad: Tcat };

// una perspectiva sencilla: X a lo ancho (m), Z de fondo (m), H alto sobre el suelo (m)
const FOC = 1200, ZC = 0.9, HOR = 560, OJO = 2.3;
const P = (X, Z, H) => ({ x: 540 + (X * FOC) / (Z + ZC), y: HOR + ((OJO - H) * FOC) / (Z + ZC), s: FOC / (Z + ZC) });
const az = azar(77);
const FILAS = [5.5, 3.7, 2.2, 0.9], COLS = [-0.9, 0, 0.9];
const ALUMNOS = [];
FILAS.forEach((Z, fi) => COLS.forEach((X, ci) => ALUMNOS.push({ X: X + (az() - 0.5) * 0.1, Z, i: ALUMNOS.length, vapea: (fi + ci) % 2 === 0, tono: ["#2a2340", "#1f2a3c", "#33223a", "#242e2e"][Math.floor(az() * 4)], pelo: ["#1a1410", "#3a2a1a", "#241a14", "#0e0c0c"][Math.floor(az() * 4)], f: az() * 6.28, alto: 0.95 + az() * 0.12 })));
ALUMNOS.sort((a, b) => b.Z - a.Z);
const VAPEAN = ALUMNOS.filter((a) => a.vapea).sort((a, b) => a.i - b.i);
VAPEAN.forEach((a, j) => (a.t0 = Tmit - 0.1 + j * 0.06));

function pupitre(g, X, Z) {
  const w = 0.42, d = 0.3, h = 0.72;
  const a = P(X - w, Z - d, h), b = P(X + w, Z - d, h), c = P(X + w, Z + d, h), e = P(X - w, Z + d, h);
  g.fillStyle = "#6e5a44"; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(e.x, e.y); g.closePath(); g.fill();
  const a2 = P(X - w, Z - d, h - 0.08), b2 = P(X + w, Z - d, h - 0.08);
  g.fillStyle = "#4a3a2a"; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(b2.x, b2.y); g.lineTo(a2.x, a2.y); g.closePath(); g.fill();
  g.strokeStyle = "#3a3a44"; g.lineWidth = Math.max(2, a.s * 0.02);
  for (const [px, pz] of [[X - w + 0.05, Z - d + 0.05], [X + w - 0.05, Z - d + 0.05]]) { const p0 = P(px, pz, h - 0.08), p1 = P(px, pz, 0); g.beginPath(); g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.stroke(); }
}

function alumno(g, t, a, luz) {
  const c = P(a.X, a.Z, 0), s = c.s;
  const bal = Math.sin(t * 0.8 + a.f) * 0.015;
  // el cuerpo: hombros y espalda; la cabeza
  const hom = P(a.X + bal, a.Z, 1.0 * a.alto), cab = P(a.X + bal * 1.5, a.Z, 1.27 * a.alto);
  g.save();
  if (luz > 0) { g.shadowColor = `rgba(${ROSA},${0.9 * luz})`; g.shadowBlur = 40 * luz; }
  const cg = g.createLinearGradient(hom.x - s * 0.3, 0, hom.x + s * 0.3, 0); cg.addColorStop(0, k.mezColor(a.tono, "#000000", 0.4)); cg.addColorStop(0.5, k.mezColor(a.tono, "#ff6ec8", 0.25 * luz)); cg.addColorStop(1, k.mezColor(a.tono, "#000000", 0.3));
  g.fillStyle = cg; k.redondo(g, hom.x - s * 0.3, hom.y, s * 0.6, s * 0.55, s * 0.14); g.fill();
  // la silla, debajo
  g.shadowColor = "rgba(0,0,0,0)";
  const asiento = P(a.X + bal, a.Z, 0.45), suelo = P(a.X + bal, a.Z, 0.02);
  g.fillStyle = "#1c1a24"; g.fillRect(asiento.x - s * 0.27, asiento.y, s * 0.54, s * 0.07);
  g.fillStyle = "#2a2733"; for (const dx of [-0.22, 0.22]) g.fillRect(asiento.x + dx * s - s * 0.015, asiento.y, s * 0.03, suelo.y - asiento.y);
  // el cuello y la cabeza
  g.fillStyle = "#b07a5a"; g.fillRect(cab.x - s * 0.05, cab.y, s * 0.1, hom.y - cab.y + 4);
  g.fillStyle = a.pelo; g.beginPath(); g.arc(cab.x, cab.y, s * 0.14, 0, 6.2832); g.fill();
  g.restore();
}

export function dibuja(g, t) {
  fondo(g, t, "#1b1a2a");
  // la cámara avanza muy despacio entre las filas
  const zc = mez(1, 1.1, tr(t, T0, Fin + 0.3));
  g.save(); g.translate(540, 1000); g.scale(zc, zc); g.translate(-540, -1000);
  // la pared del fondo y la pizarra
  g.fillStyle = "#2a2838"; g.fillRect(0, 0, 1080, HOR + 60);
  const piz = [P(-2.3, 7, 2.3), P(2.3, 7, 2.3), P(2.3, 7, 1.0), P(-2.3, 7, 1.0)];
  g.fillStyle = "#1e3a30"; g.fillRect(piz[0].x, piz[0].y, piz[1].x - piz[0].x, piz[2].y - piz[1].y);
  g.strokeStyle = "#6b5a3a"; g.lineWidth = 8; g.strokeRect(piz[0].x, piz[0].y, piz[1].x - piz[0].x, piz[2].y - piz[1].y);
  g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 3; for (let i = 0; i < 4; i++) { const y = piz[0].y + 22 + i * 24; g.beginPath(); g.moveTo(piz[0].x + 30, y); g.lineTo(piz[0].x + 30 + 90 + (i % 2) * 70, y); g.stroke(); }
  // el suelo
  const sg = g.createLinearGradient(0, HOR, 0, 1920); sg.addColorStop(0, "#3a3346"); sg.addColorStop(1, "#15121c");
  g.fillStyle = sg; g.fillRect(0, HOR + 40, 1080, 1920 - HOR);
  g.strokeStyle = "rgba(255,255,255,0.06)"; g.lineWidth = 2;
  for (let X = -4; X <= 4; X += 0.5) { const p0 = P(X, 7, 0), p1 = P(X, -1.2, 0); g.beginPath(); g.moveTo(p0.x, p0.y); g.lineTo(p1.x, p1.y); g.stroke(); }
  // la luz de las ventanas, por la izquierda
  g.save(); g.globalCompositeOperation = "lighter"; const lg = g.createLinearGradient(0, 0, 700, 0); lg.addColorStop(0, "rgba(200,220,255,0.16)"); lg.addColorStop(1, "rgba(200,220,255,0)"); g.fillStyle = lg; g.fillRect(0, 0, 700, 1920); g.restore();
  // los pupitres y los chavales, de lejos a cerca
  for (const a of ALUMNOS) {
    pupitre(g, a.X, a.Z + 0.6);
    const luz = a.vapea ? su(tr(t, a.t0, a.t0 + 0.35)) : 0;
    alumno(g, t, a, luz);
    if (luz > 0) { const cab = P(a.X, a.Z, 1.27 * a.alto); nube(g, t, cab.x, cab.y - cab.s * 0.22, -Math.PI / 2, tr(t, a.t0, a.t0 + 0.9), { n: 24, semilla: 500 + a.i, esc: cab.s / 900 * 0.5, alcance: 600, al: 1.5, colores: [ROSA, AZUL, LILA] }); }
  }
  g.restore();
  // «14-18 años»
  const alE = su(tr(t, Tcat - 0.05, Tcat + 0.15));
  k.pastilla(g, 540, 640, "14-18", "años", "255,255,255", alE, 120);
  velo(g, 0.55);
}
