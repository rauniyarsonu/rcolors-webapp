import Image from "next/image";
import Marquee from "./Marquee";

/** Two rows of client logos (public/images/{n}.jpg), one sliding each way */
export default function ClientLogoMarquee({ rows }: { rows: [number[], number[]] }) {
  const tile = (imgNum: number) => (
    <div
      key={imgNum}
      className="flex h-24 w-40 items-center justify-center border border-gray-200 bg-white p-4 sm:h-32 sm:w-52 sm:p-5 lg:h-36 lg:w-60 lg:p-6"
    >
      <div className="relative h-12 w-full sm:h-16 lg:h-20">
        <Image
          src={`/images/${imgNum}.jpg`}
          alt={`Client ${imgNum}`}
          fill
          sizes="(min-width: 1024px) 192px, (min-width: 640px) 166px, 128px"
          className="object-contain"
        />
      </div>
    </div>
  );

  return <Marquee name="logos" rows={[{ items: rows[0].map(tile) }, { items: rows[1].map(tile), reverse: true }]} />;
}
