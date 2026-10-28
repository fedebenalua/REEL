// Diez fechas al azar. Ellos, el 97 %. Los demás, una de cada siete.
import * as k from "#kit";
import { v } from "#voz";
import { CAB, tarjeta, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio - 0.04;
export const entrada = "corte";

const f6 = v.frase(6);
const f7 = v.frase(7);
const f8 = v.frase(8);
const Tdiez = f6.t("diez");
const Tnov = f7.t("noventa");
const Tdemas = f8.t("demas");
const Tazar = f8.t("azar");

export function dibuja(g, t) {
  const c = g.createLinearGradient(0, 0, 0, 1920);
  c.addColorStop(0, "#14182c"); c.addColorStop(0.5, "#243056"); c.addColorStop(1, "#0c1018");
  g.fillStyle = c; g.fillRect(0, 0, 1080, 1920);
  const lam = g.createRadialGradient(540, 900, 40, 540, 1000, 800);
  lam.addColorStop(0, "rgba(255,196,110,0.18)"); lam.addColorStop(1, "rgba(255,196,110,0)");
  g.fillStyle = lam; g.fillRect(0, 0, 1080, 1920);

  const caen = k.entra(k.tramo(t, f6.inicio - 0.45, Tdiez + 0.35));
  const acierto = k.suave(k.tramo(t, Tnov - 0.1, Tnov + 0.45));
  const otros = k.suave(k.tramo(t, Tdemas - 0.05, Tazar - 0.15));
  const parado = k.suave(k.tramo(t, Tazar - 0.05, Tazar + 0.35));

  // diez fechas que caen y se quedan
  for (let i = 0; i < 10; i++) {
    const u = k.suave(k.tramo(caen, i / 14, i / 14 + 0.18));
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 150 + col * 190;
    const y = k.mez(-220, 700 + row * 175, u);
    const apaga = otros * (i === 3 ? 0 : 1);
    tarjeta(g, x, y, 168, 214, {
      num: String(3 + i * 2), color: CAB[i % CAB.length], esc: i % 8,
      escenaAl: (0.2 + 0.8 * acierto) * (1 - apaga * 0.85),
      al: u * (1 - apaga * 0.55), rot: (1 - u) * 0.3,
    });
  }

  // siete días: al principio todos verdes con el 97; luego se apaga todo menos uno
  const siete = k.suave(k.tramo(t, Tnov + 0.15, f7.fin));
  for (let i = 0; i < 7; i++) {
    const x = 70 + i * 140;
    const y = 1210;
    const queda = i === 2 ? 1 : 1 - parado;
    const al = siete * (0.25 + 0.75 * queda) * (i === 2 ? 1 : 1 - otros * 0.2);
    g.save();
    g.globalAlpha = Math.max(0, al);
    k.redondo(g, x, y, 120, 200, 20);
    g.fillStyle = i === 2 || otros < 0.5 ? "#16351c" : "#2a3142";
    g.fill();
    g.fillStyle = i === 2 || parado < 0.4 ? "#7dff9a" : "#8b93a7";
    g.font = "800 48px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(["L", "M", "X", "J", "V", "S", "D"][i], x + 60, y + 100);
    g.restore();
    if (i === 2 && parado > 0.2) k.brillo(g, x + 60, y + 100, 200, "verde", 0.5 * parado);
  }

  const a97 = acierto * (1 - k.suave(k.tramo(t, Tdemas, Tdemas + 0.4)));
  if (a97 > 0.02) k.pastilla(g, 540, 1085, "97", "%", "150,255,140", a97, 120);
  velo(g, 0.7);
}
