import { useState, useEffect, useCallback } from 'react';
import { ReflectionRecord, TarotCard } from '../types/reflection';

const STORAGE_KEY = 'am_tarot_reflections_v1';

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatKoreanDate(dateStr: string): string {
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return dateStr;
  }
  const [year, month, day] = parts;
  const dateObj = new Date(year, month - 1, day);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[dateObj.getDay()];
  return `${year}년 ${month}월 ${day}일 (${weekday})`;
}

export function formatKoreanTime(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function createRecordId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `rec_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useReflections() {
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

  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      setStorageError(null);
    } catch {
      setStorageError(
        '브라우저 저장 공간에 접근할 수 없어 기록을 저장하지 못했습니다.'
      );
    }
  }, [records]);

  const addReflection = useCallback(
    (
      card: TarotCard,
      note: string,
      selectedAction?: string
    ): { ok: boolean; error?: string; record?: ReflectionRecord } => {
      const trimmed = note.trim();
      if (!trimmed) {
        return { ok: false, error: '저장할 내용을 먼저 입력해 주세요.' };
      }

      const now = new Date();
      const iso = now.toISOString();
      const newRecord: ReflectionRecord = {
        id: createRecordId(),
        date: getLocalDateString(now),
        cardId: card.id,
        cardName: card.nameKo,
        cardNameEn: card.nameEn,
        orientation: 'upright',
        reflectionQuestion: card.reflectionQuestion,
        selectedAction: selectedAction || undefined,
        userNote: trimmed,
        createdAt: iso,
        updatedAt: iso,
      };

      try {
        const next = [newRecord, ...records];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
        setStorageError(null);
        return { ok: true, record: newRecord };
      } catch {
        const message =
          '기록을 저장하는 중 문제가 발생했습니다. 브라우저 저장 설정을 확인해 주세요.';
        setStorageError(message);
        return { ok: false, error: message };
      }
    },
    [records]
  );

  const addFreeformReflection = useCallback(
    (
      note: string,
      customQuestion?: string
    ): { ok: boolean; error?: string; record?: ReflectionRecord } => {
      const trimmed = note.trim();
      if (!trimmed) {
        return { ok: false, error: '저장할 내용을 먼저 입력해 주세요.' };
      }

      const now = new Date();
      const iso = now.toISOString();
      const newRecord: ReflectionRecord = {
        id: createRecordId(),
        date: getLocalDateString(now),
        cardId: 'freeform',
        cardName: '자유 기록',
        cardNameEn: 'Personal Note',
        reflectionQuestion:
          customQuestion?.trim() ||
          '마음에 남은 생각이나 나에게 남기고 싶은 문장',
        userNote: trimmed,
        createdAt: iso,
        updatedAt: iso,
      };

      try {
        const next = [newRecord, ...records];
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
        setStorageError(null);
        return { ok: true, record: newRecord };
      } catch {
        const message =
          '기록을 저장하는 중 문제가 발생했습니다. 브라우저 저장 설정을 확인해 주세요.';
        setStorageError(message);
        return { ok: false, error: message };
      }
    },
    [records]
  );

  const updateReflection = useCallback(
    (id: string, updatedNote: string): { ok: boolean; error?: string } => {
      const trimmed = updatedNote.trim();
      if (!trimmed) {
        return { ok: false, error: '내용을 비워둘 수 없습니다.' };
      }

      const nowIso = new Date().toISOString();
      const next = records.map((item) =>
        item.id === id
          ? { ...item, userNote: trimmed, updatedAt: nowIso }
          : item
      );

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
        setStorageError(null);
        return { ok: true };
      } catch {
        const message = '기록을 수정하는 중 문제가 발생했습니다.';
        setStorageError(message);
        return { ok: false, error: message };
      }
    },
    [records]
  );

  const deleteReflection = useCallback(
    (id: string): { ok: boolean; error?: string } => {
      const next = records.filter((item) => item.id !== id);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
        setStorageError(null);
        return { ok: true };
      } catch {
        const message = '기록을 삭제하는 중 문제가 발생했습니다.';
        setStorageError(message);
        return { ok: false, error: message };
      }
    },
    [records]
  );

  const importReflections = useCallback(
    (
      incoming: ReflectionRecord[],
      mode: 'merge' | 'replace'
    ): { ok: boolean; addedCount: number; totalCount: number; error?: string } => {
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
          const existingIds = new Set(records.map((r) => r.id));
          const toAdd: ReflectionRecord[] = [];
          for (const item of incoming) {
            if (!existingIds.has(item.id)) {
              existingIds.add(item.id);
              toAdd.push(item);
            }
          }
          next = [...toAdd, ...records];
          addedCount = toAdd.length;
        }

        next.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setRecords(next);
        setStorageError(null);
        return { ok: true, addedCount, totalCount: next.length };
      } catch {
        const message = '백업 데이터를 복원하는 중 저장 오류가 발생했습니다.';
        setStorageError(message);
        return { ok: false, addedCount: 0, totalCount: records.length, error: message };
      }
    },
    [records]
  );

  return {
    records,
    storageError,
    addReflection,
    addFreeformReflection,
    updateReflection,
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

export function validateBackupJson(rawText: string): BackupValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return {
      ok: false,
      error: '올바른 JSON 형식의 파일이 아닙니다. 기존 기록은 안전하게 유지됩니다.',
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
      error: 'LUCIDA 백업 파일 구조와 일치하지 않습니다. 기존 기록은 변경되지 않았습니다.',
    };
  }

  const validRecords: ReflectionRecord[] = [];
  for (const item of candidateArray) {
    if (!item || typeof item !== 'object') {
      return {
        ok: false,
        error: '백업 파일 안에 손상된 기록 항목이 포함되어 있어 복원을 중단했습니다.',
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
        error: '필수 항목(id, date, cardName, userNote, createdAt)이 누락된 기록이 있어 복원을 중단했습니다.',
      };
    }

    validRecords.push({
      id: r.id,
      date: r.date,
      cardId: typeof r.cardId === 'string' ? r.cardId : 'unknown',
      cardName: r.cardName,
      cardNameEn: typeof r.cardNameEn === 'string' ? r.cardNameEn : '',
      orientation:
        r.orientation === 'reversed' ? 'reversed' : 'upright',
      reflectionQuestion:
        typeof r.reflectionQuestion === 'string' ? r.reflectionQuestion : '',
      selectedAction:
        typeof r.selectedAction === 'string' ? r.selectedAction : undefined,
      userNote: r.userNote,
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
