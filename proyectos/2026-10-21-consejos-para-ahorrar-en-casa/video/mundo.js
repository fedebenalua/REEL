// Cámara 2D, radiador, ropa, ventana, persianas, termostato y billetes.
import * as k from "#kit";
import { v } from "#voz";

const { azar, redondo, suave: su, tramo: tr, mez, mezRgb, mezColor } = k;
const TAU = 6.2832;

export function vista(g, Z, cx, cy) { g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])]));
  const X = k.claves(claves.map(([t, c]) => [t, c[1]]));
  const Y = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), X(t), Y(t)];
}
export function velo(g, al = 0.55) {
  if (al <= 0.01) return;
  g.save(); sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 700);
  vg.addColorStop(0, `rgba(8,6,12,${al})`);
  vg.addColorStop(0.6, `rgba(8,6,12,${al * 0.7})`);
  vg.addColorStop(1, "rgba(8,6,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700); g.restore();
}
export function vineta(g, al = 0.5) {
  g.save(); sinVista(g);
  const vg = g.createRadialGradient(540, 960, 520, 540, 960, 1250);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920); g.restore();
}

export const colCalor = (calor) => {
  const c = Math.max(0, Math.min(1, calor));
  return c > 0.5 ? mezRgb("255,170,60", "255,80,55", (c - 0.5) * 2) : mezRgb("110,205,255", "255,170,60", c * 2);
};

function texto(g, s, x, y, tam, col, peso = 800, al = 1) {
  g.save(); g.globalAlpha *= al;
  g.font = `${peso} ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = col; g.fillText(s, x, y); g.restore();
}

export function digitos(g, valor, x, y, tam, col) {
  const hi = Math.ceil(valor - 1e-6), f = hi - valor;
  const A = g.globalAlpha;
  g.save(); g.beginPath(); g.rect(x - tam * 0.95, y - tam * 0.62, tam * 1.9, tam * 1.24); g.clip();
  g.font = `800 ${tam}px Figtree`; g.textAlign = "center"; g.textBaseline = "middle";
  g.shadowColor = `rgba(${col},0.9)`; g.shadowBlur = 42; g.fillStyle = `rgb(${col})`;
  g.globalAlpha = A * (1 - f); g.fillText(String(hi), x, y + f * tam * 0.9);
  if (f > 0.001) { g.globalAlpha = A * f; g.fillText(String(hi - 1), x, y - (1 - f) * tam * 0.9); }
  g.restore();
}

export function pared(g, tinte = "255,140,90") {
  g.save(); sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#2a1a16"); bg.addColorStop(0.45, "#3d241c"); bg.addColorStop(1, "#1a100e");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  const luz = g.createRadialGradient(540, 1100, 80, 540, 1100, 900);
  luz.addColorStop(0, `rgba(${tinte},0.35)`); luz.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = luz; g.fillRect(0, 0, 1080, 1920);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; g.drawImage(k.manchas, -100, -100, 1300, 2200);
  g.restore();
}

export function suelo(g) {
  g.save();
  g.beginPath(); g.moveTo(-900, 420); g.lineTo(900, 420); g.lineTo(900, 900); g.lineTo(-900, 900); g.closePath();
  const gr = g.createLinearGradient(0, 420, 0, 900);
  gr.addColorStop(0, "#5a3a28"); gr.addColorStop(1, "#2a1810");
  g.fillStyle = gr; g.fill();
  g.globalAlpha = 0.25; g.drawImage(k.manchas, -700, 400, 1400, 600);
  g.restore();
}

/** Radiador centrado en 0,0. w alto aprox 520. calor 0..1. bloqueado: menos ondas libres. */
export function radiador(g, t, o = {}) {
  const { calor = 0.85, bloqueado = 0, w = 520, h = 280 } = o;
  const col = colCalor(calor);
  const n = 9;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 40; g.shadowOffsetY = 18;
  redondo(g, -w / 2 - 10, -h / 2 - 14, w + 20, 22, 8); g.fillStyle = "#c8ceda"; g.fill();
  redondo(g, -w / 2 - 10, h / 2 - 8, w + 20, 22, 8); g.fillStyle = "#aeb4c2"; g.fill();
  g.shadowBlur = 0; g.shadowOffsetY = 0;
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + 18 + i * ((w - 36) / (n - 1));
    const gr = g.createLinearGradient(x - 22, 0, x + 22, 0);
    const tint = (base, a) => {
      const [r, gv, b] = base.split(",").map(Number);
      const [cr, cg, cb] = col.split(",").map(Number);
      return `rgb(${Math.round(r + (cr - r) * a)},${Math.round(gv + (cg - gv) * a)},${Math.round(b + (cb - b) * a)})`;
    };
    gr.addColorStop(0, tint("232,235,242", calor * 0.25));
    gr.addColorStop(0.5, tint("255,255,255", calor * 0.35));
    gr.addColorStop(1, tint("184,190,204", calor * 0.2));
    redondo(g, x - 22, -h / 2, 44, h, 12); g.fillStyle = gr; g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(x - 8, -h / 2 + 20, 6, h - 40);
  }
  // ondas de calor
  if (calor > 0.05) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    const libre = 1 - bloqueado * 0.85;
    for (let i = 0; i < 7; i++) {
      const x0 = -w / 2 + 40 + i * (w - 80) / 6;
      const ph = t * 2.4 + i * 0.9;
      const alto = (120 + i * 18) * libre * calor;
      const atrap = bloqueado * (40 + Math.sin(ph) * 20);
      g.strokeStyle = `rgba(${col},${0.45 * calor * libre})`;
      g.lineWidth = 10;
      g.beginPath();
      g.moveTo(x0, -h / 2 - 8);
      g.bezierCurveTo(
        x0 - 20 + Math.sin(ph) * 14, -h / 2 - alto * 0.4,
        x0 + 24 + Math.cos(ph) * 12, -h / 2 - alto * 0.7 - atrap,
        x0 + Math.sin(ph * 1.3) * 10, -h / 2 - alto - atrap * 0.5
      );
      g.stroke();
      if (bloqueado > 0.2) {
        g.strokeStyle = `rgba(255,90,60,${0.35 * bloqueado})`;
        g.beginPath();
        g.moveTo(x0 - 30, -h / 2 - 90);
        g.quadraticCurveTo(x0, -h / 2 - 50, x0 + 30, -h / 2 - 90);
        g.stroke();
      }
    }
    g.restore();
  }
  g.restore();
}

/** Prenda: tipo camiseta|pantalon|calcetin. pos y rot. */
export function prenda(g, tipo, x, y, rot, esc = 1, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(esc, esc); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 18; g.shadowOffsetY = 8;
  if (tipo === "camiseta") {
    const gr = g.createLinearGradient(-80, -40, 80, 120);
    gr.addColorStop(0, "#5ec8ff"); gr.addColorStop(1, "#2a7fc4");
    g.beginPath();
    g.moveTo(-90, -20); g.lineTo(-120, 40); g.lineTo(-70, 55); g.lineTo(-70, 130);
    g.lineTo(70, 130); g.lineTo(70, 55); g.lineTo(120, 40); g.lineTo(90, -20);
    g.quadraticCurveTo(0, -50, -90, -20); g.closePath();
    g.fillStyle = gr; g.fill();
    g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(-40, 20, 80, 14);
  } else if (tipo === "pantalon") {
    const gr = g.createLinearGradient(-60, 0, 60, 160);
    gr.addColorStop(0, "#3a4a6a"); gr.addColorStop(1, "#1a2438");
    g.beginPath();
    g.moveTo(-70, 0); g.lineTo(70, 0); g.lineTo(55, 160); g.lineTo(10, 160);
    g.lineTo(0, 50); g.lineTo(-10, 160); g.lineTo(-55, 160); g.closePath();
    g.fillStyle = gr; g.fill();
  } else {
    // calcetín
    const gr = g.createLinearGradient(-20, -40, 40, 40);
    gr.addColorStop(0, "#ff6b8a"); gr.addColorStop(1, "#c43055");
    redondo(g, -28, -50, 40, 90, 18); g.fillStyle = gr; g.fill();
    g.beginPath(); g.ellipse(30, 30, 38, 22, 0.4, 0, TAU); g.fill();
  }
  g.restore();
}

export function billete(g, x, y, rot, esc = 1, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(esc, esc); g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.3)"; g.shadowBlur = 12; g.shadowOffsetY = 6;
  redondo(g, -70, -34, 140, 68, 10);
  const gr = g.createLinearGradient(-70, -34, 70, 34);
  gr.addColorStop(0, "#2ecc71"); gr.addColorStop(0.5, "#27ae60"); gr.addColorStop(1, "#1e8449");
  g.fillStyle = gr; g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)"; g.font = "800 28px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("€", 0, 2);
  g.restore();
}

export function lluviaBilletes(g, t, t0, n = 14, semilla = 11) {
  const u = t - t0; if (u < -0.2) return;
  const r = azar(semilla);
  for (let i = 0; i < n; i++) {
    const ph = r() * 10;
    const delay = r() * 0.6;
    const uu = u - delay; if (uu < 0) continue;
    const x = (r() - 0.5) * 700;
    const y = -200 - r() * 100 + uu * (280 + r() * 200) + Math.sin(uu * 4 + ph) * 30;
    const rot = ph + uu * (1 + r() * 2);
    billete(g, x, y, rot, 0.85 + r() * 0.4, Math.max(0, 1 - tr(uu, 2.2, 3.2)));
  }
}

export function ventanaNoche(g, t, o = {}) {
  const { w = 420, h = 520, persiana = 0, cortina = 0, calorSale = 0.7 } = o;
  g.save();
  // marco
  redondo(g, -w / 2 - 18, -h / 2 - 18, w + 36, h + 36, 16); g.fillStyle = "#e8e0d4"; g.fill();
  // cristal noche
  redondo(g, -w / 2, -h / 2, w, h, 8);
  const cielo = g.createLinearGradient(0, -h / 2, 0, h / 2);
  cielo.addColorStop(0, "#0a1028"); cielo.addColorStop(1, "#1a2848");
  g.fillStyle = cielo; g.fill();
  // luna
  g.beginPath(); g.arc(w * 0.22, -h * 0.28, 36, 0, TAU);
  g.fillStyle = "#f0e8c8"; g.fill();
  k.brillo(g, w * 0.22, -h * 0.28, 90, "240,220,160", 0.5);
  // estrellas
  const r = azar(44);
  for (let i = 0; i < 18; i++) {
    g.beginPath(); g.arc(-w / 2 + 20 + r() * (w - 40), -h / 2 + 20 + r() * (h - 40), 1.5 + r() * 2, 0, TAU);
    g.fillStyle = "rgba(255,255,255,0.7)"; g.fill();
  }
  // calor escapando
  if (calorSale > 0.05) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      const x = -w / 2 + 40 + i * (w - 80) / 5;
      const ph = t * 1.8 + i;
      g.strokeStyle = `rgba(255,140,60,${0.4 * calorSale})`;
      g.lineWidth = 8;
      g.beginPath();
      g.moveTo(x, h / 2 - 20);
      g.bezierCurveTo(x - 30, 0, x + 40, -h * 0.2, x + Math.sin(ph) * 20, -h / 2 - 40 - i * 10);
      g.stroke();
    }
    g.restore();
  }
  // cruz del marco
  g.strokeStyle = "#e8e0d4"; g.lineWidth = 14;
  g.beginPath(); g.moveTo(0, -h / 2); g.lineTo(0, h / 2); g.moveTo(-w / 2, 0); g.lineTo(w / 2, 0); g.stroke();
  // persianas
  if (persiana > 0.01) {
    const baja = persiana * h;
    g.fillStyle = "#c4a878";
    g.fillRect(-w / 2, -h / 2, w, baja);
    g.strokeStyle = "rgba(80,50,20,0.35)"; g.lineWidth = 3;
    for (let y = -h / 2 + 18; y < -h / 2 + baja; y += 22) {
      g.beginPath(); g.moveTo(-w / 2, y); g.lineTo(w / 2, y); g.stroke();
    }
  }
  // cortinas
  if (cortina > 0.01) {
    for (const s of [-1, 1]) {
      g.save(); g.translate(s * w / 2, 0);
      const gr = g.createLinearGradient(0, 0, s * 80, 0);
      gr.addColorStop(0, `rgba(180,60,80,${0.95 * cortina})`);
      gr.addColorStop(1, `rgba(120,30,50,${0.5 * cortina})`);
      g.fillStyle = gr;
      g.beginPath();
      g.moveTo(0, -h / 2 - 10);
      g.quadraticCurveTo(s * (40 + 100 * cortina), 0, 0, h / 2 + 10);
      g.lineTo(s * (20 + 90 * cortina), h / 2 + 10);
      g.quadraticCurveTo(s * (60 + 120 * cortina), 0, s * (20 + 90 * cortina), -h / 2 - 10);
      g.closePath(); g.fill();
      g.restore();
    }
  }
  g.restore();
}

export function termostato(g, t, o = {}) {
  const { grados = 21, calor = 0.45, boton = 0, TR = 280 } = o;
  const col = colCalor(calor);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 50; g.shadowOffsetY = 24;
  g.beginPath(); g.arc(0, 0, TR, 0, TAU); g.fillStyle = "#d9dce6"; g.fill();
  g.shadowBlur = 0; g.shadowOffsetY = 0;
  let gr = g.createLinearGradient(-TR, -TR, TR, TR);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#a9afc2");
  g.beginPath(); g.arc(0, 0, TR, 0, TAU); g.fillStyle = gr; g.fill();
  g.beginPath(); g.arc(0, 0, TR - 40, 0, TAU); g.fillStyle = "#0b1022"; g.fill();
  digitos(g, grados, -6, -8, 200, col);
  texto(g, "°C", 130, -80, 60, `rgb(${col})`, 700, 0.9);
  if (boton > 0.01) k.brillo(g, 0, 160, 120, "255,230,150", 0.7 * boton);
  g.restore();
}

export function jersey(g, x, y, esc = 1, al = 1) {
  if (al <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(esc, esc); g.globalAlpha *= al;
  const manga = (s) => {
    g.strokeStyle = "#ff8a2a"; g.lineWidth = 90; g.lineCap = "round";
    g.beginPath(); g.moveTo(s * 140, 40); g.lineTo(s * 200, 320); g.stroke();
  };
  manga(-1); manga(1);
  redondo(g, -160, 0, 320, 420, 80);
  const gr = g.createLinearGradient(-160, 0, 160, 0);
  gr.addColorStop(0, "#ffa04a"); gr.addColorStop(0.5, "#ff8a2a"); gr.addColorStop(1, "#e56f18");
  g.fillStyle = gr; g.fill();
  g.beginPath(); g.ellipse(0, 10, 60, 34, 0, 0, TAU); g.fillStyle = "#ffe9c4"; g.fill();
  g.restore();
}

// Tiempos del hook
export const T_ropa = v.frase(1).t("ropa");
export const T_radiador = v.frase(1).t("radiador");
export const T_gesto = v.frase(2).t("gesto");
