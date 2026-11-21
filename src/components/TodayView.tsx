import { useState, useEffect, FormEvent } from 'react';
import {
  Shuffle,
  Check,
  AlertCircle,
  ArrowRight,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from 'lucide-react';
import { DeckMode, TarotCard } from '../types/reflection';
import { TarotCardFlip } from './TarotCardFlip';
import { TarotCardArtwork } from './TarotCardArtwork';
import { CardShuffleSpread, DrawPhase } from './CardShuffleSpread';
import type { ReadingDrawCount } from '../App';

const ONBOARDING_KEY = 'lucida_onboarding_dismissed';
const CARD_DRAFT_KEY = 'lucida_draft_card_note';
const THREE_CARD_POSITIONS = ['지금의 마음', '바라볼 시선', '작은 걸음'] as const;

interface TodayViewProps {
  phase: DrawPhase;
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
  onSaveReflection: (
    card: TarotCard,
    note: string,
    selectedAction?: string,
    orientation?: 'upright' | 'reversed'
  ) => { ok: boolean; error?: string };
  onGoToJournal: () => void;
  onOpenEncyclopedia?: (cardId?: string) => void;
}

export function TodayView({
  phase,
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
  onSaveReflection,
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
  const [includeAction, setIncludeAction] = useState(false);
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
    setActiveRevealIndex(0);
  }, [selectedCards]);

  useEffect(() => {
    if (phase === 'revealed' && activeCard) {
      setCardFlipped(false);
      setIncludeAction(false);
      const timer = window.setTimeout(() => {
        setCardFlipped(true);
      }, 60);
      return () => window.clearTimeout(timer);
    }
    setCardFlipped(false);
    return undefined;
  }, [phase, activeCard?.id]);

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

    const result = onSaveReflection(
      activeCard,
      note,
      includeAction ? activeCard.gentleAction : undefined,
      activeOrientation
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
    setActiveRevealIndex(0);
    onStartShuffle();
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

        <div className="mt-4 sm:mt-6 space-y-3 w-full max-w-md">
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

  const handleScrollToMessage = () => {
    const target = document.getElementById('revealed-message-panel');
    if (!target) return;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <section
      aria-label="나에게 온 메시지"
      className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-3 sm:pt-8 pb-8"
    >
      {/* Multi-card spread selector when 3 cards are drawn */}
      {selectedCards.length > 1 && (
        <div
          aria-label="뽑은 세 장의 카드 흐름"
          className="mb-6 sm:mb-8 grid grid-cols-3 gap-2.5 sm:gap-4"
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
                className={`flex items-center gap-2.5 sm:gap-3.5 p-2.5 sm:p-3.5 rounded-2xl border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#FFFCF6] border-[#777B61] ring-1 ring-[#777B61]/30'
                    : 'bg-[#FFFCF6]/70 border-[#E5DED1] hover:border-[#777B61]/60'
                }`}
              >
                <div className="w-10 sm:w-12 aspect-[896/1200] rounded-lg overflow-hidden border border-[#E5DED1] bg-[#FFFCF6] shrink-0">
                  <TarotCardArtwork
                    card={card}
                    size="thumbnail"
                    isReversed={selectedOrientations[idx] === 'reversed'}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#777B61]">
                    0{idx + 1}. {positionLabel}
                  </p>
                  <p className="font-serif text-xs sm:text-sm font-medium text-[#34312D] truncate mt-0.5">
                    {card.nameKo}
                  </p>
                  <p className="font-display text-[10px] sm:text-[11px] text-[#827B72] truncate">
                    {card.nameEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 lg:gap-10 items-start">
        {/* Left Column: Revealed Card & Compact Metadata + Scroll Cue */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-20">
          <TarotCardFlip
            card={activeCard}
            isRevealed={cardFlipped}
            isReversed={activeOrientation === 'reversed'}
          />

          <div className="mt-3 sm:mt-5 text-center space-y-1">
            <p className="text-[11px] sm:text-xs tracking-[0.1em] text-[#827B72]">
              {selectedCards.length > 1
                ? `${THREE_CARD_POSITIONS[activeRevealIndex]} · `
                : ''}
              {activeCard.arcana === 'minor'
                ? `마이너 아르카나 · ${activeCard.arcanaNumber} · ${
                    activeOrientation === 'reversed' ? '역방향' : '정방향'
                  }`
                : `메이저 아르카나 ${activeCard.arcanaNumber} · ${
                    activeOrientation === 'reversed' ? '역방향' : '정방향'
                  }`}
              {activeCard.suitTheme ? ` · ${activeCard.suitTheme}` : ''}
            </p>
            <h1 className="font-serif text-xl sm:text-[26px] font-medium text-[#34312D] leading-snug">
              {activeCard.nameKo}
              <span className="ml-1.5 text-sm sm:text-lg font-normal text-[#827B72]">
                ({activeCard.nameEn})
              </span>
            </h1>
            <p className="text-xs text-[#777B61]">
              {activeCard.keywords.join(' · ')}
            </p>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleReshuffle}
              className="inline-flex items-center gap-2 min-h-[40px] sm:min-h-[44px] px-4 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] text-xs sm:text-sm text-[#34312D] hover:bg-[#E5DED1]/45 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
            >
              <Shuffle
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#777B61]"
                aria-hidden="true"
              />
              <span>다시 카드 섞기</span>
            </button>

            {onOpenEncyclopedia && (
              <button
                type="button"
                onClick={() => onOpenEncyclopedia(activeCard.id)}
                className="inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[44px] px-3.5 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] text-xs sm:text-sm text-[#827B72] hover:text-[#34312D] hover:bg-[#E5DED1]/45 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
              >
                <BookOpen
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#777B61]"
                  aria-hidden="true"
                />
                <span>카드 도감</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleScrollToMessage}
              className="lg:hidden inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl bg-[#777B61]/12 border border-[#777B61]/25 text-xs font-medium text-[#34312D] hover:bg-[#777B61]/20 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] whitespace-nowrap cursor-pointer"
            >
              <span>메시지와 질문 보기</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Right Column: Message, Question, Gentle Action & Insight Note Form */}
        <div
          id="revealed-message-panel"
          className="lg:col-span-7 space-y-6 sm:space-y-7 scroll-mt-4 lg:scroll-mt-24"
        >
          {/* 1 & 2. Message to Me */}
          <div className="bg-[#FFFCF6] border border-[#E5DED1] rounded-2xl p-5 sm:p-8 space-y-3.5 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium tracking-wide text-[#777B61]">
                나에게 온 메시지
              </p>
              <p className="text-xs text-[#827B72]">
                {activeCard.keywords.join(' · ')}
              </p>
            </div>
            <blockquote className="font-serif text-xl sm:text-2xl leading-[1.6] text-[#34312D]">
              “{activeCard.insight}”
            </blockquote>
            <p className="text-[15px] leading-[1.75] text-[#34312D]/80 pt-1">
              {activeCard.meaningGuide}
            </p>
          </div>

          {/* 3. Reflection Question */}
          <div className="space-y-2 px-1">
            <h2 className="text-xs font-medium tracking-wide text-[#827B72]">
              나에게 던져볼 질문
            </h2>
            <p className="text-[17px] sm:text-lg font-medium leading-relaxed text-[#34312D]">
              {activeCard.reflectionQuestion}
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
                {activeCard.gentleAction}
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
