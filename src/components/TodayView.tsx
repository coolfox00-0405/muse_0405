import { useState, useEffect, useRef, useMemo, FormEvent } from 'react';
import {
  Shuffle,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowDown,
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
import { generatePersonalizedAttempts } from '../utils/attemptGenerator';
import { TarotCardFlip } from './TarotCardFlip';
import { TarotCardArtwork } from './TarotCardArtwork';
import { CardShuffleSpread, DrawPhase } from './CardShuffleSpread';
import type { ReadingDrawCount } from '../App';

const ONBOARDING_KEY = 'lucida_onboarding_dismissed';
const CARD_DRAFT_KEY = 'lucida_draft_card_note';
const THREE_CARD_POSITIONS = ['지금의 마음', '바라볼 시선', '작은 걸음'] as const;

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
  onOpenEncyclopedia?: (cardId?: string) => void;
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
  onOpenEncyclopedia,
}: TodayViewProps) {
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const [note, setNote] = useState<string>(() => {
    try {
      return window.localStorage.getItem(CARD_DRAFT_KEY) || '';
    } catch {
      return '';
    }
  });
  const [selectedAttempts, setSelectedAttempts] = useState<SelectedAttemptItem[]>(
    () => {
      const existing = records.find(
        (r) => r.readingSessionId === readingSessionId
      );
      return existing?.selectedActions ?? [];
    }
  );
  const [actionMemo, setActionMemo] = useState<string>(() => {
    const existing = records.find(
      (r) => r.readingSessionId === readingSessionId
    );
    return existing?.actionMemo ?? '';
  });
  const [attemptSyncNotice, setAttemptSyncNotice] = useState<string | null>(null);
  const memoSyncTimerRef = useRef<number | null>(null);
  const lastSyncedRecordIdRef = useRef<string | undefined>(
    records.find((r) => r.readingSessionId === readingSessionId)?.id
  );
  const latestAttemptsRef = useRef<SelectedAttemptItem[]>(selectedAttempts);
  const latestMemoRef = useRef<string>(actionMemo);

  const [cardFlipped, setCardFlipped] = useState(false);
  const [activeRevealIndex, setActiveRevealIndex] = useState(0);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const activeCard =
    selectedCards[activeRevealIndex] ?? selectedCards[0] ?? null;
  const activeOrientation: 'upright' | 'reversed' =
    selectedOrientations[activeRevealIndex] ?? selectedOrientations[0] ?? 'upright';

  useEffect(() => {
    latestAttemptsRef.current = selectedAttempts;
  }, [selectedAttempts]);

  useEffect(() => {
    latestMemoRef.current = actionMemo;
  }, [actionMemo]);

  // Auto-save card reflection draft
  useEffect(() => {
    try {
      if (note.trim()) {
        window.localStorage.setItem(CARD_DRAFT_KEY, note);
      } else {
        window.localStorage.removeItem(CARD_DRAFT_KEY);
      }
    } catch {
      // Ignore storage quota errors for drafts
    }
  }, [note]);

  // Restore attempt checkboxes & memo only when switching to a different readingSessionId
  useEffect(() => {
    if (memoSyncTimerRef.current !== null) {
      window.clearTimeout(memoSyncTimerRef.current);
      memoSyncTimerRef.current = null;
    }
    const existing = records.find(
      (r) => r.readingSessionId === readingSessionId
    );
    const nextAttempts = existing?.selectedActions ?? [];
    const nextMemo = existing?.actionMemo ?? '';
    lastSyncedRecordIdRef.current = existing?.id;
    latestAttemptsRef.current = nextAttempts;
    latestMemoRef.current = nextMemo;
    setSelectedAttempts(nextAttempts);
    setActionMemo(nextMemo);
    setAttemptSyncNotice(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readingSessionId]);

  const flushOnUnmountRef = useRef<() => void>(() => {});
  flushOnUnmountRef.current = () => {
    const rootCard = selectedCards[0] ?? activeCard;
    if (!rootCard) return;
    const rootOrientation = selectedOrientations[0] ?? activeOrientation;
    onSyncAttempts({
      readingSessionId,
      card: rootCard,
      orientation: rootOrientation,
      spreadCards: buildSpreadSnapshot(),
      overallMessage: computeOverallMessage(),
      selectedActions: latestAttemptsRef.current,
      actionMemo: latestMemoRef.current,
    });
  };

  useEffect(() => {
    return () => {
      if (memoSyncTimerRef.current !== null) {
        window.clearTimeout(memoSyncTimerRef.current);
        memoSyncTimerRef.current = null;
        flushOnUnmountRef.current();
      }
    };
  }, []);

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
      positionLabel: THREE_CARD_POSITIONS[idx],
    }));
  };

  const computeOverallMessage = (): string => {
    if (selectedCards.length > 1) {
      const first = selectedCards[0];
      const second = selectedCards[1];
      const third = selectedCards[2];
      return `지금의 마음을 비추는 「${first.nameKo}」(${first.keywords[0]})에서 시작해, 「${
        second?.nameKo ?? first.nameKo
      }」(${second?.keywords[0] ?? first.keywords[0]})의 시선으로 상황을 살피고, 「${
        third?.nameKo ?? first.nameKo
      }」(${third?.keywords[0] ?? first.keywords[0]})가 건네는 작은 걸음으로 오늘의 호흡을 이어가는 흐름입니다. 세 장 중 지금 가장 시선이 머무는 카드의 질문부터 천천히 답해 보세요.`;
    }

    const card = selectedCards[0];
    if (!card) return '';
    const orient = selectedOrientations[0] ?? 'upright';
    if (orient === 'reversed') {
      return `역방향으로 놓인 「${card.nameKo}」 카드는 ‘${card.keywords.join(
        ' · '
      )}’이라는 주제를 평소와 조금 다른 각도에서 천천히 들여다보게 합니다. 서둘러 결론을 내리기보다 지금 내 마음에 걸리는 지점을 담담히 살펴보세요.`;
    }

    return `「${card.nameKo}」 카드는 지금의 나에게 ‘${card.keywords.join(
      ' · '
    )}’의 시선을 조용히 비추고 있습니다. 모든 문장을 다 기억하려 하기보다, 지금 가장 마음에 남는 질문 하나만 가볍게 간직해 보세요.`;
  };

  const personalizedAttempts = useMemo(
    () =>
      generatePersonalizedAttempts(
        selectedCards,
        selectedOrientations
      ),
    [selectedCards, selectedOrientations]
  );

  const syncCurrentAttempts = (
    nextAttempts: SelectedAttemptItem[],
    nextMemo: string
  ) => {
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
      actionMemo: nextMemo,
    });

    if (result.ok) {
      lastSyncedRecordIdRef.current = result.recordId;
      if (nextAttempts.length > 0 && nextMemo.trim().length > 0) {
        setAttemptSyncNotice(
          `선택한 시도 ${nextAttempts.length}개와 메모가 인사이트 노트에 자동 저장되었습니다.`
        );
      } else if (nextAttempts.length > 0) {
        setAttemptSyncNotice(
          `선택한 시도 ${nextAttempts.length}개가 인사이트 노트에 자동 복사되어 저장되었습니다.`
        );
      } else if (nextMemo.trim().length > 0) {
        setAttemptSyncNotice('작성한 메모가 인사이트 노트에 자동 저장되었습니다.');
      } else {
        setAttemptSyncNotice(null);
      }
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

    latestAttemptsRef.current = nextAttempts;
    setSelectedAttempts(nextAttempts);
    syncCurrentAttempts(nextAttempts, latestMemoRef.current);
  };

  const handleActionMemoChange = (value: string) => {
    latestMemoRef.current = value;
    setActionMemo(value);
    if (memoSyncTimerRef.current !== null) {
      window.clearTimeout(memoSyncTimerRef.current);
    }
    memoSyncTimerRef.current = window.setTimeout(() => {
      syncCurrentAttempts(latestAttemptsRef.current, value);
      memoSyncTimerRef.current = null;
    }, 280);
  };

  const handleActionMemoBlur = () => {
    if (memoSyncTimerRef.current !== null) {
      window.clearTimeout(memoSyncTimerRef.current);
      memoSyncTimerRef.current = null;
    }
    const currentMemo = latestMemoRef.current;
    const currentAttempts = latestAttemptsRef.current;
    if (currentMemo.trim().length > 0 || currentAttempts.length > 0) {
      syncCurrentAttempts(currentAttempts, currentMemo);
    } else {
      const hasLinked = records.some(
        (r) => r.readingSessionId === readingSessionId
      );
      if (hasLinked) {
        syncCurrentAttempts(currentAttempts, '');
      }
    }
  };

  const handleOpenLinkedJournal = () => {
    if (memoSyncTimerRef.current !== null) {
      window.clearTimeout(memoSyncTimerRef.current);
      memoSyncTimerRef.current = null;
      syncCurrentAttempts(latestAttemptsRef.current, latestMemoRef.current);
    }
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeCard) return;

    if (memoSyncTimerRef.current !== null) {
      window.clearTimeout(memoSyncTimerRef.current);
      memoSyncTimerRef.current = null;
    }

    const spreadSnapshot = buildSpreadSnapshot();
    const rootCard = selectedCards[0] ?? activeCard;
    const rootOrientation = selectedOrientations[0] ?? activeOrientation;

    const result = onSaveReflection(
      rootCard,
      note,
      selectedAttempts.map((a) => a.actionText).join(' / ') || undefined,
      rootOrientation,
      spreadSnapshot,
      {
        readingSessionId,
        overallMessage: computeOverallMessage(),
        selectedActions: selectedAttempts,
        actionMemo: latestMemoRef.current,
      }
    );
    if (result.ok) {
      if (result.record?.id) {
        lastSyncedRecordIdRef.current = result.record.id;
      }
      setNote('');
      try {
        window.localStorage.removeItem(CARD_DRAFT_KEY);
      } catch {
        // Ignore
      }
      setFeedback({
        type: 'success',
        message: '인사이트 노트에 저장되었습니다.',
      });
    } else {
      setFeedback({
        type: 'error',
        message: result.error || '기록을 저장하지 못했습니다.',
      });
    }
  };

  const resetReadingTransientState = () => {
    if (memoSyncTimerRef.current !== null) {
      window.clearTimeout(memoSyncTimerRef.current);
      memoSyncTimerRef.current = null;
    }
    lastSyncedRecordIdRef.current = undefined;
    latestAttemptsRef.current = [];
    latestMemoRef.current = '';
    setFeedback(null);
    setAttemptSyncNotice(null);
    setSelectedAttempts([]);
    setActionMemo('');
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
        aria-label="지금, 나에게 — 카드 섞기 및 선택"
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-4 sm:pt-7 pb-8 flex flex-col items-center text-center"
      >
        {/* Collapsible First-Visit Onboarding Card */}
        {!onboardingDismissed && (
          <aside
            aria-label="LUCIDA 첫 방문 안내"
            className="w-full mb-4 sm:mb-5 rounded-2xl bg-[#FFFCF6] border border-[#E5DED1] px-4 py-3 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOnboardingOpen((prev) => !prev)}
                aria-expanded={onboardingOpen}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#777B61] cursor-pointer min-h-[32px]"
              >
                <span>처음 오셨나요? LUCIDA 이용 안내</span>
                {onboardingOpen ? (
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={handleDismissOnboarding}
                className="text-xs text-[#827B72] hover:text-[#34312D] underline underline-offset-2 whitespace-nowrap cursor-pointer min-h-[32px]"
              >
                다시 보지 않기
              </button>
            </div>

            {onboardingOpen && (
              <ul className="mt-2.5 space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85 border-t border-[#E5DED1] pt-2.5">
                <li>
                  • LUCIDA는 미래를 예언하지 않고, 카드를 통해 지금의 나를
                  돌아보는 자기성찰 도구입니다.
                </li>
                <li>
                  • 특정 시간에 얽매이지 않고 원할 때 언제든 카드를 섞고 뽑아
                  질문을 만날 수 있습니다.
                </li>
                <li>
                  • 기록은 선택사항이며, 작성한 내용은 현재 브라우저에만
                  저장되므로 필요 시 인사이트 노트에서 JSON으로 백업할 수
                  있습니다.
                </li>
              </ul>
            )}
          </aside>
        )}

        <header className="mb-4 sm:mb-6 space-y-1.5">
          <p className="font-display text-sm tracking-[0.22em] text-[#827B72]">
            LUCIDA
          </p>
          <h1 className="font-serif text-[28px] sm:text-4xl font-medium text-[#34312D]">
            지금, 나에게
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-[#34312D]/90 max-w-md mx-auto">
            내 안의 빛을 발견하는 시간.
          </p>
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
                  aria-label="덱 구성 선택"
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
                    전체 78장
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
                    메이저 22장
                  </button>
                </div>

                <div
                  role="group"
                  aria-label="뽑기 장수 선택"
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
                    한 장 성찰
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
                    세 장 흐름
                  </button>
                </div>

                <div
                  role="group"
                  aria-label="카드 방향 설정"
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
                    정방향
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
                    정·역방향
                  </button>
                </div>
              </div>

              <p className="text-[15px] leading-relaxed text-[#34312D]/85">
                마음이 머무는 순간, 카드를 통해 나를 바라보세요.
              </p>
              <button
                type="button"
                onClick={onStartShuffle}
                className="w-full max-w-sm mx-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#777B61] hover:bg-[#646850] active:scale-[0.99] text-[#FFFCF6] text-[15px] font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                <span>카드 섞기</span>
              </button>
              <p className="text-xs leading-relaxed text-[#827B72]">
                정답을 찾기보다 지금 떠오르는 생각에 귀 기울여 보세요.
              </p>
              {savedRecordCount > 0 && (
                <p className="text-xs text-[#777B61] pt-1">
                  <button
                    type="button"
                    onClick={() => onGoToJournal()}
                    className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-[#34312D] transition-colors cursor-pointer"
                  >
                    <span>
                      저장된 인사이트 노트 {savedRecordCount}건 보존 중 · 기록 보기
                    </span>
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
              카드를 천천히 섞고 있습니다...
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
                  ? '마음이 이끄는 카드 한 장을 직접 선택해 주세요.'
                  : `마음이 이끄는 카드 3장을 중복 없이 차례로 선택해 주세요 (${selectedCards.length}/3).`}
              </p>

              {drawCount === 3 && (
                <div className="grid grid-cols-3 gap-2 pt-1 text-left">
                  {THREE_CARD_POSITIONS.map((label, idx) => {
                    const picked = Boolean(selectedCards[idx]);
                    return (
                      <div
                        key={label}
                        className={`rounded-xl border px-3 py-2 text-xs transition-colors ${
                          picked
                            ? 'bg-[#777B61]/10 border-[#777B61]/40 text-[#34312D]'
                            : 'bg-[#FFFCF6] border-[#E5DED1] text-[#827B72]'
                        }`}
                      >
                        <p className="font-display text-[11px] text-[#777B61]">
                          0{idx + 1}.
                        </p>
                        <p className="font-medium mt-0.5">{label}</p>
                        <p className="text-[11px] mt-0.5">
                          {picked ? '선택됨' : '선택 대기'}
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
                <span>다시 섞기</span>
              </button>
            </>
          )}
        </div>

        {/* Gentle below-the-fold guide preview so scrollability is naturally visible */}
        <div className="w-full mt-7 sm:mt-9 pt-6 border-t border-[#E5DED1] text-left space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-serif text-base sm:text-lg font-medium text-[#34312D]">
              LUCIDA와 머무는 흐름
            </h2>
            <span className="text-xs text-[#827B72] inline-flex items-center gap-1">
              <span>아래로 이어짐</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#FFFCF6] border border-[#E5DED1] p-4 space-y-1">
              <p className="font-display text-xs font-medium tracking-[0.14em] text-[#777B61]">
                01.
              </p>
              <p className="text-sm font-medium text-[#34312D]">
                질문 떠올리기
              </p>
              <p className="text-xs leading-relaxed text-[#827B72]">
                지금 마음에 머무는 생각이나 감정을 가볍게 떠올립니다.
              </p>
            </div>
            <div className="rounded-xl bg-[#FFFCF6] border border-[#E5DED1] p-4 space-y-1">
              <p className="font-display text-xs font-medium tracking-[0.14em] text-[#777B61]">
                02.
              </p>
              <p className="text-sm font-medium text-[#34312D]">
                카드와 질문 만나기
              </p>
              <p className="text-xs leading-relaxed text-[#827B72]">
                정답이 아닌 새로운 시선을 건네는 메시지에 잠시 머뭅니다.
              </p>
            </div>
            <div className="rounded-xl bg-[#FFFCF6] border border-[#E5DED1] p-4 space-y-1">
              <p className="font-display text-xs font-medium tracking-[0.14em] text-[#777B61]">
                03.
              </p>
              <p className="text-sm font-medium text-[#34312D]">
                원하면 한 줄 기록
              </p>
              <p className="text-xs leading-relaxed text-[#827B72]">
                떠오른 생각만 인사이트 노트에 남기거나 기록 없이 마쳐도 좋습니다.
              </p>
            </div>
          </div>

          {onOpenEncyclopedia && (
            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => onOpenEncyclopedia()}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] hover:bg-[#E5DED1]/45 text-xs sm:text-sm text-[#34312D] transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
                <span>78장 타로 카드 도감 · 일러스트 보기</span>
              </button>
            </div>
          )}
        </div>
      </section>
    );
  }

  const getOverallSynthesisMessage = () => {
    if (selectedCards.length > 1) {
      const first = selectedCards[0];
      const second = selectedCards[1];
      const third = selectedCards[2];
      return `지금의 마음을 비추는 「${first.nameKo}」(${first.keywords[0]})에서 시작해, 「${
        second?.nameKo ?? first.nameKo
      }」(${second?.keywords[0] ?? first.keywords[0]})의 시선으로 상황을 살피고, 「${
        third?.nameKo ?? first.nameKo
      }」(${third?.keywords[0] ?? first.keywords[0]})가 건네는 작은 걸음으로 오늘의 호흡을 이어가는 흐름입니다. 세 장 중 지금 가장 시선이 머무는 카드의 질문부터 천천히 답해 보세요.`;
    }

    if (activeOrientation === 'reversed') {
      return `역방향으로 놓인 「${activeCard.nameKo}」 카드는 ‘${activeCard.keywords.join(
        ' · '
      )}’이라는 주제를 평소와 조금 다른 각도에서 천천히 들여다보게 합니다. 서둘러 결론을 내리기보다 지금 내 마음에 걸리는 지점을 담담히 살펴보세요.`;
    }

    return `「${activeCard.nameKo}」 카드는 지금의 나에게 ‘${activeCard.keywords.join(
      ' · '
    )}’의 시선을 조용히 비추고 있습니다. 모든 문장을 다 기억하려 하기보다, 지금 가장 마음에 남는 질문 하나만 가볍게 간직해 보세요.`;
  };

  return (
    <section
      aria-label="나에게 온 메시지"
      className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-2 sm:pt-7 pb-8"
    >
      {/* Multi-card spread selector when 3 cards are drawn */}
      {selectedCards.length > 1 && (
        <div
          aria-label="뽑은 세 장의 카드 흐름"
          className="mb-3.5 sm:mb-6 grid grid-cols-3 gap-2 sm:gap-4"
        >
          {selectedCards.map((card, idx) => {
            const isActive = idx === activeRevealIndex;
            const positionLabel =
              THREE_CARD_POSITIONS[idx] || `${idx + 1}번째 카드`;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setActiveRevealIndex(idx);
                  setFeedback(null);
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
                  <p className="text-[10px] sm:text-[11px] font-medium text-[#777B61] truncate">
                    0{idx + 1}. {positionLabel}
                  </p>
                  <p className="font-serif text-xs sm:text-sm font-medium text-[#34312D] truncate mt-0.5">
                    {card.nameKo}
                  </p>
                  <p className="hidden sm:block font-display text-[11px] text-[#827B72] truncate">
                    {card.nameEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 1. Main Reading Result: Card Artwork + Interpretation + Overall Synthesis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-7 lg:gap-9 items-start">
        {/* 1-1. Selected Card & Card Title (side-by-side w/ insight on mobile for compact first screen) */}
        <div className="lg:col-span-5 flex flex-row sm:flex-col items-center gap-3.5 sm:gap-0 w-full">
          <div className="shrink-0">
            <TarotCardFlip
              card={activeCard}
              isRevealed={cardFlipped}
              isReversed={activeOrientation === 'reversed'}
            />
          </div>

          <div className="flex-1 min-w-0 sm:mt-4 text-left sm:text-center space-y-1">
            <p className="text-[11px] sm:text-xs tracking-[0.06em] text-[#827B72]">
              {selectedCards.length > 1
                ? `${THREE_CARD_POSITIONS[activeRevealIndex]} · `
                : ''}
              {activeCard.arcana === 'minor'
                ? `마이너 · ${activeCard.arcanaNumber} · ${
                    activeOrientation === 'reversed' ? '역방향' : '정방향'
                  }`
                : `메이저 ${activeCard.arcanaNumber} · ${
                    activeOrientation === 'reversed' ? '역방향' : '정방향'
                  }`}
              {activeCard.suitTheme ? ` · ${activeCard.suitTheme}` : ''}
            </p>
            <h1 className="font-serif text-lg sm:text-[25px] font-medium text-[#34312D] leading-snug">
              {activeCard.nameKo}
              <span className="ml-1.5 text-xs sm:text-base font-normal text-[#827B72]">
                ({activeCard.nameEn})
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-[#777B61]">
              {activeCard.keywords.join(' · ')}
            </p>
            <blockquote className="sm:hidden pt-1.5 mt-1.5 border-t border-[#E5DED1] font-serif text-[14.5px] leading-[1.48] text-[#34312D]">
              “{activeCard.insight}”
            </blockquote>
          </div>
        </div>

        {/* 1-2. Card Interpretation, Reflection Question & Overall Synthesis */}
        <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
          <div className="bg-[#FFFCF6] border border-[#E5DED1] rounded-2xl p-3.5 sm:p-6 space-y-2 sm:space-y-3.5">
            <div className="hidden sm:flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium tracking-wide text-[#777B61]">
                나에게 온 메시지
              </p>
              <p className="text-xs text-[#827B72]">
                {activeCard.keywords.join(' · ')}
              </p>
            </div>
            <blockquote className="hidden sm:block font-serif text-[21px] leading-[1.55] text-[#34312D]">
              “{activeCard.insight}”
            </blockquote>
            <p className="text-[13.5px] sm:text-[15px] leading-[1.6] sm:leading-[1.65] text-[#34312D]/85">
              {activeCard.meaningGuide}
            </p>
            <div className="pt-2 border-t border-[#E7E0D5]/80 space-y-0.5 sm:space-y-1">
              <h2 className="text-[11px] font-medium tracking-wide text-[#777B61]">
                나에게 던져볼 질문
              </h2>
              <p className="text-[14px] sm:text-[16px] font-medium leading-snug text-[#34312D]">
                {activeCard.reflectionQuestion}
              </p>
            </div>
          </div>

          <aside
            aria-label="리딩 종합 메시지"
            className="rounded-2xl bg-[#FFFCF6] border border-[#E5DED1] p-3.5 sm:p-5 space-y-1.5 sm:space-y-2"
          >
            <p className="text-[11px] sm:text-xs font-medium tracking-wide text-[#777B61]">
              리딩 종합 메시지
            </p>
            {selectedCards.length > 1 && (
              <div className="hidden sm:grid sm:grid-cols-3 gap-2 text-xs">
                {selectedCards.map((card, idx) => (
                  <div
                    key={`${card.id}-summary`}
                    className="rounded-xl bg-[#F7F3EA]/80 border border-[#E5DED1]/80 px-3 py-2"
                  >
                    <p className="text-[11px] font-medium text-[#777B61]">
                      0{idx + 1}. {THREE_CARD_POSITIONS[idx]}
                    </p>
                    <p className="font-serif text-sm text-[#34312D] mt-0.5">
                      {card.nameKo}
                      {selectedOrientations[idx] === 'reversed' ? ' · 역방향' : ''}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <p className="text-[13px] sm:text-[15px] leading-[1.58] sm:leading-[1.65] text-[#34312D]/90">
              {getOverallSynthesisMessage()}
            </p>
          </aside>
        </div>
      </div>

      {/* 2. Primary CTA ('새 리딩 시작') & Compact Secondary Pair ('다시 섞기' / '처음 화면으로') */}
      <div
        aria-label="리딩 다음 행동"
        className="mt-4 sm:mt-6 flex flex-col items-center space-y-2.5"
      >
        <button
          type="button"
          onClick={handleStartNewReadingClick}
          className="w-[78%] sm:w-full max-w-[340px] mx-auto min-h-[42px] sm:min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] active:scale-[0.995] text-[#FFFCF6] text-[15px] sm:text-base font-medium shadow-xs transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
        >
          <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>새 리딩 시작</span>
        </button>

        <div className="w-[86%] sm:w-full max-w-[340px] mx-auto grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={handleReshuffle}
            className="min-w-0 min-h-[38px] sm:min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#E5DED1] bg-[#FFFCF6]/75 hover:bg-[#E5DED1]/40 text-xs sm:text-[13px] font-medium text-[#6B645C] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#777B61] shrink-0" aria-hidden="true" />
            <span>다시 섞기</span>
          </button>

          <button
            type="button"
            onClick={handleGoHomeClick}
            className="min-w-0 min-h-[38px] sm:min-h-[40px] inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#E5DED1] bg-[#FFFCF6]/75 hover:bg-[#E5DED1]/40 text-xs sm:text-[13px] font-medium text-[#6B645C] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
          >
            <Home className="w-3.5 h-3.5 text-[#777B61] shrink-0" aria-hidden="true" />
            <span>처음 화면으로</span>
          </button>
        </div>

        <p className="text-[11px] sm:text-xs leading-relaxed text-[#827B72] text-center">
          새로운 리딩을 시작해도 저장된 인사이트 노트는 그대로 보존됩니다.
        </p>
      </div>

      {/* 3. Optional Reflection Attempts & Insight Note Form */}
      <div className="mt-7 sm:mt-9 pt-6 border-t border-[#E5DED1] grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* 3-1. Personalized Selectable Attempts (5-7 items) & Auto-Sync Memo */}
        <div
          aria-label="선택 가능한 시도"
          className="lg:col-span-6 space-y-3.5"
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
                선택 가능한 시도 (선택사항 · {personalizedAttempts.length}가지 제안)
              </h2>
              {selectedAttempts.length > 0 && (
                <span className="text-xs font-medium text-[#777B61] tabular-nums">
                  {selectedAttempts.length}개 선택 · 자동 저장됨
                </span>
              )}
            </div>
            <p className="text-xs leading-relaxed text-[#827B72]">
              마음에 남는 시도가 있다면 가볍게 선택해 보세요. 모두 선택하지 않아도 괜찮습니다.
            </p>
          </div>

          <div className="space-y-2">
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

          <div className="rounded-xl bg-[#FFFCF6]/90 border border-[#E7E0D5] p-3.5 sm:p-4 space-y-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-1.5">
              <label
                htmlFor="attempt-quick-memo"
                className="text-xs font-medium text-[#34312D]/90"
              >
                자유로운 메모 (선택사항)
              </label>
              <span className="text-[11px] text-[#827B72]">
                꼭 완성된 문장으로 쓰지 않아도 괜찮습니다.
              </span>
            </div>
            <textarea
              id="attempt-quick-memo"
              name="attemptQuickMemo"
              rows={2}
              value={actionMemo}
              onChange={(e) => handleActionMemoChange(e.target.value)}
              onBlur={handleActionMemoBlur}
              placeholder="지금 떠오르는 생각을 가볍게 남겨보세요."
              className="w-full rounded-lg bg-[#F7F3EA]/55 border border-[#E7E0D5] px-3 py-2 text-sm leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 transition-colors resize-y"
            />
            {(attemptSyncNotice ||
              selectedAttempts.length > 0 ||
              actionMemo.trim().length > 0) && (
              <div
                role="status"
                aria-live="polite"
                className="rounded-lg bg-[#777B61]/8 border border-[#777B61]/20 px-3 py-2.5 space-y-1.5 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-[#777B61]">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>
                      {attemptSyncNotice ||
                        '체크한 시도와 메모가 인사이트 노트에 자동 저장되었습니다.'}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenLinkedJournal}
                    className="inline-flex items-center gap-1 font-medium underline underline-offset-4 hover:text-[#34312D] transition-colors cursor-pointer"
                  >
                    <span>인사이트 노트에서 보기</span>
                    <ArrowRight className="w-3 h-3" aria-hidden="true" />
                  </button>
                </div>
                {selectedAttempts.length > 0 && (
                  <ul className="space-y-0.5 pl-5 text-[11px] text-[#34312D]/80 list-disc">
                    {selectedAttempts.map((item, idx) => (
                      <li key={item.attemptId || `${item.cardId}-${idx}`}>
                        {item.actionText}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3-2. Insight Note Form with Auto-Draft */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 space-y-4"
          noValidate
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="reflection-note"
                className="block text-sm font-medium text-[#34312D]"
              >
                인사이트 노트에 남기기 ({activeCard.nameKo})
              </label>
              {note.trim().length > 0 && (
                <div className="flex items-center gap-2 text-xs text-[#827B72]">
                  <span>자동 임시 저장됨</span>
                  <button
                    type="button"
                    onClick={() => setNote('')}
                    className="underline underline-offset-2 hover:text-[#34312D] cursor-pointer"
                  >
                    비우기
                  </button>
                </div>
              )}
            </div>
            <textarea
              id="reflection-note"
              name="reflectionNote"
              rows={4}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                if (feedback) setFeedback(null);
              }}
              placeholder="떠오른 생각이나 나에게 남기고 싶은 한 문장을 자유롭게 적어 보세요."
              className="w-full rounded-xl bg-[#FFFCF6] border border-[#E7E0D5] px-4 py-3.5 text-[15px] leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 transition-colors resize-y"
            />
          </div>

          {feedback && (
            <div
              role="status"
              aria-live="polite"
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl px-4 py-3 text-sm border ${
                feedback.type === 'success'
                  ? 'bg-[#777B61]/10 border-[#777B61]/25 text-[#34312D]'
                  : 'bg-[#A65D4E]/10 border-[#A65D4E]/25 text-[#7A3B2E]'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === 'success' ? (
                  <Check
                    className="w-4 h-4 text-[#777B61] shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <AlertCircle
                    className="w-4 h-4 text-[#A65D4E] shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span>{feedback.message}</span>
              </div>

              {feedback.type === 'success' && (
                <button
                  type="button"
                  onClick={handleOpenLinkedJournal}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#777B61] hover:text-[#34312D] transition-colors self-start sm:self-auto whitespace-nowrap cursor-pointer"
                >
                  <span>인사이트 노트 보기</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <p className="text-xs text-[#827B72]">
              기록하지 않고 마음속으로만 머물러도 괜찮습니다.
            </p>
            <button
              type="submit"
              className="w-full sm:w-auto min-h-[48px] px-7 py-3 rounded-xl bg-[#777B61] hover:bg-[#646850] active:scale-[0.99] text-[#FFFCF6] text-[15px] font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
            >
              인사이트 노트에 저장
            </button>
          </div>
        </form>
      </div>

      {/* 4. Secondary Content at Bottom: Card Encyclopedia */}
      {onOpenEncyclopedia && (
        <aside
          aria-label="카드 도감 안내"
          className="mt-7 sm:mt-9 pt-6 border-t border-[#E5DED1]"
        >
          <div className="rounded-2xl bg-[#FFFCF6]/85 border border-[#E5DED1] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-wide text-[#777B61]">
                카드 도감 · 보조 탐색
              </p>
              <p className="text-sm text-[#34312D]/90 leading-relaxed">
                「{activeCard.nameKo}」 카드의 상징과 78장 타로 전체 일러스트를 차분히 살펴볼 수 있습니다.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenEncyclopedia(activeCard.id)}
                className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] hover:bg-[#E5DED1]/45 text-xs sm:text-sm font-medium text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
                <span>{activeCard.nameKo} 도감 보기</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenEncyclopedia()}
                className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-xl border border-[#E5DED1] bg-[#F7F3EA]/70 hover:bg-[#E5DED1]/45 text-xs sm:text-sm text-[#827B72] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <span>78장 전체 보기</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </section>
  );
}
