// Todo el vídeo es un solo plano: la voz no deja hueco, así que la cámara entra en el cable y sale.
// Frase a frase, lo mismo que plan.md.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f = (n) => v.frase(n);
const Tup = f(1).t("up");
const Tpointed = f(1).t("pointed");
const Tlight = f(2).t("light");
const Tstops = f(2).t("stops");
const Tsees = f(2).t("sees");
const Torder = f(3).inicio;
const Tone = f(3).t("one");
const Twire = f(3).t("wire");
const Tloud = f(4).t("louder");
const Tshuts = f(4).t("shuts");
const Tpress = f(5).t("press");
const Tsleep = f(5).t("sleep");
const Tany = f(6).t("anynet");
const Tbravia = f(7).t("bravia");
const Tsimp = f(7).t("simplink");
const Tsame = f(8).t("same");
const ToneRemote = f(8).t("one");
const Tpile = f(8).t("pile");
const Tphone = f(9).t("phone");
const Tapp = f(10).t("app");
const Tthree = f(11).t("three");
const Tcouch = f(11).t("couch");
const FIN = v.duracion;

const camX = k.claves([[-0.4, 540], [1.2, 540], [6.4, 540], [8.0, 620], [13.1, 540], [27.4, 540], [FIN, 540]]);
const camY = k.claves([[-0.45, 1220], [1.15, 1040], [6.3, 1220], [7.7, 1080], [16.1, 1120], [18.4, 1080], [27.5, 1100], [34.3, 1240], [35.7, 1240], [FIN, 1220]]);
const camZ = k.claves([[-0.45, 2.35], [1.2, 1.02], [3.1, 1.06], [6.5, 1.28], [7.8, 1.08], [16.2, 0.98], [18.5, 1.0], [27.6, 0.96], [34.4, 0.78], [35.75, 0.78], [FIN, 2.35]]);

function camara(t) {
  const base = { x: camX(t), y: camY(t), z: camZ(t) };
  const cierre = k.suave(k.tramo(t, 35.9, FIN));
  const cero = { x: camX(0), y: camY(0), z: camZ(0) };
  return {
    x: k.mez(base.x, cero.x, cierre),
    y: k.mez(base.y, cero.y, cierre),
    z: k.mez(base.z, cero.z, cierre),
  };
}

const HILOS = [
  { y: -220, c: "#ff4d6d", g: 34 },
  { y: -140, c: "#3ec5ff", g: 30 },
  { y: -60, c: "#49e6a0", g: 28 },
  { y: 70, c: "#ffb020", g: 30 },
  { y: 150, c: "#c86bff", g: 28 },
  { y: 230, c: "#ff7a45", g: 26 },
];

function interior(g, t) {
  const gr = g.createLinearGradient(0, 0, 0, 1920);
  gr.addColorStop(0, "#1a0c08");
  gr.addColorStop(0.5, "#3a2014");
  gr.addColorStop(1, "#100806");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  const solo = k.suave(k.tramo(t, Tone - 0.05, Tone + 0.4));
  const bead = k.suave(k.tramo(t, 9.15, 11.3));
  for (const h of HILOS) {
    g.globalAlpha = k.mez(1, 0.28, solo);
    g.strokeStyle = h.c;
    g.lineWidth = h.g;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(40, 980 + h.y);
    g.bezierCurveTo(360, 980 + h.y - 30, 720, 980 + h.y + 24, 1040, 980 + h.y);
    g.stroke();
  }
  g.globalAlpha = 1;
  const y0 = 980;
  g.strokeStyle = "#ffd56a";
  g.lineWidth = 46;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(60, y0);
  g.lineTo(1020, y0);
  g.stroke();
  g.strokeStyle = "rgba(255,255,230,0.85)";
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(60, y0 - 10);
  g.lineTo(1020, y0 - 10);
  g.stroke();
  const bx = k.mez(120, 960, bead);
  k.brillo(g, bx, y0, 220, "255,210,90", 1);
  g.beginPath();
  g.arc(bx, y0, 28, 0, 6.2832);
  g.fillStyle = "#fff6d0";
  g.fill();
  const llega = k.suave(k.tramo(t, 11.15, 11.55));
  k.brillo(g, 980, y0, 360, "255,170,60", llega);
  k.redondo(g, 40, 860, 120, 240, 24);
  g.fillStyle = "#221820";
  g.fill();
  k.redondo(g, 900, 860, 140, 240, 28);
  g.fillStyle = k.mezColor("#221820", "#ffb43a", llega);
  g.fill();
}

function placa(g, t, t0, y, texto, fondo, tinta) {
  const u = k.entra(k.tramo(t, t0, t0 + 0.32));
  if (u <= 0) return;
  const x = k.mez(1280, 540, u);
  g.save();
  g.translate(x, y);
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 16;
  k.redondo(g, -360, -78, 720, 156, 36);
  g.fillStyle = fondo;
  g.fill();
  g.shadowColor = "transparent";
  g.fillStyle = tinta;
  g.font = "800 78px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(texto, 0, 4);
  g.restore();
}

function nombres(g, t) {
  const gr = g.createLinearGradient(0, 0, 1080, 1920);
  gr.addColorStop(0, "#2a1408");
  gr.addColorStop(0.5, "#4a2a10");
  gr.addColorStop(1, "#1a0c06");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  const brillo = 0.55 + 0.45 * Math.sin(t * 2.2);
  g.save();
  g.strokeStyle = `rgba(255,196,70,${0.9})`;
  g.lineWidth = 54;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(540, 560);
  g.lineTo(540, 1420);
  g.stroke();
  g.strokeStyle = "rgba(255,245,210,0.8)";
  g.lineWidth = 8;
  g.beginPath();
  g.moveTo(528, 580);
  g.lineTo(528, 1400);
  g.stroke();
  const glint = 620 + ((t * 90) % 760);
  k.brillo(g, 540, glint, 160, "255,220,140", 0.7);
  g.restore();
  placa(g, t, Tany - 0.05, 760, "ANYNET+", "#f4f7ff", "#1428a0");
  placa(g, t, Tbravia - 0.05, 1020, "BRAVIA SYNC", "#ffd56a", "#1a1204");
  placa(g, t, Tsimp - 0.05, 1280, "SIMPLINK", "#fff4f6", "#a50034");
  const same = k.pulso(t, Tsame + 0.15, 0.22);
  k.brillo(g, 540, 1100, 700, "255,200,80", 0.45 * same);
}

function movil(g, t) {
  const entra = k.entra(k.tramo(t, Tphone - 0.35, Tphone + 0.35));
  const sale = k.suave(k.tramo(t, 35.85, 36.45));
  const acerca = k.suave(k.tramo(t, 30.05, 32.7));
  const abre = k.suave(k.tramo(t, 32.85, 34.35));
  if (entra <= 0 || sale > 0.98) return;
  const esc = k.mez(k.mez(0.9, 1.12, acerca), 0.5, abre) * (1 - sale);
  const y = k.mez(1900, k.mez(k.mez(1120, 980, acerca), 740, abre), entra);
  const pulgar = Math.max(k.pulso(t, Tphone + 0.2, 0.16), k.pulso(t, Tapp + 0.05, 0.14), k.pulso(t, 32.3, 0.14));
  const nivel = k.suave(k.tramo(t, Tphone + 0.15, 32.6));
  g.save();
  g.globalAlpha = 1 - sale;
  g.translate(540, y);
  g.scale(esc, esc);
  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 24;
  k.redondo(g, -250, -520, 500, 1040, 70);
  g.fillStyle = "#16161c";
  g.fill();
  g.shadowColor = "transparent";
  k.redondo(g, -250, -520, 500, 1040, 70);
  k.metal(g, -250, 250, ["#2a2a32", "#c5c5ce", "#4a4a54", "#f2f2f6", "#1a1a20"]);
  k.redondo(g, -220, -470, 440, 940, 48);
  g.fillStyle = "#0e1018";
  g.fill();
  g.save();
  k.redondo(g, -200, -440, 400, 220, 24);
  g.clip();
  g.fillStyle = "#201028";
  g.fillRect(-200, -440, 400, 220);
  g.globalCompositeOperation = "lighter";
  k.brillo(g, -40, -360, 220, "255,80,140", 0.8);
  k.brillo(g, 80, -300, 180, "70,180,255", 0.7);
  g.restore();
  const by = -80 + (pulgar > 0.4 ? 10 : 0);
  k.redondo(g, -150, by - 70, 300, 140, 28);
  g.fillStyle = "#ff4d6a";
  g.fill();
  g.fillStyle = "#fff";
  g.font = "800 64px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("VOL +", 0, by);
  k.redondo(g, -190, 40, 40 + 340 * nivel, 36, 16);
  g.fillStyle = "#3ef0c8";
  g.fill();
  k.redondo(g, -150, 120, 300, 120, 28);
  g.fillStyle = "#2a3148";
  g.fill();
  g.fillStyle = "#d5def5";
  g.font = "800 48px Figtree";
  g.fillText("VOL −", 0, 180);
  g.beginPath();
  g.arc(80, by + 8, 36, 0, 6.2832);
  g.fillStyle = "#f0b89a";
  g.fill();
  g.restore();
}

function abertura(g, t, u, cam) {
  if (u < 0.01) return;
  const boca = m.aPantalla(cam, m.CABLE.x, m.CABLE.y);
  const c = k.entra(Math.min(1, u));
  const cx = k.mez(boca.x, 540, c);
  const cy = k.mez(boca.y, m.ANCLA, c);
  const r = k.mez(12, 1800, c);
  g.save();
  g.beginPath();
  g.arc(cx, cy, Math.max(1, r), 0, 6.2832);
  g.clip();
  if (u < 1.2) interior(g, t);
  g.restore();
  g.beginPath();
  g.arc(cx, cy, Math.max(1, r), 0, 6.2832);
  g.strokeStyle = "#3a2418";
  g.lineWidth = 26;
  g.stroke();
  g.strokeStyle = "rgba(255,200,90,0.55)";
  g.lineWidth = 6;
  g.stroke();
}

export function dibuja(g, t) {
  const cam = camara(t);
  const sueno = k.suave(k.tramo(t, Tsleep - 0.55, Tsleep + 0.15)) * (1 - k.suave(k.tramo(t, Tpile - 0.15, Tpile + 0.45)));
  const masAlto = k.suave(k.tramo(t, Tloud - 0.05, Tloud + 0.35));
  const gancho = 1 - k.suave(k.tramo(t, 0.15, 1.25));
  const cierre = k.suave(k.tramo(t, 35.9, FIN));
  let fuerza = 0.35 + 0.65 * gancho + 0.25 * k.pulso(t, Tup, 0.16) + 0.55 * masAlto;
  fuerza *= 1 - sueno;
  fuerza = k.mez(fuerza, 1, cierre);
  const mudo = k.suave(k.tramo(t, Tshuts - 0.05, Tshuts + 0.4)) * (1 - k.suave(k.tramo(t, Tpile - 0.1, Tpile + 0.35)));
  const flujo = Math.max(k.suave(k.tramo(t, Torder, Torder + 0.7)) * (1 - k.suave(k.tramo(t, Twire, Twire + 0.35))), 0);
  const ang = -0.55;

  m.fondo(g, cam, sueno);
  m.conCamara(g, cam, () => {
    m.suelo(g, sueno);
    m.mandosSofa(g);
    m.tele(g, t, sueno, mudo);
    m.anillos(g, t, fuerza);
    m.barra(g, t, fuerza, sueno);
    m.puck(g, sueno);
    m.cableSala(g, t, flujo * (1 - k.suave(k.tramo(t, Torder + 0.15, Torder + 0.85))));
    const pulsa = t > Tpress - 0.05 && t < Tpress + 0.35 ? "power" : (t > Tup - 0.1 && t < Tup + 0.35 ? "vol" : "");
    const alMando = 1 - k.suave(k.tramo(t, Tphone - 0.1, Tphone + 0.45));
    m.mando(g, t, ang, pulsa, alMando);
    const [px, py] = m.puntaMando(ang);
    const luz = k.tramo(t, Tlight - 0.05, Tstops + 0.05);
    const queda = 1 - k.suave(k.tramo(t, Tstops + 0.15, Tstops + 0.55));
    m.haz(g, px, py, m.OJO.x, m.OJO.y, luz, "190,120,255", queda * k.suave(k.tramo(t, Tlight - 0.12, Tlight + 0.15)));
    if (luz > 0.95 && queda > 0.2) k.brillo(g, m.OJO.x, m.OJO.y, 160, "190,120,255", queda);
    const fallo = k.pulso(t, Tsees, 0.2);
    m.haz(g, px, py, m.BAR.x + m.BAR.w / 2, m.BAR.y, fallo * 0.55, "190,120,255", fallo * 0.8);
    const mira = k.suave(k.tramo(t, Tpointed - 0.15, Tpointed + 0.2)) * (1 - k.suave(k.tramo(t, Tlight, Tlight + 0.3)));
    if (mira > 0.02) {
      g.save();
      g.globalAlpha = mira;
      g.strokeStyle = "rgba(255,255,255,0.9)";
      g.lineWidth = 10;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(m.OJO.x, m.OJO.y);
      g.stroke();
      g.restore();
    }
  });

  const uIn = k.tramo(t, Torder, Torder + 0.72) * (1 - k.tramo(t, 12.12, 12.95));
  const uNom = k.tramo(t, f(6).inicio, f(6).inicio + 0.62) * (1 - k.tramo(t, Tsame + 0.55, ToneRemote + 0.45));
  if (uIn > 0.02 && uNom < 0.5) abertura(g, t, uIn, cam);
  if (uNom > 0.02) {
    const boca = m.aPantalla(cam, 540, 1180);
    const c = k.entra(Math.min(1, uNom));
    const cx = k.mez(boca.x, 540, c);
    const cy = k.mez(boca.y, m.ANCLA, c);
    const r = k.mez(16, 1800, c);
    g.save();
    g.beginPath();
    g.arc(cx, cy, Math.max(1, r), 0, 6.2832);
    g.clip();
    nombres(g, t);
    g.restore();
    g.beginPath();
    g.arc(cx, cy, Math.max(1, r), 0, 6.2832);
    g.strokeStyle = "#5a3a16";
    g.lineWidth = 22;
    g.stroke();
  }

  if (t > 29.4 && t < 34.3) {
    g.save();
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 3; i++) {
      const u = (t * 0.95 + i / 3) % 1;
      g.beginPath();
      g.ellipse(540, 1180, 180 + u * 760, 70 + u * 260, 0, 0, 6.2832);
      g.strokeStyle = i % 2 ? `rgba(255,80,150,${(1 - u) * 0.55})` : `rgba(60,230,255,${(1 - u) * 0.6})`;
      g.lineWidth = 22 * (1 - u * 0.5);
      g.stroke();
    }
    g.restore();
  }
  movil(g, t);
  m.velo(g);

  const dedo = k.pulso(t, Tpress, 0.14);
  if (dedo > 0.05 && uIn < 0.2 && uNom < 0.2) {
    const p = m.aPantalla(cam, 640, 1280);
    g.beginPath();
    g.arc(p.x, p.y, 40, 0, 6.2832);
    g.fillStyle = `rgba(240,184,154,${dedo})`;
    g.fill();
  }
}
