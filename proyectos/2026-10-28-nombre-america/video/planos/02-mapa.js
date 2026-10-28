// El taller: el mapa separa la tierra de Asia, escribe el nombre, y el nombre se queda
// aunque el cartógrafo deje de usarlo.
import * as k from "#kit";
import { v } from "#voz";
import {
  barco, cieloMar, compas, libro, medalla, palabraOro, pluma,
  tierraNorte, tierraSur, velo, viejoMundo,
} from "../mundo.js";

const f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

export const desde = f3.t("mapa");
export const entrada = "corte";

const Tsepara = f3.t("separa");
const Tescribe = f3.t("escribe");
const Tamerica3 = f3.t("america");
const Tamerigo = f4.t("amerigo");
const Tfemenino = f4.t("femenino");
const Teuropa = f4.t("europa");
const Tasia4 = f4.t("asia");
const Tvivo = f5.t("vivo");
const Tnunca = f5.t("nunca");
const Tfalso = f6.t("falso");
const Tsiete = f6.t("siete");
const Tdiscute = f7.t("discute");
const Tmapa7 = f7.t("mapa");
const Testa = f8.t("esta");
const Tmil = f8.t("mil");
const Tnorte = f9.t("norte");
const Tsur = f9.t("sur");
const Tpila = f10.t("pila");
const Tpropio = f10.t("propio");

const SUR = [340, 1080];
const NORTE = [400, 640];

function camara(t) {
  const ks = [
    [desde, 620, 860, 0.92],
    [Tsepara, 620, 860, 0.92],
    [Tsepara + 1.05, 600, 880, 0.96],
    [Tamerica3, 390, 1040, 1.7],
    [Tamerigo, 400, 1020, 1.55],
    [Teuropa, 500, 1000, 1.35],
    [f5.inicio, 430, 980, 1.3],
    [Tvivo, 480, 900, 1.2],
    [f6.inicio, 520, 960, 1.15],
    [Tfalso, 520, 980, 1.2],
    [f7.inicio, 540, 920, 1.1],
    [Tmapa7, 400, 1040, 1.65],
    [f8.inicio, 440, 1000, 1.4],
    [Testa, 480, 980, 1.25],
    [Tmil, 540, 960, 1.08],
    [f9.inicio, 480, 860, 1.12],
    [Tnorte, 420, 760, 1.22],
    [Tsur, 360, 1040, 1.28],
    [f10.inicio, 500, 880, 1.12],
    [Tpila, 500, 900, 1.08],
    [f11.inicio, 520, 920, 1.02],
    [v.duracion, 540, 940, 0.98],
  ];
  let i = 0;
  while (i < ks.length - 1 && t > ks[i + 1][0]) i++;
  const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)];
  const u = a[0] === b[0] ? 1 : k.suave(k.tramo(t, a[0], b[0]));
  return {
    cx: k.mez(a[1], b[1], u),
    cy: k.mez(a[2], b[2], u),
    z: k.mez(a[3], b[3], u),
  };
}

function taller(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#140e0a");
  fondo.addColorStop(0.4, "#2a1a10");
  fondo.addColorStop(1, "#100c09");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  const flama = 0.85 + 0.15 * Math.sin(t * 9);
  const luz = g.createRadialGradient(160, 620, 20, 420, 900, 900);
  luz.addColorStop(0, `rgba(255,170,60,${0.28 * flama})`);
  luz.addColorStop(1, "rgba(255,140,40,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

function marco(g) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 30;
  g.shadowOffsetY = 16;
  g.fillStyle = "#5a371c";
  g.fillRect(40, 80, 1080, 1400);
  g.shadowBlur = 0;
  g.fillStyle = "#3a2414";
  g.fillRect(58, 98, 1044, 1364);
  const mar = g.createLinearGradient(80, 120, 80, 1440);
  mar.addColorStop(0, "#1a6e9a");
  mar.addColorStop(0.5, "#0d4d86");
  mar.addColorStop(1, "#08305c");
  g.fillStyle = mar;
  g.fillRect(70, 110, 1020, 1340);
  g.restore();
}

function nombreEn(g, x, y, tam, al, recorte) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  if (recorte < 0.999) {
    g.beginPath();
    g.rect(-tam * 4, -tam, tam * 8 * recorte, tam * 2);
    g.clip();
  }
  palabraOro(g, "AMÉRICA", 0, 0, tam, al);
  g.restore();
}

export function dibuja(g, t) {
  const sep = k.suave(k.tramo(t, Tsepara, Tsepara + 0.95));
  const escribe = k.suave(k.tramo(t, Tescribe, Tamerica3 + 0.35));
  const pelar = k.suave(k.tramo(t, Testa - 0.55, Testa + 0.15));
  const norte = k.suave(k.tramo(t, Tnorte - 0.05, Tnorte + 0.35));
  const sur = k.suave(k.tramo(t, Tsur - 0.05, Tsur + 0.28));
  const hojaVieja = k.suave(k.tramo(t, Tpropio, Tpropio + 0.7));
  const aMar = k.suave(k.tramo(t, f11.inicio - 0.05, f11.inicio + 1.7));

  taller(g, t);
  const cam = camara(t);
  g.save();
  g.translate(540, 980);
  g.scale(cam.z, cam.z);
  g.translate(-cam.cx, -cam.cy);

  marco(g);
  // la tierra nueva sale de detrás del mundo viejo
  const dx = (1 - sep) * 300;
  tierraNorte(g, NORTE[0] + dx, NORTE[1], 1.05);
  tierraSur(g, SUR[0] + dx, SUR[1], 1.2);
  viejoMundo(g, 860, 780, 1.15);
  const alAsia = 1 - k.suave(k.tramo(t, Tsepara + 0.85, Tamerica3));
  palabraOro(g, "ASIA", 1020, 720, 64, alAsia);

  // el nombre del sur, el de 1507, se escribe y luego se despega
  const tapa = k.suave(k.tramo(t, Tamerigo - 0.1, Tamerigo + 0.35)) * (1 - k.suave(k.tramo(t, f5.inicio, f5.inicio + 0.4)));
  const discute = k.suave(k.tramo(t, f7.inicio, Tdiscute)) * (1 - k.suave(k.tramo(t, Tmapa7, Tmapa7 + 0.35)));
  const alSur = escribe * (1 - pelar) * (1 - tapa) * (1 - discute) * (t < Tnorte ? 1 : 0);
  nombreEn(g, SUR[0] + dx, SUR[1] - 10, 72, alSur, escribe);
  if (pelar > 0.02 && pelar < 0.98) {
    g.save();
    g.translate(0, -pelar * 80);
    g.rotate(-pelar * 0.2);
    nombreEn(g, SUR[0] + dx, SUR[1] - 10, 78, 1 - pelar, 1);
    g.restore();
  }
  // Mercator: norte y sur
  nombreEn(g, NORTE[0], NORTE[1] + 30, 70, norte, 1);
  if (t >= Tsur - 0.05) nombreEn(g, SUR[0], SUR[1] - 10, 78, sur, 1);

  g.restore();

  // primer plano: el nombre de pila, el medallón, la carta, el dúo, las copias
  primerPlano(g, t, hojaVieja);
  const escribePluma = k.suave(k.tramo(t, Tescribe, Tamerica3)) * (1 - k.suave(k.tramo(t, Tamerica3, Tamerica3 + 0.45)));
  if (escribePluma > 0.04) pluma(g, 800, 1120, 1.7, -0.85);
  const overlay = t > f5.inicio - 0.15 && t < Tmapa7 + 0.45;
  if (cam.z < 1.35 && aMar < 0.4 && !overlay) velaTaller(g, t);

  if (aMar > 0.01) marEncima(g, t, aMar);
  velo(g, 0.86);
}

let marLienzo = null;
function marEncima(g, t, al) {
  if (!marLienzo) marLienzo = k.lienzo(1080, 1920);
  const c = marLienzo.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, 1080, 1920);
  cieloMar(c, t);
  tierraSur(c, 560, 1040, 2.05);
  palabraOro(c, "AMÉRICA", 560, 1000, 150, 1);
  barco(c, 280, 1480, 0.8, t, 0.3, 0.7);
  barco(c, 540, 1540, 1.05, t, 1.1, 0.9);
  barco(c, 820, 1460, 0.72, t, 2, 0.6);
  g.save();
  g.globalAlpha *= al;
  g.drawImage(marLienzo, 0, 0);
  g.restore();
}

function oscurece(g, al) {
  if (al < 0.03) return;
  g.fillStyle = `rgba(6,8,16,${0.62 * al})`;
  g.fillRect(0, 0, 1080, 1920);
}

function primerPlano(g, t, hojaVieja) {
  const deAmerigo = k.suave(k.tramo(t, Tamerigo - 0.15, Tamerigo + 0.25));
  const aFemenino = k.suave(k.tramo(t, Tfemenino, Tfemenino + 0.45));
  const saleTipo = k.suave(k.tramo(t, f5.inicio - 0.15, f5.inicio + 0.25));
  if (deAmerigo > 0.02 && saleTipo < 0.98 && t < f6.inicio) {
    const al = deAmerigo * (1 - saleTipo);
    const y = 860;
    palabraOro(g, "AMERIGO", 540, y, 118, al * (1 - aFemenino));
    palabraOro(g, "AMÉRICA", 540, y, 122, al * aFemenino);
    const e = k.suave(k.tramo(t, Teuropa - 0.1, Teuropa + 0.35));
    const a = k.suave(k.tramo(t, Tasia4 - 0.1, Tasia4 + 0.35));
    medalla(g, 220, 1120, 110, "EUROPA", al * e);
    medalla(g, 860, 1120, 110, "ASIA", al * a);
  }

  const moneda = k.suave(k.tramo(t, f5.inicio, Tvivo + 0.15));
  const monedaFuera = k.suave(k.tramo(t, f6.inicio - 0.2, f6.inicio + 0.25));
  const cartaU = k.suave(k.tramo(t, f6.inicio, f6.inicio + 0.45));
  const cartaFueraU = k.suave(k.tramo(t, f7.inicio - 0.15, f7.inicio + 0.3));
  const duoU = k.suave(k.tramo(t, f7.inicio + 0.05, Tdiscute));
  const duoFueraU = k.suave(k.tramo(t, Tmapa7 - 0.05, Tmapa7 + 0.35));
  oscurece(g, Math.max(moneda * (1 - monedaFuera), cartaU * (1 - cartaFueraU), duoU * (1 - duoFueraU)));
  if (moneda > 0.02 && monedaFuera < 0.98) {
    const al = moneda * (1 - monedaFuera);
    g.save();
    g.globalAlpha *= al;
    g.fillStyle = "#0a3f72";
    g.fillRect(120, 980, 840, 220);
    g.strokeStyle = "rgba(180,220,255,0.45)";
    g.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      const y = 1040 + i * 40;
      for (let x = 140; x <= 940; x += 20) {
        const yy = y + Math.sin(x * 0.03 + t * 2 + i) * 6;
        if (x === 140) g.moveTo(x, yy);
        else g.lineTo(x, yy);
      }
      g.stroke();
    }
    g.restore();
    velaGrande(g, 250, 1040, al, t);
    palabraOro(g, "AMÉRICA", 820, 900, 72, al);
    const haz = k.suave(k.tramo(t, Tvivo, Tvivo + 0.45));
    const corta = k.suave(k.tramo(t, Tnunca, Tnunca + 0.45));
    const llega = haz * (1 - 0.65 * corta);
    if (llega > 0.02) {
      g.save();
      g.globalAlpha *= al * (1 - corta * 0.85);
      g.globalCompositeOperation = "lighter";
      const x1 = 700;
      const x0 = x1 - 280 * llega;
      const hg = g.createLinearGradient(x1, 1040, x0, 1040);
      hg.addColorStop(0, "rgba(255,210,90,0.9)");
      hg.addColorStop(1, "rgba(255,210,90,0)");
      g.fillStyle = hg;
      g.fillRect(x0, 1024, x1 - x0, 32);
      g.restore();
    }
  }

  const carta = cartaU;
  const cartaFuera = cartaFueraU;
  if (carta > 0.02 && cartaFuera < 0.98) {
    const al = carta * (1 - cartaFuera);
    hoja(g, 540, 1020, al);
    const num = k.suave(k.tramo(t, Tsiete - 0.3, Tsiete + 0.25));
    palabraOro(g, "1497", 540, 980, 150 * (0.8 + 0.2 * num), al * num);
    const x = k.suave(k.tramo(t, Tfalso - 0.05, Tfalso + 0.28));
    if (x > 0.02) {
      g.save();
      g.globalAlpha *= al;
      g.translate(540, 980);
      g.rotate(-0.4);
      g.strokeStyle = "#d01218";
      g.lineWidth = 22;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(-150, 0);
      g.lineTo(-150 + 300 * x, 0);
      g.stroke();
      g.restore();
      const sello = k.entra(x);
      g.save();
      g.translate(760, 1180);
      g.scale(sello, sello);
      g.globalAlpha *= al;
      g.fillStyle = "#9c1420";
      g.beginPath();
      g.arc(0, 0, 54, 0, 6.2832);
      g.fill();
      g.strokeStyle = "#6a0c14";
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(-18, -18);
      g.lineTo(18, 18);
      g.moveTo(18, -18);
      g.lineTo(-18, 18);
      g.stroke();
      g.restore();
    }
  }

  const duo = duoU;
  const duoFuera = duoFueraU;
  if (duo > 0.02 && duoFuera < 0.98) {
    const al = duo * (1 - duoFuera);
    g.save();
    g.globalAlpha *= al;
    libro(g, 300, 1080, 1.35);
    compas(g, 760, 1040, 1.3, 0.5 + 0.15 * Math.sin(t * 2));
    g.restore();
    const q = k.suave(k.tramo(t, Tdiscute - 0.1, Tdiscute + 0.25)) * (1 - duoFuera);
    palabraOro(g, "?", 540, 880, 180, q);
  }

  const fajo = k.suave(k.tramo(t, f8.t("tarde"), Tmil + 0.1));
  if (fajo > 0.02 && t < Tnorte - 0.2) {
    const al = fajo * (1 - k.suave(k.tramo(t, Tnorte - 0.55, Tnorte - 0.22)));
    for (let i = 0; i < 8; i++) {
      g.save();
      g.globalAlpha *= al * 0.95;
      g.translate(540 + (i - 3.5) * 28 * fajo, 1280 - i * 6);
      g.rotate((i - 3.5) * 0.06 * fajo);
      g.fillStyle = i % 2 ? "#f3e2c0" : "#e7d3a4";
      g.fillRect(-160, -16, 320, 34);
      g.fillStyle = "#d4a017";
      g.fillRect(-40, -4, 80, 8);
      g.restore();
    }
    if (t > Tmil - 0.15) k.pastilla(g, 540, 1160, "1.000", "", "255,210,90", al, 96);
  }

  // la hoja nueva, ya sin el nombre, entra y se va en el remate
  const entraHoja = k.suave(k.tramo(t, Tpila, Tpila + 0.4));
  const alHoja = entraHoja * (1 - hojaVieja);
  if (alHoja > 0.03 && t < f11.inicio) {
    g.save();
    g.globalAlpha = alHoja;
    g.translate(160 - hojaVieja * 640, 1240 + (1 - entraHoja) * 180);
    g.fillStyle = "#f4e6c8";
    g.fillRect(0, 0, 360, 220);
    g.fillStyle = "#1d7a3a";
    g.beginPath();
    g.ellipse(180, 120, 70, 46, 0, 0, 6.2832);
    g.fill();
    g.restore();
  }
}

function hoja(g, x, y, al) {
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 14;
  g.fillStyle = "#f6e7c4";
  k.redondo(g, -340, -420, 680, 840, 16);
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = "rgba(90,60,30,0.3)";
  g.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    const yy = -240 + i * 48;
    g.beginPath();
    g.moveTo(-260, yy);
    g.lineTo(260, yy);
    g.stroke();
  }
  g.restore();
}

function velaGrande(g, x, y, al, t) {
  const flama = 0.82 + 0.18 * Math.sin(t * 10);
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "#f4e2b0";
  k.redondo(g, -28, -70, 56, 150, 8);
  g.fill();
  g.fillStyle = "#e7c98a";
  g.fillRect(-28, 40, 56, 40);
  g.globalCompositeOperation = "lighter";
  g.globalAlpha *= flama;
  g.fillStyle = "#ffb020";
  g.beginPath();
  g.ellipse(0, -110, 18, 36, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#fff4c8";
  g.beginPath();
  g.ellipse(0, -102, 7, 16, 0, 0, 6.2832);
  g.fill();
  g.restore();
}

function velaTaller(g, t) {
  const flama = 0.8 + 0.2 * Math.sin(t * 11);
  g.save();
  g.translate(150, 1320);
  g.fillStyle = "#c9842a";
  g.fillRect(-16, 0, 32, 70);
  g.fillStyle = "#f3e2c0";
  g.fillRect(-28, -16, 56, 22);
  g.globalCompositeOperation = "lighter";
  g.globalAlpha = flama;
  g.fillStyle = "#ffb020";
  g.beginPath();
  g.ellipse(0, -48, 14, 28 * flama, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#fff1c0";
  g.beginPath();
  g.ellipse(0, -40, 6, 14, 0, 0, 6.2832);
  g.fill();
  g.restore();
}
