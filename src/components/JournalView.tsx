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
  formatKoreanDate,
  formatKoreanTime,
  getLocalDateString,
  createBackupPayload,
  validateBackupJson,
} from '../hooks/useReflections';

const FREEFORM_DRAFT_KEY = 'lucida_draft_freeform_note';

const FREEFORM_PROMPTS = [
  '지금 가장 마음에 걸리는 것은 무엇인가요?',
  '유독 기억에 남는 순간은 무엇인가요?',
  '내가 실제로 원했던 것은 무엇이었을까요?',
  '지금의 나에게 해주고 싶은 말은 무엇인가요?',
  '다음에 비슷한 상황이 오면 다르게 해보고 싶은 점이 있나요?',
];

const FOLLOW_UP_PROMPTS = [
  '지금 다시 읽어보니 어떤 생각이 드나요?',
  '그때와 비교해 달라진 생각이 있나요?',
  '여전히 마음에 남아 있는 부분이 있나요?',
  '새롭게 발견한 점이 있나요?',
];

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
  const [selectedId, setSelectedId] = useState<string | null>(
    focusedRecordId || (records.length > 0 ? records[0].id : null)
  );
  const [mobileShowDetail, setMobileShowDetail] = useState(
    Boolean(focusedRecordId)
  );

  // Search & Type Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RecordTypeFilter>('all');

  // Freeform Composer with Auto-Draft & Optional Prompts
  const [newNoteDraft, setNewNoteDraft] = useState<string>(() => {
    try {
      return window.localStorage.getItem(FREEFORM_DRAFT_KEY) || '';
    } catch {
      return '';
    }
  });
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
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
  const [followUpPrompt, setFollowUpPrompt] = useState('');
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
      return (
        rec.userNote.toLowerCase().includes(q) ||
        Boolean(rec.actionMemo?.toLowerCase().includes(q)) ||
        Boolean(rec.selectedAction?.toLowerCase().includes(q)) ||
        Boolean(
          rec.selectedActions?.some(
            (a) =>
              a.actionText.toLowerCase().includes(q) ||
              a.cardName.toLowerCase().includes(q)
          )
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
        Boolean(
          rec.spreadCards?.some(
            (s) =>
              s.cardName.toLowerCase().includes(q) ||
              s.cardNameEn.toLowerCase().includes(q)
          )
        ) ||
        rec.reflectionQuestion.toLowerCase().includes(q) ||
        rec.date.includes(q)
      );
    });
  }, [records, searchQuery, typeFilter]);

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
    setFollowUpPrompt('');
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
    setFollowUpPrompt('');
    setFollowUpDraft('');
    setFollowUpFeedback(null);
  };

  const handleCreateFreeform = (e: FormEvent) => {
    e.preventDefault();
    const result = onAddFreeform(newNoteDraft, selectedPrompt || undefined);
    if (result.ok && result.record) {
      setNewNoteDraft('');
      setSelectedPrompt('');
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
      setStatusMessage({ type: 'success', text: '새 기록이 저장되었습니다.' });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || '기록을 저장하지 못했습니다.',
      });
    }
  };

  const handleExportJson = () => {
    if (records.length === 0) {
      setBackupFeedback({
        type: 'error',
        text: '내보낼 기록이 아직 없습니다.',
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
        text: `총 ${records.length}개의 기록을 JSON 파일로 내보냈습니다.`,
      });
    } catch {
      setBackupFeedback({
        type: 'error',
        text: '백업 파일을 생성하는 중 문제가 발생했습니다.',
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
        text: '내보낼 기록이 아직 없습니다.',
      });
      return;
    }
    try {
      const headers = [
        '날짜',
        '기록 유형',
        '카드명',
        '영문명',
        '방향',
        '성찰 질문',
        '선택한 시도',
        '시도 메모',
        '나의 생각',
        '다시 돌아본 기록',
      ];
      const rows = records.map((rec) => {
        const typeLabel =
          rec.cardId === 'freeform'
            ? '자유 기록'
            : rec.readingType === 'three'
            ? '카드 성찰(3장)'
            : '카드 성찰';
        const attemptsText =
          rec.selectedActions?.map((a) => a.actionText).join(' / ') ||
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
            ? '역방향'
            : '정방향';
        return [
          rec.date,
          typeLabel,
          rec.cardName,
          rec.cardNameEn,
          orientLabel,
          rec.reflectionQuestion,
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
        text: `총 ${records.length}개의 기록을 CSV 파일로 내보냈습니다.`,
      });
    } catch {
      setBackupFeedback({
        type: 'error',
        text: 'CSV 파일을 생성하는 중 문제가 발생했습니다.',
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
      const validation = validateBackupJson(text);
      if (!validation.ok || !validation.records) {
        setPendingRestore(null);
        setBackupFeedback({
          type: 'error',
          text:
            validation.error ||
            '올바르지 않은 백업 파일입니다. 기존 기록은 안전하게 유지됩니다.',
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
        text: '파일을 읽는 중 오류가 발생했습니다. 기존 기록은 변경되지 않았습니다.',
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
          ? `새 기록 ${result.addedCount}개를 추가했습니다 (중복 ID 제외, 총 ${result.totalCount}개).`
          : `기존 기록을 백업 파일의 ${result.totalCount}개 기록으로 복원했습니다.`;
      setPendingRestore(null);
      setBackupFeedback({ type: 'success', text: modeLabel });
    } else {
      setBackupFeedback({
        type: 'error',
        text: result.error || '복원에 실패했습니다.',
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
      setStatusMessage({ type: 'success', text: '기록이 수정되었습니다.' });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || '수정에 실패했습니다.',
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
      setFollowUpPrompt('');
      setIsAddingFollowUp(false);
      setFollowUpFeedback({
        type: 'success',
        text: '다시 돌아본 생각이 기록에 이어졌습니다.',
      });
    } else {
      setFollowUpFeedback({
        type: 'error',
        text: result.error || '생각을 저장하지 못했습니다.',
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
        text: result.error || '삭제에 실패했습니다.',
      });
    }
  };

  const backupPanel = showBackupPanel && (
    <div
      aria-label="기록 백업 및 복원"
      className="mb-8 bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 space-y-5 text-left"
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-lg font-medium text-[#34312D]">
            기록 백업 및 복원
          </h2>
          <span className="text-xs text-[#827B72] tabular-nums">
            현재 {records.length}개 · 기준일 {getLocalDateString()}
          </span>
        </div>
        <p className="text-xs leading-relaxed text-[#827B72]">
          현재 모든 기록은 사용 중인 브라우저(localStorage)에만 보관되며
          클라우드로 자동 동기화되지 않습니다. 기기 변경이나 브라우저 데이터
          삭제에 대비해 JSON 파일로 백업해 둘 수 있습니다.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleExportJson}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>JSON 백업</span>
        </button>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#E7E0D5]/45 text-sm text-[#34312D] font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
          <span>CSV 내보내기</span>
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#F7F3EA]/60 hover:bg-[#E7E0D5]/50 text-sm text-[#34312D] font-medium transition-colors whitespace-nowrap cursor-pointer"
        >
          <Upload className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
          <span>JSON 복원하기</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="백업 JSON 파일 선택"
        />
      </div>

      {pendingRestore && (
        <div
          role="region"
          aria-label="복원 방식 선택 및 확인"
          className="rounded-xl bg-[#F7F3EA] border border-[#E7E0D5] p-4 space-y-4"
        >
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#34312D]">
              백업 파일 확인: {pendingRestore.fileName}
            </p>
            <p className="text-xs text-[#827B72] tabular-nums">
              포함된 기록: {pendingRestore.records.length}개
              {pendingRestore.exportedAt
                ? ` · 백업 일시: ${pendingRestore.exportedAt.slice(0, 10)}`
                : ''}
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-xs font-medium text-[#34312D] mb-1">
              복원 방식을 선택해 주세요
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
                <strong>기존 기록과 합치기</strong> (고유 ID가 같은 기록은
                중복 저장하지 않습니다)
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
                <strong>기존 기록 대체하기</strong> (현재 브라우저의 기록을
                백업 파일 내용으로 바꿉니다)
              </span>
            </label>
          </fieldset>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setPendingRestore(null)}
              className="min-h-[40px] px-4 py-1.5 rounded-lg border border-[#E7E0D5] bg-[#FFFCF6] text-sm text-[#827B72] hover:text-[#34312D] cursor-pointer"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirmRestore}
              className="min-h-[40px] px-4 py-1.5 rounded-lg bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium cursor-pointer"
            >
              복원 실행
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
        aria-label="인사이트 노트"
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-4 sm:pt-7 pb-12 text-center"
      >
        <LucidaBrandMark variant="compact" className="mb-4 sm:mb-5" />
        {backupPanel}

        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl px-6 py-14 sm:py-16 space-y-5">
          <div className="w-12 h-12 rounded-full bg-[#F7F3EA] border border-[#E7E0D5] flex items-center justify-center mx-auto text-[#777B61]">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="font-serif text-2xl text-[#34312D]">인사이트 노트</h1>
            <p className="text-[15px] leading-relaxed text-[#827B72] max-w-xs mx-auto">
              마음에 남은 생각이 있다면 이곳에 천천히 모아보세요.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGoToToday}
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              지금, 나에게로 이동
            </button>
            <button
              type="button"
              onClick={() => setIsComposing(true)}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-[#34312D] text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
            >
              자유 기록 남기기
            </button>
            <button
              type="button"
              onClick={() => setShowBackupPanel((prev) => !prev)}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-[#827B72] hover:text-[#34312D] text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              {showBackupPanel ? '백업 닫기' : '백업 불러오기'}
            </button>
          </div>

          <aside
            aria-label="기록 예시"
            className="max-w-md mx-auto mt-4 rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 text-left space-y-1.5"
          >
            <p className="text-[11px] font-medium text-[#777B61]">
              기록 예시 · 한 문장만 남겨도 충분해요
            </p>
            <p className="text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85">
              “오늘 유난히 조급했던 이유가 결과보다 타인의 시선 때문이었다는 걸 알아차렸다. 내일은 내 속도를 먼저 챙겨보자.”
            </p>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="인사이트 노트"
      className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-4 sm:pt-6 pb-12"
    >
      <LucidaBrandMark variant="compact" className="mb-3 sm:mb-4" />
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E0D5] pb-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#34312D]">
            인사이트 노트
          </h1>
          <span className="text-sm text-[#827B72] tabular-nums">
            총 {records.length}개
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
            <span>{showBackupPanel ? '백업 닫기' : '백업 · 복원'}</span>
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
            <span>{isComposing ? '작성 닫기' : '자유 기록'}</span>
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
              자유 기록 작성
            </label>
            {newNoteDraft.trim().length > 0 && (
              <div className="flex items-center gap-2 text-xs text-[#827B72]">
                <span>자동 임시 저장됨</span>
                <button
                  type="button"
                  onClick={() => setNewNoteDraft('')}
                  className="underline underline-offset-2 hover:text-[#34312D] cursor-pointer"
                >
                  비우기
                </button>
              </div>
            )}
          </div>

          {/* Optional Prompt Selector */}
          <div className="space-y-2">
            <p className="text-xs text-[#827B72]">
              기록을 돕는 질문 (선택사항 — 누르면 기록의 질문으로 연결됩니다)
            </p>
            <div className="flex flex-wrap gap-2">
              {FREEFORM_PROMPTS.map((prompt) => {
                const isPicked = selectedPrompt === prompt;
                return (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() =>
                      setSelectedPrompt((prev) => (prev === prompt ? '' : prompt))
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
            placeholder={
              selectedPrompt || '짧은 한 문장이나 단어만 남겨도 충분합니다.'
            }
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
              닫기
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium cursor-pointer"
            >
              저장하기
            </button>
          </div>
        </form>
      )}

      {/* Search & Record Type Filter Bar */}
      {records.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            role="group"
            aria-label="기록 유형 필터"
            className="inline-flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5]"
          >
            {(
              [
                { id: 'all', label: '전체' },
                { id: 'card', label: '카드 성찰' },
                { id: 'freeform', label: '자유 기록' },
                { id: 'action', label: '남긴 시도' },
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
              placeholder="내용, 카드명, 날짜 검색"
              aria-label="인사이트 노트 검색"
              className="w-full min-h-[42px] pl-9 pr-9 py-2 rounded-xl bg-[#FFFCF6] border border-[#E7E0D5] text-sm text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="검색어 지우기"
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
            조건에 맞는 기록이 없습니다
          </p>
          <p className="text-sm text-[#827B72]">
            검색어를 바꾸거나 필터를 ‘전체’로 돌려 보세요.
          </p>
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
                const typeLabel =
                  record.cardId === 'freeform' ? '자유 기록' : '카드 성찰';
                const attemptCount =
                  record.selectedActions?.length ??
                  (record.selectedAction ? 1 : 0);
                const followUpCount = record.followUpNotes?.length ?? 0;
                const previewText =
                  record.userNote.trim() ||
                  record.actionMemo?.trim() ||
                  record.selectedActions?.map((a) => a.actionText).join(' · ') ||
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
                          {formatKoreanDate(record.date)} ·{' '}
                          {record.spreadCards && record.spreadCards.length > 1
                            ? `${typeLabel} (3장)`
                            : typeLabel}
                        </span>
                        <span className="tabular-nums">
                          {formatKoreanTime(record.createdAt)}
                        </span>
                      </div>
                      <p className="font-serif text-base font-medium text-[#34312D] mb-1.5">
                        {record.spreadCards && record.spreadCards.length > 1 ? (
                          <span>
                            {record.spreadCards.map((s) => s.cardName).join(' · ')}
                          </span>
                        ) : (
                          <>
                            {record.cardName}
                            {record.cardNameEn && (
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
                              ? `선택한 시도 ${attemptCount}개`
                              : null,
                            followUpCount > 0
                              ? `돌아본 기록 ${followUpCount}건`
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
          {selectedRecord && (
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
                    <span>목록으로</span>
                  </button>
                </div>

                {/* Detail Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E5DED1] pb-5">
                  <div className="flex items-start gap-4">
                    {(() => {
                      const matchedCard =
                        selectedRecord.cardId !== 'freeform'
                          ? getCardById(selectedRecord.cardId)
                          : undefined;
                      if (!matchedCard) return null;
                      return onOpenEncyclopedia ? (
                        <button
                          type="button"
                          onClick={() => onOpenEncyclopedia(matchedCard.id)}
                          aria-label={`${matchedCard.nameKo} 카드 도감에서 자세히 보기`}
                          className="w-14 sm:w-16 aspect-[896/1200] rounded-[10px] overflow-hidden border border-[#E5DED1] hover:border-[#777B61] bg-[#FFFCF6] shrink-0 transition-colors cursor-pointer"
                        >
                          <TarotCardArtwork
                            card={matchedCard}
                            size="thumbnail"
                            isReversed={selectedRecord.orientation === 'reversed'}
                          />
                        </button>
                      ) : (
                        <div className="w-14 sm:w-16 aspect-[896/1200] rounded-[10px] overflow-hidden border border-[#E5DED1] bg-[#FFFCF6] shrink-0">
                          <TarotCardArtwork
                            card={matchedCard}
                            size="thumbnail"
                            isReversed={selectedRecord.orientation === 'reversed'}
                          />
                        </div>
                      );
                    })()}
                    <div className="space-y-1">
                      <p className="text-xs text-[#827B72] tabular-nums">
                        {formatKoreanDate(selectedRecord.date)} ·{' '}
                        {formatKoreanTime(selectedRecord.createdAt)} ·{' '}
                        {selectedRecord.cardId === 'freeform'
                          ? '자유 기록'
                          : selectedRecord.orientation === 'reversed'
                          ? '카드 성찰 (역방향)'
                          : '카드 성찰'}
                      </p>
                      <h2 className="font-serif text-2xl font-medium text-[#34312D]">
                        {selectedRecord.cardName}
                        {selectedRecord.cardNameEn && (
                          <span className="ml-2 text-base font-normal text-[#827B72]">
                            ({selectedRecord.cardNameEn})
                          </span>
                        )}
                      </h2>
                      {selectedRecord.cardId !== 'freeform' &&
                        getCardById(selectedRecord.cardId) &&
                        onOpenEncyclopedia && (
                          <button
                            type="button"
                            onClick={() => onOpenEncyclopedia(selectedRecord.cardId)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#777B61] hover:text-[#34312D] underline underline-offset-4 cursor-pointer"
                          >
                            <span>카드 도감에서 자세히 보기</span>
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
                        aria-label="기록 수정"
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E7E0D5] text-sm text-[#34312D] hover:bg-[#F7F3EA] transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>수정</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmingDelete(true);
                          setStatusMessage(null);
                        }}
                        aria-label="기록 삭제"
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 rounded-lg border border-[#E7E0D5] text-sm text-[#827B72] hover:text-[#7A3B2E] hover:border-[#A65D4E]/40 hover:bg-[#A65D4E]/5 transition-colors whitespace-nowrap cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>삭제</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Preserved 3-Card Spread Snapshot if this reading used 3 cards */}
                {selectedRecord.spreadCards &&
                  selectedRecord.spreadCards.length > 1 && (
                    <div className="rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 space-y-3">
                      <p className="text-xs font-medium text-[#777B61]">
                        이 리딩에서 뽑은 카드 배열 ({selectedRecord.spreadCards.length}장)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {selectedRecord.spreadCards.map((snap, idx) => {
                          const snapCard = getCardById(snap.cardId);
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
                                  0{idx + 1}. {snap.positionLabel || `${idx + 1}번째`}
                                </p>
                                <p className="font-serif text-xs font-medium text-[#34312D] truncate">
                                  {snap.cardName}
                                </p>
                                <p className="text-[10px] text-[#827B72]">
                                  {snap.orientation === 'reversed' ? '역방향' : '정방향'}
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
                        return (
                          <div className="pt-2 border-t border-[#E5DED1] text-xs leading-relaxed text-[#34312D]/85 space-y-1.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-medium text-[#34312D]">
                                {activeSnap.positionLabel} · {activeSnapCard.nameKo} ({activeSnapCard.nameEn})
                              </p>
                              {onOpenEncyclopedia && (
                                <button
                                  type="button"
                                  onClick={() => onOpenEncyclopedia(activeSnapCard.id)}
                                  className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#777B61] hover:text-[#34312D] underline underline-offset-2 cursor-pointer"
                                >
                                  <span>도감 보기</span>
                                  <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
                                </button>
                              )}
                            </div>
                            <p>{activeSnapCard.meaningGuide}</p>
                            <p className="text-[#777B61]">
                              질문: {activeSnapCard.reflectionQuestion}
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
                  (() => {
                    const matchedCard = getCardById(selectedRecord.cardId);
                    if (!matchedCard) return null;
                    return (
                      <div className="rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-medium text-[#777B61]">
                            카드 해석
                          </p>
                          <p className="text-[11px] text-[#827B72]">
                            {matchedCard.keywords.join(' · ')}
                          </p>
                        </div>
                        <p className="font-serif text-[15px] leading-relaxed text-[#34312D]">
                          “{matchedCard.insight}”
                        </p>
                        <p className="text-xs sm:text-[13px] leading-relaxed text-[#34312D]/85">
                          {matchedCard.meaningGuide}
                        </p>
                      </div>
                    );
                  })()}

                {/* Overall Synthesis Message */}
                {selectedRecord.overallMessage && (
                  <div className="rounded-xl bg-[#F7F3EA]/55 border border-[#E5DED1] p-4 space-y-1.5">
                    <p className="text-xs font-medium text-[#777B61]">
                      종합 메시지
                    </p>
                    <p className="text-xs sm:text-[13.5px] leading-relaxed text-[#34312D]/85">
                      {selectedRecord.overallMessage}
                    </p>
                  </div>
                )}

                {/* Reflection Question Reference */}
                {selectedRecord.reflectionQuestion && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-[#777B61]">
                      성찰 질문
                    </p>
                    <p className="text-[15px] leading-relaxed text-[#34312D]/90">
                      {selectedRecord.reflectionQuestion}
                    </p>
                  </div>
                )}

                {/* Optional Selected Attempts (multi-select or legacy single) */}
                {((selectedRecord.selectedActions &&
                  selectedRecord.selectedActions.length > 0) ||
                  selectedRecord.selectedAction) && (
                  <div className="space-y-2 rounded-xl bg-[#F7F3EA]/70 border border-[#E5DED1] p-4">
                    <p className="text-xs font-medium text-[#777B61]">
                      마음에 남은 시도
                    </p>
                    {selectedRecord.selectedActions &&
                    selectedRecord.selectedActions.length > 0 ? (
                      <ul className="space-y-2" role="list">
                        {selectedRecord.selectedActions.map((item, idx) => (
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
                        ))}
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
                    aria-label="기록 삭제 확인"
                    className="rounded-xl bg-[#A65D4E]/10 border border-[#A65D4E]/25 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <p className="text-sm text-[#7A3B2E]">
                      이 기록을 삭제할까요? 삭제한 내용은 되돌릴 수 없습니다.
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(false)}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#FFFCF6] border border-[#E7E0D5] text-sm text-[#34312D] hover:bg-[#F7F3EA] whitespace-nowrap cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-[#A65D4E] hover:bg-[#8E4C3E] text-[#FFFCF6] text-sm font-medium whitespace-nowrap cursor-pointer"
                      >
                        삭제하기
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
                          시도에 남긴 짧은 메모 (선택사항)
                        </label>
                        <textarea
                          id="edit-action-memo"
                          rows={2}
                          value={editActionMemoDraft}
                          onChange={(e) => setEditActionMemoDraft(e.target.value)}
                          placeholder="짧은 생각이나 단어만 남겨도 괜찮습니다."
                          className="w-full rounded-xl bg-[#F7F3EA]/50 border border-[#E7E0D5] px-4 py-2.5 text-sm leading-relaxed text-[#34312D] focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label
                        htmlFor="edit-reflection-note"
                        className="block text-xs font-medium text-[#827B72]"
                      >
                        나의 생각
                      </label>
                      <textarea
                        id="edit-reflection-note"
                        rows={5}
                        value={editDraft}
                        onChange={(e) => setEditDraft(e.target.value)}
                        placeholder="지금 떠오르는 생각을 자유롭게 수정해 보세요."
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
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="min-h-[44px] px-5 py-2 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium whitespace-nowrap cursor-pointer"
                      >
                        수정 저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 border-t border-[#E7E0D5] pt-5">
                    {selectedRecord.actionMemo?.trim() && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-[#827B72]">
                          시도에 남긴 짧은 메모
                        </p>
                        <p className="text-[15px] leading-relaxed text-[#34312D]/90 whitespace-pre-wrap">
                          {selectedRecord.actionMemo}
                        </p>
                      </div>
                    )}

                    {selectedRecord.userNote.trim() ? (
                      <div className="space-y-1.5">
                        <p className="text-xs font-medium text-[#827B72]">
                          나의 생각
                        </p>
                        <p className="text-[15px] sm:text-base leading-[1.8] text-[#34312D] whitespace-pre-wrap">
                          {selectedRecord.userNote}
                        </p>
                      </div>
                    ) : (
                      !selectedRecord.actionMemo?.trim() && (
                        <p className="text-xs leading-relaxed text-[#827B72]">
                          별도의 긴 메모 없이 선택한 시도만 가볍게 남겨둔 기록입니다. 원할 때 ‘수정’을 눌러 생각을 덧붙일 수 있습니다.
                        </p>
                      )
                    )}
                  </div>
                )}

                {/* Later Reflection / Follow-up Notes Section */}
                <div
                  aria-label="시간이 지난 뒤 다시 돌아보기"
                  className="border-t border-[#E7E0D5] pt-5 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-[#777B61]">
                        시간이 지난 뒤 다시 돌아보기
                      </p>
                      <p className="text-xs text-[#827B72]">
                        그때와 지금의 생각을 가볍게 비교하거나 새롭게 떠오른 점을 덧붙여 보세요.
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
                      <span>{isAddingFollowUp ? '작성 닫기' : '돌아본 생각 남기기'}</span>
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
                                {formatKoreanDate(
                                  getLocalDateString(new Date(entry.createdAt))
                                )}{' '}
                                · {formatKoreanTime(entry.createdAt)}
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
                          질문 선택 (선택사항)
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {FOLLOW_UP_PROMPTS.map((promptText) => {
                            const active = followUpPrompt === promptText;
                            return (
                              <button
                                key={promptText}
                                type="button"
                                onClick={() =>
                                  setFollowUpPrompt((prev) =>
                                    prev === promptText ? '' : promptText
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
                          followUpPrompt ||
                          '지금 다시 돌아보며 떠오른 생각을 편하게 적어보세요. 짧은 단어 하나만 남겨도 괜찮습니다.'
                        }
                        aria-label="시간이 지난 뒤 다시 돌아본 생각 입력"
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
                          닫기
                        </button>
                        <button
                          type="submit"
                          className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-xs font-medium cursor-pointer"
                        >
                          이어서 남기기
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
