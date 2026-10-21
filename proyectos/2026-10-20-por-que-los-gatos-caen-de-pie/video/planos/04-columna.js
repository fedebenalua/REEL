// «Puede hacerlo porque su columna se retuerce como un trapo, y su clavícula va suelta.»
// El mismo gato en el vacío, ya de pie en el aire; la cámara sube un poco para dejar sitio debajo.
// - «su columna»: la piel se vuelve oscura y transparente y la columna brilla, vértebra a vértebra.
// - «se retuerce»: la mitad de delante gira hacia un lado y la de atrás hacia el otro: cada vértebra apunta a un sitio.
// - «como un trapo»: debajo llega un trapo de cocina de rayas y se retuerce igual, y los dos vuelven.
// - «y su clavícula va suelta»: en el hombro se enciende un huesecito suelto que se mueve; luego todo se queda quieto
//   antes del corte.
import * as k from "#kit";
import { T, caida, camVacio, gato, vacio, velo, vineta } from "../mundo.js";

export const desde = "puede";
export const entrada = "sigue";

const { suave: su, tramo: tr, mez } = k;
const TRAPO = { x0: 150, x1: 930, y: 1300, ancho: 150 };

// El trapo: una tela de rayas que se retuerce (los extremos giran al revés): de cara blanca, por detrás algo más oscura.
function trapo(g, t, giro, al) {
  if (al <= 0.01) return;
  g.save(); g.globalAlpha *= al;
  const N = 60, { x0, x1, y, ancho } = TRAPO;
  const esc = mez(0.85, 1, al);
  g.translate(540, y); g.scale(esc, esc); g.translate(-540, -y);
  // la sombra
  k.brillo(g, 540, y + 120, 800, "0,0,30", 0.3);
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N, um = (u0 + u1) / 2;
    const a = giro * (um - 0.5) * 2 + Math.sin(t * 1.3 + um * 3) * 0.04;
    const c = Math.cos(a), w = ancho * Math.abs(c) + 6;
    const ondula = Math.sin(um * Math.PI) * 18 * Math.sin(t * 1.6);
    const xa = mez(x0, x1, u0), xb = mez(x0, x1, u1) + 1.5;
    const delante = c > 0;
    const luz = 0.55 + 0.45 * Math.abs(c);
    const raya = Math.floor(um * 13) % 2 === 0 && um > 0.08 && um < 0.92;
    const base = delante ? [252, 248, 240] : [220, 210, 200];
    const col = raya ? (delante ? [210, 50, 60] : [170, 40, 50]) : base;
    const gr = g.createLinearGradient(0, y + ondula - w / 2, 0, y + ondula + w / 2);
    gr.addColorStop(0, `rgb(${col.map((v) => Math.round(v * luz * 1.05)).join(",")})`);
    gr.addColorStop(0.5, `rgb(${col.map((v) => Math.round(v * luz)).join(",")})`);
    gr.addColorStop(1, `rgb(${col.map((v) => Math.round(v * luz * 0.7)).join(",")})`);
    g.fillStyle = gr; g.fillRect(xa, y + ondula - w / 2, xb - xa, w);
  }
  // los flecos de las puntas
  g.strokeStyle = "rgba(245,240,230,0.9)"; g.lineWidth = 4;
  for (const [x, d] of [[x0, -1], [x1, 1]]) for (let j = -5; j <= 5; j++) { const yy = y + j * (ancho / 11) * Math.abs(Math.cos(giro)); g.beginPath(); g.moveTo(x, yy); g.lineTo(x + d * 22, yy + 3); g.stroke(); }
  g.restore();
}

export function dibuja(g, t) {
  const cam = camVacio(t), st = caida(t);
  vacio(g, t, 0.5, 40);
  const mueve = su(tr(t, T.clavicula, T.clavicula + 0.2)) * (1 - su(tr(t, T.suelta + 0.4, T.suelta + 0.8)));
  gato(g, { ...st, x: cam.x, y: cam.y, esc: cam.esc, ang: cam.ang, mueveClav: mueve });
  // el trapo, que se retuerce igual que la columna
  const al = su(tr(t, T.trapo - 0.25, T.trapo + 0.15));
  const tw = Math.sin(Math.PI * su(tr(t, T.retuerce - 0.1, T.trapo + 0.9)));
  const tw2 = Math.max(tw, 0.9 * Math.sin(Math.PI * su(tr(t, T.trapo - 0.1, T.trapo + 1.3))));
  trapo(g, t, 2.6 * tw2 + 0.25, al);
  vineta(g, 0.45);
  velo(g, 0.45);
}
