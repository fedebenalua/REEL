// La otra apertura: el mismo cepillo, pero ya con la rendija al rojo y el zapato a punto de entrar.
// Se queda como prueba. El vídeo usa la de la escalera entera, porque en el primer segundo se entiende qué es.
import * as k from "#kit";
import { v } from "#voz";
import { mall, camara, faseHasta, pt, UZ, sinVista } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tcep = f1.t("cepillos"), Tlat = f1.t("laterales");
const Tpol = f2.t("polvo"), Tnada = f3.t("nada");
const cerca = pt(UZ, -0.78);

const cam = camara([
  [-0.4, 3.4, cerca.x - 30, cerca.y],
  [0, 2.9, cerca.x, cerca.y],
  [Tcep, 2.1, cerca.x + 40, cerca.y - 20],
  [Tlat, 1.15, 0, 980],
  [Tpol, 1.9, pt(UZ, -0.5).x, pt(UZ, -0.5).y],
  [f3.fin, 1.9, pt(UZ, -0.5).x, pt(UZ, -0.5).y],
]);

export function dibuja(g, t) {
  const lat = k.de(t, f2.inicio, Tpol, -0.78, -0.5);
  const bend = Math.min(1, 0.95 + 0.4 * k.pulso(t, Tcep, 0.2));
  const fase = faseHasta(t, 0.7, Tnada - 0.1, Tnada + 0.25);
  mall(g, t, cam(t), { fase, bend, polvo: k.entra(k.tramo(t, f2.inicio, Tpol)), lat, zapato: 1 });
  const rojo = (1 - k.suave(k.tramo(t, f2.inicio, Tpol))) * 0.45;
  if (rojo > 0.02) {
    g.save();
    sinVista(g);
    g.globalCompositeOperation = "lighter";
    const rg = g.createRadialGradient(180, 1100, 20, 220, 1100, 520);
    rg.addColorStop(0, `rgba(255,70,30,${rojo})`);
    rg.addColorStop(1, "rgba(255,70,30,0)");
    g.fillStyle = rg;
    g.fillRect(0, 700, 500, 700);
    g.restore();
  }
}
