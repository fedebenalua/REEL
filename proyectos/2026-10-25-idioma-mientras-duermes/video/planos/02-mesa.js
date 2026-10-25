// La mesa: cuatro teclas. Tras dormir, la secuencia va más rápida. Despierto, casi no cambia.
import * as k from "#kit";
import { v } from "#voz";
import { TECLAS, mano, mesa, tecla, velo } from "../mundo.js";

export const desde = "tarde";
export const entrada = "corte";

const f4 = v.frase(4);
const f5 = v.frase(5);
const f6 = v.frase(6);
const f7 = v.frase(7);
const f8 = v.frase(8);
const f9 = v.frase(9);
const f10 = v.frase(10);
const f11 = v.frase(11);
const f12 = v.frase(12);
const f13 = v.frase(13);
const f14 = v.frase(14);

const Ttarde = f4.inicio;
const Tteclas = f5.t("teclas");
const Tduerme = f6.t("duermes");
const Tmanana = f7.t("manana");
const Trapidos = f7.t("rapidos");
const Tveinte = f8.t("veinte");
const Tfallar = f9.t("fallar");
const Tdespierto = f10.t("despierto");
const Tcambia = f10.t("cambia");
const Tcrea = f11.t("crea");
const Tfirme = f12.t("firme");
const Tojos = f13.t("abiertos");
const Tafianza = f14.t("afianza");
const Tcorte = v.frase(15).inicio;

const XS = [160, 390, 620, 850];
const YK = 1040;

function pulsoTecla(t) {
  let periodo = 0.62;
  let t0 = Ttarde + 0.35;
  if (t >= Tmanana && t < Tdespierto) { periodo = 0.4; t0 = Tmanana; }
  if (t >= Tdespierto && t < Tcrea) { periodo = 0.62; t0 = Tdespierto; }
  if (t >= Tduerme - 0.05 && t < Tmanana) return { i: -1, p: 0 };
  if (t >= Tafianza + 0.45) return { i: 1, p: 0 };
  const u = (t - t0) / periodo;
  const n = Math.floor(u);
  const f = u - n;
  const i = ((n % 4) + 4) % 4;
  const p = f < 0.42 ? Math.sin((f / 0.42) * Math.PI) : 0;
  return { i, p };
}

export function dibuja(g, t) {
  const noche = k.suave(k.tramo(t, Tduerme - 0.15, Tduerme + 0.7)) * (1 - k.suave(k.tramo(t, Tmanana - 0.05, Tmanana + 0.55)));
  const manana = k.suave(k.tramo(t, Tmanana - 0.05, Tmanana + 0.6));
  const vuelveDia = k.suave(k.tramo(t, Tdespierto - 0.1, Tdespierto + 0.55));
  const nocheVista = Math.max(0, noche * (1 - vuelveDia) * (1 - manana));
  mesa(g, t, nocheVista, Math.max(manana * (1 - vuelveDia * 0.2), vuelveDia));

  const queda = k.suave(k.tramo(t, Tteclas - 0.05, Tteclas + 1.55));
  const golpe = pulsoTecla(t);
  const firme = k.suave(k.tramo(t, Tfirme - 0.1, Tfirme + 0.55));
  const sello = k.suave(k.tramo(t, Tafianza - 0.15, Tafianza + 0.5));

  for (let i = 0; i < 4; i++) {
    const llegada = k.suave(k.tramo(t, Tteclas + i * 0.32, Tteclas + i * 0.32 + 0.28));
    const encendida = Math.max(llegada * queda, golpe.i === i ? golpe.p : 0);
    const luz = Math.min(1, encendida * (0.55 + 0.45 * firme) + (golpe.i === i ? golpe.p : 0));
    tecla(g, XS[i], YK, 180, 230, TECLAS[i], luz);
  }

  // una quinta tecla que no llega a crearse
  const nace = k.tramo(t, Tcrea - 0.2, Tcrea + 0.9);
  if (nace > 0 && nace < 1 && sello < 0.15) {
    const s = k.mez(0.35, 1.45, k.suave(Math.min(1, nace * 1.3)));
    const al = Math.sin(Math.min(1, nace) * Math.PI);
    g.save();
    g.globalAlpha = al;
    g.translate(540, 780);
    g.scale(s, s);
    tecla(g, 0, 0, 200, 250, { hex: "#d7dde8", rgb: "215,221,232" }, 0.85);
    g.restore();
  }

  if (golpe.i >= 0) mano(g, XS[golpe.i], YK - 150, golpe.p);
  else mano(g, XS[1], YK - 210, 0);

  // la hilera de toques: de noche se encoge un veinte por ciento; despierto vuelve a su largo
  const muestra = k.suave(k.tramo(t, Tveinte - 0.25, Tveinte + 0.15));
  const aprieta = k.suave(k.tramo(t, Tveinte - 0.05, Tveinte + 0.7));
  const suelta = k.suave(k.tramo(t, Tdespierto, Tcambia + 0.15));
  const sep = k.mez(78, 62, aprieta * (1 - suelta));
  if (muestra > 0.02 && t < Tafianza) {
    const n = 8;
    const ancho = (n - 1) * sep;
    const x0 = 540 - ancho / 2;
    for (let i = 0; i < n; i++) {
      const c = TECLAS[i % 4];
      g.fillStyle = `rgba(${c.rgb},${muestra})`;
      g.beginPath();
      g.arc(x0 + i * sep, 760, 16, 0, 6.2832);
      g.fill();
    }
    const num = muestra * (1 - k.suave(k.tramo(t, Tdespierto - 0.05, Tdespierto + 0.4)));
    if (num > 0.05) k.pastilla(g, 540, 640, "20", "%", "255,214,120", num, 100);
  }

  // sin fallar más: tres ticks verdes, ninguno rojo
  const bien = k.suave(k.tramo(t, Tfallar - 0.1, Tfallar + 0.55)) * (1 - k.suave(k.tramo(t, Tdespierto, Tdespierto + 0.4)));
  if (bien > 0.03) {
    for (let i = 0; i < 4; i++) {
      const a = bien * k.suave(k.tramo(t, Tfallar + i * 0.12, Tfallar + i * 0.12 + 0.2));
      g.save();
      g.globalAlpha = a;
      g.strokeStyle = "#b6ff6a";
      g.lineWidth = 8;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(XS[i] - 16, YK + 150);
      g.lineTo(XS[i] - 4, YK + 166);
      g.lineTo(XS[i] + 20, YK + 136);
      g.stroke();
      g.restore();
    }
  }

  // la secuencia se pone más firme: un anillo que se abre
  const ondaFirme = k.tramo(t, Tfirme - 0.05, Tfirme + 0.85);
  if (ondaFirme > 0 && ondaFirme < 1) {
    g.save();
    g.strokeStyle = `rgba(255,210,120,${1 - ondaFirme})`;
    g.lineWidth = 18;
    g.beginPath();
    g.arc(540, YK, k.mez(40, 560, k.suave(ondaFirme)), 0, 6.2832);
    g.stroke();
    g.restore();
  }
  // ojos abiertos: entran de golpe, parpadean grandes y se van
  const entraO = k.suave(k.tramo(t, Tojos - 1.7, Tojos - 1.25));
  const saleO = k.suave(k.tramo(t, Tojos + 0.45, Tojos + 0.9));
  const vis = entraO * (1 - saleO);
  if (vis > 0.02) {
    const parpado = 0.35 + 0.65 * Math.abs(Math.sin(t * 7));
    g.save();
    g.translate(540, 860);
    g.scale(2.6, 2.6);
    g.globalAlpha = vis;
    g.fillStyle = "#fff6ee";
    g.beginPath();
    g.ellipse(-100, 0, 78, 46 * parpado, 0, 0, 6.2832);
    g.ellipse(100, 0, 78, 46 * parpado, 0, 0, 6.2832);
    g.fill();
    g.fillStyle = "#1c2838";
    g.beginPath();
    g.arc(-100, 0, 20 * parpado, 0, 6.2832);
    g.arc(100, 0, 20 * parpado, 0, 6.2832);
    g.fill();
    g.restore();
  }
  // el sello de oro barre las teclas y se queda el marco
  const barre = k.tramo(t, Tafianza - 1.55, Tafianza - 0.55);
  if (barre > 0 && barre < 1) {
    g.save();
    g.globalAlpha = Math.sin(barre * Math.PI) * 0.72;
    g.fillStyle = "#ffd27a";
    g.fillRect(0, 860, k.suave(barre) * 1080, 420);
    g.restore();
  }
  k.fogonazo(g, 540, YK, t - Tafianza, 1100, "255,214,140");

  // el sello de oro sobre las cuatro, quieto antes del corte
  if (sello > 0.02) {
    g.save();
    g.globalAlpha = sello;
    g.strokeStyle = "rgba(255,206,110,0.95)";
    g.lineWidth = 10;
    k.redondo(g, 70, YK - 150, 870, 300, 36);
    g.stroke();
    g.restore();
    k.brillo(g, 540, YK, 700, "255,200,90", 0.2 * sello * (t < Tcorte - 0.25 ? 1 : 0.35));
  }

  // reposo: en el último trecho no late el brillo
  velo(g, nocheVista > 0.5 ? 0.7 : 0.62);
}
