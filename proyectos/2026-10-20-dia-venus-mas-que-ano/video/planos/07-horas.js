// «Un solo día en Venus son cinco mil ochocientas treinta y dos horas. / Envíaselo a ese amigo que siempre dice que le faltan horas al día.»
// Un sitio nuevo: un fondo azul oscuro lleno de relojes. Una cámara fija.
// - «un solo día»: un reloj grande, de 24 h, da su vuelta entera.
// - «cinco mil…»: el reloj se multiplica en una pared de 243 relojes (uno por cada día de la Tierra que dura el de Venus),
//   y el contador sube hasta 5.832 h.
// - «Envíaselo»: un avión de papel cruza la pared, que se apaga; aparece el amigo con su reloj, que corre sin parar.
// - «faltan horas»: el reloj del amigo va a toda prisa; «día»: salta Venus a su lado, con sus 5.832 h.
// - al final todo se va y queda Venus como en el primer fotograma.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, espacio, sol, venusLado, marca, avion, amigo, velo, vineta } from "../mundo.js";

export const desde = (vz) => vz.frase(10).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const F10 = v.frase(10), F11 = v.frase(11);
const T0 = F10.inicio, Tdia = F10.t("dia"), Tven = F10.t("venus"), Tcin = F10.t("cinco"), Thor = F10.t("horas");
const T11 = F11.inicio, Tami = F11.t("amigo"), Tfal = F11.t("faltan"), Thor2 = F11.t("horas"), Tdi2 = F11.t("dia");
const FIN = v.duracion;
const TW0 = Tcin - 0.15, TW1 = Thor + 0.1;                // la pared se llena
const TF = T11 + 0.1, TV = FIN - 0.85;                      // la pared se apaga; vuelve Venus

const COLS = 15, ROWS = 17, CELL = 68, WX = -(COLS * CELL) / 2, WY = -420;

function reloj(g, x, y, r, a, col = "255,255,255", rapido = 1) {
  g.save(); g.translate(x, y);
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.fillStyle = "#f4f7ff"; g.fill();
  g.lineWidth = Math.max(2, r * 0.11); g.strokeStyle = `rgb(${col})`; g.stroke();
  g.lineCap = "round";
  g.strokeStyle = "#1a2a4a"; g.lineWidth = Math.max(2, r * 0.1);
  g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a) * r * 0.55, -Math.cos(a) * r * 0.55); g.stroke();
  g.lineWidth = Math.max(1.5, r * 0.07); g.strokeStyle = "#e04030";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a * 12 * rapido) * r * 0.78, -Math.cos(a * 12 * rapido) * r * 0.78); g.stroke();
  g.restore();
}

export function dibuja(g, t) {
  // el fondo
  g.save(); sinVista(g); const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#0a1a46"); bg.addColorStop(1, "#14307a"); g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920); g.restore();
  vista(g, 1, 0, 0);
  k.brillo(g, 0, 100, 1800, "70,130,255", 0.3);
  // el reloj grande de un día
  const ab = 1 - su(tr(t, TW0, TW0 + 0.35));
  if (ab > 0.01) {
    const a = 6.2832 * su(tr(t, Tdia - 0.1, TW0 - 0.1)) * 1.0;
    g.save(); g.translate(0, 80); g.scale(0.8 + 0.2 * ab + 0.06 * k.pulso(t, Tdia + 0.9, 0.2), 0.8 + 0.2 * ab + 0.06 * k.pulso(t, Tdia + 0.9, 0.2)); g.globalAlpha = ab; k.brillo(g, 0, 0, 900, "120,170,255", 0.5);
    reloj(g, 0, 0, 300, a, "90,200,255", 0.0);
    g.restore();
    k.pastilla(g, 0, 460, "24", "h", "130,210,255", 1, 100);
  }
  // la pared de 243 relojes
  const n = 243 * su(tr(t, TW0, TW1)), wa = 1 - 0.78 * su(tr(t, TF, TF + 0.4)) * (1 - su(tr(t, TV, TV + 0.5)));
  if (n > 0.5 && wa > 0.01) {
    g.save(); g.globalAlpha = wa;
    for (let i = 0; i < Math.min(243, Math.ceil(n)); i++) {
      const c = i % COLS, r = Math.floor(i / COLS), pop = Math.min(1, (n - i) * 1.4), x = WX + c * CELL + CELL / 2, y = WY + r * CELL + CELL / 2;
      if (pop <= 0) continue;
      const e = 0.5 + 0.5 * k.entra(pop);
      reloj(g, x, y, CELL * 0.42 * e, t * 1.2 + (i % 7) * 0.9, i === 0 ? "90,200,255" : "255,255,255", 0.3);
    }
    g.restore();
  }
  // Venus, de fondo, cuando hace falta
  sinVista(g);
  // el contador de horas
  const ca = su(tr(t, TW0, TW0 + 0.3)) * (1 - su(tr(t, TF - 0.1, TF + 0.3)));
  const hh = Math.round(5832 * su(tr(t, TW0, TW1)));
  k.pastilla(g, 540, 1080, String(hh).replace(/\B(?=(\d{3})+(?!\d))/g, "."), "h", "255,230,120", ca, 150);
  // el avión y el amigo
  vista(g, 1, 0, 0);
  const ua = tr(t, T11 - 0.05, Tami + 0.1);
  if (ua > 0 && ua < 1) { const u = su(ua); avion(g, mez(-700, -250, u), mez(-300, -420 - 60 * Math.sin(u * 3.14), u), -0.35 + 0.5 * u); }
  const am = su(tr(t, Tami, Tami + 0.35)) * (1 - su(tr(t, TV, TV + 0.4)));
  if (am > 0.01) {
    amigo(g, -270, -80, 1.0 + 0.5 * am, am);
    // su reloj, que corre cada vez más deprisa
    const rr = su(tr(t, Tfal - 0.1, Tfal + 0.3)), ang = t * (1 + 14 * rr);
    g.save(); g.globalAlpha = am; g.translate(120, 330); g.scale(0.7 + 0.3 * am, 0.7 + 0.3 * am);
    k.brillo(g, 0, 0, 700, "255,120,80", 0.4 * rr);
    reloj(g, 0, 0, 190, ang * 0.5, "255,120,80", 1.2);
    g.restore();
    // Venus asoma con sus horas
    const vv = su(tr(t, Thor2 - 0.1, Thor2 + 0.35));
    if (vv > 0.01) { g.save(); g.globalAlpha = vv * am; g.translate(-60, 680); g.scale(0.6 + 0.4 * vv, 0.6 + 0.4 * vv); venusLado(g, 0, 0, 170, t * 0.12, -1, -0.3); g.restore(); }
  }
  sinVista(g);
  const pv = su(tr(t, Thor2 + 0.1, Thor2 + 0.4)) * (1 - su(tr(t, TV, TV + 0.4)));
  k.pastilla(g, 700, 1690, "5.832", "h", "255,230,120", pv, 100);
  // Venus vuelve: el mismo plano del primer fotograma
  const fv = su(tr(t, TV, TV + 0.7));
  if (fv > 0.01) {
    g.save(); g.globalAlpha = fv; espacio(g, 1); vista(g, 1.0, 0, 40);
    sol(g, -600, -400, 300, t, 0.5); const gi = 0.1 + t * 0.14; venusLado(g, 0, 40, 340, gi, -1, -0.45); marca(g, 0, 40, 340, 1.15 - gi * 4);
    g.restore();
  }
  sinVista(g);
  velo(g, 0.35);
  vineta(g, 0.45);
}

export const momentos = { dia: Tdia, horas: Thor, amigo: Tami };
