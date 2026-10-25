// «El cociente ni es de Binet. Lo calculó Stern en mil novecientos doce, y Terman lo extendió.
// Binet avisó: la inteligencia no es una cantidad fija, y la cifra no es un techo.»
// Las tareas arriba, las velas abajo. Stern las parte. 1912. Terman abre el libro. La luz sube al techo y el techo se agrieta.
import * as k from "#kit";
import { v } from "#voz";
import { cubo, llama, pizarra, tarjeta, velo } from "../mundo.js";

export const desde = "cociente";

const Tstern = v.t("stern");
const Tdoce = v.t("doce");
const Tter = v.t("terman");
const Text = v.t("extendio");
const Taviso = v.frase(10).t("aviso");
const Tfija = v.t("fija");
const Ttecho = v.t("techo");

function biblioteca(g) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#0c1024");
  h.addColorStop(0.55, "#1a2048");
  h.addColorStop(1, "#070812");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  // estantes
  g.fillStyle = "#3a2a18";
  for (const y of [620, 1500]) g.fillRect(40, y, 1000, 28);
  g.fillStyle = "#8c3a3a";
  g.fillRect(80, 470, 70, 150);
  g.fillStyle = "#245a48";
  g.fillRect(170, 500, 56, 120);
  g.fillStyle = "#c45a20";
  g.fillRect(250, 490, 64, 130);
  g.fillStyle = "#243868";
  g.fillRect(820, 480, 80, 140);
  g.fillStyle = "#e0b15a";
  g.fillRect(920, 510, 50, 110);
}

function velas(g, t, al) {
  g.save();
  g.globalAlpha *= al;
  const suben = k.entra(k.tramo(t, v.t("calculo") - 0.2, v.t("stern") + 0.15));
  for (let i = 0; i < 7; i++) {
    const x = 180 + i * 115;
    const y = k.mez(1680, 1240, suben);
    g.fillStyle = i % 2 ? "#f4e2c0" : "#f7c1d0";
    g.fillRect(x, y, 48, 200);
    llama(g, x + 24, y, 90, t, i);
  }
  g.restore();
}

function techo(g, t) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#6b5340");
  h.addColorStop(0.28, "#e7d7bc");
  h.addColorStop(0.5, "#f4ead8");
  h.addColorStop(1, "#b08968");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  // moldura
  g.strokeStyle = "#c4a574";
  g.lineWidth = 18;
  g.strokeRect(80, 560, 920, 900);
  const grieta = k.suave(k.tramo(t, Ttecho - 0.12, Ttecho + 0.45));
  // la cifra pintada, que se queda fija y luego se rompe
  g.save();
  g.globalAlpha *= 1 - grieta * 0.75;
  g.translate(540, 1080);
  const c = g.createRadialGradient(-40, -50, 10, 0, 0, 180);
  c.addColorStop(0, "#fff4c4");
  c.addColorStop(0.5, "#f0c14d");
  c.addColorStop(1, "#a56a12");
  g.beginPath();
  g.arc(0, 0, 180, 0, 6.3);
  g.fillStyle = c;
  g.fill();
  g.restore();
  if (grieta > 0.02) {
    g.strokeStyle = `rgba(40,20,10,${grieta})`;
    g.lineWidth = 8 + grieta * 10;
    g.beginPath();
    g.moveTo(540, 620);
    g.lineTo(500, 860);
    g.lineTo(580, 1100);
    g.lineTo(470, 1400);
    g.stroke();
    g.save();
    g.globalCompositeOperation = "lighter";
    k.brillo(g, 530, 1000, 400 * grieta, "blanca", grieta);
    g.restore();
    // planta que pasa
    const crece = k.entra(k.tramo(t, Ttecho, Ttecho + 0.55));
    g.fillStyle = "#2e8a44";
    g.beginPath();
    g.ellipse(540, 1280 - crece * 180, 40 + crece * 70, 24 + crece * 30, 0, 0, 6.3);
    g.fill();
    g.fillStyle = "#246b34";
    g.beginPath();
    g.ellipse(470, 1320 - crece * 80, 50, 22, -0.4, 0, 6.3);
    g.fill();
    g.beginPath();
    g.ellipse(620, 1300 - crece * 100, 46, 20, 0.5, 0, 6.3);
    g.fill();
    g.fillStyle = "#6b4a28";
    g.fillRect(528, 1240 - crece * 40, 18, 200);
  }
}

export function dibuja(g, t) {
  const sube = k.suave(k.tramo(t, Taviso - 0.05, Tfija - 0.4));
  if (sube < 0.999) {
    g.save();
    g.globalAlpha = 1 - sube;
    biblioteca(g);
    // tareas arriba de la raya
    const llegan = k.entra(k.tramo(t, v.t("cociente") - 0.05, v.frase(9).t("binet")));
    const yT = k.mez(420, 760, llegan);
    g.save();
    g.globalAlpha *= llegan;
    tarjeta(g, 240, yT, 120, 1);
    cubo(g, 500, yT, 70);
    cubo(g, 570, yT + 10, 62);
    pizarra(g, 820, yT, 100);
    g.restore();
    // raya de la fracción
    const raya = k.suave(k.tramo(t, Tstern - 0.25, Tstern + 0.2));
    g.strokeStyle = "#f0c14d";
    g.lineWidth = 14;
    g.beginPath();
    g.moveTo(k.mez(540, 180, raya), 1080);
    g.lineTo(k.mez(540, 900, raya), 1080);
    g.stroke();
    velas(g, t, k.suave(k.tramo(t, v.t("calculo") - 0.1, Tstern)));
    // 1912
    const alAnio = k.suave(k.tramo(t, Tdoce - 0.15, Tdoce + 0.25)) * (1 - k.suave(k.tramo(t, Tter, Tter + 0.4)));
    if (alAnio > 0.02) k.pastilla(g, 540, 1200, "1912", "", "255,214,120", alAnio, 92);
    // el libro de Terman se abre y la luz se extiende
    const abre = k.suave(k.tramo(t, Tter - 0.1, Text + 0.2));
    if (abre > 0.02) {
      g.save();
      g.globalAlpha *= abre;
      const w = k.mez(80, 900, abre);
      k.redondo(g, 540 - w / 2, 690, w, 520, 18);
      g.fillStyle = "#8d1d28";
      g.fill();
      k.redondo(g, 540 - w / 2 + 24, 714, w - 48, 472, 12);
      g.fillStyle = "#fff6e6";
      g.fill();
      g.restore();
      g.save();
      g.globalCompositeOperation = "lighter";
      k.brillo(g, 540, 960, 600 * abre, "amarilla", 0.4 * abre);
      g.restore();
    }
    g.restore();
  }
  if (sube > 0.001) {
    g.save();
    g.globalAlpha = sube;
    // el techo entra desde arriba
    g.translate(0, k.mez(-80, 0, sube));
    techo(g, t);
    g.restore();
  }
  velo(g, sube > 0.5 ? 0.55 : 0.72);
}
