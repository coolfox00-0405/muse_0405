import { useEffect, useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TarotCard } from '../types/reflection';
import { TAROT_CARD_BACK_IMAGE } from '../data/cards';
import { preloadCardImages } from '../utils/cardImagePreloader';
import { dedupeDeck } from '../utils/deckShuffle';

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

  return (
    <div className="relative w-full max-w-[540px] h-[208px] sm:h-[248px] mx-auto flex items-center justify-center select-none">
      {cardsToRender.map((card, index) => {
        const offset = index - CENTER_INDEX; // -3 .. +3
        const fanAngle = offset * 7.5; // -22.5deg .. +22.5deg
        const fanX = offset * 30;
        const fanY = Math.abs(offset) * Math.abs(offset) * 3.2;

        const isEven = index % 2 === 0;
        const selectedOrder = selectedOrderMap.get(card.id);
        const isAlreadySelected = selectedOrder !== undefined;

        let animateProps;
        if (phase === 'idle') {
          animateProps = {
            x: offset * 1.8,
            y: Math.abs(offset) * 0.8,
            rotate: offset * 0.8,
            scale: 1,
            opacity: 1,
          };
        } else if (phase === 'shuffling') {
          animateProps = prefersReducedMotion
            ? { x: 0, y: 0, rotate: 0, scale: 0.98, opacity: [1, 0.7, 1] }
            : {
                x: isEven ? [0, -68, 12, -40, 0] : [0, 68, -12, 40, 0],
                y: isEven ? [0, -10, 6, -6, 0] : [0, 10, -6, 6, 0],
                rotate: isEven ? [0, -11, 3, -6, 0] : [0, 11, -3, 6, 0],
                scale: [1, 0.98, 1, 0.99, 1],
                opacity: 1,
              };
        } else {
          // selecting (fan spread)
          animateProps = {
            x: fanX,
            y: isAlreadySelected ? fanY - 18 : fanY,
            rotate: fanAngle,
            scale: isAlreadySelected ? 0.96 : 1,
            opacity: isAlreadySelected ? 0.65 : 1,
          };
        }

        const isSelecting = phase === 'selecting';
        const isIdle = phase === 'idle';
        const isDisabled =
          phase === 'shuffling' || (isSelecting && isAlreadySelected);

        return (
          <motion.button
            key={card.id}
            type="button"
            disabled={isDisabled}
            onClick={() => {
              if (isIdle) {
                onStartShuffle();
              } else if (isSelecting && !isAlreadySelected) {
                onSelectCard(card);
              }
            }}
            aria-label={
              isSelecting
                ? isAlreadySelected
                  ? `${index + 1}번째 카드 (${selectedOrder}번째로 선택됨)`
                  : `${index + 1}번째 타로 카드 선택하기`
                : isIdle
                ? '타로 카드 덱. 눌러서 카드를 셔플하세요.'
                : '카드를 섞고 있습니다'
            }
            initial={false}
            animate={animateProps}
            whileHover={
              isSelecting && !isAlreadySelected && !prefersReducedMotion
                ? {
                    y: fanY - 22,
                    scale: 1.05,
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
                    stiffness: 260,
                    damping: 26,
                  }
            }
            style={{
              zIndex: isAlreadySelected ? 20 + selectedOrder : index + 1,
              transformOrigin: 'center bottom',
            }}
            className={`absolute w-[124px] sm:w-[148px] aspect-[3/4] rounded-[14px] overflow-hidden bg-[#FFFCF6] border shadow-[0_12px_28px_-14px_rgba(52,49,45,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
              isAlreadySelected
                ? 'border-[#777B61] ring-2 ring-[#777B61]/40 cursor-not-allowed'
                : isSelecting || isIdle
                ? 'border-[#E5DED1] cursor-pointer'
                : 'border-[#E5DED1] cursor-default'
            }`}
          >
            <img
              src={TAROT_CARD_BACK_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
              className="w-full h-full object-cover pointer-events-none"
            />
            {isAlreadySelected && (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[#34312D]/25 flex items-center justify-center"
              >
                <span className="w-8 h-8 rounded-full bg-[#FFFCF6] border border-[#777B61] text-[#34312D] font-display text-sm font-medium flex items-center justify-center shadow-sm">
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
