// El campo, la brújula y el perro de la casa. El perro sale de perros/mundo.js.
import * as k from "#kit";
import {
  parque, ponVista, sinVista, velo, vineta, perro, persona, polvo, cam, aPantalla, pastillaPop,
} from "../../../perros/mundo.js";

export * from "../../../perros/mundo.js";

const TAU = Math.PI * 2;
const { suave, tramo, mez } = k;

export const CX = 470;
export { parque, ponVista, sinVista, perro, persona, polvo, cam, aPantalla, pastillaPop, suave, tramo, mez };

export function rellena(g, al = 0.46) {
  velo(g, al);
  vineta(g, 0.28);
}

export function vida(t) {
  return 0.035 * Math.sin(t * 2.3);
}

// La rosa pintada en el suelo. ang 0: el norte-sur va a lo largo del lomo (horizontal).
export function rosa(g, x, ang, fuerza, radio = 158) {
  const f = Math.max(0, Math.min(1, fuerza));
  g.save();
  g.translate(x, 22);
  g.save();
  g.scale(1, 0.3);
  g.beginPath();
  g.arc(0, 0, radio, 0, TAU);
  g.strokeStyle = `rgba(255, 244, 214, ${0.28 + 0.45 * f})`;
  g.lineWidth = 16;
  g.stroke();
  g.beginPath();
  g.arc(0, 0, radio * 0.62, 0, TAU);
  g.lineWidth = 8;
  g.strokeStyle = `rgba(255, 186, 70, ${0.2 + 0.35 * f})`;
  g.stroke();
  g.restore();
  const barra = (a, L, w, col, al) => {
    g.strokeStyle = col;
    g.globalAlpha = al;
    g.lineWidth = w;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(-Math.cos(a) * L, -Math.sin(a) * L * 0.3);
    g.lineTo(Math.cos(a) * L, Math.sin(a) * L * 0.3);
    g.stroke();
  };
  g.save();
  barra(ang + Math.PI / 2, radio * 0.72, 9, "rgba(90,170,255,0.85)", 0.35 + 0.35 * f);
  barra(ang, radio, 18, "rgba(255,196,60,0.95)", 0.45 + 0.5 * f);
  g.fillStyle = `rgba(255,236,180,${0.5 + 0.4 * f})`;
  g.globalAlpha = 0.9;
  g.beginPath();
  g.arc(0, 0, 10, 0, TAU);
  g.fill();
  g.restore();
  g.restore();
}

// Un eje luminoso en pantalla, con N y S en las puntas si se pide.
export function eje(g, c, o) {
  const f = Math.max(0, Math.min(1, o.fuerza || 0));
  if (f < 0.03) return;
  const y = o.y ?? -40;
  const L = o.largo ?? 86;
  const ang = o.ang || 0;
  const dx = Math.cos(ang) * L;
  const dy = Math.sin(ang) * L * (o.plano ?? 0.82);
  const A = aPantalla(c, o.x - dx, y - dy);
  const B = aPantalla(c, o.x + dx, y + dy);
  const rgb = o.color || "255,210,70";
  sinVista(g);
  g.save();
  g.globalCompositeOperation = "lighter";
  g.lineCap = "round";
  g.strokeStyle = `rgba(${rgb},${0.28 * f})`;
  g.lineWidth = 34;
  g.beginPath();
  g.moveTo(A[0], A[1]);
  g.lineTo(B[0], B[1]);
  g.stroke();
  g.strokeStyle = `rgba(255,252,235,${0.85 * f})`;
  g.lineWidth = 7;
  g.stroke();
  g.restore();
  if (o.ns && f > 0.4) {
    const empuja = (P, signo) => {
      const vx = B[0] - A[0], vy = B[1] - A[1], d = Math.hypot(vx, vy) || 1;
      let x = P[0] + (vx / d) * 86 * signo;
      let y2 = P[1] + (vy / d) * 36 * signo;
      x = Math.max(130, Math.min(880, x));
      y2 = Math.max(560, Math.min(1340, y2));
      return [x, y2];
    };
    const s = empuja(A, -1), n = empuja(B, 1);
    g.save();
    g.globalAlpha = f;
    k.pastilla(g, s[0], s[1], "S", "", "120,186,255", 1, 78);
    k.pastilla(g, n[0], n[1], "N", "", "255,120,70", 1, 78);
    g.restore();
  }
}

export function perroAhora(g, t, o) {
  const ag = o.agacha ?? 0;
  return perro(g, {
    x: o.x, y: 0, dir: o.dir ?? 1,
    fase: o.fase || 0,
    marcha: o.marcha || 0,
    agacha: ag,
    pataAlta: o.pataAlta || 0,
    pitch: (o.pitch ?? vida(t)) * (1 - (o.pataAlta || 0)),
    t,
    cola: o.cola ?? (0.55 + 0.4 * ag),
    escala: o.escala ?? 1,
    cabeza: {
      ang: o.ang ?? (ag > 0.5 ? 0.08 : 0.02),
      abre: o.abre ?? (o.marcha > 0.4 ? 0.7 : 0.12),
      ojo: o.ojo ?? 0,
      oreja: 0.06 * Math.sin(t * 3.1),
    },
  });
}

export function valla(g, x, ang, fuerza) {
  const f = Math.max(0, Math.min(1, fuerza));
  g.save();
  const postes = 7;
  for (let i = 0; i < postes; i++) {
    const u = i / (postes - 1) - 0.5;
    const px = x + Math.cos(ang) * u * 280;
    const py = 8 + Math.sin(ang) * u * 70;
    const alto = 78 - Math.abs(u) * 10;
    const mg = g.createLinearGradient(px - 5, 0, px + 5, 0);
    mg.addColorStop(0, "#8a5a32");
    mg.addColorStop(0.45, "#e2b072");
    mg.addColorStop(1, "#5c3a1e");
    g.fillStyle = mg;
    g.fillRect(px - 5, py - alto, 10, alto);
    g.fillStyle = "#c9843c";
    g.fillRect(px - 7, py - alto, 14, 6);
  }
  g.strokeStyle = `rgba(255,214,120,${0.25 + 0.65 * f})`;
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(x - Math.cos(ang) * 140, 8 - 46 - Math.sin(ang) * 35);
  g.lineTo(x + Math.cos(ang) * 140, 8 - 46 + Math.sin(ang) * 35);
  g.stroke();
  g.restore();
}

export function tronco(g, x) {
  g.save();
  const tg = g.createLinearGradient(x - 16, 0, x + 16, 0);
  tg.addColorStop(0, "#a86b3c");
  tg.addColorStop(0.4, "#e8c088");
  tg.addColorStop(1, "#6a4122");
  g.fillStyle = tg;
  g.beginPath();
  g.moveTo(x - 18, 4);
  g.quadraticCurveTo(x - 10, -80, x - 14, -150);
  g.lineTo(x + 12, -150);
  g.quadraticCurveTo(x + 8, -80, x + 16, 4);
  g.closePath();
  g.fill();
  g.fillStyle = "#6aaa44";
  g.beginPath();
  g.arc(x - 4, -168, 36, 0, TAU);
  g.arc(x + 22, -150, 28, 0, TAU);
  g.arc(x - 24, -146, 26, 0, TAU);
  g.fill();
  g.restore();
}

const MAPA = (() => {
  const l = k.lienzo(520, 360), c = l.getContext("2d");
  c.fillStyle = "#f6e7c4";
  c.fillRect(0, 0, 520, 360);
  c.strokeStyle = "rgba(90,140,190,0.9)";
  c.lineWidth = 10;
  c.beginPath();
  c.moveTo(40, 240);
  c.bezierCurveTo(120, 80, 200, 300, 300, 140);
  c.bezierCurveTo(360, 60, 420, 200, 490, 90);
  c.stroke();
  c.fillStyle = "rgba(90,170,80,0.55)";
  c.beginPath();
  c.ellipse(150, 120, 70, 46, 0.2, 0, TAU);
  c.fill();
  c.beginPath();
  c.ellipse(360, 230, 90, 50, -0.3, 0, TAU);
  c.fill();
  c.strokeStyle = "rgba(120,80,40,0.35)";
  c.lineWidth = 3;
  for (const y of [120, 240]) { c.beginPath(); c.moveTo(0, y); c.lineTo(520, y); c.stroke(); }
  return l;
})();

export function mapa(g, x, abre, tiembla, t, tam = 0.52) {
  const u = Math.max(0, Math.min(1, abre));
  if (u < 0.02) return;
  const wob = Math.sin(t * 7.5) * 0.2 * tiembla;
  const w = 300 * tam, h = 208 * tam;
  g.save();
  g.translate(x, -6);
  g.rotate(-0.04);
  g.globalAlpha = u;
  g.drawImage(MAPA, -w / 2, -h / 2, w, h);
  g.strokeStyle = "rgba(90,60,30,0.5)";
  g.lineWidth = 3;
  g.strokeRect(-w / 2, -h / 2, w, h);
  g.translate(6, 0);
  g.rotate(wob);
  g.scale(tam, tam);
  g.fillStyle = "#e23b2f";
  g.beginPath();
  g.moveTo(86, 0);
  g.lineTo(-6, -16);
  g.lineTo(8, 0);
  g.lineTo(-6, 16);
  g.closePath();
  g.fill();
  g.fillStyle = "#1d4e89";
  g.beginPath();
  g.moveTo(-78, 0);
  g.lineTo(4, -14);
  g.lineTo(-8, 0);
  g.lineTo(4, 14);
  g.closePath();
  g.fill();
  g.restore();
}

// Cinco soles, en pantalla: uno de cada cinco. El del medio es la hora quieta.
export function cincoSoles(g, marca) {
  const m = Math.max(0, Math.min(1, marca));
  sinVista(g);
  const cols = ["#ffb15a", "#ff8a5a", "#ffe07a", "#7ec8ff", "#5aa0e8"];
  for (let i = 0; i < 5; i++) {
    const x = 140 + i * 200, y = 730, on = i === 2, r = on ? 72 : 52;
    g.save();
    g.globalAlpha = on ? 0.55 + 0.45 * m : 0.72;
    g.fillStyle = on ? cols[2] : cols[i];
    g.beginPath();
    g.arc(x, y, r, 0, TAU);
    g.fill();
    g.strokeStyle = "rgba(255,250,220,0.8)";
    g.lineWidth = on ? 8 : 4;
    if (on) {
      g.save();
      g.translate(x, y);
      g.strokeStyle = `rgba(255,236,170,${0.35 + 0.6 * m})`;
      g.lineWidth = 8;
      g.lineCap = "round";
      for (let k = 0; k < 8; k++) {
        const a = k / 8 * TAU + 0.2;
        g.beginPath();
        g.moveTo(Math.cos(a) * (r + 8), Math.sin(a) * (r + 8));
        g.lineTo(Math.cos(a) * (r + 26 + 8 * m), Math.sin(a) * (r + 26 + 8 * m));
        g.stroke();
      }
      g.restore();
    }
    g.restore();
  }
}
export function semaforo(g, x, t) {
  g.save();
  g.translate(x, 0);
  const poste = g.createLinearGradient(-6, 0, 6, 0);
  poste.addColorStop(0, "#4a515c");
  poste.addColorStop(0.5, "#d5dbe3");
  poste.addColorStop(1, "#2c3138");
  g.fillStyle = poste;
  g.fillRect(-6, -250, 12, 254);
  g.fillStyle = "#1c2128";
  k.redondo(g, -28, -250, 56, 150, 12);
  g.fill();
  const luces = [["#5a1c18", 0], ["#5a4a16", 0], ["#14321c", 1]];
  luces.forEach((L, i) => {
    const y = -228 + i * 44;
    g.fillStyle = L[0];
    g.beginPath();
    g.arc(0, y, 14, 0, TAU);
    g.fill();
    if (L[1]) {
      g.fillStyle = "#37e06a";
      g.beginPath();
      g.arc(0, y, 11, 0, TAU);
      g.fill();
      g.save();
      g.globalCompositeOperation = "lighter";
      const rg = g.createRadialGradient(0, y, 2, 0, y, 36);
      rg.addColorStop(0, `rgba(120,255,170,${0.55 + 0.2 * Math.sin(t * 2)})`);
      rg.addColorStop(1, "rgba(80,255,140,0)");
      g.fillStyle = rg;
      g.beginPath();
      g.arc(0, y, 36, 0, TAU);
      g.fill();
      g.restore();
    }
  });
  g.restore();
}

// Fondo de parque de ciudad: el mismo parque, más una explanada cálida.
export function explanada(g, x) {
  g.save();
  const gr = g.createLinearGradient(0, -10, 0, 40);
  gr.addColorStop(0, "#f2d2a0");
  gr.addColorStop(1, "#d7a56a");
  g.fillStyle = gr;
  g.beginPath();
  g.ellipse(x, 20, 240, 46, 0, 0, TAU);
  g.fill();
  g.globalAlpha = 0.25;
  g.strokeStyle = "#a87440";
  g.lineWidth = 3;
  for (let i = -3; i <= 3; i++) {
    g.beginPath();
    g.moveTo(x - 200, 16 + i * 8);
    g.lineTo(x + 200, 22 + i * 8);
    g.stroke();
  }
  g.restore();
}

export function acera(g, c) {
  sinVista(g);
  const y = 960 - c.cy * c.Z;
  const gr = g.createLinearGradient(0, y - 30, 0, y + 220);
  gr.addColorStop(0, "#f3d7b0");
  gr.addColorStop(0.4, "#e2b98a");
  gr.addColorStop(1, "#c48a58");
  g.fillStyle = gr;
  g.fillRect(0, y - 10, 1080, 520);
  g.strokeStyle = "rgba(255,236,200,0.45)";
  g.lineWidth = 3;
  ponVista(g, c);
}

export function escena(g, t, o) {
  const c = cam(o.Z, o.cx, o.cy);
  parque(g, c, t, o.hora ?? 0.22);
  if (o.sitio === "acera") acera(g, c);
  ponVista(g, c);
  if (o.explanada) explanada(g, o.explanada);
  if (o.rosa) rosa(g, o.rosa.x, o.rosa.ang || 0, o.rosa.fuerza ?? 1, o.rosa.radio);
  if (o.mapa) mapa(g, o.mapa.x, o.mapa.abre ?? 1, o.mapa.tiembla || 0, t, o.mapa.tam ?? 0.52);
  if (o.valla) valla(g, o.valla.x, o.valla.ang || 0, o.valla.fuerza ?? 0);
  if (o.tronco) tronco(g, o.tronco);
  if (o.polvo) polvo(g, t, o.polvo);
  if (o.luz) semaforo(g, o.luz, t);
  if (o.persona) {
    sinVista(g);
    ponVista(g, c, o.persona.lejos || 0.62);
    persona(g, { x: o.persona.x, fase: 0, paso: 0, recto: 1, t, inclina: 0.02 });
    ponVista(g, c);
  }
  if (o.perro) perroAhora(g, t, o.perro);
  if (o.ejes) for (const e of o.ejes) eje(g, c, e);
  sinVista(g);
  if (o.soles) cincoSoles(g, o.soles);
  if (o.chip) pastillaPop(g, t, o.chip.t0, o.chip.x, o.chip.y, o.chip.texto, o.chip.unidad || "", o.chip.color || "255,236,180", o.chip.tam || 100, o.chip.hasta ?? 99);
  rellena(g, o.velo ?? 0.48);
  return c;
}

// Tres vueltas sobre la acera. u de 0 a 1.
export function giro(u, vueltas, cx, radio = 74) {
  const ang = Math.max(0, u) * vueltas * TAU;
  return {
    x: cx + Math.cos(ang) * radio,
    dir: Math.sin(ang) >= 0 ? -1 : 1,
    fase: ang * 0.85,
    ang,
  };
}
