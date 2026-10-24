// La zona del habla se apaga y se rompen las palabras. Justo detrás, la del brazo, y el vaso cae.
import * as k from "#kit";
import { v } from "#voz";
import { cerebro, fondo, mano, motas, persona, vaso, velo, zonaPantalla } from "../mundo.js";

export const desde = "mira";

export function dibuja(g, t) {
  const f4 = v.frase(4), f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7);
  const Thabla = f4.t("habla");
  const Testro = f5.t("estropea");
  const Tpal = f5.t("palabras");
  const Tdet = f6.t("detras");
  const Tbr = f6.t("brazo");
  const Tcae = f7.t("estropea");
  const Tob = f7.t("obedecerte");
  const fin = v.t("sale");
  const calma = 1 - k.suave(k.tramo(t, fin - 0.42, fin - 0.14));

  const haciaBrazo = k.entra(k.tramo(t, Tdet - 0.1, Tdet + 0.65));
  const empuje = k.entra(k.tramo(t, f4.inicio, f4.inicio + 1.25));
  const cx = k.mez(k.mez(560, 470, empuje), 400, haciaBrazo);
  const cy = k.mez(k.mez(820, 700, empuje), 640, haciaBrazo);
  const s = k.mez(k.mez(1.15, 1.55, empuje), 1.62, haciaBrazo) * (1 + 0.1 * k.pulso(t, Testro + 0.1, 0.16) + 0.1 * k.pulso(t, Tcae + 0.12, 0.16));
  const habla = k.suave(k.tramo(t, Thabla - 0.15, Thabla + 0.3));
  const hablaOff = k.suave(k.tramo(t, Testro, Tpal + 0.2));
  const brazoZ = k.suave(k.tramo(t, Tdet, Tbr + 0.2));
  const brazoOff = k.suave(k.tramo(t, Tcae, Tob - 0.05));
  const caida = k.suave(k.tramo(t, Tcae + 0.05, Tob + 0.15));
  const boca = habla * (1 - hablaOff) * (0.4 + 0.6 * Math.abs(Math.sin(t * 12)));

  const px = 560, py = 1040, alto = 820;
  fondo(g, "#071820", "#102030");
  // suelo
  const suelo = g.createLinearGradient(0, 1500, 0, 1920);
  suelo.addColorStop(0, "rgba(0,0,0,0)");
  suelo.addColorStop(1, "#0c1a28");
  g.fillStyle = suelo;
  g.fillRect(0, 1400, 1080, 520);
  motas(g, t, 0.25 * calma);

  persona(g, px, py, alto, { t, anda: 0, boca, brazo: 0.15 + caida * 0.85 });
  cerebro(g, cx, cy, s, { t, vivo: 0.15, habla: habla * calma, hablaOff, brazoZ: brazoZ * calma, brazoOff });

  // cintas de voz que se rompen
  const origen = zonaPantalla(cx, cy, s, "habla");
  const bocaP = [px, py + alto * 0.105 * 0.42];
  const anilloHabla = k.tramo(t, Thabla - 0.05, Thabla + 0.7);
  const anilloBrazo = k.tramo(t, Tbr - 0.05, Tbr + 0.75);
  g.save();
  g.globalCompositeOperation = "lighter";
  if (anilloHabla > 0 && anilloHabla < 1) {
    g.strokeStyle = `rgba(255,190,80,${1 - anilloHabla})`;
    g.lineWidth = 10;
    g.beginPath();
    g.arc(origen[0], origen[1], 30 + anilloHabla * 520, 0, 6.28);
    g.stroke();
  }
  const origenB = zonaPantalla(cx, cy, s, "brazo");
  if (anilloBrazo > 0 && anilloBrazo < 1) {
    g.strokeStyle = `rgba(90,220,255,${1 - anilloBrazo})`;
    g.lineWidth = 10;
    g.beginPath();
    g.arc(origenB[0], origenB[1], 30 + anilloBrazo * 520, 0, 6.28);
    g.stroke();
  }
  g.restore();
  const rotura = k.suave(k.tramo(t, Tpal - 0.05, Tpal + 0.7));
  if (habla > 0.15 && rotura < 0.99) {
    for (let i = 0; i < 4; i++) {
      const u = k.suave(k.tramo(t, Thabla + i * 0.06, Thabla + 0.4 + i * 0.06));
      const corta = k.tramo(rotura, i * 0.08, 0.55 + i * 0.1);
      const x = k.mez(origen[0], bocaP[0] - 80 + i * 70, u) + corta * (i - 1.5) * 40;
      const y = k.mez(origen[1], bocaP[1], u) + corta * (280 + i * 80);
      g.save();
      g.globalAlpha = 1 - corta * 0.3;
      g.translate(x, y);
      g.rotate(-0.4 + i * 0.35 + corta);
      g.fillStyle = i % 2 ? "#ffb43a" : "#ffe7b0";
      k.redondo(g, -110, -36, 220, 72, 18);
      g.fill();
      g.restore();
    }
  }

  // vaso: sigue a la mano y luego cae, y ya está quieto antes del corte
  const m = mano(px, py, alto, 0.15 + caida * 0.85);
  const suelta = k.suave(k.tramo(t, Tob - 0.25, Tob + 0.05));
  const cae = k.suave(k.tramo(t, Tob - 0.05, fin - 0.55));
  const vx = k.mez(m[0], m[0] + 30, cae);
  const vy = k.mez(m[1], 1560, cae);
  const rompe = k.suave(k.tramo(t, fin - 0.7, fin - 0.45));
  if (rompe < 0.95) vaso(g, vx, vy, 1.45, 1 - rompe * 0.15);
  if (rompe > 0.05) {
    g.save();
    g.translate(vx, 1580);
    g.globalAlpha = Math.min(1, rompe * 1.4) * (0.35 + 0.65 * calma);
    g.strokeStyle = "rgba(210,240,250,0.9)";
    g.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      const a = -0.8 + i * 0.4;
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(Math.cos(a) * (18 + rompe * 26), Math.sin(a) * 10 - 6);
      g.stroke();
    }
    g.restore();
  }
  // el charco ya reposa
  if (cae > 0.8) {
    g.fillStyle = `rgba(255,176,70,${0.55 * Math.min(1, (cae - 0.8) / 0.2)})`;
    g.beginPath();
    g.ellipse(vx, 1625, 36, 8, 0, 0, 6.28);
    g.fill();
  }
  velo(g);
}
