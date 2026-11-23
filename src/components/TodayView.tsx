import { FormEvent, useState, useEffect, useRef, useMemo } from 'react';
import {
  Shuffle,
  Check,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Home,
  Sparkles,
} from 'lucide-react';
import {
  DeckMode,
  ReflectionRecord,
  SelectedAttemptItem,
  SpreadCardSnapshot,
  TarotCard,
} from '../types/reflection';
import type { ReadingSyncPayload } from '../hooks/useReflections';
import {
  generatePersonalizedAttempts,
  resolveLocalizedAttemptItem,
} from '../utils/attemptGenerator';
import { getCardById } from '../data/cards';
import { TarotCardFlip } from './TarotCardFlip';
import { TarotCardArtwork } from './TarotCardArtwork';
import { CardShuffleSpread, DrawPhase } from './CardShuffleSpread';
import { LucidaBrandMark } from './LucidaBrandMark';
import type { ReadingDrawCount } from '../App';
import { useLanguage } from '../i18n/LanguageContext';
import { getLocalizedCard } from '../i18n/cardHelpers';

const ONBOARDING_KEY = 'lucida_onboarding_dismissed';

interface TodayViewProps {
  phase: DrawPhase;
  readingSessionId: string;
  records: ReflectionRecord[];
  deckMode: DeckMode;
  onChangeDeckMode: (mode: DeckMode) => void;
  drawCount: ReadingDrawCount;
  onChangeDrawCount: (count: ReadingDrawCount) => void;
  allowReversed: boolean;
  onChangeAllowReversed: (allow: boolean) => void;
  spreadCards: TarotCard[];
  selectedCards: TarotCard[];
  selectedOrientations: ('upright' | 'reversed')[];
  onStartShuffle: () => void;
  onSelectCard: (card: TarotCard) => void;
  onSyncAttempts: (
    payload: ReadingSyncPayload
  ) => { ok: boolean; recordId?: string; error?: string };
  onSaveReflection: (
    card: TarotCard,
    note: string,
    selectedAction?: string,
    orientation?: 'upright' | 'reversed',
    spreadCards?: SpreadCardSnapshot[],
    options?: {
      readingSessionId?: string;
      overallMessage?: string;
      selectedActions?: SelectedAttemptItem[];
      actionMemo?: string;
    }
  ) => { ok: boolean; error?: string; record?: ReflectionRecord };
  onStartNewReading: () => void;
  onGoHome: () => void;
  savedRecordCount?: number;
  onGoToJournal: (targetRecordId?: string) => void;
}

export function TodayView({
  phase,
  readingSessionId,
  records,
  deckMode,
  onChangeDeckMode,
  drawCount,
  onChangeDrawCount,
  allowReversed,
  onChangeAllowReversed,
  spreadCards,
  selectedCards,
  selectedOrientations,
  onStartShuffle,
  onSelectCard,
  onSyncAttempts,
  onSaveReflection,
  onStartNewReading,
  onGoHome,
  savedRecordCount = 0,
  onGoToJournal,
}: TodayViewProps) {
  const { language, t } = useLanguage();

  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [selectedAttempts, setSelectedAttempts] = useState<SelectedAttemptItem[]>(
    () => {
      const existing = records.find(
        (r) => r.readingSessionId === readingSessionId
      );
      return existing?.selectedActions ?? [];
    }
  );
  const [hasSyncedAttemptNotice, setHasSyncedAttemptNotice] = useState(false);
  const lastSyncedRecordIdRef = useRef<string | undefined>(
    records.find((r) => r.readingSessionId === readingSessionId)?.id
  );

  const [noteDraft, setNoteDraft] = useState('');
  const [noteFeedback, setNoteFeedback] = useState<{
    type: 'success' | 'error';
    code?: 'empty' | 'saved' | 'error';
    text?: string;
  } | null>(null);

  const [cardFlipped, setCardFlipped] = useState(false);
  const [activeRevealIndex, setActiveRevealIndex] = useState(0);

  const activeCard =
    selectedCards[activeRevealIndex] ?? selectedCards[0] ?? null;
  const activeOrientation: 'upright' | 'reversed' =
    selectedOrientations[activeRevealIndex] ?? selectedOrientations[0] ?? 'upright';

  const currentSessionRecord = useMemo(
    () => records.find((r) => r.readingSessionId === readingSessionId) ?? null,
    [records, readingSessionId]
  );

  // Restore attempt checkboxes only when switching to a different readingSessionId
  useEffect(() => {
    const existing = records.find(
      (r) => r.readingSessionId === readingSessionId
    );
    const nextAttempts = existing?.selectedActions ?? [];
    lastSyncedRecordIdRef.current = existing?.id;
    setSelectedAttempts(nextAttempts);
    setHasSyncedAttemptNotice(false);
    setNoteDraft('');
    setNoteFeedback(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingSessionId]);

  useEffect(() => {
    setActiveRevealIndex(0);
  }, [selectedCards]);

  useEffect(() => {
    if (phase === 'revealed' && activeCard) {
      setCardFlipped(false);
      const timer = window.setTimeout(() => {
        setCardFlipped(true);
      }, 60);
      return () => window.clearTimeout(timer);
    }
    setCardFlipped(false);
    return undefined;
  }, [phase, activeCard?.id]);

  const buildSpreadSnapshot = (): SpreadCardSnapshot[] | undefined => {
    if (selectedCards.length <= 1) return undefined;
    return selectedCards.map((c, idx) => ({
      cardId: c.id,
      cardName: c.nameKo,
      cardNameEn: c.nameEn,
      orientation: selectedOrientations[idx] ?? 'upright',
      positionLabel: t.today.threeCardPositions[idx],
    }));
  };

  const computeOverallMessage = (): string => {
    if (selectedCards.length > 1) {
      const l0 = getLocalizedCard(selectedCards[0], language);
      const l1 = getLocalizedCard(selectedCards[1] ?? selectedCards[0], language);
      const l2 = getLocalizedCard(selectedCards[2] ?? selectedCards[0], language);
      return t.today.synthesisThreeCard(
        l0.displayName,
        l0.keywords[0],
        l1.displayName,
        l1.keywords[0],
        l2.displayName,
        l2.keywords[0]
      );
    }

    const card = selectedCards[0];
    if (!card) return '';
    const loc = getLocalizedCard(card, language);
    const orient = selectedOrientations[0] ?? 'upright';
    const joined = loc.keywords.join(' · ');
    if (orient === 'reversed') {
      return t.today.synthesisSingleReversed(loc.displayName, joined);
    }

    return t.today.synthesisSingleUpright(loc.displayName, joined);
  };

  const overallSynthesisSnapshot = computeOverallMessage();

  const personalizedAttempts = useMemo(
    () =>
      generatePersonalizedAttempts(
        selectedCards,
        selectedOrientations,
        overallSynthesisSnapshot,
        language
      ),
    [selectedCards, selectedOrientations, overallSynthesisSnapshot, language]
  );

  const syncCurrentAttempts = (nextAttempts: SelectedAttemptItem[]) => {
    const rootCard = selectedCards[0] ?? activeCard;
    if (!rootCard) return;
    const rootOrientation = selectedOrientations[0] ?? activeOrientation;

    const result = onSyncAttempts({
      readingSessionId,
      card: rootCard,
      orientation: rootOrientation,
      spreadCards: buildSpreadSnapshot(),
      overallMessage: computeOverallMessage(),
      selectedActions: nextAttempts,
    });

    if (result.ok) {
      lastSyncedRecordIdRef.current = result.recordId;
      setHasSyncedAttemptNotice(nextAttempts.length > 0);
    }
  };

  const isAttemptSame = (a: SelectedAttemptItem, b: SelectedAttemptItem) => {
    if (a.attemptId && b.attemptId) return a.attemptId === b.attemptId;
    return a.cardId === b.cardId && a.actionText === b.actionText;
  };

  const isAttemptChecked = (candidate: SelectedAttemptItem) =>
    selectedAttempts.some((item) => isAttemptSame(item, candidate));

  const handleToggleAttempt = (candidate: SelectedAttemptItem) => {
    const exists = isAttemptChecked(candidate);
    const nextAttempts = exists
      ? selectedAttempts.filter((item) => !isAttemptSame(item, candidate))
      : [...selectedAttempts, candidate];

    setSelectedAttempts(nextAttempts);
    syncCurrentAttempts(nextAttempts);
  };

  const handleOpenLinkedJournal = () => {
    onGoToJournal(lastSyncedRecordIdRef.current);
  };

  const handleDismissOnboarding = () => {
    setOnboardingDismissed(true);
    try {
      window.localStorage.setItem(ONBOARDING_KEY, 'true');
    } catch {
      // Ignore storage error
    }
  };

  const handleSaveInsightNote = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = noteDraft.trim();
    if (!trimmed) {
      setNoteFeedback({
        type: 'error',
        code: 'empty',
      });
      return;
    }

    const rootCard = selectedCards[0] ?? activeCard;
    if (!rootCard) return;
    const rootOrientation = selectedOrientations[0] ?? activeOrientation;

    const result = onSaveReflection(
      rootCard,
      trimmed,
      undefined,
      rootOrientation,
      buildSpreadSnapshot(),
      {
        readingSessionId,
        overallMessage: computeOverallMessage(),
        selectedActions: selectedAttempts,
      }
    );

    if (result.ok) {
      if (result.record?.id) {
        lastSyncedRecordIdRef.current = result.record.id;
      }
      setNoteDraft('');
      setNoteFeedback({
        type: 'success',
        code: 'saved',
      });
    } else {
      setNoteFeedback({
        type: 'error',
        code: 'error',
        text: result.error,
      });
    }
  };

  const resetReadingTransientState = () => {
    lastSyncedRecordIdRef.current = undefined;
    setHasSyncedAttemptNotice(false);
    setSelectedAttempts([]);
    setNoteDraft('');
    setNoteFeedback(null);
    setActiveRevealIndex(0);
    setCardFlipped(false);
  };

  const handleReshuffle = () => {
    resetReadingTransientState();
    onStartShuffle();
  };

  const handleStartNewReadingClick = () => {
    resetReadingTransientState();
    onStartNewReading();
  };

  const handleGoHomeClick = () => {
    resetReadingTransientState();
    onGoHome();
  };

  if (phase !== 'revealed' || !activeCard) {
    return (
      <section
        aria-label={t.today.sectionShuffleAria}
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-2 sm:pt-7 pb-8 flex flex-col items-center text-center"
      >
        {/* Collapsible First-Visit Onboarding Card */}
        {!onboardingDismissed && (
          <aside
            aria-label={t.today.onboardingAsideAria}
            className="w-full mb-5 sm:mb-6 rounded-2xl bg-[#FFFCF6] border border-[#E5DED1] px-4 py-3 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOnboardingOpen((prev) => !prev)}
                aria-expanded={onboardingOpen}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#777B61] cursor-pointer min-h-[32px] text-left"
              >
                <span>{t.today.onboardingToggle}</span>
                {onboardingOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={handleDismissOnboarding}
                className="text-xs text-[#827B72] hover:text-[#34312D] underline underline-offset-2 whitespace-nowrap cursor-pointer min-h-[32px] shrink-0"
              >
                {t.today.onboardingDismiss}
              </button>
            </div>

            {onboardingOpen && (
              <ul className="mt-2.5 space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85 border-t border-[#E5DED1] pt-2.5">
                {t.today.onboardingBullets.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            )}
          </aside>
        )}

        <header
          className={
            phase === 'idle'
              ? 'mb-5 sm:mb-7 space-y-6 sm:space-y-8'
              : 'mb-3 sm:mb-4 space-y-3'
          }
        >
          <LucidaBrandMark
            variant="hero"
            subtitle={phase === 'idle' ? t.today.heroSubtitle : undefined}
          />
          <div className="space-y-1.5 sm:space-y-2">
            <h1 className="font-serif text-[28px] sm:text-4xl font-medium text-[#34312D]">
              {t.today.heroTitle}
            </h1>
            <p className="text-sm sm:text-[15px] leading-relaxed text-[#827B72] max-w-md mx-auto">
              {t.today.heroLead}
            </p>
          </div>
        </header>

        <div className="w-full my-1 overflow-visible">
          <CardShuffleSpread
            phase={phase === 'revealed' ? 'idle' : phase}
            spreadCards={spreadCards}
            selectedCards={selectedCards}
            onStartShuffle={onStartShuffle}
            onSelectCard={onSelectCard}
          />
        </div>

        <div
          id="reading-setup-controls"
          className="mt-4 sm:mt-6 space-y-3 w-full max-w-md scroll-mt-24"
        >
          {phase === 'idle' && (
            <>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div
                  role="group"
                  aria-label={t.today.deckGroupAria}
                  className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
                >
                  <button
                    type="button"
                    onClick={() => onChangeDeckMode('full')}
                    aria-pressed={deckMode === 'full'}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      deckMode === 'full'
                        ? 'bg-[#777B61] text-[#FFFCF6]'
                        : 'text-[#827B72] hover:text-[#34312D]'
                    }`}
                  >
                    {t.today.deckFull}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeDeckMode('major')}
                    aria-pressed={deckMode === 'major'}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      deckMode === 'major'
                        ? 'bg-[#777B61] text-[#FFFCF6]'
                        : 'text-[#827B72] hover:text-[#34312D]'
                    }`}
                  >
                    {t.today.deckMajor}
                  </button>
                </div>

                <div
                  role="group"
                  aria-label={t.today.drawCountGroupAria}
                  className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
                >
                  <button
                    type="button"
                    onClick={() => onChangeDrawCount(1)}
                    aria-pressed={drawCount === 1}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      drawCount === 1
                        ? 'bg-[#777B61] text-[#FFFCF6]'
                        : 'text-[#827B72] hover:text-[#34312D]'
                    }`}
                  >
                    {t.today.drawOne}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeDrawCount(3)}
                    aria-pressed={drawCount === 3}
                    className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      drawCount === 3
                        ? 'bg-[#777B61] text-[#FFFCF6]'
                        : 'text-[#827B72] hover:text-[#34312D]'
                    }`}
                  >
                    {t.today.drawThree}
                  </button>
                </div>

                <div
                  role="group"
                  aria-label={t.today.perspectiveGroupAria}
                  className="inline-flex items-center gap-1 p-1 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
                >
                  <button
                    type="button"
                    onClick={() => onChangeAllowReversed(false)}
                    aria-pressed={!allowReversed}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      !allowReversed
                        ? 'bg-[#777B61] text-[#FFFCF6]'
                        : 'text-[#827B72] hover:text-[#34312D]'
                    }`}
                  >
                    {t.today.perspectiveStandard}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeAllowReversed(true)}
                    aria-pressed={allowReversed}
                    className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      allowReversed
                        ? 'bg-[#777B61] text-[#FFFCF6]'
                        : 'text-[#827B72] hover:text-[#34312D]'
                    }`}
                  >
                    {t.today.perspectiveOpen}
                  </button>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-[#34312D]/85">
                {t.today.idlePrompt}
              </p>
              <button
                type="button"
                onClick={onStartShuffle}
                className="w-[72%] sm:w-full sm:max-w-[280px] mx-auto min-h-[40px] sm:min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] active:scale-[0.995] text-[#FFFCF6] text-[14.5px] sm:text-[15px] font-medium shadow-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <Shuffle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{t.today.shuffleButton}</span>
              </button>
              <p className="text-xs leading-relaxed text-[#827B72]">
                {t.today.idleSubHint}
              </p>
              {savedRecordCount > 0 && (
                <p className="text-xs text-[#777B61] pt-1">
                  <button
                    type="button"
                    onClick={() => onGoToJournal()}
                    className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#34312D] transition-colors cursor-pointer"
                  >
                    <span>{t.today.savedNotesBanner(savedRecordCount)}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </p>
              )}
            </>
          )}

          {phase === 'shuffling' && (
            <p
              role="status"
              aria-live="polite"
              className="text-[15px] leading-relaxed text-[#777B61] py-3"
            >
              {t.today.shufflingStatus}
            </p>
          )}

          {phase === 'selecting' && (
            <>
              <p
                role="status"
                aria-live="polite"
                className="text-[15px] leading-relaxed text-[#34312D]/90"
              >
                {drawCount === 1
                  ? t.today.selectingSinglePrompt
                  : t.today.selectingThreePrompt(selectedCards.length)}
              </p>

              {drawCount === 3 && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                  {t.today.threeCardPositions.map((label, idx) => {
                    const picked = Boolean(selectedCards[idx]);
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                          picked
                            ? 'bg-[#777B61]/10 border-[#777B61]/40 text-[#34312D]'
                            : 'bg-[#FFFCF6] border-[#E5DED1] text-[#827B72]'
                        }`}
                      >
                        <p className="font-display text-[11px] text-[#777B61]">
                          0{idx + 1}.
                        </p>
                        <p className="font-medium mt-0.5 leading-snug">{label}</p>
                        <p className="text-[11px] mt-0.5">
                          {picked ? t.today.slotPicked : t.today.slotWaiting}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                onClick={onStartShuffle}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] hover:bg-[#E5DED1]/45 text-sm text-[#827B72] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                <span>{t.today.reshuffleButton}</span>
              </button>
            </>
          )}
        </div>

        {/* Gentle below-the-fold guide preview */}
        <div className="w-full mt-7 sm:mt-9 pt-6 border-t border-[#E5DED1] text-left space-y-4">
          <h2 className="font-serif text-base sm:text-lg font-medium text-[#34312D]">
            {t.today.guideTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {t.today.guideSteps.map((step) => (
              <div
                key={step.num}
                className="rounded-xl bg-[#FFFCF6] border border-[#E5DED1] p-4 space-y-1"
              >
                <p className="font-display text-xs font-medium tracking-[0.14em] text-[#777B61]">
                  {step.num}
                </p>
                <p className="text-sm font-medium text-[#34312D]">{step.title}</p>
                <p className="text-xs leading-relaxed text-[#827B72]">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const activeLoc = getLocalizedCard(activeCard, language);

  const getOverallSynthesisMessage = () => {
    if (selectedCards.length > 1) {
      const l0 = getLocalizedCard(selectedCards[0], language);
      const l1 = getLocalizedCard(selectedCards[1] ?? selectedCards[0], language);
      const l2 = getLocalizedCard(selectedCards[2] ?? selectedCards[0], language);
      return t.today.synthesisThreeCard(
        l0.displayName,
        l0.keywords[0],
        l1.displayName,
        l1.keywords[0],
        l2.displayName,
        l2.keywords[0]
      );
    }

    const joined = activeLoc.keywords.join(' · ');
    if (activeOrientation === 'reversed') {
      return t.today.synthesisSingleReversed(activeLoc.displayName, joined);
    }

    return t.today.synthesisSingleUpright(activeLoc.displayName, joined);
  };

  const resolvedNoteFeedbackText = noteFeedback
    ? noteFeedback.code === 'empty'
      ? t.today.noteErrorEmpty
      : noteFeedback.code === 'saved'
      ? t.today.noteSavedFeedback
      : noteFeedback.text || t.today.noteSaveErrorFallback
    : null;

  return (
    <section
      aria-label={t.today.sectionResultAria}
      className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-2 sm:pt-7 pb-8"
    >
      {/* Multi-card spread selector when 3 cards are drawn */}
      {selectedCards.length > 1 && (
        <div
          aria-label={t.today.spreadSelectorAria}
          className="mb-3.5 sm:mb-6 grid grid-cols-3 gap-2 sm:gap-4"
        >
          {selectedCards.map((card, idx) => {
            const isActive = idx === activeRevealIndex;
            const loc = getLocalizedCard(card, language);
            const positionLabel =
              t.today.threeCardPositions[idx] || t.today.positionFallback(idx);
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setActiveRevealIndex(idx);
                }}
                aria-pressed={isActive}
                className={`flex items-center gap-2 sm:gap-3.5 p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFCF6] border-[#777B61] ring-1 ring-[#777B61]/30'
                    : 'bg-[#FFFCF6]/70 border-[#E5DED1] hover:border-[#777B61]/60'
                }`}
              >
                <div className="w-9 sm:w-12 aspect-[896/1200] rounded-lg overflow-hidden border border-[#E5DED1] bg-[#FFFCF6] shrink-0">
                  <TarotCardArtwork
                    card={card}
                    size="thumbnail"
                    isReversed={selectedOrientations[idx] === 'reversed'}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#777B61] leading-tight">
                    0{idx + 1}. {positionLabel}
                  </p>
                  <p className="font-serif text-xs sm:text-sm font-medium text-[#34312D] leading-snug break-keep mt-0.5">
                    {loc.displayName}
                  </p>
                  {language !== 'en' && (
                    <p className="hidden sm:block font-display text-[11px] text-[#827B72] leading-tight break-words mt-0.5">
                      {card.nameEn}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 1. Main Reading Result: Card Artwork + Interpretation + Overall Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-7 lg:gap-9 items-start">
        {/* 1-1. Selected Card & Card Title */}
        <div className="lg:col-span-5 flex flex-row sm:flex-col items-start sm:items-center gap-3.5 sm:gap-0 w-full">
          <div className="shrink-0">
            <TarotCardFlip
              card={activeCard}
              isRevealed={cardFlipped}
              isReversed={activeOrientation === 'reversed'}
            />
          </div>

          <div className="flex-1 min-w-0 sm:mt-3.5 text-left sm:text-center space-y-1">
            {(() => {
              const metaParts = [
                selectedCards.length > 1
                  ? t.today.threeCardPositions[activeRevealIndex]
                  : null,
                activeLoc.suitTheme || null,
              ].filter(Boolean);
              if (metaParts.length === 0) return null;
              return (
                <p className="text-[11px] sm:text-xs tracking-[0.05em] text-[#827B72]">
                  {metaParts.join(' · ')}
                </p>
              );
            })()}
            <h1 className="font-serif text-lg sm:text-[24px] font-medium text-[#34312D] leading-snug">
              {activeLoc.displayName}
            </h1>
            <p className="text-[11px] sm:text-xs text-[#777B61]">
              {activeLoc.keywords.join(' · ')}
            </p>
            <blockquote className="sm:hidden pt-1.5 mt-1 border-t border-[#E5DED1] font-serif text-[14px] leading-[1.45] text-[#34312D]">
              “{activeLoc.insight}”
            </blockquote>
          </div>
        </div>

        {/* 1-2. Card Interpretation, Reflection Question & Overall Synthesis */}
        <div className="lg:col-span-7 space-y-2 sm:space-y-4">
          <div className="bg-[#FFFCF6] border border-[#E5DED1] rounded-2xl p-3 sm:p-6 space-y-1.5 sm:space-y-3.5">
            <div className="hidden sm:flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium tracking-wide text-[#777B61]">
                {t.today.messageHeading}
              </p>
              <p className="text-xs text-[#827B72]">
                {activeLoc.keywords.join(' · ')}
              </p>
            </div>
            <blockquote className="hidden sm:block font-serif text-[21px] leading-[1.55] text-[#34312D]">
              “{activeLoc.insight}”
            </blockquote>
            <p className="text-[13px] sm:text-[15px] leading-[1.55] sm:leading-[1.65] text-[#34312D]/85">
              {activeLoc.meaningGuide}
            </p>
            <div className="pt-3 sm:pt-4 pb-1 sm:pb-1.5 border-t border-[#E7E0D5]/80 space-y-1.5 sm:space-y-2">
              <h2 className="text-[11px] font-medium tracking-wide text-[#777B61]">
                {t.today.questionHeading}
              </h2>
              <p className="font-question text-[18px] sm:text-[21px] font-normal leading-[1.68] sm:leading-[1.72] text-[#51483E] break-keep">
                {activeLoc.reflectionQuestion}
              </p>
            </div>
            {(() => {
              const pastMatches = records.filter(
                (r) =>
                  r.readingSessionId !== readingSessionId &&
                  (r.cardId === activeCard.id ||
                    r.spreadCards?.some((s) => s.cardId === activeCard.id))
              );
              if (pastMatches.length === 0) return null;
              return (
                <div className="pt-1.5 border-t border-[#E7E0D5]/70 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#827B72]">
                    {t.today.pastRecordNotice(
                      activeLoc.displayName,
                      pastMatches.length
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => onGoToJournal(pastMatches[0].id)}
                    className="inline-flex items-center gap-1 font-medium text-[#777B61] hover:text-[#34312D] underline underline-offset-4 cursor-pointer"
                  >
                    <span>{t.today.pastRecordButton}</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
              );
            })()}
          </div>

          <aside
            aria-label={t.today.synthesisAria}
            className="rounded-2xl bg-[#FFFCF6] border border-[#E5DED1] p-3 sm:p-5 space-y-1 sm:space-y-2"
          >
            <p className="text-[11px] sm:text-xs font-medium tracking-wide text-[#777B61]">
              {t.today.synthesisHeading}
            </p>
            {selectedCards.length > 1 && (
              <div className="hidden sm:grid sm:grid-cols-3 gap-2 text-xs">
                {selectedCards.map((card, idx) => {
                  const loc = getLocalizedCard(card, language);
                  return (
                    <div
                      key={`${card.id}-summary`}
                      className="rounded-xl bg-[#F7F3EA]/80 border border-[#E5DED1]/80 px-3 py-2"
                    >
                      <p className="text-[11px] font-medium text-[#777B61]">
                        0{idx + 1}. {t.today.threeCardPositions[idx]}
                      </p>
                      <p className="font-serif text-sm text-[#34312D] mt-0.5">
                        {loc.displayName}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-[12.5px] sm:text-[15px] leading-[1.52] sm:leading-[1.65] text-[#34312D]/90">
              {getOverallSynthesisMessage()}
            </p>
          </aside>
        </div>
      </div>

      {/* 2. Primary CTA & Compact Secondary Pair */}
      <div
        aria-label={t.today.nextActionsAria}
        className="mt-3.5 sm:mt-6 flex flex-col items-center space-y-2"
      >
        <button
          type="button"
          onClick={handleStartNewReadingClick}
          className="w-[72%] sm:w-full sm:max-w-[280px] mx-auto min-h-[40px] sm:min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] active:scale-[0.995] text-[#FFFCF6] text-[14.5px] sm:text-[15px] font-medium shadow-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{t.today.newReadingButton}</span>
        </button>

        <div className="w-[88%] sm:w-full sm:max-w-[300px] mx-auto grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleReshuffle}
            className="min-w-0 min-h-[36px] sm:min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#E5DED1] bg-[#FFFCF6]/75 hover:bg-[#E5DED1]/40 text-[11.5px] sm:text-xs font-medium text-[#6B645C] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#777B61] shrink-0" aria-hidden="true" />
            <span>{t.today.reshuffleButton}</span>
          </button>

          <button
            type="button"
            onClick={handleGoHomeClick}
            className="min-w-0 min-h-[36px] sm:min-h-[38px] inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#E5DED1] bg-[#FFFCF6]/75 hover:bg-[#E5DED1]/40 text-[11.5px] sm:text-xs font-medium text-[#6B645C] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#777B61] shrink-0" aria-hidden="true" />
            <span>{t.today.goHomeButton}</span>
          </button>
        </div>

        <p className="text-[11px] sm:text-xs leading-relaxed text-[#827B72] text-center pt-0.5">
          {t.today.preserveNotesHint}
        </p>
      </div>

      {/* 3. Selectable Attempts (4 personalized items, auto-synced to Insight Note) */}
      <div
        aria-label={t.today.attemptsAria}
        className="mt-7 sm:mt-9 pt-6 border-t border-[#E5DED1] space-y-4"
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              {t.today.attemptsHeading}
            </h2>
            {selectedAttempts.length > 0 && (
              <span className="text-xs font-medium text-[#777B61] tabular-nums">
                {t.today.attemptsSelectedBadge(selectedAttempts.length)}
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-[#827B72]">
            {t.today.attemptsHint}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {personalizedAttempts.map((candidate, idx) => {
            const checked = isAttemptChecked(candidate);

            return (
              <label
                key={candidate.attemptId || `${candidate.cardId}-${idx}`}
                className={`flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border cursor-pointer transition-colors ${
                  checked
                    ? 'bg-[#777B61]/10 border-[#777B61] ring-1 ring-[#777B61]/25'
                    : 'bg-[#FFFCF6]/80 border-[#E7E0D5] hover:border-[#777B61]/55'
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleToggleAttempt(candidate)}
                  className="mt-1 w-4 h-4 accent-[#777B61] rounded cursor-pointer shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  {(candidate.categoryLabel || candidate.positionLabel) && (
                    <p className="text-[11px] font-medium text-[#777B61]">
                      {[
                        candidate.categoryLabel,
                        candidate.positionLabel
                          ? `${candidate.positionLabel} (${candidate.cardName})`
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>
                  )}
                  <span
                    className={`block text-[14.5px] sm:text-[15px] leading-relaxed ${
                      checked
                        ? 'text-[#34312D] font-medium'
                        : 'text-[#34312D]/90'
                    }`}
                  >
                    {candidate.actionText}
                  </span>
                </div>
              </label>
            );
          })}
        </div>

        {(hasSyncedAttemptNotice || selectedAttempts.length > 0) && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl bg-[#777B61]/8 border border-[#777B61]/20 px-4 py-3 space-y-1.5 text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 text-[#777B61]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{t.today.attemptsSyncedNotice(selectedAttempts.length)}</span>
              </span>
              <button
                type="button"
                onClick={handleOpenLinkedJournal}
                className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:text-[#34312D] transition-colors cursor-pointer"
              >
                <span>{t.today.viewInJournal}</span>
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
            {selectedAttempts.length > 0 && (
              <ul className="space-y-0.5 pl-5 text-[11px] text-[#34312D]/80 list-disc">
                {selectedAttempts.map((item, idx) => {
                  const matchedLive = personalizedAttempts.find(
                    (p) => p.attemptId && p.attemptId === item.attemptId
                  );
                  const resolved =
                    matchedLive ??
                    resolveLocalizedAttemptItem(item, getCardById, language);
                  return (
                    <li key={item.attemptId || `${item.cardId}-${idx}`}>
                      {resolved.actionText}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* 4. Insight Note Direct Input Space */}
      <div
        aria-label={t.today.noteSectionAria}
        className="mt-7 sm:mt-9 pt-6 border-t border-[#E5DED1] space-y-3.5"
      >
        <div className="space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              {t.today.noteHeading}
            </h2>
            {currentSessionRecord?.userNote?.trim() && (
              <button
                type="button"
                onClick={() => onGoToJournal(currentSessionRecord.id)}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#777B61] hover:text-[#34312D] underline underline-offset-4 cursor-pointer"
              >
                <span>{t.today.viewInJournal}</span>
                <ArrowRight className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
          </div>
          <p className="text-xs leading-relaxed text-[#827B72]">
            {t.today.noteSectionHint}
          </p>
        </div>

        {currentSessionRecord?.userNote?.trim() && (
          <div className="rounded-xl bg-[#FFFCF6]/85 border border-[#E5DED1] px-4 py-3 space-y-1.5">
            <p className="text-[11px] font-medium text-[#777B61]">
              {t.today.savedReadingNoteLabel}
            </p>
            <p className="text-sm leading-relaxed text-[#34312D] whitespace-pre-wrap">
              {currentSessionRecord.userNote}
            </p>
          </div>
        )}

        <form onSubmit={handleSaveInsightNote} className="space-y-3">
          <textarea
            id="reading-insight-note"
            aria-label={t.today.noteInputAria}
            rows={4}
            value={noteDraft}
            onChange={(e) => {
              setNoteDraft(e.target.value);
              if (noteFeedback) setNoteFeedback(null);
            }}
            placeholder={
              currentSessionRecord?.userNote?.trim()
                ? t.today.notePlaceholderFollowUp
                : t.today.notePlaceholderEmpty
            }
            className="w-full rounded-xl border border-[#E5DED1] bg-[#FFFCF6] px-4 py-3 text-[14.5px] sm:text-[15px] leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61] focus:ring-1 focus:ring-[#777B61]/30 resize-y"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-h-[20px]">
              {noteFeedback && resolvedNoteFeedbackText && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                    noteFeedback.type === 'success'
                      ? 'text-[#777B61]'
                      : 'text-[#A65D4E]'
                  }`}
                >
                  {noteFeedback.type === 'success' && (
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                  <span>{resolvedNoteFeedbackText}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!noteDraft.trim()}
              className="inline-flex items-center justify-center gap-1.5 min-h-[42px] px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] disabled:opacity-45 disabled:cursor-not-allowed text-[#FFFCF6] text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
            >
              <span>{t.today.noteSaveButton}</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
