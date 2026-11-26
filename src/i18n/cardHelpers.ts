import { TarotCard, TarotSuit } from '../types/reflection';
import { CardOrientation, Language } from './types';
import { MAJOR_CARD_TRANSLATIONS } from './cardsMajor';
import { WANDS_CUPS_TRANSLATIONS } from './cardsWandsCups';
import { SWORDS_PENTACLES_TRANSLATIONS } from './cardsSwordsPentacles';
import { REVERSED_MAJOR_CONTENT } from './reversedMajor';
import { REVERSED_WANDS_CUPS_CONTENT } from './reversedWandsCups';
import { REVERSED_SWORDS_PENTACLES_CONTENT } from './reversedSwordsPentacles';

const ALL_CARD_TRANSLATIONS = {
  ...MAJOR_CARD_TRANSLATIONS,
  ...WANDS_CUPS_TRANSLATIONS,
  ...SWORDS_PENTACLES_TRANSLATIONS,
};

const ALL_REVERSED_CONTENT = {
  ...REVERSED_MAJOR_CONTENT,
  ...REVERSED_WANDS_CUPS_CONTENT,
  ...REVERSED_SWORDS_PENTACLES_CONTENT,
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
  language: Language,
  orientation: CardOrientation = 'upright'
): LocalizedCardView {
  const reversedOverride =
    orientation === 'reversed'
      ? ALL_REVERSED_CONTENT[card.id]?.[language]
      : undefined;

  if (language === 'ko') {
    return {
      id: card.id,
      displayName: card.nameKo,
      nameKo: card.nameKo,
      nameEn: card.nameEn,
      arcanaNumber: card.arcanaNumber,
      suitTheme: card.suitTheme,
      keywords: reversedOverride?.keywords ?? card.keywords,
      insight: reversedOverride?.insight ?? card.insight,
      reflectionQuestion:
        reversedOverride?.reflectionQuestion ?? card.reflectionQuestion,
      gentleAction: reversedOverride?.gentleAction ?? card.gentleAction,
      meaningGuide: reversedOverride?.meaningGuide ?? card.meaningGuide,
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
      keywords: reversedOverride?.keywords ?? card.keywords,
      insight: reversedOverride?.insight ?? card.insight,
      reflectionQuestion:
        reversedOverride?.reflectionQuestion ?? card.reflectionQuestion,
      gentleAction: reversedOverride?.gentleAction ?? card.gentleAction,
      meaningGuide: reversedOverride?.meaningGuide ?? card.meaningGuide,
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
    keywords: reversedOverride?.keywords ?? entry.keywords,
    insight: reversedOverride?.insight ?? entry.insight,
    reflectionQuestion:
      reversedOverride?.reflectionQuestion ?? entry.reflectionQuestion,
    gentleAction: reversedOverride?.gentleAction ?? entry.gentleAction,
    meaningGuide: reversedOverride?.meaningGuide ?? entry.meaningGuide,
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
 * Resolve reflection question for display if it matches the card's stock upright or reversed question.
 * Preserves custom user prompts (such as freeform custom questions).
 */
export function getLocalizedRecordQuestion(
  storedQuestion: string,
  card: TarotCard | undefined,
  language: Language,
  orientation: CardOrientation = 'upright'
): string {
  if (!card || !storedQuestion) return storedQuestion;
  const trimmed = storedQuestion.trim();

  const revEntry = ALL_REVERSED_CONTENT[card.id];
  if (revEntry) {
    const revKo = revEntry.ko.reflectionQuestion.trim();
    const revEn = revEntry.en.reflectionQuestion.trim();
    const revJa = revEntry.ja.reflectionQuestion.trim();
    if (trimmed === revKo || trimmed === revEn || trimmed === revJa) {
      return getLocalizedCard(card, language, 'reversed').reflectionQuestion;
    }
  }

  const stockKo = card.reflectionQuestion.trim();
  const stockEn = ALL_CARD_TRANSLATIONS[card.id]?.en.reflectionQuestion.trim();
  const stockJa = ALL_CARD_TRANSLATIONS[card.id]?.ja.reflectionQuestion.trim();
  if (trimmed === stockKo || trimmed === stockEn || trimmed === stockJa) {
    return getLocalizedCard(card, language, orientation).reflectionQuestion;
  }
  return storedQuestion;
}
