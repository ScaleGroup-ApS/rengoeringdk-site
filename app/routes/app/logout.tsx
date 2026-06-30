import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { destroyUserSession } from "~/lib/auth/guards.server";

// POST-only logout (no GET side effects → not CSRF-triggerable / prefetchable).
export async function action({ request }: Route.ActionArgs) {
  const cookie = await destroyUserSession(request);
  return redirect("/app/login", { headers: { "Set-Cookie": cookie } });
}

export async function loader() {
  throw redirect("/app");
}
