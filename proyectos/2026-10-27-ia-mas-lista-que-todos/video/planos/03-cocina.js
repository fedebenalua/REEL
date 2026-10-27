// «...la del ajedrez no sabría ni freír un huevo.»
// Otro sitio: una cocina de noche. Corte en «la».
// - Fotograma 0: la sartén ya está en el fuego azul, con su aceite brillando; el rey negro del ajedrez, de pie en la
//   encimera, a su lado.
// - «freír»: un huevo cae desde arriba y revienta en la sartén: la clara se extiende y chisporrotea.
// - «huevo»: el rey se cae de lado, torpe, contra la sartén, y rebota un poco. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { rey, velo } from "../mundo.js";

export const desde = "la";

const { suave, tramo, entra } = k;
const f3 = v.frase(3);
const T0 = f3.t("la"), Tfre = f3.t("freir"), Thue = f3.t("huevo"), Tfin = v.frase(4).inicio;
const Tcae = Tfre + 0.02;

// los azulejos de la pared: una rejilla con un poco de brillo distinto en cada uno
const az = k.azar(303);
const AZULEJOS = Array.from({ length: 12 * 14 }, () => az());
// las gotas de aceite que saltan cuando cae el huevo
const GOTAS = Array.from({ length: 34 }, () => ({ a: -Math.PI * (0.1 + 0.8 * az()), v: 260 + az() * 520, t: az() * 0.9, r: 3 + az() * 5 }));
const BURBUJAS = Array.from({ length: 40 }, () => ({ a: az() * 6.283, r: 0.55 + az() * 0.45, f: az() * 6.283, s: 4 + az() * 6 }));

const PX = 560, PY = 1060, PRX = 330, PRY = 118, HONDO = 46;

function pared(g) {
  const pg = g.createLinearGradient(0, 0, 0, 1180);
  pg.addColorStop(0, "#14202c"); pg.addColorStop(1, "#22344a");
  g.fillStyle = pg; g.fillRect(0, 0, 1080, 1180);
  const L = 90;
  for (let j = 0; j < 14; j++) for (let i = 0; i < 12; i++) {
    const b = AZULEJOS[j * 12 + i];
    g.fillStyle = `rgba(160,200,240,${0.03 + 0.05 * b})`; g.fillRect(i * L + 3, j * L + 3, L - 6, L - 6);
  }
  g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = 4;
  g.beginPath(); for (let i = 0; i <= 12; i++) { g.moveTo(i * L, 0); g.lineTo(i * L, 1180); } for (let j = 0; j <= 14; j++) { g.moveTo(0, j * L); g.lineTo(1080, j * L); } g.stroke();
}

function encimera(g) {
  const eg = g.createLinearGradient(0, 1150, 0, 1920);
  eg.addColorStop(0, "#3a3f4a"); eg.addColorStop(0.08, "#24272f"); eg.addColorStop(1, "#0b0c10");
  g.fillStyle = eg; g.fillRect(0, 1150, 1080, 770);
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.18; g.drawImage(k.manchas, 0, 1150, 1080, 770); g.restore();
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(0, 1150, 1080, 3);
}

function sarten(g, t) {
  // el cuerpo: el canto de fuera, de metal oscuro
  g.beginPath(); g.ellipse(PX, PY + HONDO, PRX * 0.92, PRY * 0.92, 0, 0, Math.PI); g.lineTo(PX - PRX, PY); g.ellipse(PX, PY, PRX, PRY, 0, Math.PI, 0, true); g.closePath();
  k.metal(g, PX - PRX, PX + PRX, ["#15171c", "#5d6470", "#2a2e36", "#8a93a1", "#16181d"]);
  // el mango
  g.save(); g.translate(PX + PRX - 10, PY + 10); g.rotate(-0.08);
  g.beginPath(); k.redondo(g, 0, -20, 280, 40, 20); k.metal(g, 0, 280, ["#0c0d10", "#3c414b", "#121318", "#2e333c", "#08090b"]);
  g.restore();
  // el borde y el fondo, con el aceite caliente
  g.beginPath(); g.ellipse(PX, PY, PRX, PRY, 0, 0, Math.PI * 2);
  k.metal(g, PX - PRX, PX + PRX, ["#2a2e36", "#9aa3b0", "#3a3f48", "#c3cad5", "#2a2e36"]);
  g.beginPath(); g.ellipse(PX, PY + 6, PRX * 0.9, PRY * 0.86, 0, 0, Math.PI * 2);
  const fg = g.createRadialGradient(PX - 60, PY - 20, 10, PX, PY + 6, PRX);
  fg.addColorStop(0, "#3b3428"); fg.addColorStop(0.6, "#1a1813"); fg.addColorStop(1, "#0b0a08");
  g.fillStyle = fg; g.fill();
  // el aceite: un brillo que se mueve un poco
  g.save(); g.beginPath(); g.ellipse(PX, PY + 6, PRX * 0.9, PRY * 0.86, 0, 0, Math.PI * 2); g.clip();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, PX - 110 + 20 * Math.sin(t * 1.3), PY - 30, 260, "255,200,120", 0.35);
  g.globalAlpha = 0.25; g.drawImage(k.causticas, PX - PRX, PY - PRY, PRX * 2, PRY * 2);
  g.restore();
}

function huevo(g, t) {
  if (t < Tcae - 0.4) return;
  if (t < Tcae) {
    // cayendo: la clara y la yema, un poco estiradas
    const u = tramo(t, Tcae - 0.4, Tcae), y = k.mez(-120, PY - 6, u * u);
    g.save(); g.translate(PX - 20, y);
    g.fillStyle = "rgba(255,250,235,0.85)"; g.beginPath(); g.ellipse(0, -30, 70, 110, 0, 0, Math.PI * 2); g.fill();
    const yg = g.createRadialGradient(-14, 2, 4, 0, 10, 52); yg.addColorStop(0, "#fff2a0"); yg.addColorStop(0.5, "#ffb21e"); yg.addColorStop(1, "#e07a00");
    g.fillStyle = yg; g.beginPath(); g.arc(0, 10, 50, 0, Math.PI * 2); g.fill();
    g.restore();
    return;
  }
  const u = t - Tcae, abre = entra(Math.min(1, u / 0.35)), cuaja = suave(tramo(u, 0.1, 1.2));
  // la clara que se extiende, con el borde ondulado y cada vez más blanca
  g.save(); g.translate(PX - 20, PY + 4);
  g.beginPath();
  for (let i = 0; i <= 48; i++) {
    const a = (i / 48) * Math.PI * 2, r = 1 + 0.08 * Math.sin(a * 5 + 1) + 0.05 * Math.sin(a * 9 + 2);
    const x = Math.cos(a) * 200 * abre * r, y = Math.sin(a) * 74 * abre * r;
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  }
  g.closePath();
  const cg = g.createRadialGradient(-30, -10, 10, 0, 0, 210);
  cg.addColorStop(0, `rgba(255,255,255,${0.7 + 0.3 * cuaja})`); cg.addColorStop(0.75, `rgba(250,248,240,${0.6 + 0.35 * cuaja})`); cg.addColorStop(1, `rgba(214,170,110,${0.5 + 0.4 * cuaja})`);
  g.fillStyle = cg; g.fill();
  // la yema, que cae y se aplasta un poco
  const bota = 1 - 0.18 * Math.exp(-u * 9) * Math.cos(u * 30);
  const yg = g.createRadialGradient(-16, -18, 4, 0, -6, 60); yg.addColorStop(0, "#fff6b0"); yg.addColorStop(0.45, "#ffb422"); yg.addColorStop(1, "#d86e00");
  g.fillStyle = yg; g.beginPath(); g.ellipse(0, -8, 58 / bota, 40 * bota, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(-18, -24, 14, 7, -0.4, 0, Math.PI * 2); g.fill();
  // las burbujas del borde, que chisporrotean
  g.globalCompositeOperation = "lighter";
  for (const b of BURBUJAS) {
    const p = 0.5 + 0.5 * Math.sin(t * 14 + b.f);
    g.fillStyle = `rgba(255,240,200,${0.35 * p * Math.min(1, u * 3)})`;
    g.beginPath(); g.arc(Math.cos(b.a) * 200 * abre * b.r, Math.sin(b.a) * 74 * abre * b.r, b.s * (0.6 + 0.4 * p), 0, Math.PI * 2); g.fill();
  }
  g.restore();
  // las gotas de aceite que saltan
  g.save(); g.globalCompositeOperation = "lighter";
  for (const d of GOTAS) {
    const s = u - d.t * 0.5; if (s < 0 || s > 0.6) continue;
    const x = PX - 20 + Math.cos(d.a) * d.v * s * 0.8, y = PY - 10 + Math.sin(d.a) * d.v * s + 1400 * s * s;
    k.brillo(g, x, y, d.r * 9, "255,210,140", 0.8 * (1 - s / 0.6));
  }
  g.restore();
}

export function dibuja(g, t) {
  // un empujón lento de la cámara hacia la sartén
  const z = 1.38 + 0.06 * suave(tramo(t, T0, Tfin));
  g.save(); g.translate(560, 1060); g.translate(0, -40); g.scale(z, z); g.translate(-560, -1060);
  pared(g);
  // la luz cálida de la cocina, arriba a la izquierda
  k.brillo(g, 120, 280, 1500, "255,170,90", 0.3);
  // la luz azul del fuego en la pared
  k.brillo(g, PX, PY + 120, 1400, "90,140,255", 0.3);
  encimera(g);
  // el fuego: detrás, el quemador, delante; y la sartén encima
  k.anilloDeLlamas(g, PX, PY + 120, 200, 46, t, 0, false, 30, 80);
  g.fillStyle = "#101216"; g.beginPath(); g.ellipse(PX, PY + 128, 230, 54, 0, 0, Math.PI * 2); g.fill();
  k.anilloDeLlamas(g, PX, PY + 120, 200, 46, t, 0, true, 30, 80);
  sarten(g, t);
  huevo(g, t);
  // el rey: de pie en la encimera; en «huevo» se cae, torpe, contra la sartén
  const cae = tramo(t, Thue - 0.05, Thue + 0.4), ang = 1.05 * Math.pow(cae, 2) - (cae >= 1 ? 0.06 * Math.exp(-(t - Thue - 0.4) * 7) * Math.abs(Math.sin((t - Thue - 0.4) * 22)) : 0);
  g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.ellipse(320 + 140 * Math.sin(ang), 1330, 130, 26, 0, 0, Math.PI * 2); g.fill();
  rey(g, 320, 1330, 440, ang, true);
  // el brillo del fuego en el rey
  k.brillo(g, 320 + 200 * Math.sin(ang), 1330 - 200 * Math.cos(ang), 260, "90,140,255", 0.25);
  g.restore();
  velo(g, 0.4);
}
