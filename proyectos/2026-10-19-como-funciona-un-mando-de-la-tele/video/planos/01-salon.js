// «¿Cómo sabe la tele qué botón pulsas, si entre los dos no hay ningún cable?» y «Porque el mando le habla con una
// luz que tus ojos no pueden ver.»
// El salón de noche, con una sola cámara.
// - Fotograma 0: el botón rojo enorme; la cámara sale disparada hacia atrás y aparece el mando entero, con la tele
//   apagada arriba. «pulsas»: el botón se hunde y la tele se enciende con un golpe de luz.
// - «entre los dos»: un cable va del mando a la tele; «ningún cable»: se parte por en medio y las dos mitades caen.
// - «Porque el mando le habla»: la cámara se acerca a la punta; «luz»: salen destellos morados hacia la tele;
//   «no pueden ver»: se vuelven transparentes, solo un temblor del aire, y la tele cambia de canal igual.
import * as k from "#kit";
import { v } from "#voz";
import { CAM0, MANDO, enMando, mando, mezCam, ojito, pr, punta, salon, destello, velo } from "../mundo.js";

export const desde = 0;

const { suave: su, tramo: tr, mez, entra } = k;
const f1 = v.frase(1), f2 = v.frase(2);
const Tpul = f1.t("pulsas"), Tent = f1.t("entre"), Tnin = f1.t("ningun"), Fin1 = f1.fin;
const Thab = f2.t("habla"), Tluz = f2.t("luz"), Tno = f2.t("no"), Tver = f2.t("ver"), Fin2 = f2.fin;
export const enciende = Tpul + 0.08;
export const parte = Tnin + 0.02;
const Tcanal = Tver - 0.1;

// la cámara: pegada al botón rojo → el salón entero → más cerca de la punta
const BOT = enMando(-32, 46);
const sCerca = 14, sLejos = 10 / (MANDO.Z - CAM0.z);
const CERCA_P = { x: 6, y: -60, z: 1.6 };
export function camara(t) {
  const e = entra(tr(t, 0.02, 1.35));
  const s = Math.exp(mez(Math.log(sCerca), Math.log(sLejos), e));
  let c = { x: mez(BOT[0], 0, e), y: mez(BOT[1], 0, e), z: MANDO.Z - 10 / s };
  c = mezCam(c, CERCA_P, su(tr(t, f2.inicio - 0.1, Tluz + 0.1)));
  return c;
}

// los destellos: de «luz» hasta poco antes del final, cada 0,13 s
const SALIDAS = []; for (let te = Tluz - 0.05; te < Fin2 - 0.75; te += 0.13) SALIDAS.push(te);
const VUELO = 0.5;

// el cable: una curva del mando a la tele, que se dibuja y luego se parte
function curva(a, b) {
  const p1 = { x: a.x - 520, y: a.y - 80 }, p2 = { x: b.x + 520, y: b.y + 330 };
  return (u) => { const m = 1 - u; return { x: m * m * m * a.x + 3 * m * m * u * p1.x + 3 * m * u * u * p2.x + u * u * u * b.x, y: m * m * m * a.y + 3 * m * m * u * p1.y + 3 * m * u * u * p2.y + u * u * u * b.y }; };
}
function cable(g, t, a, b) {
  const crece = su(tr(t, Tent - 0.05, Tent + 0.55));
  if (crece <= 0) return;
  const caida = tr(t, parte, parte + 0.6), al = 1 - su(tr(t, parte + 0.25, parte + 0.65));
  if (al <= 0) return;
  const C = curva(a, b), N = 60;
  const mitad = (desde, hasta, lado) => {
    g.beginPath();
    for (let i = 0; i <= N; i++) {
      const u = mez(desde, hasta, i / N); if (u > crece) break;
      const q = C(u), lejos = lado < 0 ? (u / 0.5) : ((1 - u) / 0.5);           // 0 en su enchufe, 1 en el corte
      const cae = caida > 0 ? Math.pow(lejos, 1.6) * 900 * caida * caida : 0;
      const x = q.x + lado * lejos * 60 * caida, y = q.y + cae;
      i === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
    }
  };
  g.save(); g.globalAlpha = al; g.lineCap = "round"; g.lineJoin = "round";
  for (const [d, h, l] of [[0, 0.5, -1], [0.5, 1, 1]]) {
    mitad(caida > 0 ? d : 0, caida > 0 ? h : 1, l);
    g.strokeStyle = "#0a0a0d"; g.lineWidth = 40; g.stroke();
    g.strokeStyle = "#2c2d35"; g.lineWidth = 30; g.stroke();
    g.strokeStyle = "rgba(255,255,255,0.28)"; g.lineWidth = 7; g.stroke();
    if (caida <= 0) break;
  }
  // los enchufes en las puntas
  for (const q of [a, b]) { g.fillStyle = "#1c1c22"; g.beginPath(); g.arc(q.x, q.y, 22, 0, 6.2832); g.fill(); g.strokeStyle = "rgba(255,255,255,0.3)"; g.lineWidth = 3; g.stroke(); }
  g.restore();
  // al partirse: chispas en el corte
  const m = C(0.5);
  k.fogonazo(g, m.x, m.y, (t - parte) * 1.6, 520, "255,200,120");
}

export function dibuja(g, t) { escena(g, t, camara(t)); }

// Todo el salón con la cámara cam; alMando: transparencia del mando (para cuando la cámara pasa a su lado).
export function escena(g, t, cam, alMando = 1, antes = null) {
  const fl = t - enciende;
  const canal = su(tr(t, Tcanal, Tcanal + 0.45));
  salon(g, cam, t, { encendida: su(tr(t, enciende, enciende + 0.35)), flash: fl, canal, ojito: 0 });
  const pul = k.pulso(t, Tpul + 0.02, 0.13);
  // el mando, con su lucecita latiendo mientras habla
  const led = SALIDAS.reduce((m, te) => Math.max(m, k.pulso(t, te, 0.03)), 0) * (1 - su(tr(t, Tno, Tver)));
  if (antes) antes(g, cam);
  mando(g, cam, t, { pulsa: Math.min(1, pul * 1.4), led: led + 0.9 * k.pulso(t, Tpul + 0.02, 0.06), al: alMando });
  // la tele se enciende: su luz llega a todo
  if (fl > -0.05 && fl < 1.5) { const tv = pr(cam, 0, -240, 10); k.fogonazo(g, tv.x, tv.y, fl * 0.9, 1500, "255,220,240"); }
  // el cable
  const a = punta(cam), b = ojito(cam);
  if (a && b) cable(g, t, { x: a.x - 6, y: a.y + 4 }, { x: b.x + 220 * b.s, y: b.y + 4 });
  // los destellos: se ven, y luego se vuelven invisibles
  const fan = su(tr(t, Tno - 0.1, Tver));
  if (a && b) for (const te of SALIDAS) destello(g, a, b, (t - te) / VUELO, 110 * a.s / 2.17, fan);
  // al llegar, el ojito de la tele se enciende un poco
  velo(g, 0.5);
}

export const momentos = { enciende, parte };
