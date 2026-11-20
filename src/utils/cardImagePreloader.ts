import { TarotCard } from '../types/reflection';

const preloadedUrls = new Set<string>();

export function preloadImageUrl(url: string | undefined): void {
  if (!url || typeof window === 'undefined' || preloadedUrls.has(url)) {
    return;
  }
  preloadedUrls.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

export function preloadCardImages(cards: TarotCard[], backImageUrl?: string): void {
  if (backImageUrl) {
    preloadImageUrl(backImageUrl);
  }
  for (const card of cards) {
    if (card.frontImageUrl) {
      preloadImageUrl(card.frontImageUrl);
    }
  }
}
