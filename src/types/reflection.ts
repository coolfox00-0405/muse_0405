export interface TarotCard {
  id: string;
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

export interface ReflectionRecord {
  id: string;
  date: string; // YYYY-MM-DD in user's local timezone
  cardId: string;
  cardName: string;
  cardNameEn: string;
  orientation?: 'upright' | 'reversed';
  reflectionQuestion: string;
  selectedAction?: string;
  userNote: string;
  createdAt: string; // ISO-8601
  updatedAt: string; // ISO-8601
}

export type ActiveTab = 'today' | 'journal' | 'read' | 'about';
