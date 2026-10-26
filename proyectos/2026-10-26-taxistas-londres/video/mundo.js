// Londres de noche, el taxi y la pieza del mapa. Lo que se repite sale de aquí.
import * as k from "#kit";

const az = k.azar(26);

export function velo(g, fuerza = 0.78) {
  g.save();
  const grd = g.createLinearGradient(0, 180, 0, 560);
  grd.addColorStop(0, `rgba(3,6,16,${fuerza})`);
  grd.addColorStop(0.72, `rgba(3,6,16,${fuerza * 0.45})`);
  grd.addColorStop(1, "rgba(3,6,16,0)");
  g.fillStyle = grd;
  g.fillRect(0, 160, 1080, 430);
  g.restore();
}

export function noche(g, calor = 0) {
  const grd = g.createLinearGradient(0, 0, 0, 1920);
  grd.addColorStop(0, k.mezColor("#05060f", "#2a1038", calor));
  grd.addColorStop(0.42, k.mezColor("#0b1730", "#4a2a18", calor * 0.55));
  grd.addColorStop(1, k.mezColor("#070b10", "#1a1208", calor * 0.35));
  g.fillStyle = grd;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.85;
  const azs = k.azar(3);
  for (let i = 0; i < 70; i++) {
    const x = azs() * 1080, y = azs() * 900, r = 1 + azs() * 1.6;
    g.fillStyle = `rgba(255,255,255,${0.25 + azs() * 0.55})`;
    g.fillRect(x, y, r, r);
  }
  g.restore();
}

const TONOS = ["#1b2033", "#2a1b24", "#17261f", "#2c2418", "#141a2c", "#241e33"];
export const BLOQUES = [];
for (let i = 0; i < 64; i++) {
  const lado = i % 2 === 0 ? -1 : 1;
  const fila = Math.floor(i / 2);
  BLOQUES.push({
    x: lado * (2.55 + (fila % 3) * 0.15 + az() * 0.35),
    z: 6 + fila * 2.15 + az() * 0.4,
    w: 1.15 + az() * 0.7,
    d: 1.1 + az() * 0.5,
    h: 1.5 + az() * 3.1,
    tono: TONOS[i % TONOS.length],
    sem: i * 17 + 3,
  });
}

export const RED = [];
for (let i = 0; i < 28; i++) {
  const y = 0.35 + az() * 0.8;
  let x = (az() - 0.5) * 18, z = 8 + az() * 20;
  const pts = [];
  for (let s = 0; s < 7; s++) {
    pts.push([x, y + Math.sin(s * 1.3 + i) * 0.35, z]);
    const giro = az() < 0.35;
    if (giro) x += (az() < 0.5 ? -1 : 1) * (2.2 + az() * 3.5);
    else z += 2.4 + az() * 3.2;
  }
  RED.push({ pts, c: az() < 0.5 ? "255,186,70" : "255,120,90" });
}

function cara(g, cam, pts, color) {
  g.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const q = k.proyecta(cam, pts[i]);
    if (!q) return;
    g[i ? "lineTo" : "moveTo"](q.x, q.y);
  }
  g.closePath();
  g.fillStyle = color;
  g.fill();
}

function edificio(g, cam, b) {
  const { x, z, w, d, h } = b;
  const x0 = x, x1 = x + (x > 0 ? w : -w), z0 = z, z1 = z + d;
  cara(g, cam, [[x0, 0, z0], [x1, 0, z0], [x1, h, z0], [x0, h, z0]], b.tono);
  const frente = x > 0
    ? [[x0, 0, z0], [x0, 0, z1], [x0, h, z1], [x0, h, z0]]
    : [[x1, 0, z0], [x1, 0, z1], [x1, h, z1], [x1, h, z0]];
  cara(g, cam, frente, k.mezColor(b.tono, "#3a3128", 0.35));
  const q = k.proyecta(cam, [x, h * 0.55, z + d * 0.3]);
  if (!q || q.z > 22) return;
  const azw = k.azar(b.sem);
  const cols = 3, fils = 4;
  for (let cx = 0; cx < cols; cx++) for (let cy = 0; cy < fils; cy++) {
    if (azw() < 0.35) continue;
    const px = x + (x > 0 ? 0.08 : -0.08);
    const yy = 0.45 + cy * (h - 0.7) / fils;
    const zz = z + 0.18 + cx * (d * 0.7) / cols;
    const a = k.proyecta(cam, [px, yy, zz]);
    if (!a) continue;
    const s = Math.max(2, k.tamano(0.09, a.z));
    const caliente = azw();
    g.fillStyle = caliente < 0.15 ? "rgba(120,210,255,0.85)" : `rgba(255,${170 + Math.floor(azw() * 50)},80,0.9)`;
    g.fillRect(a.x, a.y, s * 1.3, s * 1.7);
  }
}

export function ciudad(g, cam, t, red = 0) {
  const cosas = [];
  for (const b of BLOQUES) {
    const q = k.proyecta(cam, [b.x, b.h * 0.5, b.z]);
    if (!q || q.z < 0.3) continue;
    cosas.push({ z: q.z, dibuja: () => edificio(g, cam, b) });
  }
  // la calzada, mojada, con las rayas que vienen hacia la cámara
  const suelo = [];
  for (const x of [-2.15, 2.15]) {
    const a = k.proyecta(cam, [x, 0, cam.p[2] + 1.2]);
    const b = k.proyecta(cam, [x, 0, cam.p[2] + 46]);
    if (a && b) suelo.push([a, b]);
  }
  cosas.push({
    z: 90,
    dibuja: () => {
      g.save();
      if (suelo.length === 2) {
        g.beginPath();
        g.moveTo(suelo[0][0].x, suelo[0][0].y);
        g.lineTo(suelo[0][1].x, suelo[0][1].y);
        g.lineTo(suelo[1][1].x, suelo[1][1].y);
        g.lineTo(suelo[1][0].x, suelo[1][0].y);
        g.closePath();
        const grd = g.createLinearGradient(540, 700, 540, 1920);
        grd.addColorStop(0, "rgba(18,22,34,0.2)");
        grd.addColorStop(1, "rgba(8,10,16,0.92)");
        g.fillStyle = grd;
        g.fill();
      }
      g.lineCap = "round";
      for (let i = 0; i < 18; i++) {
        const z = cam.p[2] + 2 + ((i * 3.2 - t * 16) % 52 + 52) % 52;
        const a = k.proyecta(cam, [-0.08, 0.02, z]);
        const b = k.proyecta(cam, [0.08, 0.02, z + 1.3]);
        if (!a || !b) continue;
        g.strokeStyle = "rgba(255,214,140,0.8)";
        g.lineWidth = Math.max(2, k.tamano(0.08, a.z));
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
        g.stroke();
      }
      g.restore();
    },
  });
  if (red > 0.02) {
    for (const r of RED) {
      const q = k.proyecta(cam, r.pts[0]);
      if (!q) continue;
      cosas.push({
        z: q.z,
        dibuja: () => {
          g.save();
          g.globalAlpha = red;
          g.lineCap = "round";
          g.lineJoin = "round";
          g.beginPath();
          let listo = false;
          for (const p of r.pts) {
            const a = k.proyecta(cam, p);
            if (!a) { listo = false; continue; }
            g[listo ? "lineTo" : "moveTo"](a.x, a.y);
            listo = true;
          }
          g.strokeStyle = `rgba(${r.c},0.95)`;
          g.lineWidth = 7;
          g.shadowColor = `rgba(${r.c},0.9)`;
          g.shadowBlur = 18;
          g.stroke();
          g.restore();
        },
      });
    }
  }
  k.deLejosACerca(cosas);
}

// El taxi, visto por detrás. s es el ancho en píxeles.
export function taxiDetras(g, x, y, s, al = 1) {
  if (al < 0.02 || s < 8) return;
  g.save();
  g.translate(x, y);
  g.scale(s / 460, s / 460);
  g.globalAlpha = al;
  // la luz del techo
  g.save();
  g.shadowColor = "rgba(255,170,40,0.9)";
  g.shadowBlur = 28;
  k.redondo(g, -46, -268, 92, 42, 8);
  const sg = g.createLinearGradient(0, -268, 0, -226);
  sg.addColorStop(0, "#ffe1a2");
  sg.addColorStop(1, "#ff9a1a");
  g.fillStyle = sg;
  g.fill();
  g.restore();
  // la caja, con volumen
  k.redondo(g, -168, -214, 336, 400, 28);
  const cuerpo = g.createLinearGradient(-168, 0, 168, 0);
  cuerpo.addColorStop(0, "#2a313c");
  cuerpo.addColorStop(0.35, "#12161c");
  cuerpo.addColorStop(0.7, "#07090c");
  cuerpo.addColorStop(1, "#1c242e");
  g.fillStyle = cuerpo;
  g.fill();
  g.strokeStyle = "rgba(255,220,170,0.18)";
  g.lineWidth = 3;
  g.stroke();
  // el cristal de atrás
  k.redondo(g, -122, -176, 244, 168, 16);
  const cristal = g.createLinearGradient(0, -176, 0, -8);
  cristal.addColorStop(0, "rgba(255,186,90,0.55)");
  cristal.addColorStop(0.45, "rgba(80,120,170,0.35)");
  cristal.addColorStop(1, "rgba(10,16,28,0.72)");
  g.fillStyle = cristal;
  g.fill();
  // un reflejo
  g.fillStyle = "rgba(255,255,255,0.18)";
  g.beginPath();
  g.moveTo(-90, -160);
  g.lineTo(-20, -160);
  g.lineTo(-70, -30);
  g.lineTo(-110, -30);
  g.fill();
  // pilotos
  for (const px of [-132, 78]) {
    k.redondo(g, px, 28, 54, 36, 8);
    g.fillStyle = "#ff2d3a";
    g.shadowColor = "rgba(255,40,50,0.95)";
    g.shadowBlur = 22;
    g.fill();
    g.shadowBlur = 0;
  }
  // el paragolpes
  k.redondo(g, -150, 120, 300, 28, 8);
  const metal = g.createLinearGradient(0, 120, 0, 148);
  metal.addColorStop(0, "#f2f4f8");
  metal.addColorStop(0.5, "#8e98a6");
  metal.addColorStop(1, "#d5dbe3");
  g.fillStyle = metal;
  g.fill();
  // la matrícula
  k.redondo(g, -52, 78, 104, 32, 4);
  g.fillStyle = "#f4e7b0";
  g.fill();
  g.restore();
}

// Una pieza curva. u = 0 es delante, u = 1 es atrás. crece hincha la parte de atrás.
export function curvaPieza(u, lado = 1, abre = 0.42) {
  return [
    lado * (abre - 0.08 * u),
    -0.05 + Math.sin(u * Math.PI) * 0.62,
    -0.95 + u * 1.9,
  ];
}

export function pieza(g, cam, { lado = 1, crece = 0, al = 1, tono = "214,146,98", abre = 0.42, origen = [0, 0, 0], escala = 1 } = {}) {
  if (al < 0.02) return;
  const sitio = (u) => {
    const p = curvaPieza(u, lado, abre);
    return [origen[0] + p[0] * escala, origen[1] + p[1] * escala, origen[2] + p[2] * escala];
  };
  const anillos = [];
  for (let i = 0; i <= 30; i++) {
    const u = i / 30;
    const p = sitio(u);
    const q = k.proyecta(cam, p);
    if (!q) continue;
    const gordo = (0.11 + crece * k.suave(k.tramo(u, 0.48, 0.82)) * 0.2) * escala;
    anillos.push({ u, q, r: k.tamano(gordo, q.z) });
  }
  anillos.sort((a, b) => b.q.z - a.q.z);
  g.save();
  g.globalAlpha = al;
  for (const a of anillos) {
    if (a.r < 1.5) continue;
    const caliente = k.suave(k.tramo(a.u, 0.5, 0.9)) * crece;
    const grd = g.createRadialGradient(a.q.x - a.r * 0.32, a.q.y - a.r * 0.38, a.r * 0.08, a.q.x, a.q.y, a.r);
    grd.addColorStop(0, `rgba(255,236,214,${0.95})`);
    grd.addColorStop(0.55, `rgba(${caliente > 0.2 ? "232,176,150" : tono},0.96)`);
    grd.addColorStop(0.86, `rgba(${caliente > 0.35 ? "120,70,80" : "90,52,40"},0.95)`);
    grd.addColorStop(1, "rgba(20,8,16,0)");
    g.fillStyle = grd;
    g.beginPath();
    g.arc(a.q.x, a.q.y, a.r, 0, 6.2832);
    g.fill();
  }
  // calles guardadas dentro, más cuanto más crece la parte de atrás
  if (crece > 0.15) {
    const luces = k.azar(lado > 0 ? 11 : 12);
    for (let i = 0; i < 18; i++) {
      const u = 0.55 + luces() * 0.4;
      const q = k.proyecta(cam, sitio(u));
      if (!q) continue;
      k.brillo(g, q.x, q.y, k.tamano(0.08 * escala, q.z) * (2 + crece * 3), luces() < 0.5 ? "255,190,80" : "255,120,90", crece * al);
    }
  }
  g.restore();
}

export function fondoPieza(g) {
  const grd = g.createRadialGradient(540, 980, 80, 540, 1000, 1100);
  grd.addColorStop(0, "#2a1438");
  grd.addColorStop(0.45, "#140a22");
  grd.addColorStop(1, "#07060f");
  g.fillStyle = grd;
  g.fillRect(0, 0, 1080, 1920);
  g.save();
  g.globalAlpha = 0.45;
  g.drawImage(k.tenir(k.manchas, "#6a3a7a"), -80, 200, 1300, 1600);
  g.globalAlpha = 0.2;
  g.drawImage(k.tenir(k.red, "#ffb0c8"), 0, 300, 1080, 1400);
  g.restore();
}
