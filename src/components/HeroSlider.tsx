"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
// finishing works, Sales & purchase , Beyond your imagination 
const slides = [
  { image: "/images/home1.jpg", text: "R Colors Group Of Companies", subtext: "Beyond your Imagination" },
  { image: "/images/home2.jpg", text: "R Colors Construction and Developers", subtext: "Building & Developement" },
  { image: "/images/home3.jpg", text: "R Colors", subtext: "Finishing Works" },
  { image: "/images/home4.1.jpg", text: "R Colors Estate", subtext: "Sales & Purchase" },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds interval
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[600px] overflow-hidden bg-brand-navy">
      {/* Background Images */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${isActive ? "opacity-100" : "opacity-0"
              }`}
          >
            {/* Ken Burns effect: scale up slowly while active */}
            <div
              className={`relative w-full h-full transition-transform duration-[4000ms] ease-linear ${isActive ? "scale-105" : "scale-100"
                }`}
            >
              <Image
                src={slide.image}
                alt={slide.text}
                fill
                priority={index === 0}
                className="object-cover object-center"
              />
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </div>
        );
      })}

      {/* Gradient at the bottom for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none"></div>

      {/* Bottom Left Text */}
      <div className="absolute bottom-16 left-4 md:left-12 lg:left-24 z-20 w-[90%] md:max-w-4xl flex items-end">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={index}
              className={`absolute bottom-0 left-0 w-full transition-all duration-1000 ease-in-out ${isActive
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none"
                }`}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white tracking-wide drop-shadow-lg leading-tight md:leading-tight">
                {slide.text}
              </h1>
              {slide.subtext && (
                <p className="mt-3 md:mt-4 pl-4 border-l-4 border-brand-sky text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 font-medium tracking-widest drop-shadow-md">
                  {slide.subtext}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
