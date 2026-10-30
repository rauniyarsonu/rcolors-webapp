import { useEffect, useState } from "react";
import Image from "@/components/ui/Image";
import Marquee from "./Marquee";

/** Logos 1–16 on the top row, 17–31 on the bottom, so no logo appears in both rows */
export const CLIENT_LOGO_ROWS: [number[], number[]] = [
  Array.from({ length: 16 }, (_, i) => i + 1),
  Array.from({ length: 15 }, (_, i) => i + 17),
];

/** Two rows of client logos (public/images/{n}.jpg), one sliding each way */
const shuffle = (list: number[]) => {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

export default function ClientLogoMarquee({ rows: initialRows }: { rows: [number[], number[]] }) {
  const [rows, setRows] = useState(initialRows);

  // Shuffle after mount (not during render) so server and client markup match and every page load gets a new order
  useEffect(() => {
    setRows([shuffle(initialRows[0]), shuffle(initialRows[1])]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return <Marquee rows={[{ items: rows[0].map(tile) }, { items: rows[1].map(tile), reverse: true }]} />;
}
