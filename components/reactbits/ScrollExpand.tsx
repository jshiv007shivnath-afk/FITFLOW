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
  startWidth?: number; // e.g. 50%
  startHeight?: number; // e.g. 60%
  startRadius?: number; // e.g. 28px
  endRadius?: number; // e.g. 0px
  mediaZoom?: number; // e.g. 1.35
  overlayScrim?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '',
  mediaType = 'image',
  poster = '',
  alt = 'Showcase media',
  title = 'Built to scale',
  scrollHint = 'Scroll to expand',
  startWidth = 50,
  startHeight = 60,
  startRadius = 28,
  endRadius = 0,
  mediaZoom = 1.35,
  overlayScrim = 0.55,
  children,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth out progress with a subtle spring for zero jank
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  // Frame expansion transforms
  const width = useTransform(smoothProgress, [0, 0.7], [`${startWidth}%`, '100%']);
  const height = useTransform(smoothProgress, [0, 0.7], [`${startHeight}%`, '100%']);
  const borderRadius = useTransform(smoothProgress, [0, 0.7], [startRadius, endRadius]);

  // Image internal zoom-out
  const imageScale = useTransform(smoothProgress, [0, 0.75], [mediaZoom, 1]);

  // Scrim overlay opacity
  const scrimOpacity = useTransform(smoothProgress, [0.1, 0.75], [0, overlayScrim]);

  // Resting title animation (fades out and slides slightly up)
  const titleOpacity = useTransform(smoothProgress, [0.1, 0.4], [1, 0]);
  const titleY = useTransform(smoothProgress, [0.1, 0.4], [0, -30]);

  // Hint cue fades quickly
  const hintOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);

  // Reveal children overlay
  const overlayOpacity = useTransform(smoothProgress, [0.55, 0.85], [0, 1]);
  const overlayY = useTransform(smoothProgress, [0.55, 0.85], [30, 0]);

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-pin-container ${className}`.trim()}
      style={style}
    >
      <div className="scroll-expand-sticky-stage">
        <motion.div
          className="scroll-expand-frame"
          style={{
            width,
            height,
            borderRadius,
          }}
        >
          {/* Media layer */}
          {mediaType === 'video' ? (
            <motion.video
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              style={{ scale: imageScale }}
              className="scroll-expand-media"
            />
          ) : (
            <motion.img
              src={src}
              alt={alt}
              style={{ scale: imageScale }}
              className="scroll-expand-media"
            />
          )}

          {/* Scrim dark gradient overlay */}
          <motion.div
            className="scroll-expand-scrim"
            style={{ opacity: scrimOpacity }}
          />

          {/* Resting Headline */}
          {title && (
            <motion.div
              className="scroll-expand-title"
              style={{ opacity: titleOpacity, y: titleY }}
            >
              <h2>{title}</h2>
            </motion.div>
          )}

          {/* Scroll Cue Hint */}
          {scrollHint && (
            <motion.div
              className="scroll-expand-hint"
              style={{ opacity: hintOpacity }}
            >
              <span>{scrollHint} ↓</span>
            </motion.div>
          )}

          {/* Full-bleed Content Overlay */}
          {children && (
            <motion.div
              className="scroll-expand-overlay"
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
