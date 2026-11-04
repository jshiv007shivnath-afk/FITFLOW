// @ts-nocheck
"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

export interface CaseStudyFlipItem {
  number?: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  background: string;
  foreground?: string;
}

interface CaseStudyFlipStackProps {
  items?: CaseStudyFlipItem[];
  className?: string;
  heading?: string;
  endLabel?: string;
}

const DEFAULT_ITEMS: CaseStudyFlipItem[] = [
  {
    number: "01",
    eyebrow: "Daily Dashboard & Activity",
    title: "Real-time calorie burn and step telemetry at a glance",
    description:
      "Monitor daily energy expenditure, active movement streaks, and ambient hydration targets with instant syncing directly from your device.",
    image: "/screens/screen_home.png",
    imageAlt: "FitFlow Dashboard with daily progress, calorie burn, and step tracking",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
  {
    number: "02",
    eyebrow: "Workout Tracking & Overload",
    title: "Structured periodization with automated RPE fatigue limits",
    description:
      "Log every set, rep, and load with intelligent rest intervals and progressive overload volume suggestions designed for serious lifters.",
    image: "/screens/screen_progress.png",
    imageAlt: "FitFlow Workout Progress with load metrics and training volume",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
  {
    number: "03",
    eyebrow: "Habit Streaks & Milestone Badges",
    title: "Symmetric XP and discipline rewards that build consistency",
    description:
      "Level up your athlete profile with real streak shields, milestone trophies, and verified training records without fake AI guilt.",
    image: "/screens/screen_rewards.png",
    imageAlt: "FitFlow Rewards and Streaks interface showing badges and athlete XP",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
  {
    number: "04",
    eyebrow: "Circadian Recovery & Sleep Sync",
    title: "Biometric heart rate zones and recovery readiness",
    description:
      "Sub-14ms Bluetooth telemetry pairs with your chest strap or wearable to map HRV, resting pulse, and circadian recovery windows.",
    image: "/screens/screen_profile.png",
    imageAlt: "FitFlow Profile and biometric recovery analytics",
    background: "#ffffff",
    foreground: "#0a0a0a",
  },
];

function FlipCard({
  item,
  index,
  total,
  progress,
  reduceMotion,
}: {
  item: CaseStudyFlipItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const isLastCard = index === total - 1;
  const segment = 1 / Math.max(total, 1);
  const start = index * segment;
  const end = Math.min(start + segment, 1);
  const entryStart = Math.max(0, start - segment);
  const entryEnd =
    index === 0
      ? 0.0001
      : Math.min(start, entryStart + segment * 0.7);
  const exitStart = start;
  const exitEnd = end;
  const stackedCardGap = Math.min(20, 60 / Math.max(total - 1, 1));
  const stackedOffset = index * stackedCardGap;
  const restingOffset = Math.min(index * 10, 28);
  const restingScale = 1 - Math.min(index * 0.012, 0.035);

  const exitYPercent = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion || isLastCard ? [0, 0] : [0, -114],
  );
  const exitStackOffset = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion || isLastCard ? [0, 0] : [0, stackedOffset],
  );
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`;
  const rotateX = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion || isLastCard ? [0, 0] : [0, 20],
  );
  const opacity = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion || isLastCard ? [1, 1] : [1, 1],
  );
  const entryScale = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [1, 1] : [restingScale, 1],
  );
  const entryY = useTransform(
    progress,
    [entryStart, entryEnd],
    index === 0 ? [0, 0] : [restingOffset, 0],
  );

  return (
    <motion.article
      className="absolute inset-x-0 top-0 aspect-[4/5] will-change-transform sm:aspect-[1.8/1]"
      style={{
        y: exitY,
        rotateX,
        opacity,
        zIndex: total - index,
        transformOrigin: "50% 50%",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
    >
      <motion.div
        className="grid h-full overflow-hidden rounded-3xl shadow-[0_16px_50px_rgba(0,0,0,0.08)] border border-neutral-200/90 sm:grid-cols-[1.1fr_0.9fr] bg-white"
        style={{
          backgroundColor: item.background,
          color: item.foreground ?? "#0a0a0a",
          y: entryY,
          scale: entryScale,
          transformOrigin: "50% 100%",
        }}
      >
        <div className="flex min-w-0 flex-col p-6 sm:p-8 md:p-10">
          <div className="flex items-start">
            <span className="text-2xl sm:text-3xl font-extrabold leading-none tracking-tight text-[#C2410C]">
              {item.number ?? String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-auto max-w-xl pt-4 sm:pt-6">
            <p className="mb-2 text-xs font-bold tracking-wide text-[#9A3412]">
              {item.eyebrow}
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight tracking-tight text-neutral-950">
              {item.title}
            </h3>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-neutral-700 font-normal">
              {item.description}
            </p>
          </div>
        </div>

        <div className="relative m-3 sm:m-4 min-h-[180px] overflow-hidden rounded-2xl border border-neutral-200/80 bg-neutral-100 flex items-center justify-center p-2 sm:p-3">
          <div className="w-full max-w-[280px] sm:max-w-[340px] h-full overflow-hidden rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-neutral-200/90 bg-white">
            <img
              src={item.image}
              alt={item.imageAlt}
              className="h-full w-full object-cover object-top"
              loading={index < 2 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function CaseStudyFlipStack({
  items = DEFAULT_ITEMS,
  className,
  heading = "Tactile Engineering That Delivers",
  endLabel = "Train With Precision",
}: CaseStudyFlipStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    mass: 0.7,
    restDelta: 0.0005,
  });
  const cardProgress = reduceMotion ? scrollYProgress : smoothProgress;

  return (
    <section
      id="flip-stack"
      className={cn("relative bg-white font-['Manrope',sans-serif] text-neutral-950 selection:bg-[#FF5500] selection:text-white border-t border-neutral-100", className)}
    >
      {/* Tight, Clean Section Header (No massive empty gap, No "Scroll to flip" badge) */}
      <div className="pt-12 pb-6 px-4 sm:px-8 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-neutral-950 [text-wrap:balance]">
          {heading}
        </h2>
        <p className="mt-3 text-xs sm:text-base text-neutral-600 max-w-md mx-auto">
          Every screen built for speed, focus, and local-first reliability.
        </p>
      </div>

      {/* Cards Pinned Container: Tight 48vh-per-item scroll travel without dead white space */}
      <div
        ref={stackRef}
        className="relative"
        style={{ height: `${Math.max(safeItems.length - 0.5, 1) * 48}vh` }}
      >
        <div className="sticky top-0 flex h-[78vh] sm:h-[84vh] flex-col justify-center overflow-hidden px-4 sm:px-8 py-2">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[840px] [perspective:800px] sm:aspect-[1.8/1]">
            {[...safeItems].reverse().map((item, reverseIndex) => {
              const index = safeItems.length - reverseIndex - 1;
              return (
                <FlipCard
                  key={`${item.title}-${index}`}
                  item={item}
                  index={index}
                  total={safeItems.length}
                  progress={cardProgress}
                  reduceMotion={reduceMotion}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Clean White Banner Section for Image 2 ("Train With Precision") */}
      <div className="w-full bg-white text-neutral-950 py-12 sm:py-16 px-4 sm:px-8 border-t border-neutral-100 flex flex-col items-center justify-center text-center">
        <span className="text-xs font-bold text-[#9A3412] tracking-wider mb-2">
          Zero Distractions
        </span>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-neutral-950 max-w-3xl [text-wrap:balance]">
          {endLabel}
        </h2>
        <p className="mt-2 text-xs sm:text-base text-neutral-600 max-w-md">
          Track workouts without lag, complex spreadsheets, or battery drain.
        </p>
      </div>
    </section>
  );
}
