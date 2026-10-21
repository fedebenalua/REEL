// «Y costaba casi cuatro mil dólares: siete meses de sueldo mínimo en Estados Unidos.»
// Un sitio nuevo: fondo verde dinero. Una cámara.
// - «casi cuatro mil dólares»: cae una etiqueta de precio con el móvil y la cifra sube hasta 3.995 $; se balancea.
// - «siete meses»: aparecen siete hojas de calendario, una a una.
// - «sueldo mínimo»: en cada hoja cae una moneda.
// - «Estados Unidos»: en el hueco que queda sale su bandera.
import * as k from "#kit";
import { v } from "#voz";
import { camino2D, vista, sinVista, velo, vineta } from "../mundo.js";
import { movilLadrillo } from "../cosas.js";

export const desde = (vz) => vz.frase(4).inicio;

const { suave: su, tramo: tr, mez, redondo } = k;
const f = v.frase(4);
const T0 = f.inicio, Tcos = f.t("costaba"), Tdol = f.t("dolares"), Tsie = f.t("siete"), Tsue = f.t("sueldo"), Tmin = f.t("minimo"), Tuni = f.t("unidos");
const FIN = v.frase(5).inicio;

const cam = camino2D([[T0, [1.0, 0, -110]], [FIN, [1.04, 0, -100]]]);
const SLOT = (i) => [[-393, 140], [-131, 140], [131, 140], [393, 140], [-393, 400], [-131, 400], [131, 400], [393, 400]][i];

function etiqueta(g, t) {
  const cae = su(tr(t, Tcos - 0.1, Tdol - 0.1));
  const a = t > Tdol - 0.1 ? 0.28 * Math.exp(-(t - Tdol + 0.1) * 2.2) * Math.sin((t - Tdol + 0.1) * 8) * 1.4 : 0;
  g.save(); g.translate(0, -690); g.rotate(a); g.scale(1.2, 1.2); g.translate(0, mez(-700, 0, cae) + 440);
  g.strokeStyle = "#fff"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -440); g.lineTo(0, -150); g.stroke();
  g.save(); g.shadowColor = "rgba(0,0,0,0.5)"; g.shadowBlur = 40; g.shadowOffsetY = 20;
  g.beginPath(); g.moveTo(-340, -110); g.lineTo(200, -110); g.lineTo(340, 0); g.lineTo(200, 110); g.lineTo(-340, 110); g.closePath(); g.fillStyle = "#fff6e0"; g.fill(); g.restore();
  g.beginPath(); g.arc(-290, 0, 18, 0, 6.2832); g.fillStyle = "#13805a"; g.fill();
  g.save(); g.translate(-170, 8); g.scale(0.26, 0.26); movilLadrillo(g, t, { led: null }); g.restore();
  const n = Math.round(3995 * su(tr(t, Tcos + 0.2, Tdol)));
  const txt = n.toLocaleString("es-ES").replace(/\u202f|\u00a0/g, ".") + " $";
  const txt2 = n >= 1000 ? String(n).replace(/(\d)(\d{3})$/, "$1.$2") + " $" : n + " $";
  g.font = "800 112px Figtree"; g.fillStyle = "#e01818"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(txt2, 70, 8);
  g.restore();
}

export function dibuja(g, t) {
  const [Z, cx, cy] = cam(t);
  vista(g, Z, cx, cy);
  const bg = g.createLinearGradient(0, -1000, 0, 1000); bg.addColorStop(0, "#14a868"); bg.addColorStop(1, "#06402e"); g.fillStyle = bg; g.fillRect(-1300, -1500, 2600, 3000);
  k.brillo(g, 0, 100, 1000, "255,230,120", 0.2);
  g.save(); g.globalAlpha = 0.07; g.fillStyle = "#fff"; for (let x = -1200; x < 1200; x += 120) g.fillRect(x, -1500, 40, 3000); g.restore();
  etiqueta(g, t);
  // las siete hojas de calendario
  for (let i = 0; i < 7; i++) {
    const T = Tsie + 0.12 * i, a = su(tr(t, T, T + 0.25)); if (a <= 0.01) continue;
    const [x, y] = SLOT(i), e = 0.5 + 0.5 * a + 0.08 * Math.sin(Math.PI * tr(t, T + 0.1, T + 0.4));
    g.save(); g.translate(x, y); g.scale(e * 1.08, e * 1.08); g.globalAlpha = a;
    g.save(); g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 24; g.shadowOffsetY = 12; redondo(g, -115, -100, 230, 200, 22); g.fillStyle = "#fff"; g.fill(); g.restore();
    redondo(g, -115, -100, 230, 54, 22); g.fillStyle = "#e01818"; g.fill(); g.fillRect(-115, -70, 230, 24);
    g.fillStyle = "#fff"; for (const dx of [-60, 60]) { g.beginPath(); g.arc(dx, -100, 10, 0, 6.2832); g.fill(); }
    g.font = "800 28px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#fff"; g.fillText("MES", 0, -72);
    g.font = "800 118px Figtree"; g.fillStyle = "#1a1a24"; g.fillText(String(i + 1), 0, 24);
    // la moneda de «sueldo mínimo»
    const m = su(tr(t, Tsue + 0.06 * i, Tsue + 0.06 * i + 0.22));
    if (m > 0.01) { g.save(); g.translate(70, 60 - 120 * (1 - m)); g.globalAlpha = m; g.beginPath(); g.arc(0, 0, 40, 0, 6.2832); const cg = g.createRadialGradient(-12, -12, 4, 0, 0, 40); cg.addColorStop(0, "#fff3a0"); cg.addColorStop(1, "#d6a010"); g.fillStyle = cg; g.fill(); g.strokeStyle = "#9a6a08"; g.lineWidth = 5; g.stroke(); g.font = "800 44px Figtree"; g.fillStyle = "#9a6a08"; g.fillText("$", 0, 3); g.restore(); }
    g.restore();
  }
  // la bandera de Estados Unidos, en la octava casilla
  const ba = su(tr(t, Tuni - 0.05, Tuni + 0.3));
  if (ba > 0.01) {
    const [x, y] = SLOT(7); g.save(); g.translate(x, y); g.scale((0.6 + 0.4 * ba) * 1.08, (0.6 + 0.4 * ba) * 1.08); g.globalAlpha = ba;
    g.save(); g.shadowColor = "rgba(0,0,0,0.45)"; g.shadowBlur = 24; g.shadowOffsetY = 12; g.fillStyle = "#fff"; g.fillRect(-115, -75, 230, 150); g.restore();
    for (let i = 0; i < 7; i++) { g.fillStyle = "#d4222e"; g.fillRect(-115, -75 + i * 21.4, 230, 10.7); }
    g.fillStyle = "#2a3a8a"; g.fillRect(-115, -75, 100, 85);
    g.fillStyle = "#fff"; for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) { g.beginPath(); g.arc(-105 + c * 19 + (r % 2) * 9, -63 + r * 19, 3.5, 0, 6.2832); g.fill(); }
    g.restore();
  }
  const br = k.pulso(t, Tmin + 0.15, 0.25); if (br > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; k.brillo(g, 0, 200, 900, "255,230,120", 0.25 * br); g.restore(); }
  sinVista(g);
  velo(g, 0.45);
  vineta(g, 0.45);
}

export const momentos = { dolares: Tdol, siete: Tsie, sueldo: Tsue, unidos: Tuni };
