// The root layout already provides <main>; this only groups the About pages
export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-col">{children}</div>;
}
