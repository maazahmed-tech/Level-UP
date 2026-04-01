type TransformationCardProps = {
  name: string;
  duration: string;
  gradient?: string;
};

export default function TransformationCard({
  name,
  duration,
  gradient = "from-beige to-[#d7c8b8]",
}: TransformationCardProps) {
  return (
    <div
      className={`bg-linear-to-br ${gradient} rounded-xl aspect-[3/4] flex items-end relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-linear-to-t from-dark/90 to-transparent" />
      <div className="relative z-10 p-4 text-white w-full">
        <strong className="text-[0.9rem]">{name}</strong>
        <span className="block text-[0.75rem] text-white/70">{duration}</span>
      </div>
    </div>
  );
}
