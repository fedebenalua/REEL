// «El tercero, la comida que tiras: planifica la compra y ahorras unos veintiún euros al mes por persona.»
// Un cubo de basura al que caen la lechuga, el pan, el tomate y la leche; cada uno suelta una moneda al caer dentro.
// En «planifica» el cubo se va y entra la lista de la compra con sus ticks; las monedas se quedan en una pila.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, fondo, velo, COL, moneda, pila } from "../mundo.js";

const F = v.frase(5);
export const desde = F.inicio;

const Tplan = F.t("planifica"), T21 = F.t("veintiun"), Tpers = F.t("persona");
const { tramo: tr, suave: su, entra, redondo, azar } = k;
const AC = COL.comida;

const cam = camino2D([[F.inicio, [1.0, 540, 1100]], [Tplan - 0.15, [1.0, 540, 1100]], [Tplan + 0.7, [1.03, 560, 1070]], [F.fin - 0.2, [1.03, 560, 1070]]]);

// ---------------------------------------------------------------- las cuatro comidas (en su sitio: centro en 0,0)
function lechuga(g) {
  for (let i = 0; i < 8; i++) {
    const a = i * 0.8, x = Math.cos(a) * 24, y = Math.sin(a) * 20;
    g.save(); g.translate(x, y); g.rotate(a);
    const gr = g.createRadialGradient(-8, -8, 4, 0, 0, 46); gr.addColorStop(0, i % 2 ? "#b8f0a0" : "#9be37c"); gr.addColorStop(1, i % 2 ? "#2f9e44" : "#37b24d");
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, 42, 34, 0, 0, 6.2832); g.fill();
    g.strokeStyle = "rgba(20,90,30,0.45)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-34, 0); g.lineTo(34, 0); g.stroke();
    g.restore();
  }
  const cg = g.createRadialGradient(-6, -6, 2, 0, 0, 30); cg.addColorStop(0, "#f2ffd9"); cg.addColorStop(1, "#8ad66a"); g.fillStyle = cg; g.beginPath(); g.arc(0, 0, 28, 0, 6.2832); g.fill();
}
function pan(g) {
  const gr = g.createLinearGradient(0, -48, 0, 48); gr.addColorStop(0, "#f0b26b"); gr.addColorStop(0.5, "#c47a2f"); gr.addColorStop(1, "#8a4f1a");
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, 82, 50, 0, 0, 6.2832); g.fill();
  g.strokeStyle = "#f7dcae"; g.lineWidth = 9; g.lineCap = "round";
  for (let i = -1; i <= 1; i++) { g.beginPath(); g.moveTo(i * 36 - 10, -26); g.lineTo(i * 36 + 14, 22); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.28)"; g.beginPath(); g.ellipse(-24, -26, 40, 11, -0.2, 0, 6.2832); g.fill();
}
function tomate(g) {
  const gr = g.createRadialGradient(-18, -20, 6, 0, 0, 62); gr.addColorStop(0, "#ff8c7a"); gr.addColorStop(0.5, "#e03131"); gr.addColorStop(1, "#8f1313");
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 4, 60, 54, 0, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(-22, -14, 16, 9, -0.7, 0, 6.2832); g.fill();
  g.fillStyle = "#2f9e44"; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 9 : 28; g.lineTo(r * Math.cos(a), -46 + r * Math.sin(a) * 0.55); } g.closePath(); g.fill();
}
function leche(g) {
  g.fillStyle = "#e9eef7"; g.beginPath(); g.moveTo(-36, -34); g.lineTo(36, -34); g.lineTo(36, 62); g.lineTo(-36, 62); g.closePath(); g.fill();
  const sg = g.createLinearGradient(-36, 0, 36, 0); sg.addColorStop(0, "rgba(0,0,0,0.0)"); sg.addColorStop(1, "rgba(30,50,90,0.25)"); g.fillStyle = sg; g.fillRect(-36, -34, 72, 96);
  g.fillStyle = "#f9fbff"; g.beginPath(); g.moveTo(-36, -34); g.lineTo(-24, -62); g.lineTo(24, -62); g.lineTo(36, -34); g.closePath(); g.fill();
  g.fillStyle = "#2f7de1"; g.fillRect(-36, -4, 72, 34);
  g.fillStyle = "#fff"; g.beginPath(); g.moveTo(0, 2); g.quadraticCurveTo(14, 16, 0, 26); g.quadraticCurveTo(-14, 16, 0, 2); g.fill();
  g.strokeStyle = "rgba(60,80,120,0.35)"; g.lineWidth = 2; g.strokeRect(-36, -34, 72, 96);
}
const COMIDAS = [lechuga, pan, tomate, leche];

// cuándo cae cada una dentro del cubo
const TIN = [F.inicio + 0.5, F.inicio + 0.88, F.inicio + 1.26, F.inicio + 1.64];
const DX = [-34, 28, -16, 30];
const G = 3200, BOCA = 905;

// ---------------------------------------------------------------- el cubo de basura
const BC = 540, BTOP = 905, BBOT = 1410, RXT = 240, RXB = 196, RYT = 52;
function cuboBasura(g, t, yOff, al) {
  g.save(); g.translate(0, yOff); g.globalAlpha = al;
  // sombra
  const sg = g.createRadialGradient(BC, BBOT + 10, 10, BC, BBOT + 10, 330); sg.addColorStop(0, "rgba(0,0,0,0.55)"); sg.addColorStop(1, "rgba(0,0,0,0)");
  g.save(); g.translate(0, BBOT + 10); g.scale(1, 0.16); g.translate(0, -(BBOT + 10)); g.fillStyle = sg; g.fillRect(BC - 360, BBOT - 340, 720, 700); g.restore();
  // la tapa abierta, detrás: un óvalo alto inclinado
  g.save(); g.translate(BC, BTOP - 150); g.rotate(-0.0);
  const lg = g.createLinearGradient(-RXT, 0, RXT, 0); lg.addColorStop(0, "#58657a"); lg.addColorStop(0.3, "#dfe7f2"); lg.addColorStop(0.7, "#8e9bb0"); lg.addColorStop(1, "#4a5568");
  g.beginPath(); g.ellipse(0, 0, RXT - 8, 128, 0, 0, 6.2832); g.fillStyle = lg; g.fill();
  g.strokeStyle = "rgba(255,255,255,0.45)"; g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, RXT - 22, 112, 0, 0, 6.2832); g.stroke();
  g.fillStyle = "#2d3646"; g.beginPath(); g.ellipse(0, 128, 28, 10, 0, 0, 6.2832); g.fill();
  g.restore();
  // el interior
  g.beginPath(); g.ellipse(BC, BTOP, RXT, RYT, 0, 0, 6.2832); g.fillStyle = "#05070b"; g.fill();
  g.restore();
}
function cuerpoBasura(g, t, yOff, al) {
  g.save(); g.translate(0, yOff); g.globalAlpha = al;
  g.beginPath(); g.moveTo(BC - RXT, BTOP); g.ellipse(BC, BTOP, RXT, RYT, 0, Math.PI, 0, true); g.lineTo(BC + RXB, BBOT); g.ellipse(BC, BBOT, RXB, 40, 0, 0, Math.PI, false); g.closePath();
  const mg = g.createLinearGradient(BC - RXT, 0, BC + RXT, 0);
  mg.addColorStop(0, "#3d495c"); mg.addColorStop(0.14, "#8896ab"); mg.addColorStop(0.32, "#e3eaf4"); mg.addColorStop(0.5, "#aab6c8"); mg.addColorStop(0.72, "#6a7a90"); mg.addColorStop(0.92, "#9aa8bc"); mg.addColorStop(1, "#2b3442");
  g.fillStyle = mg; g.fill();
  g.save(); g.clip();
  const vg = g.createLinearGradient(0, BTOP, 0, BBOT + 40); vg.addColorStop(0, "rgba(120,255,120,0.13)"); vg.addColorStop(0.3, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(2,4,8,0.5)");
  g.fillStyle = vg; g.fillRect(BC - RXT - 10, BTOP - 60, RXT * 2 + 20, BBOT - BTOP + 140);
  g.globalAlpha *= 0.06; g.fillStyle = "#fff"; for (let x = BC - RXT; x < BC + RXT; x += 9) g.fillRect(x + ((x * 7) % 5), BTOP, 1.5, BBOT - BTOP + 60);
  g.globalAlpha = al;
  // la moldura
  g.strokeStyle = "rgba(10,14,20,0.55)"; g.lineWidth = 14; g.beginPath(); g.ellipse(BC, 1330 + 8, 205, 42, 0, 0.02, Math.PI - 0.02); g.stroke();
  g.strokeStyle = "rgba(235,245,255,0.5)"; g.lineWidth = 5; g.beginPath(); g.ellipse(BC, 1330 - 2, 205, 42, 0, 0.02, Math.PI - 0.02); g.stroke();
  // reflejo largo
  const rg = g.createLinearGradient(0, BTOP, 0, BBOT); rg.addColorStop(0, "rgba(255,255,255,0.5)"); rg.addColorStop(1, "rgba(255,255,255,0.05)");
  g.fillStyle = rg; redondo(g, BC - 150, BTOP + 70, 22, 380, 11); g.fill();
  g.restore();
  // el icono de reciclar (un triángulo verde sencillo) en el cubo
  g.fillStyle = `rgba(${AC},0.8)`; g.beginPath(); g.moveTo(BC, 1015); g.lineTo(BC + 46, 1095); g.lineTo(BC - 46, 1095); g.closePath(); g.lineWidth = 0; g.globalAlpha = al * 0.0; g.fill(); g.globalAlpha = al;
  // el labio
  g.strokeStyle = "rgba(20,26,36,0.8)"; g.lineWidth = 20; g.beginPath(); g.ellipse(BC, BTOP + 5, RXT, RYT, 0, 0.01, Math.PI - 0.01); g.stroke();
  const ll = g.createLinearGradient(BC - RXT, 0, BC + RXT, 0); ll.addColorStop(0, "#6c7a8d"); ll.addColorStop(0.3, "#f3f8ff"); ll.addColorStop(0.55, "#aebdd0"); ll.addColorStop(0.85, "#e4edf8"); ll.addColorStop(1, "#5d6a7c");
  g.strokeStyle = ll; g.lineWidth = 13; g.beginPath(); g.ellipse(BC, BTOP, RXT, RYT, 0, 0, Math.PI); g.stroke();
  g.restore();
}

// ---------------------------------------------------------------- la lista de la compra
const LX = 385, LY = 1085, LW = 610, LH = 820;
function lista(g, t) {
  const u = entra(tr(t, Tplan + 0.05, Tplan + 0.7));
  if (u <= 0.001) return;
  g.save(); g.translate(LX + (1 - u) * 1100, LY); g.rotate(-0.05 + (1 - u) * 0.25);
  g.shadowColor = "rgba(0,0,0,0.55)"; g.shadowBlur = 50; g.shadowOffsetY = 24;
  redondo(g, -LW / 2, -LH / 2, LW, LH, 26);
  const pg = g.createLinearGradient(0, -LH / 2, 0, LH / 2); pg.addColorStop(0, "#fffdf3"); pg.addColorStop(1, "#ece6cf"); g.fillStyle = pg; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  // la franja verde de arriba y el título
  g.save(); redondo(g, -LW / 2, -LH / 2, LW, LH, 26); g.clip(); g.fillStyle = "#2f9e44"; g.fillRect(-LW / 2, -LH / 2, LW, 120); g.restore();
  g.fillStyle = "#fff"; g.font = "800 64px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("LA COMPRA", 0, -LH / 2 + 62);
  // las cuatro filas
  for (let i = 0; i < 4; i++) {
    const y = -LH / 2 + 235 + i * 158;
    g.save(); g.translate(-205, y); g.scale(0.86, 0.86); COMIDAS[i](g); g.restore();
    g.fillStyle = "rgba(90,100,120,0.28)"; redondo(g, -110, y - 8, 230, 16, 8); g.fill();
    // casilla y tick
    g.strokeStyle = "#8a93a6"; g.lineWidth = 6; redondo(g, 170, y - 38, 76, 76, 16); g.stroke();
    const tk = su(tr(t, Tplan + 0.5 + i * 0.26, Tplan + 0.5 + i * 0.26 + 0.22));
    if (tk > 0.001) {
      g.strokeStyle = "#2fb344"; g.lineWidth = 12; g.lineCap = "round"; g.lineJoin = "round";
      g.beginPath(); g.moveTo(180, y + 2); const p1 = Math.min(1, tk * 2), p2 = Math.max(0, tk * 2 - 1);
      g.lineTo(180 + 20 * p1, y + 2 + 22 * p1); if (p2 > 0) g.lineTo(200 + 34 * p2, y + 24 - 52 * p2); g.stroke();
    }
  }
  g.restore();
}

// una moneda que sale del cubo al caer la comida
function salto(g, t, i) {
  const u = t - TIN[i];
  if (u < 0) return;
  const az = azar(700 + i), sg = i % 2 ? 1 : -1;
  const vx = sg * (170 + az() * 150), vy = -1050 - az() * 250, gr = 3000;
  const x = 540 + DX[i] + vx * u, y = BOCA - 10 + vy * u + 0.5 * gr * u * u;
  if (y > 2100) return;
  k.brillo(g, x, y, 150, AC, 0.35);
  moneda(g, x, y, 46 * (1 + 0.6 * u), az() * 6.28 + u * 12);
}

export function dibuja(g, t) {
  fondo(g, AC, 1.5, 1050);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const sale = su(tr(t, Tplan - 0.05, Tplan + 0.6));
  const yOff = 900 * sale, al = 1 - su(tr(t, Tplan + 0.1, Tplan + 0.55));
  if (al > 0.01) {
    cuboBasura(g, t, yOff, al);
    // las comidas que caen (antes del cuerpo: al entrar, el cuerpo las tapa)
    g.save(); g.translate(0, yOff); g.globalAlpha = al;
    g.beginPath(); g.rect(-400, -2000, 2000, 2000 + BOCA + 8); g.clip();
    COMIDAS.forEach((f, i) => {
      const u = t - TIN[i];
      if (u > 0.5) return;
      const y = u < 0 ? BOCA - 0.5 * G * u * u : BOCA + 0.5 * G * u * u * 0.5;
      const x = 540 + DX[i] * (1 - Math.max(0, -u) * 0.0), ang = (i % 2 ? 1 : -1) * (0.3 + u * 4.0);
      g.save(); g.translate(x, y); g.rotate(ang); g.scale(1.25, 1.25); f(g); g.restore();
    });
    g.restore();
    cuerpoBasura(g, t, yOff, al);
  }
  for (let i = 0; i < 4; i++) { g.save(); g.translate(0, 0); salto(g, t, i); g.restore(); }
  // la pila de lo que se queda
  const tPila = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => Tplan + 1.25 + i * 0.24);
  lista(g, t);
  pila(g, 852, 1330, tPila, t, 96, 26);
  sinVista(g);
  velo(g, 0.62);
  const a = su(tr(t, T21 - 0.08, T21 + 0.2));
  k.pastilla(g, 540, 566, "−21", "€ al mes", "175,255,140", a, 100);
  const b = su(tr(t, Tpers - 0.06, Tpers + 0.18));
  if (b > 0.01) k.etiqueta(g, 540 - 150, 646, "por persona", "184,255,122", b, 46);
}
