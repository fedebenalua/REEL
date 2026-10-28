// «No inventó tristeza: escondió del muro publicaciones alegres, que seguían en el perfil.»
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, telefono, muro, carta, sol, CARTAS } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez } = k;
const f7 = v.frase(7);
const Tno = f7.inicio, Tesc = f7.t("escondio"), Tseg = f7.t("seguian"), Tper = f7.t("perfil");

export function dibuja(g, t) {
  sala(g, "#100818", "#0c1428", t);
  const rechaza = su(tr(t, Tno + 0.05, Tno + 0.85));
  const vaYVuelve = Math.sin(Math.min(1, rechaza) * Math.PI);
  const ocultar = su(tr(t, Tesc, Tesc + 1.15));
  const alPerfil = su(tr(t, Tseg - 0.05, Tper + 0.15));

  k.brillo(g, 540, 1100, 900, "255,170,60", 0.16 * (1 - alPerfil));

  g.save();
  g.translate(mez(0, -1200, alPerfil), 0);

  telefono(g, 540, 1120, 780, 1280, 0, (c, x, y, w, h) => {
    muro(c, x, y, w, h, t * 0.35, "azul", ocultar);
    // una publicación triste que entra y se va: no la inventaron
    if (vaYVuelve > 0.02) {
      const dx = (1 - vaYVuelve) * -w * 0.5;
      c.save();
      c.globalAlpha = vaYVuelve;
      k.redondo(c, x + 50 + dx, y + h * 0.34, w * 0.8, h * 0.16, 16);
      const gr = c.createLinearGradient(0, y, 0, y + h);
      gr.addColorStop(0, "#3a2458");
      gr.addColorStop(1, "#241433");
      c.fillStyle = gr;
      c.fill();
      c.fillStyle = "rgba(200,180,230,0.35)";
      k.redondo(c, x + 80 + dx, y + h * 0.4, w * 0.4, 16, 6);
      c.fill();
      c.restore();
    }
  });
  g.restore();

  // el perfil, donde la publicación alegre sigue
  g.save();
  g.globalAlpha = Math.min(1, alPerfil * 1.15);
  g.translate(mez(1100, 0, alPerfil), 0);
  telefono(g, 540, 1120, 780, 1280, 0, (c, x, y, w, h) => {
    const fondo = c.createLinearGradient(x, y, x, y + h);
    fondo.addColorStop(0, "#1a1408");
    fondo.addColorStop(1, "#120e18");
    c.fillStyle = fondo;
    c.fillRect(x, y, w, h);
    // avatar
    const ax = x + w / 2, ay = y + h * 0.2;
    const ag = c.createRadialGradient(ax - 20, ay - 20, 10, ax, ay, 90);
    ag.addColorStop(0, "#ffe0b8");
    ag.addColorStop(1, "#e09048");
    c.beginPath();
    c.arc(ax, ay, 86, 0, 6.2832);
    c.fillStyle = ag;
    c.fill();
    c.fillStyle = "rgba(255,220,170,0.35)";
    k.redondo(c, ax - 70, ay + 120, 140, 18, 8);
    c.fill();
    // la publicación alegre, quieta en el perfil
    carta(c, x + w * 0.08, y + h * 0.42, w * 0.84, h * 0.22, true);
    carta(c, x + w * 0.08, y + h * 0.68, w * 0.84, h * 0.16, false);
  });
  g.restore();

  void CARTAS;
  void sol;
  velo(g, 0.8);
}
