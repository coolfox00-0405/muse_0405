import { useState } from 'react';
import { TarotCard } from '../types/reflection';

interface TarotCardFlipProps {
  card: TarotCard;
  isRevealed: boolean;
  onCardClick?: () => void;
}

function CardSymbol({ symbolKey }: { symbolKey: string }) {
  const commonProps = {
    width: 72,
    height: 72,
    viewBox: '0 0 72 72',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };

  switch (symbolKey) {
    case 'sun':
      return (
        <svg {...commonProps}>
          <circle cx="36" cy="36" r="13" />
          <path d="M36 10V18M36 54V62M10 36H18M54 36H62M18 18L23 23M49 49L54 54M54 18L49 23M23 49L18 54" />
        </svg>
      );
    case 'moon':
      return (
        <svg {...commonProps}>
          <path d="M44 16A20 20 0 1 0 56 48A15 15 0 1 1 44 16Z" />
          <circle cx="48" cy="26" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'star':
      return (
        <svg {...commonProps}>
          <path d="M36 12L41 31L60 36L41 41L36 60L31 41L12 36L31 31L36 12Z" />
          <circle cx="36" cy="36" r="3" />
        </svg>
      );
    case 'wheel':
      return (
        <svg {...commonProps}>
          <circle cx="36" cy="36" r="22" />
          <circle cx="36" cy="36" r="7" />
          <path d="M36 14V29M36 43V58M14 36H29M43 36H58M20.5 20.5L31 31M41 41L51.5 51.5M51.5 20.5L41 31M31 41L20.5 51.5" />
        </svg>
      );
    case 'justice':
      return (
        <svg {...commonProps}>
          <path d="M36 14V56M22 56H50M18 24H54" />
          <path d="M18 24L13 38H23L18 24ZM54 24L49 38H59L54 24Z" />
        </svg>
      );
    case 'temperance':
      return (
        <svg {...commonProps}>
          <path d="M22 20H34L31 32H25L22 20ZM38 40H50L47 52H41L38 40Z" />
          <path d="M28 32C28 38 44 34 44 40" />
        </svg>
      );
    case 'world':
      return (
        <svg {...commonProps}>
          <ellipse cx="36" cy="36" rx="16" ry="24" />
          <circle cx="36" cy="36" r="6" />
          <path d="M16 18L22 22M56 18L50 22M16 54L22 50M56 54L50 50" />
        </svg>
      );
    case 'lovers':
      return (
        <svg {...commonProps}>
          <circle cx="29" cy="36" r="14" />
          <circle cx="43" cy="36" r="14" />
        </svg>
      );
    case 'tower':
      return (
        <svg {...commonProps}>
          <path d="M26 56V26H46V56M22 26L36 14L50 26M32 56V44H40V56" />
        </svg>
      );
    case 'strength':
      return (
        <svg {...commonProps}>
          <path d="M22 36C22 29 31 29 36 36C41 43 50 43 50 36C50 29 41 29 36 36C31 43 22 43 22 36Z" />
          <circle cx="36" cy="36" r="22" strokeDasharray="2 4" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <circle cx="36" cy="36" r="20" />
          <path d="M36 12V60M12 36H60" strokeOpacity="0.45" />
          <path d="M36 22L46 36L36 50L26 36L36 22Z" />
        </svg>
      );
  }
}

export function TarotCardFlip({
  card,
  isRevealed,
  onCardClick,
}: TarotCardFlipProps) {
  const [backError, setBackError] = useState(false);
  const [frontError, setFrontError] = useState(false);

  const isClickable = !isRevealed && Boolean(onCardClick);
  const hasFrontImage = Boolean(card.frontImageUrl) && !frontError;

  return (
    <div
      className={`card-perspective w-[236px] sm:w-[264px] aspect-[3/4] mx-auto select-none ${
        isClickable ? 'cursor-pointer group' : ''
      }`}
      onClick={isClickable ? onCardClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={
        isClickable
          ? '타로 카드 뒷면. 눌러서 카드를 섞어 보세요.'
          : `${card.nameKo} (${card.nameEn}) 카드`
      }
      onKeyDown={(e) => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onCardClick?.();
        }
      }}
    >
      <div
        className={`card-inner rounded-[18px] ${
          isRevealed ? 'is-flipped' : ''
        }`}
      >
        {/* Card Back */}
        <div
          className={`card-face rounded-[18px] overflow-hidden bg-[#FFFCF6] border border-[#E7E0D5] shadow-[0_14px_34px_-16px_rgba(52,49,45,0.22)] transition-transform duration-200 ${
            isClickable ? 'group-hover:-translate-y-1' : ''
          }`}
        >
          {!backError ? (
            <img
              src={card.backImageUrl}
              alt="LUCIDA 타로 카드 뒷면 일러스트"
              referrerPolicy="no-referrer"
              onError={() => setBackError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F7F3EA] text-[#777B61]">
              <div className="w-full h-full border border-[#777B61]/35 rounded-xl flex flex-col items-center justify-center gap-4">
                <span className="font-serif text-lg tracking-[0.2em] text-[#34312D]">
                  LUCIDA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card Front */}
        <div className="card-face card-face-front rounded-[18px] overflow-hidden bg-[#FFFCF6] border border-[#E7E0D5] shadow-[0_14px_34px_-16px_rgba(52,49,45,0.22)] flex flex-col">
          {hasFrontImage ? (
            <div className="relative w-full h-full">
              <img
                src={card.frontImageUrl}
                alt={`${card.nameKo} (${card.nameEn}) 타로 카드 일러스트`}
                referrerPolicy="no-referrer"
                onError={() => setFrontError(true)}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#34312D]/70 via-[#34312D]/25 to-transparent pt-10 pb-3.5 px-4 text-center">
                <p className="font-serif text-xs tracking-[0.18em] text-[#FFFCF6]/90">
                  {card.arcanaNumber} · {card.nameEn}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full p-3.5 bg-[#F7F3EA]">
              <div className="w-full h-full rounded-[12px] border border-[#777B61]/45 bg-[#FFFCF6] p-2">
                <div className="w-full h-full rounded-[8px] border border-[#E7E0D5] flex flex-col items-center justify-between py-6 px-4 text-center">
                  <span className="font-serif text-sm tracking-[0.22em] text-[#777B61]">
                    {card.arcanaNumber}
                  </span>

                  <div className="flex flex-col items-center justify-center gap-4 text-[#777B61]">
                    <CardSymbol symbolKey={card.symbolKey} />
                    <div className="w-10 h-px bg-[#E7E0D5]" aria-hidden="true" />
                  </div>

                  <div className="space-y-1">
                    <p className="font-serif text-xl font-medium text-[#34312D]">
                      {card.nameKo}
                    </p>
                    <p className="font-serif text-xs tracking-[0.12em] text-[#827B72]">
                      {card.nameEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
