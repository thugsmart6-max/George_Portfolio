import { handleApiError, jsonOk } from "@/lib/api";
import { getAliceStatus } from "@/lib/alice-blue";

export const runtime = "nodejs";

export async function GET() {
  try {
    const status = await getAliceStatus();
    return jsonOk({
      configured: status.configured,
      connected: status.connected,
      clientId: status.clientId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
