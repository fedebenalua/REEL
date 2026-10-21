// «Nine million TVs listened to that click for twenty five years.»
// Una pared de teles. El número se queda. Luego el clic se vuelve luz violeta y hay que apuntarla.
// El haz se apaga antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { ORO, VIOLETA, anillos, comas, haz, tele, velo } from "../mundo.js";

export const desde = "nine";

const f7 = v.frase(7), f8 = v.frase(8);
const Tnine = f7.inicio, Tmillion = f7.t("million"), Tclick = f7.t("click"), Tfive = f7.t("five");
const Tthen = f8.t("then"), Tlight = f8.t("light"), Tpoint = f8.t("point");

const PUESTOS = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
  PUESTOS.push({ x: 200 + c * 340, y: 700 + r * 300, w: 280, h: 170, canal: (r * 3 + c) % 5 });
}
const CENTRO = 4;

export function dibuja(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#140c18"); fondo.addColorStop(1, "#07060c");
  g.fillStyle = fondo; g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 900, 900, "255,170,80", 0.12);

  const cuenta = k.suave(k.tramo(t, Tnine, Tmillion + 0.05)); // el número corre y se para
  const num = Math.round(cuenta * 9000000);
  const morph = k.suave(k.tramo(t, Tthen, Tlight + 0.15));
  const apunta = k.suave(k.tramo(t, Tpoint - 0.28, Tpoint + 0.22));
  const hazAl = k.suave(k.tramo(t, Tlight - 0.2, Tlight + 0.15)) * (1 - k.suave(k.tramo(t, Tpoint + 0.38, Tpoint + 0.7)));

  // las teles: al transformarse, las de alrededor se van y la del centro crece
  PUESTOS.forEach((p, i) => {
    const es = i === CENTRO;
    const fuera = es ? 0 : morph;
    const x = k.mez(p.x, es ? 520 : p.x + (p.x - 540) * 1.4, morph);
    const y = k.mez(p.y, es ? 780 : p.y + (p.y - 900) * 1.2, morph);
    const w = k.mez(p.w, es ? 760 : p.w, morph);
    const h = k.mez(p.h, es ? 440 : p.h, morph);
    const estilo = es ? morph : 0;
    let canal = p.canal;
    if (es && apunta > 0.85) canal = (p.canal + 1) % 5;
    g.save(); g.globalAlpha = 1 - fuera;
    tele(g, x, y, w, h, canal, estilo, t, 0);
    g.restore();
  });

  // el clic que salta de tele en tele
  const salto = k.tramo(t, Tclick - 0.35, Tclick + 0.85);
  if (salto > 0 && salto < 1 && morph < 0.2) {
    const i = Math.min(PUESTOS.length - 1, Math.floor(salto * PUESTOS.length));
    const p = PUESTOS[i];
    anillos(g, p.x, p.y, 90, ORO, 0.75, 2);
  }

  // 9,000,000 quieto desde «million»; luego 25 years
  const aNum = k.suave(k.tramo(t, Tnine + 0.12, Tnine + 0.4)) * (1 - k.suave(k.tramo(t, Tfive - 0.15, Tfive + 0.12)));
  if (aNum > 0.04 && morph < 0.35) k.pastilla(g, 540, 1280, comas(num), "", "255,220,140", aNum * (1 - morph), 86);
  const a25 = k.suave(k.tramo(t, Tfive - 0.08, Tfive + 0.2)) * (1 - k.suave(k.tramo(t, Tthen, Tthen + 0.35)));
  if (a25 > 0.04) k.pastilla(g, 540, 1280, "25", "years", "255,220,140", a25, 96);

  // el mando fino y el haz que hay que apuntar
  if (morph > 0.35) {
    const al = k.suave(k.tramo(morph, 0.35, 0.7));
    const ang = k.mez(-0.55, 0.08, apunta);
    const ox = 540, oy = 1360;
    // punta del mando según el ángulo (0 = hacia arriba)
    const punta = { x: ox + Math.sin(ang) * 210, y: oy - Math.cos(ang) * 250 };
    const sensor = { x: 520, y: 780 };
    const fallo = { x: 860, y: 460 };
    const fin = apunta > 0.5 ? sensor : { x: k.mez(fallo.x, sensor.x, apunta * 2), y: k.mez(fallo.y, sensor.y, apunta * 2) };
    if (hazAl > 0.02) haz(g, punta.x, punta.y, fin.x, fin.y, hazAl * al);
    g.save(); g.globalAlpha = al; g.translate(ox, oy); g.rotate(ang);
    // cuerpo fino
    k.redondo(g, -70, -250, 140, 500, 40);
    k.metal(g, -70, 70, ["#1c2128", "#b9c2ce", "#5e6772", "#eef2f6", "#12161c"]);
    g.fillStyle = apunta > 0.8 ? "#d7b4ff" : "#2a2434";
    g.beginPath(); g.arc(0, -160, 28, 0, 6.3); g.fill();
    g.fillStyle = "#e8edf3";
    g.beginPath(); g.arc(0, -40, 16, 0, 6.3); g.arc(0, 40, 16, 0, 6.3); g.fill();
    g.restore();
    g.fillStyle = apunta > 0.72 ? "#f2e6ff" : "#140c18";
    g.beginPath(); g.arc(sensor.x, sensor.y, 22, 0, 6.3); g.fill();
    g.strokeStyle = `rgba(${VIOLETA},0.9)`; g.lineWidth = 6;
    g.beginPath(); g.arc(sensor.x, sensor.y, 34, 0, 6.3); g.stroke();
    if (apunta > 0.72) k.brillo(g, sensor.x, sensor.y, 220, VIOLETA, hazAl);
  }

  velo(g, 0.68);
}
