import { useEffect } from "react";

export function useSiteEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.add("js");

    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const counts = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"));

    const fmt = (v: number, dec: number) =>
      v.toLocaleString("da-DK", { minimumFractionDigits: dec, maximumFractionDigits: dec });

    const runCount = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || "0");
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const dur = 1500;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased, dec);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = fmt(target, dec);
      };
      requestAnimationFrame(tick);
    };

    if (reduce) {
      reveals.forEach((el) => el.classList.add("in"));
      counts.forEach((el) => {
        el.dataset.done = "1";
        const target = parseFloat(el.dataset.count || "0");
        const dec = parseInt(el.dataset.decimals || "0", 10);
        el.textContent = fmt(target, dec);
      });
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            if (el.classList.contains("reveal")) el.classList.add("in");
            if (el.hasAttribute("data-count") && !el.dataset.done) {
              el.dataset.done = "1";
              runCount(el);
            }
            io.unobserve(el);
          }
        },
        { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
      );
      reveals.forEach((el) => io.observe(el));
      counts.forEach((el) => io.observe(el));

      // safety: reveal everything after 2.5s even if IO never fires
      const fallback = window.setTimeout(() => {
        reveals.forEach((el) => el.classList.add("in"));
        counts.forEach((el) => {
          if (el.dataset.done) return;
          el.dataset.done = "1";
          runCount(el);
        });
      }, 2500);

      // 3D tilt on hover (data-tilt="degrees")
      const tilts = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));
      const isTouch = window.matchMedia("(hover: none)").matches;
      const onMove = (card: HTMLElement, max: number) => (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
      };
      const onLeave = (card: HTMLElement) => () => { card.style.transform = ""; };
      const tiltCleanup: Array<() => void> = [];
      if (!isTouch) {
        tilts.forEach((card) => {
          const max = parseFloat(card.dataset.tilt || "6");
          const m = onMove(card, max);
          const l = onLeave(card);
          card.addEventListener("mousemove", m);
          card.addEventListener("mouseleave", l);
          tiltCleanup.push(() => {
            card.removeEventListener("mousemove", m);
            card.removeEventListener("mouseleave", l);
          });
        });
      }

      return () => {
        io.disconnect();
        window.clearTimeout(fallback);
        tiltCleanup.forEach((fn) => fn());
      };
    }
  }, []);
}
