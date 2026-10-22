// El hook, lo que comparten las dos aperturas (planos/01-hook.js y aperturas/01-viaje.js):
// - «lleno»: la gasolina tapa la punta de la pistola y clac: el chorro se corta en seco, con un fogonazo.
// - «si no tiene ni un cable»: la pistola se vuelve de cristal (dentro, tubos y gasolina; ni un cable).
// - «Y si sigues apretando»: el gatillo se aprieta otra vez y la gasolina sube por el cuello; «salta»: clac otra vez.
// - «lo paga tu coche»: la cámara se aleja hasta ver el coche; la gasolina rebosa y chorrea por la pintura; en «coche»,
//   dentro del coche se enciende en rojo el filtro de carbón.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "./mundo.js";

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
export const Tlle = f1.t("lleno"), Tsi = f1.t("si"), Tcab = f1.t("cable");
export const Tclac = Tlle + 0.14;
export const Tapr = f2.t("apretando"), Tsal = f2.t("salta"), Tlo = f2.t("lo"), Tcoc = f2.t("coche"), Fin2 = f2.fin;
export const Tclac2 = Tsal + 0.06;
export const EUROS_CLAC = 47.83;

// El nivel de la gasolina en el cuello (mm desde la boca) en cada segundo, para la apertura que empieza abajo.
const NIV_TAPA = m.METIDO - 22; // por encima del agujerito
export function nivel(t, desde = 330) {
  if (t < Tclac) return mez(desde, NIV_TAPA, Math.pow(tr(t, 0, Tclac), 0.85));
  if (t < Tapr) return NIV_TAPA - 4 * Math.sin((t - Tclac) * 9) * Math.exp(-(t - Tclac) * 4);
  return mez(NIV_TAPA, -24, su(tr(t, Tapr, Tclac2)));
}
export const gatillo = (t) => (t < Tclac ? 1 : t < Tapr - 0.08 ? 1 - entra(tr(t, Tclac, Tclac + 0.08)) : t < Tclac2 ? entra(tr(t, Tapr - 0.08, Tapr + 0.1)) : 1 - entra(tr(t, Tclac2, Tclac2 + 0.08)));
export const fluye = (t) => (t < Tclac ? 1 : t < Tapr ? 0 : t < Tclac2 ? su(tr(t, Tapr - 0.02, Tapr + 0.12)) : 0);
export const euros = (t) => mez(31.2, EUROS_CLAC, Math.min(1, t / Tclac));

// La cámara de después del primer clac: se aleja del cuello a la pistola entera, y en «lo paga» hasta el coche.
export const CAM_PISTOLA = [2.2, m.dePistola({ x: -30, y: 30 }).x, m.dePistola({ x: -30, y: 30 }).y - 110];
export const CAM_COCHE = [0.5, 900, -1060];
const CAM_PISTOLA2 = [2.45, CAM_PISTOLA[1] + 40, CAM_PISTOLA[2] + 10];
// Después de «cable»: la cámara se acerca despacio a la pistola mientras se aprieta el gatillo; en «lo paga», al coche.
export function camDespues(t, c) {
  if (t > Tcab + 0.15) c = m.mezCam(CAM_PISTOLA, CAM_PISTOLA2, su(tr(t, Tcab + 0.15, Tclac2)));
  if (t > Tlo - 0.1) c = m.mezCam(CAM_PISTOLA2, CAM_COCHE, su(tr(t, Tlo - 0.1, Tcoc + 0.2)));
  return c;
}

// Lo que se ve, con la cámara que toque. rayos: el coche, de cristal (0 a 1); cristal: la pistola, de cristal.
export function escena(g, t, cam, { rayos, cristal, filtroRojo = 0, oro = 0 }) {
  const [Z, cx, cy] = cam;
  m.fondo(g, t, rayos, cy * Z);
  m.vista(g, Z, cx, cy);
  m.suelo(g, t, 0);
  m.surtidor(g, t, { euros: euros(t), litros: euros(t) / 1.619 });
  m.coche(g, t, { rayos });
  const n = nivel(t);
  if (rayos > 0.01) {
    m.deposito(g, t, { nivel: 0.97, hueco: 0.3, al: rayos });
    m.tuboVapor(g, t, { al: rayos, vapor: 0.6 });
    m.filtro(g, t, { al: Math.max(rayos, filtroRojo), roto: filtroRojo, vapor: 0.6 });
    m.cuello(g, t, { nivel: n, agita: 0.35 + 0.65 * fluye(t), al: rayos });
    m.chorro(g, t, { fuerza: fluye(t), nivel: n });
  }
  rebosa(g, t);
  m.manguera(g, t, { rayos: Math.max(cristal, oro), lleno: 1, corre: Math.max(oro, cristal) * fluye(t) });
  const gat = gatillo(t), cierra = t < Tclac ? 0 : t < Tapr ? 1 : t < Tclac2 ? 1 - su(tr(t, Tapr - 0.05, Tapr + 0.1)) : 1;
  m.pistola(g, t, { cristal, flujo: fluye(t), aire: t < Tclac ? 1 : 0, gatillo: gat, muelle: cierra, membrana: cierra * 0.6, vacio: 0 });
  // los fogonazos de los dos clac, en la punta
  const sx = 540 + (m.PUNTA.x - cx) * Z, sy = 960 + (m.PUNTA.y - cy) * Z;
  m.destello(g, sx, sy, 0.9 * k.pulso(t, Tclac + 0.03, 0.07), "255,236,190");
  m.destello(g, sx, sy, 0.7 * k.pulso(t, Tclac2 + 0.03, 0.07), "255,236,190");
  m.sinVista(g);
  // el barrido de los rayos X: una franja de luz azul que cruza la pantalla mientras todo se vuelve de cristal
  const ub = tr(t, Tsi - 0.05, Tcab + 0.1);
  if (ub > 0 && ub < 1) {
    const x = mez(-150, 1230, su(ub));
    g.save(); g.globalCompositeOperation = "lighter";
    const bg = g.createLinearGradient(x - 160, 0, x + 40, 0); bg.addColorStop(0, "rgba(90,190,255,0)"); bg.addColorStop(0.8, "rgba(120,210,255,0.35)"); bg.addColorStop(1, "rgba(230,250,255,0.9)");
    g.fillStyle = bg; g.fillRect(x - 160, 0, 200, 1920); g.restore();
  }
  m.vineta(g, 0.5);
  m.velo(g, 0.55);
}

// La gasolina que rebosa por la boca y chorrea por la chapa del coche (desde que el nivel pasa la boca).
const az = k.azar(4242);
const REGUEROS = Array.from({ length: 6 }, (_, i) => ({ dx: -50 + i * 22 + az() * 10, largo: 120 + az() * 160, v: 0.8 + az() * 0.5, d: az() * 0.25 }));
function rebosa(g, t) {
  const t0 = Tclac2 - 0.25;
  if (t < t0) return;
  const u = t - t0;
  g.save();
  // el charco en la boca
  k.brillo(g, m.BOCA.x, m.BOCA.y + 30, 260, m.GASOLINA, 0.5 * Math.min(1, u * 3));
  for (const r of REGUEROS) {
    const L = r.largo * su(Math.min(1, Math.max(0, (u - r.d) * r.v))), x = m.BOCA.x + r.dx;
    if (L < 2) continue;
    const y0 = m.BOCA.y + 30;
    const gg = g.createLinearGradient(0, y0, 0, y0 + L); gg.addColorStop(0, `rgba(${m.GAS_CLARO},0.95)`); gg.addColorStop(1, `rgba(${m.GASOLINA},0.85)`);
    g.strokeStyle = gg; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y0); g.quadraticCurveTo(x + 6, y0 + L * 0.5, x - 4, y0 + L); g.stroke();
    g.fillStyle = `rgba(${m.GASOLINA},0.95)`; g.beginPath(); g.ellipse(x - 4, y0 + L + 4, 8, 11, 0, 0, 6.2832); g.fill();
    // gotas que se sueltan y caen
    for (let i = 0; i < 2; i++) { const w = (u * 1.1 + i * 0.5 + r.d) % 1; if (u < 0.6) continue; g.fillStyle = `rgba(${m.GASOLINA},${0.9 * (1 - w)})`; g.beginPath(); g.ellipse(x - 4, y0 + L + 10 + w * w * 500, 6, 9, 0, 0, 6.2832); g.fill(); }
  }
  g.restore();
}
