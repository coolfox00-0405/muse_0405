import { useState, useMemo } from 'react';
import { BookOpen, Compass, ArrowUpRight } from 'lucide-react';
import { ReflectionRecord } from '../types/reflection';
import {
  AnalysisRange,
  filterRecordsByRange,
  analyzeReflections,
} from '../utils/reflectionAnalyzer';
import { formatKoreanDate } from '../hooks/useReflections';

interface ReadMyselfViewProps {
  records: ReflectionRecord[];
  onGoToToday: () => void;
  onGoToJournal: () => void;
  onOpenRecord: (recordId: string) => void;
}

const RANGE_OPTIONS: { id: AnalysisRange; label: string }[] = [
  { id: 'recent', label: '최근 기록' },
  { id: 'custom', label: '기간 직접 선택' },
  { id: 'all', label: '전체 기록' },
];

export function ReadMyselfView({
  records,
  onGoToToday,
  onGoToJournal,
  onOpenRecord,
}: ReadMyselfViewProps) {
  const [range, setRange] = useState<AnalysisRange>('recent');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredRecords = useMemo(
    () => filterRecordsByRange(records, range, startDate, endDate),
    [records, range, startDate, endDate]
  );

  const analysis = useMemo(() => {
    if (filteredRecords.length < 2) return null;
    return analyzeReflections(filteredRecords);
  }, [filteredRecords]);

  return (
    <section
      aria-label="나를 읽다"
      className="w-full max-w-4xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-12 space-y-8"
    >
      <header className="space-y-2 border-b border-[#E7E0D5] pb-6">
        <p className="font-serif text-sm tracking-[0.14em] text-[#827B72]">
          Read Myself
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#34312D]">
          나를 읽다
        </h1>
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#827B72]">
          인사이트 노트에 쌓인 기록을 원하는 범위로 모아, 생각과 관심사의
          흐름을 차분히 살펴봅니다.
        </p>
      </header>

      {/* Range Selector */}
      <div className="space-y-4">
        <div
          role="group"
          aria-label="분석 범위 선택"
          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
        >
          {RANGE_OPTIONS.map((opt) => {
            const isActive = range === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setRange(opt.id)}
                aria-pressed={isActive}
                className={`min-h-[40px] px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#777B61] text-[#FFFCF6]'
                    : 'text-[#827B72] hover:text-[#34312D] hover:bg-[#F7F3EA]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {range === 'custom' && (
          <div className="flex flex-wrap items-center gap-3 bg-[#FFFCF6] border border-[#E7E0D5] rounded-xl p-4">
            <div className="flex items-center gap-2">
              <label
                htmlFor="analysis-start-date"
                className="text-xs text-[#827B72] whitespace-nowrap"
              >
                시작일
              </label>
              <input
                id="analysis-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="min-h-[40px] rounded-lg bg-[#F7F3EA]/60 border border-[#E7E0D5] px-3 py-1.5 text-sm text-[#34312D] focus:outline-none focus:border-[#777B61]"
              />
            </div>
            <span className="text-sm text-[#827B72]" aria-hidden="true">
              ~
            </span>
            <div className="flex items-center gap-2">
              <label
                htmlFor="analysis-end-date"
                className="text-xs text-[#827B72] whitespace-nowrap"
              >
                종료일
              </label>
              <input
                id="analysis-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="min-h-[40px] rounded-lg bg-[#F7F3EA]/60 border border-[#E7E0D5] px-3 py-1.5 text-sm text-[#34312D] focus:outline-none focus:border-[#777B61]"
              />
            </div>
            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                }}
                className="text-xs text-[#827B72] hover:text-[#34312D] underline underline-offset-2 ml-auto cursor-pointer"
              >
                기간 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {/* State 1: No records at all */}
      {records.length === 0 && (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl px-6 py-14 text-center space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#F7F3EA] border border-[#E7E0D5] flex items-center justify-center mx-auto text-[#777B61]">
            <Compass className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl text-[#34312D]">
              아직 살펴볼 기록이 없습니다
            </h2>
            <p className="text-[15px] leading-relaxed text-[#827B72] max-w-md mx-auto">
              인사이트 노트에 기록이 쌓이면 이곳에서 자주 등장하는 주제와
              생각의 흐름을 천천히 돌아볼 수 있습니다.
            </p>
          </div>
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToToday}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              지금, 나에게로 이동
            </button>
            <button
              type="button"
              onClick={onGoToJournal}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-[#34312D] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              인사이트 노트 보기
            </button>
          </div>
        </div>
      )}

      {/* State 2: Records exist globally, but 0 in selected custom range */}
      {records.length > 0 && filteredRecords.length === 0 && (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl px-6 py-12 text-center space-y-3">
          <p className="font-serif text-lg text-[#34312D]">
            선택한 기간에 해당하는 기록이 없습니다
          </p>
          <p className="text-sm text-[#827B72]">
            다른 기간을 선택하거나 ‘전체 기록’으로 범위를 넓혀 살펴보세요.
          </p>
        </div>
      )}

      {/* State 3: Only 1 record in range */}
      {filteredRecords.length === 1 && (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 text-[#777B61]">
            <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />
            <h2 className="font-serif text-xl text-[#34312D]">
              기록이 조금 더 쌓이면 흐름을 읽어볼 수 있어요
            </h2>
          </div>
          <p className="text-[15px] leading-relaxed text-[#34312D]/85">
            현재 선택한 범위에는 1개의 기록이 있습니다. 억지로 해석을 만들기보다
            2개 이상의 기록이 모였을 때 반복되는 주제와 생각의 변화를 함께
            살펴보는 편이 더 정확합니다.
          </p>
          <button
            type="button"
            onClick={() => onOpenRecord(filteredRecords[0].id)}
            className="w-full text-left border-t border-[#E7E0D5] pt-4 space-y-1.5 group cursor-pointer"
          >
            <p className="text-xs text-[#827B72] tabular-nums flex items-center justify-between">
              <span>
                {formatKoreanDate(filteredRecords[0].date)} ·{' '}
                {filteredRecords[0].cardName}
              </span>
              <span className="inline-flex items-center gap-1 text-[#777B61] group-hover:underline">
                원본 보기
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </span>
            </p>
            <p className="text-sm leading-relaxed text-[#34312D]/90">
              {filteredRecords[0].userNote.trim() ||
                filteredRecords[0].actionMemo?.trim() ||
                filteredRecords[0].selectedActions
                  ?.map((a) => a.actionText)
                  .join(' · ') ||
                filteredRecords[0].selectedAction ||
                ''}
            </p>
          </button>
        </div>
      )}

      {/* State 4: Full Observational Analysis (2+ records) */}
      {analysis && (
        <div className="space-y-6">
          {/* Scope Summary Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#827B72] px-1">
            <span className="tabular-nums">
              분석 대상: {analysis.recordCount}개의 기록 (로컬 규칙 기반 요약)
            </span>
            <span className="tabular-nums">{analysis.dateSpanLabel}</span>
          </div>

          {/* 1. Frequent Themes & Keywords with Evidence */}
          <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              자주 등장한 주제와 단어
            </h2>
            <p className="text-[15px] sm:text-base leading-[1.75] text-[#34312D]">
              {analysis.themeSummary}
            </p>
            {analysis.hasClearPattern && (
              <div className="border-t border-[#E7E0D5] pt-4 space-y-4">
                {analysis.topKeywords
                  .filter((k) => k.recordCount >= 2)
                  .slice(0, 4)
                  .map((kw) => (
                    <div key={kw.word} className="space-y-1.5">
                      <p className="text-sm font-medium text-[#34312D]">
                        {kw.word}
                        <span className="ml-2 text-xs font-normal text-[#827B72] tabular-nums">
                          {kw.recordCount}개 기록에서 등장
                        </span>
                      </p>
                      <ul className="space-y-1.5 pl-3 border-l border-[#E7E0D5]">
                        {kw.evidence.map((ev) => (
                          <li key={ev.id}>
                            <button
                              type="button"
                              onClick={() => onOpenRecord(ev.id)}
                              className="text-left text-xs leading-relaxed text-[#827B72] hover:text-[#34312D] transition-colors cursor-pointer"
                            >
                              <span className="tabular-nums">
                                {ev.dateLabel} · {ev.cardName}
                              </span>{' '}
                              — “{ev.excerpt}”
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            )}
          </article>

          {/* 2. Flow of Thoughts (clickable to original note) */}
          <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-5">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              이전과 최근 기록의 흐름
            </h2>
            <p className="text-[15px] leading-relaxed text-[#34312D]/85">
              {analysis.flowSummary}
            </p>
            <ol className="space-y-4 border-t border-[#E7E0D5] pt-5">
              {analysis.flowItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onOpenRecord(item.id)}
                    className="w-full text-left space-y-1 group cursor-pointer"
                  >
                    <p className="text-xs text-[#827B72] tabular-nums flex items-center justify-between gap-2">
                      <span>
                        {item.dateLabel} · {item.cardName}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[#777B61] opacity-80 group-hover:opacity-100">
                        원본
                        <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                      </span>
                    </p>
                    <p className="text-[15px] leading-relaxed text-[#34312D] group-hover:text-[#777B61] transition-colors">
                      {item.excerpt}
                    </p>
                  </button>
                </li>
              ))}
            </ol>
          </article>

          {/* 3. Recurring Questions with source links */}
          {analysis.recurringQuestions.length > 0 && (
            <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
                반복해서 마음에 남긴 질문
              </h2>
              <ul className="space-y-3">
                {analysis.recurringQuestions.map((item, idx) => (
                  <li key={idx}>
                    <button
                      type="button"
                      onClick={() => onOpenRecord(item.sourceRecordId)}
                      className="text-left space-y-0.5 group cursor-pointer"
                    >
                      <p className="text-[15px] leading-relaxed text-[#34312D] group-hover:text-[#777B61] transition-colors">
                        • {item.question}
                      </p>
                      <p className="text-xs text-[#827B72] pl-3 tabular-nums">
                        근거 기록: {item.dateLabel}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            </article>
          )}

          {/* 4. New Perspective */}
          <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-3">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              기록에서 발견되는 연결점
            </h2>
            <p className="text-[15px] sm:text-base leading-[1.75] text-[#34312D]">
              {analysis.newPerspective}
            </p>
          </article>

          {/* 5. Closing Questions */}
          <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              다음에 스스로 살펴볼 질문
            </h2>
            <ul className="space-y-3">
              {analysis.closingQuestions.map((q, idx) => (
                <li
                  key={idx}
                  className="font-serif text-lg sm:text-xl leading-relaxed text-[#34312D]"
                >
                  {q}
                </li>
              ))}
            </ul>
          </article>

          {/* Safety & Local Processing Notice */}
          <p className="text-xs leading-relaxed text-[#827B72] px-1 pt-2">
            이 화면은 외부 AI 서버로 기록을 전송하지 않고, 현재 브라우저에
            저장된 실제 기록만을 바탕으로 정리한 규칙 기반 참고 자료입니다.
            성격을 규정하거나 심리 상태를 진단하지 않으며, 스스로를 돌아보는
            참고 관점으로만 활용해 주세요.
          </p>
        </div>
      )}
    </section>
  );
}
