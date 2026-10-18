import React from 'react';

interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export function BrandMark({ size = 'md', className = '', showText = false }: BrandMarkProps) {
  const dimensionMap = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-8 h-8 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-[22px]',
  };

  const pxMap = {
    sm: 28,
    md: 32,
    lg: 48,
    xl: 64,
  };

  const dim = dimensionMap[size];
  const px = pxMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Original FitFlow Favicon / Brand Icon */}
      <img
        src="/icon.png"
        alt="FitFlow"
        width={px}
        height={px}
        className={`${dim} object-contain shadow-2xs shrink-0 rounded-lg`}
      />

      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-base font-extrabold text-[#111312] tracking-tight leading-none">
            FitFlow
          </span>
          <span className="text-xs font-medium text-[#525650] leading-tight mt-0.5">
            Wellness &amp; Activity
          </span>
        </div>
      )}
    </div>
  );
}
