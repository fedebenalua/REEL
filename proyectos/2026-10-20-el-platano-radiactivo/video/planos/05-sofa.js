// «Así que tranquilo con el plátano: en tu sofá, el más radiactivo eres tú. Envíaselo a ese amigo que se come tres
// plátanos al día.»
// Otro sitio: tu salón. Corte en «Así».
// - «Así que tranquilo con el plátano»: de cerca, el plátano en tu mano de cristal; chispea una sola vez.
// - «en tu sofá»: la cámara se aleja: estás sentado en un sofá rojo, y tú chispeas sin parar; en «tú», brillas entero.
// - «Envíaselo...»: en la mesa llegan tres plátanos, uno a uno, en «tres»; al final la cámara se lanza hacia el
//   plátano de tu mano, que queda grande y en diagonal, como al principio del vídeo.
import * as k from "#kit";
import { v } from "#voz";
import { BRAZO_SENTADO, CABEZA_SENTADO, SENTADO, cristal, destello, dentroDe, fondo, platano, roturas, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, entra, claves } = k;
const f9 = v.frase(9), f10 = v.frase(10);
const T0 = f9.inicio, Ten = f9.t("en"), Tsofa = f9.t("sofa"), Ttu = f9.t("tu", 2), Tenv = f10.inicio, Ttres = f10.t("tres"), FIN = v.duracion;

// tú, sentado: los pies en (430, 1360), 0,85 px por unidad
const SX = 400, SY = 1440, ESC = 0.95, YS = SY - 330 * ESC;
const mano = [SX + 195 * ESC, SY - 470 * ESC];
const BAN = { x: mano[0] + 0.5 * 330 * Math.cos(0.9) - 10, y: mano[1] + 0.5 * 330 * Math.sin(0.9) - 20, L: 330, ang: 0.9 };
const PUNTOS = dentroDe([SENTADO, BRAZO_SENTADO], CABEZA_SENTADO, 500, 71);
const CHISPAS = roturas(72, 40, Ten, FIN);

// la cámara: de cerca en el plátano; se aleja en «en tu sofá»; al final se lanza hacia el plátano
const Zfin = 620 / BAN.L;
const lz = claves([[T0, Math.log(2.3)], [Ten - 0.05, Math.log(2.15)], [Tsofa + 0.55, 0], [FIN - 1.25, 0], [FIN - 0.05, Math.log(Zfin)]]);
const lu = claves([[Ten - 0.05, 1], [Tsofa + 0.55, 0], [FIN - 1.25, 0], [FIN - 0.05, 1]]);
const cam = (t) => { const u = lu(t); return { Z: Math.exp(lz(t)), cx: mez(560, BAN.x, u), cy: mez(1060, BAN.y, u) }; };

function sofa(g) {
  const tela = (x0, y0, w, h, r, c1, c2) => {
    k.redondo(g, x0, y0, w, h, r);
    const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fill();
    g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.red2, x0, y0, w, h); g.restore();
    g.strokeStyle = "rgba(255,180,150,0.25)"; g.lineWidth = 3; g.stroke();
  };
  // sombra en el suelo
  g.save(); g.globalAlpha = 0.6; const sg = g.createRadialGradient(560, YS + 260, 50, 560, YS + 260, 600); sg.addColorStop(0, "rgba(0,0,0,0.8)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(-100, YS, 1300, 500); g.restore();
  tela(150, YS - 440, 820, 470, 70, "#d65a3a", "#7a2414");          // el respaldo
  tela(140, YS - 20, 840, 140, 40, "#e2694a", "#8a2a18");           // el asiento
  tela(120, YS + 100, 880, 120, 30, "#9a3420", "#4a140a");          // la base
  tela(60, YS - 200, 150, 410, 60, "#e06848", "#7a2414");           // los brazos
  tela(910, YS - 200, 150, 410, 60, "#e06848", "#7a2414");
  // las patas
  g.fillStyle = "#2a1408"; for (const x of [150, 960]) { k.redondo(g, x, YS + 210, 26, SY - YS - 210, 8); g.fill(); }
}
function mesa(g) {
  k.redondo(g, 700, 1330, 470, 40, 14);
  const mg = g.createLinearGradient(0, 1330, 0, 1370); mg.addColorStop(0, "#c08a50"); mg.addColorStop(1, "#5a3414"); g.fillStyle = mg; g.fill();
  g.fillStyle = "#3a200c"; for (const x of [730, 1130]) { k.redondo(g, x, 1366, 22, SY - 1366 + 30, 6); g.fill(); }
}

export function dibuja(g, t) {
  fondo(g, t, "255,150,90", 1);
  const c = cam(t);
  g.save(); g.setTransform(c.Z, 0, 0, c.Z, 540 - c.cx * c.Z, 960 - c.cy * c.Z);
  // el suelo de madera
  const sg = g.createLinearGradient(0, SY - 10, 0, 2300); sg.addColorStop(0, "#5a3418"); sg.addColorStop(1, "#1a0c04");
  g.fillStyle = sg; g.fillRect(-1500, SY - 10, 4080, 1500);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.red, -1500, SY - 10, 4080, 1200); g.restore();
  sofa(g);
  // tú, de cristal, sentado
  const luz = su(tr(t, Ten, Tsofa + 0.5)) * 0.45 + 0.25 * k.pulso(t, Ttu + 0.1, 0.35);
  g.save(); g.translate(SX, SY); g.scale(ESC, ESC);
  k.brillo(g, 60, -500, 1700, "verde", luz * 0.7);
  cristal(g, [SENTADO], CABEZA_SENTADO, luz);
  for (const r of CHISPAS) { if (r.t > t || t - r.t > 0.7) continue; const p = PUNTOS[Math.floor(r.a * PUNTOS.length)]; destello(g, p.x, p.y, t - r.t, 100, r.dir, 200); }
  g.restore();
  // el plátano en la mano (entre el cuerpo y el brazo) y su única chispa
  platano(g, BAN.x, BAN.y, BAN.L, BAN.ang, { giro: 0.5 + 0.25 * t });
  destello(g, BAN.x - 20, BAN.y + 10, t - (T0 + 0.75), 70, -1.2, 160);
  g.save(); g.translate(SX, SY); g.scale(ESC, ESC); cristal(g, [BRAZO_SENTADO], [0, 0, 0.01, 0.01], luz); g.restore();
  // la mesa y los tres plátanos de tu amigo
  mesa(g);
  for (let i = 0; i < 3; i++) {
    const tl = Ttres - 0.1 + i * 0.16, u = entra(tr(t, tl, tl + 0.3));
    if (u <= 0) continue;
    platano(g, 770 + i * 115, 1300 - (1 - u) * 400, 200, 0.15 - i * 0.12, { giro: 0.4 + i });
  }
  // el final: lo de alrededor se oscurece y queda el plátano solo, como al principio
  const fin = su(tr(t, FIN - 0.9, FIN - 0.1));
  if (fin > 0) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = fin; fondo(g, t); g.restore(); platano(g, BAN.x, BAN.y, BAN.L, BAN.ang, { giro: 0.5 + 0.25 * t }); }
  g.restore();
  vineta(g, 0.5);
  velo(g, 0.55);
}
