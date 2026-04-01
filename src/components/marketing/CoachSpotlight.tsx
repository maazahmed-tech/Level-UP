import Image from "next/image";
import Link from "next/link";

const features = [
  "Custom training & nutrition programme",
  "Weekly accountability check-ins",
  "Direct messaging for questions & support",
  "Full Hub access included free",
];

export default function CoachSpotlight() {
  return (
    <section className="bg-[#0A0A0A] py-20 px-6">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Coach Image */}
        <div className="relative h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-[#2A2A2A]">
          <Image
            src="/images/Coach_4.jpeg"
            alt="Coach Raheel"
            fill
            className="object-cover"
          />
        </div>

        {/* Content */}
        <div>
          <span className="inline-block bg-[#E51A1A]/10 text-[#E51A1A] text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full mb-6">
            1:1 Coaching
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Train With Coach Raheel
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            Coach Raheel is a qualified Athletic Therapist (B.Sc Hons) and Personal Trainer
            who specialises in fat loss and body recomposition. His approach is simple: no fad
            diets, no extreme restrictions — just science-backed nutrition and training that
            fits your life. Every coaching client gets a fully personalised programme designed
            around their schedule, preferences, and goals.
          </p>

          <ul className="space-y-4 mb-8">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-white/80">
                <svg className="w-5 h-5 text-[#E51A1A] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/coaching/apply"
            className="inline-block bg-[#E51A1A] hover:bg-[#C41010] text-white font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-wider transition-colors"
          >
            Apply for Coaching
          </Link>
          <p className="text-white/40 text-xs mt-4">
            Limited spots available. Applications reviewed within 48 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
