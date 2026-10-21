// «Tardaba diez horas en cargarse, para solo media hora de llamada.»
// Un sitio nuevo: el móvil ladrillo enchufado a la pared, con una batería enorme. Una cámara.
// - «diez horas»: la corriente sube por el cable y la batería se llena a la vez que un contador de horas llega a 10 h.
// - «solo media hora de llamada»: un reloj marca media hora, suenan ondas de llamada y la batería se vacía de golpe.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { movilLadrillo } from "../cosas.js";

export const desde = (vz) => vz.frase(3).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(3);
const T0 = f.inicio, Tdiez = f.t("diez"), Tcar = f.t("cargarse"), Tsol = f.t("solo"), Tmed = f.t("media"), Tlla = f.t("llamada");
const FIN = v.frase(4).inicio;

const cam = camino2D([[T0, [1.0, 0, 20]], [FIN, [1.06, 0, 20]]]);
const nivel = (t) => su(tr(t, Tdiez - 0.15, Tcar + 0.2)) * (1 - su(tr(t, Tmed + 0.05, Tlla + 0.45)) * 0.97) + 0.03 * 0;
const horas = (t) => Math.round(10 * su(tr(t, Tdiez - 0.15, Tcar + 0.2)));

const CABLE = [[-150, 600], [-100, 800], [250, 760], [380, 640]];
function punto(u) { // un punto del cable (curva de Bézier de cuatro puntos)
  const [a, b, c, d] = CABLE, m = 1 - u;
  return [m * m * m * a[0] + 3 * m * m * u * b[0] + 3 * m * u * u * c[0] + u * u * u * d[0], m * m * m * a[1] + 3 * m * m * u * b[1] + 3 * m * u * u * c[1] + u * u * u * d[1]];
}

function bateria(g, t, x, y, w, h, nv, txt) {
  g.save(); g.translate(x, y);
  redondo(g, w / 2, -h * 0.2, 36, h * 0.4, 12); g.fillStyle = "#fff"; g.fill();
  redondo(g, -w / 2, -h / 2, w, h, 44); g.fillStyle = "rgba(10,6,30,0.8)"; g.fill();
  g.save(); redondo(g, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 32); g.clip();
  const fw = (w - 28) * nv, col = nv > 0.5 ? "#4aff8a" : nv > 0.22 ? "#ffd24a" : "#ff4a3a";
  const gr = g.createLinearGradient(0, -h / 2, 0, h / 2); gr.addColorStop(0, "#fff"); gr.addColorStop(0.15, col); gr.addColorStop(1, col);
  g.fillStyle = gr; g.fillRect(-w / 2 + 14, -h / 2 + 14, fw, h - 28);
  g.restore();
  redondo(g, -w / 2, -h / 2, w, h, 44); g.strokeStyle = "#fff"; g.lineWidth = 12; g.stroke();
  g.font = "800 120px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.lineWidth = 14; g.strokeStyle = "rgba(10,6,30,0.8)"; g.strokeText(txt, 0, 6); g.fillStyle = "#fff"; g.fillText(txt, 0, 6);
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bg = g.createLinearGradient(0, -1000, 0, 1000); bg.addColorStop(0, "#5a1a9a"); bg.addColorStop(1, "#1a0a40"); g.fillStyle = bg; g.fillRect(-1300, -1500, 2600, 3000);
  k.brillo(g, 0, -250, 1100, "255,90,200", 0.28);
  // la batería y su contador
  const nv = nivel(t), enCarga = t < Tmed;
  const txt = enCarga ? `${horas(t)} h` : (t < Tlla + 0.5 ? "30 min" : "0 %");
  bateria(g, t, 0, -270, 720, 270, nv, txt);
  // el enchufe en la pared
  redondo(g, 340, 560, 150, 150, 30); g.fillStyle = "#f2eee4"; g.fill(); g.strokeStyle = "#a8a290"; g.lineWidth = 6; g.stroke();
  g.fillStyle = "#3a362c"; for (const dx of [-24, 24]) redondo(g, 415 + dx - 8, 608, 16, 54, 6), g.fill();
  // el cable
  g.save(); g.lineCap = "round"; g.strokeStyle = "#1a1a1e"; g.lineWidth = 22; g.beginPath(); g.moveTo(...CABLE[0]); g.bezierCurveTo(...CABLE[1], ...CABLE[2], ...CABLE[3]); g.stroke(); g.restore();
  const cr = su(tr(t, Tdiez - 0.2, Tdiez)) * (1 - su(tr(t, Tcar + 0.25, Tcar + 0.5)));
  if (cr > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 6; i++) { const u = 1 - ((t - Tdiez) * 1.1 + i / 6) % 1; const [px, py] = punto(u); k.brillo(g, px, py, 70, "255,235,120", 0.9 * cr); } g.restore(); }
  // el móvil
  g.save(); g.translate(-210, 310); g.scale(0.82, 0.82);
  const ll = su(tr(t, Tmed, Tmed + 0.3)) * (1 - su(tr(t, FIN - 0.3, FIN)));
  g.translate(3 * Math.sin(t * 50) * ll * su(tr(t, Tlla, Tlla + 0.2)), 0);
  movilLadrillo(g, t, { led: enCarga ? "CARGA" : null });
  g.restore();
  // el reloj de media hora, con su ondas de llamada
  const ra = su(tr(t, Tmed - 0.1, Tmed + 0.3));
  if (ra > 0.01) {
    g.save(); g.translate(250, 330); g.globalAlpha = ra; const e = (0.7 + 0.3 * ra) * 1.2; g.scale(e, e);
    g.beginPath(); g.arc(0, 0, 150, 0, 6.2832); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#ffd24a"; g.lineWidth = 14; g.stroke();
    const sw = su(tr(t, Tmed + 0.05, Tlla + 0.1)) * Math.PI;
    g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 136, -Math.PI / 2, -Math.PI / 2 + sw); g.closePath(); g.fillStyle = "#ff4a3a"; g.fill();
    g.strokeStyle = "#1a1030"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.2832; g.beginPath(); g.moveTo(Math.cos(a) * 126, Math.sin(a) * 126); g.lineTo(Math.cos(a) * 144, Math.sin(a) * 144); g.stroke(); }
    g.lineWidth = 12; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(-Math.PI / 2 + sw) * 110, Math.sin(-Math.PI / 2 + sw) * 110); g.stroke();
    g.restore();
  }
  { const d0 = Tlla - 0.1; g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; for (let n = 0; n < 3; n++) { const d = t - (d0 + n * 0.28); if (d < 0 || d > 0.9) continue; g.strokeStyle = `rgba(120,230,255,${0.9 * (1 - d / 0.9)})`; g.lineWidth = 12; g.beginPath(); g.arc(-210, 100, 140 + d * 260, -2.2, -0.9); g.stroke(); } g.restore(); }
  sinVista(g);
  velo(g, 0.45);
  vineta(g, 0.45);
}

export const momentos = { diez: Tdiez, cargarse: Tcar, media: Tmed, llamada: Tlla };
