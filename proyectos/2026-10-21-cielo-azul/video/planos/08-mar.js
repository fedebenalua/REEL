// «Envíaselo a ese amigo que cree que el cielo es azul porque refleja el mar.»
// Otro sitio: el mar bajo el cielo azul (el mismo cielo del principio, con su Sol y sus nubes). Se entra con un corte.
// - «cree que el cielo es azul porque refleja el mar»: del mar suben reflejos azules hacia el cielo (lo que cree).
// - «mar»: el mar se apaga, gris y oscuro, y los reflejos desaparecen; el cielo sigue igual de azul.
import * as k from "#kit";
import { v } from "#voz";
import { AZUL, cielo, nube, sol } from "../mundo.js";

export const desde = (vz) => vz.frase(12).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f = v.frase(12);
const T0 = f.inicio, Tcree = f.t("cree"), Trefleja = f.t("refleja"), Tmar = f.t("mar"), Fin = f.fin;
const HZ = 1180;
const TAPAGA = Tmar + 0.05;

const az = azar(888);
const OLAS = Array.from({ length: 70 }, () => ({ x: az() * 1200 - 60, y: HZ + 20 + Math.pow(az(), 1.7) * 740, w: 60 + az() * 160, f: az() * 6.28 }));
const RAYOS = Array.from({ length: 9 }, (_, i) => ({ x: 90 + i * 112 + az() * 40, f: az() * 6.28 }));

export function dibuja(g, t) {
  cielo(g, 0, 0, HZ + 5);
  sol(g, 800, 700, 82, 1, 1);
  nube(g, 1, 210, 640, 290, 0.95); nube(g, 3, 690, 1010, 340, 0.9); nube(g, 5, 470, 860, 230, 0.8);

  // el mar: azul, o apagado
  const ap = su(tr(t, TAPAGA, TAPAGA + 0.45));
  const mg = g.createLinearGradient(0, HZ, 0, 1920);
  mg.addColorStop(0, k.mezColor("#4aa0d8", "#6b7882", ap)); mg.addColorStop(0.35, k.mezColor("#1f6fb0", "#3d4852", ap)); mg.addColorStop(1, k.mezColor("#073a66", "#151c22", ap));
  g.fillStyle = mg; g.fillRect(0, HZ, 1080, 1920 - HZ);
  // las olas
  g.save(); g.lineCap = "round";
  for (const o of OLAS) {
    const s = (o.y - HZ) / 740, x = o.x + Math.sin(t * 0.9 + o.f) * 24, w = o.w * (0.5 + s), y = o.y + Math.sin(t * 1.6 + o.f * 2) * 5;
    g.strokeStyle = `rgba(255,255,255,${(0.18 + 0.25 * s) * (1 - 0.7 * ap)})`; g.lineWidth = 3 + 5 * s;
    g.beginPath(); g.moveTo(x - w / 2, y); g.quadraticCurveTo(x, y - 10 - 12 * s, x + w / 2, y); g.stroke();
  }
  g.restore();
  // el camino de luz del Sol en el agua
  g.save(); g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 40; i++) { const y = HZ + 8 + i * 17 + (i * i % 7), x = 800 + Math.sin(t * 2 + i * 1.3) * (10 + i * 2.2), w = 20 + i * 3; g.fillStyle = `rgba(255,252,235,${(0.55 - i * 0.011) * (1 - 0.85 * ap)})`; g.fillRect(x - w / 2, y, w, 4 + (i % 3)); }
  g.restore();
  // el horizonte
  const hg = g.createLinearGradient(0, HZ - 30, 0, HZ + 30); hg.addColorStop(0, "rgba(255,255,255,0)"); hg.addColorStop(0.5, `rgba(235,246,255,${0.6 * (1 - ap)})`); hg.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = hg; g.fillRect(0, HZ - 30, 1080, 60);

  // lo que cree: reflejos azules que suben del mar al cielo
  const sube = su(tr(t, Tcree - 0.1, Trefleja + 0.15)) * (1 - su(tr(t, Tmar - 0.02, Tmar + 0.3)));
  if (sube > 0.01) {
    g.save(); g.globalCompositeOperation = "lighter";
    for (const r of RAYOS) {
      const top = HZ - 80 - sube * (330 + 160 * Math.sin(r.f)), x = r.x + Math.sin(t * 1.5 + r.f) * 10;
      const gr = g.createLinearGradient(0, HZ + 200, 0, top); gr.addColorStop(0, `rgba(${AZUL},${0.5 * sube})`); gr.addColorStop(1, `rgba(${AZUL},0)`);
      g.fillStyle = gr; g.fillRect(x - 46, top, 92, HZ + 200 - top);
    }
    g.restore();
    k.brillo(g, 540, HZ + 150, 1600, AZUL, 0.5 * sube);
  }
  // el apagón del mar: un destello gris
  k.brillo(g, 540, HZ + 300, 1600, "180,190,200", 0.35 * k.pulso(t, TAPAGA + 0.05, 0.1));

  const vg = g.createLinearGradient(0, 200, 0, 650); vg.addColorStop(0, "rgba(10,40,120,0.45)"); vg.addColorStop(1, "rgba(10,40,120,0)"); g.fillStyle = vg; g.fillRect(0, 0, 1080, 650);
}
