// «El quinto, tu luz: uno de cada tres hogares paga por más potencia de la que usa, unos siete euros al mes.»
// Un dial enorme: lo que usas (verde) y lo que pagas de más (rosa a rayas, del que se escurren monedas). Antes, tres
// casas: una se enciende en rosa. En «usa» el tope se desliza hacia abajo, lo rosa se encoge y las monedas paran.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, chorro, fondo, velo, COL, moneda } from "../mundo.js";

const F = v.frase(7);
export const desde = F.inicio;

const Tuno = F.t("uno"), Tcada = F.t("cada"), Ttres = F.t("tres"), Tpotencia = F.t("potencia"), Tusa = F.t("usa"), Tsiete = F.t("siete");
const { tramo: tr, suave: su, entra, redondo, azar, pulso } = k;
const AC = COL.luz;
const CX = 540, CYD = 1250, R = 470;
const USO = 0.56;           // lo que usas de verdad
const TOPE0 = 1.0, TOPE1 = 0.64; // el tope: antes y después

const cam = camino2D([[F.inicio, [1.0, 540, 1150]], [Tusa - 0.35, [1.0, 540, 1150]], [Tusa + 0.35, [1.2, 740, 1030]], [F.fin - 0.4, [1.2, 740, 1030]]]);

const ang = (u) => Math.PI + u * Math.PI;
const pto = (u, r) => [CX + r * Math.cos(ang(u)), CYD + r * Math.sin(ang(u))];
const tope = (t) => TOPE0 + (TOPE1 - TOPE0) * su(tr(t, Tusa + 0.0, Tsiete + 0.1));

function casa(g, x, y, s, col, al) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha = al; g.translate(x, y); g.scale(s, s);
  const apagada = !col;
  const cuerpo = apagada ? ["#5b6b86", "#2c364a"] : ["#ff9fbc", "#d63a74"];
  g.beginPath(); g.moveTo(-54, -10); g.lineTo(0, -64); g.lineTo(54, -10); g.closePath();
  g.fillStyle = apagada ? "#3a4560" : "#7a1d46"; g.fill();
  const bg = g.createLinearGradient(0, -12, 0, 56); bg.addColorStop(0, cuerpo[0]); bg.addColorStop(1, cuerpo[1]);
  redondo(g, -44, -12, 88, 68, 6); g.fillStyle = bg; g.fill();
  g.fillStyle = apagada ? "#232c3f" : "#ffe9a0"; redondo(g, -30, 4, 26, 26, 4); g.fill(); redondo(g, 6, 10, 24, 46, 4); g.fill();
  if (!apagada) { g.restore(); k.brillo(g, x, y, 260 * s, AC, 0.6 * al); return; }
  g.restore();
}

function dial(g, t) {
  const tp = tope(t);
  // el hueco oscuro del dial
  g.beginPath(); g.arc(CX, CYD, R + 6, Math.PI, 2 * Math.PI); g.closePath();
  const fg = g.createRadialGradient(CX, CYD, 40, CX, CYD, R); fg.addColorStop(0, "#14223d"); fg.addColorStop(1, "#070c18"); g.fillStyle = fg; g.fill();
  // la parte verde (lo que usas)
  g.save(); g.lineCap = "butt";
  g.lineWidth = 96; g.strokeStyle = "#31d96b"; g.beginPath(); g.arc(CX, CYD, R - 60, ang(0), ang(USO)); g.stroke();
  // la parte rosa (lo que pagas de más), a rayas
  const pulsoRosa = 0.55 + 0.45 * su(tr(t, Tpotencia - 0.1, Tpotencia + 0.25)) + 0.25 * pulso(t, Tpotencia + 0.12, 0.2);
  g.strokeStyle = `rgba(${AC},1)`; g.beginPath(); g.arc(CX, CYD, R - 60, ang(USO), ang(tp)); g.stroke();
  g.save(); g.beginPath(); g.arc(CX, CYD, R - 12, ang(USO), ang(tp)); g.arc(CX, CYD, R - 108, ang(tp), ang(USO), true); g.closePath(); g.clip();
  g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 12;
  for (let x = -200; x < 1500; x += 44) { g.beginPath(); g.moveTo(x, CYD - R - 20); g.lineTo(x - 260, CYD + 20); g.stroke(); }
  g.restore();
  g.restore();
  // brillo de la zona rosa
  const [bx, by] = pto((USO + tp) / 2, R - 60);
  k.brillo(g, bx, by, 520 * (tp - USO) * 1.4, AC, 0.55 * pulsoRosa);
  const [gx, gy] = pto(USO / 2, R - 60);
  k.brillo(g, gx, gy, 520, "49,217,107", 0.25);
  // las marcas
  g.strokeStyle = "rgba(235,245,255,0.8)"; g.lineWidth = 5;
  for (let i = 0; i <= 20; i++) { const u = i / 20, [x0, y0] = pto(u, R - 112), [x1, y1] = pto(u, R - (i % 5 === 0 ? 140 : 128)); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  // el borde de acero
  const sg = g.createLinearGradient(CX - R, 0, CX + R, 0); sg.addColorStop(0, "#5a6577"); sg.addColorStop(0.3, "#e9f0f9"); sg.addColorStop(0.55, "#9aa7ba"); sg.addColorStop(0.8, "#dfe8f3"); sg.addColorStop(1, "#4a5566");
  g.lineWidth = 26; g.strokeStyle = sg; g.beginPath(); g.arc(CX, CYD, R + 18, Math.PI, 2 * Math.PI); g.stroke();
  g.beginPath(); g.moveTo(CX - R - 31, CYD + 14); g.lineTo(CX + R + 31, CYD + 14); g.lineWidth = 28; g.stroke();
  // el tope: una pestaña rosa que se desliza por fuera
  const [t0x, t0y] = pto(tp, R - 112), [t1x, t1y] = pto(tp, R + 52);
  g.save(); g.lineCap = "round"; g.strokeStyle = "rgba(10,12,20,0.7)"; g.lineWidth = 40; g.beginPath(); g.moveTo(t0x, t0y); g.lineTo(t1x, t1y); g.stroke();
  g.strokeStyle = "#ffe3ec"; g.lineWidth = 30; g.beginPath(); g.moveTo(t0x, t0y); g.lineTo(t1x, t1y); g.stroke();
  g.strokeStyle = `rgb(${AC})`; g.lineWidth = 18; g.beginPath(); g.moveTo(t0x, t0y); g.lineTo(t1x, t1y); g.stroke();
  g.restore();
  // la aguja: sube y baja un poco (lo que usas casi siempre es menos de lo contratado)
  const u = 0.42 + 0.06 * Math.sin(t * 1.7) * (1 - su(tr(t, Tsiete + 0.2, Tsiete + 0.6)) * 0.8);
  const [nx, ny] = pto(u, R - 96), a = ang(u);
  g.save(); g.translate(CX, CYD); g.rotate(a + Math.PI / 2);
  g.beginPath(); g.moveTo(-16, 0); g.lineTo(0, -(R - 96)); g.lineTo(16, 0); g.closePath();
  const ng = g.createLinearGradient(-16, 0, 16, 0); ng.addColorStop(0, "#ff7a8c"); ng.addColorStop(0.5, "#fff"); ng.addColorStop(1, "#ff7a8c"); g.fillStyle = ng; g.shadowColor = "rgba(255,255,255,0.7)"; g.shadowBlur = 20; g.fill();
  g.restore();
  // el centro con su rayo
  const cg = g.createRadialGradient(CX - 14, CYD - 14, 6, CX, CYD, 66); cg.addColorStop(0, "#f4f8ff"); cg.addColorStop(1, "#6a7689");
  g.beginPath(); g.arc(CX, CYD, 62, 0, 6.2832); g.fillStyle = cg; g.fill();
  g.fillStyle = "#ffcf33"; g.beginPath(); g.moveTo(CX + 6, CYD - 38); g.lineTo(CX - 24, CYD + 4); g.lineTo(CX - 4, CYD + 4); g.lineTo(CX - 12, CYD + 38); g.lineTo(CX + 24, CYD - 6); g.lineTo(CX + 3, CYD - 6); g.closePath(); g.fill();
  // el rótulo
  g.fillStyle = "rgba(255,255,255,0.8)"; g.font = "800 44px Figtree"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.fillText("kW", CX, CYD - 245);
}

export function dibuja(g, t) {
  fondo(g, AC, 1.5, 1050);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  g.save(); dial(g, t); g.restore();
  // las monedas que se escurren de lo rosa (lo que pagas y no usas): nacen en la zona rosa y caen
  const tp0 = tope(F.inicio);
  const env = (tn) => (0.45 + 0.55 * su(tr(tn, Tpotencia - 0.3, Tpotencia + 0.2))) * (1 - su(tr(tn, Tusa + 0.05, Tusa + 0.4)));
  for (let j = 0; j < 3; j++) {
    const u = USO + (TOPE0 - USO) * (0.25 + 0.25 * j), [x, y] = pto(u, R - 60);
    chorro(g, t, { x, y }, { semilla: 80 + j, rate: 8, r0: 34, env, centroX: CX, fuerza: 0.7, color: AC, crece: 0.8, gravedad: 3000 });
  }
  sinVista(g);
  g.textAlign = "left";
  // las tres casas: una de cada tres se enciende en rosa
  const hx = [330, 540, 750], hy = 600;
  hx.forEach((x, i) => {
    const t0 = [Tuno, Tcada + 0.0, Ttres][i] - 0.06, u = tr(t, t0, t0 + 0.3);
    const al = entra(u) * (1 - su(tr(t, Tpotencia + 0.1, Tpotencia + 0.45)));
    casa(g, x, hy - (1 - entra(u)) * 40, 1.0 + 0.05 * Math.sin(u * Math.PI), i === 0, al);
  });
  velo(g, 0.55);
  const a = su(tr(t, Tsiete - 0.08, Tsiete + 0.2));
  k.pastilla(g, 540, 1370, "−7", "€ al mes", "255,170,195", a, 100);
}
