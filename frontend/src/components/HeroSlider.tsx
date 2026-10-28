import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "@/components/ui/Image";

// finishing works, Sales & purchase , Beyond your imagination
// `position` keeps each photo's focal point in frame when a portrait phone crops the landscape image
const slides = [
  { image: "/images/home1.jpg", text: "R Colors Group Of Companies", subtext: "Beyond your Imagination", position: "object-[55%_50%]" },
  { image: "/images/home2.jpg", text: "R Colors Construction and Developers", subtext: "Building & Developement", position: "object-[40%_50%]" },
  { image: "/images/home3.jpg", text: "R Colors", subtext: "Finishing Works", position: "object-[62%_50%]" },
  { image: "/images/home4.1.jpg", text: "R Colors Estate", subtext: "Sales | Purchase | Source Selling", position: "object-[42%_45%]" },
];

const INTERVAL_MS = 5000; // 5 seconds per slide
const SWIPE_THRESHOLD_PX = 50;
const FADE_MS = 1000;
// Never keep the hero blank if the first image is slow or fails
const READY_FALLBACK_MS = 3000;

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  // Slide that is fading out; keeps its zoom so it doesn't snap back mid-fade
  const [previous, setPrevious] = useState<number | null>(null);
  // Becomes true once the first image has loaded, so the entrance fade, zoom and caption actually animate on landing
  const [ready, setReady] = useState(false);
  const firstImage = useRef<HTMLImageElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const mouseStart = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback((index: number) => {
    const next = (index + slides.length) % slides.length;
    if (next === current) return;
    setPrevious(current);
    setCurrent(next);
  }, [current]);

  // Cached images can finish loading before onLoad is attached
  useEffect(() => {
    const img = firstImage.current;
    if (img?.complete && img.naturalWidth > 0) {
      // Wait a frame so the initial (hidden) styles paint before transitioning in
      requestAnimationFrame(() => setReady(true));
      return;
    }
    const fallback = setTimeout(() => setReady(true), READY_FALLBACK_MS);
    return () => clearTimeout(fallback);
  }, []);

  // 5-second auto-slide; starts once the hero is visible, resets on slide change and pauses while actively dragging
  useEffect(() => {
    if (!ready || isMouseDown) return;
    const timer = setTimeout(() => goTo(current + 1), INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [current, ready, isMouseDown, goTo]);

  // Touch gesture handling (mobile & tablet)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    // Horizontal swipes only; vertical drags keep scrolling the page
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      goTo(current + (dx < 0 ? 1 : -1));
    }
  };

  // Mouse drag handling (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Left click only
    mouseStart.current = { x: e.clientX, y: e.clientY };
    setIsMouseDown(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseStart.current) return;
    e.preventDefault();
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!mouseStart.current) return;
    const dx = e.clientX - mouseStart.current.x;
    const dy = e.clientY - mouseStart.current.y;
    mouseStart.current = null;
    setIsMouseDown(false);
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy)) {
      goTo(current + (dx < 0 ? 1 : -1));
    }
  };

  const onMouseLeave = () => {
    mouseStart.current = null;
    setIsMouseDown(false);
  };

  // Keyboard navigation for accessibility
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goTo(current - 1);
    } else if (e.key === "ArrowRight") {
      goTo(current + 1);
    }
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="R Colors Group highlights - swipe or drag to navigate"
      tabIndex={0}
      className={`relative isolate flex min-h-[max(32rem,100vh)] w-full touch-pan-y items-end overflow-hidden bg-brand-navy supports-[height:100svh]:min-h-[max(32rem,100svh)] select-none focus-visible:outline-none ${isMouseDown ? "cursor-grabbing" : "cursor-grab"
        }`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
    >
      {/* Background Images */}
      {slides.map((slide, index) => {
        const isActive = ready && index === current;
        // The outgoing slide keeps zooming while it fades; all others reset instantly while hidden
        const isZooming = isActive || (ready && index === previous);
        return (
          <div
            key={slide.image}
            aria-hidden={!isActive}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            className={`pointer-events-none absolute inset-0 z-0 transition-opacity ease-in-out motion-reduce:transition-none ${isActive ? "opacity-100" : "opacity-0"
              }`}
          >
            {/* Ken Burns effect: scale up slowly across the interval plus the fade-out */}
            <div
              style={isZooming ? { transitionDuration: `${INTERVAL_MS + FADE_MS}ms` } : undefined}
              className={`relative h-full w-full motion-reduce:scale-100 motion-reduce:transition-none ${isZooming ? "scale-105 transition-transform ease-linear" : "scale-100 transition-none"
                }`}
            >
              {/* Other slides start downloading only after the first one, so they don't compete with it on landing */}
              {(index === 0 || ready) && (
                <Image
                  ref={index === 0 ? firstImage : undefined}
                  src={slide.image}
                  alt={slide.text}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  draggable={false}
                  onLoad={index === 0 ? () => setReady(true) : undefined}
                  onError={index === 0 ? () => setReady(true) : undefined}
                  className={`pointer-events-none object-cover ${slide.position}`}
                />
              )}
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </div>
        );
      })}

      {/* Gradient at the bottom for text readability */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Bottom Text Captions */}
      <div className="site-container pointer-events-none relative z-20 pb-[max(2.5rem,calc(env(safe-area-inset-bottom)+1.5rem))] pt-28 md:pb-14 lg:pb-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
          {/* All captions share one grid cell, so the box is as tall as the longest one and nothing shifts */}
          <div className="grid max-w-4xl flex-1" aria-live="off">
            {slides.map((slide, index) => {
              const isActive = ready && index === current;
              // Only the first slide's title is the page h1
              const Heading = index === 0 ? "h1" : "h2";
              return (
                <div
                  key={slide.image}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${slides.length}`}
                  aria-hidden={!isActive}
                  className={`self-end transition-all duration-1000 ease-in-out [grid-area:1/1] motion-reduce:transition-none ${isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0"
                    }`}
                >
                  <Heading className="text-balance font-heading text-[clamp(1.875rem,1.2rem+3.4vw,4rem)] font-bold leading-tight tracking-wide text-white drop-shadow-lg">
                    {slide.text}
                  </Heading>
                  {slide.subtext && (
                    <p className="mt-3 border-l-4 border-brand-sky pl-4 text-[clamp(1rem,0.85rem+0.75vw,1.5rem)] font-medium tracking-widest text-gray-200 drop-shadow-md md:mt-4">
                      {slide.subtext}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
