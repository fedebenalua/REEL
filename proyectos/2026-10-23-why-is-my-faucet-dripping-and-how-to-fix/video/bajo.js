// Bajo el fregadero: el armario oscuro, el fondo de la pila, el tubo del desagüe y las dos llaves de paso con sus
// tubos trenzados por los que sube el agua. Una sola función para «cerrar» y para «abrir».
import * as k from "#kit";
import { camara, CROMO, ACERO, gradH, gradV, cilV, ruedo, tubo } from "./mundo.js";

const { mez, suave: su, tramo: tr } = k;
export const VALVULA = { x: 250, y: 420 };   // la llave que se gira (la de la derecha)
const IZQ = { x: -250, y: 420 };

// el tubo trenzado, con agua que sube. flujo 0..1: cuánta agua pasa
function manguera(g, t, x, flujo, fase) {
  const pts = [[x, 330], [x, -470]];
  // la funda de malla
  g.save(); g.lineCap = "butt";
  g.beginPath(); g.moveTo(x, 330); g.lineTo(x, -470); g.strokeStyle = "#2b333b"; g.lineWidth = 74; g.stroke();
  g.strokeStyle = gradH(g, x - 37, x + 37, [[0, "#38424c"], [0.3, "#aab6c2"], [0.5, "#e9f0f6"], [0.75, "#7d8a97"], [1, "#2c343c"]]);
  g.lineWidth = 66; g.beginPath(); g.moveTo(x, 330); g.lineTo(x, -470); g.stroke();
  g.strokeStyle = "rgba(20,30,40,0.35)"; g.lineWidth = 3;
  for (let y = -460; y < 330; y += 16) { g.beginPath(); g.moveTo(x - 33, y); g.lineTo(x + 33, y + 10); g.stroke(); }
  g.restore();
  // el agua, vista a través: pulsos azules que suben
  if (flujo > 0.01) {
    for (let i = 0; i < 9; i++) {
      const f = ((t * 0.7 * (0.4 + flujo) + i / 9 + fase) % 1), y = 330 - f * 800;
      g.fillStyle = `rgba(110,210,255,${0.85 * flujo})`; g.beginPath(); k.redondo(g, x - 9, y - 30, 18, 60, 9); g.fill();
      k.brillo(g, x, y, 110, "120,220,255", 0.5 * flujo);
    }
  }
  // las tuercas de arriba y de abajo
  ruedo(g, x - 52, -500, 104, 52, 10, CROMO); ruedo(g, x - 48, 310, 96, 44, 10, CROMO);
}

// la llave de paso: cuerpo cromado y su rueda con estrías. giro: ángulo de la rueda
function llaveDePaso(g, v, giro, aro) {
  const { x, y } = v;
  // el cuerpo
  g.beginPath(); k.redondo(g, x - 76, y - 66, 152, 190, 30); g.fillStyle = gradH(g, x - 76, x + 76, CROMO); g.fill();
  g.strokeStyle = "rgba(25,35,45,0.6)"; g.lineWidth = 4; g.stroke();
  ruedo(g, x - 96, y + 100, 192, 54, 14, CROMO);
  // el casquillo de color (rojo o azul)
  g.beginPath(); g.ellipse(x, y + 4, 110, 110, 0, 0, 6.2832);
  g.fillStyle = `rgba(${aro},0.95)`; g.fill();
  // la rueda
  g.save(); g.translate(x, y + 4);
  g.beginPath(); g.arc(0, 0, 96, 0, 6.2832); g.fillStyle = gradV(g, -96, 96, [[0, "#fafdff"], [0.45, "#c7d2dc"], [1, "#6c7a88"]]); g.fill();
  g.strokeStyle = "rgba(20,30,40,0.6)"; g.lineWidth = 4; g.stroke();
  g.rotate(giro);
  for (let i = 0; i < 12; i++) { g.rotate(Math.PI / 6); g.fillStyle = "rgba(40,55,70,0.55)"; g.fillRect(-7, -94, 14, 40); g.fillStyle = "rgba(255,255,255,0.5)"; g.fillRect(-7, -94, 4, 40); }
  // la marca de la rueda, para que se vea que gira
  g.fillStyle = "#ff4a3c"; g.beginPath(); k.redondo(g, -9, -88, 18, 56, 8); g.fill();
  g.beginPath(); g.arc(0, 0, 34, 0, 6.2832); g.fillStyle = gradV(g, -34, 34, [[0, "#e7edf2"], [1, "#7d8a97"]]); g.fill(); g.strokeStyle = "rgba(20,30,40,0.6)"; g.lineWidth = 3; g.stroke();
  g.restore();
}

// o: { cam, giro (de la llave de la derecha), flujo (0..1 de la derecha), flujoIzq, resalta }
export function dibujaBajo(g, t, o) {
  g.fillStyle = "#0b0605"; g.fillRect(0, 0, 1080, 1920);
  g.save(); camara(g, o.cam);
  // el fondo: la pared del armario, madera oscura, con luz desde arriba
  g.fillStyle = gradV(g, -1200, 1000, [[0, "#3a2214"], [0.35, "#5d371f"], [1, "#2a170d"]]); g.fillRect(-1600, -1300, 3200, 2600);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.6; g.drawImage(k.red, -1600, -1300, 3200, 2600); g.restore();
  for (let x = -1500; x < 1600; x += 360) { g.fillStyle = "rgba(0,0,0,0.35)"; g.fillRect(x, -1300, 6, 2600); g.fillStyle = "rgba(255,200,140,0.07)"; g.fillRect(x + 6, -1300, 5, 2600); }
  k.brillo(g, 0, -500, 1900, "255,214,160", 0.28);
  // la parte de abajo de la pila, de porcelana, arriba del todo
  g.beginPath(); g.moveTo(-900, -1300); g.lineTo(-900, -640); g.quadraticCurveTo(0, -420, 900, -640); g.lineTo(900, -1300); g.closePath();
  g.fillStyle = gradV(g, -1000, -420, [[0, "#cddae4"], [0.6, "#e9f1f6"], [1, "#9fb2c2"]]); g.fill();
  g.strokeStyle = "rgba(40,70,100,0.5)"; g.lineWidth = 6; g.stroke();
  // el tubo del desagüe, en el medio, de plástico blanco
  cilV(g, 0, -560, 700, 110, [[0, "#9aa7b2"], [0.25, "#ffffff"], [0.55, "#dde6ed"], [0.85, "#8f9ca8"], [1, "#6d7a86"]]);
  ruedo(g, -80, -560, 160, 50, 10, CROMO); ruedo(g, -76, 120, 152, 36, 8, [[0, "#9aa7b2"], [0.3, "#ffffff"], [0.7, "#c9d4dd"], [1, "#6d7a86"]]);
  // las mangueras
  manguera(g, t, IZQ.x, o.flujoIzq ?? o.flujo ?? 0, 0.13);
  manguera(g, t, VALVULA.x, o.flujo ?? 0, 0);
  llaveDePaso(g, IZQ, 0.3, "236,72,56"); llaveDePaso(g, VALVULA, o.giro ?? 0, "56,140,255");
  if (o.resalta) k.brillo(g, VALVULA.x, VALVULA.y, 520, "255,240,170", o.resalta * 0.6);
  if (o.despues) o.despues(g, t);
  g.restore();
}
