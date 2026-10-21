// El salón, la tele y el móvil de este vídeo. Si algo sale en más de un plano, está aquí.
import * as k from "#kit";
import { v } from "#voz";

const { suave: su, tramo: tr, mez, entra, sale, pulso, azar } = k;

export const P = (n, w) => v.frase(n).t(w);
export const T = {
  shut: P(1, "shut"), ads: P(1, "ads"), up: P(1, "up"),
  zen: P(2, "zenith"), die: P(2, "die"),
  button: P(3, "button"), mute: P(3, "mute"), couch: P(3, "couch"),
  cable: P(4, "cable"), tripped: P(4, "tripped"),
  channel: P(5, "channel"), talking: P(5, "talking"),
  flash: P(6, "flashlight"), corner: P(6, "corner"), dies: P(6, "dies"),
  sun: P(7, "sunshine"), spun: P(7, "spun"), own: P(7, "own"),
  kill: P(8, "kill"), ads2: P(8, "ads"), leave: P(8, "leave"), them: P(8, "them"),
  before: P(9, "before"), stuck: P(9, "stuck"), getting: P(9, "getting"), much: P(9, "much"),
  click: P(10, "click"), gone: P(10, "gone"), grab: P(10, "grab"),
  phone: P(11, "phone"), app: P(11, "app"), bio: P(11, "bio"),
  friend: P(12, "friend"), yells: P(12, "yells"),
};

const azCh = azar(41);
export const CHISPAS = Array.from({ length: 36 }, () => ({
  a: azCh() * 6.2832, r: 0.15 + azCh() * 0.9, s: 0.35 + azCh() * 0.8, v: 0.4 + azCh() * 0.8,
}));

export function velo(g, al = 1) {
  if (al <= 0.01) return;
  const vg = g.createLinearGradient(0, 180, 0, 560);
  vg.addColorStop(0, `rgba(8,6,16,${0.62 * al})`);
  vg.addColorStop(0.55, `rgba(8,6,16,${0.28 * al})`);
  vg.addColorStop(1, "rgba(8,6,16,0)");
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 580);
}

export function boca(g, x, y, w, h, open) {
  const o = Math.max(0, Math.min(1, open));
  const ow = w * 0.42, oh = Math.max(w * 0.035, h * (0.06 + 0.4 * o));
  g.save();
  g.translate(x, y);
  const labio = g.createRadialGradient(0, -oh * 0.2, ow * 0.1, 0, 0, ow);
  labio.addColorStop(0, "#ff4d78");
  labio.addColorStop(0.55, "#d4144a");
  labio.addColorStop(1, "#7a0c2c");
  g.fillStyle = labio;
  g.beginPath();
  g.ellipse(0, 0, ow, oh + w * 0.045, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#1a060c";
  g.beginPath();
  g.ellipse(0, oh * 0.02, ow * 0.78, Math.max(3, oh * 0.78), 0, 0, Math.PI * 2);
  g.fill();
  if (o > 0.18) {
    const tg = g.createLinearGradient(0, 0, 0, oh);
    tg.addColorStop(0, "#ff7a92");
    tg.addColorStop(1, "#c4143c");
    g.fillStyle = tg;
    g.beginPath();
    g.ellipse(0, oh * 0.28, ow * 0.42, oh * 0.32, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#fff4e4";
    const n = 7, tw = ow * 1.15 / n;
    for (let i = 0; i < n; i++) {
      const tx = -ow * 0.52 + i * tw;
      k.redondo(g, tx, -oh * 0.55, tw * 0.62, oh * 0.28, 6);
      g.fill();
    }
  }
  g.restore();
}

export function anillos(g, x, y, t, al, abierto) {
  if (al < 0.02 || abierto < 0.04) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < 6; i++) {
    const u = ((t * 0.72 + i / 6) % 1);
    const r = 70 + u * Math.min(780, y * 0.9);
    const a = (1 - u) * al * abierto * 0.85;
    g.strokeStyle = `rgba(255,206,90,${a})`;
    g.lineWidth = 22 * (1 - u) + 6;
    g.beginPath();
    g.ellipse(x, y, r * 0.92, r * 0.62, 0, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
}

// Un mando de plástico, grande, con un botón rojo. ang en radianes. press 0..1 hunde el botón.
export function mando(g, x, y, alto, ang, press, al = 1) {
  if (al <= 0.01) return;
  const w = alto * 0.42, h = alto;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha *= al;
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.28);
  const cuerpo = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  cuerpo.addColorStop(0, "#2a3140");
  cuerpo.addColorStop(0.35, "#4c5668");
  cuerpo.addColorStop(0.7, "#1c222c");
  cuerpo.addColorStop(1, "#3a4354");
  g.fillStyle = cuerpo;
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.45;
  g.drawImage(k.red, -w / 2, -h / 2, w, h);
  g.globalAlpha /= 0.45;
  g.globalCompositeOperation = "source-over";
  // botones pequeños
  g.fillStyle = "#d5dbe6";
  for (let i = 0; i < 4; i++) {
    k.redondo(g, -w * 0.28, -h * 0.38 + i * h * 0.11, w * 0.22, h * 0.07, 8);
    g.fill();
  }
  const by = h * 0.08 + press * h * 0.03;
  const rad = w * 0.28;
  const bg = g.createRadialGradient(-rad * 0.3, by - rad * 0.3, rad * 0.1, 0, by, rad);
  bg.addColorStop(0, "#ffb3c4");
  bg.addColorStop(0.45, "#ff2d55");
  bg.addColorStop(1, "#8e1028");
  g.fillStyle = bg;
  g.beginPath();
  g.arc(0, by, rad, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.beginPath();
  g.ellipse(-rad * 0.25, by - rad * 0.28, rad * 0.28, rad * 0.16, -0.5, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function telefono(g, x, y, w, h, brillo = 0) {
  g.save();
  g.translate(x, y);
  k.redondo(g, -w / 2, -h / 2, w, h, w * 0.16);
  const cg = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  cg.addColorStop(0, "#1a1e28");
  cg.addColorStop(0.4, "#3a4252");
  cg.addColorStop(1, "#12151c");
  g.fillStyle = cg;
  g.fill();
  k.redondo(g, -w * 0.42, -h * 0.44, w * 0.84, h * 0.88, w * 0.1);
  const sg = g.createLinearGradient(0, -h / 2, 0, h / 2);
  sg.addColorStop(0, "#1c3148");
  sg.addColorStop(0.5, "#14283a");
  sg.addColorStop(1, "#0e1c2c");
  g.fillStyle = sg;
  g.fill();
  // cristal
  g.save();
  k.redondo(g, -w * 0.42, -h * 0.44, w * 0.84, h * 0.88, w * 0.1);
  g.clip();
  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.35;
  g.drawImage(k.red2, -w / 2, -h / 2, w, h);
  g.restore();
  // tres botones grandes: volumen, canal, silencio
  const bots = [
    { y: -h * 0.22, c0: "#ffe08a", c1: "#e39b12" },
    { y: 0, c0: "#9af0ff", c1: "#1aa8c4" },
    { y: h * 0.22, c0: "#ffb0c4", c1: "#e11d48" },
  ];
  for (const b of bots) {
    const r = w * 0.16;
    const grd = g.createRadialGradient(-r * 0.35, b.y - r * 0.35, r * 0.1, 0, b.y, r);
    grd.addColorStop(0, b.c0);
    grd.addColorStop(1, b.c1);
    g.fillStyle = grd;
    g.beginPath();
    g.arc(0, b.y, r, 0, Math.PI * 2);
    g.fill();
  }
  if (brillo > 0) k.brillo(g, 0, 0, w * 1.3, "cian", 0.35 * brillo);
  g.restore();
}

export function dedo(g, x, y, largo, ang, al = 1) {
  if (al < 0.02) return;
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  g.globalAlpha *= al;
  const w = largo * 0.38;
  k.redondo(g, -w / 2, -largo, w, largo, w * 0.45);
  const fg = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  fg.addColorStop(0, "#f0b090");
  fg.addColorStop(0.45, "#ffd2b8");
  fg.addColorStop(1, "#d4896a");
  g.fillStyle = fg;
  g.fill();
  g.restore();
}

export function persona(g, x, y, alto, opts = {}) {
  const { hunde = 0, bocaAbierta = 0, al = 1, jersey = ["#ffc857", "#e09720", "#a86a10"], pelo = "#2a211c" } = opts;
  if (al < 0.02) return;
  g.save();
  g.translate(x, y + hunde);
  g.globalAlpha *= al;
  const c = alto;
  // piernas
  g.fillStyle = "#2c3a55";
  k.redondo(g, -c * 0.28, c * 0.22, c * 0.2, c * 0.38, 16);
  g.fill();
  k.redondo(g, c * 0.08, c * 0.22, c * 0.2, c * 0.38, 16);
  g.fill();
  // cuerpo
  k.redondo(g, -c * 0.42, -c * 0.28, c * 0.84, c * 0.62, c * 0.22);
  const jg = g.createLinearGradient(-c * 0.4, 0, c * 0.4, 0);
  jg.addColorStop(0, jersey[2]);
  jg.addColorStop(0.4, jersey[0]);
  jg.addColorStop(1, jersey[1]);
  g.fillStyle = jg;
  g.fill();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha *= 0.35;
  g.drawImage(k.manchas, -c * 0.42, -c * 0.28, c * 0.84, c * 0.62);
  g.globalAlpha /= 0.35;
  g.globalCompositeOperation = "source-over";
  // cabeza
  g.fillStyle = pelo;
  g.beginPath();
  g.arc(0, -c * 0.48, c * 0.3, Math.PI, 0);
  g.fill();
  const cara = g.createRadialGradient(-c * 0.08, -c * 0.52, c * 0.05, 0, -c * 0.42, c * 0.28);
  cara.addColorStop(0, "#ffe0cc");
  cara.addColorStop(1, "#e2a888");
  g.fillStyle = cara;
  g.beginPath();
  g.arc(0, -c * 0.42, c * 0.26, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#241c18";
  g.beginPath();
  g.arc(-c * 0.09, -c * 0.46, c * 0.035, 0, Math.PI * 2);
  g.arc(c * 0.09, -c * 0.46, c * 0.035, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#6a3040";
  g.lineWidth = Math.max(3, c * 0.03);
  g.beginPath();
  if (bocaAbierta > 0.2) {
    g.fillStyle = "#6a1830";
    g.ellipse(0, -c * 0.3, c * 0.07, c * 0.045 * (0.6 + bocaAbierta), 0, 0, Math.PI * 2);
    g.fill();
  } else {
    g.moveTo(-c * 0.07, -c * 0.3);
    g.quadraticCurveTo(0, -c * 0.26, c * 0.07, -c * 0.3);
    g.stroke();
  }
  g.restore();
}

export function zapato(g, x, y, s, ang) {
  g.save();
  g.translate(x, y);
  g.rotate(ang);
  k.redondo(g, -s * 0.2, -s * 0.28, s * 1.15, s * 0.48, s * 0.2);
  const zg = g.createLinearGradient(0, -s * 0.3, 0, s * 0.2);
  zg.addColorStop(0, "#a56a3c");
  zg.addColorStop(0.5, "#6b3e22");
  zg.addColorStop(1, "#3d2416");
  g.fillStyle = zg;
  g.fill();
  g.fillStyle = "#22160f";
  k.redondo(g, -s * 0.15, s * 0.08, s * 1.2, s * 0.16, 8);
  g.fill();
  g.restore();
}

export { entra, sale, su, tr, mez, pulso };
