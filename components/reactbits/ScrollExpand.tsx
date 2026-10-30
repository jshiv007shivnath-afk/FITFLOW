'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollExpand.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollExpandProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  mediaType?: 'image' | 'video';
  poster?: string;
  alt?: string;
  title?: string;
  scrollHint?: string;
  startRadius?: number;
  endRadius?: number;
  mediaZoom?: number;
  overlayScrim?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src = '/runner_hero.jpg',
  mediaType = 'image',
  poster = '',
  alt = 'FitFlow Athletic Runner',
  title = 'Track Every Motion',
  scrollHint = 'Scroll',
  startRadius = 28,
  endRadius = 0,
  mediaZoom = 1.22,
  overlayScrim = 0.52,
  children,
  className = '',
  style,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLElement | null>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const titleWrapperRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    const stage = stageRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    const scrim = scrimRef.current;
    const titleWrapper = titleWrapperRef.current;
    const hint = hintRef.current;
    const overlay = overlayRef.current;

    if (!container || !stage || !frame || !media) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 1. Accessibility: Respect prefers-reduced-motion
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(frame, { clipPath: `inset(0% 0% 0% 0% round ${endRadius}px)` });
        gsap.set(media, { scale: 1 });
        if (scrim) gsap.set(scrim, { opacity: overlayScrim });
        if (titleWrapper) gsap.set(titleWrapper, { opacity: 0, display: 'none' });
        if (overlay) gsap.set(overlay, { opacity: 1, y: 0 });
      });

      // 2. Desktop: Centered card (~38vw × 56vh) expands to cinematic full screen
      mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
        const startClip = `inset(22% 31% 22% 31% round ${startRadius}px)`;
        const endClip = `inset(0% 0% 0% 0% round ${endRadius}px)`;

        // Initial setup
        gsap.set(frame, { clipPath: startClip });
        gsap.set(media, { scale: mediaZoom });
        if (scrim) gsap.set(scrim, { opacity: 0.15 });
        if (titleWrapper) gsap.set(titleWrapper, { opacity: 1, scale: 1, y: 0 });
        if (hint) gsap.set(hint, { opacity: 1, y: 0 });
        if (overlay) gsap.set(overlay, { opacity: 0, y: 32 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=140%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Cue fades out quickly as scroll begins
        if (hint) {
          tl.to(hint, { opacity: 0, y: 14, duration: 0.14, ease: 'power1.out' }, 0);
        }

        // Title smoothly elevates, subtly scales and dissolves
        if (titleWrapper) {
          tl.to(
            titleWrapper,
            { opacity: 0, y: -28, scale: 1.05, duration: 0.35, ease: 'power1.out' },
            0.05
          );
        }

        // Frame expands smoothly from 28px rounded card to full bleed
        tl.to(
          frame,
          { clipPath: endClip, duration: 0.75, ease: 'power1.inOut' },
          0
        );

        // Counter-zoom on media for depth & cinematic parallax
        tl.to(
          media,
          { scale: 1.0, duration: 0.75, ease: 'power1.out' },
          0
        );

        // Scrim transition for legibility
        if (scrim) {
          tl.to(scrim, { opacity: overlayScrim, duration: 0.55, ease: 'power1.inOut' }, 0.2);
        }

        // Overlay content reveals softly over expanded visual
        if (overlay) {
          tl.to(
            overlay,
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
            0.55
          );
        }

        // Controlled hold buffer before smooth exit into next section
        tl.to({}, { duration: 0.2 });
      });

      // 3. Tablet & Mobile: Proportional card (~80vw × 52vh)
      mm.add('(max-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const mobileStartRadius = Math.min(startRadius, 24);
        const startClip = `inset(24% 10% 24% 10% round ${mobileStartRadius}px)`;
        const endClip = `inset(0% 0% 0% 0% round ${endRadius}px)`;

        // Initial setup
        gsap.set(frame, { clipPath: startClip });
        gsap.set(media, { scale: Math.min(mediaZoom, 1.18) });
        if (scrim) gsap.set(scrim, { opacity: 0.15 });
        if (titleWrapper) gsap.set(titleWrapper, { opacity: 1, scale: 1, y: 0 });
        if (hint) gsap.set(hint, { opacity: 1, y: 0 });
        if (overlay) gsap.set(overlay, { opacity: 0, y: 24 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        if (hint) {
          tl.to(hint, { opacity: 0, y: 10, duration: 0.14, ease: 'power1.out' }, 0);
        }

        if (titleWrapper) {
          tl.to(
            titleWrapper,
            { opacity: 0, y: -22, scale: 1.04, duration: 0.35, ease: 'power1.out' },
            0.05
          );
        }

        tl.to(
          frame,
          { clipPath: endClip, duration: 0.75, ease: 'power1.inOut' },
          0
        );

        tl.to(
          media,
          { scale: 1.0, duration: 0.75, ease: 'power1.out' },
          0
        );

        if (scrim) {
          tl.to(scrim, { opacity: overlayScrim, duration: 0.55, ease: 'power1.inOut' }, 0.2);
        }

        if (overlay) {
          tl.to(
            overlay,
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
            0.55
          );
        }

        tl.to({}, { duration: 0.2 });
      });
    }, container);

    return () => ctx.revert();
  }, [endRadius, mediaZoom, overlayScrim, startRadius]);

  const mediaElement =
    mediaType === 'video' ? (
      <video
        ref={(el) => {
          mediaRef.current = el;
        }}
        className="scroll-expand-media"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
      />
    ) : (
      <img
        ref={(el) => {
          mediaRef.current = el;
        }}
        className="scroll-expand-media"
        src={src}
        alt={alt}
        draggable={false}
      />
    );

  return (
    <div
      ref={containerRef}
      className={`scroll-expand-container ${className}`.trim()}
      style={style}
      {...rest}
    >
      <div ref={stageRef} className="scroll-expand-stage">
        <div ref={frameRef} className="scroll-expand-frame">
          {mediaElement}
          <div ref={scrimRef} className="scroll-expand-scrim" />
          {children && (
            <div ref={overlayRef} className="scroll-expand-overlay">
              {children}
            </div>
          )}
        </div>

        {/* Centered responsive title and scroll cue */}
        <div ref={titleWrapperRef} className="scroll-expand-title-wrapper">
          {title && <h2 className="scroll-expand-title">{title}</h2>}
          {scrollHint && (
            <div ref={hintRef} className="scroll-expand-hint">
              <span>{scrollHint}</span>
              <span className="material-symbols-outlined text-[15px]">south</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScrollExpand;
