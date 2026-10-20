import { forwardRef, type CSSProperties, type ImgHTMLAttributes } from "react";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "width" | "height" | "loading"> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Fill the nearest positioned parent */
  fill?: boolean;
  /** Above-the-fold image: load eagerly with high priority */
  priority?: boolean;
}

const fillStyle: CSSProperties = { position: "absolute", height: "100%", width: "100%", inset: 0, color: "transparent" };

/** <img> with lazy loading by default and a `fill` mode for cover images */
const Image = forwardRef<HTMLImageElement, ImageProps>(function Image({ src, alt, fill, priority, style, sizes: _sizes, ...rest }, ref) {
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      {...(priority ? { fetchpriority: "high" } : {})}
      style={{ ...(fill ? fillStyle : { color: "transparent" }), ...style }}
      {...rest}
    />
  );
});

export default Image;
