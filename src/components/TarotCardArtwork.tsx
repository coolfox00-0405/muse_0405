import { useState, useEffect } from 'react';
import { TarotCard } from '../types/reflection';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedCard } from '../i18n/cardHelpers';

interface TarotCardArtworkProps {
  card: TarotCard;
  size?: 'full' | 'thumbnail';
  priority?: boolean;
  isReversed?: boolean;
  onStatusChange?: (cardId: string, loaded: boolean) => void;
}

export function TarotCardArtwork({
  card,
  size = 'full',
  priority = false,
  isReversed = false,
  onStatusChange,
}: TarotCardArtworkProps) {
  const { language, t } = useLanguage();
  const loc = getLocalizedCard(card, language);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
    if (!card.frontImageUrl && process.env.NODE_ENV !== 'production') {
      console.error(`[LUCIDA] 카드 이미지 경로가 누락되었습니다: ${card.id}`);
    }
  }, [card.id, card.frontImageUrl]);

  if (card.frontImageUrl && !imgError) {
    return (
      <img
        src={card.frontImageUrl}
        alt={t.cardArtwork.imageAlt(loc.displayName, card.nameEn)}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => onStatusChange?.(card.id, true)}
        onError={() => {
          setImgError(true);
          onStatusChange?.(card.id, false);
        }}
        className={`w-full h-full object-contain bg-[#FFFCF6] ${
          isReversed ? 'rotate-180' : ''
        }`}
      />
    );
  }

  // Fallback card surface if an image asset fails to load or is missing (never substitutes another card's artwork)
  return (
    <div
      role="img"
      aria-label={t.cardArtwork.fallbackAria(loc.displayName, card.nameEn)}
      className="w-full h-full bg-[#F7F3EA] flex flex-col items-center justify-center p-3 text-center"
    >
      <div className="w-full h-full rounded-[8px] border border-[#E5DED1] bg-[#FFFCF6] flex flex-col items-center justify-center gap-1.5 px-2">
        <span className="font-display text-[11px] tracking-[0.18em] text-[#777B61]">
          {loc.arcanaNumber}
        </span>
        {size === 'full' && (
          <>
            <span className="font-serif text-sm font-medium text-[#34312D]">
              {loc.displayName}
            </span>
            <span className="text-[11px] text-[#827B72]">
              {t.cardArtwork.imageLoadFailed}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
