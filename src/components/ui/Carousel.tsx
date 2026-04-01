"use client";

type CarouselProps = {
  children: React.ReactNode;
};

export default function Carousel({ children }: CarouselProps) {
  return (
    <div className="flex gap-8 overflow-x-auto scroll-snap-x-mandatory py-5 scrollbar-hide mt-10">
      {children}
    </div>
  );
}
