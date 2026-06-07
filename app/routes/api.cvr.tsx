import type { Route } from "./+types/api.cvr";

/**
 * Server-side proxy for Danish company (CVR) lookups.
 *
 * cvrapi.dk requires an identifying User-Agent header (a browser-forbidden
 * header) and is not CORS-enabled, so the lookup must happen server-side.
 * The client calls /api/cvr?cvr=12345678 and gets back normalized fields.
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const cvr = (url.searchParams.get("cvr") || "").replace(/\D/g, "");

  if (cvr.length !== 8) {
    return Response.json({ found: false, error: "invalid" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://cvrapi.dk/api?search=${cvr}&country=dk`, {
      headers: {
        // cvrapi.dk asks for an app name + contact in the User-Agent.
        "User-Agent": "Define Cleaning Services (define-cleaning.dk) - info@define-cleaning.dk",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(7000),
    });

    if (!res.ok) {
      return Response.json({ found: false, error: "upstream" }, { status: 502 });
    }

    const data = (await res.json()) as Record<string, unknown>;
    if (data.error) {
      return Response.json({ found: false, error: "not_found" }, { status: 404 });
    }

    const str = (v: unknown) => (v == null ? "" : String(v));

    return Response.json(
      {
        found: true,
        name: str(data.name),
        address: str(data.address),
        zipcode: str(data.zipcode),
        city: str(data.city),
        phone: str(data.phone),
        email: str(data.email),
      },
      // Cache successful lookups for a day — company data rarely changes.
      { headers: { "Cache-Control": "public, max-age=86400" } }
    );
  } catch {
    return Response.json({ found: false, error: "network" }, { status: 502 });
  }
}
