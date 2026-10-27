// «Unos psicólogos dieron a treinta personas un aparato que pitaba en cualquier momento del día.»
// «Con cada pitido, apuntaban lo que tenían en la cabeza justo antes.»
// «Uno se hablaba por dentro en tres de cada cuatro pitidos.» «Y cinco, en ninguno.»
// - Las treinta cabezas llegan en cascada; «aparato»: a cada una le sale su aparato; «pitaba»: pitan en rojo, cada
//   una a su hora, y el fondo pasa de la mañana a la noche.
// - «Con cada pitido»: la cámara entra en una; pita, un fogonazo de foto, y lo que tenía dentro sale en una tarjeta.
// - «Uno se hablaba»: pita tres veces más; dos tarjetas de oro y la cuarta azul, con un cuadro. Quedan en fila.
// - «Y cinco»: la cámara se aleja; cinco cabezas se vuelven azules; «ninguno»: pitan y no sale ni una palabra.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, CRANEO, ORO, ROJO, aparato, cabeza, cabezaHecha, camara, fondo, frena, ondas, remolino, silencio, tarjeta, velo, vineta } from "../mundo.js";

export const desde = (v) => v.frase(4).inicio;
export const entrada = "corte";

const { suave: su, tramo: tr, mez, entra, claves, pulso } = k;
const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
const T0 = f4.inicio, Ttre = f4.t("treinta"), Tper = f4.t("personas"), Tapa = f4.t("aparato"), Tpit = f4.t("pitaba"), Tdia = f4.t("dia");
const Tcon = f5.inicio, Tpit2 = f5.t("pitido"), Tapu = f5.t("apuntaban"), Tant = f5.t("antes");
const Tuno = f6.inicio, Thab = f6.t("hablaba"), Ttres = f6.t("tres"), Tcua = f6.t("cuatro");
const Ty = f7.inicio, Tcin = f7.t("cinco"), Tnin = f7.t("ninguno"), Tfin = v.frase(8).inicio;

// la cuadrícula: 6 columnas y 5 filas, en coordenadas de pantalla (con la cámara en su sitio)
const S = 0.18;
const CAB = Array.from({ length: 30 }, (_, i) => ({ x: 92 + (i % 6) * 179, y: 640 + Math.floor(i / 6) * 196, i }));
const CINCO = [3, 7, 16, 20, 27], UNO = 14, ENTRA = 16;
const az = k.azar(808);
// cada una pita a su hora entre «pitaba» y «día»; las cinco vuelven a pitar en «ninguno»
for (const c of CAB) { c.llega = mez(T0 - 0.55, Ttre - 0.15, (Math.floor(c.i / 6) * 6 + (c.i % 6)) / 30 * 0.85 + az() * 0.1); c.pita = mez(Tpit - 0.05, Tdia + 0.3, az()); c.pita2 = Tnin - 0.15 + az() * 0.3; c.azul = CINCO.includes(c.i); }
const U = CAB[UNO];
// los pitidos de la cabeza que se mira: «pitido» (la 1.ª tarjeta), «hablaba», «tres» y «cuatro»
const PITAS = [Tpit2 - 0.05, Thab - 0.05, Ttres - 0.08, Tcua - 0.08];
export const pitidos = [...CAB.map((c) => c.pita), ...PITAS, ...CINCO.map((i) => CAB[i].pita2)];
const TARJ = [
  { oro: true, texto: "¿y el horno?" },
  { oro: true, texto: "llego tarde" },
  { oro: true, texto: "qué hambre" },
  { oro: false, escena: "montana" },
];
// la cámara: un poco de lejos → la cuadrícula → la cabeza que se mira (a la izquierda) → la cuadrícula
const ux = U.x + 72, uy = U.y + 69;
// al final, la cámara se lanza dentro de una de las cinco: acaba con su cráneo en (540, 1020), a escala 0.95, como
// empieza el plano siguiente
const E = CAB[ENTRA], ZE = 0.95 / S, ex = E.x + CRANEO.x * S, ey = E.y + CRANEO.y * S + 30 / ZE;
const camX0 = claves([[T0, 540], [Tcon - 0.1, 540], [Tpit2 + 0.25, ux], [Ty - 0.02, ux], [Ty + 0.5, 540]]);
const camY0 = claves([[T0, 1050], [Tcon - 0.1, 1050], [Tpit2 + 0.25, uy], [Ty - 0.02, uy], [Ty + 0.5, 1050]]);
const camZ = claves([[T0, 1.2], [Tper + 0.2, 1.0], [Tcon - 0.1, 0.98], [Tpit2 + 0.25, 3.3], [Ty - 0.02, 3.4], [Ty + 0.5, 1.0], [Tnin + 0.35, 0.98], [Tfin, ZE]]);
// mientras se acerca, el punto que mira va hacia el cráneo al ritmo que crece el zoom (así no se desvía)
const lanza = (t) => { const z = camZ(t); return t < Tnin + 0.35 ? 0 : Math.min(1, (1 - 0.98 / z) / (1 - 0.98 / ZE)); };
const camX = (t) => k.mez(camX0(t), ex, lanza(t)), camY = (t) => k.mez(camY0(t), ey, lanza(t));

// dónde va cada tarjeta: en fila, abajo (en pantalla)
const fila = (j) => [800, 650 + j * 200];

export function dibuja(g, t) {
  const tf = frena(t, Tfin - 0.9, Tfin - 0.25);
  const cx = camX(t), cy = camY(t), z = camZ(t);
  const dia = su(tr(t, Tpit - 0.3, Tdia + 0.4));
  fondo(g, t, { cal: 1 - dia, noche: dia, dx: (cx - 540) * 0.3, dy: (cy - 1050) * 0.3 });
  g.save(); camara(g, cx, cy, z);
  const azules = su(tr(t, Tcin + 0.2, Tcin + 0.6));
  const foco = su(tr(lanza(t), 0.25, 0.9));
  for (const c of CAB) {
    const ll = entra(tr(t, c.llega - 0.05, c.llega + 0.35)) * (c.i === ENTRA ? 1 : 1 - foco);
    if (ll <= 0.01) continue;
    const s = S * mez(0.4, 1, ll), y = c.y + (1 - ll) * 60;
    // pitidos: el de su hora y, si es de las cinco, el de «ninguno»
    const p1 = pulso(t, c.pita + 0.08, 0.16), p2 = c.azul ? pulso(t, c.pita2 + 0.08, 0.16) : 0;
    const pita = Math.max(p1, p2);
    const az1 = c.azul ? azules : 0;
    if (c.i === ENTRA && az1 > 0.01) {
      cabezaHecha(g, "gris", c.x, y, s, ll * (1 - az1));
      cabeza(g, c.x, y, s, t, { tono: "azul", al: ll * az1, luz: mez(0.6, 1, lanza(t)), dentro: (cc) => silencio(cc, t, mez(0.6, 1, lanza(t))) });
      g.save(); g.globalCompositeOperation = "lighter";
      k.brillo(g, c.x + CRANEO.x * s, y + CRANEO.y * s, 190, AZUL, (0.9 * pita + 0.25 * az1) * (1 - lanza(t)));
      k.brillo(g, c.x + 10, y - 10, 330, AZUL, (0.5 * pulso(t, Tcin + 0.55, 0.35) + 0.15 * az1) * (1 - lanza(t)));
      g.restore();
    } else if (c.i === UNO) {
      // la que se mira: dibujada entera, con su remolino de palabras
      const pU = Math.max(...PITAS.map((tp) => pulso(t, tp + 0.08, 0.16)), p1);
      cabeza(g, c.x, y, s, t, { tono: "oro", luz: 0.7 + 0.6 * pU, al: ll, dentro: (cc) => {
        remolino(cc, t * 0.9, { al: 1 });
        ondas(cc, t, CRANEO.x, CRANEO.y, 60, 320, { periodo: 0.8, al: 0.5, ancho: 7 });
      } });
    } else {
      cabezaHecha(g, "gris", c.x, y, s, ll * (1 - az1));
      cabezaHecha(g, "azul", c.x, y, s, ll * az1);
      // lo que tiene dentro: brilla de oro al pitar (se hablaba) o de azul (las cinco)
      const col = c.azul && t > Tcin ? AZUL : ORO;
      if (pita > 0.02 || az1 > 0.01) {
        g.save(); g.globalCompositeOperation = "lighter";
        k.brillo(g, c.x + CRANEO.x * s, y + CRANEO.y * s, 190, col, 0.9 * pita + 0.25 * az1);
        if (!c.azul || t < Tcin) for (let j = 0; j < 3; j++) { g.fillStyle = `rgba(${ORO},${0.9 * pita})`; g.fillRect(c.x + CRANEO.x * s - 28 + j * 4, y + CRANEO.y * s - 16 + j * 13, 52 - j * 10, 6); }
        g.restore();
      }
      if (c.azul && az1 > 0.01) {
        // su contorno azul se enciende en «cinco»
        g.save(); g.globalCompositeOperation = "lighter";
        k.brillo(g, c.x + 10, y - 10, 330, AZUL, 0.5 * pulso(t, Tcin + 0.55, 0.35) + 0.15 * az1);
        g.restore();
      }
    }
    // su aparato, en «aparato»
    const ap = entra(tr(t, Tapa - 0.25 + (c.i % 6) * 0.03, Tapa + 0.15 + (c.i % 6) * 0.03));
    aparato(g, c.x + 62, y + 70, 0.36 * mez(0.5, 1, ap), c.i === UNO ? Math.max(pita, ...PITAS.map((tp) => pulso(t, tp + 0.08, 0.16))) : pita, ap * ll * (c.i === ENTRA ? 1 - foco : 1));
  }
  g.restore();
  // el fogonazo de foto al apuntar (solo en la que se mira)
  const flash = pulso(t, Tpit2 + 0.12, 0.09);
  if (flash > 0.02) { g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = `rgba(255,250,235,${0.4 * flash})`; g.fillRect(0, 0, 1080, 1920); g.restore(); }
  // las tarjetas: salen de la cabeza (en pantalla: donde está el cráneo) y van a su sitio en la fila
  const vanse = su(tr(t, Ty - 0.05, Ty + 0.5));
  const hx = 540 + (U.x + CRANEO.x * S - cx) * z, hy = 1050 + (U.y + CRANEO.y * S - cy) * z;
  for (let j = 0; j < 4; j++) {
    const tp = PITAS[j] + 0.12, u = entra(tr(t, tp, tp + 0.55));
    if (u <= 0.01) continue;
    const [fx, fy] = fila(j);
    const x = mez(hx, fx, u), y = mez(hy, fy, u) - Math.sin(Math.PI * u) * 160;
    const s = mez(0.25, 0.8, u) * (1 - 0.4 * vanse);
    tarjeta(g, x, y + vanse * 300, s, tf, { ...TARJ[j], al: Math.min(1, u * 3) * (1 - vanse), ang: (1 - u) * 0.4 });
  }
  vineta(g, 0.45);
  velo(g, 0.45);
}
