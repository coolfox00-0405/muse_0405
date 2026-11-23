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
const CENTER_INDEX = Math.floor(FAN_COUNT / 2);

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
      <div className="relative w-full max-w-[540px] h-[195px] sm:h-[244px] mx-auto flex items-center justify-center select-none">
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
    <div className="relative w-full max-w-[540px] h-[204px] sm:h-[248px] mx-auto flex items-center justify-center overflow-visible select-none">
      {cardsToRender.map((card, index) => {
        const offset = index - CENTER_INDEX; // -3 .. +3
        const fanAngle = offset * 6.5; // -19.5deg .. +19.5deg symmetrical arc
        const fanX = offset * 26; // -78px .. +78px fits cleanly on 375px mobile
        const fanY = Math.abs(offset) * Math.abs(offset) * 2.4 - 6;

        const isEven = index % 2 === 0;
        const selectedOrder = selectedOrderMap.get(card.id);
        const isAlreadySelected = selectedOrder !== undefined;

        const animateProps =
          phase === 'shuffling'
            ? prefersReducedMotion
              ? { x: 0, y: 0, rotate: 0, scale: 0.98, opacity: [1, 0.72, 1] }
              : {
                  x: isEven ? [0, -56, 10, -32, 0] : [0, 56, -10, 32, 0],
                  y: isEven ? [0, -8, 4, -4, 0] : [0, 8, -4, 4, 0],
                  rotate: isEven ? [0, -9, 2, -5, 0] : [0, 9, -2, 5, 0],
                  scale: [1, 0.98, 1, 0.99, 1],
                  opacity: 1,
                }
            : {
                x: fanX,
                y: isAlreadySelected ? fanY - 16 : fanY,
                rotate: fanAngle,
                scale: isAlreadySelected ? 0.96 : 1,
                opacity: isAlreadySelected ? 0.7 : 1,
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
            whileHover={
              isSelecting && !isAlreadySelected && !prefersReducedMotion
                ? {
                    y: fanY - 18,
                    scale: 1.04,
                    zIndex: 30,
                    transition: { duration: 0.18, ease: 'easeOut' },
                  }
                : undefined
            }
            whileTap={
              isSelecting && !isAlreadySelected ? { scale: 0.98 } : undefined
            }
            transition={
              phase === 'shuffling'
                ? {
                    duration: prefersReducedMotion ? 0.35 : 0.85,
                    ease: [0.22, 1, 0.36, 1],
                    delay: prefersReducedMotion ? 0 : index * 0.025,
                  }
                : {
                    type: 'spring',
                    stiffness: 250,
                    damping: 26,
                  }
            }
            style={{
              zIndex: isAlreadySelected ? 20 + selectedOrder : index + 1,
              transformOrigin: 'center bottom',
            }}
            className={`absolute w-[104px] sm:w-[132px] aspect-[2/3] rounded-[10px] overflow-hidden shadow-[0_6px_16px_-8px_rgba(52,49,45,0.16)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
              isAlreadySelected
                ? 'ring-2 ring-[#777B61]/55 cursor-not-allowed'
                : isSelecting
                ? 'cursor-pointer'
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
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#FFFCF6] border border-[#777B61] text-[#34312D] font-display text-xs sm:text-sm font-medium flex items-center justify-center shadow-sm">
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
