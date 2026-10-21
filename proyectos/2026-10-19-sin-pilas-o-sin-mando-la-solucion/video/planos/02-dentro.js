// «Al pulsar un botón, la goma baja y toca dos caminos de cobre: se cierra el circuito.»
// «Un chip convierte ese botón en un número, distinto para cada botón.»
// «Y la lucecita de la punta lo manda parpadeando, en un morse de luz que tus ojos no ven.»
// Dentro del mando, con una sola cámara que viaja por la placa. Se entra con un corte en «Al».
// - «Al pulsar»: la tecla del + y, debajo, su goma transparente con la pastilla negra, sobre la placa verde.
//   «baja»: la goma se aplasta; «toca»: la pastilla toca los dos peines de cobre; «cobre»: brillan; «circuito»: la
//   corriente dorada sale corriendo por las pistas.
// - La cámara sigue la corriente hasta el chip, que se enciende en «chip»; en «número» suben de él ocho cifras;
//   «distinto»: las filas de otros dos botones, distintas, aparecen y se apartan.
// - «Y la lucecita»: las cifras bajan a la pista y corren hasta la lucecita de la punta, y la cámara con ellas;
//   «parpadeando»: late y escupe ondas por la ventana del mando; «tus ojos no ven»: las ondas se vuelven
//   transparentes. Todo se calma antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { CODIGO, ROJO, cifras } from "../mundo.js";

const { suave: su, tramo: tr, mez, azar, entra } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
export const desde = (vz) => vz.frase(3).inicio;
const Tbaj = f3.t("baja"), Ttoc = f3.t("toca"), Tcob = f3.t("cobre"), Tcie = f3.t("cierra");
const Tnot = f4.t("chip") + 0.25, Tnum = f4.t("numero"), Tnin = f4.t("distinto");
const Tluc = f5.t("lucecita"), Tman = f5.t("manda"), Tpar = f5.t("parpadeando"), Tojo = f5.t("ojos"), Fin = f6.inicio;

// ---------------------------------------------------------------- dónde está cada cosa (en el mundo, en px)
const BX = 540, PCB_LEJOS = 1120, PCB_CERCA = 1460, PY = 1300;      // la tecla, la placa (su cara de arriba, en perspectiva)
const CHIP = 1500, LED = 2470, VENT = 2720;
const pulsa = (t) => su(tr(t, Tbaj - 0.05, Ttoc + 0.05)) * (1 - su(tr(t, Tnum, Tnum + 0.6)));

// la cámara
function camara(t) {
  let x = BX, y = 985, z = 1.2;
  z = mez(1.2, 1.32, su(tr(t, f3.inicio, Ttoc + 0.2)));
  const a = su(tr(t, Tcie + 0.35, Tnot - 0.05));
  x = mez(x, CHIP, a); y = mez(y, 990, a); z = mez(z, 1.2, a);
  const b = su(tr(t, Tluc - 0.1, Tman + 0.15));
  x = mez(x, LED + 60, b); z = mez(z, 1.3, b); y = mez(y, 1000, b);
  return { x, y, z };
}
const S = (c, X, Y) => [(X - c.x) * c.z + 540, (Y - c.y) * c.z + 960];

// ---------------------------------------------------------------- lo que se pinta una vez
const az = azar(303);
const PIEZAS = Array.from({ length: 34 }, () => ({ x: -500 + az() * 3600, y: mez(PCB_LEJOS + 30, PCB_CERCA - 30, az()), w: 30 + az() * 40, c: az() }));
const BOKEH = Array.from({ length: 22 }, () => ({ x: -800 + az() * 4200, y: 200 + az() * 700, r: 50 + az() * 120, c: ["120,90,255", "255,80,200", "80,200,255"][Math.floor(az() * 3)] }));
const OTROS = [[0, 1, 0, 0, 1, 1, 0, 1], [1, 1, 0, 0, 0, 0, 1, 0]];

// la pista que va del peine del + al chip y del chip a la lucecita
const PISTA = [[BX + 150, PY + 10], [BX + 260, PY + 110], [CHIP - 260, PY + 110], [CHIP - 170, PY + 20], [CHIP + 170, PY + 20], [CHIP + 260, PY + 110], [LED - 120, PY + 110], [LED - 40, PY - 40]];
const largos = [0]; for (let i = 1; i < PISTA.length; i++) largos.push(largos[i - 1] + Math.hypot(PISTA[i][0] - PISTA[i - 1][0], PISTA[i][1] - PISTA[i - 1][1]));
const enPista = (d) => {
  d = Math.max(0, Math.min(largos.at(-1), d));
  let i = 1; while (i < largos.length - 1 && largos[i] < d) i++;
  const u = (d - largos[i - 1]) / (largos[i] - largos[i - 1]);
  return [mez(PISTA[i - 1][0], PISTA[i][0], u), mez(PISTA[i - 1][1], PISTA[i][1], u)];
};
const dChip = largos[3], dLed = largos.at(-1);

// ---------------------------------------------------------------- las piezas
function fondo(g, c, t) {
  const fg = g.createLinearGradient(0, 0, 0, 1920);
  fg.addColorStop(0, "#0c0a1c"); fg.addColorStop(0.5, "#191233"); fg.addColorStop(1, "#0a0814");
  g.fillStyle = fg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) {
    const [x, y] = S(c, b.x * 0.7 + c.x * 0.3, b.y); const r = b.r * c.z;
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${b.c},0.12)`); gr.addColorStop(1, `rgba(${b.c},0)`);
    g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  }
  g.restore();
}

function placa(g, c, t, brilloCobre, corriente) {
  const [xa, ya] = S(c, -900, PCB_LEJOS), [xb, yb] = S(c, 3400, PCB_CERCA), [, yc] = S(c, 0, PCB_CERCA + 70);
  // la cara de arriba
  const pg = g.createLinearGradient(0, ya, 0, yb);
  pg.addColorStop(0, "#0d4a2c"); pg.addColorStop(0.6, "#147a45"); pg.addColorStop(1, "#1a9354");
  g.fillStyle = pg; g.fillRect(xa, ya, xb - xa, yb - ya);
  g.save(); g.beginPath(); g.rect(xa, ya, xb - xa, yb - ya); g.clip();
  g.globalAlpha = 0.35; g.globalCompositeOperation = "multiply";
  for (let x = xa; x < xb; x += 700 * c.z) g.drawImage(k.red, x, ya, 700 * c.z, yb - ya);
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // la serigrafía blanca y las piezas pequeñas
  g.strokeStyle = "rgba(230,255,240,0.25)"; g.lineWidth = 3 * c.z;
  for (const p of PIEZAS) {
    const [x, y] = S(c, p.x, p.y); const w = p.w * c.z, h = w * 0.45;
    if (x < -100 || x > 1180) continue;
    g.strokeRect(x - w * 0.7, y - h * 0.9, w * 1.4, h * 1.8);
    const cg = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    if (p.c < 0.5) { cg.addColorStop(0, "#d9b98a"); cg.addColorStop(1, "#6e5634"); } else { cg.addColorStop(0, "#3a3a44"); cg.addColorStop(1, "#111"); }
    g.fillStyle = cg; k.redondo(g, x - w / 2, y - h / 2, w, h, h * 0.3); g.fill();
    g.fillStyle = "#cfd3da"; g.fillRect(x - w / 2 - 6 * c.z, y - h * 0.3, 6 * c.z, h * 0.6); g.fillRect(x + w / 2, y - h * 0.3, 6 * c.z, h * 0.6);
  }
  g.restore();
  // el canto de la placa, hacia la cámara
  const cg = g.createLinearGradient(0, yb, 0, yc); cg.addColorStop(0, "#0b5a33"); cg.addColorStop(0.3, "#c9a24a"); cg.addColorStop(0.4, "#0a3a22"); cg.addColorStop(1, "#06200f");
  g.fillStyle = cg; g.fillRect(xa, yb, xb - xa, yc - yb);
  // debajo, la carcasa de abajo: plástico negro
  const bg = g.createLinearGradient(0, yc, 0, yc + 300 * c.z); bg.addColorStop(0, "#050508"); bg.addColorStop(0.15, "#1c1c24"); bg.addColorStop(0.6, "#2c2d36"); bg.addColorStop(1, "#14141a");
  g.fillStyle = bg; g.fillRect(0, yc, 1080, 1920 - yc);
  g.save(); g.globalAlpha = 0.3; g.globalCompositeOperation = "multiply"; g.drawImage(k.red, 0, yc, 1080, 1920 - yc); g.restore();
  g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(0, yc + 60 * c.z, 1080, 3);
  // las pistas de cobre
  cobre(g, c, brilloCobre);
  // los peines de las teclas
  for (const X of [-200, BX, 1020]) peine(g, c, X, X === BX ? brilloCobre : 0);
  // la corriente: puntos dorados que corren por la pista
  if (corriente.al > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 40; i++) {
      const d = corriente.frente - i * 34;
      if (d < 0) break;
      const [X, Y] = enPista(d); const [x, y] = S(c, X, Y);
      k.brillo(g, x, y, 90 * c.z, "255,200,80", corriente.al * (i === 0 ? 1 : 0.55));
    }
    g.restore();
  }
}
function cobre(g, c, br) {
  g.save(); g.lineJoin = "round"; g.lineCap = "round";
  const camino = (pts) => { g.beginPath(); pts.forEach(([X, Y], i) => { const [x, y] = S(c, X, Y); i ? g.lineTo(x, y) : g.moveTo(x, y); }); };
  for (const [pts, w] of [[PISTA, 22], [[[BX - 150, PY + 10], [BX - 260, PY + 110], [-900, PY + 110]], 22]]) {
    camino(pts); g.strokeStyle = "#5a2e10"; g.lineWidth = (w + 8) * c.z; g.stroke();
    camino(pts); g.strokeStyle = k.mezColor("#c86a2a", "#ffcf7a", br); g.lineWidth = w * c.z; g.stroke();
    camino(pts); g.strokeStyle = `rgba(255,230,180,${0.35 + 0.5 * br})`; g.lineWidth = 5 * c.z; g.stroke();
  }
  g.restore();
}
// los dos peines de cobre que se entrelazan debajo de la goma (en perspectiva: una elipse aplastada)
function peine(g, c, X, br) {
  const [x, y] = S(c, X, PY); const rx = 170 * c.z, ry = 55 * c.z;
  if (x < -300 || x > 1380) return;
  g.save();
  g.fillStyle = "rgba(0,30,15,0.5)"; g.beginPath(); g.ellipse(x, y, rx + 12 * c.z, ry + 6 * c.z, 0, 0, 6.2832); g.fill();
  const col = k.mezColor("#c86a2a", "#ffd890", br);
  g.strokeStyle = col; g.lineCap = "round";
  for (let i = -6; i <= 6; i++) {
    const xx = x + i * rx / 7, h = ry * Math.sqrt(Math.max(0, 1 - (i / 7) ** 2)) * 0.95;
    g.lineWidth = 9 * c.z;
    g.beginPath(); g.moveTo(xx, i % 2 ? y - h : y - h * 0.65); g.lineTo(xx, i % 2 ? y + h * 0.65 : y + h); g.stroke();
  }
  g.lineWidth = 10 * c.z;
  g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
  g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI * 0.05, Math.PI * 0.95); g.stroke();
  if (br > 0) k.brillo(g, x, y, 520 * c.z, "255,190,90", 0.6 * br);
  g.restore();
}

// la carcasa de arriba con su agujero, la tecla y la goma
function tecla(g, c, X, p, conTexto) {
  const [x] = S(c, X, 0), z = c.z;
  if (x < -400 || x > 1480) return;
  const Y = (y) => S(c, X, y)[1];
  const baja = 90 * p;
  // la goma: una campana transparente
  const base = Y(PY), cuello = Y(800 + baja * 0.9), techo = Y(712 + baja);
  const ancho = 200 * z, an2 = (68 + 40 * p) * z;
  g.save();
  g.beginPath();
  g.moveTo(x - ancho, base);
  g.bezierCurveTo(x - ancho, base - 80 * z, x - an2 - 50 * z * p, cuello + 60 * z, x - an2, cuello);
  g.lineTo(x - 64 * z, techo); g.lineTo(x + 64 * z, techo); g.lineTo(x + an2, cuello);
  g.bezierCurveTo(x + an2 + 50 * z * p, cuello + 60 * z, x + ancho, base - 80 * z, x + ancho, base);
  g.closePath();
  const gg = g.createLinearGradient(x - ancho, 0, x + ancho, 0);
  gg.addColorStop(0, "rgba(170,200,255,0.55)"); gg.addColorStop(0.25, "rgba(120,150,210,0.22)"); gg.addColorStop(0.7, "rgba(90,110,170,0.3)"); gg.addColorStop(1, "rgba(160,190,255,0.5)");
  g.fillStyle = gg; g.fill();
  g.strokeStyle = "rgba(220,235,255,0.55)"; g.lineWidth = 3 * z; g.stroke();
  // el émbolo y la pastilla negra
  const yp = Y(mez(1222, 1290, p));
  const eg = g.createLinearGradient(x - 50 * z, 0, x + 50 * z, 0); eg.addColorStop(0, "rgba(150,170,220,0.5)"); eg.addColorStop(1, "rgba(90,100,150,0.4)");
  g.fillStyle = eg; g.fillRect(x - 46 * z, techo, 92 * z, yp - techo);
  g.fillStyle = "#121216"; g.beginPath(); g.ellipse(x, yp, 70 * z, 22 * z, 0, 0, 6.2832); g.fill();
  g.fillStyle = "#26262e"; g.fillRect(x - 70 * z, yp - 18 * z, 140 * z, 18 * z);
  g.fillStyle = "#33333d"; g.beginPath(); g.ellipse(x, yp - 18 * z, 70 * z, 22 * z, 0, 0, 6.2832); g.fill();
  g.globalAlpha = 0.6; g.globalCompositeOperation = "multiply"; g.drawImage(k.manchas, x - 70 * z, yp - 40 * z, 140 * z, 50 * z);
  g.restore();
  // la tecla de arriba, que asoma por la carcasa
  const tt = Y(560 + baja);
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 20 * z;
  k.redondo(g, x - 110 * z, tt, 220 * z, 150 * z, 34 * z);
  const kg = g.createLinearGradient(0, tt, 0, tt + 150 * z); kg.addColorStop(0, "#6a6d78"); kg.addColorStop(0.3, "#3b3d46"); kg.addColorStop(1, "#1d1e24");
  g.fillStyle = kg; g.fill(); g.restore();
  if (conTexto) { g.fillStyle = "rgba(255,255,255,0.9)"; g.font = `800 ${Math.round(80 * z)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+", x, tt + 52 * z); }
}
function carcasa(g, c) {
  const [, y0] = S(c, 0, 650), [, y1] = S(c, 0, 712);
  const cg = g.createLinearGradient(0, y0, 0, y1); cg.addColorStop(0, "#4a4c56"); cg.addColorStop(0.2, "#25262d"); cg.addColorStop(1, "#111116");
  g.fillStyle = cg;
  // con un agujero en cada tecla
  g.beginPath(); g.rect(0, y0, 1080, y1 - y0);
  for (const X of [-200, BX, 1020]) { const [x] = S(c, X, 0); g.rect(x + 120 * c.z, y0, -240 * c.z, y1 - y0); }
  g.fill("evenodd");
  // la ventana de la punta: plástico rojo oscuro
  const [xv] = S(c, VENT, 0), [, yv1] = S(c, 0, PCB_CERCA + 70);
  if (xv < 1180) {
    // fuera del mando: el salón a oscuras
    const fg = g.createLinearGradient(xv, 0, 1080, 0); fg.addColorStop(0, "#0a0716"); fg.addColorStop(1, "#160f2a");
    g.fillStyle = fg; g.fillRect(xv + 60 * c.z, 0, 1080, 1920);
    const vg = g.createLinearGradient(xv, 0, xv + 70 * c.z, 0); vg.addColorStop(0, "rgba(120,20,60,0.85)"); vg.addColorStop(1, "rgba(50,8,25,0.95)");
    g.fillStyle = vg; g.fillRect(xv, y0, 70 * c.z, yv1 - y0);
    g.fillStyle = "rgba(255,180,220,0.25)"; g.fillRect(xv + 8 * c.z, y0 + 20, 5 * c.z, yv1 - y0 - 40);
  }
}

function chip(g, c, t, luz) {
  const [x, y] = S(c, CHIP, PY - 10); const z = c.z, w = 340 * z, d = 120 * z, h = 46 * z;
  if (x < -400 || x > 1480) return;
  // las patas
  g.fillStyle = "#c9ced6";
  for (let i = 0; i < 8; i++) { const px = x - w / 2 + 30 * z + i * (w - 60 * z) / 7; g.fillRect(px - 7 * z, y + d / 2 - 4 * z, 14 * z, 26 * z); g.fillRect(px - 6 * z, y - d / 2 - 14 * z, 12 * z, 14 * z); }
  // la cara de delante y la de arriba
  g.fillStyle = "#0b0b0e"; g.fillRect(x - w / 2, y + d / 2 - h, w, h);
  const tg = g.createLinearGradient(0, y - d / 2 - h, 0, y + d / 2 - h); tg.addColorStop(0, "#2a2b33"); tg.addColorStop(1, "#141418");
  g.fillStyle = tg; g.fillRect(x - w / 2, y - d / 2 - h, w, d);
  g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(x - w / 2, y - d / 2 - h, w, 4 * z);
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(x - w / 2 + 26 * z, y - h, 9 * z, 5 * z, 0, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(220,220,230,0.45)"; g.font = `700 ${Math.round(30 * z)}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("IR-38K", x, y - h);
  if (luz > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    g.strokeStyle = `rgba(255,210,90,${0.9 * luz})`; g.lineWidth = 4 * z; g.strokeRect(x - w / 2, y - d / 2 - h, w, d);
    g.restore();
    k.brillo(g, x, y - h, 700 * z, "255,190,80", 0.7 * luz);
  }
}

function lucecita(g, c, t, luz) {
  const [x, y] = S(c, LED, 1110); const z = c.z;
  if (x < -500 || x > 1580) return;
  // las patas, dobladas hacia la placa
  g.strokeStyle = "#c9ced6"; g.lineWidth = 8 * z; g.lineCap = "round";
  for (const dy of [-18, 18]) { g.beginPath(); g.moveTo(x - 60 * z, y + dy * z); g.lineTo(x - 120 * z, y + dy * z); g.lineTo(x - 120 * z + dy * 0.6 * z, S(c, 0, PY - 40)[1]); g.stroke(); }
  // el cuerpo: resina transparente, con su punta redonda hacia la ventana
  g.save();
  g.beginPath(); g.moveTo(x - 70 * z, y - 60 * z); g.lineTo(x + 60 * z, y - 60 * z); g.arc(x + 60 * z, y, 60 * z, -Math.PI / 2, Math.PI / 2); g.lineTo(x - 70 * z, y + 60 * z); g.closePath();
  const lg = g.createLinearGradient(0, y - 60 * z, 0, y + 60 * z); lg.addColorStop(0, "rgba(200,190,255,0.75)"); lg.addColorStop(0.4, "rgba(110,100,190,0.45)"); lg.addColorStop(1, "rgba(60,50,120,0.7)");
  g.fillStyle = lg; g.fill(); g.strokeStyle = "rgba(230,225,255,0.7)"; g.lineWidth = 3 * z; g.stroke();
  g.restore();
  g.fillStyle = "rgba(210,215,225,0.85)"; g.fillRect(x - 90 * z, y - 66 * z, 22 * z, 132 * z);
  g.fillStyle = "#aab"; g.fillRect(x - 10 * z, y - 12 * z, 30 * z, 24 * z);
  k.reflejo(g, x - 40 * z, y - 48 * z, 90 * z, 10 * z, 0.5);
  if (luz > 0) { k.brillo(g, x + 20 * z, y, 600 * z, ROJO, luz); k.brillo(g, x + 20 * z, y, 200 * z, "255,240,255", luz); }
}

// las ondas que salen por la ventana
const ONDAS = []; for (let te = Tpar - 0.02; te < Fin - 0.55; te += 0.09) ONDAS.push(te);
function ondas(g, c, t) {
  const [x, y] = S(c, LED + 60, 1110);
  g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
  for (const te of ONDAS) {
    const u = (t - te) / 0.55; if (u < 0 || u > 1) continue;
    const r = mez(70, 900, u) * c.z, al = Math.min(1, u * 6) * (1 - u) * (1 - 0.8 * su(tr(t, Tojo - 0.1, Tojo + 0.4)));
    g.strokeStyle = `rgba(${ROJO},${0.45 * al})`; g.lineWidth = 34 * c.z; g.beginPath(); g.arc(x, y, r, -0.55, 0.55); g.stroke();
    g.strokeStyle = `rgba(255,235,250,${0.9 * al})`; g.lineWidth = 8 * c.z; g.beginPath(); g.arc(x, y, r, -0.55, 0.55); g.stroke();
  }
  g.restore();
}
const latido = (t) => {
  if (t < Tpar - 0.05 || t > Fin - 0.35) return 0;
  let m = 0; for (const te of ONDAS) m = Math.max(m, k.pulso(t, te, 0.025));
  return m * (1 - su(tr(t, Fin - 0.7, Fin - 0.4)));
};

export function dibuja(g, t) {
  const c = camara(t);
  fondo(g, c, t);
  const toca = su(tr(t, Ttoc - 0.05, Ttoc + 0.1));
  const brCobre = Math.max(su(tr(t, Tcob - 0.1, Tcob + 0.3)) * (1 - 0.6 * su(tr(t, Tcie + 1.2, Tcie + 2))), 0.5 * toca * (1 - su(tr(t, Tcob, Tcob + 0.2))));
  const frente = mez(0, dChip, su(tr(t, Tcie - 0.05, Tnot - 0.05))) + mez(0, dLed - dChip, su(tr(t, Tluc, Tpar - 0.1)));
  const corrAl = su(tr(t, Tcie - 0.1, Tcie + 0.1)) * (1 - su(tr(t, Fin - 0.9, Fin - 0.5)));
  placa(g, c, t, brCobre, { frente, al: corrAl });
  chip(g, c, t, su(tr(t, Tnot - 0.1, Tnot + 0.2)) * (1 - 0.5 * su(tr(t, Tluc, Tpar))));
  lucecita(g, c, t, latido(t) * 0.9 + 0.12 * su(tr(t, Tpar - 0.2, Tpar)) * (1 - su(tr(t, Fin - 0.7, Fin - 0.4))));
  tecla(g, c, -200, 0, false);
  tecla(g, c, 1020, 0, false);
  tecla(g, c, BX, pulsa(t), true);
  carcasa(g, c);
  ondas(g, c, t);
  // el número: sube del chip y se queda; otras dos filas, distintas, aparecen y se apartan
  const [xc, yc] = S(c, CHIP, 0);
  const nsale = mez(0, 8, tr(t, Tnum - 0.1, Tnum + 0.45));
  const viaja = su(tr(t, Tluc - 0.05, Tman + 0.1));
  if (viaja < 1) {
    const [xl] = S(c, LED, 0);
    cifras(g, mez(xc, xl - 300, viaja), mez(880, 980, viaja), CODIGO, nsale, mez(100, 60, viaja), 1 - su(tr(t, Tman - 0.1, Tman + 0.15)));
    const otros = su(tr(t, Tnin - 0.15, Tnin + 0.25)), aparta = su(tr(t, Tnin + 0.5, f4.fin + 0.2));
    OTROS.forEach((bits, i) => cifras(g, xc, 870 + (i ? 1 : -1) * mez(140, 300, aparta), bits, 8, 70, 0.55 * otros * (1 - aparta), "190,200,230"));
  }
}

export const momentos = { toca: Ttoc, cierra: Tcie, nota: Tnot, numero: Tnum, parpadea: Tpar };
