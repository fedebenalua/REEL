// «como una foto de un incendio que no quema.»
// La cocina, a oscuras, con el móvil enorme: dentro, el fuego. La mesa no se quema.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, velo, vineta, vista, sinVista, telefono, fuegoFoto } from "../mundo.js";

export const desde = (vz) => vz.frase(3).t("foto") - 0.04;

const f3 = v.frase(3);
const Tfoto = f3.t("foto"), Tinc = f3.t("incendio"), Tquema = f3.t("quema");
const fin = v.frase(4).inicio - 0.22;

const { suave: su, tramo: tr, mez } = k;

export function dibuja(g, t) {
  const tt = Math.min(t, fin);
  fondo(g, "120,50,20");
  const Z = mez(1.08, 1.22, su(tr(tt, Tfoto, Tquema)));
  vista(g, Z, 540, 1080);

  // pared cálida
  const par = g.createLinearGradient(0, 200, 0, 1200);
  par.addColorStop(0, "#1a0c10");
  par.addColorStop(1, "#3a1a14");
  g.fillStyle = par;
  g.fillRect(0, 0, 1080, 1300);
  // mesa de madera
  const madera = g.createLinearGradient(0, 1280, 0, 1920);
  madera.addColorStop(0, "#8a4e28");
  madera.addColorStop(0.4, "#5c3016");
  madera.addColorStop(1, "#2a140c");
  g.fillStyle = madera;
  g.fillRect(0, 1320, 1080, 700);
  g.save();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, 0, 1280, 1080, 640);
  g.restore();
  // servilleta clara, sin una marca de quemadura
  g.fillStyle = "#f4efe4";
  k.redondo(g, 250, 1360, 580, 220, 18);
  g.fill();
  g.save();
  g.globalAlpha = 0.15;
  g.drawImage(k.manchas, 250, 1360, 580, 220);
  g.restore();

  const acerca = su(tr(tt, Tfoto, Tinc + 0.2));
  const h = mez(760, 900, acerca);
  telefono(g, 540, mez(1180, 1080, acerca), h, -0.04, (gg, w, hh) => fuegoFoto(gg, w, hh, Math.min(t, fin)));

  // una lengua intenta salir del cristal y se apaga antes de tocar la servilleta
  const saleF = Math.min(t, fin);
  const sale = su(tr(saleF, Tquema - 0.15, Tquema + 0.12)) * (1 - su(tr(saleF, Tquema + 0.12, Tquema + 0.38)));
  if (sale > 0.02) {
    g.save();
    g.globalAlpha = sale;
    k.lengua(g, 540, 820, 180 * sale, 70, saleF, 1, "255,120,40", "255,220,120");
    g.restore();
  }

  // la luz del fuego en la mesa, y la servilleta sigue clara
  g.save();
  g.globalCompositeOperation = "lighter";
  const luz = g.createRadialGradient(540, 1280, 20, 540, 1400, 420);
  luz.addColorStop(0, "rgba(255,140,60,0.35)");
  luz.addColorStop(1, "rgba(255,140,60,0)");
  g.fillStyle = luz;
  g.fillRect(200, 1200, 700, 500);
  g.restore();

  sinVista(g);
  vineta(g, 0.5);
  velo(g, 0.84);
}
