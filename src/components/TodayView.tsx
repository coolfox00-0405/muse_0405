import { useState, useEffect, FormEvent } from 'react';
import {
  Shuffle,
  Check,
  AlertCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DeckMode, TarotCard } from '../types/reflection';
import { TarotCardFlip } from './TarotCardFlip';
import { CardShuffleSpread, DrawPhase } from './CardShuffleSpread';

const ONBOARDING_KEY = 'lucida_onboarding_dismissed';
const CARD_DRAFT_KEY = 'lucida_draft_card_note';

interface TodayViewProps {
  phase: DrawPhase;
  deckMode: DeckMode;
  onChangeDeckMode: (mode: DeckMode) => void;
  spreadCards: TarotCard[];
  selectedCard: TarotCard | null;
  onStartShuffle: () => void;
  onSelectCard: (card: TarotCard) => void;
  onSaveReflection: (
    card: TarotCard,
    note: string,
    selectedAction?: string
  ) => { ok: boolean; error?: string };
  onGoToJournal: () => void;
}

export function TodayView({
  phase,
  deckMode,
  onChangeDeckMode,
  spreadCards,
  selectedCard,
  onStartShuffle,
  onSelectCard,
  onSaveReflection,
  onGoToJournal,
}: TodayViewProps) {
  const [onboardingDismissed, setOnboardingDismissed] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem(ONBOARDING_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [onboardingOpen, setOnboardingOpen] = useState(true);

  const [note, setNote] = useState<string>(() => {
    try {
      return window.localStorage.getItem(CARD_DRAFT_KEY) || '';
    } catch {
      return '';
    }
  });
  const [includeAction, setIncludeAction] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

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

  useEffect(() => {
    if (phase === 'revealed' && selectedCard) {
      setCardFlipped(false);
      setIncludeAction(false);
      const timer = window.setTimeout(() => {
        setCardFlipped(true);
      }, 60);
      return () => window.clearTimeout(timer);
    }
    setCardFlipped(false);
    return undefined;
  }, [phase, selectedCard]);

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
    if (!selectedCard) return;

    const result = onSaveReflection(
      selectedCard,
      note,
      includeAction ? selectedCard.gentleAction : undefined
    );
    if (result.ok) {
      setNote('');
      try {
        window.localStorage.removeItem(CARD_DRAFT_KEY);
      } catch {
        // Ignore
      }
      setIncludeAction(false);
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

  const handleReshuffle = () => {
    setFeedback(null);
    setIncludeAction(false);
    onStartShuffle();
  };

  if (phase !== 'revealed' || !selectedCard) {
    return (
      <section
        aria-label="지금, 나에게 — 카드 섞기 및 선택"
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-12 flex flex-col items-center text-center"
      >
        {/* Collapsible First-Visit Onboarding Card */}
        {!onboardingDismissed && (
          <aside
            aria-label="LUCIDA 첫 방문 안내"
            className="w-full mb-7 rounded-2xl bg-[#FFFCF6] border border-[#E7E0D5] px-5 py-4 text-left"
          >
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setOnboardingOpen((prev) => !prev)}
                aria-expanded={onboardingOpen}
                className="inline-flex items-center gap-2 text-xs font-medium text-[#777B61] cursor-pointer"
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
                className="text-xs text-[#827B72] hover:text-[#34312D] underline underline-offset-2 whitespace-nowrap cursor-pointer"
              >
                다시 보지 않기
              </button>
            </div>

            {onboardingOpen && (
              <ul className="mt-3 space-y-1.5 text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85 border-t border-[#E7E0D5] pt-3">
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

        <header className="mb-7 sm:mb-9 space-y-2.5">
          <p className="font-serif text-sm tracking-[0.2em] text-[#827B72]">
            LUCIDA
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#34312D]">
            지금, 나에게
          </h1>
          <p className="pt-1 text-[15px] sm:text-base leading-relaxed text-[#34312D]/90 max-w-md mx-auto">
            내 안의 빛을 발견하는 시간.
          </p>
        </header>

        <div className="w-full my-2 overflow-visible">
          <CardShuffleSpread
            phase={phase === 'revealed' ? 'idle' : phase}
            spreadCards={spreadCards}
            onStartShuffle={onStartShuffle}
            onSelectCard={onSelectCard}
          />
        </div>

        <div className="mt-7 sm:mt-8 space-y-4 w-full max-w-sm">
          {phase === 'idle' && (
            <>
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

              <p className="text-[15px] leading-relaxed text-[#34312D]/85">
                마음이 머무는 순간, 카드를 통해 나를 바라보세요.
              </p>
              <button
                type="button"
                onClick={onStartShuffle}
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#777B61] hover:bg-[#646850] active:scale-[0.99] text-[#FFFCF6] text-[15px] font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                <span>카드 섞기</span>
              </button>
              <p className="text-xs leading-relaxed text-[#827B72]">
                정답을 찾기보다 지금 떠오르는 생각에 귀 기울여 보세요.
              </p>
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
                마음이 이끄는 카드 한 장을 직접 선택해 주세요.
              </p>
              <button
                type="button"
                onClick={onStartShuffle}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#E7E0D5]/45 text-sm text-[#827B72] hover:text-[#34312D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <Shuffle className="w-4 h-4" aria-hidden="true" />
                <span>다시 섞기</span>
              </button>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="나에게 온 메시지"
      className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-5 sm:pt-10 pb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Revealed Card & Reshuffle Action */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24">
          <TarotCardFlip card={selectedCard} isRevealed={cardFlipped} />

          <div className="mt-6 text-center space-y-1.5">
            <p className="text-xs tracking-[0.12em] text-[#827B72]">
              {selectedCard.arcana === 'minor'
                ? `마이너 아르카나 · ${selectedCard.arcanaNumber} · 정방향`
                : `메이저 아르카나 ${selectedCard.arcanaNumber} · 정방향`}
            </p>
            <h1 className="font-serif text-2xl sm:text-[28px] font-medium text-[#34312D]">
              {selectedCard.nameKo}
              <span className="ml-2 text-lg sm:text-xl font-normal text-[#827B72]">
                ({selectedCard.nameEn})
              </span>
            </h1>
            {selectedCard.suitTheme && (
              <p className="text-xs text-[#827B72]">{selectedCard.suitTheme}</p>
            )}
            <p className="text-xs text-[#777B61] pt-0.5">
              {selectedCard.keywords.join(' · ')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleReshuffle}
            className="mt-5 inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] text-sm text-[#34312D] hover:bg-[#E7E0D5]/45 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
          >
            <Shuffle className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
            <span>다시 카드 섞기</span>
          </button>
        </div>

        {/* Right Column: Message, Question, Gentle Action & Insight Note Form */}
        <div className="lg:col-span-7 space-y-7">
          {/* 1 & 2. Message to Me */}
          <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium tracking-wide text-[#777B61]">
                나에게 온 메시지
              </p>
              <p className="text-xs text-[#827B72]">
                {selectedCard.keywords.join(' · ')}
              </p>
            </div>
            <blockquote className="font-serif text-xl sm:text-2xl leading-[1.6] text-[#34312D]">
              “{selectedCard.insight}”
            </blockquote>
            <p className="text-[15px] leading-[1.75] text-[#34312D]/80 pt-1">
              {selectedCard.meaningGuide}
            </p>
          </div>

          {/* 3. Reflection Question */}
          <div className="space-y-2 px-1">
            <h2 className="text-xs font-medium tracking-wide text-[#827B72]">
              나에게 던져볼 질문
            </h2>
            <p className="text-[17px] sm:text-lg font-medium leading-relaxed text-[#34312D]">
              {selectedCard.reflectionQuestion}
            </p>
          </div>

          {/* 4. Optional Gentle Action */}
          <div className="border-t border-[#E7E0D5] pt-6 px-1 space-y-3">
            <h2 className="text-xs font-medium tracking-wide text-[#827B72]">
              선택 가능한 작은 시도 (선택사항)
            </h2>
            <label className="flex items-start gap-3 p-4 rounded-xl bg-[#FFFCF6]/75 border border-[#E7E0D5] cursor-pointer hover:border-[#777B61]/50 transition-colors">
              <input
                type="checkbox"
                checked={includeAction}
                onChange={(e) => setIncludeAction(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#777B61] rounded cursor-pointer"
              />
              <span className="text-[15px] leading-relaxed text-[#34312D]/90">
                {selectedCard.gentleAction}
              </span>
            </label>
          </div>

          {/* Insight Note Form with Auto-Draft */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-[#E7E0D5] pt-6 space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="reflection-note"
                  className="block text-sm font-medium text-[#34312D]"
                >
                  인사이트 노트에 남기기
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
                    onClick={onGoToJournal}
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
      </div>
    </section>
  );
}
