// Los efectos: cada uno en lo que se mueve, en el fotograma en que se mueve (mira guia/sonido.md).
import { v } from "#voz";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

export default e;
