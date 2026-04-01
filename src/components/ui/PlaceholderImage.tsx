import { clsx } from "clsx";

type PlaceholderImageProps = {
  width?: number | string;
  height?: number | string;
  text?: string;
  emoji?: string;
  className?: string;
};

export default function PlaceholderImage({
  width = "100%",
  height = 300,
  text,
  emoji,
  className,
}: PlaceholderImageProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-beige to-light select-none",
        className
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    >
      {emoji && <span className="text-4xl mb-2">{emoji}</span>}
      {text && (
        <span className="text-sm font-medium text-white/30 text-center px-4">
          {text}
        </span>
      )}
    </div>
  );
}
