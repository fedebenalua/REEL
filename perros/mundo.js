// EL PERRO DE LA CASA (y el parque, la persona y la correa). Úsalo en TODOS los vídeos de perros; no dibujes otro perro.
//
//   import { aPantalla, cam, correa, parque, perro, persona, polvo, ponVista, simula, sinVista, velo, vineta, ambiente } from "../../../../perros/mundo.js";
//
// Cómo se usa (mira estos planos hechos, son la referencia):
//   proyectos/2026-10-22-perro-tira-correa/video/planos/01-hook.js        perro y persona andando y tirando (simula, cámara que se abre)
//   proyectos/2026-10-22-perro-tira-correa/video/planos/03-olores.js      primer plano del hocico, perro con la nariz al suelo (cuelloBaja, olfato)
//   proyectos/2026-10-22-perro-tira-correa/video/planos/04-atardecer.js   el parque al atardecer (parque(g, c, t, 1), ambiente)
// Fotos de cómo tiene que verse: perros/muestra-*.jpg
//
// perro(g, { x, fase, marcha, pitch, t, cola, colaTuck, cuelloBaja, escala, pataAlta, bostezo, lamido, cava, cabeza: { ang, abre, ojo, oreja, olfato } }) → { collar, nariz, ingle, pata, pataDel }
//   bostezo 0..1: abre la boca de verdad (mandíbula abajo, ojo entornado). ladra 0..1: un ladrido, boca abierta y ojo abierto. abre sigue siendo la lengua corta.
//   lamido 0..1: un lametón a la punta. 0 escondida, a la mitad la lengua le cruza la trufa, y al final vuelve. Si hay lamido, no cuelga la lengua.
//   Perro de lado (labrador), pie en y = 0, en cm del mundo (ponVista deja el lienzo en esas unidades). Todo sale de t.
//   marcha 0 = quieto, 1 = trote; fase = ciclo de la pata; cuelloBaja 0..1 = baja el cuello para oler.
//   espalda 0..1: panza arriba, patas al aire (1 = de espaldas del todo; los valores de en medio no son una pose).
//   escala: 1 es el labrador de siempre; pataAlta 0..1 levanta la trasera de este lado (1 ≈ 147° desde la vertical, por encima de la horizontal).
//   agacha 0..1: grupa baja y patas traseras flexionadas, cola alta (la postura de hacer sus cosas, de lado). Úsala a 0 o 1.
//   colaTuck 0..1: la cola se recoge hacia la barriga y deja de menearse (el culo metido al correr, o el miedo). 0 es la cola de siempre.
//   cava 0..1: escarbando (1 = pecho bajo, traseras quietas, las de delante abren el hoyo al ritmo de fase). Úsala a 0 o 1.
//   pataDel es la pata delantera de este lado, en el mundo: de ahí sale la tierra.
//   Poses: sentado 0..1 (sentado, cabeza arriba, patas traseras plegadas) y tumbado 0..1 (esfinge, patas delante). Úsalas
//   a 0 o 1 y pasa de una a otra con k.suave sobre t (los valores intermedios no son una pose).
// salon(g, c, t, hora) es el INTERIOR de casa (pared con ventana y luz, cuadros, sofá, lámpara, plantas, suelo de madera y
//   alfombra); hora 0 día, 1 tarde, 2 noche (pared azul, ventana con luna, lámpara encendida). Se usa igual que parque(): salon(g, c, t, hora); ponVista(g, c); perro(...). Pon el
//   perro y la persona sobre la alfombra (x ≈ 420 + 900·n) y la cámara a Z 2.6–4. Nunca la persona entera tapando la pantalla.
// perroFrente(g, { x, escala, t, cola, culpa, lamido, cabeza: { ladea, abre, ojo, oreja, mira, miraY } }): el mismo perro SENTADO DE FRENTE, mirando a
//   cámara (ladea la cabeza, bosteza, sonríe). culpa 0..1 (y culpaOjos, culpaOrejas, culpaCabeza para subirlas por separado): la «cara de culpable» (cabeza y cuerpo bajos, orejas atrás, cejas
//   tristes, mira desde abajo con el blanco del ojo, boca caída, cola recogida); lamido 0..1: se relame. Para primeros planos y reacciones; el de lado, para andar y para escenas con
//   persona. Va sobre la alfombra del salón (x ≈ 420) con la cámara a Z 4–6 (cy ≈ -330/Z). Mira perros/muestra-frente.jpg.
// Si te falta una pose (corriendo, saltando), AMPLÍA este archivo con otro parámetro y el mismo estilo
// (volumen, luz arriba a la izquierda, patas con miembro()); no hagas un perro nuevo en el plano.
// Lo que comparten los planos: el parque (capas con parallax), el perro, la persona y la correa.
// Todo en 2D con unidades de «centímetros del mundo»: el suelo es y = 0 y arriba es y negativo.
// ponVista(g, cam) deja el lienzo en esas unidades; las capas lejanas se mueven menos (parallax).
import * as k from "#kit";

const { azar, lienzo, redondo, suave: su, tramo: tr, mez, mezColor } = k;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- la cámara
export const cam = (Z, cx, cy) => ({ Z, cx, cy });
// El lienzo en cm del mundo, a profundidad f (1 = donde caminan; menos de 1, más lejos).
// Lo lejano casi no se agranda cuando la cámara se acerca (si no, los árboles de fondo serían manchas enormes).
export const zf = (c, f) => (f >= 0.9 ? c.Z * f : f * 3 * Math.pow(c.Z / 3, f * 0.55));
export function ponVista(g, c, f = 1) { const z = zf(c, f); g.setTransform(z, 0, 0, z, 540 - c.cx * z, 960 - c.cy * z); }
export const sinVista = (g) => g.setTransform(1, 0, 0, 1, 0, 0);
// La y de pantalla del suelo a profundidad f.
export const sueloY = (c, f = 1) => 960 - c.cy * zf(c, f);
// Una cámara que va por claves [t, [Z, cx, cy]] sin tirones (el zoom en log, para que el ritmo sea parejo).
export function camino(lista) {
  const Zs = k.claves(lista.map(([t, c]) => [t, Math.log(c[0])])), X = k.claves(lista.map(([t, c]) => [t, c[1]])), Y = k.claves(lista.map(([t, c]) => [t, c[2]]));
  return (t) => cam(Math.exp(Zs(t)), X(t), Y(t));
}

// ---------------------------------------------------------------- lo que se dibuja una vez
const guardado = new Map();
function una(clave, w, h, fn) {
  if (guardado.has(clave)) return guardado.get(clave);
  const l = lienzo(w, h), c = l.getContext("2d");
  fn(c, w, h);
  guardado.set(clave, l);
  return l;
}

// Paletas del parque: de día y a la hora dorada. hora: 0 día, 1 atardecer.
const DIA = { cielo: ["#3f9bef", "#8fd0ff", "#e6f6ff"], copa: ["#b6ee6a", "#56b83f", "#1f6a30"], cesped: ["#a8e070", "#5fbf3c", "#2f8a2c"], camino: ["#e9d9b4", "#cdb98c", "#a8946a"], bruma: "190,225,255", sol: "255,244,214" };
const TARDE = { cielo: ["#2f3f87", "#e9825f", "#ffcf86"], copa: ["#f2cf63", "#78a03c", "#2c4a2a"], cesped: ["#d1d070", "#78a33c", "#35662a"], camino: ["#f0cc94", "#c99b66", "#8a6a48"], bruma: "255,190,130", sol: "255,200,120" };
export const paleta = (hora) => ({
  cielo: DIA.cielo.map((c, i) => mezColor(c, TARDE.cielo[i], hora)), copa: DIA.copa.map((c, i) => mezColor(c, TARDE.copa[i], hora)),
  cesped: DIA.cesped.map((c, i) => mezColor(c, TARDE.cesped[i], hora)), camino: DIA.camino.map((c, i) => mezColor(c, TARDE.camino[i], hora)),
  bruma: hora > 0.5 ? TARDE.bruma : DIA.bruma, sol: hora > 0.5 ? TARDE.sol : DIA.sol,
});

// Un árbol hecho aparte: tronco con luz y una copa de bolas con volumen (sombra, medio, luz arriba a la izquierda).
function arbolImg(semilla, hora) {
  return una(`arbol${semilla}-${hora}`, 520, 900, (c, W, H) => {
    const P = paleta(hora), az = azar(semilla * 17 + 3), tx = W / 2, base = H - 8;
    const tg = c.createLinearGradient(tx - 30, 0, tx + 30, 0);
    tg.addColorStop(0, "#8a5a34"); tg.addColorStop(0.45, "#6a4224"); tg.addColorStop(1, "#33200f");
    c.fillStyle = tg; c.beginPath(); c.moveTo(tx - 24, base); c.quadraticCurveTo(tx - 12, base - 150, tx - 14, base - 380); c.lineTo(tx + 14, base - 380); c.quadraticCurveTo(tx + 12, base - 150, tx + 24, base); c.closePath(); c.fill();
    c.strokeStyle = "#5a3a1e"; c.lineWidth = 12; c.lineCap = "round";
    for (const s of [-1, 1]) { c.beginPath(); c.moveTo(tx, base - 300); c.quadraticCurveTo(tx + s * 50, base - 360, tx + s * 100, base - 440); c.stroke(); }
    const blobs = [];
    for (let i = 0; i < 17; i++) { const a = az() * TAU, r = Math.sqrt(az()); blobs.push([tx + Math.cos(a) * r * 190, 330 + Math.sin(a) * r * 165, 62 + az() * 52]); }
    const pinta = (dx, dy, k2, col, al) => { for (const b of blobs) { c.globalAlpha = al; c.fillStyle = col; c.beginPath(); c.arc(b[0] + dx, b[1] + dy, b[2] * k2, 0, TAU); c.fill(); } };
    pinta(10, 16, 1.02, P.copa[2], 1);
    for (const b of blobs) { const g2 = c.createRadialGradient(b[0] - b[2] * 0.35, b[1] - b[2] * 0.4, b[2] * 0.1, b[0], b[1], b[2]); g2.addColorStop(0, P.copa[1]); g2.addColorStop(1, P.copa[2]); c.fillStyle = g2; c.beginPath(); c.arc(b[0], b[1], b[2], 0, TAU); c.fill(); }
    for (const b of blobs) { const g2 = c.createRadialGradient(b[0] - b[2] * 0.4, b[1] - b[2] * 0.45, 0, b[0] - b[2] * 0.3, b[1] - b[2] * 0.35, b[2] * 0.7); g2.addColorStop(0, P.copa[0]); g2.addColorStop(1, "rgba(255,255,255,0)"); c.globalAlpha = 0.85; c.fillStyle = g2; c.beginPath(); c.arc(b[0] - b[2] * 0.25, b[1] - b[2] * 0.3, b[2] * 0.7, 0, TAU); c.fill(); }
    c.globalAlpha = 0.5;
    for (let i = 0; i < 380; i++) { const b = blobs[Math.floor(az() * blobs.length)], a = az() * TAU, r = Math.sqrt(az()) * b[2]; c.fillStyle = az() < 0.5 ? P.copa[0] : P.copa[2]; c.fillRect(b[0] + Math.cos(a) * r, b[1] + Math.sin(a) * r, 5, 4); }
    c.globalAlpha = 1;
  });
}
function arbustoImg(semilla, hora) {
  return una(`arbusto${semilla}-${hora}`, 520, 300, (c, W, H) => {
    const P = paleta(hora), az = azar(semilla * 31 + 9), blobs = [];
    for (let i = 0; i < 12; i++) blobs.push([60 + (i / 11) * (W - 120) + (az() - 0.5) * 30, H - 80 - Math.sin((i / 11) * Math.PI) * 60 - az() * 40, 55 + az() * 40]);
    for (const b of blobs) { const g2 = c.createRadialGradient(b[0] - b[2] * 0.35, b[1] - b[2] * 0.4, b[2] * 0.1, b[0], b[1], b[2]); g2.addColorStop(0, P.copa[1]); g2.addColorStop(1, P.copa[2]); c.fillStyle = g2; c.beginPath(); c.arc(b[0], b[1], b[2], 0, TAU); c.fill(); }
    for (const b of blobs) { const g2 = c.createRadialGradient(b[0] - b[2] * 0.4, b[1] - b[2] * 0.45, 0, b[0] - b[2] * 0.3, b[1] - b[2] * 0.35, b[2] * 0.7); g2.addColorStop(0, P.copa[0]); g2.addColorStop(1, "rgba(255,255,255,0)"); c.globalAlpha = 0.8; c.fillStyle = g2; c.beginPath(); c.arc(b[0] - b[2] * 0.25, b[1] - b[2] * 0.3, b[2] * 0.7, 0, TAU); c.fill(); }
    c.globalAlpha = 1;
    // flores
    for (let i = 0; i < 16; i++) { const b = blobs[Math.floor(az() * blobs.length)], a = az() * TAU, r = Math.sqrt(az()) * b[2] * 0.8; c.fillStyle = ["#ffd6e8", "#fff3a0", "#ffffff"][i % 3]; c.beginPath(); c.arc(b[0] + Math.cos(a) * r, b[1] + Math.sin(a) * r, 4.5, 0, TAU); c.fill(); }
  });
}
function nubeImg(semilla) {
  return una(`nube${semilla}`, 600, 240, (c, W, H) => {
    const az = azar(semilla * 7 + 1);
    for (let i = 0; i < 9; i++) {
      const x = 110 + (i / 8) * (W - 220), y = H - 90 - Math.sin((i / 8) * Math.PI) * 40 - az() * 20, r = 50 + az() * 38;
      const g2 = c.createRadialGradient(x - r * 0.2, y - r * 0.3, 0, x, y, r); g2.addColorStop(0, "rgba(255,255,255,0.95)"); g2.addColorStop(0.7, "rgba(255,255,255,0.7)"); g2.addColorStop(1, "rgba(235,246,255,0)");
      c.fillStyle = g2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    }
  });
}

// Recorre las repeticiones de un patrón de periodo P (en cm de la capa) que se ven en pantalla.
function repite(c, f, P, margen, fn) {
  const ancho = 540 / zf(c, f), a = Math.floor((c.cx - ancho - margen) / P), b = Math.ceil((c.cx + ancho + margen) / P);
  for (let i = a; i <= b; i++) fn(i * P, i);
}

const ARB_LEJOS = Array.from({ length: 7 }, (_, i) => ({ x: i * 370 + (i % 3) * 40, h: 700 + (i % 4) * 90, s: 1 + (i % 5) }));
const ARB_MEDIO = Array.from({ length: 5 }, (_, i) => ({ x: i * 520 + 120 * (i % 2), h: 1000 + (i % 3) * 140, s: 2 + (i % 4) }));
const ARB_CERCA = Array.from({ length: 4 }, (_, i) => ({ x: i * 640 + 180 * (i % 2) - 80, h: 1350 + (i % 2) * 220, s: 3 + (i % 3) }));
const ARBUSTOS = Array.from({ length: 6 }, (_, i) => ({ x: i * 340 + (i % 2) * 120, w: 220 + (i % 3) * 60, s: 1 + (i % 4) }));

// El cielo y todo el parque detrás de quienes caminan.
export function parque(g, c, t, hora = 0, o = {}) {
  const P = paleta(hora), H = 960;
  sinVista(g);
  const sg = g.createLinearGradient(0, 0, 0, H + 40);
  sg.addColorStop(0, P.cielo[0]); sg.addColorStop(0.62, P.cielo[1]); sg.addColorStop(1, P.cielo[2]);
  g.fillStyle = sg; g.fillRect(0, 0, 1080, H + 60);
  // el sol, grande y suave
  const sx = hora > 0.5 ? 760 : 200, sy = hora > 0.5 ? 880 : 330;
  k.brillo(g, sx, sy, hora > 0.5 ? 1500 : 1000, P.sol, hora > 0.5 ? 0.95 : 0.7);
  // las nubes, lejísimos
  ponVista(g, c, 0.03);
  repite(c, 0.03, 4200, 600, (x0) => { for (const [dx, dy, s] of [[200, -5200, 1], [1500, -4500, 0.8], [2900, -5600, 1.1]]) g.drawImage(nubeImg(Math.round(dx)), x0 + dx, dy, 600 * s * 4, 240 * s * 4); });
  // las colinas
  for (const [f, col, alto, fase] of [[0.06, mezColor("#9cc7e8", "#d99a7a", hora), 520, 1], [0.11, mezColor("#86bfa0", "#b38860", hora), 420, 2.3]]) {
    ponVista(g, c, f);
    g.fillStyle = col; g.beginPath(); g.moveTo(c.cx - 8000, 0);
    for (let x = c.cx - 8000; x <= c.cx + 8000; x += 200) g.lineTo(x, -alto * (0.55 + 0.45 * Math.sin(x / 1400 + fase) * Math.sin(x / 3100 + fase * 2)) - 80);
    g.lineTo(c.cx + 8000, 0); g.closePath(); g.fill();
  }
  // los edificios lejanos
  ponVista(g, c, 0.14);
  repite(c, 0.14, 1800, 600, (x0, i) => {
    const az = azar(500 + i); let x = x0;
    for (let b = 0; b < 6; b++) { const w = 120 + az() * 140, h = 500 + az() * 900; g.fillStyle = mezColor("#a9c4de", "#a8766c", hora); g.fillRect(x, -h, w, h); g.fillStyle = mezColor("#bfd5ea", "#c99480", hora); g.fillRect(x + w * 0.1, -h, w * 0.18, h); x += w + 20 + az() * 60; }
  });
  // el césped de más allá, hasta el camino
  sinVista(g);
  const gg = g.createLinearGradient(0, H - 30, 0, 1700);
  gg.addColorStop(0, P.cesped[0]); gg.addColorStop(0.35, P.cesped[1]); gg.addColorStop(1, P.cesped[2]);
  g.fillStyle = gg; g.fillRect(0, H - 4, 1080, 1960 - H);
  // bruma entre capas
  const capaArbol = (f, lista, P2, ancho, k2) => {
    ponVista(g, c, f);
    repite(c, f, ancho, 700, (x0, i) => { for (const a of lista) { const img = arbolImg(a.s, hora > 0.5 ? 1 : 0), w = (a.h / 900) * 520; g.drawImage(img, x0 + a.x - w / 2, -a.h + 8, w, a.h); } });
    sinVista(g);
    const yb = sueloY(c, f);
    const bg = g.createLinearGradient(0, yb - 1100 * zf(c, f), 0, yb + 40); bg.addColorStop(0, `rgba(${P.bruma},0)`); bg.addColorStop(1, `rgba(${P.bruma},${k2})`);
    g.fillStyle = bg; g.fillRect(0, Math.max(0, yb - 1100 * zf(c, f)), 1080, 1100 * zf(c, f) + 40);
  };
  capaArbol(0.2, ARB_LEJOS, P, 7 * 370 + 100, 0.5);
  capaArbol(0.42, ARB_MEDIO, P, 5 * 520 + 80, 0.28);
  // lo de cerca: farolas, bancos y arbustos
  ponVista(g, c, 0.78);
  repite(c, 0.78, 1900, 500, (x0, i) => {
    for (const a of ARBUSTOS) { const w = a.w * 1.5; g.drawImage(arbustoImg(a.s, hora > 0.5 ? 1 : 0), x0 + a.x * 1.3 - w / 2, -w * 0.58, w, w * 0.58); }
    farola(g, x0 + 560, hora); banco(g, x0 + 1250);
  });
  capaArbol(0.62, ARB_CERCA, P, 4 * 640 + 60, 0.1);
  // el camino y la hierba de delante
  camino_(g, c, t, hora, P);
}

function farola(g, x, hora) {
  const alto = 330;
  g.save();
  const mg = g.createLinearGradient(x - 6, 0, x + 6, 0); mg.addColorStop(0, "#5b616a"); mg.addColorStop(0.5, "#d9dde3"); mg.addColorStop(1, "#444a52");
  g.fillStyle = mg; g.fillRect(x - 5, -alto, 10, alto); g.fillRect(x - 12, -22, 24, 22);
  g.beginPath(); g.moveTo(x - 5, -alto); g.quadraticCurveTo(x - 5, -alto - 40, x + 40, -alto - 40); g.lineTo(x + 40, -alto - 30); g.quadraticCurveTo(x + 5, -alto - 28, x + 5, -alto); g.fill();
  g.fillStyle = "#2b2f36"; redondo(g, x + 28, -alto - 48, 46, 22, 8); g.fill();
  k.brillo(g, x + 52, -alto - 24, 150, "255,235,170", hora > 0.5 ? 0.9 : 0.25);
  g.restore();
}
function banco(g, x) {
  g.save();
  g.fillStyle = "#35302c"; g.fillRect(x + 20, -60, 8, 60); g.fillRect(x + 190, -60, 8, 60);
  for (let i = 0; i < 4; i++) { const gr = g.createLinearGradient(0, -78 + i * 12, 0, -66 + i * 12); gr.addColorStop(0, "#d9a45b"); gr.addColorStop(1, "#a06a30"); g.fillStyle = gr; g.fillRect(x, -78 + i * 12 + 0, 218, 10); }
  for (let i = 0; i < 3; i++) { const gr = g.createLinearGradient(0, -128 + i * 16, 0, -114 + i * 16); gr.addColorStop(0, "#d9a45b"); gr.addColorStop(1, "#a06a30"); g.fillStyle = gr; g.fillRect(x, -128 + i * 16, 218, 13); }
  g.restore();
}

// El camino por donde andan: sus rayas de baldosa en perspectiva corren con la cámara, y los bordes de césped.
function camino_(g, c, t, hora, P) {
  sinVista(g);
  const fa = 0.7, fb = 1.5, ya = sueloY(c, fa), yb = sueloY(c, fb);
  const cg = g.createLinearGradient(0, ya, 0, yb);
  cg.addColorStop(0, P.camino[0]); cg.addColorStop(0.5, P.camino[1]); cg.addColorStop(1, P.camino[2]);
  g.fillStyle = cg; g.fillRect(0, ya, 1080, yb - ya);
  g.fillStyle = "rgba(255,255,255,0.18)"; g.fillRect(0, ya, 1080, 5);
  g.fillStyle = "rgba(0,0,0,0.22)"; g.fillRect(0, yb - 6, 1080, 6);
  // las juntas de las baldosas, en abanico (más lejos, más despacio)
  g.save(); g.beginPath(); g.rect(0, ya, 1080, yb - ya); g.clip();
  g.strokeStyle = "rgba(90,70,40,0.28)"; g.lineWidth = 3;
  const P0 = 110, a0 = Math.floor((c.cx - 540 / zf(c, fa) - 50) / P0), a1 = Math.ceil((c.cx + 540 / zf(c, fa) + 50) / P0);
  g.beginPath();
  for (let i = a0; i <= a1; i++) { const X = i * P0; g.moveTo(540 + (X - c.cx) * zf(c, fa), ya); g.lineTo(540 + (X - c.cx) * zf(c, fb), yb); }
  g.stroke();
  // una raya larga a lo largo del camino
  g.strokeStyle = "rgba(90,70,40,0.25)"; g.lineWidth = 3; g.beginPath();
  for (const f of [0.95, 1.2]) { const y = sueloY(c, f); g.moveTo(0, y); g.lineTo(1080, y); }
  g.stroke();
  // grano
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.3; tesela(g, k.red, -c.cx * zf(c, 1.1), ya, 700, yb - ya);
  g.restore();
  // el borde del césped, de delante
  const gg = g.createLinearGradient(0, yb, 0, 1920);
  gg.addColorStop(0, P.cesped[1]); gg.addColorStop(1, P.cesped[2]);
  g.fillStyle = gg; g.fillRect(0, yb, 1080, 1920 - yb);
  g.fillStyle = "rgba(255,255,255,0.14)"; g.fillRect(0, yb, 1080, 4);
  // las franjas del césped cortado, de delante, y su grano
  g.save(); g.beginPath(); g.rect(0, yb, 1080, 1920 - yb); g.clip();
  const zz = zf(c, 1.5), PA = 140, b0 = Math.floor((c.cx - 540 / zz) / PA) - 1, b1 = Math.ceil((c.cx + 540 / zz) / PA) + 1;
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.22; tesela(g, k.manchas, -c.cx * zz * 0.5, yb, 900, 1920 - yb); g.globalAlpha = 0.18; tesela(g, k.red, -c.cx * zz, yb, 900, 1920 - yb);
  g.restore();
  sinVista(g);
}

// Una textura repetida a lo ancho de la pantalla, corrida off píxeles.
function tesela(g, img, off, y, w, h) { let x = ((off % w) + w) % w - w; for (; x < 1080; x += w) g.drawImage(img, x, y, w, h); }
// Un velo oscuro arriba, detrás del subtítulo.
export function velo(g, al = 0.4) {
  if (al <= 0.01) return;
  sinVista(g);
  const vg = g.createLinearGradient(0, 150, 0, 700);
  vg.addColorStop(0, `rgba(10,24,48,${al})`); vg.addColorStop(0.6, `rgba(10,24,48,${al * 0.7})`); vg.addColorStop(1, "rgba(10,24,48,0)");
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 700);
}
// Luz de la hora dorada por encima de todo.
export function ambiente(g, hora, al = 1) {
  if (hora <= 0.01) return;
  sinVista(g);
  g.save(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.5 * hora * al;
  const og = g.createLinearGradient(0, 0, 0, 1920); og.addColorStop(0, "#ffd9b0"); og.addColorStop(1, "#ffb878");
  g.fillStyle = og; g.fillRect(0, 0, 1080, 1920); g.restore();
  g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = 0.12 * hora * al;
  const lg = g.createRadialGradient(780, 900, 50, 780, 900, 1200); lg.addColorStop(0, "#ffb060"); lg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = lg; g.fillRect(0, 0, 1080, 1920); g.restore();
}
export function vineta(g, al = 0.35) {
  sinVista(g);
  const vg = g.createRadialGradient(540, 960, 600, 540, 960, 1300);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${al})`);
  g.fillStyle = vg; g.fillRect(0, 0, 1080, 1920);
}

// ---------------------------------------------------------------- lo que sirve para dibujar cuerpos
// Dos huesos que llegan de a a b: devuelve el codo (o la rodilla). dir: a qué lado de la recta se dobla.
function ik(ax, ay, bx, by, l1, l2, dir) {
  let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy) || 0.001;
  const dd = Math.min(d, l1 + l2 - 0.01), a = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const ux = dx / d, uy = dy / d;
  return [ax + ux * a - uy * h * dir, ay + uy * a + ux * h * dir];
}
// Un hueso con carne: de a a b, de ancho wa a wb, redondeado.
function hueso(g, a, b, wa, wb) {
  const dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d;
  g.beginPath();
  g.moveTo(a[0] + nx * wa / 2, a[1] + ny * wa / 2); g.lineTo(b[0] + nx * wb / 2, b[1] + ny * wb / 2);
  g.arc(b[0], b[1], wb / 2, Math.atan2(ny, nx), Math.atan2(ny, nx) + Math.PI, false);
  g.lineTo(a[0] - nx * wa / 2, a[1] - ny * wa / 2);
  g.arc(a[0], a[1], wa / 2, Math.atan2(ny, nx) + Math.PI, Math.atan2(ny, nx) + TAU, false);
  g.closePath(); g.fill();
}
// Un miembro de carne: una curva suave por los puntos pts, con el ancho ws en cada uno (redondeado en los extremos).
function miembro(g, pts, ws) {
  const M = 10, L = [], R = [];
  const cr = (p0, p1, p2, p3, u) => [0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * u + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * u * u + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * u * u * u), 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * u + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * u * u + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * u * u * u)];
  const n = pts.length, ext = [pts[0], ...pts, pts[n - 1]], curva = [], anchos = [];
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < M; j++) { const u = j / M; curva.push(cr(ext[i], ext[i + 1], ext[i + 2], ext[i + 3], u)); anchos.push(mez(ws[i], ws[i + 1], u * u * (3 - 2 * u))); }
  curva.push(pts[n - 1]); anchos.push(ws[n - 1]);
  for (let i = 0; i < curva.length; i++) {
    const a = curva[Math.max(0, i - 1)], b = curva[Math.min(curva.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, nx = -dy / d, ny = dx / d, w = anchos[i] / 2;
    L.push([curva[i][0] + nx * w, curva[i][1] + ny * w]); R.push([curva[i][0] - nx * w, curva[i][1] - ny * w]);
  }
  g.beginPath(); L.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])));
  const e = curva[curva.length - 1], we = anchos[anchos.length - 1] / 2, ang = Math.atan2(L[L.length - 1][1] - e[1], L[L.length - 1][0] - e[0]);
  g.arc(e[0], e[1], we, ang, ang - Math.PI, true);
  for (let i = R.length - 1; i >= 0; i--) g.lineTo(R[i][0], R[i][1]);
  const s0 = curva[0], w0 = anchos[0] / 2, a0 = Math.atan2(R[0][1] - s0[1], R[0][0] - s0[0]);
  g.arc(s0[0], s0[1], w0, a0, a0 - Math.PI, true);
  g.closePath(); g.fill();
  return curva;
}
// La pata: un pie que sigue su ciclo (ph de 0 a 1): en el suelo va hacia atrás, en el aire sube y adelanta.
function ciclo(ph, duty, stride, lift) {
  ph -= Math.floor(ph);
  if (ph < duty) return [stride * (0.5 - ph / duty), 0];
  const u = (ph - duty) / (1 - duty), e = u * u * (3 - 2 * u);
  return [stride * (-0.5 + e), -lift * Math.sin(Math.PI * u)];
}

// La trasera levantada, en coordenadas del perro (cadera en [-27, -45]). alta 0..1.
export function posePataAlta(alta) {
  const u = Math.max(0, Math.min(1, alta));
  const cadera = [-27, -45];
  const thighAng = 0.85 + u * 1.35;
  const K = [cadera[0] + Math.sin(thighAng) * 24, cadera[1] + Math.cos(thighAng) * 24];
  const shinAng = thighAng - (0.85 - u * 0.25);
  const H = [K[0] + Math.sin(shinAng) * 20, K[1] + Math.cos(shinAng) * 20];
  const pawAng = shinAng + 0.55;
  const P = [H[0] + Math.sin(pawAng) * 9, H[1] + Math.cos(pawAng) * 9];
  return { K, H, P, pawAng };
}

// ---------------------------------------------------------------- el perro
const PELO = { luz: "#fbd998", medio: "#e0a652", sombra: "#a96a2c", hondo: "#6d4119", pata: "#f6dcab", lejos: "#a9702f" };

// El mismo labrador, de espaldas: el lomo en el suelo, la panza clara arriba y las cuatro patas meneándose.
function perroEspalda(g, o) {
  const { x, y = 0, dir = 1, t = 0 } = o, cab = o.cabeza || {};
  const escala = o.escala ?? 1, cola = o.cola ?? 0.8;
  const rock = Math.sin(t * 6.5) * 0.1;
  g.save(); g.translate(x, y); g.scale(dir * escala, escala); g.rotate(rock);
  g.save(); g.globalAlpha = 0.32; g.fillStyle = "#1a2a10"; g.beginPath(); g.ellipse(-2, 3, 62, 9, 0, 0, TAU); g.fill(); g.restore();
  // la cola, en el suelo, meneando
  { const w = Math.sin(t * 9) * 14 * cola, base = [-34, -16];
    g.lineCap = "round";
    for (const [col, wd] of [[PELO.sombra, 8], [PELO.medio, 6], [PELO.luz, 2.2]]) {
      g.strokeStyle = col; g.lineWidth = wd; g.beginPath(); g.moveTo(base[0], base[1]); g.quadraticCurveTo(-48, -8, -58 + w * 0.25, -6 - 8 * cola + w * 0.15); g.stroke();
    }
  }
  const pata = (origen, ph, lejos) => {
    const ang = -0.2 + Math.sin(t * 8 + ph) * 0.85;
    const K = [origen[0] + Math.sin(ang) * 18, origen[1] - 22];
    const P = [K[0] + Math.sin(ang + 1.05) * 18, K[1] - 20];
    g.fillStyle = lejos ? PELO.lejos : PELO.medio;
    miembro(g, [origen, K, P], lejos ? [15, 10, 6] : [22, 13, 7]);
    g.save(); g.translate(P[0], P[1]); g.rotate(ang + 0.4);
    g.fillStyle = lejos ? "#c8935a" : PELO.pata; g.beginPath(); g.ellipse(0, 0, 6.4, 3.6, 0, 0, TAU); g.fill();
    if (!lejos) { g.fillStyle = "#5c3814"; for (const [dx, dy] of [[-2.2, -1.2], [0.4, -1.6], [2.4, -0.6], [0.2, 0.8]]) { g.beginPath(); g.ellipse(dx, dy, 1.1, 1.3, 0, 0, TAU); g.fill(); } }
    g.restore();
  };
  pata([-20, -18], 0.4, true); pata([12, -18], 2.1, true);
  // el lomo en el suelo y la panza clara hacia arriba
  g.beginPath(); g.ellipse(-2, -22, 34, 16, -0.06, 0, TAU);
  const bg = g.createLinearGradient(0, -40, 0, -8); bg.addColorStop(0, PELO.luz); bg.addColorStop(0.42, PELO.medio); bg.addColorStop(1, PELO.sombra);
  g.fillStyle = bg; g.fill();
  g.save(); g.beginPath(); g.ellipse(-2, -22, 34, 16, -0.06, 0, TAU); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.16; g.drawImage(k.manchas, -40, -42, 80, 40);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  const pe = g.createRadialGradient(-6, -32, 2, -4, -30, 18); pe.addColorStop(0, "rgba(255,244,214,0.85)"); pe.addColorStop(1, "rgba(255,244,214,0)");
  g.fillStyle = pe; g.fillRect(-30, -42, 40, 24);
  g.restore();
  // manchas de la panza
  g.fillStyle = "rgba(255,236,200,0.55)"; g.beginPath(); g.ellipse(-4, -30, 16, 7, -0.1, 0, TAU); g.fill();
  pata([-14, -28], 0, false); pata([16, -28], 1.7, false);
  // el cuello y la cabeza, echada hacia atrás (el hocico mira arriba)
  g.save(); g.translate(28, -28); g.rotate(-1.05);
  g.strokeStyle = "#1d4fd8"; g.lineWidth = 5.2; g.lineCap = "round"; g.beginPath(); g.moveTo(-6, 6); g.lineTo(8, -2); g.stroke();
  g.strokeStyle = "#5b8dff"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(-6, 4); g.lineTo(8, -4); g.stroke();
  const cabeza = () => {
    g.beginPath();
    g.moveTo(4, -16); g.bezierCurveTo(16, -22, 30, -16, 40, -6); g.bezierCurveTo(46, -2, 46, 6, 38, 8);
    g.bezierCurveTo(30, 12, 16, 12, 8, 6); g.bezierCurveTo(0, 2, -2, -8, 4, -16); g.closePath();
  };
  cabeza();
  const hg = g.createLinearGradient(0, -20, 0, 12); hg.addColorStop(0, PELO.luz); hg.addColorStop(0.5, PELO.medio); hg.addColorStop(1, PELO.sombra);
  g.fillStyle = hg; g.fill();
  g.save(); cabeza(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.35; g.drawImage(k.manchas, 0, -24, 50, 40); g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  g.restore();
  const ng = g.createRadialGradient(40, -6, 0.4, 42, -4, 5); ng.addColorStop(0, "#5a5a63"); ng.addColorStop(0.4, "#17171b"); ng.addColorStop(1, "#050507");
  g.fillStyle = ng; g.beginPath(); g.ellipse(42, -4, 4, 3.4, 0.4, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(40.5, -5.6, 1.5, 0.8, -0.4, 0, TAU); g.fill();
  const feliz = cab.ojo ?? 1;
  if (feliz > 0.5) { g.strokeStyle = "#2a1408"; g.lineWidth = 1.8; g.beginPath(); g.arc(22, -6, 3.4, Math.PI * 1.15, Math.PI * 1.9); g.stroke(); }
  else {
    g.fillStyle = "#fff6e6"; g.beginPath(); g.ellipse(22, -6, 3.4, 3, 0, 0, TAU); g.fill();
    g.fillStyle = "#3a1d0a"; g.beginPath(); g.arc(23, -6, 2.2, 0, TAU); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(23.6, -6.8, 0.7, 0, TAU); g.fill();
  }
  // la lengua, contento
  if ((cab.abre || 0) > 0.2) {
    const tg = g.createLinearGradient(30, 6, 36, 16); tg.addColorStop(0, "#ff8ea0"); tg.addColorStop(1, "#d64566");
    g.fillStyle = tg; g.beginPath(); g.moveTo(32, 6); g.quadraticCurveTo(40, 12, 36, 18); g.quadraticCurveTo(30, 16, 30, 8); g.fill();
  }
  g.save(); g.translate(10, -12); g.rotate(-0.4 + Math.sin(t * 5) * 0.08);
  g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(8, 2, 12, 14, 6, 24); g.bezierCurveTo(2, 28, -6, 22, -6, 12); g.bezierCurveTo(-6, 4, -2, 0, 0, 0); g.closePath();
  const og = g.createLinearGradient(-6, 0, 8, 24); og.addColorStop(0, PELO.sombra); og.addColorStop(1, PELO.hondo); g.fillStyle = og; g.fill();
  g.restore();
  const narizLocal = [42, -4];
  g.restore();
  g.restore();
  const cs = Math.cos(rock), sn = Math.sin(rock);
  const alMundo = (px, py) => [x + (px * cs - py * sn) * dir * escala, y + (px * sn + py * cs) * escala];
  // la nariz, en el mundo: el giro de la cabeza (−1.05) alrededor del cuello (28, −28)
  const ca = Math.cos(-1.05), sa = Math.sin(-1.05);
  const nx = 28 + narizLocal[0] * ca - narizLocal[1] * sa, ny = -28 + narizLocal[0] * sa + narizLocal[1] * ca;
  return { collar: alMundo(30, -30), nariz: alMundo(nx, ny), ingle: alMundo(0, -20), pata: alMundo(16, -50) };
}
// Un perro grande (tipo labrador), de lado, mirando a la derecha (dir = -1, a la izquierda). Pie en y = 0.
// fase: el ciclo del trote; marcha: 0 quieto, 1 a trote; pitch: se echa adelante; bostezo 0..1 abre la mandíbula; ladra 0..1 abre la boca en un ladrido, con el ojo abierto; lamido 0..1 le pasa la lengua por la trufa; cabeza: { ang (+ baja), abre, ojo (0 abierto, 1 feliz), oreja }
// cola: cuánto la menea. escala: tamaño (1 = el de siempre). pataAlta: 0 en el suelo, 1 la trasera de este lado casi vertical.
// Devuelve collar, nariz, ingle y pata (la trasera de este lado), en el mundo.
export function perro(g, o) {
  if ((o.espalda || 0) > 0.5) return perroEspalda(g, o);
  const { x, y = 0, dir = 1, fase = 0, marcha = 1, pitch = 0, t = 0 } = o, cab = o.cabeza || {}, cola = o.cola ?? 0.4;
  const tuck = Math.min(1, Math.max(0, o.colaTuck || 0));
  const cava = Math.min(1, Math.max(0, o.cava || 0));
  const nb = Math.max(o.cuelloBaja || 0, cava * 0.92);
  const escala = o.escala ?? 1, alta = o.pataAlta || 0;
  const stride = 50 * marcha, lift = 11 * marcha, duty = 0.5, bob = -1.5 * marcha * Math.cos(fase * TAU * 2);
  const sit = Math.min(1, o.sentado || 0), lie = Math.min(1, o.tumbado || 0), pz = Math.max(sit, lie);
  const ag = Math.min(1, Math.max(0, o.agacha || 0));
  const cuerpoY = bob * (1 - pz) * (1 - ag) + 1.4 * alta;
  const rot = (pitch + cava * 0.22) * (1 - sit) - 0.72 * sit - 0.16 * ag;
  const pivB = [-34 * sit - 4 * ag, -40 + 7 * sit + 2 * ag], pivW = [-34 * sit, -40 + 36 * sit + 21 * lie + 8 * ag];
  g.save(); g.translate(x, y); g.scale(dir * escala, escala);
  // la sombra en el suelo
  g.save(); g.globalAlpha = 0.28; g.fillStyle = "#1a2a10"; g.beginPath(); g.ellipse(-10 * sit + 2 * ag, 2, 56 - 14 * sit + 4 * lie + 8 * ag, 7 + 1.5 * ag, 0, 0, TAU); g.fill(); g.restore();
  g.translate(pivW[0], pivW[1]); g.rotate(rot); g.translate(-pivB[0], -pivB[1]);
  g.translate(0, cuerpoY);
  const mundoPunto = (px, py) => { // de las coordenadas del perro al mundo (por si la correa)
    const ex = px - pivB[0], ey = py + cuerpoY - pivB[1], cs = Math.cos(rot), sn = Math.sin(rot);
    return [x + (ex * cs - ey * sn + pivW[0]) * dir * escala, y + (ex * sn + ey * cs + pivW[1]) * escala];
  };
  // de un punto del mundo (relativo al perro, antes de dir) a coordenadas del cuerpo
  const aCuerpo = (wx, wy) => { const ex = wx - pivW[0], ey = wy - pivW[1], cs = Math.cos(rot), sn = Math.sin(rot); return [ex * cs + ey * sn + pivB[0], -ex * sn + ey * cs + pivB[1] - cuerpoY]; };
  const mixP = (a, b) => [a[0] + (b[0] - a[0]) * pz, a[1] + (b[1] - a[1]) * pz];

  const cadera = [-27, -45], hombro = [17, -43];
  const pie = (ph, base, extra = 0) => { const [px, py] = ciclo(ph, duty, stride, lift); return [base + px, py - cuerpoY * 0 - (pitch ? 0 : 0) + extra]; };
  // el pie va al suelo del mundo aunque el cuerpo suba y baje: le restamos el bob y el pitch a la altura
  const alSuelo = (p) => [p[0], p[1] - cuerpoY];
  // el sitio de la pata (zarpa y muñeca/corvejón) en el mundo cuando está sentado o tumbado
  const trasPose = (lejos) => (lie > sit ? { P: [-8 + 4 * lejos, -1.5], H: [-27 + 3 * lejos, -3.5] } : { P: [-6 + 5 * lejos, -1.5], H: [-24 + 5 * lejos, -4] });
  const delPose = (lejos) => (lie > sit ? { P: [47 + 6 * lejos, -1.5], H: [36 + 6 * lejos, -5] } : { P: [3 + 5 * lejos, -1.5], H: [2.5 + 5 * lejos, -11] });
  const luzPata = (curva, w) => { g.save(); g.strokeStyle = "rgba(255,238,196,0.32)"; g.lineWidth = w; g.lineCap = "round"; g.beginPath(); curva.forEach((p, i) => (i ? g.lineTo(p[0] - w * 0.9, p[1] - w * 0.2) : g.moveTo(p[0] - w * 0.9, p[1] - w * 0.2))); g.stroke(); g.restore(); };
  let pataLocal = [-30, 0], pataDel = [28, 0];
  const trasera = (ph, lejos, alza = 0) => {
    let P, K, H;
    if (!lejos && alza > 0.02) {
      // Muslo grueso hacia arriba y adelante, corvejón, y la pata contra el tronco. 1 = bien alta.
      const pose = posePataAlta(alza);
      K = pose.K; H = pose.H; P = pose.P;
    } else {
      const pp = pie(ph, -30); P = alSuelo(pp); H = [P[0] - 4 - 2 * (pp[1] / -(lift || 1) || 0), P[1] - 17];
      if (pz > 0.001) { const q = trasPose(lejos ? 1 : 0); P = mixP(P, aCuerpo(q.P[0], q.P[1])); H = mixP(H, aCuerpo(q.H[0], q.H[1])); }
      if (ag > 0.001 && pz < 0.001) {
        const qP = aCuerpo(2 + (lejos ? 7 : 0), 5), qH = aCuerpo(-14 + (lejos ? 5 : 0), -4);
        P = [mez(P[0], qP[0], ag), mez(P[1], qP[1], ag)];
        H = [mez(H[0], qH[0], ag), mez(H[1], qH[1], ag)];
      }
      K = ik(cadera[0], cadera[1], H[0], H[1], 25, 25, -1);
    }
    if (cava > 0.5 && !(!lejos && alza > 0.02)) {
      P = [-18 + (lejos ? 8 : 0), 1];
      H = [-30 + (lejos ? 5 : 0), -15];
      K = ik(cadera[0], cadera[1], H[0], H[1], 25, 25, -1);
    }
    g.fillStyle = lejos ? PELO.lejos : PELO.medio;
    const punta = !lejos && alza > 0.02 ? P : [P[0] + 0.5, P[1] - 3.5];
    const curva = miembro(g, [[cadera[0] - 1, cadera[1] - 2], K, H, punta], lejos ? [14, 9.5, 6.2, 5.2] : [26, 14, 8, 6.2]);
    g.fillStyle = lejos ? "#c8935a" : PELO.pata;
    g.save(); g.translate(P[0], P[1]);
    if (!lejos && alza > 0.02) g.rotate(posePataAlta(alza).pawAng);
    g.beginPath(); g.ellipse(alza > 0.02 && !lejos ? 5 : 3.5, alza > 0.02 && !lejos ? 0 : -2.6, 7.2, 4.1, 0, 0, TAU); g.fill();
    if (!lejos) {
      g.fillStyle = "#5c3814";
      const pads = alza > 0.02 ? [[7.4, -1.8], [7.6, 1.6], [5.2, -2.6], [5.2, 2.5]] : [[0.5, -3.2], [3.4, -2.2], [5.6, -0.4], [2.2, -0.6]];
      for (const [dx, dy] of pads) { g.beginPath(); g.ellipse(dx, dy, 1.25, 1.55, 0.2, 0, TAU); g.fill(); }
    }
    g.restore();
    if (!lejos) { luzPata(curva.slice(6), 2); pataLocal = P; }
  };
  const delantera = (ph, lejos) => {
    if (cava > 0.5) {
      const u = ((ph % 1) + 1) % 1;
      let px, py;
      if (u < 0.3) {
        const e = u / 0.3;
        px = 20 + 26 * e;
        py = -18 * Math.sin(e * Math.PI);
      } else if (u < 0.68) {
        const e = (u - 0.3) / 0.38;
        px = 46 - 30 * e;
        py = -2;
      } else {
        const e = (u - 0.68) / 0.32;
        px = 16 + 4 * e;
        py = -14 * Math.sin(e * Math.PI);
      }
      const P = [px, py], W = [px - 1, py - 11];
      const E = ik(hombro[0], hombro[1], W[0], W[1], 26, 24, 1);
      g.fillStyle = lejos ? PELO.lejos : PELO.medio;
      const curva = miembro(g, [[hombro[0] + 1, hombro[1] + 1], E, W, [P[0] + 0.3, P[1] - 3.2]], lejos ? [12, 9.5, 6.4, 5.6] : [17, 10.5, 6.6, 5.8]);
      g.fillStyle = lejos ? "#c8935a" : PELO.pata;
      g.beginPath(); g.ellipse(P[0] + 3.2, P[1] - 2.2, 7.2, 3.8, u > 0.28 && u < 0.7 ? 0.35 : -0.2, 0, TAU); g.fill();
      if (!lejos) { luzPata(curva.slice(2), 1.8); pataDel = P; }
      return;
    }
    const pp = pie(ph, 21), P0 = alSuelo(pp), W0 = [P0[0] - 0.5, P0[1] - 10];
    let P = P0, W = W0;
    if (pz > 0.001) { const q = delPose(lejos ? 1 : 0); P = mixP(P0, aCuerpo(q.P[0], q.P[1])); W = mixP(W0, aCuerpo(q.H[0], q.H[1])); }
    if (ag > 0.001 && pz < 0.001) {
      const qP = aCuerpo(20 + (lejos ? 5 : 0), 4.2), qW = aCuerpo(17 + (lejos ? 4 : 0), -14);
      P = [mez(P[0], qP[0], ag), mez(P[1], qP[1], ag)];
      W = [mez(W[0], qW[0], ag), mez(W[1], qW[1], ag)];
    }
    const E = ik(hombro[0], hombro[1], W[0], W[1], 22, 22, 1);
    g.fillStyle = lejos ? PELO.lejos : PELO.medio;
    const curva = miembro(g, [[hombro[0] + 1, hombro[1] + 1], E, W, [P[0] + 0.3, P[1] - 3.5]], lejos ? [12, 9.5, 6.4, 5.6] : [17, 10.5, 6.6, 5.8]);
    g.fillStyle = lejos ? "#c8935a" : PELO.pata; g.beginPath(); g.ellipse(P[0] + 3.6, P[1] - 2.6, 7.4, 4.1, 0, 0, TAU); g.fill();
    if (!lejos) { luzPata(curva.slice(2), 1.8); pataDel = P; }
  };

  // la cola, detrás: una pluma que sube y menea
  { const w = (Math.sin(t * 9) * 10 * cola + Math.sin(t * 4.3) * 3) * (1 - 0.85 * tuck), base = [-36, -53];
    const p1 = [-47 + 6 * ag, -58 - 6 * cola - 22 * ag + 30 * tuck], p2 = [-54 + w * 0.3 + 10 * ag, -57 - 15 + w * 0.6 - 4 * (1 - cola) - 28 * ag + 46 * tuck];
    g.lineCap = "round"; g.lineJoin = "round";
    for (const [col, wd] of [[PELO.sombra, 7.6], [PELO.medio, 6.4], [PELO.luz, 2.2]]) { g.strokeStyle = col; g.lineWidth = wd; g.beginPath(); g.moveTo(base[0], base[1]); g.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); g.stroke(); }
  }
  // las patas de la otra banda, más oscuras
  trasera(fase, true); delantera(fase + 0.5, true);
  // el cuerpo y el cuello
  const cuerpo = () => {
    g.beginPath();
    g.moveTo(10, -61); g.bezierCurveTo(0, -63, -14, -61, -26, -61); g.bezierCurveTo(-35, -60, -41, -53, -40, -45);
    g.bezierCurveTo(-39, -38, -35, -34, -29, -33); g.bezierCurveTo(-18, -32, -8, -24, 6, -23); g.bezierCurveTo(19, -22, 29, -30, 32, -41);
    g.bezierCurveTo(33, -50, 38 + 6 * nb, -58 + 8 * nb, 45 + 16 * nb, -66 + 26 * nb); g.lineTo(38 + 16 * nb, -76 + 30 * nb); g.bezierCurveTo(28 + 8 * nb, -73 + 14 * nb, 19 + 4 * nb, -67 + 4 * nb, 10, -61); g.closePath();
  };
  cuerpo();
  const bg = g.createLinearGradient(0, -66, 0, -25);
  bg.addColorStop(0, PELO.luz); bg.addColorStop(0.32, PELO.medio); bg.addColorStop(0.78, PELO.sombra); bg.addColorStop(1, PELO.hondo);
  g.fillStyle = bg; g.fill();
  g.save(); cuerpo(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.16; g.drawImage(k.manchas, -46, -80, 130, 80);
  g.globalAlpha = 0.14; g.drawImage(k.red, -46, -80, 110, 62);
  g.globalCompositeOperation = "screen"; g.globalAlpha = 0.12; g.drawImage(k.manchas, -30, -72, 100, 60);
  g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  // la luz de arriba en el lomo y la sombra de la barriga
  const lg = g.createLinearGradient(0, -66, 0, -52); lg.addColorStop(0, "rgba(255,244,205,0.7)"); lg.addColorStop(1, "rgba(255,244,205,0)");
  g.fillStyle = lg; g.fillRect(-45, -68, 95, 16);
  const mus = g.createRadialGradient(-30, -50, 2, -29, -46, 19); mus.addColorStop(0, "rgba(255,236,190,0.42)"); mus.addColorStop(1, "rgba(255,236,190,0)");
  g.fillStyle = mus; g.fillRect(-48, -66, 40, 40);
  const pecho = g.createRadialGradient(24, -40, 2, 24, -40, 16); pecho.addColorStop(0, "rgba(255,236,190,0.5)"); pecho.addColorStop(1, "rgba(255,236,190,0)");
  g.fillStyle = pecho; g.fillRect(8, -58, 36, 34);
  g.restore();
  // las patas de esta banda (la trasera de este lado puede ir alta, para marcar)
  trasera(fase + 0.5, false, alta); delantera(fase, false);
  // el collar azul, con su anilla
  g.save(); g.lineCap = "round";
  g.strokeStyle = "#1d4fd8"; g.lineWidth = 5.4; g.beginPath(); g.moveTo(32 + 12 * nb, -71 + 24 * nb); g.lineTo(41 + 14 * nb, -59 + 26 * nb); g.stroke();
  g.strokeStyle = "#5b8dff"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(31.2 + 12 * nb, -71.6 + 24 * nb); g.lineTo(40.2 + 14 * nb, -59.6 + 26 * nb); g.stroke();
  g.strokeStyle = "#e6e9ee"; g.lineWidth = 1.6; g.beginPath(); g.arc(41.2 + 14 * nb, -57.5 + 26 * nb, 2.4, 0, TAU); g.stroke();
  g.restore();
  const collar = mundoPunto(41.2 + 14 * nb, -57.5 + 26 * nb);
  // la cabeza: gira sobre el cuello
  g.save(); g.translate(38 + 16 * nb, -70 + 30 * nb); g.rotate(cab.ang || 0); g.scale(0.8, 0.8);
  const cabeza = () => {
    g.beginPath();
    g.moveTo(6, -18); g.bezierCurveTo(14, -25, 24, -23, 28, -14); g.bezierCurveTo(34, -11, 40, -8, 45, -5);
    g.bezierCurveTo(48, -4, 49, 0, 46, 3); g.bezierCurveTo(44, 6, 36, 7, 30, 7);
    g.bezierCurveTo(24, 12, 14, 14, 6, 10); g.bezierCurveTo(-2, 8, -5, -6, -2, -12); g.closePath();
  };
  // la boca abierta (la lengua colgando) va detrás de la mandíbula. El bostezo se pinta después, encima.
  const bost = Math.max(0, Math.min(1, o.bostezo || 0));
  const ladra = Math.max(0, Math.min(1, o.ladra || 0));
  const lam = Math.max(0, Math.min(1, o.lamido || 0));
  const abre = (cab.abre || 0) * (lam > 0.04 || ladra > 0.04 ? 0 : 1);
  if (abre > 0.02 && bost < 0.04) {
    g.fillStyle = "#4a1c20"; g.beginPath(); g.moveTo(32, 5); g.quadraticCurveTo(38, 5 + 12 * abre, 28, 8 + 14 * abre); g.lineTo(24, 8); g.closePath(); g.fill();
    const tg = g.createLinearGradient(0, 6, 0, 26 * abre + 8); tg.addColorStop(0, "#ff7f93"); tg.addColorStop(1, "#d94a68");
    g.fillStyle = tg; g.beginPath(); g.moveTo(24, 6); g.quadraticCurveTo(26, 6 + 24 * abre, 32, 6 + 22 * abre); g.quadraticCurveTo(38, 6 + 18 * abre, 34, 6); g.closePath(); g.fill();
    g.strokeStyle = "rgba(150,30,60,0.7)"; g.lineWidth = 1; g.beginPath(); g.moveTo(30, 7); g.lineTo(31, 6 + 15 * abre); g.stroke();
  }
  cabeza();
  const hg = g.createLinearGradient(0, -24, 0, 14); hg.addColorStop(0, PELO.luz); hg.addColorStop(0.45, PELO.medio); hg.addColorStop(1, PELO.sombra);
  g.fillStyle = hg; g.fill();
  g.save(); cabeza(); g.clip();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.4; g.drawImage(k.manchas, -6, -26, 60, 44); g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
  const mz = g.createLinearGradient(0, -6, 0, 8); mz.addColorStop(0, "rgba(255,230,180,0)"); mz.addColorStop(1, "rgba(255,230,180,0.5)"); g.fillStyle = mz; g.fillRect(24, -10, 26, 20);
  g.restore();
  // la boca
  if (bost <= 0.04 && ladra < 0.04) {
    g.strokeStyle = "#4a2410"; g.lineWidth = 1.5; g.lineCap = "round"; g.beginPath(); g.moveTo(44.5, 3.5); g.quadraticCurveTo(38, 7 + 2 * abre, 30, 6.4); g.quadraticCurveTo(27, 5.5, 25.6, 2.5); g.stroke();
  }
  // la trufa
  const ng = g.createRadialGradient(44, -5, 0.5, 45, -3, 5.5); ng.addColorStop(0, "#5a5a63"); ng.addColorStop(0.35, "#17171b"); ng.addColorStop(1, "#050507");
  g.fillStyle = ng; g.beginPath(); g.ellipse(45, -2.6, 4.2, 3.7, 0.25, 0, TAU); g.fill();
  g.fillStyle = "rgba(255,255,255,0.75)"; g.beginPath(); g.ellipse(43.8, -4.3, 1.6, 0.9, -0.3, 0, TAU); g.fill();
  { const ab = cab.olfato || 0; g.strokeStyle = "#000"; g.lineWidth = 1.5 + 1.4 * ab; g.lineCap = "round"; g.beginPath(); g.moveTo(46.2, -2.3); g.quadraticCurveTo(45, 0.4 + ab, 43.2, 0.2 + 1.2 * ab); g.stroke(); }
  // el lametón: la lengua sale de la boca, cruza la trufa y vuelve. Todo sale de lamido.
  if (lam > 0.03 && lam < 0.98 && bost < 0.04) {
    const s = Math.sin(lam * Math.PI);
    const tipX = 33 + 15.5 * s, tipY = 5.2 - 10.4 * s;
    const tg = g.createLinearGradient(30, 6, tipX, tipY);
    tg.addColorStop(0, "#d64566"); tg.addColorStop(0.6, "#ff8ea4"); tg.addColorStop(1, "#ffd0d8");
    g.fillStyle = tg;
    g.beginPath();
    g.moveTo(27.5, 4.4);
    g.quadraticCurveTo(32, 2.2 - 3 * s, tipX - 1.4, tipY + 1.5);
    g.quadraticCurveTo(tipX + 2.4, tipY - 0.2, tipX + 0.2, tipY - 2.1);
    g.quadraticCurveTo(34, -1 - 5 * s, 29.5, 2.4);
    g.closePath();
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.7)";
    g.beginPath(); g.ellipse(tipX - 0.6, tipY - 0.3, 1.15 * s + 0.35, 0.62, -0.5, 0, TAU); g.fill();
    g.fillStyle = `rgba(255,255,255,${0.35 + 0.4 * s})`;
    g.beginPath(); g.ellipse(44.2, -4.6, 2.1, 1.05, -0.4, 0, TAU); g.fill();
  }
  // el ojo
  const feliz = cab.ojo || 0;
  if (bost > 0.35) {
    g.fillStyle = PELO.luz; g.beginPath(); g.ellipse(21.2, -7.4, 5.4, 4.4, 0, 0, TAU); g.fill();
    g.strokeStyle = "#2a1408"; g.lineWidth = 1.7; g.beginPath(); g.moveTo(16.8, -7.5); g.quadraticCurveTo(21.2, -4.6 - bost, 25.6, -8); g.stroke();
  } else if (feliz > 0.5) { g.strokeStyle = "#2a1408"; g.lineWidth = 1.8; g.beginPath(); g.arc(21, -7, 3.6, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
  // el bostezo, encima de todo el hocico: un hueco oscuro y la mandíbula solo en el borde
  if (bost > 0.04) {
    const cae = 34 * bost, cx = 33, cy = 1 + cae * 0.48, rx = 14, ry = 4 + cae * 0.5;
    g.fillStyle = "#1a080c"; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0.12, 0, TAU); g.fill();
    g.fillStyle = "#fff6ea"; g.beginPath(); g.moveTo(cx - 7, cy - ry + 1); g.lineTo(cx + 6, cy - ry + 0.4); g.lineTo(cx + 5, cy - ry + 2.4); g.lineTo(cx - 6, cy - ry + 2.6); g.closePath(); g.fill();
    const tg = g.createLinearGradient(cx, cy, cx, cy + ry); tg.addColorStop(0, "#ffb4c0"); tg.addColorStop(1, "#c43858");
    g.fillStyle = tg; g.beginPath(); g.ellipse(cx + 1, cy + ry * 0.28, rx * 0.55, ry * 0.62, 0.1, 0, TAU); g.fill();
    g.strokeStyle = "rgba(255,220,220,0.65)"; g.lineWidth = 0.8; g.beginPath(); g.moveTo(cx, cy); g.quadraticCurveTo(cx + 2, cy + ry * 0.4, cx + 0.5, cy + ry * 0.7); g.stroke();
    g.fillStyle = PELO.medio;
    g.beginPath(); g.ellipse(cx, cy + ry * 0.72, rx + 1.5, ry * 0.55, 0.1, 0.15, Math.PI - 0.15); g.fill();
    const lg = g.createLinearGradient(cx - rx, cy, cx + rx, cy + ry); lg.addColorStop(0, "rgba(255,236,200,0.5)"); lg.addColorStop(1, "rgba(90,40,16,0)");
    g.fillStyle = lg; g.beginPath(); g.ellipse(cx, cy + ry * 0.72, rx + 1.5, ry * 0.55, 0.1, 0.15, Math.PI - 0.15); g.fill();
    g.strokeStyle = "#3a1c10"; g.lineWidth = 1.3; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0.12, 0.15, Math.PI - 0.1); g.stroke();
  }
  else {
    g.fillStyle = "#fff6e6"; g.beginPath(); g.ellipse(21.2, -7.4, 3.6, 3.1, 0, 0, TAU); g.fill();
    g.fillStyle = "#3a1d0a"; g.beginPath(); g.arc(22.2, -7.2, 2.5, 0, TAU); g.fill();
    g.fillStyle = "#08040a"; g.beginPath(); g.arc(22.5, -7.1, 1.4, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,255,255,0.95)"; g.beginPath(); g.arc(23.1, -8.1, 0.8, 0, TAU); g.fill();
    g.strokeStyle = "rgba(90,50,20,0.7)"; g.lineWidth = 1.2; g.beginPath(); g.arc(21.2, -7.4, 3.9, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    if (ladra > 0.04) {
      const cae = 16 * ladra, cx = 34, cy = 3 + cae * 0.42, rx = 10, ry = 2.6 + cae * 0.42;
      g.fillStyle = "#1a080c"; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0.1, 0, TAU); g.fill();
      g.fillStyle = "#fff6ea"; g.beginPath(); g.moveTo(cx - 5, cy - ry + 0.6); g.lineTo(cx + 4.5, cy - ry + 0.3); g.lineTo(cx + 3.6, cy - ry + 2); g.lineTo(cx - 4.2, cy - ry + 2.1); g.closePath(); g.fill();
      const tg = g.createLinearGradient(cx, cy, cx, cy + ry); tg.addColorStop(0, "#ffb4c0"); tg.addColorStop(1, "#c43858");
      g.fillStyle = tg; g.beginPath(); g.ellipse(cx + 0.5, cy + ry * 0.25, rx * 0.45, ry * 0.5, 0.08, 0, TAU); g.fill();
    }
  }
  // la oreja, caída, que se mueve
  const ore = (cab.oreja || 0) + Math.sin(t * 9 + fase * 0) * 0.04 * marcha + marcha * Math.sin(fase * TAU * 2) * 0.1;
  g.save(); g.translate(7, -15); g.rotate(ore - 0.1);
  g.beginPath(); g.moveTo(-2, 1); g.bezierCurveTo(10, -1, 15, 12, 9, 25); g.bezierCurveTo(5, 31, -6, 26, -8, 16); g.bezierCurveTo(-9, 8, -7, 2, -2, 1); g.closePath();
  const og = g.createLinearGradient(-8, 0, 12, 26); og.addColorStop(0, PELO.sombra); og.addColorStop(1, PELO.hondo); g.fillStyle = og; g.fill();
  g.strokeStyle = "rgba(255,220,160,0.4)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-1, 3); g.bezierCurveTo(8, 3, 12, 12, 8, 22); g.stroke();
  g.restore();
  // dónde quedó la punta de la nariz, en el mundo
  const hp = [38 + 16 * nb, -70 + 30 * nb], ca = Math.cos(cab.ang || 0), sa = Math.sin(cab.ang || 0), nl = [46.2 * 0.8, -1.5 * 0.8], nariz = mundoPunto(hp[0] + nl[0] * ca - nl[1] * sa, hp[1] + nl[0] * sa + nl[1] * ca);
  g.restore();
  g.restore();
  return { collar, nariz, ingle: mundoPunto(4, -28), pata: mundoPunto(pataLocal[0], pataLocal[1]), pataDel: mundoPunto(pataDel[0], pataDel[1]) };
}

// ---------------------------------------------------------------- la persona
const GENTE = { piel: "#efb98e", pielSombra: "#cc8f66", pelo: "#3a2417", chaqueta: ["#ff8a6b", "#e8503a", "#a82c20"], vaquero: ["#5a6d94", "#3b4a70", "#222c48"], zapa: "#ffffff", suela: "#d33a34" };
// Una persona de lado mirando a la derecha. fase: ciclo de la marcha; paso: lo largo que es el paso (1 normal, 0 quieta);
// recto 0..1: de pie con las piernas estiradas (si no, anda siempre con las rodillas dobladas); inclina: se echa atrás (negativo) o adelante (positivo) desde la cadera; mano: dónde tiene que llegar la mano de la
// correa (en el mundo); arbol de 0 a 1: le salen hojas y raíces. Devuelve dónde queda la mano de la correa.
export function persona(g, o) {
  const { x, y = 0, dir = 1, fase = 0, paso = 1, inclina = 0, t = 0 } = o, arbol = o.arbol || 0;
  const chaqueta = o.chaqueta || GENTE.chaqueta;
  const pelo = o.pelo || GENTE.pelo;
  const boca = Math.max(0, Math.min(1, o.boca || 0));
  const stride = 92 * paso, lift = 9 * Math.min(1, 0.4 + paso), duty = 0.6, bob = -1.4 * paso * Math.cos(fase * TAU * 2);
  const cadera = [(o.cadX || 0), -92 - 7 * (o.recto || 0) + bob];
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.save(); g.globalAlpha = 0.26; g.fillStyle = "#1a2a10"; g.beginPath(); g.ellipse(cadera[0] + 4 + 20 * Math.sin(-inclina), 2, 40, 6, 0, 0, TAU); g.fill(); g.restore();
  g.lineCap = "round"; g.lineJoin = "round";
  const pierna = (ph, lejos) => {
    const [px, py] = ciclo(ph, duty, stride, lift), pie = [cadera[0] + px + (o.pieX || 0), py], T = [pie[0] - 5, pie[1] - 9];
    const R = ik(cadera[0], cadera[1], T[0], T[1], 46, 46, -1);
    g.fillStyle = lejos ? GENTE.vaquero[2] : GENTE.vaquero[1];
    miembro(g, [[cadera[0] - 1, cadera[1] + 2], R, T], lejos ? [20, 14, 10.5] : [22, 15, 11]);
    // la zapatilla
    const u = Math.max(0, Math.min(1, py / -lift));
    g.save(); g.translate(pie[0] + 3, pie[1] - 5); g.rotate(-0.25 * (u > 0 ? u : 0) + (ph - Math.floor(ph) < 0.08 ? 0.15 : 0));
    g.fillStyle = lejos ? "#b9bcc6" : GENTE.zapa; g.beginPath(); g.moveTo(-9, -3); g.quadraticCurveTo(-9, -8, -2, -9); g.lineTo(4, -7); g.quadraticCurveTo(13, -6, 15, 0); g.lineTo(15, 4); g.lineTo(-9, 4); g.closePath(); g.fill();
    g.fillStyle = lejos ? "#8a2a28" : GENTE.suela; g.fillRect(-9.5, 2.2, 25, 3.2);
    if (!lejos) { g.strokeStyle = "rgba(0,0,0,0.12)"; g.lineWidth = 1; g.beginPath(); g.moveTo(-1, -8); g.lineTo(6, 2); g.stroke(); }
    g.restore();
    if (!lejos) { g.strokeStyle = "rgba(255,255,255,0.18)"; g.lineWidth = 2.6; g.beginPath(); g.moveTo(cadera[0] - 4, cadera[1] + 2); g.lineTo(R[0] - 4, R[1]); g.lineTo(T[0] - 3, T[1] - 2); g.stroke(); }
  };
  pierna(fase, true);
  // el tronco: gira desde la cadera
  g.save(); g.translate(cadera[0], cadera[1] + 6); g.rotate(inclina);
  const hombro = [0, -52], cuello = [2, -58];
  // el brazo de atrás (el que no lleva la correa), balanceándose
  const sw = Math.sin(fase * TAU + Math.PI) * 0.5 * paso, mAtras = [Math.sin(sw) * 34 - 2, -52 + Math.cos(sw) * 40], eAtras = ik(hombro[0], hombro[1], mAtras[0], mAtras[1], 26, 26, 1);
  g.fillStyle = chaqueta[2]; miembro(g, [hombro, eAtras, mAtras], [13, 10.5, 9]);
  g.fillStyle = GENTE.pielSombra; g.beginPath(); g.arc(mAtras[0], mAtras[1] + 3, 5, 0, TAU); g.fill();
  // la chaqueta
  const torso = () => { g.beginPath(); g.moveTo(-10, -56); g.quadraticCurveTo(-14, -26, -12, 4); g.lineTo(12, 4); g.quadraticCurveTo(14, -24, 12, -54); g.quadraticCurveTo(2, -62, -10, -56); g.closePath(); };
  torso();
  const tg = g.createLinearGradient(-14, 0, 14, 0); tg.addColorStop(0, chaqueta[0]); tg.addColorStop(0.5, chaqueta[1]); tg.addColorStop(1, chaqueta[2]);
  g.fillStyle = tg; g.fill();
  g.save(); torso(); g.clip(); g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.14; g.drawImage(k.manchas, -20, -64, 40, 70); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(9, -54); g.quadraticCurveTo(11, -28, 10, 2); g.stroke();
  g.strokeStyle = "rgba(0,0,0,0.25)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-1, -56); g.lineTo(1, 4); g.stroke();
  g.fillStyle = "rgba(0,0,0,0.2)"; g.fillRect(-14, -2, 28, 7);
  g.restore();
  // la capucha, detrás del cuello
  g.fillStyle = chaqueta[2]; g.beginPath(); g.ellipse(-6, -58, 9, 6, -0.3, 0, TAU); g.fill();
  // la cabeza
  g.fillStyle = GENTE.piel; hueso(g, [0, -58], [3, -66], 9, 8);
  g.save(); g.translate(5, -80);
  g.fillStyle = GENTE.piel; g.beginPath(); g.ellipse(0, 0, 10.6, 12, 0, 0, TAU); g.fill();
  const cg = g.createRadialGradient(4, -4, 2, 0, 0, 13); cg.addColorStop(0, "rgba(255,255,255,0.18)"); cg.addColorStop(1, "rgba(120,50,20,0.28)"); g.fillStyle = cg; g.beginPath(); g.ellipse(0, 0, 10.6, 12, 0, 0, TAU); g.fill();
  // la nariz, la boca y el ojo
  g.fillStyle = GENTE.piel; g.beginPath(); g.moveTo(9.6, -2); g.quadraticCurveTo(14.5, 2, 10.5, 4.5); g.closePath(); g.fill();
  if (boca > 0.08) {
    const al = 1.1 + 7.2 * boca;
    g.fillStyle = "#3a1520"; g.beginPath(); g.ellipse(7.4, 6.4, 2.6 + 1.1 * boca, al * 0.55, 0.15, 0, TAU); g.fill();
    g.fillStyle = "#e07080"; g.beginPath(); g.ellipse(7.5, 6.6 + al * 0.28, 1.7, 1.1 + 2.4 * boca, 0.1, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(6.2, 5.2, 1.5, 0.45, -0.2, 0, TAU); g.fill();
  } else {
    g.strokeStyle = "rgba(120,50,30,0.7)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(5.5, 7); g.quadraticCurveTo(8.5, 8.2, 10.2, 6.6); g.stroke();
  }
  if (boca > 0.35) {
    g.strokeStyle = "#2a1a12"; g.lineWidth = 1.5; g.beginPath(); g.moveTo(4.2, -4.6); g.quadraticCurveTo(6.1, -2.8 - 1.6 * boca, 8.4, -4.8); g.stroke();
  } else {
    g.fillStyle = "#2a1a12"; g.beginPath(); g.ellipse(6, -3.4, 1.3, 1.9, 0, 0, TAU); g.fill();
  }
  g.strokeStyle = "#2a1a12"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(3.4, -7); g.lineTo(8.4, -7.4); g.stroke();
  g.fillStyle = GENTE.pielSombra; g.beginPath(); g.ellipse(-4, 1, 2.3, 3.6, 0, 0, TAU); g.fill();
  // el pelo
  g.fillStyle = pelo; g.beginPath(); g.moveTo(-11, 2); g.quadraticCurveTo(-13, -14, -2, -14); g.quadraticCurveTo(10, -16, 11, -6); g.quadraticCurveTo(5, -9, -1, -7); g.quadraticCurveTo(-6, -5, -6, 4); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-8, -9); g.quadraticCurveTo(-1, -14, 7, -11); g.stroke();
  g.restore();
  // el brazo de la correa: extendido hacia la mano que se pide
  const sh = hombro, base = g.getTransform();
  g.restore();
  // (el brazo de la correa se dibuja fuera de la rotación, con la mano ya calculada)
  const mundoHombro = (() => { const cs = Math.cos(inclina), sn = Math.sin(inclina), px = hombro[0], py = hombro[1]; return [cadera[0] + px * cs - py * sn, cadera[1] + 6 + px * sn + py * cs]; })();
  let mano;
  const reposo = [mundoHombro[0] + 22 + 6 * Math.sin(fase * TAU) * paso, mundoHombro[1] + 38 - 4 * Math.cos(fase * TAU * 2) * paso];
  if (o.mano) { const dx = (o.mano[0] - x) * dir - mundoHombro[0], dy = o.mano[1] - y - mundoHombro[1], d = Math.hypot(dx, dy) || 1, q = Math.min(d, 54.5) / d, tira = o.tira ?? 1; mano = [mez(reposo[0], mundoHombro[0] + dx * q, tira), mez(reposo[1], mundoHombro[1] + dy * q, tira)]; }
  else mano = reposo;
  const codo = ik(mundoHombro[0], mundoHombro[1], mano[0], mano[1], 28, 28, 1);
  g.fillStyle = chaqueta[1]; miembro(g, [mundoHombro, codo, mano], [14, 11.5, 9.4]);
  g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 2; g.beginPath(); g.moveTo(mundoHombro[0] + 1, mundoHombro[1] - 2); g.lineTo(codo[0] + 1, codo[1] - 2); g.stroke();
  g.fillStyle = GENTE.piel; g.beginPath(); g.arc(mano[0] + 1, mano[1] + 2, 5.4, 0, TAU); g.fill();
  pierna(fase + 0.5, false);
  // si es un árbol: raíces y hojas
  if (arbol > 0.01) arbolHumano(g, arbol, mundoHombro, mano, cadera, t);
  g.restore();
  return { mano: [x + mano[0] * dir + 1 * dir, y + mano[1] + 2] };
}

// «Quédate quieto como un árbol»: raíces que bajan por los pies y hojas que brotan por los brazos y la cabeza.
function arbolHumano(g, u, hombro, mano, cadera, t) {
  const az = azar(909);
  // raíces
  g.save(); g.strokeStyle = "#6a4224"; g.lineWidth = 5; g.lineCap = "round";
  for (let i = 0; i < 6; i++) { const a = -0.7 + i * 0.5, L = 40 * su(tr(u, 0.0, 0.7)); g.beginPath(); g.moveTo(cadera[0] + (i - 2.5) * 9, 0); g.quadraticCurveTo(cadera[0] + (i - 2.5) * 14, 5 + 6, cadera[0] + (i - 2.5) * 9 + Math.sin(a) * L, 8 + az() * 4); g.stroke(); }
  g.restore();
  const hoja = (px, py, r, col) => { const gr = g.createRadialGradient(px - r * 0.3, py - r * 0.35, 0, px, py, r); gr.addColorStop(0, col[0]); gr.addColorStop(1, col[1]); g.fillStyle = gr; g.beginPath(); g.ellipse(px, py, r, r * 0.74, 0, 0, TAU); g.fill(); };
  const verdes = [["#c8f57a", "#3e9a34"], ["#a4e45a", "#2b7a2a"], ["#8ed64c", "#1f6a28"]];
  const sprouts = [];
  for (let i = 0; i < 22; i++) { const a = az() * TAU, rr = 20 + az() * 30, c0 = az() < 0.5 ? [cadera[0] + 4, -150] : [cadera[0] + 8 + (az() - 0.5) * 20, -120]; sprouts.push([c0[0] + Math.cos(a) * rr, c0[1] + Math.sin(a) * rr * 0.8, 6 + az() * 8, i, az()]); }
  for (let i = 0; i < 10; i++) { const m = i / 9; sprouts.push([mez(hombro[0], mano[0], m) + (az() - 0.5) * 8, mez(hombro[1] + (cadera[1] + 6) * 0, mano[1], m) + cadera[1] * 0 + (az() - 0.5) * 8 - 6 * (1 - m), 6 + az() * 5, 30 + i, az()]); }
  for (const s of sprouts) { const k2 = su(tr(u, 0.1 + s[4] * 0.5, 0.35 + s[4] * 0.6)); if (k2 <= 0.01) continue; hoja(s[0] + Math.sin(t * 2 + s[3]) * 1.2, s[1] + Math.cos(t * 2.3 + s[3]) * 1.2, s[2] * k2, verdes[s[3] % 3]); }
}

// ---------------------------------------------------------------- la correa
// De la mano al collar. tensa de 0 (floja, cuelga) a 1 (recta y vibrando). Devuelve el camino por si se quiere seguir.
export function correa(g, a, b, tensa, t, ancho = 1.9) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, caida = (1 - tensa) * Math.min(L * 0.55, 70) + 0.001;
  const pts = [], N = 36;
  for (let i = 0; i <= N; i++) {
    const u = i / N, x = a[0] + dx * u, y = a[1] + dy * u + caida * 4 * u * (1 - u);
    const vib = tensa * Math.sin(u * Math.PI) * Math.sin(u * 22 - t * 55) * 0.9 * (tensa > 0.7 ? 1 : 0);
    pts.push([x, y + vib]);
  }
  g.save(); g.lineCap = "round"; g.lineJoin = "round";
  const trazo = (col, w, dxo = 0, dyo = 0) => { g.strokeStyle = col; g.lineWidth = w; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0] + dxo, p[1] + dyo) : g.moveTo(p[0] + dxo, p[1] + dyo))); g.stroke(); };
  trazo("rgba(0,0,0,0.18)", ancho * 1.5, 0, 2.5);
  trazo("#143bb0", ancho * 1.3); trazo("#2f6bff", ancho); trazo("rgba(180,210,255,0.8)", ancho * 0.32, 0, -ancho * 0.22);
  // el asa en la mano
  g.strokeStyle = "#143bb0"; g.lineWidth = ancho * 1.1; g.beginPath(); g.ellipse(a[0] + 4, a[1] + 8, 4, 7.5, 0.2, 0, TAU); g.stroke();
  g.restore();
  return pts;
}

// Polvo que sale de las pisadas: puffs en el suelo, cada uno de un momento t0 (en segundos) y un sitio x (cm).
export function polvo(g, t, lista, vida = 0.7) {
  g.save();
  for (const p of lista) {
    const e = t - p.t0; if (e < 0 || e > vida) continue;
    const u = e / vida, r = (6 + 9 * Math.sqrt(u)) * (p.k || 1), al = 0.5 * (1 - u) * (1 - u);
    const gr = g.createRadialGradient(p.x + 6 * u * (p.v || 1), -r * 0.6 - 10 * u, 0, p.x + 6 * u * (p.v || 1), -r * 0.6 - 10 * u, r);
    gr.addColorStop(0, `rgba(238,224,190,${al})`); gr.addColorStop(1, "rgba(238,224,190,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(p.x - 14 * u * (p.v || 1), -r * 0.6 - 10 * u, r, 0, TAU); g.fill();
  }
  g.restore();
}

// ---------------------------------------------------------------- el movimiento de los dos, calculado una vez
// Quién va por delante, a qué velocidad y cuándo se tensa la correa, todo desde t (nada se guarda entre fotogramas).
// vd: la velocidad que quiere llevar el perro [[t, cm/s], ...]; vh: la de la persona. La correa mide SEP: si el perro
// la estira, arrastra a la persona (o, si la persona está anclada en esos segundos, el perro no pasa de ahí).
export function simula({ SEP, x0d, x0h, vd, vh, anclado = [], paddle = [], T = 22 }) {
  const dt = 1 / 240, n = Math.ceil(T / dt) + 2;
  const fv = (keys, t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) if (t <= keys[i + 1][0]) return mez(keys[i][1], keys[i + 1][1], su(tr(t, keys[i][0], keys[i + 1][0])));
    return keys[keys.length - 1][1];
  };
  const en = (rangos, t) => rangos.some(([a, b]) => t >= a && t <= b);
  const XD = new Float32Array(n), XH = new Float32Array(n), PD = new Float32Array(n), PH = new Float32Array(n);
  let d = x0d, h = x0h, pd = 0, ph = 0;
  const polvoLista = [];
  for (let i = 0; i < n; i++) {
    const t = i * dt;
    XD[i] = d; XH[i] = h; PD[i] = pd; PH[i] = ph;
    const d0 = d, h0 = h;
    d += fv(vd, t) * dt; h += fv(vh, t) * dt;
    if (d - h > SEP) { if (en(anclado, t)) d = h + SEP; else h = d - SEP; }
    const vdA = (d - d0) / dt, vhA = (h - h0) / dt;
    pd += (vdA / 100 + (en(paddle, t) ? 2.2 : 0)) * dt; ph += (Math.max(0, vhA) / 153) * dt;
    if (Math.floor(pd) > Math.floor(PD[i]) || Math.floor(pd - 0.5) > Math.floor(PD[i] - 0.5)) { if (vdA > 120) polvoLista.push({ t0: t, x: d + 46 }, { t0: t, x: d - 5, k: 0.8 }); }
  }
  const m = (t) => {
    const f = Math.max(0, Math.min(n - 2, t / dt)), i = Math.floor(f), u = f - i, L = (A) => A[i] + (A[i + 1] - A[i]) * u;
    return { xd: L(XD), xh: L(XH), phD: L(PD), phH: L(PH), vd: (XD[i + 1] - XD[i]) / dt, vh: (XH[i + 1] - XH[i]) / dt };
  };
  m.polvo = polvoLista;
  return m;
}

// ---------------------------------------------------------------- la bombilla
// Una bombilla de dibujo animado sobre (x, y) (la base), de tamaño s; u de 0 (apagada) a 1 (encendida, con rayos).
export function bombilla(g, x, y, s, u, t = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  if (u > 0.02) { k.brillo(g, 0, -20, 130 * (0.6 + 0.4 * u), "amarilla", 0.95 * u); }
  g.lineCap = "round";
  if (u > 0.02) {
    g.strokeStyle = `rgba(255,232,120,${u})`; g.lineWidth = 2.6;
    for (let i = 0; i < 11; i++) { const a = -Math.PI * (0.08 + 0.84 * (i / 10)), r0 = 20, r1 = 20 + 11 * u + 3 * Math.sin(t * 9 + i); g.beginPath(); g.moveTo(Math.cos(a) * r0, -20 + Math.sin(a) * r0); g.lineTo(Math.cos(a) * r1, -20 + Math.sin(a) * r1); g.stroke(); }
  }
  // la rosca de metal
  const mg = g.createLinearGradient(-6, 0, 6, 0); mg.addColorStop(0, "#8d949e"); mg.addColorStop(0.5, "#eef0f4"); mg.addColorStop(1, "#6d737c");
  g.fillStyle = mg; redondo(g, -6, -2, 12, 9, 2); g.fill(); g.fillStyle = "rgba(0,0,0,0.25)"; for (let i = 0; i < 3; i++) g.fillRect(-6, 0 + i * 2.6, 12, 0.8);
  // el cristal
  g.beginPath(); g.moveTo(-5.2, -2); g.bezierCurveTo(-6, -9, -14, -12, -14, -23); g.bezierCurveTo(-14, -34, 14, -34, 14, -23); g.bezierCurveTo(14, -12, 6, -9, 5.2, -2); g.closePath();
  const cg = g.createRadialGradient(-4, -27, 1, 0, -22, 17);
  cg.addColorStop(0, `rgba(${k.mezRgb("255,255,255", "255,252,214", u)},${0.55 + 0.45 * u})`); cg.addColorStop(0.7, `rgba(${k.mezRgb("215,232,248", "255,222,92", u)},${0.35 + 0.6 * u})`); cg.addColorStop(1, `rgba(${k.mezRgb("170,200,230", "255,190,60", u)},${0.5 + 0.45 * u})`);
  g.fillStyle = cg; g.fill(); g.strokeStyle = `rgba(255,255,255,${0.7})`; g.lineWidth = 1.2; g.stroke();
  // el filamento
  g.strokeStyle = u > 0.5 ? `rgba(255,150,40,${u})` : "rgba(120,120,130,0.8)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-3, -4); g.lineTo(-3, -15); g.quadraticCurveTo(-1.5, -19, 0, -15); g.quadraticCurveTo(1.5, -19, 3, -15); g.lineTo(3, -4); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.ellipse(-8, -26, 1.8, 4.2, 0.4, 0, TAU); g.fill();
  g.restore();
}

// Una cifra en su pastilla que salta (pop) en t0 y se queda: x, y en pantalla.
export function pastillaPop(g, t, t0, x, y, principal, unidad, color, tam = 100, hasta = 99) {
  const u = k.entra(tr(t, t0, t0 + 0.22)), sal = 1 - su(tr(t, hasta, hasta + 0.2));
  if (u <= 0 || sal <= 0) return;
  g.save(); sinVista(g);
  g.translate(x, y - 22 * (1 - u)); g.scale(0.7 + 0.3 * u + 0.07 * Math.sin(Math.min(1, (t - t0) / 0.4) * Math.PI), 0.7 + 0.3 * u + 0.07 * Math.sin(Math.min(1, (t - t0) / 0.4) * Math.PI));
  k.pastilla(g, 0, 0, principal, unidad, color, Math.min(1, u * 1.4) * sal, tam);
  g.restore();
}
// Dónde sale en pantalla un punto del mundo.
export const aPantalla = (c, X, Y, f = 1) => { const z = zf(c, f); return [540 + (X - c.cx) * z, 960 + (Y - c.cy) * z]; };

// ---------------------------------------------------------------- el salón (interior de casa)
// El mismo sistema de cámara que el parque: salon(g, c, t, hora) deja el fondo hecho; después ponVista(g, c) y dibujas
// perro/persona en cm del mundo. hora: 0 día, 1 tarde (más cálido). Sofá, ventana con luz, cuadros, lámpara, planta y suelo de madera.
function ventana(g, x, hora) {
  const noche = hora >= 1.5, w = 150, h = 190, y = -300;
  g.save();
  g.fillStyle = noche ? "#d5deee" : "#fff8ee"; k.redondo(g, x - 10, y - 10, w + 20, h + 20, 6); g.fill();
  if (noche) {
    const sg = g.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0, "#070b22"); sg.addColorStop(0.55, "#1a2d6e"); sg.addColorStop(1, "#3d4f92");
    g.fillStyle = sg; g.fillRect(x, y, w, h);
    g.fillStyle = "#fff4c4"; g.beginPath(); g.arc(x + 112, y + 46, 18, 0, TAU); g.fill();
    g.fillStyle = "rgba(255,244,196,0.35)"; g.beginPath(); g.arc(x + 112, y + 46, 28, 0, TAU); g.fill();
    g.fillStyle = "#fff";
    for (const [sx, sy, r] of [[26, 36, 1.7], [48, 78, 1.2], [64, 28, 1.5], [34, 112, 1.1], [86, 96, 1.4], [18, 70, 1]]) { g.beginPath(); g.arc(x + sx, y + sy, r, 0, TAU); g.fill(); }
  } else {
    const sg = g.createLinearGradient(0, y, 0, y + h); sg.addColorStop(0, mezColor("#7cc4ff", "#ffb27a", hora)); sg.addColorStop(1, mezColor("#d9f0ff", "#ffe2b0", hora));
    g.fillStyle = sg; g.fillRect(x, y, w, h);
    g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(x + 40, y + 60, 26, 9, 0, 0, TAU); g.ellipse(x + 62, y + 54, 20, 8, 0, 0, TAU); g.fill();
  }
  g.fillStyle = noche ? "#d5deee" : "#fff8ee"; g.fillRect(x + w / 2 - 3, y, 6, h); g.fillRect(x, y + h / 2 - 3, w, 6);
  // cortinas
  for (const s of [0, 1]) { const cg = g.createLinearGradient(0, 0, 1, 0); const cx = s ? x + w - 4 : x - 36; g.fillStyle = mezColor("#ff9aa2", "#f07a6a", noche ? 1 : hora); k.redondo(g, cx, y - 16, 42, h + 40, 10); g.fill(); g.strokeStyle = "rgba(120,30,30,0.25)"; g.lineWidth = 2; for (let i = 1; i < 4; i++) { g.beginPath(); g.moveTo(cx + i * 10.5, y - 10); g.lineTo(cx + i * 10.5, y + h + 20); g.stroke(); } }
  g.restore();
}
function sofa(g, x) {
  g.save();
  const gr = g.createLinearGradient(0, -130, 0, 0); gr.addColorStop(0, "#43c2b4"); gr.addColorStop(1, "#1e8478");
  g.fillStyle = "#145f56"; k.redondo(g, x + 16, -26, 14, 26, 3); g.fill(); k.redondo(g, x + 244, -26, 14, 26, 3); g.fill();
  g.fillStyle = gr; k.redondo(g, x, -135, 276, 105, 26); g.fill(); // respaldo
  k.redondo(g, x - 4, -86, 46, 74, 18); g.fill(); k.redondo(g, x + 234, -86, 46, 74, 18); g.fill(); // brazos
  const cg = g.createLinearGradient(0, -64, 0, -26); cg.addColorStop(0, "#6fe0d0"); cg.addColorStop(1, "#2aa396");
  g.fillStyle = cg; k.redondo(g, x + 34, -62, 100, 40, 14); g.fill(); k.redondo(g, x + 142, -62, 100, 40, 14); g.fill(); // cojines
  g.fillStyle = "#ff8f6b"; k.redondo(g, x + 52, -112, 46, 46, 12); g.fill();
  g.fillStyle = "rgba(255,255,255,0.18)"; k.redondo(g, x + 8, -128, 262, 10, 5); g.fill();
  g.restore();
}
function lampara(g, x, hora) {
  const noche = hora >= 1.5;
  g.save();
  g.strokeStyle = "#3a3330"; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, -150); g.stroke();
  g.fillStyle = "#3a3330"; g.beginPath(); g.ellipse(x, 0, 18, 5, 0, 0, TAU); g.fill();
  k.brillo(g, x, -170, noche ? 320 : 190, "255,226,160", noche ? 1 : 0.55 + 0.3 * hora);
  g.fillStyle = noche ? "#fff1c4" : "#ffe9b8"; g.beginPath(); g.moveTo(x - 16, -150); g.lineTo(x + 16, -150); g.lineTo(x + 24, -184); g.lineTo(x - 24, -184); g.closePath(); g.fill();
  g.restore();
}
function planta(g, x) {
  g.save();
  g.fillStyle = "#c46a45"; g.beginPath(); g.moveTo(x - 18, -42); g.lineTo(x + 18, -42); g.lineTo(x + 13, 0); g.lineTo(x - 13, 0); g.closePath(); g.fill();
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32, L = 60 + (i % 3) * 14; const gr = g.createLinearGradient(x, -42, x + Math.cos(a) * L, -42 + Math.sin(a) * L); gr.addColorStop(0, "#2e8a3a"); gr.addColorStop(1, "#7fd35a"); g.fillStyle = gr; g.beginPath(); g.ellipse(x + Math.cos(a) * L * 0.5, -42 + Math.sin(a) * L * 0.5, L * 0.5, 9, a, 0, TAU); g.fill(); }
  g.restore();
}
function cuadro(g, x, y, w, h, col) {
  g.save(); g.fillStyle = "#f6efe4"; k.redondo(g, x, y, w, h, 3); g.fill(); g.fillStyle = col[0]; g.fillRect(x + 7, y + 7, w - 14, h - 14);
  g.fillStyle = col[1]; g.beginPath(); g.arc(x + w * 0.62, y + h * 0.42, w * 0.18, 0, TAU); g.fill();
  g.fillStyle = col[2]; g.beginPath(); g.moveTo(x + 7, y + h - 7); g.lineTo(x + w * 0.4, y + h * 0.55); g.lineTo(x + w - 7, y + h - 7); g.closePath(); g.fill();
  g.restore();
}
export function salon(g, c, t, hora = 0) {
  sinVista(g);
  const noche = hora >= 1.5, h = noche ? 0 : Math.max(0, Math.min(1, hora));
  const yS = sueloY(c, 0.78), yF = sueloY(c, 1.5);
  const wg = g.createLinearGradient(0, 0, 0, yS);
  if (noche) { wg.addColorStop(0, "#2a3868"); wg.addColorStop(1, "#161c38"); }
  else { wg.addColorStop(0, mezColor("#f6e3c8", "#f2c9a0", h)); wg.addColorStop(1, mezColor("#e6c39a", "#d9a478", h)); }
  g.fillStyle = wg; g.fillRect(0, 0, 1080, yS + 4);
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.07; g.drawImage(k.manchas, 0, 0, 1080, yS); g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
  // lo de la pared (parallax suave)
  ponVista(g, c, 0.55);
  repite(c, 0.55, 1500, 400, (x0, i) => {
    ventana(g, x0 + 160, noche ? 2 : h);
    cuadro(g, x0 + 520, -330, 70, 90, ["#a8d8f0", "#ffe27a", "#6ab87a"]); cuadro(g, x0 + 610, -300, 52, 66, ["#f4b6c2", "#fff0a0", "#c97a8a"]);
    cuadro(g, x0 + 980, -340, 100, 70, ["#ffd6a0", "#ff8f6b", "#8a5a3a"]);
    // la luz de la ventana cae en el suelo
    g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = noche ? 0.1 : 0.16 + 0.1 * h; const lg = g.createLinearGradient(x0 + 160, -300, x0 + 380, 0); lg.addColorStop(0, noche ? "#b9c8ff" : "#fff2c8"); lg.addColorStop(1, "rgba(255,240,200,0)");
    g.fillStyle = lg; g.beginPath(); g.moveTo(x0 + 160, -300); g.lineTo(x0 + 310, -300); g.lineTo(x0 + 560, 0); g.lineTo(x0 + 300, 0); g.closePath(); g.fill(); g.restore();
  });
  // el rodapié y los muebles, más cerca
  sinVista(g); g.fillStyle = noche ? "#3c4868" : mezColor("#fff6e8", "#f6dcc0", h); g.fillRect(0, yS - 16, 1080, 18);
  ponVista(g, c, 0.78);
  repite(c, 0.78, 1500, 400, (x0, i) => { sofa(g, x0 + 380); lampara(g, x0 + 800, noche ? 2 : h); planta(g, x0 + 90); planta(g, x0 + 1180); });
  // el suelo de madera, en abanico
  sinVista(g);
  const fg = g.createLinearGradient(0, yS, 0, 1920);
  if (noche) { fg.addColorStop(0, "#8a5a34"); fg.addColorStop(0.35, "#5c3a22"); fg.addColorStop(1, "#2c1c10"); }
  else { fg.addColorStop(0, mezColor("#ebc592", "#dba874", h)); fg.addColorStop(0.35, mezColor("#d9a468", "#c98f58", h)); fg.addColorStop(1, mezColor("#a8703f", "#905a32", h)); }
  g.fillStyle = fg; g.fillRect(0, yS, 1080, 1920 - yS);
  g.save(); g.beginPath(); g.rect(0, yS, 1080, 1920 - yS); g.clip();
  g.strokeStyle = "rgba(70,40,15,0.28)"; g.lineWidth = 2.4; g.beginPath();
  const P0 = 38, fa = 0.7, fb = 1.5, zA = zf(c, fa), zB = zf(c, fb), a0 = Math.floor((c.cx - 540 / zA - 80) / P0), a1 = Math.ceil((c.cx + 540 / zA + 80) / P0);
  for (let i = a0; i <= a1; i++) { const X = i * P0; g.moveTo(540 + (X - c.cx) * zA, yS); g.lineTo(540 + (X - c.cx) * zB * 1.9, 1920); }
  g.stroke();
  g.strokeStyle = "rgba(70,40,15,0.2)"; g.beginPath(); for (let j = 0; j < 14; j++) { const y = yS + Math.pow(j / 13, 1.6) * (1920 - yS); g.moveTo(0, y); g.lineTo(1080, y); } g.stroke();
  g.globalCompositeOperation = "multiply"; g.globalAlpha = 0.12; g.drawImage(k.manchas, 0, yS, 1080, 1920 - yS); g.globalAlpha = 0.08; g.drawImage(k.red, 0, yS, 1080, 1920 - yS);
  g.restore();
  // la alfombra, debajo de quien se mueve
  ponVista(g, c, 1);
  repite(c, 1, 900, 300, (x0) => { const ag = g.createLinearGradient(0, 4, 0, 36); ag.addColorStop(0, "#ff8f7a"); ag.addColorStop(1, "#d9604e"); g.fillStyle = ag; g.beginPath(); g.ellipse(x0 + 420, 14, 230, 24, 0, 0, TAU); g.fill(); g.strokeStyle = "rgba(255,240,220,0.7)"; g.lineWidth = 3; g.beginPath(); g.ellipse(x0 + 420, 14, 205, 18, 0, 0, TAU); g.stroke(); });
  sinVista(g);
}

// ---------------------------------------------------------------- el perro DE FRENTE (sentado, mirando a cámara)
// perroFrente(g, { x, y = 0, escala = 1, t, cola, cabeza: { ladea (rad, + a la derecha), abre 0..1 (boca/lengua), ojo 0 abierto..1 feliz, oreja 0..1 (alza), mira (-1..1, pupilas) } })
// Mismo labrador, mismos colores y luz (arriba a la izquierda). Sirve para primeros planos: ladea la cabeza, bosteza, sonríe.
// Pie en y = 0; la cabeza queda a unos 105 cm. Devuelve { cabeza: [x, y] } en el mundo.
export function perroFrente(g, o) {
  const { x, y = 0, escala = 1, t = 0 } = o, cab = o.cabeza || {}, cola = o.cola ?? 0.5;
  const cu = Math.max(0, Math.min(1, o.culpa || 0)), cuO = Math.max(0, Math.min(1, o.culpaOjos ?? cu)), cuE = Math.max(0, Math.min(1, o.culpaOrejas ?? cu)), cuH = Math.max(0, Math.min(1, o.culpaCabeza ?? cu)), lam = Math.max(0, Math.min(1, o.lamido || 0)), ladra = Math.max(0, Math.min(1, o.ladra || 0));
  const ladea = (cab.ladea || 0) + 0.06 * cuH, abre = Math.max(cab.abre || 0, ladra), feliz = cab.ojo || 0, oreja = cab.oreja ?? 0, mira = cab.mira || 0, miraY = (cab.miraY || 0) - 0.95 * cuO;
  const resp = Math.sin(t * 2.1) * 0.8, parp = Math.pow(Math.max(0, Math.sin(t * 1.3 - 1.03)), 140); // respira y parpadea solo
  const lin = (x0, y0, x1, y1, a, b) => { const gr = g.createLinearGradient(x0, y0, x1, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; };
  g.save(); g.translate(x, y); g.scale(escala, escala * (1 - 0.045 * cu));
  // sombra
  g.save(); g.globalAlpha = 0.3; g.fillStyle = "#1a2a10"; g.beginPath(); g.ellipse(2, 2, 52, 8, 0, 0, TAU); g.fill(); g.restore();
  // la cola, a un lado, meneando
  const w = Math.sin(t * 9) * cola;
  g.strokeStyle = PELO.sombra; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); const cl = 1 - 0.7 * cu; g.moveTo(26, -6); g.quadraticCurveTo(46 + 5 * w * cl, -8, 50 + 12 * w * cl - 8 * cu, -30 * cl + 4 * Math.abs(w) * cl - 2 * cu); g.stroke();
  g.strokeStyle = PELO.medio; g.lineWidth = 5; g.beginPath(); g.moveTo(26, -7); g.quadraticCurveTo(46 + 5 * w * cl, -9, 50 + 12 * w * cl - 8 * cu, -31 * cl + 4 * Math.abs(w) * cl - 2 * cu); g.stroke();
  // las ancas (patas traseras dobladas), a los lados
  for (const s of [-1, 1]) {
    g.fillStyle = s < 0 ? lin(-50, -30, -10, 0, PELO.medio, PELO.sombra) : lin(10, -30, 50, 0, PELO.sombra, PELO.hondo);
    g.beginPath(); g.ellipse(s * 28, -16, 23, 17, s * -0.15, 0, TAU); g.fill();
    g.fillStyle = PELO.pata; g.beginPath(); g.ellipse(s * 30, -3, 12, 4.6, 0, 0, TAU); g.fill();
  }
  // el torso
  g.beginPath(); g.moveTo(-17, -78 + resp * 0.3); g.bezierCurveTo(-27, -60, -30, -34, -22, -4); g.lineTo(22, -4); g.bezierCurveTo(30, -34, 27, -60, 17, -78 + resp * 0.3); g.closePath();
  const tg = g.createLinearGradient(-30, 0, 30, 0); tg.addColorStop(0, PELO.luz); tg.addColorStop(0.45, PELO.medio); tg.addColorStop(1, PELO.sombra); g.fillStyle = tg; g.fill();
  // el pecho claro
  g.fillStyle = "rgba(251,226,170,0.55)"; g.beginPath(); g.ellipse(-2, -50 + resp, 14, 24, 0, 0, TAU); g.fill();
  // patas delanteras
  for (const s of [-1, 1]) {
    const px = s * 11.5; g.fillStyle = s < 0 ? lin(px - 7, 0, px + 7, 0, PELO.luz, PELO.medio) : lin(px - 7, 0, px + 7, 0, PELO.medio, PELO.sombra);
    redondo(g, px - 7, -44, 14, 42, 6.5); g.fill();
    g.fillStyle = PELO.pata; g.beginPath(); g.ellipse(px, -3, 9.5, 5.2, 0, 0, TAU); g.fill();
    g.strokeStyle = "rgba(109,65,25,0.45)"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(px - 3, -6); g.lineTo(px - 3, -1.5); g.moveTo(px + 3, -6); g.lineTo(px + 3, -1.5); g.stroke();
  }
  // collar
  g.strokeStyle = "#1f4fd8"; g.lineWidth = 6; g.beginPath(); g.moveTo(-16, -76); g.quadraticCurveTo(0, -66, 16, -76); g.stroke();
  g.strokeStyle = "rgba(160,200,255,0.6)"; g.lineWidth = 1.6; g.beginPath(); g.moveTo(-15, -78); g.quadraticCurveTo(0, -68.5, 15, -78); g.stroke();
  g.fillStyle = "#f5c53a"; g.beginPath(); g.arc(1, -64, 4.2, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.arc(-0.2, -65.4, 1.4, 0, TAU); g.fill();
  // la cabeza (gira un poco desde el cuello)
  g.translate(0, -76 + resp * 0.4); g.rotate(ladea); g.translate(0, 76 - resp * 0.4 + 7 * cuH);
  const cy = -98;
  // orejas caídas (detrás del cráneo)
  for (const s of [-1, 1]) {
    const alz = oreja * 10 - 9 * cuE, fuera = 5 * cuE;
    g.fillStyle = s < 0 ? lin(-34, cy, -14, cy, PELO.sombra, PELO.medio) : lin(14, cy, 34, cy, PELO.medio, PELO.hondo);
    g.beginPath(); g.moveTo(s * 13, cy - 14); g.bezierCurveTo(s * (28 + fuera), cy - 17 - alz, s * (36 + fuera), cy - 4 - alz * 0.6, s * (32 + fuera * 1.4), cy + 12 - alz * 0.3 + 5 * cuE); g.bezierCurveTo(s * (29 + fuera), cy + 22 - alz * 0.2 + 5 * cuE, s * 19, cy + 18, s * 15, cy + 6); g.closePath(); g.fill();
  }
  // el cráneo
  const hg = g.createRadialGradient(-8, cy - 10, 4, 0, cy, 30); hg.addColorStop(0, PELO.luz); hg.addColorStop(0.6, PELO.medio); hg.addColorStop(1, PELO.sombra);
  g.fillStyle = hg; g.beginPath(); g.ellipse(0, cy, 22, 20, 0, 0, TAU); g.fill();
  // la franja clara de la frente al hocico
  g.fillStyle = "rgba(251,226,170,0.45)"; g.beginPath(); g.moveTo(-4, cy - 18); g.quadraticCurveTo(0, cy - 4, -7, cy + 6); g.lineTo(7, cy + 6); g.quadraticCurveTo(0, cy - 4, 4, cy - 18); g.closePath(); g.fill();
  // el hocico
  const my = cy + 9;
  g.fillStyle = lin(-12, my - 8, 12, my + 10, "#fbe3b5", "#e6bd80"); g.beginPath(); g.ellipse(0, my, 12.5, 10.5, 0, 0, TAU); g.fill();
  if (abre > 0.02) { // boca abierta. ladra la abre más, como un ladrido, sin entornar el ojo.
    const bo = abre * (ladra > 0.04 ? 16 : 9);
    g.fillStyle = "#4a1420"; g.beginPath(); g.ellipse(0, my + 6 + bo * 0.35, 8 + abre * 1.5, 2.6 + bo * 0.8, 0, 0, TAU); g.fill();
    g.fillStyle = "#ee6c86"; g.beginPath(); g.ellipse(0, my + 8 + bo * 0.7, 5.5, 1.6 + bo * 0.5, 0, 0, TAU); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.moveTo(-6, my + 4.5); g.lineTo(-4, my + 4.5); g.lineTo(-5, my + 8); g.closePath(); g.moveTo(6, my + 4.5); g.lineTo(4, my + 4.5); g.lineTo(5, my + 8); g.closePath(); g.fill();
  } else { // la sonrisa
    g.strokeStyle = PELO.hondo; g.lineWidth = 1.6; g.lineCap = "round"; g.beginPath(); g.moveTo(0, my + 2); g.lineTo(0, my + 6); g.moveTo(-9, my + 4.5 + 3.4 * cu); g.quadraticCurveTo(-4, my + 9 - 3.5 * cu, 0, my + 6); g.quadraticCurveTo(4, my + 9 - 3.5 * cu, 9, my + 4.5 + 3.4 * cu); g.stroke();
    if (lam > 0.02) { const lx = 4.5 * Math.sin(lam * Math.PI * 2.4), ly = my + 5 + 3 * Math.sin(lam * Math.PI), la = Math.sin(lam * Math.PI); g.fillStyle = "#ee6c86"; g.beginPath(); g.ellipse(lx, ly + 1.5 * la, 3.4, 2 + 3 * la, 0, 0, TAU); g.fill(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(lx - 1, ly + 0.2 * la, 1, 0.7, 0, 0, TAU); g.fill(); }
  }
  // la trufa
  g.fillStyle = "#231a1c"; g.beginPath(); g.moveTo(-6.4, my - 5.4); g.quadraticCurveTo(0, my - 8.6, 6.4, my - 5.4); g.quadraticCurveTo(6.2, my - 0.6, 0, my + 1.6); g.quadraticCurveTo(-6.2, my - 0.6, -6.4, my - 5.4); g.fill();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.ellipse(-2.2, my - 5.2, 2.4, 1.1, -0.15, 0, TAU); g.fill();
  // los ojos
  for (const s of [-1, 1]) {
    const ex = s * 9.5, ey = cy - 3;
    g.fillStyle = "rgba(109,65,25," + (0.5 + 0.3 * cuO) + ")"; g.beginPath(); g.ellipse(ex, ey - 6 - 1.8 * cuO, 4.4 + 0.6 * cuO, 1.6 + 0.5 * cuO, s * (0.2 + 0.55 * cuO), 0, TAU); g.fill(); // la ceja
    if (feliz > 0.5 || parp > 0.5) { g.strokeStyle = "#231a1c"; g.lineWidth = 2; g.lineCap = "round"; g.beginPath(); g.arc(ex, ey + (feliz > 0.5 ? 1.5 : 0), 3.6, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); continue; }
    const iy = ey + 0.2 + miraY * 1.3;
    g.fillStyle = "#fffaf0"; g.beginPath(); g.ellipse(ex, ey, 4.4 + 0.5 * cuO, 3.9 + 0.3 * cuO, 0, 0, TAU); g.fill();
    g.fillStyle = "#6a3b14"; g.beginPath(); g.arc(ex + mira * 1.2, iy, 3, 0, TAU); g.fill();
    g.fillStyle = "#14100f"; g.beginPath(); g.arc(ex + mira * 1.4, iy, 1.7, 0, TAU); g.fill();
    g.fillStyle = "#fff"; g.beginPath(); g.arc(ex + mira * 1.2 - 1, iy - 1.3, 1, 0, TAU); g.fill();
  }
  g.restore();
  return { cabeza: [x, y - 98 * escala] };
}
