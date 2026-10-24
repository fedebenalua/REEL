// De la ventana al extractor: el arreglo, con las manos, en el mismo baño.
import * as k from "#kit";
import { v } from "#voz";
import { azulejos, camara, gota, mancha, rutaCam, tina, velo, viñeta } from "../mundo.js";
import { botella, burbuja, cinta, cristal, cuchillo, esponja, gafas, guante, mascarilla, pistola, rasqueta, trapo, ventilador, ventana } from "../utiles.js";

export const desde = "Open";
export const entrada = "corte";

const f5 = v.frase(5), f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8);
const f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
const Topen = f5.inicio;
const Twin = f5.t("window");
const Tgloves = f5.t("gloves");
const Tgog = f5.t("goggles");
const Tmask = f5.t("n95");
const Tscore = f6.t("score");
const Tknife = f6.t("knife");
const Tpull = f6.t("pull");
const Tout = f6.finDe("out");
const Tscrub = f7.t("scrub");
const Tsoapy = f7.t("soapy");
const Twipe = f7.t("wipe");
const Talc = f7.finDe("alcohol");
const Tdry = f8.t("dry");
const Tway = f8.finDe("way");
const Twall = f8.t("wall");
const Tsoft = f8.t("soft");
const Tstop = f8.t("stop");
const Ttape = f9.t("tape");
const Trun = f9.t("run");
const Tsil = f9.finDe("silicone");
const Tsmooth = f10.t("smooth");
const Tfinger = f10.t("finger");
const Tpeel = f10.t("peel");
const Tstay = f11.t("stay");
const Ttube = f11.t("tube");
const Tday = f11.finDe("day");
const Tsq = f12.t("squeegee");
const Tglass = f12.t("glass");
const Tfan = f12.t("fan");
const Tback = f12.finDe("back");
const Tfin = v.frase(13).inicio;

const CAM = [
  [Topen, { x: -1100, y: -470, s: 1.62 }],
  [Twin + 0.3, { x: -1100, y: -450, s: 1.78 }],
  [Tgloves, { x: -860, y: -200, s: 1.28 }],
  [Tmask, { x: -860, y: -170, s: 1.42 }],
  [16.45, { x: -860, y: -160, s: 1.46 }],
  [Tscore - 0.02, { x: 40, y: -10, s: 1.62 }],
  [Tknife, { x: 180, y: 0, s: 1.72 }],
  [Tpull, { x: 80, y: -40, s: 1.85 }],
  [Tout + 0.15, { x: 60, y: -30, s: 1.8 }],
  [Tscrub, { x: 40, y: 10, s: 1.6 }],
  [Twipe, { x: 80, y: -10, s: 1.55 }],
  [Tdry, { x: 20, y: 0, s: 1.48 }],
  [Twall, { x: 30, y: -230, s: 1.5 }],
  [Tstop, { x: 40, y: -210, s: 1.55 }],
  [Ttape, { x: 60, y: 10, s: 1.58 }],
  [Trun, { x: 120, y: 6, s: 1.66 }],
  [Tsil, { x: 200, y: 0, s: 1.7 }],
  [Tsmooth, { x: 160, y: -6, s: 1.72 }],
  [Tpeel, { x: 140, y: 0, s: 1.64 }],
  [Tstay, { x: 120, y: -120, s: 1.05 }],
  [Tday, { x: 160, y: -80, s: 1.08 }],
  [Tsq, { x: 980, y: 80, s: 1.22 }],
  [Tglass, { x: 1000, y: 40, s: 1.28 }],
  [Tfan, { x: 990, y: -560, s: 1.38 }],
  [Tback, { x: 990, y: -540, s: 1.36 }],
  [Tfin, { x: 990, y: -540, s: 1.36 }],
];

function cartucho(g, x, y, esc, al) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const gr = g.createLinearGradient(-40, 0, 40, 0);
  gr.addColorStop(0, "#d5dbe2");
  gr.addColorStop(0.4, "#ffffff");
  gr.addColorStop(1, "#8d99a6");
  g.fillStyle = gr;
  k.redondo(g, -42, -150, 84, 250, 18);
  g.fill();
  g.fillStyle = "#f4efe4";
  g.beginPath();
  g.moveTo(-16, 90);
  g.lineTo(0, 150);
  g.lineTo(16, 90);
  g.fill();
  g.restore();
}

function alcachofa(g, x, y) {
  const metal = g.createLinearGradient(x - 30, y, x + 30, y);
  metal.addColorStop(0, "#5c6b7a");
  metal.addColorStop(0.4, "#f5fbff");
  metal.addColorStop(1, "#3e4c5a");
  g.fillStyle = metal;
  g.fillRect(x - 16, y - 260, 32, 200);
  g.beginPath();
  g.ellipse(x, y, 86, 32, 0, 0, 6.28);
  g.fill();
  g.fillStyle = "#1c2832";
  for (let i = -2; i <= 2; i++) {
    g.beginPath();
    g.arc(x + i * 22, y + 4, 5, 0, 6.28);
    g.fill();
  }
}

export function dibuja(g, t) {
  const abierta = k.mez(0.42, 1, k.entra(k.tramo(t, Topen, Twin + 0.4)));
  const entraYa = (t0) => k.suave(k.tramo(t, t0, t0 + 0.2));
  const saleYa = (t1) => 1 - k.suave(k.tramo(t, t1 - 0.2, t1));
  const avance = k.suave(k.tramo(t, Tscore, Tknife + 0.05));
  const sube = k.suave(k.tramo(t, Tpull, Tout + 0.2));
  const jabon = k.tramo(t, Tscrub, Tsoapy + 0.55);
  const alcohol = k.suave(k.tramo(t, Twipe, Talc + 0.15));
  const seco = k.suave(k.tramo(t, Tdry, Tway + 0.2));
  const empuje = k.suave(k.tramo(t, Twall, Tsoft + 0.12));
  const suelta = k.suave(k.tramo(t, Tstop - 0.04, Tstop + 0.28));
  const vuelve = k.suave(k.tramo(t, Tstop + 0.22, Ttape - 0.02));
  const cintaAl = k.suave(k.tramo(t, Ttape, Ttape + 0.45));
  const recorre = k.suave(k.tramo(t, Trun, Tsil - 0.05));
  const alisa = k.suave(k.tramo(t, Tsmooth, Tfinger + 0.35));
  const despega = k.suave(k.tramo(t, Tpeel, Tpeel + 0.55));
  const cuelga = k.suave(k.tramo(t, Tstay, Ttube));
  const dia = k.tramo(t, Tstay + 0.2, Tday);
  const noche = Math.sin(k.tramo(t, Tstay + 0.15, Tday) * Math.PI);
  const baja = k.suave(k.tramo(t, Tsq, Tglass + 0.28));
  const fanU = k.suave(k.tramo(t, Tfan, Tback - 0.02));
  const manchaFan = t < Tfan + 0.15
    ? k.suave(k.tramo(t, Tfan - 0.35, Tfan + 0.05))
    : 1 - k.suave(k.tramo(t, Tfan + 0.12, Tback - 0.28));

  g.save();
  camara(g, rutaCam(t, CAM));
  azulejos(g, -2600, -1900, 5600, 2000, 158);
  tina(g, -2600, 48, 5600, 1700);
  ventana(g, -1100, -470, abierta);
  cristal(g, 760, -280, 480, 980);

  const hueco = Math.max(sube, jabon * 0.2);
  g.fillStyle = `rgba(18, 14, 12, ${0.35 + hueco * 0.55})`;
  k.redondo(g, -260, -18, 820, 46, 16);
  g.fill();

  if (sube < 0.98) {
    g.save();
    g.translate(160, -sube * 250);
    g.rotate(-sube * 0.55);
    g.globalAlpha = 1 - sube * 0.15;
    g.fillStyle = "#140e0c";
    k.redondo(g, -300, -8, 620, 34 + sube * 20, 14);
    g.fill();
    const cg = g.createLinearGradient(0, -40, 0, 40);
    cg.addColorStop(0, "#fffdf8");
    cg.addColorStop(1, "#cbb89a");
    g.fillStyle = cg;
    k.redondo(g, -310, -36, 640, 58, 26);
    g.fill();
    if (sube < 0.2) {
      mancha(g, -80, -8, 40, 1, 0.7);
      mancha(g, 40, -4, 54, 1, 0.4);
      mancha(g, 160, -10, 36, 1, 0.8);
    }
    if (avance > 0.02 && sube < 0.15) {
      g.strokeStyle = "#2a2118";
      g.lineWidth = 5;
      const x2 = k.mez(-280, 300, avance);
      g.beginPath(); g.moveTo(-280, -22); g.lineTo(x2, -22); g.stroke();
      g.beginPath(); g.moveTo(-280, 16); g.lineTo(x2, 16); g.stroke();
    }
    g.restore();
  }

  if (jabon > 0.01 && recorre < 0.05 && seco < 0.9) {
    const x = k.mez(-180, 460, Math.min(1, jabon));
    esponja(g, x, 8, -0.2, 1.15, entraYa(Tscrub - 0.02) * (1 - alcohol) * (seco > 0.2 ? 1 - seco : 1));
    for (let i = 0; i < 8; i++) {
      const p = (t * 1.4 + i / 8) % 1;
      burbuja(g, x - 80 + i * 22, 20 - p * 70, 10 + (i % 3) * 4, (1 - alcohol) * (1 - p));
    }
  }
  if (alcohol > 0.02 && alcohol < 0.98 && seco < 0.2) {
    botella(g, 470, -90, -0.55, 1.45, 1);
    trapo(g, k.mez(-40, 380, alcohol), 6, 0.2, 1.1, 1);
  }
  if (hueco > 0.4 && recorre < 0.08) {
    g.save();
    g.globalAlpha = (1 - seco) * 0.55;
    g.fillStyle = "#7ec8ea";
    k.redondo(g, -240, -6, 780, 22, 8);
    g.fill();
    g.restore();
  }

  const baldosa = 1 - empuje * (1 - vuelve);
  g.save();
  g.translate(40, -250);
  g.scale(1, 0.35 + 0.65 * baldosa);
  azulejos(g, -90, -80, 180, 160, 180);
  g.restore();
  if (empuje > 0.15 && vuelve < 0.9) {
    g.save();
    g.globalAlpha = empuje * (1 - vuelve);
    g.fillStyle = "#4a2e18";
    k.redondo(g, -40, -300, 150, 70, 12);
    g.fill();
    mancha(g, 30, -270, 40, empuje * (1 - vuelve), 0.3);
    g.restore();
  }

  const cintaViva = cintaAl * (1 - despega);
  if (cintaViva > 0.03) {
    const sal = despega * 180;
    cinta(g, -240, -78 - sal, 760, 34, cintaViva);
    cinta(g, -240, 58 + sal, 760, 34, cintaViva);
  }

  if (recorre > 0.02) {
    const x1 = k.mez(-220, 500, recorre);
    const alto = k.mez(34, 18, alisa);
    const gr = g.createLinearGradient(0, -alto, 0, alto);
    gr.addColorStop(0, "#ffffff");
    gr.addColorStop(0.5, "#f6f1e6");
    gr.addColorStop(1, "#d9cbb6");
    g.fillStyle = gr;
    k.redondo(g, -230, -alto / 2, x1 + 230, alto, alto / 2);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.75)";
    g.fillRect(-210, -alto * 0.35, Math.max(0, x1 + 190), 6);
  }

  if (t > Tscore - 0.28 && t < Tpull + 0.28) {
    const xk = k.mez(-200, 340, avance);
    const ak = entraYa(Tscore - 0.22) * saleYa(Tpull + 0.22);
    guante(g, xk - 40, 70, -0.4, 1.05, ak);
    cuchillo(g, xk + 30, -10, -0.15, 1.15, ak);
  }
  if (t > Tpull - 0.28 && t < Tscrub + 0.05) {
    guante(g, 200, -20 - sube * 180, -0.8, 1.2, entraYa(Tpull - 0.18) * saleYa(Tscrub));
  }
  if (t > Twall - 0.32 && t < Ttape) {
    const yDedo = k.mez(-40, -210, empuje) - suelta * 220;
    guante(g, 70, yDedo, 0.4, 1.15, entraYa(Twall - 0.22) * saleYa(Ttape - 0.02) * (1 - vuelve * 0.15));
  }
  if (t > Trun - 0.4 && t < Tsmooth + 0.15) {
    const xg = k.mez(-80, 460, recorre);
    const ag = entraYa(Trun - 0.28) * saleYa(Tsmooth);
    pistola(g, xg, -50, -0.35, 1.15, ag);
    guante(g, xg - 80, 40, 0.2, 1, ag);
  }
  if (t > Tsmooth - 0.32 && t < Tpeel + 0.28) {
    const xd = k.mez(-120, 460, alisa);
    guante(g, xd, 24, 0.6, 1.25, entraYa(Tsmooth - 0.2) * saleYa(Tpeel + 0.22));
  }

  alcachofa(g, 200, -430);
  if (t > Tstay - 0.05 && t < Tsq) {
    gota(g, 200 + Math.sin(t * 5) * 2, -390 + cuelga * 46, 16, 0.95);
    cartucho(g, 470, -40, 1.35, k.suave(k.tramo(t, Tstay, Tstay + 0.4)));
  }
  if (t > Tstay && t < Tday + 0.15) {
    g.save();
    g.globalAlpha = 1 - noche;
    g.fillStyle = "#ffe08a";
    g.beginPath();
    g.arc(k.mez(-260, 680, dia), -360, 64, 0, 6.28);
    g.fill();
    g.restore();
  }

  if (t > Tsq - 0.28 && t < Tfan + 0.28) {
    const ys = k.mez(-220, 420, baja);
    const ar = entraYa(Tsq - 0.18) * saleYa(Tfan + 0.12);
    rasqueta(g, 1000, ys, 0, 1.2, ar);
    guante(g, 1040, ys + 150, 0.1, 1.05, ar);
    g.save();
    g.globalAlpha = 0.45 * (1 - baja);
    g.fillStyle = "#8fd4f2";
    for (let i = 0; i < 6; i++) g.fillRect(820 + i * 60, ys + 30, 18, 360);
    g.restore();
  }
  const angFan = fanU * 12;
  ventilador(g, 990, -620, 1.15, angFan, 1);
  if (manchaFan > 0.04 && t > Tglass) mancha(g, 820, -470, 90 * manchaFan + 24, manchaFan, 0.85);

  g.restore();

  if (t > Tgloves - 0.35 && t < Tscore - 0.05) {
    const c = rutaCam(t, CAM);
    g.save();
    camara(g, c);
    const cg = k.suave(k.tramo(t, Tgloves - 0.25, Tgloves + 0.35));
    const gg = k.suave(k.tramo(t, Tgog - 0.12, Tgog + 0.4));
    const mg = k.suave(k.tramo(t, Tmask - 0.12, Tmask + 0.4));
    guante(g, -1040, k.mez(-980, -40, cg), 0.2, 1.85, cg);
    guante(g, -700, k.mez(-1000, -10, cg), -0.25, 1.85, cg);
    gafas(g, -980, k.mez(-1040, -340, gg), 1.55, gg);
    mascarilla(g, -740, k.mez(-1060, -360, mg), 1.65, mg);
    g.restore();
  }

  if (noche > 0.03 && t < Tsq) {
    g.save();
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = `rgba(8, 16, 48, ${noche * 0.5})`;
    g.fillRect(0, 0, 1080, 1920);
    g.restore();
  }
  viñeta(g, 0.4);
  velo(g, 0.78);
}
