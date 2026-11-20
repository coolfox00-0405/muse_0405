import { motion, useReducedMotion } from 'motion/react';
import { TarotCard } from '../types/reflection';
import { TAROT_CARD_BACK_IMAGE } from '../data/cards';

export type DrawPhase = 'idle' | 'shuffling' | 'selecting' | 'revealed';

interface CardShuffleSpreadProps {
  phase: Exclude<DrawPhase, 'revealed'>;
  spreadCards: TarotCard[];
  onStartShuffle: () => void;
  onSelectCard: (card: TarotCard) => void;
}

const FAN_COUNT = 7;
const CENTER_INDEX = Math.floor(FAN_COUNT / 2);

export function CardShuffleSpread({
  phase,
  spreadCards,
  onStartShuffle,
  onSelectCard,
}: CardShuffleSpreadProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardsToRender = spreadCards.slice(0, FAN_COUNT);

  return (
    <div className="relative w-full max-w-[540px] h-[270px] sm:h-[310px] mx-auto flex items-center justify-center select-none">
      {cardsToRender.map((card, index) => {
        const offset = index - CENTER_INDEX; // -3 .. +3
        const fanAngle = offset * 8; // -24deg .. +24deg
        const fanX = offset * 34;
        const fanY = Math.abs(offset) * Math.abs(offset) * 3.8;

        const isEven = index % 2 === 0;

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
            y: fanY,
            rotate: fanAngle,
            scale: 1,
            opacity: 1,
          };
        }

        const isSelecting = phase === 'selecting';
        const isIdle = phase === 'idle';

        return (
          <motion.button
            key={`${card.id}-${index}`}
            type="button"
            disabled={phase === 'shuffling'}
            onClick={() => {
              if (isIdle) {
                onStartShuffle();
              } else if (isSelecting) {
                onSelectCard(card);
              }
            }}
            aria-label={
              isSelecting
                ? `${index + 1}번째 타로 카드 선택하기`
                : isIdle
                ? '타로 카드 덱. 눌러서 카드를 셔플하세요.'
                : '카드를 섞고 있습니다'
            }
            initial={false}
            animate={animateProps}
            whileHover={
              isSelecting && !prefersReducedMotion
                ? {
                    y: fanY - 22,
                    scale: 1.05,
                    zIndex: 30,
                    transition: { duration: 0.18, ease: 'easeOut' },
                  }
                : undefined
            }
            whileTap={isSelecting ? { scale: 0.98 } : undefined}
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
              zIndex: index + 1,
              transformOrigin: 'center bottom',
            }}
            className={`absolute w-[142px] sm:w-[164px] aspect-[3/4] rounded-[14px] overflow-hidden bg-[#FFFCF6] border border-[#E7E0D5] shadow-[0_12px_28px_-14px_rgba(52,49,45,0.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
              isSelecting || isIdle ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            <img
              src={TAROT_CARD_BACK_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover pointer-events-none"
            />
          </motion.button>
        );
      })}
    </div>
  );
}
