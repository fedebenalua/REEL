// «¿Por qué tu cerebro borra casi todos tus sueños cuando despiertas?»
// Fotograma 0: pegados al pez, que ya nada. La cámara sale. En «borra» suelta vaho.
// En «despiertas» amanece la cama y se queda quieta.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, cuartoManana, koi, sinVista, velo, vista } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1);
const Tborra = f1.t("borra"), Tsue = f1.t("suenos"), Tdes = f1.t("despiertas");
const cam = camino2D([
  [0, [2.55, 980, 1120]],
  [Tborra, [1.25, 900, 1000]],
  [Tsue, [0.62, 820, 920]],
  [Tdes - 0.05, [0.52, 800, 980]],
]);

const az = k.azar(7);
const ESTRELLAS = Array.from({ length: 90 }, () => ({ x: az() * 2600 - 200, y: az() * 1800 + 80, s: 1.5 + az() * 2.8, f: az() * 6 }));
const VAHOS = Array.from({ length: 56 }, () => ({ u: az(), vy: -40 - az() * 90, vx: (az() - 0.5) * 50, s: 28 + az() * 70, f: az() * 6, retraso: az() * 0.35 }));
const RAYAS = Array.from({ length: 28 }, () => ({ y: 200 + az() * 1600, x0: az() * 2800, w: 90 + az() * 240, vel: 500 + az() * 900, a: 0.12 + az() * 0.28 }));

function cielo(g) {
  const bg = g.createLinearGradient(0, 0, 400, 1800);
  bg.addColorStop(0, "#24104a");
  bg.addColorStop(0.45, "#12082c");
  bg.addColorStop(1, "#071422");
  g.fillStyle = bg;
  g.fillRect(-400, -200, 3200, 2400);
  const glow = g.createRadialGradient(700, 500, 40, 700, 700, 900);
  glow.addColorStop(0, "rgba(255,120,160,0.28)");
  glow.addColorStop(0.5, "rgba(40,20,80,0.05)");
  glow.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = glow;
  g.fillRect(-400, -200, 3200, 2400);
}

function luna(g, t) {
  g.save();
  g.translate(280, 460);
  const r = 230;
  const lg = g.createRadialGradient(-40, -50, 20, 0, 0, r);
  lg.addColorStop(0, "#fff6d2");
  lg.addColorStop(0.6, "#ffd27a");
  lg.addColorStop(1, "#e8944a");
  g.fillStyle = lg;
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(200,120,60,0.28)";
  g.beginPath(); g.arc(-50, 20, 48, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(60, -30, 28, 0, 6.2832); g.fill();
  g.beginPath(); g.arc(30, 70, 36, 0, 6.2832); g.fill();
  g.restore();
  k.brillo(g, 280, 460, 700, "255,210,140", 0.45 + 0.05 * Math.sin(t));
}

function puerta(g, t) {
  g.save();
  g.translate(1680, 980);
  g.rotate(Math.sin(t * 0.7) * 0.04);
  g.fillStyle = "#14384a";
  k.redondo(g, -110, -280, 220, 520, 16); g.fill();
  const h = 8 + Math.sin(t * 2) * 4;
  g.fillStyle = "#7dfff0";
  g.fillRect(-8, -260, h, 480);
  k.brillo(g, 0, 0, 360, "120,255,230", 0.35);
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  cielo(g);
  vista(g, Z, cx, cy);
  for (const e of ESTRELLAS) {
    g.fillStyle = `rgba(255,244,220,${0.35 + 0.45 * Math.sin(t * 2 + e.f)})`;
    g.fillRect(e.x, e.y, e.s, e.s);
  }
  const racha = 1 - k.suave(k.tramo(t, 0.15, Tborra + 0.2));
  if (racha > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const r of RAYAS) {
      const x = ((r.x0 - t * r.vel) % 2800 + 2800) % 2800 - 200;
      g.fillStyle = `rgba(255,220,180,${r.a * racha})`;
      g.fillRect(x, r.y, r.w, 3);
    }
    g.restore();
  }
  luna(g, t);
  puerta(g, t);
  // escalones flotando
  g.save();
  for (let i = 0; i < 5; i++) {
    const y = 1280 + i * 70 + Math.sin(t * 1.4 + i) * 10;
    g.fillStyle = i % 2 ? "#ff7a8a" : "#ffd08a";
    g.globalAlpha = 0.9;
    k.redondo(g, 980 + i * 36, y, 180, 28, 8);
    g.fill();
  }
  g.restore();
  const px = 620 + t * 70;
  const py = 1040 + Math.sin(t * 1.3) * 18;
  const vapor = k.suave(k.tramo(t, Tborra, Tdes + 0.1));
  const pezAl = 1 - k.suave(k.tramo(t, Tsue - 0.05, Tdes + 0.02));
  k.brillo(g, px + 200, py, 900, "255,90,120", 0.45 * pezAl);
  koi(g, px, py, 1680, -0.06 + Math.sin(t * 1.5) * 0.03, t, pezAl);
  if (vapor > 0.01) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const p of VAHOS) {
      const vida = k.tramo(t, Tborra + p.retraso, Tdes + 0.35);
      if (vida <= 0) continue;
      const x = px - 200 + p.u * 1400 + p.vx * vida;
      const y = py + (p.u - 0.5) * 200 + p.vy * vida * 2;
      g.fillStyle = `rgba(255,236,220,${0.45 * (1 - vida) * vapor})`;
      g.beginPath(); g.arc(x, y, p.s * (0.6 + vida), 0, 6.2832); g.fill();
    }
    g.restore();
  }
  sinVista(g);
  const manana = k.suave(k.tramo(t, Tdes - 0.05, Tdes + 0.5));
  if (manana > 0.01) {
    g.save(); g.globalAlpha = manana;
    cuartoManana(g, t);
    g.restore();
  }
  const flash = Math.max(0, 1 - k.tramo(t, Tdes, Tdes + 0.35));
  if (flash > 0.02 && t >= Tdes - 0.02) {
    g.fillStyle = `rgba(255,246,230,${0.82 * flash})`;
    g.fillRect(0, 0, 1080, 1920);
  }
  velo(g, 0.72);
}
