// El teletexto: una pantalla negra de 40 × 25 casillas, letras de píxeles, bloques de color y, abajo, los cuatro
// enlaces de colores. Todo se dibuja en un rectángulo de w × h con la esquina arriba a la izquierda en (0,0).
import * as k from "#kit";

const { lienzo } = k;

// Los ocho colores del teletexto (suavizados para que no quemen).
export const C = {
  N: [0, 0, 0], R: [255, 59, 59], G: [43, 255, 94], Y: [255, 230, 43], B: [59, 91, 255], M: [255, 59, 216], C: [43, 233, 255], W: [255, 255, 255],
};
export const css = (c, a = 1) => `rgba(${C[c][0]},${C[c][1]},${C[c][2]},${a})`;
export const COLS = 40, ROWS = 25;

// Un glifo de píxeles: la letra se dibuja pequeña y se endurece, para que se vea como de pantalla antigua.
const cache = new Map();
function glifo(ch, c) {
  const key = ch + c; if (cache.has(key)) return cache.get(key);
  const W = 10, H = 14, cv = lienzo(W, H), x = cv.getContext("2d");
  x.font = "800 12px Figtree"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillStyle = "#fff"; x.fillText(ch, W / 2, H / 2 + 0.5);
  const im = x.getImageData(0, 0, W, H);
  for (let i = 0; i < W * H; i++) { const a = im.data[i * 4 + 3]; im.data[i * 4] = C[c][0]; im.data[i * 4 + 1] = C[c][1]; im.data[i * 4 + 2] = C[c][2]; im.data[i * 4 + 3] = a > 105 ? 255 : 0; }
  x.putImageData(im, 0, 0); cache.set(key, cv); return cv;
}
// Texto en casillas: columna, fila, color. dbl: letra el doble de alta.
export function texto(g, s, col, fila, cw, ch, c = "W", dbl = false) {
  g.save(); g.imageSmoothingEnabled = false;
  for (let i = 0; i < s.length; i++) { const e = s[i]; if (e === " ") continue; g.drawImage(glifo(e, c), (col + i) * cw, fila * ch, cw * 1.04, ch * (dbl ? 2 : 1) * 1.02); }
  g.restore();
}
// Bloques de color: cada letra del dibujo es un trozo de media casilla de ancho y un tercio de alto.
export function bloques(g, arte, col, fila, cw, ch) {
  arte.forEach((linea, j) => { for (let i = 0; i < linea.length; i++) { const e = linea[i]; if (e === " " || !C[e]) continue; g.fillStyle = css(e); g.fillRect(col * cw + i * cw / 2, fila * ch + j * ch / 3, cw / 2 + 0.6, ch / 3 + 0.6); } });
}

// Los cuatro enlaces de abajo: una barra por color.
export const ENLACES = [["R", "NOTICIAS"], ["G", "TIEMPO"], ["Y", "DEPORTES"], ["B", "LOTERIA"]];
export function enlaces(g, w, ch, cw, al = [1, 1, 1, 1], lit = [0, 0, 0, 0], desfase = [0, 0, 0, 0]) {
  ENLACES.forEach(([c, nom], i) => {
    if (al[i] <= 0.01) return;
    const x = i * 10 * cw + cw * 0.3, y = 24 * ch + desfase[i], ww = 10 * cw - cw * 0.6;
    g.save(); g.globalAlpha = al[i];
    g.fillStyle = css(c); g.fillRect(x, y, ww, ch);
    if (lit[i] > 0.01) { g.fillStyle = `rgba(255,255,255,${0.7 * lit[i]})`; g.fillRect(x, y, ww, ch); }
    g.restore();
    g.save(); g.globalAlpha = al[i]; texto(g, nom, i * 10 + Math.floor((10 - nom.length) / 2), 24, cw, ch, "N"); g.restore();
  });
}

// La cabecera: página a la izquierda y nombre a la derecha. cuenta: lo que va corriendo arriba mientras se espera.
export function cabecera(g, cw, ch, pag, nombre, cuenta = null) {
  texto(g, cuenta ?? pag, 0, 0, cw, ch, "W");
  texto(g, nombre, 9, 0, cw, ch, "C");
  texto(g, "20 OCT", 33, 0, cw, ch, "W");
}

// Una página. def: { pag, nombre, cuerpo: (g, cw, ch) => void }
export function pagina(g, w, h, def, o = {}) {
  const { cuenta = null, enl = [1, 1, 1, 1], lit = [0, 0, 0, 0], desfase = [0, 0, 0, 0], sinCabecera = false } = o;
  const cw = w / COLS, ch = h / ROWS;
  g.fillStyle = "#000"; g.fillRect(0, 0, w, h);
  if (!sinCabecera) cabecera(g, cw, ch, def.pag, def.nombre, cuenta);
  def.cuerpo?.(g, cw, ch, o);
  enlaces(g, w, ch, cw, enl, lit, desfase);
}

// ---------------------------------------------------------------- las páginas del vídeo
const SOL = [
  "      YYYY      ",
  "   Y  YYYY  Y   ",
  "     YYYYYY     ",
  " Y  YYYYYYYY  Y ",
  "   YYYYYYYYYY   ",
  "YY YYYYYYYYYY YY",
  "   YYYYYYYYYY   ",
  " Y  YYYYYYYY  Y ",
  "     YYYYYY     ",
  "   Y  YYYY  Y   ",
  "      YYYY      ",
];
const NUBE = [
  "    WWWW        ",
  "  WWWWWWWW  WW  ",
  " WWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWW",
  " WWWWWWWWWWWWWW ",
];
export const PAG = {
  indice: {
    pag: "P100", nombre: "TELETEXTO",
    cuerpo: (g, cw, ch) => {
      texto(g, "TELETEXTO", 6, 3, cw, ch, "C", true);
      [["NOTICIAS", "101", "W"], ["DEPORTES", "200", "Y"], ["TIEMPO", "300", "G"], ["LOTERIA", "400", "M"]].forEach(([n, p, c], i) => { texto(g, n, 4, 8 + i * 2, cw, ch, c); texto(g, ".".repeat(24 - n.length), 4 + n.length, 8 + i * 2, cw, ch, "B"); texto(g, p, 32, 8 + i * 2, cw, ch, c); });
      texto(g, "ELIGE UN NUMERO", 12, 18, cw, ch, "W");
    },
  },
  noticias: {
    pag: "P101", nombre: "NOTICIAS",
    cuerpo: (g, cw, ch) => {
      texto(g, "ULTIMA HORA", 3, 3, cw, ch, "Y", true);
      const barras = [[5, 30, "W"], [5, 24, "W"], [5, 33, "W"], [5, 20, "W"]];
      barras.forEach(([c0, ln, col], i) => { g.fillStyle = css(col, 0.9); g.fillRect((c0 - 2) * cw, (8 + i * 2) * ch + ch * 0.25, ln * cw, ch * 0.5); });
      bloques(g, ["RRRRRRRRRRRRRRRR", "RRRRRRRRRRRRRRRR", "RRRRRRRRRRRRRRRR", "RRRRRRRRRRRRRRRR"], 3, 17, cw, ch);
      bloques(g, ["YYYYYYYYYYYYYYYY", "YYYYYYYYYYYYYYYY", "YYYYYYYYYYYYYYYY", "YYYYYYYYYYYYYYYY"], 11, 17, cw, ch);
      bloques(g, ["RRRRRRRRRRRRRRRR", "RRRRRRRRRRRRRRRR", "RRRRRRRRRRRRRRRR", "RRRRRRRRRRRRRRRR"], 19, 17, cw, ch);
    },
  },
  tiempo: {
    pag: "P300", nombre: "TIEMPO",
    cuerpo: (g, cw, ch, o = {}) => {
      texto(g, "HOY HACE SOL", 3, 3, cw, ch, "G", true);
      bloques(g, SOL, 1.5, 3.6, cw * 2, ch * 2); bloques(g, NUBE, (21 + (o.nubeOff ?? 0)) / 2, 5.4, cw * 2, ch * 2);
      texto(g, "24", 8, 16, cw, ch, "Y", true); texto(g, "GRADOS", 12, 17, cw, ch, "W");
    },
  },
};
