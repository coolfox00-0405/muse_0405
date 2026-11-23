interface LucidaBrandMarkProps {
  variant?: 'hero' | 'compact';
  subtitle?: string;
  className?: string;
}

function CrescentStarSymbol({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M14.8 4.4A7.6 7.6 0 1 0 19.6 15.1A5.8 5.8 0 0 1 11.1 7.4A5.7 5.7 0 0 1 14.8 4.4Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.6 5.1L17.2 7.1L19.2 7.7L17.2 8.3L16.6 10.3L16 8.3L14 7.7L16 7.1L16.6 5.1Z"
        fill="currentColor"
      />
    </svg>
  );
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
        <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-[#777B61]">
          <CrescentStarSymbol className="w-[14.5px] h-[14.5px] sm:w-[19px] sm:h-[19px] shrink-0" />
          <span className="font-display text-[14.5px] sm:text-[19px] font-medium tracking-[0.2em] text-[#6E7259] leading-none">
            LUCIDA
          </span>
        </div>
        {subtitle && (
          <p className="mt-0.5 sm:mt-1.5 text-[8.5px] sm:text-[11px] tracking-[0.18em] text-[#827B72] leading-none uppercase">
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
