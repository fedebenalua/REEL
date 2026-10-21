// «Tu móvil no nota que lo tocas: nota que eres un conductor. / Envíaselo a ese amigo que intenta usar el móvil con guantes.»
// Un sitio nuevo: un fondo azul oscuro con una persona dibujada como un circuito de luz, y el móvil a su lado. Una cámara fija.
// - «no nota que lo tocas»: el dedo de la persona toca el móvil y sale «presión» con una cruz roja.
// - «nota que eres un conductor»: del móvil salen arcos hasta el dedo y la luz corre por el brazo y se enciende todo el cuerpo; rótulo «conductor».
// - «Envíaselo»: un avión de papel cruza; la persona se apaga y asoma el amigo; un guante toca el móvil y no pasa nada.
// - al final todo se va y vuelve el primer fotograma del vídeo (el dedo en la pantalla).
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, movil, pon, nada, avion, amigo, gancho, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const F10 = v.frase(10), F11 = v.frase(11);
const T0 = F10.inicio, Tpre = F10.t("nota"), Tnot2 = F10.t("nota#2"), Tcon = F10.t("conductor");
const T11 = F11.inicio, Tami = F11.t("amigo"), Tgua = F11.t("guantes");
const FIN = v.duracion;
const TF = FIN - 0.85;
const PH = { x: 300, y: 190, s: 0.46 };            // el móvil
const TIP = [PH.x - 184 + 6, PH.y];                  // la punta del dedo, en el borde izquierdo del móvil

// el camino de la luz: del dedo, por el brazo, hasta los pies
const CAM = [[TIP[0], TIP[1]], [60, 150], [-120, 60], [-225, 60], [-225, 330], [-225, 640]];
function sobreCamino(p) {
  const L = []; let tot = 0; for (let i = 1; i < CAM.length; i++) { const d = Math.hypot(CAM[i][0] - CAM[i - 1][0], CAM[i][1] - CAM[i - 1][1]); L.push(d); tot += d; }
  let s = p * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i]) { const u = s / L[i]; return [mez(CAM[i][0], CAM[i + 1][0], u), mez(CAM[i][1], CAM[i + 1][1], u)]; } s -= L[i]; }
  return CAM[CAM.length - 1];
}

function persona(g, t, lit, al) {
  g.save(); g.globalAlpha = al; g.lineCap = "round"; g.lineJoin = "round";
  const col = `rgb(${Math.round(mez(90, 120, lit))},${Math.round(mez(160, 255, lit))},255)`;
  // el cuerpo, lleno de una luz suave
  const cuerpo = () => {
    g.beginPath(); g.arc(-225, -90, 90, 0, 6.2832);
    redondo(g, -360, 30, 270, 620, 110);
  };
  g.fillStyle = `rgba(90,170,255,${0.1 + 0.2 * lit})`;
  g.beginPath(); g.arc(-225, -90, 90, 0, 6.2832); g.fill(); redondo(g, -360, 30, 270, 620, 110); g.fill();
  g.shadowColor = col; g.shadowBlur = 24 + 24 * lit; g.strokeStyle = col; g.lineWidth = 9;
  g.beginPath(); g.arc(-225, -90, 90, 0, 6.2832); g.stroke(); redondo(g, -360, 30, 270, 620, 110); g.stroke();
  // el brazo y el dedo
  g.lineWidth = 62; g.strokeStyle = `rgba(90,170,255,${0.18 + 0.25 * lit})`; g.shadowBlur = 0; g.beginPath(); g.moveTo(-120, 60); g.lineTo(60, 150); g.stroke();
  g.lineWidth = 36; g.beginPath(); g.moveTo(60, 150); g.lineTo(TIP[0], TIP[1]); g.stroke();
  g.shadowColor = col; g.shadowBlur = 24; g.lineWidth = 8; g.strokeStyle = col;
  g.beginPath(); g.moveTo(-130, 28); g.lineTo(60, 118); g.lineTo(TIP[0] - 4, TIP[1] - 18); g.stroke();
  g.beginPath(); g.moveTo(-130, 92); g.lineTo(50, 182); g.lineTo(TIP[0] - 4, TIP[1] + 18); g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  vista(g, 1.15, 40, 200);
  const bg = g.createLinearGradient(0, -1000, 0, 1000); bg.addColorStop(0, "#050c26"); bg.addColorStop(1, "#0e2260"); g.fillStyle = bg; g.fillRect(-700, -1100, 1400, 2200);
  k.brillo(g, 0, 150, 1900, "70,120,255", 0.28);
  const lit = su(tr(t, Tnot2 - 0.1, Tcon + 0.3)) * (1 - su(tr(t, T11, T11 + 0.5)));
  const alP = 1 - 0.85 * su(tr(t, T11, T11 + 0.5));
  persona(g, t, lit, alP);
  // la luz que corre del dedo al cuerpo
  if (lit > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 16; i++) { const p = (t * 0.55 + i / 16) % 1, [x, y] = sobreCamino(p); k.brillo(g, x, y, 80, "170,235,255", 0.95 * lit * su(tr(p * 1.3, 0, 0.3))); }
    g.restore();
  }
  // el móvil
  const pulso = Math.max(k.pulso(t, Tpre - 0.4, 0.12), k.pulso(t, Tnot2 + 0.1, 0.14));
  g.save(); g.translate(PH.x, PH.y); g.scale(PH.s, PH.s); movil(g, t, { brilla: pulso }); g.restore();
  // los arcos del campo del móvil al dedo
  const fa = su(tr(t, Tnot2, Tnot2 + 0.5)) * (1 - su(tr(t, T11, T11 + 0.4)));
  if (fa > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round"; g.setLineDash([16, 12]); g.lineDashOffset = -t * 80;
    for (let i = 0; i < 4; i++) { const a = (i - 1.5) * 70; g.strokeStyle = `rgba(${i % 2 ? "255,230,130" : "140,230,255"},${0.9 * fa})`; g.lineWidth = 8; g.shadowColor = "rgba(150,230,255,0.9)"; g.shadowBlur = 18; g.beginPath(); g.moveTo(PH.x - 184, PH.y + a * 1.5); g.bezierCurveTo(PH.x - 260, PH.y + a * 2.0, TIP[0] + 60, TIP[1] + a * 0.6, TIP[0] + 4, TIP[1]); g.stroke(); }
    g.restore();
  }
  // el amigo con su guante
  const am = su(tr(t, Tami, Tami + 0.35)) * (1 - su(tr(t, TF, TF + 0.4)));
  if (am > 0.01) amigo(g, -330, -150, 1.0 + 0.4 * am, am);
  {
    const gx = mez(-500, PH.x - 184 - 6, su(tr(t, Tami + 0.6, Tgua - 0.1))), gy = mez(300, PH.y + 40, su(tr(t, Tami + 0.6, Tgua - 0.1)));
    const h = Math.max(0, 1 - su(tr(t, Tami + 0.6, Tgua - 0.05))) * 1.5 + 0.0;
    if (t > Tami + 0.5 && t < TF + 0.4) {
      const toc = (t - Tgua) % 0.7;
      const gh = t < Tgua ? h : 0.5 * Math.max(0, Math.sin(Math.min(1, Math.max(0, ((t - Tgua) % 0.7) / 0.7)) * Math.PI)) * 0.6;
      pon(g, "guante", gx + 20, gy, -1.15, 0.6, gh);
      for (let n = 0; n < 3; n++) nada(g, PH.x - 120, PH.y + 40 + 30 * n, t - (Tgua + n * 0.7 + 0.0), 0.7);
    }
  }
  // el avión
  const ua = tr(t, T11 - 0.05, Tami + 0.1);
  if (ua > 0 && ua < 1) { const u = su(ua); avion(g, mez(-700, -330, u), mez(-250, -300 - 60 * Math.sin(u * 3.14), u), -0.35 + 0.5 * u); }
  sinVista(g);
  // los rótulos
  const pr = su(tr(t, Tpre + 0.5, Tpre + 0.8)) * (1 - su(tr(t, Tnot2 - 0.1, Tnot2 + 0.2)));
  k.etiqueta(g, 130, 1390, "presión", "255,120,120", pr, 66);
  if (pr > 0.01) { g.save(); g.globalAlpha = pr; g.strokeStyle = "#ff3a3a"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(480, 1385); g.lineTo(540, 1445); g.moveTo(540, 1385); g.lineTo(480, 1445); g.stroke(); g.restore(); }
  k.etiqueta(g, 130, 1390, "conductor", "130,255,190", su(tr(t, Tcon, Tcon + 0.3)) * (1 - su(tr(t, T11, T11 + 0.3))), 78);
  // al final vuelve el primer fotograma del vídeo
  const fv = su(tr(t, TF, TF + 0.7));
  if (fv > 0.01) { g.save(); g.globalAlpha = fv; vista(g, 1.0, 0, 0); gancho(g, 0); g.restore(); sinVista(g); }
  velo(g, 0.4);
  vineta(g, 0.45);
}

export const momentos = { conductor: Tcon, amigo: Tami, guantes: Tgua };
