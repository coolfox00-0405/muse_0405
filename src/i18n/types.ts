export type Language = 'ko' | 'en' | 'ja';
export type CardOrientation = 'upright' | 'reversed';

export interface LocalizedCardContent {
  name: string;
  arcanaNumber?: string;
  suitTheme?: string;
  keywords: string[];
  insight: string;
  reflectionQuestion: string;
  gentleAction: string;
  meaningGuide: string;
}

export type LocalizedCardDictionary = Record<
  string,
  {
    en: LocalizedCardContent;
    ja: LocalizedCardContent;
  }
>;

export interface ReversedCardContent {
  keywords: string[];
  insight: string;
  reflectionQuestion: string;
  gentleAction: string;
  meaningGuide: string;
}

export type LocalizedReversedDictionary = Record<
  string,
  {
    ko: ReversedCardContent;
    en: ReversedCardContent;
    ja: ReversedCardContent;
  }
>;
