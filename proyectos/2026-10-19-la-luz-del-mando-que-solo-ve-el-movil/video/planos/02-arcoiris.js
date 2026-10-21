// «Es luz infrarroja: un color que está más allá del rojo, y tus ojos no lo pueden ver.»
// «Pero la cámara del móvil sí lo capta, y te lo enseña en un color que sí ves.»
// El arcoíris: una franja de luz de colores en la oscuridad. Se entra con un corte en «Es».
// - «Es luz infrarroja»: el arcoíris entero, que brilla y se mueve como luz; «más allá del rojo»: la cámara corre
//   hasta el rojo y lo pasa; detrás, todo oscuro, con un temblor; «infrarrojo», su nombre.
// - «Pero la cámara del móvil»: sube un móvil delante de lo oscuro, y en su pantalla esa franja brilla morada;
//   «capta»: se enciende fuerte.
import * as k from "#kit";
import { v } from "#voz";
import { movil } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f3 = v.frase(3), f4 = v.frase(4);
export const desde = (vz) => vz.frase(3).inicio;
const T0 = f3.inicio, Tmas = f3.t("mas"), Troj = f3.t("rojo"), Tojo = f3.t("ojos");
const Tcam = f4.t("camara"), Tcap = f4.t("capta"), Tens = f4.t("ensena"), Fin = v.frase(5).inicio;

// el mundo: los colores de x = 0 (violeta) a x = 2100 (rojo); después, el infrarrojo, oscuro
const COLORES = ["#8a3dff", "#3d5bff", "#29c6ff", "#3ee26a", "#ffe23d", "#ff9a2e", "#ff2e3d"];
const ROJO_FIN = 2100, IR = 2620, Y = 1000, ALTO = 460;
const S = (c, X) => (X - c.x) * c.z + 540;
function camara(t) {
  const u = su(tr(t, Tmas - 0.3, Troj + 0.45));
  return { x: mez(ROJO_FIN / 2 + 40, ROJO_FIN + 260, u), z: mez(0.46, 1, u) };
}

function franja(g, c, t, ir) {
  const h = ALTO * mez(0.75, 1, c.z), x0 = S(c, 0), x1 = S(c, ROJO_FIN), x2 = S(c, ROJO_FIN + 260);
  g.save(); g.globalCompositeOperation = "lighter";
  // el arcoíris
  const gr = g.createLinearGradient(x0, 0, x2, 0);
  COLORES.forEach((col, i) => gr.addColorStop((i / 6) * ((x1 - x0) / (x2 - x0)), col));
  gr.addColorStop(1, "rgba(255,46,61,0)");
  const vg = (yy) => yy;
  g.fillStyle = gr; g.globalAlpha = 0.9;
  const sombra = g.createLinearGradient(0, Y - h, 0, Y + h);
  g.fillRect(x0 - 60 * c.z, Y - h / 2, x2 - x0 + 60 * c.z, h);
  g.globalAlpha = 1;
  // el brillo: la luz se mueve dentro
  g.globalAlpha = 0.25; for (let x = x0; x < x2; x += 640 * c.z) g.drawImage(k.causticas, x - ((t * 120) % (640 * c.z)), Y - h / 2, 640 * c.z, h);
  g.globalAlpha = 1;
  // el infrarrojo: solo si lo ve el móvil
  if (ir > 0) {
    const gi = g.createLinearGradient(x1, 0, S(c, IR + 900), 0);
    gi.addColorStop(0, "rgba(255,90,200,0)"); gi.addColorStop(0.2, `rgba(220,110,255,${ir})`); gi.addColorStop(0.75, `rgba(255,170,255,${ir})`); gi.addColorStop(1, "rgba(220,110,255,0)");
    g.fillStyle = gi; g.fillRect(x1, Y - h / 2, S(c, IR + 900) - x1, h);
    k.brillo(g, S(c, IR), Y, 1100 * c.z, "220,120,255", 0.8 * ir);
  }
  g.restore();
  // bordes suaves: arriba y abajo, oscuro
  for (const [a, b] of [[Y - h / 2 - 2, Y - h / 2 + h * 0.2], [Y + h / 2 + 2, Y + h / 2 - h * 0.2]]) {
    const bg = g.createLinearGradient(0, a, 0, b); bg.addColorStop(0, "rgba(10,8,22,1)"); bg.addColorStop(1, "rgba(10,8,22,0)");
    g.fillStyle = bg; g.fillRect(0, Math.min(a, b), 1080, Math.abs(b - a));
  }
  // el halo de la luz arriba y abajo
  k.brillo(g, (x0 + x1) / 2, Y, (x1 - x0) * 1.3, "255,255,255", 0.12);
}

export function dibuja(g, t) {
  const c = camara(t);
  const fg = g.createLinearGradient(0, 0, 0, 1920); fg.addColorStop(0, "#07060f"); fg.addColorStop(0.5, "#0e0b1c"); fg.addColorStop(1, "#06050c");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  franja(g, c, t, 0);
  // lo que no se ve: un temblor en lo oscuro
  const xi = S(c, IR), tem = su(tr(t, Troj, Tojo));
  if (tem > 0) {
    g.save(); g.strokeStyle = "rgba(210,220,255,0.2)"; g.lineWidth = 5;
    for (let i = 0; i < 5; i++) { const u = ((t * 0.8 + i / 5) % 1), r = mez(60, 520, u); g.globalAlpha = tem * Math.min(1, u * 5) * (1 - u); g.beginPath(); g.ellipse(xi, Y, r, r * 0.5, 0, 0, 6.2832); g.stroke(); }
    g.restore();
  }
  // los nombres
  const fuera = su(tr(t, Tcam - 0.2, Tcam + 0.2));
  k.etiqueta(g, S(c, ROJO_FIN - 200) - 70, Y - ALTO / 2 - 110, "rojo", "255,120,120", su(tr(t, Troj - 0.15, Troj + 0.15)) * (1 - fuera), 54);
  k.etiqueta(g, xi - 170, Y + ALTO / 2 + 40, "infrarrojo", "220,170,255", su(tr(t, Troj + 0.2, Troj + 0.5)) * (1 - fuera), 54);
  // el móvil: sube delante de lo oscuro y en su pantalla lo enseña
  const en = entra(tr(t, Tcam - 0.35, Tcam + 0.3));
  if (en > 0) {
    const cap = su(tr(t, Tcap - 0.15, Tcap + 0.2)), late = 0.12 * Math.sin((t - Tens) * 9) * su(tr(t, Tens, Tens + 0.3)) * (1 - su(tr(t, Fin - 0.6, Fin - 0.3)));
    const mx = 790, my = mez(2700, 1080, en), w = 500;
    movil(g, mx, my, w, mez(0.18, 0.04, en), (cc, W, H) => {
      cc.fillStyle = "#0b0918"; cc.fillRect(0, 0, W, H);
      // la misma vista, a través de la cámara: lo oscuro ahora brilla
      const esc = W / w;
      cc.save(); cc.translate(W / 2, H / 2); cc.scale(esc, esc); cc.rotate(-mez(0.18, 0.04, en)); cc.translate(-mx, -my);
      franja(cc, c, t, Math.min(1, 0.25 + cap * 0.85 + late));
      cc.restore();
      cc.fillStyle = "rgba(0,0,0,0.4)"; cc.fillRect(0, H - 330, W, 330); cc.fillRect(0, 0, W, 170);
      cc.strokeStyle = "#fff"; cc.lineWidth = 12; cc.beginPath(); cc.arc(W / 2, H - 165, 90, 0, 6.2832); cc.stroke();
      cc.fillStyle = "#fff"; cc.beginPath(); cc.arc(W / 2, H - 165, 72, 0, 6.2832); cc.fill();
    });
  }
}

export const momentos = { rojo: Troj, movil: Tcam, capta: Tcap };
