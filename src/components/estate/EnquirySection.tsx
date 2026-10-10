"use client";

import { CircleCheck, Mail, Phone } from "lucide-react";
import { ESTATE } from "@/config/estate/site";
import { formatPhone } from "@/lib/estate/format";
import EnquiryForm, { type EnquiryContext } from "./EnquiryForm";

/** Restyled "Enquire About a Property" block; same fields, now actually submitted */
export default function EnquirySection({ context }: { context?: EnquiryContext }) {
  return (
    <section id="enquire" aria-labelledby="es-enquire-title" className="bg-es-surface py-16 md:py-20">
      <div className="es-container">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-es-line bg-white md:grid-cols-5">
          <div className="es-on-dark relative overflow-hidden bg-es-ink p-8 text-white md:col-span-2 md:p-10">
            <div aria-hidden="true" className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-es-accent/20 blur-3xl" />
            <h2 id="es-enquire-title" className="relative font-display text-3xl font-bold leading-tight">
              Enquire About a Property
            </h2>
            <p className="relative mt-4 text-white/80">
              Looking for a plot, ready-to-move home, or commercial space? Drop us a line and our real estate experts will get back to you shortly.
            </p>
            <ul className="relative mt-8 space-y-3">
              {["Verified Listings", "Transparent Deals"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-sm font-semibold">
                  <CircleCheck size={18} aria-hidden="true" className="text-es-accent" />
                  {t}
                </li>
              ))}
            </ul>
            <div className="relative mt-10 border-t border-white/15 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Prefer to talk?</p>
              <ul className="mt-3 space-y-1">
                {ESTATE.company.phones.map((p) => (
                  <li key={p}>
                    <a href={`tel:+91${p}`} className="flex min-h-[44px] items-center gap-3 font-semibold hover:text-sky-300">
                      <Phone size={16} aria-hidden="true" className="text-es-accent" />
                      {formatPhone(p)}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${ESTATE.company.email}`} className="flex min-h-[44px] items-center gap-3 font-semibold [overflow-wrap:anywhere] hover:text-sky-300">
                    <Mail size={16} aria-hidden="true" className="shrink-0 text-es-accent" />
                    {ESTATE.company.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="p-6 sm:p-8 md:col-span-3 md:p-10">
            <EnquiryForm context={context} />
          </div>
        </div>
      </div>
    </section>
  );
}
