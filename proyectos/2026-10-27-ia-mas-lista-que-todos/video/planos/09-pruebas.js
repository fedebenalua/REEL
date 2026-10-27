// «Mientras, ya hay leyes, como la europea, y pruebas a las IA más potentes antes de soltarlas.»
// Otro sitio: un laboratorio oscuro con el chip de la IA sobre un pedestal, dentro de una urna de cristal.
// Corte en «Mientras».
// - Fotograma 0: la urna con el chip encendido dentro; la cámara gira despacio a su alrededor.
// - «leyes, como la europea»: detrás, las doce estrellas de oro de Europa llegan una a una y forman su círculo.
// - «pruebas»: anillos de luz verde suben y bajan por la urna, escaneándolo.
// - «soltarlas»: el cristal sube y se va, y sale una luz verde. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { chip, velo } from "../mundo.js";

const f8 = v.frase(8);
export const desde = f8.inicio;

const { suave, tramo, mez } = k;
const T0 = f8.inicio, Tley = f8.t("leyes"), Teur = f8.t("europea"), Tpru = f8.t("pruebas"), Tant = f8.t("antes"), Tsol = f8.t("soltarlas"), Tfin = v.frase(9).inicio;

const camara = k.ruta([
  [T0, { pos: k.orbita(-0.35, 27, 9), mira: [0, 5, 0] }],
  [Tfin, { pos: k.orbita(0.25, 25, 10), mira: [0, 5, 0] }],
]);
const RU = 6.2, HU = 11;

function estrella(g, x, y, r, al) {
  g.save(); g.globalAlpha = al; g.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.4 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
  g.closePath(); g.fillStyle = "#ffd84a"; g.shadowColor = "rgba(255,210,80,0.9)"; g.shadowBlur = r * 0.8; g.fill(); g.restore();
}

export function dibuja(g, t) {
  const cam = camara(t);
  // la sala: azul oscuro, con un suelo que refleja
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#050914"); fg.addColorStop(0.55, "#0b1530"); fg.addColorStop(1, "#04060c");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  // las estrellas de Europa: un círculo detrás de la urna, con un halo azul
  const Ce = k.proyecta(cam, [0, 6, -9]);
  if (Ce) {
    const R = (k.F * 7.5) / Ce.z, llega = suave(tramo(t, Tley - 0.2, Teur + 0.3));
    k.brillo(g, Ce.x, Ce.y, R * 3.4, "40,80,220", 0.9 * llega);
    for (let i = 0; i < 12; i++) {
      const u = suave(tramo(t, Tley - 0.2 + i * 0.07, Tley + 0.15 + i * 0.07)), a = -Math.PI / 2 + (i / 12) * Math.PI * 2 + 0.08 * (t - T0);
      const r = R * mez(1.8, 1, u);
      estrella(g, Ce.x + Math.cos(a) * r, Ce.y + Math.sin(a) * r, (k.F * 0.85) / Ce.z, u);
    }
  }
  // el suelo con la luz del pedestal
  const S = k.proyecta(cam, [0, 0, 0]);
  if (S) k.brillo(g, S.x, S.y, (k.F * 40) / S.z, "80,170,255", 0.35);
  // el pedestal
  const P0 = k.proyecta(cam, [0, 0, 0]), P1 = k.proyecta(cam, [0, 3, 0]), Px = k.proyecta(cam, [3, 0, 0]);
  if (P0 && P1 && Px) {
    const w = Math.abs(Px.x - P0.x) * 1.2, ry = w * 0.25;
    g.beginPath(); g.ellipse(P0.x, P0.y, w, ry, 0, 0, Math.PI); g.lineTo(P1.x - w, P1.y); g.ellipse(P1.x, P1.y, w, ry, 0, Math.PI, 0, true); g.closePath();
    k.metal(g, P0.x - w, P0.x + w, ["#1a1f2a", "#5d6678", "#262c38", "#7e889a", "#1a1f2a"]);
    g.beginPath(); g.ellipse(P1.x, P1.y, w, ry, 0, 0, Math.PI * 2); g.fillStyle = "#2c3342"; g.fill();
  }
  chip(g, cam, [0, 3.4, 0], t, { e: 0.36, luz: 1.3 });
  // la urna: sube y se va en «soltarlas»
  const sube = mez(0, 30, suave(tramo(t, Tsol - 0.1, Tsol + 0.6)));
  const U0 = k.proyecta(cam, [0, sube, 0]), U1 = k.proyecta(cam, [0, sube + HU, 0]), Ux = k.proyecta(cam, [RU, sube, 0]);
  if (U0 && U1 && Ux) {
    const w = Math.abs(Ux.x - U0.x) * 1.05, ry = w * 0.24;
    g.beginPath(); g.ellipse(U0.x, U0.y, w, ry, 0, 0, Math.PI); g.lineTo(U1.x - w, U1.y); g.ellipse(U1.x, U1.y, w, ry, 0, Math.PI, 0, true); g.closePath();
    k.vidrio(g, U0.x - w, U0.x + w, 0.55);
    g.save(); g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 3; g.beginPath(); g.ellipse(U1.x, U1.y, w, ry, 0, 0, Math.PI * 2); g.stroke(); g.restore();
    k.reflejo(g, U0.x - w * 0.7, U1.y + 20, 26, U0.y - U1.y - 40, 0.22);
    // los anillos que escanean
    const esc = suave(tramo(t, Tpru - 0.15, Tpru + 0.2)) * (1 - suave(tramo(t, Tsol - 0.3, Tsol)));
    if (esc > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter";
      for (let q = 0; q < 3; q++) {
        const h = (0.5 - 0.5 * Math.cos((t - Tpru) * 2.6 + q * 2.1)) * HU, A = k.proyecta(cam, [0, sube + h, 0]);
        if (!A) continue;
        g.strokeStyle = `rgba(120,255,170,${0.9 * esc})`; g.lineWidth = 6; g.beginPath(); g.ellipse(A.x, A.y, w * 0.98, ry * 0.98, 0, 0, Math.PI * 2); g.stroke();
        g.strokeStyle = `rgba(120,255,170,${0.25 * esc})`; g.lineWidth = 30; g.stroke();
      }
      g.restore();
    }
  }
  // la luz verde de salida
  const C = k.proyecta(cam, [0, 4, 0]);
  if (C) k.brillo(g, C.x, C.y, 1300, "120,255,170", 0.6 * k.pulso(t, Tsol + 0.35, 0.35));
  velo(g);
}
