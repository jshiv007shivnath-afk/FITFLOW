'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import './ScrollExpand.css';

export interface ScrollExpandProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startWidthPercent?: number; // e.g. 32vw
  startHeightVh?: number; // e.g. 44vh
  startRadius?: number; // e.g. 24px
  overlayScrim?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '/runner_hero.jpg',
  mediaType = 'image',
  poster = '',
  alt = 'Athletic Runner in Motion',
  title = 'Every Stride, Every Milestone',
  scrollHint = 'Scroll to expand',
  startWidthPercent = 32,
  startHeightVh = 44,
  startRadius = 24,
  overlayScrim = 0.55,
  children,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track progress while pinned inside the 320vh track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 38,
    restDelta: 0.001,
  });

  // Stage 1 (0 -> 0.58): Expand small card to 100vw x 100vh full screen
  const width = useTransform(
    smoothProgress,
    [0, 0.58],
    [`clamp(260px, ${startWidthPercent}vw, 420px)`, '100vw']
  );
  const height = useTransform(
    smoothProgress,
    [0, 0.58],
    [`${startHeightVh}vh`, '100vh']
  );
  const borderRadius = useTransform(smoothProgress, [0, 0.58], [startRadius, 0]);

  // Scrim opacity
  const scrimOpacity = useTransform(smoothProgress, [0.15, 0.65], [0.15, overlayScrim]);

  // Initial title & scroll hint (fade out as frame expands)
  const titleOpacity = useTransform(smoothProgress, [0.04, 0.25], [1, 0]);
  const titleY = useTransform(smoothProgress, [0.04, 0.25], [0, -30]);
  const hintOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

  // Stage 2 (0.58 -> 0.90): Fullscreen pinned hold with overlay content reveal
  const overlayOpacity = useTransform(smoothProgress, [0.58, 0.76], [0, 1]);
  const overlayY = useTransform(smoothProgress, [0.58, 0.76], [30, 0]);

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-track ${className}`.trim()}
      style={style}
    >
      {/* Pinned Sticky Viewport (100vh x 100vw) */}
      <div className="scroll-expand-stage">
        <motion.div
          className="scroll-expand-frame"
          style={{
            width,
            height,
            borderRadius,
          }}
        >
          {/* Ambient Blurred Backdrop so full screen always looks rich & atmospheric */}
          <div className="scroll-expand-ambient-backdrop" aria-hidden="true">
            <img src={src} alt="" className="scroll-expand-ambient-img" />
          </div>

          {/* Crisp Centered Runner Image - Entire runner is 100% visible */}
          <div className="scroll-expand-media-wrapper">
            {mediaType === 'video' ? (
              <video
                src={src}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                className="scroll-expand-main-media"
              />
            ) : (
              <img
                src={src}
                alt={alt}
                className="scroll-expand-main-media"
              />
            )}
          </div>

          {/* Dark Gradient Scrim */}
          <motion.div
            className="scroll-expand-scrim"
            style={{ opacity: scrimOpacity }}
          />

          {/* Resting Title & Scroll Hint */}
          {title && (
            <motion.div
              className="scroll-expand-title-layer"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <h2>{title}</h2>
              {scrollHint && (
                <motion.div
                  className="scroll-expand-hint-badge"
                  style={{ opacity: hintOpacity }}
                >
                  <span>{scrollHint} ↓</span>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Fullscreen Overlay Content (Revealed after expansion) */}
          {children && (
            <motion.div
              className="scroll-expand-overlay-layer"
              style={{ opacity: overlayOpacity, y: overlayY }}
            >
              {children}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ScrollExpand;
