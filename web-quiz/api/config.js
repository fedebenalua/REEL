import { json } from "../lib/http.js";
import { PLANS, CURRENCY } from "../lib/plans.js";
import { squareConfig } from "../lib/square.js";

export async function GET(request) {
  const { environment, applicationId, locationId, configured, demo } = squareConfig(request);
  return json({
    currency: CURRENCY,
    plans: PLANS,
    square: { environment, applicationId, locationId, configured, demo },
  });
}
