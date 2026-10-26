// El salón y el perro son los de siempre. Aquí solo lo de este vídeo: el petardo, la galleta y el sofá por delante.
import * as k from "#kit";
import { polvo, velo, vineta, aPantalla } from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { azar, suave, tramo, mez } = k;

export const NOCHE = 2;
export const DIA = 0;
export const PX = 340;

export function cierra(g, al = 0.46) {
  velo(g, al);
  vineta(g, 0.26);
}

// Pies del perro en la pantalla (por debajo del subtítulo, por encima de los botones).
export const pies = (Z, sy = 1360) => (960 - sy) / Z;

// La ventana de salon(), en la baldosa de x = 0. El estallido sale de ahí.
export function ventana(c) {
  return aPantalla(c, 235, -205, 0.55);
}

export function quieto(t, fin) {
  return suave(tramo(t, fin - 0.34, fin - 0.14));
}

export function temblor(t, fuerte = 1) {
  return (Math.sin(t * 27) * 1.5 + Math.sin(t * 46) * 0.45) * fuerte;
}

// u de un estallido: 0 nace, ~0.35 está enorme, 1 ya se ha apagado.
export function avance(t, t0, dur = 0.92) {
  return (t - t0) / dur;
}

// Petardo de colores. Se apaga del todo al llegar a 1, para no cruzar un corte.
export function fuegos(g, x, y, u, semilla = 4, escala = 1) {
  if (u <= 0 || u >= 1) return;
  const az = azar(semilla);
  const crece = suave(Math.min(1, u / 0.38));
  const fade = u < 0.42 ? 1 : suave(1 - (u - 0.42) / 0.58);
  const colores = ["fuego", "amarilla", "violeta", "cian"];
  k.brillo(g, x, y, 820 * escala * (0.35 + crece), "blanca", fade * 0.85);
  k.brillo(g, x, y, 1500 * escala * crece, "fuego", fade * 0.55);
  for (let i = 0; i < 32; i++) {
    const a = az() * TAU;
    const v = (70 + az() * 340) * escala * crece;
    const px = x + Math.cos(a) * v;
    const py = y + Math.sin(a) * v * 0.72 + 30 * crece * crece * escala;
    k.brillo(g, px, py, (16 + az() * 34) * escala, colores[i % 4], fade * (0.45 + az() * 0.55));
  }
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(255,220,160,${0.55 * fade})`;
  g.lineWidth = 8 * escala * (1.2 - crece);
  g.beginPath();
  g.arc(x, y, 40 + 220 * escala * crece, 0, TAU);
  g.stroke();
  g.restore();
}

// Un trueno: un rayo blanco y un fogonazo frío. u de 0 a 1.
export function trueno(g, x, y, u) {
  if (u <= 0 || u >= 1) return;
  const fade = Math.exp(-u * 3.2);
  g.save();
  g.globalCompositeOperation = "lighter";
  g.strokeStyle = `rgba(235,245,255,${fade})`;
  g.lineWidth = 10 * (1 - u) + 2;
  g.lineCap = "round";
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(x - 20, y - 260);
  g.lineTo(x + 36, y - 120);
  g.lineTo(x - 8, y - 100);
  g.lineTo(x + 48, y + 20);
  g.stroke();
  g.restore();
  k.fogonazo(g, x, y - 40, u * 0.7, 980, "190,210,255");
  k.brillo(g, x, y - 80, 700, "blanca", fade * 0.7);
}

// Un disparo lejano: un fogonazo seco y corto, sin arma.
export function disparo(g, x, y, u) {
  if (u <= 0 || u >= 1) return;
  const fade = Math.exp(-u * 5);
  k.brillo(g, x, y, 420, "blanca", fade);
  k.fogonazo(g, x, y, u * 0.45, 520, "255,244,220");
}

export function tinte(g, u, color, al) {
  if (u <= 0 || u >= 1 || al <= 0) return;
  const a = al * (u < 0.3 ? u / 0.3 : suave(1 - (u - 0.3) / 0.7));
  g.save();
  g.globalCompositeOperation = "lighter";
  g.fillStyle = `rgba(${color},${a})`;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

export function cifra(g, x, y, texto, al = 1, color = "255,214,120") {
  if (al <= 0.02) return;
  k.pastilla(g, x, y, texto, "", color, al, 104);
}

// El frente del sofá, para que el perro se vea debajo. Mismos verdes que salon().
export function sofaTapa(g, x) {
  g.save();
  const gr = g.createLinearGradient(0, -100, 0, 4);
  gr.addColorStop(0, "#6fe0d0");
  gr.addColorStop(0.45, "#2aa396");
  gr.addColorStop(1, "#145f56");
  g.fillStyle = "#145f56";
  k.redondo(g, x + 8, -28, 16, 30, 4);
  g.fill();
  k.redondo(g, x + 230, -28, 16, 30, 4);
  g.fill();
  g.fillStyle = gr;
  k.redondo(g, x, -88, 260, 78, 22);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.2)";
  k.redondo(g, x + 16, -80, 228, 12, 6);
  g.fill();
  g.restore();
}

export function galleta(g, x, y, s = 1) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "rgba(40,20,8,0.25)";
  g.beginPath();
  g.ellipse(2, 10, 16, 4, 0, 0, TAU);
  g.fill();
  const gr = g.createRadialGradient(-5, -6, 1, 2, 2, 16);
  gr.addColorStop(0, "#ffe0a8");
  gr.addColorStop(0.45, "#e2a45a");
  gr.addColorStop(1, "#a86830");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(0, 0, 15, 10, 0.25, 0, TAU);
  g.fill();
  g.fillStyle = "#8d4e22";
  g.beginPath();
  g.arc(-4, -1, 2.1, 0, TAU);
  g.arc(5, 2, 1.6, 0, TAU);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.beginPath();
  g.ellipse(-5, -4, 4, 2, -0.5, 0, TAU);
  g.fill();
  g.restore();
}

// Manga roja y mano, para que se distinga del perro. El móvil va en la palma.
export function mano(g, x, y, ang = -0.6, s = 1) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  const manga = g.createLinearGradient(-12, 8, 12, 36);
  manga.addColorStop(0, "#ff8a6b");
  manga.addColorStop(1, "#a82c20");
  g.fillStyle = manga;
  k.redondo(g, -11, 6, 22, 34, 8);
  g.fill();
  const piel = g.createLinearGradient(-12, -20, 14, 10);
  piel.addColorStop(0, "#ffe0c4");
  piel.addColorStop(0.45, "#f0b08a");
  piel.addColorStop(1, "#c48460");
  g.fillStyle = piel;
  g.beginPath();
  g.ellipse(0, 2, 12, 9, 0, 0, TAU);
  g.fill();
  g.fillStyle = "rgba(255,236,214,0.55)";
  g.beginPath();
  g.ellipse(-4, -1, 5, 3, -0.4, 0, TAU);
  g.fill();
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(-8 + i * 5.2, -2);
    g.rotate((i - 1.5) * 0.07);
    g.fillStyle = piel;
    k.redondo(g, -2.3, -20, 4.8, 22, 2.3);
    g.fill();
    g.fillStyle = "rgba(255,250,245,0.8)";
    g.beginPath();
    g.ellipse(0, -18.2, 1.5, 1.1, 0, 0, TAU);
    g.fill();
    g.restore();
  }
  g.fillStyle = piel;
  g.beginPath();
  g.ellipse(-11, 2, 3.6, 7, 0.8, 0, TAU);
  g.fill();
  g.restore();
}

export function telefono(g, x, y, s = 1) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "#16181e";
  k.redondo(g, -8, -16, 16, 32, 3.5);
  g.fill();
  const sg = g.createLinearGradient(0, -12, 0, 12);
  sg.addColorStop(0, "#6eb6ff");
  sg.addColorStop(1, "#2a62c9");
  g.fillStyle = sg;
  k.redondo(g, -6, -12, 12, 22, 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.7)";
  g.fillRect(-4, -8, 8, 2);
  g.fillRect(-4, -4, 6, 2);
  g.restore();
}

export function cuenco(g, x) {
  g.save();
  g.translate(x, 0);
  g.fillStyle = "rgba(30,16,8,0.22)";
  g.beginPath();
  g.ellipse(0, 3, 24, 6, 0, 0, TAU);
  g.fill();
  const gr = g.createLinearGradient(-22, -30, 22, 4);
  gr.addColorStop(0, "#fff7ea");
  gr.addColorStop(0.5, "#f0d2a4");
  gr.addColorStop(1, "#c48a52");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(-24, -10);
  g.quadraticCurveTo(-26, 2, -14, 4);
  g.quadraticCurveTo(0, 10, 14, 4);
  g.quadraticCurveTo(26, 2, 24, -10);
  g.quadraticCurveTo(0, -4, -24, -10);
  g.fill();
  g.fillStyle = "#d89a45";
  for (const [dx, dy] of [[-6, -16], [3, -18], [9, -13], [0, -12]]) {
    g.beginPath();
    g.ellipse(dx, dy, 3.3, 2.2, 0.4, 0, TAU);
    g.fill();
  }
  g.restore();
}

export function polvoCorre(g, t, x, dir = 1) {
  const lista = [];
  for (let i = 0; i < 5; i++) lista.push({ t0: t - i * 0.16, x: x - dir * i * 26, k: 0.9, v: dir });
  polvo(g, t, lista, 0.55);
}
