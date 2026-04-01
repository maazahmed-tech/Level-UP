type FeatureItemProps = {
  label: string;
  title: string;
  items: string[];
  description?: string;
  emoji: string;
  reverse?: boolean;
};

export default function FeatureItem({
  label,
  title,
  items,
  description,
  emoji,
  reverse,
}: FeatureItemProps) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-15 items-center py-15 border-b border-[#222] last:border-b-0`}
    >
      <div className={reverse ? "lg:order-2" : ""}>
        <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-[0.8rem] font-semibold uppercase mb-3">
          {label}
        </span>
        <h3 className="text-[1.6rem] font-bold mb-4">{title}</h3>
        {description && (
          <p className="text-white/70 mb-4">{description}</p>
        )}
        <ul className="mt-3">
          {items.map((item, i) => (
            <li
              key={i}
              className="py-1.5 pl-6 relative text-white/70 before:content-['•'] before:absolute before:left-0 before:text-primary before:font-bold before:text-[1.2em]"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`bg-linear-to-br from-beige to-light rounded-2xl h-[300px] flex items-center justify-center text-[3rem] text-primary/30 ${
          reverse ? "lg:order-1" : ""
        }`}
      >
        {emoji}
      </div>
    </div>
  );
}
