type WhyCardProps = {
  title: string;
  text: string;
};

export default function WhyCard({ title, text }: WhyCardProps) {
  return (
    <div className="bg-[#1E1E1E] p-9 rounded-2xl shadow-card border-l-4 border-primary">
      <h3 className="mb-3 text-primary font-bold text-[1.1rem] uppercase">
        {title}
      </h3>
      <p className="text-white/70 text-[0.95rem]">{text}</p>
    </div>
  );
}
