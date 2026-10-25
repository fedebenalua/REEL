// El salón, el parque y el perro son los de siempre. Aquí solo lo de este vídeo: la pelota, la cuerda anudada y la mano.
import * as k from "#kit";
import { polvo, velo, vineta } from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;

export function cierra(g, al = 0.5) {
  velo(g, al);
  vineta(g, 0.28);
}

// Pies del perro cerca de y=1360 en pantalla, con la persona entera y no gigante.
export const cyPies = (Z, sy = 1340) => (960 - sy) / Z;

export function sombra(g, x, ancho = 16, al = 0.28) {
  g.save();
  g.globalAlpha = al;
  g.fillStyle = "#1a2a10";
  g.beginPath();
  g.ellipse(x, 2, ancho, 3.6, 0, 0, TAU);
  g.fill();
  g.restore();
}

// Pelota de tenis, con volumen. s=1 tiene 12 cm de radio. El centro, en (x, y).
export function pelota(g, x, y, s = 1, rot = 0) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.rotate(rot);
  const gr = g.createRadialGradient(-4.2, -5, 1.5, 1.5, 2, 14);
  gr.addColorStop(0, "#f7f7a4");
  gr.addColorStop(0.42, "#d6e24a");
  gr.addColorStop(0.82, "#9aaa18");
  gr.addColorStop(1, "#6e7c10");
  g.fillStyle = gr;
  g.beginPath();
  g.arc(0, 0, 12, 0, TAU);
  g.fill();
  g.save();
  g.beginPath();
  g.arc(0, 0, 12, 0, TAU);
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.22;
  g.drawImage(k.manchas, -14, -14, 28, 28);
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.18;
  g.drawImage(k.red, -14, -16, 20, 16);
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.92)";
  g.lineWidth = 1.7;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, 0, 7.6, 0.35, Math.PI - 0.25);
  g.stroke();
  g.beginPath();
  g.arc(0, 0, 7.6, Math.PI + 0.45, TAU - 0.2);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.8)";
  g.beginPath();
  g.ellipse(-4.4, -4.8, 3.1, 1.8, -0.7, 0, TAU);
  g.fill();
  g.restore();
}

// La pelota apoyada en el suelo (el centro queda a su radio).
export function pelotaSuelo(g, x, s = 1, rot = 0) {
  sombra(g, x, 13 * s, 0.3);
  pelota(g, x, -12.2 * s, s, rot);
}

// Cuerda de cáñamo entre dos puntos, con un nudo en medio. tensa 0 cae, 1 va recta.
export function cuerda(g, ax, ay, bx, by, t = 0, tensa = 0.6) {
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const sag = (1 - tensa) * 22;
  const cx = mx, cy = my + sag;
  const vib = Math.sin(t * 14) * (0.6 + tensa * 1.4);
  g.save();
  g.lineCap = "round";
  g.lineJoin = "round";
  const trazo = (col, w, dx, dy) => {
    g.strokeStyle = col;
    g.lineWidth = w;
    g.beginPath();
    g.moveTo(ax + dx, ay + dy);
    g.quadraticCurveTo(cx + dx, cy + dy + vib, bx + dx, by + dy);
    g.stroke();
  };
  trazo("rgba(40,20,8,0.28)", 9, 0, 3);
  trazo("#6a3d18", 7.2, 0, 0.6);
  trazo("#c4843c", 5.2, 0, 0);
  trazo("rgba(255,214,150,0.7)", 1.7, 0, -1.3);
  // el nudo, con dos vueltas
  g.translate(cx, cy + vib * 0.4);
  g.rotate(0.4);
  const ng = g.createRadialGradient(-2, -2, 1, 0, 0, 9);
  ng.addColorStop(0, "#e2b06a");
  ng.addColorStop(0.55, "#b87a34");
  ng.addColorStop(1, "#6a3c16");
  g.fillStyle = ng;
  g.beginPath();
  g.ellipse(0, 0, 8.2, 6.2, 0, 0, TAU);
  g.fill();
  g.strokeStyle = "#8a5420";
  g.lineWidth = 2.2;
  g.beginPath();
  g.arc(-1.5, -0.5, 4.6, 0.2, 2.5);
  g.stroke();
  g.beginPath();
  g.arc(1.8, 0.8, 4.2, 2.4, 5.1);
  g.stroke();
  g.strokeStyle = "rgba(255,220,170,0.55)";
  g.lineWidth = 1.1;
  g.beginPath();
  g.arc(-1.2, -1.2, 3.2, 0.5, 1.8);
  g.stroke();
  g.restore();
}

// Una mano que entra a coger, sin el resto del cuerpo. abre 0 cerrada, 1 abierta.
export function mano(g, x, y, ang = -0.4, s = 1, abre = 0.55) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.save();
  g.globalAlpha = 0.22;
  g.fillStyle = "#2a140c";
  g.beginPath();
  g.ellipse(2, 8, 16, 4.2, 0.2, 0, TAU);
  g.fill();
  g.restore();
  const piel = (x0, y0, x1, y1) => {
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    gr.addColorStop(0, "#ffd3b0");
    gr.addColorStop(0.55, "#f0b08a");
    gr.addColorStop(1, "#c48460");
    return gr;
  };
  // muñeca y palma
  g.fillStyle = piel(-10, -6, 12, 18);
  k.redondo(g, -8, 4, 16, 16, 6);
  g.fill();
  g.beginPath();
  g.ellipse(0, 2, 11.5, 9, 0, 0, TAU);
  g.fill();
  g.fillStyle = "rgba(255,230,200,0.45)";
  g.beginPath();
  g.ellipse(-3, -1, 5, 3.2, -0.4, 0, TAU);
  g.fill();
  const dedos = [[-8.2, 15.5], [-3.1, 17.2], [2.2, 16.4], [7.2, 14.2]];
  dedos.forEach(([dx, largo], i) => {
    g.save();
    g.translate(dx, -1);
    g.rotate((i - 1.5) * 0.08);
    const L = largo + abre * 1.5;
    g.fillStyle = piel(-3, -L, 3, 0);
    k.redondo(g, -2.7, -L, 5.4, L + 2, 2.5);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.55)";
    g.beginPath();
    g.ellipse(0, -L + 2.2, 1.5, 1.1, 0, 0, TAU);
    g.fill();
    g.restore();
  });
  // pulgar
  g.save();
  g.translate(-11, 3);
  g.rotate(-0.9 + abre * 0.15);
  g.fillStyle = piel(-3, -12, 3, 2);
  k.redondo(g, -2.6, -13, 5.4, 14, 2.6);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)";
  g.beginPath();
  g.ellipse(0, -11, 1.4, 1, 0, 0, TAU);
  g.fill();
  g.restore();
  g.restore();
}

// Donde la boca agarra, un poco hacia el cuerpo desde la trufa.
export function enBoca(nariz, dir, bajo = 5) {
  return [nariz[0] - dir * 7, nariz[1] + bajo];
}

// Polvo de las pisadas, solo a partir de t. x es donde está el perro ahora.
export function polvoCorre(g, t, x, dir = 1, desde = 0) {
  const lista = [];
  for (let i = 0; i < 8; i++) {
    const az = k.azar(i * 19 + 5);
    lista.push({ t0: t - i * 0.08, x: x - dir * (10 + i * 14), k: 0.65 + az() * 0.55, v: dir });
  }
  if (t > desde) polvo(g, t, lista, 0.55);
}
