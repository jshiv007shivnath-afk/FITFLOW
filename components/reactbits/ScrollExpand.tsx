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
  startWidth?: number; // e.g. 58%
  startHeight?: number; // e.g. 480px
  startRadius?: number; // e.g. 28px
  endRadius?: number; // e.g. 16px
  mediaZoom?: number; // e.g. 1.25
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
  startWidth = 58,
  startRadius = 28,
  endRadius = 16,
  mediaZoom = 1.25,
  overlayScrim = 0.55,
  children,
  className = '',
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Smooth natural scroll tracking without locking/pinning the page
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 30,
    restDelta: 0.001,
  });

  // Expand card width from startWidth to 100% as it scrolls into center view
  const width = useTransform(smoothProgress, [0.1, 0.95], [`${startWidth}%`, '100%']);
  const borderRadius = useTransform(smoothProgress, [0.1, 0.95], [startRadius, endRadius]);
  const imageScale = useTransform(smoothProgress, [0.1, 0.95], [mediaZoom, 1]);
  const scrimOpacity = useTransform(smoothProgress, [0.1, 0.85], [0.25, overlayScrim]);
  const titleOpacity = useTransform(smoothProgress, [0.1, 0.45], [1, 0]);
  const overlayOpacity = useTransform(smoothProgress, [0.45, 0.9], [0, 1]);
  const overlayY = useTransform(smoothProgress, [0.45, 0.9], [25, 0]);

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-fluid-container ${className}`.trim()}
      style={style}
    >
      <motion.div
        className="scroll-expand-fluid-frame"
        style={{
          width,
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
            className="scroll-expand-fluid-media"
          />
        ) : (
          <motion.img
            src={src}
            alt={alt}
            style={{ scale: imageScale }}
            className="scroll-expand-fluid-media"
          />
        )}

        {/* Gradient Scrim */}
        <motion.div
          className="scroll-expand-fluid-scrim"
          style={{ opacity: scrimOpacity }}
        />

        {/* Initial Title */}
        {title && (
          <motion.div
            className="scroll-expand-fluid-title"
            style={{ opacity: titleOpacity }}
          >
            <h2>{title}</h2>
            {scrollHint && <span>{scrollHint} ↓</span>}
          </motion.div>
        )}

        {/* Expanded Overlay Content */}
        {children && (
          <motion.div
            className="scroll-expand-fluid-overlay"
            style={{ opacity: overlayOpacity, y: overlayY }}
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ScrollExpand;
