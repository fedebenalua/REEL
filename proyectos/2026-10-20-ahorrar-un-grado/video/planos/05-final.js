// «Así de fácil: un grado menos, un siete por ciento menos de calefacción. Envíaselo a ese amigo que tiene la casa a
//  veintiséis grados en pleno invierno.»
// Un sitio nuevo: dos casas cortadas, en la nieve. La de aquí tira billetes por la chimenea; «grado»: el termostato baja a 21,
// se enfría, los billetes paran y salta una lluvia de monedas con «-7 %». «Envíaselo»: un avión cruza y la cámara va a la
// casa del amigo, roja, con el termostato a 26 y el amigo sudando. Al final todo se va y vuelve el primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, casa, billete, avion, lluvia, colCalor, gancho, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, redondo, azar, mezColor } = k;
const F10 = v.frase(10), F11 = v.frase(11);
const T0 = F10.inicio, Tgra = F10.t("grado"), Tsie = F10.t("siete");
const T11 = F11.inicio, Tami = F11.t("amigo"), Tvei = F11.t("veintiseis");
const FIN = v.duracion, TF = FIN - 0.85;
const HX = 900;                                     // dónde está la casa del amigo
const cam = camino2D([[T0, [1.25, 0, -90]], [T11 + 0.1, [1.25, 0, -90]], [T11 + 1.0, [1.25, HX, -90]], [FIN, [1.25, HX, -90]]]);

function billetes(g, t, x, y, n, vel, al, sem) {
  if (al <= 0.01) return;
  const r = azar(sem);
  for (let i = 0; i < n; i++) {
    const sp = vel * (0.8 + r() * 0.4), dir = (r() - 0.5) * 2, giro = (r() - 0.5) * 6;
    const p = (t * sp + i / n) % 1;
    billete(g, x + dir * (60 + p * 340), y - 30 - p * 470, giro * p * 2, 1.0 + 0.5 * p, al * Math.min(1, p * 8) * (1 - tr(p, 0.7, 1)));
  }
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const gr = g.createLinearGradient(0, -1100, 0, 700); gr.addColorStop(0, "#14205a"); gr.addColorStop(1, "#5a7fd0");
  g.fillStyle = gr; g.fillRect(-900, -1400, 3000, 2000);
  g.fillStyle = "#dfe9ff"; g.fillRect(-900, 392, 3000, 1400);
  g.fillStyle = "#c8d8f6"; g.fillRect(-900, 392, 3000, 14);
  const rs = azar(33); for (let i = 0; i < 40; i++) { const x = -800 + rs() * 2800, y = -1000 + rs() * 1000; g.fillStyle = `rgba(255,255,255,${0.35 + 0.5 * Math.abs(Math.sin(t * 2 + i))})`; g.fillRect(x, y, 4, 4); }
  // --- la casa de aquí
  const rodar = su(tr(t, Tgra, Tgra + 0.5));
  const calor = mez(0.95, 0.4, su(tr(t, Tgra, Tgra + 0.8)));
  const flujo = 1 - su(tr(t, Tgra, Tgra + 0.6));
  g.save(); g.translate(0, 0);
  k.brillo(g, 0, 0, 1500, colCalor(calor), 0.3 * calor);
  billetes(g, t, 187, -420, 9, 0.28, flujo, 5);
  casa(g, t, { calor, grados: 22 - rodar, humo: 0.6 });
  g.restore();
  lluvia(g, t, Tsie, 0, -300, 22, 9, 950);
  // --- la casa del amigo
  g.save(); g.translate(HX, 0);
  const sud = su(tr(t, T11 + 0.4, T11 + 0.9));
  k.brillo(g, 0, 0, 1700, "255,70,50", 0.4);
  billetes(g, t, 187, -420, 9, 0.3, 1, 8);
  casa(g, t, { calor: 1, grados: 26, sudor: sud, humo: 1 });
  g.restore();
  // el amigo
  const aA = su(tr(t, Tami, Tami + 0.3)) * (1 - su(tr(t, TF, TF + 0.3)));
  if (aA > 0.01) {
    g.save(); g.translate(HX - 300, -380); g.globalAlpha *= aA; const e = 0.85 + 0.15 * su(tr(t, Tami, Tami + 0.3));
    g.scale(e, e);
    g.beginPath(); g.arc(0, 0, 70, 0, 6.2832); g.fillStyle = "#ffd29a"; g.fill(); g.lineWidth = 7; g.strokeStyle = "#fff"; g.stroke();
    g.fillStyle = "#3a2210"; g.beginPath(); g.arc(-24, -8, 7, 0, 6.2832); g.arc(24, -8, 7, 0, 6.2832); g.fill();
    g.strokeStyle = "#3a2210"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.arc(0, 30, 22, 3.6, 5.8); g.stroke();
    redondo(g, 86, -34, 250, 68, 32); g.fillStyle = "#1d6bff"; g.fill(); g.font = "800 38px Figtree"; g.fillStyle = "#fff"; g.textAlign = "left"; g.textBaseline = "middle"; g.fillText("Ese amigo", 108, 2);
    g.restore();
  }
  sinVista(g);
  // los rótulos
  k.pastilla(g, 540, 1760, "-7", "%", "130,255,170", su(tr(t, Tsie, Tsie + 0.3)) * (1 - su(tr(t, T11 - 0.2, T11 + 0.1))), 150);
  k.pastilla(g, 540, 1760, "26", "°C", "255,110,90", su(tr(t, Tvei, Tvei + 0.3)) * (1 - su(tr(t, TF, TF + 0.3))), 150);
  // el avión
  const ua = tr(t, T11 - 0.05, T11 + 1.0);
  if (ua > 0 && ua < 1) { const u = su(ua); avion(g, mez(-160, 1240, u), mez(700, 640, u) - 90 * Math.sin(Math.PI * u), -0.2 + 0.4 * u); }
  // al final vuelve el primer fotograma del vídeo
  const fv = su(tr(t, TF, TF + 0.7));
  if (fv > 0.01) { g.save(); g.globalAlpha = fv; gancho(g, 0); g.restore(); sinVista(g); }
  velo(g, 0.4);
  vineta(g, 0.45);
}
export const momentos = { grado: Tgra, siete: Tsie, amigo: Tami, veintiseis: Tvei };
