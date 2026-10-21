// Lo que comparten los planos de este vídeo: el neón (tubos de luz con su halo) y el ojito de la tele, que es un ojo de
// verdad (carmín: el color de la luz infrarroja en todo el vídeo).
import * as k from "#kit";

const { redondo, suave: su, tramo: tr, mez } = k;
export const IR = "255,70,105";
export const CIAN = "60,230,255", ROSA = "255,70,200", AMARILLO = "255,226,90", VERDE = "90,255,150";

// Un tubo de neón: traza() construye el camino; se dibuja con su halo, su color y un núcleo blanco.
export function tubo(g, traza, col, w = 10, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = `rgba(${col},${0.14 * al})`; g.lineWidth = w * 5; traza(g); g.stroke();
  g.strokeStyle = `rgba(${col},${0.38 * al})`; g.lineWidth = w * 2.2; traza(g); g.stroke();
  g.strokeStyle = `rgba(${col},${0.95 * al})`; g.lineWidth = w; traza(g); g.stroke();
  g.strokeStyle = `rgba(255,255,255,${0.85 * al})`; g.lineWidth = Math.max(1.5, w * 0.34); traza(g); g.stroke();
  g.restore();
}
export const rect = (x, y, w, h, r = 0) => (g) => { g.beginPath(); if (r > 0) { g.roundRect ? g.roundRect(x, y, w, h, r) : g.rect(x, y, w, h); } else g.rect(x, y, w, h); };
export const circulo = (x, y, r) => (g) => { g.beginPath(); g.arc(x, y, r, 0, 6.2832); };
export const linea = (...pts) => (g) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); };

// El ojito. (x, y) es su centro y R la mitad de su ancho.
// abre: 0 cerrado, 1 abierto. mx, my: hacia dónde mira (-1 a 1). pupila: 0,25 a 0,8. luz: el brillo de su alrededor.
export function ojo(g, t, o = {}) {
  const { x = 0, y = 0, R = 100, abre = 1, mx = 0, my = 0, pupila = 0.5, luz = 1, flash = 0 } = o;
  if (abre <= 0.01 && luz <= 0.01) return;
  if (luz > 0.01) k.brillo(g, x, y, R * 3.2, IR, 0.75 * luz);
  g.save(); g.translate(x, y);
  const H = Math.max(0.02, abre);
  const almendra = () => { g.beginPath(); g.moveTo(-R, 0); g.bezierCurveTo(-R * 0.5, -R * 0.9 * H, R * 0.5, -R * 0.9 * H, R, 0); g.bezierCurveTo(R * 0.5, R * 0.75 * H, -R * 0.5, R * 0.75 * H, -R, 0); g.closePath(); };
  // la cuenca oscura
  almendra(); g.save(); g.lineWidth = R * 0.34; g.strokeStyle = "rgba(10,0,16,0.85)"; g.stroke(); g.restore();
  almendra(); const sg = g.createRadialGradient(0, -R * 0.1, R * 0.1, 0, 0, R * 1.05); sg.addColorStop(0, "#fffafb"); sg.addColorStop(0.7, "#f6c9d4"); sg.addColorStop(1, "#a8385a"); g.fillStyle = sg; g.fill();
  g.save(); almendra(); g.clip();
  const ix = mx * R * 0.34, iy = my * R * 0.2 * H, ri = R * 0.56;
  const ig = g.createRadialGradient(ix - ri * 0.2, iy - ri * 0.25, ri * 0.05, ix, iy, ri); ig.addColorStop(0, "#ffb0c0"); ig.addColorStop(0.45, "#ff3a66"); ig.addColorStop(0.85, "#a00c3c"); ig.addColorStop(1, "#38020f");
  g.beginPath(); g.arc(ix, iy, ri, 0, 6.2832); g.fillStyle = ig; g.fill();
  g.strokeStyle = "rgba(255,200,215,0.28)"; g.lineWidth = R * 0.012;
  for (let i = 0; i < 28; i++) { const a = (i / 28) * 6.2832; g.beginPath(); g.moveTo(ix + Math.cos(a) * ri * pupila * 1.2, iy + Math.sin(a) * ri * pupila * 1.2); g.lineTo(ix + Math.cos(a) * ri * 0.92, iy + Math.sin(a) * ri * 0.92); g.stroke(); }
  g.beginPath(); g.arc(ix, iy, ri * pupila, 0, 6.2832); g.fillStyle = "#12020a"; g.fill();
  if (flash > 0.01) { g.globalCompositeOperation = "lighter"; g.beginPath(); g.arc(ix, iy, ri, 0, 6.2832); g.fillStyle = `rgba(255,120,150,${0.55 * flash})`; g.fill(); g.globalCompositeOperation = "source-over"; }
  g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.ellipse(ix - ri * 0.3, iy - ri * 0.34, ri * 0.2, ri * 0.14, -0.6, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.6)"; g.beginPath(); g.arc(ix + ri * 0.28, iy + ri * 0.3, ri * 0.08, 0, 6.2832); g.fill();
  // la sombra del párpado de arriba
  const lg = g.createLinearGradient(0, -R * 0.9 * H, 0, R * 0.1); lg.addColorStop(0, "rgba(40,0,24,0.6)"); lg.addColorStop(0.5, "rgba(40,0,24,0)"); g.fillStyle = lg; g.fillRect(-R, -R, 2 * R, 2 * R);
  g.restore();
  // los párpados: un borde grueso y oscuro, con su filo de luz carmín
  almendra(); g.lineJoin = "round"; g.strokeStyle = "#16041c"; g.lineWidth = R * 0.085; g.stroke();
  almendra(); g.strokeStyle = `rgba(${IR},${0.55 + 0.4 * luz})`; g.lineWidth = R * 0.03; g.stroke();
  g.restore();
}
