#!/usr/bin/env node
// publicar.mjs: sube un vídeo terminado a Zernio y lo programa en TikTok, Instagram Reels y YouTube Shorts.
// Un vídeo cada `horas` (12) horas: el siguiente va a las 12 h del último programado.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";
import { RAIZ, argumentos, ayuda, fallo } from "./lib/comun.mjs";

ayuda(`
publicar.mjs: publica en Zernio (TikTok, Instagram Reels, YouTube Shorts) el vídeo de salida/.

  node motor/publicar.mjs cuentas                 lista las cuentas conectadas en Zernio
  node motor/publicar.mjs <vídeo> [--prueba]      programa el vídeo (nombre de salida/<vídeo>, o la carpeta)
  node motor/publicar.mjs <vídeo> --perfil perros  lo programa en las cuentas y el ritmo de zernio.json → perfiles.perros
  node motor/publicar.mjs configurar              guarda en zernio.json las cuentas del perfil «reels-explicativos»
  node motor/publicar.mjs estado                  muestra lo programado y lo publicado

Opciones:
  --prueba     solo valida con Zernio, no publica nada
  --otra-vez   permite publicar un vídeo que ya se publicó

Las cuentas a usar están en zernio.json; la clave, en .env.local (ZERNIO_API_KEY).
Lo programado se apunta en publicados.json.
`);

const API = "https://zernio.com/api/v1";
// --perfil <nombre>: otras cuentas y otro ritmo (zernio.json → perfiles), con su propia lista publicados-<nombre>.json.
const PERFIL = (() => { const i = process.argv.indexOf("--perfil"); return i > 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : null; })();
const PUBLICADOS = join(RAIZ, PERFIL ? `publicados-${PERFIL}.json` : "publicados.json");
const CONFIG = join(RAIZ, "zernio.json");

function clave() {
  const f = join(RAIZ, ".env.local");
  const m = existsSync(f) && readFileSync(f, "utf8").match(/^ZERNIO_API_KEY=(\S+)/m);
  if (!m) fallo("Falta la clave de Zernio. Ejecuta: node motor/clave.mjs --zernio");
  return m[1];
}
const KEY = clave();

async function zernio(metodo, ruta, cuerpo, cabeceras = {}) {
  const r = await fetch(API + ruta, {
    method: metodo,
    headers: { Authorization: `Bearer ${KEY}`, ...(cuerpo ? { "content-type": "application/json" } : {}), ...cabeceras },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch { j = { raw: t }; }
  if (!r.ok) fallo(`Zernio ${metodo} ${ruta} → ${r.status}: ${j.error || j.message || t.slice(0, 300)}`);
  return j;
}

const leer = (f, defecto) => (existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : defecto);
const { sueltos, op } = argumentos();
const orden = sueltos[0];

if (orden === "cuentas") {
  const { accounts } = await zernio("GET", "/accounts");
  for (const a of accounts) console.log(`${a.platform.padEnd(10)} ${a._id}  @${a.username || a.displayName}  ${a.isActive ? "" : "(inactiva)"}`);
  process.exit(0);
}

if (orden === "configurar") {
  const { accounts } = await zernio("GET", "/accounts");
  const mias = accounts.filter((a) => a.isActive && a.profileId?.name === "reels-explicativos");
  const cuentas = {};
  for (const pl of ["tiktok", "instagram", "youtube"]) {
    const c = mias.filter((a) => a.platform === pl);
    if (c.length > 1) fallo(`Hay ${c.length} cuentas de ${pl} en el perfil reels-explicativos; deja solo una.`);
    if (c[0]) { cuentas[pl] = c[0]._id; console.log(`${pl}: @${c[0].username || c[0].displayName}`); }
    else console.log(`${pl}: sin conectar`);
  }
  const previo = leer(CONFIG, {});
  writeFileSync(CONFIG, JSON.stringify({ zona: "Europe/Madrid", horas: 12, ...previo, cuentas }, null, 2) + "\n");
  process.exit(0);
}

if (orden === "estado") {
  const p = leer(PUBLICADOS, []);
  if (!p.length) console.log("Nada programado todavía.");
  for (const e of p) console.log(`${e.programadoPara}  ${e.video}  ${e.postId}`);
  process.exit(0);
}

if (!orden) fallo("Falta el vídeo. Uso: node motor/publicar.mjs <vídeo> (o --ayuda)");

// ---- el vídeo
const carpeta = [resolve(orden), join(RAIZ, "salida", orden)].find((c) => existsSync(c) && statSync(c).isDirectory());
if (!carpeta) fallo(`No encuentro salida/${orden}`);
const nombre = basename(carpeta);
const mp4 = readdirSync(carpeta).find((f) => f.endsWith(".mp4"));
if (!mp4) fallo(`No hay .mp4 en ${carpeta}. ¿Se ha hecho el render?`);
const portada = existsSync(join(carpeta, "portada.jpg")) ? join(carpeta, "portada.jpg") : null;
const capFile = join(carpeta, "caption.txt");
if (!existsSync(capFile)) fallo(`Falta ${capFile}`);
const caption = readFileSync(capFile, "utf8").trim();
if (!/#\p{L}/u.test(caption)) fallo("El caption.txt no tiene hashtags. Añádelos al final y vuelve a lanzar.");

// ---- las cuentas
const cfgBase = leer(CONFIG, null);
let cfg = cfgBase;
if (PERFIL) {
  const pf = cfgBase?.perfiles?.[PERFIL];
  if (!pf?.cuentas) fallo(`No hay perfil «${PERFIL}» en zernio.json.`);
  cfg = { zona: cfgBase.zona, horas: pf.horas ?? cfgBase.horas, cuentas: pf.cuentas };
}
if (!cfg?.cuentas || !Object.keys(cfg.cuentas).length) fallo("Falta zernio.json con las cuentas. Mira: node motor/publicar.mjs cuentas");
const horas = cfg.horas ?? 12, zona = cfg.zona ?? "Europe/Madrid";

// ---- no repetir
const hechos = leer(PUBLICADOS, []);
if (hechos.some((e) => e.video === nombre) && !op["otra-vez"]) fallo(`«${nombre}» ya está programado o publicado (publicados.json). Con --otra-vez se repite.`);

// ---- cuándo: 12 h después del último programado; si ya pasó, ahora
const ahora = Date.now();
const ultimo = Math.max(0, ...hechos.map((e) => Date.parse(e.programadoPara)));
const cuando = Math.max(ahora + 2 * 60_000, ultimo ? ultimo + horas * 3600_000 : 0);
const ya = cuando <= ahora + 3 * 60_000;
const hora = (t) => new Date(t).toLocaleString("es-ES", { timeZone: zona, dateStyle: "short", timeStyle: "short" });

// ---- texto por red
const titulo = caption.split("\n")[0].replace(/#\S+/g, "").trim().slice(0, 100) || nombre.slice(0, 100);
const textoYT = /#shorts/i.test(caption) ? caption : `${caption}\n#Shorts`;

const plataformas = [];
if (cfg.cuentas.tiktok) plataformas.push({ platform: "tiktok", accountId: cfg.cuentas.tiktok });
if (cfg.cuentas.instagram) plataformas.push({ platform: "instagram", accountId: cfg.cuentas.instagram });
if (cfg.cuentas.youtube) plataformas.push({ platform: "youtube", accountId: cfg.cuentas.youtube, platformSpecificData: { title: titulo, visibility: "public", madeForKids: false } });

// ---- subir los archivos a Zernio
async function subir(ruta, tipo) {
  const buf = readFileSync(ruta);
  const p = await zernio("POST", "/media/presign", { filename: basename(ruta), contentType: tipo, size: buf.length });
  const r = await fetch(p.uploadUrl, { method: "PUT", headers: { "Content-Type": tipo }, body: buf });
  if (!r.ok) fallo(`No se pudo subir ${basename(ruta)} (${r.status})`);
  return p.publicUrl;
}

const cuerpoBase = (urlVideo, urlPortada) => ({
  content: caption,
  mediaItems: [{ type: "video", url: urlVideo }],
  platforms: plataformas.map((p) => {
    if (p.platform === "instagram" && urlPortada) return { ...p, platformSpecificData: { instagramThumbnail: urlPortada, shareToFeed: true } };
    if (p.platform === "youtube") return { ...p, platformSpecificData: { ...p.platformSpecificData } };
    return p;
  }),
  tiktokSettings: { privacy_level: "PUBLIC_TO_EVERYONE", allow_comment: true, allow_duet: true, allow_stitch: true, content_preview_confirmed: true, express_consent_given: true },
});

// YouTube lee la descripción de `content`; con #Shorts dentro. TikTok e Instagram, el caption tal cual.
function cuerpoFinal(urlVideo, urlPortada) {
  const b = cuerpoBase(urlVideo, urlPortada);
  // Si el texto de YouTube difiere (añade #Shorts), se manda su propio contenido.
  if (textoYT !== caption) b.platforms = b.platforms.map((p) => (p.platform === "youtube" ? { ...p, customContent: textoYT } : p));
  return b;
}

if (op.prueba) {
  const b = cuerpoFinal("https://media.zernio.com/temp/prueba.mp4", null);
  const v = await zernio("POST", "/tools/validate/post", b);
  console.log(`prueba: ${plataformas.map((p) => p.platform).join(", ")} → ${v.valid === false ? "NO válido" : "válido"}`);
  for (const e of v.errors || []) console.log(`  ✗ ${e.platform}: ${e.error}`);
  for (const w of v.warnings || []) console.log(`  ! ${w.platform}: ${w.warning}`);
  console.log(`saldría: ${ya ? "ahora" : hora(cuando)} (${zona})`);
  process.exit(v.valid === false ? 1 : 0);
}

console.log(`subiendo ${mp4}…`);
const urlVideo = await subir(join(carpeta, mp4), "video/mp4");
const urlPortada = portada ? await subir(portada, "image/jpeg") : null;

const cuerpo = cuerpoFinal(urlVideo, urlPortada);
if (ya) cuerpo.publishNow = true;
else { cuerpo.scheduledFor = new Date(cuando).toISOString(); cuerpo.timezone = zona; }

const res = await zernio("POST", "/posts", cuerpo, { "x-request-id": `reels-${nombre}`.slice(0, 120) });
const post = res.post;
hechos.push({ video: nombre, postId: post._id, programadoPara: new Date(ya ? ahora : cuando).toISOString() });
writeFileSync(PUBLICADOS, JSON.stringify(hechos, null, 2) + "\n");

console.log(ya ? "publicado ahora" : `programado para ${hora(cuando)} (${zona})`);
for (const p of post.platforms || []) console.log(`  ${p.platform}: ${p.status}${p.platformPostUrl ? " " + p.platformPostUrl : ""}${p.error ? " ✗ " + p.error : ""}`);
