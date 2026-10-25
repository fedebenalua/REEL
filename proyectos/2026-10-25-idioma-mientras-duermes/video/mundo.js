// El cuarto, la cabeza dormida, el móvil y las cuatro teclas. Salen en más de un plano.
import * as k from "#kit";

export const PALABRAS = ["TORU", "NELA", "VIKO", "SORA", "LUMO", "KERA"];
export const TECLAS = [
  { hex: "#ff4d6d", rgb: "255,77,109" },
  { hex: "#ffb020", rgb: "255,176,32" },
  { hex: "#2ee6c7", rgb: "46,230,199" },
  { hex: "#8b7cff", rgb: "139,124,255" },
];

const azM = k.azar(19);
export const MOTAS = Array.from({ length: 70 }, () => ({
  x: azM() * 1080, y: azM() * 1920, s: 1.2 + azM() * 2.4, f: azM() * 6.28, v: 8 + azM() * 16,
}));

export function velo(g, fuerza = 0.72) {
  const gr = g.createLinearGradient(0, 180, 0, 620);
  gr.addColorStop(0, `rgba(5,8,16,${fuerza})`);
  gr.addColorStop(1, "rgba(5,8,16,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 640);
}

export function palabra(g, x, y, texto, s = 1, al = 1, color = "120,230,255") {
  if (al < 0.02 || s < 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.font = "800 72px Figtree";
  const w = Math.max(210, g.measureText(texto).width + 78);
  const h = 104;
  const glow = g.createRadialGradient(0, 0, 8, 0, 0, w * 0.72);
  glow.addColorStop(0, `rgba(${color},0.5)`);
  glow.addColorStop(1, `rgba(${color},0)`);
  g.fillStyle = glow;
  g.beginPath();
  g.ellipse(0, 0, w * 0.72, h * 0.95, 0, 0, 6.2832);
  g.fill();
  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 14;
  k.redondo(g, -w / 2, -h / 2, w, h, 38);
  g.fillStyle = "rgba(6,12,24,0.9)";
  g.fill();
  g.shadowColor = "transparent";
  g.shadowBlur = 0;
  g.lineWidth = 5;
  g.strokeStyle = `rgba(${color},0.95)`;
  g.stroke();
  g.fillStyle = "#f5fbff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(texto, 0, 3);
  g.restore();
}

export function movil(g, x, y, s, t, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 30;
  g.shadowOffsetY = 18;
  k.redondo(g, -78, -156, 156, 312, 32);
  g.fillStyle = "#12151c";
  g.fill();
  g.shadowColor = "transparent";
  const cuerpo = g.createLinearGradient(-78, -156, 78, 40);
  cuerpo.addColorStop(0, "#2a3142");
  cuerpo.addColorStop(0.45, "#161a24");
  cuerpo.addColorStop(1, "#0c0e14");
  k.redondo(g, -78, -156, 156, 312, 32);
  g.fillStyle = cuerpo;
  g.fill();
  k.redondo(g, -64, -132, 128, 250, 18);
  g.fillStyle = "#061018";
  g.fill();
  g.strokeStyle = "#5cffc8";
  g.lineWidth = 5;
  g.lineCap = "round";
  g.beginPath();
  for (let i = 0; i <= 16; i++) {
    const px = -52 + i * 6.5;
    const py = Math.sin(t * 7 + i * 0.85) * (14 + 22 * Math.abs(Math.sin(t * 3 + i)));
    if (i === 0) g.moveTo(px, py);
    else g.lineTo(px, py);
  }
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.beginPath();
  g.roundRect ? g.fillRect(-22, -148, 44, 6) : g.fillRect(-22, -148, 44, 6);
  g.restore();
  k.brillo(g, x, y, 280 * s, "cian", 0.28 * al);
}

// Cabeza de perfil, mirando a la izquierda. El oído queda a la derecha de la cara.
export function cabeza(g, x, y, s, ojos, boca = 0) {
  g.save();
  g.translate(x, y);
  g.scale(s, s);
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 24;
  // almohada
  g.fillStyle = "#243044";
  g.beginPath();
  g.ellipse(20, 210, 250, 70, -0.15, 0, 6.2832);
  g.fill();
  g.shadowColor = "transparent";
  const alm = g.createLinearGradient(-180, 140, 220, 250);
  alm.addColorStop(0, "#3d4e6a");
  alm.addColorStop(0.5, "#2a3850");
  alm.addColorStop(1, "#1a2436");
  g.fillStyle = alm;
  g.beginPath();
  g.ellipse(20, 200, 240, 62, -0.12, 0, 6.2832);
  g.fill();
  // pelo, detrás
  g.fillStyle = "#1b1230";
  g.beginPath();
  g.ellipse(30, -20, 168, 190, 0.1, 0, 6.2832);
  g.fill();
  // cuello
  const cu = g.createLinearGradient(-20, 120, 40, 210);
  cu.addColorStop(0, "#f0b090");
  cu.addColorStop(1, "#c47b62");
  g.fillStyle = cu;
  k.redondo(g, -18, 108, 70, 90, 24);
  g.fill();
  // cara
  const piel = g.createLinearGradient(-140, -160, 120, 160);
  piel.addColorStop(0, "#ffe0cc");
  piel.addColorStop(0.45, "#f0b08a");
  piel.addColorStop(1, "#d48468");
  g.fillStyle = piel;
  g.beginPath();
  g.moveTo(-20, 150);
  g.quadraticCurveTo(90, 145, 130, 40);
  g.quadraticCurveTo(155, -40, 80, -150);
  g.quadraticCurveTo(10, -195, -50, -160);
  g.quadraticCurveTo(-110, -130, -145, -40);
  g.quadraticCurveTo(-170, 20, -120, 55);
  g.quadraticCurveTo(-150, 78, -108, 108);
  g.quadraticCurveTo(-70, 140, -20, 150);
  g.closePath();
  g.fill();
  g.save();
  g.clip();
  g.globalAlpha = 0.18;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -180, -200, 360, 400);
  g.restore();
  // oreja
  g.fillStyle = "#e7a07f";
  g.beginPath();
  g.ellipse(78, 10, 32, 48, 0.1, 0, 6.2832);
  g.fill();
  g.strokeStyle = "rgba(140,70,55,0.45)";
  g.lineWidth = 4;
  g.beginPath();
  g.ellipse(78, 12, 16, 26, 0.1, 0, 6.2832);
  g.stroke();
  // ojo
  const abierto = Math.max(0, Math.min(1, ojos));
  g.strokeStyle = "#3a241c";
  g.lineWidth = 6;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-98, -36);
  g.quadraticCurveTo(-70, -50 - abierto * 8, -42, -34);
  g.stroke();
  if (abierto > 0.15) {
    g.fillStyle = "#f7f4ef";
    g.beginPath();
    g.ellipse(-70, -22, 16, 6 + abierto * 10, 0, 0, 6.2832);
    g.fill();
    g.fillStyle = "#1c2430";
    g.beginPath();
    g.arc(-68, -21, 4 + abierto * 3, 0, 6.2832);
    g.fill();
  } else {
    g.strokeStyle = "#5a3a32";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(-96, -18);
    g.quadraticCurveTo(-70, -8, -46, -20);
    g.stroke();
  }
  // ceja
  g.strokeStyle = "#2a1a22";
  g.lineWidth = 7;
  g.beginPath();
  g.moveTo(-100, -52);
  g.quadraticCurveTo(-70, -64, -40, -50);
  g.stroke();
  // nariz ya está en el contorno; fosa
  g.fillStyle = "rgba(120,60,50,0.35)";
  g.beginPath();
  g.ellipse(-128, 62, 8, 5, 0.4, 0, 6.2832);
  g.fill();
  // boca
  g.strokeStyle = "#a85a58";
  g.lineWidth = 5;
  g.beginPath();
  g.moveTo(-86, 92);
  g.quadraticCurveTo(-56, 108 + boca * 36, -28, 92);
  g.stroke();
  if (boca > 0.2) {
    g.fillStyle = "#6e2430";
    g.beginPath();
    g.ellipse(-56, 108, 22, 6 + boca * 26, 0, 0, 6.2832);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)";
    g.beginPath();
    g.ellipse(-62, 100, 6, 3, 0, 0, 6.2832);
    g.fill();
  }
  // pelo delante
  g.fillStyle = "#241838";
  g.beginPath();
  g.moveTo(-40, -170);
  g.quadraticCurveTo(40, -210, 140, -80);
  g.quadraticCurveTo(100, -40, 70, -90);
  g.quadraticCurveTo(20, -150, -30, -120);
  g.quadraticCurveTo(-80, -150, -40, -170);
  g.fill();
  const mecha = g.createLinearGradient(-40, -180, 80, -40);
  mecha.addColorStop(0, "#3a2460");
  mecha.addColorStop(1, "#1a1028");
  g.fillStyle = mecha;
  g.beginPath();
  g.moveTo(-20, -160);
  g.quadraticCurveTo(70, -190, 120, -70);
  g.quadraticCurveTo(60, -100, 10, -130);
  g.quadraticCurveTo(-40, -150, -20, -160);
  g.fill();
  // auricular sobre el oído
  g.save();
  g.translate(86, 8);
  g.fillStyle = "#1c2230";
  g.beginPath();
  g.arc(0, 0, 54, 0, 6.2832);
  g.fill();
  const au = g.createRadialGradient(-12, -14, 8, 0, 0, 48);
  au.addColorStop(0, "#3a4458");
  au.addColorStop(1, "#12161f");
  g.fillStyle = au;
  g.beginPath();
  g.arc(0, 0, 46, 0, 6.2832);
  g.fill();
  g.strokeStyle = "rgba(120,230,255,0.85)";
  g.lineWidth = 4;
  g.beginPath();
  g.arc(0, 0, 28, 0, 6.2832);
  g.stroke();
  g.restore();
  // diadema
  g.strokeStyle = "#222838";
  g.lineWidth = 16;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(86, -30);
  g.quadraticCurveTo(40, -200, -70, -150);
  g.stroke();
  g.restore();
}

const mix = (a, b, u) => k.mezRgb(a, b, u);

export function cuarto(g, t, sol = 0, profundo = 0) {
  const dia = `rgb(${mix(mix("26,39,72", "18,8,28", profundo), "242,201,160", sol)})`;
  const diaS = `rgb(${mix(mix("7,11,20", "5,6,14", profundo), "196,139,98", sol * 0.55)})`;
  const bg = g.createLinearGradient(0, 0, 200, 1920);
  bg.addColorStop(0, dia);
  bg.addColorStop(1, diaS);
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.28;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, 0, 0, 1080, 1920);
  g.restore();
  // ventana
  const vx = 760, vy = 690;
  g.save();
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 20;
  k.redondo(g, vx, vy, 250, 320, 16);
  g.fillStyle = sol > 0.4 ? "#ffd7a4" : profundo > 0.4 ? "#071433" : "#0c1830";
  g.fill();
  g.restore();
  g.save();
  k.redondo(g, vx + 10, vy + 10, 230, 300, 10);
  g.clip();
  if (sol < 0.5 && profundo < 0.45) {
    const lunaY = 80 + (1 - sol) * 40 + Math.sin(t * 0.2) * 4;
    k.brillo(g, vx + 150, vy + lunaY, 160, "blanca", 0.9);
    g.fillStyle = "#f4f7ff";
    g.beginPath();
    g.arc(vx + 150, vy + lunaY, 36, 0, 6.2832);
    g.fill();
  }
  if (sol > 0.15) {
    k.brillo(g, vx + 120, vy + 70, 420, "255,210,140", sol);
  }
  g.restore();
  g.strokeStyle = sol > 0.5 ? "rgba(255,236,210,0.7)" : "rgba(200,220,255,0.35)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(vx + 125, vy);
  g.lineTo(vx + 125, vy + 320);
  g.moveTo(vx, vy + 160);
  g.lineTo(vx + 250, vy + 160);
  g.stroke();
  // cama
  g.fillStyle = sol > 0.55 ? "#6b3a42" : "#1c2438";
  k.redondo(g, -40, 1280, 1160, 780, 40);
  g.fill();
  const man = g.createLinearGradient(0, 1280, 0, 1700);
  man.addColorStop(0, sol > 0.55 ? "#a85a68" : "#2c3a58");
  man.addColorStop(1, sol > 0.55 ? "#6e303c" : "#182033");
  g.fillStyle = man;
  k.redondo(g, -40, 1360, 1160, 700, 30);
  g.fill();
  g.strokeStyle = sol > 0.5 ? "rgba(255,220,200,0.28)" : "rgba(180,200,240,0.22)";
  g.lineWidth = 10;
  g.lineCap = "round";
  for (let i = 0; i < 4; i++) {
    const y = 1420 + i * 90;
    g.beginPath();
    g.moveTo(40, y);
    g.quadraticCurveTo(540, y + 36 + Math.sin(t * 0.6 + i) * 6, 1040, y - 10);
    g.stroke();
  }
  for (const m of MOTAS) {
    const y = (m.y - t * m.v + 1920) % 1920;
    const al = 0.15 + 0.2 * (0.5 + 0.5 * Math.sin(t * 1.4 + m.f));
    g.fillStyle = sol > 0.5 ? `rgba(255,220,170,${al})` : `rgba(190,220,255,${al})`;
    g.fillRect(m.x, y, m.s, m.s);
  }
  if (profundo > 0.05) {
    g.save();
    g.globalAlpha = profundo * 0.55;
    g.fillStyle = "#06102a";
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
}

export function onda(g, t, y, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha = al;
  g.strokeStyle = "rgba(130,190,255,0.95)";
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  for (let x = 40; x <= 1040; x += 12) {
    const yy = y + Math.sin((x / 180) + t * 1.4) * 70;
    if (x === 40) g.moveTo(x, yy);
    else g.lineTo(x, yy);
  }
  g.stroke();
  g.restore();
}

export function mesa(g, t, noche = 0, manana = 0) {
  const dia = Math.max(0, 1 - noche) * (1 - manana * 0.15) + manana * 0.85;
  const n = Math.max(0, Math.min(1, noche * (1 - manana)));
  const top2 = `rgb(${mix(mix("58,36,24", "26,18,12", n), "255,208,160", manana)})`;
  const bot2 = `rgb(${mix(mix("138,90,50", "18,14,12", n), "201,132,74", manana * 0.7)})`;
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, dia > 0.5 && manana < 0.5 ? "#5a341c" : top2);
  bg.addColorStop(0.45, manana > 0.4 ? "#f0b27a" : bot2);
  bg.addColorStop(1, "#1a100c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  // sol o luna en la ventana, por debajo del subtítulo
  g.save();
  k.redondo(g, 700, 560, 300, 280, 18);
  g.fillStyle = noche > 0.6 && manana < 0.3 ? "#0d1830" : "#ffc98a";
  g.fill();
  g.restore();
  if (noche > 0.6 && manana < 0.4) k.brillo(g, 860, 680, 180, "blanca", 0.7);
  else k.brillo(g, 820, 660, 520, "255,200,120", 0.55 + 0.2 * manana);
  // tabla
  g.save();
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 30;
  g.shadowOffsetY = 16;
  k.redondo(g, 40, 1180, 1000, 820, 28);
  const mad = g.createLinearGradient(0, 1180, 0, 1600);
  mad.addColorStop(0, "#c4894e");
  mad.addColorStop(0.4, "#a86b38");
  mad.addColorStop(1, "#6b3e1e");
  g.fillStyle = mad;
  g.fill();
  g.restore();
  g.save();
  g.globalAlpha = 0.25;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.red, 40, 1180, 1000, 500);
  g.restore();
  for (const m of MOTAS) {
    if (m.y < 500) continue;
    const y = 520 + ((m.y + t * m.v * (noche > 0.5 ? 0.3 : 1)) % 700);
    g.fillStyle = `rgba(255,230,190,${0.12 + 0.12 * Math.sin(t + m.f)})`;
    g.fillRect(m.x, y, m.s, m.s);
  }
}

export function tecla(g, x, y, w, h, color, luz) {
  g.save();
  g.translate(x, y);
  g.shadowColor = "rgba(0,0,0,0.35)";
  g.shadowBlur = 18;
  g.shadowOffsetY = 12;
  k.redondo(g, -w / 2, -h / 2, w, h, 28);
  g.fillStyle = "#1a120e";
  g.fill();
  g.shadowColor = "transparent";
  const cara = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  cara.addColorStop(0, "#3a322c");
  cara.addColorStop(1, "#1c1614");
  k.redondo(g, -w / 2 + 6, -h / 2 + 6, w - 12, h - 18, 24);
  g.fillStyle = cara;
  g.fill();
  if (luz > 0.02) {
    k.redondo(g, -w / 2 + 14, -h / 2 + 14, w - 28, h - 36, 20);
    g.fillStyle = `rgba(${color.rgb},${0.25 + 0.75 * luz})`;
    g.fill();
    g.restore();
    k.brillo(g, x, y, w * 1.6, color.rgb, 0.45 * luz);
    return;
  }
  g.restore();
}

export function mano(g, x, y, hunde) {
  g.save();
  g.translate(x, y + (1 - hunde) * 36);
  const piel = g.createLinearGradient(-40, -220, 50, 20);
  piel.addColorStop(0, "#ffe0cc");
  piel.addColorStop(1, "#e09474");
  g.fillStyle = piel;
  g.shadowColor = "rgba(0,0,0,0.3)";
  g.shadowBlur = 16;
  g.shadowOffsetY = 10;
  g.beginPath();
  g.ellipse(16, -230, 78, 58, -0.35, 0, 6.2832);
  g.fill();
  for (let i = 0; i < 3; i++) {
    k.redondo(g, 18 + i * 6, -250 - i * 8, 32, 100, 14);
    g.fill();
  }
  k.redondo(g, -24, -150, 48, 160, 22);
  g.fill();
  g.shadowColor = "transparent";
  g.fillStyle = "#fff0e6";
  k.redondo(g, -14, -8, 28, 22, 8);
  g.fill();
  g.restore();
}

export function carta(g, x, y, s, texto, ang, al, color) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  g.globalAlpha *= al;
  g.shadowColor = "rgba(0,0,0,0.4)";
  g.shadowBlur = 20;
  k.redondo(g, -110, -70, 220, 140, 22);
  g.fillStyle = "#10141c";
  g.fill();
  g.shadowColor = "transparent";
  g.lineWidth = 5;
  g.strokeStyle = `rgba(${color},0.9)`;
  g.stroke();
  g.fillStyle = "#f4fbff";
  g.font = "800 42px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(texto, 0, 2);
  g.restore();
}
