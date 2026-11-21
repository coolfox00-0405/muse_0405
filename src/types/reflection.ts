export type TarotArcana = 'major' | 'minor';
export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles';
export type DeckMode = 'full' | 'major';

export interface TarotCard {
  id: string;
  arcana?: TarotArcana;
  suit?: TarotSuit;
  suitTheme?: string;
  arcanaNumber: string;
  nameKo: string;
  nameEn: string;
  keywords: string[];
  insight: string;
  reflectionQuestion: string;
  gentleAction: string;
  meaningGuide: string;
  symbolKey: string;
  frontImageUrl?: string;
  backImageUrl: string;
}

export interface SpreadCardSnapshot {
  cardId: string;
  cardName: string;
  cardNameEn: string;
  orientation: 'upright' | 'reversed';
  positionLabel?: string;
}

export interface SelectedAttemptItem {
  attemptId?: string;
  categoryLabel?: string;
  cardId: string;
  cardName: string;
  actionText: string;
  positionLabel?: string;
}

export interface FollowUpEntry {
  id: string;
  createdAt: string; // ISO-8601
  prompt?: string;
  note: string;
}

export interface ReflectionRecord {
  id: string;
  readingSessionId?: string;
  date: string; // YYYY-MM-DD in user's local timezone
  cardId: string;
  cardName: string;
  cardNameEn: string;
  orientation?: 'upright' | 'reversed';
  readingType?: 'single' | 'three';
  spreadCards?: SpreadCardSnapshot[];
  overallMessage?: string;
  reflectionQuestion: string;
  selectedAction?: string;
  selectedActions?: SelectedAttemptItem[];
  actionMemo?: string;
  userNote: string;
  followUpNotes?: FollowUpEntry[];
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export type ActiveTab = 'today' | 'journal' | 'read' | 'about';
