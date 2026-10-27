// «Y el relieve mide solo cuatro milímetros, menos que dos monedas apiladas, pero se nota con la suela.»
// Otro sitio: el relieve de cerca, a ras de la baldosa, con las medidas de verdad (1 mm = 18 px).
// - desde «Y»: un botón enorme delante y los de detrás desenfocados; la luz de la calle al fondo.
// - «cuatro milímetros»: la medida de su altura, «4 mm».
// - «dos monedas»: caen dos monedas de euro y se apilan al lado; su cara de arriba queda un poco más alta (4,66 mm).
// - «pero se nota»: las monedas salen; baja una zapatilla y su suela se apoya en el botón, que la empuja con un brillo.
import * as k from "#kit";
import { v } from "#voz";
import { GRANO } from "../mundo.js";

export const desde = (vz) => vz.frase(5).inicio;

const f5 = v.frase(5), T0 = f5.inicio;
const Tcua = f5.t("cuatro"), Tdos = f5.t("dos"), Tapi = f5.t("apiladas"), Tpero = f5.t("pero"), Tsue = f5.t("suela"), Fin = v.frase(6).inicio;
export const caidas = [Tdos + 0.18, Tdos + 0.48];

const MM = 23, S = 0.2;                    // px por milímetro y la elevación de la mirada
const YB = 1330, RD = 12.5 * MM, HD = 4 * MM * Math.sqrt(1 - S * S);
const RM = 11.625 * MM, HM = 2.33 * MM * Math.sqrt(1 - S * S);
const XD = 300, XM = 815, YM = 30;

const azB = k.azar(41);
const BOKEH = Array.from({ length: 22 }, () => ({ x: azB() * 1080, y: 150 + azB() * 700, r: 50 + azB() * 120, c: ["255,170,90", "255,110,160", "160,140,255", "255,210,120"][Math.floor(azB() * 4)] }));

// Un botón (cúpula truncada) con su base en (bx, by), radio R, visto con elevación s.
function domo(g, bx, by, R, s, al = 1) {
  const h = 0.32 * R * Math.sqrt(1 - s * s), rt = 0.78;
  g.save(); g.globalAlpha = al;
  g.fillStyle = "rgba(90,50,0,0.35)"; g.beginPath(); g.ellipse(bx + R * 0.18, by + R * s * 0.15, R * 1.08, R * s * 1.1, 0, 0, 6.2832); g.fill();
  g.beginPath(); g.ellipse(bx, by, R, R * s, 0, 0, Math.PI); g.lineTo(bx - R * rt, by - h); g.ellipse(bx, by - h, R * rt, R * rt * s, 0, Math.PI, 0); g.closePath();
  const lg = g.createLinearGradient(bx - R, 0, bx + R, 0); lg.addColorStop(0, "#ffe680"); lg.addColorStop(0.4, "#f6bd1c"); lg.addColorStop(1, "#9a6604");
  g.fillStyle = lg; g.fill();
  g.beginPath(); g.ellipse(bx, by - h, R * rt, R * rt * s, 0, 0, 6.2832);
  const tg = g.createRadialGradient(bx - R * 0.3, by - h - R * s * 0.3, 2, bx, by - h, R * rt); tg.addColorStop(0, "#fff6c8"); tg.addColorStop(0.5, "#ffd23c"); tg.addColorStop(1, "#e3a80c");
  g.fillStyle = tg; g.fill();
  g.save(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.45 * al; g.fillStyle = g.createPattern(GRANO, "repeat"); g.fillRect(bx - R, by - h - R, 2 * R, 2 * R); g.restore();
  g.restore();
}

// Una moneda de euro con su base en (bx, by), radio R y grosor H en pantalla.
function moneda(g, bx, by, R, H, s, gira) {
  const yt = by - H;
  // el canto, con sus estrías
  g.beginPath(); g.ellipse(bx, by, R, R * s, 0, 0, Math.PI); g.lineTo(bx - R, yt); g.ellipse(bx, yt, R, R * s, 0, Math.PI, 0); g.closePath();
  const cg = g.createLinearGradient(bx - R, 0, bx + R, 0); cg.addColorStop(0, "#f2d77a"); cg.addColorStop(0.35, "#c9a43c"); cg.addColorStop(1, "#6e5414");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); g.strokeStyle = "rgba(60,40,0,0.35)"; g.lineWidth = 3;
  for (let i = 0; i < 40; i++) { const a = Math.PI * (i / 40) + gira; const x = bx - R * Math.cos(a); g.beginPath(); g.moveTo(x, by + R * s * Math.sin(a) - H); g.lineTo(x, by + R * s * Math.sin(a)); g.stroke(); }
  g.restore();
  // la cara: anillo dorado y centro plateado con su «1»
  g.beginPath(); g.ellipse(bx, yt, R, R * s, 0, 0, 6.2832);
  const ag = g.createLinearGradient(bx - R, yt - R * s, bx + R, yt + R * s); ag.addColorStop(0, "#fff0b0"); ag.addColorStop(0.5, "#d9b34a"); ag.addColorStop(1, "#9c7a22");
  g.fillStyle = ag; g.fill();
  g.beginPath(); g.ellipse(bx, yt, R * 0.72, R * 0.72 * s, 0, 0, 6.2832);
  const pg = g.createLinearGradient(bx - R, yt - R * s, bx + R, yt + R * s); pg.addColorStop(0, "#ffffff"); pg.addColorStop(0.5, "#c3c8d0"); pg.addColorStop(1, "#7d838c");
  g.fillStyle = pg; g.fill();
  g.save(); g.translate(bx + R * 0.1, yt); g.scale(1, 0.4); g.fillStyle = "rgba(90,95,105,0.6)"; g.font = "800 230px Figtree"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("1", 0, 0); g.restore();
}

function zapatilla(g, x, yS, aprieta) {
  // yS: la línea de abajo de la suela. Por encima, la entresuela blanca y la tela azul.
  g.save();
  const W = 1500, x0 = x - W / 2;
  // la tela
  g.beginPath(); g.moveTo(x0 + 80, yS - 150); g.lineTo(x0 + W, yS - 150); g.lineTo(x0 + W, yS - 900); g.quadraticCurveTo(x0 + 400, yS - 760, x0 + 60, yS - 420); g.closePath();
  const tg = g.createLinearGradient(0, yS - 900, 0, yS - 150); tg.addColorStop(0, "#2d56d8"); tg.addColorStop(1, "#173096"); g.fillStyle = tg; g.fill();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5; g.save(); g.clip(); g.fillStyle = g.createPattern(GRANO, "repeat"); g.fillRect(x0, yS - 900, W, 800); g.restore();
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // la entresuela
  k.redondo(g, x0 + 20, yS - 160, W, 110, 50); const eg = g.createLinearGradient(0, yS - 160, 0, yS - 50); eg.addColorStop(0, "#ffffff"); eg.addColorStop(1, "#bfc4cc"); g.fillStyle = eg; g.fill();
  // la suela de goma, con el bulto que le hace el botón
  const bump = aprieta * 26;
  g.beginPath(); g.moveTo(x0, yS - 60);
  g.lineTo(x0 + W, yS - 60); g.lineTo(x0 + W, yS);
  for (let px = x0 + W; px >= x0; px -= 10) {
    const d = (px - XD) / (RD * 0.95), bul = Math.abs(d) < 1 ? bump * Math.cos(d * Math.PI / 2) ** 2 : 0;
    const dibujo = ((Math.floor((px - x0) / 46) % 2) ? 0 : 7);
    g.lineTo(px, yS - bul + dibujo);
  }
  g.closePath();
  const sg = g.createLinearGradient(0, yS - 60, 0, yS + 8); sg.addColorStop(0, "#3a3a44"); sg.addColorStop(1, "#16161c"); g.fillStyle = sg; g.fill();
  g.restore();
}

export function dibuja(g, t) {
  // el fondo: la calle desenfocada al atardecer
  const bg = g.createLinearGradient(0, 0, 0, 1100); bg.addColorStop(0, "#2a1a4a"); bg.addColorStop(0.7, "#8a4a6a"); bg.addColorStop(1, "#e08a5a");
  g.fillStyle = bg; g.fillRect(0, 0, 1080, 1920);
  g.save(); g.globalCompositeOperation = "lighter";
  for (const b of BOKEH) { const gr = g.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); gr.addColorStop(0, `rgba(${b.c},0.35)`); gr.addColorStop(0.8, `rgba(${b.c},0.25)`); gr.addColorStop(1, `rgba(${b.c},0)`); g.fillStyle = gr; g.beginPath(); g.arc(b.x, b.y, b.r, 0, 6.2832); g.fill(); }
  g.restore();

  // la cámara: se acerca a las cimas con las monedas, y vuelve
  const Z = 1 + 0.18 * k.suave(k.tramo(t, Tdos - 0.1, Tapi + 0.4)) - 0.22 * k.suave(k.tramo(t, Tpero - 0.1, Tsue - 0.1)) + 0.04 * k.tramo(t, T0, Fin);
  const fy = 1150;
  g.save(); g.translate(540, fy); g.scale(Z, Z); g.translate(-540, -fy);

  // la baldosa
  const sy = 1000;
  const lg = g.createLinearGradient(0, sy, 0, 2100); lg.addColorStop(0, "#c98a10"); lg.addColorStop(0.25, "#f0b51c"); lg.addColorStop(1, "#ffd040");
  g.fillStyle = lg; g.fillRect(-400, sy, 1880, 1300);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.55; g.fillStyle = g.createPattern(GRANO, "repeat"); g.fillRect(-400, sy, 1880, 1300); g.restore();
  const hz = g.createLinearGradient(0, sy - 40, 0, sy + 120); hz.addColorStop(0, "rgba(224,138,90,1)"); hz.addColorStop(1, "rgba(224,138,90,0)"); g.fillStyle = hz; g.fillRect(-400, sy - 40, 1880, 160);
  // los botones de detrás, desenfocados
  const lejos = k.lienzo(1080, 1920), lc = lejos.getContext("2d");
  for (const [dy, f] of [[-560, 0.62], [-280, 0.8]]) for (const dx of [-1200 * f, 0, 1200 * f]) domo(lc, XD + dx + (dy === -560 ? 600 * f : 0), YB + dy * 0.85, RD * f, S, 1);
  g.save(); g.filter = "blur(9px)"; g.drawImage(lejos, 0, 0); g.restore();
  // el botón de delante
  domo(g, XD, YB, RD, S);
  domo(g, XD + 1200, YB, RD, S);

  // «cuatro milímetros»: la medida
  const med = k.suave(k.tramo(t, Tcua - 0.15, Tcua + 0.35)) * (1 - k.suave(k.tramo(t, Tpero - 0.2, Tpero + 0.2)));
  const yTop = YB - HD;
  if (med > 0.01) {
    g.save(); g.globalAlpha = med;
    g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.lineCap = "round";
    const xm = XD - RD - 60;
    g.beginPath(); g.moveTo(xm, YB); g.lineTo(xm, yTop); g.moveTo(xm - 22, YB); g.lineTo(xm + 22, YB); g.moveTo(xm - 22, yTop); g.lineTo(xm + 22, yTop); g.stroke();
    g.setLineDash([14, 12]); g.lineWidth = 4; g.strokeStyle = "rgba(255,255,255,0.85)";
    g.beginPath(); g.moveTo(xm, yTop); g.lineTo(XD + RD * 0.78, yTop); g.stroke();
    g.beginPath(); g.moveTo(xm, YB); g.lineTo(XD - RD, YB); g.stroke();
    g.restore();
    k.pastilla(g, XD - 20, 880, "4", "mm", "255,226,120", med, 120);
  }

  // «dos monedas»: caen y se apilan
  const sale = k.sale(k.tramo(t, Tpero - 0.1, Tpero + 0.45));
  for (let i = 0; i < 2; i++) {
    const tc = caidas[i], u = k.tramo(t, tc - 0.35, tc);
    if (t < tc - 0.35) continue;
    const base = YB + YM - i * HM, y = u < 1 ? k.mez(-300, base, u * u) : base - Math.abs(Math.sin((t - tc) * 18)) * 18 * Math.exp(-(t - tc) * 9);
    moneda(g, XM + sale * 900, y, RM, HM, S, i * 0.4);
  }
  // la cara de arriba de las monedas, más alta que el botón
  const cmp = k.suave(k.tramo(t, Tapi - 0.1, Tapi + 0.3)) * (1 - sale);
  if (cmp > 0.01) {
    const yM = YB + YM - 2 * HM;
    g.save(); g.globalAlpha = cmp; g.strokeStyle = "rgba(120,240,255,0.95)"; g.lineWidth = 5; g.setLineDash([16, 12]);
    g.beginPath(); g.moveTo(XD - RD * 0.6, yM); g.lineTo(XM + RM, yM); g.stroke(); g.restore();
    k.pastilla(g, XM + 40, 880, "4,66", "mm", "130,240,255", cmp, 100);
  }

  // «suela»: baja la zapatilla y el botón la empuja
  const baja = k.suave(k.tramo(t, Tpero + 0.15, Tsue));
  if (baja > 0) {
    const contacto = yTop - RD * 0.78 * S;
    const yS = k.mez(-200, contacto + 10, baja), aprieta = k.suave(k.tramo(t, Tsue - 0.1, Tsue + 0.3));
    zapatilla(g, 700, yS, aprieta);
    const brilla = k.pulso(t, Tsue + 0.12, 0.35);
    k.brillo(g, XD, contacto, 520, "255,235,150", 0.9 * brilla + 0.25 * aprieta);
    if (aprieta > 0.01) {
      g.save(); g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 3; i++) {
        const u = ((t - Tsue) * 1.2 + i / 3) % 1;
        if (t < Tsue) continue;
        g.strokeStyle = `rgba(255,230,140,${0.6 * (1 - u) * aprieta * (1 - k.tramo(t, Fin - 0.5, Fin - 0.2))})`; g.lineWidth = 6;
        g.beginPath(); g.ellipse(XD, contacto - 40 - u * 260, 140 + u * 180, 30 + u * 40, 0, Math.PI, 0); g.stroke();
      }
      g.restore();
    }
  }
  g.restore();

  // un velo arriba, detrás del subtítulo
  const vg = g.createLinearGradient(0, 200, 0, 680); vg.addColorStop(0, "rgba(20,10,35,0.55)"); vg.addColorStop(1, "rgba(20,10,35,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 680);
}
