// Guantes, cúter, esponja, alcohol, cinta, pistola, rasqueta, extractor, teléfono.
import * as k from "#kit";

export function guante(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const pintura = (x0, x1, y0, y1) => {
    const gr = g.createLinearGradient(x0, y0, x1, y1);
    gr.addColorStop(0, "#c48a12");
    gr.addColorStop(0.35, "#ffe7a0");
    gr.addColorStop(0.7, "#f0b020");
    gr.addColorStop(1, "#8a5e08");
    return gr;
  };
  for (const [dx, dy] of [[-62, -6], [-24, -18], [14, -16], [50, -4]]) {
    g.fillStyle = pintura(dx - 20, dx + 20, -180, -40);
    k.redondo(g, dx - 18, -188 + dy, 36, 118, 16);
    g.fill();
  }
  g.fillStyle = pintura(-78, 78, -80, 80);
  k.redondo(g, -78, -86, 156, 150, 48);
  g.fill();
  g.save();
  g.translate(-78, 8);
  g.rotate(-0.7);
  g.fillStyle = pintura(-20, 24, -20, 70);
  k.redondo(g, -18, -16, 40, 92, 16);
  g.fill();
  g.restore();
  g.fillStyle = pintura(-86, 86, 40, 90);
  k.redondo(g, -86, 46, 172, 42, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  k.redondo(g, -8, -170, 14, 200, 7);
  g.fill();
  g.restore();
}

export function cuchillo(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const cuerpo = g.createLinearGradient(0, -36, 0, 36);
  cuerpo.addColorStop(0, "#ffe56a");
  cuerpo.addColorStop(0.45, "#f5b400");
  cuerpo.addColorStop(1, "#c47c00");
  g.fillStyle = cuerpo;
  k.redondo(g, -150, -34, 230, 68, 16);
  g.fill();
  g.fillStyle = "#5c6570";
  k.redondo(g, -20, -10, 70, 20, 6);
  g.fill();
  const hoja = g.createLinearGradient(40, -8, 40, 14);
  hoja.addColorStop(0, "#ffffff");
  hoja.addColorStop(0.5, "#d5dde6");
  hoja.addColorStop(1, "#8e99a6");
  g.fillStyle = hoja;
  g.beginPath();
  g.moveTo(70, -7);
  g.lineTo(168, -7);
  g.lineTo(188, 2);
  g.lineTo(168, 11);
  g.lineTo(70, 11);
  g.closePath();
  g.fill();
  g.fillStyle = "#3a414a";
  g.beginPath();
  g.arc(-90, 0, 9, 0, 6.28);
  g.fill();
  g.restore();
}

export function esponja(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const gr = g.createLinearGradient(0, -50, 0, 50);
  gr.addColorStop(0, "#ffe14a");
  gr.addColorStop(0.5, "#f0a000");
  gr.addColorStop(1, "#c46a00");
  g.fillStyle = gr;
  k.redondo(g, -110, -48, 220, 96, 28);
  g.fill();
  g.fillStyle = "#6d8a2a";
  k.redondo(g, -110, 10, 220, 40, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  for (const [dx, dy] of [[-60, -20], [-10, -8], [40, -22], [70, -4]]) {
    g.beginPath();
    g.ellipse(dx, dy, 10, 7, 0, 0, 6.28);
    g.fill();
  }
  g.restore();
}

export function burbuja(g, x, y, r, al = 1) {
  if (al < 0.04 || r < 1) return;
  g.save();
  g.globalAlpha *= al;
  g.strokeStyle = "rgba(255,255,255,0.9)";
  g.lineWidth = 3;
  g.beginPath();
  g.arc(x, y, r, 0, 6.28);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fill();
  g.restore();
}

export function botella(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#6a4a28";
  k.redondo(g, -22, -150, 44, 36, 8);
  g.fill();
  const vid = g.createLinearGradient(-40, 0, 40, 0);
  vid.addColorStop(0, "#a86810");
  vid.addColorStop(0.35, "#ffd56a");
  vid.addColorStop(0.7, "#e09020");
  vid.addColorStop(1, "#7a4a08");
  g.fillStyle = vid;
  k.redondo(g, -46, -120, 92, 200, 24);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)";
  k.redondo(g, -28, -90, 16, 140, 8);
  g.fill();
  g.restore();
}

export function trapo(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#f4f7fb";
  g.beginPath();
  g.moveTo(-70, -36);
  g.quadraticCurveTo(0, -70, 80, -20);
  g.quadraticCurveTo(40, 50, -20, 48);
  g.quadraticCurveTo(-90, 20, -70, -36);
  g.fill();
  g.strokeStyle = "rgba(80,120,150,0.35)";
  g.lineWidth = 4;
  g.stroke();
  g.restore();
}

export function cinta(g, x, y, w, h, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.globalAlpha *= al;
  const gr = g.createLinearGradient(x, y, x, y + h);
  gr.addColorStop(0, "#8ec2ff");
  gr.addColorStop(0.4, "#2f78f0");
  gr.addColorStop(1, "#1a4eaa");
  g.fillStyle = gr;
  g.fillRect(x, y, w, h);
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(x, y, w, 8);
  g.restore();
}

export function pistola(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.strokeStyle = "#d5dde6";
  g.lineWidth = 10;
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(-40, -36);
  g.lineTo(150, -36);
  g.lineTo(170, 10);
  g.lineTo(-20, 28);
  g.closePath();
  g.stroke();
  const tubo = g.createLinearGradient(0, -28, 0, 28);
  tubo.addColorStop(0, "#ffffff");
  tubo.addColorStop(0.5, "#dfe7ef");
  tubo.addColorStop(1, "#8b97a4");
  g.fillStyle = tubo;
  k.redondo(g, -20, -30, 180, 52, 20);
  g.fill();
  g.fillStyle = "#f7f4ee";
  g.beginPath();
  g.moveTo(155, -8);
  g.lineTo(210, -2);
  g.lineTo(155, 10);
  g.closePath();
  g.fill();
  g.strokeStyle = "#9aa6b2";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(-10, 20);
  g.lineTo(-30, 90);
  g.stroke();
  g.restore();
}

export function ventana(g, x, y, abierta) {
  const u = Math.max(0, Math.min(1, abierta));
  g.save();
  g.translate(x, y);
  g.fillStyle = "#9ee8ff";
  const cielo = g.createLinearGradient(0, -280, 0, 280);
  cielo.addColorStop(0, "#b8f3ff");
  cielo.addColorStop(1, "#3cb4e0");
  g.fillStyle = cielo;
  k.redondo(g, -250, -300, 500, 600, 16);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.85)";
  g.beginPath();
  g.arc(80, -80, 54, 0, 6.28);
  g.fill();
  g.fillStyle = "#f4f7fb";
  g.fillRect(-270, -320, 36, 640);
  g.fillRect(230, -320, 36, 640);
  g.fillRect(-270, -320, 540, 36);
  g.fillRect(-270, 280, 540, 36);
  g.save();
  g.translate(-230, 0);
  g.scale(Math.max(0.08, 1 - u * 0.92), 1);
  g.fillStyle = "rgba(214, 236, 244, 0.55)";
  g.fillRect(0, -280, 460, 560);
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 10;
  g.strokeRect(8, -272, 444, 544);
  g.beginPath();
  g.moveTo(230, -272);
  g.lineTo(230, 272);
  g.moveTo(8, 0);
  g.lineTo(452, 0);
  g.stroke();
  g.restore();
  g.restore();
}

export function gafas(g, x, y, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.strokeStyle = "#16324a";
  g.lineWidth = 14;
  g.beginPath();
  g.arc(-70, 0, 58, 0, 6.28);
  g.arc(70, 0, 58, 0, 6.28);
  g.moveTo(-12, 0);
  g.lineTo(12, 0);
  g.stroke();
  g.fillStyle = "rgba(180, 230, 255, 0.45)";
  g.beginPath();
  g.arc(-70, 0, 48, 0, 6.28);
  g.arc(70, 0, 48, 0, 6.28);
  g.fill();
  g.strokeStyle = "#f0b020";
  g.lineWidth = 12;
  g.beginPath();
  g.moveTo(-120, -10);
  g.lineTo(-170, -40);
  g.moveTo(120, -10);
  g.lineTo(170, -40);
  g.stroke();
  g.restore();
}

export function mascarilla(g, x, y, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const gr = g.createLinearGradient(0, -70, 0, 80);
  gr.addColorStop(0, "#ffffff");
  gr.addColorStop(1, "#d5dde6");
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(-90, -20);
  g.quadraticCurveTo(-100, 80, 0, 90);
  g.quadraticCurveTo(100, 80, 90, -20);
  g.quadraticCurveTo(0, -80, -90, -20);
  g.fill();
  g.strokeStyle = "#b7c2ce";
  g.lineWidth = 4;
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.moveTo(-70, i * 16);
    g.quadraticCurveTo(0, i * 16 + 10, 70, i * 16);
    g.stroke();
  }
  g.strokeStyle = "#f0b020";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(-80, 0);
  g.lineTo(-140, -30);
  g.moveTo(80, 0);
  g.lineTo(140, -30);
  g.stroke();
  g.restore();
}

export function rasqueta(g, x, y, rot, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#22303c";
  k.redondo(g, -16, -20, 32, 280, 10);
  g.fill();
  const goma = g.createLinearGradient(-90, 0, 90, 0);
  goma.addColorStop(0, "#222");
  goma.addColorStop(0.5, "#555");
  goma.addColorStop(1, "#222");
  g.fillStyle = goma;
  k.redondo(g, -110, -48, 220, 40, 8);
  g.fill();
  g.restore();
}

export function ventilador(g, x, y, esc, ang, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#12323c";
  k.redondo(g, -150, -150, 300, 300, 36);
  g.fill();
  g.save();
  g.rotate(ang);
  g.fillStyle = "#e8eef4";
  for (let i = 0; i < 5; i++) {
    g.rotate((Math.PI * 2) / 5);
    g.beginPath();
    g.ellipse(70, 0, 78, 28, 0.4, 0, 6.28);
    g.fill();
  }
  g.restore();
  g.fillStyle = "#f0b020";
  g.beginPath();
  g.arc(0, 0, 22, 0, 6.28);
  g.fill();
  g.restore();
}

export function telefono(g, x, y, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  g.fillStyle = "#101820";
  k.redondo(g, -130, -250, 260, 500, 36);
  g.fill();
  g.fillStyle = "#16324a";
  k.redondo(g, -110, -210, 220, 360, 16);
  g.fill();
  const boton = g.createRadialGradient(0, 80, 10, 0, 90, 70);
  boton.addColorStop(0, "#b6ff8a");
  boton.addColorStop(1, "#1e9a32");
  g.fillStyle = boton;
  g.beginPath();
  g.arc(0, 90, 54, 0, 6.28);
  g.fill();
  g.strokeStyle = "#ffffff";
  g.lineWidth = 8;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, 90, 18, 0.6, 2.5);
  g.stroke();
  g.restore();
}

export function cristal(g, x, y, w, h) {
  const gr = g.createLinearGradient(x, y, x + w, y);
  gr.addColorStop(0, "rgba(190, 240, 255, 0.28)");
  gr.addColorStop(0.5, "rgba(230, 252, 255, 0.5)");
  gr.addColorStop(1, "rgba(150, 210, 230, 0.3)");
  g.fillStyle = gr;
  g.fillRect(x, y, w, h);
  g.strokeStyle = "rgba(255,255,255,0.7)";
  g.lineWidth = 8;
  g.strokeRect(x, y, w, h);
  g.strokeStyle = "rgba(80, 160, 190, 0.35)";
  g.lineWidth = 6;
  for (let i = 1; i < 4; i++) {
    g.beginPath();
    g.moveTo(x + (w / 4) * i, y);
    g.lineTo(x + (w / 4) * i, y + h);
    g.stroke();
  }
}
