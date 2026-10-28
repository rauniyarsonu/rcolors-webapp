import { useEffect, useRef } from "react";
import Image from "@/components/ui/Image";

const FADE_MS = 1000;
// Same zoom length as one home slide (interval + fade)
const ZOOM_MS = 6000;
// Never keep the hero blank if the image is slow or fails
const READY_FALLBACK_MS = 3000;

interface HeroImageProps {
  src: string;
  alt: string;
  /** Extra image classes, e.g. the object-position focal point */
  className?: string;
  ready: boolean;
  onReady: () => void;
}

/** Full-bleed hero photo with the home slider's entrance: fades in once loaded, then a slow Ken Burns zoom */
export default function HeroImage({ src, alt, className = "", ready, onReady }: HeroImageProps) {
  const image = useRef<HTMLImageElement>(null);
  const readyRef = useRef(onReady);
  readyRef.current = onReady;

  // Cached images can finish loading before onLoad is attached
  useEffect(() => {
    const done = () => readyRef.current();
    const img = image.current;
    if (img?.complete && img.naturalWidth > 0) {
      // Wait a frame so the initial (hidden) styles paint before transitioning in
      const frame = requestAnimationFrame(done);
      return () => cancelAnimationFrame(frame);
    }
    const fallback = setTimeout(done, READY_FALLBACK_MS);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div
      style={{ transitionDuration: `${FADE_MS}ms` }}
      className={`pointer-events-none absolute inset-0 -z-20 transition-opacity ease-in-out motion-reduce:transition-none ${ready ? "opacity-100" : "opacity-0"}`}
    >
      <div
        style={{ transitionDuration: `${ZOOM_MS}ms` }}
        className={`relative h-full w-full transition-transform ease-linear motion-reduce:scale-100 motion-reduce:transition-none ${ready ? "scale-105" : "scale-100"}`}
      >
        <Image
          ref={image}
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          onLoad={onReady}
          onError={onReady}
          className={`object-cover ${className}`}
        />
      </div>
    </div>
  );
}
