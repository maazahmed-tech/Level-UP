import { clsx } from "clsx";

type IconProps = {
  className?: string;
};

export function YouTubeIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M23.498 6.186a2.994 2.994 0 0 0-2.112-2.12C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.386.52A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.112 2.12c1.881.52 9.386.52 9.386.52s7.505 0 9.386-.52a2.994 2.994 0 0 0 2.112-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814Z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568Z" fill="#fff" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4.5"
        stroke="#fff"
        strokeWidth="1.5"
        fill="none"
      />
      <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.5" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="#fff" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        d="M16.671 15.469l.547-3.585h-3.437V9.59c0-.981.48-1.938 2.022-1.938H17.3V4.544s-1.4-.238-2.74-.238c-2.796 0-4.623 1.694-4.623 4.762v2.816H6.691v3.585h3.246V24h3.844v-8.531h2.89Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={clsx("flex items-center gap-4", className)}>
      <a
        href="#"
        aria-label="YouTube"
        className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200"
      >
        <YouTubeIcon />
      </a>
      <a
        href="#"
        aria-label="Instagram"
        className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200"
      >
        <InstagramIcon />
      </a>
      <a
        href="#"
        aria-label="Facebook"
        className="opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-200"
      >
        <FacebookIcon />
      </a>
    </div>
  );
}
