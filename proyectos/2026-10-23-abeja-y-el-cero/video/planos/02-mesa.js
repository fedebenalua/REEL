// La mesa: entrenamiento, azúcar, la carta vacía y seis de cada diez.
import * as k from "#kit";
import { v } from "#voz";
import { abeja, carta, gota, velo } from "../mundo.js";

export const desde = "dos";
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra } = k;
const f3 = v.frase(3);
const f4 = v.frase(4);
const f5 = v.frase(5);
const f6 = v.frase(6);
const f7 = v.frase(7);
const Tdos = f3.t("dos");
const Ttres = f3.t("tres");
const Tcinco = f3.t("cinco");
const Tdibujo = f3.t("dibujo");
const Telig = f3.t("eligiendo");
const Taz = f4.t("azucar");
const Tvuelve = f4.t("vuelve");
const Tap = f5.t("aparece");
const Tning = f5.t("ningun");
const Tpunto = f5.t("punto");
const Tnada = f6.t("nada");
const Tvacia = f6.t("vacia");
const Tseis = f7.t("seis");
const Tdiez = f7.t("diez");
const TcincoAz = f7.t("cinco");
const Fin = f7.fin;

function mesa(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#2a140c");
  bg.addColorStop(0.42, "#6a3418");
  bg.addColorStop(1, "#1a0c08");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  // ventana
  g.save();
  k.redondo(g, 80, 520, 280, 360, 24);
  g.fillStyle = "#f6d48a";
  g.fill();
  g.clip();
  g.fillStyle = "#8fd0ff";
  g.fillRect(80, 520, 280, 200);
  g.fillStyle = "#6ecf62";
  g.fillRect(80, 700, 280, 180);
  g.restore();
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 220, 700, 700, "255,200,120", 0.28);
  g.restore();
  // tabla
  g.beginPath();
  g.moveTo(0, 1280);
  g.lineTo(1080, 1220);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.closePath();
  const mg = g.createLinearGradient(0, 1200, 0, 1920);
  mg.addColorStop(0, "#c4844a");
  mg.addColorStop(0.2, "#a0622e");
  mg.addColorStop(1, "#4a2814");
  g.fillStyle = mg;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.red, 0, 1100, 1080, 820);
  g.restore();
  // florero, color de fondo, quieto
  g.fillStyle = "#2f6b3a";
  g.beginPath();
  g.ellipse(900, 1160, 70, 26, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#e23d5a";
  g.beginPath();
  g.arc(860, 1100, 28, 0, 6.2832);
  g.arc(930, 1080, 34, 0, 6.2832);
  g.arc(980, 1120, 24, 0, 6.2832);
  g.fill();
  g.fillStyle = "#f0c14a";
  g.beginPath();
  g.arc(910, 1110, 12, 0, 6.2832);
  g.fill();
}

function entraCarta(t, t0) {
  return entra(tr(t, t0, t0 + 0.45));
}

export function dibuja(g, t) {
  mesa(g, t);
  const seVa = su(tr(t, Tap - 0.05, Tap + 0.55));
  const flipU = tr(t, Tdibujo, Tdibujo + 0.55);
  const sx = Math.max(0.04, Math.abs(Math.cos(Math.min(1, flipU) * Math.PI)));
  const forma = flipU < 0.5 ? 0 : 1;
  const tres = 1 - seVa;

  const crece2 = su(tr(t, Telig, Telig + 0.65)) * (1 - su(tr(t, Tap - 0.1, Tap + 0.35)));
  const xs = [mez(250, 340, crece2), 560, 860];
  const llega = [entraCarta(t, Tdos), entraCarta(t, Ttres), entraCarta(t, Tcinco)];
  const nums = [2, 3, 5];
  for (let i = 0; i < 3; i++) {
    const y = mez(1600, 980, llega[i]) + seVa * 800;
    const w = i === 0 ? mez(260, 380, crece2) : 250;
    const h = i === 0 ? mez(350, 500, crece2) : 340;
    carta(g, xs[i], y, w, h, nums[i], { forma, sx: Math.max(0.04, sx), al: tres * Math.min(1, llega[i] * 1.4), rot: (i - 1) * 0.04 });
  }

  // la prueba: vacía y un punto. En «nada» la vacía crece y llena la pantalla.
  const prueba = su(tr(t, Tap + 0.15, Tning));
  const salePrueba = su(tr(t, f7.inicio - 0.1, f7.inicio + 0.45));
  const acerca = su(tr(t, Tnada - 0.1, f6.t("contar") + 0.45));
  const yP = mez(1600, mez(1020, 1080, acerca), prueba) + salePrueba * 700;
  const alP = prueba * (1 - salePrueba);
  const pulso = 1 + 0.18 * k.pulso(t, Tpunto, 0.16);
  carta(g, mez(340, 400, acerca), yP, mez(340, 520, acerca), mez(460, 640, acerca), 0, { al: alP, rot: -0.02 });
  carta(g, 800, yP + 20, 300 * pulso, 420 * pulso, 1, { al: alP * (1 - acerca * 0.35), rot: 0.03 });

  // abeja
  const a2 = su(tr(t, Telig, Telig + 0.7));
  const aAz = su(tr(t, Taz - 0.05, Taz + 0.45));
  const aVu = su(tr(t, Tvuelve, Tvuelve + 0.5));
  const aVa = su(tr(t, f6.t("va"), Tvacia + 0.15));
  let ax = mez(-80, 340, Math.min(1, llega[0]));
  let ay = mez(1400, 1160, Math.min(1, llega[0]));
  ax = mez(ax, 340, a2);
  ay = mez(ay, 1180, a2);
  ax = mez(ax, 300, aAz);
  ay = mez(ay, 1360, aAz);
  ax = mez(ax, 520, aVu);
  ay = mez(ay, 1000, aVu);
  const aPunto = su(tr(t, Tning, Tpunto + 0.15));
  ax = mez(ax, 820, aPunto);
  ay = mez(ay, 1120, aPunto);
  ax = mez(ax, 360, aVa);
  ay = mez(ay, 1200, aVa);
  const vuelo = aAz > 0.45 && aVu < 0.2 ? 0.12 : aVa > 0.85 ? 0.08 : 0.9;
  const rumbo = aVa > 0.2 ? -0.15 : aAz > 0.3 && aVu < 0.2 ? 0.5 : 0;
  const abejaAl = 1 - su(tr(t, f7.inicio - 0.05, f7.inicio + 0.35));
  const mira = aVa > 0.45 ? 1 : -1;
  if (t < f7.inicio + 0.2) {
    g.save();
    g.globalAlpha = abejaAl;
    abeja(g, ax, ay, 280, t, { vuelo, rumbo, mira });
    g.restore();
  }

  // gota de azúcar
  if (t > Taz - 0.35 && t < Tvuelve + 0.35) {
    const u = tr(t, Taz - 0.25, Taz + 0.12);
    const gy = mez(480, 1340, entra(u));
    const se = 1 - su(tr(t, Tvuelve, Tvuelve + 0.4));
    g.save();
    g.globalAlpha = se;
    const uCaida = tr(t, Taz + 0.02, Taz + 0.85);
    if (u < 1) gota(g, 300, gy, 90, 1);
    else gota(g, 300, 1360, 70, 1);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * 6.28;
      const v0 = 340 + (i % 4) * 70;
      const x = 300 + Math.cos(a) * v0 * uCaida;
      const y = 1320 + Math.sin(a) * 80 * uCaida + 720 * uCaida * uCaida - 180 * uCaida;
      if (uCaida > 0.02 && uCaida < 0.95) gota(g, x, y, 18 + (i % 3) * 8, 1);
    }
    g.restore();
  }

  // diez gotas
  const llegan = su(tr(t, f7.inicio, Tdiez));
  if (llegan > 0.02) {
    const u6 = su(tr(t, Tseis, Tseis + 0.55));
    for (let i = 0; i < 10; i++) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 200 + col * 150;
      const y = mez(1600, 980 + row * 220, llegaGota(llegan, i));
      let llena = 0;
      if (i < 6) llena = su(tr(u6, i * 0.08, i * 0.08 + 0.25));
      if (i === 5) llena *= 1 - su(tr(t, f7.t("azar") - 0.05, f7.t("azar") + 0.45));
      gota(g, x, y, 62, llena > 0.55 ? 1 : 0);
    }
  }
  // se aparta a la izquierda y se queda quieta mientras se ven las gotas
  if (t > f7.inicio - 0.05) {
    const q = su(tr(t, f7.inicio - 0.05, f7.inicio + 0.35));
    abeja(g, mez(560, 150, q), mez(1080, 760, q), 200, t, { vuelo: 1 - q, rumbo: 0.2, mira: -1 });
  }
  velo(g, 0.72);
}

function llegaGota(u, i) {
  return entra(Math.max(0, Math.min(1, (u - i * 0.03) / 0.7)));
}
