// Lo que comparten los planos: el mismo móvil, el mismo muro, la misma moneda.
import * as k from "#kit";

const { redondo, azar } = k;

const azC = azar(4408);
export const CARTAS = Array.from({ length: 12 }, () => ({
  alegre: azC() > 0.52,
  w1: 0.42 + azC() * 0.4,
  w2: 0.28 + azC() * 0.34,
  sem: azC(),
}));

export function sala(g, arriba, abajo, t) {
  const grd = g.createLinearGradient(0, 0, 200, 1920);
  grd.addColorStop(0, arriba);
  grd.addColorStop(1, abajo);
  g.fillStyle = grd;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  const n = 5;
  for (let i = 0; i < n; i++) {
    const x = 180 + i * 190, y = 700 + Math.sin(t * 0.35 + i) * 30;
    const r = 280, gr = g.createRadialGradient(x, y, 0, x, y, r);
    const col = i % 2 ? "40,90,255" : "40,200,140";
    gr.addColorStop(0, `rgba(${col},0.07)`);
    gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr;
    g.beginPath();
    g.arc(x, y, r, 0, 6.2832);
    g.fill();
  }
  g.restore();
}

export function velo(g, fuerza = 0.78) {
  const vg = g.createLinearGradient(0, 0, 0, 620);
  vg.addColorStop(0, `rgba(4,7,14,${fuerza})`);
  vg.addColorStop(0.55, `rgba(4,7,14,${fuerza * 0.45})`);
  vg.addColorStop(1, "rgba(4,7,14,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 640);
}

export function sol(g, x, y, r) {
  g.save();
  g.translate(x, y);
  g.fillStyle = "#fff4c8";
  g.beginPath();
  g.arc(0, 0, r * 0.42, 0, 6.2832);
  g.fill();
  g.strokeStyle = "#ffe08a";
  g.lineWidth = Math.max(2, r * 0.12);
  g.lineCap = "round";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 6.2832;
    g.beginPath();
    g.moveTo(Math.cos(a) * r * 0.58, Math.sin(a) * r * 0.58);
    g.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    g.stroke();
  }
  g.restore();
}

export function carta(g, x, y, w, h, alegre) {
  const r = Math.min(18, h * 0.22);
  redondo(g, x, y, w, h, r);
  if (alegre) {
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, "#ffe7a8");
    gr.addColorStop(1, "#f0a43a");
    g.fillStyle = gr;
  } else {
    const gr = g.createLinearGradient(x, y, x, y + h);
    gr.addColorStop(0, "#4a5c7c");
    gr.addColorStop(1, "#2e3d58");
    g.fillStyle = gr;
  }
  g.fill();
  const barra = alegre ? "rgba(120,60,10,0.35)" : "rgba(180,200,230,0.28)";
  g.fillStyle = barra;
  redondo(g, x + w * 0.08, y + h * 0.22, w * 0.55, h * 0.16, 6);
  g.fill();
  redondo(g, x + w * 0.08, y + h * 0.5, w * 0.38, h * 0.13, 5);
  g.fill();
  if (alegre) sol(g, x + w * 0.84, y + h * 0.48, Math.min(w, h) * 0.28);
}

// Muro dentro de un rect ya recortado. ocultar: 0 se ven las alegres, 1 se han ido a la derecha.
export function muro(g, x, y, w, h, t, tono, ocultar = 0) {
  const fondo = g.createLinearGradient(x, y, x, y + h);
  fondo.addColorStop(0, tono === "verde" ? "#0c241c" : "#10182e");
  fondo.addColorStop(1, tono === "verde" ? "#07140f" : "#0a1020");
  g.fillStyle = fondo;
  g.fillRect(x, y, w, h);
  const ch = h * 0.16, gap = h * 0.025, paso = ch + gap;
  const scroll = Math.max(0, t) * 70;
  const shift = ((scroll % paso) + paso) % paso;
  const base = Math.floor(scroll / paso);
  for (let i = -2; i < 9; i++) {
    const c = CARTAS[(((base + i) % CARTAS.length) + CARTAS.length) % CARTAS.length];
    const cy = y + h * 0.06 + i * paso - shift;
    if (cy > y + h || cy + ch < y) continue;
    const seVa = c.alegre ? ocultar : 0;
    const dy = -seVa * (h * 0.75 + i * 12);
    g.save();
    g.globalAlpha = 1 - seVa * 0.92;
    carta(g, x + w * 0.08, cy + dy, w * 0.84, ch, c.alegre);
    g.restore();
  }
}

export function boton(g, x, y, w, h, rgb, fuerza = 1) {
  const r = h / 2;
  g.save();
  g.translate(x, y);
  const gr = g.createLinearGradient(0, -h / 2, 0, h / 2);
  const [R, G, B] = rgb.split(",").map(Number);
  gr.addColorStop(0, `rgb(${Math.min(255, R + 50)},${Math.min(255, G + 40)},${Math.min(255, B + 30)})`);
  gr.addColorStop(1, `rgb(${R * 0.7},${G * 0.7},${B * 0.75})`);
  redondo(g, -w / 2, -h / 2, w, h, r);
  g.fillStyle = gr;
  g.fill();
  g.globalCompositeOperation = "screen";
  const br = g.createLinearGradient(-w / 2, -h / 2, w / 2, 0);
  br.addColorStop(0, `rgba(255,255,255,${0.35 * fuerza})`);
  br.addColorStop(0.5, "rgba(255,255,255,0)");
  g.fillStyle = br;
  redondo(g, -w / 2, -h / 2, w, h * 0.55, r);
  g.fill();
  g.restore();
}

export function telefono(g, cx, cy, w, h, ang, pintar) {
  g.save();
  g.translate(cx, cy);
  g.rotate(ang);
  g.fillStyle = "rgba(0,0,0,0.38)";
  g.beginPath();
  g.ellipse(0, h * 0.5, w * 0.38, h * 0.045, 0, 0, 6.2832);
  g.fill();
  const rr = Math.min(w, h) * 0.13;
  redondo(g, -w / 2, -h / 2, w, h, rr);
  const metal = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  metal.addColorStop(0, "#9aa6bb");
  metal.addColorStop(0.18, "#3c465c");
  metal.addColorStop(0.45, "#d5deee");
  metal.addColorStop(0.62, "#6e7a90");
  metal.addColorStop(1, "#1a2030");
  g.fillStyle = metal;
  g.fill();
  const m = w * 0.055, sw = w - m * 2, sh = h - m * 2;
  g.save();
  redondo(g, -sw / 2, -sh / 2, sw, sh, rr * 0.72);
  g.clip();
  pintar(g, -sw / 2, -sh / 2, sw, sh);
  const vig = g.createRadialGradient(0, sh * 0.05, sw * 0.2, 0, 0, sw * 0.95);
  vig.addColorStop(0, "rgba(0,0,0,0)");
  vig.addColorStop(1, "rgba(0,0,0,0.38)");
  g.fillStyle = vig;
  g.fillRect(-sw / 2, -sh / 2, sw, sh);
  g.globalCompositeOperation = "screen";
  const sheen = g.createLinearGradient(-sw / 2, -sh / 2, sw * 0.4, sh * 0.3);
  sheen.addColorStop(0, "rgba(255,255,255,0.2)");
  sheen.addColorStop(0.35, "rgba(255,255,255,0)");
  g.fillStyle = sheen;
  g.fillRect(-sw / 2, -sh / 2, sw, sh);
  g.restore();
  redondo(g, -w * 0.11, -sh / 2 + h * 0.012, w * 0.22, h * 0.026, h * 0.013);
  g.fillStyle = "#07090e";
  g.fill();
  g.restore();
}

export function pantallaConBoton(g, x, y, w, h, t, tono, pulso = 1) {
  muro(g, x, y, w, h, t, tono, 0);
  const bw = w * 0.72, bh = h * 0.11;
  const bx = x + w / 2, by = y + h * 0.78;
  g.save();
  g.globalAlpha = 0.92;
  boton(g, bx, by, bw * (0.96 + 0.04 * pulso), bh * (0.96 + 0.04 * pulso), tono === "verde" ? "40,210,120" : "50,130,255", pulso);
  g.restore();
}

export function moneda(g, x, y, r, ang, rgb) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.beginPath();
  g.ellipse(0, r * 0.08, r * 0.92, r * 0.92, 0, 0, 6.2832);
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.fill();
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
  const [R, G, B] = rgb.split(",").map(Number);
  gr.addColorStop(0, `rgb(${Math.min(255, R + 80)},${Math.min(255, G + 80)},${Math.min(255, B + 40)})`);
  gr.addColorStop(0.7, `rgb(${R},${G},${B})`);
  gr.addColorStop(1, `rgb(${R * 0.45},${G * 0.45},${B * 0.5})`);
  g.beginPath();
  g.arc(0, 0, r, 0, 6.2832);
  g.fillStyle = gr;
  g.fill();
  g.lineWidth = r * 0.08;
  g.strokeStyle = `rgba(255,255,255,0.55)`;
  g.beginPath();
  g.arc(0, 0, r * 0.78, 0, 6.2832);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.9)";
  g.beginPath();
  g.arc(0, -r * 0.12, r * 0.22, 0, 6.2832);
  g.fill();
  redondo(g, -r * 0.28, r * 0.16, r * 0.56, r * 0.32, r * 0.16);
  g.fill();
  g.restore();
}

// x,y es la yema, apoyada. El dedo baja desde arriba.
export function dedo(g, x, y, escala, aplasta = 0) {
  g.save();
  g.translate(x, y);
  g.scale(escala, escala * (1 - 0.12 * aplasta));
  const piel = g.createLinearGradient(-20, -300, 30, 10);
  piel.addColorStop(0, "#f3b089");
  piel.addColorStop(0.4, "#ffd2b0");
  piel.addColorStop(1, "#e09a70");
  g.fillStyle = piel;
  redondo(g, -58, -340, 116, 360, 58);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.28)";
  redondo(g, -30, -300, 36, 120, 18);
  g.fill();
  const una = g.createLinearGradient(0, -20, 0, 36);
  una.addColorStop(0, "#fff6ee");
  una.addColorStop(1, "#e7b498");
  g.fillStyle = una;
  redondo(g, -40, -28, 80, 58, 26);
  g.fill();
  g.restore();
}

export function lupa(g, x, y, r, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.strokeStyle = "#d7dee8";
  g.lineWidth = r * 0.16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(r * 0.7, r * 0.7);
  g.lineTo(r * 1.55, r * 1.55);
  g.stroke();
  const metal = g.createLinearGradient(-r, -r, r, r);
  metal.addColorStop(0, "#f4f7fb");
  metal.addColorStop(0.5, "#8b97a8");
  metal.addColorStop(1, "#e8eef6");
  g.beginPath();
  g.arc(0, 0, r, 0, 6.2832);
  g.lineWidth = r * 0.16;
  g.strokeStyle = metal;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, r * 0.82, 0, 6.2832);
  g.fillStyle = "rgba(190,230,255,0.18)";
  g.fill();
  g.restore();
}

const azL = azar(19);
const LINEAS = Array.from({ length: 14 }, () => 0.35 + azL() * 0.6);

export function contrato(g, x, y, w, h, oro, grieta) {
  g.save();
  g.translate(grieta, 0);
  redondo(g, x, y, w, h, 28);
  const papel = g.createLinearGradient(x, y, x, y + h);
  papel.addColorStop(0, "#f7f1e4");
  papel.addColorStop(1, "#e4d3b4");
  g.fillStyle = papel;
  g.fill();
  g.restore();
  const izq = grieta < 0;
  g.save();
  g.beginPath();
  g.rect(izq ? -200 : 540, 0, izq ? 740 : 800, 1920);
  g.clip();
  g.translate(grieta, 0);
  for (let i = 0; i < LINEAS.length; i++) {
    const ly = y + 70 + i * (h * 0.048);
    const lw = w * LINEAS[i];
    const es = i === 4;
    redondo(g, x + 48, ly, es ? lw * 0.92 : lw, es ? 22 : 14, 7);
    g.fillStyle = es ? `rgba(210,150,40,${0.35 + oro * 0.65})` : "rgba(90,70,40,0.28)";
    g.fill();
    if (es && oro > 0.2) {
      g.strokeStyle = `rgba(255,190,60,${oro})`;
      g.lineWidth = 3;
      g.stroke();
    }
  }
  const by = y + h - 150;
  redondo(g, x + w * 0.18, by, w * 0.64, 96, 48);
  const bg = g.createLinearGradient(0, by, 0, by + 96);
  bg.addColorStop(0, "#2f9e62");
  bg.addColorStop(1, "#14663a");
  g.fillStyle = bg;
  g.fill();
  g.restore();
}

export { LINEAS };
