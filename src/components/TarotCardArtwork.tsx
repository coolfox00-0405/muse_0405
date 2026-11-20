import { useState, useEffect } from 'react';
import { TarotCard, TarotSuit } from '../types/reflection';

interface TarotCardArtworkProps {
  card: TarotCard;
  size?: 'full' | 'thumbnail';
  priority?: boolean;
}

type MinorRank =
  | 'ace'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'page'
  | 'knight'
  | 'queen'
  | 'king';

function parseMinorRank(cardId: string): MinorRank {
  const parts = cardId.split('-');
  const raw = parts[1] || 'ace';
  const valid: MinorRank[] = [
    'ace',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'page',
    'knight',
    'queen',
    'king',
  ];
  return valid.includes(raw as MinorRank) ? (raw as MinorRank) : 'ace';
}

// Normalized coordinates (0..100 x 0..130) for classical tarot pip arrangements
const PIP_LAYOUTS: Record<string, [number, number][]> = {
  ace: [[50, 65]],
  '2': [
    [50, 38],
    [50, 92],
  ],
  '3': [
    [50, 32],
    [32, 86],
    [68, 86],
  ],
  '4': [
    [33, 40],
    [67, 40],
    [33, 90],
    [67, 90],
  ],
  '5': [
    [32, 36],
    [68, 36],
    [50, 65],
    [32, 94],
    [68, 94],
  ],
  '6': [
    [33, 34],
    [67, 34],
    [33, 65],
    [67, 65],
    [33, 96],
    [67, 96],
  ],
  '7': [
    [33, 32],
    [67, 32],
    [50, 50],
    [33, 68],
    [67, 68],
    [33, 98],
    [67, 98],
  ],
  '8': [
    [33, 28],
    [67, 28],
    [33, 52],
    [67, 52],
    [33, 78],
    [67, 78],
    [33, 102],
    [67, 102],
  ],
  '9': [
    [31, 28],
    [69, 28],
    [31, 52],
    [69, 52],
    [50, 65],
    [31, 78],
    [69, 78],
    [31, 102],
    [69, 102],
  ],
  '10': [
    [31, 26],
    [69, 26],
    [50, 40],
    [31, 56],
    [69, 56],
    [31, 76],
    [69, 76],
    [50, 90],
    [31, 104],
    [69, 104],
  ],
};

function SuitGlyph({
  suit,
  x,
  y,
  scale = 1,
}: {
  suit: TarotSuit;
  x: number;
  y: number;
  scale?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {suit === 'wands' && (
        <g
          fill="none"
          stroke="#5C5846"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 -11 V11" />
          <path d="M0 -5 C4 -8 6 -7 5 -3 C3 -2 1 -3 0 -5 Z" fill="#777B61" fillOpacity="0.28" />
          <path d="M0 1 C-4 -2 -6 -1 -5 3 C-3 4 -1 3 0 1 Z" fill="#777B61" fillOpacity="0.28" />
          <circle cx="0" cy="-12" r="1.4" fill="#B69A70" stroke="none" />
        </g>
      )}
      {suit === 'cups' && (
        <g
          fill="none"
          stroke="#5B665D"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M-6.5 -7 H6.5 C6.5 0 3.5 3.5 0 3.5 C-3.5 3.5 -6.5 0 -6.5 -7 Z"
            fill="#A6A58C"
            fillOpacity="0.25"
          />
          <path d="M0 3.5 V9 M-4.5 9 H4.5" />
          <path d="M-3 -3.5 Q0 -1.5 3 -3.5" strokeOpacity="0.55" />
        </g>
      )}
      {suit === 'swords' && (
        <g
          fill="none"
          stroke="#4F5456"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 -12 L2.2 -7 L1.4 4 H-1.4 L-2.2 -7 Z" fill="#827B72" fillOpacity="0.18" />
          <path d="M-5.5 4 H5.5 M0 4 V10" />
          <circle cx="0" cy="10.8" r="1.3" fill="#B69A70" stroke="none" />
        </g>
      )}
      {suit === 'pentacles' && (
        <g
          fill="none"
          stroke="#7A6A4F"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="0" cy="0" r="8" fill="#B69A70" fillOpacity="0.16" />
          <circle cx="0" cy="0" r="5.5" strokeOpacity="0.45" />
          <path d="M0 -5.5 L1.5 -1.4 L5.5 -1.4 L2.2 1 L3.4 5 L0 2.6 L-3.4 5 L-2.2 1 L-5.5 -1.4 L-1.5 -1.4 Z" />
        </g>
      )}
    </g>
  );
}

function CourtCrest({ rank, suit }: { rank: MinorRank; suit: TarotSuit }) {
  return (
    <g>
      {/* Botanical arch frame */}
      <path
        d="M22 104 V46 C22 28 34 18 50 18 C66 18 78 28 78 46 V104"
        fill="none"
        stroke="#777B61"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <circle
        cx="50"
        cy="62"
        r="24"
        fill="#FFFCF6"
        fillOpacity="0.72"
        stroke="#B69A70"
        strokeOpacity="0.55"
        strokeWidth="1"
      />

      {/* Rank-specific crown / crest motif above the suit emblem */}
      {rank === 'page' && (
        <path
          d="M42 30 Q50 22 58 30 M50 22 V32"
          fill="none"
          stroke="#777B61"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      )}
      {rank === 'knight' && (
        <path
          d="M40 31 L50 21 L60 31 M44 31 L50 25 L56 31"
          fill="none"
          stroke="#777B61"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {rank === 'queen' && (
        <path
          d="M39 31 L43 23 L50 28 L57 23 L61 31 Z"
          fill="#B69A70"
          fillOpacity="0.22"
          stroke="#7A6A4F"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      )}
      {rank === 'king' && (
        <path
          d="M37 32 L40 22 L46 27 L50 19 L54 27 L60 22 L63 32 Z"
          fill="#B69A70"
          fillOpacity="0.28"
          stroke="#7A6A4F"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      )}

      {/* Central Suit Emblem */}
      <SuitGlyph suit={suit} x={50} y={62} scale={1.75} />

      {/* Lower botanical flourish */}
      <path
        d="M34 96 Q50 103 66 96"
        fill="none"
        stroke="#A6A58C"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="50" cy="99" r="1.8" fill="#777B61" fillOpacity="0.65" />
    </g>
  );
}

function MinorArcanaVisual({ card }: { card: TarotCard }) {
  const suit: TarotSuit = card.suit || 'wands';
  const rank = parseMinorRank(card.id);
  const isCourt =
    rank === 'page' || rank === 'knight' || rank === 'queen' || rank === 'king';
  const pips = PIP_LAYOUTS[rank] || PIP_LAYOUTS.ace;
  const pipScale =
    rank === 'ace' ? 2.1 : pips.length <= 4 ? 1.15 : pips.length <= 7 ? 0.95 : 0.82;

  const suitTint: Record<TarotSuit, string> = {
    wands: 'from-[#F7F2E6] via-[#F2EADF] to-[#EBE1D2]',
    cups: 'from-[#F6F4EC] via-[#EEF1EC] to-[#E6EAE4]',
    swords: 'from-[#F6F4EE] via-[#ECEEEB] to-[#E3E5E2]',
    pentacles: 'from-[#F7F3E8] via-[#F1ECDF] to-[#E9E1CF]',
  };

  return (
    <div
      className={`relative w-full h-full bg-gradient-to-b ${suitTint[suit]} overflow-hidden`}
    >
      {/* Subtle watercolor paper backdrop from the suit illustration */}
      {card.frontImageUrl && (
        <img
          src={card.frontImageUrl}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.22] mix-blend-multiply pointer-events-none"
        />
      )}

      {/* Crisp vintage botanical woodcut engraving composition */}
      <svg
        viewBox="0 0 100 130"
        className="relative z-10 w-full h-full"
        role="img"
        aria-label={`${card.nameKo} (${card.nameEn}) 타로 카드 일러스트`}
      >
        {/* Outer fine hairline botanical frame */}
        <rect
          x="7"
          y="7"
          width="86"
          height="116"
          rx="4"
          fill="none"
          stroke="#777B61"
          strokeOpacity="0.38"
          strokeWidth="0.9"
        />
        <rect
          x="10.5"
          y="10.5"
          width="79"
          height="109"
          rx="2.5"
          fill="none"
          stroke="#B69A70"
          strokeOpacity="0.32"
          strokeWidth="0.6"
        />

        {/* Corner botanical dots */}
        <circle cx="13.5" cy="13.5" r="1.2" fill="#A6A58C" />
        <circle cx="86.5" cy="13.5" r="1.2" fill="#A6A58C" />
        <circle cx="13.5" cy="116.5" r="1.2" fill="#A6A58C" />
        <circle cx="86.5" cy="116.5" r="1.2" fill="#A6A58C" />

        {isCourt ? (
          <CourtCrest rank={rank} suit={suit} />
        ) : (
          <g>
            {rank === 'ace' && (
              <circle
                cx="50"
                cy="65"
                r="28"
                fill="#FFFCF6"
                fillOpacity="0.62"
                stroke="#B69A70"
                strokeOpacity="0.45"
                strokeWidth="0.9"
              />
            )}
            {pips.map(([px, py], idx) => (
              <SuitGlyph
                key={`${card.id}-pip-${idx}`}
                suit={suit}
                x={px}
                y={py}
                scale={pipScale}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export function TarotCardArtwork({
  card,
  size = 'full',
  priority = false,
}: TarotCardArtworkProps) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [card.id, card.frontImageUrl]);

  // Minor Arcana: bespoke per-card botanical woodcut + watercolor composition
  if (card.arcana === 'minor') {
    return <MinorArcanaVisual card={card} />;
  }

  // Major Arcana: individual generated vintage woodcut-watercolor illustration
  if (card.frontImageUrl && !imgError) {
    return (
      <img
        src={card.frontImageUrl}
        alt={`${card.nameKo} (${card.nameEn}) 타로 카드 일러스트`}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  // Graceful fallback if an image fails to load
  return (
    <div className="w-full h-full bg-[#F7F3EA] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full h-full rounded-[8px] border border-[#E5DED1] bg-[#FFFCF6] flex flex-col items-center justify-center gap-2 px-3">
        <span className="font-display text-xs tracking-[0.2em] text-[#777B61]">
          {card.arcanaNumber}
        </span>
        {size === 'full' && (
          <span className="font-serif text-base text-[#34312D]">
            {card.nameKo}
          </span>
        )}
      </div>
    </div>
  );
}
