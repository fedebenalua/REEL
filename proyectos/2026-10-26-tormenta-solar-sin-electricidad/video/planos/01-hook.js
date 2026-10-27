// «¿Qué pasaría si una tormenta solar dejara a toda la humanidad sin electricidad?»
// Un solo mundo: el Sol abajo, la Tierra arriba. La cámara sube con la nube del Sol hasta la Tierra.
// - Fotograma 0: el borde del Sol llena la parte de abajo y revienta en una llamarada; la nube ya sale hacia arriba.
// - «si una tormenta»: la cámara se aleja: el Sol abajo, la nube subiendo y la Tierra pequeña arriba, a la vez.
// - «solar»: la cámara se lanza hacia la Tierra detrás de la nube, entre estelas; el Sol se queda abajo.
// - «toda la humanidad»: la Tierra llega desde arriba, de noche, con sus ciudades encendidas; la cámara frena; la nube
//   la alcanza por abajo y se enciende la aurora del polo.
// - «sin electricidad»: las luces se apagan en una ola, de derecha a izquierda; reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { llamarada, nube, solDeCerca, tierraNoche } from "../mundo.js";

export const desde = 0;

const { suave, tramo, proyecta, F } = k;
const f1 = v.frase(1);
const Thum = f1.t("humanidad"), Tsin = f1.t("sin"), Tfin = f1.fin;

const SOL = [0, -60, 0], RSOL = 40, TOPE = [0, -20, 0];
const TIERRA = [0, 110, 0], RT = 6;

// la cámara: pegada al Sol, mirando su borde; se aleja hasta ver el Sol, la nube y la Tierra a la vez, y se lanza
// hacia la Tierra, donde frena
const camara = k.ruta([
  [0, { pos: [0, -10, 46], mira: [0, -12, 0] }],
  [1.0, { pos: [0, 48, 175], mira: [0, 60, 0] }],
  [Thum - 0.2, { pos: [0, TIERRA[1] - 0.3, 21], mira: [0, TIERRA[1] - 0.3, 0] }],
  [Thum + 0.4, { pos: [0, TIERRA[1] - 0.3, 20.5], mira: [0, TIERRA[1] - 0.3, 0] }],
]);

// estrellas alrededor del camino, unas lejos y otras cerca (las de cerca dejan estela al subir)
const az = k.azar(12), estrellas = [];
for (let i = 0; i < 1800; i++) estrellas.push({ p: [(az() - 0.5) * 420, -120 + az() * 420, -300 - az() * 300], c: ["roja", "naranja", "amarilla", "blanca", "azul"][Math.floor(az() * 5)], b: 0.3 + Math.pow(az(), 3) * 2, r: 0.1 + az() * 0.2 });
for (let i = 0; i < 260; i++) {
  const x = (az() < 0.5 ? -1 : 1) * (14 + az() * 30);
  estrellas.push({ p: [x, -30 + az() * 200, -20 + az() * 30], c: ["naranja", "amarilla", "blanca", "azul"][Math.floor(az() * 4)], b: 0.4 + az() * 1.2, r: 0.03 + az() * 0.04 });
}

// la nube: su frente va por delante de la cámara y alcanza la Tierra en «humanidad»
const frente = k.claves([[0, 3], [0.5, 24], [1.1, 60], [Thum - 0.1, TIERRA[1] - RT - TOPE[1]], [Thum + 0.8, TIERRA[1] + 40 - TOPE[1]]]);

export function dibuja(g, t) {
  const cam = camara(t), antes = camara(t - 1 / 60);
  k.fondo(g, cam);
  k.estrellas(g, cam, antes, estrellas);

  // el Sol, con su llamarada en el borde de arriba
  const S = proyecta(cam, SOL), P = proyecta(cam, TOPE);
  if (S) {
    const rad = (F * RSOL) / S.z;
    if (S.y - rad * 1.5 < 1920) solDeCerca(g, S.x, S.y, rad, t, 0.6 * k.pulso(t, 0.1, 0.35));
    if (P) llamarada(g, P.x, P.y, t + 0.12, (F * 22) / P.z);
  }

  // la Tierra
  const T = proyecta(cam, TIERRA), radT = T ? (F * RT) / T.z : 0;
  const choque = tramo(t, Thum - 0.15, Thum + 0.5);
  if (T && T.y + radT > -50) {
    const ola = (c, X) => { const d = 0.7 * (1 - (X - (T.x - radT)) / (2 * radT)); return suave(tramo(t, Tsin + 0.05 + d, Tsin + 0.3 + d)); };
    // el lado del Sol (abajo) se enciende cuando le llega la nube
    k.brillo(g, T.x, T.y + radT * 0.9, radT * 3.2, "255,150,70", 0.5 * suave(choque) * (1 - 0.6 * tramo(t, Thum + 0.6, Tfin)));
    tierraNoche(g, T.x, T.y, radT, 0.6 + t * 0.06, { apagada: ola, aurora: suave(tramo(t, Thum, Thum + 0.6)), auroraT: t });
    // el arco de choque: la nube aprieta el campo por debajo
    const arco = suave(choque) * (1 - 0.6 * tramo(t, Thum + 0.8, Tfin));
    if (arco > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter";
      g.strokeStyle = `rgba(140,220,255,${0.3 * arco})`; g.lineWidth = radT * 0.02;
      g.beginPath(); g.arc(T.x, T.y - radT * 0.25, radT * 1.4, 0.18 * Math.PI, 0.82 * Math.PI); g.stroke();
      g.strokeStyle = `rgba(140,220,255,${0.1 * arco})`; g.lineWidth = radT * 0.14; g.stroke();
      g.restore();
    }
  }

  // la nube, que sale del borde del Sol hacia arriba (se apaga cuando ya ha envuelto la Tierra)
  if (P) {
    const R = (F * frente(t)) / P.z, al = Math.min(1, t * 5 + 0.5) * 0.85 * (1 - suave(tramo(t, Thum + 0.2, Tsin + 0.3)));
    nube(g, P.x, P.y, R, al, t, 0.85);
  }

  // un velo arriba para el subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,5,10,0.4)"); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
