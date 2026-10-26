// «Un científico hizo florecer unos melocotoneros dos veces al año, y sus cigarras salieron un año antes.»
// Otro sitio: una cámara de cultivo, con luces moradas, y un melocotonero joven en una maceta de cristal; en su
// tierra, una ninfa de ojos rojos agarrada a la raíz, con sus rayas (15 años). Se entra con un corte en «Un».
// - «hizo florecer»: el árbol florece en rosa y se le caen las flores; arriba, la barra de un año se va llenando.
// - «dos veces al año»: vuelve a florecer antes de que se llene la barra; cada floración baja por la raíz y graba una
//   raya: 16, 17.
// - «y sus cigarras salieron»: la ninfa sube por la tierra y sale; «un año antes».
import * as k from "#kit";
import { v } from "#voz";
import { grano, marcas, ninfa, sinVista, velo } from "../mundo.js";

export const desde = (vz) => vz.frase(7).inicio;

const { suave: su, tramo: tr, mez, azar } = k;
const f7 = v.frase(7);
const T0 = f7.inicio, Tflo = f7.t("florecer"), Tdos = f7.t("dos"), Tano = f7.t("ano"), Tsal = f7.t("salieron"), Tun = f7.t("un", 2), Tant = f7.t("antes"), Fin = f7.fin;
const FLOR = [Tflo - 0.05, Tdos + 0.05];
const RAYA = FLOR.map((f) => f + 0.75);
export const floraciones = FLOR, rayas = RAYA;
const sale0 = Tsal - 0.1, sale1 = Tsal + 0.55;

// el árbol joven: ramas fijas, con sus hojas y sus flores
const azA = azar(2468);
const RAMITAS = [];
function rama(x, y, a, L, w, d) {
  const x1 = x + Math.cos(a) * L, y1 = y + Math.sin(a) * L;
  RAMITAS.push({ x, y, x1, y1, w });
  if (d > 0) { rama(x1, y1, a - 0.45 - azA() * 0.3, L * 0.72, w * 0.68, d - 1); rama(x1, y1, a + 0.45 + azA() * 0.3, L * 0.72, w * 0.68, d - 1); }
}
rama(540, 1040, -Math.PI / 2, 190, 32, 4);
const PUNTAS = RAMITAS.filter((r) => r.w < 8);
const HOJITAS = PUNTAS.flatMap((r) => Array.from({ length: 5 }, () => ({ x: r.x1 + (azA() - 0.5) * 70, y: r.y1 + (azA() - 0.5) * 60, a: azA() * 6.28, L: 30 + azA() * 18, c: azA() })));
const FLORES = PUNTAS.flatMap((r) => Array.from({ length: 4 }, () => ({ x: r.x1 + (azA() - 0.5) * 80, y: r.y1 + (azA() - 0.5) * 70, s: 22 + azA() * 14, f: azA() * 6, r: azA(), cae: 0.4 + azA() * 0.6 })));

// la maceta de cristal y lo que hay dentro
const MX = 540, MT = 1040, MB = 1390, MW0 = 520, MW1 = 420;
const NX = 460, NY = 1270, NL = 260;
const marcasX = 360, marcasY = 1140;

function arbol(g, t) {
  // el tronco y las ramas
  g.save(); g.lineCap = "round";
  for (const r of RAMITAS) {
    g.strokeStyle = "#3a2210"; g.lineWidth = r.w; g.beginPath(); g.moveTo(r.x, r.y); g.lineTo(r.x1, r.y1); g.stroke();
    g.strokeStyle = "rgba(200,140,90,0.55)"; g.lineWidth = r.w * 0.3; g.beginPath(); g.moveTo(r.x - r.w * 0.2, r.y); g.lineTo(r.x1 - r.w * 0.2, r.y1); g.stroke();
  }
  // las hojas
  for (const h of HOJITAS) {
    g.save(); g.translate(h.x + Math.sin(t * 1.5 + h.a) * 2, h.y); g.rotate(h.a);
    g.fillStyle = k.mezColor("#2c7a2a", "#8fdc56", h.c);
    g.beginPath(); g.moveTo(-h.L / 2, 0); g.quadraticCurveTo(0, -h.L * 0.3, h.L / 2, 0); g.quadraticCurveTo(0, h.L * 0.3, -h.L / 2, 0); g.fill();
    g.restore();
  }
  g.restore();
  // las flores: dos floraciones; cada una abre y luego se le caen los pétalos
  for (let i = 0; i < 2; i++) {
    const abre = su(tr(t, FLOR[i], FLOR[i] + 0.35)), cae = tr(t, FLOR[i] + 0.55, FLOR[i] + 1.1);
    if (abre <= 0 || cae >= 1) continue;
    for (const f of FLORES) {
      const s = f.s * su(tr(abre, f.r * 0.4, f.r * 0.4 + 0.6));
      if (s < 1) continue;
      const y = f.y + 520 * cae * cae * f.cae, x = f.x + Math.sin(cae * 6 + f.f) * 30 * cae, al = 1 - cae;
      g.save(); g.globalAlpha = al;
      for (let p = 0; p < 5; p++) { const a = p * 1.2566 + f.f; g.fillStyle = "#ffc3d8"; g.beginPath(); g.arc(x + Math.cos(a) * s * 0.55, y + Math.sin(a) * s * 0.55, s * 0.5, 0, 6.2832); g.fill(); }
      g.fillStyle = "#ff5f97"; g.beginPath(); g.arc(x, y, s * 0.28, 0, 6.2832); g.fill();
      g.restore();
    }
  }
}

export function dibuja(g, t) {
  const z = 1.1 + 0.07 * su(tr(t, T0, Fin));
  sinVista(g);
  g.save(); g.translate(540, 1000); g.scale(z, z); g.translate(-540, -930);
  // la sala: oscura, con la luz morada de cultivo
  const bg = g.createLinearGradient(0, 0, 0, 1920); bg.addColorStop(0, "#2a0d3a"); bg.addColorStop(0.6, "#160822"); bg.addColorStop(1, "#08040c");
  g.fillStyle = bg; g.fillRect(-200, -200, 1480, 2400);
  // las paredes de la cámara (cristal) y la barra de luces
  g.fillStyle = "rgba(255,255,255,0.05)"; g.fillRect(90, 330, 900, 1110);
  g.strokeStyle = "rgba(220,200,255,0.35)"; g.lineWidth = 6; g.strokeRect(90, 330, 900, 1110);
  k.redondo(g, 140, 300, 800, 50, 20); g.fillStyle = "#2a2a34"; g.fill();
  for (let i = 0; i < 12; i++) { const x = 175 + i * 66; k.brillo(g, x, 330, 120, i % 3 ? "255,80,200" : "120,120,255", 0.9); }
  const lz = g.createLinearGradient(0, 330, 0, 1300); lz.addColorStop(0, "rgba(255,90,220,0.3)"); lz.addColorStop(1, "rgba(255,90,220,0)");
  g.save(); g.globalCompositeOperation = "lighter"; g.fillStyle = lz; g.beginPath(); g.moveTo(140, 340); g.lineTo(940, 340); g.lineTo(1000, 1300); g.lineTo(80, 1300); g.fill(); g.restore();
  // la barra del año
  const anoU = su(tr(t, Tflo - 0.3, Tano + 0.4));
  const bx = 130, by = 900, bw = 330;
  g.save(); g.globalAlpha = su(tr(t, T0, T0 + 0.3)) * (1 - su(tr(t, Tun - 0.2, Tun + 0.1)));
  k.redondo(g, bx, by, bw, 46, 23); g.fillStyle = "rgba(0,0,0,0.5)"; g.fill();
  k.redondo(g, bx, by, Math.max(46, bw * anoU), 46, 23); g.fillStyle = "#ffd36b"; g.fill();
  g.font = "800 52px Figtree"; g.textAlign = "center"; g.fillStyle = "#fff"; g.fillText("1 año", bx + bw / 2, by - 26);
  const A = g.globalAlpha;
  for (let i = 0; i < 2; i++) { const a = su(tr(t, FLOR[i], FLOR[i] + 0.25)); if (a <= 0) continue; const px = bx + bw * anoU; g.globalAlpha = A * a; g.fillStyle = "#ff7fb0"; g.beginPath(); g.arc(Math.min(bx + bw * (i ? 0.92 : 0.45), px), by + 23, 26, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(Math.min(bx + bw * (i ? 0.92 : 0.45), px), by + 23, 9, 0, 6.2832); g.fill(); g.globalAlpha = A; }
  g.restore();
  arbol(g, t);
  // la maceta: la tierra vista a través del cristal
  const maceta = () => { g.beginPath(); g.moveTo(MX - MW0 / 2, MT); g.lineTo(MX + MW0 / 2, MT); g.lineTo(MX + MW1 / 2, MB); g.lineTo(MX - MW1 / 2, MB); g.closePath(); };
  g.save(); maceta(); g.clip();
  const tg = g.createLinearGradient(0, MT, 0, MB); tg.addColorStop(0, "#6a4022"); tg.addColorStop(1, "#2e1a0c");
  g.fillStyle = tg; g.fillRect(MX - 300, MT, 600, MB - MT);
  g.globalCompositeOperation = "multiply"; g.drawImage(grano, MX - 300, MT, 600, 600); g.globalCompositeOperation = "source-over";
  // la raíz
  g.strokeStyle = "#8a5a32"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(MX, MT); g.quadraticCurveTo(MX + 20, MT + 160, MX + 10, MB - 20); g.stroke();
  g.strokeStyle = "#6a4022"; g.lineWidth = 7; g.beginPath(); g.moveTo(MX + 8, MT + 120); g.quadraticCurveTo(MX + 120, MT + 200, MX + 170, MB - 60); g.stroke();
  // el pulso de cada floración, por la raíz
  for (let i = 0; i < 2; i++) {
    const u = tr(t, FLOR[i] + 0.25, RAYA[i]);
    if (u > 0 && u < 1) k.brillo(g, MX + 14, mez(MT, NY, su(u)), 220, "255,205,110", 1);
  }
  // las rayas: 15, 16, 17
  const n = 15 + su(tr(t, RAYA[0], RAYA[0] + 0.2)) + su(tr(t, RAYA[1], RAYA[1] + 0.2));
  const br = Math.max(k.pulso(t, RAYA[0] + 0.1, 0.2), k.pulso(t, RAYA[1] + 0.1, 0.2));
  marcas(g, marcasX - 150, marcasY - 30, n, 72, br);
  // la ninfa: agarrada a la raíz; en «salieron» sube y sale
  g.restore();
  const s = su(tr(t, sale0, sale1));
  ninfa(g, mez(NX, MX + 30, s), mez(NY, MT - 130, s), NL, mez(0, -1.35, s), t, { tono: 1, pico: 1 - s });
  // el cristal de la maceta, por delante
  maceta(); k.vidrio(g, MX - MW0 / 2, MX + MW0 / 2, 0.55);
  k.reflejo(g, MX - MW0 / 2 + 40, MT + 30, 20, MB - MT - 60, 0.3);
  // la tierra que salta al salir
  if (t > sale0 + 0.2) {
    for (let i = 0; i < 14; i++) {
      const u = t - sale0 - 0.2 - i * 0.01; if (u < 0 || u > 0.7) continue;
      const a = -Math.PI / 2 + (i / 13 - 0.5) * 2, vv = 300 + (i * 53 % 7) * 60;
      g.fillStyle = `rgba(110,70,40,${1 - u / 0.7})`; g.beginPath(); g.arc(MX + 40 + Math.cos(a) * vv * u, MT - 10 + Math.sin(a) * vv * u + 900 * u * u, 7 + (i % 3) * 3, 0, 6.2832); g.fill();
    }
  }
  // «un año antes»
  const aa = k.entra(tr(t, Tun - 0.05, Tun + 0.25));
  k.pastilla(g, 540, mez(760, 700, aa), "1 año antes", "", "255,215,120", aa, 100);
  g.restore();
  velo(g, 0.5, "10,4,16");
}

export const momentos = { floraciones: FLOR, rayas: RAYA, sale: sale0 };
