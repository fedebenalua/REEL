// «Primero, su oído funciona como un nivel de burbuja: le dice dónde está el suelo.»
// El mismo gato, cayendo boca arriba a cámara lenta en el vacío; sigue la cámara del plano anterior.
// - «Primero, su oído»: la cámara entra hacia su oído; la cabeza se vuelve oscura por dentro.
// - «como un nivel de burbuja»: dentro, los canales de líquido del oído y, encima, un tubo curvo de cristal con
//   líquido verde: está boca abajo, y en «burbuja» la burbuja se suelta y corre a un extremo.
// - «le dice dónde está el suelo»: una flecha de luz apunta abajo, al suelo; en «suelo» el oído gira hasta ponerse
//   derecho y la burbuja vuelve al centro. La cámara sale y la cabeza ha girado hacia el suelo.
import * as k from "#kit";
import { v } from "#voz";
import { T, ZOOM, caida, camVacio, gato, laberinto, vacio, velo, vineta } from "../mundo.js";

export const desde = "primero";
export const entrada = "sigue";

const { suave: su, tramo: tr, mez } = k;
const f3 = v.frase(3);
const Tdice = f3.t("dice");

export function dibuja(g, t) {
  const cam = camVacio(t), st = caida(t);
  vacio(g, t, 0.5, 40);
  const r = gato(g, { ...st, x: cam.x, y: cam.y, esc: cam.esc, ang: cam.ang });
  const z = cam.z || 0;
  if (z > 0.2) {
    // por dentro de la cabeza: oscuro, con luz azul
    const dentro = su(tr(z, 0.3, 0.75));
    const [hx, hy] = r.cabeza, R = r.radio * 1.04;
    g.save(); g.globalAlpha = dentro;
    const gr = g.createRadialGradient(hx, hy, 0, hx, hy, R);
    gr.addColorStop(0, "#1a1550"); gr.addColorStop(0.7, "#0e0c34"); gr.addColorStop(0.92, "#2a1a50"); gr.addColorStop(1, "rgba(60,30,80,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(hx, hy, R, 0, 6.2832); g.fill();
    g.restore();
    // el oído: crece con la cámara
    const c = su(tr(t, T.suelo - 0.45, T.suelo + 0.45));
    const ang = (Math.PI + 0.2) * (1 - c);
    const S = cam.esc * 0.17;
    laberinto(g, cam.oido[0], cam.oido[1], S, ang, su(tr(t, T.burbuja - 0.05, T.burbuja + 0.45)), su(tr(z, 0.35, 0.8)), t);
    // la flecha al suelo, y el suelo que se ilumina abajo
    const fl = su(tr(t, Tdice - 0.1, Tdice + 0.3)) * su(tr(z, 0.7, 0.95));
    if (fl > 0.01) {
      const x = cam.oido[0], y0 = cam.oido[1] + S * 1.3, y1 = Math.min(1420, cam.oido[1] + S * 2.1);
      g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = fl;
      k.brillo(g, 540, 1600, 1500, "255,190,90", 0.55);
      g.strokeStyle = "rgba(255,210,120,0.95)"; g.lineWidth = 34; g.lineCap = "round";
      g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke();
      g.beginPath(); g.moveTo(x - 95, y1 - 95); g.lineTo(x, y1); g.lineTo(x + 95, y1 - 95); g.stroke();
      k.brillo(g, x, y1, 260, "255,200,110", 0.8);
      g.restore();
    }
  }
  vineta(g, 0.45);
  velo(g, 0.45);
}
