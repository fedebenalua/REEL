// «Te saluda como a otro gato: con la cola levantada, frotándose contra ti.»
// «Y dos de cada tres gatos te usan de refugio, igual que un bebé con sus padres.»
// A ras de suelo, junto a tus piernas, con una sola cámara. Se entra con un corte en «Te».
// - «Te saluda»: tu gato llega andando hacia tu pierna; «cola»: la levanta recta, con la punta doblada;
//   «frotándose»: pasa pegado a tu pierna con los ojos cerrados y la cabeza ladeada, y la cola se enrosca.
// - «Y dos de cada tres gatos»: la cámara se aleja; a la izquierda hay otros dos gatos, uno gris y uno negro. Entra un
//   robot aspirador; el gris corre a tus piernas y se pega a ellas, como el tuyo; el negro se queda donde está.
//   «refugio»: los dos, agachados contra ti, con una luz cálida.
// - «igual que un bebé»: la cámara va a la derecha: unos padres, y un bebé que llega y se abraza a su pierna en «bebé».
import * as k from "#kit";
import { v } from "#voz";
import { gatoLado } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar, entra } = k;
const f7 = v.frase(7), f8 = v.frase(8);
const T0 = f7.inicio, Tcola = f7.t("cola"), Tfrota = f7.t("frotandose"), Fin7 = f7.fin;
const Ty = f8.inicio, Tdos = f8.t("dos"), Ttres = f8.t("tres"), Tref = f8.t("refugio"), Tigual = f8.t("igual"), Tbebe = f8.t("bebe"), Fin8 = f8.fin;
const PISO = 1450, LINEA = 1250, S = 1.0;

// ---------------------------------------------------------------- el sitio
const azF = azar(9090);
const MOTAS = Array.from({ length: 30 }, () => ({ x: -1800 + azF() * 5000, y: -900 + azF() * 2000, r: 60 + azF() * 160, c: azF() < 0.5 ? "255,200,130" : "255,170,110", f: azF() * 6 }));
function sitio(g, t) {
  const pg = g.createLinearGradient(0, -1200, 0, LINEA); pg.addColorStop(0, "#5a3a28"); pg.addColorStop(1, "#b88a62");
  g.fillStyle = pg; g.fillRect(-2600, -2400, 7000, LINEA + 2400);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const m of MOTAS) { const a = 0.08 + 0.04 * Math.sin(t + m.f), gr = g.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r); gr.addColorStop(0, `rgba(${m.c},${a})`); gr.addColorStop(1, `rgba(${m.c},0)`); g.fillStyle = gr; g.fillRect(m.x - m.r, m.y - m.r, 2 * m.r, 2 * m.r); }
  g.restore();
  g.fillStyle = "#efe4d4"; g.fillRect(-2600, LINEA - 50, 7000, 50); g.fillStyle = "rgba(0,0,0,0.25)"; g.fillRect(-2600, LINEA, 7000, 8);
  const sg = g.createLinearGradient(0, LINEA, 0, 2600); sg.addColorStop(0, "#5e3620"); sg.addColorStop(0.4, "#9a6034"); sg.addColorStop(1, "#c88a50");
  g.fillStyle = sg; g.fillRect(-2600, LINEA, 7000, 3000);
  g.strokeStyle = "rgba(40,20,8,0.4)"; g.lineWidth = 3;
  for (let y = LINEA + 20, d = 22; y < 4200; y += d, d *= 1.25) { g.beginPath(); g.moveTo(-2600, y); g.lineTo(4400, y); g.stroke(); }
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; g.drawImage(k.ruido(512, 91, 2, 4, "lineas"), -2600, LINEA, 7000, 1500); g.restore();
}
// Una pierna con vaquero y zapatilla, de pie en (x, PISO): x es su borde de delante (la punta del pie).
function pierna(g, x, ancho, color = ["#1f3f7a", "#3d6cc0", "#16305e"], zapa = "#f4f4f4", osc = 0) {
  g.save();
  const x0 = x + 40;
  g.beginPath(); g.moveTo(x0 + 10, -2400); g.lineTo(x0 + ancho, -2400); g.lineTo(x0 + ancho - 10, PISO - 70); g.lineTo(x0 + 20, PISO - 70); g.closePath();
  const lg = g.createLinearGradient(x0, 0, x0 + ancho, 0); lg.addColorStop(0, color[2]); lg.addColorStop(0.35, color[1]); lg.addColorStop(1, color[0]);
  g.fillStyle = lg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45; g.drawImage(k.ruido(256, 317, 60, 2, "lineas"), x0, PISO - 1500, ancho, 1500); g.restore();
  // la zapatilla
  g.beginPath(); g.moveTo(x, PISO); g.quadraticCurveTo(x - 10, PISO - 60, x + 60, PISO - 95); g.lineTo(x0 + ancho, PISO - 110); g.lineTo(x0 + ancho + 10, PISO); g.closePath();
  const zg = g.createLinearGradient(0, PISO - 110, 0, PISO); zg.addColorStop(0, zapa); zg.addColorStop(1, "#b8b8b8");
  g.fillStyle = zg; g.fill(); g.fillStyle = "#d24a3a"; g.fillRect(x + 4, PISO - 22, x0 + ancho - x + 2, 22);
  if (osc > 0) { g.fillStyle = `rgba(20,10,5,${osc})`; g.fillRect(x - 20, -2400, ancho + 120, 2400 + PISO + 10); }
  g.restore();
  // su sombra en el suelo
  g.fillStyle = "rgba(30,15,5,0.3)"; g.beginPath(); g.ellipse(x + ancho / 2 + 40, PISO + 8, ancho * 0.9, 18, 0, 0, 6.2832); g.fill();
}
// El robot aspirador, de lado: un disco gris con su luz azul.
function robot(g, x, t) {
  const y = PISO, w = 340, h = 90;
  g.fillStyle = "rgba(20,10,5,0.35)"; g.beginPath(); g.ellipse(x, y + 6, w * 0.55, 16, 0, 0, 6.2832); g.fill();
  k.redondo(g, x - w / 2, y - h, w, h, 40);
  const rg = g.createLinearGradient(0, y - h, 0, y); rg.addColorStop(0, "#5a5f68"); rg.addColorStop(0.3, "#2a2d33"); rg.addColorStop(1, "#14161a");
  g.fillStyle = rg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.fillRect(x - w / 2 + 30, y - h + 10, w - 60, 6);
  g.fillStyle = "#2a8cff"; g.fillRect(x + 40, y - h + 30, 60, 10);
  k.brillo(g, x + 70, y - h + 35, 120, "80,160,255", 0.7 + 0.3 * Math.sin(t * 8));
  // el polvo que levanta
  const az = azar(3); g.fillStyle = "rgba(230,210,180,0.35)";
  for (let i = 0; i < 8; i++) { const f = (t * 1.5 + az()) % 1; g.beginPath(); g.arc(x - w / 2 - f * 120, y - 10 - f * 40 - az() * 20, 6 + f * 14, 0, 6.2832); g.fill(); }
}
// El bebé, de pie y con pañal, que anda hacia la pierna de su madre y se abraza a ella (abraza: de 0 a 1).
function bebe(g, x, t, anda, abraza) {
  const y = PISO, bot = Math.abs(Math.sin(t * 7)) * 10 * anda;
  g.save(); g.translate(x, y - bot);
  g.fillStyle = "rgba(20,10,5,0.3)"; g.beginPath(); g.ellipse(0, bot + 6, 110, 14, 0, 0, 6.2832); g.fill();
  // las piernas
  g.fillStyle = "#f0c0a0";
  const p = Math.sin(t * 7) * 20 * anda;
  k.redondo(g, -50 + p, -150, 46, 150, 22); g.fill(); k.redondo(g, 6 - p, -150, 46, 150, 22); g.fill();
  // el cuerpo (un pijama amarillo)
  k.redondo(g, -80, -360, 160, 240, 70);
  const bg = g.createLinearGradient(-80, 0, 80, 0); bg.addColorStop(0, "#f2c84a"); bg.addColorStop(0.5, "#ffe27a"); bg.addColorStop(1, "#c8962a");
  g.fillStyle = bg; g.fill();
  // los brazos, que se estiran hacia la pierna
  g.strokeStyle = "#ffe27a"; g.lineCap = "round"; g.lineWidth = 46;
  g.beginPath(); g.moveTo(40, -300); g.lineTo(mez(80, 140, abraza), mez(-240, -330, abraza)); g.stroke();
  g.fillStyle = "#f0c0a0"; g.beginPath(); g.arc(mez(95, 160, abraza), mez(-225, -335, abraza), 26, 0, 6.2832); g.fill();
  // la cabeza
  const hg = g.createRadialGradient(-20, -470, 20, 0, -450, 120); hg.addColorStop(0, "#fbd8bc"); hg.addColorStop(1, "#d8a080");
  g.fillStyle = hg; g.beginPath(); g.arc(0, -455, 105, 0, 6.2832); g.fill();
  g.fillStyle = "#7a4a26"; g.beginPath(); g.arc(-10, -520, 70, Math.PI * 1.05, Math.PI * 1.95); g.fill();
  g.fillStyle = "#2a1a10"; g.beginPath(); g.arc(55, -455, 9, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(230,120,110,0.4)"; g.beginPath(); g.arc(50, -415, 20, 0, 6.2832); g.fill();
  g.strokeStyle = "#a04a3a"; g.lineWidth = 5; g.beginPath(); g.arc(75, -410, 16, 0.2, 1.6); g.stroke();
  g.fillStyle = "#e0a888"; g.beginPath(); g.arc(-35, -450, 24, 0, 6.2832); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- lo que pasa
const xGato = k.claves([[T0, 60], [Tcola - 0.25, 300], [Tfrota - 0.1, 310], [Fin7 - 0.2, 520], [Fin8, 520]]);
const Trobot = Tdos - 0.1, Tasusta = Ttres + 0.05;
const xRobot = (t) => mez(-1700, -560, entra(tr(t, Trobot, Tasusta)));
const xGris = (t) => mez(-400, 190, su(tr(t, Tasusta + 0.05, Tref - 0.1)));
// la cámara: zoom Z mirando al punto (cx, cy)
const cam = (() => {
  const Z = k.claves([[T0, 1.3], [Fin7, 1.34], [Ty + 0.05, 1.34], [Tdos + 0.7, 0.56], [Tigual - 0.05, 0.56], [Tbebe + 0.3, 0.68], [Fin8, 0.68]]);
  const X = k.claves([[T0, 520], [Fin7, 640], [Ty + 0.05, 640], [Tdos + 0.7, 0], [Tigual - 0.05, 30], [Tbebe + 0.3, 1620], [Fin8, 1640]]);
  const Y = k.claves([[T0, 1180], [Ty + 0.05, 1180], [Tdos + 0.7, 1060], [Fin8, 1060]]);
  return (t) => [Z(t), X(t), Y(t)];
})();

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  g.save(); g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
  sitio(g, t);
  // los padres, a la derecha (sus piernas, de pie), y el bebé
  pierna(g, 2260, 190, ["#3a3a3a", "#5a5a60", "#242428"], "#e8e0d0", 0.15);
  const ab = su(tr(t, Tbebe - 0.15, Tbebe + 0.3));
  bebe(g, mez(1450, 1880, su(tr(t, Tigual - 0.3, Tbebe - 0.1))), t, 1 - ab, ab);
  pierna(g, 2060, 200, ["#4a4a50", "#6e6e78", "#2c2c32"], "#f0e8d8");
  // tu pierna de atrás
  pierna(g, 1010, 190, ["#17305e", "#2c4f90", "#10234a"], "#e8e8e8", 0.2);
  // el gato negro: se queda donde está, mirando al robot
  gatoLado(g, t, -760, PISO - 320 * S, S, "negro", { anda: 0, levanta: 0.2 });
  // el gris: corre a tus piernas cuando llega el robot
  const corre = tr(t, Tasusta + 0.05, Tref - 0.1), agG = su(tr(t, Tref - 0.2, Tref + 0.2));
  gatoLado(g, t, xGris(t), PISO - 320 * S, S, "gris", { paso: xGris(t) / 260, anda: corre > 0 && corre < 1 ? 1 : 0, levanta: 0.1, agacha: agG * 0.5 });
  // tu gato
  const anda = t < Tcola + 0.1 ? 1 : t > Tfrota - 0.1 && t < Fin7 - 0.2 ? 0.45 : 0;
  const frota = su(tr(t, Tfrota - 0.1, Tfrota + 0.3)) * (1 - su(tr(t, Ty + 0.2, Tdos + 0.4)));
  const agO = su(tr(t, Tasusta + 0.1, Tasusta + 0.5));
  gatoLado(g, t, xGato(t), PISO - 320 * S, S, "naranja", {
    paso: xGato(t) / 230, anda, levanta: mez(0.15, 1, su(tr(t, Tcola - 0.12, Tcola + 0.35))) * (1 - 0.6 * agO),
    enrosca: su(tr(t, Tfrota + 0.5, Fin7)) * (1 - agO), cabeza: -0.22 * frota + 0.05 * Math.sin(t * 3) * frota, ojos: 1 - frota, agacha: agO * 0.5,
  });
  // el robot, más cerca de la cámara
  if (t > Trobot) { g.save(); g.translate(xRobot(t), PISO + 170); g.scale(1.25, 1.25); g.translate(-xRobot(t), -PISO); robot(g, xRobot(t), t); g.restore(); }
  // tu pierna de delante (los gatos, por delante de ella, se frotan contra ella)
  pierna(g, 760, 200);
  // «refugio»: una luz cálida alrededor de los dos que se pegan a ti
  const refu = su(tr(t, Tref - 0.1, Tref + 0.4)) * (1 - su(tr(t, Tigual + 0.2, Tbebe)));
  if (refu > 0.01) k.brillo(g, 420, PISO - 180, 1500, "255,190,110", 0.55 * refu);
  g.restore();
}
