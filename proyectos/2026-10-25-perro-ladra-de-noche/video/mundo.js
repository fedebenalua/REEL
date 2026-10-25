// El salón de noche, el pitido y la rata de la pared. El perro es el de perros/mundo.js.
import * as k from "#kit";
import {
  salon, ponVista, sinVista, velo, vineta, perro, perroFrente, persona, aPantalla,
} from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { suave, tramo, mez } = k;

export const PX = 430;
export const NOCHE = 2;
export { salon, ponVista, sinVista, velo, vineta, perro, perroFrente, persona, aPantalla };

export function rellena(g, al = 0.5) {
  velo(g, al);
  vineta(g, 0.3);
}

// Un ladrido: abre de golpe y cierra. En t = 0 ya va por la mitad, para que el primer fotograma no esté callado.
export function ladrido(t, cada = 0.36, fase = 0.14) {
  const u = ((t + fase) % cada) / cada;
  if (u < 0.28) return suave(u / 0.28);
  return suave(1 - (u - 0.28) / 0.72);
}

export function cara(g, x, t, o = {}) {
  const L = o.calla ? 0 : (o.ladra ?? ladrido(t, o.cada || 0.34, o.fase ?? 0.08));
  perroFrente(g, {
    x, y: o.y || 0, t, escala: o.escala || 1, cola: o.cola ?? 0.9, ladra: L,
    cabeza: {
      abre: L,
      oreja: 0.55,
      ojo: 0,
      ladea: (o.ladea || 0) + 0.05 * Math.sin(t * 2.4),
      mira: o.mira || 0,
      miraY: o.miraY || 0,
    },
  });
}

export function lado(g, x, t, o = {}) {
  const L = o.ladra ?? ladrido(t, o.cada || 0.36, o.fase ?? 0.05);
  return perro(g, {
    x, y: o.y || 0, t, dir: o.dir ?? 1, marcha: o.marcha || 0, fase: o.faseP || 0.2,
    cola: o.cola ?? 0.92, ladra: L, escala: o.escala || 1, pitch: o.pitch || 0,
    cabeza: { oreja: 0.3, ang: o.ang || -0.04, ojo: 0 },
  });
}

// La persona, entera, quieta, con la mano en la oreja: no oye nada.
export function dueno(g, x, t, o = {}) {
  const dir = o.dir ?? 1;
  persona(g, {
    recto: 1, x, dir, paso: 0, fase: 0.15, t,
    inclina: 0.03 * Math.sin(t * 1.3),
    mano: [x + dir * 8, -152],
    tira: o.oreja ?? 1,
  });
}

export function ondas(g, x, y, t, o = {}) {
  const n = o.n ?? 4, cada = o.cada ?? 0.48, R = o.radio ?? 48, f = o.fuerza ?? 1;
  if (f < 0.02) return;
  const col = o.color || "150,220,255";
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < n; i++) {
    const u = ((t * (o.vel || 1) + (i * cada) / n) % cada) / cada;
    g.globalAlpha = (1 - u) * (1 - u) * f * 0.95;
    g.strokeStyle = `rgba(${col},1)`;
    g.lineWidth = (o.grosor || 2.6) * (1.35 - 0.7 * u);
    g.beginPath();
    const r = 5 + u * R;
    g.ellipse(x, y, r, r * (o.ay || 0.66), o.rot || 0, 0, TAU);
    g.stroke();
  }
  g.restore();
}

// El pitido, una cinta de luz que avanza de x0 a x1.
export function cinta(g, x0, x1, y, t, f = 1) {
  if (f < 0.02 || x1 < x0 + 2) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  g.lineJoin = "round";
  const N = 36;
  const camino = (amp) => {
    g.beginPath();
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const x = x0 + (x1 - x0) * u;
      const yy = y + Math.sin(u * 16 - t * 12) * amp * (0.35 + 0.65 * u);
      if (i) g.lineTo(x, yy);
      else g.moveTo(x, yy);
    }
  };
  g.globalAlpha = 0.55 * f;
  g.strokeStyle = "rgba(120,190,255,0.9)";
  g.lineWidth = 14;
  camino(8);
  g.stroke();
  g.globalAlpha = 0.95 * f;
  g.strokeStyle = "rgba(236,250,255,0.95)";
  g.lineWidth = 3.2;
  camino(8);
  g.stroke();
  g.restore();
}

// Pared del pasillo. Si abierto, se ve el hueco donde vive la rata.
export function tabique(g, x, abierto = 0) {
  g.save();
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(x + 84, 6, 78, 10, 0, 0, TAU);
  g.fill();
  const gr = g.createLinearGradient(x, -220, x + 170, 0);
  gr.addColorStop(0, "#f4efe6");
  gr.addColorStop(0.18, "#e4dcd0");
  gr.addColorStop(0.72, "#b7ad9f");
  gr.addColorStop(1, "#6a6158");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(x, 0);
  g.lineTo(x + 18, -228);
  g.lineTo(x + 168, -228);
  g.lineTo(x + 150, 0);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fillRect(x + 22, -220, 10, 210);
  g.fillStyle = "#5c534c";
  g.fillRect(x + 6, -18, 148, 16);
  if (abierto > 0.02) {
    g.save();
    g.globalAlpha = abierto;
    g.fillStyle = "#24160f";
    k.redondo(g, x + 40, -176, 96, 92, 14);
    g.fill();
    const ig = g.createRadialGradient(x + 78, -150, 4, x + 88, -130, 70);
    ig.addColorStop(0, "rgba(255,176,90,0.55)");
    ig.addColorStop(1, "rgba(255,176,90,0)");
    g.fillStyle = ig;
    k.redondo(g, x + 40, -176, 96, 92, 14);
    g.fill();
    g.strokeStyle = "rgba(90,55,30,0.55)";
    g.lineWidth = 1.4;
    for (let i = 0; i < 4; i++) {
      g.beginPath();
      g.moveTo(x + 48, -166 + i * 20);
      g.lineTo(x + 126, -166 + i * 20);
      g.stroke();
    }
    g.restore();
  }
  g.restore();
}

export function rata(g, x, y, t, boca = 0.4, esc = 1) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath();
  g.ellipse(4, 10, 30, 6, 0, 0, TAU);
  g.fill();
  g.strokeStyle = "#e7a0b4";
  g.lineWidth = 3.4;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(16, -4);
  g.quadraticCurveTo(36, 2 + Math.sin(t * 5) * 3, 54, -18 + Math.sin(t * 4) * 2);
  g.stroke();
  const gr = g.createLinearGradient(-34, -28, 24, 8);
  gr.addColorStop(0, "#e6c49a");
  gr.addColorStop(0.4, "#a56b3c");
  gr.addColorStop(1, "#3a2416");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(2, -8, 28, 15, -0.15, 0, TAU);
  g.fill();
  g.fillStyle = "rgba(255,230,190,0.35)";
  g.beginPath();
  g.ellipse(-6, -14, 12, 6, -0.4, 0, TAU);
  g.fill();
  g.fillStyle = "#c47a6a";
  g.beginPath();
  g.ellipse(-6, -24, 9, 10, -0.5, 0, TAU);
  g.fill();
  g.fillStyle = "#f3c2ba";
  g.beginPath();
  g.ellipse(-6, -24, 5, 6, -0.5, 0, TAU);
  g.fill();
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(-20, -12, 13, 11, -0.1, 0, TAU);
  g.fill();
  g.fillStyle = "#1a100c";
  g.beginPath();
  g.arc(-24, -15, 2.4, 0, TAU);
  g.fill();
  g.fillStyle = "#fff";
  g.beginPath();
  g.arc(-24.8, -15.7, 0.8, 0, TAU);
  g.fill();
  g.fillStyle = "#f2b7c4";
  g.beginPath();
  g.arc(-31, -11, 2.6, 0, TAU);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.beginPath();
  g.ellipse(-31.6, -11.8, 0.8, 0.4, 0, 0, TAU);
  g.fill();
  if (boca > 0.04) {
    g.fillStyle = "#4a1822";
    g.beginPath();
    g.ellipse(-30, -7.5, 3.2, 1.3 + boca * 2.4, 0.2, 0, TAU);
    g.fill();
  }
  g.strokeStyle = "rgba(255,255,255,0.75)";
  g.lineWidth = 0.8;
  for (const s of [-1, 0, 1]) {
    g.beginPath();
    g.moveTo(-30, -11);
    g.lineTo(-46, -11 + s * 5);
    g.stroke();
  }
  g.fillStyle = "#f0c2ba";
  g.beginPath();
  g.ellipse(-10, 4, 6, 2.4, 0.2, 0, TAU);
  g.fill();
  g.beginPath();
  g.ellipse(10, 3, 6, 2.4, -0.1, 0, TAU);
  g.fill();
  g.strokeStyle = "rgba(90,40,30,0.7)";
  g.lineWidth = 0.7;
  for (const px of [-12, -8, 8, 12]) {
    g.beginPath();
    g.moveTo(px, 5);
    g.lineTo(px - 1, 8);
    g.stroke();
  }
  g.restore();
}

// La tele, lo que de día tapa el pitido. brillo 0 apagada, 1 a todo volumen.
export function tele(g, x, brillo) {
  const b = Math.max(0, Math.min(1, brillo));
  g.save();
  g.translate(x, 0);
  g.fillStyle = "rgba(0,0,0,0.25)";
  g.beginPath();
  g.ellipse(0, 4, 36, 7, 0, 0, TAU);
  g.fill();
  g.fillStyle = "#2a2830";
  k.redondo(g, -46, -128, 92, 70, 8);
  g.fill();
  const sg = g.createLinearGradient(-40, -120, 40, -64);
  sg.addColorStop(0, b > 0.2 ? "#ffe1a0" : "#1a1c28");
  sg.addColorStop(1, b > 0.2 ? "#ff8a3a" : "#12141c");
  g.fillStyle = sg;
  g.fillRect(-40, -122, 80, 56);
  g.fillStyle = "#3a3842";
  g.fillRect(-8, -58, 16, 22);
  g.fillRect(-28, -38, 56, 8);
  g.restore();
  if (b > 0.05) k.brillo(g, x, -96, 70 + 80 * b, "255,170,70", 0.35 + 0.6 * b);
}

export function cifra(g, c, x, y, texto, al = 1) {
  if (al < 0.03) return;
  sinVista(g);
  const [sx, sy] = aPantalla(c, x, y);
  const px = Math.max(220, Math.min(780, sx));
  const py = Math.max(620, Math.min(1280, sy));
  k.pastilla(g, px, py, texto, "", "190,230,255", al, 78);
}
