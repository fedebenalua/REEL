// «Dentro de este, ahora mismo, unos quince átomos se rompen cada segundo y sueltan radiación. La culpa es del potasio:
// de cada ocho mil átomos de potasio, más o menos uno es radiactivo. Pero es tan poquito que...»
// Sigue del hook, sin corte: el mismo plátano a contraluz, y una cámara que entra en él.
// - «Dentro de este»: la cámara se acerca a la pulpa; los átomos que se rompen, con su destello y su rayo, cada vez más
//   grandes. «quince»: «15 por segundo».
// - «sueltan radiación»: los rayos salen largos, hasta fuera del plátano.
// - «potasio»: la cámara se mete en un punto de la pulpa hasta ver las bolitas lilas del potasio, grandes.
// - «ocho mil»: se aleja y son miles. «uno»: la del centro se pone verde y late; «radiactivo»: se rompe.
// - «Pero es tan poquito»: la cámara sale hasta ver el plátano entero, con su destello pequeñito. Corte en «una».
import * as k from "#kit";
import { v } from "#voz";
import { BANG, BL, BX, BY, ROTURAS, atomo, destello, dondeRotura, enPlatano, fondo, platano, velo, vineta } from "../mundo.js";

export const desde = "dentro";
export const entrada = "sigue";

const { suave: su, tramo: tr, mez, azar, lienzo, claves } = k;
const f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const Tden = f2.inicio, Tq = f2.t("quince"), Tsu = f2.t("sueltan"), Tfin2 = f2.fin;
const Tpot = f3.t("potasio"), Tocho = f3.t("ocho"), Tuno = f3.t("uno"), Trad = f3.t("radiactivo"), Tpero = f4.inicio, Tuna = f4.t("una");

// el punto en el que entra la cámara (el átomo verde está justo ahí)
const [FX, FY] = enPlatano(BX, BY, BL, BANG, 0.47, 0.05);
// la cámara: zoom (en log) y centro, por claves en las palabras
const lz = claves([[Tden, 0], [Tq + 0.3, Math.log(1.7)], [Tfin2, Math.log(1.85)], [Tpot + 0.25, Math.log(95)], [Tocho - 0.05, Math.log(95)], [f3.t("potasio", 2) + 0.4, Math.log(19)], [Tuno, Math.log(18)], [Tpero + 0.05, Math.log(17.5)], [Tuna - 0.3, 0]]);
const lc = claves([[Tden, 0], [Tq + 0.3, 0.55], [Tfin2, 0.6], [Tpot + 0.25, 1], [Tpero + 0.05, 1], [Tuna - 0.3, 0]]);
const cam = (t) => { const Z = Math.exp(lz(t)), u = lc(t); return { Z, cx: mez(540, FX, u), cy: mez(960, FY, u) }; };
const aPantalla = (c, x, y) => [(x - c.cx) * c.Z + 540, (y - c.cy) * c.Z + 960];

// los átomos de potasio alrededor del punto: una red un poco desordenada en un disco (unidades: px del plátano)
const azA = azar(808), PASO = 1.25, RAD = 0.43, RDISCO = 78;
const ATOMOS = [];
for (let j = -75; j <= 75; j++) for (let i = -66; i <= 66; i++) {
  const x = (i + (j & 1) * 0.5) * PASO + (azA() - 0.5) * 0.45, y = j * PASO * 0.866 + (azA() - 0.5) * 0.45, d = Math.hypot(x, y);
  if (d > RDISCO) continue;
  ATOMOS.push({ x, y, d, r: RAD * (0.85 + azA() * 0.3), f: azA() * 6.2832 });
}
ATOMOS.sort((a, b) => a.d - b.d); // el primero, el del centro: el radiactivo
const spriteLila = lienzo(96), spriteVerde = lienzo(96);
atomo(spriteLila.getContext("2d"), 48, 48, 44, 0); atomo(spriteVerde.getContext("2d"), 48, 48, 44, 1);

export function dibuja(g, t) {
  const c = cam(t), dentro = su(tr(Math.log(c.Z), Math.log(2.2), Math.log(6)));
  fondo(g, t, "255,170,70", 1 - dentro);
  // el plátano, con la cámara
  g.save(); g.setTransform(c.Z, 0, 0, c.Z, 540 - c.cx * c.Z, 960 - c.cy * c.Z);
  k.brillo(g, BX, BY, 1900, "verde", 0.35);
  platano(g, BX, BY, BL, BANG, { rayos: 1 });
  g.restore();
  // dentro de la pulpa: un velo cálido y la textura de sus células, que se mueven con la cámara
  if (dentro > 0.01) {
    g.save(); g.globalAlpha = dentro;
    const pg = g.createRadialGradient(540, 960, 100, 540, 960, 1300);
    pg.addColorStop(0, "rgb(190,150,70)"); pg.addColorStop(1, "rgb(80,55,20)");
    g.fillStyle = pg; g.fillRect(0, 0, 1080, 1920);
    const tam = 1400 * Math.pow(c.Z / 95, 0.5), ox = (((-(c.cx - FX) * c.Z) % tam) + tam) % tam;
    g.globalCompositeOperation = "multiply"; g.globalAlpha = dentro * 0.5;
    for (let a = -1; a < 2; a++) for (let b = -1; b < 3; b++) g.drawImage(k.red, ox + a * tam, b * tam + 960 - tam, tam, tam);
    g.restore();
  }
  // los átomos que se rompen en todo el plátano: se ven mientras la cámara no ha entrado
  const fuera = 1 - su(tr(Math.log(c.Z), Math.log(2.1), Math.log(3.5)));
  if (fuera > 0.01) {
    const largo = 380 + 900 * su(tr(t, Tsu - 0.1, Tsu + 0.4)) * (1 - su(tr(t, Tfin2, Tfin2 + 0.4)));
    g.save(); g.globalAlpha = fuera;
    for (const r of ROTURAS) {
      if (r.t > t || t - r.t > 0.7) continue;
      const [wx, wy] = dondeRotura(r), [x, y] = aPantalla(c, wx, wy);
      if (r.t > Tuna - 0.5) continue;
      const poco = 1 - 0.6 * su(tr(r.t, Tpero, Tpero + 0.4));
      destello(g, x, y, t - r.t, 150 * Math.sqrt(c.Z) * poco, r.dir, largo * poco);
    }
    g.restore();
  }
  // las bolitas de potasio
  const vis = su(tr(Math.log(c.Z), Math.log(3), Math.log(6)));
  if (vis > 0.01) {
    const verde = su(tr(t, Tuno - 0.1, Tuno + 0.25));
    const fade = (d) => 1 - su(tr(d, RDISCO * 0.6, RDISCO));
    for (let i = ATOMOS.length - 1; i >= 0; i--) {
      const a = ATOMOS[i], x = (FX + a.x - c.cx) * c.Z + 540, y = (FY + a.y - c.cy) * c.Z + 960, r = a.r * c.Z * (1 + 0.04 * Math.sin(t * 3 + a.f));
      if (x < -r || x > 1080 + r || y < -r || y > 1920 + r) continue;
      const al = vis * fade(a.d) * (i === 0 ? 1 : 1 - 0.35 * verde);
      if (al < 0.02) continue;
      g.globalAlpha = al;
      g.drawImage(spriteLila, x - r * 1.09, y - r * 1.09, r * 2.18, r * 2.18);
      if (i === 0 && verde > 0) { g.globalAlpha = al * verde; g.drawImage(spriteVerde, x - r * 1.09, y - r * 1.09, r * 2.18, r * 2.18); }
    }
    g.globalAlpha = 1;
    // el radiactivo: late y se rompe en «radiactivo»
    const [x0, y0] = aPantalla(c, FX, FY);
    k.brillo(g, x0, y0, 220 * Math.sqrt(c.Z / 8), "verde", verde * (0.55 + 0.25 * Math.sin((t - Tuno) * 9)) * vis);
    destello(g, x0, y0, t - Trad, 260 * Math.sqrt(c.Z / 8), -0.9, 600);
  }
  // fuera otra vez («Pero es tan poquito»): el destello del verde, pequeñito, en el plátano entero
  if (t > Tpero) { const [x0, y0] = aPantalla(c, FX, FY); k.brillo(g, x0, y0, 90, "verde", 0.8 * k.pulso(t, Tpero + 0.9, 0.25)); }
  // las cifras
  const p15 = su(tr(t, Tq - 0.1, Tq + 0.15)) * (1 - su(tr(t, Tfin2 - 0.1, Tfin2 + 0.15)));
  k.pastilla(g, 540, 1330, "15", "por segundo", "190,255,140", p15, 120);
  const p8 = su(tr(t, Tocho - 0.1, Tocho + 0.15)) * (1 - su(tr(t, Tpero - 0.2, Tpero + 0.1)));
  k.pastilla(g, 540, 1330, Tuno - 0.1 < t ? "1 de cada 8.000" : "8.000", "", Tuno - 0.1 < t ? "190,255,140" : "226,190,255", p8, 100);
  vineta(g, 0.5);
  velo(g, 0.55);
}
