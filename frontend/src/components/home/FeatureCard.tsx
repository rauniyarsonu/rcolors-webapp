import { CheckCircle } from "lucide-react";

interface FeatureCardProps {
  title: string;
  children: React.ReactNode;
}

/** Glass card on the navy "Why Choose Us" band */
export default function FeatureCard({ title, children }: FeatureCardProps) {
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-8">
      <CheckCircle className="shrink-0 text-brand-sky" size={40} aria-hidden="true" />
      <h3 className="text-balance text-xl font-bold">{title}</h3>
      <p className="text-base leading-relaxed text-gray-300 xl:text-sm">{children}</p>
    </div>
  );
}
