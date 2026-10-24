// El depósito, de cerca, y la llave de la pared a su izquierda. Un solo sitio: la cámara viaja.
import * as k from "#kit";
import { PORCELANA, CROMO, GOMA, GOMA_VIEJA, LATON, gradH, gradV, bano, chorro, lamina, guante, arco, gota } from "./mundo.js";

export const TUBO_X = 210;
export const TUBO_TOP = -470;
export const FLAP = { x: 30, y: 36 };
export const TORNILLO = { x: -150, y: -610 };
export const VALV = { x: -640, y: 80 };

const GRIETAS = (() => {
  const a = k.azar(5);
  return Array.from({ length: 5 }, () => ({
    x: (a() - 0.5) * 70, y: (a() - 0.5) * 36, x2: (a() - 0.5) * 50, y2: (a() - 0.5) * 28,
  }));
})();

function flapper(g, x, y, esc, vieja, al, abierta) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y - abierta * 70);
  g.rotate(abierta * 0.9);
  g.scale(esc, esc * (1 - abierta * 0.15));
  g.globalAlpha *= al;
  g.beginPath();
  g.ellipse(0, 0, 92, 48, 0, 0, 6.28);
  g.fillStyle = gradH(g, -92, 92, vieja ? GOMA_VIEJA : GOMA);
  g.fill();
  g.fillStyle = vieja ? "rgba(255,180,140,0.18)" : "rgba(255,255,255,0.4)";
  g.beginPath();
  g.ellipse(-30, -12, 28, 12, -0.4, 0, 6.28);
  g.fill();
  if (vieja) {
    g.strokeStyle = "rgba(255,120,70,0.9)";
    g.lineWidth = 3;
    for (const c of GRIETAS) {
      g.beginPath();
      g.moveTo(c.x, c.y);
      g.lineTo(c.x2, c.y2);
      g.stroke();
    }
  }
  // orejas hacia el tubo
  g.fillStyle = vieja ? "#4a2c24" : "#b01812";
  g.beginPath();
  k.redondo(g, 70, -16, 36, 22, 8);
  g.fill();
  g.restore();
}

function cadena(g, x0, y0, x1, y1, sag) {
  const n = 9;
  g.strokeStyle = "#2c3844";
  g.lineWidth = 7;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const pan = Math.sin(Math.PI * u) * sag;
    const x = x0 + (x1 - x0) * u + pan * 0.85;
    const y = y0 + (y1 - y0) * u + pan * 0.45;
    g.beginPath();
    g.ellipse(x, y, 6, 9, 0.5, 0, 6.28);
    g.stroke();
  }
}

export function dibujaTanque(g, t, s) {
  bano(g, 640);
  // depósito
  g.beginPath();
  k.redondo(g, -340, -760, 760, 860, 42);
  g.fillStyle = gradH(g, -340, 420, PORCELANA);
  g.fill();
  g.save();
  g.beginPath();
  k.redondo(g, -340, -760, 760, 860, 42);
  g.clip();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-280, -760, 80, 860);
  g.restore();
  // interior
  g.beginPath();
  k.redondo(g, -280, -700, 640, 740, 26);
  g.fillStyle = gradV(g, -700, 40, [[0, "#e7f1f6"], [1, "#c5d5e2"]]);
  g.fill();

  // latiguillo desde la llave hasta el fondo de la válvula
  g.strokeStyle = "#cfd8e0";
  g.lineWidth = 22;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(VALV.x + 40, VALV.y);
  g.bezierCurveTo(-400, 200, -260, 80, -170, 40);
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.55)";
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(VALV.x + 34, VALV.y - 6);
  g.bezierCurveTo(-406, 190, -266, 72, -176, 34);
  g.stroke();
  // agua dentro del latiguillo
  if (s.flujo > 0.05) {
    g.save();
    g.globalAlpha = 0.85 * s.flujo;
    g.strokeStyle = "#3aa0f0";
    g.lineWidth = 8;
    g.setLineDash([16, 18]);
    g.lineDashOffset = -t * 80 * s.flujo;
    g.beginPath();
    g.moveTo(VALV.x + 40, VALV.y);
    g.bezierCurveTo(-400, 200, -260, 80, -170, 40);
    g.stroke();
    g.restore();
  }

  // válvula de llenado
  g.fillStyle = gradH(g, -206, -134, CROMO);
  g.fillRect(-200, -640, 70, 680);
  g.beginPath();
  g.ellipse(-165, -640, 36, 14, 0, 0, 6.28);
  g.fillStyle = gradH(g, -200, -130, CROMO);
  g.fill();
  // tornillo de nivel, arriba
  g.save();
  g.translate(TORNILLO.x, TORNILLO.y);
  g.rotate(s.tornillo || 0);
  g.beginPath();
  g.arc(0, 0, 34, 0, 6.28);
  g.fillStyle = gradH(g, -34, 34, LATON);
  g.fill();
  g.fillStyle = "#3a2508";
  g.fillRect(-18, -5, 36, 10);
  g.restore();

  // agua del depósito
  const sup = s.nivelY;
  if (sup < 20) lamina(g, -260, sup, 620, 30 - sup, t, 0.92);

  // flotador encima del agua, para que se vea dónde está
  const fy = s.floatY;
  g.beginPath();
  k.redondo(g, -248, fy, 170, 130, 30);
  g.fillStyle = gradH(g, -248, -78, [[0, "#d8e6f0"], [0.35, "#ffffff"], [1, "#8eacc0"]]);
  g.fill();
  g.strokeStyle = "rgba(20,40,60,0.45)";
  g.lineWidth = 4;
  g.stroke();

  // tubo de rebose, por encima del agua
  g.fillStyle = gradH(g, TUBO_X - 28, TUBO_X + 28, [[0, "#f7fbfd"], [0.5, "#d5e2ea"], [1, "#8fa4b4"]]);
  g.fillRect(TUBO_X - 26, TUBO_TOP, 52, 500);
  g.beginPath();
  g.ellipse(TUBO_X, TUBO_TOP, 28, 12, 0, 0, 6.28);
  g.fillStyle = "#0c2740";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 3;
  g.beginPath();
  g.ellipse(TUBO_X, TUBO_TOP, 28, 12, 0, 0, 6.28);
  g.stroke();

  // rebose: el agua entra por la boca
  if (s.rebose > 0.04) {
    chorro(g, TUBO_X - 10, sup - 10, TUBO_TOP + 8, 36 * s.rebose, t, s.rebose);
    // brillo dentro del tubo
    g.save();
    g.globalAlpha = 0.55 * s.rebose;
    g.fillStyle = "#7ec8ff";
    g.fillRect(TUBO_X - 10, TUBO_TOP + 8, 18, 200);
    g.restore();
  }

  // asiento de la goma (el agujero)
  g.beginPath();
  g.ellipse(FLAP.x, FLAP.y + 8, 100, 36, 0, 0, 6.28);
  g.fillStyle = "#10202c";
  g.fill();
  g.strokeStyle = gradH(g, FLAP.x - 100, FLAP.x + 100, CROMO);
  g.lineWidth = 10;
  g.stroke();

  // la fuga se dibuja después de la goma, para que el chorro quede por encima
  // chorro de llenado (el siseo)
  if (s.llenado > 0.04) {
    chorro(g, -120, -560, s.nivelY + 8, 16, t, s.llenado);
    g.save();
    g.globalAlpha = 0.7 * s.llenado;
    g.strokeStyle = "rgba(255,255,255,0.8)";
    g.lineWidth = 3;
    const vib = Math.sin(t * 40) * 4;
    g.beginPath();
    g.moveTo(-120, -580 + vib);
    g.lineTo(-96, -560);
    g.moveTo(-120, -560 + vib);
    g.lineTo(-92, -540);
    g.stroke();
    g.restore();
  }

  const viejaAl = s.vieja ?? 1;
  const nuevaAl = s.nueva ?? 0;
  flapper(g, FLAP.x, FLAP.y - (s.viejaY || 0), 1, true, viejaAl, s.abierta || 0);
  flapper(g, FLAP.x, FLAP.y + (1 - nuevaAl) * -160, 1, false, nuevaAl, 0);
  if (s.fuga > 0.04) {
    chorro(g, FLAP.x + 78, FLAP.y + 8, FLAP.y + 320, 64 * s.fuga, t, s.fuga);
    gota(g, FLAP.x + 120, FLAP.y + 180 + Math.sin(t * 9) * 16, 14, s.fuga, 1.3);
    gota(g, FLAP.x + 40, FLAP.y + 240 + Math.sin(t * 7) * 10, 11, s.fuga, 1.2);
  }

  // palanca y cadena
  g.strokeStyle = gradH(g, -280, -180, CROMO);
  g.lineWidth = 14;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-300, -560);
  g.lineTo(-120, -560 + (s.palanca || 0));
  g.stroke();
  if ((s.cadena ?? 1) > 0 && viejaAl > 0.4) {
    cadena(g, -110, -550 + (s.palanca || 0), FLAP.x + 20, FLAP.y - 30 - (s.viejaY || 0) - (s.abierta || 0) * 50, s.sag ?? 16);
  }
  if (nuevaAl > 0.8) {
    cadena(g, -110, -550, FLAP.x + 20, FLAP.y - 30, s.sagNueva ?? 18);
  }

  // aro de «el mismo tamaño»
  if ((s.aro ?? 0) > 0.02) {
    g.save();
    g.globalAlpha = s.aro;
    g.strokeStyle = "#b6ff6a";
    g.lineWidth = 6;
    g.beginPath();
    g.ellipse(FLAP.x, FLAP.y, 98, 50, 0, 0, 6.28);
    g.stroke();
    g.restore();
  }

  // marca de una pulgada bajo la boca
  if ((s.marca ?? 0) > 0.02) {
    const yMarca = TUBO_TOP + 78;
    g.save();
    g.globalAlpha = s.marca;
    g.strokeStyle = "#ffe14a";
    g.lineWidth = 4;
    g.setLineDash([8, 8]);
    g.beginPath();
    g.moveTo(TUBO_X + 40, TUBO_TOP);
    g.lineTo(TUBO_X + 40, yMarca);
    g.stroke();
    g.setLineDash([]);
    g.beginPath();
    g.moveTo(-200, yMarca);
    g.lineTo(TUBO_X + 70, yMarca);
    g.stroke();
    g.restore();
  }

  // llave de paso de la pared
  llave(g, VALV.x, VALV.y, s.giroLlave || 0, s.anilla || 0);

  if (s.guante) {
    const m = s.guante;
    guante(g, m.x, m.y, m.rot || 0, m.esc || 1, m.al ?? 1);
  }
  if (s.arco) arco(g, s.arco.x, s.arco.y, s.arco.r, s.arco.a0, s.arco.a1, s.arco.ccw, s.arco.al);
}

function llave(g, x, y, giro, anilla) {
  g.save();
  g.translate(x, y);
  // cuerpo
  g.beginPath();
  k.redondo(g, -46, -70, 92, 150, 20);
  g.fillStyle = gradH(g, -46, 46, CROMO);
  g.fill();
  g.beginPath();
  g.ellipse(0, -70, 34, 12, 0, 0, 6.28);
  g.fill();
  // volante
  g.save();
  g.rotate(giro);
  g.beginPath();
  g.arc(0, 0, 58, 0, 6.28);
  g.fillStyle = gradV(g, -58, 58, [[0, "#f7fbfe"], [0.5, "#c5d0da"], [1, "#6a7886"]]);
  g.fill();
  g.strokeStyle = "rgba(20,30,40,0.45)";
  g.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    g.rotate(Math.PI / 2);
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(0, -54);
    g.stroke();
  }
  if (anilla > 0.02) {
    g.globalAlpha *= anilla;
    g.strokeStyle = "#ff5a4a";
    g.lineWidth = 8;
    g.beginPath();
    g.arc(0, 0, 70, 0, 6.28);
    g.stroke();
  }
  g.restore();
  g.beginPath();
  g.arc(0, 0, 14, 0, 6.28);
  g.fillStyle = "#24303a";
  g.fill();
  g.restore();
}
