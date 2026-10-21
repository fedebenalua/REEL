// «Envíaselo a ese amigo que nunca ha pulsado el botón rojo.»
// Vuelven los cuatro botones enormes del principio, y el último plano acaba donde empezó el vídeo. Una cámara.
// - «Envíaselo a ese amigo»: entra un mensaje con el vídeo, se envía (✓✓) y sale el nombre del amigo.
// - «nunca ha pulsado»: el mensaje se va y el botón rojo se cubre de polvo, con su telaraña y su araña.
// - «el botón rojo»: la cámara se echa sobre él, enorme, con su anillo de luz. Reposa hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { macro, X, R, rgb } from "../botones.js";

export const desde = (vz) => vz.frase(14).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(14);
const T0 = f.inicio, Tami = f.t("amigo"), Tnun = f.t("nunca"), Tpul = f.t("pulsado"), Troj = f.t("rojo");
const FIN = v.duracion;

const cam = camino2D([[T0, [1.0, 0, -80]], [Tnun + 0.5, [1.0, 0, -80]], [Troj + 0.3, [2.5, -360, 0]], [FIN, [2.5, -360, 0]]]);

function mensaje(g, t) {
  const entra = su(tr(t, T0 - 0.05, T0 + 0.5)), sale = su(tr(t, Tnun + 0.1, Tnun + 0.6));
  const al = entra * (1 - sale); if (al <= 0.01) return;
  g.save(); g.globalAlpha = al; g.translate(mez(900, 0, entra) + 700 * sale, -400 - 30 * sale);
  const W = 800, H = 330;
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 18; redondo(g, -W / 2, -H / 2, W, H, 44); g.fillStyle = "#1d6bff"; g.fill(); g.restore();
  redondo(g, -W / 2, -H / 2, W, H, 44); const gr = g.createLinearGradient(0, -H / 2, 0, H / 2); gr.addColorStop(0, "rgba(255,255,255,0.18)"); gr.addColorStop(0.5, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fill();
  // la miniatura del vídeo
  redondo(g, -W / 2 + 28, -H / 2 + 28, 190, 274, 24); g.fillStyle = "#0a0f24"; g.fill();
  const bx = -W / 2 + 28;
  for (let i = 0; i < 4; i++) { g.fillStyle = ["#e01818", "#18b848", "#e8bc14", "#2a4ae0"][i]; g.beginPath(); g.arc(bx + 38 + i * 38, bx * 0 + 70, 13, 0, 6.2832); g.fill(); }
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.arc(bx + 95, 4, 40, 0, 6.2832); g.fill(); g.fillStyle = "#1d6bff"; g.beginPath(); g.moveTo(bx + 84, -14); g.lineTo(bx + 114, 4); g.lineTo(bx + 84, 22); g.closePath(); g.fill();
  // el nombre del amigo y las líneas del mensaje
  const na = su(tr(t, Tami - 0.05, Tami + 0.3));
  g.save(); g.globalAlpha = al * na; g.translate(14 + 0 * na, -H / 2 + 62);
  g.beginPath(); g.arc(-W / 2 + 280 + 36, 0, 34, 0, 6.2832); g.fillStyle = "#ffd29a"; g.fill(); g.fillStyle = "#3a2210"; g.beginPath(); g.arc(-W / 2 + 280 + 24, -4, 5, 0, 6.2832); g.arc(-W / 2 + 280 + 48, -4, 5, 0, 6.2832); g.fill();
  g.strokeStyle = "#3a2210"; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.arc(-W / 2 + 280 + 36, 6, 14, 0.25, Math.PI - 0.25); g.stroke();
  g.font = "800 44px Figtree"; g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("Ese amigo", -W / 2 + 280 + 84, 2);
  g.restore();
  g.fillStyle = "rgba(255,255,255,0.85)"; redondo(g, -W / 2 + 252, -10, 460, 22, 11); g.fill(); g.globalAlpha = al * 0.6; redondo(g, -W / 2 + 252, 36, 330, 22, 11); g.fill(); g.globalAlpha = al;
  // los dos tics
  const t1 = su(tr(t, T0 + 0.5, T0 + 0.7)), t2 = su(tr(t, Tami + 0.2, Tami + 0.45)), azul = su(tr(t, Tami + 0.5, Tami + 0.8));
  g.lineWidth = 11; g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = `rgba(${Math.round(mez(255, 120, azul))},${Math.round(mez(255, 240, azul))},255,${t1})`; g.beginPath(); g.moveTo(W / 2 - 150, H / 2 - 50); g.lineTo(W / 2 - 130, H / 2 - 30); g.lineTo(W / 2 - 96, H / 2 - 72); g.stroke();
  if (t2 > 0.01) { g.strokeStyle = `rgba(${Math.round(mez(255, 120, azul))},${Math.round(mez(255, 240, azul))},255,${t2})`; g.beginPath(); g.moveTo(W / 2 - 112, H / 2 - 50); g.lineTo(W / 2 - 92, H / 2 - 30); g.lineTo(W / 2 - 58, H / 2 - 72); g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const polvo = [su(tr(t, Tnun + 0.1, Tnun + 1.2)), 0, 0, 0];
  const web = su(tr(t, Tpul - 0.1, Tpul + 0.9));
  const aranaY = t > Tpul ? mez(-1000, -330 + 12 * Math.sin(t * 4), su(tr(t, Tpul, Tpul + 0.8))) : null;
  const preg = [0, 0, 0, 0].map(() => 0);
  macro(g, t, { lit: [0.5, 1, 1, 1], bote: [0, 0, 0, 0], polvo, web, aranaY, preg, fondo: 1 });
  mensaje(g, t);
  // el anillo de luz del botón rojo al nombrarlo
  { const u = (t - Troj) / 1.0; if (u > 0 && u < 1) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(${rgb(0)},${0.9 * (1 - u)})`; g.lineWidth = 12 * (1 - u) + 3; g.beginPath(); g.arc(X[0], 0, R * (1.15 + 1.9 * u), 0, 6.2832); g.stroke(); g.restore(); } }
  { const q = su(tr(t, Tpul, Tpul + 0.5)) * (1 - su(tr(t, Troj - 0.25, Troj + 0.05))); if (q > 0.01) { g.save(); g.globalAlpha = q; g.translate(X[0], -230 - 14 * Math.sin(t * 3)); g.font = "800 140px Figtree"; g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "middle"; g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 20; g.fillText("?", 0, 0); g.restore(); } }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { amigo: Tami, nunca: Tnun, pulsado: Tpul, rojo: Troj };
