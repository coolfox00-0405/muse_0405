import { TarotCard, TarotSuit } from '../types/reflection';
import { Language } from './types';
import { MAJOR_CARD_TRANSLATIONS } from './cardsMajor';
import { WANDS_CUPS_TRANSLATIONS } from './cardsWandsCups';
import { SWORDS_PENTACLES_TRANSLATIONS } from './cardsSwordsPentacles';

const ALL_CARD_TRANSLATIONS = {
  ...MAJOR_CARD_TRANSLATIONS,
  ...WANDS_CUPS_TRANSLATIONS,
  ...SWORDS_PENTACLES_TRANSLATIONS,
};

export interface LocalizedCardView {
  id: string;
  displayName: string;
  nameKo: string;
  nameEn: string;
  arcanaNumber: string;
  suitTheme?: string;
  keywords: string[];
  insight: string;
  reflectionQuestion: string;
  gentleAction: string;
  meaningGuide: string;
}

const SUIT_NAME_JA: Record<TarotSuit, string> = {
  wands: 'ワンド',
  cups: 'カップ',
  swords: 'ソード',
  pentacles: 'ペンタクル',
};

const SUIT_NAME_EN: Record<TarotSuit, string> = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
};

export function getLocalizedCard(
  card: TarotCard,
  language: Language
): LocalizedCardView {
  if (language === 'ko') {
    return {
      id: card.id,
      displayName: card.nameKo,
      nameKo: card.nameKo,
      nameEn: card.nameEn,
      arcanaNumber: card.arcanaNumber,
      suitTheme: card.suitTheme,
      keywords: card.keywords,
      insight: card.insight,
      reflectionQuestion: card.reflectionQuestion,
      gentleAction: card.gentleAction,
      meaningGuide: card.meaningGuide,
    };
  }

  const entry = ALL_CARD_TRANSLATIONS[card.id]?.[language];
  if (!entry) {
    return {
      id: card.id,
      displayName: language === 'en' ? card.nameEn : card.nameKo,
      nameKo: card.nameKo,
      nameEn: card.nameEn,
      arcanaNumber: card.arcanaNumber,
      suitTheme: card.suitTheme,
      keywords: card.keywords,
      insight: card.insight,
      reflectionQuestion: card.reflectionQuestion,
      gentleAction: card.gentleAction,
      meaningGuide: card.meaningGuide,
    };
  }

  let localizedNumber = card.arcanaNumber;
  if (card.arcana === 'minor' && card.suit) {
    const rankToken = card.arcanaNumber.split(' ').slice(1).join(' ');
    if (language === 'en') {
      localizedNumber = `${SUIT_NAME_EN[card.suit]} ${rankToken}`;
    } else if (language === 'ja') {
      localizedNumber = `${SUIT_NAME_JA[card.suit]} ${rankToken}`;
    }
  }

  return {
    id: card.id,
    displayName: entry.name,
    nameKo: card.nameKo,
    nameEn: card.nameEn,
    arcanaNumber: localizedNumber,
    suitTheme: entry.suitTheme ?? card.suitTheme,
    keywords: entry.keywords,
    insight: entry.insight,
    reflectionQuestion: entry.reflectionQuestion,
    gentleAction: entry.gentleAction,
    meaningGuide: entry.meaningGuide,
  };
}

/**
 * Resolve localized card name for a stored ReflectionRecord when language changes.
 */
export function getLocalizedRecordCardName(
  cardId: string,
  fallbackCardName: string,
  card: TarotCard | undefined,
  language: Language,
  freeformLabel: string
): string {
  if (cardId === 'freeform') return freeformLabel;
  if (card) return getLocalizedCard(card, language).displayName;
  return fallbackCardName;
}

/**
 * Resolve reflection question for display if it matches the card's stock Korean question.
 * Preserves custom user prompts (such as freeform custom questions).
 */
export function getLocalizedRecordQuestion(
  storedQuestion: string,
  card: TarotCard | undefined,
  language: Language
): string {
  if (!card || !storedQuestion) return storedQuestion;
  const stockKo = card.reflectionQuestion.trim();
  const stockEn = ALL_CARD_TRANSLATIONS[card.id]?.en.reflectionQuestion.trim();
  const stockJa = ALL_CARD_TRANSLATIONS[card.id]?.ja.reflectionQuestion.trim();
  const trimmed = storedQuestion.trim();
  if (trimmed === stockKo || trimmed === stockEn || trimmed === stockJa) {
    return getLocalizedCard(card, language).reflectionQuestion;
  }
  return storedQuestion;
}
