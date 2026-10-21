// «Pero no es solo la tele: el microondas, el router, los cargadores, todos esperando con su lucecita. Entre todos, es
// como tener una bombilla de sesenta vatios encendida día y noche en cada casa.»
// Otro sitio: una casa abierta por la mitad, de neón, de noche. Una cámara que viaja.
// - «la tele… el microondas… el router… los cargadores»: la cámara va de aparato en aparato; cada uno tiene su luz roja.
// - «todos esperando con su lucecita»: la cámara se abre a la casa entera y todas las lucecitas parpadean a la vez.
// - «una bombilla de sesenta vatios»: las lucecitas vuelan al centro y se juntan en una bombilla enorme con «60 W».
// - «encendida día y noche»: un sol y una luna giran a su alrededor.
// - «en cada casa»: la cámara se aleja y aparece una calle entera, cada casa con su bombilla encendida.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { IR } from "../objetosHoy.js";
import { tubo, rect, circulo, linea, CIAN, ROSA, AMARILLO, VERDE } from "../neon.js";

export const desde = (vz) => vz.frase(8).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f8 = v.frase(8), f9 = v.frase(9);
const T0 = f8.inicio, Ttel = f8.t("tele"), Tmic = f8.t("microondas"), Trou = f8.t("router"), Tcar = f8.t("cargadores"), Tluc = f8.t("lucecita");
const Tent = f9.t("entre"), Tbom = f9.t("bombilla"), Tses = f9.t("sesenta"), Tenc = f9.t("encendida"), Tdia = f9.t("dia"), Tnoc = f9.t("noche"), Tcas = f9.t("casa");
const FIN = v.frase(10).inicio;
const VIOLETA = "170,110,255";

const LEDS = [[-250, 192], [312, 205], [300, -104], [-138, -75]];   // tele, microondas, router, cargador
const cam = camino2D([
  [T0, [1.9, -250, 130]], [Tmic - 0.45, [1.9, -250, 130]], [Tmic + 0.25, [1.9, 250, 165]],
  [Trou - 0.45, [1.9, 250, 165]], [Trou + 0.25, [1.9, 250, -110]],
  [Tcar - 0.45, [1.9, 250, -110]], [Tcar + 0.25, [1.9, -140, -90]],
  [Tcar + 1.0, [1.9, -140, -90]], [Tluc - 0.5, [0.85, 0, -20]], [Tbom - 0.9, [0.85, 0, -20]], [Tbom + 0.3, [1.0, 0, -20]],
  [Tnoc + 0.1, [1.0, 0, -20]], [FIN - 0.15, [0.34, 0, 0]], [FIN, [0.34, 0, 0]],
]);

function texto(g, s, x, y, tam, col, al = 1) {
  g.save(); g.font = `800 ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = `rgba(${col},${0.9 * al})`; g.shadowBlur = tam * 0.35; g.fillStyle = `rgba(${col},${al})`; g.fillText(s, x, y);
  g.shadowBlur = 0; g.fillStyle = `rgba(255,255,255,${0.7 * al})`; g.fillText(s, x, y); g.restore();
}
function led(g, t, x, y, sem, tam = 1) {
  const b = 0.55 + 0.45 * Math.sin(t * 4 + sem * 1.7), r = k.pulso(t, Tluc + 0.05, 0.5);
  k.brillo(g, x, y, 70 * tam * (1 + 0.8 * r), IR, 0.7 * b + 0.3 * r);
  g.fillStyle = `rgba(${IR},1)`; g.beginPath(); g.arc(x, y, 9 * tam, 0, 6.2832); g.fill(); g.fillStyle = "rgba(255,230,236,0.9)"; g.beginPath(); g.arc(x - 2, y - 2, 3.5 * tam, 0, 6.2832); g.fill();
  if (r > 0.01) { g.save(); g.strokeStyle = `rgba(${IR},${0.8 * r})`; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 20 + 110 * (1 - r), 0, 6.2832); g.stroke(); g.restore(); }
}
function cuarto(g, x, y, w, h, col, nombre) {
  redondo(g, x, y, w, h, 10); const cg = g.createLinearGradient(x, y, x, y + h); cg.addColorStop(0, `rgba(${col},0.10)`); cg.addColorStop(1, "rgba(6,2,20,0.92)"); g.fillStyle = cg; g.fill();
  tubo(g, rect(x, y, w, h, 10), col, 6, 0.9);
}
function bombilla(g, x, y, R, al, fil) {
  k.brillo(g, x, y, R * 3.4, "255,226,90", 0.8 * al * fil);
  g.save(); g.globalAlpha = al; const bg = g.createRadialGradient(x - R * 0.25, y - R * 0.3, R * 0.1, x, y, R); bg.addColorStop(0, `rgba(255,250,200,${0.35 + 0.6 * fil})`); bg.addColorStop(1, `rgba(255,226,90,${0.1 + 0.3 * fil})`);
  g.beginPath(); g.moveTo(x - R * 0.42, y + R * 0.95); g.bezierCurveTo(x - R * 0.42, y + R * 0.55, x - R, y + R * 0.35, x - R, y - R * 0.1); g.bezierCurveTo(x - R, y - R * 1.15, x + R, y - R * 1.15, x + R, y - R * 0.1); g.bezierCurveTo(x + R, y + R * 0.35, x + R * 0.42, y + R * 0.55, x + R * 0.42, y + R * 0.95); g.closePath(); g.fillStyle = bg; g.fill();
  const tr1 = (gg) => { gg.beginPath(); gg.moveTo(x - R * 0.42, y + R * 0.95); gg.bezierCurveTo(x - R * 0.42, y + R * 0.55, x - R, y + R * 0.35, x - R, y - R * 0.1); gg.bezierCurveTo(x - R, y - R * 1.15, x + R, y - R * 1.15, x + R, y - R * 0.1); gg.bezierCurveTo(x + R, y + R * 0.35, x + R * 0.42, y + R * 0.55, x + R * 0.42, y + R * 0.95); gg.closePath(); };
  tubo(g, tr1, AMARILLO, Math.max(3, R * 0.07), al);
  tubo(g, linea([x - R * 0.3, y + R * 0.95], [x - R * 0.3, y + R * 0.78], [x - R * 0.12, y + R * 0.62], [x - R * 0.12, y + R * 0.05], [x, y - R * 0.18], [x + R * 0.12, y + R * 0.05], [x + R * 0.12, y + R * 0.62], [x + R * 0.3, y + R * 0.78], [x + R * 0.3, y + R * 0.95]), "255,200,60", Math.max(2.5, R * 0.05), al * (0.4 + 0.6 * fil));
  for (let i = 0; i < 3; i++) tubo(g, linea([x - R * 0.44, y + R * (1.02 + i * 0.16)], [x + R * 0.44, y + R * (1.02 + i * 0.16)]), AMARILLO, Math.max(3, R * 0.07), al * 0.9);
  g.restore();
}
function casaCompleta(g, t, al) {
  g.save(); g.globalAlpha = al;
  // tejado
  tubo(g, linea([-520, -400], [0, -560], [520, -400]), ROSA, 9, 1);
  // los cuatro cuartos
  cuarto(g, -480, -400, 480, 400, ROSA, "dormitorio"); cuarto(g, 0, -400, 480, 400, CIAN, "estudio"); cuarto(g, -480, 0, 480, 400, VIOLETA, "salón"); cuarto(g, 0, 0, 480, 400, VERDE, "cocina");
  // dormitorio: cama y mesilla
  tubo(g, rect(-460, -70, 230, 64, 10), ROSA, 4, 0.55); tubo(g, rect(-460, -118, 70, 50, 14), ROSA, 4, 0.55); tubo(g, linea([-460, -6], [-460, 0]), ROSA, 4, 0.5);
  tubo(g, rect(-190, -40, 110, 40, 6), ROSA, 4, 0.55);
  // el cargador: enchufe en la pared, cargador y su cable colgando
  tubo(g, rect(-160, -92, 56, 74, 8), ROSA, 6, 1); tubo(g, linea([-132, -18], [-132, 10], [-190, 18], [-200, -2]), ROSA, 4, 0.8); g.save(); g.fillStyle = "rgba(0,0,0,0)"; g.restore();
  // estudio: estantería y router
  tubo(g, linea([140, -86], [360, -86]), CIAN, 5, 0.8); tubo(g, rect(160, -124, 180, 38, 8), CIAN, 6, 1);
  for (const [ax, ay] of [[180, -190], [250, -204], [320, -190]]) tubo(g, linea([ax, -124], [ax * 0.96 + 10, ay]), CIAN, 5, 0.9);
  tubo(g, rect(100, -300, 70, 50, 6), CIAN, 4, 0.4); tubo(g, linea([400, -300], [400, -250]), CIAN, 4, 0.4);
  // salón: la tele sobre su mueble
  tubo(g, rect(-400, 232, 300, 96, 10), VIOLETA, 5, 0.7);
  redondo(g, -350, 60, 200, 118, 10); g.fillStyle = "#04020c"; g.fill(); tubo(g, rect(-350, 60, 200, 118, 10), VIOLETA, 6, 1);
  tubo(g, linea([-290, 178], [-290, 232]), VIOLETA, 5, 0.7); tubo(g, linea([-210, 178], [-210, 232]), VIOLETA, 5, 0.7);
  // cocina: encimera y microondas
  tubo(g, rect(110, 232, 330, 96, 8), VERDE, 5, 0.7);
  redondo(g, 150, 105, 200, 124, 10); g.fillStyle = "#04020c"; g.fill(); tubo(g, rect(150, 105, 200, 124, 10), VERDE, 6, 1);
  tubo(g, rect(162, 117, 112, 100, 8), VERDE, 4, 0.8); tubo(g, linea([282, 117], [282, 217]), VERDE, 3, 0.6);
  texto(g, "0:00", 312, 134, 20, "90,255,150", 0.9); for (let i = 0; i < 3; i++) { tubo(g, circulo(300 + (i % 2) * 24, 160 + Math.floor(i / 2) * 24, 6), VERDE, 3, 0.7); }
  g.restore();
}
// una casita lejana, con su bombilla
function casita(g, t, x, col, sem, al) {
  g.save(); g.translate(x, 0); g.globalAlpha = al;
  tubo(g, linea([-520, -400], [0, -560], [520, -400]), col, 12, 1); tubo(g, rect(-480, -400, 960, 800, 14), col, 12, 1);
  const f = 0.88 + 0.12 * Math.sin(t * 3 + sem);
  bombilla(g, 0, -30, 170, 1, f); g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  // la noche, con estrellas
  const bg = g.createLinearGradient(0, -1600, 0, 900); bg.addColorStop(0, "#07021a"); bg.addColorStop(1, "#1a0a40");
  g.fillStyle = bg; g.fillRect(-4000, -2200, 8000, 3600);
  g.fillStyle = "rgba(255,255,255,0.7)"; for (let i = 0; i < 90; i++) { const sx = ((i * 977) % 6000) - 3000, sy = -2000 + ((i * 631) % 1500); g.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + i)); g.beginPath(); g.arc(sx, sy, 5 + (i % 3) * 2, 0, 6.2832); g.fill(); } g.globalAlpha = 1;
  // la calle de casas: aparece al final
  const calle = su(tr(t, Tnoc + 0.3, Tcas + 0.3));
  if (calle > 0.01) {
    tubo(g, linea([-4000, 400], [4000, 400]), ROSA, 8, calle);
    [[-2200, VERDE, 2], [-1100, CIAN, 1], [1100, VIOLETA, 3], [2200, ROSA, 4]].forEach(([x, c, s]) => casita(g, t, x, c, s, calle));
  }
  // la casa de verdad: se apaga un poco cuando llega la bombilla
  const lleva = su(tr(t, Tbom - 0.5, Tbom + 0.3)), fuera = su(tr(t, Tcas, Tcas + 0.5));
  casaCompleta(g, t, 1 - 0.0 * lleva);
  g.fillStyle = `rgba(7,2,22,${0.62 * lleva})`; g.fillRect(-540, -600, 1080, 1040);
  // las luces rojas
  const sale = 1 - su(tr(t, Tbom - 0.35, Tbom + 0.15));
  if (sale > 0.01) LEDS.forEach(([x, y], i) => led(g, t, x, y, i, 1));
  // al decir «bombilla», las lucecitas vuelan al centro y se juntan
  const vuelo = tr(t, Tbom - 0.6, Tbom + 0.1);
  if (vuelo > 0 && vuelo < 1) {
    g.save(); g.globalCompositeOperation = "lighter";
    LEDS.forEach(([x, y]) => {
      const u = su(vuelo), px = mez(x, 0, u), py = mez(y, -30, u) - 110 * Math.sin(u * 3.1416);
      for (let j = 0; j < 6; j++) { const uu = Math.max(0, u - j * 0.05), qx = mez(x, 0, uu), qy = mez(y, -30, uu) - 110 * Math.sin(uu * 3.1416); k.brillo(g, qx, qy, 40 - j * 5, IR, 0.5 - j * 0.07); }
      k.brillo(g, px, py, 60, IR, 0.9); g.fillStyle = "#fff"; g.beginPath(); g.arc(px, py, 7, 0, 6.2832); g.fill();
    });
    g.restore();
  }
  // la bombilla grande y su «60 W»; en cada casa pasa a ser una más
  const b = su(tr(t, Tbom + 0.05, Tbom + 0.45)), bz = 1 + 0.07 * Math.sin(tr(t, Tbom + 0.05, Tbom + 0.7) * 9) * (1 - tr(t, Tbom + 0.05, Tbom + 0.7)), fil = su(tr(t, Tenc - 0.1, Tenc + 0.3)) * 0.45 + 0.55;
  if (b > 0.01) {
    const aa = b;
    g.save(); g.translate(0, -30); g.scale(bz * (0.5 + 0.5 * b), bz * (0.5 + 0.5 * b)); g.translate(0, 30);
    bombilla(g, 0, -30, 190, aa, fil); g.restore();
    texto(g, "60 W", 0, 238, 120, "255,226,90", su(tr(t, Tses - 0.05, Tses + 0.3)) * aa * (1 - fuera));
    // el sol y la luna dan vueltas: «día y noche»
    const o = su(tr(t, Tdia - 0.1, Tdia + 0.3)) * (1 - su(tr(t, Tcas, Tcas + 0.4)));
    if (o > 0.01) {
      const ang = (t - Tdia) * 3 + 3.1416, RX = 420, RY = 300;
      g.save(); g.globalAlpha = o; g.strokeStyle = "rgba(200,190,255,0.25)"; g.lineWidth = 5; g.setLineDash([12, 20]); g.beginPath(); g.ellipse(0, -30, RX, RY, 0, 0, 6.2832); g.stroke(); g.setLineDash([]);
      for (const [off, sol] of [[0, true], [Math.PI, false]]) {
        const px = Math.cos(ang + off) * RX, py = -30 + Math.sin(ang + off) * RY;
        if (sol) { k.brillo(g, px, py, 170, "255,220,90", 0.9); g.fillStyle = "#fff0a0"; g.beginPath(); g.arc(px, py, 46, 0, 6.2832); g.fill(); }
        else { g.fillStyle = "#dcd6ff"; g.beginPath(); g.arc(px, py, 44, 0, 6.2832); g.fill(); g.fillStyle = "#0c0624"; g.beginPath(); g.arc(px + 19, py - 11, 38, 0, 6.2832); g.fill(); k.brillo(g, px, py, 120, "190,180,255", 0.5); }
      }
      g.restore();
    }
  }
  sinVista(g);
  velo(g, 0.5);
  vineta(g, 0.4);
}

export const momentos = { tele: Ttel, microondas: Tmic, router: Trou, cargadores: Tcar, lucecita: Tluc, bombilla: Tbom, noche: Tnoc, casa: Tcas };
