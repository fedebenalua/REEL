// Hasta 2030, más empleos nuevos que perdidos. Los treinta años, niebla. Luego, el puesto compartido.
import * as k from "#kit";
import { v } from "#voz";
import { brazo, chispas, fabricaVuelo, fondoNave, operario, panelCoche, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(8).inicio;
export const entrada = "corte";

const f8 = v.frase(8);
const f9 = v.frase(9);
const f10 = v.frase(10);
const f11 = v.frase(11);
const Tnuevos = f8.t("nuevos");
const Ttend = f8.t("tendencias");
const Tmed = f9.t("medido");
const Tesp = f9.t("especulacion");
const Tdes = f10.t("desaparece");
const Trep = f10.t("repite");
const Tamigo = f11.t("amigo");

const lienzoA = k.lienzo(1080, 1920);
const lienzoB = k.lienzo(1080, 1920);

function pintar(lienzo, fn) {
  const c = lienzo.getContext("2d");
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.globalAlpha = 1;
  c.globalCompositeOperation = "source-over";
  c.clearRect(0, 0, 1080, 1920);
  fn(c);
  return lienzo;
}

function cubo(g, x, y, s, cara, lado, tapa) {
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + s, y + s * 0.28);
  g.lineTo(x + s, y + s * 0.28 + s * 0.72);
  g.lineTo(x, y + s * 0.72);
  g.closePath();
  g.fillStyle = cara;
  g.fill();
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x - s * 0.72, y + s * 0.22);
  g.lineTo(x - s * 0.72, y + s * 0.22 + s * 0.72);
  g.lineTo(x, y + s * 0.72);
  g.closePath();
  g.fillStyle = lado;
  g.fill();
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + s, y + s * 0.28);
  g.lineTo(x + s - s * 0.72, y + s * 0.28 + s * 0.22);
  g.lineTo(x - s * 0.72, y + s * 0.22);
  g.closePath();
  g.fillStyle = tapa;
  g.fill();
}

function monton(g, x, y, n, pal, t) {
  let puesto = 0;
  for (let fila = 0; fila < 4; fila++) {
    const cuenta = 4 - fila;
    for (let i = 0; i < cuenta; i++) {
      const u = k.entra(k.tramo(t, 0.04 * puesto, 0.04 * puesto + 0.22));
      if (u > 0.02 && puesto < n) {
        const s = 64;
        const cx = x + (i - (cuenta - 1) / 2) * 78;
        const cy = y - fila * 40 - (1 - u) * 30;
        g.globalAlpha = u;
        cubo(g, cx, cy, s, pal[0], pal[1], pal[2]);
        g.globalAlpha = 1;
      }
      puesto++;
    }
  }
}

function escenario(g, t) {
  const fondo = g.createLinearGradient(0, 0, 0, 1920);
  fondo.addColorStop(0, "#071018");
  fondo.addColorStop(0.4, "#102033");
  fondo.addColorStop(1, "#1a140e");
  g.fillStyle = fondo;
  g.fillRect(0, 0, 1080, 1920);
  const suelo = g.createLinearGradient(0, 900, 0, 1600);
  suelo.addColorStop(0, "rgba(45,212,191,0.18)");
  suelo.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = suelo;
  g.fillRect(0, 900, 1080, 700);

  const crece = k.suave(k.tramo(t, f8.inicio, Tnuevos + 0.35));
  const nVan = Math.round(k.mez(5, 6, crece));
  const nNuevos = Math.round(k.mez(8, 10, crece));
  monton(g, 300, 1240, nVan, ["#9f1239", "#4c0519", "#fb7185"], t - f8.inicio);
  monton(g, 780, 1160, nNuevos, ["#d97706", "#7c2d12", "#fde68a"], t - f8.inicio + 0.2);

  const et = k.entra(k.tramo(t, Tnuevos - 0.05, Tnuevos + 0.28));
  if (et > 0.05) {
    k.etiqueta(g, 160, 760, "se van", "251,113,133", et, 42);
    k.etiqueta(g, 620, 680, "nuevos", "253,224,71", et, 42);
  }

  // Varios colores: todas las tendencias, no una sola.
  const flujo = k.suave(k.tramo(t, Ttend - 0.4, Ttend + 0.6));
  if (flujo > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const cols = ["56,189,248", "74,222,128", "244,114,182", "167,139,250"];
    cols.forEach((c, i) => {
      const u = (k.tramo(t, Ttend - 0.5, Ttend + 1.2) + i * 0.18) % 1;
      const x = k.mez(120 + i * 40, 760, u);
      const y = k.mez(560, 1080, u);
      k.brillo(g, x, y, 90, c, flujo * (1 - Math.abs(u - 0.6)));
    });
    g.restore();
  }

  // La niebla de lo que nadie ha medido. Sin cifra.
  const niebla = k.suave(k.tramo(t, Tmed - 0.55, Tesp + 0.15));
  if (niebla > 0.02) {
    const camino = g.createLinearGradient(540, 1500, 540, 700);
    camino.addColorStop(0, "rgba(30,41,59,0)");
    camino.addColorStop(1, `rgba(148,163,184,${0.35 * niebla})`);
    g.fillStyle = camino;
    g.beginPath();
    g.moveTo(430, 1280);
    g.lineTo(650, 1280);
    g.lineTo(590, 760);
    g.lineTo(490, 760);
    g.fill();
    const fog = g.createLinearGradient(0, 560, 0, 1100);
    fog.addColorStop(0, `rgba(186,210,230,${0.05 * niebla})`);
    fog.addColorStop(0.4, `rgba(203,213,225,${0.55 * niebla})`);
    fog.addColorStop(1, `rgba(148,163,184,0)`);
    g.fillStyle = fog;
    g.fillRect(0, 520, 1080, 620);
  }
}

function compartido(g, t) {
  fondoNave(g);
  const s = 2.3;
  panelCoche(g, 500, 980, s, 1);
  operario(g, 760, 1240, 500, t, { brazo: -0.55 });
  const ciclo = Math.sin(t * 3.2);
  const tip = brazo(g, 300, 1160, 1.45, t, 0.3);
  const toma = k.suave(k.tramo(t, Trep - 0.45, Trep + 0.2));
  // El cordón que se repite pasa al robot. La persona se queda la lámpara.
  g.save();
  g.strokeStyle = `rgba(255,170,60,${0.4 + 0.6 * toma})`;
  g.lineWidth = 10;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(430, 930);
  g.lineTo(k.mez(520, tip.x, toma), k.mez(1040, tip.y, 0.35 + 0.4 * Math.max(ciclo, 0) * toma));
  g.stroke();
  g.restore();
  chispas(g, tip.x, tip.y, t, 0.35 + 0.5 * toma, 0.4);
  // La lámpara, en la mano de la persona: lo que no se repite.
  k.brillo(g, 700, 1040, 70, "amarilla", 0.55);
  g.fillStyle = "#fef3c7";
  g.beginPath();
  g.arc(700, 1040, 16, 0, 6.2832);
  g.fill();
}

export function dibuja(g, t) {
  const llega = k.suave(k.tramo(t, Tdes - 0.55, Tdes + 0.35));
  const vuelve = k.suave(k.tramo(t, Tamigo - 0.15, Tamigo + 1.15));
  if (vuelve > 0.985) {
    fabricaVuelo(g, 0);
    velo(g);
    return;
  }
  if (llega < 0.02) {
    escenario(g, t);
    velo(g);
    return;
  }
  if (vuelve < 0.02) {
    if (llega > 0.985) {
      compartido(g, t);
      velo(g);
      return;
    }
    pintar(lienzoA, (c) => { escenario(c, t); velo(c); });
    pintar(lienzoB, (c) => { compartido(c, t); velo(c); });
    g.drawImage(lienzoA, 0, 0);
    g.save();
    g.globalAlpha = llega;
    g.drawImage(lienzoB, 0, 0);
    g.restore();
    return;
  }
  pintar(lienzoA, (c) => { compartido(c, t); velo(c); });
  pintar(lienzoB, (c) => { fabricaVuelo(c, 0); velo(c); });
  g.drawImage(lienzoA, 0, 0);
  g.save();
  g.globalAlpha = vuelve;
  g.drawImage(lienzoB, 0, 0);
  g.restore();
}
