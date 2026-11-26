import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FollowUpEntry,
  ReflectionRecord,
  SelectedAttemptItem,
  SpreadCardSnapshot,
  TarotCard,
} from '../types/reflection';
import { Language } from '../i18n/types';
import { UI_TRANSLATIONS } from '../i18n/ui';
import { getLocalizedCard } from '../i18n/cardHelpers';

const STORAGE_KEY = 'am_tarot_reflections_v1';

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatLocalizedDate(
  dateStr: string,
  language: Language = 'ko'
): string {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return dateStr;
  }
  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);

  if (language === 'en') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    });
  }

  if (language === 'ja') {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[dateObj.getDay()];
    return `${year}年${month}月${day}日 (${weekday})`;
  }

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[dateObj.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function formatLocalizedTime(
  isoString: string,
  language: Language = 'ko'
): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  const locale =
    language === 'en' ? 'en-US' : language === 'ja' ? 'ja-JP' : 'ko-KR';
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: language !== 'ja',
  });
}

export function formatKoreanDate(dateStr: string): string {
  return formatLocalizedDate(dateStr, 'ko');
}

export function formatKoreanTime(isoString: string): string {
  return formatLocalizedTime(isoString, 'ko');
}

function createRecordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function formatSelectedActionsSummary(
  items?: SelectedAttemptItem[]
): string | undefined {
  if (!items || items.length === 0) return undefined;
  return items.map((item) => item.actionText).join(' / ');
}

export interface ReadingSyncPayload {
  readingSessionId: string;
  card: TarotCard;
  orientation: 'upright' | 'reversed';
  spreadCards?: SpreadCardSnapshot[];
  overallMessage?: string;
  selectedActions: SelectedAttemptItem[];
  actionMemo?: string;
}

export function useReflections(language: Language = 'ko') {
  const [records, setRecords] = useState<ReflectionRecord[]>(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.sort(
        (a: ReflectionRecord, b: ReflectionRecord) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch {
      return [];
    }
  });

  const recordsRef = useRef<ReflectionRecord[]>(records);
  const [storageErrorCode, setStorageErrorCode] = useState<
    'persist' | 'restore' | null
  >(null);

  const msg = UI_TRANSLATIONS[language];
  const storageError =
    storageErrorCode === 'persist'
      ? msg.errors.storagePersist
      : storageErrorCode === 'restore'
      ? msg.errors.storageRestoreError
      : null;

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  const persistRecords = useCallback(
    (next: ReflectionRecord[]): boolean => {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        recordsRef.current = next;
        setRecords(next);
        setStorageErrorCode(null);
        return true;
      } catch {
        setStorageErrorCode('persist');
        return false;
      }
    },
    []
  );

  // Sync checked attempts & optional attempt memo with one reading record
  const syncReadingAttempts = useCallback(
    ({
      readingSessionId,
      card,
      orientation,
      spreadCards,
      overallMessage,
      selectedActions,
      actionMemo,
    }: ReadingSyncPayload): { ok: boolean; recordId?: string; error?: string } => {
      const errs = UI_TRANSLATIONS[language].errors;
      const prev = recordsRef.current;
      const cleanMemo = actionMemo?.trim() || undefined;
      const cleanOverall = overallMessage?.trim() || undefined;
      const summaryAction = formatSelectedActionsSummary(selectedActions);
      const nowIso = new Date().toISOString();
      const hasMultiSpread = Boolean(spreadCards && spreadCards.length > 1);

      const existingIndex = prev.findIndex(
        (r) => r.readingSessionId === readingSessionId
      );

      if (existingIndex === -1) {
        if (selectedActions.length === 0 && !cleanMemo) {
          return { ok: true };
        }

        const now = new Date();
        const newId = createRecordId();
        const locCard = getLocalizedCard(card, language, orientation);
        const newRecord: ReflectionRecord = {
          id: newId,
          readingSessionId,
          date: getLocalDateString(now),
          cardId: card.id,
          cardName: locCard.displayName,
          cardNameEn: card.nameEn,
          orientation,
          readingType: hasMultiSpread ? 'three' : 'single',
          spreadCards: hasMultiSpread ? spreadCards : undefined,
          overallMessage: cleanOverall,
          reflectionQuestion: locCard.reflectionQuestion,
          selectedAction: summaryAction,
          selectedActions: selectedActions.length > 0 ? selectedActions : undefined,
          actionMemo: cleanMemo,
          userNote: '',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
        };
        const next = [newRecord, ...prev];
        const ok = persistRecords(next);
        return ok
          ? { ok: true, recordId: newId }
          : { ok: false, error: errs.storageSaveGeneric };
      }

      const existing = prev[existingIndex];
      const hasMainNote = Boolean(existing.userNote.trim());
      const hasFollowUps = Boolean(
        existing.followUpNotes && existing.followUpNotes.length > 0
      );
      const preservedMemo =
        actionMemo !== undefined ? cleanMemo : existing.actionMemo;

      if (
        selectedActions.length === 0 &&
        !preservedMemo &&
        !hasMainNote &&
        !hasFollowUps
      ) {
        const next = prev.filter((_, idx) => idx !== existingIndex);
        const ok = persistRecords(next);
        return ok
          ? { ok: true }
          : { ok: false, error: errs.storageCleanupGeneric };
      }

      const updated: ReflectionRecord = {
        ...existing,
        overallMessage: cleanOverall ?? existing.overallMessage,
        selectedAction: summaryAction,
        selectedActions: selectedActions.length > 0 ? selectedActions : undefined,
        actionMemo: preservedMemo,
        updatedAt: nowIso,
      };
      const next = prev.map((item, idx) =>
        idx === existingIndex ? updated : item
      );
      const ok = persistRecords(next);
      return ok
        ? { ok: true, recordId: existing.id }
        : { ok: false, error: errs.storageSaveGeneric };
    },
    [language, persistRecords]
  );

  const addReflection = useCallback(
    (
      card: TarotCard,
      note: string,
      selectedAction?: string,
      orientation: 'upright' | 'reversed' = 'upright',
      spreadCards?: SpreadCardSnapshot[],
      options?: {
        readingSessionId?: string;
        overallMessage?: string;
        selectedActions?: SelectedAttemptItem[];
        actionMemo?: string;
      }
    ): { ok: boolean; error?: string; record?: ReflectionRecord } => {
      const errs = UI_TRANSLATIONS[language].errors;
      const trimmed = note.trim();
      const readingSessionId = options?.readingSessionId;
      const selectedActions = options?.selectedActions;
      const cleanMemo =
        options?.actionMemo !== undefined
          ? options.actionMemo.trim() || undefined
          : undefined;
      const cleanOverall = options?.overallMessage?.trim() || undefined;
      const hasAttempts = Boolean(
        (selectedActions && selectedActions.length > 0) || selectedAction
      );

      if (!trimmed && !cleanMemo && !hasAttempts) {
        return { ok: false, error: errs.storageEmptyInputOrAttempt };
      }

      const prev = recordsRef.current;
      const summaryAction =
        formatSelectedActionsSummary(selectedActions) || selectedAction || undefined;
      const hasMultiSpread = Boolean(spreadCards && spreadCards.length > 1);
      const now = new Date();
      const iso = now.toISOString();

      const existingIndex = readingSessionId
        ? prev.findIndex((r) => r.readingSessionId === readingSessionId)
        : -1;

      let savedRecord: ReflectionRecord;
      let next: ReflectionRecord[];

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const mergedNote = trimmed
          ? existing.userNote.trim()
            ? `${existing.userNote.trim()}\n\n${trimmed}`
            : trimmed
          : existing.userNote;
        const resolvedActions =
          selectedActions !== undefined
            ? selectedActions.length > 0
              ? selectedActions
              : undefined
            : existing.selectedActions;
        const resolvedActionSummary =
          selectedActions !== undefined
            ? formatSelectedActionsSummary(selectedActions)
            : summaryAction ?? existing.selectedAction;
        const resolvedMemo =
          options?.actionMemo !== undefined ? cleanMemo : existing.actionMemo;

        const updated: ReflectionRecord = {
          ...existing,
          overallMessage: cleanOverall ?? existing.overallMessage,
          selectedAction: resolvedActionSummary,
          selectedActions: resolvedActions,
          actionMemo: resolvedMemo,
          userNote: mergedNote,
          updatedAt: iso,
        };
        savedRecord = updated;
        next = prev.map((item, idx) =>
          idx === existingIndex ? updated : item
        );
      } else {
        const locCard = getLocalizedCard(card, language, orientation);
        const newRecord: ReflectionRecord = {
          id: createRecordId(),
          readingSessionId,
          date: getLocalDateString(now),
          cardId: card.id,
          cardName: locCard.displayName,
          cardNameEn: card.nameEn,
          orientation,
          readingType: hasMultiSpread ? 'three' : 'single',
          spreadCards: hasMultiSpread ? spreadCards : undefined,
          overallMessage: cleanOverall,
          reflectionQuestion: locCard.reflectionQuestion,
          selectedAction: summaryAction,
          selectedActions:
            selectedActions && selectedActions.length > 0
              ? selectedActions
              : undefined,
          actionMemo: cleanMemo,
          userNote: trimmed,
          createdAt: iso,
          updatedAt: iso,
        };
        savedRecord = newRecord;
        next = [newRecord, ...prev];
      }

      const ok = persistRecords(next);
      if (!ok) {
        return {
          ok: false,
          error: errs.storagePersist,
        };
      }
      return { ok: true, record: savedRecord };
    },
    [language, persistRecords]
  );

  const addFreeformReflection = useCallback(
    (
      note: string,
      customQuestion?: string
    ): { ok: boolean; error?: string; record?: ReflectionRecord } => {
      const ui = UI_TRANSLATIONS[language];
      const trimmed = note.trim();
      if (!trimmed) {
        return { ok: false, error: ui.errors.storageEmptyNote };
      }

      const now = new Date();
      const iso = now.toISOString();
      const newRecord: ReflectionRecord = {
        id: createRecordId(),
        date: getLocalDateString(now),
        cardId: 'freeform',
        cardName: ui.journal.freeformCardName,
        cardNameEn: 'Personal Note',
        reflectionQuestion:
          customQuestion?.trim() || ui.journal.freeformDefaultQuestion,
        userNote: trimmed,
        createdAt: iso,
        updatedAt: iso,
      };

      const ok = persistRecords([newRecord, ...recordsRef.current]);
      if (!ok) {
        return {
          ok: false,
          error: ui.errors.storagePersist,
        };
      }
      return { ok: true, record: newRecord };
    },
    [language, persistRecords]
  );

  const updateReflection = useCallback(
    (
      id: string,
      updatedNote: string,
      updatedActionMemo?: string
    ): { ok: boolean; error?: string } => {
      const errs = UI_TRANSLATIONS[language].errors;
      const prev = recordsRef.current;
      const trimmedNote = updatedNote.trim();
      const trimmedActionMemo =
        updatedActionMemo !== undefined ? updatedActionMemo.trim() : undefined;

      const target = prev.find((item) => item.id === id);
      if (!target) {
        return { ok: false, error: errs.storageEditNotFound };
      }

      const hasActions = Boolean(
        (target.selectedActions && target.selectedActions.length > 0) ||
          target.selectedAction
      );
      const effectiveMemo =
        trimmedActionMemo !== undefined
          ? trimmedActionMemo
          : target.actionMemo || '';
      if (!trimmedNote && !effectiveMemo && !hasActions) {
        return { ok: false, error: errs.storageEmptyUpdate };
      }

      const nowIso = new Date().toISOString();
      const next = prev.map((item) =>
        item.id === id
          ? {
              ...item,
              userNote: trimmedNote,
              actionMemo:
                trimmedActionMemo !== undefined
                  ? trimmedActionMemo || undefined
                  : item.actionMemo,
              updatedAt: nowIso,
            }
          : item
      );

      const ok = persistRecords(next);
      return ok
        ? { ok: true }
        : { ok: false, error: errs.storageUpdateError };
    },
    [language, persistRecords]
  );

  const addFollowUpNote = useCallback(
    (
      recordId: string,
      note: string,
      prompt?: string
    ): { ok: boolean; error?: string } => {
      const errs = UI_TRANSLATIONS[language].errors;
      const trimmed = note.trim();
      if (!trimmed) {
        return { ok: false, error: errs.storageEmptyFollowUp };
      }

      const prev = recordsRef.current;
      if (!prev.some((item) => item.id === recordId)) {
        return { ok: false, error: errs.storageFollowUpTargetMissing };
      }

      const nowIso = new Date().toISOString();
      const newEntry: FollowUpEntry = {
        id: createRecordId(),
        createdAt: nowIso,
        prompt: prompt?.trim() || undefined,
        note: trimmed,
      };

      const next = prev.map((item) =>
        item.id === recordId
          ? {
              ...item,
              followUpNotes: [...(item.followUpNotes ?? []), newEntry],
              updatedAt: nowIso,
            }
          : item
      );

      const ok = persistRecords(next);
      return ok
        ? { ok: true }
        : { ok: false, error: errs.storageFollowUpSaveError };
    },
    [language, persistRecords]
  );

  const deleteReflection = useCallback(
    (id: string): { ok: boolean; error?: string } => {
      const errs = UI_TRANSLATIONS[language].errors;
      const next = recordsRef.current.filter((item) => item.id !== id);
      const ok = persistRecords(next);
      return ok
        ? { ok: true }
        : { ok: false, error: errs.storageDeleteError };
    },
    [language, persistRecords]
  );

  const importReflections = useCallback(
    (
      incoming: ReflectionRecord[],
      mode: 'merge' | 'replace'
    ): { ok: boolean; addedCount: number; totalCount: number; error?: string } => {
      const errs = UI_TRANSLATIONS[language].errors;
      const prev = recordsRef.current;
      try {
        let next: ReflectionRecord[];
        let addedCount = 0;

        if (mode === 'replace') {
          const uniqueMap = new Map<string, ReflectionRecord>();
          for (const item of incoming) {
            if (!uniqueMap.has(item.id)) {
              uniqueMap.set(item.id, item);
            }
          }
          next = Array.from(uniqueMap.values());
          addedCount = next.length;
        } else {
          const existingIds = new Set(prev.map((r) => r.id));
          const toAdd: ReflectionRecord[] = [];
          for (const item of incoming) {
            if (!existingIds.has(item.id)) {
              existingIds.add(item.id);
              toAdd.push(item);
            }
          }
          next = [...toAdd, ...prev];
          addedCount = toAdd.length;
        }

        next.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        recordsRef.current = next;
        setRecords(next);
        setStorageErrorCode(null);
        return { ok: true, addedCount, totalCount: next.length };
      } catch {
        setStorageErrorCode('restore');
        return {
          ok: false,
          addedCount: 0,
          totalCount: prev.length,
          error: errs.storageRestoreError,
        };
      }
    },
    [language]
  );

  return {
    records,
    storageError,
    syncReadingAttempts,
    addReflection,
    addFreeformReflection,
    updateReflection,
    addFollowUpNote,
    deleteReflection,
    importReflections,
  };
}

export interface BackupValidationResult {
  ok: boolean;
  records?: ReflectionRecord[];
  exportedAt?: string;
  error?: string;
}

export function createBackupPayload(records: ReflectionRecord[]): string {
  const payload = {
    app: 'LUCIDA',
    version: 1,
    exportedAt: new Date().toISOString(),
    count: records.length,
    records,
  };
  return JSON.stringify(payload, null, 2);
}

export function validateBackupJson(
  rawText: string,
  language: Language = 'ko'
): BackupValidationResult {
  const errs = UI_TRANSLATIONS[language].errors;
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      error: errs.invalidJsonFile,
    };
  }

  let candidateArray: unknown = null;
  let exportedAt: string | undefined;

  if (Array.isArray(parsed)) {
    candidateArray = parsed;
  } else if (
    parsed &&
    typeof parsed === 'object' &&
    'records' in parsed &&
    Array.isArray((parsed as { records: unknown }).records)
  ) {
    candidateArray = (parsed as { records: unknown[] }).records;
    const maybeDate = (parsed as { exportedAt?: unknown }).exportedAt;
    if (typeof maybeDate === 'string') {
      exportedAt = maybeDate;
    }
  }

  if (!Array.isArray(candidateArray)) {
    return {
      ok: false,
      error: errs.invalidBackupStructure,
    };
  }

  const validRecords: ReflectionRecord[] = [];
  for (const item of candidateArray) {
    if (!item || typeof item !== 'object') {
      return {
        ok: false,
        error: errs.corruptedBackupEntry,
      };
    }
    const r = item as Record<string, unknown>;
    if (
      typeof r.id !== 'string' ||
      !r.id.trim() ||
      typeof r.date !== 'string' ||
      typeof r.cardName !== 'string' ||
      typeof r.userNote !== 'string' ||
      typeof r.createdAt !== 'string'
    ) {
      return {
        ok: false,
        error: errs.missingRequiredBackupFields,
      };
    }

    const rawSpread = Array.isArray(r.spreadCards)
      ? (r.spreadCards as unknown[])
          .filter(
            (s): s is Record<string, unknown> =>
              Boolean(s) &&
              typeof s === 'object' &&
              typeof (s as Record<string, unknown>).cardId === 'string' &&
              typeof (s as Record<string, unknown>).cardName === 'string'
          )
          .map((s) => ({
            cardId: s.cardId as string,
            cardName: s.cardName as string,
            cardNameEn:
              typeof s.cardNameEn === 'string' ? s.cardNameEn : '',
            orientation: (s.orientation === 'reversed'
              ? 'reversed'
              : 'upright') as 'upright' | 'reversed',
            positionLabel:
              typeof s.positionLabel === 'string'
                ? s.positionLabel
                : undefined,
          }))
      : undefined;

    const rawSelectedActions = Array.isArray(r.selectedActions)
      ? (r.selectedActions as unknown[])
          .filter(
            (a): a is Record<string, unknown> =>
              Boolean(a) &&
              typeof a === 'object' &&
              typeof (a as Record<string, unknown>).cardId === 'string' &&
              typeof (a as Record<string, unknown>).actionText === 'string'
          )
          .map((a) => ({
            attemptId:
              typeof a.attemptId === 'string' ? a.attemptId : undefined,
            categoryLabel:
              typeof a.categoryLabel === 'string'
                ? a.categoryLabel
                : undefined,
            cardId: a.cardId as string,
            cardName: typeof a.cardName === 'string' ? a.cardName : '',
            actionText: a.actionText as string,
            positionLabel:
              typeof a.positionLabel === 'string'
                ? a.positionLabel
                : undefined,
          }))
      : undefined;

    const rawFollowUps = Array.isArray(r.followUpNotes)
      ? (r.followUpNotes as unknown[])
          .filter(
            (f): f is Record<string, unknown> =>
              Boolean(f) &&
              typeof f === 'object' &&
              typeof (f as Record<string, unknown>).id === 'string' &&
              typeof (f as Record<string, unknown>).note === 'string' &&
              typeof (f as Record<string, unknown>).createdAt === 'string'
          )
          .map((f) => ({
            id: f.id as string,
            createdAt: f.createdAt as string,
            prompt: typeof f.prompt === 'string' ? f.prompt : undefined,
            note: f.note as string,
          }))
      : undefined;

    validRecords.push({
      id: r.id,
      readingSessionId:
        typeof r.readingSessionId === 'string' ? r.readingSessionId : undefined,
      date: r.date,
      cardId: typeof r.cardId === 'string' ? r.cardId : 'unknown',
      cardName: r.cardName,
      cardNameEn: typeof r.cardNameEn === 'string' ? r.cardNameEn : '',
      orientation:
        r.orientation === 'reversed' ? 'reversed' : 'upright',
      readingType:
        r.readingType === 'three' || (rawSpread && rawSpread.length > 1)
          ? 'three'
          : 'single',
      spreadCards: rawSpread && rawSpread.length > 1 ? rawSpread : undefined,
      overallMessage:
        typeof r.overallMessage === 'string' ? r.overallMessage : undefined,
      reflectionQuestion:
        typeof r.reflectionQuestion === 'string' ? r.reflectionQuestion : '',
      selectedAction:
        typeof r.selectedAction === 'string' ? r.selectedAction : undefined,
      selectedActions:
        rawSelectedActions && rawSelectedActions.length > 0
          ? rawSelectedActions
          : undefined,
      actionMemo: typeof r.actionMemo === 'string' ? r.actionMemo : undefined,
      userNote: r.userNote,
      followUpNotes:
        rawFollowUps && rawFollowUps.length > 0 ? rawFollowUps : undefined,
      createdAt: r.createdAt,
      updatedAt:
        typeof r.updatedAt === 'string' ? r.updatedAt : r.createdAt,
    });
  }

  return {
    ok: true,
    records: validRecords,
    exportedAt,
  };
}
