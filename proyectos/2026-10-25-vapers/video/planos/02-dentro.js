// «es un líquido frito en una resistencia de metal.» + «Al calentarse, esa resistencia suelta níquel, cromo y plomo,
// y te los tragas en cada calada.» + «También sale formaldehído:»
// Dentro del váper: el tubo por dentro, a lo alto de la pantalla. Abajo la pila, en medio el depósito con el líquido
// rosa y la resistencia en espiral metida en el algodón, y arriba la chimenea que sube hasta la boquilla.
// - «es un líquido»: corte aquí; el líquido ondea con una luz.
// - «frito»: la cámara se acerca y la espiral se pone al rojo; el líquido burbujea y chisporrotea.
// - «metal»: la espiral brilla blanca.
// - «suelta»: saltan virutas de metal; «níquel», «cromo», «plomo»: tres grandes llegan a su sitio con su nombre.
// - «tragas»: todas suben por la chimenea con la nube rosa; la cámara sube con ellas; «cada calada»: la calada las
//   chupa hacia la boquilla.
// - «También sale formaldehído»: gotas verdes suben por la chimenea con su nombre. Corte en «lo».
import * as k from "#kit";
import { v } from "#voz";
import { fondo, nube, viruta, velo, ROSA, LILA, VERDE_F, NARANJA } from "../mundo.js";

export const desde = (vz) => vz.frase(2).t("es", 2);

const { suave: su, tramo: tr, mez, azar } = k;
const f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4);
const T0 = f2.t("es", 2), Tliq = f2.t("líquido"), Tfri = f2.t("frito"), Tmet = f2.t("metal");
const Tsuel = f3.t("suelta"), Tniq = f3.t("níquel"), Tcro = f3.t("cromo"), Tplo = f3.t("plomo"), Ttra = f3.t("tragas"), Tcada = f3.t("cada"), Tcal = f3.t("calada");
const Ttam = f4.inicio, Tform = f4.t("formaldehído"), Tlo = f4.t("lo");
export const momentos = { frito: Tfri, suelta: Tsuel, tragas: Ttra, formaldehido: Tform };

// ---------------------------------------------------------------- el tubo, en coordenadas del mundo (sin cámara)
const XI = 150, XD = 930;                 // paredes del tubo
const YTANQUE0 = 980, YTANQUE1 = 1560;    // el depósito
const YBOB = 1400, WBOB = 400, RBOB = 48; // la espiral
const CH0 = 450, CH1 = 630;               // la chimenea
const YBOCA = -520;                       // la boquilla
const az = azar(33);
const BURBUJAS = Array.from({ length: 50 }, () => ({ x: (az() - 0.5) * WBOB, f: az(), vel: 0.6 + az() * 0.8, r: 5 + az() * 10, w: az() * 6.28 }));
const CHISPAS = Array.from({ length: 40 }, () => ({ a: -Math.PI / 2 + (az() - 0.5) * 2.4, vel: 300 + az() * 500, f: az(), dur: 0.35 + az() * 0.3 }));
const VIRUTAS = Array.from({ length: 36 }, (_, i) => ({ t0: Tsuel + i * 0.035, dx: (az() - 0.5) * 520, vel: 160 + az() * 160, tam: 10 + az() * 14, giro: (az() - 0.5) * 4, f: az() * 6.28, alto: 350 + az() * 300 }));
const NOMBRES = [
  { T: Tniq, x: 250, texto: "níquel", tono: ["#7f8e86", "#e8f3ee", "#4e5e56"], color: "200,235,220" },
  { T: Tcro, x: 540, texto: "cromo", tono: ["#8a95a8", "#f6f8ff", "#5b6475"], color: "220,230,255" },
  { T: Tplo, x: 830, texto: "plomo", tono: ["#4e5058", "#a9abb3", "#2a2b30"], color: "190,190,200" },
];
const GOTAS = Array.from({ length: 14 }, (_, i) => ({ t0: Ttam - 0.1 + i * 0.09, dx: (az() - 0.5) * 120, vel: 520 + az() * 200, r: 16 + az() * 12, f: az() * 6.28 }));

// la cámara: dónde mira (y del mundo) y cuánto se acerca
const camY = k.claves([[T0, 1230], [Tfri + 0.3, 1330], [Tsuel, 1250], [Ttra - 0.2, 1250], [Tcal + 0.4, 340], [Tform, 300], [Tlo + 0.5, 300]]);
const camZ = k.claves([[T0, 1.0], [Tfri - 0.25, 1.0], [Tfri + 0.3, 1.5], [Tsuel - 0.4, 1.5], [Tsuel + 0.3, 1.0], [Tlo + 0.5, 1.0]]);

function tubo(g, t, rojo) {
  // la pared del tubo: dos franjas con brillo, y entre ellas el interior oscuro
  const inter = g.createLinearGradient(XI, 0, XD, 0); inter.addColorStop(0, "#1c1422"); inter.addColorStop(0.5, "#2a1f33"); inter.addColorStop(1, "#1c1422");
  g.fillStyle = inter; g.fillRect(XI, -900, XD - XI, 3600);
  for (const [x0, x1] of [[XI - 70, XI], [XD, XD + 70]]) {
    const pg = g.createLinearGradient(x0, 0, x1, 0);
    pg.addColorStop(0, "#5a3fb0"); pg.addColorStop(0.5, "#ff7ac2"); pg.addColorStop(1, "#5a3fb0");
    g.fillStyle = pg; g.fillRect(x0, -900, x1 - x0, 3600);
  }
  // la pila, abajo
  const pg = g.createLinearGradient(XI, 0, XD, 0); pg.addColorStop(0, "#15121a"); pg.addColorStop(0.4, "#3a3444"); pg.addColorStop(1, "#15121a");
  g.fillStyle = pg; g.fillRect(XI, YTANQUE1 + 60, XD - XI, 1500);
  g.fillStyle = "rgba(255,255,255,0.08)"; g.font = "800 90px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("+", 540, YTANQUE1 + 260);
  // la chimenea: un canal que sube hasta la boquilla
  const cg = g.createLinearGradient(CH0, 0, CH1, 0); cg.addColorStop(0, "#0a070d"); cg.addColorStop(0.5, "#17111c"); cg.addColorStop(1, "#0a070d");
  g.fillStyle = cg; g.fillRect(CH0, YBOCA, CH1 - CH0, YTANQUE0 - YBOCA + 40);
  g.strokeStyle = "rgba(255,255,255,0.14)"; g.lineWidth = 6; g.strokeRect(CH0, YBOCA, CH1 - CH0, YTANQUE0 - YBOCA + 40);
  // la boquilla arriba, negra, con el agujero
  const bg = g.createLinearGradient(XI, 0, XD, 0); bg.addColorStop(0, "#0c0a10"); bg.addColorStop(0.45, "#3a3542"); bg.addColorStop(1, "#0c0a10");
  g.fillStyle = bg; g.fillRect(XI - 70, YBOCA - 260, XD - XI + 140, 260);
  g.fillStyle = "#000"; k.redondo(g, CH0, YBOCA - 260, CH1 - CH0, 260, 30); g.fill();
  // el depósito: cristal con el líquido rosa dentro
  g.save(); k.redondo(g, XI + 20, YTANQUE0, XD - XI - 40, YTANQUE1 - YTANQUE0, 40); g.clip();
  g.fillStyle = "#2a1a30"; g.fillRect(XI, YTANQUE0, XD - XI, YTANQUE1 - YTANQUE0);
  const nivel = YTANQUE0 + 90;
  const lg = g.createLinearGradient(0, nivel, 0, YTANQUE1); lg.addColorStop(0, "rgba(255,120,200,0.75)"); lg.addColorStop(1, "rgba(200,60,150,0.9)");
  g.fillStyle = lg; g.beginPath(); g.moveTo(XI, YTANQUE1); g.lineTo(XI, nivel);
  for (let x = XI; x <= XD; x += 20) g.lineTo(x, nivel + Math.sin(x * 0.02 + t * 2.2) * 8 + Math.sin(x * 0.05 - t * 3.1) * 4 * (0.3 + rojo));
  g.lineTo(XD, YTANQUE1); g.closePath(); g.fill();
  // una luz que recorre el líquido en «es un líquido»
  const luz = su(tr(t, T0, Tliq + 0.5));
  if (luz > 0 && luz < 1) { const xl = mez(XI - 200, XD + 200, luz); const lg2 = g.createLinearGradient(xl - 180, 0, xl + 180, 0); lg2.addColorStop(0, "rgba(255,255,255,0)"); lg2.addColorStop(0.5, "rgba(255,255,255,0.35)"); lg2.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = lg2; g.fillRect(XI, nivel - 20, XD - XI, YTANQUE1 - nivel + 20); }
  // la chimenea pasa por el depósito
  g.fillStyle = "#17111c"; g.fillRect(CH0, YTANQUE0, CH1 - CH0, YBOB - RBOB - 30 - YTANQUE0);
  g.strokeStyle = "rgba(255,255,255,0.14)"; g.lineWidth = 6; g.strokeRect(CH0, YTANQUE0 - 10, CH1 - CH0, YBOB - RBOB - 20 - YTANQUE0);
  g.restore();
  // el brillo del cristal
  g.save(); g.globalCompositeOperation = "screen"; const rg = g.createLinearGradient(XI, 0, XD, 0); rg.addColorStop(0.05, "rgba(255,255,255,0)"); rg.addColorStop(0.12, "rgba(255,255,255,0.3)"); rg.addColorStop(0.2, "rgba(255,255,255,0)"); g.fillStyle = rg; g.fillRect(XI, YTANQUE0, XD - XI, YTANQUE1 - YTANQUE0); g.restore();
  g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 5; k.redondo(g, XI + 20, YTANQUE0, XD - XI - 40, YTANQUE1 - YTANQUE0, 40); g.stroke();
}

function espiral(g, t, rojo, blanco) {
  // el algodón que empapa la espiral
  g.save(); g.shadowColor = "rgba(255,255,255,0.4)"; g.shadowBlur = 20;
  g.fillStyle = `rgb(${k.mezRgb("240,236,230", "120,70,40", rojo * 0.6)})`; k.redondo(g, 540 - WBOB / 2 - 40, YBOB - RBOB * 0.8, WBOB + 80, RBOB * 1.6, RBOB * 0.8); g.fill(); g.restore();
  // la espiral: vueltas de alambre, de gris a rojo y a blanco
  const N = 9;
  const col = (b) => k.mezColor(k.mezColor(b ? "#aeb4bf" : "#5d636d", b ? "#ff7a3a" : "#e03a12", Math.min(1, rojo)), "#fff2d0", blanco);
  g.save(); g.shadowColor = `rgba(255,110,30,${rojo})`; g.shadowBlur = 40 * rojo; g.lineWidth = 11; g.lineCap = "round";
  for (let i = 0; i <= N; i++) {
    const x = 540 - WBOB / 2 + (i / N) * WBOB;
    g.strokeStyle = col(false); g.beginPath(); g.ellipse(x, YBOB, RBOB * 0.42, RBOB, 0.25, Math.PI, 2 * Math.PI); g.stroke();
    g.strokeStyle = col(true); g.beginPath(); g.ellipse(x + 10, YBOB, RBOB * 0.42, RBOB, 0.25, 0, Math.PI); g.stroke();
  }
  // las patas
  g.strokeStyle = col(false); g.lineWidth = 12; g.beginPath(); g.moveTo(540 - WBOB / 2, YBOB); g.lineTo(540 - WBOB / 2 - 70, YBOB + 90); g.moveTo(540 + WBOB / 2 + 10, YBOB); g.lineTo(540 + WBOB / 2 + 80, YBOB + 90); g.stroke();
  g.restore();
  k.brillo(g, 540, YBOB, 700, "255,120,40", 0.9 * rojo);
}

export function dibuja(g, t) {
  fondo(g, t, "#120a1e");
  const rojo = su(tr(t, Tfri - 0.15, Tfri + 0.35)) * (1 - 0.35 * su(tr(t, Ttra, Tcal)));
  const blanco = 0.8 * k.pulso(t, Tmet + 0.05, 0.18);
  const frie = su(tr(t, Tfri - 0.1, Tfri + 0.3));
  const chupa = su(tr(t, Tcada - 0.1, Tcal + 0.5));
  const rotulos = [];
  g.save(); g.translate(540, 960); const z = camZ(t); g.scale(z, z); g.translate(-540, -camY(t));
  tubo(g, t, rojo);
  // la nube rosa que sube por la chimenea en «tragas»
  const u = tr(t, Ttra - 0.3, Tcal + 0.6);
  g.save(); g.beginPath(); g.rect(CH0, YBOCA - 300, CH1 - CH0, YBOB - YBOCA + 300); g.clip();
  nube(g, t, 540, YBOB - 80, -Math.PI / 2, u, { n: 90, semilla: 41, esc: 0.8, alcance: 2600, al: 2.6, colores: [ROSA, LILA, ROSA] });
  g.restore();
  // las burbujas y las chispas al freír
  if (frie > 0) {
    g.save(); k.redondo(g, XI + 20, YTANQUE0, XD - XI - 40, YTANQUE1 - YTANQUE0, 40); g.clip();
    for (const b of BURBUJAS) {
      const p = ((t - Tfri) * b.vel * 0.9 + b.f) % 1;
      if (p < 0) continue;
      const y = YBOB - 20 - p * (YBOB - YTANQUE0 - 110), x = 540 + b.x + Math.sin(p * 9 + b.w) * 14;
      g.fillStyle = `rgba(255,220,240,${0.75 * frie * (1 - p * 0.6)})`; g.beginPath(); g.arc(x, y, b.r * (0.6 + p * 0.6), 0, 6.2832); g.fill();
      g.fillStyle = `rgba(255,255,255,${0.9 * frie})`; g.beginPath(); g.arc(x - b.r * 0.3, y - b.r * 0.3, b.r * 0.25, 0, 6.2832); g.fill();
    }
    g.restore();
    g.save(); g.globalCompositeOperation = "lighter";
    for (const c of CHISPAS) {
      const p = (((t - Tfri) / c.dur) + c.f) % 1;
      const d = p * c.vel * c.dur, x = 540 + Math.cos(c.a) * d * 1.4, y = YBOB - 30 + Math.sin(c.a) * d + 400 * p * p * 0.5;
      g.fillStyle = `rgba(255,${Math.round(200 - 150 * p)},60,${frie * (1 - p)})`; g.beginPath(); g.arc(x, y, 5 + 4 * (1 - p), 0, 6.2832); g.fill();
    }
    g.restore();
  }
  // las virutas que saltan en «suelta»; suben por la chimenea en «tragas» y la calada las chupa
  for (const w of VIRUTAS) {
    const u1 = tr(t, w.t0, w.t0 + 0.7);
    if (u1 <= 0) continue;
    const e = su(u1);
    let x = 540 + w.dx * e;
    // tras saltar, flotan; en «tragas» suben en chorro por la chimenea, sin parar, y la calada las acelera
    const sube = Math.max(0, t - Ttra) * (w.vel * 2.2 + chupa * 1200);
    let y = YBOB - 20 - ((w.alto * e + sube) % 2300) + Math.sin(t * 1.5 + w.f) * 10 * (1 - chupa);
    const estrecha = y < YTANQUE0 ? Math.max(0.12, (y - 300) / 700) : 1;
    x = 540 + (x - 540) * estrecha;
    if (y < YBOCA - 260) continue;
    viruta(g, x, y, w.tam * mez(1, 0.7, chupa), w.giro * t + w.f, 1);
  }
  // las tres con nombre: níquel, cromo y plomo
  NOMBRES.forEach((n, i) => {
    const llega = su(tr(t, n.T - 0.35, n.T));
    if (llega <= 0) return;
    let y = mez(YBOB - 20, 880, llega) - 160 * Math.sin(llega * Math.PI), x = mez(540, n.x, llega);
    const sube = Math.max(0, t - Ttra - i * 0.08) * 420 + chupa * 1700;
    y -= sube;
    const estrecha = y < YTANQUE0 ? Math.max(0.12, (y - 300) / 700) : 1;
    x = 540 + (x - 540) * estrecha;
    if (y < YBOCA - 260) return;
    viruta(g, x, y, mez(10, 50, llega) * mez(1, 0.6, chupa), 0.3 * i + Math.sin(t + i) * 0.1, 1, n.tono);
    const al = su(tr(t, n.T - 0.05, n.T + 0.15)) * (1 - su(tr(t, Ttra - 0.1, Ttra + 0.2)));
    if (al > 0) rotulos.push({ x: 540 + (x - 540) * z - (n.texto.length * 15 + 26), y: 960 + (y - camY(t)) * z + 70, texto: n.texto, color: n.color, al });
  });
  // la resistencia, delante del líquido
  espiral(g, t, rojo, blanco);
  // el formaldehído: gotas verdes que suben por la chimenea
  for (const d of GOTAS) {
    if (t < d.t0) continue;
    const y = YBOB - 80 - (t - d.t0) * d.vel, x = 540 + d.dx * 0.5 + Math.sin(t * 3 + d.f) * 18;
    if (y < YBOCA - 200) continue;
    const al = su(tr(t, d.t0, d.t0 + 0.2));
    g.save(); g.globalAlpha = al; g.shadowColor = `rgba(${VERDE_F},0.9)`; g.shadowBlur = 24; g.fillStyle = `rgb(${VERDE_F})`;
    g.beginPath(); g.moveTo(x, y - d.r * 1.6); g.quadraticCurveTo(x + d.r, y - d.r * 0.2, x + d.r * 0.9, y + d.r * 0.3); g.arc(x, y + d.r * 0.3, d.r * 0.9, 0, Math.PI); g.quadraticCurveTo(x - d.r, y - d.r * 0.2, x, y - d.r * 1.6); g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.arc(x - d.r * 0.3, y, d.r * 0.25, 0, 6.2832); g.fill();
    g.restore();
  }
  g.restore();
  for (const r of rotulos) k.etiqueta(g, r.x, r.y, r.texto, r.color, r.al, 58);
  // el nombre del formaldehído, quieto en pantalla
  const alF = su(tr(t, Tform - 0.05, Tform + 0.2));
  if (alF > 0) k.etiqueta(g, 630, 860, "formaldehído", VERDE_F, alF, 60);
  velo(g, 0.5);
}
