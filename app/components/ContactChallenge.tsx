import { mountAltcha } from "./altcha-widget";
import { mountCap } from "./cap-widget";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};

declare global {
  interface Window {
    contactTurnstileReady?: () => void;
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | undefined;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = window.setTimeout(fail, 15000);
    function fail() {
      window.clearTimeout(timeout);
      script.remove();
      scriptPromise = undefined;
      reject(new Error("Challenge unavailable"));
    }
    window.contactTurnstileReady = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=contactTurnstileReady";
    script.async = true;
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return scriptPromise;
}

type Props = {
  provider?: string;
  baseUrl?: string | null;
  siteKey?: string | null;
  resetKey?: number;
  error?: string;
  onToken?: (token: string) => void;
  onHoneypot?: (value: string) => void;
};

export function ContactChallenge({
  provider = "turnstile",
  baseUrl,
  siteKey,
  resetKey = 0,
  error,
  onToken,
  onHoneypot,
}: Props) {
  const holder = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  callback.current = onToken;
  const [token, setToken] = useState("");
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!siteKey) return;
    let cancelled = false;
    let widget: string | undefined;
    let removeSelfHosted: (() => void) | undefined;
    const update = (value: string) => {
      if (cancelled) return;
      setToken(value);
      callback.current?.(value);
    };
    update("");
    setFailed(false);
    if ((provider === "cap" || provider === "altcha") && holder.current) {
      void (provider === "altcha" ? mountAltcha : mountCap)(
        holder.current,
        siteKey,
        baseUrl,
        (value) => {
          update(value);
          if (!cancelled && value) setFailed(false);
        },
        () => {
          update("");
          if (!cancelled) setFailed(true);
        },
      )
        .then((remove) => {
          if (cancelled) remove();
          else removeSelfHosted = remove;
        })
        .catch(() => {
          if (!cancelled) setFailed(true);
        });
      return () => {
        cancelled = true;
        removeSelfHosted?.();
      };
    }
    if (provider !== "turnstile") {
      setFailed(true);
      return;
    }
    void loadScript()
      .then(() => {
        if (cancelled || !holder.current || !window.turnstile) return;
        widget = window.turnstile.render(holder.current, {
          sitekey: siteKey,
          action: "contact",
          size: holder.current.clientWidth < 300 ? "compact" : "normal",
          "response-field": false,
          callback: (value: string) => {
            update(value);
            setFailed(false);
          },
          "expired-callback": () => update(""),
          "timeout-callback": () => {
            update("");
            setFailed(true);
          },
          "error-callback": () => {
            update("");
            setFailed(true);
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      if (widget !== undefined) window.turnstile?.remove(widget);
    };
  }, [provider, baseUrl, siteKey, resetKey, attempt]);

  return (
    <div
      style={{
        display: siteKey || error || failed ? "block" : "contents",
        gridColumn: "1 / -1",
        flexBasis: "100%",
        minWidth: 0,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clipPath: "inset(50%)",
        }}
      >
        <label>
          Leave this field empty
          <input
            name="contact_website"
            tabIndex={-1}
            autoComplete="off"
            onChange={(event) => onHoneypot?.(event.target.value)}
          />
        </label>
      </div>
      {siteKey && (
        <>
          <div ref={holder} />
          <input type="hidden" name="turnstile_token" value={token} />
          {!token && !failed && (
            <p role="status">Bekræft venligst, at du ikke er en robot.</p>
          )}
          <noscript>
            Aktivér JavaScript for at sende formularen, eller kontakt os via
            telefon eller e-mail.
          </noscript>
        </>
      )}
      {(failed || error) && (
        <p role="alert">
          {error || "Kontrollen kunne ikke indlæses."}{" "}
          <button
            type="button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Prøv igen
          </button>
        </p>
      )}
    </div>
  );
}
