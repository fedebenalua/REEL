// «El primer test de inteligencia no lo encargó ningún ministro. Los libros dicen que Francia contrató a un hombre
// para puntuar a los niños.»
// Despacho de mármol. Fotograma 0: el sello de lacre ya está rajado y llena la pantalla. La cámara sale, el centro
// queda vacío, y baja al libro. En «puntuar» la página se rasga. Reposa antes del corte.
import * as k from "#kit";
import { v } from "#voz";
import { sello, velo } from "../mundo.js";

export const desde = 0;

const Tmin = v.t("ministro");
const Tlib = v.t("libros");
const Tpun = v.t("puntuar");
const Tcorte = v.t("habia") - 0.05;

const az = k.azar(11);
const GOTAS = Array.from({ length: 26 }, () => ({
  ang: az() * 6.2832,
  v: 0.9 + az() * 1.8,
  elev: 0.35 + az() * 1.1,
  s: 0.05 + az() * 0.11,
  ret: az() * 0.35,
}));

function camara(t) {
  const sale = 1 - Math.exp(-Math.max(0, t) * 1.25);
  const z = 1.85 + 3.15 * sale;
  const y = 0.12 + 0.28 * sale;
  const baja = k.entra(k.tramo(t, Tlib - 0.15, Tpun + 0.15));
  const reposo = k.suave(k.tramo(t, Tpun + 0.55, Tcorte - 0.12));
  const pos = [
    k.mez(0.08 * (1 - sale), 0, baja),
    k.mez(y, -1.45, baja),
    k.mez(z, 2.05, baja),
  ];
  const mira = [0, k.mez(0.05, -1.72, baja), 0];
  const quieta = k.mira([0, -1.48, 2.22], [0, -1.72, 0]);
  const ahora = k.mira(pos, mira);
  return {
    p: k.mezV(ahora.p, quieta.p, reposo),
    e: {
      f: k.mezV(ahora.e.f, quieta.e.f, reposo),
      r: k.mezV(ahora.e.r, quieta.e.r, reposo),
      u: k.mezV(ahora.e.u, quieta.e.u, reposo),
    },
  };
}

function fondo(g, cam) {
  const h = g.createLinearGradient(0, 0, 0, 1920);
  h.addColorStop(0, "#14080e");
  h.addColorStop(0.45, "#4a1826");
  h.addColorStop(1, "#1a0a10");
  g.fillStyle = h;
  g.fillRect(0, 0, 1080, 1920);
  const luz = g.createRadialGradient(540, 280, 20, 540, 700, 980);
  luz.addColorStop(0, "rgba(255,186,90,0.38)");
  luz.addColorStop(1, "rgba(255,186,90,0)");
  g.fillStyle = luz;
  g.fillRect(0, 0, 1080, 1920);
  // columnas
  for (const x of [-2.4, 2.4]) {
    const abajo = k.proyecta(cam, [x, -2.2, 0]);
    const arriba = k.proyecta(cam, [x, 2.6, 0]);
    if (!abajo || !arriba) continue;
    const w = k.tamano(0.38, abajo.z);
    const grd = g.createLinearGradient(abajo.x - w, 0, abajo.x + w, 0);
    grd.addColorStop(0, "#3a121c");
    grd.addColorStop(0.45, "#a85068");
    grd.addColorStop(1, "#2a0c14");
    g.fillStyle = grd;
    g.fillRect(abajo.x - w / 2, arriba.y, w, abajo.y - arriba.y);
    g.fillStyle = "#f0c14d";
    g.fillRect(abajo.x - w * 0.7, arriba.y, w * 1.4, w * 0.28);
  }
}

function cuadernos(g, cam) {
  for (let i = 0; i < 4; i++) {
    const p = k.proyecta(cam, [0, -0.55 - i * 0.06, 0.15]);
    if (!p) continue;
    const w = k.tamano(1.15, p.z), h = k.tamano(0.16, p.z);
    g.fillStyle = i % 2 ? "#f4e2c4" : "#d7efe8";
    k.redondo(g, p.x - w / 2, p.y - h / 2, w, h, 10);
    g.fill();
  }
}

function libro(g, cam, t) {
  const entra = k.entra(k.tramo(t, Tlib - 0.35, Tlib + 0.45));
  const p = { x: 540, y: k.mez(1680, 1120, entra), z: 2 };
  const s = k.mez(200, 520, entra);
  const rasga = k.suave(k.tramo(t, Tpun - 0.08, Tpun + 0.55));
  g.save();
  g.translate(p.x, p.y);
  // tapa
  k.redondo(g, -s * 1.05, -s * 0.72, s * 2.1, s * 1.5, 28);
  g.fillStyle = "#6e1d2a";
  g.fill();
  // página
  g.save();
  g.beginPath();
  g.rect(-s * 0.95, -s * 0.62, s * 1.9 * (1 - rasga * 0.45), s * 1.3);
  g.clip();
  k.redondo(g, -s * 0.95, -s * 0.62, s * 1.9, s * 1.3, 12);
  g.fillStyle = "#fff4df";
  g.fill();
  pagina(g, s);
  g.restore();
  // el trozo que se va
  if (rasga > 0.02) {
    g.save();
    g.translate(s * 0.55 + rasga * s * 0.85, -s * 0.1 + rasga * s * 0.45);
    g.rotate(rasga * 0.55);
    g.beginPath();
    g.moveTo(-s * 0.15, -s * 0.55);
    g.lineTo(s * 0.7, -s * 0.4);
    g.lineTo(s * 0.85, s * 0.45);
    g.lineTo(0, s * 0.6);
    g.closePath();
    g.fillStyle = "#fff4df";
    g.fill();
    g.fillStyle = "#d4252e";
    g.font = `800 ${Math.round(s * 0.16)}px Figtree`;
    g.textAlign = "center";
    g.fillText("12", s * 0.35, s * 0.05);
    g.restore();
  }
  g.restore();
}

function figura(g, x, y, h, ropa) {
  g.fillStyle = ropa;
  k.redondo(g, x - h * 0.32, y - h * 0.05, h * 0.64, h * 0.7, h * 0.18);
  g.fill();
  g.beginPath();
  g.arc(x, y - h * 0.32, h * 0.22, 0, 6.3);
  g.fillStyle = "#f0c2a0";
  g.fill();
  g.fillStyle = "#3a2418";
  g.beginPath();
  g.ellipse(x, y - h * 0.4, h * 0.22, h * 0.16, 0, Math.PI, 0);
  g.fill();
}

function pagina(g, s) {
  figura(g, -s * 0.28, -s * 0.22, s * 0.42, "#243046");
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = Math.max(4, s * 0.015);
  g.beginPath();
  g.moveTo(-s * 0.05, -s * 0.12);
  g.quadraticCurveTo(s * 0.12, -s * 0.22, s * 0.2, -s * 0.08);
  g.stroke();
  for (let i = 0; i < 3; i++) {
    const x = -s * 0.42 + i * s * 0.38;
    figura(g, x, s * 0.22, s * 0.34, ["#1f7a72", "#e0a030", "#c45a78"][i]);
    g.beginPath();
    g.arc(x + s * 0.16, s * 0.02, s * 0.1, 0, 6.3);
    g.fillStyle = "#d4252e";
    g.fill();
    g.fillStyle = "#fff";
    g.font = `800 ${Math.round(s * 0.09)}px Figtree`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(String(i + 1), x + s * 0.16, s * 0.03);
  }
}

function gotas(g, cam, t) {
  const cosas = [];
  for (const d of GOTAS) {
    const u = t - 0.12 - d.ret;
    if (u < 0 || u > 2.6) continue;
    const x = Math.cos(d.ang) * d.v * u;
    const y = 0.15 + d.elev * u - 1.35 * u * u;
    const z = 0.15 + Math.sin(d.ang) * d.v * u * 0.35;
    const p = k.proyecta(cam, [x, y, z]);
    if (!p) continue;
    cosas.push({ z: p.z, dibuja: () => {
      const r = k.tamano(d.s, p.z);
      const c = g.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, r * 0.1, p.x, p.y, r);
      c.addColorStop(0, "#ff8d86");
      c.addColorStop(1, "#8e1420");
      g.beginPath();
      g.arc(p.x, p.y, r, 0, 6.3);
      g.fillStyle = c;
      g.fill();
    } });
  }
  k.deLejosACerca(cosas);
}

export function dibuja(g, t) {
  const cam = camara(Math.min(t, Tcorte));
  fondo(g, cam);
  cuadernos(g, cam);
  const ps = k.proyecta(cam, [0, 0.12, 0]);
  if (ps) {
    const r = k.tamano(1.35, ps.z);
    const grieta = k.mez(0.45, 1, k.suave(k.tramo(t, 0, Tmin)));
    g.save();
    g.translate(ps.x, ps.y);
    sello(g, r, grieta);
    g.restore();
  }
  gotas(g, cam, t);
  const entraLibro = k.suave(k.tramo(t, Tlib - 0.45, Tlib + 0.15));
  if (entraLibro > 0.01) {
    g.save();
    g.globalAlpha = entraLibro;
    libro(g, cam, t);
    g.restore();
  }
  velo(g, 0.82);
}
