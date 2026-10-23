// El cerebro de este vídeo, el cuarto de las calorías y las tres cosas que un golpe puede llevarse.
// El mismo cerebro en el mito y en el final, para que se reconozca: aquí se construye una vez.
import * as k from "#kit";

const { azar, F, proyecta, tamano, redondo } = k;

// ---------------------------------------------------------------- el cerebro, sólido
// Dos hemisferios, el cerebelo abajo y un trozo en oro. Se dibuja alrededor del origen del mundo:
// la cámara decide lo grande que sale. Los trozos (izquierda, bajo, cerebelo) pueden caerse.
const PLIEGUES = [
  [-0.55, -0.42, -0.15, -0.22, 0.22],
  [-0.62, -0.12, -0.18, 0.02, 0.2],
  [-0.5, 0.16, -0.12, 0.22, 0.16],
  [-0.38, 0.38, -0.08, 0.4, 0.12],
];

// Perfil: el frente mira a la derecha. Es la silueta de libro, la que se reconoce sin explicación.
function perfil(g, cx, cy, s) {
  g.beginPath();
  g.moveTo(cx + 0.62 * s, cy + 0.02 * s);
  g.bezierCurveTo(cx + 0.98 * s, cy - 0.08 * s, cx + 0.9 * s, cy - 0.5 * s, cx + 0.48 * s, cy - 0.7 * s);
  g.bezierCurveTo(cx + 0.12 * s, cy - 0.9 * s, cx - 0.38 * s, cy - 0.78 * s, cx - 0.62 * s, cy - 0.42 * s);
  g.bezierCurveTo(cx - 0.86 * s, cy - 0.08 * s, cx - 0.74 * s, cy + 0.16 * s, cx - 0.5 * s, cy + 0.2 * s);
  g.bezierCurveTo(cx - 0.36 * s, cy + 0.14 * s, cx - 0.28 * s, cy + 0.05 * s, cx - 0.16 * s, cy + 0.12 * s);
  g.bezierCurveTo(cx + 0.05 * s, cy + 0.46 * s, cx + 0.42 * s, cy + 0.5 * s, cx + 0.58 * s, cy + 0.26 * s);
  g.bezierCurveTo(cx + 0.7 * s, cy + 0.16 * s, cx + 0.66 * s, cy + 0.08 * s, cx + 0.62 * s, cy + 0.02 * s);
  g.closePath();
}

function cerebelo(g, cx, cy, s) {
  g.beginPath();
  g.ellipse(cx - 0.46 * s, cy + 0.34 * s, s * 0.3, s * 0.22, -0.4, 0, 6.2832);
  g.closePath();
}

function pintaPieza(g, trazo, luz, sombra, textura) {
  g.save();
  trazo();
  g.fillStyle = luz;
  g.fill();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.45;
  g.fillStyle = sombra;
  g.fillRect(-200, -200, 2200, 2400);
  if (textura) {
    g.globalAlpha = 0.28;
    g.drawImage(k.manchas, textura.x, textura.y, textura.w, textura.h);
  }
  g.restore();
}

function pliegues(g, cx, cy, s, lado, al) {
  g.save();
  g.strokeStyle = `rgba(8,6,20,${0.45 * al})`;
  g.lineWidth = Math.max(4, s * 0.035);
  g.lineCap = "round";
  for (const [x0, y0, x1, y1, grosor] of PLIEGUES) {
    g.lineWidth = Math.max(3, s * grosor * 0.09);
    g.beginPath();
    g.moveTo(cx + lado * x0 * s, cy + y0 * s);
    g.quadraticCurveTo(cx + lado * (x0 + x1) * 0.5 * s, cy + (y0 + y1) * 0.5 * s - s * 0.08, cx + lado * x1 * s, cy + y1 * s);
    g.stroke();
  }
  g.restore();
}

// estado: { oro, vivo, trozos:{izq,bajo,cerebelo}, zonas:{habla,mano,nombre,vista}, golpe }
export function cerebroSolido(g, cam, estado) {
  const C = proyecta(cam, [0, 0.02, 0]);
  if (!C) return null;
  const s = tamano(1.12, C.z);
  const cx = C.x, cy = C.y + s * 0.06;
  const t = estado.trozos || {};
  const cae = Math.max(t.izq || 0, t.bajo || 0);
  const cer = t.cerebelo || 0;
  const oro = estado.oro ?? 1;
  const vivo = estado.vivo ?? 0;
  const yCae = cae * s * 0.98;
  const yCer = cer * s * 1.05;

  // brillo de fondo, para que no sea un recorte plano
  g.save();
  g.globalCompositeOperation = "lighter";
  const halo = g.createRadialGradient(cx, cy, s * 0.2, cx, cy, s * 1.35);
  halo.addColorStop(0, `rgba(120,70,220,${0.28 + vivo * 0.2})`);
  halo.addColorStop(1, "rgba(120,70,220,0)");
  g.fillStyle = halo;
  g.beginPath();
  g.ellipse(cx, cy, s * 1.25, s * 1.05, 0, 0, 6.2832);
  g.fill();
  g.restore();

  const sombrear = (px, py) => {
    const grd = g.createLinearGradient(px - s, py - s, px + s * 0.6, py + s);
    grd.addColorStop(0, "rgba(210,190,255,0.55)");
    grd.addColorStop(0.45, "rgba(70,40,140,0)");
    grd.addColorStop(1, "rgba(6,4,16,0.55)");
    return grd;
  };

  const py = cy + yCae;
  const luz = g.createRadialGradient(cx + s * 0.15, py - s * 0.45, s * 0.05, cx, py, s * 1.05);
  if (vivo > 0.35) {
    luz.addColorStop(0, "rgb(255,214,160)");
    luz.addColorStop(0.4, "rgb(214,96,150)");
    luz.addColorStop(1, "rgb(46,18,64)");
  } else {
    luz.addColorStop(0, "rgb(186,196,245)");
    luz.addColorStop(0.42, "rgb(62,48,140)");
    luz.addColorStop(1, "rgb(18,14,42)");
  }
  pintaPieza(g, () => perfil(g, cx, py, s), luz, sombrear(cx, py), null);
  // surcos en relieve: una línea oscura y otra clara justo debajo
  g.save();
  perfil(g, cx, py, s);
  g.clip();
  g.lineCap = "round";
  const surcos = [
    [0.45, -0.28, 0.05, -0.42, -0.35, -0.22],
    [0.55, 0.02, 0.1, -0.08, -0.4, 0.05],
    [0.2, 0.22, -0.15, 0.08, -0.42, 0.16],
    [-0.05, -0.55, -0.28, -0.2, -0.48, 0.02],
  ];
  for (const [x0, y0, x1, y1, x2, y2] of surcos) {
    const traza = (dy, col, w) => {
      g.strokeStyle = col;
      g.lineWidth = w;
      g.beginPath();
      g.moveTo(cx + x0 * s, py + (y0 + dy) * s);
      g.quadraticCurveTo(cx + x1 * s, py + (y1 + dy) * s, cx + x2 * s, py + (y2 + dy) * s);
      g.stroke();
    };
    traza(0, "rgba(12,8,24,0.55)", Math.max(5, s * 0.028));
    traza(0.025, "rgba(255,255,255,0.22)", Math.max(2, s * 0.012));
  }
  g.restore();

  // cerebelo, rayado, detrás y abajo
  const cyB = cy + yCer;
  const luzC = g.createRadialGradient(cx - s * 0.55, cyB + s * 0.1, s * 0.02, cx - s * 0.4, cyB + s * 0.34, s * 0.4);
  luzC.addColorStop(0, vivo > 0.4 ? "rgb(240,200,255)" : "rgb(176,150,210)");
  luzC.addColorStop(1, "rgb(48,24,72)");
  pintaPieza(g, () => cerebelo(g, cx, cyB, s), luzC, sombrear(cx, cyB), null);
  g.save();
  cerebelo(g, cx, cyB, s);
  g.clip();
  g.strokeStyle = "rgba(30,12,40,0.7)";
  g.lineWidth = Math.max(3, s * 0.02);
  for (let i = -2; i <= 3; i++) {
    const yy = cyB + s * (0.22 + i * 0.07);
    g.beginPath();
    g.moveTo(cx - s * 0.72, yy);
    g.quadraticCurveTo(cx - s * 0.46, yy - s * 0.05, cx - s * 0.2, yy + s * 0.02);
    g.stroke();
  }
  g.restore();

  // el casquete de oro, en el lóbulo frontal: se queda cuando el resto cae
  if (oro > 0.04) {
    g.save();
    g.beginPath();
    g.ellipse(cx + s * 0.42, cy - s * 0.38, s * 0.3, s * 0.24, -0.6, 0, 6.2832);
    const og = g.createRadialGradient(cx + s * 0.32, cy - s * 0.48, s * 0.02, cx + s * 0.42, cy - s * 0.32, s * 0.34);
    og.addColorStop(0, `rgba(255,250,230,${oro})`);
    og.addColorStop(0.5, `rgba(255,176,40,${0.92 * oro})`);
    og.addColorStop(1, "rgba(140,60,8,0.05)");
    g.fillStyle = og;
    g.fill();
    g.restore();
    k.brillo(g, cx + s * 0.4, cy - s * 0.4, s * 0.85, "255,196,70", 0.7 * oro);
  }

  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, cx + s * 0.05, py - s * 0.35, s * 1.15, vivo > 0.4 ? "255,170,120" : "160,140,255", 0.28);
  g.restore();

  if (estado.golpe > 0.02) {
    const gx = cx - s * 0.05 + (cae * 0), gy = py - s * 0.08;
    k.brillo(g, gx, gy, s * 0.45, "255,60,50", 0.85 * estado.golpe);
    g.save();
    g.fillStyle = `rgba(255,48,40,${estado.golpe})`;
    g.beginPath();
    g.arc(gx, gy, Math.max(9, s * 0.04), 0, 6.2832);
    g.fill();
    g.restore();
  }

  const Z = estado.zonas || {};
  const mancha = (nx, ny, col, al, rad) => {
    if (al < 0.04) return;
    k.brillo(g, cx + nx * s, py + ny * s, s * rad, col, al);
  };
  mancha(0.4, -0.15, "255,196,90", (Z.habla || 0) * 0.75, 0.7);
  mancha(0.05, -0.5, "90,220,255", (Z.mano || 0) * 0.7, 0.6);
  mancha(0.15, 0.22, "255,130,190", (Z.nombre || 0) * 0.7, 0.55);
  mancha(-0.45, -0.15, "150,255,170", (Z.vista || 0) * 0.6, 0.55);

  return {
    s, cx, cy,
    habla: { x: cx - s * 0.02, y: py - s * 0.05 },
    onda: { x: cx - s * 0.05, y: cy + s * 0.95 },
    mano: { x: cx + s * 0.72, y: cy + s * 0.82 },
    nombre: { x: cx + s * 0.05, y: cy + s * 1.12 },
  };
}

export function velo(g, fuerza = 0.62) {
  const vg = g.createLinearGradient(0, 160, 0, 640);
  vg.addColorStop(0, `rgba(5,6,16,${fuerza})`);
  vg.addColorStop(1, "rgba(5,6,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 660);
}

export function fondoNoche(g, calor = 0) {
  const grd = g.createLinearGradient(0, 0, 400, 1920);
  grd.addColorStop(0, calor > 0.4 ? "#140c22" : "#070814");
  grd.addColorStop(0.45, "#10122a");
  grd.addColorStop(1, "#070910");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1080, 1920);
}

// ---------------------------------------------------------------- lo que se rompe: voz, mano, nombre
export function onda(g, x, y, tam, al, rompe) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  g.translate(x, y);
  const trozos = 7;
  for (let i = 0; i < trozos; i++) {
    const u = i / (trozos - 1);
    const cae = rompe * rompe * (40 + i * 28);
    const sep = rompe * (i - 3) * 18;
    g.save();
    g.translate(sep, cae);
    g.strokeStyle = `rgba(255,214,120,${1 - rompe * 0.35})`;
    g.lineWidth = tam * 0.045;
    g.lineCap = "round";
    g.beginPath();
    const x0 = -tam * 0.5 + (tam / trozos) * i;
    const x1 = x0 + tam / trozos * 0.92;
    g.moveTo(x0, Math.sin(u * 6.2) * tam * 0.18);
    g.quadraticCurveTo((x0 + x1) / 2, Math.sin(u * 6.2 + 1) * tam * 0.28, x1, Math.sin(u * 6.2 + 1.4) * tam * 0.16);
    g.stroke();
    g.restore();
  }
  k.brillo(g, 0, 0, tam * 1.4, "255,200,90", 0.55 * (1 - rompe));
  g.restore();
}

export function manoLuz(g, x, y, tam, al, cae) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y + cae * tam * 0.35);
  g.rotate(cae * 1.15);
  g.globalAlpha = al;
  const piel = (px, py, w, h, r) => {
    redondo(g, px, py, w, h, r);
    const grd = g.createLinearGradient(px, py, px + w, py + h);
    grd.addColorStop(0, "rgba(230,255,255,0.95)");
    grd.addColorStop(0.45, `rgba(90,210,230,${0.92 - cae * 0.45})`);
    grd.addColorStop(1, "rgba(10,40,70,0.85)");
    g.fillStyle = grd;
    g.fill();
  };
  // muñeca
  piel(-tam * 0.16, tam * 0.42, tam * 0.32, tam * 0.38, tam * 0.1);
  // palma
  piel(-tam * 0.34, -tam * 0.05, tam * 0.68, tam * 0.62, tam * 0.18);
  // pulgar
  g.save();
  g.translate(-tam * 0.34, tam * 0.18);
  g.rotate(-0.7);
  piel(0, 0, tam * 0.22, tam * 0.4, tam * 0.1);
  g.restore();
  // cuatro dedos
  for (let i = 0; i < 4; i++) {
    const fx = -tam * 0.28 + i * tam * 0.16;
    const alto = tam * (0.48 - Math.abs(i - 1.4) * 0.06);
    piel(fx, -tam * 0.05 - alto, tam * 0.13, alto, tam * 0.06);
  }
  k.brillo(g, 0, tam * 0.1, tam * 2.2, "120,230,255", 0.35 * (1 - cae * 0.6));
  g.restore();
}

export function placaNombre(g, x, y, tam, al, rompe) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  const w = tam * 1.35, h = tam * 0.62;
  const mitad = (lado) => {
    g.save();
    g.translate(x + lado * rompe * tam * 0.28, y + rompe * tam * 0.22);
    g.rotate(lado * rompe * 0.18);
    redondo(g, -w / 2, -h / 2, w, h, 22);
    const grd = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
    grd.addColorStop(0, "rgba(255,245,250,0.2)");
    grd.addColorStop(0.4, "rgba(40,16,36,0.82)");
    grd.addColorStop(1, "rgba(8,6,14,0.92)");
    g.fillStyle = grd;
    g.fill();
    g.strokeStyle = `rgba(255,150,190,${0.85})`;
    g.lineWidth = 4;
    g.stroke();
    g.font = `800 ${Math.round(tam * 0.42)}px Figtree`;
    g.fillStyle = `rgba(255,220,235,${1 - rompe * 0.25})`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("ANA", 0, 4);
    if (rompe > 0.05) {
      g.strokeStyle = "rgba(255,255,255,0.7)";
      g.lineWidth = 3;
      g.beginPath();
      g.moveTo(0, -h / 2);
      g.lineTo(lado * 8, h / 2);
      g.stroke();
    }
    g.restore();
  };
  if (rompe < 0.08) mitad(0);
  else { mitad(-1); mitad(1); }
  k.brillo(g, x, y, tam * 2.4, "255,140,190", 0.4 * (1 - rompe * 0.5));
  g.restore();
}

// ---------------------------------------------------------------- el cuerpo de cincuenta piezas
function suma(pts, x, y, z, cabeza = false) { pts.push({ p: [x, y, z], cabeza }); }
// Tumbado en el plano de la pantalla (z = 0): la cabeza arriba, los pies abajo. Así ninguna pieza se acerca a la cámara.
export const CUERPO = [];
suma(CUERPO, 0, 1.42, 0, true);
suma(CUERPO, 0, 1.12, 0);
for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) suma(CUERPO, (c - 1.5) * 0.26, 0.82 - r * 0.24, 0);
for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) suma(CUERPO, (c - 0.5) * 0.26, -0.28 - r * 0.2, 0);
for (const s of [-1, 1]) for (let i = 0; i < 6; i++) suma(CUERPO, s * (0.62 + i * 0.2), 0.7 - i * 0.05, 0);
for (const s of [-1, 1]) for (let i = 0; i < 6; i++) suma(CUERPO, s * 0.16, -0.72 - i * 0.2, 0);

export function cuarto(g) {
  const grd = g.createLinearGradient(0, 0, 0, 1920);
  grd.addColorStop(0, "#241433");
  grd.addColorStop(0.35, "#12182e");
  grd.addColorStop(1, "#0a1018");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1080, 1920);
  // una ventana de noche, a un lado, para que el cuarto no sea una pared
  g.save();
  redondo(g, 70, 980, 180, 320, 18);
  const ven = g.createLinearGradient(70, 980, 250, 1300);
  ven.addColorStop(0, "#6a78c8");
  ven.addColorStop(1, "#1a2048");
  g.fillStyle = ven;
  g.fill();
  g.restore();
}

export function bloque(g, x, y, w, al, cabeza, calor) {
  if (al < 0.02 || w < 2) return;
  const h = w * 0.78;
  g.save();
  g.globalAlpha = al;
  redondo(g, x - w / 2, y - h / 2, w, h, w * 0.22);
  const grd = g.createLinearGradient(x - w / 2, y - h / 2, x + w / 2, y + h / 2);
  if (cabeza) {
    grd.addColorStop(0, `rgba(255,236,190,${0.95})`);
    grd.addColorStop(0.5, `rgba(255,170,60,${0.9})`);
    grd.addColorStop(1, "rgba(90,40,10,0.9)");
  } else {
    grd.addColorStop(0, "rgba(220,245,255,0.85)");
    grd.addColorStop(0.42, `rgba(70,170,190,${0.88})`);
    grd.addColorStop(1, "rgba(8,24,40,0.9)");
  }
  g.fillStyle = grd;
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.28)";
  g.lineWidth = 2;
  g.stroke();
  if (cabeza && calor > 0) k.brillo(g, x, y, w * 3.2, "255,190,80", 0.7 * calor);
  g.restore();
}

export function orbe(g, x, y, r, al) {
  if (al < 0.02 || r < 2) return;
  k.brillo(g, x, y, r * 3.4, "255,186,80", 0.85 * al);
  g.save();
  g.globalAlpha = al;
  const grd = g.createRadialGradient(x - r * 0.32, y - r * 0.36, r * 0.08, x, y, r);
  grd.addColorStop(0, "rgba(255,252,235,1)");
  grd.addColorStop(0.4, "rgba(255,176,50,0.95)");
  grd.addColorStop(1, "rgba(160,60,8,0.15)");
  g.fillStyle = grd;
  g.beginPath();
  g.arc(x, y, r, 0, 6.2832);
  g.fill();
  g.restore();
}

export function lampara(g, x, y, al) {
  if (al < 0.02) return;
  k.brillo(g, x, y, 520, "255,214,150", 0.8 * al);
  g.save();
  g.globalAlpha = al;
  g.fillStyle = "#ffe6b0";
  g.beginPath();
  g.arc(x, y, 36, 0, 6.2832);
  g.fill();
  g.strokeStyle = "rgba(255,220,160,0.8)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(x, y + 30);
  g.lineTo(x, y + 90);
  g.stroke();
  g.restore();
}
