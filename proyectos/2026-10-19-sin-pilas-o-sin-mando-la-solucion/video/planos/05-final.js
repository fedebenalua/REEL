// «La solución: tu móvil también puede hablar con la tele.»
// «Descarga la app que tienes en el link de la bio, y tu móvil será tu mando.»
// El salón de noche, el mismo encuadre del plano de las pilas: sigue sin cortar, ya sin el mando.
// - «La solución»: sube un móvil delante de la tele, con una app de mando en la pantalla.
// - «hablar con la tele»: un toque en el +, salen destellos hacia la tele y la barra del volumen sube.
// - «Descarga la app»: la pantalla enseña la app para descargar; en «app» el icono salta; «bio»: «Link en la bio».
// - «tu móvil será tu mando»: vuelve la app de mando, otro toque, y la tele cambia de canal.
import * as k from "#kit";
import { v } from "#voz";
import { destello, movil, ojito, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f8 = v.frase(8), f9 = v.frase(9);
export const desde = (vz) => vz.frase(8).inicio;
export const entrada = "sigue";
const T0 = f8.inicio, Tmov = f8.t("movil"), Tman = f8.t("hablar") - 0.2, Tdes = f9.t("descarga"), Tapp = f9.t("app"), Tbio = f9.t("bio"), Tser = f9.t("sera"), Fin = v.duracion;
const Tcanal = f9.t("mando") - 0.1;
const DESDE_MOVIL = []; for (let te = Tman + 0.05; te < Tman + 0.5; te += 0.12) DESDE_MOVIL.push(te);
for (let te = Tcanal - 0.35; te < Tcanal + 0.1; te += 0.12) DESDE_MOVIL.push(te);

export function dibuja(g, t) {
  const cam = { x: 0, y: 20, z: 0.6 };
  const vol = mez(0.4, 0.8, su(tr(t, Tman + 0.35, Tman + 0.9)));
  const volAl = su(tr(t, Tman + 0.2, Tman + 0.4)) * (1 - su(tr(t, Tdes, Tdes + 0.3)));
  salon(g, cam, t, { encendida: 1, canal: su(tr(t, Tcanal, Tcanal + 0.45)), volumen: vol, volAl });
  const b = ojito(cam);
  const sube = entra(tr(t, T0 - 0.05, Tmov + 0.2));
  const mx = 560, my = mez(2600, 1270, sube), ang = -0.12;
  const toque = k.pulso(t, Tman + 0.05, 0.12), toque2 = k.pulso(t, Tcanal - 0.35, 0.12);
  const tienda = su(tr(t, Tdes - 0.1, Tdes + 0.25)) * (1 - su(tr(t, Tser - 0.3, Tser)));
  const salta = Math.max(0, Math.sin(Math.PI * tr(t, Tapp - 0.05, Tapp + 0.35))) * 0.18;
  movil(g, mx, my, 470, ang, (c, W, H) => {
    const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1b1440"); bg.addColorStop(1, "#0d0a20");
    c.fillStyle = bg; c.fillRect(0, 0, W, H);
    c.textAlign = "center"; c.textBaseline = "middle";
    c.save(); c.globalAlpha = 1 - tienda;
    c.fillStyle = "#fff"; c.font = "800 64px Figtree"; c.fillText("Mando TV", W / 2, 230);
    const bt = (x, y, r, col, txt, luz = 0) => {
      const gg = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35)); gg.addColorStop(1, col);
      c.fillStyle = gg; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
      c.fillStyle = "#fff"; c.font = `800 ${Math.round(r * 0.9)}px Figtree`; c.fillText(txt, x, y + 4);
      if (luz > 0) { c.strokeStyle = `rgba(255,255,255,${luz})`; c.lineWidth = 10; c.beginPath(); c.arc(x, y, r * (1 + 0.6 * (1 - luz)), 0, 6.2832); c.stroke(); }
    };
    bt(W / 2, 470, 120, "#e0283c", "I");
    c.fillStyle = "rgba(255,255,255,0.08)"; c.beginPath(); c.arc(W / 2, 900, 230, 0, 6.2832); c.fill();
    bt(W / 2, 900, 95, "#5a4cd6", "OK", toque2);
    bt(W / 2 - 220, 1350, 110, "#2f7ae0", "+", toque); bt(W / 2 + 220, 1350, 110, "#2f7ae0", "-");
    bt(W / 2 - 220, 1620, 90, "#3b3d46", "1"); bt(W / 2, 1620, 90, "#3b3d46", "2"); bt(W / 2 + 220, 1620, 90, "#3b3d46", "3");
    c.restore();
    if (tienda > 0) {
      c.save(); c.globalAlpha = tienda;
      const s = 1 + salta, iw = 460 * s;
      c.save(); c.shadowColor = "rgba(255,80,200,0.7)"; c.shadowBlur = 80;
      k.redondo(c, W / 2 - iw / 2, 640 - iw / 2, iw, iw, iw * 0.24);
      const ig = c.createLinearGradient(0, 640 - iw / 2, 0, 640 + iw / 2); ig.addColorStop(0, "#ff5ac8"); ig.addColorStop(1, "#5a3cff");
      c.fillStyle = ig; c.fill(); c.restore();
      c.save(); c.translate(W / 2, 640); c.scale(s, s); c.rotate(-0.3);
      k.redondo(c, -55, -150, 110, 300, 40); c.fillStyle = "#1d1e26"; c.fill();
      c.fillStyle = "#e0283c"; c.beginPath(); c.arc(0, -95, 24, 0, 6.2832); c.fill();
      c.fillStyle = "#555"; for (let j = 0; j < 3; j++) for (let i = -1; i <= 1; i++) { c.beginPath(); c.arc(i * 30, -30 + j * 40, 11, 0, 6.2832); c.fill(); }
      c.restore();
      c.fillStyle = "#fff"; c.font = "800 72px Figtree"; c.fillText("Mando TV", W / 2, 1000);
      k.redondo(c, W / 2 - 260, 1150, 520, 140, 70); c.fillStyle = "#2f7ae0"; c.fill();
      c.fillStyle = "#fff"; c.font = "800 64px Figtree"; c.fillText("Descargar", W / 2, 1222);
      c.restore();
    }
  });
  const pm = { x: mx - 30, y: my - 470 };
  for (const te of DESDE_MOVIL) destello(g, pm, b, (t - te) / 0.5, 100);
  const bio = entra(tr(t, Tbio - 0.1, Tbio + 0.2));
  if (bio > 0) { g.font = "800 58px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 1000 - 30 * (1 - bio), "Link en la bio", "255,140,220", bio, 58); }
  velo(g, 0.45);
}

export const momentos = { toque: Tman + 0.05, app: Tapp };
