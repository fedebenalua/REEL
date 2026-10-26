// «Y aun así… ya no coincidía. Solo a los treinta y nueve… les creció… Por los dos lados…»
// La copia de antes se separa. Luego crece la parte de atrás, en los dos lados.
import * as k from "#kit";
import { v } from "#voz";
import { fondoPieza, pieza, velo } from "../mundo.js";

export const desde = (vx) => vx.frase(10).inicio;

export function dibuja(g, t) {
  const f10 = v.frase(10), f11 = v.frase(11), f12 = v.frase(12);
  const Tno = f10.t("coincidia");
  const Tcrece = f11.t("crecio");
  const Tlados = f12.t("lados");
  const Tfin = v.frase(13).inicio;
  const separa = k.suave(k.tramo(t, f10.t("cerebro"), Tno + 0.1));
  const crece = k.suave(k.tramo(t, Tcrece - 0.08, Tcrece + 0.7));
  const ambos = k.suave(k.tramo(t, f12.inicio, Tlados + 0.15));
  const cam = k.ruta([
    [f10.inicio, { pos: [0.05, 0.4, 1.7], mira: [0.15, 0.25, 0.35] }],
    [Tno, { pos: [-0.2, 0.45, 1.85], mira: [0.1, 0.28, 0.4] }],
    [Tcrece, { pos: [0.15, 0.55, 1.55], mira: [0.05, 0.15, 0.7] }],
    [f11.t("atras"), { pos: [0.05, 0.35, 1.35], mira: [0, 0.05, 0.85] }],
    [Tlados, { pos: [0, 0.55, 2.2], mira: [0, 0.18, 0.15] }],
    [f12.t("sitio"), { pos: [0, 0.62, 2.45], mira: [0, 0.18, 0] }],
    [Tfin - 0.05, { pos: [0, 0.62, 2.45], mira: [0, 0.18, 0] }],
  ])(t);

  fondoPieza(g);
  // la copia de antes, que deja de encajar
  pieza(g, cam, {
    al: 0.4 * (1 - crece * 0.85),
    origen: [separa * 0.55, separa * 0.28, -0.15],
    tono: "170,190,220",
    abre: 0.42,
  });
  const abre = k.mez(0.28, 0.72, ambos);
  pieza(g, cam, { lado: 1, crece, abre, tono: "214,150,104" });
  if (ambos > 0.04) pieza(g, cam, { lado: -1, crece, abre, al: ambos, tono: "214,150,104" });

  const al39 = k.claves([
    [f11.t("treinta") - 0.1, 0],
    [f11.t("nueve"), 1],
    [Tcrece - 0.05, 1],
    [Tcrece + 0.35, 0],
  ]);
  if (al39(t) > 0.04) k.pastilla(g, 540, 1280, "39", "", "255,196,120", al39(t), 100);
  velo(g);
}
