// «Y en 2012, una nube igual de fuerte cruzó la órbita de la Tierra: nueve días antes, nos habría dado.»
// Otro sitio: el sistema solar visto desde arriba. El Sol en medio, con una mancha en su borde (la zona que echa la
// nube); la órbita de la Tierra, la Tierra abajo a la izquierda y la sonda STEREO-A en la misma órbita, abajo a la
// derecha (en 2012 iba unos 120° por delante). Corte en «Y».
// - «2012»: el año en su pastilla.
// - «una nube igual de fuerte»: la mancha revienta y la nube sale hacia la sonda; en «órbita» cruza la órbita y le da.
// - «nueve días antes»: el Sol gira hacia atrás (en nueve días gira algo más de un tercio de vuelta) y la mancha queda
//   mirando a la Tierra; la Tierra también vuelve un poco atrás por su órbita.
// - «nos habría dado»: la misma nube sale otra vez, ahora hacia la Tierra, y la alcanza en «dado».
import * as k from "#kit";
import { v } from "#voz";
import { llamarada, nube, solDeCerca, tierraNoche } from "../mundo.js";

const f6 = v.frase(6);
export const desde = f6.inicio;

const { suave, tramo } = k;
const T0 = f6.inicio, Tano = f6.t("2012"), Tnube = f6.t("nube"), Torb = f6.t("orbita"), Tnue = f6.t("nueve"), Tant = f6.t("antes"), Tdad = f6.t("dado"), Tfin = f6.fin;

const SX = 540, SY = 980, SR = 92, ORB = 390;
const A_TIERRA = 2.62, A_SONDA = A_TIERRA - 2.1, ATRAS = (9 / 365) * 2 * Math.PI;
const T_GIRO = Tnue - 0.05, T_GIRO_FIN = Tant + 0.1, T_SALE2 = T_GIRO_FIN + 0.05;
const alcance = (u0, u1) => (t) => k.claves([[u0, SR * 0.8], [u1, ORB], [u1 + 1.4, ORB * 2.2]])(t);
const R1 = alcance(Tnube, Torb), R2 = alcance(T_SALE2, Tdad);

const az = k.azar(61);
const estrellas = Array.from({ length: 1400 }, () => ({ p: [(az() - 0.5) * 300, (az() - 0.5) * 500, -200 - az() * 300], c: ["roja", "naranja", "amarilla", "blanca", "azul"][Math.floor(az() * 5)], b: 0.3 + Math.pow(az(), 3) * 2, r: 0.1 + az() * 0.2 }));
const CAM = k.mira([0, 0, 60], [0, 0, -100]);

function sonda(g, x, y, s, golpe) {
  g.save();
  g.translate(x, y); g.rotate(A_SONDA + Math.PI / 2);
  g.fillStyle = "#2a4a8a"; g.fillRect(-s * 2.6, -s * 0.35, s * 1.9, s * 0.7); g.fillRect(s * 0.7, -s * 0.35, s * 1.9, s * 0.7);
  g.strokeStyle = "rgba(150,190,255,0.6)"; g.lineWidth = 1.5;
  for (const x0 of [-s * 2.6, s * 0.7]) for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x0 + (i * s * 1.9) / 4, -s * 0.35); g.lineTo(x0 + (i * s * 1.9) / 4, s * 0.35); g.stroke(); }
  const og = g.createLinearGradient(-s * 0.7, 0, s * 0.7, 0); og.addColorStop(0, "#a07820"); og.addColorStop(0.5, "#ffd870"); og.addColorStop(1, "#8a6418");
  g.fillStyle = og; g.fillRect(-s * 0.7, -s * 0.7, s * 1.4, s * 1.4);
  g.restore();
  if (golpe > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, x, y, s * 9, "255,190,110", golpe); g.restore(); }
}

export function dibuja(g, t) {
  k.fondo(g, CAM);
  k.estrellas(g, CAM, null, estrellas);
  const zoom = k.mez(1.35, 1, suave(tramo(t, T0, Tnube + 0.6))) * k.mez(1, 1.05, tramo(t, Tnube + 0.6, Tfin));
  g.save();
  g.translate(SX, SY); g.scale(zoom, zoom); g.translate(-SX, -SY);
  // la órbita
  g.save();
  g.setLineDash([14, 14]); g.lineDashOffset = -t * 20;
  g.strokeStyle = "rgba(150,190,255,0.35)"; g.lineWidth = 3;
  g.beginPath(); g.arc(SX, SY, ORB, 0, Math.PI * 2); g.stroke();
  g.restore();
  // la primera nube: hacia la sonda
  const al1 = suave(tramo(t, Tnube - 0.1, Tnube + 0.3)) * (1 - suave(tramo(t, Torb + 0.4, Tnue + 0.2)));
  nube(g, SX, SY, R1(t), 0.85 * al1, t, 0.42, A_SONDA);
  // la segunda: la que nos habría dado
  const al2 = suave(tramo(t, T_SALE2 - 0.05, T_SALE2 + 0.3));
  nube(g, SX, SY, R2(t), 0.85 * al2, t, 0.42, A_TIERRA + ATRAS);
  // el Sol, con su mancha que gira hacia atrás
  solDeCerca(g, SX, SY, SR, t, 0.3 * k.pulso(t, Tnube, 0.4) + 0.3 * k.pulso(t, T_SALE2, 0.4));
  const giro = suave(tramo(t, T_GIRO, T_GIRO_FIN));
  const aM = k.mez(A_SONDA, A_TIERRA + ATRAS, giro), mx = SX + Math.cos(aM) * SR * 0.72, my = SY + Math.sin(aM) * SR * 0.72;
  k.brillo(g, mx, my, SR * 0.5, "120,40,0", 0.55);
  g.fillStyle = "rgba(90,30,5,0.75)"; g.beginPath(); g.ellipse(mx, my, SR * 0.14, SR * 0.1, aM, 0, Math.PI * 2); g.fill();
  g.save(); g.globalCompositeOperation = "lighter";
  llamarada(g, mx, my, t - Tnube + 0.1, SR * 1.4);
  llamarada(g, mx, my, t - T_SALE2 + 0.1, SR * 1.4);
  g.restore();
  // la sonda
  const golpe1 = k.pulso(t, Torb, 0.5);
  sonda(g, SX + Math.cos(A_SONDA) * ORB, SY + Math.sin(A_SONDA) * ORB, 22, golpe1);
  // la Tierra, que vuelve atrás por su órbita
  const aT = A_TIERRA + ATRAS * suave(tramo(t, T_GIRO, T_GIRO_FIN));
  const ex = SX + Math.cos(aT) * ORB, ey = SY + Math.sin(aT) * ORB;
  const golpe2 = suave(tramo(t, Tdad - 0.1, Tdad + 0.2));
  tierraNoche(g, ex, ey, 46, 1.2 + t * 0.15, { inc: 0.9, sol: [-Math.cos(aT), Math.sin(aT), 0.3], aurora: golpe2, auroraT: t });
  if (golpe2 > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, ex, ey, 260, "255,170,90", 0.6 * k.pulso(t, Tdad, 0.6)); g.restore(); }
  // los nombres
  const alN = suave(tramo(t, T0 + 0.2, T0 + 0.6));
  k.etiqueta(g, ex, ey + 92, "Tierra", "190,220,255", alN, 40);
  k.etiqueta(g, SX + Math.cos(A_SONDA) * ORB, SY + Math.sin(A_SONDA) * ORB + 80, "sonda", "255,220,150", alN, 40);
  g.restore();
  // el año y los nueve días
  const alA = suave(tramo(t, Tano - 0.05, Tano + 0.2)) * (1 - suave(tramo(t, Tnue - 0.2, Tnue)));
  k.pastilla(g, 540, 600, "2012", "", "255,236,190", alA, 120);
  const alD = suave(tramo(t, Tnue, Tnue + 0.2));
  const dias = Math.round(9 * giro);
  k.pastilla(g, 540, 600, `−${dias}`, "días", "255,220,160", alD, 110);
  const vg = g.createLinearGradient(0, 200, 0, 620); vg.addColorStop(0, "rgba(3,5,10,0.4)"); vg.addColorStop(1, "rgba(3,5,10,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 620);
}
