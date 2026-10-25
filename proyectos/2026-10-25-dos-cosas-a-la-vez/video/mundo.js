// La boca, la mano, las lámparas, la sartén y la persona: las mismas en todos los planos.
import * as k from "#kit";

const piel = ["#ffd2b4", "#f0b08a", "#d48468", "#a85a48"];

export function velo(g, fuerza = 0.62) {
  const vg = g.createLinearGradient(0, 160, 0, 620);
  vg.addColorStop(0, `rgba(6,8,18,${fuerza})`);
  vg.addColorStop(0.55, `rgba(6,8,18,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(6,8,18,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 640);
}

export function sala(g, a, b, cx, cy, radio) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, a);
  bg.addColorStop(1, b);
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  const luz = g.createRadialGradient(cx, cy, 40, cx, cy, radio);
  luz.addColorStop(0, "rgba(255,255,255,0.14)");
  luz.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1920);
}

// Una persona de frente, grande. abre: 0 boca cerrada, 1 abierta. El centro es la cara.
export function boca(g, x, y, s, abre) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // hombros
  const camisa = g.createLinearGradient(-220, 120, 220, 320);
  camisa.addColorStop(0, "#6d28d9");
  camisa.addColorStop(0.5, "#8b5cf6");
  camisa.addColorStop(1, "#4c1d95");
  g.fillStyle = camisa;
  g.beginPath();
  g.moveTo(-230, 340);
  g.quadraticCurveTo(-180, 150, 0, 145);
  g.quadraticCurveTo(180, 150, 230, 340);
  g.closePath();
  g.fill();
  // cuello
  g.fillStyle = piel[1];
  k.redondo(g, -36, 108, 72, 70, 20);
  g.fill();
  // pelo, por detrás
  g.fillStyle = "#2a1840";
  g.beginPath();
  g.arc(0, -10, 168, Math.PI * 0.95, Math.PI * 2.05);
  g.quadraticCurveTo(150, 80, 120, 150);
  g.lineTo(-120, 150);
  g.quadraticCurveTo(-150, 80, -168, 0);
  g.fill();
  // cara
  const fg = g.createRadialGradient(-50, -70, 20, 10, 10, 190);
  fg.addColorStop(0, "#ffe4d2");
  fg.addColorStop(0.55, "#f3b894");
  fg.addColorStop(1, "#e09878");
  g.fillStyle = fg;
  g.beginPath();
  g.ellipse(0, 8, 132, 158, 0, 0, 6.2832);
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.16;
  g.beginPath();
  g.ellipse(0, 8, 132, 158, 0, 0, 6.2832);
  g.clip();
  g.drawImage(k.manchas, -140, -160, 280, 330);
  g.restore();
  // orejas
  g.fillStyle = piel[2];
  g.beginPath(); g.ellipse(-128, 20, 22, 32, 0, 0, 6.2832); g.fill();
  g.beginPath(); g.ellipse(128, 20, 22, 32, 0, 0, 6.2832); g.fill();
  // ojos
  for (const ex of [-48, 48]) {
    g.fillStyle = "#fffaf6";
    g.beginPath(); g.ellipse(ex, -28, 28, 20, 0, 0, 6.2832); g.fill();
    g.fillStyle = "#243044";
    g.beginPath(); g.arc(ex + 4, -26, 11, 0, 6.2832); g.fill();
    g.fillStyle = "#fff";
    g.beginPath(); g.arc(ex + 8, -30, 4, 0, 6.2832); g.fill();
  }
  g.strokeStyle = "#4a3040";
  g.lineWidth = 7;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-78, -62); g.quadraticCurveTo(-48, -78, -22, -60);
  g.moveTo(22, -60); g.quadraticCurveTo(48, -78, 78, -62);
  g.stroke();
  // nariz, pequeña
  g.strokeStyle = piel[3];
  g.lineWidth = 6;
  g.beginPath();
  g.moveTo(0, -10);
  g.quadraticCurveTo(16, 18, 0, 28);
  g.stroke();
  // boca
  const alto = 8 + abre * 36;
  g.fillStyle = "#a33b4a";
  g.beginPath();
  g.ellipse(0, 62, 52, 16 + abre * 8, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#3a1218";
  g.beginPath();
  g.ellipse(0, 64, 36, alto * 0.55, 0, 0, 6.2832);
  g.fill();
  if (abre > 0.2) {
    g.fillStyle = "#f6f0e8";
    k.redondo(g, -24, 52, 48, 10, 4);
    g.fill();
  }
  // flequillo
  g.fillStyle = "#2a1840";
  g.beginPath();
  g.moveTo(-120, -40);
  g.quadraticCurveTo(-40, -150, 20, -90);
  g.quadraticCurveTo(50, -160, 130, -30);
  g.quadraticCurveTo(40, -70, -20, -48);
  g.quadraticCurveTo(-70, -80, -120, -40);
  g.fill();
  // brillo de la mejilla
  g.globalCompositeOperation = "screen";
  g.fillStyle = "rgba(255,255,255,0.2)";
  g.beginPath();
  g.ellipse(-55, 20, 28, 16, -0.4, 0, 6.2832);
  g.fill();
  g.restore();
}

export function anillos(g, x, y, t, color, al = 1) {
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 5; i++) {
    const u = (t * 0.55 + i / 5) % 1;
    g.strokeStyle = `rgba(${color},${(1 - u) * 0.55 * al})`;
    g.lineWidth = 10 * (1 - u) + 3;
    g.beginPath();
    g.arc(x, y + 20, 70 + u * 380, 0, 6.2832);
    g.stroke();
  }
  g.restore();
}

// Mano desde arriba, agarrando un bolígrafo. avanza 0–1 es el trazo. gotaAl: la tinta que no cae.
export function manoEscribe(g, x, y, s, avanza, gotaAl = 0) {
  const u = Math.max(0, Math.min(1, avanza));
  const nibX = -150 + 260 * u;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.save();
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 22;
  g.shadowOffsetY = 12;
  k.redondo(g, -200, -20, 400, 230, 14);
  g.fillStyle = "#f7f2e7";
  g.fill();
  g.restore();
  g.strokeStyle = "rgba(190,176,150,0.7)";
  g.lineWidth = 2;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(-170, 20 + i * 42);
    g.lineTo(170, 20 + i * 42);
    g.stroke();
  }
  g.strokeStyle = "#1d4ed8";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-150, 62);
  g.lineTo(nibX, 62);
  g.stroke();
  // bolígrafo, corto, con la punta en la tinta
  g.save();
  g.translate(nibX, 62);
  g.rotate(-0.85);
  g.fillStyle = "#1e3a8a";
  k.redondo(g, -13, -150, 26, 130, 9);
  g.fill();
  g.fillStyle = "#fbbf24";
  g.fillRect(-13, -48, 26, 12);
  g.fillStyle = "#e8eef5";
  g.beginPath();
  g.moveTo(-7, -22);
  g.lineTo(7, -22);
  g.lineTo(2, 16);
  g.lineTo(-2, 16);
  g.closePath();
  g.fill();
  g.restore();
  // la mano tapa el cuerpo del bolígrafo: se ve que lo agarra
  g.save();
  g.translate(nibX + 55, -20);
  g.rotate(-0.85);
  const pg = g.createLinearGradient(-40, 0, 50, 40);
  pg.addColorStop(0, piel[0]);
  pg.addColorStop(1, piel[2]);
  g.fillStyle = pg;
  g.beginPath();
  g.ellipse(20, 36, 46, 34, 0.2, 0, 6.2832);
  g.fill();
  for (let i = 0; i < 3; i++) {
    k.redondo(g, -8 + i * 2, -70 + i * 6, 24, 78, 12);
    g.fill();
  }
  // pulgar al otro lado del boli
  g.save();
  g.rotate(0.9);
  k.redondo(g, -46, 10, 22, 58, 11);
  g.fill();
  g.restore();
  g.restore();
  if (gotaAl > 0.02) {
    g.save();
    g.translate(nibX, 78);
    g.globalAlpha = Math.min(1, gotaAl);
    g.fillStyle = "#1d4ed8";
    g.beginPath();
    g.moveTo(0, 0);
    g.quadraticCurveTo(12, 14, 0, 28);
    g.quadraticCurveTo(-12, 14, 0, 0);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.75)";
    g.beginPath();
    g.arc(-3, 8, 3, 0, 6.2832);
    g.fill();
    g.restore();
  }
  g.restore();
}

export function lampara(g, x, y, r, color, fuerza) {
  g.save();
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 16;
  g.fillStyle = "#141820";
  g.beginPath();
  g.ellipse(x, y + r * 0.72, r * 1.05, r * 0.28, 0, 0, 6.2832);
  g.fill();
  g.restore();
  const c = k.COLORES[color] || color;
  g.save();
  g.globalCompositeOperation = "lighter";
  const halo = g.createRadialGradient(x, y, r * 0.2, x, y, r * 2.2);
  halo.addColorStop(0, `rgba(${c},${0.35 * fuerza})`);
  halo.addColorStop(1, `rgba(${c},0)`);
  g.fillStyle = halo;
  g.beginPath();
  g.arc(x, y, r * 2.2, 0, 6.2832);
  g.fill();
  g.restore();
  const lg = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  lg.addColorStop(0, `rgba(255,255,255,${0.85 * fuerza})`);
  lg.addColorStop(0.25, `rgba(${c},${0.95 * fuerza})`);
  lg.addColorStop(1, `rgba(${c},${0.25 * fuerza})`);
  g.fillStyle = lg;
  g.beginPath();
  g.arc(x, y, r, 0, 6.2832);
  g.fill();
  g.save();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.35;
  g.drawImage(k.manchas, x - r, y - r, r * 2, r * 2);
  g.restore();
}

// Mano que baja a golpear. (x, y) es la yema: los dedos apuntan hacia abajo, al botón.
export function manoGolpe(g, x, y, s, aplasta, tinte) {
  g.save();
  g.translate(x, y);
  g.scale(s, s * (1 - 0.22 * aplasta));
  const base = tinte || piel[1];
  const dg = g.createLinearGradient(-80, -160, 80, 10);
  dg.addColorStop(0, piel[2]);
  dg.addColorStop(0.5, base);
  dg.addColorStop(1, piel[0]);
  g.fillStyle = dg;
  // antebrazo, hacia arriba
  k.redondo(g, -32, -460, 64, 280, 26);
  g.fill();
  // palma, encima de los dedos
  g.beginPath();
  g.ellipse(0, -150, 96, 58, 0, 0, 6.2832);
  g.fill();
  // cuatro dedos hacia el botón
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -78 + i * 44, -130, 38, 128, 18);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.55)";
    g.beginPath();
    g.ellipse(-59 + i * 44, -8, 9, 6, 0, 0, 6.2832);
    g.fill();
    g.fillStyle = dg;
  }
  g.restore();
}

export function sarten(g, x, y, s, fuego) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // fuego debajo: fase congelable la pasa el plano con el tiempo
  g.restore();
  k.anilloDeLlamas(g, x, y + 70 * s, 150 * s, 36 * s, fuego.t, fuego.naranja, false, 18, 70 * s * (0.35 + fuego.alto));
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "#2a241c";
  k.redondo(g, 150, -18, 210, 36, 16);
  g.fill();
  const pg = g.createLinearGradient(-180, -40, 180, 80);
  pg.addColorStop(0, "#6a6258");
  pg.addColorStop(0.45, "#d9d3c8");
  pg.addColorStop(1, "#3e3832");
  g.fillStyle = pg;
  g.beginPath();
  g.ellipse(0, 0, 190, 70, 0, 0, 6.2832);
  g.fill();
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.ellipse(0, -6, 150, 48, 0, 0, 6.2832);
  g.fill();
  // aceite
  g.fillStyle = `rgba(180,120,40,${0.35 + 0.4 * fuego.alto})`;
  g.beginPath();
  g.ellipse(0, -4, 120, 34, 0, 0, 6.2832);
  g.fill();
  g.globalCompositeOperation = "screen";
  g.fillStyle = "rgba(255,255,255,0.2)";
  g.beginPath();
  g.ellipse(-50, -16, 40, 12, -0.4, 0, 6.2832);
  g.fill();
  g.restore();
  k.anilloDeLlamas(g, x, y + 46 * s, 150 * s, 28 * s, fuego.t, fuego.naranja, true, 16, 64 * s * (0.25 + fuego.alto));
}

export function tarjetaMensaje(g, x, y, s, lineas, listo) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 16;
  k.redondo(g, -220, -150, 440, 300, 36);
  g.fillStyle = "#f7f4ee";
  g.fill();
  g.restore();
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.fillStyle = "#3f3a34";
  for (let i = 0; i < 3; i++) {
    const w = [300, 260, 180][i] * Math.max(0, Math.min(1, lineas - i));
    if (w <= 2) continue;
    k.redondo(g, -160, -80 + i * 58, w, 28, 10);
    g.fill();
  }
  if (listo > 0.05) {
    g.globalAlpha = listo;
    g.strokeStyle = "#16a34a";
    g.lineWidth = 14;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(90, 70);
    g.lineTo(120, 102);
    g.lineTo(180, 30);
    g.stroke();
  }
  g.restore();
}

export function carta(g, x, y, s, tipo, al) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha = al;
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 26;
  g.shadowOffsetY = 14;
  k.redondo(g, -150, -190, 300, 380, 28);
  const cg = g.createLinearGradient(-150, -190, 150, 190);
  if (tipo === "tri") {
    cg.addColorStop(0, "#ffd089");
    cg.addColorStop(1, "#e07a1f");
  } else {
    cg.addColorStop(0, "#bff6ff");
    cg.addColorStop(1, "#1aa7c9");
  }
  g.fillStyle = cg;
  g.fill();
  g.restore();
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha = al;
  g.fillStyle = "rgba(255,255,255,0.92)";
  g.beginPath();
  if (tipo === "tri") {
    g.moveTo(0, -70);
    g.lineTo(78, 70);
    g.lineTo(-78, 70);
    g.closePath();
  } else {
    g.arc(0, 0, 70, 0, 6.2832);
  }
  g.fill();
  g.restore();
}

export function ranura(g, x, y, s, brillo) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  k.redondo(g, -170, -210, 340, 420, 36);
  g.fillStyle = "#120e08";
  g.fill();
  g.lineWidth = 16;
  g.strokeStyle = `rgba(255, 206, 92, ${0.45 + 0.55 * brillo})`;
  g.stroke();
  g.restore();
  k.brillo(g, x, y, 520 * s, "255,196,80", 0.35 * brillo);
}

const azC = k.azar(41);
const VENTANAS = [];
for (let i = 0; i < 48; i++) VENTANAS.push({ x: azC(), y: azC(), w: 0.04 + azC() * 0.03, on: azC() > 0.35 });

export function calle(g, t, desplaza) {
  const cielo = g.createLinearGradient(0, 0, 0, 1200);
  cielo.addColorStop(0, "#2a1460");
  cielo.addColorStop(0.45, "#c2416b");
  cielo.addColorStop(1, "#ffb15a");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  // edificios
  const colores = ["#3a1868", "#1e3a5f", "#5b2148", "#243052"];
  for (let i = 0; i < 6; i++) {
    const x = ((i * 220 - desplaza * 0.35) % 1320 + 1320) % 1320 - 200;
    g.fillStyle = colores[i % 4];
    g.fillRect(x, 280, 200, 820);
    g.save();
    g.beginPath();
    g.rect(x, 280, 200, 820);
    g.clip();
    for (const v of VENTANAS) {
      if (!v.on) continue;
      g.fillStyle = "rgba(255,214,120,0.85)";
      g.fillRect(x + v.x * 170, 300 + v.y * 760, 22, 30);
    }
    g.restore();
  }
  // acera
  const suelo = g.createLinearGradient(0, 1100, 0, 1920);
  suelo.addColorStop(0, "#3a2a44");
  suelo.addColorStop(1, "#1a1224");
  g.fillStyle = suelo;
  g.fillRect(0, 1080, 1080, 840);
  g.strokeStyle = "rgba(255,255,255,0.18)";
  g.lineWidth = 8;
  for (let i = -2; i < 8; i++) {
    const x = ((i * 180 - desplaza) % 1440 + 1440) % 1440 - 180;
    g.beginPath();
    g.moveTo(x, 1120);
    g.lineTo(x + 80, 1900);
    g.stroke();
  }
}

export function persona(g, x, y, s, fase, habla) {
  const pierna = Math.sin(fase) * 0.7;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  // sombra
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath();
  g.ellipse(10, 250, 90, 22, 0, 0, 6.2832);
  g.fill();
  // piernas
  const pintaPierna = (ang, dx) => {
    g.save();
    g.translate(dx, 80);
    g.rotate(ang);
    g.fillStyle = "#1e293b";
    k.redondo(g, -16, 0, 32, 150, 14);
    g.fill();
    g.fillStyle = "#f8fafc";
    k.redondo(g, -22, 130, 52, 26, 8);
    g.fill();
    g.restore();
  };
  pintaPierna(pierna, -18);
  pintaPierna(-pierna, 22);
  // torso
  const tg = g.createLinearGradient(-70, -80, 70, 100);
  tg.addColorStop(0, "#5eead4");
  tg.addColorStop(0.5, "#14b8a6");
  tg.addColorStop(1, "#0f766e");
  g.fillStyle = tg;
  k.redondo(g, -68, -90, 136, 190, 40);
  g.fill();
  // brazo
  g.save();
  g.translate(40, -20);
  g.rotate(-pierna * 0.8);
  g.fillStyle = piel[1];
  k.redondo(g, -12, 0, 26, 110, 12);
  g.fill();
  g.restore();
  // cabeza
  g.fillStyle = piel[1];
  g.beginPath();
  g.arc(8, -140, 52, 0, 6.2832);
  g.fill();
  g.fillStyle = "#1e1b4b";
  g.beginPath();
  g.arc(0, -156, 48, 3.4, 6.1);
  g.fill();
  // boca que habla
  g.fillStyle = "#7f1d1d";
  g.beginPath();
  g.ellipse(28, -124, 10, 4 + habla * 10, 0, 0, 6.2832);
  g.fill();
  g.restore();
}

export function cinta(g, x, y, t, rotura) {
  const n = 7;
  for (let i = 0; i < n; i++) {
    const u = t - rotura;
    const cae = rotura > 0 && u > 0;
    const dx = cae ? (i - 3) * 36 * Math.min(1, u * 2) : (i - 3) * 8;
    const dy = cae ? 420 * u * u + i * 6 : Math.sin(t * 3 + i) * 6;
    const al = cae ? Math.max(0, 1 - u * 0.7) : 0.9;
    g.save();
    g.globalAlpha = al;
    g.fillStyle = i % 2 ? "#fde68a" : "#67e8f9";
    k.redondo(g, x + dx - 28, y - i * 36 + dy, 70, 28, 12);
    g.fill();
    g.restore();
  }
}
