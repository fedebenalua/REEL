// «Tercero: las gasolineras sin empleados, donde pagas tú en la máquina, suelen ser las más baratas.»
// Una gasolinera de noche sin nadie, con la máquina de pago grande delante. Se entra con un corte en «Tercero».
// - «Tercero: las gasolineras»: la máquina de pago, grande, con su precio a 1,49; detrás, la tienda encendida.
// - «sin empleados»: la luz de la tienda se apaga: no hay nadie.
// - «donde pagas tú»: una tarjeta llega volando y entra en la ranura; «máquina»: «PAGO OK» en verde.
// - «suelen ser las más baratas»: el precio baja rodando a 1,35 y se pone verde. Reposa hasta el corte.
import * as k from "#kit";
import { v } from "#voz";
import { noche, gasolinera, precio, velo, VERDE, AMBAR, MARCA_A } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;

const { suave: su, tramo: tr, mez } = k;
const f6 = v.frase(6);
const T0 = f6.inicio, Temp = f6.t("empleados"), Tpag = f6.t("pagas"), Tmaq = f6.t("maquina"), Tbar = f6.t("baratas"), Fin = f6.fin;
const Tapaga = Temp + 0.1, Tllega = Tpag - 0.35, Tentra = Tpag + 0.25, Tok = Tmaq + 0.05, Tbaja = Tbar - 0.25, Tverde = Tbar + 0.35;
export const momentos = { apaga: Tapaga, tarjeta: Tentra, ok: Tok, verde: Tverde };

const KX = 430, KY = 1720, KW = 520, KH = 1180; // la máquina: centro de la base, ancho y alto
const RX = KX, RY = KY - 330; // la ranura de la tarjeta

function tarjeta(g, x, y, ang, esc, corte = null) {
  g.save();
  if (corte !== null) { g.beginPath(); g.rect(0, 0, 1080, corte); g.clip(); }
  g.translate(x, y); g.rotate(ang); g.scale(esc, esc);
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 30; g.shadowOffsetY = 14;
  const cg = g.createLinearGradient(-170, -105, 170, 105); cg.addColorStop(0, "#5b7cff"); cg.addColorStop(0.55, "#7a3cff"); cg.addColorStop(1, "#2a1680");
  k.redondo(g, -170, -105, 340, 210, 22); g.fillStyle = cg; g.fill();
  g.shadowColor = "rgba(0,0,0,0)";
  const og = g.createLinearGradient(-130, -40, -70, 10); og.addColorStop(0, "#ffe7a0"); og.addColorStop(1, "#c9922e");
  k.redondo(g, -130, -40, 64, 50, 8); g.fillStyle = og; g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.font = "700 26px Figtree"; g.textAlign = "left"; g.textBaseline = "alphabetic"; g.fillText("•••• •••• •••• 4821", -130, 50);
  g.save(); g.globalCompositeOperation = "screen"; const rg = g.createLinearGradient(-170, -105, 170, 105); rg.addColorStop(0.3, "rgba(255,255,255,0)"); rg.addColorStop(0.4, "rgba(255,255,255,0.3)"); rg.addColorStop(0.5, "rgba(255,255,255,0)");
  k.redondo(g, -170, -105, 340, 210, 22); g.fillStyle = rg; g.fill(); g.restore();
  g.restore();
}

export function dibuja(g, t) {
  // la cámara se acerca despacio a la máquina
  const esc = mez(1, 1.07, su(tr(t, T0, Fin)));
  g.save(); g.translate(KX, 1100); g.scale(esc, esc); g.translate(-KX, -1100);
  noche(g, t, 1180, 1);
  // la gasolinera detrás, con la tienda que se apaga
  const tienda = 1 - su(tr(t, Tapaga, Tapaga + 0.3));
  gasolinera(g, 860, 1300, 0.95, { marca: MARCA_A, tienda });
  // la máquina de pago
  g.save(); g.translate(KX, KY);
  g.save(); g.shadowColor = "rgba(0,0,0,0.75)"; g.shadowBlur = 90; g.shadowOffsetY = 30;
  k.redondo(g, -KW / 2, -KH, KW, KH, 40); g.fillStyle = "#151824"; g.fill(); g.restore();
  const cg = g.createLinearGradient(-KW / 2, 0, KW / 2, 0); cg.addColorStop(0, "#d7dbe4"); cg.addColorStop(0.2, "#ffffff"); cg.addColorStop(0.65, "#b9bfcc"); cg.addColorStop(1, "#717888");
  k.redondo(g, -KW / 2, -KH, KW, KH, 40); g.fillStyle = cg; g.fill();
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.12; k.redondo(g, -KW / 2, -KH, KW, KH, 40); g.clip(); g.drawImage(k.manchas, -KW / 2, -KH, KW, KH); g.restore();
  // la cabeza
  k.redondo(g, -KW / 2, -KH, KW, 150, 40); g.fillStyle = `rgb(${MARCA_A})`; g.fill();
  g.fillStyle = "#fff"; g.font = "900 72px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("24 H", 0, -KH + 78);
  // el precio
  g.fillStyle = "#2a2f3c"; g.font = "800 40px Figtree"; g.fillText("GASOLINA 95", 0, -KH + 200);
  k.redondo(g, -KW / 2 + 40, -KH + 230, KW - 80, 190, 16); g.fillStyle = "#020203"; g.fill();
  const baja = k.entra(tr(t, Tbaja, Tverde));
  precio(g, 0, -KH + 325, 128, [1, mez(4, 3, baja), mez(9, 5, baja)], k.mezRgb(AMBAR, VERDE, su(tr(t, Tverde - 0.2, Tverde))));
  // la pantalla
  const ok = su(tr(t, Tok - 0.1, Tok + 0.15));
  k.redondo(g, -KW / 2 + 40, -KH + 450, KW - 80, 230, 18); g.fillStyle = "#0b1a2e"; g.fill();
  g.save(); k.redondo(g, -KW / 2 + 40, -KH + 450, KW - 80, 230, 18); g.clip();
  const sg = g.createLinearGradient(0, -KH + 450, 0, -KH + 680); sg.addColorStop(0, ok > 0.5 ? "#0f5a32" : "#16365f"); sg.addColorStop(1, ok > 0.5 ? "#073a1e" : "#0b1a2e");
  g.fillStyle = sg; g.fillRect(-KW / 2, -KH + 450, KW, 230);
  g.globalAlpha = 1 - ok; g.fillStyle = "#fff"; g.font = "800 46px Figtree"; g.fillText("Inserte", 0, -KH + 535); g.fillText("su tarjeta", 0, -KH + 595);
  g.globalAlpha = ok; g.fillStyle = `rgb(${VERDE})`; g.font = "900 70px Figtree"; g.fillText("PAGO OK", 0, -KH + 545);
  g.lineWidth = 12; g.strokeStyle = `rgb(${VERDE})`; g.lineCap = "round"; g.beginPath(); g.moveTo(-40, -KH + 615); g.lineTo(-10, -KH + 645); g.lineTo(50, -KH + 590); g.stroke();
  g.restore();
  // la ranura de la tarjeta, con su luz
  g.fillStyle = "#1a1d26"; k.redondo(g, -150, -360, 300, 60, 14); g.fill();
  g.fillStyle = "#000"; g.fillRect(-120, -334, 240, 10);
  k.brillo(g, 175, -330, 80, ok > 0.5 ? VERDE : "120,200,255", 0.9);
  // el teclado
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { k.redondo(g, -150 + c * 78, -260 + r * 64, 64, 50, 10); k.metal(g, -150 + c * 78, -86 + c * 78, ["#2b2f3a", "#5f6676", "#3a3f4c", "#727a8c", "#262a33"]); }
  g.restore();
  // la tarjeta: llega volando y entra en la ranura
  const llega = k.entra(tr(t, Tllega, Tpag)), mete = su(tr(t, Tpag, Tentra));
  if (llega > 0 && mete < 1) {
    const x = mez(1250, RX, llega), y = mez(RY - 560, RY - 150, llega) + 150 * mete, ang = mez(-0.9, 0, llega);
    tarjeta(g, x, y, ang, mez(1.4, 0.8, llega), llega >= 1 ? RY - 30 : null);
  }
  k.brillo(g, RX, RY - 30, 600, VERDE, 0.5 * k.pulso(t, Tok + 0.05, 0.15));
  k.brillo(g, KX, KY - KH + 325, 1100, VERDE, 0.45 * k.pulso(t, Tverde + 0.05, 0.16));
  g.restore();
  velo(g, 0.55);
}
