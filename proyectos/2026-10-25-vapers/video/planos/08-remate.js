// «Así que no es humo de sabores: son dos paquetes de tabaco con metal dentro.» + «Sígueme para más, o envíaselo a
// ese amigo que dice que solo es vapor.»
// Otra vez la nube de sabores con el váper, como al principio.
// - «Así»: corte aquí; la nube rosa y azul llena la pantalla y en medio el váper.
// - «no es humo de sabores»: la nube se disipa y el váper se va hacia arriba.
// - «son dos paquetes»: suben los dos paquetes abiertos y se quedan en medio, grandes.
// - «metal dentro»: virutas de metal caen y brillan encima de los cigarrillos.
// - «Sígueme... amigo»: todo quieto; «vapor»: una última nube rosa sube por detrás y se queda hasta el final.
import * as k from "#kit";
import { v } from "#voz";
import { fondo, nube, vaper, paquete, viruta, velo, ROSA, AZUL, LILA } from "../mundo.js";

export const desde = (vz) => vz.frase(9).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f9 = v.frase(9), f10 = v.frase(10);
const T0 = f9.inicio, Tno = f9.t("no"), Thum = f9.t("humo"), Tsab = f9.t("sabores"), Tson = f9.t("son"), Tdos = f9.t("dos"), Tpaq = f9.t("paquetes"), Tmet = f9.t("metal"), Tden = f9.t("dentro");
const Tsig = f10.inicio, Tvap = f10.t("vapor"), Fin = f10.fin;
export const momentos = { disipa: Tno, paquetes: Tdos, metal: Tmet, vapor: Tvap };

const az = azar(88);
const PX = [285, 795], PY = 1540, PH = 640;
const VIRUTAS = Array.from({ length: 26 }, (_, i) => ({ t0: Tmet - 0.1 + i * 0.03, lado: i % 2, dx: (az() - 0.5) * 300, y1: -PH * 0.86 - az() * 60, tam: 18 + az() * 16, giro: az() * 6.28, f: az() * 6.28 }));

export function dibuja(g, t) {
  fondo(g, t, "#1b0a2e");
  // la cámara se acerca muy despacio en la despedida
  const zc = mez(1, 1.1, su(tr(t, Tsig, Fin + 0.8)));
  g.save(); g.translate(540, 1200); g.scale(zc, zc); g.translate(-540, -1200);
  // la nube del principio, que se disipa en «no es humo de sabores»
  const disipa = su(tr(t, Tno - 0.05, Tsab + 0.35));
  for (let i = 0; i < 6; i++) nube(g, t, 540, 900, (i / 6) * 6.2832 + 0.3, 1 + 0.6 * disipa, { n: 30, semilla: 100 + i, esc: 1.25 + 0.5 * disipa, al: 1 - disipa });
  // los paquetes, que suben en «son dos»
  const sube = k.entra(tr(t, Tson - 0.05, Tpaq + 0.05));
  const brillaMetal = su(tr(t, Tmet - 0.05, Tmet + 0.3));
  for (const s of [0, 1]) {
    paquete(g, PX[s], mez(2900, PY, sube), PH, s ? 0.06 : -0.06, 1, s ? "#1e63c8" : "#c8102e");
  }
  // las virutas, que caen sobre los cigarrillos en «metal» y se quedan brillando
  for (const w of VIRUTAS) {
    const u = tr(t, w.t0, w.t0 + 0.45);
    if (u <= 0) continue;
    const e = k.sale(u);
    const x = PX[w.lado] + w.dx * 0.6, y = mez(PY + w.y1 - 700, PY + w.y1, e);
    viruta(g, x, y, w.tam, w.giro + (1 - u) * 5, 1);
    if (u >= 1) k.brillo(g, x, y, 60 + 30 * Math.sin(t * 7 + w.f), "255,255,255", 0.4 + 0.4 * Math.sin(t * 7 + w.f));
  }
  k.brillo(g, 540, PY - PH * 0.85, 800, "220,230,255", 0.5 * k.pulso(t, Tden, 0.2));
  // el váper, que se va hacia arriba al disiparse la nube
  const seVa = su(tr(t, Tson - 0.15, Tdos + 0.25));
  vaper(g, 540, mez(1000, -900, seVa), 900, 0.03 * Math.sin(t * 0.8) - 0.5 * seVa, { luz: 1 });
  // la última nube, en «vapor», por detrás de los paquetes no: por delante y suave, que lo envuelve todo
  nube(g, t, 540, 1950, -Math.PI / 2, tr(t, Tvap - 0.15, Tvap + 1.0), { n: 70, semilla: 900, esc: 1.5, alcance: 1500, al: 0.9, colores: [ROSA, LILA, AZUL] });
  g.restore();
  velo(g, 0.5);
}
