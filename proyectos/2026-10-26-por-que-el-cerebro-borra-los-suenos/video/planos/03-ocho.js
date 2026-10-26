// «Si te despiertan con los ojos aún moviéndose...» y «por la mañana solo el último».
// El ojo llena la pantalla. Luego diez esferas: ocho con sueño, dos vacías.
// Al amanecer se apagan todas menos la última.
import * as k from "#kit";
import { v } from "#voz";
import { koi, ojo, esfera, velo } from "../mundo.js";

export const desde = (voz) => voz.frase(3).t("si");

const f3 = v.frase(3), f4 = v.frase(4);
const Tmueve = f3.t("moviendose");
const Tcuentas = f3.t("cuentas");
const Tocho = f3.t("ocho");
const Tdiez = f3.t("diez");
const Tmana = f4.t("manana");
const Tultimo = f4.t("ultimo");

// Un enjambre, no una tabla: ocho con sueño y dos vacías. La última es la grande del centro.
const ORBES = [
  { x: 250, y: 760, r: 118, vivo: true },
  { x: 500, y: 690, r: 136, vivo: true },
  { x: 740, y: 780, r: 112, vivo: true },
  { x: 200, y: 1020, r: 100, vivo: false },
  { x: 430, y: 1040, r: 168, vivo: true, ultimo: true },
  { x: 690, y: 1020, r: 124, vivo: true },
  { x: 300, y: 1300, r: 112, vivo: true },
  { x: 540, y: 1320, r: 96, vivo: false },
  { x: 760, y: 1260, r: 118, vivo: true },
  { x: 880, y: 1040, r: 88, vivo: true },
];

export function dibuja(g, t) {
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#140818");
  bg.addColorStop(1, "#07040e");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  const saleOjo = k.suave(k.tramo(t, Tcuentas - 0.15, Tocho - 0.05));
  const dart = 34 * k.suave(k.tramo(t, f3.inicio, Tmueve)) * (1 - k.suave(k.tramo(t, Tmueve + 0.45, Tcuentas)));
  const R = k.mez(460, 90, saleOjo);
  if (saleOjo < 0.82) {
    g.save();
    g.globalAlpha = 1 - k.suave(k.tramo(saleOjo, 0.45, 0.82));
    ojo(g, 540, 1080, R, t, dart);
    g.restore();
  }

  const llegan = k.suave(k.tramo(t, Tcuentas, Tocho + 0.15));
  const manana = k.suave(k.tramo(t, Tmana, Tmana + 0.7));
  if (manana > 0.01) {
    g.save();
    g.globalAlpha = manana * 0.85;
    const mg = g.createLinearGradient(0, 0, 0, 1920);
    mg.addColorStop(0, "#f6d7b0");
    mg.addColorStop(1, "#e8b090");
    g.fillStyle = mg;
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }

  if (llegan > 0.02) {
    ORBES.forEach((o, i) => {
      const entra = k.suave(k.tramo(llegan, i * 0.04, 0.35 + i * 0.04));
      if (entra <= 0) return;
      const seApaga = o.ultimo ? 0 : k.suave(k.tramo(t, Tmana + 0.25 + (i % 5) * 0.18, Tultimo - 0.15));
      const luz = o.vivo ? 1 - seApaga : 0;
      const crece = o.ultimo ? k.suave(k.tramo(t, Tultimo - 0.35, Tultimo + 0.35)) : 0;
      const x = k.mez(o.x, 540, crece);
      const y = k.mez(o.y, 1080, crece);
      const r = k.mez(o.r, 280, crece) * (0.55 + 0.45 * entra);
      esfera(g, x, y, r, t, (gg, rr) => {
        if (luz > 0.04) koi(gg, 0, 6, rr * 1.2, -0.2, t, luz);
      }, luz);
      if (!o.vivo && entra > 0.8 && manana < 0.2) {
        g.save();
        g.strokeStyle = "rgba(255,255,255,0.25)";
        g.lineWidth = 3;
        g.beginPath(); g.arc(x, y, r * 0.55, 0, 6.2832); g.stroke();
        g.restore();
      }
    });
  }
  // cama abajo, solo mientras las esferas están y aún no es de día del todo
  if (saleOjo > 0.4 && manana < 0.85) {
    g.save();
    g.globalAlpha = (1 - manana) * 0.9;
    g.fillStyle = "#3a2030";
    k.redondo(g, 180, 1560, 720, 280, 40); g.fill();
    g.fillStyle = "#f7e6dc";
    k.redondo(g, 230, 1500, 260, 140, 36); g.fill();
    g.restore();
  }
  velo(g, 0.62);
}
