// Gancho: dos pianos enormes, el 8, la revista, y la página que se abre.
import * as k from "#kit";
import { v } from "#voz";
import { salaConcierto, piano, notasVolando, ochoGrande, revista, velo } from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1);
const f2 = v.frase(2);
const f3 = v.frase(3);
const Tocho = f1.t("ocho");
const Trev = f2.t("revista");
const Tdel = f3.t("delante");
const fin = f3.fin;

function pentagrama(g, y0, al) {
  if (al <= 0.02) return;
  g.save();
  g.globalAlpha *= al;
  g.fillStyle = "#f4ead6";
  g.fillRect(0, y0, 1080, 1920 - y0);
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.2;
  g.drawImage(k.red, 0, y0, 1080, 900);
  g.restore();
  g.strokeStyle = "rgba(40,28,18,0.45)";
  g.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const y = y0 + 180 + i * 48;
    g.beginPath();
    g.moveTo(140, y);
    g.lineTo(940, y);
    g.stroke();
  }
  g.fillStyle = "#1a1020";
  for (const [nx, ny] of [[280, 292], [420, 268], [560, 316], [700, 244], [820, 300]]) {
    g.beginPath();
    g.ellipse(nx, y0 + ny, 26, 16, -0.5, 0, Math.PI * 2);
    g.fill();
    g.fillRect(nx + 22, y0 + ny - 70, 5, 72);
  }
  g.restore();
}

export function dibuja(g, t) {
  const entra = k.suave(k.tramo(t, 0, 1.05));
  const camX = k.mez(90, 0, entra);
  const zoom = k.mez(1.7, 1.02, entra);
  const zambulle = k.suave(k.tramo(t, Tdel - 0.02, Tdel + 1.05));
  const quieto = k.suave(k.tramo(t, fin - 0.5, fin - 0.22));
  const z = k.mez(zambulle, 1, quieto);
  salaConcierto(g, 1);
  const alPiano = 1 - z;
  g.save();
  g.globalAlpha = alPiano;
  g.translate(540 + camX * (1 - z), 1080);
  g.scale(zoom, zoom);
  g.translate(-540, -1080);
  piano(g, 300, 1120, 1.2, { brillo: 1, espejo: 1, tecla: t < Trev ? t * 9 : 0 });
  piano(g, 800, 1080, 1.28, { brillo: 1, espejo: -1, tecla: t < Trev ? t * 9 + 3 : 0 });
  g.restore();
  notasVolando(g, t, 540, 1120, alPiano * (t < Trev + 0.35 ? 1 : 1 - k.suave(k.tramo(t, Trev, Trev + 0.4))), t < Tocho ? 1.5 : 0.3);

  const sube = k.entra(k.tramo(t, Tocho - 0.05, Tocho + 0.5));
  const ochoAl = sube * (1 - k.suave(k.tramo(t, Tdel + 0.15, Tdel + 0.7)));
  ochoGrande(g, 540, k.mez(1320, 980, sube), ochoAl, 360);

  const cae = k.entra(k.tramo(t, Trev - 0.1, Trev + 0.5));
  const abre = k.suave(k.tramo(t, Trev + 0.3, f2.fin + 0.15));
  if (cae > 0.01 && z < 0.92) {
    const y = k.mez(360, 1040, cae);
    const s = k.mez(0.55, 1.35, cae) * k.mez(1, 1.8, z);
    revista(g, 540, k.mez(y, 1180, z), s, k.mez(abre, 1, z));
  }
  pentagrama(g, k.mez(980, 620, z), k.suave(k.tramo(z, 0.35, 0.85)));
  velo(g, 0.82);
}
