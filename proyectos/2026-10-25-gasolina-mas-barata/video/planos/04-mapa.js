// «Primero: el Gobierno tiene un mapa gratis con el precio de cada gasolinera de España, y se actualiza cada cinco
// minutos.»
// Un móvil grande con el mapa de gasolineras. Se entra con un corte en «Primero».
// - «Primero»: el móvil entra desde abajo, girando, con el mapa de calles encendido.
// - «mapa»: caen las chinchetas de las gasolineras, una detrás de otra.
// - «precio»: cada una enseña su precio; la más barata, en verde, late.
// - «de España»: el mapa se aleja hasta España entera, llena de puntos de luz.
// - «se actualiza»: vuelve a la calle; «cada cinco minutos»: la flecha de recarga da la vuelta y los precios ruedan.
import * as k from "#kit";
import { v } from "#voz";
import { bokeh, chincheta, velo, VERDE, ROJO, AMBAR } from "../mundo.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f4 = v.frase(4);
const T0 = f4.inicio, Tmapa = f4.t("mapa"), Tpre = f4.t("precio"), Tesp = f4.t("espana"), Tact = f4.t("actualiza"), Tcin = f4.t("cinco"), Fin = f4.fin;
const Tcaen = Tmapa - 0.1, Tlejos = Tesp + 0.35, Tvuelve = Tact - 0.3, Tcerca = Tact + 0.25, Trecarga = Tcin - 0.3, Truedan = Tcin;
export const momentos = { caen: Tcaen, precios: Tpre, lejos: Tlejos, recarga: Truedan };

// ---------------------------------------------------------------- el mapa de calles (se dibuja una vez)
const MW = 1600, MH = 1600;
const mapaCalles = (() => {
  const c = k.lienzo(MW, MH), x = c.getContext("2d"), az = azar(404);
  x.fillStyle = "#1a2133"; x.fillRect(0, 0, MW, MH);
  // parques
  for (let i = 0; i < 14; i++) { x.fillStyle = "rgba(40,110,70,0.55)"; k.redondo(x, az() * MW, az() * MH, 80 + az() * 160, 60 + az() * 140, 20); x.fill(); }
  // el río
  x.strokeStyle = "#1f4f8f"; x.lineWidth = 46; x.lineCap = "round"; x.beginPath(); x.moveTo(-50, 1250); x.bezierCurveTo(400, 1050, 700, 1350, 1000, 1150); x.bezierCurveTo(1250, 980, 1450, 1100, 1700, 950); x.stroke();
  x.save(); x.translate(MW / 2, MH / 2); x.rotate(0.22); x.translate(-MW, -MH);
  // calles pequeñas
  x.strokeStyle = "#2c3750"; x.lineWidth = 10;
  for (let i = 0; i < 3200; i += 70 + az() * 40) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 3200); x.stroke(); x.beginPath(); x.moveTo(0, i); x.lineTo(3200, i); x.stroke(); }
  // avenidas
  x.strokeStyle = "#56668c"; x.lineWidth = 24;
  for (const p of [900, 1450, 1900, 2350]) { x.beginPath(); x.moveTo(p, 0); x.lineTo(p, 3200); x.stroke(); x.beginPath(); x.moveTo(0, p + 120); x.lineTo(3200, p + 120); x.stroke(); }
  x.strokeStyle = "#e0a85a"; x.lineWidth = 30; x.beginPath(); x.moveTo(0, 3000); x.lineTo(3200, 300); x.stroke();
  x.restore();
  return c;
})();

// ---------------------------------------------------------------- España, con sus gasolineras (se dibuja una vez)
const COSTA = [[-9.3, 43.0], [-8.0, 43.7], [-7.0, 43.56], [-5.8, 43.6], [-4.5, 43.42], [-3.0, 43.42], [-1.8, 43.35], [-1.0, 43.05], [0.0, 42.7], [1.0, 42.6], [2.0, 42.42], [3.2, 42.3], [3.2, 41.9], [2.2, 41.3], [1.0, 41.05], [0.5, 40.6], [-0.2, 39.9], [0.2, 38.75], [-0.5, 38.3], [-0.8, 37.6], [-1.6, 37.3], [-2.1, 36.75], [-3.0, 36.75], [-4.4, 36.7], [-5.3, 36.15], [-5.6, 36.0], [-6.3, 36.5], [-6.4, 36.85], [-7.4, 37.2], [-7.5, 37.6], [-7.0, 38.0], [-7.3, 38.5], [-7.0, 39.0], [-7.5, 39.7], [-6.9, 40.2], [-6.8, 41.0], [-6.2, 41.6], [-6.6, 41.95], [-7.2, 41.9], [-8.2, 42.05], [-8.9, 41.9], [-8.9, 42.5]];
const ISLAS = [[2.95, 39.6, 0.5, 0.28], [4.1, 39.98, 0.25, 0.12], [1.42, 38.98, 0.2, 0.15]];
const EW = 1200, EH = 1000, KE = 88;
const ex = (lon) => EW / 2 + (lon + 3.4) * KE, ey = (lat) => EH / 2 - (lat - 40.0) * KE * 1.3;
const espana = (() => {
  const c = k.lienzo(EW, EH), x = c.getContext("2d"), az = azar(808);
  x.fillStyle = "#121a2b"; x.fillRect(0, 0, EW, EH);
  const camino = () => { x.beginPath(); COSTA.forEach(([lo, la], i) => (i ? x.lineTo(ex(lo), ey(la)) : x.moveTo(ex(lo), ey(la)))); x.closePath(); for (const [lo, la, rx, ry] of ISLAS) { x.moveTo(ex(lo) + rx * KE, ey(la)); x.ellipse(ex(lo), ey(la), rx * KE, ry * KE * 1.3, 0, 0, 6.2832); } };
  camino(); x.fillStyle = "#26314a"; x.fill(); x.strokeStyle = "rgba(160,190,255,0.6)"; x.lineWidth = 4; x.stroke();
  // las gasolineras: más donde vive más gente
  const ciudades = [[-3.7, 40.42, 1.2], [2.17, 41.39, 1], [-0.38, 39.47, 0.7], [-5.98, 37.39, 0.7], [-2.93, 43.26, 0.5], [-0.89, 41.65, 0.4], [-4.42, 36.72, 0.5], [-1.13, 37.98, 0.4], [-8.4, 43.36, 0.3], [-4.72, 41.65, 0.3]];
  x.save(); camino(); x.clip(); x.globalCompositeOperation = "lighter";
  const cols = [VERDE, AMBAR, ROJO, AMBAR];
  for (let i = 0; i < 2600; i++) {
    let px, py;
    if (az() < 0.3) { const cdd = ciudades[Math.floor(az() * ciudades.length)], r = Math.pow(az(), 0.5) * 1.1 * cdd[2], a = az() * 6.2832; px = ex(cdd[0] + Math.cos(a) * r); py = ey(cdd[1] + Math.sin(a) * r * 0.8); }
    else { px = ex(-9.4 + az() * 12.8); py = ey(35.9 + az() * 7.9); }
    const col = cols[Math.floor(az() * cols.length)];
    x.fillStyle = `rgba(${col},0.22)`; x.beginPath(); x.arc(px, py, 7, 0, 6.2832); x.fill();
    x.fillStyle = `rgba(${col},0.95)`; x.beginPath(); x.arc(px, py, 2.4, 0, 6.2832); x.fill();
  }
  x.restore();
  return c;
})();

// ---------------------------------------------------------------- las gasolineras de la calle
const PINES = [
  [-170, -330, 152, 149], [140, -250, 149, 154], [-40, -90, 135, 132], [210, 40, 158, 156], [-210, 120, 147, 151],
  [60, 250, 155, 159], [-120, 400, 150, 146], [200, 430, 161, 158],
];
const BARATA = 2;

function tag(g, x, y, viejo, nuevo, u, barata, al) {
  const txt = (c) => `${Math.floor(c / 100)},${String(c % 100).padStart(2, "0")}`;
  const w = 150, h = 62, col = barata ? VERDE : "255,255,255";
  g.save(); g.globalAlpha *= al;
  k.redondo(g, x - w / 2, y - h / 2, w, h, 18); g.fillStyle = barata ? "rgba(10,60,30,0.95)" : "rgba(10,14,24,0.92)"; g.fill();
  g.strokeStyle = `rgba(${col},0.7)`; g.lineWidth = 3; g.stroke();
  g.clip();
  g.font = "800 42px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = `rgb(${col})`;
  const e = su(u);
  if (e < 1) g.fillText(txt(viejo), x, y + 2 - e * h);
  if (e > 0) g.fillText(txt(nuevo), x, y + 2 + (1 - e) * h);
  g.restore();
}

export function dibuja(g, t) {
  g.fillStyle = "#08060f"; g.fillRect(0, 0, 1080, 1920);
  bokeh(g, t, 0.9);
  // el móvil entra desde abajo girando
  const entra = k.entra(tr(t, T0 - 0.05, T0 + 0.55));
  const X = 540, Y = mez(1900, 1060, entra), ang = mez(0.5, 0, entra) + 0.015 * Math.sin(t * 0.9);
  const esc = 0.86 * mez(0.9, 1, entra) * (1 + 0.04 * su(tr(t, T0, Fin)));
  const W = 640, H = 1300, sw = W - 40, sh = H - 40;
  g.save(); g.translate(X, Y); g.rotate(ang); g.scale(esc, esc);
  g.save(); g.shadowColor = "rgba(0,0,0,0.8)"; g.shadowBlur = 80; g.shadowOffsetY = 40;
  k.redondo(g, -W / 2, -H / 2, W, H, 90); g.fillStyle = "#222"; g.fill(); g.restore();
  k.redondo(g, -W / 2, -H / 2, W, H, 90); k.metal(g, -W / 2, W / 2, ["#3a3d44", "#c9ced6", "#6b707a", "#e6e9ee", "#33363c"]);
  g.save(); k.redondo(g, -sw / 2, -sh / 2, sw, sh, 72); g.clip();
  // el zoom: de la calle (1) a España entera (0,07) y vuelta
  const lejos = su(tr(t, Tesp - 0.15, Tlejos)), cerca = su(tr(t, Tvuelve, Tcerca));
  const z = Math.exp(mez(0, Math.log(0.07), lejos * (1 - cerca))) * mez(1.5, 1, su(tr(t, T0 + 0.2, Tmapa + 0.1)));
  const fundido = su(tr(z, 0.45, 0.16));
  const MY = 40;
  g.fillStyle = "#121a2b"; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  if (fundido < 1) {
    const desliza = 260 * (1 - su(tr(t, T0 + 0.2, Tmapa + 0.1)));
    g.save(); g.globalAlpha = 1 - fundido; g.translate(0, MY); g.scale(z, z); g.rotate(-0.25 * (1 - su(tr(t, T0 + 0.2, Tmapa + 0.1))));
    g.drawImage(mapaCalles, -MW / 2 + desliza, -MH / 2 - desliza * 0.6);
    g.restore();
  }
  if (fundido > 0) {
    // España: el mapa de la calle está en Madrid
    const ze = z * 14;
    g.save(); g.globalAlpha = fundido; g.translate(0, MY); g.scale(ze * 0.55, ze * 0.55);
    g.translate(-ex(mez(-3.7, -3.05, lejos)), -ey(mez(40.42, 39.9, lejos)));
    g.drawImage(espana, 0, 0);
    g.restore();
  }
  // las chinchetas y sus precios (solo en la calle)
  const enCalle = 1 - fundido;
  PINES.forEach(([px, py, p0, p1], i) => {
    const t0 = Tcaen + i * 0.08, u = tr(t, t0, t0 + 0.35);
    if (u <= 0) return;
    const x = px * z, y = MY + py * z;
    const cae = u < 1 ? -300 * Math.pow(1 - k.entra(u), 2) : 0;
    const barata = i === BARATA;
    const col = barata ? VERDE : (p1 > 152 ? ROJO : AMBAR);
    const late = barata ? 1 + 0.12 * Math.sin((t - Tpre) * 8) * su(tr(t, Tpre, Tpre + 0.3)) : 1;
    chincheta(g, x, y + cae, (barata ? 0.85 : 0.65) * late, col, Math.min(1, u * 3) * enCalle);
    const tp = k.entra(tr(t, Tpre - 0.1 + i * 0.05, Tpre + 0.2 + i * 0.05));
    if (tp > 0) {
      const ur = tr(t, Truedan + i * 0.04, Truedan + 0.35 + i * 0.04);
      tag(g, x, y - (barata ? 150 : 120), p0, p1, ur, barata, tp * enCalle);
    }
    if (barata) k.brillo(g, x, y - 70, 420, VERDE, 0.5 * tp * enCalle);
  });
  // la barra de arriba de la app
  g.fillStyle = "rgba(8,12,22,0.92)"; g.fillRect(-sw / 2, -sh / 2, sw, 170);
  g.fillStyle = "#fff"; g.font = "800 44px Figtree"; g.textAlign = "left"; g.textBaseline = "middle";
  g.fillText("Gasolineras", -sw / 2 + 40, -sh / 2 + 110);
  g.fillStyle = "rgba(255,255,255,0.6)"; g.font = "700 30px Figtree"; g.fillText("Precio por litro · España", -sw / 2 + 40, -sh / 2 + 150);
  // la flecha de recarga
  const rc = tr(t, Trecarga, Truedan + 0.45), rx = sw / 2 - 80, ry = -sh / 2 + 115;
  g.save(); g.translate(rx, ry); g.rotate(su(rc) * 6.2832);
  g.strokeStyle = rc > 0 && rc < 1 ? `rgb(${VERDE})` : "rgba(255,255,255,0.85)"; g.lineWidth = 8; g.lineCap = "round";
  g.beginPath(); g.arc(0, 0, 26, 0.4, 5.6); g.stroke();
  g.fillStyle = g.strokeStyle; g.beginPath(); g.moveTo(26 * Math.cos(0.4) + 12, 26 * Math.sin(0.4) - 4); g.lineTo(26 * Math.cos(0.4) - 12, 26 * Math.sin(0.4) - 4); g.lineTo(26 * Math.cos(0.4), 26 * Math.sin(0.4) + 14); g.fill();
  g.restore();
  // la etiqueta «cada 5 min»
  const ec = k.entra(tr(t, Tcin - 0.1, Tcin + 0.2));
  if (ec > 0) k.etiqueta(g, -150, sh / 2 - 220, "cada 5 min", VERDE, ec, 52);
  // el reflejo del cristal
  g.globalCompositeOperation = "screen";
  const rg = g.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2); rg.addColorStop(0.25, "rgba(255,255,255,0)"); rg.addColorStop(0.32, "rgba(255,255,255,0.1)"); rg.addColorStop(0.4, "rgba(255,255,255,0)");
  g.fillStyle = rg; g.fillRect(-sw / 2, -sh / 2, sw, sh);
  g.restore();
  k.redondo(g, -90, -sh / 2 + 18, 180, 46, 23); g.fillStyle = "#050505"; g.fill();
  g.restore();
  velo(g, 0.55);
}
