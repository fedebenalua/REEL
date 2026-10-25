// Otra vez el cuarto: el idioma que no estudiaste no se queda. La noche sella lo que ya metiste.
import * as k from "#kit";
import { v } from "#voz";
import { PALABRAS, TECLAS, cabeza, carta, cuarto, movil, onda, palabra, tecla, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(15).inicio - 2 / 60;
export const entrada = "corte";

const f15 = v.frase(15);
const f16 = v.frase(16);
const f17 = v.frase(17);
const f18 = v.frase(18);
const f19 = v.frase(19);
const f20 = v.frase(20);

const Tqueda = f15.t("queda");
const Taman = f16.t("amaneces");
const Tprof = f17.t("profundo");
const Tpal = f17.t("palabra");
const Tincl = f17.t("inclina");
const Tidioma = f18.t("idioma");
const Tsella = f19.t("sella");
const Toido = f19.t("oido");
const Tcoc = f20.t("cociente");
const Tfin = v.duracion;

const OX = 700, OY = 1020;

export function dibuja(g, t) {
  const sol = k.suave(k.tramo(t, Taman - 0.25, Taman + 0.45)) * (1 - k.suave(k.tramo(t, Tprof - 0.1, Tprof + 0.45)));
  const profundo = k.suave(k.tramo(t, Tprof - 0.05, Tprof + 0.5)) * (1 - k.suave(k.tramo(t, Tsella - 0.4, Tsella + 0.15)));
  const sella = k.suave(k.tramo(t, Tsella - 0.12, Tsella + 0.45));
  const aBoca = k.suave(k.tramo(t, Taman - 0.05, Taman + 0.3)) * (1 - k.suave(k.tramo(t, Tprof - 0.15, Tprof + 0.2)));
  const aOnda = k.suave(k.tramo(t, Tpal - 0.2, Tpal + 0.3)) * (1 - sella);
  const acerca = k.suave(k.tramo(t, Tcoc - 0.05, Tfin - 0.2));
  const zoom = k.mez(k.mez(k.mez(1.05, 1.35, aBoca), 1.15, aOnda), 1.7, acerca);
  const fx = k.mez(k.mez(540, 430, aBoca), OX, Math.max(aOnda * 0.3, acerca));
  const fy = k.mez(k.mez(1000, 1080, aBoca), k.mez(1100, OY, acerca), aOnda);

  g.save();
  g.translate(fx, fy);
  g.scale(zoom, zoom);
  g.translate(-fx, -fy);

  cuarto(g, t, sol, profundo);
  const bocaVacia = aBoca;
  cabeza(g, 520, 900, profundo > 0.5 ? 0.85 : 1.2, sol * (1 - profundo) * 0.2, bocaVacia);
  movil(g, 180, 1120, 1.15, t, (1 - profundo) * (1 - acerca));

  // palabras grandes que caen de la cabeza y se apagan: no se quedan
  const fuera = (1 - profundo) * (1 - sella);
  if (fuera > 0.03) {
    for (let i = 0; i < 5; i++) {
      const x0 = 180 + i * 170;
      const y0 = 640 + (i % 2) * 40;
      const u = k.suave(k.tramo(t, f15.inicio + i * 0.08, Tqueda + 0.05));
      const y = k.mez(y0, 1480, u);
      const al = fuera * (1 - k.suave(k.tramo(t, Tqueda + 0.05, Taman)));
      palabra(g, x0, y, PALABRAS[i], 0.95, al);
    }
  }

  if (profundo > 0.15 && sella < 0.55) {
    onda(g, t, 1080, profundo);
    const llega = k.entra(k.suave(k.tramo(t, Tpal - 0.08, Tpal + 0.4)));
    const pico = 1080 + Math.sin(t * 1.4 + 3) * 64;
    const quedaPal = 1 - k.suave(k.tramo(t, Tidioma - 0.05, Tidioma + 0.4));
    palabra(g, 540, k.mez(700, pico, llega), "TORU", 1.15, llega * quedaPal * profundo);
    const cartas = k.suave(k.tramo(t, Tincl - 0.12, Tincl + 0.28));
    const tilt = k.suave(k.tramo(t, Tincl, Tincl + 0.45)) * 0.22;
    carta(g, 330, 1360, 1.7, "TORU", -tilt, cartas * quedaPal * profundo, "255,186,90");
    carta(g, 750, 1360, 1.7, "CASA", 0.02, cartas * quedaPal * profundo, "140,210,255");
  }

  if (sella > 0.02) {
    const al = sella * (1 - acerca * 0.9);
    const ys = 1240;
    g.save();
    g.globalAlpha = al;
    g.strokeStyle = "rgba(255,206,110,0.95)";
    g.lineWidth = 12;
    k.redondo(g, 70, ys - 150, 900, 300, 40);
    g.stroke();
    g.restore();
    for (let i = 0; i < 4; i++) tecla(g, 200 + i * 210, ys, 160, 200, TECLAS[i], al);
    const rebote = k.suave(k.tramo(t, Toido - 0.35, Toido + 0.2));
    for (let i = 0; i < 3; i++) {
      const u = k.tramo(t, Toido - 0.45 + i * 0.16, Toido + 0.15 + i * 0.12);
      const x = k.mez(160, OX - 30, Math.min(1, u * 1.15));
      const cae = Math.max(0, u - 0.72);
      const y = k.mez(860, OY, Math.min(1, u)) + cae * cae * 700;
      const palAl = al * rebote * Math.max(0, 1 - cae * 2.2);
      palabra(g, x, y, PALABRAS[i + 1], 0.85, palAl);
    }
  }

  g.restore();

  if (acerca > 0.04) {
    const u = k.suave(k.tramo(t, Tcoc, Tfin - 0.25));
    palabra(g, k.mez(160, OX - 30, u), k.mez(860, OY, u), "TORU", k.mez(0.7, 2.05, u), acerca);
  }
  k.fogonazo(g, OX, OY, t - Toido, 800, "180,230,255");
  velo(g, profundo > 0.45 ? 0.82 : 0.68);
}
