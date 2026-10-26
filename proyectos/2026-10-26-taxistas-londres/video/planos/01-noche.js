// «Para ser taxista en Londres… ¿Qué le cambia por dentro a quien lo aprueba?»
// El taxi, enorme desde el primer fotograma, corriendo entre las calles. La red se enciende
// con las veinticinco mil. Cuatro soles marcan los años. La cámara se mete en el cristal y se para.
import * as k from "#kit";
import { v } from "#voz";
import { ciudad, noche, taxiDetras, velo } from "../mundo.js";

export const desde = 0;

export function dibuja(g, t) {
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3);
  const Tmil = f1.t("mil"), Tmem = f1.t("memoria"), T25 = f1.t("veinticinco");
  const Tcuatro = f2.t("cuatro"), Tanos = f2.t("anos"), Tex = f2.t("examen");
  const Tdentro = f3.t("dentro"), Tfin = v.frase(4).inicio;

  const avance = k.claves([
    [0, 0], [1.05, 18], [Tmil, 30], [Tmem, 34], [Tcuatro, 40], [Tdentro, 48], [Tfin - 0.3, 54], [Tfin, 54.15],
  ]);
  const sep = k.claves([
    [0, 5.2], [0.85, 4.5], [Tdentro - 0.05, 4.35], [Tdentro + 0.9, 2.45], [Tfin - 0.25, 2.4], [Tfin, 2.4],
  ]);
  const altura = k.claves([
    [0, 1.45], [0.9, 1.5], [Tmil - 0.08, 1.7], [Tmil + 0.5, 6.4], [Tmem + 0.2, 6.1],
    [f2.inicio, 3.4], [Tcuatro, 2.1], [Tdentro, 1.2], [Tfin - 0.25, 0.98], [Tfin, 0.98],
  ]);
  const az = avance(t), sp = sep(t), ay = altura(t);
  const cam = k.mira([0, ay, az], [0, 0.7, az + sp + 1.4]);
  const red = k.suave(k.tramo(t, T25 - 0.08, Tmil + 0.35));

  noche(g, k.suave(k.tramo(t, f2.inicio, Tanos)) * 0.4);
  ciudad(g, cam, t, red);

  const cabZ = az + sp;
  const cq = k.proyecta(cam, [0, 0.82, cabZ]);
  if (cq) {
    const s = k.tamano(1.78, cq.z);
    taxiDetras(g, cq.x, cq.y, s, 1);
    k.brillo(g, cq.x - s * 0.24, cq.y + s * 0.08, s * 0.42, "255,40,60", 0.75);
    k.brillo(g, cq.x + s * 0.24, cq.y + s * 0.08, s * 0.42, "255,40,60", 0.75);
    k.brillo(g, cq.x, cq.y - s * 0.55, s * 0.5, "255,170,40", 0.85);
  }

  const base = k.suave(k.tramo(t, Tex, Tanos + 0.2));
  if (base > 0.02) {
    for (let i = 0; i < 4; i++) {
      const u = k.suave(k.tramo(base, i * 0.16, i * 0.16 + 0.42));
      const x = k.mez(8, -3.3 + i * 2.2, u);
      const y = k.mez(0.3, 3.1, u);
      const q = k.proyecta(cam, [x, y, cabZ + 7]);
      if (!q) continue;
      k.brillo(g, q.x, q.y, k.tamano(0.42, q.z) * 5, "255,186,80", u);
    }
  }

  const cuenta = k.suave(k.tramo(t, T25 - 0.05, Tmil + 0.25));
  const alNum = k.claves([
    [T25 - 0.2, 0], [T25 + 0.05, 1], [Tmem + 0.45, 1], [f2.inicio + 0.35, 0],
  ]);
  if (alNum(t) > 0.04) k.pastilla(g, 540, 1180, k.fmt(Math.round(cuenta * 25000)), "calles", "255,196,90", alNum(t), 84);

  velo(g, 0.84);
}
