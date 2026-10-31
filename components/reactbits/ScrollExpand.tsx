'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import './ScrollExpand.css';

export interface ScrollExpandProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidth?: number; // e.g. 42 (vw)
  startHeight?: number; // e.g. 56 (vh)
  startRadius?: number; // e.g. 28 (px)
  endRadius?: number; // e.g. 0 (px)
  mediaZoom?: number; // e.g. 1.2
  overlayScrim?: number; // e.g. 0.4
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '/runner_hero.jpg',
  mediaType = 'image',
  poster = '',
  alt = 'FitFlow Athletic Runner',
  title = 'Track Every Motion',
  scrollHint = 'SCROLL',
  startWidth = 42,
  startHeight = 56,
  startRadius = 28,
  endRadius = 0,
  mediaZoom = 1.2,
  overlayScrim = 0.4,
  children,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (mediaType === 'video' && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [mediaType, src]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. Track scroll progress (0 to 1) of the 300vh outer track container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // 2. Eliminate scroll wheel step-jumping via useSpring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    mass: 0.5,
  });

  // 3. Map progress [0.05, 0.75] to video container dimensions (Centered Symmetrical Expansion)
  const initialWidth = isMobile ? '88vw' : `${startWidth}vw`;
  const width = useTransform(smoothProgress, [0.05, 0.75], [initialWidth, '100vw']);
  const height = useTransform(smoothProgress, [0.05, 0.75], [`${startHeight}vh`, '100vh']);
  const borderRadius = useTransform(smoothProgress, [0.05, 0.75], [`${startRadius}px`, `${endRadius}px`]);

  // Parallax subtle counter-zoom on media (kept full zoom for mobile/iOS, calibrated for desktop framing)
  const initialScale = isMobile ? mediaZoom : Math.min(mediaZoom, 1.08);
  const mediaScale = useTransform(smoothProgress, [0.05, 0.75], [initialScale, 1]);

  // Contrast overlay (bg-black/30 - bg-black/40) fades in between [0.5, 0.75]
  const scrimOpacity = useTransform(smoothProgress, [0.5, 0.75], [0, overlayScrim]);

  // 4. Two-Stage Content Crossfade Choreography
  // Stage 1 Overlay ("Track Every Motion" + "SCROLL ↓" badge): [0, 0.28]
  const stage1Opacity = useTransform(smoothProgress, [0, 0.28], [1, 0]);
  const stage1Scale = useTransform(smoothProgress, [0, 0.28], [1, 0.92]);
  const stage1Y = useTransform(smoothProgress, [0, 0.28], [0, -20]);
  const stage1PointerEvents = useTransform(smoothProgress, (p) => (p > 0.28 ? 'none' : 'auto'));

  // Stage 2 Overlay ("SMART FITNESS ENGINE" + "Every Rep, Every Milestone" + CTA): [0.65, 0.88]
  // Holds fully expanded state from 0.88 to 1.0 before unpinning
  const stage2Opacity = useTransform(smoothProgress, [0.65, 0.88], [0, 1]);
  const stage2Y = useTransform(smoothProgress, [0.65, 0.88], [35, 0]);
  const stage2Scale = useTransform(smoothProgress, [0.65, 0.88], [0.96, 1]);
  const stage2PointerEvents = useTransform(smoothProgress, (p) => (p >= 0.65 ? 'auto' : 'none'));

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-container relative w-full h-[300vh] bg-white ${className}`.trim()}
      style={style}
      {...rest}
    >
      {/* Viewport Wrapper: Sticky 100vh, perfectly centered */}
      <div
        style={{ position: 'sticky', top: 0 }}
        className="sticky top-0 left-0 w-full h-screen h-[100dvh] flex items-center justify-center overflow-hidden z-20"
      >
        {/* Centered Expanding Video / Media Container */}
        <motion.div
          style={{
            width,
            height,
            borderRadius,
          }}
          className="relative overflow-hidden flex items-center justify-center shadow-2xl bg-[#0b0c0b] will-change-[width,height,border-radius]"
        >
          {/* Inner Media Element */}
          {mediaType === 'video' ? (
            <motion.video
              ref={videoRef}
              style={{ scale: mediaScale }}
              className="w-full h-full object-cover object-center md:object-[center_12%] will-change-transform select-none"
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <motion.img
              style={{ scale: mediaScale }}
              className="w-full h-full object-cover object-center md:object-[center_12%] will-change-transform select-none"
              src={src}
              alt={alt}
              draggable={false}
            />
          )}

          {/* Contrast Scrim Overlay (Fades in [0.5, 0.75]) */}
          <motion.div
            style={{ opacity: scrimOpacity }}
            className="absolute inset-0 bg-black/40 pointer-events-none"
          />

          {/* Stage 1 Overlay: "Track Every Motion" + "SCROLL ↓" badge */}
          <motion.div
            style={{
              opacity: stage1Opacity,
              scale: stage1Scale,
              y: stage1Y,
              pointerEvents: stage1PointerEvents,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-4"
          >
            <h2 className="font-['Manrope'] text-[32px] sm:text-[48px] md:text-[62px] font-extrabold text-white tracking-tight leading-none drop-shadow-2xl max-w-2xl">
              {title}
            </h2>
            {scrollHint && (
              <div className="mt-5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 text-xs font-bold uppercase tracking-widest shadow-md flex items-center gap-1.5">
                <span>{scrollHint}</span>
                <span className="text-sm font-black">↓</span>
              </div>
            )}
          </motion.div>

          {/* Stage 2 Overlay: "SMART FITNESS ENGINE" + "Every Rep, Every Milestone" + CTA */}
          <motion.div
            style={{
              opacity: stage2Opacity,
              y: stage2Y,
              scale: stage2Scale,
              pointerEvents: stage2PointerEvents,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            {children ? (
              children
            ) : (
              <div className="max-w-xl text-white px-4 flex flex-col items-center">
                <span className="px-3.5 py-1 rounded-full bg-[#ffbd5a] text-[#291800] text-[12px] font-bold uppercase tracking-wider mb-3 shadow-md">
                  Smart Fitness Engine
                </span>
                <h2 className="text-[28px] sm:text-[42px] font-bold text-white drop-shadow-md leading-tight mb-3">
                  Every Rep, Every Milestone
                </h2>
                <p className="text-[14px] sm:text-[16px] text-white/90 leading-relaxed mb-6 max-w-lg">
                  FitFlow synchronizes your daily workout sets, water intake, calorie burns, and streak milestones into a fluid, visual experience.
                </p>
                <button
                  type="button"
                  className="px-7 py-3 rounded-full bg-[#ffbd5a] text-[#291800] font-bold text-[14px] hover:scale-105 active:scale-95 transition-transform shadow-lg cursor-pointer"
                >
                  Explore Services & Tracks ↗
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollExpand;
