import Link from "next/link";

const hubFeatures = [
  "400+ macro-friendly recipes with video guides",
  "Calorie & macro calculator",
  "Daily meal tracker",
  "Restaurant survival guides (50+ chains)",
  "Progress tracker with charts",
  "Lifetime access, no subscription",
];

const coachingPackages = [
  {
    name: "8-Week Transform",
    price: "\u20AC399",
    period: "",
    features: [
      "Custom training programme",
      "Personalised nutrition plan",
      "Weekly check-ins with Coach Raheel",
      "Direct messaging support",
      "Full Hub access included",
    ],
  },
  {
    name: "12-Week Evolution",
    price: "\u20AC599",
    period: "",
    features: [
      "Everything in 8-Week",
      "Bi-weekly progress reviews",
      "Programme adjustments",
      "Priority support",
    ],
  },
  {
    name: "Long-Term Coaching",
    price: "\u20AC149",
    period: "/month",
    features: [
      "Ongoing personalised programming",
      "Monthly programme updates",
      "Unlimited messaging",
      "Full Hub access included",
    ],
  },
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function TierComparison() {
  return (
    <section className="bg-[#111111] py-20 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Choose Your Path</h2>
          <p className="text-white/60 text-lg">Two ways to transform. Pick what works for you.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* The Hub Card */}
          <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl overflow-hidden flex flex-col">
            <div className="bg-[#FF6B00] text-white text-center py-2 text-sm font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <div className="p-8 flex flex-col flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">The Hub</h3>
              <div className="mb-6">
                <span className="text-5xl font-black text-white">&euro;79</span>
                <span className="text-white/50 text-sm ml-2">one-time payment</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {hubFeatures.map((feature) => (
                  <li key={feature} className="flex gap-3 text-white/80 text-sm">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/checkout"
                className="block text-center bg-[#E51A1A] hover:bg-[#C41010] text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Coaching Packages */}
          <div className="space-y-6">
            <div className="bg-[#E51A1A] text-white text-center py-2 text-sm font-bold uppercase tracking-wider rounded-t-2xl">
              Includes Hub Access
            </div>
            {coachingPackages.map((pkg) => (
              <div
                key={pkg.name}
                className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl p-6"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <div>
                    <span className="text-3xl font-black text-white">{pkg.price}</span>
                    {pkg.period && <span className="text-white/50 text-sm">{pkg.period}</span>}
                  </div>
                </div>
                <ul className="space-y-2 mb-5">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex gap-3 text-white/70 text-sm">
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/coaching/apply"
                  className="block text-center border border-white/20 hover:border-white/40 text-white font-bold py-3 rounded-xl text-sm uppercase tracking-wider transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
