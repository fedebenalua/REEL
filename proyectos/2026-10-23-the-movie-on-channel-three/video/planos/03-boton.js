// El botón elige la antena o la emisora falsa. Luego la misma tele se aplana:
// el cable lleva la imagen, el botón de fuente elige uno, y el móvil se queda con el mando.
import * as k from "#kit";
import { v } from "#voz";
import { aplica, sala, tele, pelicula, numero, torre, mando, cableGrueso, movil, velo, cinta } from "../mundo.js";

export const desde = "button";

const { suave: su, tramo: tr, mez } = k;
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const Tanten = f7.t("antenna");
const Tfake = f7.t("fake");
const Tchannel = f8.t("channel");
const Tthrough = f8.t("through");
const Tcable = f9.t("cable");
const Tpicks = f10.t("picks");
const Tapp = f11.t("app");
const Tthree = f12.t("three");

function pantalla(g, sx, sy, sw, sh, t) {
  const antena = su(tr(t, Tanten - 0.1, Tanten + 0.35)) * (1 - su(tr(t, Tfake - 0.08, Tfake + 0.3)));
  const pelo = 1 - antena;
  if (pelo > 0.02) pelicula(g, sx, sy, sw, sh, t, pelo);
  if (antena > 0.02) {
    g.save();
    g.globalAlpha *= antena;
    g.fillStyle = "#9bb0c4";
    g.fillRect(sx, sy, sw, sh);
    // nieve
    g.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 40; i++) {
      const px = sx + ((i * 97 + t * 400) % sw);
      const py = sy + ((i * 53) % sh);
      g.fillRect(px, py, 8, 3);
    }
    // una antena de tejado
    g.strokeStyle = "#1c2430";
    g.lineWidth = 8;
    const ax = sx + sw * 0.5, ay = sy + sh * 0.72;
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(ax, sy + sh * 0.22);
    g.moveTo(ax - 50, sy + sh * 0.38);
    g.lineTo(ax + 50, sy + sh * 0.3);
    g.moveTo(ax - 36, sy + sh * 0.48);
    g.lineTo(ax + 36, sy + sh * 0.42);
    g.stroke();
    g.restore();
  }
  // el número se despega en «channel»
  const despega = su(tr(t, Tchannel - 0.15, Tchannel + 0.7));
  const numAl = (1 - su(tr(t, f9.inicio, f9.inicio + 0.35))) * (t < f9.inicio + 0.45 ? 1 : 0);
  if (numAl > 0.02 && t < Tcable) {
    const crece = su(tr(t, Tchannel - 0.2, Tchannel + 0.25));
    numero(g, "4", sx + sw / 2, sy + sh * mez(0.46, -0.42, despega), sh * mez(0.55, 0.95, crece), numAl);
    if (despega > 0.08) cinta(g, sx + sw / 2, sy + sh * 0.58, mez(0.15, 1.35, despega) * (sw / 640), 0);
  }
  // al final, el 3 del principio vuelve a partirse, igual que el fotograma 0
  const vuelve = su(tr(t, Tthree - 0.2, Tthree + 0.4));
  if (vuelve > 0.02) {
    const sep = mez(10, 34, vuelve);
    g.save();
    g.beginPath();
    g.rect(sx, sy, sw / 2, sh);
    g.clip();
    numero(g, "3", sx + sw / 2 - sep, sy + sh / 2, sh * 0.72, vuelve);
    g.restore();
    g.save();
    g.beginPath();
    g.rect(sx + sw / 2, sy, sw / 2, sh);
    g.clip();
    numero(g, "3", sx + sw / 2 + sep, sy + sh / 2, sh * 0.72, vuelve);
    g.restore();
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha *= 0.8 * vuelve;
    g.fillStyle = "#fff6d0";
    g.fillRect(sx + sw / 2 - 16, sy, 32, sh);
    g.restore();
  }
}

export function dibuja(g, t) {
  const moderno = su(tr(t, f9.inicio - 0.05, Tcable + 0.15));
  const alFuente = su(tr(t, f10.inicio, f10.inicio + 0.35));
  const alMovil = su(tr(t, Tapp - 0.15, Tapp + 0.45));
  // en «three» la cámara entra en el 3 partido, para caer en el fotograma 0
  const zoomFin = su(tr(t, Tthree - 0.12, Tthree + 0.55));
  // entra en la pantalla cuando el 4 se despega, y vuelve antes del cable
  const zoomCanal = su(tr(t, Tchannel - 0.25, Tchannel + 0.35)) * (1 - su(tr(t, Tchannel + 0.7, Tthrough - 0.35)));
  const z = mez(mez(mez(1.02, 1.08, moderno), 1.48, zoomCanal), 2.32, zoomFin);
  const fy = mez(mez(940, 800, zoomCanal), 790, zoomFin);
  aplica(g, 540, fy, z);
  sala(g);

  tele(g, {
    x: 540, y: mez(820, 760, moderno), giro: 0, moderno, t,
    pinta: (gg, sx, sy, sw, sh) => pantalla(gg, sx, sy, sw, sh, t),
  });

  // la torre pequeña, hasta que el cable de ahora se la come
  const hTorre = mez(240, 0, moderno);
  if (hTorre > 4) torre(g, 250, 1240, hTorre, t, "#f2c14e");

  // el paso del cable: en «through» la luz de la torre entra
  const pasa = su(tr(t, Tthrough - 0.25, Tthrough + 0.35));
  if (moderno < 0.5 && pasa > 0.02) {
    const u = pasa;
    const omt = 1 - u;
    const px = omt * omt * 250 + 2 * omt * u * 400 + u * u * 540;
    const py = omt * omt * 1000 + 2 * omt * u * 860 + u * u * 780;
    g.save();
    g.globalAlpha = (1 - moderno);
    g.strokeStyle = "rgba(242,193,78,0.9)";
    g.lineWidth = 28;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(250, 1000);
    g.quadraticCurveTo(400, 860, px, py);
    g.stroke();
    g.globalCompositeOperation = "lighter";
    const br = g.createRadialGradient(px, py, 8, px, py, 150);
    br.addColorStop(0, "rgba(255,244,200,0.95)");
    br.addColorStop(1, "rgba(242,193,78,0)");
    g.fillStyle = br;
    g.beginPath();
    g.arc(px, py, 150, 0, 6.2832);
    g.fill();
    g.restore();
  }

  // el cable de ahora, y luego tres
  if (moderno > 0.05) {
    const colores = ["80,220,255", "255,80,150", "255,190,60"];
    const xs = [360, 540, 760];
    const elegido = su(tr(t, Tpicks - 0.05, Tpicks + 0.35));
    const n = alFuente > 0.2 ? 3 : 1;
    for (let i = 0; i < n; i++) {
      const entra = i === 0 ? moderno : su(tr(t, f10.inicio + i * 0.12, f10.inicio + 0.28 + i * 0.12));
      const apaga = n === 3 && elegido > 0.4 && i !== 1 ? 0.35 : 1;
      g.save();
      g.globalAlpha = entra * apaga;
      cableGrueso(g, xs[i], 1500, 540, 980, t + i, colores[i]);
      g.restore();
    }
  }

  // el mando, a un lado para no tapar la pantalla ni el borde de los botones, y luego el móvil
  const hundido = Math.max(k.pulso(t, f7.t("chose"), 0.12), k.pulso(t, Tpicks, 0.12));
  const sMando = mez(1.02, 0, alMovil);
  if (sMando > 0.05 && zoomFin < 0.85) mando(g, 250, 1120, sMando, hundido);
  if (alMovil > 0.02 && zoomFin < 0.9) movil(g, 620, mez(1760, 1080, alMovil), mez(0.22, 0.84, alMovil), t);

  velo(g);
}
