type PhoneMockupProps = {
  label: string;
  gradient?: string;
  size?: "sm" | "lg";
};

export default function PhoneMockup({
  label,
  gradient = "from-primary to-[#ff7043]",
  size = "sm",
}: PhoneMockupProps) {
  const sizeClasses =
    size === "lg"
      ? "w-[280px] h-[560px] rounded-[36px] p-3"
      : "w-[200px] h-[400px] rounded-[28px] p-2";

  const screenRadius = size === "lg" ? "rounded-3xl" : "rounded-[20px]";

  return (
    <div className={`bg-dark ${sizeClasses} shadow-[0_20px_60px_rgba(0,0,0,0.2)]`}>
      <div
        className={`w-full h-full bg-linear-to-br ${gradient} ${screenRadius} flex items-center justify-center text-white font-bold text-center p-5 ${
          size === "lg" ? "text-2xl" : "text-[0.85rem]"
        }`}
      >
        <span dangerouslySetInnerHTML={{ __html: label }} />
      </div>
    </div>
  );
}
