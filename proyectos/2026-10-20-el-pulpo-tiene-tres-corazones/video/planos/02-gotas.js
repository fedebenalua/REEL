// «Nuestra sangre es roja por el hierro; la suya lleva cobre, como los cables de casa.»
// Otro sitio: una mesa de piedra oscura, con una luz cálida desde arriba a la izquierda. Se entra con un corte en
// «Nuestra». Una sola cámara.
// - «Nuestra sangre»: una gota roja enorme cae (ya cayendo en el primer fotograma) y se aplasta en la mesa en «roja»,
//   con su temblor y unas gotitas; la luz que pasa por ella pinta la mesa de rojo.
// - «por el hierro»: un clavo oxidado cae y rebota a su lado.
// - «la suya»: la cámara se aleja y se corre a la derecha; cae una gota azul al lado de la roja.
// - «lleva cobre, como los cables de casa»: entra deslizándose un cable de casa pelado, con sus hilos de cobre
//   brillantes; en «cables», un brillo recorre el cobre. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, velo } from "../mundo.js";

export const desde = "nuestra";

const { suave: su, tramo: tr, mez, entra, azar } = k;
const f = v.frase(5);
const T0 = f.inicio, Troj = f.t("roja"), Thie = f.t("hierro"), Tsuy = f.t("suya"), Tlle = f.t("lleva"), Tcob = f.t("cobre"), Tcab = f.t("cables"), Tcas = f.t("casa"), Fin = f.fin;

const BASE = 1190;                                    // dónde se apoyan las gotas
const ROJA = { x: 290, c: "200,18,32", cl: "255,110,110", co: "90,0,8", cae: T0 - 0.1, llega: Troj - 0.08, y0: 520 };
const AZUL = { x: 800, c: "30,105,230", cl: "130,200,255", co: "6,22,90", cae: Tsuy - 0.3, llega: Tlle + 0.02, y0: 100 };
const W = 450, H = 230;

const cam = camino2D([[T0, [1.15, 320, 880]], [Troj, [1.3, 320, 1030]], [Tsuy - 0.1, [1.3, 340, 1040]], [Tlle + 0.45, [1.0, 540, 1020]], [Fin, [1.0, 545, 1020]]]);

// la mesa y la pared
const marmol = k.tenir(k.ruido(512, 2323, 5, 5, "lineas"), "#bfa58c");
function mesa(g) {
  sinVista(g);
  g.fillStyle = "#0b0807"; g.fillRect(0, 0, 1080, 1920);
}
function suelo(g) {
  const sg = g.createLinearGradient(0, 760, 0, 1700);
  sg.addColorStop(0, "#2a211c"); sg.addColorStop(0.4, "#3b2e26"); sg.addColorStop(1, "#140f0c");
  g.fillStyle = sg; g.fillRect(-800, 760, 2700, 1400);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.55; g.drawImage(marmol, -800, 760, 2700, 1400); g.restore();
  g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = 0.12; g.drawImage(marmol, -700, 760, 2700, 1400); g.restore();
  // la pared, oscura, con la luz de la lámpara
  const pg = g.createLinearGradient(0, -400, 0, 780);
  pg.addColorStop(0, "#120c0a"); pg.addColorStop(1, "#2a1d16");
  g.fillStyle = pg; g.fillRect(-800, -600, 2700, 1380);
  const lg = g.createRadialGradient(240, 300, 50, 300, 700, 1300);
  lg.addColorStop(0, "rgba(255,200,140,0.35)"); lg.addColorStop(0.5, "rgba(255,170,110,0.1)"); lg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lg; g.fillRect(-800, -600, 2700, 2600);
  g.fillStyle = "rgba(255,210,170,0.25)"; g.fillRect(-800, 770, 2700, 3);
}

// Una gota: cayendo (lágrima) o apoyada (cúpula), con su temblor al llegar.
function gota(g, G, t) {
  if (t < G.cae) return;
  const u = tr(t, G.cae, G.llega);
  if (t < G.llega) {
    const y = mez(G.y0, BASE - 130, u * (0.6 + 0.4 * u)), r = 120;
    g.save();
    g.beginPath(); g.moveTo(G.x, y - r * 2.4);
    g.bezierCurveTo(G.x + r * 0.25, y - r * 1.4, G.x + r, y - r * 0.6, G.x + r, y);
    g.arc(G.x, y, r, 0, Math.PI); g.bezierCurveTo(G.x - r, y - r * 0.6, G.x - r * 0.25, y - r * 1.4, G.x, y - r * 2.4);
    const gr = g.createRadialGradient(G.x + r * 0.2, y + r * 0.2, r * 0.1, G.x, y, r * 1.4);
    gr.addColorStop(0, `rgb(${G.cl})`); gr.addColorStop(0.5, `rgb(${G.c})`); gr.addColorStop(1, `rgb(${G.co})`);
    g.fillStyle = gr; g.fill();
    g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(G.x - r * 0.45, y - r * 0.35, r * 0.2, r * 0.32, 0.4, 0, 6.2832); g.fill();
    g.restore();
    return;
  }
  // apoyada: se aplasta y tiembla un momento
  const d = t - G.llega, ab = entra(tr(d, 0, 0.16)), osc = Math.exp(-d * 6) * Math.cos(d * 22) * ab;
  const w = mez(240, W, ab) * (1 + 0.1 * osc), h = mez(300, H, ab) * (1 - 0.22 * osc), x = G.x, y = BASE;
  // la sombra y la luz que la atraviesa y cae en la mesa
  g.save();
  const sh = g.createRadialGradient(x + w * 0.25, y + 10, 10, x + w * 0.25, y + 10, w * 0.7);
  sh.addColorStop(0, "rgba(0,0,0,0.55)"); sh.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sh; g.beginPath(); g.ellipse(x + w * 0.25, y + 10, w * 0.75, h * 0.22, 0, 0, 6.2832); g.fill();
  g.restore();
  // las gotitas que saltan al llegar
  if (d < 0.7) {
    const az = azar(G.x);
    for (let i = 0; i < 12; i++) {
      const a = -Math.PI / 2 + (az() - 0.5) * 2.6, vv = 300 + az() * 500, r = 7 + az() * 10;
      const px = x + Math.cos(a) * vv * d * 1.2, py = y - h * 0.2 + Math.sin(a) * vv * d + 1600 * d * d;
      if (py > y + 10) continue;
      g.fillStyle = `rgba(${G.c},${1 - d / 0.7})`; g.beginPath(); g.arc(px, py, r, 0, 6.2832); g.fill();
      g.fillStyle = `rgba(255,255,255,${0.6 * (1 - d / 0.7)})`; g.beginPath(); g.arc(px - r * 0.3, py - r * 0.3, r * 0.3, 0, 6.2832); g.fill();
    }
  }
  k.brillo(g, x + w * 0.32, y + 16, w * 0.9, G.c, 0.7);
  k.brillo(g, x + w * 0.3, y + 14, w * 0.35, G.cl, 0.6);
  g.save();
  g.beginPath(); g.moveTo(x - w / 2, y);
  g.bezierCurveTo(x - w / 2 - w * 0.03, y - h * 0.72, x - w * 0.3, y - h, x, y - h);
  g.bezierCurveTo(x + w * 0.3, y - h, x + w / 2 + w * 0.03, y - h * 0.72, x + w / 2, y);
  g.ellipse(x, y, w / 2, h * 0.08, 0, 0, Math.PI);
  g.closePath();
  const gr = g.createRadialGradient(x + w * 0.1, y - h * 0.25, w * 0.04, x, y - h * 0.45, w * 0.62);
  gr.addColorStop(0, `rgb(${G.cl})`); gr.addColorStop(0.45, `rgb(${G.c})`); gr.addColorStop(1, `rgb(${G.co})`);
  g.fillStyle = gr; g.fill();
  g.save(); g.clip();
  g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.07; g.drawImage(k.causticas, x - w * 0.6, y - h * 1.1, w * 1.2, h * 1.2);
  // la luz que se concentra abajo, al otro lado de la lámpara, y el borde más oscuro
  g.globalAlpha = 1; k.brillo(g, x + w * 0.18, y - h * 0.12, w * 0.7, G.cl, 0.55);
  const eg = g.createRadialGradient(x, y - h * 0.4, w * 0.3, x, y - h * 0.4, w * 0.6); eg.addColorStop(0, "rgba(0,0,0,0)"); eg.addColorStop(1, `rgba(${G.co},0.6)`);
  g.globalCompositeOperation = "source-over"; g.fillStyle = eg; g.fillRect(x - w, y - h * 1.2, w * 2, h * 1.4);
  g.restore();
  g.strokeStyle = `rgba(${G.co},0.9)`; g.lineWidth = 5; g.stroke();
  // los reflejos de la lámpara
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(x - w * 0.2, y - h * 0.72, w * 0.13, h * 0.08, -0.5, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.arc(x - w * 0.26, y - h * 0.76, w * 0.025, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.ellipse(x + w * 0.28, y - h * 0.3, w * 0.05, h * 0.2, 0.4, 0, 6.2832); g.fill();
  g.restore();
}

// El clavo oxidado: cae en «hierro» y rebota, tumbado delante de la gota roja.
const oxido = k.tenir(k.ruido(256, 4545, 7, 4, "manchas"), "#b4501c");
function clavo(g, t) {
  const Tl = Thie - 0.02;
  if (t < Tl - 0.45) return;
  const u = tr(t, Tl - 0.45, Tl), d = Math.max(0, t - Tl);
  const bote = t < Tl ? 0 : Math.abs(Math.sin(d * 9)) * 60 * Math.exp(-d * 5);
  const y = t < Tl ? mez(BASE - 1300, BASE + 170, u * u) : BASE + 170 - bote;
  const x = 300, ang = t < Tl ? -0.9 + u * 0.75 : -0.12 + 0.06 * Math.sin(d * 12) * Math.exp(-d * 5), L = 480, R = 21;
  g.save(); g.translate(x, y); g.rotate(ang);
  // sombra
  g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.ellipse(10, 24 + bote * 0.3, L * 0.55, 14, 0, 0, 6.2832); g.fill();
  // el cuerpo, de hierro, con su punta
  g.beginPath(); g.moveTo(-L / 2, -R); g.lineTo(L / 2 - 40, -R); g.lineTo(L / 2 + 20, 0); g.lineTo(L / 2 - 40, R); g.lineTo(-L / 2, R); g.closePath();
  const mg = g.createLinearGradient(0, -R, 0, R);
  mg.addColorStop(0, "#3a3430"); mg.addColorStop(0.3, "#b3a79c"); mg.addColorStop(0.55, "#6a5f58"); mg.addColorStop(1, "#1f1a17");
  g.fillStyle = mg; g.fill();
  g.save(); g.clip(); g.globalAlpha = 0.85; g.drawImage(oxido, -L / 2, -R * 3, L, R * 6); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(k.manchas, -L / 2, -R * 3, L, R * 6); g.restore();
  // la cabeza
  g.beginPath(); g.ellipse(-L / 2, 0, 15, 48, 0, 0, 6.2832);
  const hg = g.createLinearGradient(0, -38, 0, 38); hg.addColorStop(0, "#c46a32"); hg.addColorStop(0.4, "#8a3e16"); hg.addColorStop(1, "#2a1206");
  g.fillStyle = hg; g.fill();
  g.restore();
}

// El cable de casa: la funda gris, y tres cables de colores que acaban en sus hilos de cobre pelados.
const HILOS = [{ c: ["#5a3418", "#9a6038", "#3a200e"], dy: -26 }, { c: ["#16408a", "#3d7fe0", "#0c2454"], dy: 0 }, { c: ["#6a7a14", "#d8d040", "#3e480a"], dy: 26 }];
const COBRE = ["#5a2608", "#ffcf9a", "#c8682a", "#ffe6c4", "#6a300e"];
function cable(g, t) {
  const u = entra(tr(t, Tcob - 0.3, Tcob + 0.35));
  if (u <= 0) return;
  const xf = mez(1500, 600, u), y = BASE + 175;           // xf: donde acaba el cobre
  const brilla = k.tramo(t, Tcab - 0.1, Tcas + 0.25);
  g.save(); g.translate(xf, y); g.scale(1.35, 1.35); g.translate(-xf, -y);
  g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.ellipse(xf + 500, y + 50, 620, 18, 0, 0, 6.2832); g.fill();
  // la funda
  const xFunda = xf + 230;
  g.beginPath(); k.redondo(g, xFunda, y - 46, 900, 92, 30);
  const fg = g.createLinearGradient(0, y - 46, 0, y + 46);
  fg.addColorStop(0, "#8c8c88"); fg.addColorStop(0.3, "#f2f2ee"); fg.addColorStop(0.7, "#c8c8c2"); fg.addColorStop(1, "#5c5c58");
  g.fillStyle = fg; g.fill();
  // los tres cables y su cobre
  for (const h of HILOS) {
    const yy = y + h.dy, xa = xf + 90;
    g.beginPath(); k.redondo(g, xa, yy - 12, xFunda - xa + 20, 24, 12);
    const hg = g.createLinearGradient(0, yy - 12, 0, yy + 12); hg.addColorStop(0, h.c[0]); hg.addColorStop(0.35, h.c[1]); hg.addColorStop(1, h.c[2]);
    g.fillStyle = hg; g.fill();
    // los hilos de cobre, retorcidos y abiertos en la punta
    for (let s = 0; s < 7; s++) {
      const a = (s - 3) * 0.05;
      g.save(); g.translate(xa + 4, yy); g.rotate(Math.PI + a);
      g.beginPath(); k.redondo(g, 0, -4, 100, 8, 4);
      const cg = g.createLinearGradient(0, -4, 0, 4); COBRE.forEach((c, i) => cg.addColorStop(i / 4, c));
      g.fillStyle = cg; g.fill();
      g.restore();
    }
    // el brillo que recorre el cobre
    if (brilla > 0 && brilla < 1) k.brillo(g, mez(xa + 10, xa - 100, brilla), yy, 150, "255,190,120", Math.sin(Math.PI * brilla));
    k.brillo(g, xa - 50, yy - 3, 120, "255,170,90", 0.25);
  }
  g.restore();
}

export function dibuja(g, t) {
  mesa(g);
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  suelo(g);
  clavo(g, t);
  gota(g, ROJA, t);
  gota(g, AZUL, t);
  cable(g, t);
  sinVista(g);
  const vg = g.createRadialGradient(540, 1000, 500, 540, 1000, 1300);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,0.6)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  velo(g, 0.35);
}

export const momentos = { roja: ROJA.llega, clavo: Thie - 0.02, azul: AZUL.llega, cable: Tcob };
