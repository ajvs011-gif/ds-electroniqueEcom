"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

export type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  tags: string[];
  ctaLabel: string;
  ctaHref: string;
};

export default function ProductCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[index];

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-sm font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-ds-green" />
            {slide.eyebrow}
          </span>
          <h1 className="text-3xl md:text-[44px] font-extrabold leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="opacity-90 max-w-md mb-7 leading-relaxed">{slide.text}</p>
          <div className="flex flex-wrap gap-2.5 mb-7">
            {slide.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/10 border border-white/25 px-3.5 py-1.5 rounded-lg text-sm font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={slide.ctaHref}
            className="inline-flex items-center gap-2 bg-ds-orange text-white px-6.5 py-3.5 rounded-xl font-bold hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            {slide.ctaLabel} →
          </a>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-8">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à la diapositive ${i + 1}`}
            onClick={() => setIndex(i)}
            className={clsx(
              "h-2 rounded-full bg-white/35 transition-all",
              i === index ? "w-6.5 bg-ds-orange" : "w-2"
            )}
          />
        ))}
      </div>
    </div>
  );
}
