interface LucidaBrandMarkProps {
  variant?: 'hero' | 'compact';
  subtitle?: string;
  className?: string;
}

export function LucidaBrandMark({
  variant = 'compact',
  subtitle,
  className = '',
}: LucidaBrandMarkProps) {
  if (variant === 'hero') {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center select-none pointer-events-none ${className}`}
      >
        <div className="flex flex-col items-center gap-0.5">
          <img
            src="/brand/lucida-symbol.png"
            alt="LUCIDA"
            className="w-9 sm:w-10 h-auto object-contain mix-blend-multiply"
          />
          <span className="font-display text-xs sm:text-[13px] font-medium tracking-[0.28em] text-[#5B554B] leading-none pl-[0.28em]">
            LUCIDA
          </span>
        </div>
        {subtitle && (
          <p className="mt-1.5 text-[10px] sm:text-[11px] tracking-[0.2em] text-[#827B72]/90 leading-none uppercase">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center gap-1.5 select-none pointer-events-none ${className}`}
    >
      <img
        src="/brand/lucida-symbol.png"
        alt="LUCIDA"
        className="w-6 sm:w-[26px] h-auto object-contain mix-blend-multiply"
      />
      <span className="font-display text-[11px] sm:text-xs font-medium tracking-[0.24em] text-[#6B6459] leading-none">
        LUCIDA
      </span>
    </div>
  );
}
