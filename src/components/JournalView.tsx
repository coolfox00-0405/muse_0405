import {
  useState,
  useEffect,
  useRef,
  useMemo,
  FormEvent,
  ChangeEvent,
} from 'react';
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  BookOpen,
  Plus,
  Download,
  Upload,
  Search,
  X,
  ArrowUpRight,
} from 'lucide-react';
import { ReflectionRecord } from '../types/reflection';
import { getCardById } from '../data/cards';
import { TarotCardArtwork } from './TarotCardArtwork';
import { LucidaBrandMark } from './LucidaBrandMark';
import {
  formatLocalizedDate,
  formatLocalizedTime,
  getLocalDateString,
  createBackupPayload,
  validateBackupJson,
} from '../hooks/useReflections';
import { useLanguage } from '../i18n/LanguageContext';
import { UI_TRANSLATIONS } from '../i18n/ui';
import {
  getLocalizedCard,
  getLocalizedRecordCardName,
  getLocalizedRecordQuestion,
} from '../i18n/cardHelpers';
import { resolveLocalizedAttemptItem } from '../utils/attemptGenerator';

const FREEFORM_DRAFT_KEY = 'lucida_draft_freeform_note';

type RecordTypeFilter = 'all' | 'card' | 'freeform' | 'action';

interface JournalViewProps {
  records: ReflectionRecord[];
  focusedRecordId?: string | null;
  onClearFocusedRecord?: () => void;
  onAddFreeform: (
    note: string,
    customQuestion?: string
  ) => { ok: boolean; error?: string; record?: ReflectionRecord };
  onUpdate: (
    id: string,
    note: string,
    updatedActionMemo?: string
  ) => { ok: boolean; error?: string };
  onAddFollowUp: (
    recordId: string,
    note: string,
    prompt?: string
  ) => { ok: boolean; error?: string };
  onDelete: (id: string) => { ok: boolean; error?: string };
  onImport: (
    incoming: ReflectionRecord[],
    mode: 'merge' | 'replace'
  ) => { ok: boolean; addedCount: number; totalCount: number; error?: string };
  onGoToToday: () => void;
  onOpenEncyclopedia?: (cardId?: string) => void;
}

export function JournalView({
  records,
  focusedRecordId,
  onClearFocusedRecord,
  onAddFreeform,
  onUpdate,
  onAddFollowUp,
  onDelete,
  onImport,
  onGoToToday,
  onOpenEncyclopedia,
}: JournalViewProps) {
  const { language, t } = useLanguage();

  const [selectedId, setSelectedId] = useState<string | null>(
    focusedRecordId || (records.length > 0 ? records[0].id : null)
  );
  const [mobileShowDetail, setMobileShowDetail] = useState(
    Boolean(focusedRecordId)
  );

  // Search & Type Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RecordTypeFilter>('all');

  // Freeform Composer with Auto-Draft & Optional Prompts (tracked by index so prompts translate live)
  const [newNoteDraft, setNewNoteDraft] = useState<string>(() => {
    try {
      return window.localStorage.getItem(FREEFORM_DRAFT_KEY) || '';
    } catch {
      return '';
    }
  });
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(
    null
  );
  const selectedPrompt =
    selectedPromptIndex !== null
      ? t.journal.freeformPrompts[selectedPromptIndex] ?? ''
      : '';

  const [isComposing, setIsComposing] = useState<boolean>(() => {
    try {
      return Boolean(window.localStorage.getItem(FREEFORM_DRAFT_KEY)?.trim());
    } catch {
      return false;
    }
  });

  // Backup / Restore
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  const [pendingRestore, setPendingRestore] = useState<{
    records: ReflectionRecord[];
    exportedAt?: string;
    fileName: string;
  } | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [backupFeedback, setBackupFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Edit / Delete / Follow-up
  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [editActionMemoDraft, setEditActionMemoDraft] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [isAddingFollowUp, setIsAddingFollowUp] = useState(false);
  const [followUpPromptIndex, setFollowUpPromptIndex] = useState<number | null>(
    null
  );
  const followUpPrompt =
    followUpPromptIndex !== null
      ? t.journal.followUpPrompts[followUpPromptIndex] ?? ''
      : '';

  const [followUpDraft, setFollowUpDraft] = useState('');
  const [followUpFeedback, setFollowUpFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Auto-save freeform draft
  useEffect(() => {
    try {
      if (newNoteDraft.trim()) {
        window.localStorage.setItem(FREEFORM_DRAFT_KEY, newNoteDraft);
      } else {
        window.localStorage.removeItem(FREEFORM_DRAFT_KEY);
      }
    } catch {
      // Ignore
    }
  }, [newNoteDraft]);

  useEffect(() => {
    if (focusedRecordId && records.some((r) => r.id === focusedRecordId)) {
      setSearchQuery('');
      setTypeFilter('all');
      setSelectedId(focusedRecordId);
      setMobileShowDetail(true);
      setIsComposing(false);
      setIsEditing(false);
      setConfirmingDelete(false);
      setIsAddingFollowUp(false);
      setFollowUpFeedback(null);
      onClearFocusedRecord?.();
    }
  }, [focusedRecordId, records, onClearFocusedRecord]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((rec) => {
      const hasAttemptData = Boolean(
        (rec.selectedActions && rec.selectedActions.length > 0) ||
          rec.selectedAction ||
          rec.actionMemo?.trim()
      );
      if (typeFilter === 'card' && rec.cardId === 'freeform') return false;
      if (typeFilter === 'freeform' && rec.cardId !== 'freeform') return false;
      if (typeFilter === 'action' && !hasAttemptData) return false;

      if (!q) return true;
      const card =
        rec.cardId !== 'freeform' ? getCardById(rec.cardId) : undefined;
      const locEn = card ? getLocalizedCard(card, 'en').displayName.toLowerCase() : '';
      const locJa = card ? getLocalizedCard(card, 'ja').displayName.toLowerCase() : '';
      const freeformMatches =
        rec.cardId === 'freeform' &&
        t.journal.freeformCardName.toLowerCase().includes(q);

      return (
        rec.userNote.toLowerCase().includes(q) ||
        Boolean(rec.actionMemo?.toLowerCase().includes(q)) ||
        Boolean(rec.selectedAction?.toLowerCase().includes(q)) ||
        Boolean(
          rec.selectedActions?.some((a) => {
            const localizedAttempt = resolveLocalizedAttemptItem(
              a,
              getCardById,
              language
            );
            return (
              a.actionText.toLowerCase().includes(q) ||
              a.cardName.toLowerCase().includes(q) ||
              localizedAttempt.actionText.toLowerCase().includes(q) ||
              localizedAttempt.cardName.toLowerCase().includes(q)
            );
          })
        ) ||
        Boolean(
          rec.followUpNotes?.some(
            (f) =>
              f.note.toLowerCase().includes(q) ||
              Boolean(f.prompt?.toLowerCase().includes(q))
          )
        ) ||
        rec.cardName.toLowerCase().includes(q) ||
        rec.cardNameEn.toLowerCase().includes(q) ||
        locEn.includes(q) ||
        locJa.includes(q) ||
        freeformMatches ||
        Boolean(
          rec.spreadCards?.some((s) => {
            const sc = getCardById(s.cardId);
            const scLoc = sc ? getLocalizedCard(sc, language).displayName.toLowerCase() : '';
            return (
              s.cardName.toLowerCase().includes(q) ||
              s.cardNameEn.toLowerCase().includes(q) ||
              scLoc.includes(q)
            );
          })
        ) ||
        rec.reflectionQuestion.toLowerCase().includes(q) ||
        rec.date.includes(q)
      );
    });
  }, [records, searchQuery, typeFilter, language, t.journal.freeformCardName]);

  const selectedRecord =
    filteredRecords.find((r) => r.id === selectedId) ??
    filteredRecords[0] ??
    null;

  useEffect(() => {
    if (filteredRecords.length === 0) {
      setSelectedId(null);
      setMobileShowDetail(false);
    } else if (!filteredRecords.some((r) => r.id === selectedId)) {
      setSelectedId(filteredRecords[0].id);
    }
  }, [filteredRecords, selectedId]);

  const [inspectedSpreadIndex, setInspectedSpreadIndex] = useState(0);

  useEffect(() => {
    setInspectedSpreadIndex(0);
    setIsAddingFollowUp(false);
    setFollowUpPromptIndex(null);
    setFollowUpDraft('');
    setFollowUpFeedback(null);
  }, [selectedRecord?.id]);

  const handleSelectRecord = (record: ReflectionRecord) => {
    setSelectedId(record.id);
    setMobileShowDetail(true);
    setIsComposing(false);
    setIsEditing(false);
    setConfirmingDelete(false);
    setStatusMessage(null);
    setIsAddingFollowUp(false);
    setFollowUpPromptIndex(null);
    setFollowUpDraft('');
    setFollowUpFeedback(null);
  };

  const handleCreateFreeform = (e: FormEvent) => {
    e.preventDefault();
    const result = onAddFreeform(newNoteDraft, selectedPrompt || undefined);
    if (result.ok && result.record) {
      setNewNoteDraft('');
      setSelectedPromptIndex(null);
      try {
        window.localStorage.removeItem(FREEFORM_DRAFT_KEY);
      } catch {
        // Ignore
      }
      setIsComposing(false);
      setTypeFilter('all');
      setSearchQuery('');
      setSelectedId(result.record.id);
      setMobileShowDetail(true);
      setStatusMessage({ type: 'success', text: t.journal.feedbackCreated });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || t.journal.feedbackCreateError,
      });
    }
  };

  const handleExportJson = () => {
    if (records.length === 0) {
      setBackupFeedback({
        type: 'error',
        text: t.journal.noRecordsToExport,
      });
      return;
    }
    try {
      const json = createBackupPayload(records);
      const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lucida-insight-notes-${getLocalDateString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupFeedback({
        type: 'success',
        text: t.journal.exportJsonSuccess(records.length),
      });
    } catch {
      setBackupFeedback({
        type: 'error',
        text: t.journal.exportJsonError,
      });
    }
  };

  const escapeCsvCell = (value: string): string => {
    const safe = value.replace(/\r\n/g, '\n');
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const handleExportCsv = () => {
    if (records.length === 0) {
      setBackupFeedback({
        type: 'error',
        text: t.journal.noRecordsToExport,
      });
      return;
    }
    try {
      const headers = t.journal.csvHeaders;
      const rows = records.map((rec) => {
        const card =
          rec.cardId !== 'freeform' ? getCardById(rec.cardId) : undefined;
        const localizedName = getLocalizedRecordCardName(
          rec.cardId,
          rec.cardName,
          card,
          language,
          t.journal.freeformCardName
        );
        const typeLabel =
          rec.cardId === 'freeform'
            ? t.journal.typeFreeform
            : rec.readingType === 'three'
            ? t.journal.typeThreeCards
            : t.journal.typeCard;
        const attemptsText =
          rec.selectedActions
            ?.map(
              (a) =>
                resolveLocalizedAttemptItem(a, getCardById, language).actionText
            )
            .join(' / ') ||
          rec.selectedAction ||
          '';
        const followUpsText =
          rec.followUpNotes
            ?.map((f) => `${f.createdAt.slice(0, 10)}: ${f.note}`)
            .join(' | ') || '';
        const orientLabel =
          rec.cardId === 'freeform'
            ? ''
            : rec.orientation === 'reversed'
            ? t.journal.csvOrientReversed
            : t.journal.csvOrientUpright;
        const localizedQuestion = getLocalizedRecordQuestion(
          rec.reflectionQuestion,
          card,
          language
        );
        return [
          rec.date,
          typeLabel,
          localizedName,
          rec.cardNameEn,
          orientLabel,
          localizedQuestion,
          attemptsText,
          rec.actionMemo || '',
          rec.userNote,
          followUpsText,
        ]
          .map(escapeCsvCell)
          .join(',');
      });
      const csvContent = `\uFEFF${headers.map(escapeCsvCell).join(',')}\n${rows.join('\n')}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lucida-insight-notes-${getLocalDateString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setBackupFeedback({
        type: 'success',
        text: t.journal.exportCsvSuccess(records.length),
      });
    } catch {
      setBackupFeedback({
        type: 'error',
        text: t.journal.exportCsvError,
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const validation = validateBackupJson(text, language);
      if (!validation.ok || !validation.records) {
        setPendingRestore(null);
        setBackupFeedback({
          type: 'error',
          text: validation.error || t.journal.invalidBackupFallback,
        });
        return;
      }

      setBackupFeedback(null);
      setRestoreMode('merge');
      setPendingRestore({
        records: validation.records,
        exportedAt: validation.exportedAt,
        fileName: file.name,
      });
    };
    reader.onerror = () => {
      setPendingRestore(null);
      setBackupFeedback({
        type: 'error',
        text: t.errors.fileReadError,
      });
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleConfirmRestore = () => {
    if (!pendingRestore) return;
    const result = onImport(pendingRestore.records, restoreMode);
    if (result.ok) {
      const modeLabel =
        restoreMode === 'merge'
          ? t.journal.restoreMergeSuccess(result.addedCount, result.totalCount)
          : t.journal.restoreReplaceSuccess(result.totalCount);
      setPendingRestore(null);
      setBackupFeedback({ type: 'success', text: modeLabel });
    } else {
      setBackupFeedback({
        type: 'error',
        text: result.error || t.journal.restoreFailedFallback,
      });
    }
  };

  const handleStartEdit = () => {
    if (!selectedRecord) return;
    setEditDraft(selectedRecord.userNote);
    setEditActionMemoDraft(selectedRecord.actionMemo || '');
    setIsEditing(true);
    setConfirmingDelete(false);
    setStatusMessage(null);
  };

  const handleSaveEdit = () => {
    if (!selectedRecord) return;
    const result = onUpdate(
      selectedRecord.id,
      editDraft,
      selectedRecord.cardId !== 'freeform' ? editActionMemoDraft : undefined
    );
    if (result.ok) {
      setIsEditing(false);
      setStatusMessage({ type: 'success', text: t.journal.feedbackUpdated });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || t.journal.feedbackUpdateError,
      });
    }
  };

  const handleCreateFollowUp = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;
    const result = onAddFollowUp(
      selectedRecord.id,
      followUpDraft,
      followUpPrompt || undefined
    );
    if (result.ok) {
      setFollowUpDraft('');
      setFollowUpPromptIndex(null);
      setIsAddingFollowUp(false);
      setFollowUpFeedback({
        type: 'success',
        text: t.journal.feedbackFollowUpSaved,
      });
    } else {
      setFollowUpFeedback({
        type: 'error',
        text: result.error || t.journal.feedbackFollowUpError,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!selectedRecord) return;
    const result = onDelete(selectedRecord.id);
    if (result.ok) {
      setConfirmingDelete(false);
      setIsEditing(false);
      setMobileShowDetail(false);
      setStatusMessage(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || t.journal.feedbackDeleteError,
      });
    }
  };

  const resolveFreeformQuestionDisplay = (question: string): string => {
    const trimmed = question.trim();
    const defaults = [
      UI_TRANSLATIONS.ko.journal.freeformDefaultQuestion,
      UI_TRANSLATIONS.en.journal.freeformDefaultQuestion,
      UI_TRANSLATIONS.ja.journal.freeformDefaultQuestion,
    ];
    if (defaults.includes(trimmed)) {
      return t.journal.freeformDefaultQuestion;
    }
    return question;
  };

  const resolveOverallMessageDisplay = (rec: ReflectionRecord): string | undefined => {
    if (!rec.overallMessage) return undefined;
    if (rec.spreadCards && rec.spreadCards.length >= 3) {
      const c0 = getCardById(rec.spreadCards[0].cardId);
      const c1 = getCardById(rec.spreadCards[1].cardId);
      const c2 = getCardById(rec.spreadCards[2].cardId);
      if (c0 && c1 && c2) {
        const l0 = getLocalizedCard(c0, language, rec.spreadCards[0].orientation);
        const l1 = getLocalizedCard(c1, language, rec.spreadCards[1].orientation);
        const l2 = getLocalizedCard(c2, language, rec.spreadCards[2].orientation);
        return t.today.synthesisThreeCard(
          l0.displayName,
          l0.keywords[0],
          l1.displayName,
          l1.keywords[0],
          l2.displayName,
          l2.keywords[0]
        );
      }
    }
    const card = rec.cardId !== 'freeform' ? getCardById(rec.cardId) : undefined;
    if (card) {
      const loc = getLocalizedCard(card, language, rec.orientation ?? 'upright');
      const kwJoined = loc.keywords.join(' · ');
      return rec.orientation === 'reversed'
        ? t.today.synthesisSingleReversed(loc.displayName, kwJoined)
        : t.today.synthesisSingleUpright(loc.displayName, kwJoined);
    }
    return rec.overallMessage;
  };

  const backupPanel = showBackupPanel && (
    <div
      aria-label={t.journal.backupPanelAria}
      className="mb-8 bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 space-y-5 text-left"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-lg font-medium text-[#34312D]">
            {t.journal.backupPanelTitle}
          </h2>
          <span className="text-xs text-[#827B72] tabular-nums">
            {t.journal.backupPanelCount(records.length, getLocalDateString())}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-[#827B72]">
          {t.journal.backupPanelDescription}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>{t.journal.exportJson}</span>
        </button>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#E7E0D5]/45 text-sm text-[#34312D] font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
          <span>{t.journal.exportCsv}</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#F7F3EA]/60 hover:bg-[#E7E0D5]/50 text-sm text-[#34312D] font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <Upload className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
          <span>{t.journal.importJson}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-label={t.journal.importFileInputAria}
        />
      </div>

      {pendingRestore && (
        <div
          role="region"
          aria-label={t.journal.restoreRegionAria}
          className="rounded-xl bg-[#F7F3EA] border border-[#E7E0D5] p-4 space-y-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#34312D]">
              {t.journal.restoreFileLabel(pendingRestore.fileName)}
            </p>
            <p className="text-xs text-[#827B72] tabular-nums">
              {t.journal.restoreCountLabel(
                pendingRestore.records.length,
                pendingRestore.exportedAt
              )}
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-[#34312D] mb-1">
              {t.journal.restoreModeLegend}
            </legend>
            <label className="flex items-start gap-2.5 text-sm text-[#34312D] cursor-pointer">
              <input
                type="radio"
                name="restoreMode"
                value="merge"
                checked={restoreMode === 'merge'}
                onChange={() => setRestoreMode('merge')}
                className="mt-1 accent-[#777B61]"
              />
              <span>
                <strong>{t.journal.restoreMergeTitle}</strong>{' '}
                {t.journal.restoreMergeDesc}
              </span>
            </label>
            <label className="flex items-start gap-2.5 text-sm text-[#34312D] cursor-pointer">
              <input
                type="radio"
                name="restoreMode"
                value="replace"
                checked={restoreMode === 'replace'}
                onChange={() => setRestoreMode('replace')}
                className="mt-1 accent-[#777B61]"
              />
              <span>
                <strong>{t.journal.restoreReplaceTitle}</strong>{' '}
                {t.journal.restoreReplaceDesc}
              </span>
            </label>
          </fieldset>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingRestore(null)}
              className="min-h-[40px] px-4 py-1.5 rounded-lg border border-[#E7E0D5] bg-[#FFFCF6] text-sm text-[#827B72] hover:text-[#34312D] cursor-pointer"
            >
              {t.journal.deleteConfirmCancel}
            </button>
            <button
              type="button"
              onClick={handleConfirmRestore}
              className="min-h-[40px] px-4 py-1.5 rounded-lg bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium cursor-pointer"
            >
              {t.journal.restoreRun}
            </button>
          </div>
        </div>
      )}

      {backupFeedback && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border ${
            backupFeedback.type === 'success'
              ? 'bg-[#777B61]/10 border-[#777B61]/25 text-[#34312D]'
              : 'bg-[#A65D4E]/10 border-[#A65D4E]/25 text-[#7A3B2E]'
          }`}
        >
          {backupFeedback.type === 'success' ? (
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
          <span>{backupFeedback.text}</span>
        </div>
      )}
    </div>
  );

  if (records.length === 0 && !isComposing) {
    return (
      <section
        aria-label={t.journal.sectionAria}
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-2 sm:pt-7 pb-12 text-center"
      >
        <LucidaBrandMark variant="compact" className="mb-4 sm:mb-5" />
        {backupPanel}

        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl px-6 py-14 sm:py-16 space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#F7F3EA] border border-[#E7E0D5] flex items-center justify-center mx-auto text-[#777B61]">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-[#34312D]">{t.journal.title}</h1>
            <p className="text-[15px] leading-relaxed text-[#827B72] max-w-xs mx-auto">
              {t.journal.emptyLead}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToToday}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.journal.emptyGoToday}
            </button>
            <button
              type="button"
              onClick={() => setIsComposing(true)}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-[#34312D] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              {t.journal.emptyWriteFreeform}
            </button>
            <button
              type="button"
              onClick={() => setShowBackupPanel((prev) => !prev)}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-[#827B72] hover:text-[#34312D] text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              {showBackupPanel
                ? t.journal.backupToggleClose
                : t.journal.backupEmptyOpen}
            </button>
          </div>

          <aside
            aria-label={t.journal.emptyExampleHeading}
            className="max-w-md mx-auto mt-4 rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 text-left space-y-1.5"
          >
            <p className="text-[11px] font-medium text-[#777B61]">
              {t.journal.emptyExampleHeading}
            </p>
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85">
              {t.journal.emptyExampleBody}
            </p>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label={t.journal.sectionAria}
      className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-2 sm:pt-6 pb-12"
    >
      <LucidaBrandMark variant="compact" className="mb-3 sm:mb-4" />
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E0D5] pb-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#34312D]">
            {t.journal.title}
          </h1>
          <span className="text-sm text-[#827B72] tabular-nums">
            {t.journal.totalCount(records.length)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setShowBackupPanel((prev) => !prev);
              setBackupFeedback(null);
            }}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#E7E0D5]/45 text-sm text-[#827B72] hover:text-[#34312D] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>
              {showBackupPanel
                ? t.journal.backupToggleClose
                : t.journal.backupToggleOpen}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsComposing((prev) => !prev);
              setStatusMessage(null);
            }}
            className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#E7E0D5]/45 text-sm text-[#34312D] transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
            <span>
              {isComposing ? t.journal.composeClose : t.journal.composeOpen}
            </span>
          </button>
        </div>
      </header>

      {backupPanel}

      {/* Freeform Composer with Optional Reflection Prompts & Auto-Draft */}
      {isComposing && (
        <form
          onSubmit={handleCreateFreeform}
          className="mb-8 bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label
              htmlFor="new-freeform-note"
              className="block text-sm font-medium text-[#34312D]"
            >
              {t.journal.composeLabel}
            </label>
            {newNoteDraft.trim().length > 0 && (
              <div className="flex items-center gap-2 text-xs text-[#827B72]">
                <span>{t.journal.autoDraftSaved}</span>
                <button
                  type="button"
                  onClick={() => setNewNoteDraft('')}
                  className="underline underline-offset-2 hover:text-[#34312D] cursor-pointer"
                >
                  {t.journal.clearDraft}
                </button>
              </div>
            )}
          </div>

          {/* Optional Prompt Selector */}
          <div className="space-y-2">
            <p className="text-xs text-[#827B72]">{t.journal.promptsHint}</p>
            <div className="flex flex-wrap gap-2">
              {t.journal.freeformPrompts.map((prompt, idx) => {
                const isPicked = selectedPromptIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setSelectedPromptIndex((prev) => (prev === idx ? null : idx))
                    }
                    aria-pressed={isPicked}
                    className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                      isPicked
                        ? 'bg-[#777B61] border-[#777B61] text-[#FFFCF6]'
                        : 'bg-[#F7F3EA]/70 border-[#E7E0D5] text-[#34312D]/85 hover:border-[#777B61]/60'
                    }`}
                  >
                    {prompt}
                  </button>
                );
              })}
            </div>
          </div>

          <textarea
            id="new-freeform-note"
            rows={4}
            value={newNoteDraft}
            onChange={(e) => setNewNoteDraft(e.target.value)}
            placeholder={selectedPrompt || t.journal.composePlaceholder}
            className="w-full rounded-xl bg-[#F7F3EA]/50 border border-[#E7E0D5] px-4 py-3 text-[15px] leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
          />

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsComposing(false);
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] text-sm text-[#827B72] hover:text-[#34312D] cursor-pointer"
            >
              {t.journal.closeButton}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium cursor-pointer"
            >
              {t.journal.saveButton}
            </button>
          </div>
        </form>
      )}

      {/* Search & Record Type Filter Bar */}
      {records.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            role="group"
            aria-label={t.journal.filterGroupAria}
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
          >
            {(
              [
                { id: 'all', label: t.journal.filters.all },
                { id: 'card', label: t.journal.filters.card },
                { id: 'freeform', label: t.journal.filters.freeform },
                { id: 'action', label: t.journal.filters.action },
              ] as const
            ).map((opt) => {
              const active = typeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTypeFilter(opt.id)}
                  aria-pressed={active}
                  className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#777B61] text-[#FFFCF6]'
                      : 'text-[#827B72] hover:text-[#34312D] hover:bg-[#F7F3EA]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              className="w-4 h-4 text-[#827B72] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.journal.searchPlaceholder}
              aria-label={t.journal.searchAria}
              className="w-full min-h-[42px] pl-9 pr-9 py-2 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5] text-sm text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label={t.journal.clearSearchAria}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#827B72] hover:text-[#34312D] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}

      {filteredRecords.length === 0 ? (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl px-6 py-12 text-center space-y-2">
          <p className="font-serif text-lg text-[#34312D]">
            {t.journal.noMatchesTitle}
          </p>
          <p className="text-sm text-[#827B72]">{t.journal.noMatchesHint}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Record List */}
          <div
            className={`lg:col-span-5 space-y-3 ${
              mobileShowDetail ? 'hidden lg:block' : 'block'
            }`}
          >
            <ul className="space-y-3" role="list">
              {filteredRecords.map((record) => {
                const isSelected = selectedRecord?.id === record.id;
                const matchedCard =
                  record.cardId !== 'freeform'
                    ? getCardById(record.cardId)
                    : undefined;
                const displayCardName = getLocalizedRecordCardName(
                  record.cardId,
                  record.cardName,
                  matchedCard,
                  language,
                  t.journal.freeformCardName
                );
                const typeLabel =
                  record.cardId === 'freeform'
                    ? t.journal.typeFreeform
                    : record.spreadCards && record.spreadCards.length > 1
                    ? t.journal.typeThreeCards
                    : t.journal.typeCard;
                const attemptCount =
                  record.selectedActions?.length ??
                  (record.selectedAction ? 1 : 0);
                const followUpCount = record.followUpNotes?.length ?? 0;
                const previewText =
                  record.userNote.trim() ||
                  record.actionMemo?.trim() ||
                  record.selectedActions
                    ?.map(
                      (a) =>
                        resolveLocalizedAttemptItem(a, getCardById, language)
                          .actionText
                    )
                    .join(' · ') ||
                  record.selectedAction ||
                  '';

                return (
                  <li key={record.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectRecord(record)}
                      className={`w-full text-left rounded-2xl p-5 border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
                        isSelected
                          ? 'bg-[#FFFCF6] border-[#777B61]'
                          : 'bg-[#FFFCF6]/80 border-[#E7E0D5] hover:border-[#827B72]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs text-[#827B72] mb-2">
                        <span className="tabular-nums">
                          {formatLocalizedDate(record.date, language)} · {typeLabel}
                        </span>
                        <span className="tabular-nums">
                          {formatLocalizedTime(record.createdAt, language)}
                        </span>
                      </div>
                      <p className="font-serif text-base font-medium text-[#34312D] mb-1.5">
                        {record.spreadCards && record.spreadCards.length > 1 ? (
                          <span>
                            {record.spreadCards
                              .map((s) => {
                                const sc = getCardById(s.cardId);
                                return sc
                                  ? getLocalizedCard(sc, language).displayName
                                  : s.cardName;
                              })
                              .join(' · ')}
                          </span>
                        ) : (
                          <>
                            {displayCardName}
                            {record.cardNameEn &&
                              language !== 'en' &&
                              record.cardId !== 'freeform' && (
                                <span className="ml-1.5 text-xs font-normal text-[#827B72]">
                                  {record.cardNameEn}
                                </span>
                              )}
                          </>
                        )}
                      </p>
                      {previewText && (
                        <p className="text-sm leading-relaxed text-[#34312D]/80 line-clamp-2">
                          {previewText}
                        </p>
                      )}
                      {(attemptCount > 0 || followUpCount > 0) && (
                        <p className="mt-2 text-[11px] text-[#777B61] tabular-nums">
                          {[
                            attemptCount > 0
                              ? t.journal.badgeAttempts(attemptCount)
                              : null,
                            followUpCount > 0
                              ? t.journal.badgeFollowUps(followUpCount)
                              : null,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Record Detail Panel */}
          {selectedRecord && (() => {
            const detailCard =
              selectedRecord.cardId !== 'freeform'
                ? getCardById(selectedRecord.cardId)
                : undefined;
            const detailCardName = getLocalizedRecordCardName(
              selectedRecord.cardId,
              selectedRecord.cardName,
              detailCard,
              language,
              t.journal.freeformCardName
            );
            const detailTypeLabel =
              selectedRecord.cardId === 'freeform'
                ? t.journal.typeFreeform
                : selectedRecord.spreadCards &&
                  selectedRecord.spreadCards.length > 1
                ? t.journal.typeThreeCards
                : t.journal.typeCard;
            const detailQuestion =
              selectedRecord.cardId === 'freeform'
                ? resolveFreeformQuestionDisplay(selectedRecord.reflectionQuestion)
                : getLocalizedRecordQuestion(
                    selectedRecord.reflectionQuestion,
                    detailCard,
                    language,
                    selectedRecord.orientation ?? 'upright'
                  );
            const detailOverallMessage =
              resolveOverallMessageDisplay(selectedRecord);

            return (
              <div
                className={`lg:col-span-7 ${
                  mobileShowDetail ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-6">
                  {/* Mobile Back Button */}
                  <div className="lg:hidden -mt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setMobileShowDetail(false);
                        setIsEditing(false);
                        setConfirmingDelete(false);
                      }}
                      className="inline-flex items-center gap-1 min-h-[44px] -ml-2 px-2 text-sm text-[#827B72] hover:text-[#34312D] cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                      <span>{t.journal.backToList}</span>
                    </button>
                  </div>

                  {/* Detail Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5DED1] pb-5">
                    <div className="flex items-start gap-4">
                      {detailCard &&
                        (onOpenEncyclopedia ? (
                          <button
                            type="button"
                            onClick={() => onOpenEncyclopedia(detailCard.id)}
                            aria-label={t.journal.openCardArchiveAria(
                              detailCardName
                            )}
                            className="w-14 sm:w-16 aspect-[896/1200] rounded-[10px] overflow-hidden border border-[#E5DED1] hover:border-[#777B61] bg-[#FFFCF6] shrink-0 transition-colors cursor-pointer"
                          >
                            <TarotCardArtwork
                              card={detailCard}
                              size="thumbnail"
                              isReversed={
                                selectedRecord.orientation === 'reversed'
                              }
                            />
                          </button>
                        ) : (
                          <div className="w-14 sm:w-16 aspect-[896/1200] rounded-[10px] overflow-hidden border border-[#E5DED1] bg-[#FFFCF6] shrink-0">
                            <TarotCardArtwork
                              card={detailCard}
                              size="thumbnail"
                              isReversed={
                                selectedRecord.orientation === 'reversed'
                              }
                            />
                          </div>
                        ))}
                      <div className="space-y-1">
                        <p className="text-xs text-[#827B72] tabular-nums">
                          {formatLocalizedDate(selectedRecord.date, language)} ·{' '}
                          {formatLocalizedTime(selectedRecord.createdAt, language)}{' '}
                          · {detailTypeLabel}
                        </p>
                        <h2 className="font-serif text-2xl font-medium text-[#34312D]">
                          {detailCardName}
                          {selectedRecord.cardNameEn &&
                            language !== 'en' &&
                            selectedRecord.cardId !== 'freeform' && (
                              <span className="ml-2 text-base font-normal text-[#827B72]">
                                ({selectedRecord.cardNameEn})
                              </span>
                            )}
                        </h2>
                        {selectedRecord.cardId !== 'freeform' &&
                          detailCard &&
                          onOpenEncyclopedia && (
                            <button
                              type="button"
                              onClick={() =>
                                onOpenEncyclopedia(selectedRecord.cardId)
                              }
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#777B61] hover:text-[#34312D] underline underline-offset-4 cursor-pointer"
                            >
                              <span>{t.journal.openCardArchiveLink}</span>
                              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                            </button>
                          )}
                      </div>
                    </div>

                    {!isEditing && !confirmingDelete && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleStartEdit}
                          aria-label={t.journal.editAria}
                          className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E7E0D5] text-sm text-[#34312D] hover:bg-[#F7F3EA] transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t.journal.editButton}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmingDelete(true);
                            setStatusMessage(null);
                          }}
                          aria-label={t.journal.deleteAria}
                          className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E7E0D5] text-sm text-[#827B72] hover:text-[#7A3B2E] hover:border-[#A65D4E]/40 hover:bg-[#A65D4E]/5 transition-colors whitespace-nowrap cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>{t.journal.deleteButton}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Preserved 3-Card Spread Snapshot if this reading used 3 cards */}
                  {selectedRecord.spreadCards &&
                    selectedRecord.spreadCards.length > 1 && (
                      <div className="rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 space-y-3">
                        <p className="text-xs font-medium text-[#777B61]">
                          {t.journal.spreadSnapshotTitle(
                            selectedRecord.spreadCards.length
                          )}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {selectedRecord.spreadCards.map((snap, idx) => {
                            const snapCard = getCardById(snap.cardId);
                            const snapLoc = snapCard
                              ? getLocalizedCard(snapCard, language)
                              : null;
                            const snapPosLabel =
                              t.today.threeCardPositions[idx] ||
                              snap.positionLabel ||
                              t.journal.spreadSlotFallback(idx);
                            const active = inspectedSpreadIndex === idx;
                            return (
                              <button
                                key={`${snap.cardId}-${idx}`}
                                type="button"
                                onClick={() => setInspectedSpreadIndex(idx)}
                                aria-pressed={active}
                                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                                  active
                                    ? 'bg-[#FFFCF6] border-[#777B61]'
                                    : 'bg-[#FFFCF6]/65 border-[#E5DED1] hover:border-[#777B61]/60'
                                }`}
                              >
                                {snapCard && (
                                  <div className="w-9 aspect-[896/1200] rounded-md overflow-hidden border border-[#E5DED1] bg-[#FFFCF6] shrink-0">
                                    <TarotCardArtwork
                                      card={snapCard}
                                      size="thumbnail"
                                      isReversed={snap.orientation === 'reversed'}
                                    />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="text-[11px] text-[#777B61] font-medium">
                                    0{idx + 1}. {snapPosLabel}
                                  </p>
                                  <p className="font-serif text-xs font-medium text-[#34312D] truncate">
                                    {snapLoc?.displayName ?? snap.cardName}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {(() => {
                          const activeSnap =
                            selectedRecord.spreadCards?.[inspectedSpreadIndex];
                          const activeSnapCard = activeSnap
                            ? getCardById(activeSnap.cardId)
                            : undefined;
                          if (!activeSnap || !activeSnapCard) return null;
                          const activeSnapLoc = getLocalizedCard(
                            activeSnapCard,
                            language,
                            activeSnap.orientation
                          );
                          const activePosLabel =
                            t.today.threeCardPositions[inspectedSpreadIndex] ||
                            activeSnap.positionLabel ||
                            t.journal.spreadSlotFallback(inspectedSpreadIndex);
                          return (
                            <div className="pt-2 border-t border-[#E5DED1] text-xs leading-relaxed text-[#34312D]/85 space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="font-medium text-[#34312D]">
                                  {activePosLabel} · {activeSnapLoc.displayName}
                                  {language !== 'en' &&
                                    ` (${activeSnapCard.nameEn})`}
                                </p>
                                {onOpenEncyclopedia && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenEncyclopedia(activeSnapCard.id)
                                    }
                                    className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#777B61] hover:text-[#34312D] underline underline-offset-2 cursor-pointer"
                                  >
                                    <span>{t.journal.viewInArchiveShort}</span>
                                    <ArrowUpRight
                                      className="w-3 h-3"
                                      aria-hidden="true"
                                    />
                                  </button>
                                )}
                              </div>
                              <p>{activeSnapLoc.meaningGuide}</p>
                              <p className="text-[#777B61]">
                                {t.journal.questionPrefix}:{' '}
                                {activeSnapLoc.reflectionQuestion}
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    )}

                  {/* Single-Card Interpretation Reference */}
                  {selectedRecord.cardId !== 'freeform' &&
                    (!selectedRecord.spreadCards ||
                      selectedRecord.spreadCards.length <= 1) &&
                    detailCard &&
                    (() => {
                      const matchedLoc = getLocalizedCard(
                        detailCard,
                        language,
                        selectedRecord.orientation ?? 'upright'
                      );
                      return (
                        <div className="rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-xs font-medium text-[#777B61]">
                              {t.journal.cardInterpretationTitle}
                            </p>
                            <p className="text-[11px] text-[#827B72]">
                              {matchedLoc.keywords.join(' · ')}
                            </p>
                          </div>
                          <p className="font-serif text-[15px] leading-relaxed text-[#34312D]">
                            “{matchedLoc.insight}”
                          </p>
                          <p className="text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85">
                            {matchedLoc.meaningGuide}
                          </p>
                        </div>
                      );
                    })()}

                  {/* Overall Synthesis Message */}
                  {detailOverallMessage && (
                    <div className="rounded-xl bg-[#F7F3EA]/55 border border-[#E5DED1] p-4 space-y-1.5">
                      <p className="text-xs font-medium text-[#777B61]">
                        {t.journal.overallMessageTitle}
                      </p>
                      <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#34312D]/85">
                        {detailOverallMessage}
                      </p>
                    </div>
                  )}

                  {/* Reflection Question Reference */}
                  {detailQuestion && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-[#777B61]">
                        {t.journal.reflectionQuestionTitle}
                      </p>
                      <p className="text-[15px] leading-relaxed text-[#34312D]/90">
                        {detailQuestion}
                      </p>
                    </div>
                  )}

                  {/* Optional Selected Attempts (multi-select or legacy single) */}
                  {((selectedRecord.selectedActions &&
                    selectedRecord.selectedActions.length > 0) ||
                    selectedRecord.selectedAction) && (
                    <div className="space-y-2 rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4">
                      <p className="text-xs font-medium text-[#777B61]">
                        {t.journal.selectedAttemptsTitle}
                      </p>
                      {selectedRecord.selectedActions &&
                      selectedRecord.selectedActions.length > 0 ? (
                        <ul className="space-y-2" role="list">
                          {selectedRecord.selectedActions.map((rawItem, idx) => {
                            const item = resolveLocalizedAttemptItem(
                              rawItem,
                              getCardById,
                              language
                            );
                            return (
                              <li
                                key={item.attemptId || `${item.cardId}-${idx}`}
                                className="flex items-start gap-2.5 text-sm leading-relaxed text-[#34312D]/90"
                              >
                                <Check
                                  className="w-4 h-4 text-[#777B61] shrink-0 mt-1"
                                  aria-hidden="true"
                                />
                                <div className="space-y-0.5">
                                  {(item.categoryLabel ||
                                    item.positionLabel ||
                                    item.cardName) && (
                                    <p className="text-[11px] text-[#777B61]">
                                      {[
                                        item.categoryLabel,
                                        item.positionLabel
                                          ? `${item.positionLabel} · ${item.cardName}`
                                          : item.cardName,
                                      ]
                                        .filter(Boolean)
                                        .join(' · ')}
                                    </p>
                                  )}
                                  <p>{item.actionText}</p>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm leading-relaxed text-[#34312D]/85">
                          {selectedRecord.selectedAction}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Delete Confirmation Bar */}
                  {confirmingDelete && (
                    <div
                      role="alertdialog"
                      aria-label={t.journal.deleteConfirmAria}
                      className="rounded-xl bg-[#A65D4E]/10 border border-[#A65D4E]/25 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                    >
                      <p className="text-sm text-[#7A3B2E]">
                        {t.journal.deleteConfirmText}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(false)}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#FFFCF6] border border-[#E7E0D5] text-sm text-[#34312D] hover:bg-[#F7F3EA] whitespace-nowrap cursor-pointer"
                        >
                          {t.journal.deleteConfirmCancel}
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmDelete}
                          className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#A65D4E] hover:bg-[#8E4C3E] text-[#FFFCF6] text-sm font-medium whitespace-nowrap cursor-pointer"
                        >
                          {t.journal.deleteConfirmAction}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Feedback */}
                  {statusMessage && (
                    <div
                      role="status"
                      aria-live="polite"
                      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm border ${
                        statusMessage.type === 'success'
                          ? 'bg-[#777B61]/10 border-[#777B61]/25 text-[#34312D]'
                          : 'bg-[#A65D4E]/10 border-[#A65D4E]/25 text-[#7A3B2E]'
                      }`}
                    >
                      {statusMessage.type === 'success' ? (
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
                      <span>{statusMessage.text}</span>
                    </div>
                  )}

                  {/* User Memos (actionMemo + userNote) or Edit Form */}
                  {isEditing ? (
                    <div className="space-y-4 border-t border-[#E7E0D5] pt-5">
                      {selectedRecord.cardId !== 'freeform' &&
                        Boolean(selectedRecord.actionMemo?.trim()) && (
                          <div className="space-y-1.5">
                            <label
                              htmlFor="edit-action-memo"
                              className="block text-xs font-medium text-[#827B72]"
                            >
                              {t.journal.editActionMemoLabel}
                            </label>
                            <textarea
                              id="edit-action-memo"
                              rows={2}
                              value={editActionMemoDraft}
                              onChange={(e) =>
                                setEditActionMemoDraft(e.target.value)
                              }
                              placeholder={t.journal.editActionMemoPlaceholder}
                              className="w-full rounded-xl bg-[#F7F3EA]/50 border border-[#E7E0D5] px-4 py-2.5 text-sm leading-relaxed text-[#34312D] focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
                            />
                          </div>
                        )}

                      <div className="space-y-1.5">
                        <label
                          htmlFor="edit-reflection-note"
                          className="block text-xs font-medium text-[#827B72]"
                        >
                          {t.journal.editNoteLabel}
                        </label>
                        <textarea
                          id="edit-reflection-note"
                          rows={5}
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          placeholder={t.journal.editNotePlaceholder}
                          className="w-full rounded-xl bg-[#F7F3EA]/50 border border-[#E7E0D5] px-4 py-3.5 text-[15px] leading-relaxed text-[#34312D] focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setStatusMessage(null);
                          }}
                          className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] text-sm text-[#827B72] hover:text-[#34312D] hover:bg-[#F7F3EA] whitespace-nowrap cursor-pointer"
                        >
                          {t.journal.editCancel}
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveEdit}
                          className="min-h-[44px] px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium whitespace-nowrap cursor-pointer"
                        >
                          {t.journal.editSave}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 border-t border-[#E7E0D5] pt-5">
                      {selectedRecord.actionMemo?.trim() && (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-[#827B72]">
                            {t.journal.editActionMemoLabel}
                          </p>
                          <p className="text-[15px] leading-relaxed text-[#34312D]/90 whitespace-pre-wrap">
                            {selectedRecord.actionMemo}
                          </p>
                        </div>
                      )}

                      {selectedRecord.userNote.trim() ? (
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium text-[#827B72]">
                            {t.journal.myThoughtLabel}
                          </p>
                          <p className="text-[15px] sm:text-base leading-[1.8] text-[#34312D] whitespace-pre-wrap">
                            {selectedRecord.userNote}
                          </p>
                        </div>
                      ) : (
                        !selectedRecord.actionMemo?.trim() && (
                          <p className="text-xs leading-relaxed text-[#827B72]">
                            {t.journal.attemptsOnlyHint}
                          </p>
                        )
                      )}
                    </div>
                  )}

                  {/* Later Reflection / Follow-up Notes Section */}
                  <div
                    aria-label={t.journal.followUpAria}
                    className="border-t border-[#E7E0D5] pt-5 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-[#777B61]">
                          {t.journal.followUpHeading}
                        </p>
                        <p className="text-xs text-[#827B72]">
                          {t.journal.followUpSubheading}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingFollowUp((prev) => !prev);
                          setFollowUpFeedback(null);
                        }}
                        className="inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#E7E0D5] bg-[#F7F3EA]/70 hover:bg-[#E7E0D5]/55 text-xs font-medium text-[#34312D] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
                        <span>
                          {isAddingFollowUp
                            ? t.journal.followUpToggleClose
                            : t.journal.followUpToggleOpen}
                        </span>
                      </button>
                    </div>

                    {followUpFeedback && (
                      <div
                        role="status"
                        aria-live="polite"
                        className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs border ${
                          followUpFeedback.type === 'success'
                            ? 'bg-[#777B61]/10 border-[#777B61]/25 text-[#34312D]'
                            : 'bg-[#A65D4E]/10 border-[#A65D4E]/25 text-[#7A3B2E]'
                        }`}
                      >
                        {followUpFeedback.type === 'success' ? (
                          <Check
                            className="w-3.5 h-3.5 text-[#777B61] shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <AlertCircle
                            className="w-3.5 h-3.5 text-[#A65D4E] shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span>{followUpFeedback.text}</span>
                      </div>
                    )}

                    {selectedRecord.followUpNotes &&
                      selectedRecord.followUpNotes.length > 0 && (
                        <ul className="space-y-2.5" role="list">
                          {selectedRecord.followUpNotes.map((entry) => (
                            <li
                              key={entry.id}
                              className="rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 space-y-1.5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#827B72] tabular-nums">
                                <span>
                                  {formatLocalizedDate(
                                    getLocalDateString(new Date(entry.createdAt)),
                                    language
                                  )}{' '}
                                  ·{' '}
                                  {formatLocalizedTime(entry.createdAt, language)}
                                </span>
                              </div>
                              {entry.prompt && (
                                <p className="text-xs font-medium text-[#777B61]">
                                  {entry.prompt}
                                </p>
                              )}
                              <p className="text-sm leading-relaxed text-[#34312D] whitespace-pre-wrap">
                                {entry.note}
                              </p>
                            </li>
                          ))}
                        </ul>
                      )}

                    {isAddingFollowUp && (
                      <form
                        onSubmit={handleCreateFollowUp}
                        className="rounded-xl bg-[#F7F3EA]/65 border border-[#E7E0D5] p-4 space-y-3"
                      >
                        <div className="space-y-1.5">
                          <p className="text-xs text-[#827B72]">
                            {t.journal.followUpPromptSelectLabel}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {t.journal.followUpPrompts.map((promptText, idx) => {
                              const active = followUpPromptIndex === idx;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    setFollowUpPromptIndex((prev) =>
                                      prev === idx ? null : idx
                                    )
                                  }
                                  aria-pressed={active}
                                  className={`text-left text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    active
                                      ? 'bg-[#777B61] border-[#777B61] text-[#FFFCF6]'
                                      : 'bg-[#FFFCF6] border-[#E7E0D5] text-[#34312D]/85 hover:border-[#777B61]/60'
                                  }`}
                                >
                                  {promptText}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <textarea
                          rows={3}
                          value={followUpDraft}
                          onChange={(e) => setFollowUpDraft(e.target.value)}
                          placeholder={
                            followUpPrompt || t.journal.followUpPlaceholder
                          }
                          aria-label={t.journal.followUpInputAria}
                          className="w-full rounded-lg bg-[#FFFCF6] border border-[#E7E0D5] px-3.5 py-2.5 text-sm leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
                        />

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingFollowUp(false);
                              setFollowUpFeedback(null);
                            }}
                            className="min-h-[38px] px-3.5 py-1.5 rounded-lg border border-[#E7E0D5] bg-[#FFFCF6] text-xs text-[#827B72] hover:text-[#34312D] cursor-pointer"
                          >
                            {t.journal.closeButton}
                          </button>
                          <button
                            type="submit"
                            className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-xs font-medium cursor-pointer"
                          >
                            {t.journal.followUpSave}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}
