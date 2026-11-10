import { endSession, handle, json } from "../lib/http.js";

export const POST = handle(async (request) => {
  await endSession(request);
  return json({ ok: true });
});
