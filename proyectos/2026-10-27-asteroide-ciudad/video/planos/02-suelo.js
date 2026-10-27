// «Desaparecieron tres de cada cuatro especies, incluidos los dinosaurios que no eran aves.
// El polvo, el azufre y el hollín taparon el sol.
// Los estudios no coinciden: unos hablan de meses a oscuras, y otro de casi dos años sin que las plantas hicieran comida.
// En esto sí: sin luz, las plantas paran, y se cae lo que come de ellas.»
// El suelo. La cámara no corta: se van las especies, sube el cielo que se cierra, y baja a la planta.
import * as k from "#kit";
import { v } from "#voz";
import { arbol, ave, dinosaurio, herbivoro, nube, paisaje, pez, planta, sol, veloArriba } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;
export const entrada = "corte";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const T0 = f4.inicio;
const Ttres = f4.t("tres");
const Tdino = f4.t("dinosaurios");
const Taves = f4.t("aves");
const Tpolvo = f5.t("polvo");
const Taz = f5.t("azufre");
const Thol = f5.t("hollin");
const Tsol = f5.t("sol");
const Tmeses = f6.t("meses");
const Tdos = f6.t("dos");
const Tcomida = f6.t("comida");
const Tparan = f7.t("paran");
const Tcae = f7.t("cae");
const Tcorte = v.frase(8).inicio;
const Tquieto = Tcorte - 0.3;

const SUELO = 1340;
const SOL = { x: 760, y: 690, r: 130 };
const MOTAS = Array.from({ length: 36 }, (_, i) => {
  const az = k.azar(880 + i);
  return { x: az() * 1080, y: 420 + az() * 1100, v: 28 + az() * 55, r: 2 + az() * 4.5, a: 0.12 + az() * 0.28 };
});

export function dibuja(g, t) {
  const tt = Math.min(t, Tquieto);
  const cubre = k.claves([
    [T0, 0],
    [Tpolvo, 0.05],
    [Tsol + 0.35, 1],
    [Tmeses - 0.1, 1],
    [Tmeses + 0.7, 0.32],
    [Tdos, 0.4],
    [Tdos + 0.9, 1],
    [Tquieto, 1],
  ])(tt);

  paisaje(g, cubre * 0.85, tt);
  sol(g, SOL.x, SOL.y, SOL.r, cubre);

  const llega = (t0) => k.entra(k.tramo(tt, t0 - 0.08, t0 + 0.42));
  const aire = Math.sin(tt * 0.7) * 22;
  nube(g, k.mez(180, SOL.x - 30, llega(Tpolvo)) + aire, k.mez(980, SOL.y + 8, llega(Tpolvo)), 220, 120, "polvo", llega(Tpolvo));
  nube(g, k.mez(980, SOL.x + 36, llega(Taz)) - aire * 0.6, k.mez(860, SOL.y - 8, llega(Taz)), 190, 110, "azufre", llega(Taz));
  nube(g, k.mez(540, SOL.x, llega(Thol)) + aire * 0.4, k.mez(1180, SOL.y + 20, llega(Thol)), 250, 130, "hollin", llega(Thol));
  if (cubre > 0.2) {
    g.save();
    g.fillStyle = "rgba(210,196,170,0.9)";
    for (const p of MOTAS) {
      const x = (p.x + tt * p.v) % 1240 - 80;
      const y = p.y + Math.sin(tt * 0.6 + p.x) * 10;
      g.globalAlpha = p.a * Math.min(1, cubre);
      g.beginPath();
      g.arc(x, y, p.r, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }

  // cuatro especies, grandes. Tres se apagan; el ave se queda un momento y se va antes del polvo.
  const vidaArbol = 1 - k.suave(k.tramo(tt, Ttres, Ttres + 0.7));
  const vidaPez = 1 - k.suave(k.tramo(tt, Ttres + 0.12, Ttres + 0.85));
  const caidaDino = k.suave(k.tramo(tt, Tdino - 0.15, Tdino + 0.7));
  const vidaDino = 1 - k.suave(k.tramo(tt, Tdino + 0.45, Tdino + 1.05));
  const vuela = k.suave(k.tramo(tt, Taves, Taves + 0.85));
  const seVan = 1 - k.suave(k.tramo(tt, Tpolvo - 0.15, Tpolvo + 0.45));

  if (seVan > 0.02) {
    g.save();
    g.globalAlpha = seVan;
    arbol(g, 190, SUELO, 560, vidaArbol);
    dinosaurio(g, 560, SUELO + 10, 680, vidaDino, caidaDino);
    pez(g, 900, SUELO - 40, 320, vidaPez);
    ave(g, k.mez(420, 180, vuela), k.mez(760, 430, vuela), 170, 1 - vuela * 0.2, tt * 9);
    g.restore();
  }

  // La planta: un brote cuando el sol asoma, y la misma, grande, que se mustia.
  const brote = k.suave(k.tramo(tt, Tmeses + 0.15, Tmeses + 0.85));
  const polvoFino = k.suave(k.tramo(tt, Tdos, Tdos + 0.85));
  const crece = k.suave(k.tramo(tt, Tcomida - 0.45, Tcomida + 0.35));
  const mustia = k.suave(k.tramo(tt, Tparan - 0.15, Tparan + 0.55));
  const aparece = Math.max(brote, crece);
  const viva = k.mez(k.mez(0.2, 1, brote), 0.12, polvoFino) * (1 - mustia * 0.85);
  const h = 640 * aparece;
  if (aparece > 0.03) planta(g, 460, SUELO + 20, h, viva);

  const llegaCome = k.entra(k.tramo(tt, Tparan - 0.15, Tparan + 0.35));
  const caeCome = k.suave(k.tramo(tt, Tcae, Tcae + 0.7));
  herbivoro(g, 760, SUELO + 8, 250, llegaCome * (1 - caeCome * 0.35), caeCome);

  if (cubre > 0.2) {
    g.save();
    g.fillStyle = `rgba(12,8,6,${(cubre - 0.2) * 0.35})`;
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  veloArriba(g, 0.58);
}
