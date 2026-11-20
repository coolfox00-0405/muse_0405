import { useState, useEffect } from 'react';
import { TarotCard } from '../types/reflection';
import { TarotCardArtwork } from './TarotCardArtwork';
import { TAROT_CARD_BACK_IMAGE } from '../data/cards';

interface TarotCardFlipProps {
  card: TarotCard;
  isRevealed: boolean;
  onCardClick?: () => void;
}

export function TarotCardFlip({
  card,
  isRevealed,
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
      className={`card-perspective w-[240px] sm:w-[272px] mx-auto select-none ${
        isClickable ? 'cursor-pointer group' : ''
      }`}
      style={{ aspectRatio: '3 / 4.55' }}
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
          className={`card-face rounded-[18px] overflow-hidden bg-[#FFFCF6] border border-[#E5DED1] shadow-[0_14px_34px_-16px_rgba(52,49,45,0.22)] transition-transform duration-200 ${
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

        {/* Card Front — Unobstructed 3:4 Artwork + Unified Bottom Title Plate */}
        <div className="card-face card-face-front rounded-[18px] overflow-hidden bg-[#FFFCF6] border border-[#E5DED1] shadow-[0_14px_34px_-16px_rgba(52,49,45,0.22)] flex flex-col">
          <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#F7F3EA] shrink-0">
            <TarotCardArtwork card={card} size="full" priority />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center px-3 py-2.5 bg-[#FFFCF6] border-t border-[#E5DED1] text-center">
            <div className="flex items-center justify-center gap-1.5 leading-tight">
              <span className="font-display text-[11px] tracking-[0.16em] text-[#777B61] font-medium">
                {card.arcanaNumber}
              </span>
              <span className="text-[#E5DED1]" aria-hidden="true">
                ·
              </span>
              <span className="font-serif text-[14px] font-medium text-[#34312D] truncate max-w-[175px]">
                {card.nameKo}
              </span>
            </div>
            <p className="font-display text-[11px] tracking-[0.1em] text-[#827B72] mt-0.5 truncate max-w-full">
              {card.nameEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
