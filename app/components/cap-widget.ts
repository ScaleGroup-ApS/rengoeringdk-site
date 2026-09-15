declare global {
  interface Window {
    CAP_CUSTOM_WASM_URL?: string;
    CAP_PAKO_URL?: string;
    CAP_CUSTOM_FETCH?: typeof fetch;
    CAP_DISABLE_WIDGET_REF?: boolean;
  }
}

const assets = "/vendor/cap/0.1.57";
let loading: Promise<void> | undefined;

function loadCap(): Promise<void> {
  if (customElements.get("cap-widget")) return Promise.resolve();
  if (loading) return loading;
  window.CAP_CUSTOM_WASM_URL = `${assets}/cap_wasm_bg.wasm`;
  window.CAP_PAKO_URL = `${assets}/pako_inflate.min.js`;
  window.CAP_DISABLE_WIDGET_REF = true;
  window.CAP_CUSTOM_FETCH = async (input, init = {}) => {
    const controller = new AbortController();
    const abort = () => controller.abort();
    if (init.signal?.aborted) abort();
    init.signal?.addEventListener("abort", abort, { once: true });
    const timeout = window.setTimeout(abort, 8000);
    try {
      return await fetch(input, {
        ...init,
        signal: controller.signal,
        redirect: "error",
      });
    } finally {
      window.clearTimeout(timeout);
      init.signal?.removeEventListener("abort", abort);
    }
  };

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(fail, 15000);
    function fail() {
      clearTimeout(timeout);
      script.remove();
      loading = undefined;
      reject(new Error("Challenge unavailable"));
    }
    script.src = `${assets}/widget.js`;
    script.async = true;
    script.onerror = fail;
    script.onload = () => {
      if (!customElements.get("cap-widget")) return fail();
      clearTimeout(timeout);
      resolve();
    };
    document.head.appendChild(script);
  });
  return loading;
}

export async function mountCap(
  holder: HTMLElement,
  siteKey: string,
  baseUrl: string | null | undefined,
  onToken: (token: string) => void,
  onError: () => void,
): Promise<() => void> {
  if (!baseUrl || !/^[a-zA-Z0-9_-]{1,128}$/.test(siteKey))
    throw new Error("Missing configuration");
  const base = new URL(baseUrl);
  if (
    !["https:", "http:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  )
    throw new Error("Invalid configuration");
  await loadCap();
  const widget = document.createElement("cap-widget");
  widget.setAttribute(
    "data-cap-api-endpoint",
    `${base.href.replace(/\/$/, "")}/${siteKey}/`,
  );
  widget.setAttribute("data-cap-worker-count", "2");
  widget.setAttribute("data-cap-disable-haptics", "");
  const labels = {
    "initial-state": "Jeg er ikke en robot",
    "verifying-label": "Kontrollerer…",
    "solved-label": "Bekræftet",
    "error-label": "Prøv igen",
    "verify-aria-label": "Bekræft, at du ikke er en robot",
    "verifying-aria-label": "Kontrollerer, vent venligst",
    "verified-aria-label": "Bekræftet",
    "required-label": "Bekræft, at du ikke er en robot",
    "error-aria-label": "Kontrollen mislykkedes, prøv igen",
  };
  for (const [name, value] of Object.entries(labels))
    widget.setAttribute(`data-cap-i18n-${name}`, value);
  let deadline: number | undefined;
  const clearDeadline = () => window.clearTimeout(deadline);
  const fail = () => {
    clearDeadline();
    onToken("");
    onError();
    widget.remove();
  };
  const progress = (event: Event) => {
    if ((event as CustomEvent).detail?.progress !== 0) return;
    clearDeadline();
    deadline = window.setTimeout(fail, 15000);
  };
  const solve = (event: Event) => {
    clearDeadline();
    const token: unknown = (event as CustomEvent).detail?.token;
    if (typeof token === "string") onToken(token);
    else fail();
  };
  const reset = () => {
    clearDeadline();
    onToken("");
  };
  widget.addEventListener("solve", solve);
  widget.addEventListener("reset", reset);
  widget.addEventListener("error", fail);
  widget.addEventListener("progress", progress);
  holder.appendChild(widget);
  return () => {
    clearDeadline();
    widget.removeEventListener("solve", solve);
    widget.removeEventListener("reset", reset);
    widget.removeEventListener("error", fail);
    widget.removeEventListener("progress", progress);
    widget.remove();
  };
}
