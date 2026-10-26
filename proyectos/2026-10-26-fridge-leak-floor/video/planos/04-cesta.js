// La cesta sale, el agujero se ve, y si la pared está helada entra el técnico.
import * as k from "#kit";
import { v } from "#voz";
import { agujero, cajaFria, camara, cesta, mano, quieto, rutaCam, tecnico, velo, viñeta } from "../mundo.js";

export const desde = "pull";
const fin = v.t("leak") - 0.04;
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);

export function dibuja(g, t) {
  const tq = quieto(t, fin);
  const sale = k.suave(k.tramo(tq, f5.t("pull"), f5.t("basket") + 0.05));
  const hielo = k.suave(k.tramo(tq, f7.t("ice"), f7.t("wall") + 0.15));
  const llega = k.suave(k.tramo(tq, f7.t("call"), f7.t("technician") + 0.35));
  const cam = rutaCam(tq, [
    [f5.t("pull"), { x: 0, y: 220, s: 1.15 }],
    [f5.t("basket"), { x: 0, y: 360, s: 1.35 }],
    [f6.t("low"), { x: 0, y: 180, s: 1.45 }],
    [f6.t("center"), { x: 0, y: 320, s: 2.7 }],
    [f7.t("ice"), { x: 0, y: 40, s: 1.15 }],
    [f7.t("technician"), { x: 40, y: 80, s: 0.92 }],
    [fin - 0.22, { x: 30, y: 90, s: 0.9 }],
  ]);
  camara(g, cam);
  cajaFria(g);
  g.fillStyle = "rgba(214, 236, 248, 0.28)";
  g.fillRect(-500, 230, 1000, 90);
  agujero(g, 0, 330, k.mez(1.3, 2.1, k.suave(k.tramo(tq, f6.t("hole"), f6.t("center")))), hielo);
  if (hielo > 0.004) {
    const rad = 70 + hielo * 940;
    g.save();
    g.globalAlpha = Math.min(0.94, hielo * 1.2);
    g.fillStyle = "#f4fbff";
    g.beginPath();
    g.ellipse(0, 300, rad * 1.35, rad, 0, 0, Math.PI * 2);
    g.fill();
    g.globalAlpha = hielo * 0.28;
    g.globalCompositeOperation = "multiply";
    g.beginPath();
    g.ellipse(0, 300, rad * 1.35, rad, 0, 0, Math.PI * 2);
    g.clip();
    g.drawImage(k.manchas, -rad, 300 - rad, rad * 2.4, rad * 2);
    g.restore();
  }
  cesta(g, 0, k.mez(80, 460, sale), 1.15);
  if (sale < 0.92 && hielo < 0.35) mano(g, 260, k.mez(40, 380, sale), 1.4, 0.5, 0.4);
  if (llega > 0.02) tecnico(g, llega);
  if (k.tramo(tq, f6.t("center") - 0.05, f6.t("center") + 0.4) > 0 && hielo < 0.2) {
    k.brillo(g, 0, 320, 220, "cian", 0.55 * (1 - hielo));
  }
  velo(g, 0.75);
  viñeta(g, 0.38);
}
