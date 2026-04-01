import Button from "./Button";

type PricingBoxProps = {
  price: number;
  oldPrice: number;
  note: string;
  oldNote?: string;
  ctaText: string;
  ctaHref: string;
  centered?: boolean;
};

export default function PricingBox({
  price,
  oldPrice,
  note,
  oldNote,
  ctaText,
  ctaHref,
  centered,
}: PricingBoxProps) {
  return (
    <div
      className={`bg-dark text-white py-7 px-10 rounded-2xl flex items-center flex-wrap gap-5 mt-10 ${
        centered ? "max-w-[700px] mx-auto justify-center text-center" : "justify-between"
      }`}
    >
      <div>
        <span className="text-5xl font-black">
          <span className="text-2xl align-super">&euro;</span>
          {price}
        </span>
        <span className="line-through text-white/50 text-2xl ml-3">
          &euro;{oldPrice}
        </span>
        <p className="text-white/70 text-[0.9rem] mt-2">
          {note} {oldNote && <s className="text-white/40">{oldNote}</s>}
        </p>
      </div>
      <Button href={ctaHref}>{ctaText}</Button>
    </div>
  );
}
