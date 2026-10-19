import { Quote } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

/* PLACEHOLDER CONTENT: replace with real client feedback (and permission to publish it). */
const testimonials = [
  {
    quote: "Placeholder: The team delivered our project on schedule and the finishing quality exceeded our expectations.",
    name: "Client Name",
    role: "Residential Client, Lucknow",
  },
  {
    quote: "Placeholder: Clear communication and transparent costs from the first meeting to handover.",
    name: "Client Name",
    role: "Commercial Client",
  },
  {
    quote: "Placeholder: R Colors Estate helped us find the right property and handled every detail of the paperwork.",
    name: "Client Name",
    role: "Property Buyer",
  },
];

/** Three-up testimonial cards on a white band */
export default function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="section-y w-full bg-white">
      <div className="site-container">
        <SectionHeading
          id="testimonials-heading"
          eyebrow="Client Voices"
          title="What Our Clients Say"
          bar
          subtitle="Real experiences from the people we have built for."
          className="mb-10 md:mb-16"
        />
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {testimonials.map((t, i) => (
            <li key={i} className="flex h-full flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm sm:p-8">
              <Quote size={32} aria-hidden="true" className="text-brand-sky" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-gray-700">{t.quote}</blockquote>
              <div className="mt-6 border-t border-gray-200 pt-4">
                <p className="font-bold text-brand-navy">{t.name}</p>
                <p className="text-sm text-gray-600">{t.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
