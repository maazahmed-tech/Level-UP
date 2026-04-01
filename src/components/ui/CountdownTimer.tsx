"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const saleEnd = new Date();
    saleEnd.setDate(saleEnd.getDate() + 3);
    saleEnd.setHours(23, 59, 59, 0);

    function update() {
      const now = new Date();
      const diff = saleEnd.getTime() - now.getTime();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-primary text-white py-10 text-center">
      <h3 className="text-[1.2rem] tracking-[3px] uppercase mb-5 font-bold">
        Sale Ends In
      </h3>
      <div className="flex justify-center gap-8">
        {[
          { value: timeLeft.days, label: "Days" },
          { value: timeLeft.hours, label: "Hours" },
          { value: timeLeft.mins, label: "Mins" },
          { value: timeLeft.secs, label: "Secs" },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <span className="text-5xl font-black block">{unit.value}</span>
            <span className="text-[0.75rem] uppercase tracking-[2px] opacity-80">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
