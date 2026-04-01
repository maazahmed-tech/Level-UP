import { clsx } from "clsx";

type SectionProps = {
  bg?: "cream" | "light" | "dark" | "beige";
  className?: string;
  children: React.ReactNode;
  id?: string;
};

const bgMap = {
  cream: "bg-[#0A0A0A]",
  light: "bg-[#111111]",
  dark: "bg-[#0A0A0A] text-white",
  beige: "bg-[#1A1A1A]",
};

export default function Section({ bg = "cream", className, children, id }: SectionProps) {
  return (
    <section id={id} className={clsx("py-20", bgMap[bg], className)}>
      <div className="max-w-[1200px] mx-auto px-6">{children}</div>
    </section>
  );
}
