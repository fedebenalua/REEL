// Lo que comparten los planos: la misma abeja, la misma carta, el mismo prado.
import * as k from "#kit";

const { azar } = k;

export function velo(g, fuerza = 0.62) {
  const vg = g.createLinearGradient(0, 160, 0, 700);
  vg.addColorStop(0, `rgba(8,14,32,${fuerza})`);
  vg.addColorStop(0.55, `rgba(8,14,32,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(8,14,32,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 720);
}

export function prado(g, t, sol = 1) {
  const cielo = g.createLinearGradient(0, 0, 0, 1200);
  cielo.addColorStop(0, "#14224f");
  cielo.addColorStop(0.45, "#3a6eb8");
  cielo.addColorStop(0.72, "#f2b15a");
  cielo.addColorStop(1, "#efcf78");
  g.fillStyle = cielo;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 820, 980, 900, "255,210,120", 0.55 * sol);
  g.restore();
  const colina = g.createLinearGradient(0, 980, 0, 1920);
  colina.addColorStop(0, "#7ed36a");
  colina.addColorStop(0.35, "#3eae4e");
  colina.addColorStop(1, "#1c6b32");
  g.fillStyle = colina;
  g.beginPath();
  g.moveTo(0, 1180);
  g.quadraticCurveTo(280, 1040 + 18 * Math.sin(t * 0.4), 540, 1120);
  g.quadraticCurveTo(820, 1220, 1080, 1080);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.fill();
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.28;
  g.drawImage(k.manchas, 0, 1000, 1080, 920);
  g.restore();
}

const azF = azar(41);
export const FLORES = Array.from({ length: 46 }, () => {
  const tono = ["#ff4d6d", "#ffd23f", "#c77dff", "#ff8c42", "#4cc9f0", "#f72585"][Math.floor(azF() * 6)];
  return {
    x: (azF() - 0.5) * 13,
    y: -0.15 + azF() * 1.3,
    z: 0.8 + azF() * 16,
    r: 0.28 + azF() * 0.45,
    tono,
    fase: azF() * 6.28,
    pétalos: 5 + Math.floor(azF() * 2),
  };
});

export function flor(g, x, y, r, tono, fase) {
  g.save();
  g.translate(x, y);
  g.rotate(fase);
  for (let i = 0; i < 5; i++) {
    g.rotate((Math.PI * 2) / 5);
    g.beginPath();
    g.ellipse(0, -r * 0.55, r * 0.34, r * 0.62, 0, 0, 6.2832);
    const pg = g.createRadialGradient(0, -r * 0.7, r * 0.05, 0, -r * 0.4, r * 0.7);
    pg.addColorStop(0, "#fff6ea");
    pg.addColorStop(0.45, tono);
    pg.addColorStop(1, tono);
    g.fillStyle = pg;
    g.fill();
  }
  g.beginPath();
  g.arc(0, 0, r * 0.32, 0, 6.2832);
  const cg = g.createRadialGradient(-r * 0.08, -r * 0.08, 0, 0, 0, r * 0.32);
  cg.addColorStop(0, "#fff3b0");
  cg.addColorStop(1, "#e09a14");
  g.fillStyle = cg;
  g.fill();
  g.restore();
}

// Una carta blanca. n formas negras. forma 0 = puntos, 1 = rombos. cero = un 0 de miel.
export function carta(g, x, y, w, h, n, o = {}) {
  const rot = o.rot || 0;
  const forma = o.forma || 0;
  const al = o.al ?? 1;
  if (al < 0.02 || w < 8) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(o.sx ?? 1, 1);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(20,16,8,0.28)";
  g.beginPath();
  g.ellipse(10, h * 0.46, w * 0.42, h * 0.08, 0, 0, 6.2832);
  g.fill();
  k.redondo(g, -w / 2, -h / 2, w, h, Math.min(36, w * 0.12));
  const pg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  pg.addColorStop(0, "#ffffff");
  pg.addColorStop(0.5, "#f4f1ea");
  pg.addColorStop(1, "#e4ddd0");
  g.fillStyle = pg;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.18;
  g.drawImage(k.red, -w / 2, -h / 2, w, h);
  g.restore();
  k.redondo(g, -w / 2, -h / 2, w, h, Math.min(36, w * 0.12));
  g.strokeStyle = "rgba(255,255,255,0.85)";
  g.lineWidth = 6;
  g.stroke();
  if (o.cero) {
    const u = o.cero;
    g.globalAlpha *= u;
    g.fillStyle = "#e39b12";
    g.font = `800 ${Math.round(h * 0.62)}px Figtree`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("0", 0, h * 0.04);
    g.globalAlpha /= u || 1;
  } else if (n > 0) {
    const cols = n <= 1 ? 1 : n <= 4 ? 2 : 3;
    const rows = Math.ceil(n / cols);
    const rad = Math.min(w, h) * (n === 1 ? 0.16 : 0.11);
    for (let i = 0; i < n; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const px = (c - (cols - 1) / 2) * w * 0.28;
      const py = (r - (rows - 1) / 2) * h * 0.24;
      g.fillStyle = "#1a140e";
      g.beginPath();
      if (forma === 0) g.arc(px, py, rad, 0, 6.2832);
      else {
        g.moveTo(px, py - rad);
        g.lineTo(px + rad, py);
        g.lineTo(px, py + rad);
        g.lineTo(px - rad, py);
        g.closePath();
      }
      g.fill();
    }
  }
  g.restore();
}

// Abeja de lado, cabeza a la izquierda si mira vale 1. largo = píxeles de la cabeza a la cola.
export function abeja(g, x, y, largo, t, o = {}) {
  const s = largo / 300;
  const vuelo = o.vuelo ?? 1;
  const fase = (o.fase || 0) + t * (vuelo > 0.45 ? 34 : 2.4);
  const ala = Math.sin(fase) * (0.2 + vuelo * 0.8);
  const respira = (1 - vuelo) * Math.sin(t * 2.1) * 4;
  g.save();
  g.translate(x, y + respira);
  g.rotate(o.rumbo || 0);
  g.scale(s * (o.mira ?? 1), s);
  // sombra
  g.fillStyle = "rgba(20,30,10,0.22)";
  g.beginPath();
  g.ellipse(20, 78, 90, 18, 0, 0, 6.2832);
  g.fill();
  // alas (detrás del cuerpo)
  const dibujaAla = (signo, amp) => {
    g.save();
    g.translate(-10, -20);
    g.rotate(signo * (0.35 + amp));
    g.beginPath();
    g.ellipse(70, -30, 78, 28, -0.4, 0, 6.2832);
    g.fillStyle = `rgba(214,236,255,${0.28 + 0.12 * vuelo})`;
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.55)";
    g.lineWidth = 2;
    g.stroke();
    g.beginPath();
    g.moveTo(8, 0);
    g.quadraticCurveTo(50, -20, 120, -28);
    g.stroke();
    g.restore();
  };
  g.save();
  g.globalCompositeOperation = "lighter";
  dibujaAla(-1, ala * 0.85);
  dibujaAla(1, -ala * 0.65);
  g.restore();
  // abdomen
  g.beginPath();
  g.ellipse(78, 6, 92, 48, 0, 0, 6.2832);
  const ag = g.createLinearGradient(0, -42, 0, 54);
  ag.addColorStop(0, "#ffd15a");
  ag.addColorStop(0.45, "#f0a020");
  ag.addColorStop(1, "#c46a12");
  g.fillStyle = ag;
  g.fill();
  g.save();
  g.beginPath();
  g.ellipse(78, 6, 92, 48, 0, 0, 6.2832);
  g.clip();
  g.fillStyle = "#1a120c";
  for (const bx of [40, 78, 116]) g.fillRect(bx, -50, 22, 100);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.25;
  g.drawImage(k.manchas, -20, -50, 200, 110);
  g.restore();
  // tórax
  g.beginPath();
  g.ellipse(-8, 0, 52, 46, 0, 0, 6.2832);
  const tg = g.createRadialGradient(-20, -18, 4, -8, 0, 52);
  tg.addColorStop(0, "#fff1c4");
  tg.addColorStop(0.5, "#e2b34a");
  tg.addColorStop(1, "#8a5a18");
  g.fillStyle = tg;
  g.fill();
  g.save();
  g.beginPath();
  g.ellipse(-8, 0, 52, 46, 0, 0, 6.2832);
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.manchas, -70, -50, 130, 100);
  g.restore();
  // cabeza
  g.beginPath();
  g.arc(-62, 2, 34, 0, 6.2832);
  const hg = g.createRadialGradient(-74, -10, 2, -62, 2, 36);
  hg.addColorStop(0, "#5a3a18");
  hg.addColorStop(1, "#1a100a");
  g.fillStyle = hg;
  g.fill();
  // ojos
  g.beginPath();
  g.ellipse(-78, -2, 16, 20, -0.3, 0, 6.2832);
  g.fillStyle = "#140e0a";
  g.fill();
  g.beginPath();
  g.ellipse(-84, -8, 5, 7, 0, 0, 6.2832);
  g.fillStyle = "rgba(255,220,120,0.85)";
  g.fill();
  // antenas
  g.strokeStyle = "#1a120c";
  g.lineWidth = 4;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-78, -24);
  g.quadraticCurveTo(-110, -70, -70, -78);
  g.moveTo(-70, -22);
  g.quadraticCurveTo(-40, -78, -8, -70);
  g.stroke();
  g.fillStyle = "#1a120c";
  g.beginPath();
  g.arc(-70, -78, 6, 0, 6.2832);
  g.arc(-8, -70, 6, 0, 6.2832);
  g.fill();
  // patas
  g.strokeStyle = "#1a120c";
  g.lineWidth = 5;
  const pata = (x0, y0, x1, y1) => {
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo(x0, y1, x1, y1);
    g.stroke();
  };
  const suelo = 36 + (1 - vuelo) * 8;
  pata(-30, 30, -48, suelo);
  pata(-8, 36, -6, suelo + 6);
  pata(16, 34, 28, suelo);
  g.restore();
}

export function gota(g, x, y, r, llena = 1) {
  g.save();
  g.translate(x, y);
  g.beginPath();
  g.moveTo(0, -r * 1.15);
  g.bezierCurveTo(r * 0.95, -r * 0.2, r * 0.85, r * 0.85, 0, r);
  g.bezierCurveTo(-r * 0.85, r * 0.85, -r * 0.95, -r * 0.2, 0, -r * 1.15);
  g.closePath();
  const gg = g.createLinearGradient(-r, -r, r, r);
  if (llena > 0.5) {
    gg.addColorStop(0, "#fff1b0");
    gg.addColorStop(0.45, "#f0a818");
    gg.addColorStop(1, "#d06a08");
  } else {
    gg.addColorStop(0, "rgba(255,255,255,0.55)");
    gg.addColorStop(1, "rgba(190,220,255,0.28)");
  }
  g.fillStyle = gg;
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 3;
  g.stroke();
  k.reflejo(g, -r * 0.35, -r * 0.55, r * 0.22, r * 0.7, 0.45);
  g.restore();
}

export function sesamo(g, x, y, s, ang = -0.4) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.fillStyle = "rgba(40,24,8,0.25)";
  g.beginPath();
  g.ellipse(18, 36, 150, 28, 0, 0, 6.2832);
  g.fill();
  g.beginPath();
  g.moveTo(-170, 0);
  g.bezierCurveTo(-80, -78, 90, -70, 180, 0);
  g.bezierCurveTo(90, 72, -70, 78, -170, 0);
  g.closePath();
  const sg = g.createLinearGradient(0, -70, 0, 70);
  sg.addColorStop(0, "#f6e2b8");
  sg.addColorStop(0.45, "#e2c07a");
  sg.addColorStop(1, "#b8833e");
  g.fillStyle = sg;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.red, -180, -80, 380, 160);
  g.strokeStyle = "rgba(120,70,20,0.45)";
  g.lineWidth = 3;
  for (const yy of [-28, -8, 12, 30]) {
    g.beginPath();
    g.moveTo(-140, yy);
    g.quadraticCurveTo(0, yy - 10, 150, yy + 4);
    g.stroke();
  }
  g.restore();
  g.restore();
}

// Cerebro pequeño, ilustrado, con pliegues. s = ancho en píxeles.
export function cerebro(g, x, y, s, pulso = 0) {
  g.save();
  g.translate(x, y);
  const e = 1 + pulso * 0.06;
  g.scale((s / 220) * e, (s / 220) * e);
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, 0, 0, 260, "255,150,190", 0.35 + pulso * 0.4);
  g.restore();
  g.beginPath();
  g.moveTo(-90, 10);
  g.bezierCurveTo(-100, -70, -40, -100, 0, -92);
  g.bezierCurveTo(40, -102, 100, -70, 96, 8);
  g.bezierCurveTo(110, 50, 70, 96, 10, 100);
  g.bezierCurveTo(-50, 110, -100, 70, -90, 10);
  const cg = g.createLinearGradient(-80, -80, 80, 90);
  cg.addColorStop(0, "#ffd0e0");
  cg.addColorStop(0.5, "#f098b8");
  cg.addColorStop(1, "#c45b86");
  g.fillStyle = cg;
  g.fill();
  g.save();
  g.clip();
  g.strokeStyle = "rgba(120,40,70,0.55)";
  g.lineWidth = 4;
  const pl = [[-70, -20, -20, -50, 20, -10], [10, -70, 50, -20, 70, 10], [-40, 10, 10, 40, -20, 70], [20, 20, 60, 50, 30, 80], [-80, 20, -40, 50, -70, 70]];
  for (const [x0, y0, x1, y1, x2, y2] of pl) {
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo(x1, y1, x2, y2);
    g.stroke();
  }
  g.restore();
  // surco central
  g.strokeStyle = "rgba(90,30,50,0.65)";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(0, -88);
  g.quadraticCurveTo(8, 0, -4, 96);
  g.stroke();
  g.restore();
}

// Cabeza de perfil, mirando a la izquierda, con el cerebro dentro. s ~ 1 llena media pantalla.
export function cabeza(g, x, y, s, al, brilloC = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.beginPath();
  g.moveTo(40, 210);
  g.bezierCurveTo(70, 150, 120, 90, 150, 20);
  g.bezierCurveTo(190, -70, 170, -180, 80, -230);
  g.bezierCurveTo(-20, -280, -150, -260, -200, -180);
  g.bezierCurveTo(-250, -110, -230, -20, -210, 30);
  g.lineTo(-250, 70);
  g.lineTo(-214, 86);
  g.lineTo(-230, 120);
  g.lineTo(-200, 132);
  g.bezierCurveTo(-180, 180, -80, 200, -20, 210);
  g.closePath();
  const hg = g.createLinearGradient(-180, -200, 80, 180);
  hg.addColorStop(0, "#f2c7a2");
  hg.addColorStop(0.55, "#e0a078");
  hg.addColorStop(1, "#b86a48");
  g.fillStyle = hg;
  g.fill();
  g.save();
  g.clip();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.22;
  g.drawImage(k.manchas, -260, -280, 460, 520);
  g.restore();
  g.save();
  g.globalAlpha *= 0.95;
  cerebro(g, -40, -60, 250 * brilloC, 0);
  g.restore();
  g.restore();
}
