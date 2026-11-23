import { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, BookOpen, Compass, Info } from 'lucide-react';
import { ActiveTab, DeckMode, TarotCard } from './types/reflection';
import { FULL_TAROT_DECK, MAJOR_ARCANA_DECK } from './data/cards';
import { getUnbiasedRandomInt, shuffleUniqueSpread } from './utils/deckShuffle';
import { useReflections } from './hooks/useReflections';
import { TodayView } from './components/TodayView';
import { JournalView } from './components/JournalView';
import { ReadMyselfView } from './components/ReadMyselfView';
import { AboutView } from './components/AboutView';
import { DrawPhase } from './components/CardShuffleSpread';
import { DeckEncyclopediaModal } from './components/DeckEncyclopediaModal';

const NAV_ITEMS: { id: ActiveTab; label: string }[] = [
  { id: 'today', label: '지금, 나에게' },
  { id: 'journal', label: '인사이트 노트' },
  { id: 'read', label: '나를 읽다' },
  { id: 'about', label: '앱 소개' },
];

export type ReadingDrawCount = 1 | 3;

function createReadingSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `reading_${crypto.randomUUID()}`;
  }
  return `reading_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');
  const [deckMode, setDeckMode] = useState<DeckMode>('full');
  const [drawCount, setDrawCount] = useState<ReadingDrawCount>(1);
  const [allowReversed, setAllowReversed] = useState<boolean>(false);
  const [drawPhase, setDrawPhase] = useState<DrawPhase>('idle');
  const [readingSessionId, setReadingSessionId] = useState<string>(() =>
    createReadingSessionId()
  );

  const drawnHistoryRef = useRef<Record<DeckMode, Set<string>>>({
    full: new Set<string>(),
    major: new Set<string>(),
  });
  const previousSpreadIdsRef = useRef<string[]>([]);

  const [spreadCards, setSpreadCards] = useState<TarotCard[]>(() => {
    const { shuffledDeck } = shuffleUniqueSpread({ deck: FULL_TAROT_DECK });
    previousSpreadIdsRef.current = shuffledDeck.slice(0, 7).map((c) => c.id);
    return shuffledDeck;
  });

  const [selectedCards, setSelectedCards] = useState<TarotCard[]>([]);
  const selectedCardsRef = useRef<TarotCard[]>([]);
  const [selectedOrientations, setSelectedOrientations] = useState<
    ('upright' | 'reversed')[]
  >([]);
  const selectedOrientationsRef = useRef<('upright' | 'reversed')[]>([]);

  const [focusedRecordId, setFocusedRecordId] = useState<string | null>(null);
  const [encyclopediaOpen, setEncyclopediaOpen] = useState(false);
  const [encyclopediaCardId, setEncyclopediaCardId] = useState<string | null>(null);
  const shuffleTimerRef = useRef<number | null>(null);

  const {
    records,
    storageError,
    syncReadingAttempts,
    addReflection,
    addFreeformReflection,
    updateReflection,
    addFollowUpNote,
    deleteReflection,
    importReflections,
  } = useReflections();

  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current !== null) {
        window.clearTimeout(shuffleTimerRef.current);
      }
    };
  }, []);

  const getActiveDeck = useCallback(
    (mode: DeckMode = deckMode) =>
      mode === 'major' ? MAJOR_ARCANA_DECK : FULL_TAROT_DECK,
    [deckMode]
  );

  const performUniqueShuffle = useCallback(
    (mode: DeckMode) => {
      const historySet = drawnHistoryRef.current[mode];
      const { shuffledDeck, didResetCycle } = shuffleUniqueSpread({
        deck: getActiveDeck(mode),
        excludedIds: historySet,
        previousSpreadIds: previousSpreadIdsRef.current,
        minSpreadCount: 7,
      });

      if (didResetCycle) {
        drawnHistoryRef.current[mode] = new Set<string>();
      }

      previousSpreadIdsRef.current = shuffledDeck.slice(0, 7).map((c) => c.id);
      setSpreadCards(shuffledDeck);
    },
    [getActiveDeck]
  );

  const handleChangeDeckMode = useCallback(
    (nextMode: DeckMode) => {
      setDeckMode(nextMode);
      selectedCardsRef.current = [];
      selectedOrientationsRef.current = [];
      setSelectedCards([]);
      setSelectedOrientations([]);
      setReadingSessionId(createReadingSessionId());
      performUniqueShuffle(nextMode);
    },
    [performUniqueShuffle]
  );

  const handleChangeDrawCount = useCallback((nextCount: ReadingDrawCount) => {
    setDrawCount(nextCount);
    selectedCardsRef.current = [];
    selectedOrientationsRef.current = [];
    setSelectedCards([]);
    setSelectedOrientations([]);
    setReadingSessionId(createReadingSessionId());
  }, []);

  const handleStartShuffle = useCallback(() => {
    if (shuffleTimerRef.current !== null) {
      window.clearTimeout(shuffleTimerRef.current);
    }

    selectedCardsRef.current = [];
    selectedOrientationsRef.current = [];
    setSelectedCards([]);
    setSelectedOrientations([]);
    setReadingSessionId(createReadingSessionId());
    performUniqueShuffle(deckMode);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDrawPhase('selecting');
      return;
    }

    setDrawPhase('shuffling');

    shuffleTimerRef.current = window.setTimeout(() => {
      setDrawPhase('selecting');
      shuffleTimerRef.current = null;
    }, 900);
  }, [deckMode, performUniqueShuffle]);

  const handleSelectCard = useCallback(
    (card: TarotCard) => {
      if (drawPhase !== 'selecting') return;

      // Strict duplicate prevention within a single reading
      if (selectedCardsRef.current.some((c) => c.id === card.id)) {
        return;
      }
      if (selectedCardsRef.current.length >= drawCount) {
        return;
      }

      const next = [...selectedCardsRef.current, card];
      const nextOrientation: 'upright' | 'reversed' =
        allowReversed && getUnbiasedRandomInt(2) === 1 ? 'reversed' : 'upright';
      const nextOrientations = [
        ...selectedOrientationsRef.current,
        nextOrientation,
      ];

      selectedCardsRef.current = next;
      selectedOrientationsRef.current = nextOrientations;
      setSelectedCards(next);
      setSelectedOrientations(nextOrientations);
      drawnHistoryRef.current[deckMode].add(card.id);

      if (next.length >= drawCount) {
        setDrawPhase('revealed');
      }
    },
    [drawPhase, drawCount, deckMode, allowReversed]
  );

  const scrollTarget = useCallback((elementId?: string) => {
    if (typeof window === 'undefined') return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const behavior: ScrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    window.requestAnimationFrame(() => {
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior, block: 'center' });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior });
    });
  }, []);

  const resetActiveReadingState = useCallback(() => {
    if (shuffleTimerRef.current !== null) {
      window.clearTimeout(shuffleTimerRef.current);
      shuffleTimerRef.current = null;
    }
    selectedCardsRef.current = [];
    selectedOrientationsRef.current = [];
    setSelectedCards([]);
    setSelectedOrientations([]);
    setReadingSessionId(createReadingSessionId());
    performUniqueShuffle(deckMode);
    setDrawPhase('idle');
    setActiveTab('today');
  }, [deckMode, performUniqueShuffle]);

  const handleStartNewReading = useCallback(() => {
    resetActiveReadingState();
    scrollTarget('reading-setup-controls');
  }, [resetActiveReadingState, scrollTarget]);

  const handleGoHome = useCallback(() => {
    resetActiveReadingState();
    scrollTarget();
  }, [resetActiveReadingState, scrollTarget]);

  const handleOpenEncyclopedia = useCallback((cardId?: string) => {
    setEncyclopediaCardId(cardId ?? null);
    setEncyclopediaOpen(true);
  }, []);

  const handleCloseEncyclopedia = useCallback(() => {
    setEncyclopediaOpen(false);
    setEncyclopediaCardId(null);
  }, []);

  const renderTabIcon = (id: ActiveTab, isActive: boolean) => {
    const className = `w-5 h-5 ${
      isActive ? 'text-[#777B61]' : 'text-[#827B72]'
    }`;
    if (id === 'today') return <Sparkles className={className} aria-hidden="true" />;
    if (id === 'journal') return <BookOpen className={className} aria-hidden="true" />;
    if (id === 'read') return <Compass className={className} aria-hidden="true" />;
    return <Info className={className} aria-hidden="true" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EA] text-[#34312D]">
      {/* Desktop Top Navigation */}
      <header className="hidden md:block sticky top-0 z-30 bg-[#F7F3EA]/90 backdrop-blur-md border-b border-[#E5DED1]">
        <div className="max-w-5xl mx-auto px-8 h-16 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className="font-display text-xl font-medium tracking-[0.16em] text-[#34312D] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#777B61]"
          >
            LUCIDA
          </button>

          <nav aria-label="주요 메뉴" className="flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#777B61] ${
                    isActive
                      ? 'text-[#34312D]'
                      : 'text-[#827B72] hover:text-[#34312D]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-[21px] h-[2px] bg-[#777B61]"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Storage Error Banner if localStorage fails */}
      {storageError && (
        <div
          role="alert"
          className="bg-[#A65D4E]/10 border-b border-[#A65D4E]/25 px-5 py-2.5 text-center text-xs text-[#7A3B2E]"
        >
          {storageError}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pb-[calc(5.75rem+env(safe-area-inset-bottom))] md:pb-12">
        {activeTab === 'today' && (
          <TodayView
            phase={drawPhase}
            readingSessionId={readingSessionId}
            records={records}
            deckMode={deckMode}
            onChangeDeckMode={handleChangeDeckMode}
            drawCount={drawCount}
            onChangeDrawCount={handleChangeDrawCount}
            allowReversed={allowReversed}
            onChangeAllowReversed={setAllowReversed}
            spreadCards={spreadCards}
            selectedCards={selectedCards}
            selectedOrientations={selectedOrientations}
            onStartShuffle={handleStartShuffle}
            onSelectCard={handleSelectCard}
            onSyncAttempts={syncReadingAttempts}
            onStartNewReading={handleStartNewReading}
            onGoHome={handleGoHome}
            savedRecordCount={records.length}
            onGoToJournal={(targetRecordId?: string) => {
              if (targetRecordId) {
                setFocusedRecordId(targetRecordId);
              } else {
                const matched = records.find(
                  (r) => r.readingSessionId === readingSessionId
                );
                if (matched) setFocusedRecordId(matched.id);
              }
              setActiveTab('journal');
            }}
            onOpenEncyclopedia={handleOpenEncyclopedia}
          />
        )}

        {activeTab === 'journal' && (
          <JournalView
            records={records}
            focusedRecordId={focusedRecordId}
            onClearFocusedRecord={() => setFocusedRecordId(null)}
            onAddFreeform={addFreeformReflection}
            onUpdate={updateReflection}
            onAddFollowUp={addFollowUpNote}
            onDelete={deleteReflection}
            onImport={importReflections}
            onGoToToday={() => setActiveTab('today')}
            onOpenEncyclopedia={handleOpenEncyclopedia}
          />
        )}

        {activeTab === 'read' && (
          <ReadMyselfView
            records={records}
            onGoToToday={() => setActiveTab('today')}
            onGoToJournal={() => setActiveTab('journal')}
            onOpenRecord={(recordId) => {
              setFocusedRecordId(recordId);
              setActiveTab('journal');
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutView onOpenEncyclopedia={() => handleOpenEncyclopedia()} />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <nav
        aria-label="하단 메뉴"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFCF6] border-t border-[#E5DED1] shadow-[0_-6px_20px_-10px_rgba(52,49,45,0.12)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center justify-center gap-1 min-h-[48px] focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#777B61] cursor-pointer"
              >
                {renderTabIcon(item.id, isActive)}
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    isActive ? 'text-[#34312D]' : 'text-[#827B72]'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <DeckEncyclopediaModal
        isOpen={encyclopediaOpen}
        onClose={handleCloseEncyclopedia}
        records={records}
        initialCardId={encyclopediaCardId}
        onBackToReading={() => {
          handleCloseEncyclopedia();
          setActiveTab('today');
        }}
        onOpenRecord={(recordId) => {
          handleCloseEncyclopedia();
          setFocusedRecordId(recordId);
          setActiveTab('journal');
        }}
        onAddCardReflection={(card, note) => addReflection(card, note)}
      />
    </div>
  );
}
