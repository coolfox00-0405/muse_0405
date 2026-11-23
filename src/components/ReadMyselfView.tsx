import { useState, useMemo } from 'react';
import { BookOpen, Compass, ArrowUpRight, Check } from 'lucide-react';
import { ReflectionRecord } from '../types/reflection';
import {
  AnalysisRange,
  filterRecordsByRange,
  analyzeReflections,
} from '../utils/reflectionAnalyzer';
import { formatLocalizedDate } from '../hooks/useReflections';
import { LucidaBrandMark } from './LucidaBrandMark';
import { useLanguage } from '../i18n/LanguageContext';
import { getCardById } from '../data/cards';
import { getLocalizedRecordCardName } from '../i18n/cardHelpers';
import { resolveLocalizedAttemptItem } from '../utils/attemptGenerator';

interface ReadMyselfViewProps {
  records: ReflectionRecord[];
  onGoToToday: () => void;
  onGoToJournal: () => void;
  onOpenRecord: (recordId: string) => void;
}

export function ReadMyselfView({
  records,
  onGoToToday,
  onGoToJournal,
  onOpenRecord,
}: ReadMyselfViewProps) {
  const { language, t } = useLanguage();
  const [range, setRange] = useState<AnalysisRange>('recent');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [flaggedRanges, setFlaggedRanges] = useState<Record<string, boolean>>({});

  const rangeOptions: { id: AnalysisRange; label: string }[] = [
    { id: 'recent', label: t.readMyself.ranges.recent },
    { id: 'custom', label: t.readMyself.ranges.custom },
    { id: 'all', label: t.readMyself.ranges.all },
  ];

  const filteredRecords = useMemo(
    () => filterRecordsByRange(records, range, startDate, endDate),
    [records, range, startDate, endDate]
  );

  const rangeKey = `${range}:${startDate}:${endDate}:${filteredRecords.length}`;
  const isSummaryFlagged = Boolean(flaggedRanges[rangeKey]);

  const analysis = useMemo(() => {
    if (filteredRecords.length < 2) return null;
    return analyzeReflections(filteredRecords, language);
  }, [filteredRecords, language]);

  return (
    <section
      aria-label={t.readMyself.sectionAria}
      className="w-full max-w-4xl mx-auto px-5 sm:px-8 pt-2 sm:pt-6 pb-12 space-y-8"
    >
      <div>
        <LucidaBrandMark variant="compact" className="mb-3 sm:mb-4" />
        <header className="space-y-2 border-b border-[#E7E0D5] pb-6">
          <p className="font-serif text-sm tracking-[0.14em] text-[#827B72]">
            {t.readMyself.subtitle}
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#34312D]">
            {t.readMyself.title}
          </h1>
          <p className="text-sm sm:text-[15px] leading-relaxed text-[#827B72]">
            {t.readMyself.description}
          </p>
        </header>
      </div>

      {/* Range Selector */}
      <div className="space-y-4">
        <div
          role="group"
          aria-label={t.readMyself.rangeGroupAria}
          className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
        >
          {rangeOptions.map((opt) => {
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
                {t.readMyself.startDateLabel}
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
                {t.readMyself.endDateLabel}
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
                {t.readMyself.resetRange}
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
              {t.readMyself.emptyTitle}
            </h2>
            <p className="text-[15px] leading-relaxed text-[#827B72] max-w-md mx-auto">
              {t.readMyself.emptyBody}
            </p>
          </div>
          <div className="pt-1 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToToday}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.readMyself.goTodayButton}
            </button>
            <button
              type="button"
              onClick={onGoToJournal}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-[#34312D] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.readMyself.goJournalButton}
            </button>
          </div>
        </div>
      )}

      {/* State 2: Records exist globally, but 0 in selected custom range */}
      {records.length > 0 && filteredRecords.length === 0 && (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl px-6 py-12 text-center space-y-3">
          <p className="font-serif text-lg text-[#34312D]">
            {t.readMyself.noRangeRecordsTitle}
          </p>
          <p className="text-sm text-[#827B72]">
            {t.readMyself.noRangeRecordsBody}
          </p>
        </div>
      )}

      {/* State 3: Only 1 record in range */}
      {filteredRecords.length === 1 && (() => {
        const singleRec = filteredRecords[0];
        const card =
          singleRec.cardId !== 'freeform'
            ? getCardById(singleRec.cardId)
            : undefined;
        const displayCardName = getLocalizedRecordCardName(
          singleRec.cardId,
          singleRec.cardName,
          card,
          language,
          t.journal.freeformCardName
        );
        const singlePreview =
          singleRec.userNote.trim() ||
          singleRec.actionMemo?.trim() ||
          singleRec.selectedActions
            ?.map((a) => resolveLocalizedAttemptItem(a, getCardById, language).actionText)
            .join(' · ') ||
          singleRec.selectedAction ||
          '';

        return (
          <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3 text-[#777B61]">
              <BookOpen className="w-5 h-5 shrink-0" aria-hidden="true" />
              <h2 className="font-serif text-xl text-[#34312D]">
                {t.readMyself.oneRecordTitle}
              </h2>
            </div>
            <p className="text-[15px] leading-relaxed text-[#34312D]/85">
              {t.readMyself.oneRecordBody}
            </p>
            <button
              type="button"
              onClick={() => onOpenRecord(singleRec.id)}
              className="w-full text-left border-t border-[#E7E0D5] pt-4 space-y-1.5 group cursor-pointer"
            >
              <p className="text-xs text-[#827B72] tabular-nums flex items-center justify-between gap-2">
                <span>
                  {formatLocalizedDate(singleRec.date, language)} · {displayCardName}
                </span>
                <span className="inline-flex items-center gap-1 text-[#777B61] group-hover:underline shrink-0">
                  {t.readMyself.viewOriginal}
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </p>
              <p className="text-sm leading-relaxed text-[#34312D]/90">
                {singlePreview}
              </p>
            </button>
          </div>
        );
      })()}

      {/* State 4: Full Observational Analysis (2+ records) */}
      {analysis && (
        <div className="space-y-6">
          {/* Scope Summary Line */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#827B72] px-1">
            <span className="tabular-nums">
              {t.readMyself.scopeSummary(analysis.recordCount)}
            </span>
            <span className="tabular-nums">{analysis.dateSpanLabel}</span>
          </div>

          {/* 1. Frequent Themes & Keywords with Evidence */}
          <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              {t.readMyself.themesTitle}
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
                          {t.readMyself.keywordCountLabel(kw.recordCount)}
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
              {t.readMyself.flowTitle}
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
                      <span className="inline-flex items-center gap-0.5 text-[#777B61] opacity-80 group-hover:opacity-100 shrink-0">
                        {t.readMyself.originalShort}
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
                {t.readMyself.recurringQuestionsTitle}
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
                        {t.readMyself.sourceRecordLabel(item.dateLabel)}
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
              {t.readMyself.connectionTitle}
            </h2>
            <p className="text-[15px] sm:text-base leading-[1.75] text-[#34312D]">
              {analysis.newPerspective}
            </p>
          </article>

          {/* 5. Closing Questions */}
          <article className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xs font-medium tracking-wide text-[#777B61]">
              {t.readMyself.closingQuestionsTitle}
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

          {/* Safety, Feedback & Local Processing Notice */}
          <div className="rounded-2xl bg-[#FFFCF6]/80 border border-[#E7E0D5] p-5 sm:p-6 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-relaxed text-[#827B72]">
                {t.readMyself.localNoticeText}
              </p>
              <button
                type="button"
                onClick={() =>
                  setFlaggedRanges((prev) => ({
                    ...prev,
                    [rangeKey]: !prev[rangeKey],
                  }))
                }
                aria-pressed={isSummaryFlagged}
                className={`inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 rounded-xl border text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  isSummaryFlagged
                    ? 'bg-[#777B61]/10 border-[#777B61] text-[#34312D]'
                    : 'bg-[#FFFCF6] border-[#E7E0D5] text-[#827B72] hover:text-[#34312D]'
                }`}
              >
                {isSummaryFlagged && (
                  <Check className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
                )}
                <span>
                  {isSummaryFlagged
                    ? t.readMyself.flagMarked
                    : t.readMyself.flagAction}
                </span>
              </button>
            </div>
            <p className="text-xs leading-relaxed text-[#827B72]">
              {isSummaryFlagged
                ? t.readMyself.flagMarkedNote
                : t.readMyself.flagDefaultNote}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
