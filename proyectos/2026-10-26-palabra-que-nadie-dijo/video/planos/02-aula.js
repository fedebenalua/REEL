// El aula: treinta y seis lámparas, cuatro cuadernos de cada diez, una hoja de cada siete.
import * as k from "#kit";
import { v } from "#voz";
import { ficha, luces, noche, suelo, velo } from "../mundo.js";

export const desde = "aula";

const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6);
const T36 = f4.t("treinta"), Tlist = f4.t("listas"), Tno = f4.t("no");
const T4 = f5.t("cuatro"), Tfal = f5.t("faltaba");
const Tcua = f6.t("cualquiera"), T7 = f6.t("siete");
const corte = v.t("reconocerlas") - 0.04;
const quieto = (t) => 1 - k.suave(k.tramo(t, corte - 0.38, corte - 0.14));

const camara = k.ruta([
  [f4.inicio - 0.2, { pos: [0, 1.05, 0.05], mira: [0, 0.05, 1.9] }],
  [Tlist, { pos: [0, 1.25, -0.15], mira: [0, 0.4, 2.5] }],
  [Tno, { pos: [0, 0.95, 0.25], mira: [0, 0.12, 2.0] }],
  [T4 - 0.1, { pos: [0, 1.35, -0.85], mira: [0, 0.05, 1.6] }],
  [corte + 0.4, { pos: [0, 1.35, -0.85], mira: [0, 0.05, 1.6] }],
]);

function pupitre(g, cam, x, z, on) {
  const y = -0.48;
  const P = [[x - 0.3, y, z], [x + 0.3, y, z], [x + 0.24, y + 0.05, z + 0.26], [x - 0.24, y + 0.05, z + 0.26]].map((p) => k.proyecta(cam, p));
  if (P.some((p) => !p)) return;
  g.beginPath();
  P.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)));
  g.closePath();
  g.fillStyle = on ? "#8a5a32" : "#3c2c24";
  g.fill();
  const respaldo = k.proyecta(cam, [x, y + 0.38, z + 0.22]);
  const base = k.proyecta(cam, [x, y + 0.08, z + 0.22]);
  if (respaldo && base) {
    g.strokeStyle = on ? "#c98448" : "#5a463c";
    g.lineWidth = 8;
    g.beginPath();
    g.moveTo(base.x, base.y);
    g.lineTo(respaldo.x, respaldo.y);
    g.stroke();
    k.redondo(g, respaldo.x - 16, respaldo.y - 22, 32, 28, 8);
    g.fillStyle = on ? "#e8c49a" : "#6a564c";
    g.fill();
  }
  if (on) {
    const L = k.proyecta(cam, [x, y + 0.55, z + 0.05]);
    if (L) k.brillo(g, L.x, L.y, Math.min(110, 280 / L.z), "255,186,100", 0.65);
  }
}

export function dibuja(g, t) {
  const cam = camara(t);
  const q = quieto(t);
  noche(g, 0.08);
  luces(g, cam, 0.35);
  suelo(g, cam, -0.7);

  const enciende = k.suave(k.tramo(t, T36 - 0.1, T36 + 1.15));
  for (let i = 0; i < 36; i++) {
    const col = i % 6, row = Math.floor(i / 6);
    const orden = (row * 6 + col) / 36;
    const on = enciende > orden;
    const x = (col - 2.5) * 0.78 + Math.sin(t * 0.8 + i) * 0.01 * q;
    const z = 1.05 + row * 0.62;
    pupitre(g, cam, x, z, on);
  }

  if (t > T36 + 0.35 && t < T4 - 0.15) k.pastilla(g, 540, 760, "36", "", "255,214,140", k.suave(k.tramo(t, T36 + 0.2, T36 + 0.55)) * (1 - k.suave(k.tramo(t, T4 - 0.45, T4 - 0.15))), 96);

  if (t > Tlist - 0.2 && t < T4 + 0.15) {
    const al = k.suave(k.tramo(t, Tlist - 0.15, Tlist + 0.35)) * (1 - k.suave(k.tramo(t, T4 - 0.2, T4 + 0.2)));
    ["CAMA", "DESCANSO", "DESPIERTO"].forEach((nombre, i) => {
      ficha(g, cam, [-0.7 + i * 0.7, 0.95, 2.5], nombre, { al, alto: 0.32, ancho: 2.3 });
    });
    const hueco = k.proyecta(cam, [0, 0.42, 2.35]);
    if (hueco) {
      g.save();
      g.globalAlpha *= al;
      k.redondo(g, hueco.x - 70, hueco.y - 28, 140, 56, 14);
      g.strokeStyle = "rgba(255,196,80,0.9)";
      g.lineWidth = 4;
      g.setLineDash([8, 8]);
      g.stroke();
      g.restore();
    }
    const tinta = k.tramo(t, Tlist + 0.4, Tno - 0.05);
    const vuelve = k.suave(k.tramo(t, Tno - 0.05, Tno + 0.45));
    const P = k.proyecta(cam, [0.15, 0.05, 1.7]);
    if (P && tinta > 0) {
      const largo = 180 * tinta * (1 - vuelve);
      g.strokeStyle = `rgba(255,186,64,${0.9 * (1 - vuelve)})`;
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(P.x - 40, P.y);
      g.lineTo(P.x - 40 + largo, P.y);
      g.stroke();
    }
  }

  const muestra10 = k.suave(k.tramo(t, T4 - 0.2, T4 + 0.2)) * (1 - k.suave(k.tramo(t, Tcua - 0.2, Tcua + 0.15)));
  if (muestra10 > 0.02) {
    g.save();
    g.globalAlpha *= 0.45 * muestra10;
    g.fillStyle = "#07040f";
    g.fillRect(0, 620, 1080, 900);
    g.restore();
    const sweep = (t * 0.7) % 1;
    k.brillo(g, 180 + sweep * 720, 980, 460, "255,196,80", 0.42 * muestra10);
    const w = 86, h = 132, hueco = 10, total = 10 * w + 9 * hueco, x0 = (1080 - total) / 2, y0 = 860;
    for (let i = 0; i < 10; i++) {
      const oro = i < 4 ? k.suave(k.tramo(t, T4 + i * 0.06, T4 + 0.28 + i * 0.06)) : 0;
      const x = x0 + i * (w + hueco);
      const y = y0 + Math.sin(t * 2.4 + i) * 22 * q;
      g.save();
      g.globalAlpha *= muestra10;
      k.redondo(g, x, y, w, h, 16);
      g.fillStyle = oro > 0.5 ? "#f0b44a" : "#d7e6fb";
      g.fill();
      if (oro > 0.45) k.brillo(g, x + w / 2, y + h / 2, 70, "255,186,64", 0.45);
      g.restore();
    }
    g.save();
    g.globalAlpha *= muestra10;
    g.font = "800 72px Figtree";
    g.textAlign = "center";
    g.fillStyle = "#ffd78a";
    g.fillText("DORMIR", 540, 780);
    g.restore();
    k.pastilla(g, 540, 1220, "4", "de 10", "255,196,80", muestra10 * k.suave(k.tramo(t, T4 + 0.4, T4 + 0.75)), 92);
  }

  const muestra7 = k.suave(k.tramo(t, Tcua - 0.05, Tcua + 0.3));
  if (muestra7 > 0.02) {
    g.save();
    g.globalAlpha *= 0.5 * muestra7;
    g.fillStyle = "#07040f";
    g.fillRect(0, 620, 1080, 900);
    g.restore();
    const w = 112, h = 156, hueco = 16, total = 7 * w + 6 * hueco, x0 = (1080 - total) / 2, y0 = 820;
    for (let i = 0; i < 7; i++) {
      const x = x0 + i * (w + hueco);
      const y = y0 + Math.sin(t * 1.3 + i) * 3 * q;
      g.save();
      g.globalAlpha *= muestra7;
      g.translate(x + w / 2, y + h / 2);
      g.rotate((i - 3) * 0.04);
      k.redondo(g, -w / 2, -h / 2, w, h, 14);
      g.fillStyle = "#f7f1e6";
      g.fill();
      g.strokeStyle = "rgba(120,90,60,0.4)";
      g.lineWidth = 2;
      for (let r = 0; r < 5; r++) {
        g.beginPath();
        g.moveTo(-w * 0.32, -h * 0.28 + r * 22);
        g.lineTo(w * 0.32, -h * 0.28 + r * 22);
        g.stroke();
      }
      if (i === 3) {
        const marca = k.suave(k.tramo(t, T7 - 0.05, T7 + 0.3));
        g.globalAlpha *= marca;
        g.strokeStyle = "#7d7d8a";
        g.lineWidth = 6;
        g.beginPath();
        g.moveTo(-28, 4);
        g.quadraticCurveTo(0, -24, 30, 8);
        g.quadraticCurveTo(6, 28, -8, 34);
        g.stroke();
      }
      g.restore();
    }
    k.pastilla(g, 540, 1220, "1", "de 7", "220,220,228", muestra7 * k.suave(k.tramo(t, T7 + 0.08, T7 + 0.35)), 92);
  }

  velo(g);
}
