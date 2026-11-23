import { useState, useEffect } from 'react';
import { TarotCard } from '../types/reflection';
import { TarotCardArtwork } from './TarotCardArtwork';
import { TAROT_CARD_BACK_IMAGE } from '../data/cards';

interface TarotCardFlipProps {
  card: TarotCard;
  isRevealed: boolean;
  isReversed?: boolean;
  onCardClick?: () => void;
}

export function TarotCardFlip({
  card,
  isRevealed,
  isReversed = false,
  onCardClick,
}: TarotCardFlipProps) {
  const [backError, setBackError] = useState(false);

  useEffect(() => {
    setBackError(false);
  }, [card.backImageUrl]);

  const isClickable = !isRevealed && Boolean(onCardClick);
  const backSrc = TAROT_CARD_BACK_IMAGE || card.backImageUrl;

  return (
    <div
      className={`card-perspective w-[132px] sm:w-[204px] lg:w-[228px] mx-auto select-none ${
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
        {/* Card Back — Bespoke LUCIDA Botanical Engraving */}
        <div
          className={`card-face card-face-back rounded-[18px] overflow-hidden bg-[#FFFCF6] border border-[#E5DED1] shadow-[0_14px_34px_-16px_rgba(52,49,45,0.22)] transition-transform duration-200 ${
            isClickable ? 'group-hover:-translate-y-1' : ''
          }`}
        >
          {!backError ? (
            <img
              src={backSrc}
              alt="LUCIDA 타로 카드 뒷면 일러스트"
              referrerPolicy="no-referrer"
              decoding="async"
              onError={() => setBackError(true)}
              className="w-full h-full object-cover scale-[1.32]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#F7F3EA] text-[#777B61]">
              <div className="w-full h-full border border-[#777B61]/35 rounded-xl flex flex-col items-center justify-center gap-3">
                <span className="font-display text-lg tracking-[0.22em] text-[#34312D]">
                  LUCIDA
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card Front — Unobstructed Artwork (896:1200) + Concise English Title Plate */}
        <div className="card-face card-face-front rounded-[18px] overflow-hidden bg-[#FFFCF6] border border-[#E5DED1] shadow-[0_14px_34px_-16px_rgba(52,49,45,0.22)] flex flex-col">
          <div className="relative w-full aspect-[896/1200] overflow-hidden bg-[#FFFCF6] shrink-0">
            <TarotCardArtwork
              card={card}
              size="full"
              priority
              isReversed={isReversed}
            />
          </div>

          <div className="flex items-center justify-center px-2 sm:px-3 py-2 sm:py-2.5 bg-[#FFFCF6] border-t border-[#E5DED1] text-center">
            <p className="font-display text-[11px] sm:text-[13px] tracking-[0.03em] text-[#34312D] font-medium leading-tight break-words max-w-full">
              {card.nameEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
