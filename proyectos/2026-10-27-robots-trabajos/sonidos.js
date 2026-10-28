// Sin efectos: el creador no los quiere en estos vídeos.
import { v } from "#voz";

const e = [];
const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
void v;
void pon;

export default e;
