import { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, BookOpen, Compass, Info, X } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
import { PWAInstallButton } from './components/PWAInstallButton';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useLanguage } from './i18n/LanguageContext';

export type ReadingDrawCount = 1 | 3;

function createReadingSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `reading_${crypto.randomUUID()}`;
  }
  return `reading_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function App() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'today', label: t.nav.today },
    { id: 'journal', label: t.nav.journal },
    { id: 'read', label: t.nav.read },
    { id: 'about', label: t.nav.about },
  ];
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
  const [logoModalOpen, setLogoModalOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();
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
  } = useReflections(language);

  useEffect(() => {
    return () => {
      if (shuffleTimerRef.current !== null) {
        window.clearTimeout(shuffleTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!logoModalOpen) return undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLogoModalOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [logoModalOpen]);

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

    if (typeof window !== 'undefined' && window.scrollY > 24) {
      scrollTarget();
    }

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
  }, [deckMode, performUniqueShuffle, scrollTarget]);

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
        scrollTarget();
      }
    },
    [drawPhase, drawCount, deckMode, allowReversed, scrollTarget]
  );

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
      {/* Top Navigation Header (Mobile & Desktop) */}
      <header className="sticky top-0 z-30 bg-[#F7F3EA]/90 backdrop-blur-md border-b border-[#E5DED1]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 h-12 md:h-16 flex items-center justify-between gap-4 md:gap-6">
          <button
            type="button"
            onClick={() => setLogoModalOpen(true)}
            aria-label={t.nav.logoZoomAria}
            aria-haspopup="dialog"
            className="inline-flex items-center gap-2 font-display text-lg font-medium tracking-[0.2em] text-[#34312D] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#777B61]"
          >
            <img
              src="/brand/lucida-symbol.png"
              alt=""
              aria-hidden="true"
              className="w-7 h-auto object-contain mix-blend-multiply"
            />
            <span>LUCIDA</span>
          </button>

          <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-5">
            <nav aria-label={t.nav.primaryNavAria} className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => {
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
            <PWAInstallButton variant="header" />
            <LanguageSwitcher />
          </div>
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
            onSaveReflection={addReflection}
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
        aria-label={t.nav.mobileNavAria}
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFCF6] border-t border-[#E5DED1] shadow-[0_-6px_20px_-10px_rgba(52,49,45,0.12)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-4 h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center justify-center gap-1 min-h-[48px] px-1 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#777B61] cursor-pointer"
              >
                {renderTabIcon(item.id, isActive)}
                <span
                  className={`text-[10.5px] sm:text-[11px] font-medium whitespace-nowrap truncate max-w-full ${
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

      <AnimatePresence>
        {logoModalOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.logoModalAria}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.08 : 0.24,
              ease: 'easeInOut',
            }}
            onClick={() => setLogoModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-5 sm:p-8 bg-[#1E1C19]/68 backdrop-blur-[2px] cursor-pointer"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
              transition={{
                duration: prefersReducedMotion ? 0.08 : 0.24,
                ease: 'easeInOut',
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[min(88vw,460px)] max-h-[84dvh] rounded-2xl bg-[#FBF7EE] border border-[#E5DED1] p-5 sm:p-7 shadow-[0_24px_64px_-14px_rgba(18,16,14,0.52)] flex items-center justify-center cursor-default"
            >
              <button
                type="button"
                onClick={() => setLogoModalOpen(false)}
                aria-label={t.nav.logoModalCloseAria}
                className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 z-10 w-9 h-9 rounded-full bg-[#F7F3EA]/92 hover:bg-[#E5DED1]/75 border border-[#E5DED1] text-[#34312D] flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <img
                src="/brand/lucida-logo-main.png"
                alt={t.nav.logoAlt}
                className="w-full h-auto max-h-[70dvh] object-contain mix-blend-multiply select-none pointer-events-none"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
