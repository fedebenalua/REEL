// Vuelta a la puerta: el motor abre las hojas, quien pasa de largo no las abre, el infrarrojo
// del umbral no deja que se cierren, y el amigo que espera sigue parado.
import * as k from "#kit";
import { v } from "#voz";
import { puerta, viaje } from "../mundo.js";

export const desde = "ese";

const f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);
const Tese = f7.inicio, Tmotor = f7.t("motor"), Taparta = f7.finDe("apartan");
const Tpasas = f8.t("pasas"), Tlargo = f8.t("largo"), Tabren = f8.finDe("abren");
const Tumbral = f9.t("umbral"), Tinfra = f9.t("infrarroja"), Tparado = f9.t("parado"), Tencima = f9.finDe("encima");
const Treco = f10.t("reconocido"), Tmueves = f10.t("mueves"), Tella = f10.finDe("ella");
const Tesp = f11.t("espera"), Tfin = f11.finDe("espera");

const pos = viaje([
  [Tese, [0.1, 2.15, 2.05]],
  [Tmotor, [0.05, 2.05, 1.85]],
  [Taparta - 0.35, [0.1, 1.7, 2.35]],
  [Tpasas, [0.1, 1.7, 2.35]],
  [Tlargo, [2.6, 1.45, 3.3]],
  [Tabren - 0.15, [2.7, 1.42, 3.45]],
  [Tumbral, [2.7, 1.42, 3.45]],
  [Tinfra, [0.1, 0.95, 1.7]],
  [Tencima - 0.25, [0.05, 1.05, 1.9]],
  [Treco, [0.15, 1.55, 3.4]],
  [Tmueves, [0.2, 1.5, 2.9]],
  [Tella, [0.1, 1.48, 2.7]],
  [Tesp - 0.2, [-0.55, 1.45, 2.35]],
  [Tfin, [0.05, 1.38, 2.9]],
  [Tfin + 0.7, [0.02, 1.32, 2.15]],
]);
const miraP = viaje([
  [Tese, [0, 2.15, 0.15]],
  [Tmotor, [0, 2.05, 0.1]],
  [Taparta - 0.35, [0, 1.45, 0]],
  [Tlargo, [0.2, 1.3, 1.2]],
  [Tinfra, [0, 0.45, 0.2]],
  [Tencima - 0.25, [0, 0.85, 0.15]],
  [Treco, [-0.3, 1.4, 0.8]],
  [Tmueves, [0.4, 1.35, 0.5]],
  [Tesp - 0.2, [-0.7, 1.4, 1.2]],
  [Tfin + 0.7, [0.15, 1.45, 0.15]],
]);
const cam = (t) => k.mira(pos(t), miraP(t));

const abertura = k.claves([
  [Tese, 0],
  [Tmotor, 0.04],
  [Taparta - 0.2, 1],
  [Tpasas, 1],
  [Tlargo + 0.15, 0],
  [Tumbral, 0],
  [Tinfra - 0.1, 1],
  [Tparado, 1],
  [Tparado + 0.55, 0.42],
  [Tencima - 0.15, 1],
  [Treco - 0.2, 0],
  [Tmueves - 0.05, 0],
  [Tella - 0.25, 1],
  [Tesp - 0.45, 0],
  [Tesp, 0],
  [Tfin + 0.15, 0.15],
  [Tfin + 0.75, 0.92],
]);

const xCruce = k.claves([
  [Tpasas, 2.4],
  [Tlargo, 1.5],
  [Tabren - 0.35, -2.3],
  [Tfin, -2.3],
]);

const zUmbral = k.claves([
  [Tumbral, 2.4],
  [Tinfra, 0.55],
  [Tparado, 0.32],
  [Tencima, 0.32],
]);

const zAnda = k.claves([
  [Tmueves - 0.3, 3.6],
  [Tella - 0.2, 1.15],
  [Tesp - 0.2, 1.15],
  [Tfin + 0.75, 0.7],
]);

export function dibuja(g, t) {
  const spin = t < Tmotor ? 0.4 : 0.4 + (Math.min(t, Taparta) - Tmotor) * 9;
  const gente = [];
  if (t >= Tpasas && t < Tumbral + 0.15) {
    const freno = k.suave(k.tramo(t, Tabren - 0.6, Tabren - 0.15));
    gente.push({ x: xCruce(t), z: 3.15, pose: "quieto", paso: Math.sin(t * 8) * (1 - freno), chaqueta: "#2ec4b6" });
  }
  if (t >= Tumbral && t < Treco - 0.15) {
    const freno = k.suave(k.tramo(t, Tinfra - 0.05, Tinfra + 0.4));
    gente.push({ x: 0.05, z: zUmbral(t), pose: "quieto", paso: Math.sin(t * 8) * (1 - freno), chaqueta: "#ff4d3a" });
  }
  if (t >= Treco - 0.2) {
    gente.push({ x: -0.85, z: 1.85, pose: "cruzado", fase: 0, chaqueta: "#ffd60a", pelo: "#3a2414" });
    const marcha = Math.min(1, k.suave(k.tramo(t, Tmueves - 0.3, Tmueves + 0.05)) * (1 - k.suave(k.tramo(t, Tella - 0.2, Tella + 0.1))) + k.suave(k.tramo(t, Tfin - 0.05, Tfin + 0.35)));
    gente.push({
      x: 0.55,
      z: zAnda(t),
      pose: "quieto",
      paso: Math.sin(t * 8) * marcha,
      chaqueta: "#ff4d3a",
    });
  }
  const apriete = (t >= Tmueves && t < Tella + 0.1) || t >= Tfin + 0.05 ? k.suave(k.tramo(t, Tmueves, Tmueves + 0.45)) * (t < Tesp - 0.3 ? 1 : 0) + (t >= Tfin ? k.suave(k.tramo(t, Tfin, Tfin + 0.4)) : 0) : 0;
  const ondas = t < Tlargo ? 0 : t < Tumbral ? 0.85 : t < Treco - 0.3 ? 0.15 : 1;
  puerta(g, cam(t), {
    abertura: Math.max(0, Math.min(1, abertura(t))),
    ondas,
    apriete: Math.max(0, Math.min(1, apriete)),
    fase: t * 1.15,
    ir: k.suave(k.tramo(t, Tumbral + 0.1, Tinfra + 0.1)) * (1 - k.suave(k.tramo(t, Tencima, Treco))),
    spin: t < Tpasas + 0.4 ? spin : null,
    gente,
  });
}
