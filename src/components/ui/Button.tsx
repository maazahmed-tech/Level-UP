import Link from "next/link";
import { clsx } from "clsx";

type ButtonProps = {
  variant?: "primary" | "outline" | "white" | "dark" | "accent";
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-[#E51A1A] text-white hover:bg-[#C41010] hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(229,26,26,0.4)]",
  outline:
    "bg-transparent text-[#E51A1A] border-2 border-[#E51A1A] hover:bg-[#E51A1A] hover:text-white",
  white: "bg-[#1E1E1E] text-[#0A0A0A] hover:bg-[#F5F5F5]",
  dark: "bg-[#1E1E1E] text-white hover:bg-[#2A2A2A]",
  accent:
    "bg-[#FF6B00] text-white hover:bg-[#E55F00] hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(255,107,0,0.4)]",
};

export default function Button({
  variant = "primary",
  href,
  className,
  children,
  onClick,
  type = "button",
  fullWidth,
}: ButtonProps) {
  const classes = clsx(
    "inline-block px-10 py-3.5 rounded-full text-base font-bold uppercase tracking-wider cursor-pointer border-none transition-all duration-300 text-center",
    variants[variant],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
