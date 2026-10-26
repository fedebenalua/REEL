// Despiertan, nombran dibujos, una chispa parte la palabra, y siguen tranquilos.
import * as k from "#kit";
import { v } from "#voz";
import { quirofano, lampara, craneo, cerebro, ojo, boca, manzana, llave, manoPaciente, sonda, guante, velo } from "../mundo.js";

export const desde = "quirofano";
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Tdes = f5.t("despiertan");
const Tman = f6.t("manzana"), Tlla = f6.t("llave"), Tmano = f6.t("mano");
const Tqui = f7.t("quitar");
const Tchi = f8.t("chispa"), Tmed = f8.t("medias");
const TfinChi = f9.t("chispa"), Tvue = f9.t("vuelve"), Tcor = f9.t("cortan");
const Ttra = f10.t("tranquilo");
const Ttoq = f11.t("toque");

export function dibuja(g, t) {
  const abierto = k.suave(k.tramo(t, Tdes - 0.04, Tdes + 0.42));
  const habla = (t > Tdes && t < Tqui) || t > Ttra ? 0.25 + 0.45 * Math.max(0, Math.sin(t * 5)) : 0.12;
  const man = k.entra(k.tramo(t, Tman - 0.12, Tman + 0.45));
  const lla = k.entra(k.tramo(t, Tlla - 0.1, Tlla + 0.4));
  const sube = k.entra(k.tramo(t, Tmano - 0.08, Tmano + 0.4));
  const aCerebro = k.suave(k.tramo(t, 22.3, 25.15));
  const aPalabra = k.suave(k.tramo(t, 27.1, 28.7));
  const aCara = k.suave(k.tramo(t, 33.3, 35.1)) * (1 - k.suave(k.tramo(t, 36.85, 37.55)));
  const marca = k.suave(k.tramo(t, Tqui - 0.08, Tqui + 0.3));
  const chispa = k.suave(k.tramo(t, Tchi - 0.06, Tchi + 0.16)) * (1 - k.suave(k.tramo(t, TfinChi, TfinChi + 0.3)));
  const abre = k.suave(k.tramo(t, Tmed - 0.1, Tmed + 0.4)) * (1 - k.suave(k.tramo(t, Tvue - 0.08, Tvue + 0.4)));
  const sondaAl = (t > Tchi - 0.5 && t < Tcor + 0.45) ? 1 - k.suave(k.tramo(t, Tcor - 0.02, Tcor + 0.4)) : 0;

  quirofano(g, t);
  lampara(g, 0.9);

  const faseCara = Math.max(1 - aCerebro, aCara);
  const faseCosas = man * (1 - aCerebro) * (1 - aCara);
  const cx = k.mez(540, 400, Math.max(aCerebro, aPalabra));
  const cy = k.mez(1180, 1040, aCerebro);
  const S = k.mez(240, 330, Math.max(aCerebro, aPalabra * 0.85));

  if (faseCara > 0.05 || aCerebro < 0.95) {
    craneo(g, cx, cy, S);
    cerebro(g, cx, cy, S * 0.78, { presion: chispa * 0.8, tx: 0.08, ty: 0.05, brillo: 0.05 });
  }
  if (marca > 0.04 && aCara < 0.5) {
    g.save();
    g.globalAlpha = marca;
    g.strokeStyle = "#ffe08a";
    g.lineWidth = 10;
    g.beginPath();
    g.ellipse(cx + 50, cy - 10, 78, 52, 0.3, 0, 6.28);
    g.stroke();
    g.restore();
  }
  if (sondaAl > 0.05) sonda(g, cx + 90, cy - 30 - (1 - sondaAl) * 280, 200, Math.max(sondaAl, chispa));
  if (chispa > 0.05) {
    k.brillo(g, cx + 30, cy + 10, 200, "blanca", chispa);
    k.fogonazo(g, cx + 30, cy + 10, k.tramo(t, Tchi, Tchi + 0.6), 320, "190,220,255");
  }

  if (faseCara > 0.08) {
    const ox = 300, oy = k.mez(860, 760, aCara), os = k.mez(100, 170, Math.max(faseCara, aCara));
    g.save();
    g.globalAlpha = Math.min(1, faseCara);
    g.fillStyle = "#f0b090";
    g.beginPath(); g.ellipse(ox, oy + 20, os * 1.55, os * 1.2, 0, 0, 6.28); g.fill();
    g.restore();
    ojo(g, ox, oy, os, abierto);
    boca(g, ox + 8, oy + os * 1.05, os * 0.5, habla);
  }

  if (man > 0.02 && aCara < 0.7) {
    const ax = k.mez(1200, aPalabra > 0.2 ? 820 : 300, man);
    const ay = k.mez(1500, aPalabra > 0.2 ? 980 : 900, man);
    const as = aPalabra > 0.2 ? 200 : 170;
    g.save();
    g.globalAlpha = man * (1 - aCara) * (1 - aCerebro * 0.9);
    manzana(g, ax, ay, as, abre);
    g.restore();
  }
  if (lla > 0.02 && t < Tqui + 0.2) {
    g.save();
    g.globalAlpha = lla * (1 - aCerebro);
    llave(g, k.mez(1100, 780, lla), k.mez(1600, 1180, lla), 130, 0.5);
    g.restore();
  }
  if (sube > 0.02 && t < Tqui) {
    manoPaciente(g, 760, 1750, 150, sube * 420);
  }
  const alGuante = k.suave(k.tramo(t, Ttoq - 0.2, Ttoq + 0.45));
  if (alGuante > 0.02) {
    g.save();
    g.globalAlpha = alGuante;
    guante(g, 620, 980, 200, 10);
    g.restore();
  }
  velo(g, 0.75);
}
