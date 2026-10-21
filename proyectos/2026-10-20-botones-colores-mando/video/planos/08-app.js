// «Si quieres probarlo, el link de la app está en la bio.»
// El móvil, de cerca y en la mano, sobre un fondo azul de rayos de colores. Corte en «Si». Una sola cámara.
// - «si quieres probarlo»: el móvil se ilumina y late en ondas.
// - «la app»: sobre el móvil salta el icono de la app, un mandito con una flecha que baja.
// - «el link… en la bio»: «link en la bio», grande, con un fogonazo; queda quieto.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { movilApp, manoMovilDetras, manoMovilDelante } from "../objetos.js";

export const desde = (vz) => vz.frase(13).inicio;

const { suave: su, tramo: tr, redondo } = k;
const f = v.frase(13);
const T0 = f.inicio, Tpro = f.t("probarlo"), Tapp = f.t("app"), Tlink = f.t("link"), Tbio = f.t("bio");
const FIN = v.frase(14).inicio;

const cam = camino2D([[T0, [0.85, 0, -230]], [Tpro + 0.2, [1.0, 0, 0]], [FIN, [1.04, 0, 0]]]);

function icono(g, t) {
  const a = su(tr(t, Tapp - 0.05, Tapp + 0.3));
  if (a <= 0.01) return;
  const bote = 1 + 0.12 * k.pulso(t, Tapp + 0.35, 0.2);
  g.save(); g.translate(0, -370 + 40 * (1 - a) + 10 * Math.sin(t * 3)); g.scale(bote * (0.6 + 0.4 * a), bote * (0.6 + 0.4 * a)); g.globalAlpha = a;
  k.brillo(g, 0, 0, 360, "120,190,255", 0.55);
  redondo(g, -105, -105, 210, 210, 52); const gr = g.createLinearGradient(-105, -105, 105, 105); gr.addColorStop(0, "#5aa0ff"); gr.addColorStop(1, "#2a3ad8"); g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 5; redondo(g, -103, -103, 206, 206, 50); g.stroke();
  // un mandito
  redondo(g, -34, -78, 68, 120, 26); g.fillStyle = "#0a0f24"; g.fill();
  g.fillStyle = "#ff5a50"; g.beginPath(); g.arc(-14, -30, 9, 0, 6.2832); g.fill(); g.fillStyle = "#5aff8a"; g.beginPath(); g.arc(14, -30, 9, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(0, -56, 8, 0, 6.2832); g.fill();
  // la flecha que baja
  const d = 8 * Math.sin(t * 6);
  g.strokeStyle = "#fff"; g.lineWidth = 12; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); g.moveTo(0, 54 + d); g.lineTo(0, 84 + d); g.moveTo(-18, 68 + d); g.lineTo(0, 86 + d); g.lineTo(18, 68 + d); g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bg = g.createLinearGradient(0, -1300, 0, 1300); bg.addColorStop(0, "#050a26"); bg.addColorStop(0.5, "#1a1060"); bg.addColorStop(1, "#050a26");
  g.fillStyle = bg; g.fillRect(-1400, -1900, 2800, 3800);
  g.save(); g.globalCompositeOperation = "lighter"; g.translate(0, 300);
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.2832 + t * 0.05; g.fillStyle = `rgba(${["255,70,60", "50,255,110", "255,225,60", "80,120,255"][i % 4]},0.07)`; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 1800, a, a + 0.16); g.closePath(); g.fill(); }
  g.restore();
  k.brillo(g, 0, 330, 1100, "110,150,255", 0.35);
  // las ondas
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (let n = 0; n < 4; n++) {
    const d = t - (Tpro + n * 0.3); if (d < 0 || d > 1.2) continue;
    const r = 90 + d * 720, al = Math.exp(-d * 1.6) * 0.9;
    g.strokeStyle = `rgba(120,190,255,${al})`; g.lineWidth = 14; g.beginPath(); g.arc(0, -120, r, -Math.PI / 2 - 0.75, -Math.PI / 2 + 0.75); g.stroke();
    g.strokeStyle = `rgba(120,190,255,${al * 0.25})`; g.lineWidth = 44; g.beginPath(); g.arc(0, -120, r, -Math.PI / 2 - 0.75, -Math.PI / 2 + 0.75); g.stroke();
  }
  g.restore();
  const flota = 14 * Math.sin(t * 3.2);
  g.save(); g.translate(0, 330 + flota); g.scale(1.25, 1.25);
  manoMovilDetras(g);
  movilApp(g, t, { luz: Math.max(k.pulso(t, Tpro + 0.2, 0.5), 0.3), flecha: null });
  manoMovilDelante(g, 0, [-88, 124]);
  g.restore();
  icono(g, t);
  sinVista(g);
  const lk = su(tr(t, Tbio - 0.15, Tbio + 0.2));
  if (lk > 0.01) {
    k.pastilla(g, 540, 790, "link en la bio", "", "255,226,160", lk, 92);
    k.fogonazo(g, 540, 790, t - (Tbio - 0.1), 420, "170,210,255");
  }
  { const al = k.pulso(t, Tlink, 0.35); if (al > 0.01) k.brillo(g, 540, 960, 900, "170,210,255", 0.25 * al); }
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { probarlo: Tpro, app: Tapp, link: Tlink, bio: Tbio };
