// Del «El mando le habla a la tele...» hasta el final, en el mismo salón que el hook: sigue sin cortar.
// - «El mando le habla a la tele»: el móvil baja y vuelve el mando de siempre; «luz»: salen destellos morados hacia
//   la tele; «no ven»: se vuelven transparentes.
// - «Pero muchas teles ya están conectadas al wifi»: el mando se va; en el mueble aparece el router y en «wifi» salen
//   sus ondas; en la tele, el símbolo del wifi.
// - «Y tu móvil también»: sube el móvil, con su wifi; «hablar entre ellos»: puntos de luz azul van y vienen.
// - «Con una app... las órdenes»: «enciende» (la tele se apaga y se enciende), «sube el volumen» (la barra sube),
//   «cambia de canal» (pasa al espacio); cada orden, un toque en el móvil y un chorro de puntos a la tele.
// - «Y el móvil siempre lo llevas encima»: se apagan las luces; una linterna busca y en «ese» lo encuentra: brilla.
// - «Descarga la app»: la pantalla del móvil enseña la app; «app»: el icono salta; «bio»: «Link en la bio»;
//   «pruébalo ahora mismo»: vuelve la app de mando, un toque, y la tele cambia de canal.
// - «Y envíaselo a ese amigo que siempre pierde el mando»: la cámara se aleja; en «pierde», el mando de siempre se
//   cae por detrás del mueble.
import * as k from "#kit";
import { v } from "#voz";
import { MANDO, appMando, destello, iconoWifi, mando, movil, ojito, ondasWifi, pr, punta, router, salon, velo, TV } from "../mundo.js";
import { CAM, MOVIL, mandoEn } from "./01-hook.js";

const { suave: su, tramo: tr, mez, entra, sale, azar } = k;
export const desde = (vz) => vz.frase(3).inicio;
export const entrada = "sigue";
const f = (n) => v.frase(n);
const T3 = f(3).inicio, Tman3 = f(3).t("mando"), Tluz = f(3).t("luz"), Tno = f(3).t("no"), Tver = f(3).t("ven");
const T4 = f(4).inicio, Tcon = f(4).t("conectadas"), Twifi = f(4).t("wifi");
const T5 = f(5).inicio, Ttam = f(5).t("tambien"), Thab = f(5).t("hablar"), Tsin = f(5).t("sin");
const T6 = f(6).inicio, Tapp6 = f(6).t("app"), Tord = f(6).t("ordenes"), Tenc = f(6).t("enciende"), Tsub = f(6).t("sube"), Tcam = f(6).t("cambia");
const T7 = f(7).inicio, Tese = f(7).t("ese"), Tpie7 = f(7).t("pierde");
const T8 = f(8).inicio, Tdes = f(8).t("descarga"), Tapp = f(8).t("app"), Tbio = f(8).t("bio"), Tpru = f(8).t("pruebalo");
const T9 = f(9).inicio, Tpie = f(9).t("pierde"), Fin = v.duracion;
const Tapaga = Tenc - 0.45, Tenciende = Tenc + 0.05;
const Tcanal = Tcam + 0.1, Tcanal2 = Tpru + 0.35;

// los destellos del mando
const LUZ = []; for (let te = Tluz - 0.05; te < Tver + 0.2; te += 0.13) LUZ.push(te);
// los toques del móvil, y un chorro de puntos azules a la tele en cada uno
const TOQUES = [Tapp6, Tapaga - 0.05, Tsub, Tcam, Tpru + 0.25];

function camara(t) {
  const a = su(tr(t, T4, Twifi)) * (1 - su(tr(t, T5, Ttam + 0.2)));
  const b = su(tr(t, T9, Fin - 0.4));
  return { x: 0, y: CAM.y - 70 * a + 40 * b, z: CAM.z + 0.55 * a - 1.8 * b };
}

// puntos de luz que van y vienen entre a y b, de t0 a t1
const azP = azar(31);
const PUNTOS = Array.from({ length: 40 }, () => ({ f: azP(), d: azP() < 0.5 ? 1 : -1, cur: (azP() - 0.5) * 220 }));
function charla(g, a, b, t, t0, t1, ida = 0) {
  const al = su(tr(t, t0, t0 + 0.2)) * (1 - su(tr(t, t1 - 0.25, t1)));
  if (al <= 0.01) return;
  g.save(); g.globalCompositeOperation = "lighter";
  for (const p of PUNTOS) {
    const dir = ida ? 1 : p.d, u0 = ((t - t0) * 1.4 + p.f) % 1, u = dir > 0 ? u0 : 1 - u0;
    const mx = (a.x + b.x) / 2 + p.cur, my = Math.min(a.y, b.y) - 160;
    const x = (1 - u) * (1 - u) * a.x + 2 * u * (1 - u) * mx + u * u * b.x, y = (1 - u) * (1 - u) * a.y + 2 * u * (1 - u) * my + u * u * b.y;
    k.brillo(g, x, y, 60, "90,220,255", al * Math.min(1, u0 * 6) * Math.min(1, (1 - u0) * 6));
  }
  g.restore();
}

const luzLienzo = k.lienzo(1080, 1920);
const HAZ = [[T7 + 0.1, [180, 1500]], [T7 + 0.8, [880, 760]], [T7 + 1.5, [260, 980]], [Tese - 0.05, [560, 1200]], [T8, [560, 1200]]];
const hx = k.claves(HAZ.map(([a, p]) => [a, p[0]])), hy = k.claves(HAZ.map(([a, p]) => [a, p[1]]));

function escena(g, t) {
  const cam = camara(t);
  const encendida = 1 - su(tr(t, Tapaga, Tapaga + 0.12)) * (1 - su(tr(t, Tenciende, Tenciende + 0.2)));
  const canal = 1 + su(tr(t, Tcanal, Tcanal + 0.45)) + su(tr(t, Tcanal2, Tcanal2 + 0.45));
  const volAl = su(tr(t, Tsub - 0.15, Tsub + 0.1)) * (1 - su(tr(t, Tcam - 0.1, Tcam + 0.2)));
  salon(g, cam, t, { encendida, flash: t - Tenciende, canal, volumen: mez(0.3, 0.85, su(tr(t, Tsub + 0.1, Tsub + 0.7))), volAl });
  // el router y su wifi
  const rAl = entra(tr(t, Tcon - 0.1, Tcon + 0.3));
  const r = router(g, cam, t, rAl);
  if (r) ondasWifi(g, r.x, r.y - 30 * r.s, t, su(tr(t, Twifi - 0.15, Twifi + 0.2)) * (1 - 0.6 * su(tr(t, T6, T6 + 0.5))), 1100 * r.s);
  const tv = pr(cam, TV.X + TV.W / 2 - 50, TV.Y - TV.H / 2 + 45, TV.Z);
  iconoWifi(g, tv.x, tv.y + 20 * tv.s, 40 * tv.s, su(tr(t, Twifi, Twifi + 0.3)) * encendida);
  // el mando de siempre: vuelve, habla con luz y se va; al final se cae por detrás del mueble
  const vuelve = entra(tr(t, T3 - 0.1, Tman3 + 0.3)), seVa = sale(tr(t, T4, T4 + 0.6));
  if (vuelve > 0 && seVa < 1) {
    const M = mandoEn(1 - vuelve, { ...MANDO, Y: MANDO.Y + 900 * seVa });
    mando(g, cam, t, { led: LUZ.reduce((m, te) => Math.max(m, k.pulso(t, te, 0.03)), 0) * (1 - su(tr(t, Tno, Tver))) }, M);
    const a = punta(cam, M), b = ojito(cam);
    const fan = su(tr(t, Tno - 0.1, Tver));
    if (a && b) for (const te of LUZ) destello(g, a, b, (t - te) / 0.5, 110, fan);
  }
  const cae = tr(t, Tpie - 0.1, Tpie + 0.5);
  if (t > T9) {
    // el mando de siempre resbala por el borde de arriba y cae, girando, fuera de la imagen
    const M = { X: -260 + 80 * cae, Y: mez(-700, 1600, cae * cae), Z: 5.5, ang: 0.6 + 4 * cae };
    mando(g, cam, t, { al: Math.min(1, cae * 8) }, M);
  }
  // el móvil: baja, vuelve con su wifi
  const baja = sale(tr(t, T3, T3 + 0.5)), sube = entra(tr(t, T5 - 0.1, Ttam + 0.1));
  const my = MOVIL.y + 1300 * baja * (1 - sube);
  const toque = TOQUES.reduce((m, te) => Math.max(m, k.pulso(t, te + 0.05, 0.12)), 0);
  const tienda = su(tr(t, Tdes - 0.1, Tdes + 0.25)) * (1 - su(tr(t, Tpru - 0.2, Tpru + 0.1)));
  const salta = Math.max(0, Math.sin(Math.PI * tr(t, Tapp - 0.05, Tapp + 0.35))) * 0.18;
  if (my < 2300) {
    movil(g, MOVIL.x, my, MOVIL.w, MOVIL.ang, (c, W, H) => {
      appMando(0.7 * toque)(c, W, H);
      iconoWifi(c, W - 120, 110, 50, su(tr(t, Ttam - 0.1, Ttam + 0.2)));
      if (tienda > 0) {
        c.save(); c.globalAlpha = tienda;
        c.fillStyle = "#120d2a"; c.fillRect(0, 0, W, H);
        c.textAlign = "center"; c.textBaseline = "middle";
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
  }
  // los puntos azules: la charla, y un chorro en cada orden
  const pm = { x: MOVIL.x - 30, y: my - 470 }, b = ojito(cam);
  charla(g, pm, b, t, Thab - 0.15, Tsin + 0.6);
  for (const te of TOQUES.slice(1)) charla(g, pm, b, t, te, te + 0.55, 1);
  // «Link en la bio»
  const bio = entra(tr(t, Tbio - 0.1, Tbio + 0.2));
  if (bio > 0) { g.font = "800 58px Figtree"; const w = g.measureText("Link en la bio").width + 52; k.etiqueta(g, 540 - w / 2, 520 - 30 * (1 - bio), "Link en la bio", "255,140,220", bio, 58); }
  return my;
}

export function dibuja(g, t) {
  const osc = su(tr(t, T7, T7 + 0.25)) * (1 - su(tr(t, Tpie7 + 0.2, T8 + 0.1)));
  if (osc <= 0) { escena(g, t); velo(g, 0.45); return; }
  const c = luzLienzo.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  const my = escena(c, t);
  g.drawImage(luzLienzo, 0, 0);
  const x = hx(t), y = hy(t), R = 320, al = 0.92 * osc;
  g.save();
  g.beginPath(); g.rect(0, 0, 1080, 1920); g.arc(x, y, R * 1.6, 0, 6.2832, true); g.fillStyle = `rgba(4,3,10,${al})`; g.fill();
  const rg = g.createRadialGradient(x, y, R * 0.7, x, y, R * 1.6); rg.addColorStop(0, "rgba(4,3,10,0)"); rg.addColorStop(1, `rgba(4,3,10,${al})`);
  g.fillStyle = rg; g.beginPath(); g.arc(x, y, R * 1.6, 0, 6.2832); g.fill();
  g.restore();
  k.brillo(g, x, y, R * 2.4, "255,235,190", 0.35 * osc);
  k.brillo(g, MOVIL.x, my - 200, 900, "200,110,255", 0.6 * k.pulso(t, Tese + 0.05, 0.3));
  velo(g, 0.45);
}

export const momentos = { toques: TOQUES, wifi: Twifi, enciende: Tenciende, cae: Tpie };
