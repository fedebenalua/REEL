// «Tu dedo es conductor, porque está lleno de agua con sales, y se lleva parte de ese campo. /
//  El móvil nota ese cambio en un cruce, y así sabe justo dónde estás tocando. /
//  Un bolígrafo es de plástico: no conduce, y el campo pasa como si no estuviera.»
// Un sitio nuevo: la pantalla cortada por la mitad, de lado: el cristal, los dos electrodos y, encima, el aire. Una cámara fija.
// - «Tu dedo»: baja un dedo. «agua con sales»: dentro se ven gotas y cristalitos de sal.
// - «se lleva»: el dedo toca el cristal y los arcos del campo se doblan hacia él; el medidor baja.
// - «cambio»: el medidor se enciende. «cruce»: sale arriba un mapa pequeño de la rejilla con el cruce marcado; «dónde»: la mira y sus coordenadas.
// - «bolígrafo»: el dedo sube y baja un bolígrafo; toca, y los arcos siguen igual, pasan por dentro; el medidor no baja.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, corte, campo, EL, dedo, boli, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const { suave: su, tramo: tr, mez, redondo, azar } = k;
const F5 = v.frase(5), F6 = v.frase(6), F7 = v.frase(7);
const T0 = F5.inicio, Tcon = F5.t("conductor"), Tagu = F5.t("agua"), Tsal = F5.t("sales"), Tlle = F5.t("lleva"), Tcam5 = F5.t("campo");
const Tcmb = F6.t("cambio"), Tcru = F6.t("cruce"), Tdon = F6.t("donde");
const Tbol = F7.t("boligrafo"), Tpla = F7.t("plastico"), Tnoc = F7.t("conduce"), Tcam7 = F7.t("campo"), Tsin = F7.t("estuviera");
const FIN = v.frase(8).inicio;
const TOCA = Tlle - 0.1, SUBE = F7.inicio + 0.05, TPEN = Tpla + 0.15;

// la altura de la punta del dedo (0 = tocando el cristal) y la del bolígrafo
function hDedo(t) {
  if (t < TOCA - 0.5) return mez(900, 300, su(tr(t, T0, Tcon + 0.6))) + 14 * Math.sin(t * 2.4);
  if (t < SUBE) return mez(300, 0, su(tr(t, TOCA - 0.5, TOCA + 0.1)));
  return mez(0, 900, su(tr(t, SUBE, SUBE + 0.7)));
}
const hPen = (t) => (t < Tbol + 0.2 ? 900 : t < TPEN ? mez(900, 0, su(tr(t, Tbol + 0.2, TPEN))) : 0);

const cam = [1.25, 0, -150];

function dedoLado(g, h, t) {
  // un dedo de lado, apuntando hacia abajo: la punta ancha y blanda sobre el cristal
  const y = -h, w = 150, aguaA = su(tr(t, Tagu - 0.05, Tagu + 0.4)), salA = su(tr(t, Tsal - 0.05, Tsal + 0.4));
  g.save(); g.translate(0, y);
  g.beginPath(); g.moveTo(-w / 2 - 10, -1400); g.lineTo(-w / 2, -70); g.arc(0, -70, w / 2, Math.PI, 0, true); g.lineTo(w / 2 + 10, -1400); g.closePath();
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, "#f7cfa8"); gr.addColorStop(0.5, "#f1b88c"); gr.addColorStop(1, "#c98a60");
  g.fillStyle = gr; g.fill(); g.lineWidth = 6; g.strokeStyle = "rgba(255,255,255,0.5)"; g.stroke();
  g.save(); g.clip();
  // dentro: gotas de agua y cristalitos de sal
  const az = azar(41);
  for (let i = 0; i < 16; i++) {
    const bx = (az() - 0.5) * 100, by = -400 + az() * 360, ph = az() * 6.2832, dx = Math.sin(t * 1.3 + ph) * 10, dy = Math.cos(t * 1.1 + ph) * 10;
    if (i < 10) { const a = aguaA; g.globalAlpha = a; g.fillStyle = "rgba(70,170,255,0.9)"; g.beginPath(); g.arc(bx + dx, by + dy, 14, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(bx + dx - 4, by + dy - 5, 4.5, 0, 6.2832); g.fill(); }
    else { g.globalAlpha = salA; g.save(); g.translate(bx + dx, by + dy); g.rotate(ph); g.fillStyle = "#fff"; g.fillRect(-9, -9, 18, 18); g.strokeStyle = "rgba(120,160,255,0.9)"; g.lineWidth = 3; g.strokeRect(-9, -9, 18, 18); g.restore(); }
  }
  g.restore();
  g.restore();
}
function penLado(g, h, al) {
  g.save(); g.globalAlpha = al; g.translate(0, -h); g.rotate(Math.PI); g.scale(1.1, 1.1); boli(g, 0); g.restore();
}

export function dibuja(g, t) {
  vista(g, cam[0], cam[1], cam[2]);
  // el fondo
  const bg = g.createLinearGradient(0, -900, 0, 500); bg.addColorStop(0, "#0a1230"); bg.addColorStop(1, "#1a2a6a"); g.fillStyle = bg; g.fillRect(-700, -1300, 1400, 2200);
  k.brillo(g, 0, 0, 1800, "80,140,255", 0.25);
  corte(g, t, {});
  const hd = hDedo(t), hp = hPen(t);
  const dedoViene = t < SUBE + 0.9, penViene = t > Tbol;
  // cuánto campo se lleva el dedo
  const e = (t < SUBE ? su(tr(t, TOCA + 0.1, TOCA + 1.0)) * 1 + 0.15 * su(tr(t, Tcon, Tcon + 0.6)) * (1 - su(tr(t, TOCA, TOCA + 0.1))) : 1 - su(tr(t, SUBE, SUBE + 0.5)));
  // el pen no se lleva nada
  const fy = -hd - 30;
  // el bolígrafo, por detrás de los arcos: los arcos pasan por encima, como si no estuviera
  const penAl = 1 - 0.65 * su(tr(t, Tcam7, Tsin + 0.3));
  if (penViene) penLado(g, hp, penAl);
  campo(g, t, Math.min(1, e), 0, fy, 1);
  if (dedoViene) dedoLado(g, hd, t);
  // las cargas que se escapan al dedo (puntitos amarillos que suben)
  if (e > 0.2 && t < SUBE + 0.5) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 10; i++) { const side = i % 2 ? 1 : -1, p = (t * 0.9 + i * 0.1) % 1, x = mez(side * 170, side * 30, p), y = mez(EL.y - 4, fy + 20, Math.pow(p, 0.7)) - Math.sin(p * 3.14) * 80; k.brillo(g, x, y, 60, "255,235,120", 0.9 * e * (1 - p * 0.4)); } g.restore(); }
  // el golpe al tocar el cristal
  const ff = k.pulso(t, TOCA + 0.1, 0.1) * 0.5 + k.pulso(t, TPEN + 0.02, 0.1) * 0.25;
  if (ff > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 0, 500, "255,255,255", ff); g.restore(); }
  // el mapa pequeño de la rejilla (arriba a la derecha) cuando el móvil «sabe dónde»
  const pa = su(tr(t, Tcru, Tcru + 0.4)) * (1 - su(tr(t, SUBE, SUBE + 0.4)));
  if (pa > 0.01) {
    g.save(); g.globalAlpha = pa; g.translate(250, -400); g.scale(0.8, 0.8);
    redondo(g, -190, -150, 380, 300, 26); g.fillStyle = "rgba(10,20,60,0.85)"; g.fill(); g.strokeStyle = "rgba(120,180,255,0.7)"; g.lineWidth = 5; g.stroke();
    g.strokeStyle = "rgba(90,200,255,0.8)"; g.lineWidth = 4; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-160, -110 + i * 44); g.lineTo(160, -110 + i * 44); g.stroke(); }
    g.strokeStyle = "rgba(255,110,200,0.8)"; for (let j = 0; j < 8; j++) { g.beginPath(); g.moveTo(-154 + j * 44, -120); g.lineTo(-154 + j * 44, 100); g.stroke(); }
    // el cruce que se enciende
    const nx = -154 + 3 * 44, ny = -110 + 3 * 44, la = su(tr(t, Tcru + 0.2, Tcru + 0.6));
    g.globalCompositeOperation = "lighter"; k.brillo(g, nx, ny, 190, "255,235,150", 0.95 * la); g.globalCompositeOperation = "source-over";
    g.fillStyle = "#fff"; g.beginPath(); g.arc(nx, ny, 11 * (0.6 + 0.4 * la), 0, 6.2832); g.fill();
    const mi = su(tr(t, Tdon - 0.05, Tdon + 0.35));
    if (mi > 0.01) {
      g.strokeStyle = `rgba(255,70,70,${mi})`; g.lineWidth = 6; const rr = 46 + 30 * (1 - mi); g.beginPath(); g.arc(nx, ny, rr, 0, 6.2832); g.stroke();
      g.beginPath(); g.moveTo(nx - rr - 22, ny); g.lineTo(nx - rr + 20, ny); g.moveTo(nx + rr - 20, ny); g.lineTo(nx + rr + 22, ny); g.moveTo(nx, ny - rr - 22); g.lineTo(nx, ny - rr + 20); g.moveTo(nx, ny + rr - 20); g.lineTo(nx, ny + rr + 22); g.stroke();
      g.font = "800 40px Figtree"; g.textAlign = "center"; g.fillStyle = `rgba(255,255,255,${mi})`; g.fillText("x 4 · y 7", 0, 134);
    }
    g.restore();
  }
  sinVista(g);
  // el medidor de abajo: cuánto campo queda en el cruce
  const ga = 1, val = 100 - 42 * e;
  const alerta = k.pulso(t, Tcmb + 0.1, 0.18) * 1 * (t < SUBE ? 1 : 0);
  g.save(); g.translate(540, 1745);
  g.font = "800 48px Figtree"; g.textAlign = "center"; g.fillStyle = "rgba(255,255,255,0.9)"; g.fillText("campo en el cruce", 0, -66);
  redondo(g, -400, -30, 800, 58, 29); g.fillStyle = "rgba(255,255,255,0.14)"; g.fill();
  g.save(); redondo(g, -400, -30, 800, 58, 29); g.clip(); const mg = g.createLinearGradient(-400, 0, 400, 0); mg.addColorStop(0, "#ffb02e"); mg.addColorStop(1, "#ffe27a"); g.fillStyle = mg; g.fillRect(-400, -30, 8 * val, 58); g.restore();
  if (alerta > 0.01) { g.globalCompositeOperation = "lighter"; g.strokeStyle = `rgba(255,70,70,${alerta})`; g.lineWidth = 12; redondo(g, -410, -40, 820, 78, 38); g.stroke(); k.brillo(g, 0, 0, 900, "255,70,70", 0.35 * alerta); }
  g.restore();
  // los rótulos de lo que es cada cosa
  k.etiqueta(g, 560, 300 + 1 * 0, "", "255,255,255", 0, 10);
  const ca = su(tr(t, Tagu, Tagu + 0.3)) * (1 - su(tr(t, SUBE, SUBE + 0.4)));
  k.etiqueta(g, 660, 900, "agua + sales", "120,210,255", ca, 52);
  const cp = su(tr(t, Tpla - 0.05, Tpla + 0.3));
  k.etiqueta(g, 660, 900, "plástico", "200,205,225", cp, 52);
  const np = su(tr(t, Tnoc, Tnoc + 0.3));
  k.etiqueta(g, 70, 1640, "sin cambio", "150,255,170", np * su(tr(t, Tcam7, Tcam7 + 0.01)) * 0 + su(tr(t, Tcam7 + 0.1, Tcam7 + 0.5)), 52);
  velo(g, 0.4);
  vineta(g, 0.45);
}

export const momentos = { conductor: Tcon, agua: Tagu, cambio: Tcmb, plastico: Tpla };
