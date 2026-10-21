// «¿Por qué los gatos siempre caen de pie, aunque los sueltes boca arriba? Se dan la vuelta en el aire, sin nada en lo
// que apoyarse.»
// El salón, con una sola cámara que cae con el gato.
// - Fotograma 0: el gato, enorme, boca arriba, cayendo; las paredes del salón suben a toda velocidad. Se retuerce en el
//   aire y en «pie» aterriza de pie en la alfombra, con un bote.
// - «aunque los sueltes boca arriba»: la caída vuelve atrás; sube girando al revés hasta quedar boca arriba en «arriba».
// - «Se dan la vuelta en el aire»: vuelve a caer, ahora despacio; en «aire» el salón se oscurece y se va hacia arriba:
//   queda el gato solo en el vacío azul. «sin nada»: patalea en el aire, sin nada que tocar.
import * as k from "#kit";
import { v } from "#voz";
import { gato, vacio, vuelta, velo, vineta } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar, lienzo } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tpie = f1.t("pie"), Taun = f1.t("aunque"), Tarr = f1.t("arriba"), Tse = f2.inicio, Taire = f2.t("aire"), Tnada = f2.t("nada");
export const aterriza = Tpie - 0.03;

// ---------------------------------------------------------------- el salón: una pared alta que la cámara recorre
const H = 4700, SUELO = 3990;
const pared = lienzo(1080, H);
{
  const g = pared.getContext("2d");
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#ffd2a8"); bg.addColorStop(0.5, "#f7b48a"); bg.addColorStop(1, "#ec9c78");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, H);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.18; for (let y = 0; y < H; y += 1500) g.drawImage(k.manchas, 0, y, 1080, 1500); g.restore();
  // el techo y la lámpara
  g.fillStyle = "#fbe3cc"; g.fillRect(0, 0, 1080, 180);
  g.fillStyle = "rgba(120,60,30,0.35)"; g.fillRect(0, 176, 1080, 10);
  g.strokeStyle = "#3b2a22"; g.lineWidth = 6; g.beginPath(); g.moveTo(300, 0); g.lineTo(300, 300); g.stroke();
  const lp = g.createLinearGradient(220, 0, 380, 0); lp.addColorStop(0, "#1f5d57"); lp.addColorStop(0.5, "#3fa596"); lp.addColorStop(1, "#174641");
  g.fillStyle = lp; g.beginPath(); g.moveTo(250, 300); g.lineTo(350, 300); g.lineTo(410, 420); g.lineTo(190, 420); g.closePath(); g.fill();
  k.brillo(g, 300, 450, 700, "255,214,150", 0.9);
  // la ventana, con el cielo y la luz de la tarde
  const wx = 600, wy = 520, ww = 380, wh = 980;
  const cielo = g.createLinearGradient(0, wy, 0, wy + wh); cielo.addColorStop(0, "#7fc4ff"); cielo.addColorStop(1, "#ffe0b0");
  g.fillStyle = cielo; g.fillRect(wx, wy, ww, wh);
  k.brillo(g, wx + 260, wy + 640, 600, "255,236,190", 0.9);
  g.fillStyle = "#fff7ee"; g.fillRect(wx - 26, wy - 26, ww + 52, 30); g.fillRect(wx - 26, wy + wh - 4, ww + 52, 40); g.fillRect(wx - 26, wy, 26, wh); g.fillRect(wx + ww, wy, 26, wh); g.fillRect(wx + ww / 2 - 10, wy, 20, wh); g.fillRect(wx, wy + wh / 2 - 10, ww, 20);
  for (const cx of [wx - 120, wx + ww + 40]) { const cg = g.createLinearGradient(cx, 0, cx + 110, 0); cg.addColorStop(0, "#b8324a"); cg.addColorStop(0.5, "#e35a6e"); cg.addColorStop(1, "#9c2238"); g.fillStyle = cg; g.fillRect(cx, wy - 80, 110, wh + 220); g.fillStyle = "rgba(0,0,0,0.18)"; for (let i = 1; i < 4; i++) g.fillRect(cx + i * 27, wy - 80, 5, wh + 220); }
  // los cuadros
  const cuadro = (x, y, w, h, cols) => {
    g.save(); g.shadowColor = "rgba(60,20,10,0.45)"; g.shadowBlur = 30; g.shadowOffsetY = 14;
    g.fillStyle = "#3a2618"; g.fillRect(x - 18, y - 18, w + 36, h + 36); g.restore();
    const cg = g.createLinearGradient(x, y, x + w, y + h); cols.forEach((c, i) => cg.addColorStop(i / (cols.length - 1), c));
    g.fillStyle = cg; g.fillRect(x, y, w, h);
    g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.arc(x + w * 0.65, y + h * 0.35, Math.min(w, h) * 0.22, 0, 6.2832); g.fill();
  };
  cuadro(90, 1750, 330, 420, ["#2b6fd6", "#38c3b0", "#ffd166"]);
  cuadro(560, 1900, 420, 300, ["#ff7a59", "#ffb35c", "#7b3fa0"]);
  cuadro(160, 2400, 240, 240, ["#1fa37a", "#b9f18c"]);
  // la estantería con plantas y libros
  g.fillStyle = "#6b4127"; g.fillRect(520, 2700, 480, 36);
  const libros = ["#2f6db5", "#e0a030", "#c2433f", "#3e9c6b", "#f0e6d0", "#7a4fb0"];
  let lx = 560; for (let i = 0; i < 9; i++) { const w = 34 + (i * 13) % 22, h = 170 + (i * 37) % 70; g.fillStyle = libros[i % 6]; g.fillRect(lx, 2700 - h, w, h); g.fillStyle = "rgba(255,255,255,0.15)"; g.fillRect(lx + 4, 2700 - h, 5, h); lx += w + 4; }
  g.fillStyle = "#c8643c"; g.beginPath(); g.moveTo(880, 2700); g.lineTo(980, 2700); g.lineTo(965, 2600); g.lineTo(895, 2600); g.closePath(); g.fill();
  g.fillStyle = "#2e8b4e"; for (let i = 0; i < 9; i++) { const a = -2.6 + i * 0.27; g.beginPath(); g.ellipse(930 + Math.cos(a) * 70, 2580 + Math.sin(a) * 70, 22, 70, a + 1.57, 0, 6.2832); g.fill(); }
  // el zócalo
  g.fillStyle = "#f6e1cc"; g.fillRect(0, 3200, 1080, 24);
  // el sofá
  const so = g.createLinearGradient(0, 3300, 0, SUELO); so.addColorStop(0, "#3aa39a"); so.addColorStop(1, "#1d5c58");
  g.fillStyle = so; k.redondo(g, -80, 3330, 520, 560, 70); g.fill();
  g.fillStyle = "#2c8780"; k.redondo(g, -100, 3620, 560, 300, 60); g.fill();
  g.fillStyle = "#ffcf5c"; k.redondo(g, 120, 3470, 200, 180, 50); g.fill();
  g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-80, 3900, 540, 90);
  // el suelo de madera
  const sg = g.createLinearGradient(0, SUELO - 20, 0, H); sg.addColorStop(0, "#8a5530"); sg.addColorStop(1, "#5a3218");
  g.fillStyle = sg; g.fillRect(0, SUELO - 20, 1080, H - SUELO + 20);
  g.strokeStyle = "rgba(40,20,8,0.4)"; g.lineWidth = 3; for (let i = -10; i < 20; i++) { g.beginPath(); g.moveTo(540 + i * 90, SUELO - 20); g.lineTo(540 + i * 220, H); g.stroke(); }
  // la alfombra redonda
  const al = g.createRadialGradient(560, SUELO + 90, 20, 560, SUELO + 90, 520); al.addColorStop(0, "#f4d7ff"); al.addColorStop(0.55, "#c98ee8"); al.addColorStop(0.62, "#fff1d6"); al.addColorStop(0.68, "#c98ee8"); al.addColorStop(1, "#8e4fb8");
  g.fillStyle = al; g.beginPath(); g.ellipse(560, SUELO + 110, 520, 150, 0, 0, 6.2832); g.fill();
}
const borrosa = lienzo(1080, H);
{ const g = borrosa.getContext("2d"); g.filter = "blur(7px)"; g.drawImage(pared, 0, 0); }

// ---------------------------------------------------------------- la cámara y el gato
const YS_FIN = SUELO - 1330, YS_ALTO = 1450, YC_FIN = 1075;
const bajada = (x) => 0.45 * x + 0.55 * x * x;
function camara(t) {
  if (t < aterriza) { const x = t / aterriza; return { ys: YS_FIN * bajada(x), vel: YS_FIN * (0.45 + 1.1 * x) / aterriza }; }
  if (t < Taun) return { ys: YS_FIN, vel: 0 };
  if (t < Tarr) { const w = su(tr(t, Taun, Tarr)); return { ys: mez(YS_FIN, YS_ALTO, w), vel: -800 * Math.sin(Math.PI * w) }; }
  if (t < Tse) return { ys: YS_ALTO, vel: 0 };
  const w = t - Tse, sube = 1400 * Math.pow(su(tr(t, Taire - 0.1, Taire + 1.0)), 1.5);
  return { ys: YS_ALTO + 140 * w * w / (1 + w) + sube, vel: 200 };
}
function estadoGato(t) {
  if (t < aterriza) {
    const u = tr(t, 0.02, aterriza - 0.12);
    return { y: mez(860, YC_FIN, su(tr(t, 0.9, aterriza))), ...vuelta(u), patalea: 0.4 * (1 - u) };
  }
  if (t < Taun) return { y: YC_FIN, ...vuelta(1), aplasta: k.pulso(t, aterriza + 0.06, 0.09) };
  if (t < Tarr) { const w = su(tr(t, Taun, Tarr)); return { y: mez(YC_FIN, 980, w), ...vuelta(1 - w) }; }
  const pat = mez(0.5, 1, su(tr(t, Tnada - 0.2, Tnada + 0.3))) * (1 - 0.5 * su(tr(t, f2.fin - 0.3, f2.fin + 0.1)));
  return { y: 980 + 20 * su(tr(t, Tse, Tse + 1.5)), ...vuelta(0), patalea: pat };
}

export function dibuja(g, t) {
  const cam = camara(t), sg = estadoGato(t);
  const deshace = su(tr(t, Taire - 0.05, Taire + 0.75));
  if (deshace > 0) vacio(g, t, 0.5, 40 * su(tr(t, Tnada, f2.fin)));
  if (deshace < 1) {
    // el salón, con la estela de lo deprisa que cae
    g.save(); g.globalAlpha = 1 - deshace;
    const pasos = Math.min(7, Math.ceil(Math.abs(cam.vel) / 500));
    if (pasos <= 1) g.drawImage(borrosa, 0, cam.ys, 1080, 1920, 0, 0, 1080, 1920);
    else for (let i = 0; i < pasos; i++) { g.globalAlpha = (1 - deshace) * (i === 0 ? 1 : 0.5); g.drawImage(borrosa, 0, cam.ys - (i / pasos) * cam.vel * 0.03, 1080, 1920, 0, 0, 1080, 1920); }
    // la luz del salón se apaga al irse
    g.globalAlpha = 1; g.fillStyle = `rgba(8,14,40,${Math.min(0.7, 2.8 * deshace * (1 - deshace))})`; g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  // el polvillo de la alfombra al aterrizar
  const w = t - aterriza;
  if (w > 0 && w < 0.9 && t < Taun + 0.1) {
    const az = azar(55), ysuelo = SUELO + 60 - cam.ys;
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 26; i++) { const d = az() < 0.5 ? -1 : 1, vx = (120 + az() * 380) * d, vy = -(40 + az() * 160); const x = 540 + vx * w * (1 - w * 0.4), y = ysuelo - 30 + vy * w + 200 * w * w, r = 14 + az() * 22 + 40 * w; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(255,236,250,${0.28 * Math.max(0, 1 - w * 1.3)})`); gr.addColorStop(1, "rgba(255,236,250,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.2832); g.fill(); }
    g.restore();
  }
  gato(g, { x: 470, esc: 350, ang: t < Tse ? -0.32 * (1 - su(tr(t, 0.8, aterriza))) * (t < Taun ? 1 : 0) - (t >= Taun ? 0.32 * su(tr(t, Taun, Tarr)) : 0) : mez(-0.32, -0.12, su(tr(t, Tnada - 0.3, f2.fin))), t, ...sg });
  vineta(g, 0.45);
  velo(g, 0.45);
}

export const momentos = { aterriza, sube: Taun };
