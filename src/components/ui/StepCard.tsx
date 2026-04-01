type StepCardProps = {
  number: string;
  title: string;
  description: string;
};

export default function StepCard({ number, title, description }: StepCardProps) {
  return (
    <div className="text-center p-10 bg-[#1E1E1E] rounded-2xl shadow-card">
      <div className="w-15 h-15 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-5">
        {number}
      </div>
      <h3 className="font-bold text-lg mb-3">{title}</h3>
      <p className="text-white/60 text-[0.95rem]">{description}</p>
    </div>
  );
}
