// El salón, la tele, las seis válvulas, el mando de martillo y el móvil. La misma cosa en todos los planos.
import * as k from "#kit";

export function velo(g, fuerza = 1) {
  const v = g.createLinearGradient(0, 200, 0, 640);
  v.addColorStop(0, `rgba(6,4,12,${0.78 * fuerza})`);
  v.addColorStop(0.62, `rgba(6,4,12,${0.42 * fuerza})`);
  v.addColorStop(1, "rgba(6,4,12,0)");
  g.fillStyle = v;
  g.fillRect(0, 180, 1080, 500);
}

export function habitacion(g, t, dentro) {
  const pared = g.createLinearGradient(0, 0, 1080, 1920);
  pared.addColorStop(0, "#140c28");
  pared.addColorStop(0.42, "#4a1840");
  pared.addColorStop(0.7, "#7a3418");
  pared.addColorStop(1, "#1a0c08");
  g.fillStyle = pared;
  g.fillRect(0, 0, 1080, 1920);
  const lam = g.createRadialGradient(160, 430, 10, 200, 560, 980);
  lam.addColorStop(0, "rgba(255,196,110,0.62)");
  lam.addColorStop(0.35, "rgba(255,140,50,0.16)");
  lam.addColorStop(1, "rgba(255,120,40,0)");
  g.fillStyle = lam;
  g.fillRect(0, 0, 1080, 1920);
  // suelo de madera, cálido, con veta
  g.save();
  g.beginPath();
  g.moveTo(0, 1280);
  g.lineTo(1080, 1220);
  g.lineTo(1080, 1920);
  g.lineTo(0, 1920);
  g.closePath();
  g.clip();
  const suelo = g.createLinearGradient(0, 1200, 0, 1920);
  suelo.addColorStop(0, "#8a4e28");
  suelo.addColorStop(1, "#3a1c0e");
  g.fillStyle = suelo;
  g.fillRect(0, 1200, 1080, 760);
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.45;
  g.drawImage(k.red, -((t * 24) % 700), 1180, 1600, 800);
  g.restore();
  // alfombra
  g.save();
  g.fillStyle = "#9c2438";
  g.beginPath();
  g.moveTo(180, 1460);
  g.lineTo(940, 1400);
  g.lineTo(1020, 1680);
  g.lineTo(120, 1760);
  g.closePath();
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.35;
  g.drawImage(k.manchas, 120, 1400, 900, 380);
  g.restore();
  if (dentro > 0.004) {
    g.fillStyle = `rgba(8,5,12,${dentro})`;
    g.fillRect(0, 0, 1080, 1920);
    const horno = g.createRadialGradient(540, 980, 30, 540, 1000, 860);
    horno.addColorStop(0, `rgba(255,150,40,${0.42 * dentro})`);
    horno.addColorStop(0.45, `rgba(180,60,10,${0.16 * dentro})`);
    horno.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = horno;
    g.fillRect(0, 0, 1080, 1920);
  }
}

// Una válvula de vacío: cristal, placa, filamento naranja, casquillo.
export function tubo(g, x, y, h, calor) {
  if (h < 10) return;
  const w = h * 0.34;
  const top = y - h * 0.48;
  const cuello = y + h * 0.28;
  const c = Math.max(0, Math.min(1.4, calor));
  k.brillo(g, x, y - h * 0.05, h * 1.35, "fuego", 0.28 + 0.55 * Math.min(1, c));
  g.save();
  g.beginPath();
  g.moveTo(x - w * 0.46, cuello);
  g.lineTo(x - w * 0.5, top + w * 0.72);
  g.quadraticCurveTo(x - w * 0.62, top + w * 0.05, x, top);
  g.quadraticCurveTo(x + w * 0.62, top + w * 0.05, x + w * 0.5, top + w * 0.72);
  g.lineTo(x + w * 0.46, cuello);
  g.closePath();
  g.save();
  g.clip();
  const interior = g.createLinearGradient(x, top, x, cuello);
  interior.addColorStop(0, "rgba(18,10,28,0.35)");
  interior.addColorStop(1, "rgba(40,16,12,0.55)");
  g.fillStyle = interior;
  g.fillRect(x - w, top, w * 2, h);
  // placa gris
  g.fillStyle = "rgba(70,74,82,0.85)";
  g.fillRect(x - w * 0.22, top + h * 0.22, w * 0.44, h * 0.38);
  g.fillStyle = "rgba(20,22,28,0.9)";
  g.fillRect(x - w * 0.1, top + h * 0.26, w * 0.2, h * 0.3);
  // filamento
  g.strokeStyle = `rgba(255,${Math.round(150 + 70 * Math.min(1, c))},40,${0.45 + 0.55 * Math.min(1, c)})`;
  g.lineWidth = Math.max(2, w * 0.07);
  g.lineCap = "round";
  g.beginPath();
  const x0 = x;
  const y0 = top + h * 0.24;
  const y1 = top + h * 0.62;
  g.moveTo(x0, y0);
  for (let i = 1; i <= 8; i++) {
    const yy = y0 + ((y1 - y0) * i) / 8;
    const xx = x0 + Math.sin(i * 1.4 + c * 2) * w * 0.08 * (i % 2 === 0 ? 1 : -1);
    g.lineTo(xx, yy);
  }
  g.stroke();
  g.restore();
  k.vidrio(g, x - w * 0.7, x + w * 0.7, 0.55);
  g.restore();
  // reflejo de cristal
  g.save();
  g.fillStyle = "rgba(255,255,255,0.38)";
  k.redondo(g, x - w * 0.34, top + h * 0.12, w * 0.12, h * 0.36, w * 0.06);
  g.fill();
  g.restore();
  // casquillo
  const bh = h * 0.2;
  g.save();
  g.beginPath();
  g.moveTo(x - w * 0.4, cuello - 2);
  g.lineTo(x + w * 0.4, cuello - 2);
  g.lineTo(x + w * 0.34, cuello + bh);
  g.lineTo(x - w * 0.34, cuello + bh);
  g.closePath();
  k.metal(g, x - w * 0.4, x + w * 0.4, ["#5a4030", "#c4a07a", "#8a6848", "#e6d2b4", "#4a3428"]);
  g.restore();
  g.fillStyle = "#1a120e";
  for (let i = -2; i <= 2; i++) {
    g.fillRect(x + i * w * 0.13 - w * 0.025, cuello + bh, w * 0.05, h * 0.06);
  }
}

export function chasis(g, pts) {
  if (pts.some((p) => !p)) return;
  g.beginPath();
  g.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
  g.closePath();
  const sg = g.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
  sg.addColorStop(0, "#2a241c");
  sg.addColorStop(0.5, "#12100e");
  sg.addColorStop(1, "#3a3024");
  g.fillStyle = sg;
  g.fill();
  g.strokeStyle = "rgba(212,168,96,0.35)";
  g.lineWidth = 6;
  g.stroke();
}

// Tele de madera que se vuelve plana. m: 0 madera, 1 plana. separa: el tercio de oro se aparta.
// cristal: 1 estamos dentro y el centro es un hueco.
export function tele(g, x, y, h, m, separa, canal, ir, cristal) {
  if (h < 12 || h > 6000) return;
  const aspecto = k.mez(1.18, 1.62, m);
  const w = h * aspecto;
  const bezel = k.mez(0.09, 0.028, m) * h;
  const x0 = x - w / 2;
  const y0 = y - h / 2;
  const cuerpo = k.mezColor("#6b3a22", "#12141a", m);
  const sombra = k.mezColor("#3a1e10", "#05060a", m);
  g.save();
  g.translate(separa * w * 0.02, 0);
  // patas
  if (m < 0.85) {
    g.globalAlpha = 1 - m;
    g.fillStyle = "#2a160e";
    const ph = h * 0.12;
    g.fillRect(x0 + w * 0.12, y0 + h - ph * 0.2, w * 0.06, ph);
    g.fillRect(x0 + w * 0.82, y0 + h - ph * 0.2, w * 0.06, ph);
    g.globalAlpha = 1;
  }
  k.redondo(g, x0, y0, w, h * k.mez(1, 0.92, m), Math.min(w, h) * k.mez(0.06, 0.04, m));
  const cg = g.createLinearGradient(x0, y0, x0 + w, y0 + h);
  cg.addColorStop(0, cuerpo);
  cg.addColorStop(0.45, k.mezColor("#a86840", "#2a3140", m));
  cg.addColorStop(1, sombra);
  g.fillStyle = cg;
  g.fill();
  // veta
  if (m < 0.7) {
    g.save();
    g.globalAlpha = 0.35 * (1 - m);
    g.globalCompositeOperation = "multiply";
    g.drawImage(k.red, x0, y0, w, h);
    g.restore();
  }
  // tercio de oro, todavía pegado
  if (m < 0.35 && separa < 0.98) {
    g.save();
    g.globalAlpha = (1 - m) * (1 - separa * 0.85);
    const gx = x0 + w * 0.67;
    const gw = w * 0.33;
    g.beginPath();
    g.rect(gx, y0 + 8, gw - 8, h * k.mez(1, 0.92, m) - 16);
    g.clip();
    const og = g.createLinearGradient(gx, y0, gx + gw, y0);
    og.addColorStop(0, "#8a5a12");
    og.addColorStop(0.4, "#ffe08a");
    og.addColorStop(0.7, "#d4a017");
    og.addColorStop(1, "#6a480c");
    g.fillStyle = og;
    g.fillRect(gx, y0, gw, h);
    g.globalCompositeOperation = "screen";
    g.globalAlpha = 0.25;
    g.drawImage(k.manchas, gx, y0, gw, h);
    g.restore();
  }
  // pantalla
  const sx = x0 + bezel;
  const sy = y0 + bezel * k.mez(1.1, 0.8, m);
  const sw = w * k.mez(0.62, 1, m) - bezel * 2;
  const sh = h * k.mez(0.72, 0.86, m) - bezel * 2;
  const radio = k.mez(sw * 0.08, 18, m);
  if (cristal < 0.97) {
    g.save();
    g.globalAlpha = 1 - cristal;
    k.redondo(g, sx, sy, Math.max(8, sw), Math.max(8, sh), radio);
    const pg = g.createLinearGradient(sx, sy, sx, sy + sh);
    pg.addColorStop(0, "#1c3c7a");
    pg.addColorStop(0.45, "#0c1830");
    pg.addColorStop(1, "#241208");
    g.fillStyle = pg;
    g.fill();
    // sol en la pantalla, para que se vea encendida
    g.fillStyle = "rgba(255,196,80,0.9)";
    g.beginPath();
    g.arc(sx + sw * 0.72, sy + sh * 0.32, Math.min(sw, sh) * 0.12, 0, 6.2832);
    g.fill();
    g.fillStyle = "#12301c";
    g.beginPath();
    g.moveTo(sx, sy + sh * 0.78);
    g.quadraticCurveTo(sx + sw * 0.35, sy + sh * 0.55, sx + sw, sy + sh * 0.7);
    g.lineTo(sx + sw, sy + sh);
    g.lineTo(sx, sy + sh);
    g.fill();
    // número de canal, grande
    if (canal && sh > 80) {
      const tam = Math.min(sh * 0.62, sw * 0.7);
      g.font = `800 ${Math.round(tam)}px Figtree`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillStyle = "rgba(0,0,0,0.35)";
      g.fillText(String(canal.texto), sx + sw * 0.38, sy + sh * 0.48 + (canal.dy || 0) + 8);
      g.fillStyle = "#fff4d2";
      g.shadowColor = "rgba(255,220,140,0.8)";
      g.shadowBlur = 24;
      g.fillText(String(canal.texto), sx + sw * 0.38, sy + sh * 0.48 + (canal.dy || 0));
      g.shadowBlur = 0;
    }
    // brillo del cristal de la pantalla
    g.shadowColor = "transparent";
    const rg = g.createLinearGradient(sx, sy, sx + sw, sy + sh);
    rg.addColorStop(0, "rgba(255,255,255,0.22)");
    rg.addColorStop(0.3, "rgba(255,255,255,0)");
    rg.addColorStop(1, "rgba(255,255,255,0.05)");
    k.redondo(g, sx, sy, Math.max(8, sw), Math.max(8, sh), radio);
    g.fillStyle = rg;
    g.fill();
    g.restore();
  }
  // rejilla del altavoz, en la tele de madera
  if (m < 0.5 && cristal < 0.5) {
    g.save();
    g.globalAlpha = 1 - m * 2;
    g.fillStyle = "#1a100c";
    const rx = x0 + w * 0.7;
    const ry = y0 + h * 0.62;
    k.redondo(g, rx, ry, w * 0.22, h * 0.22, 12);
    g.fill();
    g.strokeStyle = "rgba(196,140,80,0.7)";
    g.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const yy = ry + 16 + i * (h * 0.22) / 7;
      g.beginPath();
      g.moveTo(rx + 10, yy);
      g.lineTo(rx + w * 0.22 - 10, yy);
      g.stroke();
    }
    g.restore();
  }
  // ventanita del chip (infrarrojo)
  if (m > 0.4) {
    const vw = Math.max(16, w * 0.08);
    const vh = Math.max(10, h * 0.035);
    const vx = x - vw / 2;
    const vy = y0 + h * k.mez(1, 0.92, m) - bezel * 0.85;
    g.save();
    g.globalAlpha = m;
    k.redondo(g, vx, vy, vw, vh, vh / 2);
    g.fillStyle = "#07080c";
    g.fill();
    g.restore();
    if (ir > 0.02) k.brillo(g, x, vy + vh / 2, vw * 3.2, "violeta", ir);
  }
  g.restore();
  return { x0, y0, w, h, cx: x, cy: y };
}

// El tercio de oro ya separado, a la derecha de la tele.
export function tercio(g, x, y, h, al) {
  if (al < 0.02 || h < 12) return;
  const w = h * 0.42;
  g.save();
  g.translate(x, y);
  g.globalAlpha = al;
  k.redondo(g, -w / 2, -h / 2, w, h, 28);
  const og = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  og.addColorStop(0, "#7a4e0c");
  og.addColorStop(0.35, "#ffe7a2");
  og.addColorStop(0.62, "#e0ac28");
  og.addColorStop(1, "#5c3a08");
  g.fillStyle = og;
  g.fill();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = al * 0.35;
  g.drawImage(k.manchas, -w / 2, -h / 2, w, h);
  g.restore();
  k.brillo(g, x, y, h * 0.8, "amarilla", 0.25 * al);
}

// Mando: fino 0 es el de martillo abierto; 1 es el negro de hoy.
export function mando(g, x, y, h, fino, ang, hit) {
  if (h < 12) return;
  const w = h * k.mez(0.78, 0.46, fino);
  const profund = h * k.mez(0.22, 0.06, fino);
  const x0 = x - w / 2;
  const y0 = y - h / 2;
  // cuerpo
  g.save();
  const tono = g.createLinearGradient(x0, y0, x0 + w, y0);
  const a = k.mezRgb("196,148,72", "28,30,36", fino);
  const b = k.mezRgb("255,220,150", "70,74,84", fino);
  const c = k.mezRgb("120,78,32", "12,12,16", fino);
  tono.addColorStop(0, `rgb(${c})`);
  tono.addColorStop(0.35, `rgb(${b})`);
  tono.addColorStop(0.7, `rgb(${a})`);
  tono.addColorStop(1, `rgb(${c})`);
  k.redondo(g, x0, y0, w, h, k.mez(36, 48, fino));
  g.fillStyle = tono;
  g.fill();
  g.restore();
  // cuatro botones altos que se aplastan
  const n = 4;
  const bh = h * k.mez(0.2, 0.07, fino);
  const bw = w * k.mez(0.16, 0.14, fino);
  const gap = (w - n * bw) / (n + 1);
  for (let i = 0; i < n; i++) {
    const bx = x0 + gap + i * (bw + gap);
    const hunde = i === 1 ? Math.max(0, ang) * h * 0.04 : 0;
    const by = y0 + h * k.mez(0.08, 0.18, fino) + hunde;
    g.save();
    k.redondo(g, bx, by, bw, bh, 10);
    const bg = g.createLinearGradient(bx, by, bx, by + bh);
    bg.addColorStop(0, k.mezColor("#fff2d0", "#e8e8ee", fino));
    bg.addColorStop(1, k.mezColor("#b88848", "#3a3e48", fino));
    g.fillStyle = bg;
    g.fill();
    g.restore();
  }
  // corte: varilla y martillo
  if (fino < 0.72) {
    g.save();
    g.globalAlpha = 1 - fino / 0.72;
    const ix = x0 + w * 0.1;
    const iy = y0 + h * 0.42;
    const iw = w * 0.8;
    const ih = h * 0.46;
    k.redondo(g, ix, iy, iw, ih, 16);
    g.fillStyle = "#120e0c";
    g.fill();
    // varilla
    const ry = iy + ih * 0.62;
    g.save();
    g.beginPath();
    g.rect(ix + iw * 0.12, ry - h * 0.025, iw * 0.7, h * 0.05);
    k.metal(g, ix, ix + iw, ["#8a929c", "#f4f7fb", "#c5ccd4", "#ffffff", "#6a727c"]);
    g.restore();
    // martillo
    const px = ix + iw * 0.22;
    const py = iy + ih * 0.28;
    const largo = iw * 0.38;
    const hx = px + Math.sin(ang) * largo;
    const hy = py + Math.cos(ang) * largo * 0.35 + ih * 0.2;
    g.strokeStyle = "#d7dde6";
    g.lineWidth = Math.max(4, h * 0.02);
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(px, py);
    g.lineTo(hx, hy);
    g.stroke();
    g.fillStyle = "#e8edf4";
    g.beginPath();
    g.arc(hx, hy, h * 0.045, 0, 6.2832);
    g.fill();
    g.fillStyle = "#9aa3b0";
    g.fillRect(px - h * 0.02, py - h * 0.05, h * 0.04, h * 0.1);
    if (hit > 0.05) k.brillo(g, ix + iw * 0.72, ry, h * 0.45, "blanca", hit);
    g.restore();
  }
  // diodo del fino
  if (fino > 0.35) {
    g.save();
    g.globalAlpha = (fino - 0.35) / 0.65;
    g.fillStyle = "#0b0c10";
    k.redondo(g, x - w * 0.1, y0 + 8, w * 0.2, h * 0.05, 8);
    g.fill();
    g.restore();
    k.brillo(g, x, y0 + h * 0.04, h * 0.28, "violeta", fino * 0.35);
  }
  // sombra de canto, para que tenga grueso
  g.save();
  g.globalAlpha = 0.35;
  g.fillStyle = "#000";
  g.fillRect(x0 + w - profund, y0 + 20, profund, h - 30);
  g.restore();
}

export function pila(g, x, y, h, ang = 0) {
  if (h < 8) return;
  const w = h * 0.38;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  k.redondo(g, -w / 2, -h / 2, w, h, w / 2);
  const pg = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  pg.addColorStop(0, "#1a1c22");
  pg.addColorStop(0.35, "#4a4e5a");
  pg.addColorStop(0.5, "#2a2e38");
  pg.addColorStop(1, "#0e1016");
  g.fillStyle = pg;
  g.fill();
  // cobre de la punta
  g.fillStyle = "#e39b4a";
  k.redondo(g, -w / 2, -h / 2, w, h * 0.16, w / 2);
  g.fill();
  g.fillStyle = "#f0c48a";
  g.fillRect(-w * 0.18, -h / 2, w * 0.36, h * 0.08);
  // franja
  g.fillStyle = "#d24a3a";
  g.fillRect(-w / 2, -h * 0.05, w, h * 0.16);
  g.fillStyle = "#f4f0e6";
  g.font = `800 ${Math.round(h * 0.16)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("+", 0, -h * 0.34);
  g.restore();
}

export function movil(g, x, y, h, pulgar) {
  if (h < 16) return;
  const w = h * 0.5;
  const x0 = x - w / 2;
  const y0 = y - h / 2;
  g.save();
  // cuerpo
  k.redondo(g, x0, y0, w, h, w * 0.16);
  const cg = g.createLinearGradient(x0, y0, x0 + w, y0);
  cg.addColorStop(0, "#1a2438");
  cg.addColorStop(0.4, "#3a4c6a");
  cg.addColorStop(1, "#121820");
  g.fillStyle = cg;
  g.fill();
  // pantalla
  const m = w * 0.06;
  k.redondo(g, x0 + m, y0 + m * 1.6, w - m * 2, h - m * 3.2, w * 0.1);
  g.fillStyle = "#071018";
  g.fill();
  // botones del mando en la pantalla
  const sx = x0 + m;
  const sy = y0 + m * 1.6;
  const sw = w - m * 2;
  const sh = h - m * 3.2;
  // potencia, rojo
  g.fillStyle = "#e23a3a";
  g.beginPath();
  g.arc(sx + sw * 0.5, sy + sh * 0.16, sw * 0.12, 0, 6.2832);
  g.fill();
  g.strokeStyle = "#fff";
  g.lineWidth = Math.max(3, sw * 0.03);
  g.beginPath();
  g.arc(sx + sw * 0.5, sy + sh * 0.16, sw * 0.07, 0.7, 5.5);
  g.stroke();
  // volumen, barra grande a la izquierda
  g.fillStyle = "#f2f4f8";
  k.redondo(g, sx + sw * 0.12, sy + sh * 0.34, sw * 0.22, sh * 0.42, 18);
  g.fill();
  g.fillStyle = "#1a1c22";
  g.fillRect(sx + sw * 0.2, sy + sh * 0.4, sw * 0.06, sh * 0.12);
  g.fillRect(sx + sw * 0.16, sy + sh * 0.44, sw * 0.14, sw * 0.05);
  // canales
  g.fillStyle = "#ffb03a";
  k.redondo(g, sx + sw * 0.66, sy + sh * 0.34, sw * 0.22, sh * 0.18, 14);
  g.fill();
  k.redondo(g, sx + sw * 0.66, sy + sh * 0.56, sw * 0.22, sh * 0.18, 14);
  g.fill();
  g.fillStyle = "#1a1208";
  g.font = `800 ${Math.round(sw * 0.12)}px Figtree`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("+", sx + sw * 0.77, sy + sh * 0.43);
  g.fillText("–", sx + sw * 0.77, sy + sh * 0.65);
  // cruceta
  g.fillStyle = "#49b8ff";
  k.redondo(g, sx + sw * 0.38, sy + sh * 0.78, sw * 0.24, sh * 0.14, 16);
  g.fill();
  g.restore();
  // pulgar
  if (pulgar > 0.02) {
    g.save();
    g.globalAlpha = Math.min(1, pulgar);
    g.fillStyle = "#e0a078";
    g.beginPath();
    g.ellipse(sx + sw * 0.22, sy + sh * 0.52, sw * 0.16, sh * 0.1, -0.4, 0, 6.2832);
    g.fill();
    g.restore();
  }
  // brillo del cristal
  g.save();
  g.fillStyle = "rgba(255,255,255,0.16)";
  k.redondo(g, x0 + m + 8, y0 + m * 2, w * 0.18, h * 0.35, 20);
  g.fill();
  g.restore();
}

export function sofa(g, x, y, h) {
  if (h < 20) return;
  const w = h * 2.4;
  g.save();
  k.redondo(g, x - w / 2, y - h / 2, w, h, h * 0.2);
  const sg = g.createLinearGradient(x, y - h / 2, x, y + h / 2);
  sg.addColorStop(0, "#1f6a78");
  sg.addColorStop(1, "#0d3a44");
  g.fillStyle = sg;
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.4;
  g.drawImage(k.manchas, x - w / 2, y - h / 2, w, h);
  g.restore();
}

export function lampara(g, x, y, h, t) {
  if (h < 16) return;
  g.save();
  g.strokeStyle = "#3a2a22";
  g.lineWidth = Math.max(6, h * 0.04);
  g.beginPath();
  g.moveTo(x, y + h * 0.45);
  g.lineTo(x, y - h * 0.05);
  g.stroke();
  g.fillStyle = "#f0d2a0";
  g.beginPath();
  g.moveTo(x - h * 0.22, y - h * 0.02);
  g.lineTo(x + h * 0.22, y - h * 0.02);
  g.lineTo(x + h * 0.1, y - h * 0.28);
  g.lineTo(x - h * 0.1, y - h * 0.28);
  g.closePath();
  g.fill();
  g.restore();
  const pulso = 0.75 + 0.25 * Math.sin(t * 3);
  k.brillo(g, x, y - h * 0.12, h * 1.4, "amarilla", 0.55 * pulso);
}

// La nota demasiado aguda: un paquete gordo de anillos cian, con borde oscuro para que se lea encima del naranja.
export function nota(g, x, y, al, apretado) {
  if (al < 0.02) return;
  const r = k.mez(220, 130, apretado);
  g.save();
  g.globalAlpha = al;
  g.fillStyle = "rgba(4,10,18,0.55)";
  g.beginPath();
  g.arc(x, y, r * 1.15, 0, 6.2832);
  g.fill();
  g.globalCompositeOperation = "lighter";
  for (let i = 4; i >= 0; i--) {
    const rr = r * (0.28 + i * 0.18);
    g.strokeStyle = `rgba(170,245,255,${0.95 - i * 0.14})`;
    g.lineWidth = k.mez(22, 10, apretado);
    g.beginPath();
    g.arc(x, y, rr, 0, 6.2832);
    g.stroke();
  }
  g.fillStyle = "rgba(230,255,255,0.95)";
  g.beginPath();
  g.arc(x, y, r * 0.16, 0, 6.2832);
  g.fill();
  g.restore();
}
