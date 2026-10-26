// «No nacieron así: esa parte se rehizo para guardar la ciudad. Envíaselo a ese amigo…»
// La pieza nace pequeña, las calles entran y se rehace. La cámara sale hasta el taxi.
import * as k from "#kit";
import { v } from "#voz";
import { ciudad, noche, pieza, taxiDetras, velo } from "../mundo.js";

export const desde = (vx) => vx.frase(14).inicio;

const AZ = k.azar(44);
const CHISPAS = Array.from({ length: 40 }, () => ({
  ang: AZ() * 6.2832,
  rad: 0.6 + AZ() * 1.4,
  vel: 0.4 + AZ() * 0.6,
  c: AZ() < 0.5 ? "255,186,70" : "255,110,80",
}));

export function dibuja(g, t) {
  const f14 = v.frase(14), f15 = v.frase(15);
  const Tasi = f14.t("asi"), Tre = f14.t("rehizo"), Tciudad = f14.t("ciudad");
  const Tfin = f15.fin + 0.8;
  const crece = k.suave(k.tramo(t, f14.t("parte"), Tre + 0.45));
  const fantasma = 1 - k.suave(k.tramo(t, f14.inicio, Tasi + 0.05));
  const dist = k.claves([
    [f14.inicio, 0.26],
    [Tasi, 0.3],
    [Tre, 0.34],
    [Tciudad, 0.42],
    [f15.inicio, 0.7],
    [f15.t("amigo"), 4.15],
    [f15.t("cambia"), 4.45],
    [Tfin, 4.45],
  ]);
  const origen = [0, 1.15, 16];
  const d = dist(t);
  const avance = k.claves([[f15.t("amigo"), 0], [Tfin, 16]])(t);
  const cam = k.mira([0, 1.35, origen[2] - d + avance], [0, 1.05, origen[2] + 0.15 + avance]);
  const lejos = k.suave(k.tramo(d, 1.2, 3.2));

  noche(g, 0.15 * lejos);
  if (lejos > 0.02) {
    g.save();
    g.globalAlpha = lejos;
    ciudad(g, cam, t, 0.85);
    g.restore();
  } else {
    const grd = g.createRadialGradient(540, 1000, 40, 540, 1000, 900);
    grd.addColorStop(0, "#2a1434");
    grd.addColorStop(1, "#07060f");
    g.fillStyle = grd;
    g.fillRect(0, 0, 1080, 1920);
  }

  const alPieza = 1 - k.suave(k.tramo(t, f15.t("amigo") - 0.1, f15.t("amigo") + 0.55));
  if (fantasma > 0.03) pieza(g, cam, { crece: 1, al: fantasma * 0.35 * alPieza, origen, escala: 0.5, tono: "170,190,220" });

  // las calles que entran en la parte de atrás
  if (crece > 0.02 && alPieza > 0.05) {
    const meta = k.proyecta(cam, [origen[0], origen[1] + 0.05, origen[2] + 0.35]);
    if (meta) {
      for (const s of CHISPAS) {
        const u = (1 - crece) * s.vel + crece * 0.08;
        const x = origen[0] + Math.cos(s.ang) * s.rad * (0.25 + u);
        const y = origen[1] + 0.2 + Math.sin(s.ang) * s.rad * 0.4 * u;
        const z = origen[2] + 0.2 + u * 1.3;
        const q = k.proyecta(cam, [x, y, z]);
        if (!q) continue;
        k.brillo(g, q.x, q.y, 22 + (1 - u) * 36, s.c, (1 - u) * alPieza);
      }
    }
  }
  if (alPieza > 0.02) pieza(g, cam, { crece, al: alPieza, origen, escala: 0.5, tono: "214,150,104" });

  const cabZ = origen[2] - d + 3.7 + avance;
  const cq = k.proyecta(cam, [0, 0.82, Math.max(cabZ, origen[2] + 0.4)]);
  if (cq && lejos > 0.2) {
    const s = k.tamano(1.78, cq.z);
    g.save();
    g.globalAlpha = lejos;
    taxiDetras(g, cq.x, cq.y, s, 1);
    g.restore();
    k.brillo(g, cq.x, cq.y - s * 0.5, s * 0.45, "255,170,40", 0.7 * lejos);
  }
  velo(g, 0.84);
}
