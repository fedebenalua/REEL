// «...romanos.» → hasta el final. La rueda del año romano: un disco de mármol con aro de bronce, en un muro al sol,
// con doce casillas (los diez meses tallados en latín y dos en bruto: el invierno). La flecha de bronce marca dónde
// empieza el año. Una sola cámara que se acerca y se aleja; la rueda gira una vez (cuando el año pasa a enero).
// - F4 «marzo»: MARTIVS, bajo la flecha, se enciende con su 1; «primavera»: pétalos.
// - F5 «cuenta siete desde marzo»: la luz corre casilla a casilla (1...7) y para en SEPTEMBER.
// - F6 «diez meses»: se completan el 8, 9 y 10 y laten los diez; «invierno»: las dos casillas en bruto se hielan y
//   les cae nieve.
// - F7 «enero», «febrero»: se tallan IANVARIVS y FEBRVARIVS; «empezar en enero»: la rueda gira hasta la flecha.
// - F8 «nombres»: un brillo recorre los nombres; «corrieron dos puestos»: los números ruedan al nuevo; «noveno»:
//   SEPTEMBER con su 9 en rojo, SEPTEM en oro y la moneda del 7.
// - F9 QVINTILIS y SEXTILIS: QVINT y SEXT en oro, monedas del 5 y del 6.
// - F10 «cambiaron»: los dos nombres se rompen y caen; «César», «Augusto»: IVLIVS y AVGVSTVS en oro, con su laurel.
// - F11 la cámara se aleja; la moneda corre de MARTIVS a SEPTEMBER contando 1...7.
// - F12 SEPTEMBER encendido, con pétalos de oro.
import * as k from "#kit";
import { v } from "#voz";
import { romana, moneda, mezHex } from "../mundo.js";

export const desde = (vz) => vz.frase(3).t("romanos");
export const entrada = "corte";

const { suave: su, tramo: tr, mez, azar, pulso, entra } = k;
const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const T0 = f3.t("romanos");
const Tmarzo = f4.t("marzo"), Tprim = f4.t("primavera");
const Tm5 = f5.t("marzo"), Ts5 = f5.t("septiembre"), Tcuenta = f5.t("cuenta");
const Tsegun = f6.t("segun"), Tdiez = f6.t("diez"), Tinv = f6.t("invierno");
const Tenero = f7.t("enero"), Tfeb = f7.t("febrero"), Tempezar = f7.t("empezar");
const Tnombres = f8.t("nombres"), Ttodos = f8.t("todos"), Ts8 = f8.t("septiembre"), Tnoveno = f8.t("noveno");
const Tjulio = f9.t("julio"), Tagosto = f9.t("agosto"), Tquinto = f9.t("quinto"), Tsexto = f9.t("sexto");
const Tcamb = f10.t("cambiaron"), Tcesar = f10.t("cesar"), Taug = f10.t("augusto");
const Ts11 = f11.t("septiembre"), Tsigue = f11.t("sigue"), Tm11 = f11.t("marzo"), Tdosmil = f11.t("dos");
const Tamigo = f12.t("amigo"), Ts12 = f12.t("septiembre");
const FIN = v.duracion;

const RAD = Math.PI / 180;
const R_MAR = 420, R_BRO = 462, R_BOSS = 88, R_NUM = 145, R1 = 212, R2 = 404;
const NOMBRES = ["MARTIVS", "APRILIS", "MAIVS", "IVNIVS", "QVINTILIS", "SEXTILIS", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER", "IANVARIVS", "FEBRVARIVS"];
const NUEVOS = { 4: "IVLIVS", 5: "AVGVSTVS" };
const RAIZ = { 4: 5, 5: 4, 6: 6 }; // QVINT, SEXT, SEPTEM: las letras que dicen el número
const PUNTERO = -30;

// el giro de la rueda: 60° cuando el año pasa a empezar en enero
const TgiroA = Tempezar - 0.3, TgiroB = Tempezar + 0.85;
const giro = (t) => 60 * su(tr(t, TgiroA, TgiroB));
const ang = (kk, t) => (PUNTERO + 30 * kk + giro(t)) * RAD;

// la cámara: { s, x, y } en el espacio de la rueda; la rueda está en (0, 0)
const YC = 990;
const VISTAS = {
  entra: { s: 0.74, x: 0, y: -250 },
  todo: { s: 1, x: 0, y: 0 },
  marzo: { s: 1.3, x: 190, y: -110 },
  sept: { s: 1.6, x: -235, y: 135 },
  hueco: { s: 1.35, x: 70, y: -230 },
  sept2: { s: 1.6, x: -250, y: -140 },
  nombres: { s: 1.28, x: -70, y: -150 },
  julio: { s: 1.45, x: -285, y: 75 },
  final: { s: 0.93, x: 0, y: 20 },
  adios: { s: 1.3, x: -190, y: -110 },
};
const TRAMOS = [
  [T0, T0 + 1.6, "entra", "todo"],
  [Tmarzo - 0.45, Tmarzo + 0.35, "todo", "marzo"],
  [Tcuenta + 0.6, Tm5 + 0.35, "marzo", "todo"],
  [Ts5 - 0.25, Ts5 + 0.45, "todo", "sept"],
  [Tsegun - 0.05, Tsegun + 0.85, "sept", "todo"],
  [Tinv - 0.45, Tinv + 0.4, "todo", "hueco"],
  [Tempezar - 0.85, Tempezar - 0.2, "hueco", "todo"],
  [Tnombres - 0.3, Tnombres + 0.6, "todo", "nombres"],
  [Ttodos - 0.4, Ttodos + 0.4, "nombres", "todo"],
  [Ts8 - 0.3, Ts8 + 0.5, "todo", "sept2"],
  [Tjulio - 0.25, Tjulio + 0.5, "sept2", "julio"],
  [Ts11 - 0.35, Ts11 + 0.6, "julio", "final"],
  [Tamigo - 0.6, FIN, "final", "adios"],
];
function cam(t) {
  let c = VISTAS.entra;
  for (const [a, b, de, a2] of TRAMOS) {
    if (t < a) break;
    const u = su(tr(t, a, b)), A = VISTAS[de], B = VISTAS[a2];
    c = { s: Math.exp(mez(Math.log(A.s), Math.log(B.s), u)), x: mez(A.x, B.x, u), y: mez(A.y, B.y, u) };
  }
  return c;
}
const pant = (c, x, y) => [540 + c.s * (x - c.x), YC + c.s * (y - c.y)];
const enRueda = (r, a) => [r * Math.cos(a), r * Math.sin(a)];

// ---------- lo pesado, una vez ----------
function espejo(src, n) {
  const c = k.lienzo(n * 2, n * 2), x = c.getContext("2d");
  for (const [fx, fy] of [[1, 1], [-1, 1], [1, -1], [-1, -1]]) { x.save(); x.translate(n, n); x.scale(fx, fy); x.drawImage(src, 0, 0, n, n); x.restore(); }
  return c;
}
// el muro: rojo pompeyano, en paneles con marco ocre y negro
const MURO = (() => {
  const n = 1024, c = k.lienzo(n, n), x = c.getContext("2d");
  x.fillStyle = "#a3281c"; x.fillRect(0, 0, n, n);
  const W = 512, H = 512;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
    const ox = i * W, oy = j * H;
    x.fillStyle = "#1c0f0a"; x.fillRect(ox, oy, W, 22); x.fillRect(ox, oy, 22, H);
    x.strokeStyle = "#d8a24a"; x.lineWidth = 7; x.strokeRect(ox + 60, oy + 60, W - 98, H - 98);
    x.strokeStyle = "rgba(255,220,150,0.35)"; x.lineWidth = 2; x.strokeRect(ox + 76, oy + 76, W - 130, H - 130);
    const pg = x.createRadialGradient(ox + W / 2, oy + H / 2, 20, ox + W / 2, oy + H / 2, W * 0.6);
    pg.addColorStop(0, "rgba(220,70,45,0.45)"); pg.addColorStop(1, "rgba(120,20,10,0)");
    x.fillStyle = pg; x.fillRect(ox + 64, oy + 64, W - 106, H - 106);
  }
  x.globalCompositeOperation = "multiply"; x.globalAlpha = 0.4; x.drawImage(espejo(k.manchas, n / 2), 0, 0);
  x.globalAlpha = 0.15; x.drawImage(espejo(k.red, n / 2), 0, 0);
  return c;
})();
// el anillo de dentro: lapislázuli con motas de oro
const LAPIS = (() => {
  const n = 420, c = k.lienzo(n, n), x = c.getContext("2d");
  const lg = x.createRadialGradient(n * 0.4, n * 0.35, 10, n / 2, n / 2, n * 0.6); lg.addColorStop(0, "#3a63c9"); lg.addColorStop(1, "#142a6e");
  x.fillStyle = lg; x.fillRect(0, 0, n, n);
  x.globalCompositeOperation = "multiply"; x.globalAlpha = 0.45; x.drawImage(k.manchas, 0, 0, n, n);
  x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
  const az = azar(99);
  for (let i = 0; i < 160; i++) { x.fillStyle = `rgba(255,${200 + az() * 40},120,${0.3 + az() * 0.5})`; x.beginPath(); x.arc(az() * n, az() * n, 0.6 + az() * 1.6, 0, 6.2832); x.fill(); }
  return c;
})();
// el mármol del disco
const MARMOL = (() => {
  const n = 900, c = k.lienzo(n, n), x = c.getContext("2d");
  const bg = x.createRadialGradient(n * 0.4, n * 0.35, 50, n / 2, n / 2, n * 0.6); bg.addColorStop(0, "#fbf6ec"); bg.addColorStop(1, "#e3d6bf");
  x.fillStyle = bg; x.fillRect(0, 0, n, n);
  x.globalCompositeOperation = "multiply"; x.globalAlpha = 0.22; x.drawImage(k.manchas, 0, 0, n, n);
  x.globalAlpha = 0.08; x.drawImage(k.red, 0, 0, n, n);
  x.globalCompositeOperation = "source-over"; x.globalAlpha = 1;
  const az = azar(321);
  x.filter = "blur(1.5px)";
  for (let i = 0; i < 16; i++) {
    let px = az() * n, py = az() * n; const a0 = az() * 6.28;
    x.strokeStyle = `rgba(${120 + az() * 40},${110 + az() * 30},${100 + az() * 20},${0.12 + az() * 0.15})`; x.lineWidth = 1 + az() * 3;
    x.beginPath(); x.moveTo(px, py);
    for (let s = 0; s < 8; s++) { const a = a0 + (az() - 0.5) * 1.4; const nx = px + Math.cos(a) * 70, ny = py + Math.sin(a) * 70; x.quadraticCurveTo((px + nx) / 2 + (az() - 0.5) * 40, (py + ny) / 2 + (az() - 0.5) * 40, nx, ny); px = nx; py = ny; }
    x.stroke();
  }
  x.filter = "none";
  return c;
})();
const ESCARCHA = (() => {
  const n = 512, c = k.lienzo(n, n), x = c.getContext("2d");
  x.drawImage(k.tenir(k.red, "rgb(225,245,255)"), 0, 0, n, n);
  return c;
})();
// el tamaño de letra de cada nombre, para que quepa entre R1 y R2
let medida = null;
const TAM = {};
function tamDe(nm) {
  if (TAM[nm] === undefined) {
    medida ??= k.lienzo(10, 10).getContext("2d");
    medida.font = `700 40px ${romana()}`; TAM[nm] = Math.min(40, Math.floor((40 * (R2 - R1)) / medida.measureText(nm).width));
  }
  return TAM[nm];
}

// ---------- piezas ----------
function cuna(g, a, r0, r1, ancho = 15) {
  g.beginPath(); g.arc(0, 0, r1, a - ancho * RAD, a + ancho * RAD); g.arc(0, 0, r0, a + ancho * RAD, a - ancho * RAD, true); g.closePath();
}

// un nombre tallado a lo largo del radio de su casilla. p: cuánto está tallado (0-1); oro: relleno de oro (0-1);
// raiz: cuántas letras del principio se encienden; brilla: las letras de la raíz, de 0 a 1; al: transparencia
function nombre(g, txt, a, { p = 1, oro = 0, raiz = 0, brilla = 0, al = 1, escala = 1 } = {}) {
  if (al <= 0 || p <= 0) return null;
  const izq = Math.cos(a) < -0.01;
  const tam = tamDe(txt) * escala, rm = (R1 + R2) / 2;
  g.save();
  g.rotate(izq ? a + Math.PI : a);
  g.translate(izq ? -rm : rm, 0);
  g.font = `700 ${tam}px ${romana()}`; g.textBaseline = "middle"; g.textAlign = "left";
  const w = g.measureText(txt).width, x0 = -w / 2;
  if (p < 1) { g.beginPath(); g.rect(x0 - 4, -tam, (w + 8) * p, tam * 2); g.clip(); }
  g.globalAlpha *= al;
  const wr = raiz ? g.measureText(txt.slice(0, raiz)).width : 0;
  g.fillStyle = "rgba(255,250,235,0.85)"; g.fillText(txt, x0 + 1.5, 2.5);
  g.fillStyle = oro > 0 ? mezHex("#4a3a2a", "#c98a14", oro) : "#4a3a2a"; g.fillText(txt, x0, 0);
  if (oro > 0) {
    g.save(); g.globalAlpha *= oro; g.shadowColor = "rgba(255,190,60,0.8)"; g.shadowBlur = 14;
    const og = g.createLinearGradient(0, -tam / 2, 0, tam / 2); og.addColorStop(0, "#fff0a0"); og.addColorStop(0.5, "#f0b630"); og.addColorStop(1, "#a86c0a");
    g.fillStyle = og; g.fillText(txt, x0, 0); g.restore();
  }
  if (raiz && brilla > 0) {
    g.save(); g.beginPath(); g.rect(x0 - 4, -tam, wr + 4, tam * 2); g.clip();
    g.globalAlpha *= brilla; g.shadowColor = "rgba(255,200,60,1)"; g.shadowBlur = 26;
    g.fillStyle = "#ffd447"; g.fillText(txt, x0, 0); g.fillText(txt, x0, 0);
    g.restore();
  }
  // el punto donde va el cincel (para las chispas), en coordenadas de la rueda
  const xp = x0 + w * p, rr = izq ? rm - xp : rm + xp;
  g.restore();
  return { r: rr, w };
}

// un número derecho en el anillo de dentro
function numero(g, n, a, { al = 1, luz = 0, rojo = 0, dy = 0, esc = 1 } = {}) {
  if (al <= 0) return;
  const [x, y] = enRueda(R_NUM, a);
  g.save(); g.globalAlpha *= al;
  g.font = `800 ${Math.round(56 * esc)}px ${romana()}`; g.textAlign = "center"; g.textBaseline = "middle";
  if (luz > 0 || rojo > 0) {
    g.save(); g.globalCompositeOperation = "lighter";
    k.brillo(g, x, y + dy, 150 * esc, rojo > luz ? "255,60,50" : "255,190,70", 0.5 * Math.max(luz, rojo));
    g.restore();
  }
  g.fillStyle = "rgba(5,10,40,0.7)"; g.fillText(n, x + 2, y + dy + 4);
  const og = g.createLinearGradient(0, y + dy - 28 * esc, 0, y + dy + 28 * esc);
  og.addColorStop(0, mezHex("#ffe9a0", "#fffbe8", luz)); og.addColorStop(1, mezHex("#d39a2c", "#ffd04a", luz));
  g.fillStyle = og; g.fillText(n, x, y + dy);
  if (rojo > 0) {
    g.globalAlpha *= rojo;
    g.lineWidth = 6 * esc; g.strokeStyle = "#ffffff"; g.strokeText(n, x, y + dy);
    g.fillStyle = "#e3202c"; g.fillText(n, x, y + dy);
  }
  g.restore();
}

// la corona de laurel, con el nombre dentro
function laurel(g, x, y, r, u, texto) {
  if (u <= 0) return;
  const e = entra(u), yy = y - 160 * (1 - e);
  g.save(); g.globalAlpha *= Math.min(1, u * 2.5);
  g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, yy, r * 3.4, "255,200,90", 0.6); g.restore();
  // el medallón
  g.save(); g.shadowColor = "rgba(20,5,0,0.6)"; g.shadowBlur = 18; g.shadowOffsetY = 8;
  const mg = g.createRadialGradient(x - r * 0.2, yy - r * 0.25, 2, x, yy, r * 0.8);
  mg.addColorStop(0, "#8a2a3a"); mg.addColorStop(1, "#3a0a14");
  g.fillStyle = mg; g.beginPath(); g.arc(x, yy, r * 0.78, 0, 6.2832); g.fill(); g.restore();
  g.strokeStyle = "#e8b443"; g.lineWidth = r * 0.06; g.beginPath(); g.arc(x, yy, r * 0.74, 0, 6.2832); g.stroke();
  // las hojas
  for (const lado of [-1, 1]) {
    for (let i = 0; i < 12; i++) {
      const a = Math.PI / 2 + lado * (0.3 + i * 0.215), px = x + Math.cos(a) * r, py = yy + Math.sin(a) * r;
      for (const fuera of [-1, 1]) {
        g.save(); g.translate(px + Math.cos(a) * fuera * r * 0.1, py + Math.sin(a) * fuera * r * 0.1); g.rotate(a + lado * (1.25 + fuera * 0.35));
        const lg = g.createLinearGradient(-r * 0.15, 0, r * 0.15, 0); lg.addColorStop(0, "#3f7a1a"); lg.addColorStop(0.5, "#a9d14a"); lg.addColorStop(1, "#4e6e12");
        g.fillStyle = lg; g.beginPath(); g.ellipse(0, 0, r * 0.1, r * 0.24, 0, 0, 6.2832); g.fill();
        g.strokeStyle = "rgba(30,50,0,0.55)"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, -r * 0.22); g.lineTo(0, r * 0.22); g.stroke();
        g.restore();
      }
    }
  }
  let tam = Math.round(r * 0.4); g.font = `800 ${tam}px ${romana()}`;
  const w = g.measureText(texto).width; if (w > r * 1.3) { tam = Math.floor(tam * r * 1.3 / w); g.font = `800 ${tam}px ${romana()}`; }
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = "rgba(20,0,0,0.7)"; g.fillText(texto, x + 2, yy + 3);
  const og = g.createLinearGradient(0, yy - tam / 2, 0, yy + tam / 2); og.addColorStop(0, "#fff3b0"); og.addColorStop(1, "#e8a820");
  g.fillStyle = og; g.fillText(texto, x, yy);
  g.restore();
}

// ---------- los momentos ----------
// la cuenta de F5: la luz llega a cada casilla
const paso5 = (j) => Tm5 + (j * (Ts5 - Tm5)) / 6;
const tViejo = (kk) => (kk === 0 ? Tmarzo : kk <= 6 ? paso5(kk) : [Tdiez - 1.2, Tdiez - 0.8, Tdiez - 0.4][kk - 7]);
// F8: el anillo de los números gira dos casillas hacia atrás (el 1 pasa de marzo a enero), y salen el 11 y el 12
const TanilloA = Ttodos - 0.05, TanilloB = f8.t("puestos") + 0.35;
const anillo = (t) => 60 * su(tr(t, TanilloA, TanilloB));
const tOnce = (kk) => TanilloB + 0.05 + (kk - 8) * 0.18;
// la moneda que cuenta en F11
const C11a = Tsigue + 0.25, C11b = Tm11 + 1.05;

// las chispas del cincel y los trozos que caen
const azC = azar(4242);
const CHISPAS = Array.from({ length: 26 }, () => ({ f: azC(), vx: (azC() - 0.5) * 520, vy: -220 - azC() * 380, v: 0.25 + azC() * 0.25 }));
const azT = azar(5151);
const TROZOS = Array.from({ length: 46 }, () => ({ f: azT(), lat: (azT() - 0.5) * 34, tam: 5 + azT() * 11, vx: (azT() - 0.5) * 160, vy: -60 - azT() * 140, giro: (azT() - 0.5) * 12, d: azT() * 0.25, forma: azar(Math.floor(azT() * 1e6)) }));
const azN = azar(616);
const NIEVE = Array.from({ length: 140 }, () => ({ x: (azN() - 0.5) * 700, y0: azN() * 900, v: 90 + azN() * 120, r: 2 + azN() * 5, f: azN() * 6 }));
const azP = azar(717);
const PETALOS = Array.from({ length: 46 }, () => ({ y: 300 + azP() * 1300, d: azP() * 0.7, v: 900 + azP() * 700, r: 9 + azP() * 10, f: azP() * 6, w: azP() * 6 }));

function chispas(g, x, y, t0, t, dur) {
  g.save(); g.globalCompositeOperation = "lighter";
  for (const c of CHISPAS) {
    const tb = t0 + c.f * dur, e = t - tb;
    if (e < 0 || e > c.v) continue;
    const px = x + c.vx * e, py = y + c.vy * e + 900 * e * e, al = 1 - e / c.v;
    g.fillStyle = `rgba(255,${200 + Math.round(55 * al)},120,${al})`; g.beginPath(); g.arc(px, py, 2.5 + 2 * al, 0, 6.2832); g.fill();
  }
  g.restore();
}
function petalos(g, t, t0, dur, color) {
  for (const p of PETALOS) {
    const e = t - t0 - p.d;
    if (e < 0 || e > dur) continue;
    const x = -60 + p.v * e * 0.55, y = p.y + Math.sin(e * 3 + p.f) * 50 + 60 * e;
    if (x > 1140) continue;
    g.save(); g.translate(x, y); g.rotate(p.f + e * p.w);
    g.globalAlpha = Math.min(1, e * 4) * (1 - tr(e, dur - 0.3, dur));
    const pg = g.createLinearGradient(-p.r, 0, p.r, 0); pg.addColorStop(0, color[0]); pg.addColorStop(1, color[1]);
    g.fillStyle = pg; g.beginPath(); g.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 6.2832); g.fill();
    g.restore();
  }
}

export function dibuja(g, t) {
  const c = cam(t);
  const rotT = giro(t) * RAD;
  // el muro, que se mueve un poco con la cámara
  g.save();
  const sm = 0.55 + 0.45 * c.s;
  g.setTransform(sm, 0, 0, sm, 540 - sm * c.x * 0.7, YC - sm * c.y * 0.7);
  g.fillStyle = g.createPattern(MURO, "repeat");
  g.fillRect(c.x * 0.7 - 700 / sm, c.y * 0.7 - 1100 / sm, 1400 / sm, 2200 / sm);
  g.restore();
  const sol = g.createRadialGradient(150, 250, 50, 400, 700, 1500);
  sol.addColorStop(0, "rgba(255,236,190,0.55)"); sol.addColorStop(0.45, "rgba(255,200,130,0.12)"); sol.addColorStop(1, "rgba(50,20,0,0.6)");
  g.fillStyle = sol; g.fillRect(0, 0, 1080, 1920);

  // ---- la rueda, en su espacio ----
  g.save();
  g.translate(540 - c.s * c.x, YC - c.s * c.y); g.scale(c.s, c.s);
  // su sombra en el muro
  g.save(); g.shadowColor = "rgba(30,10,0,0.6)"; g.shadowBlur = 60; g.shadowOffsetX = 30; g.shadowOffsetY = 45;
  g.fillStyle = "#6e4a17"; g.beginPath(); g.arc(0, 0, R_BRO, 0, 6.2832); g.fill(); g.restore();
  // el aro de bronce
  const bg = g.createLinearGradient(-R_BRO, -R_BRO, R_BRO, R_BRO);
  bg.addColorStop(0, "#ffe7a6"); bg.addColorStop(0.3, "#d29a3c"); bg.addColorStop(0.65, "#8a5c1e"); bg.addColorStop(1, "#4a300e");
  g.fillStyle = bg; g.beginPath(); g.arc(0, 0, R_BRO, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(255,240,200,0.5)"; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, R_BRO - 3, Math.PI * 0.9, Math.PI * 1.6); g.stroke();
  for (let kk = 0; kk < 12; kk++) {
    const a = ang(kk, t) + 15 * RAD, [x, y] = enRueda((R_MAR + R_BRO) / 2, a);
    const rg = g.createRadialGradient(x - 3, y - 3, 1, x, y, 9); rg.addColorStop(0, "#fff2c0"); rg.addColorStop(1, "#6b4512");
    g.fillStyle = rg; g.beginPath(); g.arc(x, y, 8, 0, 6.2832); g.fill();
  }
  // el mármol
  g.save(); g.beginPath(); g.arc(0, 0, R_MAR, 0, 6.2832); g.clip();
  g.save(); g.rotate(rotT); g.drawImage(MARMOL, -450, -450);
  g.beginPath(); g.arc(0, 0, 192, 0, 6.2832); g.clip(); g.rotate(-anillo(t) * RAD); g.drawImage(LAPIS, -210, -210); g.restore();

  // las luces de las casillas
  g.save(); g.globalCompositeOperation = "lighter";
  for (let kk = 0; kk < 12; kk++) {
    const a = ang(kk, t);
    let luz = 0, col = "255,190,70";
    if (kk <= 9) {
      const tv = tViejo(kk);
      luz = 0.95 * pulso(t, tv + 0.1, 0.22) + 0.3 * su(tr(t, tv, tv + 0.2)) * (1 - su(tr(t, Tsegun, Tsegun + 0.6)));
      luz += 0.55 * pulso(t, Tdiez + 0.12, 0.28);
    }
    if (kk === 0) { luz += 0.4 * su(tr(t, Tmarzo - 0.1, Tmarzo + 0.2)) * (1 - su(tr(t, Tm5, Tm5 + 0.3))); col = "170,255,120"; }
    if (kk === 6) {
      luz += 0.5 * su(tr(t, Ts5 - 0.05, Ts5 + 0.2)) * (1 - su(tr(t, Tsegun, Tsegun + 0.6)));
      luz += 0.45 * su(tr(t, Ts8 - 0.1, Ts8 + 0.3)) * (1 - su(tr(t, Tjulio - 0.2, Tjulio + 0.3)));
      luz += 0.6 * pulso(t, Ts11 + 0.15, 0.3) + 0.6 * su(tr(t, C11b - 0.1, C11b + 0.3)) + 0.5 * su(tr(t, Ts12 - 0.2, Ts12 + 0.4));
    }
    if (kk === 4) luz += 0.55 * su(tr(t, Tjulio - 0.05, Tjulio + 0.2)) * (1 - su(tr(t, Ts11 - 0.3, Ts11 + 0.3)));
    if (kk === 5) luz += 0.55 * su(tr(t, Tagosto - 0.05, Tagosto + 0.2)) * (1 - su(tr(t, Ts11 - 0.3, Ts11 + 0.3)));
    if (kk >= 10) luz += 0.6 * pulso(t, (kk === 10 ? Tenero : Tfeb) + 0.3, 0.3);
    // la moneda de F11 enciende a su paso
    if (kk <= 6) { const tp = mez(C11a, C11b, kk / 6); luz += 0.6 * pulso(t, tp, 0.18) + 0.18 * su(tr(t, tp, tp + 0.2)) * (kk < 6 ? 1 : 0); }
    if (luz > 0.01) {
      cuna(g, a, R_BOSS + 10, R_MAR - 4);
      const lg = g.createRadialGradient(0, 0, R_BOSS, 0, 0, R_MAR);
      lg.addColorStop(0, `rgba(${col},${0.15 * luz})`); lg.addColorStop(0.7, `rgba(${col},${0.42 * luz})`); lg.addColorStop(1, `rgba(${col},${0.2 * luz})`);
      g.fillStyle = lg; g.fill();
    }
  }
  g.restore();

  // el hielo del invierno, en las dos casillas sin nombre
  const hielo = su(tr(t, Tinv - 0.1, Tinv + 0.55)) * (1 - su(tr(t, Tfeb + 0.2, Tfeb + 1.0)));
  if (hielo > 0.01) {
    for (const kk of [10, 11]) {
      const a = ang(kk, t);
      g.save(); cuna(g, a, R_BOSS + 8, R_MAR); g.clip();
      g.globalAlpha = 0.85 * hielo;
      const ig = g.createRadialGradient(0, 0, R_BOSS, 0, 0, R_MAR); ig.addColorStop(0, "#6f9ad8"); ig.addColorStop(1, "#cfe6ff");
      g.fillStyle = ig; g.fillRect(-R_MAR, -R_MAR, R_MAR * 2, R_MAR * 2);
      g.globalCompositeOperation = "screen"; g.globalAlpha = 0.7 * hielo; g.drawImage(ESCARCHA, -R_MAR, -R_MAR, R_MAR * 2, R_MAR * 2);
      g.restore();
    }
  }

  // las ranuras: entre casillas y el anillo de los números
  g.lineCap = "round";
  for (let kk = 0; kk < 12; kk++) {
    for (const [r0, r1, da, claro] of [[196, R_MAR - 6, 0, "rgba(255,252,240,0.8)"], [R_BOSS + 8, 188, -anillo(t) * RAD, "rgba(160,190,255,0.35)"]]) {
      const a = ang(kk, t) + 15 * RAD + da, [x0, y0] = enRueda(r0, a), [x1, y1] = enRueda(r1, a);
      g.strokeStyle = claro; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + 2, y0 + 2); g.lineTo(x1 + 2, y1 + 2); g.stroke();
      g.strokeStyle = "rgba(60,45,30,0.75)"; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
    }
  }
  for (const r of [192, R_MAR - 8]) {
    g.strokeStyle = "rgba(255,252,240,0.7)"; g.lineWidth = 3; g.beginPath(); g.arc(1.5, 1.5, r, 0, 6.2832); g.stroke();
    g.strokeStyle = "rgba(90,70,50,0.6)"; g.lineWidth = 3.5; g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.stroke();
  }

  // los nombres
  const brilloNombres = tr(t, Tnombres - 0.15, Tnombres + 1.3);
  let cincel = null;
  for (let kk = 0; kk < 12; kk++) {
    const a = ang(kk, t);
    let txt = NOMBRES[kk], p = 1, oro = 0, raiz = RAIZ[kk] ?? 0, brilla = 0, al = 1;
    if (kk === 10 || kk === 11) {
      const t0 = kk === 10 ? Tenero - 0.08 : Tfeb - 0.06;
      p = tr(t, t0, t0 + 0.42);
      oro = 0.6 * (1 - su(tr(t, t0 + 0.5, t0 + 1.5)));
      if (p > 0 && p < 1) cincel = { kk, t0 };
    }
    if (brilloNombres > 0 && brilloNombres < 1) {
      const fase = ((kk - 2 + 12) % 12) / 12;
      oro = Math.max(oro, pulso(brilloNombres, 0.12 + fase * 0.6, 0.13));
    }
    if (kk === 6) brilla = Math.min(1, su(tr(t, Ts8 - 0.1, Ts8 + 0.3)) * (1 - su(tr(t, Tjulio - 0.2, Tjulio + 0.2))) + pulso(t, Ts5 + 0.2, 0.3) * 0.8 + su(tr(t, C11b - 0.1, C11b + 0.3)));
    if (kk === 4) brilla = su(tr(t, Tquinto - 0.1, Tquinto + 0.2));
    if (kk === 5) brilla = su(tr(t, Tsexto - 0.1, Tsexto + 0.2));
    if (kk === 4 || kk === 5) {
      const rompe = Tcamb + (kk - 4) * 0.12;
      al = 1 - su(tr(t, rompe, rompe + 0.3));
      const t0 = kk === 4 ? Tcesar - 0.12 : Taug - 0.12;
      const pn = tr(t, t0, t0 + 0.4);
      if (pn > 0) {
        const r = nombre(g, NUEVOS[kk], a, { p: pn, oro: 1 });
        if (pn < 1 && r) cincel = { kk, t0, nuevo: true };
      }
    }
    const r = nombre(g, txt, a, { p, oro, raiz, brilla, al });
    if (cincel && cincel.kk === kk && !cincel.nuevo && r) cincel.r = r.r;
  }

  // los números: el anillo gira con la rueda y, en F8, dos casillas hacia atrás
  const desliza = anillo(t) * RAD, moviendo = pulso(t, (TanilloA + TanilloB) / 2, (TanilloB - TanilloA) * 0.45);
  for (let kk = 0; kk < 10; kk++) {
    const a = ang(kk, t) - desliza;
    const tv = tViejo(kk), nace = su(tr(t, tv - 0.05, tv + 0.15));
    let luz = pulso(t, tv + 0.1, 0.22) + 0.6 * pulso(t, Tdiez + 0.12, 0.28) + 0.5 * moviendo;
    if (kk === 6) luz += su(tr(t, Ts5 - 0.05, Ts5 + 0.2)) * (1 - su(tr(t, Tsegun, Tsegun + 0.5)));
    // el 9 (que era de noviembre) acaba en septiembre: rojo
    const rojo = kk === 8 ? su(tr(t, Tnoveno - 0.1, Tnoveno + 0.15)) : 0;
    const grande = kk === 8 ? 0.4 * pulso(t, Tnoveno + 0.1, 0.14) + 0.3 * su(tr(t, Tnoveno - 0.1, Tnoveno + 0.2)) * (1 - su(tr(t, Tjulio - 0.2, Tjulio + 0.3))) : 0;
    numero(g, kk + 1, a, { al: nace, luz: Math.min(1, luz), rojo, esc: 1 + grande + 0.25 * pulso(t, tv + 0.08, 0.12) });
  }
  for (const kk of [8, 9]) {
    const tn = tOnce(kk), u = tr(t, tn, tn + 0.25);
    if (u > 0) numero(g, kk + 3, ang(kk, t), { al: su(u), luz: pulso(t, tn + 0.12, 0.15), esc: 1 + 0.3 * pulso(t, tn + 0.1, 0.1) });
  }

  // la luz del sol sobre el disco
  const lz = g.createRadialGradient(-220, -260, 30, -80, -60, R_MAR * 1.25);
  lz.addColorStop(0, "rgba(255,250,235,0.35)"); lz.addColorStop(0.55, "rgba(255,240,210,0)"); lz.addColorStop(1, "rgba(70,40,10,0.35)");
  g.fillStyle = lz; g.fillRect(-R_MAR, -R_MAR, R_MAR * 2, R_MAR * 2);
  g.restore(); // fin del recorte del mármol

  // el centro de bronce
  const cg = g.createRadialGradient(-30, -34, 6, 0, 0, R_BOSS);
  cg.addColorStop(0, "#fff0b8"); cg.addColorStop(0.45, "#cf9638"); cg.addColorStop(1, "#5a3a10");
  g.save(); g.shadowColor = "rgba(40,20,0,0.5)"; g.shadowBlur = 20; g.shadowOffsetY = 8;
  g.fillStyle = cg; g.beginPath(); g.arc(0, 0, R_BOSS, 0, 6.2832); g.fill(); g.restore();
  g.save(); g.rotate(rotT);
  for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillStyle = "rgba(90,55,10,0.45)"; g.beginPath(); g.moveTo(26, -7); g.lineTo(R_BOSS - 12, 0); g.lineTo(26, 7); g.fill(); }
  g.restore();
  const cg2 = g.createRadialGradient(-10, -12, 2, 0, 0, 30); cg2.addColorStop(0, "#fff6d0"); cg2.addColorStop(1, "#a8701c");
  g.fillStyle = cg2; g.beginPath(); g.arc(0, 0, 28, 0, 6.2832); g.fill();

  // la flecha de bronce: aquí empieza el año
  const pa = PUNTERO * RAD, avisa = pulso(t, Tmarzo + 0.1, 0.3) + pulso(t, TgiroB, 0.3);
  g.save(); g.rotate(pa);
  if (avisa > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, R_BRO + 55, 0, 260, "255,200,90", 0.7 * avisa); g.restore(); }
  g.shadowColor = "rgba(30,10,0,0.5)"; g.shadowBlur = 16; g.shadowOffsetY = 10;
  const pg = g.createLinearGradient(0, -30, 0, 30); pg.addColorStop(0, "#ffe9a8"); pg.addColorStop(0.5, "#c58a2e"); pg.addColorStop(1, "#5e3c10");
  g.fillStyle = pg; g.beginPath();
  g.moveTo(R_BRO + 6, 0); g.lineTo(R_BRO + 62, -34); g.lineTo(R_BRO + 62, -13); g.lineTo(R_BRO + 140, -13); g.lineTo(R_BRO + 140, 13); g.lineTo(R_BRO + 62, 13); g.lineTo(R_BRO + 62, 34); g.closePath(); g.fill();
  g.restore();

  // el cincel: chispas donde se talla
  if (cincel) {
    const a = ang(cincel.kk, t), r = cincel.r ?? (R1 + R2) / 2;
    const [x, y] = enRueda(r, a);
    chispas(g, x, y, cincel.t0, t, 0.42);
  }

  // la nieve sobre el hueco del invierno
  if (hielo > 0.01) {
    g.save(); g.globalAlpha = hielo;
    const [hx, hy] = enRueda(300, ang(10.5, t));
    for (const n of NIEVE) {
      const y = hy - 450 + ((n.y0 + n.v * (t - Tinv + 3)) % 900), x = hx + n.x + Math.sin(t * 1.5 + n.f) * 18;
      const fg = g.createRadialGradient(x, y, 0, x, y, n.r * 2); fg.addColorStop(0, "rgba(255,255,255,0.95)"); fg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = fg; g.beginPath(); g.arc(x, y, n.r * 2, 0, 6.2832); g.fill();
    }
    g.restore();
  }

  // los trozos de los nombres que se rompen
  for (const kk of [4, 5]) {
    const rompe = Tcamb + (kk - 4) * 0.12, a = ang(kk, t);
    for (const p of TROZOS) {
      const e = t - rompe - p.d * 0.3;
      if (e < 0 || e > 1.4) continue;
      const r = R1 + (R2 - R1) * p.f, [bx, by] = enRueda(r, a);
      const nx = -Math.sin(a), ny = Math.cos(a);
      const x = bx + nx * p.lat + p.vx * e, y = by + ny * p.lat + p.vy * e + 1100 * e * e;
      g.save(); g.translate(x, y); g.rotate(p.giro * e);
      g.globalAlpha = 1 - tr(e, 0.9, 1.4);
      g.fillStyle = e < 0.05 ? "#4a3a2a" : "#d9ccb4"; g.strokeStyle = "rgba(80,60,40,0.7)"; g.lineWidth = 1.5;
      g.beginPath(); for (let i = 0; i < 5; i++) { const aa = (i / 5) * 6.2832, rr = p.tam * (0.6 + p.forma() * 0.4); i ? g.lineTo(Math.cos(aa) * rr, Math.sin(aa) * rr) : g.moveTo(Math.cos(aa) * rr, Math.sin(aa) * rr); } g.closePath(); g.fill(); g.stroke();
      g.restore();
    }
    // el polvo
    const polvo = pulso(t, rompe + 0.25, 0.3);
    if (polvo > 0.01) { const [x, y] = enRueda((R1 + R2) / 2, a); g.save(); g.globalAlpha = 0.5 * polvo; const dg = g.createRadialGradient(x, y + 30, 0, x, y + 30, 170); dg.addColorStop(0, "rgba(235,225,205,0.9)"); dg.addColorStop(1, "rgba(235,225,205,0)"); g.fillStyle = dg; g.beginPath(); g.arc(x, y + 30, 170, 0, 6.2832); g.fill(); g.restore(); }
  }

  // las monedas: el 7 de SEPTEMBER, el 5 y el 6
  const RM = 545;
  {
    const a = ang(6, t), [x, y] = enRueda(RM, a);
    moneda(g, x, y, 62, 7, tr(t, Ts8 - 0.05, Ts8 + 0.3), 1 - su(tr(t, Tjulio - 0.25, Tjulio + 0.15)));
  }
  for (const [kk, n, tt] of [[4, 5, Tquinto], [5, 6, Tsexto]]) {
    const a = ang(kk, t), [x, y] = enRueda(RM, a);
    moneda(g, x, y, 60, n, tr(t, tt - 0.08, tt + 0.27), 1 - su(tr(t, Tcamb - 0.05, Tcamb + 0.3)));
  }
  // los laureles de César y Augusto
  for (const [kk, tt, txt] of [[4, Tcesar, "CÉSAR"], [5, Taug, "AUGUSTO"]]) {
    const a = ang(kk, t), [x, y] = enRueda(RM + 10, a);
    laurel(g, x, y, 78, tr(t, tt - 0.1, tt + 0.35) * (1 - su(tr(t, Ts11 - 0.3, Ts11 + 0.3))), txt);
  }
  // F11: la moneda corre de MARTIVS a SEPTEMBER contando
  {
    const u = tr(t, C11a, C11b);
    if (t > C11a - 0.3) {
      const pos = 6 * su(u), kk = Math.min(6, Math.round(pos));
      const a = ang(pos, t), [x, y] = enRueda(RM - 20, a);
      moneda(g, x, y, 56, kk + 1, tr(t, C11a - 0.3, C11a));
    }
  }
  g.restore(); // fin del espacio de la rueda

  // pétalos: la primavera (F4) y los de oro del final
  petalos(g, t, Tprim - 0.15, 1.5, ["#ffc4dc", "#ff7fb0"]);
  for (const d of [1.9, 1.1, 0.3]) petalos(g, t, Ts12 - d, FIN - Ts12 + d + 0.1, ["#fff0a0", "#e8a820"]);

  // velo arriba para el subtítulo
  const vg = g.createLinearGradient(0, 240, 0, 640); vg.addColorStop(0, "rgba(40,18,0,0.55)"); vg.addColorStop(1, "rgba(40,18,0,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 640);
}
