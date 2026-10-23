// La lavadora de este vídeo: la misma puerta, el mismo tambor, la misma ropa y el mismo motor en todos los planos.
import * as k from "#kit";

const az = k.azar(41);
const TONOS = ["#ff3b5c", "#ffd23f", "#3d6bff", "#2ee6a6", "#ff8a3d", "#d56bff", "#f7f4ef", "#ff5ea8", "#49e0ff", "#ffe566"];

// Cada prenda vive en el tambor: radio y lado respecto de la aleta que la sube. Las «extra» solo entran con más carga.
export const PRENDAS = Array.from({ length: 18 }, (_, i) => ({
  tono: TONOS[i % TONOS.length],
  tipo: i % 3,
  radio: 0.38 + az() * 0.42,
  lado: (az() - 0.5) * 0.62,
  tam: 0.62 + az() * 0.55,
  ang: (az() - 0.5) * 1.4,
  extra: i >= 11,
}));

export const CX = 540, CY = 1040;

export function hielo(t, fin) {
  return k.suave(k.tramo(t, fin - 0.36, fin - 0.1));
}
export function tiempoQuieto(t, fin) {
  return k.mez(t, fin - 0.36, hielo(t, fin));
}

export function camara(g, cam, dibuja) {
  g.save();
  g.translate(540, CY);
  g.scale(cam.z, cam.z);
  g.translate(-cam.x, -cam.y);
  dibuja(g);
  g.restore();
}

export function velo(g) {
  const gr = g.createLinearGradient(0, 240, 0, 560);
  gr.addColorStop(0, "rgba(5,8,16,0.78)");
  gr.addColorStop(0.45, "rgba(5,8,16,0.4)");
  gr.addColorStop(1, "rgba(5,8,16,0)");
  g.fillStyle = gr;
  g.fillRect(0, 240, 1080, 340);
}

function prenda(g, x, y, s, ang, tono, tipo) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.scale(s, s);
  const osc = k.mezColor(tono, "#1a1028", 0.42);
  const cla = k.mezColor(tono, "#ffffff", 0.38);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath(); g.ellipse(8, 36, 46, 14, 0, 0, 6.3); g.fill();
  const gr = g.createLinearGradient(-50, -60, 40, 70);
  gr.addColorStop(0, cla); gr.addColorStop(0.45, tono); gr.addColorStop(1, osc);
  g.fillStyle = gr;
  if (tipo === 0) {
    k.redondo(g, -34, -18, 68, 86, 18); g.fill();
    g.beginPath(); g.moveTo(-34, -6); g.quadraticCurveTo(-78, 0, -66, 34); g.quadraticCurveTo(-36, 26, -26, 8); g.fill();
    g.beginPath(); g.moveTo(34, -6); g.quadraticCurveTo(78, 0, 66, 34); g.quadraticCurveTo(36, 26, 26, 8); g.fill();
    g.fillStyle = osc; g.beginPath(); g.ellipse(0, -14, 14, 9, 0, 0, 6.3); g.fill();
    g.strokeStyle = "rgba(0,0,0,0.2)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(-2, -4); g.quadraticCurveTo(10, 24, -6, 58); g.stroke();
  } else if (tipo === 1) {
    g.beginPath();
    g.moveTo(-16, -48); g.quadraticCurveTo(22, -52, 18, -10); g.quadraticCurveTo(28, 40, 4, 62);
    g.quadraticCurveTo(-22, 48, -18, 8); g.quadraticCurveTo(-24, -30, -16, -48); g.closePath(); g.fill();
    g.fillStyle = osc; k.redondo(g, -18, 40, 36, 22, 8); g.fill();
  } else {
    k.redondo(g, -48, -32, 96, 70, 12); g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-48, -6, 96, 12);
  }
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.beginPath(); g.ellipse(-16, -24, 16, 8, -0.6, 0, 6.3); g.fill();
  g.restore();
}

function aleta(g, cx, cy, R, a) {
  g.save();
  g.translate(cx, cy); g.rotate(a);
  const gr = g.createLinearGradient(0, -36, 0, 36);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.4, "#d5deea"); gr.addColorStop(1, "#5c6a7c");
  g.fillStyle = gr;
  k.redondo(g, R * 0.08, -32, R * 0.78, 64, 22); g.fill();
  g.fillStyle = "rgba(120,230,255,0.85)";
  g.fillRect(R * 0.1, -6, R * 0.74, 10);
  g.restore();
}

function ropa(g, cx, cy, R, est) {
  const alrededor = est.alrededor || 0;
  const capas = alrededor > 0.04 ? 2 : 1;
  for (let copia = capas - 1; copia >= 0; copia--) {
    const alfa = copia ? 0.22 * alrededor : 1;
    if (alfa < 0.02) continue;
    g.save();
    g.globalAlpha = alfa;
    const pala = est.pala - copia * 0.35 * alrededor;
    PRENDAS.forEach((p, i) => {
      if (p.extra && est.carga <= 0.001) return;
      const aPala = pala + p.lado;
      const rrPala = R * (0.42 + p.radio * 0.45);
      const aSpin = pala * 1.4 + p.ang * 2 + i * 0.85;
      const rrSpin = R * (0.15 + (i % 5) * 0.15);
      const a = aPala + (aSpin - aPala) * alrededor;
      const rr = rrPala + (rrSpin - rrPala) * alrededor;
      const destinoX = cx + Math.cos(a) * rr;
      const destinoY = cy + Math.sin(a) * rr;
      const u = p.extra ? k.entra(Math.min(1, est.carga)) : 1;
      const x = k.mez(cx + R * 1.2, destinoX, u);
      const y = k.mez(cy - R * 0.05, destinoY, u);
      prenda(g, x, y, p.tam * R * 0.014, p.ang + pala * 0.1, p.tono, p.tipo);
    });
    g.restore();
  }
}

function agua(g, cx, cy, R, nivel, tm) {
  if (nivel <= 0.01) return;
  const y = cy + R * 0.78 - nivel * R * 1.45;
  const gr = g.createLinearGradient(0, y - 10, 0, cy + R);
  gr.addColorStop(0, "rgba(170,240,255,0.35)");
  gr.addColorStop(0.15, "rgba(70,190,255,0.55)");
  gr.addColorStop(1, "rgba(10,70,170,0.78)");
  g.fillStyle = gr;
  g.fillRect(cx - R, y, R * 2, R * 2);
  g.strokeStyle = "rgba(230,252,255,0.85)"; g.lineWidth = 5;
  g.beginPath();
  for (let x = -R; x <= R; x += 10) g.lineTo(cx + x, y + Math.sin((x + tm * 90) / 16) * 5);
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.45)";
  for (let i = 0; i < 8; i++) {
    const bx = cx + Math.sin(tm * 1.7 + i) * R * 0.45;
    const by = y + 20 + ((tm * 40 + i * 37) % (nivel * R * 1.2 + 10));
    g.beginPath(); g.arc(bx, by, 4 + (i % 3), 0, 6.3); g.fill();
  }
}

// El tambor visto de frente: aletas, ropa, agua y el aro de acero.
export function tambor(g, cx, cy, R, est) {
  g.save();
  const fondo = g.createRadialGradient(cx - R * 0.15, cy - R * 0.2, R * 0.05, cx, cy, R);
  fondo.addColorStop(0, "#7f93b0"); fondo.addColorStop(0.45, "#2a384c"); fondo.addColorStop(1, "#070b12");
  g.fillStyle = fondo;
  g.beginPath(); g.arc(cx, cy, R, 0, 6.3); g.fill();
  g.save();
  g.beginPath(); g.arc(cx, cy, R * 0.9, 0, 6.3); g.clip();
  for (let i = 0; i < 3; i++) aleta(g, cx, cy, R, est.pala + (i * 2 * Math.PI) / 3);
  if (!est.sinRopa) ropa(g, cx, cy, R, est);
  agua(g, cx, cy, R * 0.9, est.agua || 0, est.tm || 0);
  g.restore();
  // agujeros del bombo, en el aro
  g.fillStyle = "#0c1018";
  for (let i = 0; i < 28; i++) {
    const a = est.pala * 0.15 + (i / 28) * 6.283;
    g.beginPath(); g.arc(cx + Math.cos(a) * R * 0.8, cy + Math.sin(a) * R * 0.8, R * 0.035, 0, 6.3); g.fill();
  }
  // aro de acero
  g.beginPath(); g.arc(cx, cy, R, 0, 6.3); g.arc(cx, cy, R * 0.9, 0, 6.3, true);
  const mg = g.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  mg.addColorStop(0, "#f4f7fb"); mg.addColorStop(0.35, "#6d7888"); mg.addColorStop(0.6, "#e7edf4"); mg.addColorStop(1, "#3c4552");
  g.fillStyle = mg; g.fill("evenodd");
  g.restore();
}

function motor(g, x, y, r, corriente) {
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.08, x, y, r);
  gr.addColorStop(0, corriente > 0.2 ? "#6a5030" : "#5c6572");
  gr.addColorStop(0.5, "#2a3038");
  gr.addColorStop(1, "#10141a");
  g.fillStyle = gr;
  g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
  g.strokeStyle = `rgba(255,186,60,${0.35 + corriente})`;
  g.lineWidth = 10 + corriente * 8;
  for (let i = 1; i <= 4; i++) {
    g.beginPath(); g.arc(x, y, r * 0.22 * i, 0.2, 2.4); g.stroke();
  }
  g.fillStyle = corriente > 0.3 ? "#ffe08a" : "#c9a06a";
  g.beginPath(); g.arc(x, y, r * 0.2, 0, 6.3); g.fill();
  if (corriente > 0.02) {
    k.brillo(g, x, y, r * (3.2 + corriente * 5), "sodio", 0.35 + corriente);
    g.strokeStyle = `rgba(255,210,80,${0.5 + corriente * 0.5})`;
    g.lineWidth = 16 + corriente * 64;
    g.lineCap = "round";
    g.beginPath(); g.moveTo(x - r * 0.3, y - r * 0.2); g.quadraticCurveTo(x - 160, y - 30, x - 280, y - 120); g.stroke();
    k.brillo(g, x - 180, y - 70, 120 + corriente * 220, "naranja", corriente * 0.85);
  }
}

export function cuarto(g) {
  const gr = g.createLinearGradient(0, 0, 0, 2100);
  gr.addColorStop(0, "#070b16");
  gr.addColorStop(0.22, "#10203c");
  gr.addColorStop(0.5, "#1a5674");
  gr.addColorStop(0.72, "#1c7a86");
  gr.addColorStop(1, "#12343c");
  g.fillStyle = gr;
  g.fillRect(-600, -400, 2400, 2800);
  // ventana con luz de tarde
  g.save();
  k.redondo(g, 70, 620, 280, 360, 18); g.fillStyle = "#9be7ff"; g.fill();
  g.fillStyle = "rgba(255,244,210,0.55)"; g.fillRect(70, 620, 280, 360);
  g.strokeStyle = "#f4efe4"; g.lineWidth = 14; g.stroke();
  g.strokeStyle = "#f4efe4"; g.lineWidth = 8;
  g.beginPath(); g.moveTo(210, 620); g.lineTo(210, 980); g.moveTo(70, 800); g.lineTo(350, 800); g.stroke();
  k.brillo(g, 210, 800, 520, "blanca", 0.18);
  g.restore();
  // baldosas del suelo
  const colores = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#f4f4f4", "#ff9f45"];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) {
    g.fillStyle = colores[(i + j * 2) % colores.length];
    g.fillRect(-200 + i * 200, 1560 + j * 140, 190, 130);
    g.fillStyle = "rgba(255,255,255,0.18)";
    g.fillRect(-200 + i * 200, 1560 + j * 140, 190, 16);
  }
}

export function cuerpo(g, x, y, w, h) {
  g.fillStyle = "rgba(0,0,0,0.35)";
  g.beginPath(); g.ellipse(x + w / 2, y + h - 10, w * 0.42, 28, 0, 0, 6.3); g.fill();
  const gr = g.createLinearGradient(x, y, x + w, y + h);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.4, "#e7eef6"); gr.addColorStop(1, "#b7c3d1");
  g.fillStyle = gr;
  k.redondo(g, x, y, w, h, 46); g.fill();
  g.save();
  k.redondo(g, x, y, w, h, 46); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18;
  g.drawImage(k.red, x, y, w, h);
  g.restore();
  // encimera negra
  g.fillStyle = "#141820";
  k.redondo(g, x + 28, y + 28, w - 56, 150, 24); g.fill();
}

function botella(g, x, y, h, color) {
  const gr = g.createLinearGradient(x, y, x + 54, y + h);
  gr.addColorStop(0, k.mezColor(color, "#ffffff", 0.4));
  gr.addColorStop(1, color);
  g.fillStyle = gr;
  k.redondo(g, x, y + 20, 54, h - 20, 12); g.fill();
  g.fillStyle = "#f4f4f4"; k.redondo(g, x + 12, y, 30, 28, 6); g.fill();
  g.fillStyle = "rgba(255,255,255,0.4)"; g.fillRect(x + 8, y + 40, 8, h * 0.4);
}

// Mando redondo. tope 0–1: de poca carga a carga completa. arco 0–1: el tiempo que se alarga.
export function mando(g, x, y, r, tope, arco) {
  const mg = g.createLinearGradient(x - r, y - r, x + r, y + r);
  mg.addColorStop(0, "#f7f9fc"); mg.addColorStop(0.5, "#8d98a6"); mg.addColorStop(1, "#d5dbe3");
  g.fillStyle = mg;
  g.beginPath(); g.arc(x, y, r, 0, 6.3); g.fill();
  g.fillStyle = "#161b22";
  g.beginPath(); g.arc(x, y, r * 0.72, 0, 6.3); g.fill();
  // dos marcas: poca ropa y el tambor lleno
  for (const [ang, grande] of [[-2.2, false], [-0.7, true]]) {
    const mx = x + Math.cos(ang) * r * 1.28, my = y + Math.sin(ang) * r * 1.28;
    prenda(g, mx, my, grande ? r * 0.012 : r * 0.007, 0.2, grande ? "#ffd23f" : "#9ad7ff", 0);
  }
  if (arco > 0.02) {
    g.strokeStyle = "#7dffe0"; g.lineWidth = r * 0.16; g.lineCap = "round";
    g.beginPath(); g.arc(x, y, r * 0.72, -1.2, -1.2 + arco * 3.4); g.stroke();
    k.brillo(g, x, y, r * 2.4, "verde", arco * 0.35);
  }
  const ang = k.mez(-2.2, -0.7, tope);
  g.strokeStyle = "#ffe08a"; g.lineWidth = r * 0.1; g.lineCap = "round";
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(ang) * r * 0.55, y + Math.sin(ang) * r * 0.55); g.stroke();
}

function tubo(g, est) {
  const x0 = 180, y0 = 470, x1 = 620, y1 = 470;
  // tubo opaco que llega a la cámara de cristal
  g.strokeStyle = "#d5dde8"; g.lineWidth = 36; g.lineCap = "round";
  g.beginPath(); g.moveTo(x0, y0); g.lineTo(300, y0); g.stroke();
  g.strokeStyle = "#9aa8b8"; g.lineWidth = 36;
  g.beginPath(); g.moveTo(470, y0); g.lineTo(x1, y1); g.lineTo(x1, 560); g.stroke();
  // cámara
  g.fillStyle = "rgba(190,230,255,0.18)";
  g.strokeStyle = "rgba(230,248,255,0.8)"; g.lineWidth = 8;
  g.beginPath(); g.arc(390, y0, 78, 0, 6.3); g.fill(); g.stroke();
  // agua dentro, el rodete y la compuerta. Nada aparece ni desaparece de golpe: se apaga con la válvula.
  const fluye = 1 - Math.min(1, est.valvula || 0);
  g.save();
  g.beginPath(); g.arc(390, y0, 70, 0, 6.3); g.clip();
  g.globalAlpha = 0.2 + 0.55 * fluye;
  g.fillStyle = "rgba(80,200,255,0.7)";
  g.fillRect(300, y0 - 24, 180, 48);
  g.globalAlpha = 0.85 * fluye;
  g.fillStyle = "rgba(230,250,255,0.9)";
  const flujo = est.tm * 140;
  for (let i = 0; i < 5; i++) {
    const x = 250 + ((flujo + i * 70) % 280);
    if (x > 320 && x < 460) continue;
    g.beginPath(); g.ellipse(x, y0, 16, 8, 0, 0, 6.3); g.fill();
  }
  g.restore();
  g.save();
  g.translate(390, y0); g.rotate(est.tm * 6);
  g.strokeStyle = "#f4f7fb"; g.lineWidth = 8; g.lineCap = "round";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * 6.283;
    g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 52, Math.sin(a) * 52); g.stroke();
  }
  g.restore();
  g.fillStyle = "#ffb02e";
  g.beginPath(); g.arc(390, y0, 8, 0, 6.3); g.fill();
  // pastilla del sensor Hall, a un lado
  g.fillStyle = "#1b2430";
  k.redondo(g, 448, y0 - 28, 36, 56, 6); g.fill();
  k.brillo(g, 466, y0, 40, "verde", 0.4 + 0.5 * (1 - est.valvula));
  // compuerta
  const compuerta = k.mez(-40, 36, est.valvula);
  g.fillStyle = "#ff5a3c";
  k.redondo(g, 500, y0 - 50 + compuerta, 28, 70, 6); g.fill();
}

// Lavadora de frente, en el lavadero. est: pala, vel, carga, agua, tm, corriente, tope, arco, valvula, golpe
export function lavadora(g, est) {
  cuarto(g);
  botella(g, 640, 450, 110, "#3d6bff");
  botella(g, 710, 470, 90, "#ffd23f");
  botella(g, 780, 455, 105, "#2ee6a6");
  cuerpo(g, 150, 560, 780, 1000);
  tubo(g, est);
  mando(g, 760, 650, 52, est.tope || 0, est.arco || 0);
  if ((est.arco || 0) > 0.02) {
    g.strokeStyle = "#7dffe0"; g.lineWidth = 26; g.lineCap = "round";
    g.beginPath(); g.arc(760, 650, 130, -1.15, -1.15 + est.arco * 3.5); g.stroke();
    k.brillo(g, 760, 650, 280, "verde", est.arco * 0.45);
  }
  // pantalla pequeña, ámbar, sin cifras inventadas
  g.fillStyle = "#0c1218"; k.redondo(g, 230, 610, 160, 64, 10); g.fill();
  g.fillStyle = "#ffb02e"; g.fillRect(250, 632, 40 + (est.arco || 0) * 90, 10);
  tambor(g, 540, 1100, 250, est);
  // junta
  g.strokeStyle = "#2a3038"; g.lineWidth = 28;
  g.beginPath(); g.arc(540, 1100, 268, 0, 6.3); g.stroke();
  // cristal
  g.save();
  g.beginPath(); g.arc(540, 1100, 250, 0, 6.3); g.clip();
  const vg = g.createLinearGradient(340, 900, 740, 1280);
  vg.addColorStop(0, "rgba(255,255,255,0.22)");
  vg.addColorStop(0.4, "rgba(255,255,255,0.02)");
  vg.addColorStop(1, "rgba(180,220,255,0.12)");
  g.fillStyle = vg; g.fillRect(280, 840, 520, 520);
  g.restore();
  k.reflejo(g, 430, 960, 28, 150, 0.28);
  // tirador
  g.strokeStyle = "#e8eef5"; g.lineWidth = 16; g.lineCap = "round";
  g.beginPath(); g.arc(760, 1100, 36, -1.2, 1.2); g.stroke();
  // camiseta que golpea el cristal (el hook)
  if (est.golpe > 0.01) {
    const u = k.entra(Math.min(1, est.golpe));
    prenda(g, k.mez(540, 470, u), k.mez(1100, 1040, u), k.mez(0.4, 2.1, u), -0.3, "#ff3b5c", 0);
  }
}

// El tambor enorme, de frente, con el motor al lado. El círculo llena la pantalla.
export function corte(g, est) {
  const gr = g.createLinearGradient(0, 0, 1080, 1920);
  gr.addColorStop(0, "#120a28");
  gr.addColorStop(0.35, "#1a3a68");
  gr.addColorStop(0.7, "#0e6a78");
  gr.addColorStop(1, "#072028");
  g.fillStyle = gr;
  g.fillRect(-400, -400, 2200, 2800);
  // la carcasa blanca alrededor, para que se vea que es la lavadora abierta
  const cg = g.createLinearGradient(40, 520, 1040, 1500);
  cg.addColorStop(0, "#f7f9fc"); cg.addColorStop(1, "#b7c3d2");
  g.fillStyle = cg;
  k.redondo(g, 40, 560, 1000, 980, 48); g.fill();
  tambor(g, 520, 1020, 400, est);
  g.strokeStyle = "#c9a06a"; g.lineWidth = 22; g.lineCap = "round";
  g.beginPath(); g.moveTo(640, 1100); g.lineTo(760, 1240); g.stroke();
  motor(g, 800, 1280, 150, est.corriente || 0);
}

export function fotograma(g, cam, est, modo) {
  camara(g, cam, (gg) => {
    if (modo === "corte") corte(gg, est);
    else lavadora(gg, est);
  });
  velo(g);
}

// ---------- debajo: las patas y una báscula que marca cero ----------
export function debajo(g, entra, sacude = 0) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#0e1624"); gr.addColorStop(0.35, "#1a3e46"); gr.addColorStop(1, "#12302c");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // panza de la lavadora
  const panza = g.createLinearGradient(0, 200, 0, 640);
  panza.addColorStop(0, "#ffffff"); panza.addColorStop(1, "#c5d0dc");
  g.fillStyle = panza; g.fillRect(120, 220, 840, 420);
  g.fillStyle = "#8b97a6"; g.fillRect(120, 600, 840, 28);
  // patas
  for (const x of [230, 850]) {
    const mg = g.createLinearGradient(x - 28, 0, x + 28, 0);
    mg.addColorStop(0, "#9aa3ae"); mg.addColorStop(0.5, "#f4f7fb"); mg.addColorStop(1, "#5c656f");
    g.fillStyle = mg; g.fillRect(x - 26, 628, 52, 210);
    g.fillStyle = "#2c333b"; g.beginPath(); g.ellipse(x, 850, 48, 18, 0, 0, 6.3); g.fill();
  }
  // baldosas
  const colores = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#fff6e0", "#ff9f45"];
  for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) {
    g.fillStyle = colores[(i * 3 + j) % colores.length];
    g.fillRect(40 + i * 170, 980 + j * 170, 158, 158);
  }
  // báscula
  const x = k.mez(1200, 540, entra) + sacude;
  bascula(g, x, 1280, 1);
  velo(g);
}

function bascula(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.3)";
  g.beginPath(); g.ellipse(0, 70, 200, 30, 0, 0, 6.3); g.fill();
  const gr = g.createLinearGradient(-180, -80, 180, 120);
  gr.addColorStop(0, "#ffffff"); gr.addColorStop(1, "#d5dde6");
  g.fillStyle = gr;
  k.redondo(g, -190, -70, 380, 180, 36); g.fill();
  g.fillStyle = "#10141c";
  k.redondo(g, -70, -36, 140, 90, 16); g.fill();
  g.fillStyle = "#9ad7ff"; g.font = "800 72px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("0", 0, 8);
  g.restore();
}

// ---------- el cesto ----------
function cesto(g, x, y, s, lleno) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.beginPath(); g.ellipse(0, 150, 150, 28, 0, 0, 6.3); g.fill();
  // cuerpo de mimbre
  g.beginPath();
  g.moveTo(-120, -20); g.lineTo(-150, 130); g.quadraticCurveTo(0, 180, 150, 130); g.lineTo(120, -20); g.closePath();
  const mg = g.createLinearGradient(-150, 0, 150, 140);
  mg.addColorStop(0, "#f0c48a"); mg.addColorStop(0.5, "#e09a45"); mg.addColorStop(1, "#b86a28");
  g.fillStyle = mg; g.fill();
  g.strokeStyle = "rgba(90,40,10,0.35)"; g.lineWidth = 4;
  for (let i = -3; i <= 3; i++) {
    g.beginPath(); g.moveTo(i * 28, -10); g.lineTo(i * 34, 140); g.stroke();
  }
  for (let row = 0; row < 5; row++) {
    g.beginPath(); g.moveTo(-140, row * 28); g.quadraticCurveTo(0, row * 28 + 16, 140, row * 28); g.stroke();
  }
  // boca
  g.fillStyle = "#f6d7a8"; g.beginPath(); g.ellipse(0, -20, 130, 36, 0, 0, 6.3); g.fill();
  g.strokeStyle = "#a8642c"; g.lineWidth = 8; g.stroke();
  if (lleno > 0.02) {
    const n = Math.round(lleno * 8);
    for (let i = 0; i < n; i++) {
      const p = PRENDAS[i];
      prenda(g, (i - 3.5) * 28, -70 - (i % 3) * 24 * lleno, 0.9, p.ang, p.tono, p.tipo);
    }
  }
  g.restore();
}

function brazo(g, mano, codo) {
  const hombro = [980, 640];
  const c = [k.mez(860, 720, codo), k.mez(780, 1040, codo)];
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "#f0b48a"; g.lineWidth = 78;
  g.beginPath(); g.moveTo(hombro[0], hombro[1]); g.lineTo(c[0], c[1]); g.lineTo(mano[0], mano[1]); g.stroke();
  g.strokeStyle = "#ffd23f"; g.lineWidth = 86;
  g.beginPath(); g.moveTo(hombro[0], hombro[1]); g.lineTo(k.mez(hombro[0], c[0], 0.85), k.mez(hombro[1], c[1], 0.85)); g.stroke();
  // mano
  g.fillStyle = "#f0b48a";
  g.beginPath(); g.arc(mano[0], mano[1], 36, 0, 6.3); g.fill();
  g.fillStyle = "rgba(255,255,255,0.3)";
  g.beginPath(); g.arc(mano[0] - 8, mano[1] - 10, 12, 0, 6.3); g.fill();
}

export function escenaCesto(g, alza, lleno, codo) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#1a1040"); gr.addColorStop(0.4, "#3a2a78"); gr.addColorStop(0.7, "#ff8a5b"); gr.addColorStop(1, "#c4483a");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  // mesa
  const mesa = g.createLinearGradient(0, 1280, 0, 1600);
  mesa.addColorStop(0, "#e8b07a"); mesa.addColorStop(1, "#a86838");
  g.fillStyle = mesa; g.fillRect(0, 1320, 1080, 600);
  g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(0, 1320, 1080, 16);
  const y = k.mez(1180, 860, alza);
  const mano = [560, y - 40];
  brazo(g, mano, codo);
  cesto(g, 460, y, 1.7, lleno);
  k.brillo(g, 200, 500, 400, "naranja", 0.2);
  velo(g);
}

// Apertura: una montaña de ropa ya está cayendo sobre la lavadora.
export function monton(g, t, fin) {
  const tm = tiempoQuieto(t, fin);
  const u = k.entra(k.tramo(tm, 0, 1.15));
  const yRopa = k.mez(640, 1040, u);
  const rebote = Math.sin(k.tramo(tm, 1.05, 1.7) * Math.PI) * (1 - k.tramo(tm, 1.2, 1.9)) * 28;
  g.save();
  g.translate(0, rebote);
  lavadora(g, { pala: tm * 6, alrededor: 1 - u, carga: 0, agua: 0, tm, corriente: 0, tope: 0, arco: 0, valvula: 1, golpe: 0 });
  g.restore();
  // la montaña, por encima, hasta que entra
  g.save();
  g.globalAlpha = 1 - k.suave(k.tramo(tm, 1.15, 1.7));
  for (let i = 0; i < 14; i++) {
    const p = PRENDAS[i];
    prenda(g, 540 + p.lado * 780, yRopa + (i % 5) * 70 - 160, 2.4 + p.tam, p.ang + tm * 0.4, p.tono, p.tipo);
  }
  g.restore();
  velo(g);
}
