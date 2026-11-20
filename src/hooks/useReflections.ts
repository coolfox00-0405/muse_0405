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
    (note: string): { ok: boolean; error?: string; record?: ReflectionRecord } => {
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
        cardName: '자유 메모',
        cardNameEn: 'Personal Note',
        reflectionQuestion: '마음에 남은 생각이나 나에게 남기고 싶은 문장',
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

  return {
    records,
    storageError,
    addReflection,
    addFreeformReflection,
    updateReflection,
    deleteReflection,
  };
}
