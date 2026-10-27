// «Las inventó en Japón Seiichi Miyake, para un amigo que se estaba quedando ciego.»
// Otro sitio: una calle japonesa de casas de madera al atardecer, con farolillos rojos y montañas al fondo.
// - desde «Las»: la calle, la cámara entra despacio; «Japón»: «Japón, 1965»; «Seiichi Miyake»: su nombre.
// - «quedando ciego»: la imagen se emborrona y se oscurece desde los bordes, como la vista de su amigo.
import * as k from "#kit";
import { v } from "#voz";
import { poli } from "../mundo.js";

export const desde = (vz) => vz.frase(6).inicio;

const f6 = v.frase(6), T0 = f6.inicio, Tjap = f6.t("japon"), Tmiy = f6.t("seiichi"), Tqued = f6.t("quedando"), Tcie = f6.t("ciego"), Fin = v.frase(7).inicio;

const az = k.azar(65);
const CASAS = [];
for (const lado of [-1, 1]) for (let z = 3; z < 80; ) { const l = 4 + az() * 3; CASAS.push({ lado, z, l, h: 4.5 + az() * 2.5, madera: ["#4a2a1c", "#5a3422", "#3e2418"][Math.floor(az() * 3)], farol: az() < 0.8 }); z += l + 0.3; }
const MONTES = Array.from({ length: 9 }, (_, i) => ({ x: -500 + i * 130 + az() * 60, h: 60 + az() * 90, w: 120 + az() * 80 }));
const escena = k.lienzo(1080, 1920);

function calleJapon(g, t) {
  const cam = k.mira([0, 1.65, k.mez(-1, 3.5, k.suave(k.tramo(t, T0, Fin)))], [0, 1.9, 60]);
  const sg = g.createLinearGradient(0, 0, 0, 1050); sg.addColorStop(0, "#2a2060"); sg.addColorStop(0.55, "#d0607a"); sg.addColorStop(1, "#ffb070");
  g.fillStyle = sg; g.fillRect(0, 0, 1080, 1920);
  const sol = k.proyecta(cam, [0, 40, 900]); if (sol) k.brillo(g, sol.x, sol.y, 900, "255,180,110", 0.7);
  // las montañas, muy lejos
  for (const m of MONTES) {
    if (poli(g, cam, [[m.x - m.w, 0, 600], [m.x, m.h, 600], [m.x + m.w, 0, 600]])) { g.fillStyle = "#6a3a6a"; g.fill(); }
  }
  // el suelo de tierra
  if (poli(g, cam, [[-40, 0, -2], [40, 0, -2], [40, 0, 600], [-40, 0, 600]])) { const P = k.proyecta(cam, [0, 0, 80]); const gg = g.createLinearGradient(0, P ? P.y : 1000, 0, 1920); gg.addColorStop(0, "#c0806a"); gg.addColorStop(1, "#6e4430"); g.fillStyle = gg; g.fill(); }
  g.save(); if (poli(g, cam, [[-40, 0, -2], [40, 0, -2], [40, 0, 600], [-40, 0, 600]])) { g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.manchas, 0, 900, 1080, 1100); } g.restore();
  // las casas, de lejos a cerca
  const orden = CASAS.slice().sort((a, b) => b.z - a.z);
  for (const c of orden) {
    const x = c.lado * 4, z0 = c.z, z1 = c.z + c.l;
    // la fachada de madera
    if (poli(g, cam, [[x, 0, z0], [x, 0, z1], [x, c.h, z1], [x, c.h, z0]])) { g.fillStyle = c.madera; g.fill(); }
    // la planta baja: el papel de las ventanas encendido, con su celosía
    if (poli(g, cam, [[x - c.lado * 0.01, 0.6, z0 + 0.5], [x - c.lado * 0.01, 0.6, z1 - 0.5], [x - c.lado * 0.01, 2.3, z1 - 0.5], [x - c.lado * 0.01, 2.3, z0 + 0.5]])) {
      g.fillStyle = "#ffcf8a"; g.fill();
      g.save(); g.clip(); g.strokeStyle = "rgba(70,40,20,0.8)"; g.lineWidth = 2;
      for (let zz = z0 + 0.5; zz < z1 - 0.5; zz += 0.35) { const A = k.proyecta(cam, [x, 0.6, zz]), B = k.proyecta(cam, [x, 2.3, zz]); if (A && B) { g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke(); } }
      for (let yy = 0.9; yy < 2.3; yy += 0.4) { const A = k.proyecta(cam, [x, yy, z0 + 0.5]), B = k.proyecta(cam, [x, yy, z1 - 0.5]); if (A && B) { g.beginPath(); g.moveTo(A.x, A.y); g.lineTo(B.x, B.y); g.stroke(); } }
      g.restore();
    }
    // el alero de tejas, que sale hacia la calle
    if (poli(g, cam, [[x, 2.9, z0 - 0.2], [x, 2.9, z1 + 0.2], [x - c.lado * 1.1, 2.55, z1 + 0.2], [x - c.lado * 1.1, 2.55, z0 - 0.2]])) { g.fillStyle = "#2a2a36"; g.fill(); }
    if (poli(g, cam, [[x, c.h, z0 - 0.2], [x, c.h, z1 + 0.2], [x - c.lado * 1.0, c.h - 0.5, z1 + 0.2], [x - c.lado * 1.0, c.h - 0.5, z0 - 0.2]])) { g.fillStyle = "#24242e"; g.fill(); }
    // el farolillo rojo
    if (c.farol) {
      const P = k.proyecta(cam, [x - c.lado * 0.8, 2.2, z0 + 0.8]);
      if (P && P.z > 0.5) {
        const r = k.tamano(0.22, P.z);
        k.brillo(g, P.x, P.y, r * 9, "255,90,50", 0.55);
        const lg = g.createRadialGradient(P.x - r * 0.3, P.y - r * 0.3, r * 0.1, P.x, P.y, r * 1.2); lg.addColorStop(0, "#ffd0a0"); lg.addColorStop(0.4, "#ff4a30"); lg.addColorStop(1, "#a01810");
        g.fillStyle = lg; g.beginPath(); g.ellipse(P.x, P.y, r, r * 1.35, 0, 0, 6.2832); g.fill();
        g.fillStyle = "#1a1010"; g.fillRect(P.x - r * 0.6, P.y - r * 1.45, r * 1.2, r * 0.25); g.fillRect(P.x - r * 0.6, P.y + r * 1.2, r * 1.2, r * 0.25);
      }
    }
  }
}

export function dibuja(g, t) {
  const borra = k.suave(k.tramo(t, Tqued - 0.1, Tcie + 0.45));
  if (borra < 0.01) calleJapon(g, t);
  else {
    const c = escena.getContext("2d"); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.filter = "none"; c.globalCompositeOperation = "source-over";
    calleJapon(c, t);
    g.save(); g.filter = `blur(${(borra * 26).toFixed(1)}px)`; g.drawImage(escena, 0, 0); g.restore();
    // se cierra desde los bordes
    const R = k.mez(1500, 380, borra);
    const vg = g.createRadialGradient(540, 1000, R * 0.35, 540, 1000, R); vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${0.95 * borra})`);
    g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
    g.fillStyle = `rgba(0,0,0,${0.35 * borra})`; g.fillRect(0, 0, 1080, 1920);
  }
  // los rótulos
  const r1 = k.suave(k.tramo(t, Tjap - 0.1, Tjap + 0.25)) * (1 - k.tramo(t, Tqued, Tcie));
  k.pastilla(g, 540, 800, "Japón, 1965", "", "255,220,170", r1, 92);
  const r2 = k.suave(k.tramo(t, Tmiy - 0.1, Tmiy + 0.25)) * (1 - k.tramo(t, Tqued, Tcie));
  k.pastilla(g, 540, 1380, "Seiichi Miyake", "", "255,255,255", r2, 78);
  const vg = g.createLinearGradient(0, 200, 0, 680); vg.addColorStop(0, "rgba(20,10,35,0.5)"); vg.addColorStop(1, "rgba(20,10,35,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 680);
}
