import { useState, useEffect, useMemo, useCallback, FormEvent } from 'react';
import { X, Search, ArrowLeft, BookOpen, ArrowUpRight, PenLine, Check, AlertTriangle } from 'lucide-react';
import { FULL_TAROT_DECK } from '../data/cards';
import { ReflectionRecord, TarotCard, TarotSuit } from '../types/reflection';
import { TarotCardArtwork } from './TarotCardArtwork';

type FilterCategory = 'all' | 'major' | TarotSuit;

interface DeckEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: ReflectionRecord[];
  initialCardId?: string | null;
  onBackToReading?: () => void;
  onOpenRecord?: (recordId: string) => void;
  onAddCardReflection?: (
    card: TarotCard,
    note: string
  ) => { ok: boolean; error?: string; record?: ReflectionRecord };
}

const FILTER_OPTIONS: { id: FilterCategory; label: string; count: number }[] = [
  { id: 'all', label: '전체', count: 78 },
  { id: 'major', label: '메이저', count: 22 },
  { id: 'wands', label: '완드', count: 14 },
  { id: 'cups', label: '컵', count: 14 },
  { id: 'swords', label: '소드', count: 14 },
  { id: 'pentacles', label: '펜타클', count: 14 },
];

const SUIT_LABEL_KO: Record<TarotSuit, string> = {
  wands: '완드 (Wands)',
  cups: '컵 (Cups)',
  swords: '소드 (Swords)',
  pentacles: '펜타클 (Pentacles)',
};

export function DeckEncyclopediaModal({
  isOpen,
  onClose,
  records,
  initialCardId = null,
  onBackToReading,
  onOpenRecord,
  onAddCardReflection,
}: DeckEncyclopediaModalProps) {
  const [category, setCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(() =>
    initialCardId
      ? FULL_TAROT_DECK.find((c) => c.id === initialCardId) ?? null
      : null
  );
  const [imageStatusMap, setImageStatusMap] = useState<Record<string, boolean>>({});
  const [isWritingNote, setIsWritingNote] = useState(false);
  const [cardNoteDraft, setCardNoteDraft] = useState('');
  const [noteFeedback, setNoteFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    if (initialCardId) {
      const found = FULL_TAROT_DECK.find((c) => c.id === initialCardId) ?? null;
      setSelectedCard(found);
    } else {
      setSelectedCard(null);
    }
    setIsWritingNote(false);
    setCardNoteDraft('');
    setNoteFeedback(null);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, initialCardId, onClose]);

  useEffect(() => {
    setIsWritingNote(false);
    setCardNoteDraft('');
    setNoteFeedback(null);
  }, [selectedCard?.id]);

  const handleSaveCardNote = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCard || !onAddCardReflection) return;
    const trimmed = cardNoteDraft.trim();
    if (!trimmed) {
      setNoteFeedback({
        type: 'error',
        text: '남길 생각을 짧게라도 입력해 주세요.',
      });
      return;
    }
    const result = onAddCardReflection(selectedCard, trimmed);
    if (result.ok) {
      setCardNoteDraft('');
      setIsWritingNote(false);
      setNoteFeedback({
        type: 'success',
        text: '인사이트 노트에 기록되었습니다.',
      });
    } else {
      setNoteFeedback({
        type: 'error',
        text: result.error || '기록을 저장하지 못했습니다.',
      });
    }
  };

  const handleStatusChange = useCallback((cardId: string, loaded: boolean) => {
    setImageStatusMap((prev) => {
      if (prev[cardId] === loaded) return prev;
      return { ...prev, [cardId]: loaded };
    });
  }, []);

  const deckIntegrity = useMemo(() => {
    const uniqueIds = new Set(FULL_TAROT_DECK.map((c) => c.id));
    const uniqueImages = new Set(
      FULL_TAROT_DECK.map((c) => c.frontImageUrl).filter(Boolean)
    );
    const missingCards = FULL_TAROT_DECK.filter((c) => !c.frontImageUrl);
    return {
      total: FULL_TAROT_DECK.length,
      uniqueIdCount: uniqueIds.size,
      uniqueImageCount: uniqueImages.size,
      missingCount: missingCards.length,
    };
  }, []);

  const recordCountByCard = useMemo(() => {
    const map = new Map<string, ReflectionRecord[]>();
    for (const rec of records) {
      if (!rec.cardId || rec.cardId === 'freeform') continue;
      const list = map.get(rec.cardId) ?? [];
      list.push(rec);
      map.set(rec.cardId, list);
    }
    return map;
  }, [records]);

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return FULL_TAROT_DECK.filter((card) => {
      if (category === 'major' && card.arcana !== 'major') return false;
      if (
        category !== 'all' &&
        category !== 'major' &&
        card.suit !== category
      ) {
        return false;
      }
      if (!q) return true;
      return (
        card.nameKo.toLowerCase().includes(q) ||
        card.nameEn.toLowerCase().includes(q) ||
        card.arcanaNumber.toLowerCase().includes(q) ||
        card.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [category, searchQuery]);

  const loadStats = useMemo(() => {
    let loaded = 0;
    let failed = 0;
    for (const card of filteredCards) {
      const status = imageStatusMap[card.id];
      if (status === true) loaded += 1;
      if (status === false) failed += 1;
    }
    return { loaded, failed };
  }, [filteredCards, imageStatusMap]);

  const selectedCardNotes = useMemo(() => {
    if (!selectedCard) return [];
    const list = recordCountByCard.get(selectedCard.id) ?? [];
    return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [selectedCard, recordCountByCard]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="deck-encyclopedia-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#34312D]/45 backdrop-blur-xs p-0 sm:p-6"
    >
      <div className="relative w-full h-full sm:h-[90vh] sm:max-w-5xl bg-[#F7F3EA] sm:rounded-2xl sm:border sm:border-[#E5DED1] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 bg-[#FFFCF6] border-b border-[#E5DED1] px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-xs tracking-[0.18em] text-[#827B72]">
              LUCIDA ARCANA ARCHIVE
            </p>
            <h2
              id="deck-encyclopedia-title"
              className="font-serif text-lg sm:text-xl font-medium text-[#34312D] truncate"
            >
              78장 타로 카드 도감
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="도감 닫기"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-xl border border-[#E5DED1] bg-[#F7F3EA] text-[#34312D] hover:bg-[#E5DED1]/50 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </header>

        {/* Only surface error bar if a missing/broken asset actually occurs */}
        {(deckIntegrity.missingCount > 0 || loadStats.failed > 0) && (
          <div className="shrink-0 bg-[#A65D4E]/10 border-b border-[#A65D4E]/25 px-4 sm:px-6 py-2 text-xs text-[#7A3B2E] flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>
              일부 카드 이미지를 불러오지 못해 기본 카드 화면으로 표시되고 있습니다.
            </span>
          </div>
        )}

        {/* Body: Either Card Detail View OR Filter + 78-Card Grid */}
        {selectedCard ? (
          <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-7">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCard(null)}
                  className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] text-sm text-[#34312D] hover:bg-[#E5DED1]/45 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
                  <span>78장 목록으로</span>
                </button>
                {onBackToReading && (
                  <button
                    type="button"
                    onClick={onBackToReading}
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] text-sm text-[#777B61] hover:text-[#34312D] hover:bg-[#E5DED1]/45 transition-colors cursor-pointer"
                  >
                    <span>카드 뽑기로 돌아가기</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                {/* Artwork Preview */}
                <div className="md:col-span-5 flex flex-col items-center">
                  <div className="w-full max-w-[260px] rounded-[16px] overflow-hidden border border-[#E5DED1] bg-[#FFFCF6] shadow-sm">
                    <div className="aspect-[896/1200] w-full overflow-hidden bg-[#FFFCF6]">
                      <TarotCardArtwork
                        card={selectedCard}
                        size="full"
                        priority
                        onStatusChange={handleStatusChange}
                      />
                    </div>
                    <div className="border-t border-[#E5DED1] bg-[#FFFCF6] px-3 py-2 text-center">
                      <p className="text-[13px] font-serif font-medium text-[#34312D] leading-tight">
                        <span className="font-display text-[11px] text-[#777B61] mr-1.5">
                          {selectedCard.arcanaNumber}
                        </span>
                        {selectedCard.nameKo}
                      </p>
                      <p className="font-display text-[11px] text-[#827B72] leading-tight mt-0.5">
                        {selectedCard.nameEn}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details: Separated Traditional Symbolism vs Personal Notes */}
                <div className="md:col-span-7 space-y-6">
                  {/* Card Traditional Symbolism & Questions */}
                  <section
                    aria-label="카드의 전통 상징과 질문"
                    className="bg-[#FFFCF6] border border-[#E5DED1] rounded-2xl p-5 sm:p-6 space-y-4"
                  >
                    <div className="space-y-1 border-b border-[#E5DED1] pb-4">
                      <p className="text-xs text-[#827B72]">
                        {selectedCard.arcana === 'minor' && selectedCard.suit
                          ? `마이너 아르카나 · ${SUIT_LABEL_KO[selectedCard.suit]} · ${selectedCard.suitTheme}`
                          : `메이저 아르카나 · ${selectedCard.arcanaNumber}`}
                      </p>
                      <h3 className="font-serif text-2xl font-medium text-[#34312D]">
                        {selectedCard.nameKo}{' '}
                        <span className="text-base font-normal text-[#827B72]">
                          ({selectedCard.nameEn})
                        </span>
                      </h3>
                      <p className="text-xs text-[#777B61]">
                        {selectedCard.keywords.join(' · ')}
                      </p>
                    </div>

                    <div className="space-y-3 text-sm leading-relaxed text-[#34312D]/90">
                      <div>
                        <p className="text-xs font-medium text-[#777B61] mb-1">
                          전통 상징과 의미
                        </p>
                        <p>{selectedCard.meaningGuide}</p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#777B61] mb-1">
                          성찰의 시선
                        </p>
                        <p className="font-serif text-base text-[#34312D]">
                          “{selectedCard.insight}”
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-[#777B61] mb-1">
                          나에게 던져볼 질문
                        </p>
                        <p className="font-question text-[16.5px] sm:text-[17.5px] font-normal leading-[1.68] text-[#51483E] break-keep">
                          {selectedCard.reflectionQuestion}
                        </p>
                      </div>

                      <div className="pt-1 border-t border-[#E5DED1]/70">
                        <p className="text-xs font-medium text-[#827B72] mb-1">
                          작은 시도 제안
                        </p>
                        <p className="text-xs sm:text-sm text-[#34312D]/80">
                          {selectedCard.gentleAction}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* User Personal Notes for This Card (Visually Separated) */}
                  <section
                    aria-label="이 카드에 남긴 나의 기록"
                    className="rounded-2xl border border-dashed border-[#B69A70]/60 bg-[#FFFCF6]/65 p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="inline-flex items-center gap-1.5 text-sm font-medium text-[#34312D]">
                        <BookOpen
                          className="w-4 h-4 text-[#777B61]"
                          aria-hidden="true"
                        />
                        <span>이 카드에 남긴 나의 기록</span>
                        <span className="text-xs font-normal text-[#827B72] tabular-nums ml-1">
                          {selectedCardNotes.length}건
                        </span>
                      </h4>
                      {onAddCardReflection && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsWritingNote((prev) => !prev);
                            setNoteFeedback(null);
                          }}
                          className="inline-flex items-center gap-1.5 min-h-[36px] px-3 py-1.5 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] hover:bg-[#E5DED1]/45 text-xs font-medium text-[#34312D] transition-colors cursor-pointer"
                        >
                          <PenLine className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
                          <span>{isWritingNote ? '작성 닫기' : '인사이트 노트에 기록'}</span>
                        </button>
                      )}
                    </div>

                    {noteFeedback && (
                      <div
                        role="status"
                        aria-live="polite"
                        className={`flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs border ${
                          noteFeedback.type === 'success'
                            ? 'bg-[#777B61]/10 border-[#777B61]/25 text-[#34312D]'
                            : 'bg-[#A65D4E]/10 border-[#A65D4E]/25 text-[#7A3B2E]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 text-[#777B61] shrink-0" aria-hidden="true" />
                        <span>{noteFeedback.text}</span>
                      </div>
                    )}

                    {isWritingNote && onAddCardReflection && (
                      <form onSubmit={handleSaveCardNote} className="space-y-3">
                        <textarea
                          rows={3}
                          value={cardNoteDraft}
                          onChange={(e) => setCardNoteDraft(e.target.value)}
                          placeholder={`「${selectedCard.nameKo}」 카드를 바라보며 떠오른 생각을 가볍게 적어 보세요.`}
                          aria-label="카드 성찰 메모 작성"
                          className="w-full rounded-xl bg-[#FFFCF6] border border-[#E5DED1] px-3.5 py-2.5 text-sm leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61]"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsWritingNote(false);
                              setNoteFeedback(null);
                            }}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#E5DED1] bg-[#FFFCF6] text-xs text-[#827B72] hover:text-[#34312D] cursor-pointer"
                          >
                            취소
                          </button>
                          <button
                            type="submit"
                            className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-xs font-medium cursor-pointer"
                          >
                            노트에 저장
                          </button>
                        </div>
                      </form>
                    )}

                    {selectedCardNotes.length === 0 ? (
                      <p className="text-xs sm:text-sm text-[#827B72] leading-relaxed">
                        아직 이 카드를 만나 인사이트 노트에 남긴 개인 기록이 없습니다.
                      </p>
                    ) : (
                      <ul className="space-y-2.5">
                        {selectedCardNotes.map((rec) => (
                          <li key={rec.id}>
                            {onOpenRecord ? (
                              <button
                                type="button"
                                onClick={() => onOpenRecord(rec.id)}
                                className="w-full text-left rounded-xl bg-[#FFFCF6] border border-[#E5DED1] hover:border-[#777B61] p-3.5 space-y-1.5 transition-colors group cursor-pointer"
                              >
                                <div className="flex items-center justify-between gap-2 text-xs text-[#827B72] tabular-nums">
                                  <span>{rec.date}</span>
                                  <span className="inline-flex items-center gap-0.5 text-[#777B61] group-hover:underline">
                                    기록 열기
                                    <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                                  </span>
                                </div>
                                {rec.selectedAction && (
                                  <p className="text-xs text-[#777B61]">
                                    선택한 시도: {rec.selectedAction}
                                  </p>
                                )}
                                <p className="text-sm leading-relaxed text-[#34312D] whitespace-pre-wrap">
                                  {rec.userNote ||
                                    rec.actionMemo ||
                                    '(선택한 시도만 기록됨)'}
                                </p>
                              </button>
                            ) : (
                              <div className="rounded-xl bg-[#FFFCF6] border border-[#E5DED1] p-3.5 space-y-1.5">
                                <p className="text-xs text-[#827B72] tabular-nums">
                                  {rec.date}
                                </p>
                                {rec.selectedAction && (
                                  <p className="text-xs text-[#777B61]">
                                    선택한 시도: {rec.selectedAction}
                                  </p>
                                )}
                                <p className="text-sm leading-relaxed text-[#34312D] whitespace-pre-wrap">
                                  {rec.userNote ||
                                    rec.actionMemo ||
                                    '(선택한 시도만 기록됨)'}
                                </p>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filter + Search Bar */}
            <div className="shrink-0 px-4 sm:px-6 py-3.5 border-b border-[#E5DED1] bg-[#F7F3EA] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  role="tablist"
                  aria-label="카드 구분 필터"
                  className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0"
                >
                  {FILTER_OPTIONS.map((opt) => {
                    const active = category === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setCategory(opt.id)}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                          active
                            ? 'bg-[#777B61] text-[#FFFCF6] border-[#777B61]'
                            : 'bg-[#FFFCF6] text-[#827B72] border-[#E5DED1] hover:text-[#34312D]'
                        }`}
                      >
                        {opt.label} ({opt.count})
                      </button>
                    );
                  })}
                </div>

                <div className="relative w-full sm:w-64 shrink-0">
                  <Search
                    className="w-4 h-4 text-[#827B72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="카드 이름, 영문명, 키워드 검색"
                    aria-label="78장 타로 카드 검색"
                    className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-xl bg-[#FFFCF6] border border-[#E5DED1] text-sm text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61]"
                  />
                </div>
              </div>
            </div>

            {/* 78-Card Grid */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
              {filteredCards.length === 0 ? (
                <div className="py-16 text-center space-y-2">
                  <p className="text-sm text-[#34312D]">
                    검색 조건에 맞는 카드가 없습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('all');
                      setSearchQuery('');
                    }}
                    className="min-h-[44px] px-4 py-2 text-xs font-medium text-[#777B61] underline underline-offset-4 cursor-pointer"
                  >
                    전체 78장 다시 보기
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                  {filteredCards.map((card) => {
                    const noteCount = recordCountByCard.get(card.id)?.length ?? 0;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => setSelectedCard(card)}
                        className="group text-left rounded-xl bg-[#FFFCF6] border border-[#E5DED1] hover:border-[#777B61] overflow-hidden transition-colors flex flex-col cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61]"
                      >
                        <div className="aspect-[896/1200] w-full overflow-hidden bg-[#FFFCF6]">
                          <TarotCardArtwork
                            card={card}
                            size="thumbnail"
                            onStatusChange={handleStatusChange}
                          />
                        </div>
                        <div className="px-2.5 py-2 border-t border-[#E5DED1] space-y-0.5 flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs font-medium text-[#34312D] leading-tight">
                              <span className="font-display text-[11px] text-[#777B61] mr-1">
                                {card.arcanaNumber}
                              </span>
                              {card.nameKo}
                            </p>
                            <p className="font-display text-[11px] text-[#827B72] leading-tight break-words mt-0.5">
                              {card.nameEn}
                            </p>
                          </div>
                          {noteCount > 0 && (
                            <p className="text-[11px] text-[#777B61] pt-0.5 tabular-nums">
                              내 기록 {noteCount}건
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
