"use client";

import { useState } from "react";

type FAQItem = { question: string; answer: string };

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="mt-12 max-w-[800px] mx-auto">
      {items.map((item, i) => (
        <div key={i} className="border-b border-[#2A2A2A]">
          <button
            onClick={() => setActiveIndex(activeIndex === i ? null : i)}
            className="w-full py-5 font-bold text-[1.05rem] cursor-pointer flex justify-between items-center text-left bg-transparent border-none"
          >
            <span>{item.question}</span>
            <span className="text-primary text-2xl ml-4 flex-shrink-0">
              {activeIndex === i ? "\u2212" : "+"}
            </span>
          </button>
          <div
            className={`faq-answer ${activeIndex === i ? "open" : ""}`}
          >
            <p className="pb-5 text-white/70">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
