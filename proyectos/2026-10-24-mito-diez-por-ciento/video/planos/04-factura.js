// El cerebro pesa como una botella de litro y medio, es el dos por ciento del cuerpo
// y se bebe una de cada cinco calorías, también dormido. Luego, la factura.
import * as k from "#kit";
import { v } from "#voz";
import { botella, cerebro, factura, fondo, llamaCalor, motas, persona, personaTumbada, sofa, velo } from "../mundo.js";

export const desde = "sale";

export function dibuja(g, t) {
  const f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
  const Tdos = f8.t("dos");
  const Tcuerpo = f8.t("cuerpo");
  const Tbebe = f9.t("bebe");
  const Tcinco = f9.t("cinco");
  const Tdorm = f10.t("dormido");
  const Tpoco = f10.t("poco");
  const Tfac = f11.t("factura");
  const fin = v.t("reposo");

  const lejos = k.suave(k.tramo(t, Tdos - 0.2, Tcuerpo + 0.45));
  const tumbar = k.suave(k.tramo(t, Tdorm - 0.05, Tdorm + 0.85));
  const baja = k.suave(k.tramo(t, Tpoco - 0.05, Tpoco + 0.45));
  const papel = k.suave(k.tramo(t, Tfac - 0.1, Tfac + 0.65));
  // la factura ya está quieta; las llamas dejan de bailar antes del corte
  const tLlama = t > fin - 0.4 ? fin - 0.4 : t;

  fondo(g, "#241228", "#120c16");
  g.fillStyle = "#3a2a22";
  g.fillRect(120, 780, 16, 560);
  k.brillo(g, 128, 750, 240, "amarilla", 0.4);
  // suelo
  const suelo = g.createLinearGradient(0, 1500, 0, 1920);
  suelo.addColorStop(0, "#1a120e");
  suelo.addColorStop(1, "#0c0908");
  g.fillStyle = suelo;
  g.fillRect(0, 1480, 1080, 440);
  motas(g, tLlama, 0.15);

  const acerca = k.suave(k.tramo(t, f8.inicio, f8.t("cuatrocientos")));
  const zoom = k.mez(k.mez(1.15, 1.6, acerca), 1, lejos);
  g.save();
  g.translate(540, 980);
  g.scale(zoom, zoom);
  g.translate(-540, -980);

  // la persona entra al alejarse, y al dormir se cambia por la tumbada (sin girar el dibujo)
  if (tumbar < 0.995) {
    g.save();
    g.globalAlpha = (1 - tumbar) * k.suave(k.tramo(lejos, 0.15, 0.7));
    persona(g, 520, 640, 860, { t: tLlama, brazo: 0.35, boca: 0.04 });
    g.restore();
  }
  if (tumbar > 0.005) {
    g.save();
    g.globalAlpha = tumbar;
    sofa(g, 560, 1240, 780);
    personaTumbada(g, 300, 1120, 680);
    g.restore();
  }

  const cx = k.mez(400, 500, lejos);
  const cy = k.mez(k.mez(900, 600, lejos), 1080, tumbar);
  const s = k.mez(k.mez(1.35, 0.4, lejos), 0.42, tumbar);
  cerebro(g, cx, cy, s, { t: tLlama, vivo: 0.65, nucleo: 0.45 * (1 - 0.18 * baja) });

  const bh = k.mez(500, 230, lejos);
  const llega = k.entra(k.tramo(t, f8.inicio, f8.t("kilo") + 0.15));
  const bx = k.mez(1180, k.mez(760, 760, lejos), llega);
  const by = k.mez(1040, 1360, lejos);
  if (tumbar < 0.7) botella(g, bx, by, bh * (1 - tumbar * 0.3), tLlama);

  g.restore();

  const salen = k.suave(k.tramo(t, Tbebe - 0.05, Tcinco + 0.2));
  const bebe = k.suave(k.tramo(t, Tcinco, Tcinco + 0.75));
  const nivel = 1 - 0.18 * baja;
  if (salen > 0.02) {
    for (let i = 0; i < 5; i++) {
      const ang = tLlama * 2.4 + i * (6.28 / 5);
      const baseX = 540 + Math.cos(ang) * 300;
      const baseY = 500 + Math.sin(ang) * 70;
      const x = i === 2 ? k.mez(baseX, 540, bebe) : baseX;
      const y = i === 2 ? k.mez(baseY, 720, bebe) : baseY;
      const al = (i === 2 ? 1 - bebe * 0.9 : 1) * salen * nivel;
      llamaCalor(g, x, y, 62, tLlama, i, al);
    }
  }

  factura(g, 540, 1320, papel * 460, papel);
  velo(g, 0.72);
}
