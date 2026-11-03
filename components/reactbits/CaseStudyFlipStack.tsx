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
  hint?: string;
  heading?: string;
  endLabel?: string;
}

const DEFAULT_ITEMS: CaseStudyFlipItem[] = [
  {
    eyebrow: "Strength & Overload",
    title: "Structured periodization with automated RPE fatigue limits",
    description:
      "Athletes log every set and rep with instant rest intervals, tracking progressive overload without spreadsheets or cognitive overload.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "Athlete training with barbell",
    background: "#0c0e14",
    foreground: "#ffffff",
  },
  {
    eyebrow: "Biometric Telemetry",
    title: "Real-time BLE sensor sync with sub-14ms stream latency",
    description:
      "Direct connection to Bluetooth chest straps and smartwatches delivers pure, zero-cloud cardiac telemetry straight into your active session.",
    image:
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "Athlete monitoring biometric heart rate",
    background: "#18120d",
    foreground: "#fff7ed",
  },
  {
    eyebrow: "Metabolic Hydration",
    title: "Sweat-adjusted fluid benchmarks for sustained peak output",
    description:
      "Circadian hydration pacing accounts for ambient temperature and training load, keeping intracellular balance and power output optimal.",
    image:
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "Hydrated athlete recovering post workout",
    background: "#0d161a",
    foreground: "#ecfeff",
  },
  {
    eyebrow: "Discipline Architecture",
    title: "Symmetric XP and 21-day streaks that reward honest effort",
    description:
      "No toxic engagement traps or fake AI guilt. True discipline builds through verified reps, milestone badges, and offline data sovereignty.",
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1400&q=90&auto=format&fit=crop",
    imageAlt: "Dedicated athlete maintaining daily streak",
    background: "#11141e",
    foreground: "#f3f1ff",
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
  const stackedCardGap = Math.min(24, 72 / Math.max(total - 1, 1));
  const stackedOffset = index * stackedCardGap;
  const restingOffset = Math.min(index * 12, 34);
  const restingScale = 1 - Math.min(index * 0.012, 0.035);

  const exitYPercent = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, -118],
  );
  const exitStackOffset = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, stackedOffset],
  );
  const exitY = useMotionTemplate`calc(${exitYPercent}% + ${exitStackOffset}px)`;
  const rotateX = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [0, 0] : [0, 22],
  );
  const opacity = useTransform(
    progress,
    [exitStart, exitEnd],
    reduceMotion ? [1, 0] : [1, 1],
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
      className="absolute inset-x-0 top-0 aspect-[3/4] will-change-transform sm:aspect-[1.76/1]"
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
        className="grid h-full overflow-hidden rounded-[clamp(18px,2vw,30px)] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 sm:grid-cols-[1.15fr_0.85fr]"
        style={{
          backgroundColor: item.background,
          color: item.foreground ?? "white",
          y: entryY,
          scale: entryScale,
          transformOrigin: "50% 100%",
        }}
      >
        <div className="flex min-w-0 flex-col p-[clamp(24px,3vw,48px)] md:pr-[clamp(22px,3vw,48px)]">
          <div className="flex items-start">
            <span className="text-[clamp(24px,2.5vw,36px)] font-bold leading-none tracking-[-0.06em] text-[#FF5500]">
              {item.number ?? String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="mt-auto max-w-[46rem] pt-8">
            <p className="mb-[clamp(10px,1.5vw,22px)] text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF7A00]">
              {item.eyebrow}
            </p>
            <h3 className="max-w-[16ch] text-balance text-[clamp(26px,3vw,44px)] font-extrabold leading-[1.05] tracking-tight">
              {item.title}
            </h3>
            <p className="mt-[clamp(14px,1.6vw,20px)] max-w-[42rem] text-[clamp(13px,1.1vw,15px)] leading-[1.6] opacity-80 font-normal">
              {item.description}
            </p>
          </div>
        </div>

        <div className="relative m-[clamp(10px,1.2vw,18px)] min-h-[180px] overflow-hidden rounded-[clamp(12px,1.4vw,22px)] sm:ml-0">
          <img
            src={item.image}
            alt={item.imageAlt}
            className="h-full w-full object-cover"
            loading={index < 2 ? "eager" : "lazy"}
            draggable={false}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10" />
        </div>
      </motion.div>
    </motion.article>
  );
}

export function CaseStudyFlipStack({
  items = DEFAULT_ITEMS,
  className,
  hint = "Scroll Down",
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
    stiffness: 120,
    damping: 22,
    mass: 0.8,
    restDelta: 0.0005,
  });
  const cardProgress = reduceMotion ? scrollYProgress : smoothProgress;

  return (
    <section
      id="flip-stack"
      className={cn("relative bg-neutral-950 font-['Manrope',sans-serif] text-white selection:bg-[#FF5500] selection:text-white", className)}
    >
      <div className="relative h-[65vh] min-h-[500px] overflow-hidden px-5 sm:px-10 flex flex-col justify-center items-center text-center">
        <div className="flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest text-[#FF5500] mb-6">
          <motion.span
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            ↓
          </motion.span>
          <span>{hint}</span>
          <motion.span
            aria-hidden="true"
            animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
            transition={{
              duration: 1.4,
              delay: 0.18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ↓
          </motion.span>
        </div>

        <h2 className="max-w-[20ch] text-center text-[clamp(36px,5vw,72px)] font-extrabold leading-[1.05] tracking-tight text-white [text-wrap:balance]">
          {heading}
        </h2>
      </div>

      <div
        ref={stackRef}
        className="relative"
        style={{ height: `${(Math.max(safeItems.length, 1) + 1) * 100}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-[clamp(14px,4vw,64px)] py-8">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[860px] [perspective:800px] sm:aspect-[1.76/1]">
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

      <div className="flex min-h-[60vh] items-center justify-center px-5 sm:px-10 py-20 border-t border-white/10">
        <p className="text-center text-[clamp(38px,6vw,96px)] font-extrabold leading-none tracking-tight text-white [text-wrap:balance]">
          {endLabel}
        </p>
      </div>
    </section>
  );
}
