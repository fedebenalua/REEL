// «¿Para qué sirven los botones de colores del mando de la tele? Rojo, verde, amarillo y azul: seguro que no los has
// tocado nunca. Son la llave de una pantalla que llegó a tu tele antes que internet.»
// Un solo sitio: el mando, de cerca, con sus cuatro botones. Una cámara.
// - 0 s: la cámara cae sobre el botón rojo, enorme, y se echa atrás hasta ver los cuatro. De cada uno sube un «?».
// - «rojo, verde, amarillo, azul»: cada botón salta cuando se nombra, con su anillo de luz.
// - «seguro que no los has tocado nunca»: el polvo los cubre, cae una telaraña y baja una araña.
// - «son la llave»: una llave de luz cruza el mando y limpia el polvo y la tela; la araña huye.
// - «una pantalla… antes que internet»: los cuatro botones se aplastan hasta ser las cuatro barras de colores de
//   abajo de una página de teletexto, que se escribe sola mientras la cámara sube. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { macro, X, R, rgb } from "../botones.js";
import { pagina, PAG, enlaces, COLS, ROWS } from "../teletexto.js";

export const desde = 0;

const { suave: su, tramo: tr, mez } = k;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
const Tcol = f1.t("colores");
const NOM = [f2.t("rojo"), f2.t("verde"), f2.t("amarillo"), f2.t("azul")];
const Tseg = f2.t("seguro"), Ttoc = f2.t("tocado");
const Tlla = f3.t("llave"), Tpan = f3.t("pantalla"), Tint = f3.t("internet");
const FIN = v.frase(4).inicio;

const cam = camino2D([
  [0, [2.5, -360, 0]], [0.5, [2.5, -360, 0]], [1.5, [1.0, 0, 0]], [Tlla + 0.5, [1.0, 0, 0]], [Tpan + 1.7, [1.1, 0, -330]], [FIN, [1.14, 0, -330]],
]);

const PW = 960, PH = 720, PY = -705;                     // la página: su esquina de arriba a la izquierda es (-480, PY)
const bandaX = (t) => mez(-760, 760, su(tr(t, Tlla - 0.05, Tlla + 0.75)));

function llave(g, x, y, ang, al) {
  g.save(); g.translate(x, y); g.rotate(ang); g.globalAlpha = al;
  k.brillo(g, 0, 0, 200, "255,215,90", 0.8);
  g.strokeStyle = "#ffe27a"; g.lineWidth = 16; g.lineCap = "round"; g.lineJoin = "round";
  g.beginPath(); g.arc(-70, 0, 38, 0, 6.2832); g.stroke(); g.beginPath(); g.moveTo(-32, 0); g.lineTo(110, 0); g.moveTo(80, 0); g.lineTo(80, 36); g.moveTo(108, 0); g.lineTo(108, 28); g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 5; g.beginPath(); g.arc(-70, 0, 38, 0, 6.2832); g.moveTo(-32, 0); g.lineTo(110, 0); g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bx = bandaX(t);
  // lo que pasa con cada botón
  const aplasta = su(tr(t, Tpan + 0.15, Tpan + 1.3));
  const lim = (i) => su(tr(bx, X[i] - 130, X[i] + 130)) * (t > Tlla - 0.05 ? 1 : 0);
  const polvo = [0, 1, 2, 3].map((i) => su(tr(t, Tseg + 0.1 * i, Tseg + 1.3 + 0.1 * i)) * (1 - lim(i)));
  const bote = [0, 1, 2, 3].map((i) => Math.sin(Math.PI * tr(t, NOM[i], NOM[i] + 0.45)));
  const preg = [0, 1, 2, 3].map((i) => tr(t, Tcol + 0.1 * i, Tcol + 1.6 + 0.1 * i));
  const web = su(tr(t, Tseg + 0.35, Tseg + 1.4)) * (1 - su(tr(t, Tlla + 0.15, Tlla + 0.75)));
  const huye = su(tr(t, Tlla + 0.1, Tlla + 0.55));
  const aranaY = t > Tseg + 0.3 && huye < 0.999 ? mez(-1000, -330 + 12 * Math.sin(t * 4), su(tr(t, Ttoc - 0.5, Ttoc + 0.3))) - 900 * huye : null;
  const fondo = 1 - su(tr(t, Tpan + 0.1, Tpan + 1.0));
  macro(g, t, { aplasta, lit: [1, 1, 1, 1], bote, polvo, web, aranaY, preg, fondo });
  // el anillo de luz de cada botón al nombrarlo
  g.save(); g.globalCompositeOperation = "lighter";
  NOM.forEach((T, i) => { const u = (t - T) / 0.85; if (u < 0 || u > 1) return; g.strokeStyle = `rgba(${rgb(i)},${0.9 * (1 - u)})`; g.lineWidth = 12 * (1 - u) + 3; g.beginPath(); g.arc(X[i], 0, R * (1.15 + 1.9 * u), 0, 6.2832); g.stroke(); });
  g.restore();
  // la banda de luz y la llave
  if (t > Tlla - 0.15 && t < Tlla + 1.1) {
    const a = 1 - su(tr(t, Tlla + 0.7, Tlla + 1.05));
    g.save(); g.globalCompositeOperation = "lighter"; const bg = g.createLinearGradient(bx - 190, 0, bx + 190, 0); bg.addColorStop(0, "rgba(255,225,120,0)"); bg.addColorStop(0.65, `rgba(255,225,120,${0.5 * a})`); bg.addColorStop(1, "rgba(255,225,120,0)");
    g.fillStyle = bg; g.fillRect(bx - 190, -520, 380, 1040); g.restore();
    g.save(); g.translate(bx - 40, -330); g.scale(1.7, 1.7); llave(g, 0, 0, -0.25 + 0.4 * Math.sin(t * 9), a); g.restore();
  }
  // la página de teletexto se va escribiendo detrás de los botones aplastados
  if (t > Tpan + 0.1) {
    const neg = su(tr(t, Tpan + 0.1, Tpan + 1.0));
    g.save(); g.globalCompositeOperation = "destination-over"; g.fillStyle = `rgba(0,0,0,${neg})`; g.fillRect(-1200, -1800, 2400, 3600); g.restore();
    const p = su(tr(t, Tpan + 0.35, Tpan + 1.9)), chh = PH / ROWS;
    g.save(); g.translate(-PW / 2, PY - chh / 2 + 0); g.beginPath(); g.rect(0, 0, PW, PH * p + 2); g.clip();
    const al = su(tr(t, Tpan + 0.35, Tpan + 0.7));
    g.globalAlpha = al; pagina(g, PW, PH, PAG.indice, { enl: [0, 0, 0, 0] }); g.restore();
    // la línea de carga que baja
    if (p > 0.01 && p < 0.995) { g.save(); g.translate(-PW / 2, PY - chh / 2); g.fillStyle = "rgba(43,233,255,0.9)"; g.fillRect(0, PH * p, PW, 5); g.fillStyle = "rgba(43,233,255,0.25)"; g.fillRect(0, PH * p - 20, PW, 25); g.restore(); }
    // las barras de colores de abajo: los botones, ya planos, pasan a ser ellas
    const sw = su(tr(t, Tpan + 1.2, Tpan + 1.5));
    if (sw > 0.01) { g.save(); g.translate(-PW / 2, PY - chh / 2); g.globalAlpha = sw; enlaces(g, PW, chh, PW / COLS, [1, 1, 1, 1]); g.restore(); }
    // el barrido de «antes que internet»
    const ba = tr(t, Tint - 0.05, Tint + 0.6);
    if (ba > 0 && ba < 1) { g.save(); g.globalCompositeOperation = "lighter"; const yy = PY + (PH - 30) * su(ba); const gg = g.createLinearGradient(0, yy - 60, 0, yy + 60); gg.addColorStop(0, "rgba(255,255,255,0)"); gg.addColorStop(0.5, `rgba(255,255,255,${0.5 * Math.sin(ba * Math.PI)})`); gg.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gg; g.fillRect(-PW / 2, yy - 60, PW, 120); g.restore(); }
  }
  sinVista(g);
  velo(g, 0.55);
  vineta(g, 0.45);
}

export const momentos = { rojo: NOM[0], verde: NOM[1], amarillo: NOM[2], azul: NOM[3], llave: Tlla, pantalla: Tpan };
