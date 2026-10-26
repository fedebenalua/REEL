// La pared, el pomo y el parche. Lo que se repite, una sola vez.
import * as k from "#kit";
import { v } from "#voz";

const TAU = Math.PI * 2;
const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);

export const camara = (g, c) => { g.translate(540, 960); g.scale(c.s, c.s); g.translate(-c.x, -c.y); };
const mezCam = (a, b, u) => ({ x: k.mez(a.x, b.x, u), y: k.mez(a.y, b.y, u), s: Math.exp(k.mez(Math.log(a.s), Math.log(b.s), u)) });
export function rutaCam(t, lista) {
  if (t <= lista[0][0]) return lista[0][1];
  for (let i = 0; i < lista.length - 1; i++) {
    const [t0, a] = lista[i], [t1, b] = lista[i + 1];
    if (t <= t1) return mezCam(a, b, k.suave(k.tramo(t, t0, t1)));
  }
  return lista[lista.length - 1][1];
}

export function velo(g, a = 0.86) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createLinearGradient(0, 80, 0, 620);
  gr.addColorStop(0, `rgba(42, 18, 8, ${a})`);
  gr.addColorStop(0.55, `rgba(42, 18, 8, ${a * 0.55})`);
  gr.addColorStop(1, "rgba(42, 18, 8, 0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 640);
  g.restore();
}
export function viñeta(g, a = 0.38) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gr = g.createRadialGradient(540, 980, 420, 540, 1040, 1180);
  gr.addColorStop(0, "rgba(0,0,0,0)");
  gr.addColorStop(1, `rgba(48, 18, 8, ${a})`);
  g.fillStyle = gr;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

const POSE = { x: 6, y: 18, s: 2.08 };
const escombros = Array.from({ length: 14 }, (_, i) => {
  const a = k.azar(30 + i);
  return { ang: a() * TAU, vel: 320 + a() * 520, tam: 34 + a() * 46, giro: a() * TAU, papel: a() > 0.45, sem: a() };
});

function paredFondo(g) {
  const gr = g.createLinearGradient(-700, -900, 800, 1100);
  gr.addColorStop(0, "#ffd19a");
  gr.addColorStop(0.45, "#f29a4e");
  gr.addColorStop(1, "#d86a32");
  g.fillStyle = gr;
  g.fillRect(-1600, -1600, 3200, 3200);
  const luz = g.createRadialGradient(-380, -520, 40, -200, -280, 1100);
  luz.addColorStop(0, "rgba(255, 236, 200, 0.72)");
  luz.addColorStop(1, "rgba(255, 236, 200, 0)");
  g.fillStyle = luz;
  g.fillRect(-1600, -1600, 3200, 3200);
  g.save();
  g.globalAlpha = 0.14;
  g.globalCompositeOperation = "multiply";
  g.drawImage(k.manchas, -900, -1100, 2200, 2400);
  g.restore();
}

function caminoAgujero(g, rx, ry, semilla = 1) {
  g.beginPath();
  const n = 20;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU;
    const j = 1 + 0.1 * Math.sin(a * 3 + semilla) + 0.05 * Math.sin(a * 7 + 2);
    const x = Math.cos(a) * rx * j, y = Math.sin(a) * ry * j;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
}

function agujero(g, rx, ry, abierto = 1) {
  if (abierto < 0.02) return;
  g.save();
  g.scale(abierto, abierto);
  g.save();
  caminoAgujero(g, rx, ry);
  g.clip();
  g.fillStyle = "#1a100c";
  g.fillRect(-rx * 2, -ry * 2, rx * 4, ry * 4);
  g.fillStyle = "#ff8fb8";
  g.globalAlpha = 0.9;
  g.beginPath(); g.ellipse(-rx * 0.2, ry * 0.05, rx * 0.55, ry * 0.42, 0.4, 0, TAU); g.fill();
  g.fillStyle = "#ffb0cc";
  g.beginPath(); g.ellipse(rx * 0.22, -ry * 0.12, rx * 0.36, ry * 0.28, -0.5, 0, TAU); g.fill();
  g.restore();
  g.lineWidth = 16;
  g.strokeStyle = "#f7f3ea";
  caminoAgujero(g, rx, ry);
  g.stroke();
  g.lineWidth = 7;
  g.strokeStyle = "#b88858";
  caminoAgujero(g, rx + 8, ry + 8, 2);
  g.stroke();
  g.fillStyle = "#c4a06a";
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * TAU + 0.4;
    g.save();
    g.translate(Math.cos(a) * rx * 0.92, Math.sin(a) * ry * 0.92);
    g.rotate(a);
    g.beginPath();
    g.moveTo(0, -8); g.lineTo(26, -4); g.lineTo(18, 10); g.closePath();
    g.fill();
    g.restore();
  }
  g.restore();
}

function pomo(g, x, y, esc = 1) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  const gr = g.createRadialGradient(-16, -20, 6, 4, 4, 58);
  gr.addColorStop(0, "#fff8dc");
  gr.addColorStop(0.42, "#e7b84a");
  gr.addColorStop(1, "#6e4a12");
  g.fillStyle = gr;
  g.beginPath(); g.arc(0, 0, 54, 0, TAU); g.fill();
  g.strokeStyle = "#a67c28";
  g.lineWidth = 7;
  g.beginPath(); g.arc(0, 0, 34, 0, TAU); g.stroke();
  g.fillStyle = "#5c3e10";
  g.beginPath(); g.arc(0, 0, 12, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath(); g.ellipse(-16, -16, 10, 16, -0.6, 0, TAU); g.fill();
  g.restore();
}

function puerta(g, dx, al = 1, y0 = 30) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.translate(-620 + dx, y0);
  const gr = g.createLinearGradient(-40, -640, 460, 700);
  gr.addColorStop(0, "#083632");
  gr.addColorStop(0.35, "#1aa196");
  gr.addColorStop(1, "#0c4e48");
  g.fillStyle = gr;
  k.redondo(g, 0, -620, 520, 1240, 18);
  g.fill();
  g.strokeStyle = "rgba(220, 255, 246, 0.28)";
  g.lineWidth = 12;
  k.redondo(g, 48, -540, 420, 460, 14); g.stroke();
  k.redondo(g, 48, 0, 420, 500, 14); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.08)";
  g.fillRect(36, -620, 28, 1240);
  g.restore();
  pomo(g, -80 + dx, y0 - 10, 1);
}

function trozos(g, u) {
  const viaje = Math.max(0, u - 0.62);
  if (viaje <= 0) return;
  for (const e of escombros) {
    const d = viaje * e.vel;
    const x = Math.cos(e.ang) * d, y = Math.sin(e.ang) * d * 0.85;
    g.save();
    g.translate(x, y);
    g.rotate(e.giro + viaje * 3);
    g.fillStyle = e.papel ? "#c9a36e" : "#f4efe4";
    k.redondo(g, -e.tam / 2, -e.tam * 0.35, e.tam, e.tam * 0.7, 6);
    g.fill();
    if (!e.papel) {
      g.fillStyle = "#d7b48a";
      g.fillRect(-e.tam / 2, -4, e.tam, 8);
    }
    g.restore();
  }
}

function guante(g, x, y, rot = 0, esc = 1, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.rotate(rot);
  g.scale(esc, esc);
  g.globalAlpha *= al;
  const piel = g.createLinearGradient(-70, -160, 60, 140);
  piel.addColorStop(0, "#ffe56a");
  piel.addColorStop(0.5, "#ffb000");
  piel.addColorStop(1, "#d87800");
  g.fillStyle = piel;
  g.beginPath(); g.ellipse(8, 24, 86, 100, 0, 0, TAU); g.fill();
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -52 + i * 32, -158 + (i === 0 || i === 3 ? 22 : 0), 30, 120, 14);
    g.fill();
  }
  g.save();
  g.translate(-78, 8);
  g.rotate(0.65);
  k.redondo(g, -16, -90, 38, 108, 16);
  g.fill();
  g.restore();
  k.redondo(g, -86, 78, 180, 64, 22);
  g.fill();
  g.fillStyle = "rgba(255, 250, 214, 0.4)";
  g.beginPath(); g.ellipse(-8, -4, 18, 40, -0.4, 0, TAU); g.fill();
  g.restore();
}

function parche(g, al = 1, yPapel = 0) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "#e6b422";
  k.redondo(g, -176, -176, 352, 352, 16);
  g.fill();
  g.strokeStyle = "rgba(110, 72, 8, 0.45)";
  g.lineWidth = 3;
  for (let i = -154; i <= 154; i += 22) {
    g.beginPath(); g.moveTo(i, -166); g.lineTo(i, 166); g.stroke();
    g.beginPath(); g.moveTo(-166, i); g.lineTo(166, i); g.stroke();
  }
  const m = g.createLinearGradient(-120, -130, 120, 130);
  m.addColorStop(0, "#3c464e");
  m.addColorStop(0.28, "#f5f8fb");
  m.addColorStop(0.62, "#9aa7b2");
  m.addColorStop(1, "#2c343b");
  g.fillStyle = m;
  k.redondo(g, -112, -112, 224, 224, 8);
  g.fill();
  g.fillStyle = "#243038";
  for (let yy = -78; yy <= 78; yy += 26) for (let xx = -78; xx <= 78; xx += 26) {
    g.beginPath(); g.arc(xx, yy, 3.5, 0, TAU); g.fill();
  }
  if (yPapel > 0.03) {
    g.save();
    g.translate(40, -20);
    g.rotate(-0.4 * yPapel);
    g.fillStyle = "#f7f4ee";
    k.redondo(g, -150, -170, 300, 300 * (1 - yPapel * 0.15), 12);
    g.fill();
    g.fillStyle = "rgba(180, 170, 150, 0.35)";
    g.fillRect(-140, -20, 260, 8);
    g.restore();
  }
  g.restore();
}

function barro(g, rx, ry, al, humedo) {
  if (al < 0.02 || rx < 2) return;
  g.save();
  g.globalAlpha *= al;
  const gr = g.createRadialGradient(-rx * 0.15, -ry * 0.25, rx * 0.08, 0, 0, Math.max(rx, ry));
  gr.addColorStop(0, humedo > 0.45 ? "#fffef8" : "#f4ecdc");
  gr.addColorStop(0.62, "#efe6d4");
  gr.addColorStop(1, "rgba(239, 230, 212, 0)");
  g.fillStyle = gr;
  g.beginPath(); g.ellipse(0, 0, rx, ry, 0, 0, TAU); g.fill();
  if (humedo > 0.15) {
    g.globalAlpha *= 0.55 * humedo;
    g.fillStyle = "#ffffff";
    g.beginPath(); g.ellipse(-rx * 0.1, -ry * 0.18, rx * 0.42, ry * 0.14, -0.3, 0, TAU); g.fill();
  }
  g.restore();
}

function llana(g, x, y, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  const metal = g.createLinearGradient(0, -34, 0, 34);
  metal.addColorStop(0, "#c5ced6");
  metal.addColorStop(0.45, "#fbfdff");
  metal.addColorStop(1, "#7f8c98");
  g.fillStyle = metal;
  k.redondo(g, -210, -30, 300, 60, 8);
  g.fill();
  g.fillStyle = "#12756c";
  k.redondo(g, 78, -18, 120, 36, 12);
  g.fill();
  g.restore();
}

function bulto(g, s, al) {
  if (al < 0.02) return;
  g.save();
  g.globalAlpha *= al;
  const gr = g.createRadialGradient(-30 * s, -50 * s, 10, 10, 20, 120 * s);
  gr.addColorStop(0, "#fffefb");
  gr.addColorStop(0.7, "#e7dcc8");
  gr.addColorStop(1, "#cbbfa8");
  g.fillStyle = gr;
  g.beginPath(); g.ellipse(0, 18 * (1 - s), 150 * s, 78 * s + 10, 0, 0, TAU); g.fill();
  g.fillStyle = "rgba(90, 50, 20, 0.22)";
  g.beginPath(); g.ellipse(18, 70 * s, 120 * s, 22, 0, 0, TAU); g.fill();
  g.restore();
}

export function escenaPared(g, t) {
  const corteEn = f6.t("sand") - 0.04;
  const quieto = t > corteEn - 0.22;
  const tt = quieto ? corteEn - 0.22 : t;
  const uGolpe = tt < 0.04 ? 1 : k.mez(1, 1.62, k.suave(k.tramo(tt, 0.04, f1.t("wall") + 0.15)));
  const dentro = k.suave(k.tramo(tt, f2.t("drywall") + 0.15, f2.t("filler") + 0.05));
  const fuera = k.suave(k.tramo(tt, f2.t("through") + 0.28, f3.t("peel") + 0.12));
  const wipe = dentro * (1 - fuera);
  const pela = k.suave(k.tramo(tt, f3.t("peel"), f3.t("patch")));
  const acerca = k.suave(k.tramo(tt, f3.t("patch") - 0.05, f3.t("press")));
  const aplasta = k.suave(k.tramo(tt, f3.t("press"), f3.t("on") + 0.25));
  const c1 = k.suave(k.tramo(tt, f4.inicio, f4.t("thin") + 0.15));
  const c2 = k.suave(k.tramo(tt, f4.t("coats"), f4.t("compound")));
  const c3 = k.suave(k.tramo(tt, f4.t("let"), f4.t("dry") + 0.25));
  const crece = k.suave(k.tramo(tt, f5.inicio, f5.t("blob") + 0.2));
  const encoge = k.suave(k.tramo(tt, f5.t("shrinks"), f5.t("hump") + 0.12));
  const ancha = k.suave(k.tramo(tt, f5.t("last"), f5.t("wide") + 0.15));
  const cam = rutaCam(tt, [
    [0, POSE],
    [f1.t("hole"), { x: -70, y: 24, s: 1.42 }],
    [f1.fin, { x: 16, y: 0, s: 1.95 }],
    [f2.t("punched"), { x: -20, y: -10, s: 1.55 }],
    [f2.t("filler"), { x: 90, y: 20, s: 1.5 }],
    [f2.t("through"), { x: 150, y: 180, s: 1.35 }],
    [f3.t("peel"), { x: 80, y: -80, s: 1.65 }],
    [f3.t("press"), { x: 0, y: 0, s: 1.85 }],
    [f3.t("edge"), { x: -40, y: 30, s: 1.15 }],
    [f4.t("three"), { x: 90, y: -50, s: 1.9 }],
    [f4.t("thin"), { x: -70, y: 50, s: 1.18 }],
    [f4.t("coats"), { x: 80, y: -20, s: 1.75 }],
    [f4.t("let"), { x: -50, y: 40, s: 1.22 }],
    [f4.t("dry"), { x: 0, y: 0, s: 1.5 }],
    [f5.t("blob"), { x: 0, y: -30, s: 1.85 }],
    [f5.t("hump"), { x: 10, y: 10, s: 1.4 }],
    [f5.t("wide"), { x: 0, y: 40, s: 0.98 }],
    [corteEn, { x: 0, y: 40, s: 0.98 }],
  ]);
  g.save();
  camara(g, cam);
  paredFondo(g);
  const puertaAl = 1 - k.suave(k.tramo(tt, f2.t("filler") - 0.1, f2.t("falls")));
  const vibra = tt < f2.t("drywall") ? Math.sin(tt * 46) * 7 * (1 - k.suave(k.tramo(tt, f2.t("punched"), f2.t("drywall")))) : 0;
  if (puertaAl > 0.05 && fuera < 0.4) puerta(g, 80 + vibra, puertaAl);
  agujero(g, 150, 168, 1);
  if (tt < f2.t("filler")) trozos(g, uGolpe);
  if (wipe > 0.02) {
    g.save();
    g.beginPath();
    g.arc(0, 0, k.mez(18, 1400, wipe), 0, TAU);
    g.clip();
    corteHueco(g, tt);
    g.restore();
    g.strokeStyle = "#f4efe6";
    g.lineWidth = 18;
    g.beginPath(); g.arc(0, 0, k.mez(18, 1400, wipe), 0, TAU); g.stroke();
  }
  const puesto = Math.max(aplasta, ancha > 0 ? 1 : 0);
  if (fuera > 0.35 && ancha < 0.92) {
    const xP = k.mez(280, 0, acerca);
    const yP = k.mez(-240, 0, acerca);
    g.save();
    g.translate(xP, yP);
    g.rotate((1 - aplasta) * -0.25);
    parche(g, k.mez(0, 1, Math.max(pela, acerca)), 1 - pela);
    g.restore();
    guante(g, xP + 150, yP + 170, -0.2, 0.85, 1 - k.suave(k.tramo(tt, f4.inicio, f4.t("thin"))));
  }
  const capas = (1 - k.suave(k.tramo(encoge, 0.02, 0.55))) * (1 - k.suave(k.tramo(ancha, 0, 0.2)));
  if (c1 > 0.02 && capas > 0.02) {
    barro(g, k.mez(40, 130, c1), k.mez(30, 100, c1), 0.95 * capas, 1 - k.suave(k.tramo(tt, f4.t("thin"), f4.t("coats"))));
    barro(g, k.mez(130, 210, c2), k.mez(100, 160, c2), c2 * capas, 1 - k.suave(k.tramo(tt, f4.t("compound"), f4.t("let"))));
    barro(g, k.mez(210, 280, c3), k.mez(160, 210, c3), c3 * capas, 1 - k.suave(k.tramo(tt, f4.t("one"), f4.t("dry") + 0.3)));
    const borde = c3 > 0.2 ? k.mez(210, 280, c3) : c2 > 0.2 ? k.mez(130, 210, c2) : k.mez(40, 130, c1);
    llana(g, borde - 40, -8, capas * (1 - k.suave(k.tramo(tt, f4.t("dry") + 0.15, f5.inicio))));
  }
  if (crece > 0.02 && ancha < 0.85) {
    const s = k.mez(0.35, 1.25, crece) * k.mez(1, 0.62, encoge);
    bulto(g, s, 1 - ancha);
  }
  if (ancha > 0.02) {
    barro(g, k.mez(200, 460, ancha), k.mez(150, 340, ancha), 0.96, 1 - k.suave(k.tramo(tt, f5.t("wide") - 0.1, f5.fin)));
    llana(g, k.mez(-80, 420, ancha), 10, 1 - k.suave(k.tramo(tt, f5.t("wide"), f5.fin)));
  }
  g.restore();
}

function corteHueco(g, t) {
  g.fillStyle = "#2a1812";
  g.fillRect(-1800, -1800, 3600, 3600);
  g.fillStyle = "#f29a4e";
  g.fillRect(-1800, -1800, 1740, 3600);
  const tabla = g.createLinearGradient(-90, 0, 90, 0);
  tabla.addColorStop(0, "#d8c7a4");
  tabla.addColorStop(0.5, "#fffaf2");
  tabla.addColorStop(1, "#b7a484");
  g.fillStyle = tabla;
  g.fillRect(-78, -900, 156, 1800);
  g.fillStyle = "#2a1812";
  g.fillRect(-78, -130, 156, 260);
  g.fillStyle = "#c9a36e";
  g.fillRect(-86, -900, 10, 1800);
  g.fillRect(76, -900, 10, 1800);
  const mad = g.createLinearGradient(200, 0, 340, 0);
  mad.addColorStop(0, "#8a4e22");
  mad.addColorStop(0.5, "#e0a15a");
  mad.addColorStop(1, "#6a3814");
  g.fillStyle = mad;
  g.fillRect(230, -900, 90, 1800);
  g.fillStyle = "#ff8fb8";
  g.globalAlpha = 0.85;
  g.beginPath(); g.ellipse(160, -80, 90, 220, 0.1, 0, TAU); g.fill();
  g.beginPath(); g.ellipse(175, 180, 80, 200, -0.1, 0, TAU); g.fill();
  g.globalAlpha = 1;
  g.fillStyle = "#6a3818";
  g.fillRect(-200, 430, 620, 46);
  const empuja = k.suave(k.tramo(t, f2.t("filler"), f2.t("falls") + 0.12));
  const baja = k.suave(k.tramo(t, f2.t("falls"), f2.t("through") + 0.18));
  const bx = k.mez(-190, 40, empuja);
  const by = k.mez(-10, 390, baja);
  g.fillStyle = "#fffaf3";
  g.beginPath(); g.ellipse(bx, by, k.mez(54, 36, baja), k.mez(40, 26, baja), 0, 0, TAU); g.fill();
  g.globalAlpha = 0.85;
  g.beginPath(); g.ellipse(bx + 28, by - 30 * (1 - baja), 16, 14, 0, 0, TAU); g.fill();
  g.globalAlpha = 1;
  if (baja > 0.85) {
    g.fillStyle = "rgba(255,250,243,0.9)";
    g.beginPath(); g.ellipse(50, 418, 70, 16, 0, 0, TAU); g.fill();
  }
  const kx = k.mez(-280, -70, empuja);
  llana(g, kx, -10, 1 - k.suave(k.tramo(t, f2.t("through") - 0.05, f2.t("through") + 0.25)));
  guante(g, kx + 40, 150, 0.1, 0.9, 1 - baja * 0.2);
}

function rodillo(g, x, y, color, al = 1) {
  if (al < 0.03) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha *= al;
  g.fillStyle = "#163a38";
  k.redondo(g, 70, -16, 150, 34, 12);
  g.fill();
  const gr = g.createLinearGradient(0, -48, 0, 48);
  gr.addColorStop(0, "#222");
  gr.addColorStop(0.3, color);
  gr.addColorStop(0.7, color);
  gr.addColorStop(1, "#222");
  g.fillStyle = gr;
  k.redondo(g, -150, -46, 230, 92, 28);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)";
  g.fillRect(-130, -34, 180, 10);
  g.restore();
}

export function escenaPintura(g, t) {
  const corteEn = f8.t("doorstop") - 0.04;
  const quieto = t > corteEn - 0.22;
  const tt = quieto ? corteEn - 0.22 : t;
  const lija = k.suave(k.tramo(tt, f6.inicio, f6.t("prime") - 0.08));
  const impri = k.suave(k.tramo(tt, f6.t("prime") - 0.05, f6.t("paint")));
  const pinta = k.suave(k.tramo(tt, f6.t("paint"), f6.t("color") + 0.2));
  const mal = k.suave(k.tramo(tt, f7.t("primer"), f7.t("shows") + 0.15));
  const cam = rutaCam(tt, [
    [f6.inicio, { x: 0, y: 20, s: 2.55 }],
    [f6.t("lightly"), { x: 30, y: 10, s: 2.05 }],
    [f6.t("prime"), { x: -20, y: 0, s: 1.6 }],
    [f6.t("color"), { x: 10, y: 16, s: 1.35 }],
    [f7.inicio, { x: 0, y: 0, s: 1.7 }],
    [f7.t("shows"), { x: 0, y: -10, s: 1.85 }],
    [f7.t("paint"), { x: 0, y: 16, s: 1.22 }],
    [corteEn, { x: 0, y: 16, s: 1.22 }],
  ]);
  g.save();
  camara(g, cam);
  paredFondo(g);
  g.save();
  g.globalAlpha = 0.42 * (1 - impri);
  g.fillStyle = "#3a1c10";
  g.fillRect(-1600, -1600, 3200, 3200);
  g.restore();
  barro(g, 250, 190, 0.55 * (1 - pinta) * (1 - mal), 0.15);
  const sx = k.mez(-180, 180, (Math.sin(tt * 7) * 0.5 + 0.5) * (1 - k.suave(k.tramo(tt, f6.t("lightly"), f6.t("prime")))));
  const sy = 20 + Math.sin(tt * 11) * 24 * (1 - impri);
  if (impri < 0.85) {
    g.save();
    g.translate(sx, sy);
    g.scale(k.mez(2.3, 1, lija), k.mez(2.3, 1, lija));
    g.fillStyle = "#f2c14d";
    k.redondo(g, -70, -48, 140, 96, 16);
    g.fill();
    g.fillStyle = "#c98418";
    for (let i = -3; i <= 3; i++) g.fillRect(-58, i * 12, 116, 4);
    g.restore();
    g.fillStyle = "rgba(90, 60, 30, 0.35)";
    for (let i = 0; i < 8; i++) {
      const a = k.azar(i + 4);
      g.beginPath(); g.arc(sx + 80 + a() * 40, sy - 20 + a() * 30, 3, 0, TAU); g.fill();
    }
  }
  if (impri > 0.02 && mal < 0.2) {
    g.save();
    g.globalAlpha = impri * (1 - pinta * 0.85);
    g.fillStyle = "rgba(248, 248, 244, 0.92)";
    g.beginPath(); g.ellipse(k.mez(-80, 40, impri), 10, k.mez(40, 340, impri), k.mez(30, 250, impri), 0, 0, TAU); g.fill();
    g.restore();
    rodillo(g, k.mez(-220, 280, impri), 0, "#f4f1ea", 1 - pinta);
    guante(g, k.mez(-40, 460, impri), 150, 0.2, 0.8, 1 - pinta);
  }
  if (pinta > 0.02 && mal < 0.98) {
    const queda = 1 - mal;
    g.save();
    g.globalAlpha = queda;
    g.fillStyle = `rgba(242, 154, 78, ${pinta})`;
    g.beginPath(); g.ellipse(0, 16, k.mez(60, 420, pinta), k.mez(40, 300, pinta), 0, 0, TAU); g.fill();
    g.restore();
    rodillo(g, k.mez(-240, 520, k.suave(k.tramo(tt, f6.t("paint"), f7.inicio - 0.08))), 8, "#f29a4e", queda * (1 - k.suave(k.tramo(tt, f7.inicio - 0.25, f7.inicio))));
  }
  if (mal > 0.02) {
    g.save();
    g.globalAlpha = mal;
    const anillo = g.createRadialGradient(0, 8, 30, 0, 8, 250);
    anillo.addColorStop(0, "rgba(214, 206, 196, 0.96)");
    anillo.addColorStop(0.62, "rgba(176, 166, 154, 0.9)");
    anillo.addColorStop(0.84, "rgba(168, 158, 146, 0.45)");
    anillo.addColorStop(1, "rgba(168, 158, 146, 0)");
    g.fillStyle = anillo;
    g.beginPath(); g.arc(0, 8, 250, 0, TAU); g.fill();
    g.strokeStyle = "rgba(120, 108, 96, 0.85)";
    g.lineWidth = 10;
    g.beginPath(); g.ellipse(0, 8, 168, 132, 0, 0, TAU); g.stroke();
    g.restore();
    const barr = k.suave(k.tramo(tt, f7.inicio, f7.t("patch")));
    rodillo(g, k.mez(-180, 220, barr), 12, "#e7b07a", 1 - k.suave(k.tramo(tt, f7.t("shows"), f7.t("paint"))));
  }
  g.restore();
}

function tope(g, x, y, esc, entra) {
  g.save();
  g.translate(x, y);
  g.scale(esc, esc);
  g.globalAlpha *= entra;
  const lat = g.createLinearGradient(-30, 0, 30, 220);
  lat.addColorStop(0, "#fff0b8");
  lat.addColorStop(0.45, "#e2b84e");
  lat.addColorStop(1, "#7a5a20");
  g.fillStyle = lat;
  k.redondo(g, -24, 36, 48, 200, 14);
  g.fill();
  g.fillStyle = "#e10600";
  g.beginPath(); g.arc(0, 0, 52, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.beginPath(); g.ellipse(-16, -14, 16, 10, -0.4, 0, TAU); g.fill();
  g.restore();
}

export function escenaTope(g, t) {
  const corteEn = f9.t("bigger") - 0.04;
  const quieto = t > corteEn - 0.22;
  const tt = quieto ? corteEn - 0.22 : t;
  const entra = k.suave(k.tramo(tt, f8.inicio, f8.t("baseboard") + 0.05));
  const llega = k.suave(k.tramo(tt, f8.t("baseboard"), f8.t("keeps") + 0.08));
  const sube = k.suave(k.tramo(tt, f8.t("knob") - 0.2, f8.t("wall") + 0.05));
  const cam = rutaCam(tt, [
    [f8.inicio, { x: 40, y: 430, s: 1.9 }],
    [f8.t("baseboard"), { x: 60, y: 400, s: 1.75 }],
    [f8.t("knob"), { x: 80, y: -40, s: 1.4 }],
    [f8.t("wall"), { x: 140, y: -70, s: 1.55 }],
    [corteEn, { x: 140, y: -70, s: 1.55 }],
  ]);
  const dx = k.mez(-60, 200, llega);
  g.save();
  camara(g, cam);
  paredFondo(g);
  g.fillStyle = "#f4ead8";
  g.fillRect(-1400, 500, 2800, 110);
  g.fillStyle = "#e4c49a";
  g.fillRect(-1400, 610, 2800, 800);
  g.save();
  g.globalAlpha = 0.2;
  g.strokeStyle = "#b88858";
  g.lineWidth = 4;
  for (let y = 380; y < 1000; y += 34) { g.beginPath(); g.moveTo(-900, y); g.lineTo(1000, y + 6); g.stroke(); }
  g.restore();
  puerta(g, dx, 1, -80);
  tope(g, 130, 470, 1.15, entra);
  if (llega > 0.72) {
    g.save();
    g.globalAlpha = k.suave(k.tramo(llega, 0.72, 1));
    g.fillStyle = "rgba(225, 40, 30, 0.35)";
    g.beginPath(); g.ellipse(168, 78, 36, 18, 0, 0, TAU); g.fill();
    g.restore();
  }
  if (sube > 0.35) {
    g.save();
    g.globalAlpha = sube;
    g.fillStyle = "rgba(90, 40, 20, 0.45)";
    g.beginPath(); g.ellipse(310, -90, 78, 86, 0, 0, TAU); g.fill();
    g.restore();
  }
  g.restore();
}

export function escenaGrande(g, t) {
  const corteEn = f10.t("send") - 0.04;
  const quieto = t > corteEn - 0.22;
  const tt = quieto ? corteEn - 0.22 : t;
  const mano = k.suave(k.tramo(tt, f9.t("six") - 0.08, f9.t("inches") + 0.15));
  const cable = k.suave(k.tramo(tt, f9.t("or"), f9.t("wire") + 0.2));
  const sierra = k.suave(k.tramo(tt, f9.t("dont"), f9.t("saw") + 0.15));
  const pro = k.suave(k.tramo(tt, f9.t("call"), f9.t("pro") + 0.15));
  const cam = rutaCam(tt, [
    [f9.inicio, { x: 0, y: -20, s: 1.15 }],
    [f9.t("six"), { x: 40, y: 0, s: 1.28 }],
    [f9.t("wire"), { x: -20, y: -30, s: 1.7 }],
    [f9.t("dont"), { x: 0, y: 180, s: 1.25 }],
    [f9.t("call"), { x: -80, y: 40, s: 1.05 }],
    [corteEn, { x: -80, y: 40, s: 1.05 }],
  ]);
  g.save();
  camara(g, cam);
  paredFondo(g);
  agujero(g, 430, 390, 1);
  g.save();
  g.beginPath();
  caminoAgujero(g, 410, 370);
  g.clip();
  g.strokeStyle = "#ffe14a";
  g.lineWidth = 44;
  g.lineCap = "round";
  g.beginPath(); g.moveTo(-120, -220); g.bezierCurveTo(-10, -20, -90, 90, 30, 200); g.stroke();
  g.strokeStyle = "#1a1a1a";
  g.lineWidth = 8;
  g.beginPath(); g.moveTo(-112, -220); g.bezierCurveTo(-2, -20, -82, 90, 38, 200); g.stroke();
  g.restore();
  g.globalAlpha = cable;
  g.fillStyle = "rgba(255, 220, 80, 0.18)";
  g.beginPath(); g.arc(-20, 0, 70, 0, TAU); g.fill();
  g.globalAlpha = 1;
  if (mano > 0.05 && cable < 0.45) guante(g, k.mez(640, 390, mano), 90, 0.5, 1.2, mano * (1 - cable));
  g.save();
  g.globalAlpha = sierra;
  g.translate(20, 460);
  g.rotate(-0.4);
  g.fillStyle = "#f27a1a";
  k.redondo(g, -160, -28, 200, 56, 10);
  g.fill();
  const hoja = g.createLinearGradient(0, -16, 0, 16);
  hoja.addColorStop(0, "#d5dde6");
  hoja.addColorStop(0.5, "#f7fbff");
  hoja.addColorStop(1, "#8d99a6");
  g.fillStyle = hoja;
  g.beginPath();
  g.moveTo(20, -8); g.lineTo(210, -8); g.lineTo(250, 0); g.lineTo(210, 10); g.lineTo(20, 10); g.closePath();
  g.fill();
  g.restore();
  if (sierra > 0.2 && pro < 0.4) {
    guante(g, k.mez(180, 40, 1 - sierra), 400, -0.6, 0.9, sierra * (1 - pro));
  }
  if (pro > 0.02) {
    g.save();
    g.globalAlpha = pro;
    g.translate(-340, 60);
    g.fillStyle = "#16324a";
    k.redondo(g, -130, -20, 250, 520, 48);
    g.fill();
    g.fillStyle = "#f2c2a0";
    g.beginPath(); g.arc(0, -130, 78, 0, TAU); g.fill();
    g.fillStyle = "#1c2430";
    g.fillRect(-86, -176, 172, 34);
    g.fillStyle = "#222831";
    k.redondo(g, 90, -10, 86, 44, 12);
    g.fill();
    g.fillStyle = "#ffe9a8";
    g.beginPath(); g.arc(168, 8, 16, 0, TAU); g.fill();
    g.restore();
    g.save();
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = 0.4 * pro;
    g.fillStyle = "#fff1c2";
    g.beginPath();
    g.moveTo(-180, 50);
    g.lineTo(120, -120);
    g.lineTo(90, 180);
    g.closePath();
    g.fill();
    g.restore();
  }
  g.restore();
}

export function escenaCierre(g, t) {
  const llega = k.suave(k.tramo(t, f10.inicio, f10.t("through") + 0.02));
  const posa = k.suave(k.tramo(t, f10.t("wall"), v.duracion - 0.02));
  const cam = {
    x: k.mez(-40, POSE.x, posa),
    y: k.mez(30, POSE.y, posa),
    s: k.mez(1.15, POSE.s, posa),
  };
  const dx = k.mez(-220, 80, llega);
  const abierto = k.suave(k.tramo(t, f10.t("doorknob") - 0.08, f10.t("through") + 0.02));
  g.save();
  camara(g, cam);
  paredFondo(g);
  puerta(g, dx, 1);
  agujero(g, 150, 168, k.mez(0.2, 1, abierto));
  trozos(g, k.mez(0.62, 1, k.suave(k.tramo(t, f10.t("through") - 0.08, v.duracion))));
  g.restore();
}
