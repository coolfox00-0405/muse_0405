import { TarotCard } from '../types/reflection';

export interface DeckIntegrityReport {
  totalCount: number;
  majorCount: number;
  minorCount: number;
  uniqueIdCount: number;
  uniqueImageCount: number;
  duplicateIds: string[];
  missingImageIds: string[];
  isValid: boolean;
}

/**
 * Remove any accidental duplicate cards by ID while preserving order.
 */
export function dedupeDeck(deck: readonly TarotCard[]): TarotCard[] {
  const seenIds = new Set<string>();
  const unique: TarotCard[] = [];
  for (const card of deck) {
    if (!card || !card.id || seenIds.has(card.id)) continue;
    seenIds.add(card.id);
    unique.push(card);
  }
  return unique;
}

/**
 * Returns an unbiased integer in [0, maxExclusive) using Web Crypto rejection sampling
 * when available, falling back to Math.random().
 */
export function getUnbiasedRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;

  if (
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    const uint32Max = 0x100000000; // 2^32
    const limit = uint32Max - (uint32Max % maxExclusive);
    const buffer = new Uint32Array(1);
    while (true) {
      globalThis.crypto.getRandomValues(buffer);
      const value = buffer[0];
      if (value < limit) {
        return value % maxExclusive;
      }
    }
  }

  return Math.floor(Math.random() * maxExclusive);
}

/**
 * Pure Fisher-Yates shuffle returning a new array with zero mutation of the input.
 * Every element in the deduplicated input appears exactly once.
 */
export function fisherYatesShuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = getUnbiasedRandomInt(i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Shuffles a tarot deck without duplicates, respecting session-level drawn exclusions
 * so recently drawn cards do not immediately repeat across shuffles/readings.
 * Also guarantees the visible spread order changes from the previous spread.
 */
export function shuffleUniqueSpread(options: {
  deck: readonly TarotCard[];
  excludedIds?: ReadonlySet<string>;
  previousSpreadIds?: readonly string[];
  minSpreadCount?: number;
}): {
  shuffledDeck: TarotCard[];
  didResetCycle: boolean;
} {
  const {
    deck,
    excludedIds = new Set<string>(),
    previousSpreadIds = [],
    minSpreadCount = 7,
  } = options;

  const uniqueDeck = dedupeDeck(deck);
  if (uniqueDeck.length === 0) {
    return { shuffledDeck: [], didResetCycle: false };
  }

  const remaining = uniqueDeck.filter((card) => !excludedIds.has(card.id));
  const needsCycleReset = remaining.length < Math.min(minSpreadCount, uniqueDeck.length);
  const pool = needsCycleReset ? uniqueDeck : remaining;

  const prevSlice = previousSpreadIds.slice(0, minSpreadCount);
  const lastDrawnId = previousSpreadIds[0];

  let candidate = fisherYatesShuffle(pool);

  // Ensure the new shuffle produces a genuinely different visible spread order
  // and avoids putting the immediately preceding drawn card in the first slot on cycle reset.
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const candidateSlice = candidate.slice(0, minSpreadCount).map((c) => c.id);
    const isSameOrder =
      prevSlice.length > 0 &&
      candidateSlice.length === prevSlice.length &&
      candidateSlice.every((id, idx) => id === prevSlice[idx]);

    const repeatsLastDrawn =
      needsCycleReset &&
      Boolean(lastDrawnId) &&
      pool.length > minSpreadCount &&
      candidateSlice.includes(lastDrawnId);

    if (!isSameOrder && !repeatsLastDrawn) {
      break;
    }
    candidate = fisherYatesShuffle(pool);
  }

  return {
    shuffledDeck: candidate,
    didResetCycle: needsCycleReset,
  };
}

/**
 * Validates that a tarot deck contains unique IDs, unique front artwork URLs,
 * and expected Major/Minor counts.
 */
export function verifyDeckIntegrity(deck: readonly TarotCard[]): DeckIntegrityReport {
  const seenIds = new Set<string>();
  const seenImages = new Set<string>();
  const duplicateIds: string[] = [];
  const missingImageIds: string[] = [];
  let majorCount = 0;
  let minorCount = 0;

  for (const card of deck) {
    if (seenIds.has(card.id)) {
      duplicateIds.push(card.id);
    } else {
      seenIds.add(card.id);
    }

    if (card.arcana === 'minor') {
      minorCount += 1;
    } else {
      majorCount += 1;
    }

    if (!card.frontImageUrl) {
      missingImageIds.push(card.id);
    } else {
      seenImages.add(card.frontImageUrl);
    }
  }

  return {
    totalCount: deck.length,
    majorCount,
    minorCount,
    uniqueIdCount: seenIds.size,
    uniqueImageCount: seenImages.size,
    duplicateIds,
    missingImageIds,
    isValid:
      duplicateIds.length === 0 &&
      missingImageIds.length === 0 &&
      seenIds.size === deck.length &&
      seenImages.size === deck.length,
  };
}
