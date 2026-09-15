type AltchaWidget = HTMLElement & {
  configure: (options: Record<string, unknown>) => void | Promise<void>;
  reset: () => void;
};
const assets = "/vendor/altcha/3.2.2";
let loading: Promise<void> | undefined;

function loadAltcha(): Promise<void> {
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const css = document.createElement("link");
    let scriptReady = false;
    let cssReady = false;
    const timeout = window.setTimeout(fail, 15000);
    function fail() {
      clearTimeout(timeout);
      script.remove();
      css.remove();
      loading = undefined;
      reject(new Error("Challenge unavailable"));
    }
    function ready() {
      if (scriptReady && cssReady && customElements.get("altcha-widget")) {
        clearTimeout(timeout);
        resolve();
      }
    }
    css.rel = "stylesheet";
    css.href = `${assets}/altcha.css`;
    css.onload = () => {
      cssReady = true;
      ready();
    };
    css.onerror = fail;
    script.type = "module";
    script.src = `${assets}/bootstrap.js`;
    script.onload = () => {
      scriptReady = true;
      ready();
    };
    script.onerror = fail;
    document.head.append(css, script);
  });
  return loading;
}

export async function mountAltcha(
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
  await loadAltcha();
  const widget = document.createElement("altcha-widget") as AltchaWidget;
  const controller = new AbortController();
  // Apply privacy settings before the element mounts and initializes collectors.
  widget.setAttribute(
    "configuration",
    JSON.stringify({
      challenge: `${base.href.replace(/\/$/, "")}/${siteKey}/challenge`,
      auto: "off",
      name: "",
      workers: 2,
      language: "da",
      timeout: 15000,
      humanInteractionSignature: false,
      serverVerificationFields: false,
      serverVerificationTimeZone: false,
      verifyUrl: null,
      setCookie: null,
    }),
  );
  const verified = (event: Event) => {
    const value = (event as CustomEvent<{ payload?: unknown }>).detail?.payload;
    if (typeof value === "string" && value.length <= 8192) onToken(value);
    else {
      onToken("");
      onError();
    }
  };
  const state = (event: Event) => {
    const state = (event as CustomEvent<{ state?: string }>).detail?.state;
    if (state !== "verified") onToken("");
    if (state === "error" || state === "expired") onError();
  };
  widget.addEventListener("verified", verified);
  widget.addEventListener("statechange", state);
  const dispose = () => {
    controller.abort();
    widget.removeEventListener("verified", verified);
    widget.removeEventListener("statechange", state);
    widget.reset?.();
    widget.remove();
  };
  await new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      dispose();
      reject(new Error("Challenge unavailable"));
    }, 15000);
    widget.addEventListener(
      "load",
      () => {
        void Promise.resolve()
          .then(() =>
            widget.configure({
              fetch: (input: RequestInfo | URL, init: RequestInit = {}) =>
                fetch(input, {
                  ...init,
                  credentials: "omit",
                  redirect: "error",
                  signal: AbortSignal.any([
                    controller.signal,
                    AbortSignal.timeout(8000),
                    ...(init.signal ? [init.signal] : []),
                  ]),
                }),
            }),
          )
          .then(
            () => {
              clearTimeout(timeout);
              resolve();
            },
            () => {
              clearTimeout(timeout);
              dispose();
              reject(new Error("Challenge unavailable"));
            },
          );
      },
      { once: true },
    );
    holder.appendChild(widget);
  });
  return dispose;
}
