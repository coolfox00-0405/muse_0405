export type Language = 'ko' | 'en' | 'ja';

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
