// La nariz mojada: el lametón, el cristal, la punta fría y la placa que quema sin tocar.
import * as k from "#kit";
import { v } from "#voz";
import * as m from "../mundo.js";

export const desde = 0;

const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5);
const f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10);
const f11 = v.frase(11), f12 = v.frase(12), f13 = v.frase(13);

const MOTAS = Array.from({ length: 14 }, (_, i) => {
  const az = k.azar(30 + i * 11);
  return { ang: az() * Math.PI * 2, rad: 18 + az() * 34, col: ["64,214,168", "255,198,90", "110,196,255"][i % 3], tam: 2.8 + az() * 1.8 };
});

function campana(t, a, b, c) {
  return k.suave(k.tramo(t, a, b)) * (1 - k.suave(k.tramo(t, b, c)));
}
function lamidoEn(t, t0, dur = 0.78) {
  const u = (t - t0) / dur;
  return u > 0 && u < 1 ? u : 0;
}

function estado(t) {
  const lamido = Math.max(
    lamidoEn(t, -0.22),
    lamidoEn(t, f6.t("lame") - 0.05),
    lamidoEn(t, f12.t("lame") - 0.08),
    lamidoEn(t, 50.55),
  );
  const jadeo = k.suave(k.tramo(t, f2.t("es"), f2.t("calor") - 0.15))
    * (1 - k.suave(k.tramo(t, f3.t("punta"), f3.t("fria") - 0.05)));
  const abre = jadeo * (0.72 + 0.18 * Math.sin(t * 9));
  const paso = k.suave(k.tramo(t, f8.t("placa") - 0.05, f8.t("caliente")))
    * (1 - k.suave(k.tramo(t, f8.t("sesenta") + 0.15, f9.inicio + 0.15)));
  const planta = k.suave(k.tramo(t, f13.t("planta") - 0.25, f13.t("nariz")))
    * (1 - k.suave(k.tramo(t, f13.t("seca"), f13.t("manga") + 0.15)));
  const x = m.DOG + 16 * paso + 12 * planta;
  const nb = 0.22 * k.suave(k.tramo(t, f4.t("atrapa") - 0.1, f4.t("olor"))) * (1 - k.suave(k.tramo(t, f5.inicio, f5.t("vaho"))));
  const ang = -0.04 * abre - 0.08 * planta;
  const n = m.hocico(x, nb, ang);
  return { lamido, abre, paso, planta, x, nb, ang, n };
}

function camara(t, e) {
  const Z = k.claves([
    [0, 17.5], [1.12, 5.15], [f2.t("calor"), 4.7],
    [f3.t("caliente"), 8.2], [f3.t("punta"), 10.4], [f3.t("fria"), 12.2], [f3.fin, 12.2],
    [f4.t("olor"), 8.6], [f4.fin, 8.4],
    [f5.t("vaho"), 6.2], [f5.t("cristal"), 9.6], [f5.fin - 0.15, 9.6],
    [f6.t("lame"), 8.2], [f6.t("boca"), 9.4], [f6.fin, 8.6],
    [f7.t("despierto"), 5.3], [f7.t("treinta"), 5.2], [f7.t("treinta") + 0.7, 5.2],
    [f7.t("cinco"), 11.2], [f7.fin - 0.15, 11.2],
    [f8.t("estudio") + 0.35, 3.35], [f8.t("caliente") - 0.05, 3.55],
    [f8.t("sesenta"), 9.2], [f8.fin, 8.6],
    [f9.t("doce"), 8.2], [f9.t("sala") + 0.35, 8.2],
    [f9.t("mano"), 7.4], [f9.t("tocarla") + 0.35, 7.2],
    [f10.t("encendio"), 15.5], [f10.t("cerebro") + 0.35, 15.2],
    [f11.t("punta"), 14.5], [f11.t("pelo") + 0.25, 14.2],
    [f12.inicio, 6.1], [f12.t("mojada"), 8.8], [f12.t("fria"), 8.2], [f12.fin, 6.4],
    [f13.t("planta"), 6.8], [f13.t("nariz") + 0.2, 7.2],
    [f13.t("seca"), 7.4], [f13.t("manga") + 0.15, 7.2],
    [50.15, 15], [50.9, 17.5],
  ])(t);
  const cx0 = k.claves([
    [0, 0], [1.15, -52], [f2.t("calor"), -48],
    [f3.t("caliente"), -6], [f3.t("fria"), 2], [f4.t("olor"), 2],
    [f5.t("vaho"), -70], [f5.t("cristal"), -175], [f5.fin - 0.12, -175],
    [f6.t("lame"), 0], [f6.t("boca"), -2],
    [f7.t("despierto"), -46], [f7.t("treinta") + 0.5, -36],
    [f7.t("cinco"), 2], [f7.fin - 0.12, 2],
    [f8.t("estudio") + 0.5, 18], [f8.t("caliente"), 28],
    [f8.t("sesenta"), 102], [f9.t("sala") + 0.2, 96],
    [f9.t("mano"), 28], [f9.t("tocarla") + 0.2, 24],
    [f10.t("encendio"), -24], [f10.t("cerebro") + 0.2, -26],
    [f11.t("punta"), 4], [f11.fin, 2],
    [f12.inicio, -16], [f12.t("mojada"), 2], [f12.fin, -6],
    [f13.t("planta"), 6], [f13.t("nariz"), 8], [f13.t("manga"), 4],
    [50.9, 0],
  ])(t);
  const cy = k.claves([
    [0, -71], [1.15, -50], [f2.t("calor"), -48],
    [f3.t("caliente"), -66], [f3.t("fria"), -71], [f4.fin, -70],
    [f5.t("cristal"), -178], [f5.fin - 0.12, -178],
    [f6.t("lame"), -70], [f6.t("boca"), -60],
    [f7.t("despierto"), -50], [f7.t("treinta") + 0.4, -52],
    [f7.t("cinco"), -71], [f7.fin - 0.12, -71],
    [f8.t("estudio") + 0.5, -72], [f8.t("sesenta"), -96], [f9.t("sala") + 0.15, -96],
    [f9.t("mano"), -62], [f9.t("tocarla"), -64],
    [f10.t("encendio"), -78], [f10.fin, -76],
    [f11.t("punta"), -71], [f12.inicio, -54], [f12.t("mojada"), -70],
    [f13.t("nariz"), -66], [f13.t("manga"), -68], [50.9, -71],
  ])(t);
  const enVidrio = k.suave(k.tramo(t, f5.t("vaho") - 0.05, f5.t("cristal"))) * (1 - k.suave(k.tramo(t, f5.fin - 0.2, f6.t("lame"))));
  const enPlaca = k.suave(k.tramo(t, f8.t("sesenta") - 0.55, f8.t("sesenta"))) * (1 - k.suave(k.tramo(t, f9.t("mano") - 0.4, f9.t("mano"))));
  const sigue = (1 - enVidrio) * (1 - enPlaca);
  return { Z, cx: cx0 + (e.x - m.DOG) * sigue, cy };
}

function placa(g, x, calor, sube, t) {
  if (sube < 0.02) return;
  g.save();
  g.translate(x, (1 - sube) * 40);
  g.globalAlpha = sube;
  g.fillStyle = "rgba(0,0,0,0.25)"; g.beginPath(); g.ellipse(6, 3, 36, 8, 0, 0, Math.PI * 2); g.fill();
  const pg = g.createLinearGradient(-30, -180, 30, -16);
  pg.addColorStop(0, calor > 0.35 ? "#5a3024" : "#32323a");
  pg.addColorStop(0.4, calor > 0.35 ? "#221612" : "#141418");
  pg.addColorStop(1, "#07070a");
  g.fillStyle = pg; k.redondo(g, -32, -188, 64, 176, 7); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.2)"; g.lineWidth = 2.4; k.redondo(g, -32, -188, 64, 176, 7); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.08)"; g.fillRect(-22, -170, 10, 150);
  if (calor > 0.03) {
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < 7; i++) {
      const y = -30 - ((t * 40 + i * 24) % 140);
      const wob = Math.sin(t * 5 + i * 1.4) * 6 * calor;
      g.strokeStyle = `rgba(255,150,50,${0.34 * calor})`; g.lineWidth = 3;
      g.beginPath(); g.moveTo(-20, y); g.quadraticCurveTo(wob, y - 14, 20, y - 4); g.stroke();
    }
    k.brillo(g, 0, -100, 90, "255,140,40", 0.7 * calor);
  }
  g.restore();
}
// Una mano de persona, de perfil, con los dedos hacia la izquierda. x,y es la palma.
function mano(g, x, y, escala, calor) {
  g.save();
  g.translate(x, y); g.scale(escala, escala);
  const claro = "#ffd0b4", medio = "#e7a07e", sombra = "#c07a58";
  const fg = g.createLinearGradient(0, -16, 0, 18);
  fg.addColorStop(0, claro); fg.addColorStop(0.55, medio); fg.addColorStop(1, sombra);
  g.fillStyle = fg;
  k.redondo(g, 16, -11, 48, 22, 10); g.fill();
  g.beginPath();
  g.moveTo(22, -16); g.quadraticCurveTo(-2, -20, -14, -6); g.quadraticCurveTo(-18, 10, -2, 16); g.lineTo(24, 12); g.closePath();
  g.fill();
  for (let i = 0; i < 4; i++) {
    g.save();
    g.translate(-12, -13 + i * 7.2);
    g.rotate(-0.22 + i * 0.1);
    g.fillStyle = i === 3 ? sombra : medio;
    k.redondo(g, -34, -3.2, 36, 6.6, 3.3); g.fill();
    g.fillStyle = "rgba(255,244,236,0.95)";
    g.beginPath(); g.ellipse(-32, 0, 2.1, 2.3, 0, 0, Math.PI * 2); g.fill();
    g.restore();
  }
  g.save(); g.translate(2, -16); g.rotate(-1.05);
  g.fillStyle = medio; k.redondo(g, -5, -20, 11, 24, 5.5); g.fill();
  g.fillStyle = "rgba(255,244,236,0.95)"; g.beginPath(); g.ellipse(0, -18, 2.2, 2.6, 0, 0, Math.PI * 2); g.fill();
  g.restore();
  g.strokeStyle = "rgba(255,255,255,0.4)"; g.lineWidth = 1.8;
  g.beginPath(); g.moveTo(14, -6); g.quadraticCurveTo(4, -2, -6, 4); g.stroke();
  if (calor > 0.02) k.brillo(g, -8, 0, 46, "255,140,40", 0.55 * calor);
  g.restore();
}

function manga(g, n, u) {
  g.save();
  g.translate(n[0] + 62 - 78 * u, n[1] + 4);
  g.rotate(-0.08);
  const cg = g.createLinearGradient(0, -18, 0, 18);
  cg.addColorStop(0, "#ffc2b0"); cg.addColorStop(0.42, "#e23b2f"); cg.addColorStop(1, "#861910");
  g.fillStyle = cg; k.redondo(g, -4, -16, 96, 32, 14); g.fill();
  g.strokeStyle = "rgba(80,10,8,0.35)"; g.lineWidth = 2.2;
  g.beginPath(); g.moveTo(28, -15); g.quadraticCurveTo(34, 0, 26, 15); g.stroke();
  g.fillStyle = "#ffe8de"; k.redondo(g, -10, -14, 20, 28, 7); g.fill();
  g.fillStyle = "#e7a07e"; k.redondo(g, -26, -11, 20, 22, 8); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(40, -6, 16, 4, 0, 0, Math.PI * 2); g.fill();
  g.restore();
}

function motas(g, n, t, llegan, aLaBoca) {
  const u = Math.max(llegan, 0);
  if (u < 0.02 && aLaBoca < 0.02) return;
  for (const q of MOTAS) {
    const cerca = k.suave(u);
    const seVa = k.suave(aLaBoca);
    const pegado = 4.5 + 2.2 * Math.sin(q.ang * 2);
    const rad = q.rad * (1 - cerca) + pegado * cerca * (1 - seVa);
    const x = n[0] + Math.cos(q.ang) * rad + 6 * seVa;
    const y = n[1] + Math.sin(q.ang) * rad * 0.55 + 14 * seVa;
    const queda = seVa < 0.72 ? 1 : Math.max(0, 1 - (seVa - 0.72) / 0.28);
    g.fillStyle = `rgba(${q.col},${0.95 * queda})`;
    g.beginPath(); g.arc(x, y, q.tam * (1 + 0.35 * cerca) * (1 - 0.25 * seVa), 0, Math.PI * 2); g.fill();
  }
}

export function dibuja(g, t) {
  const e = estado(t);
  const cam = camara(t, e);
  const c = { Z: cam.Z, cx: cam.cx, cy: cam.cy };

  const calorSala = k.suave(k.tramo(t, f7.t("fria") + 0.15, f7.t("treinta")))
    * (1 - k.suave(k.tramo(t, f7.fin - 0.05, f8.t("estudio") + 0.2)));
  const vaho = k.suave(k.tramo(t, f5.t("vaho"), f5.t("cristal") + 0.35))
    * (1 - k.suave(k.tramo(t, f5.fin - 0.2, f6.t("lame"))));
  const frio = Math.max(
    campana(t, f3.t("punta"), f3.t("fria"), f4.inicio + 0.2),
    k.suave(k.tramo(t, f7.t("mas"), f7.t("cinco"))) * (1 - k.suave(k.tramo(t, f8.inicio, f8.t("estudio") + 0.3))),
    campana(t, f12.t("y") - 0.05, f12.t("fria"), f12.t("calor")),
  );
  const placas = k.suave(k.tramo(t, f8.t("estudio"), f8.t("tres")))
    * (1 - k.suave(k.tramo(t, f9.fin - 0.1, f10.t("trece"))));
  const calorPlaca = k.suave(k.tramo(t, f8.t("caliente") - 0.15, f8.t("caliente") + 0.25))
    * (1 - k.suave(k.tramo(t, f9.fin - 0.15, f10.inicio + 0.2)));
  const llegan = k.suave(k.tramo(t, f4.t("atrapa") - 0.05, f4.t("olor") + 0.15))
    * (1 - k.suave(k.tramo(t, f6.t("pasa") - 0.1, f6.t("boca") + 0.15)));
  const aLaBoca = k.suave(k.tramo(t, f6.t("pasa") - 0.05, f6.t("boca") + 0.2))
    * (1 - k.suave(k.tramo(t, f6.fin - 0.05, f7.inicio + 0.15)));
  const llegan2 = campana(t, f12.t("mojada"), f12.t("olor"), f12.t("fria"));
  const manoU = k.suave(k.tramo(t, f9.t("calor") + 0.05, f9.t("mano")))
    * (1 - k.suave(k.tramo(t, f9.fin - 0.15, f10.t("otros") + 0.15)));
  const calorMano = manoU * (0.65 + 0.35 * k.suave(k.tramo(t, f9.t("mano"), f9.t("tocarla"))));
  const cerebro = campana(t, f10.t("encendio") - 0.1, f10.t("izquierdo"), f10.fin + 0.15);
  const plantaMano = k.suave(k.tramo(t, f13.t("amigo"), f13.t("nariz")))
    * (1 - k.suave(k.tramo(t, f13.t("seca") - 0.05, f13.t("manga"))));
  const seca = k.suave(k.tramo(t, f13.t("seca") - 0.12, f13.t("manga") + 0.05))
    * (1 - k.suave(k.tramo(t, f13.fin - 0.05, 50.25)));
  const calorFinal = campana(t, f12.t("fria") + 0.1, f12.t("calor"), f12.fin + 0.2);

  m.salon(g, c, t, calorSala, vaho);
  placa(g, m.PLACA + 62, 0, placas, t);
  placa(g, m.PLACA, calorPlaca, placas, t);

  if (manoU > 0.03) {
    g.save(); g.globalAlpha = manoU;
    mano(g, e.n[0] + 58, e.n[1] + 6, 1.05, calorMano);
    g.restore();
    if (calorMano > 0.2) {
      g.save(); g.globalCompositeOperation = "lighter";
      for (let i = 0; i < 4; i++) {
        const u = (i + (t * 1.4) % 1) / 4;
        const x = k.mez(e.n[0] + 28, e.n[0] + 6, u);
        const y = e.n[1] + 8 - u * 6;
        g.fillStyle = `rgba(255,150,40,${0.35 * calorMano * Math.sin(u * Math.PI)})`;
        g.beginPath(); g.arc(x, y, 3.5, 0, Math.PI * 2); g.fill();
      }
      g.restore();
    }
  }

  m.perro(g, {
    x: e.x, dir: 1, marcha: 0, fase: 0.2, t,
    cola: 0.55, pitch: 0.12 * e.planta,
    lamido: e.lamido,
    cabeza: { ang: e.ang, abre: e.abre, oreja: 0.06 * Math.sin(t * 1.7), olfato: llegan * 0.8 },
  });

  if (plantaMano > 0.03) {
    g.save(); g.globalAlpha = plantaMano;
    mano(g, e.n[0] + 46 - 18 * e.planta, e.n[1] + 4, 1.05, 0.2);
    g.restore();
  }
  if (seca > 0.03) manga(g, e.n, seca);

  motas(g, e.n, t, Math.max(llegan, llegan2), aLaBoca);

  if (frio > 0.04) k.brillo(g, e.n[0], e.n[1], 36, "120,190,255", 0.75 * frio);
  if (e.abre > 0.2) k.brillo(g, e.n[0] - 8, e.n[1] + 8, 42, "255,90,40", 0.85 * e.abre);
  if (calorFinal > 0.05) k.brillo(g, e.n[0] + 22, e.n[1], 30, "255,140,40", 0.4 * calorFinal);
  if (cerebro > 0.04) {
    const bx = e.n[0] - 28, by = e.n[1] - 4;
    k.brillo(g, bx, by, 30, "255,236,180", cerebro);
    k.brillo(g, bx, by, 12, "blanca", 0.7 * cerebro);
    g.save();
    g.strokeStyle = `rgba(255,230,150,${0.9 * cerebro})`; g.lineWidth = 2.2;
    g.beginPath(); g.arc(bx, by, 9, Math.PI * 0.9, Math.PI * 1.65); g.stroke();
    g.restore();
  }

  m.sinVista(g);
  if (t > f7.t("treinta") - 0.2 && t < f7.t("cinco") + 0.15) m.pastillaPop(g, t, f7.t("treinta") - 0.05, 250, 680, "30", "°C", "255,120,80", 92, f7.t("cinco") - 0.02);
  if (t > f7.t("cinco") - 0.15 && t < f8.t("estudio") + 0.15) m.pastillaPop(g, t, f7.t("cinco") - 0.04, 780, 1180, "−5", "°C", "120,190,255", 96, f8.t("estudio") - 0.05);
  if (t > f9.t("doce") - 0.15 && t < f9.t("mano") - 0.05) m.pastillaPop(g, t, f9.t("doce") - 0.05, 540, 680, "+12", "°C", "255,150,50", 96, f9.t("mano") - 0.2);
  m.velo(g, 0.72);
  m.vineta(g, 0.28);
}
