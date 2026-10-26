// La respuesta: el tejido no tiene alarmas. La piel y la funda sí, y se duermen.
import * as k from "#kit";
import { v } from "#voz";
import { quirofano, craneo, cerebro, anillo, lamina, sonda, velo } from "../mundo.js";

export const desde = "tejido";
const f12 = v.frase(12), f13 = v.frase(13), f14 = v.frase(14), f15 = v.frase(15);
const Tdol = f12.t("dolor");
const Tfun = f13.t("funda"), Tdu = f13.t("duerme");
const Tcor = f14.t("corte");
const Test = f15.t("estirado"), Tesc = f15.t("escuece"), Tno = f15.t("no");

const AN = [
  { x: -70, y: -30 }, { x: 40, y: -80 }, { x: 90, y: 20 }, { x: -20, y: 70 }, { x: -110, y: 40 },
];

export function dibuja(g, t) {
  quirofano(g, t);
  const llega = k.suave(k.tramo(t, Tfun - 0.2, Tfun + 0.45));
  const duerme = k.suave(k.tramo(t, Tdu - 0.05, Tdu + 0.55));
  const corte = k.suave(k.tramo(t, Tcor - 0.08, Tcor + 0.35));
  const estira = k.suave(k.tramo(t, Test - 0.05, Tesc + 0.15)) * (1 - k.suave(k.tramo(t, Tno - 0.05, Tno + 0.35)));
  const toque = k.suave(k.tramo(t, f12.inicio, Tdol + 0.2));
  const cx = k.mez(540, 400, llega);
  const S = k.mez(300, 230, llega);

  craneo(g, cx, 1040, S * 1.05);
  cerebro(g, cx, 1040, S * 0.82, {
    presion: toque * (1 - llega) * 0.7,
    tx: 0.15, ty: 0,
    corte,
    brillo: 0.05,
  });
  // alarmas del tejido: se ven y no se encienden
  g.save();
  g.globalAlpha = k.suave(k.tramo(t, Tdol - 0.25, Tdol + 0.2)) * (1 - duerme * 0.3);
  for (const a of AN) anillo(g, cx + a.x, 1040 + a.y, 26, 0);
  g.restore();

  if (llega > 0.02) {
    const x1 = k.mez(1120, 690, llega);
    // la piel: un trozo de piel de verdad, con sus alarmas encendidas
    g.save();
    g.globalAlpha = llega;
    const pg = g.createLinearGradient(x1, 820, x1 + 260, 1180);
    pg.addColorStop(0, "#ffd0ba");
    pg.addColorStop(0.5, "#e89880");
    pg.addColorStop(1, "#c47058");
    g.fillStyle = pg;
    k.redondo(g, x1, 860, 250, 340, 36);
    g.fill();
    g.globalAlpha = llega * 0.35;
    g.globalCompositeOperation = "multiply";
    g.drawImage(k.red, x1, 860, 250, 340);
    g.restore();
    anillo(g, x1 + 80, 980, 26, (1 - duerme) * llega, "255,70,60");
    anillo(g, x1 + 160, 1100, 26, (1 - duerme) * llega, "255,70,60");
    // la funda: una lámina clara que se despega
    const x2 = x1 + 10;
    g.save();
    g.globalAlpha = 0.78 * llega;
    g.beginPath();
    g.moveTo(x2, 1260);
    g.quadraticCurveTo(x2 + 80, 1220 - duerme * 10, x2 + 250, 1280);
    g.quadraticCurveTo(x2 + 220, 1480, x2 + 40, 1500);
    g.closePath();
    const fg = g.createLinearGradient(x2, 1240, x2, 1500);
    fg.addColorStop(0, "#fff6e4");
    fg.addColorStop(1, "#e4d2a8");
    g.fillStyle = fg;
    g.fill();
    g.restore();
    anillo(g, x2 + 90, 1360, 24, (1 - duerme) * llega, "255,190,70");
    anillo(g, x2 + 170, 1420, 22, (1 - duerme) * llega, "255,190,70");
  }
  if (duerme > 0.02) {
    const x = k.mez(1080, 620, duerme);
    g.save();
    g.globalCompositeOperation = "lighter";
    const b = g.createLinearGradient(x, 0, x + 280, 0);
    b.addColorStop(0, "rgba(80,170,255,0)");
    b.addColorStop(0.5, `rgba(120,190,255,${0.45 * duerme})`);
    b.addColorStop(1, "rgba(80,170,255,0)");
    g.fillStyle = b;
    g.fillRect(x - 40, 700, 360, 900);
    g.restore();
  }
  if (corte > 0.2) {
    const u = k.tramo(t, Tcor + 0.15, Tcor + 0.9);
    const x = cx + 20 + u * 80, y = 1120 - u * 40;
    k.brillo(g, x, y, 70, "amarilla", (1 - u) * corte * 0.8);
  }
  // vasito
  if (t > Test - 0.3) {
    g.save();
    g.translate(cx + 80, 1000);
    g.strokeStyle = "#c43848";
    g.lineWidth = 8;
    g.lineCap = "round";
    const largo = 50 + estira * 200;
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(30 + estira * 40, largo * 0.4, 10, largo);
    g.stroke();
    g.restore();
    if (estira > 0.4) k.brillo(g, 180, 620, 200, "roja", (estira - 0.4) * 0.8);
  }
  if (toque > 0.05 && llega < 0.55) sonda(g, cx + 140, k.mez(520, 900, toque), 220, toque * (1 - llega));
  velo(g, 0.72);
}
