import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { searchAliceNse } from "@/lib/alice-blue";

export async function GET(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") ?? "local";
    const limited = rateLimit(`nse-search:${ip}`, 40, 60_000);
    if (!limited.success) return jsonError("Too many searches. Try later.", 429);

    const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
    if (q.length < 1) return jsonOk({ results: [] });
    if (q.length > 40) return jsonError("Search is too long.", 400);

    const results = await searchAliceNse(q);
    return jsonOk({ results });
  } catch (error) {
    return handleApiError(error);
  }
}
