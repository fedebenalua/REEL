// «Tres: enchufa la tele y todo lo de alrededor a un ladrón con interruptor, y apágalo por la noche. Más de cuarenta
// euros al año.»
// Otro sitio: el mueble de la tele, de noche, con la luz azul de la ventana. Corte en «Tres».
// - Al empezar, la tele, el descodificador y la consola están «apagados» pero con su piloto rojo encendido, y de cada
//   piloto se escapan monedas despacio.
// - «enchufa ... todo lo de alrededor»: sus cables bajan y se enchufan, uno a uno, al ladrón del suelo.
// - «ladrón con interruptor»: la cámara baja al ladrón; su interruptor naranja brilla. «apágalo»: clic, se apaga, y con
//   él todos los pilotos rojos; las monedas dejan de irse.
// - «Más de cuarenta euros»: en el suelo se apila una torre de monedas y sale «40 € al año».
import * as k from "#kit";
import { v } from "#voz";
import { vista, sinVista, camino2D, moneda, velo, vineta, VERDE } from "../mundo.js";

export const desde = (v) => v.frase(5).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f5 = v.frase(5);
const T0 = f5.inicio, Tenc = f5.t("enchufa"), Ttele = f5.t("tele"), Talr = f5.t("alrededor"), Tlad = f5.t("ladron"), Tint = f5.t("interruptor"), Tapa = f5.t("apagalo"), Tnoc = f5.t("noche"), Tmas = f5.t("mas"), Tcua = f5.t("cuarenta"), Tano = f5.t("ano"), Fin = v.frase(6).inicio;

const LAD = [60, 760];
const ENCHUFES = [-150, -50, 50, 150].map((dx) => [LAD[0] - 60 + dx, LAD[1]]);
// los aparatos: dónde está su piloto y de dónde sale su cable
const APARATOS = [
  { led: [380, -50], cable: [360, -40], enchufa: Ttele - 0.05 },        // la tele
  { led: [-330, 250], cable: [-300, 290], enchufa: Talr - 0.2 },         // el descodificador
  { led: [330, 250], cable: [300, 290], enchufa: Talr + 0.15 },          // la consola
  { led: [-60, 95], cable: [0, 110], enchufa: Talr + 0.45 },             // la barra de sonido
];
const apagado = (t) => su(tr(t, Tapa + 0.05, Tapa + 0.15));
const cam = camino2D([[T0, [1.05, 0, 0]], [Talr, [1.05, 0, 80]], [Tlad + 0.25, [1.3, 40, 640]], [Tapa + 0.35, [1.3, 40, 640]], [Tnoc + 0.4, [1.0, -60, 330]], [Fin, [1.02, -60, 330]]]);

const madera = k.ruido(512, 515, 4, 3, "lineas");
function salon(g, t, luz) {
  // la pared azul de noche, con la luz de la luna desde la izquierda
  const bg = g.createLinearGradient(-1200, -1200, 1200, 1200); bg.addColorStop(0, "#26346a"); bg.addColorStop(1, "#0c1030");
  g.fillStyle = bg; g.fillRect(-1600, -2000, 3200, 2900);
  const mg = g.createRadialGradient(-700, -600, 50, -700, -600, 1300); mg.addColorStop(0, "rgba(150,190,255,0.35)"); mg.addColorStop(1, "rgba(150,190,255,0)");
  g.fillStyle = mg; g.fillRect(-1600, -2000, 3200, 2900);
  // el resplandor rojo de los pilotos en la pared
  if (luz > 0.01) { k.brillo(g, 0, 0, 1400, "255,40,60", 0.18 * luz); }
  // el suelo
  const sg = g.createLinearGradient(0, 600, 0, 1600); sg.addColorStop(0, "#5a3a2a"); sg.addColorStop(1, "#1e120c"); g.fillStyle = sg; g.fillRect(-1600, 600, 3200, 1100);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(madera, -1600, 600, 3200, 1100); g.restore();
}
function mueble(g) {
  // el mueble bajo la tele
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 50; g.shadowOffsetY = 30;
  k.redondo(g, -560, 150, 1120, 300, 20); g.fillStyle = "#6a4024"; g.fill(); g.restore();
  k.redondo(g, -560, 150, 1120, 300, 20); const mg = g.createLinearGradient(0, 150, 0, 450); mg.addColorStop(0, "#9a6438"); mg.addColorStop(1, "#4a2a16"); g.fillStyle = mg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45; g.drawImage(madera, -560, 150, 1120, 300); g.restore();
  for (const x of [-500, 500]) { g.fillStyle = "#2a1a10"; g.fillRect(x - 20, 450, 40, 140); }
}
function aparatos(g, t, on) {
  // la tele, en su pie
  g.fillStyle = "#1a1c22"; g.fillRect(-60, 70, 120, 80); g.fillRect(-200, 130, 400, 22);
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 40; k.redondo(g, -480, -340, 960, 560, 16); g.fillStyle = "#0e0f14"; g.fill(); g.restore();
  k.redondo(g, -465, -325, 930, 510, 8); const pg = g.createLinearGradient(-465, -325, 465, 185); pg.addColorStop(0, "#1c2238"); pg.addColorStop(0.5, "#07080e"); pg.addColorStop(1, "#11141f"); g.fillStyle = pg; g.fill();
  g.save(); g.globalCompositeOperation = "screen"; const rf = g.createLinearGradient(-465, -325, 100, 185); rf.addColorStop(0, "rgba(160,190,255,0.18)"); rf.addColorStop(0.4, "rgba(160,190,255,0.02)"); rf.addColorStop(0.41, "rgba(0,0,0,0)"); g.fillStyle = rf; g.fillRect(-465, -325, 930, 510); g.restore();
  // la barra de sonido
  k.redondo(g, -300, 80, 600, 44, 20); g.fillStyle = "#20232a"; g.fill(); g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(-290, 86, 580, 6);
  // el descodificador y la consola, sobre el mueble
  for (const [x, w, h] of [[-330, 260, 70], [330, 220, 110]]) { k.redondo(g, x - w / 2, 300 - h, w, h, 12); const ag = g.createLinearGradient(0, 300 - h, 0, 300); ag.addColorStop(0, "#3a3e48"); ag.addColorStop(1, "#15171c"); g.fillStyle = ag; g.fill(); }
  // los pilotos rojos
  for (const a of APARATOS) {
    const [x, y] = a.led, late = 0.75 + 0.25 * Math.sin(t * 2 + x);
    g.fillStyle = on > 0.01 ? `rgba(255,40,50,${on})` : "#3a2a2c"; g.beginPath(); g.arc(x, y, 9, 0, 6.2832); g.fill();
    k.brillo(g, x, y, 160, "255,40,50", 0.9 * on * late);
  }
}
function ladron(g, t, enchufados, encendido, clic) {
  const [x, y] = LAD;
  g.save(); g.shadowColor = "rgba(0,0,0,0.6)"; g.shadowBlur = 30; g.shadowOffsetY = 16; k.redondo(g, x - 330, y - 65, 660, 130, 40); g.fillStyle = "#e8eaee"; g.fill(); g.restore();
  k.redondo(g, x - 330, y - 65, 660, 130, 40); const lg = g.createLinearGradient(0, y - 65, 0, y + 65); lg.addColorStop(0, "#ffffff"); lg.addColorStop(1, "#b8bcc6"); g.fillStyle = lg; g.fill();
  for (const [i, [ex, ey]] of ENCHUFES.entries()) {
    g.beginPath(); g.arc(ex, ey, 44, 0, 6.2832); g.fillStyle = "#cfd3da"; g.fill(); g.strokeStyle = "rgba(0,0,0,0.15)"; g.lineWidth = 3; g.stroke();
    if (enchufados[i] < 0.5) { g.fillStyle = "#3a3e46"; g.beginPath(); g.arc(ex - 14, ey, 7, 0, 6.2832); g.arc(ex + 14, ey, 7, 0, 6.2832); g.fill(); }
  }
  // el interruptor: naranja y encendido, o apagado
  const sx = x + 255, sy = y;
  k.redondo(g, sx - 38, sy - 46, 76, 92, 14); g.fillStyle = "#2a2e36"; g.fill();
  k.redondo(g, sx - 30, sy - 38 + (1 - encendido) * 26, 60, 50, 10); g.fillStyle = encendido > 0.5 ? "#ff8a20" : "#7a4a24"; g.fill();
  if (encendido > 0.01) k.brillo(g, sx, sy - 12, 240, "255,150,40", 0.8 * encendido);
  if (clic > 0.01) k.fogonazo(g, sx, sy, clic, 400, "255,220,170");
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const on = 1 - apagado(t);
  salon(g, t, on);
  mueble(g);
  // los cables: de cada aparato al suelo; al enchufarse, la clavija entra en el ladrón
  const enchufados = APARATOS.map((a) => su(tr(t, a.enchufa - 0.25, a.enchufa + 0.1)));
  g.save(); g.lineCap = "round";
  for (const [i, a] of APARATOS.entries()) {
    const [ex, ey] = ENCHUFES[i], u = enchufados[i], px = mez(ex + (i - 1.5) * 120, ex, u), py = mez(ey + 160, ey, u);
    g.strokeStyle = "#0b0c10"; g.lineWidth = 14; g.beginPath(); g.moveTo(a.cable[0], a.cable[1]); g.bezierCurveTo(a.cable[0], 600, px, py - 300, px, py - 30); g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.12)"; g.lineWidth = 3; g.stroke();
    k.redondo(g, px - 34, py - 50, 68, 70, 16); g.fillStyle = "#16181e"; g.fill();
    if (u > 0.9 && u < 1) k.brillo(g, ex, ey, 200, "255,220,150", 0.6);
  }
  g.restore();
  aparatos(g, t, on);
  const clic = t > Tapa + 0.05 ? t - Tapa - 0.05 : -1;
  ladron(g, t, enchufados, on, clic);
  // las monedas que se escapan de los pilotos mientras están encendidos
  const az = azar(64);
  for (let i = 0; i < 28; i++) {
    const a = APARATOS[i % 4], t0 = T0 - 1 + i * 0.22 + az() * 0.1, u = tr(t, t0, t0 + 1.8); if (u <= 0 || u >= 1) continue;
    const al = Math.sin(Math.PI * u) * (1 - apagado(t0 + 0.6)) * (1 - apagado(t));
    moneda(g, a.led[0] + Math.sin(u * 5 + i) * 30, a.led[1] - u * 420, 34, az() + u, al);
  }
  // la torre de monedas en el suelo: «más de cuarenta euros»
  const torre = su(tr(t, Tmas - 0.1, Tano));
  if (torre > 0) {
    const n = Math.floor(torre * 40), X = -380, Y = 880;
    for (let i = 0; i < n; i++) { g.save(); g.translate(X + Math.sin(i * 1.7) * 4, Y - i * 12); g.scale(1, 0.32); moneda(g, 0, 0, 70, 0, 1); g.restore(); }
    k.brillo(g, X, Y - n * 6, 500, "255,210,110", 0.35 * torre);
  }
  sinVista(g);
  const p = su(tr(t, Tcua - 0.1, Tcua + 0.2)) * (1 - su(tr(t, Fin - 0.5, Fin - 0.2)));
  if (p > 0) k.pastilla(g, 640, 1150, "40 €", "al año", VERDE, p, 120);
  vineta(g, 0.5);
  velo(g, 0.45, "8,10,30");
}
