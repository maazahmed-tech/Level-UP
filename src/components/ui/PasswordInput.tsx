"use client";

import { useState } from "react";

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  id?: string;
  required?: boolean;
  className?: string;
}

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  id,
  required,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={className || "w-full py-3.5 px-5 pr-12 border-2 border-[#2A2A2A] rounded-xl text-base bg-[#1E1E1E] focus:border-primary focus:outline-none transition-colors"}
        style={{ paddingRight: "3rem" }}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors bg-transparent border-none cursor-pointer p-1"
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? (
          /* Eye open - password visible */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          /* Eye closed - password hidden */
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        )}
      </button>
    </div>
  );
}
