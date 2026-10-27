// «Las primeras se pusieron en 1967, delante de una escuela para ciegos, y eran grises.» … hasta el cierre.
// La calle otra vez, con una sola cámara que viaja:
// - desde «Las»: 1967, la imagen sin color, la escuela a la derecha y las baldosas grises como el cemento;
// - «¿Y el amarillo?»: una ola de luz las vuelve amarillas y vuelve el color;
// - «negro»: la imagen se cierra a negro y se abre borrosa (la baja visión); «ocho de cada diez»;
// - «acera gris»: en lo borroso, la franja gris desaparece; «amarillo salta»: vuelve amarilla y salta;
// - «contraste»: se aclara, la cámara sube; el suelo pasa a piedra clara y la franja a gris oscuro;
// - «pisas sin mirar»: unas pisadas cruzan la franja; «le dice a otro»: un bastón blanco sigue las rayas;
// - cierre: la cámara se aleja con la franja encendida hasta el paso.
import * as k from "#kit";
import { v } from "#voz";
import { calle, camino, poli, linea, aCam, mh, AMARILLO, FRANJA, BANDA, pisadas, luz } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;

const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12), f13 = v.frase(13);
const T0 = f8.inicio, T67 = f8.t("1967"), Tgri = f8.t("grises");
const Tama = f9.t("amarillo"), Tcasi = f9.t("casi"), Tneg = f9.t("negro"), Tocho = f9.t("ocho"), Tvis = f9.t("vista");
const Tace = f10.t("acera"), Tama2 = f10.t("amarillo"), Tsal = f10.t("salta");
const Tesp = f11.inicio, Tex2 = f11.t("exige", 2), Tsue = f11.t("suelo");
const T12 = f12.inicio, Tpis = f12.t("pisas"), Tdice = f12.t("dice"), Tir = f12.t("ir");
const T13 = f13.inicio, Fin = v.duracion;

const GRIS = "#aaa49c", SUELO = "#9c938e", CLARO = "#ece2cf", OSCURO = "#3b3842";

const cam = camino([
  [T0, [-1.4, 1.3, 16.5], [2.4, 1.6, 23.5]],
  [Tgri - 0.4, [-0.7, 1.5, 21.4], [0.8, 0.5, 28.6]],
  [Tama + 0.6, [1.0, 1.6, 22.8], [0, 0.14, 28.6]],
  [Tocho - 0.2, [1.0, 1.6, 22.8], [0, 0.14, 28.6]],
  [Tvis + 0.6, [0.7, 1.45, 24.6], [0, 0.14, 29.4]],
  [Tesp + 0.3, [0.8, 1.6, 24.0], [0, 0.14, 29.2]],
  [Tex2 - 0.3, [0.3, 7.5, 22.8], [0, 0.14, 25.6]],
  [T12 + 0.2, [0.3, 7.6, 23.0], [0, 0.14, 25.7]],
  [Tpis + 0.4, [0.9, 1.75, 19.4], [0, 0.25, 24.8]],
  [Tir + 0.2, [0.8, 1.8, 20.6], [0, 0.25, 26.4]],
  [Fin - 0.6, [-1.2, 15, 8], [0, 0.0, 27]],
]);

const escena = k.lienzo(1080, 1920);
// las pisadas de alguien que cruza la franja sin mirarla
const CRUZA = Array.from({ length: 9 }, (_, i) => ({ x: -2.4 + i * 0.6, z: 23.2 + (i % 2 ? 0.12 : -0.12) + i * 0.08, t: Tpis - 0.45 + i * 0.2, izq: i % 2 === 0, ang: Math.PI / 2 - 0.12 }));

// alguien con baja visión que sigue la franja, en lo borroso
const SIGUE = Array.from({ length: 11 }, (_, i) => ({ x: i % 2 ? 0.13 : -0.13, z: 24.6 + i * 0.36, t: Tocho - 0.3 + i * 0.32, izq: i % 2 === 0, ang: 0 }));

// la punta del bastón: barre de lado a lado y avanza por las rayas
const Tbas = Tdice - 0.35;
const punta = (t) => {
  const u = k.tramo(t, Tbas, Fin - 0.3);
  return [0.24 * Math.sin((t - Tbas) * 5.2), 0.15 + 0.03 * Math.abs(Math.cos((t - Tbas) * 5.2)), k.mez(22.4, 28.0, u)];
};

function bastón(g, c, t, al) {
  if (al <= 0.01) return;
  const P = punta(t), entra = k.entra(k.tramo(t, Tbas, Tbas + 0.5));
  const H = [P[0] + 0.25, 1.05 + (1 - entra) * 1.5, P[2] - 0.75];
  const A = [P[0], P[1] + (1 - entra) * 1.5, P[2]];
  const za = aCam(c, A)[2], zh = aCam(c, H)[2];
  if (za < 0.3) return;
  g.save(); g.globalAlpha = al; g.lineCap = "round";
  const w = Math.max(4, k.tamano(0.02, za));
  if (linea(g, c, A, H)) { g.strokeStyle = "rgba(0,0,0,0.35)"; g.lineWidth = w * 1.8; g.stroke(); g.strokeStyle = "#f6f6f8"; g.lineWidth = w; g.stroke(); }
  const R0 = k.mezV(A, H, 0.1), R1 = k.mezV(A, H, 0.3);
  if (linea(g, c, R0, R1)) { g.strokeStyle = "#e0242c"; g.lineWidth = w * 1.05; g.stroke(); }
  // el toque en el suelo
  const T = k.proyecta(c, A);
  if (T) k.brillo(g, T.x, T.y, k.tamano(0.5, T.z), "255,255,255", 0.6 * Math.abs(Math.cos((t - Tbas) * 5.2)) * entra);
  g.restore();
}

// la franja que se enciende desde zA hasta zB
function enciende(g, c, zA, zB, color, al) {
  if (al <= 0.01) return;
  g.save();
  if (poli(g, c, [[FRANJA.x0, 0.146, zA], [FRANJA.x1, 0.146, zA], [FRANJA.x1, 0.146, zB], [FRANJA.x0, 0.146, zB]])) { g.fillStyle = `rgba(${color},${al})`; g.fill(); }
  g.restore();
}

function escuela(g, c) {
  if (poli(g, c, [[3.17, 0, 13], [3.17, 0, 29.75], [3.17, 9, 29.75], [3.17, 9, 13]])) { g.fillStyle = "#d8c8a8"; g.fill(); }
  if (poli(g, c, [[3.16, 8.4, 13], [3.16, 8.4, 29.75], [3.16, 9.2, 29.75], [3.16, 9.2, 13]])) { g.fillStyle = "#3e6a50"; g.fill(); }
  for (let z = 14; z < 29; z += 2.6) for (const y of [1.2, 4.6]) {
    if (poli(g, c, [[3.15, y, z], [3.15, y, z + 1.8], [3.15, y + 2.2, z + 1.8], [3.15, y + 2.2, z]])) { g.fillStyle = "#ffd89a"; g.fill(); g.strokeStyle = "#5a4a3a"; g.lineWidth = 2; g.stroke(); }
  }
  const R = k.proyecta(c, [3.15, 7.3, 21.4]);
  if (R && R.z > 0.5) { const r = k.tamano(0.55, R.z); g.fillStyle = "#fbf6ea"; g.beginPath(); g.arc(R.x, R.y, r, 0, 6.2832); g.fill(); g.strokeStyle = "#3a3a3a"; g.lineWidth = Math.max(1, r * 0.08); g.stroke(); g.beginPath(); g.moveTo(R.x, R.y); g.lineTo(R.x, R.y - r * 0.7); g.moveTo(R.x, R.y); g.lineTo(R.x + r * 0.5, R.y + r * 0.1); g.stroke(); }
}

export function dibuja(g, t) {
  const c = cam(t);
  // el color de la franja
  const amar = k.suave(k.tramo(t, Tama - 0.1, Tama + 0.5));
  const gris2 = k.suave(k.tramo(t, Tace - 0.1, Tace + 0.35)) * (1 - k.suave(k.tramo(t, Tama2 - 0.1, Tama2 + 0.2)));
  const contraste = k.suave(k.tramo(t, Tex2 - 0.15, Tex2 + 0.5)) * (1 - k.suave(k.tramo(t, T12 - 0.1, T12 + 0.5)));
  let tinte = amar < 1 ? mh(GRIS, AMARILLO, Math.round(amar * 8) / 8) : null;
  if (gris2 > 0.001) tinte = mh(AMARILLO, SUELO, Math.round(gris2 * 8) / 8);
  if (contraste > 0.001) tinte = mh(AMARILLO, OSCURO, Math.round(contraste * 8) / 8);
  if (tinte === "#ffc81e") tinte = null;
  const suelo = mh(SUELO, CLARO, contraste);

  const e = escena.getContext("2d"); e.setTransform(1, 0, 0, 1, 0, 0); e.globalAlpha = 1; e.filter = "none"; e.globalCompositeOperation = "source-over";
  calle(e, t, c, { tinte, suelo });
  escuela(e, c);
  // «amarillo»: la ola de luz que recorre la franja
  const ola = k.tramo(t, Tama - 0.1, Tama + 0.6);
  if (ola > 0 && ola < 1) { const z = k.mez(18, 29.6, ola); enciende(e, c, Math.max(18, z - 1.2), z, "255,240,170", 0.6 * Math.sin(ola * Math.PI)); }
  // «salta»: brilla
  enciende(e, c, 14, FRANJA.z1, "255,230,120", 0.45 * k.pulso(t, Tsal + 0.05, 0.3));
  // «pisas sin mirar»: alguien la cruza
  pisadas(e, c, t, CRUZA, "255,255,255", 1.8, 0.85);
  pisadas(e, c, t, SIGUE, "40,200,255", 2.0, 1 - k.tramo(t, Tace - 0.4, Tace));
  // «le dice a otro por dónde ir»: el bastón sigue las rayas, que se encienden delante
  const bas = k.tramo(t, Tbas, Tbas + 0.3);
  if (bas > 0) {
    const zp = punta(t)[2];
    enciende(e, c, zp, FRANJA.z1, "60,230,120", 0.5 * bas);
    const fin = k.suave(k.tramo(t, T13 + 0.5, Fin - 1));
    if (fin > 0) { g.save(); e.save(); if (poli(e, c, [[BANDA.x0, 0.146, BANDA.z0], [BANDA.x1, 0.146, BANDA.z0], [BANDA.x1, 0.146, BANDA.z1], [BANDA.x0, 0.146, BANDA.z1]])) { e.fillStyle = `rgba(235,40,30,${0.6 * fin})`; e.fill(); } e.restore(); g.restore(); }
    bastón(e, c, t, 1);
  }
  // 1967: sin color, en sepia, hasta que llega el amarillo
  const viejo = 1 - amar;
  if (viejo > 0.01) {
    e.save();
    e.globalCompositeOperation = "saturation"; e.fillStyle = `rgba(128,128,128,${0.85 * viejo})`; e.fillRect(0, 0, 1080, 1920);
    e.globalCompositeOperation = "multiply"; e.fillStyle = `rgba(255,228,190,${0.7 * viejo})`; e.fillRect(0, 0, 1080, 1920);
    e.restore();
  }

  // la baja visión: se cierra a negro en «negro» y se abre borroso hasta «España»
  const cierra = k.suave(k.tramo(t, Tcasi - 0.1, Tneg + 0.15)) * (1 - k.suave(k.tramo(t, Tneg + 0.3, Tocho - 0.05)));
  const borroso = k.suave(k.tramo(t, Tneg + 0.25, Tocho)) * (1 - k.suave(k.tramo(t, Tesp, Tesp + 0.6)));
  if (borroso > 0.01) { g.save(); g.filter = `blur(${(borroso * 22).toFixed(1)}px)`; g.drawImage(escena, 0, 0); g.restore(); g.fillStyle = `rgba(150,140,140,${0.18 * borroso})`; g.fillRect(0, 0, 1080, 1920); }
  else g.drawImage(escena, 0, 0);
  if (cierra > 0.01) {
    const R = k.mez(1500, 60, cierra);
    const vg = g.createRadialGradient(540, 1000, R * 0.3, 540, 1000, R); vg.addColorStop(0, `rgba(0,0,0,${cierra > 0.9 ? (cierra - 0.9) * 10 : 0})`); vg.addColorStop(1, `rgba(0,0,0,${Math.min(1, cierra * 1.3)})`);
    g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
  }

  // los rótulos
  const r1 = k.suave(k.tramo(t, T67 - 0.1, T67 + 0.3)) * (1 - k.suave(k.tramo(t, Tama - 0.3, Tama + 0.1)));
  k.pastilla(g, 540, 1380, "Okayama, 1967", "", "255,225,180", r1, 86);
  const r2 = k.suave(k.tramo(t, Tocho - 0.1, Tocho + 0.3)) * (1 - k.suave(k.tramo(t, Tvis + 0.6, Tace - 0.1)));
  k.pastilla(g, 540, 1380, "8 de cada 10", "", "255,226,120", r2, 100);
  const vg = g.createLinearGradient(0, 200, 0, 680); vg.addColorStop(0, "rgba(12,8,30,0.6)"); vg.addColorStop(1, "rgba(12,8,30,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 680);
}
