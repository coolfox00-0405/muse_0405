import { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TarotCard } from '../types/reflection';
import { TAROT_CARD_BACK_IMAGE } from '../data/cards';
import { preloadCardImages } from '../utils/cardImagePreloader';
import { dedupeDeck } from '../utils/deckShuffle';
import { useLanguage } from '../i18n/LanguageContext';

export type DrawPhase = 'idle' | 'shuffling' | 'selecting' | 'revealed';

interface CardShuffleSpreadProps {
  phase: Exclude<DrawPhase, 'revealed'>;
  spreadCards: TarotCard[];
  selectedCards?: TarotCard[];
  onStartShuffle: () => void;
  onSelectCard: (card: TarotCard) => void;
}

const FAN_COUNT = 7;

export function CardShuffleSpread({
  phase,
  spreadCards,
  selectedCards = [],
  onStartShuffle,
  onSelectCard,
}: CardShuffleSpreadProps) {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const cardsToRender = useMemo(
    () => dedupeDeck(spreadCards).slice(0, FAN_COUNT),
    [spreadCards]
  );

  const selectedOrderMap = useMemo(() => {
    const map = new Map<string, number>();
    selectedCards.forEach((card, idx) => {
      map.set(card.id, idx + 1);
    });
    return map;
  }, [selectedCards]);

  useEffect(() => {
    preloadCardImages(cardsToRender, TAROT_CARD_BACK_IMAGE);
  }, [cardsToRender]);

  if (phase === 'idle') {
    return (
      <div className="relative w-full max-w-[540px] h-[196px] sm:h-[248px] mx-auto flex items-center justify-center select-none">
        <button
          type="button"
          onClick={onStartShuffle}
          aria-label={t.shuffleSpread.idleAria}
          className="relative w-[130px] sm:w-[162px] aspect-[2/3] rounded-[10px] overflow-hidden transition-opacity duration-200 hover:opacity-95 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#777B61] cursor-pointer"
        >
          <img
            src={TAROT_CARD_BACK_IMAGE}
            alt={t.cardFlip.backImageAlt}
            referrerPolicy="no-referrer"
            decoding="async"
            className="w-full h-full object-contain pointer-events-none"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[340px] sm:max-w-[500px] mx-auto py-1 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 select-none">
      {cardsToRender.map((card, index) => {
        const isEven = index % 2 === 0;
        const selectedOrder = selectedOrderMap.get(card.id);
        const isAlreadySelected = selectedOrder !== undefined;

        const animateProps =
          phase === 'shuffling'
            ? prefersReducedMotion
              ? { x: 0, y: 0, rotate: 0, opacity: [1, 0.72, 1] }
              : {
                  x: isEven ? [0, -18, 18, -8, 0] : [0, 18, -18, 8, 0],
                  y: 0,
                  rotate: 0,
                  opacity: [1, 0.85, 1, 0.9, 1],
                }
            : {
                x: 0,
                y: 0,
                rotate: 0,
                opacity: isAlreadySelected ? 0.65 : 1,
              };

        const isSelecting = phase === 'selecting';
        const isDisabled =
          phase === 'shuffling' || (isSelecting && isAlreadySelected);

        return (
          <motion.button
            key={card.id}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (isSelecting && !isAlreadySelected) {
                onSelectCard(card);
              }
            }}
            aria-label={
              isSelecting
                ? isAlreadySelected
                  ? t.shuffleSpread.selectingPickedAria(index + 1, selectedOrder)
                  : t.shuffleSpread.selectingPickAria(index + 1)
                : t.shuffleSpread.shufflingAria
            }
            initial={false}
            animate={animateProps}
            transition={
              phase === 'shuffling'
                ? {
                    duration: prefersReducedMotion ? 0.35 : 0.85,
                    ease: [0.22, 1, 0.36, 1],
                    delay: prefersReducedMotion ? 0 : index * 0.025,
                  }
                : {
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                  }
            }
            className={`relative w-[74px] sm:w-[106px] aspect-[2/3] rounded-[8px] sm:rounded-[10px] overflow-hidden shrink-0 transition-[box-shadow,opacity] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
              isAlreadySelected
                ? 'ring-2 ring-[#777B61]/60 cursor-not-allowed'
                : isSelecting
                ? 'cursor-pointer hover:ring-2 hover:ring-[#777B61]/55'
                : 'cursor-default'
            }`}
          >
            <img
              src={TAROT_CARD_BACK_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
              className="w-full h-full object-contain pointer-events-none"
            />
            {isAlreadySelected && (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#34312D]/25 flex items-center justify-center"
              >
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFCF6] border border-[#777B61] text-[#34312D] font-display text-xs sm:text-sm font-medium flex items-center justify-center">
                  {selectedOrder}
                </span>
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
