// «Así que cada vez que cambias de canal, le estás mandando un mensaje en morse.»
// «Y con tu móvil también puedes manejar la tele: descarga la app que te dejo en la bio.»
// El salón otra vez, como en el hook. Sigue al plano del ojito: la cámara se aleja de la tele hasta ver el mando.
// - «cambias de canal»: el botón del canal se hunde, salen los destellos y en «canal» la tele pasa del fútbol al
//   espacio. «mensaje en morse»: los destellos salen a golpes, con sus pausas, como el tren de antes.
// - «Y con tu móvil»: el mando baja y se va; sube un móvil en su sitio, con una app de mando en la pantalla.
//   «manejar la tele»: un toque en el + y la barra del volumen sube en la tele.
// - «descarga la app»: la pantalla del móvil enseña la app para descargar; en «app» el icono salta; «bio»: la
//   etiqueta «Link en la bio».
import * as k from "#kit";
import { v } from "#voz";
import { CODIGO, ROJO, destello, mando, movil, ojito, pr, punta, salon, velo } from "../mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f9 = v.frase(9), f10 = v.frase(10);
export const desde = (vz) => vz.frase(9).inicio;
export const entrada = "sigue";
const Tcam = f9.t("cambias"), Tcan = f9.t("canal"), Tmen = f9.t("mensaje"), Tmor = f9.t("morse");
const Tmov = f10.t("movil"), Tman = f10.t("manejar"), Tdes = f10.t("descarga"), Tapp = f10.t("app"), Tbio = f10.t("bio");

// los destellos: al cambiar de canal, y luego a golpes con el número (cada 1, una pausa larga)
const SALIDAS = [];
for (let te = Tcam; te < Tcan + 0.3; te += 0.12) SALIDAS.push(te);
{ let te = Tmen - 0.35; for (const b of [...CODIGO, ...CODIGO]) { SALIDAS.push(te); te += b ? 0.3 : 0.12; if (te > Tmor + 0.5) break; } }
const DESDE_MOVIL = []; for (let te = Tman + 0.05; te < Tman + 0.5; te += 0.12) DESDE_MOVIL.push(te);

const T0 = f9.inicio, Fin = v.duracion;
const DE = { x: 0, y: -180, z: 2.35 }, A = { x: 0, y: 20, z: 0.6 };
const camara = (t) => { const u = su(tr(t, T0, Tcam - 0.05)), e = su(tr(t, Tbio, Fin)); return { x: 0, y: mez(DE.y, A.y, u) + 30 * e, z: mez(DE.z, A.z, u) + 0.35 * e }; };

export function dibuja(g, t) {
  const cam = camara(t);
  const canal = 1 + su(tr(t, Tcan + 0.05, Tcan + 0.5));
  const vol = mez(0.75, 0.95, su(tr(t, Tman + 0.35, Tman + 0.9)));
  const volAl = Math.max(1 - su(tr(t, T0 + 0.2, Tcam)), su(tr(t, Tman + 0.2, Tman + 0.4)) * (1 - su(tr(t, Tdes, Tdes + 0.3))));
  salon(g, cam, t, { encendida: 1, canal, volumen: vol, volAl });
  // el mando: se va hacia abajo al llegar el móvil
  const va = k.sale(tr(t, Tmov - 0.45, Tmov + 0.1));
  const M = { X: 6, Y: 92 + va * 260, Z: 4.6, ang: -0.32 - 0.2 * va };
  mando(g, cam, t, { pulsaCanal: Math.min(1, k.pulso(t, Tcam + 0.02, 0.12) * 1.4), led: SALIDAS.reduce((m, te) => Math.max(m, k.pulso(t, te, 0.03)), 0) }, M);
  const a = punta(cam, M), b = ojito(cam);
  for (const te of SALIDAS) destello(g, a, b, (t - te) / 0.5, 100);
  // el móvil sube en su sitio
  const sube = entra(tr(t, Tmov - 0.15, Tmov + 0.45));
  if (sube > 0) {
    const mx = 560, my = mez(2600, 1270, sube), ang = mez(-0.1, -0.12, sube);
    const toque = k.pulso(t, Tman + 0.05, 0.12);
    const tienda = su(tr(t, Tdes - 0.1, Tdes + 0.25));
    const salta = Math.max(0, Math.sin(Math.PI * tr(t, Tapp - 0.05, Tapp + 0.35))) * 0.18;
    movil(g, mx, my, 470, ang, (c, W, H) => {
      const bg = c.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, "#1b1440"); bg.addColorStop(1, "#0d0a20");
      c.fillStyle = bg; c.fillRect(0, 0, W, H);
      c.textAlign = "center"; c.textBaseline = "middle";
      // la app de mando
      c.save(); c.globalAlpha = 1 - tienda;
      c.fillStyle = "#fff"; c.font = "800 64px Figtree"; c.fillText("Mando TV", W / 2, 230);
      const bt = (x, y, r, col, txt, luz = 0) => {
        const gg = c.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r); gg.addColorStop(0, k.mezColor(col, "#ffffff", 0.35)); gg.addColorStop(1, col);
        c.fillStyle = gg; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill();
        c.fillStyle = "#fff"; c.font = `800 ${Math.round(r * 0.9)}px Figtree`; c.fillText(txt, x, y + 4);
        if (luz > 0) { c.strokeStyle = `rgba(255,255,255,${luz})`; c.lineWidth = 10; c.beginPath(); c.arc(x, y, r * (1 + 0.6 * (1 - luz)), 0, 6.2832); c.stroke(); }
      };
      bt(W / 2, 470, 120, "#e0283c", "⏻".length ? "I" : "");
      c.fillStyle = "rgba(255,255,255,0.08)"; c.beginPath(); c.arc(W / 2, 900, 230, 0, 6.2832); c.fill();
      bt(W / 2, 900, 95, "#5a4cd6", "OK");
      bt(W / 2 - 220, 1350, 110, "#2f7ae0", "+", toque); bt(W / 2 + 220, 1350, 110, "#2f7ae0", "-");
      bt(W / 2 - 220, 1620, 90, "#3b3d46", "1"); bt(W / 2, 1620, 90, "#3b3d46", "2"); bt(W / 2 + 220, 1620, 90, "#3b3d46", "3");
      c.restore();
      // la app, para descargar
      if (tienda > 0) {
        c.save(); c.globalAlpha = tienda;
        const s = 1 + salta, iw = 460 * s;
        c.save(); c.shadowColor = "rgba(255,80,200,0.7)"; c.shadowBlur = 80;
        k.redondo(c, W / 2 - iw / 2, 640 - iw / 2, iw, iw, iw * 0.24);
        const ig = c.createLinearGradient(0, 640 - iw / 2, 0, 640 + iw / 2); ig.addColorStop(0, "#ff5ac8"); ig.addColorStop(1, "#5a3cff");
        c.fillStyle = ig; c.fill(); c.restore();
        // en el icono, un mando pequeño
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
    // del móvil a la tele: el toque del +
    const pm = { x: mx - 30, y: my - 470 };
    for (const te of DESDE_MOVIL) destello(g, pm, b, (t - te) / 0.5, 100);
    // «bio»: la etiqueta
    const bio = entra(tr(t, Tbio - 0.1, Tbio + 0.2));
    if (bio > 0) { g.font = "800 58px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 1000 - 30 * (1 - bio), "Link en la bio", "255,140,220", bio, 58); }
  }
  velo(g, 0.45);
}

export const momentos = { canal: Tcam, movil: Tmov, toque: Tman + 0.05, app: Tapp };
