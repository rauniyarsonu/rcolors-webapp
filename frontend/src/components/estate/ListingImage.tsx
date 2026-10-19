import { useState } from "react";
import Image from "@/components/ui/Image";
import { Building2, LandPlot, Users } from "lucide-react";
import { ESTATE } from "@/config/estate/site";

interface ListingImageProps {
  src?: string;
  alt: string;
  sizes: string;
  kind?: "land" | "property" | "project" | "agent";
  className?: string;
  /** Zoom on hover of a parent .group */
  zoom?: boolean;
}

/** next/image with a skeleton while loading and a branded placeholder when there's no photo */
export default function ListingImage({ src, alt, sizes, kind = "property", className = "", zoom = true }: ListingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    const Icon = kind === "land" ? LandPlot : kind === "agent" ? Users : Building2;
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-es-ink to-[#1d5f93] text-white/85 ${className}`}>
        <Icon size={kind === "agent" ? 28 : 34} strokeWidth={1.5} aria-hidden="true" />
        {kind !== "agent" && <span className="text-xs font-medium tracking-wide">{ESTATE.placeholderLabel}</span>}
        <span className="sr-only">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-es-line ${loaded ? "" : "animate-pulse motion-reduce:animate-none"} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`object-cover transition-[opacity,transform] duration-500 motion-reduce:transition-none ${loaded ? "opacity-100" : "opacity-0"} ${
          zoom ? "group-hover:scale-[1.04] motion-reduce:group-hover:scale-100" : ""
        }`}
      />
    </div>
  );
}
