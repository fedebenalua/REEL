// El mando de cerca, con sus cuatro botones de colores: lo comparten el principio, el remate y el final.
// Coordenadas del mundo: los botones, en fila, centrados en y = 0.
import * as k from "#kit";

const { azar, redondo, suave: su, tramo: tr, mez } = k;

export const X = [-360, -120, 120, 360], R = 105;
export const COL = ["R", "G", "Y", "B"];
const RGB = ["255,70,60", "50,255,110", "255,225,60", "80,120,255"];
const GRAD = [["#ffa090", "#e01818", "#6a0808"], ["#a0ffb4", "#18b848", "#085a20"], ["#fff6a0", "#e8bc14", "#7a5a06"], ["#a0b4ff", "#2a4ae0", "#0e1a6a"]];
export const rgb = (i) => RGB[i];

// La tela de araña: parte de un ancla y se abre en abanico hacia (dx, dy).
function tela(g, ax, ay, a0, a1, L, al) {
  if (al <= 0.01) return;
  g.save(); g.lineCap = "round"; g.strokeStyle = `rgba(235,235,245,${0.75 * al})`; g.lineWidth = 3;
  const N = 6, ang = (i) => mez(a0, a1, i / N);
  for (let i = 0; i <= N; i++) { g.beginPath(); g.moveTo(ax, ay); g.lineTo(ax + Math.cos(ang(i)) * L, ay + Math.sin(ang(i)) * L); g.stroke(); }
  for (let r = 1; r <= 6; r++) {
    const rr = (L * r) / 6; g.beginPath();
    for (let i = 0; i <= N; i++) { const x = ax + Math.cos(ang(i)) * rr, y = ay + Math.sin(ang(i)) * rr; if (i === 0) g.moveTo(x, y); else { const m = ang(i - 0.5), cx = ax + Math.cos(m) * rr * 0.86, cy = ay + Math.sin(m) * rr * 0.86; g.quadraticCurveTo(cx, cy, x, y); } }
    g.stroke();
  }
  g.restore();
}
function arana(g, x, y, topY, t) {
  g.save(); g.strokeStyle = "rgba(235,235,245,0.8)"; g.lineWidth = 3; g.beginPath(); g.moveTo(x, topY); g.lineTo(x, y); g.stroke();
  g.translate(x, y); g.rotate(0.12 * Math.sin(t * 3));
  g.strokeStyle = "#1a1220"; g.lineWidth = 5; g.lineCap = "round";
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const a = -0.9 + i * 0.5; g.beginPath(); g.moveTo(0, 0); g.lineTo(s * 34, -22 + i * 16 + 4 * Math.sin(t * 9 + i)); g.lineTo(s * 52, -2 + i * 22 + 8 * Math.sin(t * 9 + i)); g.stroke(); }
  g.fillStyle = "#1a1220"; g.beginPath(); g.ellipse(0, 6, 22, 26, 0, 0, 6.2832); g.fill(); g.beginPath(); g.arc(0, -16, 14, 0, 6.2832); g.fill();
  g.fillStyle = "#ff5a5a"; g.beginPath(); g.arc(-5, -19, 3.5, 0, 6.2832); g.arc(5, -19, 3.5, 0, 6.2832); g.fill();
  g.restore();
}

// o: lit[4] (0 a 1), bote[4] (0 a 1: el botón salta), polvo[4] (0 a 1), tela (0 a 1), arana: y o null, preg[4] (0 a 1: «?» que sube)
export function macro(g, t, o = {}) {
  const { aplasta = 0, lit = [1, 1, 1, 1], bote = [0, 0, 0, 0], polvo = [0, 0, 0, 0], web = 0, aranaY = null, preg = [0, 0, 0, 0], fondo = 1 } = o;
  // el mando: una losa oscura y brillante, con un círculo de flechas arriba y botones abajo, apenas insinuados
  if (fondo > 0.01) {
    g.save(); g.globalAlpha = fondo;
    const bg = g.createLinearGradient(0, -1200, 0, 1200); bg.addColorStop(0, "#14122e"); bg.addColorStop(0.5, "#0a0a1c"); bg.addColorStop(1, "#16122e"); g.fillStyle = bg; g.fillRect(-900, -1400, 1800, 2800);
    redondo(g, -520, -1300, 1040, 2600, 120); const mg = g.createLinearGradient(-520, 0, 520, 0); mg.addColorStop(0, "#0c0d16"); mg.addColorStop(0.2, "#2a2c44"); mg.addColorStop(0.5, "#14152a"); mg.addColorStop(1, "#0a0b14"); g.fillStyle = mg; g.fill();
    g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 4; redondo(g, -518, -1298, 1036, 2596, 118); g.stroke();
    // flechas y botones lejanos
    g.fillStyle = "rgba(60,64,96,0.8)"; g.beginPath(); g.arc(0, -620, 190, 0, 6.2832); g.fill(); g.fillStyle = "rgba(30,32,56,0.9)"; g.beginPath(); g.arc(0, -620, 80, 0, 6.2832); g.fill();
    for (const [bx, by] of [[-300, 480], [-100, 480], [100, 480], [300, 480], [-300, 640], [-100, 640], [100, 640], [300, 640]]) { g.fillStyle = "rgba(60,64,96,0.7)"; redondo(g, bx - 70, by - 44, 140, 88, 30); g.fill(); }
    // la placa de los cuatro botones
    redondo(g, -480, -165, 960, 330, 90); const pg = g.createLinearGradient(0, -165, 0, 165); pg.addColorStop(0, "#1c1e36"); pg.addColorStop(1, "#0c0d1a"); g.fillStyle = pg; g.fill(); g.strokeStyle = "rgba(255,255,255,0.16)"; g.lineWidth = 3; g.stroke();
    // la luz de cada botón se derrama sobre la placa
    g.save(); g.globalCompositeOperation = "lighter"; X.forEach((x, i) => { k.brillo(g, x, 0, 420, RGB[i], 0.5 * lit[i] * (1 - 0.6 * polvo[i])); k.brillo(g, x, 0, 900, RGB[i], 0.3 * lit[i] * (1 - 0.6 * polvo[i])); }); g.restore();
    g.restore();
  }
  // los botones
  X.forEach((x, i) => {
    const b = bote[i], s = 1 + 0.18 * b, dy = -26 * b;
    // la sombra y el aro
    g.save(); g.translate(x, 0);
    g.globalAlpha = 1 - aplasta;
    g.beginPath(); g.ellipse(0, 22, R * 1.12, R * 0.36, 0, 0, 6.2832); g.fillStyle = "rgba(0,0,0,0.55)"; g.fill();
    g.beginPath(); g.arc(0, 0, R * 1.08, 0, 6.2832); g.fillStyle = "#06060e"; g.fill(); g.strokeStyle = `rgba(${RGB[i]},${0.25 + 0.5 * lit[i]})`; g.lineWidth = 6; g.stroke();
    g.globalAlpha = 1;
    g.translate(0, dy); g.scale(s * mez(1, 1.14, aplasta), s * mez(1, 0.14, aplasta));
    if (lit[i] > 0.01) k.brillo(g, 0, 0, R * 3.2, RGB[i], 0.7 * lit[i] * (1 - 0.5 * polvo[i]));
    g.beginPath(); g.arc(0, 0, R, 0, 6.2832); const dg = g.createRadialGradient(-R * 0.3, -R * 0.38, R * 0.05, 0, 0, R * 1.05); dg.addColorStop(0, GRAD[i][0]); dg.addColorStop(0.55, GRAD[i][1]); dg.addColorStop(1, GRAD[i][2]); g.fillStyle = dg; g.fill();
    g.beginPath(); g.ellipse(-R * 0.3, -R * 0.45, R * 0.42, R * 0.2, -0.5, 0, 6.2832); g.fillStyle = "rgba(255,255,255,0.7)"; g.fill();
    g.beginPath(); g.arc(R * 0.3, R * 0.4, R * 0.1, 0, 6.2832); g.fillStyle = "rgba(255,255,255,0.35)"; g.fill();
    // el polvo: un velo gris y pelusa
    if (polvo[i] > 0.01) {
      const az = azar(70 + i);
      g.save(); g.beginPath(); g.arc(0, 0, R, 0, 6.2832); g.clip();
      g.fillStyle = `rgba(150,140,125,${0.62 * polvo[i]})`; g.fillRect(-R, -R, 2 * R, 2 * R);
      for (let j = 0; j < 90; j++) { const a = az() * 6.2832, d = Math.sqrt(az()) * R, rr = 5 + az() * 16; if (az() > polvo[i]) continue; g.fillStyle = `rgba(${200 + az() * 40},${195 + az() * 30},${180 + az() * 30},${0.55 * polvo[i]})`; g.beginPath(); g.arc(Math.cos(a) * d, Math.sin(a) * d, rr, 0, 6.2832); g.fill(); }
      g.restore();
    }
    g.restore();
    // las interrogaciones que suben
    if (preg[i] > 0.01) {
      const p = preg[i]; g.save(); g.globalAlpha = Math.sin(Math.min(1, p) * Math.PI) ** 0.6; g.font = "800 190px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
      g.shadowColor = `rgba(${RGB[i]},0.9)`; g.shadowBlur = 40; g.fillStyle = `rgb(${RGB[i]})`; g.fillText("?", x + 24 * Math.sin(p * 5 + i), -250 - 300 * p); g.shadowBlur = 0; g.fillStyle = "rgba(255,255,255,0.75)"; g.fillText("?", x + 24 * Math.sin(p * 5 + i), -250 - 300 * p); g.restore();
    }
  });
  // las telarañas y la araña
  if (web > 0.01) {
    tela(g, -540, -300, -0.05, 1.2, 760 * web, web); tela(g, 540, -300, Math.PI + 0.05, Math.PI - 1.2, 760 * web, web);
    tela(g, -540, 300, 0.05, -1.0, 640 * web, web * 0.9);
  }
  if (aranaY !== null) arana(g, 120, aranaY, -1400, t);
}
