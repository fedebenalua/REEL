// «¿Sabías que un váper puede llevar la nicotina de dos paquetes de tabaco?» y «Y eso que sale no es vapor de agua:»
// La nube de sabores con el váper.
// - Fotograma 0: una nube rosa y azul estalla hacia la cámara y en medio, enorme, el váper.
// - «nicotina»: el váper se parte por la mitad y de dentro salen cigarrillos a chorro.
// - «dos paquetes»: dos paquetes abiertos suben a los lados y los cigarrillos van cayendo dentro; «tabaco»: reposan.
// - «Y eso que sale»: de la boquilla sale otra nube y la cámara se mete en ella; «no es vapor de agua»: dentro hay
//   motas oscuras y brillos de metal. Corte en el segundo «es».
import * as k from "#kit";
import { v } from "#voz";
import { fondo, nube, vaper, cigarrillo, paquete, viruta, velo, ROSA, AZUL, LILA } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, azar } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tnic = f1.t("nicotina"), Tdos = f1.t("dos"), Tpaq = f1.t("paquetes"), Ttab = f1.t("tabaco"), Fin1 = f1.fin;
const Tsale = f2.t("sale"), Tno = f2.t("no"), Tvap = f2.t("vapor"), Tagua = f2.t("agua"), Tes2 = f2.t("es", 2);
export const momentos = { abre: Tnic, paquetes: Tdos, nube2: f2.inicio };

const VX = 540, VY = 1010, VL = 980;
const az = azar(21);
const CIGS = Array.from({ length: 40 }, (_, i) => ({ t0: Tnic + 0.05 + i * 0.03, lado: i % 2 ? 1 : -1, dur: 0.55 + az() * 0.25, alto: 200 + az() * 300, giro: (az() - 0.5) * 6, f: az() * 6.28 }));
const MOTAS = Array.from({ length: 70 }, () => ({ x: (az() - 0.5) * 900, y: -az() * 900, r: 3 + az() * 7, f: az() * 6.28, metal: az() < 0.3, a: az() * 6.28 }));
const PX = [270, 810], PY = 1660;

export function dibuja(g, t) {
  fondo(g, t, "#1b0a2e");
  // la nube del principio: estalla hacia la cámara desde detrás del váper
  const u0 = tr(t, -0.35, 1.2);
  for (let i = 0; i < 6; i++) nube(g, t, VX, VY - 100, (i / 6) * 6.2832 + 0.3, u0, { n: 30, semilla: 100 + i, esc: 1.25, al: 1 - 0.55 * su(tr(t, Tdos, Ttab)) });
  const abre = su(tr(t, Tnic - 0.05, Tnic + 0.35));
  const BOCA = VY - VL / 2 - 60 - 0.22 * VL * abre;
  // la segunda nube, de la boquilla, en «Y eso que sale»; la cámara se mete en ella: la boquilla baja al borde de
  // abajo y la nube llena la pantalla
  const u2 = tr(t, f2.inicio - 0.1, Tvap + 0.25);
  const entra = su(tr(t, Tsale - 0.1, Tes2));
  const zoom = mez(1, 1.9, entra);
  g.save(); g.translate(540, mez(BOCA, 1250, entra)); g.scale(zoom, zoom); g.translate(-540, -BOCA);
  // los paquetes: suben desde abajo en «dos»; la mitad de abajo del váper se hunde para dejarles sitio
  const sube = k.entra(tr(t, Tdos - 0.1, Tpaq + 0.1));
  const llegados = CIGS.filter((c) => t >= c.t0 + c.dur).length;
  for (const s of [0, 1]) paquete(g, PX[s], mez(2900, PY, sube), 600, s ? 0.08 : -0.08, Math.min(1, llegados / 30), s ? "#1e63c8" : "#c8102e");
  // el váper, que se parte en «nicotina»; entra girando desde muy cerca de la cámara y se coloca
  const llega = k.entra(tr(t, 0, 0.9));
  vaper(g, VX, mez(VY + 200, VY, llega), VL * mez(2.4, 1, llega), mez(-0.9, 0.02, llega) + 0.02 * Math.sin(t * 0.8), { abierto: abre, luz: 1, baja: 1300 * su(tr(t, Tdos - 0.15, Tpaq + 0.15)) });
  k.brillo(g, VX, VY, 900, "255,255,255", 0.6 * k.pulso(t, Tnic + 0.12, 0.12));
  // los cigarrillos: salen del corte y vuelan a los paquetes
  for (const c of CIGS) {
    const u = tr(t, c.t0, c.t0 + c.dur);
    if (u <= 0 || u >= 1) continue;
    const e = su(u);
    const x1 = PX[c.lado > 0 ? 1 : 0], y1 = PY - 600 * 0.95;
    const x = mez(VX, x1, e), y = mez(VY, y1, e) - c.alto * Math.sin(u * Math.PI);
    cigarrillo(g, x, y, mez(340, 170, e), c.giro * u + c.f, 0, 1 - su(tr(u, 0.85, 1)));
  }
  // la segunda nube, desde la boquilla hacia arriba
  nube(g, t, VX, BOCA, -Math.PI / 2, u2, { n: 60, semilla: 300, esc: 1.3, alcance: 650, al: 0.85 });
  // lo que hay dentro: motas oscuras y brillos de metal, en «no es vapor de agua»
  const ve = su(tr(t, Tno - 0.05, Tvap + 0.3));
  if (ve > 0) for (const m of MOTAS) {
    const x = VX + m.x * 0.45 * (0.5 + 0.5 * ve) + Math.sin(t * 1.3 + m.f) * 12, y = BOCA - 40 + m.y * 0.5 * (0.4 + 0.6 * ve) + Math.cos(t * 1.1 + m.f) * 10;
    if (m.metal) viruta(g, x, y, m.r * 1.6, m.a + t * 0.6, ve);
    else { g.fillStyle = `rgba(30,20,30,${0.8 * ve})`; g.beginPath(); g.arc(x, y, m.r, 0, 6.2832); g.fill(); }
  }
  g.restore();
  velo(g, mez(0.5, 0.85, entra));
}
