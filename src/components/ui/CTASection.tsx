import Button from "./Button";

type CTASectionProps = {
  title: string;
  text: string;
  ctaText: string;
  ctaHref: string;
};

export default function CTASection({ title, text, ctaText, ctaHref }: CTASectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#1E1E1E] to-[#141414] border border-[#2A2A2A] border-t-2 border-t-[#E51A1A] text-white text-center py-20 px-6 rounded-2xl my-10 max-w-[1100px] mx-auto">
      <h2 className="text-3xl lg:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-white/70 mb-8 max-w-[500px] mx-auto">{text}</p>
      <Button href={ctaHref}>{ctaText}</Button>
    </div>
  );
}
