import { useEffect, useRef, useState } from "react";

/* PLACEHOLDER VALUES: replace with the company's real figures. */
const stats = [
  { value: 15, suffix: "+", label: "Years of Experience" },
  { value: 70, suffix: "+", label: "Projects Completed" },
  { value: 20, suffix: "+", label: "Happy Clients" },
  { value: 3, suffix: "", label: "Business Divisions" },
];

const DURATION_MS = 1600;

function Counter({ value, suffix }: { value: number; suffix: string }) {
  // Starts at the final value so server HTML, no-JS and reduced-motion users see real numbers
  const [n, setN] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / DURATION_MS, 1);
          setN(Math.round(value * (1 - Math.pow(1 - t, 3)))); // ease-out cubic
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        setN(0);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

/** Navy stats band with count-up numbers (placeholder figures, see `stats`) */
export default function StatsStrip() {
  return (
    <section aria-label="R Colors Group in numbers" className="w-full bg-brand-navy py-10 text-white md:py-14">
      <dl className="site-container grid grid-cols-2 gap-x-4 gap-y-8 text-center lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-2 text-sm font-medium uppercase tracking-wide text-gray-200 md:text-base">{s.label}</dt>
            <dd className="font-heading text-4xl font-black text-brand-sky tabular-nums md:text-5xl">
              <Counter value={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
