// «You held your old one up to it, and it watched flashes your eyes can't see.»
// Otro sitio: los dos mandos, de cerca. El negro se levanta y apunta. La ráfaga cruza en «flashes».
// En «eyes» se apaga el cuarto y solo queda esa luz; antes del corte ya está quieta.
import * as k from "#kit";
import { v } from "#voz";
import { mando, ojo, rafaga, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio - 0.04;

const f = v.frase(4);
const Tup = f.t("up"), Tfl = f.t("flashes"), Teyes = f.t("eyes"), Tsee = f.finDe("see");

export function dibuja(g, t) {
  g.fillStyle = "#08070c"; g.fillRect(0, 0, 1080, 1920);
  const lam = g.createRadialGradient(540, 1100, 40, 540, 1100, 900);
  lam.addColorStop(0, "rgba(90,50,20,0.55)"); lam.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lam; g.fillRect(0, 0, 1080, 1920);

  const sube = k.entra(k.tramo(t, f.inicio - 0.1, Tup + 0.45));
  const acerca = 1 + 0.08 * k.suave(k.tramo(t, f.inicio, Tfl + 0.4));
  g.save(); g.translate(540, 1080); g.scale(acerca, acerca); g.translate(-540, -1080);
  const ciego = k.suave(k.tramo(t, Teyes - 0.05, Teyes + 0.22)) * (1 - k.suave(k.tramo(t, Teyes + 0.55, 11.35)));
  const ang = k.mez(-0.55, -0.22, sube);
  const yViejo = k.mez(1280, 1080, sube);
  const hV = 740, hC = 800;
  const xV = 300, xC = 790, yC = 1100;

  mando(g, xV, yViejo, hV, "tv", { ang, al: 1 - ciego * 0.55, ojo: 0.2 + 0.8 * k.tramo(t, Tfl - 0.15, Tfl + 0.1) });
  mando(g, xC, yC, hC, "core", {
    al: 1 - ciego * 0.45,
    lcd: k.suave(k.tramo(t, Tfl, f.fin)),
    aprende: k.suave(k.tramo(t, Tfl, f.fin)),
    ojo: 0.5 * k.pulso(t, Tfl + 0.35, 0.4),
  });

  // el ojo del viejo, con su giro
  const oy = yViejo - hV / 2 + hV * 0.08;
  const ox = xV + Math.sin(ang) * hV * 0.42;
  const oyy = oy - Math.cos(ang) * 0 + Math.sin(-ang) * 0;
  const dest = ojo(xC, yC, hC);
  const alR = k.suave(k.tramo(t, Tfl - 0.12, Tfl + 0.08)) * (1 - k.tramo(t, 10.7, 11.25));
  rafaga(g, ox, oyy, dest[0], dest[1], t, Tfl - 0.2, Tsee - 0.2, alR * (0.45 + ciego * 0.7));
  k.brillo(g, dest[0], dest[1], 280, "violeta", 0.55 * k.pulso(t, Tfl + 0.25, 0.18));

  g.restore();
  // el cuarto se apaga en «eyes» y vuelve un poco antes del corte, ya quieto
  g.fillStyle = `rgba(2,2,6,${ciego * 0.55})`; g.fillRect(0, 0, 1080, 1920);
  velo(g, 0.7);
}
