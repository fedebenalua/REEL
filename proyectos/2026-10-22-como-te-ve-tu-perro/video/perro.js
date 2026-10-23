// Tu perro de cuerpo entero: de frente (sentado o corriendo hacia ti) y de espaldas (sentado mirando lo que tiene
// delante, o corriendo hacia allí). Las medidas, en las de su cara (la cabeza mide unos 1000 de ancho y su centro es
// (0, 0)); el suelo queda en y = SUELO.
import * as k from "#kit";
import { Path2D } from "@napi-rs/canvas";
import { cara } from "./mundo.js";

const { azar, lienzo, mez, tramo } = k;
export const SUELO = 1950;
const NEGRO = [22, 22, 26], NEGRO_LUZ = [96, 102, 118], BLANCO = [246, 244, 238], BLANCO_SOMBRA = [190, 184, 180];

// Pinta pelo dentro del camino P (en un lienzo cuyo origen está en (ox, oy)): blanco(x, y) dice dónde es blanco,
// dir(x, y) hacia dónde cae, largo, cuántos trazos.
function pelo(c, P, ox, oy, caja, n, sem, blanco, dir, largo = [14, 30], luzDe = [-1, -1]) {
  const az = azar(sem); c.lineCap = "round";
  const [x0, y0, w, h] = caja;
  for (let i = 0; i < n; i++) {
    const x = x0 + az() * w, y = y0 + az() * h;
    if (!c.isPointInPath(P, x + ox, y + oy)) continue;
    const b = blanco(x, y), [ux, uy] = dir(x, y), L = largo[0] + az() * (largo[1] - largo[0]);
    const luz = Math.max(0, Math.min(1, 0.5 + (luzDe[0] * x + luzDe[1] * y) / 1400)) * (az() < 0.5 ? 1 : 0.4);
    const negro = NEGRO.map((v, j) => v + (NEGRO_LUZ[j] - v) * luz);
    const bl = BLANCO.map((v, j) => v + (BLANCO_SOMBRA[j] - v) * az() * 0.8);
    const col = negro.map((v, j) => v + (bl[j] - v) * b);
    c.strokeStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${0.55 + az() * 0.4})`;
    c.lineWidth = 1.6 + az() * 2.8;
    const bx = (az() - 0.5) * 0.4;
    c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + ux * L * 0.5 - uy * L * bx, y + uy * L * 0.5 + ux * L * bx, x + ux * L, y + uy * L); c.stroke();
  }
}
// Sombra y luz por encima de lo pintado en un lienzo (solo donde ya hay algo).
function volumen(l, fn) {
  const c = l.getContext("2d"), antes = lienzo(l.width, l.height);
  antes.getContext("2d").drawImage(l, 0, 0);
  c.save(); fn(c); c.globalCompositeOperation = "destination-in"; c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(antes, 0, 0); c.restore();
}

// ---------------------------------------------------------------- de frente
// El cuerpo sentado de frente: el pecho blanco de pelo largo, los hombros negros y los muslos de atrás a los lados.
const OXF = 900, OYF = -200;
// Los muslos de atrás (sentado), a los lados: negros, apoyados en el suelo, detrás de las patas.
const MUSLOS = (() => {
  const l = lienzo(1800, 2300), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, OXF, OYF);
  const M = new Path2D();
  M.moveTo(-280, 1250); M.bezierCurveTo(-420, 1300, -520, 1500, -500, 1700); M.bezierCurveTo(-490, 1860, -440, 1950, -330, 1950); M.lineTo(330, 1950); M.bezierCurveTo(440, 1950, 490, 1860, 500, 1700); M.bezierCurveTo(520, 1500, 420, 1300, 280, 1250); M.closePath();
  c.fillStyle = "#16161a"; c.fill(M);
  pelo(c, M, OXF, OYF, [-560, 1240, 1120, 720], 11000, 61, () => 0, (x) => [Math.sign(x) * 0.3, 1], [10, 22]);
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, OXF, OYF); c.globalCompositeOperation = "multiply";
    const g2 = c.createLinearGradient(-520, 0, 520, 0); g2.addColorStop(0, "rgba(150,150,160,1)"); g2.addColorStop(0.3, "rgba(255,255,255,1)"); g2.addColorStop(1, "rgba(70,70,80,1)"); c.fillStyle = g2; c.fillRect(-560, 1200, 1120, 800);
  });
  return l;
})();
// El tronco de frente: el pecho blanco de pelo largo que cuelga en flecos entre las patas, y los hombros negros.
const CUERPO_F = (() => {
  const l = lienzo(1800, 2300), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, OXF, OYF);
  const P = new Path2D();
  P.moveTo(-440, 230); P.bezierCurveTo(-600, 450, -640, 850, -560, 1200); P.bezierCurveTo(-480, 1450, -300, 1600, -130, 1630);
  P.quadraticCurveTo(0, 1660, 130, 1630); P.bezierCurveTo(300, 1600, 480, 1450, 560, 1200); P.bezierCurveTo(640, 850, 600, 450, 440, 230); P.closePath();
  c.fillStyle = "#1a1a1e"; c.fill(P);
  const blancoP = (x, y) => 1 - tramo(Math.abs(x) - (y - 300) * 0.12, 250, 330);
  c.save(); c.clip(P);
  const pg = c.createRadialGradient(0, 800, 80, 0, 800, 560); pg.addColorStop(0, "rgba(246,244,238,1)"); pg.addColorStop(0.8, "rgba(236,232,226,1)"); pg.addColorStop(1, "rgba(236,232,226,0)");
  c.fillStyle = pg; c.fillRect(-700, 200, 1400, 1400);
  c.restore();
  pelo(c, P, OXF, OYF, [-660, 220, 1320, 1460], 34000, 62, blancoP, (x, y) => [x / 1000 * 0.4 + Math.sin(y / 60 + x / 90) * 0.18, 1], [26, 70]);
  // los flecos de abajo, que se salen del contorno
  { const az = azar(63); c.lineCap = "round";
    for (let i = 0; i < 2600; i++) {
      const x = (az() - 0.5) * 760, y0 = 1540 + az() * 70 - Math.abs(x) * 0.3, L = 40 + az() * 70, f = 0.8 + az() * 0.25;
      c.strokeStyle = `rgba(${246 * f | 0},${244 * f | 0},${238 * f | 0},${0.5 + az() * 0.4})`; c.lineWidth = 1.5 + az() * 2.5;
      c.beginPath(); c.moveTo(x, y0); c.quadraticCurveTo(x + (az() - 0.5) * 20, y0 + L * 0.6, x + x * 0.05 + (az() - 0.5) * 24, y0 + L); c.stroke();
    } }
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, OXF, OYF); c.globalCompositeOperation = "multiply";
    const sh = c.createRadialGradient(0, 380, 200, 0, 380, 620); sh.addColorStop(0, "rgba(90,90,96,1)"); sh.addColorStop(1, "rgba(255,255,255,1)");
    c.fillStyle = sh; c.fillRect(-900, 200, 1800, 2100);
    const ld = c.createLinearGradient(-600, 0, 600, 0); ld.addColorStop(0, "rgba(170,170,176,1)"); ld.addColorStop(0.35, "rgba(255,255,255,1)"); ld.addColorStop(0.7, "rgba(240,240,240,1)"); ld.addColorStop(1, "rgba(110,110,118,1)");
    c.fillStyle = ld; c.fillRect(-900, 200, 1800, 2100);
    const bt = c.createLinearGradient(0, 1350, 0, 1700); bt.addColorStop(0, "rgba(255,255,255,1)"); bt.addColorStop(1, "rgba(175,170,168,1)");
    c.fillStyle = bt; c.fillRect(-900, 1250, 1800, 400);
  });
  return l;
})();
// Una pata de delante: blanca, de pelo corto con flecos detrás, con su pie; el giro, arriba en el centro.
const PATA = (() => {
  const l = lienzo(260, 900), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, 130, 20);
  const P = new Path2D();
  P.moveTo(-80, 0); P.bezierCurveTo(-90, 300, -70, 600, -62, 760); P.bezierCurveTo(-100, 800, -95, 860, -40, 868); P.lineTo(40, 868);
  P.bezierCurveTo(95, 860, 100, 800, 62, 760); P.bezierCurveTo(70, 600, 90, 300, 80, 0); P.closePath();
  c.fillStyle = "#e8e4dc"; c.fill(P);
  pelo(c, P, 130, 20, [-110, 0, 220, 880], 5000, 71, () => 1, () => [0, 1], [10, 22]);
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, 130, 20); c.globalCompositeOperation = "multiply";
    const lg = c.createLinearGradient(-90, 0, 90, 0); lg.addColorStop(0, "rgba(255,255,255,1)"); lg.addColorStop(0.5, "rgba(245,245,245,1)"); lg.addColorStop(1, "rgba(150,148,150,1)");
    c.fillStyle = lg; c.fillRect(-130, 0, 260, 900);
  });
  // los dedos
  c.strokeStyle = "rgba(120,110,105,0.7)"; c.lineWidth = 4; c.lineCap = "round";
  for (const x of [-30, 0, 30]) { c.beginPath(); c.moveTo(x, 830); c.lineTo(x, 866); c.stroke(); }
  return l;
})();
// Un pie de atrás asomando delante del muslo (blanco).
function pieAtras(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, 1);
  const pg = g.createRadialGradient(-10, -20, 10, 0, 0, 110); pg.addColorStop(0, "#f4f2ec"); pg.addColorStop(1, "#a8a4a0");
  g.fillStyle = pg; g.beginPath(); g.ellipse(0, 0, 105, 55, 0, 0, 6.2832); g.fill();
  g.strokeStyle = "rgba(120,110,105,0.6)"; g.lineWidth = 4; for (const dx of [-30, 0, 30]) { g.beginPath(); g.moveTo(dx, 20); g.lineTo(dx, 52); g.stroke(); }
  g.restore();
}

// Tu perro de frente, con el centro de su cabeza en (x, y) y a escala esc.
//   corre: de 0 (sentado) a 1 (corriendo hacia ti) · paso: la fase de la carrera · y lo de la cara (orejas, inclina,
//   contento, olfatea, mira, noche, oscuro...).
export function perroFrente(g, t, x, y, esc, op = {}) {
  const { corre = 0, paso = 0 } = op;
  const f = paso * 2 * Math.PI, bota = corre * Math.abs(Math.sin(f)) * 70;
  g.save();
  g.translate(x, y); g.scale(esc, esc);
  // la sombra en el suelo
  g.fillStyle = "rgba(20,15,5,0.35)"; g.beginPath(); g.ellipse(0, SUELO + 10, 560, 90, 0, 0, 6.2832); g.fill();
  g.translate(0, -bota);
  // sentado: los muslos de atrás, detrás de todo, y sus pies delante
  if (corre < 0.99) { g.save(); g.globalAlpha = 1 - corre; g.drawImage(MUSLOS, -OXF, OYF); for (const s of [-1, 1]) pieAtras(g, s * 370, SUELO - 30, s); g.restore(); }
  // las patas de delante, que salen de debajo del pecho: sentado, rectas; corriendo, una adelante (más corta: viene
  // hacia ti) y otra atrás
  for (const s of [-1, 1]) {
    const fase = Math.sin(f + (s > 0 ? Math.PI : 0));
    const alza = corre * Math.max(0, fase) * 0.34, dx = s * mez(185, 210, corre);
    g.save(); g.translate(dx, 1330); g.rotate(-s * corre * 0.05);
    g.scale(1.4 + corre * Math.max(0, fase) * 0.15, 0.71 * (1 - alza));
    g.drawImage(PATA, -130, -20);
    g.restore();
  }
  g.save(); g.translate(0, corre * 60); g.scale(1, 1 - 0.1 * corre);
  g.drawImage(CUERPO_F, -OXF, OYF);
  g.restore();
  g.restore();
  cara(g, t, x, y - bota * esc, esc, { ...op, pecho: false });
}

// ---------------------------------------------------------------- de espaldas
// Sentado, de espaldas, mirando lo que tiene delante: la nuca negra con las orejas, el collar blanco que da la vuelta al
// cuello, la espalda, los muslos y la cola en el suelo con la punta blanca. Origen: el centro de la cabeza.
const OXE = 800, OYE = 560;
const ESPALDA = (() => {
  const l = lienzo(1600, 2700), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, OXE, OYE);
  const P = new Path2D();
  // el cuerpo: de los hombros a las caderas, que se abren abajo (sentado)
  P.moveTo(-300, 300); P.bezierCurveTo(-420, 520, -400, 900, -470, 1200); P.bezierCurveTo(-600, 1450, -640, 1800, -480, 1930); P.quadraticCurveTo(0, 1990, 480, 1930);
  P.bezierCurveTo(640, 1800, 600, 1450, 470, 1200); P.bezierCurveTo(400, 900, 420, 520, 300, 300); P.closePath();
  c.fillStyle = "#18181c"; c.fill(P);
  { const az = azar(83); c.lineCap = "round";
    for (let i = 0; i < 9000; i++) {
      const x = (az() - 0.5) * 1300, y = 300 + az() * 1650;
      if (!c.isPointInPath(P, x + OXE, y + OYE) || c.isPointInPath(P, x + OXE + Math.sign(x) * 30, y + OYE)) continue;
      const L = 20 + az() * 40, luz = x < 0 ? 0.6 : 0.15;
      c.strokeStyle = `rgba(${22 + 80 * luz * az() | 0},${22 + 86 * luz * az() | 0},${26 + 100 * luz * az() | 0},0.8)`; c.lineWidth = 2 + az() * 2;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.sign(x) * L * 0.6, y + L * 0.3, x + Math.sign(x) * L, y + L * 0.8); c.stroke();
    } }
  pelo(c, P, OXE, OYE, [-640, 240, 1280, 1740], 36000, 81, () => 0, (x, y) => [x / 900 * 0.4, 1], [18, 44], [-1, -0.4]);
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, OXE, OYE); c.globalCompositeOperation = "multiply";
    const ld = c.createLinearGradient(-620, 0, 620, 0); ld.addColorStop(0, "rgba(150,150,158,1)"); ld.addColorStop(0.35, "rgba(255,255,255,1)"); ld.addColorStop(0.65, "rgba(235,235,238,1)"); ld.addColorStop(1, "rgba(100,100,108,1)");
    c.fillStyle = ld; c.fillRect(-800, 0, 1600, 2700);
    const sh = c.createLinearGradient(0, 250, 0, 700); sh.addColorStop(0, "rgba(110,110,116,1)"); sh.addColorStop(1, "rgba(255,255,255,1)");
    c.fillStyle = sh; c.fillRect(-800, 200, 1600, 600);
    c.globalCompositeOperation = "screen";
    const hl = c.createRadialGradient(-200, 900, 50, -200, 900, 600); hl.addColorStop(0, "rgba(120,130,160,0.35)"); hl.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = hl; c.fillRect(-800, 200, 1600, 2000);
  });
  return l;
})();
// El collar blanco: una melena de pelo largo que da la vuelta al cuello, más ancha que la cabeza.
const COLLAR = (() => {
  const l = lienzo(1400, 900), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, 700, 0);
  const P = new Path2D();
  P.moveTo(-380, 230); P.bezierCurveTo(-520, 260, -580, 420, -540, 560); P.bezierCurveTo(-440, 700, -200, 740, 0, 735);
  P.bezierCurveTo(200, 740, 440, 700, 540, 560); P.bezierCurveTo(580, 420, 520, 260, 380, 230); P.closePath();
  c.save(); c.clip(P); const cgr = c.createLinearGradient(-540, 0, 540, 0); cgr.addColorStop(0, "#e8e4dc"); cgr.addColorStop(0.3, "#e8e4dc"); cgr.addColorStop(0.38, "#1a1a1e"); cgr.addColorStop(0.62, "#1a1a1e"); cgr.addColorStop(0.7, "#e8e4dc"); cgr.addColorStop(1, "#e8e4dc"); c.fillStyle = cgr; c.fillRect(-700, 0, 1400, 900); c.restore();
  const blancoC = (x, y) => tramo(Math.abs(x), 170, 300) + tramo(y, 600, 700);
  pelo(c, P, 700, 0, [-600, 200, 1200, 560], 16000, 87, blancoC, (x, y) => [x / 700, 0.8], [24, 60], [-1, -0.3]);
  // los mechones de fuera, que se salen del borde
  { const az = azar(89); c.lineCap = "round";
    for (let i = 0; i < 2400; i++) {
      const a = Math.PI * (az() < 0.5 ? 0.05 + az() * 0.3 : 0.65 + az() * 0.3), rx = 520 + az() * 30, ry = 260;
      const x0 = -Math.cos(a) * rx, y0 = 480 + Math.sin(a) * ry * 0.95, L = 30 + az() * 70, f = 0.78 + az() * 0.25;
      c.strokeStyle = `rgba(${246 * f | 0},${244 * f | 0},${238 * f | 0},${0.45 + az() * 0.4})`; c.lineWidth = 1.5 + az() * 2.5;
      c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 * 1.04, y0 + L * 0.5, x0 * 1.06 + (az() - 0.5) * 20, y0 + L); c.stroke();
    } }
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, 700, 0); c.globalCompositeOperation = "multiply";
    const sh = c.createLinearGradient(0, 220, 0, 420); sh.addColorStop(0, "rgba(120,118,120,1)"); sh.addColorStop(1, "rgba(255,255,255,1)");
    c.fillStyle = sh; c.fillRect(-700, 200, 1400, 260);
    const ld = c.createLinearGradient(-600, 0, 600, 0); ld.addColorStop(0, "rgba(220,220,224,1)"); ld.addColorStop(0.4, "rgba(255,255,255,1)"); ld.addColorStop(1, "rgba(140,140,148,1)");
    c.fillStyle = ld; c.fillRect(-700, 0, 1400, 900);
  });
  return l;
})();
// La cabeza por detrás: el cráneo, más estrecho arriba, con el pelo de las mejillas asomando a los lados.
const NUCA = (() => {
  const l = lienzo(1200, 1100), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, 600, 560);
  const P = new Path2D();
  P.moveTo(0, -400); P.bezierCurveTo(-220, -410, -360, -300, -390, -120); P.bezierCurveTo(-420, 20, -470, 130, -450, 230);
  P.bezierCurveTo(-400, 360, -230, 420, 0, 420); P.bezierCurveTo(230, 420, 400, 360, 450, 230); P.bezierCurveTo(470, 130, 420, 20, 390, -120); P.bezierCurveTo(360, -300, 220, -410, 0, -400); P.closePath();
  c.fillStyle = "#18181c"; c.fill(P);
  pelo(c, P, 600, 560, [-480, -420, 960, 860], 22000, 91, () => 0, (x, y) => { const d = Math.hypot(x, y + 300) || 1; return [x / d, (y + 300) / d]; }, [14, 30], [-1, -1]);
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, 600, 560); c.globalCompositeOperation = "multiply";
    const bo = c.createRadialGradient(-110, -160, 60, 0, 0, 500); bo.addColorStop(0, "rgba(255,255,255,1)"); bo.addColorStop(1, "rgba(80,80,88,1)");
    c.fillStyle = bo; c.fillRect(-600, -560, 1200, 1100);
    c.globalCompositeOperation = "screen";
    const hl = c.createRadialGradient(-150, -250, 20, -150, -250, 340); hl.addColorStop(0, "rgba(140,150,180,0.45)"); hl.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = hl; c.fillRect(-600, -560, 1200, 1100);
  });
  return l;
})();
// El borde de luz de la cabeza a contraluz: un halo dorado por el contorno de pelo.
const BORDE = (() => {
  const l = lienzo(1200, 1100), c = l.getContext("2d");
  c.drawImage(NUCA, 0, 0);
  c.globalCompositeOperation = "source-in"; c.fillStyle = "rgb(255,200,120)"; c.fillRect(0, 0, 1200, 1100);
  // solo el borde: se le resta la misma forma, encogida
  c.globalCompositeOperation = "destination-out"; c.filter = "blur(18px)"; c.drawImage(NUCA, 30, 22, 1140, 1056); c.filter = "none";
  c.globalCompositeOperation = "source-over"; const b = lienzo(1200, 1100), bc = b.getContext("2d"); bc.filter = "blur(6px)"; bc.drawImage(l, 0, 0); return b;
  return l;
})();
// Una oreja por detrás: negra por fuera, con la punta doblada hacia delante (no se ve la punta: solo el pliegue).
const OREJA_E = (() => {
  const l = lienzo(420, 520), c = l.getContext("2d");
  c.setTransform(1, 0, 0, 1, 210, 480);
  const P = new Path2D();
  P.moveTo(-170, 0); P.bezierCurveTo(-160, -150, -110, -300, -40, -380); P.quadraticCurveTo(10, -420, 60, -370); P.bezierCurveTo(120, -280, 160, -140, 175, 0); P.closePath();
  c.fillStyle = "#18181c"; c.fill(P);
  pelo(c, P, 210, 480, [-180, -420, 360, 420], 2600, 97, () => 0, () => [0, -1], [12, 24]);
  volumen(l, (c) => {
    c.setTransform(1, 0, 0, 1, 210, 480); c.globalCompositeOperation = "screen";
    const hg = c.createLinearGradient(-170, 0, 170, 0); hg.addColorStop(0, "rgba(130,140,170,0.35)"); hg.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = hg; c.fillRect(-210, -480, 420, 520);
    c.globalCompositeOperation = "multiply";
    const pg = c.createLinearGradient(0, -420, 0, -280); pg.addColorStop(0, "rgba(70,70,80,1)"); pg.addColorStop(1, "rgba(255,255,255,1)");
    c.fillStyle = pg; c.fillRect(-210, -480, 420, 220);
  });
  return l;
})();
// La cola: sale de abajo y se apoya en el suelo, curvada hacia un lado, con la punta blanca. menea: de 0 a 1.
function cola(g, t, menea, sube = 0) {
  const n = 34;
  let x = 80, y = 1880, a = mez(0.25, -1.2, sube) + Math.sin(t * 13) * 0.35 * menea;
  for (let i = 0; i <= n; i++) {
    const u = i / n, w = mez(70, 38, u) + 26 * Math.sin(u * Math.PI);
    const blanco = tramo(u, 0.78, 0.86);
    const col = NEGRO.map((v, j) => v + (BLANCO[j] - v) * blanco);
    // pelo largo: un poco de luz arriba
    g.fillStyle = `rgb(${col.join(",")})`; g.beginPath(); g.arc(x, y, w, 0, 6.2832); g.fill();
    g.fillStyle = `rgba(${blanco > 0.5 ? "255,255,255" : "110,118,140"},0.25)`; g.beginPath(); g.arc(x - w * 0.2, y - w * 0.3, w * 0.6, 0, 6.2832); g.fill();
    a += mez(0.04, -0.01, sube) + Math.sin(t * 13 - u * 3) * 0.04 * menea;
    x += Math.cos(a) * 16; y += Math.sin(a) * 16;
  }
}

// Tu perro de espaldas con el centro de su cabeza en (x, y), a escala esc.
//   orejas: de 0 (relajadas) a 1 (tiesas) · gira: la cabeza girada a un lado (-1 a 1) · inclina: ladeada · menea: la
//   cola · corre: de 0 (sentado) a 1 (corriendo hacia delante, alejándose) · paso: la fase de la carrera.
export function perroEspalda(g, t, x, y, esc, { orejas = 0, gira = 0, inclina = 0, menea = 0, corre = 0, paso = 0, contraluz = 1 } = {}) {
  const f = paso * 2 * Math.PI, bota = corre * Math.abs(Math.sin(f)) * 80;
  g.save(); g.translate(x, y - bota * esc); g.scale(esc, esc);
  // la sombra
  g.fillStyle = "rgba(20,15,5,0.35)"; g.beginPath(); g.ellipse(0, SUELO + 20 + bota, 620, 100, 0, 0, 6.2832); g.fill();
  if (corre > 0.01) {
    // corriendo: las patas de atrás se ven patear (blancas abajo)
    for (const s of [-1, 1]) {
      const fase = Math.sin(f + (s > 0 ? Math.PI : 0));
      g.save(); g.translate(s * 300, 1500); g.scale(1, 1 - corre * Math.max(0, fase) * 0.45);
      g.drawImage(PATA, -130, -20, 260, 560);
      g.restore();
    }
  }
  cola(g, t, menea, corre);
  g.save(); g.translate(0, corre * 160); g.scale(1, 1 - 0.25 * corre);
  g.drawImage(ESPALDA, -OXE, -OYE);
  g.restore();
  g.drawImage(COLLAR, -700, 0);
  if (corre < 0.5) for (const sd of [-1, 1]) { g.save(); g.globalAlpha = 1 - 2 * corre; const fg = g.createRadialGradient(sd * 470, 1900, 10, sd * 470, 1910, 110); fg.addColorStop(0, "#f4f2ec"); fg.addColorStop(1, "#a8a4a0"); g.fillStyle = fg; g.beginPath(); g.ellipse(sd * 480, 1915, 100, 50, 0, 0, 6.2832); g.fill(); g.restore(); }
  // la cabeza
  g.save(); g.translate(gira * 60, 0); g.rotate(inclina);
  for (const s of [-1, 1]) {
    g.save(); g.translate(s * 240 + gira * 40, -290 + 20 * (1 - orejas)); g.scale(s, 1); g.rotate(-mez(0.42, 0.18, orejas) - corre * 0.3 * (1 + Math.sin(t * 22 + s)));
    g.drawImage(OREJA_E, -210, -480, 420 * 1.15, 520 * 1.15);
    g.restore();
  }
  g.scale(1 - Math.abs(gira) * 0.08, 1);
  g.drawImage(NUCA, -600, -560);
  // el sol de delante le hace un borde de luz dorado en el pelo
  if (contraluz > 0.01) { g.save(); g.globalAlpha = 0.7 * contraluz; g.globalCompositeOperation = "lighter"; g.drawImage(BORDE, -600, -560); g.restore(); }
  g.restore();
  g.restore();
}
