"use client";

import { useState } from "react";

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const STEPS = ["Personal", "Fitness", "Goals", "Lifestyle", "Commitment"] as const;

const COUNTRIES = [
  "United Kingdom",
  "United States",
  "Canada",
  "Australia",
  "Ireland",
  "Germany",
  "France",
  "India",
  "Pakistan",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Other",
];

const TRAINING_STYLES = [
  "Weight Training",
  "Cardio",
  "HIIT",
  "Yoga",
  "Sports",
  "None",
];

const PRIMARY_GOALS = [
  { value: "fat-loss", label: "Fat Loss", desc: "Reduce body fat while preserving lean muscle mass" },
  { value: "muscle-gain", label: "Muscle Gain", desc: "Build size, strength and muscular development" },
  { value: "body-recomp", label: "Body Recomposition", desc: "Simultaneously lose fat and build muscle" },
  { value: "general-fitness", label: "General Fitness", desc: "Improve overall health, energy and wellbeing" },
  { value: "sports-performance", label: "Sports Performance", desc: "Enhance athletic ability and sport-specific output" },
];

const TIMEFRAMES = ["8 weeks", "12 weeks", "16 weeks", "6 months", "Long term"];

const WORK_SCHEDULES = ["9-5", "Shift work", "Flexible", "Student", "Other"];

const GYM_ACCESS = ["Full gym", "Home gym", "No equipment", "Mixed"];

const DIET_APPROACHES = [
  "No specific diet",
  "Calorie counting",
  "Keto",
  "Vegan",
  "Vegetarian",
  "Other",
];

const REFERRAL_SOURCES = [
  "Instagram",
  "YouTube",
  "Facebook",
  "Friend",
  "Google",
  "Other",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    desc: "New to structured training or less than 6 months of consistent experience",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    desc: "1-3 years of consistent training with solid foundational knowledge",
  },
  {
    value: "advanced",
    label: "Advanced",
    desc: "3+ years of serious training with strong technique and programming knowledge",
  },
];

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  country: string;
  experienceLevel: string;
  trainingFrequency: string;
  trainingStyles: string[];
  injuries: string;
  primaryGoal: string;
  timeframe: string;
  idealOutcome: string;
  occupation: string;
  workSchedule: string;
  availableDays: string[];
  gymAccess: string;
  dietApproach: string;
  foodRestrictions: string;
  referralSource: string;
  whyCoaching: string;
  anythingElse: string;
  consent: boolean;
};

const INITIAL: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  age: "",
  country: "",
  experienceLevel: "",
  trainingFrequency: "3",
  trainingStyles: [],
  injuries: "",
  primaryGoal: "",
  timeframe: "",
  idealOutcome: "",
  occupation: "",
  workSchedule: "",
  availableDays: [],
  gymAccess: "",
  dietApproach: "",
  foodRestrictions: "",
  referralSource: "",
  whyCoaching: "",
  anythingElse: "",
  consent: false,
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const inputBase =
  "w-full px-4 py-3 border-2 border-[#2A2A2A] rounded-xl bg-[#1E1E1E] text-white focus:border-primary focus:outline-none transition-colors duration-200";

const errorBorder = "border-red-500";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-sm mt-1">{msg}</p>;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  /* --- updaters --- */

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function toggleArray(key: "trainingStyles" | "availableDays", value: string) {
    setForm((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  /* --- validation per step --- */

  function validate(): boolean {
    const e: Partial<Record<keyof FormData, string>> = {};

    if (step === 0) {
      if (!form.firstName.trim()) e.firstName = "First name is required";
      if (!form.lastName.trim()) e.lastName = "Last name is required";
      if (!form.email.trim()) e.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Enter a valid email";
      if (!form.age.trim()) e.age = "Age is required";
      else if (Number(form.age) < 16 || Number(form.age) > 100)
        e.age = "Enter a valid age (16-100)";
      if (!form.country) e.country = "Please select a country";
    }

    if (step === 1) {
      if (!form.experienceLevel) e.experienceLevel = "Please select your experience level";
    }

    if (step === 2) {
      if (!form.primaryGoal) e.primaryGoal = "Please select a primary goal";
      if (!form.timeframe) e.timeframe = "Please select a timeframe";
      if (!form.idealOutcome.trim()) e.idealOutcome = "Please describe your ideal outcome";
    }

    if (step === 4) {
      if (!form.whyCoaching.trim()) e.whyCoaching = "Please tell us why you are interested";
      if (!form.consent) e.consent = "You must accept to continue";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!validate()) return;
    try {
      await fetch("/api/coaching/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Demo mode — proceed anyway
    }
    setSubmitted(true);
  }

  /* ---------------------------------------------------------------- */
  /*  Submitted state                                                 */
  /* ---------------------------------------------------------------- */

  if (submitted) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center bg-cream px-4">
        <div className="bg-[#1E1E1E] rounded-2xl shadow-card max-w-lg w-full p-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Thank You!</h2>
          <p className="text-white/50 leading-relaxed">
            Coach Raheel will review your application and be in touch within 48
            hours.
          </p>
        </div>
      </section>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Progress bar                                                    */
  /* ---------------------------------------------------------------- */

  const progressBar = (
    <div className="flex items-center justify-center gap-0 mb-10 px-2 overflow-x-auto">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center">
          {/* circle + label */}
          <div className="flex flex-col items-center min-w-[56px]">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                i <= step
                  ? "bg-primary text-white"
                  : "bg-dark/10 text-white/30"
              }`}
            >
              {i < step ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span
              className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                i <= step ? "text-primary" : "text-white/30"
              }`}
            >
              {label}
            </span>
          </div>

          {/* connector line */}
          {i < STEPS.length - 1 && (
            <div
              className={`h-0.5 w-8 sm:w-14 mx-1 transition-colors duration-300 ${
                i < step ? "bg-primary" : "bg-dark/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step content                                                    */
  /* ---------------------------------------------------------------- */

  let content: React.ReactNode;

  /* STEP 1 -- Personal */
  if (step === 0) {
    content = (
      <div className="space-y-5">
        <h2 className="text-xl font-bold text-white">Personal Information</h2>
        <p className="text-white/50 text-sm">Tell us a bit about yourself.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* First name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              First Name <span className="text-primary">*</span>
            </label>
            <input
              className={`${inputBase} ${errors.firstName ? errorBorder : ""}`}
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              placeholder="John"
            />
            <FieldError msg={errors.firstName} />
          </div>

          {/* Last name */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Last Name <span className="text-primary">*</span>
            </label>
            <input
              className={`${inputBase} ${errors.lastName ? errorBorder : ""}`}
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              placeholder="Doe"
            />
            <FieldError msg={errors.lastName} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Email Address <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            className={`${inputBase} ${errors.email ? errorBorder : ""}`}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="john@example.com"
          />
          <FieldError msg={errors.email} />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            className={inputBase}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+44 7000 000000"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Age <span className="text-primary">*</span>
            </label>
            <input
              type="number"
              min={16}
              max={100}
              className={`${inputBase} ${errors.age ? errorBorder : ""}`}
              value={form.age}
              onChange={(e) => set("age", e.target.value)}
              placeholder="25"
            />
            <FieldError msg={errors.age} />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Country <span className="text-primary">*</span>
            </label>
            <select
              className={`${inputBase} ${errors.country ? errorBorder : ""}`}
              value={form.country}
              onChange={(e) => set("country", e.target.value)}
            >
              <option value="">Select country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <FieldError msg={errors.country} />
          </div>
        </div>
      </div>
    );
  }

  /* STEP 2 -- Fitness Background */
  if (step === 1) {
    content = (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Fitness Background</h2>
        <p className="text-white/50 text-sm">
          Help us understand where you are right now.
        </p>

        {/* Experience level radio cards */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Experience Level <span className="text-primary">*</span>
          </label>
          <div className="grid sm:grid-cols-3 gap-3">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                type="button"
                onClick={() => set("experienceLevel", lvl.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  form.experienceLevel === lvl.value
                    ? "border-primary bg-primary/5"
                    : "border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#181818]0"
                }`}
              >
                <p className="font-bold text-white text-sm">{lvl.label}</p>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">
                  {lvl.desc}
                </p>
              </button>
            ))}
          </div>
          <FieldError msg={errors.experienceLevel} />
        </div>

        {/* Training frequency */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Current Training Frequency
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={0}
              max={7}
              value={form.trainingFrequency}
              onChange={(e) => set("trainingFrequency", e.target.value)}
              className="flex-1 accent-primary"
            />
            <span className="bg-primary text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center">
              {form.trainingFrequency}
            </span>
          </div>
          <p className="text-xs text-white/30 mt-1">days per week</p>
        </div>

        {/* Training styles */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Training Styles
          </label>
          <div className="flex flex-wrap gap-2">
            {TRAINING_STYLES.map((style) => {
              const active = form.trainingStyles.includes(style);
              return (
                <button
                  key={style}
                  type="button"
                  onClick={() => toggleArray("trainingStyles", style)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200 cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-[#2A2A2A] bg-[#1E1E1E] text-white hover:border-[#181818]0"
                  }`}
                >
                  {style}
                </button>
              );
            })}
          </div>
        </div>

        {/* Injuries */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Injuries or Health Conditions
          </label>
          <textarea
            rows={3}
            className={inputBase}
            value={form.injuries}
            onChange={(e) => set("injuries", e.target.value)}
            placeholder="List any current injuries, health conditions or limitations (optional)"
          />
        </div>
      </div>
    );
  }

  /* STEP 3 -- Goals */
  if (step === 2) {
    content = (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Your Goals</h2>
        <p className="text-white/50 text-sm">
          What do you want to achieve with coaching?
        </p>

        {/* Primary goal radio cards */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Primary Goal <span className="text-primary">*</span>
          </label>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRIMARY_GOALS.map((g) => (
              <button
                key={g.value}
                type="button"
                onClick={() => set("primaryGoal", g.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                  form.primaryGoal === g.value
                    ? "border-primary bg-primary/5"
                    : "border-[#2A2A2A] bg-[#1E1E1E] hover:border-[#181818]0"
                }`}
              >
                <p className="font-bold text-white text-sm">{g.label}</p>
                <p className="text-white/40 text-xs mt-1 leading-relaxed">
                  {g.desc}
                </p>
              </button>
            ))}
          </div>
          <FieldError msg={errors.primaryGoal} />
        </div>

        {/* Timeframe */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Desired Timeframe <span className="text-primary">*</span>
          </label>
          <select
            className={`${inputBase} ${errors.timeframe ? errorBorder : ""}`}
            value={form.timeframe}
            onChange={(e) => set("timeframe", e.target.value)}
          >
            <option value="">Select timeframe</option>
            {TIMEFRAMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <FieldError msg={errors.timeframe} />
        </div>

        {/* Ideal outcome */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Describe Your Ideal Outcome <span className="text-primary">*</span>
          </label>
          <textarea
            rows={4}
            className={`${inputBase} ${errors.idealOutcome ? errorBorder : ""}`}
            value={form.idealOutcome}
            onChange={(e) => set("idealOutcome", e.target.value)}
            placeholder="Where do you want to be at the end of your coaching journey?"
          />
          <FieldError msg={errors.idealOutcome} />
        </div>
      </div>
    );
  }

  /* STEP 4 -- Lifestyle */
  if (step === 3) {
    content = (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Lifestyle</h2>
        <p className="text-white/50 text-sm">
          Help us build a plan that fits your life.
        </p>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Occupation
          </label>
          <input
            className={inputBase}
            value={form.occupation}
            onChange={(e) => set("occupation", e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </div>

        {/* Work schedule */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Work Schedule
          </label>
          <select
            className={inputBase}
            value={form.workSchedule}
            onChange={(e) => set("workSchedule", e.target.value)}
          >
            <option value="">Select schedule</option>
            {WORK_SCHEDULES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Available days */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Available Training Days
          </label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const active = form.availableDays.includes(day);
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleArray("availableDays", day)}
                  className={`w-12 h-12 rounded-xl text-sm font-bold border-2 transition-all duration-200 cursor-pointer ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-[#2A2A2A] bg-[#1E1E1E] text-white hover:border-[#181818]0"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gym access */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Gym Access
          </label>
          <select
            className={inputBase}
            value={form.gymAccess}
            onChange={(e) => set("gymAccess", e.target.value)}
          >
            <option value="">Select gym access</option>
            {GYM_ACCESS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Diet approach */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Current Diet Approach
          </label>
          <select
            className={inputBase}
            value={form.dietApproach}
            onChange={(e) => set("dietApproach", e.target.value)}
          >
            <option value="">Select diet approach</option>
            {DIET_APPROACHES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Food restrictions */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Food Allergies / Restrictions
          </label>
          <textarea
            rows={3}
            className={inputBase}
            value={form.foodRestrictions}
            onChange={(e) => set("foodRestrictions", e.target.value)}
            placeholder="e.g. Lactose intolerant, nut allergy (optional)"
          />
        </div>
      </div>
    );
  }

  /* STEP 5 -- Commitment */
  if (step === 4) {
    content = (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white">Commitment</h2>
        <p className="text-white/50 text-sm">
          Almost there. A few final questions.
        </p>

        {/* Referral */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            How did you hear about Coach Raheel?
          </label>
          <select
            className={inputBase}
            value={form.referralSource}
            onChange={(e) => set("referralSource", e.target.value)}
          >
            <option value="">Select an option</option>
            {REFERRAL_SOURCES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Why coaching */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Why are you interested in coaching?{" "}
            <span className="text-primary">*</span>
          </label>
          <textarea
            rows={4}
            className={`${inputBase} ${errors.whyCoaching ? errorBorder : ""}`}
            value={form.whyCoaching}
            onChange={(e) => set("whyCoaching", e.target.value)}
            placeholder="What made you decide to apply for coaching?"
          />
          <FieldError msg={errors.whyCoaching} />
        </div>

        {/* Anything else */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1">
            Anything else you&apos;d like Coach Raheel to know?
          </label>
          <textarea
            rows={3}
            className={inputBase}
            value={form.anythingElse}
            onChange={(e) => set("anythingElse", e.target.value)}
            placeholder="Optional"
          />
        </div>

        {/* Consent */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="consent"
            checked={form.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-1 w-5 h-5 accent-primary cursor-pointer"
          />
          <label
            htmlFor="consent"
            className={`text-sm leading-relaxed cursor-pointer ${
              errors.consent ? "text-red-500" : "text-white/60"
            }`}
          >
            I understand this is an application and not a guarantee of
            acceptance. <span className="text-primary">*</span>
          </label>
        </div>
        <FieldError msg={errors.consent} />
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Render                                                          */
  /* ---------------------------------------------------------------- */

  return (
    <section className="min-h-[80vh] bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Apply for Coaching
          </h1>
          <p className="text-white/50">
            Fill out the form below and Coach Raheel will be in touch.
          </p>
        </div>

        {/* Progress */}
        {progressBar}

        {/* Card */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow-card p-6 sm:p-8">
          {content}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-[#222]">
            {step > 0 ? (
              <button
                type="button"
                onClick={back}
                className="px-8 py-3 rounded-full font-bold text-white/50 border-2 border-[#2A2A2A] hover:border-[#181818]0 transition-colors duration-200 cursor-pointer"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="px-8 py-3 rounded-full font-bold text-white bg-primary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(244,67,54,0.4)] transition-all duration-300 cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="px-8 py-3 rounded-full font-bold text-white bg-primary hover:bg-primary-hover hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(244,67,54,0.4)] transition-all duration-300 cursor-pointer"
              >
                Submit Application
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
