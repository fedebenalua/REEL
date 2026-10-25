// La puerta, la bisagra y las manos. Lo que se repite, una sola vez.
import * as k from "#kit";
import { v } from "#voz";

export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
const mezCam = (a, b, u) => ({ x: k.mez(a.x, b.x, u), y: k.mez(a.y, b.y, u), s: Math.exp(k.mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, k.suave(k.tramo(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}

export function velo(g, a = 0.82) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 140, 0, 560);
  gr.addColorStop(0, `rgba(18, 8, 6, ${a})`);
  gr.addColorStop(1, "rgba(18, 8, 6, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 120, 1080, 480);
  g.restore();
}
export function viñeta(g, a = 0.42) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 1000, 380, 540, 1000, 1200);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(40, 10, 6, ${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

const laton = (g, x0, y0, x1, y1) => {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#4e2e0c");
  gr.addColorStop(0.16, "#e7c56a");
  gr.addColorStop(0.4, "#fff6d0");
  gr.addColorStop(0.58, "#d09a34");
  gr.addColorStop(0.82, "#7a4e12");
  gr.addColorStop(1, "#2c1808");
  return gr;
};
const acero = (g, x0, y0, x1, y1) => {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, "#1c242c");
  gr.addColorStop(0.22, "#c5d0dc");
  gr.addColorStop(0.48, "#f8fbff");
  gr.addColorStop(0.72, "#7e8b9a");
  gr.addColorStop(1, "#141a20");
  return gr;
};

export function pasillo(g, opt = {}) {
  const manana = opt.manana || 0;
  const gr = g.createLinearGradient(-900, -1400, 700, 900);
  gr.addColorStop(0, k.mezColor("#ffb089", "#ffe1a8", manana));
  gr.addColorStop(0.45, k.mezColor("#e25a3c", "#f0a060", manana));
  gr.addColorStop(1, k.mezColor("#6e2430", "#b85a38", manana));
  g.fillStyle = gr;
  g.fillRect(-2200, -2200, 4400, 4400);
  g.save();
  g.globalAlpha = 0.16;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -800, -1200, 2200, 2400);
  g.restore();
  const luz = g.createRadialGradient(opt.luzX ?? -420, opt.luzY ?? -680, 30, opt.luzX ?? -420, opt.luzY ?? -680, 980);
  luz.addColorStop(0, manana > 0.4 ? "rgba(255,244,210,0.72)" : "rgba(255,220,170,0.42)");
  luz.addColorStop(1, "rgba(255,220,170,0)");
  g.fillStyle = luz;
  g.fillRect(-2200, -2200, 4400, 4400);
  if (opt.ventana) {
    g.save();
    g.translate(520, -460);
    g.fillStyle = "#fff4d2";
    k.redondo(g, 0, 0, 280, 360, 12);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.85)";
    g.fillRect(18, 18, 110, 150);
    g.fillStyle = "rgba(120, 190, 220, 0.55)";
    g.fillRect(148, 18, 114, 324);
    g.strokeStyle = "#f3e2c0";
    g.lineWidth = 10;
    g.strokeRect(0, 0, 280, 360);
    g.restore();
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = `rgba(255, 214, 140, ${0.18 + 0.12 * manana})`;
    g.beginPath();
    g.moveTo(560, -80);
    g.lineTo(980, 720);
    g.lineTo(220, 720);
    g.closePath();
    g.fill();
    g.restore();
  }
  g.fillStyle = k.mezColor("#5a2a22", "#8a4a28", manana * 0.4);
  g.fillRect(-2200, 690, 4400, 900);
  g.fillStyle = "rgba(255, 214, 160, 0.28)";
  for (let x = -1800; x < 1800; x += 150) g.fillRect(x, 700, 8, 700);
  g.fillStyle = "#f6efe4";
  g.fillRect(-2200, 640, 4400, 36);
  g.fillStyle = "rgba(90, 30, 24, 0.35)";
  g.fillRect(-2200, 672, 4400, 10);
}

function tornillo(g, x, y, r, suelto = 0) {
  g.save();
  g.translate(x, y - suelto * 72);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath(); g.arc(3, 6, r, 0, 6.28); g.fill();
  g.fillStyle = laton(g, -r, -r, r, r);
  g.beginPath(); g.arc(0, 0, r, 0, 6.28); g.fill();
  g.strokeStyle = "#3a240c";
  g.lineWidth = Math.max(2, r * 0.22);
  g.beginPath(); g.moveTo(-r * 0.55, 0); g.lineTo(r * 0.55, 0); g.stroke();
  g.restore();
}

// Bisagra de cerca, centrada en 0,0. pinUp en píxeles de mundo (0 = metido).
export function bisagra(g, opt = {}) {
  const pinUp = opt.pinUp || 0;
  const jelly = opt.jelly || 0;
  const grit = opt.grit ?? 1;
  const vib = opt.vib || 0;
  const brillo = opt.brillo ?? 1;
  g.save();
  g.translate(vib, 0);
  g.fillStyle = "rgba(40, 16, 8, 0.35)";
  k.redondo(g, -158, -188, 330, 400, 18);
  g.fill();
  // hojas
  g.fillStyle = laton(g, -150, -180, 150, 180);
  k.redondo(g, -168, -176, 150, 352, 10);
  g.fill();
  k.redondo(g, 18, -176, 150, 352, 10);
  g.fill();
  g.save();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, -170, -180, 340, 360);
  g.restore();
  const ys = [-120, -20, 80];
  for (const y of ys) {
    tornillo(g, -110, y, 13, 0);
    if (opt.tornilloSuelto && y === -20) {
      g.fillStyle = "#1a1008";
      g.beginPath(); g.arc(96, y, 18, 0, 6.28); g.fill();
      tornillo(g, 96, y, 18, opt.tornilloSuelto);
    } else tornillo(g, 96, y, 13, 0);
  }
  // nudillos
  const nudillos = [-150, -78, -6, 66, 138];
  nudillos.forEach((y, i) => {
    g.fillStyle = laton(g, -36, y, 36, y + 70);
    k.redondo(g, -34, y, 68, 72, 30);
    g.fill();
    g.fillStyle = i % 2 ? "rgba(255,244,210,0.35)" : "rgba(80,40,8,0.25)";
    g.fillRect(-8, y + 8, 10, 56);
  });
  // pasador: dentro del cañón, y lo que asoma por arriba al sacarlo
  const y0 = -196 - pinUp, y1 = 176 - pinUp;
  const eje = (ya, yb) => {
    if (yb - ya < 8) return;
    g.fillStyle = acero(g, -16, ya, 16, yb);
    k.redondo(g, -15, ya, 30, yb - ya, 12);
    g.fill();
    if (grit > 0.04) {
      g.save();
      g.globalAlpha = 0.55 * grit;
      const az = k.azar(41);
      for (let i = 0; i < 14; i++) {
        const yy = ya + 8 + az() * Math.max(8, yb - ya - 16);
        g.fillStyle = i % 2 ? "#2a1c12" : "#6a5038";
        g.beginPath(); g.ellipse(-4 + az() * 10, yy, 3 + az() * 3, 2, 0, 0, 6.28); g.fill();
      }
      g.restore();
    }
    if (jelly > 0.03) {
      g.save();
      g.globalAlpha = 0.92 * jelly;
      const vg = g.createLinearGradient(-14, 0, 16, 0);
      vg.addColorStop(0, "rgba(180, 110, 10, 0.35)");
      vg.addColorStop(0.4, "rgba(255, 196, 40, 1)");
      vg.addColorStop(1, "rgba(255, 244, 190, 0.95)");
      g.fillStyle = vg;
      k.redondo(g, -14, ya + 4, 24, Math.max(10, (yb - ya - 8) * jelly), 10);
      g.fill();
      g.restore();
    }
  };
  g.save();
  g.beginPath();
  g.rect(-24, -178, 48, 356);
  g.clip();
  eje(Math.max(y0, -178), Math.min(y1, 178));
  g.restore();
  if (y0 < -178) eje(y0, Math.min(y1, -178));
  if (y0 + 8 < 210) {
    g.fillStyle = acero(g, -28, y0 - 8, 28, y0 + 28);
    g.beginPath(); g.ellipse(0, y0 + 8, 26, 14, 0, 0, 6.28); g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)";
    g.beginPath(); g.ellipse(-8, y0 + 4, 8, 4, -0.4, 0, 6.28); g.fill();
  }
  if (brillo > 0.02 && opt.roce) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const rg = g.createRadialGradient(20, 10, 4, 20, 10, 70);
    rg.addColorStop(0, `rgba(255, 170, 40, ${0.85 * brillo})`);
    rg.addColorStop(1, "rgba(255, 80, 0, 0)");
    g.fillStyle = rg;
    g.beginPath(); g.arc(18, 8, 70, 0, 6.28); g.fill();
    g.restore();
  }
  g.restore();
}

export function corteCanon(g, al, spin, glow) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "rgba(20, 8, 6, 0.45)";
  g.beginPath(); g.arc(14, 18, 250, 0, 6.28); g.fill();
  const anillo = g.createRadialGradient(-30, -40, 20, 0, 0, 230);
  anillo.addColorStop(0, "#fff1c4");
  anillo.addColorStop(0.42, "#e2b44c");
  anillo.addColorStop(0.72, "#8d5814");
  anillo.addColorStop(1, "#3a220c");
  g.fillStyle = anillo;
  g.beginPath(); g.arc(0, 0, 228, 0, 6.28); g.fill();
  g.fillStyle = "#140e0a";
  g.beginPath(); g.arc(0, 0, 156, 0, 6.28); g.fill();
  g.save();
  g.translate(22, 0);
  g.rotate(spin);
  const pin = g.createRadialGradient(-36, -30, 8, 0, 0, 120);
  pin.addColorStop(0, "#ffffff");
  pin.addColorStop(0.4, "#c9d3de");
  pin.addColorStop(0.78, "#667484");
  pin.addColorStop(1, "#24303a");
  g.fillStyle = pin;
  g.beginPath(); g.arc(0, 0, 118, 0, 6.28); g.fill();
  g.strokeStyle = "rgba(28, 18, 12, 0.7)";
  g.lineWidth = 4;
  for (let i = 0; i < 6; i++) {
    g.beginPath();
    g.arc(0, 0, 28 + i * 14, 0.3 + i * 0.4, 1.8 + i * 0.35);
    g.stroke();
  }
  g.restore();
  g.save();
  g.globalCompositeOperation = "lighter";
  const gz = g.createRadialGradient(138, 0, 4, 138, 0, 78);
  gz.addColorStop(0, `rgba(255, 186, 50, ${0.95 * glow})`);
  gz.addColorStop(0.5, `rgba(255, 90, 10, ${0.35 * glow})`);
  gz.addColorStop(1, "rgba(255, 60, 0, 0)");
  g.fillStyle = gz;
  g.beginPath(); g.arc(138, 0, 78, 0, 6.28); g.fill();
  g.restore();
  g.restore();
}

export function chispas(g, x, y, t, al) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 16; i++) {
    const az = k.azar(80 + i * 13);
    const ang = az() * 6.2832;
    const vel = 36 + az() * 70;
    const fase = ((t * 1.4 + az()) % 0.34) / 0.34;
    const px = Math.cos(ang) * vel * fase;
    const py = Math.sin(ang) * vel * fase + fase * fase * 22;
    const a = al * (1 - fase);
    g.strokeStyle = `rgba(255, ${170 + (i % 3) * 20}, 40, ${a})`;
    g.lineWidth = 3.2;
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(px + Math.cos(ang) * 14, py + Math.sin(ang) * 14);
    g.stroke();
  }
  g.restore();
}

export function anillos(g, t, al) {
  if (al < 0.03) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  const ciclo = 0.48;
  for (let i = 0; i < 2; i++) {
    const u = ((t + i * ciclo * 0.5) % ciclo) / ciclo;
    g.strokeStyle = `rgba(255, 196, 90, ${al * (1 - u) * 0.75})`;
    g.lineWidth = 16 * (1 - u) + 4;
    g.beginPath();
    g.arc(0, 0, 24 + u * 190, -0.4, 2.6);
    g.stroke();
  }
  g.restore();
}

export function hoja(g, abre, opt = {}) {
  const w = k.mez(620, 78, Math.max(0, Math.min(1, abre)));
  const grosor = k.mez(22, 86, Math.max(0, Math.min(1, abre)));
  g.save();
  g.translate(opt.x || 0, opt.y || 0);
  g.rotate(opt.giro || 0);
  g.fillStyle = "#064840";
  g.fillRect(28, -580, grosor, 1220);
  const face = g.createLinearGradient(0, -400, w, 400);
  face.addColorStop(0, "#0b6e64");
  face.addColorStop(0.35, "#1ec4ae");
  face.addColorStop(0.7, "#0e8f82");
  face.addColorStop(1, "#07564e");
  g.fillStyle = face;
  k.redondo(g, 24 + grosor, -580, w, 1220, 14);
  g.fill();
  g.fillStyle = "rgba(4, 40, 36, 0.28)";
  const pw = Math.max(30, w * 0.62);
  if (w > 120) {
    k.redondo(g, 70 + grosor, -460, pw, 400, 16); g.fill();
    k.redondo(g, 70 + grosor, 10, pw, 430, 16); g.fill();
    g.fillStyle = "rgba(255,255,255,0.08)";
    g.fillRect(78 + grosor, -450, 14, 390);
  }
  g.save();
  g.globalAlpha = 0.2;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 30, -580, Math.max(80, w), 1220);
  g.restore();
  g.restore();
}

export function marco(g) {
  g.fillStyle = "#f7f1e6";
  g.fillRect(-78, -640, 54, 1340);
  g.fillStyle = "#e4d8c4";
  g.fillRect(-78, -640, 10, 1340);
  g.fillStyle = "rgba(80, 30, 20, 0.18)";
  g.fillRect(-28, -640, 8, 1340);
}

export function pomo(g, x, y, alzado = 0) {
  g.save();
  g.translate(x, y - alzado);
  g.fillStyle = "rgba(40, 20, 8, 0.3)";
  g.beginPath(); g.ellipse(6, 18, 36, 16, 0, 0, 6.28); g.fill();
  g.fillStyle = laton(g, -40, -40, 40, 40);
  g.beginPath(); g.arc(0, 0, 34, 0, 6.28); g.fill();
  g.fillStyle = laton(g, -70, -24, 20, 24);
  k.redondo(g, -78, -22, 70, 44, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath(); g.ellipse(-12, -12, 10, 6, -0.6, 0, 6.28); g.fill();
  g.restore();
}

export function guante(g, x, y, rot = 0, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const piel = g.createLinearGradient(-80, -180, 70, 160);
  piel.addColorStop(0, "#fff1a8");
  piel.addColorStop(0.45, "#ffc400");
  piel.addColorStop(1, "#e08900");
  g.fillStyle = piel;
  g.beginPath(); g.ellipse(6, 20, 78, 92, 0, 0, 6.28); g.fill();
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -48 + i * 30, -150 + (i === 0 || i === 3 ? 18 : 0), 28, 118, 14);
    g.fill();
  }
  g.save();
  g.translate(-70, 10);
  g.rotate(0.7);
  k.redondo(g, -18, -86, 36, 100, 16);
  g.fill();
  g.restore();
  k.redondo(g, -78, 70, 160, 70, 22);
  g.fill();
  g.fillStyle = "rgba(255, 250, 210, 0.45)";
  g.beginPath(); g.ellipse(-10, -6, 16, 36, -0.4, 0, 6.28); g.fill();
  g.restore();
}

export function martillo(g, x, y, rot, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.globalAlpha *= al;
  const madera = g.createLinearGradient(-16, 0, 16, 0);
  madera.addColorStop(0, "#8a4e22");
  madera.addColorStop(0.5, "#e0a060");
  madera.addColorStop(1, "#6a3814");
  g.fillStyle = madera;
  k.redondo(g, -14, -10, 28, 210, 10);
  g.fill();
  g.fillStyle = acero(g, -70, -70, 70, -10);
  k.redondo(g, -78, -78, 156, 58, 12);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(-60, -68, 40, 8);
  g.restore();
}

export function clavo(g, x, y, h, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = acero(g, -5, 0, 5, h);
  k.redondo(g, -4, 0, 8, h - 16, 3);
  g.fill();
  g.beginPath();
  g.moveTo(-4, h - 16); g.lineTo(0, h); g.lineTo(4, h - 16);
  g.fill();
  g.fillStyle = acero(g, -16, -8, 16, 12);
  g.beginPath(); g.ellipse(0, 4, 14, 8, 0, 0, 6.28); g.fill();
  g.restore();
}

export function trapo(g, x, y, rot, al = 1, sucio = 0.4) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.globalAlpha *= al;
  g.fillStyle = "#f4f7fb";
  g.beginPath();
  g.moveTo(-70, -36);
  g.quadraticCurveTo(-20, -80, 74, -28);
  g.quadraticCurveTo(110, 20, 60, 58);
  g.quadraticCurveTo(0, 96, -80, 40);
  g.quadraticCurveTo(-120, 0, -70, -36);
  g.fill();
  g.fillStyle = `rgba(60, 44, 32, ${0.55 * sucio})`;
  g.beginPath(); g.ellipse(10, 6, 36, 22, 0.4, 0, 6.28); g.fill();
  g.strokeStyle = "rgba(180, 198, 214, 0.8)";
  g.lineWidth = 3;
  g.beginPath(); g.moveTo(-40, -10); g.quadraticCurveTo(10, 20, 50, -6); g.stroke();
  g.restore();
}

export function bote(g, x, y, al = 1, tapa = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(40, 20, 8, 0.28)";
  g.beginPath(); g.ellipse(8, 78, 70, 16, 0, 0, 6.28); g.fill();
  const cuerpo = g.createLinearGradient(-60, -40, 60, 80);
  cuerpo.addColorStop(0, "rgba(255,255,255,0.55)");
  cuerpo.addColorStop(0.3, "rgba(255, 220, 120, 0.35)");
  cuerpo.addColorStop(1, "rgba(90, 60, 20, 0.25)");
  g.fillStyle = "#f6d56a";
  k.redondo(g, -58, -20, 116, 100, 16);
  g.fill();
  g.fillStyle = cuerpo;
  k.redondo(g, -58, -20, 116, 100, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(-40, -8, 14, 70);
  if (tapa > 0.05) {
    g.save();
    g.globalAlpha *= tapa;
    g.translate(78, -36);
    g.rotate(-0.5);
    g.fillStyle = "#f2f4f6";
    k.redondo(g, -34, -10, 68, 22, 8);
    g.fill();
    g.restore();
  }
  g.restore();
}

export function botella(g, x, y, rot, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(255, 236, 140, 0.9)";
  k.redondo(g, -34, -20, 68, 150, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  k.redondo(g, -8, -70, 16, 56, 6);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  g.fillRect(-22, 10, 10, 90);
  g.fillStyle = "#e23b2f";
  k.redondo(g, -26, 24, 52, 36, 6);
  g.fill();
  g.restore();
}

export function chorroAceite(g, x, y0, y1, al) {
  if (al < 0.03 || y1 < y0 + 8) return;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "#f6d35a";
  g.beginPath();
  g.moveTo(x - 16, y0);
  g.quadraticCurveTo(x + 30, (y0 + y1) / 2, x - 10, y1);
  g.lineTo(x + 22, y1);
  g.quadraticCurveTo(x + 54, (y0 + y1) / 2, x + 16, y0);
  g.closePath();
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fillRect(x - 4, y0, 8, y1 - y0);
  g.restore();
}

// La punta queda en el origen: al girar, gira sobre el tornillo.
export function destornillador(g, x, y, rot, al = 1, esc = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = acero(g, -12, -170, 12, 0);
  g.fillRect(-11, -168, 22, 162);
  g.beginPath(); g.moveTo(-14, -10); g.lineTo(0, 10); g.lineTo(14, -10); g.fill();
  const m = g.createLinearGradient(-18, 0, 18, 0);
  m.addColorStop(0, "#c45218");
  m.addColorStop(0.5, "#ffb14a");
  m.addColorStop(1, "#c45218");
  g.fillStyle = m;
  k.redondo(g, -18, -310, 36, 150, 14);
  g.fill();
  g.fillStyle = "#222";
  g.fillRect(-18, -176, 36, 16);
  g.restore();
}

export function telefono(g, x, y, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.3)";
  k.redondo(g, -70, -150, 160, 320, 36);
  g.fill();
  g.fillStyle = "#161b22";
  k.redondo(g, -86, -168, 172, 336, 40);
  g.fill();
  const pantalla = g.createLinearGradient(0, -120, 0, 130);
  pantalla.addColorStop(0, "#16382a");
  pantalla.addColorStop(1, "#07140f");
  g.fillStyle = pantalla;
  k.redondo(g, -68, -140, 136, 270, 18);
  g.fill();
  g.beginPath(); g.arc(0, 36, 42, 0, 6.28);
  g.fillStyle = "#18c85a";
  g.fill();
  g.strokeStyle = "#f2fff6";
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath(); g.arc(-2, 34, 16, 0.7, 2.5); g.stroke();
  g.beginPath(); g.moveTo(12, 28); g.lineTo(18, 22); g.stroke();
  g.restore();
}

export function polvo(g, x, y, t, al) {
  if (al < 0.03) return;
  const az = k.azar(9);
  for (let i = 0; i < 14; i++) {
    const ang = az() * 6.28;
    const dist = 30 + az() * 160;
    const u = k.suave(k.tramo(t, 0, 1));
    const px = x + Math.cos(ang) * dist * (1 - u);
    const py = y + Math.sin(ang) * dist * 0.6 * (1 - u);
    g.fillStyle = `rgba(90, 70, 50, ${al * (0.3 + 0.7 * u)})`;
    g.beginPath(); g.arc(px, py, 4 + az() * 4, 0, 6.28); g.fill();
  }
}

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9);

export function escenaChirrido(g, t) {
  const Tsq = f1.t("squeaky"), T30 = f1.t("thirty"), Tpin = f2.t("pin"), Tgr = f2.t("grinding");
  const fin = f3.inicio;
  const corte = k.suave(k.tramo(t, 3.55, Tpin + 0.15));
  const calma = k.suave(k.tramo(t, Tgr + 0.85, fin - 0.32));
  const abre = t < 3.4 ? 0.16 + 0.2 * (0.5 + 0.5 * Math.sin(t * 11 + 1.1)) : k.de(t, 3.4, 4.4, 0.26, 0.05);
  const vib = (1 - calma) * (1 - corte) * Math.sin(t * 62) * 7;
  const cam = rutaCam(t, [
    [0, { x: 4, y: -12, s: 2.65 }],
    [Tsq, { x: -8, y: -20, s: 2.5 }],
    [T30, { x: 60, y: -6, s: 1.9 }],
    [3.25, { x: 0, y: 0, s: 2.15 }],
    [Tpin, { x: 0, y: 6, s: 1.95 }],
    [fin - 0.42, { x: 0, y: 2, s: 2.08 }],
    [fin, { x: 0, y: 2, s: 2.08 }],
  ]);
  g.save();
  camara(g, cam);
  g.save();
  g.globalAlpha = 1 - corte * 0.72;
  pasillo(g, { luzX: -260, luzY: -520 });
  marco(g);
  g.save();
  g.translate(vib, 0);
  hoja(g, abre);
  pomo(g, 430, 40);
  bisagra(g, { vib: 0, brillo: (1 - calma) * (1 - corte), roce: true, grit: 1 });
  g.restore();
  g.restore();
  const spinTope = fin - 0.4;
  const spin = (t < spinTope ? t : spinTope) * 1.35;
  const glow = t < Tgr ? 0.45 + 0.55 * k.pulso(t, Tgr, 0.4) : 1 - calma;
  corteCanon(g, corte, spin, Math.max(0, glow));
  if (corte > 0.4) chispas(g, 150, 0, t, corte * (1 - calma));
  else chispas(g, 20, 8, t, (1 - corte) * (0.45 + 0.55 * (1 - calma)));
  anillos(g, t, (1 - corte) * (1 - calma));
  if (t < 3.15) {
    g.save();
    g.globalAlpha = 0.35 * (1 - corte);
    g.strokeStyle = "rgba(180, 255, 230, 0.8)";
    g.lineWidth = 8;
    g.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const yy = -80 + i * 70;
      g.beginPath();
      g.moveTo(70, yy);
      g.lineTo(70 + 22 + 8 * Math.sin(t * 11 + i), yy - 8);
      g.stroke();
    }
    g.restore();
  }
  g.restore();
}

function herrajeFijo(g, y, pinUp) {
  g.save();
  g.translate(-6, y);
  g.fillStyle = laton(g, -50, -110, 10, 110);
  k.redondo(g, -58, -118, 70, 236, 10);
  g.fill();
  g.fillStyle = laton(g, -24, -120, 24, 120);
  k.redondo(g, -26, -124, 52, 248, 22);
  g.fill();
  [-70, 0, 70].forEach((yy) => tornillo(g, -28, yy, 11, 0));
  const y0 = -130 - pinUp;
  g.fillStyle = acero(g, -10, y0, 12, 80);
  k.redondo(g, -11, y0 + 16, 22, 200, 10);
  g.fill();
  g.beginPath(); g.ellipse(0, y0 + 16, 18, 9, 0, 0, 6.28); g.fill();
  g.fillStyle = "rgba(255,255,255,0.65)";
  g.beginPath(); g.ellipse(-5, y0 + 13, 6, 3, -0.4, 0, 6.28); g.fill();
  g.restore();
}
function placaPuerta(g, y) {
  g.save();
  g.translate(36, y);
  g.fillStyle = laton(g, 0, -100, 80, 100);
  k.redondo(g, 0, -108, 86, 216, 10);
  g.fill();
  [-60, 10, 70].forEach((yy) => tornillo(g, 48, yy, 10, 0));
  g.restore();
}

export function escenaUna(g, t) {
  const Tone = f3.t("one"), Tall = f3.t("all"), Tdrop = f3.t("drops");
  const fin = f4.inicio;
  const abre = 0.35 * (1 - k.suave(k.tramo(t, f3.inicio, f3.inicio + 0.65)));
  const uno = k.suave(k.tramo(t, Tone - 0.12, Tone + 0.32));
  const todos = k.suave(k.tramo(t, Tall + 0.02, Tall + 0.55));
  const cae = k.suave(k.tramo(t, Tdrop - 0.22, Tdrop + 0.28));
  const polvoU = k.tramo(t, Tdrop + 0.05, Tdrop + 0.5);
  const cam = rutaCam(t, [
    [f3.inicio, { x: 200, y: 20, s: 0.82 }],
    [Tone - 0.05, { x: 80, y: 20, s: 1.15 }],
    [Tall, { x: 180, y: 60, s: 0.78 }],
    [fin, { x: 200, y: 140, s: 0.8 }],
  ]);
  const pins = [todos * 200, Math.max(uno, todos) * 200, todos * 200];
  const ys = [-360, 20, 400];
  g.save();
  camara(g, cam);
  pasillo(g);
  marco(g);
  ys.forEach((y, i) => herrajeFijo(g, y, pins[i]));
  g.save();
  g.translate(cae * 36, cae * 260);
  g.rotate(cae * 0.16);
  hoja(g, abre);
  ys.forEach((y) => placaPuerta(g, y));
  pomo(g, 470, 30);
  g.restore();
  const mano = k.suave(k.tramo(t, Tone - 0.4, Tone - 0.05)) * (1 - k.suave(k.tramo(t, Tall - 0.08, Tall + 0.28)));
  guante(g, 120, -70 - uno * 80, -0.5, 1.15, mano);
  if (polvoU > 0 && polvoU < 1) {
    g.save();
    g.globalAlpha = (1 - polvoU) * 0.8;
    g.fillStyle = "rgba(140, 96, 60, 0.45)";
    g.beginPath(); g.ellipse(300, 760, 200 + polvoU * 120, 28, 0, 0, 6.28); g.fill();
    g.restore();
  }
  g.restore();
}

export function escenaArreglo(g, t) {
  const Ttap = f4.t("tap"), Tnail = f4.t("nail"), Tstick = f4.t("sticks"), Thand = f4.t("handle"), Tout = f4.t("out");
  const Twipe = f5.t("wipe"), Tjelly = f5.t("jelly");
  const Tpush = f6.t("push"), Textra = f6.t("extra"), Tswing = f6.t("swing");
  const fin = f7.inicio;
  const golpe = k.pulso(t, Ttap + 0.18, 0.05) + k.pulso(t, Tnail - 0.05, 0.05);
  const pinTocado = 48 * k.suave(k.tramo(t, Tnail - 0.15, Tstick));
  const pinFuera = pinTocado + 250 * k.suave(k.tramo(t, Thand + 0.2, Tout + 0.08));
  const limpio = k.suave(k.tramo(t, Twipe, Twipe + 0.85));
  const jelly = k.suave(k.tramo(t, Tjelly - 0.45, Tjelly + 0.25));
  const pinVuelve = pinFuera * (1 - k.suave(k.tramo(t, Tpush, Tpush + 0.7)));
  const pin = t < Tpush ? pinFuera : pinVuelve;
  const gota = (t > Tpush + 0.55 ? 1 : 0) * (1 - k.suave(k.tramo(t, Textra, Textra + 0.45)));
  const abre = k.suave(k.tramo(t, Tswing - 0.08, Tswing + 0.55));
  const alza = k.suave(k.tramo(t, Thand - 0.28, Thand + 0.18)) * (1 - k.suave(k.tramo(t, Tout - 0.2, Tout + 0.1)));
  const cam = rutaCam(t, [
    [Ttap, { x: 10, y: 260, s: 1.4 }],
    [Tnail, { x: 6, y: 240, s: 1.48 }],
    [Thand - 0.25, { x: 300, y: 50, s: 1.28 }],
    [Tout - 0.05, { x: 16, y: -250, s: 1.5 }],
    [Twipe, { x: 24, y: -270, s: 1.55 }],
    [Tjelly, { x: 50, y: -250, s: 1.48 }],
    [Tpush, { x: 0, y: 10, s: 1.75 }],
    [Tswing, { x: 210, y: 30, s: 0.92 }],
    [fin, { x: 220, y: 16, s: 0.9 }],
  ]);
  g.save();
  camara(g, cam);
  pasillo(g);
  marco(g);
  hoja(g, abre * 0.62);
  pomo(g, 500, 20, alza * 130);
  bisagra(g, { pinUp: pin, grit: 1 - limpio, jelly, brillo: 0, roce: false });
  // clavo y martillo
  const herramienta = 1 - k.suave(k.tramo(t, Tstick + 0.15, Thand - 0.2));
  const mazazo = golpe * 34;
  g.save();
  g.translate(0, 392);
  g.scale(1.7, -1.15);
  clavo(g, 0, 0, 190, herramienta);
  g.restore();
  martillo(g, -48, 470 - mazazo, 0.15, herramienta);
  guante(g, 70, 560 - mazazo * 0.2, 0.4, 1.25, herramienta);
  // mano en el pomo, por debajo, para que el pomo se vea subir
  const manoPomo = k.suave(k.tramo(t, Thand - 0.4, Thand - 0.08)) * (1 - k.suave(k.tramo(t, Thand + 0.42, Tout - 0.25)));
  guante(g, 560, 150 - alza * 130, -0.15, 1.2, manoPomo);
  // mano que saca, limpia y unta
  const manoPin = k.suave(k.tramo(t, Tout - 0.45, Tout - 0.05)) * (1 - k.suave(k.tramo(t, Tpush + 0.15, Tpush + 0.55)));
  guante(g, 96, -210 - Math.min(pin, 260), 0.2, 1.05, manoPin);
  const manoTrapo = k.suave(k.tramo(t, Twipe - 0.2, Twipe + 0.15)) * (1 - k.suave(k.tramo(t, Twipe + 0.7, Twipe + 1.05)))
    + k.suave(k.tramo(t, Textra - 0.2, Textra)) * (1 - k.suave(k.tramo(t, Textra + 0.4, Textra + 0.7)));
  const yPin = -170 - Math.min(pin, 250);
  trapo(g, 42 + Math.sin(k.tramo(t, Twipe, Twipe + 0.8) * 6.28) * 16, yPin + 70, -0.4, Math.min(1, manoTrapo * 2), 1 - limpio);
  const manoBote = k.suave(k.tramo(t, Tjelly - 0.7, Tjelly - 0.25)) * (1 - k.suave(k.tramo(t, Tjelly + 0.35, Tpush - 0.05)));
  bote(g, 168, yPin + 40, manoBote, 1);
  if (gota > 0.04) {
    g.fillStyle = `rgba(240, 196, 60, ${gota})`;
    g.beginPath(); g.ellipse(22, 40, 10, 16 * gota, 0, 0, 6.28); g.fill();
  }
  g.restore();
}

export function escenaAceite(g, t) {
  const Toil = f7.t("oil"), Trun = f7.t("runs"), Tsticky = f7.t("sticky");
  const fin = f8.inicio;
  const echa = 1 - k.suave(k.tramo(t, Toil - 0.05, Toil + 0.5));
  const corre = k.suave(k.tramo(t, f7.inicio, Trun + 0.35));
  const pega = k.suave(k.tramo(t, Tsticky - 0.55, Tsticky + 0.15));
  const cam = rutaCam(t, [
    [f7.inicio, { x: 200, y: 20, s: 1.2 }],
    [Trun, { x: 190, y: 140, s: 1.28 }],
    [fin, { x: 180, y: 180, s: 1.22 }],
  ]);
  g.save();
  camara(g, cam);
  pasillo(g);
  marco(g);
  hoja(g, 0.02);
  bisagra(g, { pinUp: 0, grit: 0.15, brillo: 0 });
  const y1 = 80 + corre * 420;
  chorroAceite(g, 210, -40, y1, 0.55 + 0.45 * echa);
  g.save();
  g.globalAlpha = 0.35 + 0.65 * corre;
  g.fillStyle = k.mezColor("#f0c84a", "#6e5428", pega);
  k.redondo(g, 188, 20, 48, 90 + corre * 460, 18);
  g.fill();
  g.restore();
  botella(g, 40 + echa * 150, -210, -1.05 + (1 - echa) * 0.2, 0.35 + 0.65 * echa);
  guante(g, 280, -120, 0.7, 1.15, k.suave(k.tramo(t, Toil - 0.25, Toil + 0.15)) * echa + (1 - echa) * 0.2);
  polvo(g, 210, Math.min(y1, 460), pega, pega);
  g.restore();
}

export function escenaTornillo(g, t) {
  const Tsc = f8.t("screws"), Tw = f8.t("warped"), Tcar = f8.t("carpenter");
  const fin = f9.inicio;
  const aprieta = k.suave(k.tramo(t, Tsc - 0.45, Tsc + 0.25));
  const suelto = 1 - aprieta;
  const pasa = k.suave(k.tramo(t, Tw - 0.15, Tw + 0.45));
  const fono = k.suave(k.tramo(t, Tcar - 0.2, Tcar + 0.35));
  const cam = rutaCam(t, [
    [f8.inicio, { x: 40, y: -90, s: 1.65 }],
    [Tsc, { x: 60, y: -70, s: 1.85 }],
    [Tw + 0.45, { x: -16, y: 10, s: 1.4 }],
    [fin, { x: 20, y: 50, s: 1.2 }],
  ]);
  const rotD = -0.7 + aprieta * 1.15;
  g.save();
  camara(g, cam);
  pasillo(g);
  g.save();
  g.translate(-pasa * 130, 0);
  g.fillStyle = "#f7f1e6";
  g.beginPath();
  g.moveTo(-70, -680);
  g.quadraticCurveTo(-70 - pasa * 40, 0, -70, 740);
  g.lineTo(20, 740);
  g.quadraticCurveTo(20 - pasa * 90, 0, 20, -680);
  g.fill();
  g.restore();
  if (pasa > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const luz = g.createLinearGradient(-80, 0, 80, 0);
    luz.addColorStop(0, `rgba(190, 240, 255, ${0.15 * pasa})`);
    luz.addColorStop(0.5, `rgba(230, 250, 255, ${0.85 * pasa})`);
    luz.addColorStop(1, `rgba(190, 240, 255, ${0.1 * pasa})`);
    g.fillStyle = luz;
    g.beginPath();
    g.moveTo(10, -560);
    g.quadraticCurveTo(-70 - pasa * 40, 0, 10, 600);
    g.lineTo(70, 600);
    g.lineTo(70, -560);
    g.fill();
    g.restore();
  }
  const vib = suelto * Math.sin(t * 28) * 5 * (1 - pasa);
  g.save();
  g.translate(vib, 0);
  hoja(g, 0);
  bisagra(g, { tornilloSuelto: suelto, grit: 0.15, brillo: 0 });
  g.restore();
  const escD = 0.62;
  destornillador(g, 96 + vib, -20, rotD, (1 - pasa) * k.suave(k.tramo(t, f8.inicio, f8.inicio + 0.2)), escD);
  const mx = 96 + vib + Math.sin(rotD) * 240 * escD;
  const my = -20 - Math.cos(rotD) * 240 * escD;
  guante(g, mx + 10, my + 36, rotD + 1.2, 0.95, (1 - pasa) * k.suave(k.tramo(t, f8.inicio, f8.inicio + 0.22)));
  telefono(g, 150, 180, fono);
  g.restore();
}

export function escenaManana(g, t) {
  const Tm = f9.t("morning");
  const abre = k.suave(k.tramo(t, f9.inicio, Tm - 0.05)) * 0.45;
  const cam = rutaCam(t, [
    [f9.inicio, { x: 200, y: 10, s: 0.92 }],
    [Tm, { x: 8, y: -6, s: 2.35 }],
    [v.duracion, { x: 0, y: -8, s: 2.45 }],
  ]);
  g.save();
  camara(g, cam);
  pasillo(g, { manana: 1, ventana: true, luzX: 640, luzY: -420 });
  marco(g);
  hoja(g, abre);
  pomo(g, 460, 30);
  bisagra(g, { jelly: 0.85, grit: 0, brillo: 0.15, roce: false });
  g.restore();
}
