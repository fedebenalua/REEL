// El mismo mando, la misma tele y el mismo móvil en todos los planos.
import * as k from "#kit";

const az = k.azar(23);
export const chispas = Array.from({ length: 36 }, () => ({
  u: az(), des: (az() - 0.5) * 2, s: 0.55 + az() * 0.9, f: az() * 6.28,
}));

export function velo(g, fuerza = 0.62) {
  const vg = g.createLinearGradient(0, 40, 0, 640);
  vg.addColorStop(0, `rgba(5,7,12,${fuerza})`);
  vg.addColorStop(0.62, `rgba(5,7,12,${fuerza * 0.55})`);
  vg.addColorStop(1, "rgba(5,7,12,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700);
}

// Ráfaga corta de luz violeta, de un ojo a otro. No es un rayo: son destellos que viajan y se apagan.
export function rafaga(g, x0, y0, x1, y1, t, desde, hasta, al = 1) {
  if (al <= 0.01 || t < desde || t > hasta + 0.15) return;
  const vida = 1 - k.tramo(t, hasta - 0.12, hasta + 0.15);
  g.save();
  for (const c of chispas) {
    const u = (c.u + (t - desde) * 0.85) % 1;
    const arco = Math.sin(u * Math.PI);
    const x = k.mez(x0, x1, u) + Math.sin(u * 9 + c.f) * 18 * c.des;
    const y = k.mez(y0, y1, u) - arco * 70;
    k.brillo(g, x, y, 36 + 40 * c.s, "violeta", al * vida * arco * (0.35 + 0.65 * c.s));
  }
  g.restore();
}

function cuerpo(g, x, y, w, h, r, colores) {
  k.redondo(g, x, y, w, h, r);
  const lg = g.createLinearGradient(x, y, x + w, y + h);
  lg.addColorStop(0, colores[0]); lg.addColorStop(0.42, colores[1]); lg.addColorStop(1, colores[2]);
  g.fillStyle = lg; g.fill();
  g.save(); k.redondo(g, x, y, w, h, r); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.22;
  g.drawImage(k.manchas, x, y, w, h); g.restore();
  g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 3;
  k.redondo(g, x, y, w, h, r); g.stroke();
}

// Un mando. El centro es (x, y). h es el alto. tipo: core, tv, vcr, barato.
// o: ang, al, aprende (0-1, botones que ya aprendió), lcd (0-1), ojo (brillo del infrarrojo), pulsa (0-1, el botón gordo).
export function mando(g, x, y, h, tipo = "core", o = {}) {
  const w = h * (tipo === "core" ? 0.36 : tipo === "vcr" ? 0.48 : 0.42);
  const al = o.al ?? 1;
  if (al <= 0.02) return;
  g.save(); g.translate(x, y); g.rotate(o.ang || 0); g.globalAlpha *= al;
  g.fillStyle = "rgba(0,0,0,0.4)"; g.beginPath(); g.ellipse(w * 0.05, h * 0.5, w * 0.72, h * 0.045, 0, 0, 6.28); g.fill();
  const pal = {
    core: ["#f3ead8", "#cbb892", "#8d7352"],
    tv: ["#3a404c", "#16181e", "#0b0c10"],
    vcr: ["#f4f7fb", "#b7c0cc", "#6d7786"],
    barato: ["#ffb703", "#f48c06", "#9a4d00"],
  }[tipo];
  cuerpo(g, -w / 2, -h / 2, w, h, w * 0.16, pal);
  // el ojo, arriba
  const ew = w * 0.42, eh = Math.max(10, h * 0.04), ey = -h / 2 + h * 0.055;
  k.redondo(g, -ew / 2, ey, ew, eh, eh / 2); g.fillStyle = "#07080c"; g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(-ew / 4, ey + 2, ew / 2, 2);
  if (o.ojo) k.brillo(g, 0, ey + eh / 2, w * 1.1, "violeta", o.ojo);
  if (tipo === "core") {
    const lw = w * 0.76, lh = h * 0.15, ly = -h / 2 + h * 0.14;
    k.redondo(g, -lw / 2, ly, lw, lh, 10); g.fillStyle = "#07160e"; g.fill();
    g.strokeStyle = "rgba(80,180,110,0.4)"; g.lineWidth = 2; g.stroke();
    const lcd = o.lcd ?? 0;
    for (let i = 0; i < 4; i++) {
      const u = k.suave(k.tramo(lcd, i / 4, (i + 0.85) / 4));
      if (u <= 0) continue;
      g.fillStyle = `rgba(130,255,170,${0.35 + 0.65 * u})`;
      g.fillRect(-lw / 2 + 12, ly + 10 + i * (lh * 0.2), (lw - 36) * (0.45 + 0.5 * ((i * 2) % 3) / 3) * u, lh * 0.12);
    }
  }
  const cols = tipo === "core" ? 4 : 3;
  const rows = tipo === "core" ? 5 : 4;
  const top = tipo === "core" ? -h * 0.12 : -h * 0.28;
  const bw = w * 0.72 / cols, bh = Math.min(bw * 0.72, h * 0.42 / rows);
  const aprende = o.aprende ?? 0, total = cols * rows;
  let i = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
    const bx = -w * 0.36 + c * bw, by = top + r * (bh + 7);
    const on = aprende >= (i + 0.35) / total;
    const esPoder = tipo !== "core" && i === 0;
    const hundido = (o.pulsa || 0) * (i === Math.floor(total / 2) ? 1 : 0);
    g.save(); g.translate(0, hundido * 5);
    k.redondo(g, bx + 3, by, bw - 8, bh, 7);
    if (esPoder) g.fillStyle = on || tipo === "tv" || tipo === "barato" ? "#e23a3a" : "#6a3030";
    else if (tipo === "core") g.fillStyle = on ? "#fff6e4" : "#6c5840";
    else g.fillStyle = on ? "#f7f4ee" : "rgba(10,10,14,0.55)";
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(bx + 7, by + 3, bw - 16, 3);
    g.restore();
  }
  g.restore();
}

// Dónde está el ojo de un mando recto, para enganchar la ráfaga.
export const ojo = (x, y, h) => [x, y - h / 2 + h * 0.075];

export function teleGorda(g, x, y, w, t, on, canal) {
  const h = w * 0.78;
  g.save(); g.translate(x, y);
  cuerpo(g, -w / 2, -h / 2, w, h, 28, ["#6a5344", "#3a2c24", "#1c1410"]);
  const sw = w * 0.78, sh = h * 0.68;
  k.redondo(g, -sw / 2, -h * 0.4, sw, sh, 18); g.fillStyle = "#05060a"; g.fill();
  if (on > 0.01) {
    g.save(); k.redondo(g, -sw / 2, -h * 0.4, sw, sh, 18); g.clip();
    const pg = g.createLinearGradient(0, -h * 0.4, 0, -h * 0.4 + sh);
    pg.addColorStop(0, `rgba(255,${140 + Math.floor(40 * Math.sin(t))},90,${on})`);
    pg.addColorStop(0.55, `rgba(40,90,220,${on})`);
    pg.addColorStop(1, `rgba(10,20,40,${on})`);
    g.fillStyle = pg; g.fillRect(-sw / 2, -h * 0.4, sw, sh);
    g.globalAlpha *= on;
    g.fillStyle = "rgba(255,220,140,0.9)";
    g.beginPath(); g.ellipse(0, sh * 0.05, sw * 0.22, sh * 0.1, 0, 0, 6.28); g.fill();
    g.fillStyle = "#16331c"; g.fillRect(-sw / 2, sh * 0.18, sw, sh * 0.3);
    // barrido, para que la pantalla viva
    g.globalAlpha *= 0.18; g.fillStyle = "#fff";
    const barra = ((t * 80) % sh);
    g.fillRect(-sw / 2, -h * 0.4 + barra, sw, 8);
    g.restore();
    if (canal > 0.02) {
      g.globalAlpha = on * canal;
      g.fillStyle = "#fff"; g.font = "900 200px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("4", 0, -h * 0.08);
      g.globalAlpha = 1;
    }
  }
  // el cristal curvo
  g.save(); k.redondo(g, -sw / 2, -h * 0.4, sw, sh, 18); g.clip();
  const rg = g.createLinearGradient(-sw / 2, 0, sw / 2, 0);
  rg.addColorStop(0, "rgba(255,255,255,0.16)"); rg.addColorStop(0.2, "rgba(255,255,255,0)"); rg.addColorStop(1, "rgba(0,0,0,0.25)");
  g.fillStyle = rg; g.fillRect(-sw / 2, -h * 0.4, sw, sh); g.restore();
  // altavoz y piloto
  g.fillStyle = "#120e0c";
  for (let i = 0; i < 5; i++) g.fillRect(w * 0.34, -h * 0.2 + i * 16, w * 0.08, 6);
  g.fillStyle = on > 0.4 ? "#3dff7a" : "#3a1818"; g.beginPath(); g.arc(-w * 0.38, h * 0.34, 7, 0, 6.28); g.fill();
  g.restore();
}

export function video(g, x, y, w, t, gira) {
  const h = w * 0.28;
  g.save(); g.translate(x, y);
  cuerpo(g, -w / 2, -h / 2, w, h, 12, ["#2c3138", "#15181c", "#0c0e12"]);
  // la ventana de la cinta
  k.redondo(g, -w * 0.22, -h * 0.28, w * 0.44, h * 0.56, 8); g.fillStyle = "#0a0c10"; g.fill();
  const spin = gira * t * 6;
  for (const sx of [-w * 0.1, w * 0.1]) {
    g.save(); g.translate(sx, 0); g.rotate(spin);
    g.strokeStyle = "#d7dbe2"; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 16, 0, 6.28); g.stroke();
    g.beginPath(); g.moveTo(0, -14); g.lineTo(0, 14); g.moveTo(-14, 0); g.lineTo(14, 0); g.stroke();
    g.restore();
  }
  g.fillStyle = "#9cffb0"; g.font = "700 28px Figtree"; g.textAlign = "left"; g.textBaseline = "middle";
  const hora = 10 + Math.floor(gira * Math.max(0, t) * 3) % 12;
  const min = Math.floor((gira * t * 47) % 60);
  g.fillText(`${String(hora).padStart(2, "0")}:${String(min).padStart(2, "0")}`, w * 0.28, 0);
  g.fillStyle = gira > 0.2 ? "#ff4d4d" : "#3a1818"; g.beginPath(); g.arc(-w * 0.38, 0, 7, 0, 6.28); g.fill();
  g.restore();
}

export function apple(g, x, y, w, t, on) {
  const h = w * 0.92;
  g.save(); g.translate(x, y); g.globalAlpha *= Math.max(0, on);
  // monitor
  cuerpo(g, -w * 0.4, -h * 0.5, w * 0.8, w * 0.62, 16, ["#f3e6cf", "#d9c3a2", "#b08968"]);
  k.redondo(g, -w * 0.32, -h * 0.46, w * 0.64, w * 0.46, 8); g.fillStyle = "#031208"; g.fill();
  if (on > 0.15) {
    g.save(); k.redondo(g, -w * 0.32, -h * 0.46, w * 0.64, w * 0.46, 8); g.clip();
    g.globalAlpha *= Math.min(1, on);
    g.fillStyle = "rgba(80,255,140,0.85)"; g.font = "700 26px Figtree"; g.textAlign = "left";
    for (let i = 0; i < 8; i++) {
      const ancho = (0.35 + 0.6 * ((i * 5 + 2) % 7) / 7) * w * 0.5;
      g.fillRect(-w * 0.26, -h * 0.4 + i * 28, ancho, 12);
    }
    const scan = (t * 70) % (w * 0.46);
    g.globalAlpha *= 0.25; g.fillStyle = "#fff"; g.fillRect(-w * 0.32, -h * 0.46 + scan, w * 0.64, 6);
    g.restore();
  }
  // la caja con teclado
  cuerpo(g, -w * 0.5, h * 0.08, w, h * 0.34, 14, ["#f7ecda", "#e2cba8", "#c4a27a"]);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 10; c++) {
    g.fillStyle = "#2a241c"; k.redondo(g, -w * 0.42 + c * w * 0.086, h * 0.16 + r * 22, w * 0.07, 14, 3); g.fill();
  }
  g.restore();
}

export function lapiz(g, x, y, largo, ang = -0.08) {
  const w = largo * 0.085;
  g.save(); g.translate(x, y); g.rotate(ang);
  g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(0, w * 0.9, largo * 0.46, w * 0.35, 0, 0, 6.28); g.fill();
  const x0 = -largo * 0.5, x1 = largo * 0.3;
  // tres caras del hexágono
  const yg = g.createLinearGradient(0, -w, 0, w);
  yg.addColorStop(0, "#f0c84a"); yg.addColorStop(0.35, "#ffe07a"); yg.addColorStop(0.62, "#e2a514"); yg.addColorStop(1, "#b98308");
  g.fillStyle = yg; g.fillRect(x0, -w, x1 - x0, w * 2);
  g.strokeStyle = "rgba(120,70,0,0.35)"; g.lineWidth = 2;
  g.beginPath(); g.moveTo(x0, -w * 0.15); g.lineTo(x1, -w * 0.15); g.stroke();
  // madera y mina
  g.beginPath(); g.moveTo(x1, -w); g.lineTo(largo * 0.46, 0); g.lineTo(x1, w); g.closePath();
  const mg = g.createLinearGradient(x1, 0, largo * 0.46, 0);
  mg.addColorStop(0, "#f6e2b8"); mg.addColorStop(1, "#d7b581");
  g.fillStyle = mg; g.fill();
  g.beginPath(); g.moveTo(largo * 0.4, -w * 0.28); g.lineTo(largo * 0.5, 0); g.lineTo(largo * 0.4, w * 0.28); g.closePath();
  g.fillStyle = "#2b2b2e"; g.fill();
  // virola y goma
  g.fillStyle = "#d5d8de"; g.fillRect(x0 - largo * 0.06, -w, largo * 0.08, w * 2);
  g.fillStyle = "#f2a3b0"; k.redondo(g, x0 - largo * 0.13, -w * 0.85, largo * 0.08, w * 1.7, 6); g.fill();
  g.restore();
}

export function telePlana(g, x, y, w, on) {
  const h = w * 0.56;
  g.save(); g.translate(x, y);
  k.redondo(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = "#0c0e12"; g.fill();
  if (on > 0.02) {
    g.save(); k.redondo(g, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 10); g.clip();
    const pg = g.createLinearGradient(0, -h / 2, 0, h / 2);
    pg.addColorStop(0, `rgba(70,140,255,${on})`); pg.addColorStop(1, `rgba(10,30,70,${on})`);
    g.fillStyle = pg; g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle = `rgba(255,255,255,${0.85 * on})`; g.font = "800 64px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("CH 4", 0, -8);
    g.restore();
  }
  g.fillStyle = "#1a1d22"; g.fillRect(-w * 0.08, h / 2, w * 0.16, 18);
  g.fillRect(-w * 0.22, h / 2 + 18, w * 0.44, 8);
  g.restore();
}

// El móvil, de pie. La pantalla es un mando: poder, volumen, canal.
export function movil(g, x, y, h, t, ui) {
  const w = h * 0.48;
  g.save(); g.translate(x, y);
  g.fillStyle = "rgba(0,0,0,0.45)"; g.beginPath(); g.ellipse(0, h * 0.52, w * 0.7, 16, 0, 0, 6.28); g.fill();
  k.redondo(g, -w / 2, -h / 2, w, h, 48);
  k.metal(g, -w / 2, w / 2, ["#2a2d34", "#d5dae2", "#8b929e", "#f4f6f8", "#22252b"]);
  const sw = w - 28, sh = h - 28;
  k.redondo(g, -sw / 2, -sh / 2, sw, sh, 40); g.fillStyle = "#070910"; g.fill(); g.save(); g.clip();
  const pg = g.createLinearGradient(0, -sh / 2, 0, sh / 2);
  pg.addColorStop(0, "#142033"); pg.addColorStop(1, "#070910");
  g.fillStyle = pg; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  const a = Math.max(0, ui);
  g.globalAlpha *= a;
  // poder
  g.strokeStyle = "#ff5a5a"; g.lineWidth = 8; g.beginPath(); g.arc(0, -sh * 0.28, 46, 0.6, 5.6); g.stroke();
  g.beginPath(); g.moveTo(0, -sh * 0.28 - 62); g.lineTo(0, -sh * 0.28 - 28); g.stroke();
  // volumen y canal, grandes
  const bot = (bx, by, rot, color) => {
    g.save(); g.translate(bx, by); g.rotate(rot);
    k.redondo(g, -70, -28, 140, 56, 28); g.fillStyle = color; g.fill();
    g.fillStyle = "#fff"; g.font = "800 36px Figtree"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("▲", 0, 2);
    g.restore();
  };
  bot(-sw * 0.22, sh * 0.08, 0, "rgba(40,120,255,0.95)");
  bot(sw * 0.22, sh * 0.08, Math.PI, "rgba(40,120,255,0.75)");
  bot(-sw * 0.22, sh * 0.28, -Math.PI / 2, "rgba(255,180,40,0.95)");
  bot(sw * 0.22, sh * 0.28, Math.PI / 2, "rgba(255,180,40,0.75)");
  g.restore();
  // isla
  k.redondo(g, -46, -sh / 2 + 16, 92, 26, 13); g.fillStyle = "#05060a"; g.fill();
  const br = 0.5 + 0.5 * Math.sin(t * 2);
  k.brillo(g, 0, 0, w * 1.4, "cian", 0.18 * a * br);
  g.restore();
}

export function caja(g, x, y, w, tapa) {
  const h = w * 0.72, p = w * 0.34;
  g.save(); g.translate(x, y);
  // lateral
  g.beginPath(); g.moveTo(-w / 2, -h * 0.1); g.lineTo(-w / 2 - p, -h * 0.1 - p * 0.55); g.lineTo(-w / 2 - p, h * 0.45 - p * 0.55); g.lineTo(-w / 2, h * 0.45); g.closePath();
  g.fillStyle = "#a8743a"; g.fill();
  g.beginPath(); g.moveTo(w / 2, -h * 0.1); g.lineTo(w / 2 + p * 0.15, -h * 0.1 - 8); g.lineTo(w / 2 + p * 0.15, h * 0.45 - 8); g.lineTo(w / 2, h * 0.45); g.closePath();
  g.fillStyle = "#c4924e"; g.fill();
  // frente
  g.fillStyle = "#d7a35c"; g.fillRect(-w / 2, -h * 0.1, w, h * 0.55);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha *= 0.25; g.drawImage(k.manchas, -w / 2, -h * 0.1, w, h * 0.55); g.restore();
  // solapa interior
  g.fillStyle = "#e6c48a"; g.beginPath();
  g.moveTo(-w / 2, -h * 0.1); g.lineTo(0, -h * 0.1 - p * 0.2); g.lineTo(w / 2, -h * 0.1); g.closePath(); g.fill();
  // tapa, gira con `tapa` 0 abierta, 1 cerrada
  g.save(); g.translate(0, -h * 0.1); g.transform(1, 0, 0, 0.35 + 0.65 * (1 - tapa), 0, -p * 0.9 * (1 - tapa));
  g.globalAlpha *= 0.35 + 0.65 * tapa;
  g.fillStyle = "#e0b56a"; g.fillRect(-w / 2, -h * 0.08, w, h * 0.16 + p * 0.15);
  g.restore();
  // cinta
  g.fillStyle = "rgba(196,160,90,0.9)"; g.fillRect(-w * 0.08, -h * 0.1, w * 0.16, h * 0.55);
  g.restore();
}

export function sofa(g, x, y, w, al = 1) {
  g.save(); g.globalAlpha *= al; g.translate(x, y);
  k.redondo(g, -w / 2, -40, w, 120, 30); g.fillStyle = "#6d2430"; g.fill();
  k.redondo(g, -w / 2 + 20, -70, w * 0.34, 70, 18); g.fillStyle = "#8a3140"; g.fill();
  g.restore();
}

export function taza(g, x, y, al = 1) {
  if (al <= 0.02) return;
  g.save(); g.translate(x, y); g.globalAlpha *= al;
  g.fillStyle = "#f4f1ea"; k.redondo(g, -28, -36, 56, 48, 8); g.fill();
  g.strokeStyle = "#f4f1ea"; g.lineWidth = 8; g.beginPath(); g.arc(36, -8, 16, -1.2, 1.2); g.stroke();
  g.fillStyle = "#6b3a22"; g.fillRect(-22, -36, 44, 10);
  g.restore();
}
