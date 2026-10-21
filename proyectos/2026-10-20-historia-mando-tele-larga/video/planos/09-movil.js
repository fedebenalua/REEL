// «Y a día de hoy también puedes usar la tele con tu móvil: el link de la app está en la bio.»
// Vuelve el salón de hoy (el mismo del plano 07, con el mando y la tele), con un corte en «Y».
// - «Y a día de hoy también»: el mando, con su mano, ahí abajo; la tele arriba.
// - «puedes usar la tele»: el mando se va hacia abajo a la derecha y entra, en la misma mano, el móvil con la app.
// - «con tu móvil»: el pulgar aprieta el volumen; salen ondas azules hacia la tele y la barra de volumen sube.
// - «el link de la app está en la bio»: «link en la bio», grande y quieto, en el centro.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { salonHoy, teleHoy, mandoHoy, manoDetras, manoDelante, movilApp, manoMovilDetras, manoMovilDelante } from "../objetosHoy.js";

export const desde = (vz) => vz.frase(18).inicio;

const { suave: su, tramo: tr, mez } = k;
const f = v.frase(18);
const T0 = f.inicio, Tpue = f.t("puedes"), Tmov = f.t("movil"), Tlink = f.t("link");
const FIN = v.frase(19).inicio;

const cam = camino2D([
  [T0, [0.8, 0, -560]], [Tpue - 0.2, [0.8, 0, -560]], [Tpue + 0.5, [0.85, 0, -230]], [FIN, [0.85, 0, -230]],
]);

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  salonHoy(g, t, "255,140,80");
  const volAl = su(tr(t, Tmov + 0.45, Tmov + 0.75));
  const vol = mez(0.4, 0.92, su(tr(t, Tmov + 0.5, Tmov + 1.9)));
  teleHoy(g, t, { canalN: 4, nv: 0, ojo: 0, vol, volAl });
  // el mando, con su mano, que se va hacia abajo a la derecha
  const sale = su(tr(t, Tpue - 0.1, Tpue + 0.5));
  g.save(); g.translate(1000 * sale, 700 * sale);
  manoDetras(g);
  mandoHoy(g, t, { led: 0 });
  manoDelante(g, 0);
  g.restore();
  // y entra el móvil, en la misma mano
  if (t > Tpue - 0.2) {
    const entra = 1 - su(tr(t, Tpue + 0.15, Tpue + 0.8)), pul = su(tr(t, Tmov - 0.3, Tmov - 0.05)) * (1 - su(tr(t, Tmov + 1.6, Tmov + 1.85)));
    g.save(); g.translate(0, 330 + 1200 * entra); g.scale(1.25, 1.25);
    manoMovilDetras(g); movilApp(g, t, { pulsa: pul, luz: pul }); manoMovilDelante(g, pul);
    g.restore();
    // las ondas que salen del móvil hacia la tele
    g.save(); g.globalCompositeOperation = "lighter"; g.lineCap = "round";
    for (let q = 0; q < 5; q++) {
      const t0 = Tmov + 0.1 + q * 0.38, d = t - t0; if (d < 0 || d > 1.4) continue;
      const r = 90 + d * 720, al = Math.exp(-d * 1.4) * 0.9;
      g.strokeStyle = `rgba(120,190,255,${al})`; g.lineWidth = 14; g.beginPath(); g.arc(0, -120, r, -Math.PI / 2 - 0.75, -Math.PI / 2 + 0.75); g.stroke();
      g.strokeStyle = `rgba(120,190,255,${al * 0.25})`; g.lineWidth = 44; g.beginPath(); g.arc(0, -120, r, -Math.PI / 2 - 0.75, -Math.PI / 2 + 0.75); g.stroke();
    }
    g.restore();
  }
  sinVista(g);
  const lk = su(tr(t, Tlink - 0.1, Tlink + 0.2));
  k.pastilla(g, 540, 965, "link en la bio", "", "255,226,160", lk, 84);
  velo(g, 0.5);
  vineta(g, 0.45);
}

export const momentos = { puedes: Tpue, movil: Tmov, link: Tlink };
