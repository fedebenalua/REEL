// «Es como escribir en el vaho del espejo del baño: se ve, y en cuanto entra el día, desaparece.»
import * as k from "#kit";
import { v } from "#voz";
import { dedo, capa, koi, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(6).t("es");

const f = v.frase(6);
const Tvaho = f.t("vaho");
const Tve = f.t("ve");
const Tdia = f.t("dia");
const Tdes = f.t("desaparece");

const az = k.azar(12);
const VAPOR = Array.from({ length: 46 }, () => ({
  x: 180 + az() * 720, y: 560 + az() * 900, rx: 50 + az() * 90, ry: 30 + az() * 50, f: az() * 6,
}));

function lomo(u) {
  return [250 + u * 560, 1040 - Math.sin(u * Math.PI) * 180];
}
function tripa(u) {
  return [250 + u * 560, 1100 + Math.sin(u * Math.PI) * 90];
}

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#16343a");
  bg.addColorStop(0.4, "#0e242c");
  bg.addColorStop(1, "#1a3030");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  // azulejos
  g.strokeStyle = "rgba(180,230,220,0.18)";
  g.lineWidth = 4;
  for (let y = 500; y < 1800; y += 120) for (let x = 40; x < 1040; x += 160) {
    const c = ((x + y) / 40) % 2 ? "#1c4a4a" : "#145052";
    g.fillStyle = c;
    g.fillRect(x, y, 156, 116);
    g.strokeRect(x, y, 156, 116);
  }
  // marco
  g.fillStyle = "#d7c4a4";
  k.redondo(g, 120, 500, 840, 1080, 28); g.fill();
  // cristal
  const cr = g.createLinearGradient(160, 540, 900, 1500);
  cr.addColorStop(0, "#9fd0d4");
  cr.addColorStop(1, "#4e7c84");
  g.fillStyle = cr;
  k.redondo(g, 160, 540, 760, 1000, 12); g.fill();
  // reflejo del baño, tenue
  g.fillStyle = "rgba(255,255,255,0.08)";
  g.fillRect(220, 620, 200, 360);

  const queda = 1 - k.suave(k.tramo(t, Tdia - 0.05, Tdes + 0.15));
  const escrito = k.suave(k.tramo(t, Tvaho, Tve + 0.15));
  const cg = capa.getContext("2d");
  cg.setTransform(1, 0, 0, 1, 0, 0);
  cg.clearRect(0, 0, 1080, 1920);
  cg.globalCompositeOperation = "source-over";
  cg.globalAlpha = 1;
  for (const p of VAPOR) {
    const ox = Math.sin(t * 0.8 + p.f) * 8;
    const gr = cg.createRadialGradient(p.x + ox, p.y, 4, p.x + ox, p.y, p.rx);
    gr.addColorStop(0, "rgba(255,255,255,0.55)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    cg.fillStyle = gr;
    cg.beginPath(); cg.ellipse(p.x + ox, p.y, p.rx, p.ry, 0, 0, 6.2832); cg.fill();
  }
  // el dedo abre un surco en el vaho con la forma del pez
  if (escrito > 0.02) {
    cg.globalCompositeOperation = "destination-out";
    cg.lineCap = "round";
    cg.lineJoin = "round";
    cg.strokeStyle = "rgba(0,0,0,1)";
    cg.lineWidth = 28;
    const n = Math.max(2, Math.floor(escrito * 28));
    cg.beginPath();
    for (let i = 0; i <= n; i++) {
      const [x, y] = lomo(i / 28);
      if (i === 0) cg.moveTo(x, y); else cg.lineTo(x, y);
    }
    if (n > 6) for (let i = n; i >= 0; i--) cg.lineTo(...tripa(i / 28));
    cg.stroke();
  }
  g.save();
  g.globalAlpha = 0.92 * queda;
  g.drawImage(capa, 0, 0);
  g.restore();

  const u = Math.min(0.98, escrito);
  const [fx, fy] = lomo(Math.max(u, 0.5));
  const sopla = k.suave(k.tramo(t, Tdia - 0.05, Tdes));
  if (escrito > 0.15 && queda > 0.05) {
    koi(g, 520 + sopla * 280, 1080 - sopla * 160, 640, -0.1 + sopla * 0.8, t, escrito * queda);
  }
  if (escrito > 0.05 && escrito < 0.98 && queda > 0.45) dedo(g, fx - 40, fy + 10, -0.15);

  // la puerta, a la izquierda, se abre en «día»
  const abre = k.suave(k.tramo(t, Tdia - 0.1, Tdia + 0.55));
  g.save();
  g.translate(70, 1100);
  g.fillStyle = "#c4552a";
  g.fillRect(-40, -280, 36, 560);
  g.restore();
  if (abre > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const haz = g.createLinearGradient(40, 800, 700, 1200);
    haz.addColorStop(0, `rgba(255,220,160,${0.55 * abre})`);
    haz.addColorStop(1, "rgba(255,220,160,0)");
    g.fillStyle = haz;
    g.beginPath();
    g.moveTo(40, 860); g.lineTo(70, 820); g.lineTo(820, 1500); g.lineTo(200, 1680); g.closePath();
    g.fill();
    g.restore();
    k.brillo(g, 80, 1000, 400, "255,210,150", 0.35 * abre * (1 - k.suave(k.tramo(t, Tdes, Tdes + 0.4))));
  }
  velo(g, 0.42);
}
