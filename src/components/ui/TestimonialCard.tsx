type TestimonialCardProps = {
  name: string;
  duration: string;
  text: string;
};

export default function TestimonialCard({ name, duration, text }: TestimonialCardProps) {
  return (
    <div className="bg-[#1E1E1E] rounded-2xl overflow-hidden shadow-card">
      {/* Before/After placeholder */}
      <div className="h-[250px] bg-linear-to-br from-beige to-light flex">
        <div className="flex-1 flex items-center justify-center font-bold text-[0.9rem] uppercase tracking-[2px] bg-dark/[0.08] text-white/30">
          Before
        </div>
        <div className="flex-1 flex items-center justify-center font-bold text-[0.9rem] uppercase tracking-[2px] bg-primary/[0.08] text-primary/50">
          After
        </div>
      </div>
      <div className="p-6">
        <div className="font-bold text-base uppercase tracking-wider">{name}</div>
        <div className="text-primary text-[0.85rem] font-semibold mt-1">
          {duration}
        </div>
        <p className="mt-3 text-white/60 text-[0.9rem] leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
