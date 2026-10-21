// «Eso gasta muy poco: menos de un vatio, y en Europa la ley no deja pasar de medio vatio.»
// Otro sitio: un medidor de consumo de neón enchufado a la pared, con la tele en espera. Una cámara, que se acerca.
// - «gasta muy poco»: el medidor entra y sus números suben hasta 0,4 W; la barra apenas se enciende.
// - «menos de un vatio»: se marca el 1 W al final de la barra; los 0,4 quedan por debajo.
// - «en Europa»: aparece la insignia de las estrellas. «la ley»: un mazo golpea.
// - «no deja pasar de medio vatio»: baja una barrera a mitad de barra, en rojo; el medidor sigue por debajo: ✓.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { IR } from "../objetosHoy.js";
import { tubo, rect, circulo, linea, CIAN, ROSA, AMARILLO, VERDE } from "../neon.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tpoc = f7.t("poco"), Tmen = f7.t("menos"), Tvat = f7.t("vatio"), Teur = f7.t("europa"), Tley = f7.t("ley"), Tmed = f7.t("medio");
const FIN = v.frase(8).inicio;

const cam = camino2D([[T0, [1.1, 0, 40]], [FIN - 0.3, [1.2, 0, 70]], [FIN, [1.2, 0, 70]]]);
const BX = -250, BW = 500, BY = 262;     // la barra de la escala
const LIM = 0.4;                          // lo que marca

function estrella(g, x, y, R) { g.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? R * 0.42 : R, a = -1.5708 + i * 0.6283; g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } g.closePath(); }
function texto(g, s, x, y, tam, col, al = 1, ali = "center") {
  g.save(); g.font = `800 ${tam}px Figtree`; g.textAlign = ali; g.textBaseline = "middle";
  g.shadowColor = `rgba(${col},${0.9 * al})`; g.shadowBlur = tam * 0.35; g.fillStyle = `rgba(${col},${al})`; g.fillText(s, x, y);
  g.shadowBlur = 0; g.fillStyle = `rgba(255,255,255,${0.7 * al})`; g.fillText(s, x, y); g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la pared de neón
  const bg = g.createLinearGradient(0, -900, 0, 900); bg.addColorStop(0, "#0a2a52"); bg.addColorStop(1, "#06122e");
  g.fillStyle = bg; g.fillRect(-1200, -1500, 2400, 3000);
  g.strokeStyle = "rgba(60,230,255,0.10)"; g.lineWidth = 2; for (let i = -12; i <= 12; i++) { g.beginPath(); g.moveTo(i * 90, -1500); g.lineTo(i * 90, 1500); g.stroke(); g.beginPath(); g.moveTo(-1200, i * 90); g.lineTo(1200, i * 90); g.stroke(); }

  // el medidor entra desde abajo
  const ent = su(tr(t, T0, T0 + 0.4)), rebote = 1 + 0.03 * Math.sin(tr(t, T0 + 0.3, T0 + 0.8) * 9) * (1 - tr(t, T0 + 0.3, T0 + 0.8));
  g.save(); g.translate(0, 260 * (1 - ent)); g.translate(0, 180); g.scale(rebote, rebote); g.translate(0, -180);
  // la clavija, abajo
  for (const dx of [-34, 34]) tubo(g, linea([dx, 392], [dx, 450]), AMARILLO, 8, 1);
  redondo(g, -300, -30, 600, 420, 40); const cg = g.createLinearGradient(-300, -30, 300, 390); cg.addColorStop(0, "rgba(60,230,255,0.22)"); cg.addColorStop(1, "rgba(8,3,26,0.95)"); g.fillStyle = cg; g.fill();
  tubo(g, rect(-300, -30, 600, 420, 40), CIAN, 9, 1);
  // la pantalla
  redondo(g, -262, 10, 524, 200, 22); g.fillStyle = "#03010a"; g.fill(); tubo(g, rect(-262, 10, 524, 200, 22), CIAN, 4, 0.55);
  const sube = su(tr(t, T0 + 0.35, Tpoc - 0.05)), val = LIM * sube;
  texto(g, val.toFixed(1).replace(".", ","), -40, 114, 150, "90,255,150");
  texto(g, "W", 170, 130, 90, "90,255,150", 0.9);
  // la lucecita roja de espera
  const led = 0.5 + 0.5 * Math.sin(t * 5); k.brillo(g, -276, 36, 70, IR, 0.6 * led); g.fillStyle = `rgba(${IR},${0.5 + 0.5 * led})`; g.beginPath(); g.arc(-276, 36, 9, 0, 6.2832); g.fill();
  // la barra de la escala
  const nseg = 25, sw = BW / nseg;
  for (let i = 0; i < nseg; i++) {
    const on = i < Math.round(val * nseg);
    g.fillStyle = on ? "rgba(90,255,150,0.95)" : "rgba(130,120,200,0.22)"; redondo(g, BX + i * sw + 2, BY - 28, sw - 5, 56, 5); g.fill();
    if (on) { k.brillo(g, BX + i * sw + sw / 2, BY, 36, VERDE, 0.4); }
  }
  texto(g, "0", BX, BY + 66, 40, "200,190,255", 0.85);
  // el 1 W
  const m1 = su(tr(t, Tmen - 0.1, Tmen + 0.3)), p1 = k.pulso(t, Tvat, 0.4);
  if (m1 > 0.01) {
    tubo(g, linea([BX + BW + 8, BY - 52 - 12 * (1 - m1)], [BX + BW + 8, BY + 52]), AMARILLO, 7, m1);
    texto(g, "1 W", BX + BW - 4, BY + 66, 44 + 6 * p1, AMARILLO, m1);
    // una flecha que dice «menos de»: del 1 W hacia la izquierda
    g.save(); g.globalAlpha = m1 * (1 - 0.0); tubo(g, linea([BX + BW - 40, BY - 84], [BX + 4 * BW / 10, BY - 84]), AMARILLO, 5, m1); tubo(g, linea([BX + 4 * BW / 10 + 22, BY - 100], [BX + 4 * BW / 10, BY - 84], [BX + 4 * BW / 10 + 22, BY - 68]), AMARILLO, 5, m1); g.restore();
  }
  // la barrera de la ley: baja a mitad de barra
  const bl = su(tr(t, Tmed - 0.15, Tmed + 0.25)), mid = BX + BW / 2;
  if (bl > 0.01) {
    const y = mez(BY - 200, BY - 52, bl); tubo(g, linea([mid, y], [mid, BY + 50]), "255,50,70", 9, bl);
    tubo(g, linea([mid - 40, y], [mid + 40, y]), "255,50,70", 9, bl);
    texto(g, "0,5 W", mid, BY + 66, 44, "255,90,110", bl);
    k.brillo(g, mid, y, 120, "255,50,70", 0.5 * bl * k.pulso(t, Tmed + 0.2, 0.35));
  }
  // todo en orden: ✓ verde junto a la pantalla
  const ok = su(tr(t, Tmed + 0.65, Tmed + 0.95));
  if (ok > 0.01) { g.save(); g.translate(230, -60); g.scale(0.7 + 0.3 * ok, 0.7 + 0.3 * ok); tubo(g, linea([-34, 0], [-8, 28], [38, -26]), VERDE, 14, ok); g.restore(); }
  g.restore();

  // la insignia de Europa: aparece en «Europa» y recibe el golpe de la ley
  const ie = su(tr(t, Teur - 0.15, Teur + 0.3)), golpe = k.pulso(t, Tley + 0.02, 0.25);
  if (ie > 0.01) {
    g.save(); g.translate(0, -230); const s = (0.4 + 0.6 * ie) * (1 - 0.06 * golpe); g.scale(s, s); g.globalAlpha = ie;
    k.brillo(g, 0, 0, 260, "70,110,255", 0.5);
    g.beginPath(); g.arc(0, 0, 105, 0, 6.2832); const eg = g.createRadialGradient(0, -30, 20, 0, 0, 105); eg.addColorStop(0, "#2a52e0"); eg.addColorStop(1, "#0e1f7a"); g.fillStyle = eg; g.fill();
    tubo(g, circulo(0, 0, 105), AMARILLO, 7, 1);
    g.fillStyle = "#ffe25a"; for (let i = 0; i < 12; i++) { const a = i * 0.5236 - 1.5708; estrella(g, Math.cos(a) * 63, Math.sin(a) * 63, 14); g.fill(); }
    g.restore();
  }
  // el mazo: golpea a la insignia en «ley»
  const mz = su(tr(t, Teur + 0.5, Tley - 0.1)), hit = su(tr(t, Tley - 0.08, Tley + 0.04)) * (1 - su(tr(t, Tley + 0.1, Tley + 0.45)));
  if (mz > 0.01) {
    g.save(); g.globalAlpha = Math.min(1, mz * 2) * (1 - su(tr(t, Tley + 0.45, Tley + 0.75))); g.translate(330, -60 + 40 * (1 - mz)); g.rotate(0.3 - 1.08 * hit);
    tubo(g, linea([0, 0], [0, -200]), ROSA, 10, 1);
    tubo(g, rect(-72, -236, 144, 72, 14), ROSA, 9, 1); g.restore();
    // las chispas del golpe
    const ch = k.pulso(t, Tley + 0.02, 0.4); if (ch > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; for (let i = 0; i < 8; i++) { const a = i * 0.785 + 0.3; k.brillo(g, 110 * Math.cos(a) * (1 + 0.8 * (1 - ch)), -230 + 110 * Math.sin(a) * (1 + 0.8 * (1 - ch)), 40 * ch, "255,230,120", ch); } g.restore(); }
  }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.4);
}

export const momentos = { poco: Tpoc, vatio: Tvat, europa: Teur, ley: Tley, medio: Tmed };
