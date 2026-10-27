// El estudio: 24 personas, el cortisol un 40 % más alto, y dos años después otra vez igual.
import * as k from "#kit";
import { v } from "#voz";
import { figurin, tubo, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(10).inicio - 0.04;
export const entrada = "corte";

const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const T24 = f10.t("veinticuatro");
const Tseis = f10.t("seis");
const T40 = f11.t("cuarenta");
const Tdos = f12.t("dos");
const Tigual = f12.t("igual");

export function dibuja(g, t) {
  const llega = k.entra(k.tramo(t, desde(v), desde(v) + 0.8));
  const tubos = k.suave(k.tramo(t, f11.inicio, f11.inicio + 0.7));
  const sube = k.suave(k.tramo(t, T40 - 0.1, T40 + 0.9));
  const baja = k.suave(k.tramo(t, Tdos + 0.15, Tigual + 0.25));
  const alto = k.mez(1.42, 1, baja) * sube + (1 - sube) * 0.15;
  const base = k.suave(k.tramo(t, f11.inicio + 0.15, T40 + 0.45));
  const reposo = k.suave(k.tramo(t, f12.fin - 0.45, f12.fin - 0.12));
  const zoom = k.mez(1, 0.92, reposo);

  g.fillStyle = "#140810";
  g.fillRect(0, 0, 1080, 1920);
  const fondo = g.createRadialGradient(540, 900, 40, 540, 980, 1000);
  fondo.addColorStop(0, "#4a2040");
  fondo.addColorStop(1, "#10060c");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  const suelo = g.createLinearGradient(0, 1200, 0, 1700);
  suelo.addColorStop(0, "#3a1828");
  suelo.addColorStop(1, "#10080c");
  g.fillStyle = suelo;
  g.fillRect(0, 1280, 1080, 640);

  g.save();
  g.translate(540, 860);
  g.scale(zoom * k.mez(1, 0.58, tubos), zoom * k.mez(1, 0.58, tubos));
  g.translate(-540, -860 + k.mez(0, -160, tubos));
  for (let i = 0; i < 24; i++) {
    const col = i % 6, fil = Math.floor(i / 6);
    const x = 150 + col * 156;
    const y = 760 + fil * 200;
    const apar = k.suave(k.tramo(t, desde(v) + i * 0.025, desde(v) + 0.35 + i * 0.025));
    g.globalAlpha = apar * llega * (1 - tubos * 0.82);
    const esc = 1.2 - fil * 0.14;
    figurin(g, x, y, 230 * esc, 100 + i * 17);
  }
  g.restore();
  g.globalAlpha = 1;

  const a24 = k.suave(k.tramo(t, T24, T24 + 0.25)) * (1 - k.suave(k.tramo(t, Tseis - 0.15, Tseis + 0.15)));
  const a6 = k.suave(k.tramo(t, Tseis, Tseis + 0.25)) * (1 - k.suave(k.tramo(t, f11.inicio, f11.inicio + 0.3)));
  if (a24 > 0.03) k.pastilla(g, 540, 1180, "24", "personas", "255,186,210", a24, 84);
  if (a6 > 0.03) k.pastilla(g, 540, 1180, "6", "meses", "255,214,140", a6, 90);

  if (tubos > 0.02) {
    g.save();
    g.globalAlpha = tubos;
    tubo(g, 360, 1360, 180, 520, base * (1 - reposo * 0.02) + 0.02, "180,90,120", t * (1 - reposo));
    tubo(g, 720, 1360, 180, 520, Math.min(1, alto / 1.42), "255,70,90", t * (1 - reposo));
    g.restore();
    const a40 = k.suave(k.tramo(t, T40, T40 + 0.3)) * (1 - k.suave(k.tramo(t, Tdos - 0.1, Tdos + 0.25)));
    const a2 = k.suave(k.tramo(t, Tdos, Tdos + 0.3)) * (1 - k.suave(k.tramo(t, f12.fin - 0.35, f12.fin)));
    if (a40 > 0.03) k.pastilla(g, 720, 760, "40", "%", "255,120,130", a40, 96);
    if (a2 > 0.03) k.pastilla(g, 540, 700, "2", "años", "255,220,170", a2, 96);
  }
  velo(g, 0.6);
}
