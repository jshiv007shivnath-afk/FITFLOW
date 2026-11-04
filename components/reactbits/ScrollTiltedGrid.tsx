// @ts-nocheck
"use client";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";
import ReactLenis from "lenis/react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface ScrollTiltedGridImage {
  src: string;
  alt: string;
}

export interface ScrollTiltedGridProps {
  images: readonly ScrollTiltedGridImage[];
  loop?: boolean;
  initialCycles?: number;
  maxCycles?: number;
  smoothScroll?: boolean;
  aspectRatio?: string;
  perspective?: number;
  maxTilt?: number;
  maxBlur?: number;
  rounded?: string;
  sectionPadding?: string;
  className?: string;
}

type TileVariables = CSSProperties & {
  "--tile-blur": string;
  "--tile-brightness": number;
  "--tile-saturation": number;
  "--tile-transform": string;
  "--tile-image-scale": number;
};

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function GalleryTile({
  image,
  index,
  aspectRatio,
  perspective,
  maxTilt,
  maxBlur,
  rounded,
  reduceMotion,
}: {
  image: ScrollTiltedGridImage;
  index: number;
  aspectRatio: string;
  perspective: number;
  maxTilt: number;
  maxBlur: number;
  rounded: string;
  reduceMotion: boolean;
}) {
  const tileRef = useRef<HTMLElement>(null);
  const side = index % 2 === 0 ? -1 : 1;

  useEffect(() => {
    const tile = tileRef.current;
    if (!tile || reduceMotion) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = tile.getBoundingClientRect();
      const travel = window.innerHeight + rect.height;
      const position = clamp((window.innerHeight - rect.top) / travel);
      const distance = Math.abs(position - 0.5) * 2;
      const signed = (position - 0.5) * 2;
      const eased = distance * distance * (3 - 2 * distance);
      const x = side * eased * 14;
      const y = -signed * eased * 18;
      const tilt = -signed * maxTilt;
      const roll = side * signed * 2.5;
      const skew = -side * signed * 5;

      tile.style.setProperty("--tile-blur", `${eased * maxBlur}px`);
      tile.style.setProperty("--tile-brightness", String(1 - eased * 0.35));
      tile.style.setProperty("--tile-saturation", String(1 - eased * 0.35));
      tile.style.setProperty("--tile-image-scale", String(1.02 + eased * 0.1));
      tile.style.setProperty(
        "--tile-transform",
        `translate3d(${x}%, ${y}%, ${eased * 120}px) rotateX(${tilt}deg) rotateZ(${roll}deg) skewX(${skew}deg)`,
      );
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(tile);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [maxBlur, maxTilt, reduceMotion, side]);

  const variables: TileVariables = {
    aspectRatio,
    borderRadius: rounded,
    perspective,
    "--tile-blur": "0px",
    "--tile-brightness": 1,
    "--tile-saturation": 1,
    "--tile-transform": "translate3d(0, 0, 0)",
    "--tile-image-scale": 1.02,
  };

  return (
    <figure
      ref={tileRef}
      className={cn("m-0", side > 0 && "pt-8 sm:pt-16")}
      style={variables}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden border border-neutral-200/80 bg-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-neutral-950 dark:shadow-[0_24px_90px_rgba(0,0,0,0.5)]",
          !reduceMotion &&
            "[filter:blur(var(--tile-blur))_brightness(var(--tile-brightness))_saturate(var(--tile-saturation))] [transform:var(--tile-transform)] [transform-style:preserve-3d]",
        )}
        style={{ aspectRatio, borderRadius: rounded }}
      >
        <img
          src={image.src}
          alt={image.alt}
          className={cn(
            "h-full w-full object-cover object-top",
            !reduceMotion && "[transform:scale(var(--tile-image-scale))]",
          )}
          loading={index < 4 ? "eager" : "lazy"}
          draggable={false}
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20" />
      </div>
    </figure>
  );
}

export function ScrollTiltedGrid({
  images,
  loop = false,
  initialCycles = 2,
  maxCycles = 4,
  smoothScroll = false,
  aspectRatio = "9 / 16",
  perspective = 1000,
  maxTilt = 32,
  maxBlur = 4,
  rounded = "1.25rem",
  sectionPadding = "6vh",
  className,
}: ScrollTiltedGridProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const cycleLimit = Math.max(1, maxCycles);
  const [cycleCount, setCycleCount] = useState(() =>
    clamp(initialCycles, 1, cycleLimit),
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const marker = loadMoreRef.current;
    if (!loop || !marker) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setCycleCount((count) => Math.min(cycleLimit, count + 1));
        }
      },
      { rootMargin: "1200px 0px" },
    );
    observer.observe(marker);
    return () => observer.disconnect();
  }, [cycleLimit, loop]);

  const tiles = useMemo(
    () =>
      Array.from({ length: loop ? cycleCount : 1 }, (_, cycle) =>
        images.map((image, index) => ({ cycle, image, index })),
      ).flat(),
    [cycleCount, images, loop],
  );

  const gallery = (
    <section
      className={cn("relative w-full overflow-hidden bg-black py-12 sm:py-20 text-white", className)}
      aria-label="Scroll-reactive image gallery"
    >
      <div className="mx-auto max-w-4xl px-4 text-center mb-8 sm:mb-12">
        <span className="inline-block px-3.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
          App Interface
        </span>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Every Screen Designed For Athletes
        </h2>
        <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-lg mx-auto">
          High-contrast telemetry, distraction-free rest timers, and biometric health feeds built for your wrist and pocket.
        </p>
      </div>

      <div
        className="mx-auto grid w-full max-w-5xl grid-cols-2 items-start gap-x-4 gap-y-8 px-4 sm:gap-x-10 sm:gap-y-16 sm:px-10 lg:gap-x-14"
        style={{ paddingBlock: sectionPadding }}
      >
        {tiles.map(({ cycle, image, index }) => (
          <GalleryTile
            key={`${cycle}-${index}-${image.src}`}
            image={image}
            index={index}
            aspectRatio={aspectRatio}
            perspective={perspective}
            maxTilt={maxTilt}
            maxBlur={maxBlur}
            rounded={rounded}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
      {loop && cycleCount < cycleLimit ? (
        <div ref={loadMoreRef} className="h-px" aria-hidden />
      ) : null}
    </section>
  );

  return smoothScroll && !reduceMotion ? (
    <ReactLenis
      root
      options={{ autoRaf: true, lerp: 0.075, wheelMultiplier: 0.85 }}
    >
      {gallery}
    </ReactLenis>
  ) : (
    gallery
  );
}
