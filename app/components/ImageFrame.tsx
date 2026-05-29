import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";

type Props = {
  className?: string;
  style?: CSSProperties;
  icon?: ReactNode;
  label?: string;
  src?: string;
  alt?: string;
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export function ImageFrame({ className = "", style, icon, label, src, alt }: Props) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div
      className={`img-frame${showImg ? " has-img" : ""} ${className}`.trim()}
      style={style}
      role="img"
      aria-label={alt || label || "Billede"}
    >
      {showImg ? (
        <img src={src} alt={alt || label || ""} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="ph-icon" aria-hidden="true">{icon || DEFAULT_ICON}</div>
      )}
    </div>
  );
}
