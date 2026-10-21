// «Y en vez de una cosa, hace cuatro: cámara, linterna, despertador y mapa.»
// Un sitio nuevo: el móvil de hoy, grande, sobre un fondo oscuro. Una cámara.
// - «hace cuatro»: alrededor del móvil salen cuatro insignias de colores, vacías.
// - «cámara»: la pantalla es un visor con su cuadro de enfoque y salta un fogonazo de foto.
// - «linterna»: sale un haz de luz del móvil.
// - «despertador»: suena: el móvil tiembla, con su reloj y ondas.
// - «mapa»: la pantalla es un mapa con su ruta y una chincheta que cae.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { movilHoy, inicioMovil } from "../cosas.js";

export const desde = (vz) => vz.frase(6).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(6);
const T0 = f.inicio, Tcua = f.t("cuatro"), Tcam = f.t("camara"), Tlin = f.t("linterna"), Tdes = f.t("despertador"), Tmap = f.t("mapa");
const FIN = v.frase(7).inicio;
const TS = [Tcam, Tlin, Tdes, Tmap], TE = [Tlin, Tdes, Tmap, FIN];
const COL = ["#4aa8ff", "#ffd24a", "#ff5a4a", "#4aff8a"];
const RGB = ["74,168,255", "255,210,74", "255,90,74", "74,255,138"];
const POS = [[-350, -150], [350, -150], [-350, 560], [350, 560]];

const cam = camino2D([[T0, [1.0, 0, 20]], [FIN, [1.05, 0, 20]]]);
const act = (i, t) => su(tr(t, TS[i] - 0.05, TS[i] + 0.15)) * (1 - su(tr(t, TE[i] - 0.1, TE[i] + 0.1)) * (i < 3 ? 1 : 0));

function icono(g, i, r) {
  g.save(); g.strokeStyle = "#fff"; g.fillStyle = "#fff"; g.lineWidth = r * 0.12; g.lineCap = "round"; g.lineJoin = "round";
  if (i === 0) { redondo(g, -r * 0.55, -r * 0.3, r * 1.1, r * 0.75, r * 0.12); g.stroke(); g.beginPath(); g.arc(0, r * 0.07, r * 0.24, 0, 6.2832); g.stroke(); g.fillRect(-r * 0.2, -r * 0.5, r * 0.4, r * 0.16); }
  if (i === 1) { g.beginPath(); g.moveTo(-r * 0.2, -r * 0.5); g.lineTo(r * 0.2, -r * 0.5); g.lineTo(r * 0.3, -r * 0.1); g.lineTo(-r * 0.3, -r * 0.1); g.closePath(); g.stroke(); g.beginPath(); g.moveTo(-r * 0.12, -r * 0.1); g.lineTo(-r * 0.12, r * 0.5); g.lineTo(r * 0.12, r * 0.5); g.lineTo(r * 0.12, -r * 0.1); g.stroke(); }
  if (i === 2) { g.beginPath(); g.arc(0, r * 0.08, r * 0.46, 0, 6.2832); g.stroke(); g.beginPath(); g.moveTo(0, -r * 0.2); g.lineTo(0, r * 0.08); g.lineTo(r * 0.2, r * 0.2); g.stroke(); for (const s of [-1, 1]) { g.beginPath(); g.arc(s * r * 0.4, -r * 0.34, r * 0.16, 0, 6.2832); g.stroke(); } }
  if (i === 3) { g.beginPath(); g.moveTo(0, r * 0.55); g.bezierCurveTo(-r * 0.6, -r * 0.05, -r * 0.45, -r * 0.55, 0, -r * 0.55); g.bezierCurveTo(r * 0.45, -r * 0.55, r * 0.6, -r * 0.05, 0, r * 0.55); g.stroke(); g.beginPath(); g.arc(0, -r * 0.18, r * 0.16, 0, 6.2832); g.fill(); }
  g.restore();
}

function pantalla(t) {
  return (g, w, h) => {
    inicioMovil(g, w, h, t);
    const a = [0, 1, 2, 3].map((i) => act(i, t));
    // visor de la cámara
    if (a[0] > 0.01) { g.save(); g.globalAlpha = a[0]; const sg = g.createLinearGradient(0, -h / 2, 0, h / 2); sg.addColorStop(0, "#ff9a4a"); sg.addColorStop(0.55, "#ff4a8a"); sg.addColorStop(1, "#2a1a5a"); g.fillStyle = sg; g.fillRect(-w / 2, -h / 2, w, h);
      g.fillStyle = "#ffe27a"; g.beginPath(); g.arc(40, 40, 70, 0, 6.2832); g.fill(); g.fillStyle = "#1a0a3a"; g.beginPath(); g.moveTo(-w / 2, 200); g.lineTo(-100, 60); g.lineTo(40, 200); g.lineTo(150, 100); g.lineTo(w / 2, 220); g.lineTo(w / 2, h / 2); g.lineTo(-w / 2, h / 2); g.closePath(); g.fill();
      const fs = 150 - 40 * su(tr(t, TS[0], TS[0] + 0.25)); g.strokeStyle = "#ffe27a"; g.lineWidth = 6; g.strokeRect(-fs / 2, -fs / 2 + 20, fs, fs);
      g.beginPath(); g.arc(0, h / 2 - 90, 40, 0, 6.2832); g.fillStyle = "#fff"; g.fill(); g.restore(); }
    // linterna
    if (a[1] > 0.01) { g.save(); g.globalAlpha = a[1]; g.fillStyle = "#1a1408"; g.fillRect(-w / 2, -h / 2, w, h); k.brillo(g, 0, 0, 380, "255,230,120", 0.9); g.translate(0, 0); g.scale(2.2, 2.2); icono(g, 1, 60); g.restore(); }
    // despertador
    if (a[2] > 0.01) { g.save(); g.globalAlpha = a[2]; g.fillStyle = "#2a0a14"; g.fillRect(-w / 2, -h / 2, w, h); g.beginPath(); g.arc(0, 0, 120, 0, 6.2832); g.fillStyle = "#fff"; g.fill(); g.strokeStyle = "#ff5a4a"; g.lineWidth = 14; g.stroke();
      g.strokeStyle = "#1a1a24"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -80); g.moveTo(0, 0); g.lineTo(55, 20); g.stroke(); g.font = "800 60px Figtree"; g.fillStyle = "#ff5a4a"; g.textAlign = "center"; g.fillText("7:00", 0, 240); g.restore(); }
    // mapa
    if (a[3] > 0.01) { g.save(); g.globalAlpha = a[3]; g.fillStyle = "#e8f0e0"; g.fillRect(-w / 2, -h / 2, w, h);
      g.fillStyle = "#9ad8a0"; g.fillRect(-w / 2, 120, 150, 200); g.fillStyle = "#9ad0f0"; g.beginPath(); g.moveTo(w / 2, -h / 2); g.lineTo(60, -h / 2); g.quadraticCurveTo(110, 0, w / 2, 90); g.closePath(); g.fill();
      g.strokeStyle = "#fff"; g.lineWidth = 22; for (const [x1, y1, x2, y2] of [[-w / 2, -120, w / 2, -60], [-60, -h / 2, 20, h / 2], [-w / 2, 160, w / 2, 130]]) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
      const ru = su(tr(t, Tmap, Tmap + 0.6)); g.strokeStyle = "#2a6aff"; g.lineWidth = 12; g.lineJoin = "round"; g.beginPath(); const P = [[-110, 270], [-30, 230], [-10, 60], [-20, -60], [60, -90]]; const n = ru * (P.length - 1); g.moveTo(...P[0]); for (let i = 1; i < P.length; i++) { const u = Math.min(1, Math.max(0, n - (i - 1))); if (u <= 0) break; g.lineTo(mez(P[i - 1][0], P[i][0], u), mez(P[i - 1][1], P[i][1], u)); } g.stroke();
      const pc = su(tr(t, Tmap + 0.45, Tmap + 0.75)), pb = Math.abs(Math.sin(Math.PI * tr(t, Tmap + 0.7, Tmap + 1.0))) * 14; g.translate(60, -90 - 300 * (1 - pc) - pb);
      g.fillStyle = "#e01818"; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-50, -60, -40, -120, 0, -120); g.bezierCurveTo(40, -120, 50, -60, 0, 0); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(0, -78, 15, 0, 6.2832); g.fill(); g.restore(); }
  };
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bg = g.createLinearGradient(0, -1000, 0, 1000); bg.addColorStop(0, "#0c1a3e"); bg.addColorStop(1, "#06081c"); g.fillStyle = bg; g.fillRect(-1300, -1500, 2600, 3000);
  k.brillo(g, 0, 200, 1000, "90,120,255", 0.2);
  // el haz de la linterna
  const la = act(1, t);
  if (la > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.5 * la; const bg2 = g.createLinearGradient(0, -130, 0, -760); bg2.addColorStop(0, "rgba(255,235,150,0.9)"); bg2.addColorStop(1, "rgba(255,235,150,0)"); g.fillStyle = bg2; g.beginPath(); g.moveTo(-70, -130); g.lineTo(70, -130); g.lineTo(380, -760); g.lineTo(-380, -760); g.closePath(); g.fill(); g.restore(); }
  // el móvil, con su temblor al sonar el despertador
  const da = act(2, t), tem = da * Math.sin(t * 70) * 7;
  g.save(); g.translate(tem, 230 + 10 * Math.sin(t * 2.2)); g.rotate(0.05 * Math.sin(t * 1.9) * (1 - su(tr(t, Tcua, Tcua + 0.4)))); g.scale(1.1, 1.1);
  movilHoy(g, t, pantalla(t), { luz: 0 });
  g.restore();
  // fogonazo de la foto y ondas del despertador
  { const ff = k.pulso(t, Tcam + 0.25, 0.12); if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 230, 900, "255,255,255", 0.65 * ff); g.restore(); } }
  if (da > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; for (let n = 0; n < 3; n++) { const d = ((t - Tdes) * 1.6 + n / 3) % 1; for (const s of [-1, 1]) { g.strokeStyle = `rgba(255,120,100,${0.8 * (1 - d) * da})`; g.lineWidth = 12; g.beginPath(); g.arc(0, 230, 420 + d * 160, s > 0 ? -0.5 : Math.PI - 0.5 + 0.0, s > 0 ? 0.5 : Math.PI + 0.5); g.stroke(); } } g.restore(); }
  // las cuatro insignias
  POS.forEach(([x, y], i) => {
    const T = Tcua + 0.1 * i, a = su(tr(t, T, T + 0.3)); if (a <= 0.01) return;
    const on = act(i, t), done = su(tr(t, TS[i] - 0.05, TS[i] + 0.15)), e = (0.6 + 0.4 * a) * (1 + 0.28 * (i < 3 ? on : act(i, t)));
    g.save(); g.translate(x, y); g.scale(e, e); g.globalAlpha = a;
    k.brillo(g, 0, 0, 220 + 140 * on, RGB[i], 0.35 + 0.6 * on);
    g.beginPath(); g.arc(0, 0, 90, 0, 6.2832); g.fillStyle = done > 0.5 ? COL[i] : "rgba(12,16,40,0.9)"; g.fill(); g.strokeStyle = COL[i]; g.lineWidth = 10; g.stroke();
    icono(g, i, 90);
    g.restore();
  });
  sinVista(g);
  velo(g, 0.4);
  vineta(g, 0.45);
}

export const momentos = { cuatro: Tcua, camara: Tcam, linterna: Tlin, despertador: Tdes, mapa: Tmap };
