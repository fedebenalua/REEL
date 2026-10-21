// Una persona de cuerpo entero, de perfil y mirando a la derecha (+x), con su vestido coral: camina, tropieza (cae girando
// sobre el pie de delante), lleva una bandeja con un cuenco de palomitas o saca unas llaves y las agita.
// El origen (0,0) es el suelo, entre los pies; mide unos 880 de alto.
import * as k from "#kit";

const { redondo, suave: su, tramo: tr } = k;

export const PIE_DELANTE = 158; // dónde cae el pie de delante cuando da el paso largo (para girar sobre él)
const PIEL = ["#f6cba4", "#dc9f78", "#a8664a"];

function pierna(g, a, flex = 0) {
  const hx = 0, hy = -330, fx = hx + Math.sin(a) * 330, fy = hy + Math.cos(a) * 330;
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = 46; g.beginPath(); g.moveTo(hx, hy); g.lineTo(fx, fy); g.stroke();
  g.strokeStyle = "#f0c8a2"; g.lineWidth = 38; g.beginPath(); g.moveTo(hx, hy); g.lineTo(fx, fy); g.stroke();
  // el zapato
  g.translate(fx, fy); g.rotate(a * 0.3);
  redondo(g, -16, -22, 78, 40, 18); const zg = g.createLinearGradient(0, -22, 0, 18); zg.addColorStop(0, "#c0392b"); zg.addColorStop(1, "#4a0e0a"); g.fillStyle = zg; g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; redondo(g, -4, -17, 40, 7, 3); g.fill();
  g.restore();
}
function brazo(g, pts, w = 36) {
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = "rgba(0,0,0,0.3)"; g.lineWidth = w + 6; g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke();
  g.strokeStyle = "#f2704a"; g.lineWidth = w; g.beginPath(); g.moveTo(...pts[0]); pts.slice(1).forEach((p) => g.lineTo(...p)); g.stroke();
  const m = pts[pts.length - 1];
  g.fillStyle = PIEL[0]; g.beginPath(); g.arc(m[0], m[1], 22, 0, 6.2832); g.fill();
  g.restore();
}

// o: { x, y, flip, ph (fase del paso), amp (cuánto se abren las piernas, 0 = quieta), phi (cuánto ha caído), susto (0 a 1),
//      bandeja (0/1: la lleva en las manos), llaves ({ agita (0 a 1) }) o null }
// Devuelve dónde está la mano en el mundo (para soltar la bandeja o las llaves).
export function persona(g, t, o) {
  const { x = 0, y = 0, flip = 1, ph = 0, amp = 0, phi = 0, susto = 0, bandeja = 0, llaves = null } = o;
  const a1 = 0.5 * amp * Math.sin(ph), a2 = -0.5 * amp * Math.sin(ph);
  // al caer: el pie de delante se queda atrás, el de atrás sube
  const aF = phi > 0 ? 0.5 : a1, aB = phi > 0 ? -0.5 + 1.6 * Math.min(1, phi / 1.45) : a2;
  g.save(); g.translate(x, y); g.scale(flip, 1);
  g.translate(PIE_DELANTE, 0); g.rotate(phi); g.translate(-PIE_DELANTE, 0);
  // sombra en el suelo
  if (phi < 0.3) { g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.ellipse(40, 4, 160, 22, 0, 0, 6.2832); g.fill(); }
  pierna(g, aB, 0);
  // el vestido, con su cinturón y su cuello blanco
  g.save(); g.shadowColor = "rgba(0,0,0,0.35)"; g.shadowBlur = 20; g.shadowOffsetY = 12;
  g.beginPath(); g.moveTo(-52, -650); g.quadraticCurveTo(-62, -560, -44, -470); g.lineTo(-132, -296); g.lineTo(132, -296); g.lineTo(46, -470); g.quadraticCurveTo(60, -560, 52, -650); g.closePath();
  const dg = g.createLinearGradient(-130, 0, 130, 0); dg.addColorStop(0, "#ff9a6a"); dg.addColorStop(0.5, "#f2704a"); dg.addColorStop(1, "#a83420"); g.fillStyle = dg; g.fill(); g.restore();
  g.save(); g.beginPath(); g.moveTo(-52, -650); g.quadraticCurveTo(-62, -560, -44, -470); g.lineTo(-132, -296); g.lineTo(132, -296); g.lineTo(46, -470); g.quadraticCurveTo(60, -560, 52, -650); g.closePath(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.25; g.drawImage(k.red, -140, -660, 280, 380); g.restore();
  g.fillStyle = "#fff3d6"; g.beginPath(); g.moveTo(-30, -300); g.lineTo(-52, -296); g.lineTo(-30, -296); g.fill();
  g.fillStyle = "#6a1a10"; g.fillRect(-48, -478, 98, 14);
  for (let i = 0; i < 6; i++) { g.fillStyle = "#fff3d6"; g.beginPath(); g.arc(-90 + i * 36, -330, 9, 0, 6.2832); g.fill(); }
  pierna(g, aF, 0);
  // el cuello y la cabeza
  g.fillStyle = PIEL[1]; g.fillRect(-14, -700, 30, 54);
  g.fillStyle = "#fff3d6"; g.beginPath(); g.moveTo(-34, -652); g.quadraticCurveTo(0, -620, 38, -652); g.lineTo(34, -668); g.lineTo(-30, -668); g.closePath(); g.fill();
  const hg = g.createRadialGradient(-10, -770, 6, 8, -735, 78); hg.addColorStop(0, PIEL[0]); hg.addColorStop(0.7, PIEL[1]); hg.addColorStop(1, PIEL[2]);
  g.beginPath(); g.arc(8, -735, 62, 0, 6.2832); g.fillStyle = hg; g.fill();
  g.beginPath(); g.arc(66, -722, 11, 0, 6.2832); g.fillStyle = PIEL[1]; g.fill();                       // la nariz
  // el pelo: castaño rojizo con moño
  g.fillStyle = "#6a2e14"; g.beginPath(); g.arc(-12, -752, 58, Math.PI * 0.62, Math.PI * 2.08); g.lineTo(38, -790); g.quadraticCurveTo(40, -740, 10, -748); g.quadraticCurveTo(-8, -756, -26, -738); g.closePath(); g.fill();
  g.beginPath(); g.arc(-68, -778, 32, 0, 6.2832); g.fill();
  g.fillStyle = "rgba(255,255,255,0.22)"; g.beginPath(); g.ellipse(-10, -802, 30, 8, -0.2, 0, 6.2832); g.fill();
  // el ojo, la ceja, la mejilla y la boca
  const ab = 9 + 5 * susto;
  g.fillStyle = "#fff"; g.beginPath(); g.ellipse(40, -742, ab, ab + 1, 0, 0, 6.2832); g.fill(); g.fillStyle = "#2a1408"; g.beginPath(); g.arc(44 + 1.5 * susto, -742, 4.6, 0, 6.2832); g.fill();
  g.strokeStyle = "#4a1e0c"; g.lineWidth = 5; g.lineCap = "round"; g.beginPath(); g.moveTo(26, -764 - 6 * susto); g.lineTo(56, -762 - 10 * susto); g.stroke();
  g.fillStyle = "rgba(255,120,110,0.4)"; g.beginPath(); g.arc(30, -712, 14, 0, 6.2832); g.fill();
  g.strokeStyle = "#a82a24"; g.lineWidth = 5;
  if (susto > 0.3) { g.fillStyle = "#6a0e10"; g.beginPath(); g.ellipse(48, -698, 9, 8 + 5 * susto, 0, 0, 6.2832); g.fill(); } else { g.beginPath(); g.moveTo(34, -700); g.quadraticCurveTo(48, -690, 60, -704); g.stroke(); }
  // los brazos: con la bandeja, con las llaves o sueltos
  let mano = null;
  if (llaves) {
    const ag = llaves.agita, sh = Math.sin(t * 34) * 14 * ag, hy = -690 + sh * 0.6, hx = 140 + sh * 0.5;
    brazo(g, [[6, -632], [96, -566], [hx, hy]]);
    // el llavero: una anilla con tres llaves colgando que se mueven
    g.save(); g.translate(hx, hy + 18); g.rotate(Math.sin(t * 34 + 0.6) * 0.5 * ag);
    g.strokeStyle = "#e8d070"; g.lineWidth = 6; g.beginPath(); g.arc(0, 22, 22, 0, 6.2832); g.stroke();
    [[-26, 0.3], [0, 0], [26, -0.3]].forEach(([dx, r], i) => {
      g.save(); g.translate(dx * 0.6, 40); g.rotate(r + Math.sin(t * 30 + i * 2) * 0.35 * ag);
      g.fillStyle = i === 1 ? "#f2d870" : "#d6a830"; g.beginPath(); g.arc(0, 38, 14, 0, 6.2832); g.fill(); g.fillStyle = "rgba(0,0,0,0.5)"; g.beginPath(); g.arc(0, 38, 5, 0, 6.2832); g.fill();
      g.fillStyle = i === 1 ? "#f2d870" : "#d6a830"; g.fillRect(-4, 50, 8, 62); g.fillRect(4, 98, 14, 8); g.fillRect(4, 84, 10, 7);
      g.restore();
    });
    g.restore();
    mano = [hx, hy + 40];
  } else {
    const bob = 4 * Math.sin(ph * 2) * (amp > 0 ? 1 : 0);
    brazo(g, [[6, -632], [34, -540], [170, -524 + bob]]);
    mano = [170, -524 + bob];
    if (bandeja > 0.5) {
      g.save(); g.translate(176, -508 + bob);
      redondo(g, -110, -4, 260, 18, 9); const tg = g.createLinearGradient(0, -4, 0, 14); tg.addColorStop(0, "#f4f6f9"); tg.addColorStop(1, "#8a909a"); g.fillStyle = tg; g.fill();
      cuenco(g, 20, -4);
      g.restore();
    }
  }
  g.restore();
  return mano;
}

// el cuenco de palomitas: en (x, y) sobre el suelo, con unas cuantas palomitas rebosando
export function cuenco(g, x, y, girar = 0) {
  g.save(); g.translate(x, y); g.rotate(girar);
  g.beginPath(); g.moveTo(-64, -90); g.lineTo(64, -90); g.lineTo(46, 0); g.lineTo(-46, 0); g.closePath();
  const cg = g.createLinearGradient(-64, 0, 64, 0); cg.addColorStop(0, "#d63a3a"); cg.addColorStop(0.5, "#f4f0e4"); cg.addColorStop(1, "#c42a2a");
  g.fillStyle = cg; g.fill();
  g.save(); g.clip(); for (let i = -3; i < 4; i++) { g.fillStyle = i % 2 ? "#f4f0e4" : "#d63a3a"; g.fillRect(i * 18 - 6, -90, 12, 90); } g.restore();
  for (const [dx, dy, r] of [[-44, -100, 20], [-18, -122, 22], [14, -116, 22], [40, -98, 19], [-2, -104, 24], [-30, -92, 18], [28, -128, 17]]) {
    g.beginPath(); g.arc(dx, dy, r, 0, 6.2832); const pg = g.createRadialGradient(dx - 6, dy - 7, 2, dx, dy, r); pg.addColorStop(0, "#fffef6"); pg.addColorStop(1, "#ecc872"); g.fillStyle = pg; g.fill();
  }
  g.restore();
}
