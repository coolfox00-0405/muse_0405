import { useState, useEffect, FormEvent } from 'react';
import {
  ChevronLeft,
  Pencil,
  Trash2,
  Check,
  AlertCircle,
  BookOpen,
  Plus,
} from 'lucide-react';
import { ReflectionRecord } from '../types/reflection';
import { formatKoreanDate, formatKoreanTime } from '../hooks/useReflections';

interface JournalViewProps {
  records: ReflectionRecord[];
  onAddFreeform: (note: string) => { ok: boolean; error?: string; record?: ReflectionRecord };
  onUpdate: (id: string, note: string) => { ok: boolean; error?: string };
  onDelete: (id: string) => { ok: boolean; error?: string };
  onGoToToday: () => void;
}

export function JournalView({
  records,
  onAddFreeform,
  onUpdate,
  onDelete,
  onGoToToday,
}: JournalViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    records.length > 0 ? records[0].id : null
  );
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  const [isComposing, setIsComposing] = useState(false);
  const [newNoteDraft, setNewNoteDraft] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const selectedRecord =
    records.find((r) => r.id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    if (records.length === 0) {
      setSelectedId(null);
      setMobileShowDetail(false);
    } else if (!records.some((r) => r.id === selectedId)) {
      setSelectedId(records[0].id);
    }
  }, [records, selectedId]);

  const handleSelectRecord = (record: ReflectionRecord) => {
    setSelectedId(record.id);
    setMobileShowDetail(true);
    setIsComposing(false);
    setIsEditing(false);
    setConfirmingDelete(false);
    setStatusMessage(null);
  };

  const handleCreateFreeform = (e: FormEvent) => {
    e.preventDefault();
    const result = onAddFreeform(newNoteDraft);
    if (result.ok && result.record) {
      setNewNoteDraft('');
      setIsComposing(false);
      setSelectedId(result.record.id);
      setMobileShowDetail(true);
      setStatusMessage({ type: 'success', text: '새 메모가 저장되었습니다.' });
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || '메모를 저장하지 못했습니다.',
      });
    }
  };

  const handleStartEdit = () => {
    if (!selectedRecord) return;
    setEditDraft(selectedRecord.userNote);
    setIsEditing(true);
    setConfirmingDelete(false);
    setStatusMessage(null);
  };

  const handleSaveEdit = () => {
    if (!selectedRecord) return;
    const result = onUpdate(selectedRecord.id, editDraft);
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

  if (records.length === 0 && !isComposing) {
    return (
      <section
        aria-label="인사이트 노트"
        className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-12 text-center"
      >
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
              자유 메모 남기기
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-label="인사이트 노트"
      className="w-full max-w-5xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-12"
    >
      <header className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E0D5] pb-4">
        <div className="flex items-baseline gap-3">
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#34312D]">
            인사이트 노트
          </h1>
          <span className="text-sm text-[#827B72] tabular-nums">
            총 {records.length}개
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsComposing((prev) => !prev);
            setStatusMessage(null);
          }}
          className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-[#E7E0D5] bg-[#FFFCF6] hover:bg-[#E7E0D5]/45 text-sm text-[#34312D] transition-colors whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
          <span>{isComposing ? '작성 닫기' : '새 메모'}</span>
        </button>
      </header>

      {/* Optional Freeform Composer */}
      {isComposing && (
        <form
          onSubmit={handleCreateFreeform}
          className="mb-8 bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 space-y-4"
        >
          <label
            htmlFor="new-freeform-note"
            className="block text-sm font-medium text-[#34312D]"
          >
            자유 메모 작성
          </label>
          <textarea
            id="new-freeform-note"
            rows={4}
            value={newNoteDraft}
            onChange={(e) => setNewNoteDraft(e.target.value)}
            placeholder="짧은 한 문장만 남겨도 충분합니다."
            className="w-full rounded-xl bg-[#F7F3EA]/50 border border-[#E7E0D5] px-4 py-3 text-[15px] leading-relaxed text-[#34312D] placeholder:text-[#827B72]/75 focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsComposing(false);
                setNewNoteDraft('');
              }}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E7E0D5] text-sm text-[#827B72] hover:text-[#34312D] cursor-pointer"
            >
              취소
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Record List */}
        <div
          className={`lg:col-span-5 space-y-3 ${
            mobileShowDetail ? 'hidden lg:block' : 'block'
          }`}
        >
          <ul className="space-y-3" role="list">
            {records.map((record) => {
              const isSelected = selectedRecord?.id === record.id;
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
                        {formatKoreanDate(record.date)}
                      </span>
                      <span className="tabular-nums">
                        {formatKoreanTime(record.createdAt)}
                      </span>
                    </div>
                    <p className="font-serif text-base font-medium text-[#34312D] mb-1.5">
                      {record.cardName}
                      <span className="ml-1.5 text-xs font-normal text-[#827B72]">
                        {record.cardNameEn}
                      </span>
                    </p>
                    <p className="text-sm leading-relaxed text-[#34312D]/80 line-clamp-2">
                      {record.userNote}
                    </p>
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
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#E7E0D5] pb-5">
                <div className="space-y-1">
                  <p className="text-xs text-[#827B72] tabular-nums">
                    {formatKoreanDate(selectedRecord.date)} ·{' '}
                    {formatKoreanTime(selectedRecord.createdAt)}
                  </p>
                  <h2 className="font-serif text-2xl font-medium text-[#34312D]">
                    {selectedRecord.cardName}
                    <span className="ml-2 text-base font-normal text-[#827B72]">
                      ({selectedRecord.cardNameEn})
                    </span>
                  </h2>
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

              {/* Reflection Question Reference */}
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-[#777B61]">성찰 질문</p>
                <p className="text-[15px] leading-relaxed text-[#34312D]/90">
                  {selectedRecord.reflectionQuestion}
                </p>
              </div>

              {/* Optional Selected Action */}
              {selectedRecord.selectedAction && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-[#827B72]">
                    선택한 작은 시도
                  </p>
                  <p className="text-sm leading-relaxed text-[#34312D]/85">
                    {selectedRecord.selectedAction}
                  </p>
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

              {/* Note Content or Edit Form */}
              {isEditing ? (
                <div className="space-y-4">
                  <label
                    htmlFor="edit-reflection-note"
                    className="block text-xs font-medium text-[#827B72]"
                  >
                    기록 수정
                  </label>
                  <textarea
                    id="edit-reflection-note"
                    rows={6}
                    value={editDraft}
                    onChange={(e) => setEditDraft(e.target.value)}
                    className="w-full rounded-xl bg-[#F7F3EA]/50 border border-[#E7E0D5] px-4 py-3.5 text-[15px] leading-relaxed text-[#34312D] focus:outline-none focus:border-[#777B61] focus:ring-2 focus:ring-[#777B61]/15 resize-y"
                  />
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
                <div className="space-y-2 border-t border-[#E7E0D5] pt-5">
                  <p className="text-xs font-medium text-[#827B72]">
                    나의 생각
                  </p>
                  <p className="text-[15px] sm:text-base leading-[1.8] text-[#34312D] whitespace-pre-wrap">
                    {selectedRecord.userNote}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
