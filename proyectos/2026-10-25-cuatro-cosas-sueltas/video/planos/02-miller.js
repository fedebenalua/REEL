// «Miller contó números y palabras, y le salía alrededor de siete. Luego avisó: ese siete podía ser solo una coincidencia.»
// Llueven cifras y palabras. El siete se arma y, al avisar, se parte y se queda parado.
import * as k from "#kit";
import { v } from "#voz";
import { cartel, fondo, numero, velo } from "../mundo.js";

export const desde = "miller";

const f3 = v.frase(3), f4 = v.frase(4);
const Tnum = f3.t("numeros"), Tpal = f3.t("palabras"), Tsie = f3.t("siete"), Tcoin = f4.t("coincidencia");

const PIEZAS = [
  { t: "3", x: 220, y: 780, rgb: "255,196,80" },
  { t: "8", x: 860, y: 820, rgb: "120,210,255" },
  { t: "1", x: 250, y: 1120, rgb: "255,120,160" },
  { t: "5", x: 840, y: 1160, rgb: "160,255,170" },
  { t: "9", x: 200, y: 1400, rgb: "255,220,120" },
  { t: "SOL", x: 300, y: 640, rgb: "255,230,140", palabra: true },
  { t: "MAR", x: 800, y: 680, rgb: "140,210,255", palabra: true },
  { t: "PAN", x: 250, y: 980, rgb: "255,170,110", palabra: true },
  { t: "LUZ", x: 830, y: 980, rgb: "255,240,180", palabra: true },
  { t: "OJO", x: 780, y: 1380, rgb: "200,170,255", palabra: true },
];

export function dibuja(g, t) {
  fondo(g, t, "mesa");
  const suelo = g.createLinearGradient(0, 1200, 0, 1920);
  suelo.addColorStop(0, "rgba(0,0,0,0)");
  suelo.addColorStop(1, "rgba(40,16,20,0.55)");
  g.fillStyle = suelo;
  g.fillRect(0, 1200, 1080, 720);

  PIEZAS.forEach((p, i) => {
    const llega = Tnum - 0.15 + i * 0.12;
    const u = k.entra(k.tramo(t, llega - 0.45, llega));
    const empuja = k.suave(k.tramo(t, Tsie, Tcoin));
    const y = k.mez(-180, p.y, u) + Math.sin(t * 1.6 + i) * 10 * empuja;
    const x = p.x + Math.sin(i) * 40 * (1 - u) + Math.sign(p.x - 540) * 80 * empuja;
    if (u <= 0) return;
    const tam = p.palabra ? 64 : 92;
    if (p.palabra) cartel(g, x, y, p.t, p.rgb, tam);
    else numero(g, x, y, p.t, p.rgb, tam, u);
  });

  const nace = k.suave(k.tramo(t, Tpal, Tsie + 0.15));
  const grieta = k.suave(k.tramo(t, f4.inicio, Tcoin + 0.25));
  const quieto = grieta;
  if (nace > 0.02) {
    const tam = 620 * (0.55 + 0.45 * nace) * (1 + 0.04 * Math.sin(t * 2.4) * (1 - quieto));
    g.save();
    g.translate(540, 1080);
    g.rotate(Math.sin(quieto * Math.PI) * 0.06);
    numero(g, 0, 0, "7", "255,214,90", tam, nace);
    if (quieto > 0.04) {
      g.strokeStyle = `rgba(40,12,8,${0.85 * quieto})`;
      g.lineWidth = 14;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(-220, -120);
      g.lineTo(-30, 10);
      g.lineTo(190, -70);
      g.moveTo(-120, 80);
      g.lineTo(50, 160);
      g.lineTo(230, 40);
      g.stroke();
      g.strokeStyle = `rgba(255,244,210,${0.7 * quieto})`;
      g.lineWidth = 4;
      g.stroke();
    }
    g.restore();
    const astillas = [[-260, -180, 70], [240, -40, 54], [-40, 250, 64]];
    astillas.forEach((a, i) => {
      const u = k.suave(k.tramo(t, f4.inicio + i * 0.12, f4.inicio + 0.7 + i * 0.12));
      if (u <= 0.02) return;
      g.save();
      g.translate(540 + a[0] * u, 1080 + a[1] * u);
      g.rotate(u * (i - 1));
      g.fillStyle = `rgba(255,214,120,${0.9 * (1 - u * 0.2)})`;
      g.beginPath();
      g.moveTo(0, -a[2]);
      g.lineTo(a[2] * 0.7, a[2] * 0.4);
      g.lineTo(-a[2] * 0.5, a[2] * 0.55);
      g.closePath();
      g.fill();
      g.restore();
    });
  }
  const latido = 0.85 + 0.15 * Math.sin(t * 3);
  if (nace > 0.8 && grieta < 0.2) k.brillo(g, 540, 980, 420 * latido, "amarilla", 0.35);
  velo(g);
}
