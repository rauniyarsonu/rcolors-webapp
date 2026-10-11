export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Content */}
      <main className="flex-grow w-full pb-24">
        {children}
      </main>
    </div>
  );
}
