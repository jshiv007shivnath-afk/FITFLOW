'use client';

import React, { Children, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  children?: React.ReactNode;
  itemClassName?: string;
  style?: React.CSSProperties;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
  style,
}) => (
  <div className={`scroll-stack-card-inner ${itemClassName}`.trim()} style={style}>
    {children}
  </div>
);

export interface ScrollStackProps {
  children?: React.ReactNode;
  className?: string;
  itemStackDistance?: number;
  topOffset?: number;
  scaleStep?: number;
}

interface StackCardWrapperProps {
  children: React.ReactNode;
  index: number;
  total: number;
  topOffset: number;
  itemStackDistance: number;
  scaleStep: number;
}

const StackCardWrapper: React.FC<StackCardWrapperProps> = ({
  children,
  index,
  total,
  topOffset,
  itemStackDistance,
  scaleStep,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'start start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 35,
    restDelta: 0.001,
  });

  // Calculate target top position when pinned
  const stickyTop = topOffset + index * itemStackDistance;

  // Depth scale when later cards stack on top
  const minScale = 1 - (total - 1 - index) * scaleStep;
  const scale = useTransform(smoothProgress, [0.3, 1], [1, Math.max(0.85, minScale)]);

  return (
    <div
      ref={cardRef}
      className="scroll-stack-slot"
      style={{
        position: 'sticky',
        top: `${stickyTop}px`,
        zIndex: 10 + index,
      }}
    >
      <motion.div
        style={{ scale, transformOrigin: 'top center' }}
        className="scroll-stack-motion-card"
      >
        {children}
      </motion.div>
    </div>
  );
};

export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemStackDistance = 28,
  topOffset = 110,
  scaleStep = 0.035,
}) => {
  const items = Children.toArray(children);

  return (
    <div className={`scroll-stack-container ${className}`.trim()}>
      <div className="scroll-stack-track">
        {items.map((child, index) => (
          <StackCardWrapper
            key={index}
            index={index}
            total={items.length}
            topOffset={topOffset}
            itemStackDistance={itemStackDistance}
            scaleStep={scaleStep}
          >
            {child}
          </StackCardWrapper>
        ))}
      </div>
    </div>
  );
};

export default ScrollStack;
