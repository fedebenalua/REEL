// El edificio con su ascensor, dibujado de lado a lado como un corte: la cabina, la rueda pegada al raíl, los imanes de
// cada piso, el contador de pulsos y la tabla de pisos. Un solo mundo; los planos solo eligen cuándo empieza cada trozo.
import * as k from "#kit";
import {
  suave, tramo, mez, lim, FL, NPISOS, floorY, SHAFT, CAR, RAIL_L, RAIL_R, WHEEL, MAG, PITCH, PULSOS_PISO, pulsosDe, T,
  pisoF, vel, fondoCoche, luces, sensoresActivos, pulsosT, tAprende, tAjusta, camara, aPantalla, pesos,
} from "./mundo.js";

const AZ = (s) => k.azar(s)();
const ST = suave, TR = tramo;
const AMBAR = "#ffb02e";

// ---------------------------------------------------------------- el cielo y el edificio
function cielo(g) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#1b1352"); gr.addColorStop(0.5, "#6a2d92"); gr.addColorStop(1, "#ff8a66");
  g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
}

function cuarto(g, x0, x1, y0, y1, n, lado) {
  const w = x1 - x0, h = y1 - y0;
  if (w <= 0) return;
  const gr = g.createLinearGradient(0, y0, 0, y1);
  gr.addColorStop(0, n % 2 ? "#2f41a0" : "#3a4cb0"); gr.addColorStop(1, "#1c2a78");
  g.fillStyle = gr; g.fillRect(x0, y0, w, h);
  // las ventanas: una cada 360, solo las que caben enteras
  const c0 = Math.floor((x0 - 60) / 360);
  for (let ci = c0; ci * 360 + 180 < x1 + 60; ci++) {
    const cx = ci * 360 + 180;
    if (cx - 105 < x0 + 8 || cx + 105 > x1 - 8) continue;
    const r = AZ(n * 7919 + ci * 104729 + lado * 13);
    const wy = y0 + 130, ww = 210, wh = 250;
    const luz = r < 0.42 ? "#ffd27a" : r < 0.68 ? "#7fe7ff" : "#15215e";
    g.fillStyle = luz; g.fillRect(cx - 105, wy, ww, wh);
    if (r < 0.68) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, cx, wy + wh / 2, 420, r < 0.42 ? "naranja" : "cian", 0.28); g.restore(); }
    g.strokeStyle = "#0d1546"; g.lineWidth = 10; g.strokeRect(cx - 105, wy, ww, wh);
    g.lineWidth = 6; g.beginPath(); g.moveTo(cx, wy); g.lineTo(cx, wy + wh); g.moveTo(cx - 105, wy + wh / 2); g.lineTo(cx + 105, wy + wh / 2); g.stroke();
  }
}

function edificio(g, V) {
  const L = V.xl - 60, R = V.xr + 60;
  for (let n = 1; n <= NPISOS; n++) {
    const y0 = floorY(n + 1) + 50, y1 = floorY(n);
    if (y1 < V.yt - 20 || y0 > V.yb + 20) continue;
    cuarto(g, L, SHAFT.x0, y0, y1, n, 0);
    cuarto(g, SHAFT.x1, R, y0, y1, n, 1);
  }
  // las losas de cada piso (menos por donde pasa el ascensor)
  for (let n = 1; n <= NPISOS + 1; n++) {
    const y = floorY(n);
    if (y + 50 < V.yt - 20 || y > V.yb + 20) continue;
    for (const [x0, x1] of [[L, SHAFT.x0], [SHAFT.x1, R]]) {
      const gr = g.createLinearGradient(0, y, 0, y + 50);
      gr.addColorStop(0, "#c3cadb"); gr.addColorStop(0.2, "#8a93aa"); gr.addColorStop(1, "#4b5470");
      g.fillStyle = gr; g.fillRect(x0, y, x1 - x0, 50);
    }
  }
  // la tierra por debajo del piso uno
  if (V.yb > 50) {
    const gr = g.createLinearGradient(0, 50, 0, 50 + 900);
    gr.addColorStop(0, "#3a2440"); gr.addColorStop(1, "#140d1c");
    g.fillStyle = gr; g.fillRect(L, 50, R - L, V.yb - 50 + 100);
  }
}

// la placa de cada piso: su número en ámbar, o un «?» cuando el ascensor aún no sabe dónde está
function placas(g, V, t) {
  for (let n = 1; n <= NPISOS; n++) {
    const cy = floorY(n) - 300;
    if (cy + 100 < V.yt || cy - 100 > V.yb) continue;
    const q = t >= T.donde ? ST(TR(t, T.donde, T.donde + 0.3)) * (t < tAprende[n] ? 1 : 0) : 0;
    const fl = t >= tAprende[n] && t > T.donde && t - tAprende[n] < 1.0 ? Math.exp(-(t - tAprende[n]) / 0.4) : 0;
    const x = 66, w = 124, h = 124, y = cy - h / 2;
    g.save();
    k.redondo(g, x, y, w, h, 22); g.fillStyle = "#0a1030"; g.fill();
    g.lineWidth = 6; g.strokeStyle = fl > 0.02 ? `rgb(${Math.round(mez(255, 120, fl))},${Math.round(mez(176, 255, fl))},${Math.round(mez(46, 150, fl))})` : AMBAR; g.stroke();
    g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = "800 82px Figtree";
    g.shadowColor = "rgba(255,176,46,0.8)"; g.shadowBlur = 24;
    g.globalAlpha = 1 - q; g.fillStyle = AMBAR; g.fillText(String(n), x + w / 2, y + 91);
    g.globalAlpha = q; g.shadowColor = "rgba(111,233,255,0.8)"; g.fillStyle = "#6fe9ff"; g.fillText("?", x + w / 2, y + 91);
    g.restore();
    if (fl > 0.02) { g.save(); k.brillo(g, x + w / 2, cy, 360, "verde", 0.7 * fl); g.restore(); }
  }
}

// ---------------------------------------------------------------- el hueco, los raíles y los imanes
function hueco(g, V) {
  const yTop = floorY(NPISOS + 1) - 60, yBot = 150;
  const gr = g.createLinearGradient(SHAFT.x0, 0, SHAFT.x1, 0);
  gr.addColorStop(0, "#0b1430"); gr.addColorStop(0.18, "#16264f"); gr.addColorStop(0.5, "#1d3166"); gr.addColorStop(0.82, "#16264f"); gr.addColorStop(1, "#0b1430");
  g.fillStyle = gr; g.fillRect(SHAFT.x0, yTop, SHAFT.x1 - SHAFT.x0, yBot - yTop);
  // bloques de hormigón
  g.strokeStyle = "rgba(0,0,10,0.28)"; g.lineWidth = 3;
  g.beginPath();
  const a = Math.floor(Math.max(V.yt, yTop) / 90) * 90;
  for (let y = a; y < Math.min(V.yb, yBot); y += 90) { g.moveTo(SHAFT.x0, y); g.lineTo(SHAFT.x1, y); }
  g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.045)"; g.lineWidth = 3; g.beginPath();
  for (let y = a; y < Math.min(V.yb, yBot); y += 90) { g.moveTo(SHAFT.x0, y + 3); g.lineTo(SHAFT.x1, y + 3); }
  g.stroke();
  // el techo del hueco (la sala de máquinas) y el fondo del foso
  const gt = g.createLinearGradient(0, yTop - 40, 0, yTop + 50);
  gt.addColorStop(0, "#6b7390"); gt.addColorStop(1, "#2a3050");
  g.fillStyle = gt; g.fillRect(SHAFT.x0, yTop - 40, SHAFT.x1 - SHAFT.x0, 90);
  g.fillStyle = "#070b1a"; g.fillRect(SHAFT.x0, yBot, SHAFT.x1 - SHAFT.x0, 60);
}

function rieles(g, V) {
  const yTop = floorY(NPISOS + 1) - 20, yBot = 150;
  for (const xc of [RAIL_L, RAIL_R]) {
    const x0 = xc - 15;
    const gr = g.createLinearGradient(x0, 0, x0 + 30, 0);
    gr.addColorStop(0, "#4b5262"); gr.addColorStop(0.35, "#d3dae6"); gr.addColorStop(0.65, "#8d96a8"); gr.addColorStop(1, "#444b5b");
    g.fillStyle = gr; g.fillRect(x0, yTop, 30, yBot - yTop);
    g.strokeStyle = "rgba(10,14,30,0.42)"; g.lineWidth = 3; g.beginPath();
    const a = Math.floor(Math.max(V.yt, yTop) / 64) * 64;
    for (let y = a; y < Math.min(V.yb, yBot); y += 64) { g.moveTo(x0, y); g.lineTo(x0 + 30, y); }
    g.stroke();
  }
  // las sujeciones del raíl a la pared, dos por piso
  g.fillStyle = "#39425c";
  for (let n = 1; n <= NPISOS; n++) for (const dy of [120, 420]) {
    const y = floorY(n) - dy;
    if (y < V.yt - 30 || y > V.yb + 30) continue;
    g.fillRect(SHAFT.x0, y - 10, RAIL_L - 15 - SHAFT.x0, 20);
    g.fillRect(RAIL_R + 15, y - 10, SHAFT.x1 - RAIL_R - 15, 20);
  }
}

const revela = (n, t) => ST(TR(t, T.asi8 + 0.08 * Math.abs(n - 6), T.asi8 + 0.08 * Math.abs(n - 6) + 0.45)) * (1 - ST(TR(t, T.f11 + 0.2, T.f11 + 1.6)));

function imanes(g, V, t) {
  for (let n = 1; n <= NPISOS; n++) {
    const cy = floorY(n) - MAG.dy;
    if (cy + 80 < V.yt || cy - 80 > V.yb) continue;
    const al = 0.38 + 0.62 * revela(n, t);
    g.save(); g.globalAlpha = al;
    g.fillStyle = "#222a42"; g.fillRect(MAG.x - 4, cy - 58, 24, 116);
    const top = g.createLinearGradient(0, cy - 50, 0, cy);
    top.addColorStop(0, "#ff7a3a"); top.addColorStop(1, "#ff4d2a");
    g.fillStyle = top; g.fillRect(MAG.x, cy - 50, 14, 50);
    const bot = g.createLinearGradient(0, cy, 0, cy + 50);
    bot.addColorStop(0, "#ffd24a"); bot.addColorStop(1, "#ffb02e");
    g.fillStyle = bot; g.fillRect(MAG.x, cy, 14, 50);
    g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 2; g.strokeRect(MAG.x, cy - 50, 14, 100);
    g.restore();
  }
}

// los imanes brillan cuando la cabina los toca con un sensor, y al nacer
function brilloImanes(g, V, t, fl, c) {
  for (let n = 1; n <= NPISOS; n++) {
    const cy = floorY(n) - MAG.dy;
    if (cy + 200 < V.yt || cy - 200 > V.yb) continue;
    const lit = sensoresActivos(t) && luces(fl, n).some(Boolean);
    const nace = k.pulso(t, T.asi8 + 0.08 * Math.abs(n - 6) + 0.2, 0.22) * (t < T.f11 ? 1 : 0);
    const al = Math.max(lit ? 1 : 0, nace * 0.9);
    if (al < 0.02) continue;
    const [sx, sy] = aPantalla(c, MAG.x + 7, cy);
    k.brillo(g, sx, sy, 300 * c.z + 100, "naranja", 0.6 * al);
    k.brillo(g, sx, sy, 90 * c.z + 30, "amarilla", 0.45 * al);
    if (lit) {
      // las líneas del campo, hacia el sensor
      g.save(); g.globalCompositeOperation = "lighter"; g.lineWidth = 3 * c.z + 1; g.strokeStyle = `rgba(255,210,120,${0.55 * al})`;
      for (const d of [-34, 0, 34]) {
        g.beginPath(); g.moveTo(sx - 10 * c.z, sy + d * c.z);
        g.quadraticCurveTo(sx - 55 * c.z, sy + d * 1.9 * c.z, sx - 100 * c.z, sy + d * 0.5 * c.z); g.stroke();
      }
      g.restore();
    }
  }
}

// una lámpara en cada piso, dentro del hueco: al pasar la cabina se ve cómo van pasando los pisos
function lamparas(g, V) {
  g.save(); g.globalCompositeOperation = "lighter";
  for (let n = 1; n <= NPISOS; n++) {
    const y = floorY(n) - 470;
    if (y + 200 < V.yt || y - 200 > V.yb) continue;
    for (const x of [262, 818]) {
      k.brillo(g, x, y, 380, "amarilla", 0.34);
      g.fillStyle = "rgba(255,244,205,0.9)"; k.redondo(g, x - 17, y - 8, 34, 16, 8); g.fill();
    }
  }
  g.restore();
}

// el ojo tachado de «no tiene ojos»
function ojo(g, t) {
  const a = ST(TR(t, T.ojos - 0.05, T.ojos + 0.2)) * (1 - ST(TR(t, T.ve + 0.5, T.ve + 0.9)));
  if (a < 0.01) return;
  const x = 540, y = 610, pop = 1 + 0.18 * (1 - ST(TR(t, T.ojos, T.ojos + 0.35)));
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(pop, pop);
  g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 30; g.shadowOffsetY = 10;
  g.beginPath(); g.moveTo(-150, 0); g.quadraticCurveTo(0, -140, 150, 0); g.quadraticCurveTo(0, 140, -150, 0); g.closePath();
  g.fillStyle = "#f7fbff"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.save(); g.clip();
  const ig = g.createRadialGradient(0, 0, 8, 0, 0, 62); ig.addColorStop(0, "#1b2a6b"); ig.addColorStop(0.55, "#2f8fe0"); ig.addColorStop(1, "#7be0ff");
  g.fillStyle = ig; g.beginPath(); g.arc(0, 0, 62, 0, 6.2832); g.fill();
  g.fillStyle = "#050814"; g.beginPath(); g.arc(0, 0, 26, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.arc(-18, -20, 11, 0, 6.2832); g.fill();
  g.restore();
  g.lineWidth = 9; g.strokeStyle = "#1b2250"; g.beginPath(); g.moveTo(-150, 0); g.quadraticCurveTo(0, -140, 150, 0); g.quadraticCurveTo(0, 140, -150, 0); g.closePath(); g.stroke();
  const tach = ST(TR(t, T.ojos + 0.28, T.ojos + 0.5));
  if (tach > 0.01) {
    g.lineCap = "round"; g.strokeStyle = "#ff3b4a"; g.lineWidth = 26; g.shadowColor = "rgba(255,60,80,0.9)"; g.shadowBlur = 30;
    g.beginPath(); g.moveTo(-135, -125); g.lineTo(-135 + 270 * tach, -125 + 250 * tach); g.stroke();
  }
  g.restore();
}

function rayasVelocidad(g, V, t) {
  const s = Math.abs(vel(t));
  if (s < 450) return;
  const al = lim((s - 450) / 650, 0, 0.55), L = Math.min(430, s * 0.075), P = 2700;
  g.save(); g.lineWidth = 4; g.lineCap = "round";
  for (let i = 0; i < 44; i++) {
    const x = 214 + ((i * 97) % 650), base = -((i * 1531) % P);
    for (let yy = base + P * Math.floor((V.yt - base - L) / P); yy < V.yb; yy += P) {
      if (yy + L < V.yt) continue;
      const gr = g.createLinearGradient(0, yy, 0, yy + L);
      gr.addColorStop(0, "rgba(190,220,255,0)"); gr.addColorStop(1, `rgba(210,232,255,${al * (0.4 + 0.6 * ((i % 5) / 4))})`);
      g.strokeStyle = gr; g.beginPath(); g.moveTo(x, yy); g.lineTo(x, yy + L); g.stroke();
    }
  }
  g.restore();
}

// ---------------------------------------------------------------- la cabina, con su rueda y su placa de sensores
function rueda(g, t, wx, wy, ang, brilloPulso) {
  g.save(); g.translate(wx, wy); g.rotate(ang);
  const R = WHEEL.r;
  g.fillStyle = "#14161e"; g.beginPath(); g.arc(0, 0, R, 0, 6.2832); g.fill();
  g.strokeStyle = "#3c4258"; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, R - 3, 0, 6.2832); g.stroke();
  g.strokeStyle = "#5a6280"; g.lineWidth = 3; g.beginPath();
  for (let i = 0; i < 24; i++) { const a = (i / 24) * 6.2832; g.moveTo(Math.cos(a) * (R - 12), Math.sin(a) * (R - 12)); g.lineTo(Math.cos(a) * (R - 1), Math.sin(a) * (R - 1)); }
  g.stroke();
  const hg = g.createRadialGradient(-6, -6, 2, 0, 0, 24);
  hg.addColorStop(0, "#f2f5fb"); hg.addColorStop(1, "#7b8497");
  g.fillStyle = hg; g.beginPath(); g.arc(0, 0, 24, 0, 6.2832); g.fill();
  g.strokeStyle = "#444c60"; g.lineWidth = 4; g.beginPath();
  for (let i = 0; i < 4; i++) { const a = (i / 4) * 6.2832; g.moveTo(0, 0); g.lineTo(Math.cos(a) * 22, Math.sin(a) * 22); }
  g.stroke();
  // el imán pequeño que gira con la rueda
  g.fillStyle = "#ff5a2a"; g.beginPath(); g.arc(0, 0, 13, Math.PI, 0); g.fill();
  g.fillStyle = "#ffd24a"; g.beginPath(); g.arc(0, 0, 13, 0, Math.PI); g.fill();
  g.restore();
}

function coche(g, t, B, fl) {
  const top = B - CAR.h, X0 = CAR.x0, X1 = CAR.x1;
  // el marco de acero
  const fr = g.createLinearGradient(X0 - 20, 0, X1 + 20, 0);
  fr.addColorStop(0, "#4a5268"); fr.addColorStop(0.3, "#aab4c7"); fr.addColorStop(0.7, "#8b95aa"); fr.addColorStop(1, "#464e63");
  k.redondo(g, X0 - 20, top - 30, X1 - X0 + 40, CAR.h + 46, 18); g.fillStyle = fr; g.fill();
  // la pared del fondo
  const wg = g.createLinearGradient(0, top + 40, 0, B - 52);
  wg.addColorStop(0, "#ffe9c0"); wg.addColorStop(1, "#e2a96b");
  g.fillStyle = wg; g.fillRect(X0, top + 40, X1 - X0, CAR.h - 92);
  g.strokeStyle = "rgba(120,70,20,0.16)"; g.lineWidth = 3; g.beginPath();
  for (let x = X0 + 100; x < X1; x += 100) { g.moveTo(x, top + 70); g.lineTo(x, B - 70); }
  g.stroke();
  g.fillStyle = "rgba(255,255,255,0.12)"; g.fillRect(X0 + 50, B - 330, X1 - X0 - 100, 230);
  // las paredes de los lados, en perspectiva
  g.fillStyle = "#c58f55";
  g.beginPath(); g.moveTo(X0, top + 40); g.lineTo(X0 + 44, top + 70); g.lineTo(X0 + 44, B - 74); g.lineTo(X0, B - 52); g.closePath(); g.fill();
  g.fillStyle = "#b9824a";
  g.beginPath(); g.moveTo(X1, top + 40); g.lineTo(X1 - 44, top + 70); g.lineTo(X1 - 44, B - 74); g.lineTo(X1, B - 52); g.closePath(); g.fill();
  // el techo con su luz
  const cg = g.createLinearGradient(0, top, 0, top + 40);
  cg.addColorStop(0, "#fff8e2"); cg.addColorStop(1, "#e9d7a8");
  g.fillStyle = cg; g.fillRect(X0, top, X1 - X0, 40);
  g.fillStyle = "#fffdf2"; k.redondo(g, X0 + 110, top + 8, X1 - X0 - 220, 22, 11); g.fill();
  // el suelo
  const sg = g.createLinearGradient(0, B - 52, 0, B);
  sg.addColorStop(0, "#4a4f60"); sg.addColorStop(1, "#262a36");
  g.fillStyle = sg; g.fillRect(X0, B - 52, X1 - X0, 52);
  g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 3; g.beginPath(); g.moveTo(X0, B - 51); g.lineTo(X1, B - 51); g.stroke();
  // el pasamanos
  const hr = g.createLinearGradient(0, B - 260, 0, B - 240);
  hr.addColorStop(0, "#f2f5fb"); hr.addColorStop(0.5, "#aeb7c8"); hr.addColorStop(1, "#6d768b");
  k.redondo(g, X0 + 70, B - 258, X1 - X0 - 140, 16, 8); g.fillStyle = hr; g.fill();
  g.fillStyle = "#8d96aa"; g.fillRect(X0 + 80, B - 250, 10, 34); g.fillRect(X1 - 90, B - 250, 10, 34);
  // el indicador de piso: su número en ámbar y la flecha
  const dx = 440, dy = top + 92, dw = 200, dh = 104;
  k.redondo(g, dx - 8, dy - 8, dw + 16, dh + 16, 20); g.fillStyle = "#6a7388"; g.fill();
  k.redondo(g, dx, dy, dw, dh, 14); g.fillStyle = "#06070c"; g.fill();
  const n = lim(Math.round(fl), 1, NPISOS), vf = (pisoF(t + 0.05) - pisoF(t - 0.05)) / 0.1;
  g.save();
  g.shadowColor = "rgba(255,176,46,0.95)"; g.shadowBlur = 28; g.fillStyle = AMBAR;
  g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = "800 88px Figtree"; g.fillText(String(n), dx + dw / 2 + 18, dy + 82);
  if (Math.abs(vf) > 0.05) {
    const up = vf > 0, ax = dx + 38, ay = dy + dh / 2;
    g.beginPath(); g.moveTo(ax, ay + (up ? -24 : 24)); g.lineTo(ax - 20, ay + (up ? 14 : -14)); g.lineTo(ax + 20, ay + (up ? 14 : -14)); g.closePath(); g.fill();
  }
  g.restore();
}

function accesorios(g, t, B, fl, c) {
  const top = B - CAR.h;
  // la placa de los tres sensores, a la derecha, frente a los imanes
  g.fillStyle = "#2d364d"; g.fillRect(CAR.x1 + 18, B - MAG.dy - 12, 786 - CAR.x1 - 18, 24);
  k.redondo(g, 782, B - MAG.dy - 112, 40, 224, 8); g.fillStyle = "#171c2b"; g.fill();
  g.strokeStyle = "#47516c"; g.lineWidth = 4; g.stroke();
  const activo = sensoresActivos(t);
  const lit = [false, false, false];
  if (activo) for (let n = 1; n <= NPISOS; n++) { const l = luces(fl, n); for (let i = 0; i < 3; i++) lit[i] = lit[i] || l[i]; }
  [-50, 0, 50].forEach((off, i) => {
    const y = B - MAG.dy + off;
    g.fillStyle = lit[i] ? "#7ff6ff" : "#1d4a59"; g.beginPath(); g.arc(802, y, 12, 0, 6.2832); g.fill();
    g.strokeStyle = "#0a0e18"; g.lineWidth = 3; g.stroke();
  });
  // la rueda, con su soporte, pegada al raíl de la izquierda
  const wy = top + WHEEL.dy;
  g.fillStyle = "#2d364d"; g.fillRect(WHEEL.x, wy - 12, CAR.x0 - 20 - WHEEL.x, 24);
  g.fillStyle = "#3a4560"; g.fillRect(WHEEL.x - 6, wy - 24, 24, 48);
  rueda(g, t, WHEEL.x, wy, -(FL * (fl - 1)) / WHEEL.r, 0);
  return { wy, lit };
}

// ---------------------------------------------------------------- el contador y la tabla
const ORO = "255,176,64", ROJO = "255,96,96", VERDE = "130,255,150";

function contador(g, t, c, fl, xC) {
  const al = ST(TR(t, T.cuenta2 - 0.05, T.cuenta2 + 0.3)) * (1 - ST(TR(t, T.f11 + 0.5, T.f11 + 1.2)));
  if (al < 0.01) return;
  const drift = t >= tAjusta ? 0 : t >= T.desc + 0.6 ? 2 : t >= T.desc + 0.1 ? 1 : 0;
  const valor = pulsosDe(fl) + (t > T.sube6 - 0.5 && t < T.sube6 ? 0 : 0) + drift;
  let col = ORO;
  const quieto = Math.abs(vel(t)) < 40;
  if (drift) col = ROJO;
  else if (t >= tAjusta && t < tAjusta + 1.4) col = VERDE;
  else if (sensoresActivos(t) && [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].some((n) => luces(fl, n).some(Boolean))) col = VERDE;
  else if (quieto && t >= T.cinco && t < T.desc && Math.abs(fl - 5) < 0.01) col = VERDE;
  const pop = 1 + 0.07 * k.pulso(t, T.cuenta2 + 0.12, 0.12);
  g.save(); g.translate(xC, 640); g.scale(pop, pop);
  k.pastilla(g, 0, 0, String(valor), "pulsos", col, al, 96);
  g.restore();
  if (t >= T.cinco && t < T.desc + 0.5 && Math.abs(fl - 5) < 0.01 && !drift) k.etiqueta(g, xC - 78, 700, "piso 5", VERDE, al * ST(TR(t, T.cinco, T.cinco + 0.2)), 40);
  if (drift && t < T.asi8 + 0.2 && Math.abs(fl - 5) < 0.01) k.etiqueta(g, xC - 110, 700, "apuntó 108", "255,140,140", al, 40);
}

function tabla(g, t) {
  const a = ST(TR(t, T.f6 - 0.1, T.f6 + 0.5)) * (1 - ST(TR(t, 36.4, 37.1)));
  if (a < 0.01) return;
  const emph = ST(TR(t, T.f7 - 0.1, T.f7 + 0.6)) * (1 - ST(TR(t, T.contador + 1.2, T.cinco + 0.3)));
  const x0 = 585, w = 455, y0 = 640, h = 800, cx = x0 + w / 2, cy = y0 + h / 2, s = 1 + 0.14 * emph;
  g.save();
  g.globalAlpha = a; g.translate(cx + (1 - a) * 560, cy); g.scale(s, s); g.translate(-cx, -cy);
  g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 14;
  k.redondo(g, x0, y0, w, h, 34); g.fillStyle = "rgba(6,10,28,0.9)"; g.fill();
  g.shadowColor = "rgba(0,0,0,0)"; g.shadowBlur = 0; g.shadowOffsetY = 0;
  k.redondo(g, x0 + 2, y0 + 2, w - 4, h - 4, 32); g.strokeStyle = "rgba(111,233,255,0.55)"; g.lineWidth = 4; g.stroke();
  g.textBaseline = "alphabetic"; g.textAlign = "center";
  g.font = "800 40px Figtree"; g.fillStyle = "#6fe9ff"; g.fillText("MEMORIA", cx, y0 + 62);
  g.font = "700 30px Figtree"; g.fillStyle = "rgba(190,215,255,0.8)";
  g.textAlign = "left"; g.fillText("PISO", x0 + 54, y0 + 112); g.textAlign = "right"; g.fillText("PULSOS", x0 + w - 54, y0 + 112);
  const rowH = 54;
  for (let n = 1; n <= NPISOS; n++) {
    const y = y0 + 128 + (n - 1) * rowH, ya = tAprende[n], on = t >= ya;
    const fl = on ? Math.exp(-(t - ya) / 0.35) : 0;
    if (fl > 0.02) { g.fillStyle = `rgba(120,255,150,${0.35 * fl})`; g.fillRect(x0 + 24, y, w - 48, rowH - 6); }
    const marca = n === 5 ? ST(TR(t, T.f7 + 0.1, T.f7 + 0.5)) * (1 - ST(TR(t, T.f8 - 0.2, T.f8 + 0.4))) : 0;
    if (marca > 0.01) {
      const ok = t >= T.cinco ? ST(TR(t, T.cinco, T.cinco + 0.15)) : 0;
      g.fillStyle = `rgba(${Math.round(mez(111, 130, ok))},${Math.round(mez(233, 255, ok))},${Math.round(mez(255, 150, ok))},${0.28 * marca})`; g.fillRect(x0 + 24, y, w - 48, rowH - 6);
      g.strokeStyle = `rgba(${ok ? "130,255,150" : "111,233,255"},${marca})`; g.lineWidth = 4; g.strokeRect(x0 + 24, y, w - 48, rowH - 6);
    }
    g.font = "800 44px Figtree"; g.textAlign = "left";
    g.fillStyle = on ? "#ffffff" : "rgba(160,180,230,0.35)"; g.fillText(String(n), x0 + 60, y + 40);
    g.textAlign = "right"; g.fillText(on ? String(PULSOS_PISO * (n - 1)) : "-", x0 + w - 60, y + 40);
  }
  g.restore();
}

// ---------------------------------------------------------------- la escena entera
export function escena(g, t) {
  const c = camara(t), fl = pisoF(t), B = fondoCoche(t);
  const V = { xl: c.px - c.sx / c.z, xr: c.px + (1080 - c.sx) / c.z, yt: c.py - c.sy / c.z, yb: c.py + (1920 - c.sy) / c.z };
  const { wRueda, wLado } = pesos(t);

  cielo(g);
  g.save(); g.translate(c.sx - c.px * c.z, c.sy - c.py * c.z); g.scale(c.z, c.z);
  edificio(g, V);
  hueco(g, V);
  placas(g, V, t);
  rieles(g, V);
  imanes(g, V, t);
  lamparas(g, V);
  rayasVelocidad(g, V, t);
  g.restore();

  // sin luz: se apaga el edificio y solo queda lo que ilumina la propia cabina
  const osc = 0.82 * ST(TR(t, T.ve - 0.15, T.ve + 0.45)) * (1 - ST(TR(t, T.f5 + 0.05, T.f5 + 0.6)));
  if (osc > 0.01) {
    const [csx, csy] = aPantalla(c, CAR.cx, B - 260), [wsx, wsy] = aPantalla(c, WHEEL.x, B - CAR.h + WHEEL.dy);
    const lx = mez(csx, wsx, wRueda), ly = mez(csy, wsy, wRueda);
    const gr = g.createRadialGradient(lx, ly, 100 * Math.max(0.6, c.z), lx, ly, 1050 * Math.max(0.7, Math.min(c.z, 1.4)));
    gr.addColorStop(0, `rgba(3,6,20,${osc * 0.4})`); gr.addColorStop(1, `rgba(3,6,20,${osc})`);
    g.fillStyle = gr; g.fillRect(0, 0, 1080, 1920);
  }

  g.save(); g.translate(c.sx - c.px * c.z, c.sy - c.py * c.z); g.scale(c.z, c.z);
  // las marcas que va dejando la rueda en el raíl: cada una, un trocito de camino
  if (t > T.rueda - 0.5 && t < T.f5 + 0.3) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (const e of pulsosT) {
      const edad = t - e.t;
      if (edad < 0 || edad > 1.5) continue;
      const y = -e.n * PITCH - (CAR.h - WHEEL.dy);
      const al = (1 - edad / 1.5) * ST(TR(t, T.rueda - 0.3, T.rueda + 0.3)) * (1 - ST(TR(t, T.f5, T.f5 + 0.3)));
      g.fillStyle = `rgba(255,170,60,${0.9 * al})`; g.fillRect(RAIL_L + 10, y - PITCH * 0.78, 9, PITCH * 0.78);
      g.fillStyle = `rgba(255,170,60,${0.2 * al})`; g.fillRect(RAIL_L + 2, y - PITCH * 0.78 - 4, 25, PITCH * 0.78 + 8);
    }
    g.restore();
  }
  const cab = fondoCoche(t);
  // los cables
  for (const x of [470, 540, 610]) {
    g.strokeStyle = "#202637"; g.lineWidth = 10; g.beginPath(); g.moveTo(x, B - CAR.h - 30); g.lineTo(x, floorY(NPISOS + 1) + 50); g.stroke();
    g.strokeStyle = "#9aa6c0"; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 2, B - CAR.h - 30); g.lineTo(x - 2, floorY(NPISOS + 1) + 50); g.stroke();
  }
  coche(g, t, cab, fl);
  const info = accesorios(g, t, cab, fl, c);
  g.restore();

  // luz de la cabina
  { const [csx, csy] = aPantalla(c, CAR.cx, B - 260); k.brillo(g, csx, csy, 1400 * c.z, "amarilla", 0.14 + 0.1 * (osc > 0.3 ? 1 : 0)); }
  brilloImanes(g, V, t, fl, c);
  // el brillo de cada pulso en el raíl
  if (t > T.rueda - 0.5 && t < T.f5 + 0.3) {
    const [wx, wy] = aPantalla(c, WHEEL.x - WHEEL.r, B - CAR.h + WHEEL.dy);
    let gl = 0; for (const e of pulsosT) { const d = t - e.t; if (d >= 0 && d < 0.2) gl += Math.exp(-d / 0.07); }
    k.brillo(g, wx, wy, 150 * c.z, "naranja", lim(gl, 0, 1) * ST(TR(t, T.rueda - 0.3, T.rueda + 0.3)) * (1 - ST(TR(t, T.f5, T.f5 + 0.3))));
  }

  // los pulsos que vuelan de la rueda al contador
  const xC = mez(540, 300, wLado);
  if (t > T.rueda - 0.2 && t < T.f5 + 0.3) {
    const [wx, wy] = aPantalla(c, WHEEL.x, B - CAR.h + WHEEL.dy);
    const alT = ST(TR(t, T.cuenta2, T.cuenta2 + 0.3));
    for (const e of pulsosT) {
      const edad = t - e.t;
      if (edad < 0 || edad > 0.6) continue;
      const u = edad / 0.6, ue = 1 - Math.pow(1 - u, 2.2);
      const ex = xC, ey = 640 + 40;
      const x = mez(wx, ex, ue) + Math.sin(u * Math.PI) * 70, y = mez(wy, ey, ue);
      k.brillo(g, x, y, 54 * (1 - 0.4 * u), "naranja", (1 - 0.5 * u) * alT);
      g.save(); g.fillStyle = `rgba(255,248,225,${(1 - 0.4 * u) * alT})`; g.beginPath(); g.arc(x, y, 8 * (1 - 0.4 * u), 0, 6.2832); g.fill(); g.restore();
    }
  }

  ojo(g, t);
  contador(g, t, c, fl, xC);
  tabla(g, t);

  // el «menos de un milímetro»
  const mm = ST(TR(t, T.milimetro - 0.05, T.milimetro + 0.25)) * (1 - ST(TR(t, T.f10 + 0.3, T.f10 + 0.9)));
  if (mm > 0.01) k.pastilla(g, 540, 1360, "< 1", "mm", VERDE, mm, 104);

  // un velo arriba, para el subtítulo
  const vg = g.createLinearGradient(0, 0, 0, 620);
  vg.addColorStop(0, "rgba(6,8,26,0.62)"); vg.addColorStop(1, "rgba(6,8,26,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
