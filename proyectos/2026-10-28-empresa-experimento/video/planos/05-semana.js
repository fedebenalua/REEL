// «una semana de 2012, con 689.003 personas.»
import * as k from "#kit";
import { v } from "#voz";
import { sala, velo, telefono } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;

const { suave: su, tramo: tr, mez } = k;
const f6 = v.frase(6);
const Tsem = f6.t("semana"), Tano = f6.t("2012"), Tnum = f6.t("689003"), Tper = f6.t("personas");

export function dibuja(g, t) {
  sala(g, "#07101f", "#120c22", t);
  const llegaNum = su(tr(t, Tnum - 0.05, Tnum + 0.85));
  const calEn = 1 - llegaNum * 0.55;
  const barra = su(tr(t, Tsem, Tano + 0.35));

  // una multitud de móviles pequeños, detrás
  g.save();
  g.globalAlpha = 0.35 + 0.45 * llegaNum;
  for (let i = 0; i < 28; i++) {
    const col = i % 7, fil = Math.floor(i / 7);
    const x = 150 + col * 130 + Math.sin(t * 0.8 + i) * 4;
    const y = 780 + fil * 160 - llegaNum * 40;
    telefono(g, x, y, 70, 120, 0, (c, px, py, w, h) => {
      c.fillStyle = i % 2 ? "#14304a" : "#123528";
      c.fillRect(px, py, w, h);
    });
  }
  g.restore();

  // el calendario de esa semana
  g.save();
  g.translate(540, mez(1040, 690, llegaNum));
  g.scale(calEn, calEn);
  k.redondo(g, -400, -280, 800, 520, 36);
  const papel = g.createLinearGradient(-400, -280, 400, 240);
  papel.addColorStop(0, "#f4efe4");
  papel.addColorStop(1, "#e4d2b0");
  g.fillStyle = papel;
  g.fill();
  g.fillStyle = "#8a3a2a";
  k.redondo(g, -400, -280, 800, 90, 36);
  g.fill();
  g.fillRect(-400, -220, 800, 40);
  g.fillStyle = "#fff8ee";
  g.font = "800 42px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("ENERO  2012", 0, -235);
  g.fillStyle = "#2a241c";
  g.font = "800 120px Figtree";
  g.fillText("11", -180, 20);
  g.fillText("18", 180, 20);
  // la barra de la semana, de un día al otro
  g.strokeStyle = "#e0a030";
  g.lineWidth = 18;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-80, 20);
  g.lineTo(mez(-80, 80, barra), 20);
  g.stroke();
  g.restore();

  if (llegaNum > 0.02) {
    const cuenta = Math.round(mez(0, 689003, su(tr(t, Tnum, Tnum + 0.7))));
    const quieto = t > Tnum + 0.7;
    k.pastilla(g, 540, mez(1400, 1180, llegaNum), quieto ? "689.003" : k.fmt(cuenta), "", "255,214,120", llegaNum, 118);
  }
  // un latido muy lento del halo, ya parado el número
  const aliento = 0.12 + 0.04 * Math.sin(t * 1.4);
  if (t > Tper - 0.2) k.brillo(g, 540, 1180, 700, "255,200,90", aliento);
  velo(g, 0.8);
}
