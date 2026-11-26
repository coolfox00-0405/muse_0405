import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  NotificationPermissionState,
  ReminderSettings,
  WeekdayIndex,
} from '../types/reminder';
import {
  REMINDER_MESSAGES,
  getLocalizedReminderText,
  getReminderMessageById,
  pickNextReminderMessage,
} from '../data/reminderMessages';
import { Language } from '../i18n/types';

export const REMINDER_STORAGE_KEY = 'lucida_reminder_settings_v1';

export const ORDERED_WEEKDAYS: WeekdayIndex[] = [1, 2, 3, 4, 5, 6, 0];

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return window.Notification.permission;
}

function createDefaultSettings(): ReminderSettings {
  return {
    version: 1,
    enabled: false,
    hour: 21,
    minute: 0,
    repeatMode: 'daily',
    daysOfWeek: [...ORDERED_WEEKDAYS],
    skippedDate: null,
    messageTheme: 'calm_default',
    lastShownMessageId: REMINDER_MESSAGES[0]?.id ?? null,
    recentMessageIds: REMINDER_MESSAGES[0] ? [REMINDER_MESSAGES[0].id] : [],
    lastTriggeredSlot: null,
    updatedAt: new Date().toISOString(),
    customMessage: null,
  };
}

function normalizeDays(raw: unknown): WeekdayIndex[] {
  if (!Array.isArray(raw)) return [...ORDERED_WEEKDAYS];
  const validSet = new Set<WeekdayIndex>();
  for (const item of raw) {
    if (
      typeof item === 'number' &&
      Number.isInteger(item) &&
      item >= 0 &&
      item <= 6
    ) {
      validSet.add(item as WeekdayIndex);
    }
  }
  if (validSet.size === 0) return [...ORDERED_WEEKDAYS];
  return ORDERED_WEEKDAYS.filter((d) => validSet.has(d));
}

function loadSettingsFromStorage(): ReminderSettings {
  const fallback = createDefaultSettings();
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(REMINDER_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<ReminderSettings> | null;
    if (!parsed || typeof parsed !== 'object') return fallback;

    const hour =
      typeof parsed.hour === 'number' &&
      Number.isInteger(parsed.hour) &&
      parsed.hour >= 0 &&
      parsed.hour <= 23
        ? parsed.hour
        : fallback.hour;

    const minute =
      typeof parsed.minute === 'number' &&
      Number.isInteger(parsed.minute) &&
      parsed.minute >= 0 &&
      parsed.minute <= 59
        ? parsed.minute
        : fallback.minute;

    const repeatMode =
      parsed.repeatMode === 'weekly' || parsed.repeatMode === 'daily'
        ? parsed.repeatMode
        : fallback.repeatMode;

    const normalizedDays = normalizeDays(parsed.daysOfWeek);
    const resolvedRepeatMode =
      repeatMode === 'daily' || normalizedDays.length === 7 ? 'daily' : 'weekly';

    return {
      version: 1,
      enabled: Boolean(parsed.enabled),
      hour,
      minute,
      repeatMode: resolvedRepeatMode,
      daysOfWeek:
        resolvedRepeatMode === 'daily' ? [...ORDERED_WEEKDAYS] : normalizedDays,
      skippedDate:
        typeof parsed.skippedDate === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(parsed.skippedDate)
          ? parsed.skippedDate
          : null,
      messageTheme: 'calm_default',
      lastShownMessageId:
        typeof parsed.lastShownMessageId === 'string'
          ? parsed.lastShownMessageId
          : fallback.lastShownMessageId,
      recentMessageIds: Array.isArray(parsed.recentMessageIds)
        ? parsed.recentMessageIds.filter((id): id is string => typeof id === 'string')
        : fallback.recentMessageIds,
      lastTriggeredSlot:
        typeof parsed.lastTriggeredSlot === 'string'
          ? parsed.lastTriggeredSlot
          : null,
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : fallback.updatedAt,
      customMessage:
        typeof parsed.customMessage === 'string' ? parsed.customMessage : null,
    };
  } catch {
    return fallback;
  }
}

export function isDayScheduled(
  settings: ReminderSettings,
  weekday: WeekdayIndex
): boolean {
  if (settings.repeatMode === 'daily') return true;
  return settings.daysOfWeek.includes(weekday);
}

export function findNextScheduledWeekday(
  settings: ReminderSettings,
  fromDate: Date = new Date(),
  skipToday: boolean = false
): { dayOffset: number; weekday: WeekdayIndex } {
  const startOffset = skipToday ? 1 : 0;
  for (let offset = startOffset; offset <= 7; offset++) {
    const candidate = new Date(fromDate);
    candidate.setDate(fromDate.getDate() + offset);
    const wd = candidate.getDay() as WeekdayIndex;
    if (isDayScheduled(settings, wd)) {
      if (offset === 0) {
        const nowMinutes = fromDate.getHours() * 60 + fromDate.getMinutes();
        const targetMinutes = settings.hour * 60 + settings.minute;
        if (targetMinutes <= nowMinutes) {
          continue;
        }
      }
      return { dayOffset: offset, weekday: wd };
    }
  }
  return {
    dayOffset: 1,
    weekday: ((fromDate.getDay() + 1) % 7) as WeekdayIndex,
  };
}

interface UseReminderSettingsOptions {
  language: Language;
  onOpenToday?: () => void;
}

export function useReminderSettings({
  language,
  onOpenToday,
}: UseReminderSettingsOptions) {
  const [settings, setSettings] = useState<ReminderSettings>(() =>
    loadSettingsFromStorage()
  );
  const [permission, setPermission] = useState<NotificationPermissionState>(() =>
    getCurrentNotificationPermission()
  );
  const [todayKey, setTodayKey] = useState<string>(() => getLocalDateKey());
  const [previewMessageId, setPreviewMessageId] = useState<string>(
    () => loadSettingsFromStorage().lastShownMessageId ?? REMINDER_MESSAGES[0].id
  );
  const [minDayWarning, setMinDayWarning] = useState(false);

  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const languageRef = useRef(language);
  languageRef.current = language;

  const onOpenTodayRef = useRef(onOpenToday);
  onOpenTodayRef.current = onOpenToday;

  const updateSettings = useCallback(
    (updater: (prev: ReminderSettings) => ReminderSettings) => {
      setSettings((prev) => {
        const next = {
          ...updater(prev),
          updatedAt: new Date().toISOString(),
        };
        try {
          window.localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(next));
        } catch {
          // Ignore storage quota errors gracefully
        }
        return next;
      });
    },
    []
  );

  // Refresh passive permission state & local date key when tab gains focus
  useEffect(() => {
    const syncEnvironment = () => {
      setPermission(getCurrentNotificationPermission());
      setTodayKey(getLocalDateKey());
    };

    window.addEventListener('focus', syncEnvironment);
    document.addEventListener('visibilitychange', syncEnvironment);
    return () => {
      window.removeEventListener('focus', syncEnvironment);
      document.removeEventListener('visibilitychange', syncEnvironment);
    };
  }, []);

  const isSkippedToday = settings.skippedDate === todayKey;

  const previewMessage = useMemo(() => {
    const msg = getReminderMessageById(previewMessageId, settings.messageTheme);
    return {
      id: msg.id,
      text: getLocalizedReminderText(msg, language),
    };
  }, [previewMessageId, settings.messageTheme, language]);

  const deliverSystemNotification = useCallback(
    async (bodyText: string): Promise<'sent' | 'denied' | 'unsupported' | 'blocked'> => {
      const currentPerm = getCurrentNotificationPermission();
      setPermission(currentPerm);

      if (currentPerm === 'unsupported') return 'unsupported';
      if (currentPerm === 'denied') return 'denied';
      if (currentPerm !== 'granted') return 'blocked';

      const options: NotificationOptions = {
        body: bodyText,
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'lucida-reflection-reminder',
        data: { url: '/?tab=today&source=reminder' },
      };

      try {
        if ('serviceWorker' in navigator) {
          const registration = await Promise.race([
            navigator.serviceWorker.getRegistration(),
            new Promise<undefined>((resolve) =>
              window.setTimeout(() => resolve(undefined), 600)
            ),
          ]);
          if (registration && typeof registration.showNotification === 'function') {
            await registration.showNotification('LUCIDA', options);
            return 'sent';
          }
        }
      } catch {
        // Fall through to window.Notification
      }

      try {
        const notification = new window.Notification('LUCIDA', options);
        notification.onclick = () => {
          try {
            window.focus();
          } catch {
            // Ignore focus restrictions
          }
          onOpenTodayRef.current?.();
          notification.close();
        };
        return 'sent';
      } catch {
        return 'blocked';
      }
    },
    []
  );

  // Active-browser scheduler: delivers scheduled reminders while LUCIDA is open
  useEffect(() => {
    const checkSchedule = () => {
      const now = new Date();
      const currentTodayKey = getLocalDateKey(now);
      setTodayKey(currentTodayKey);

      const current = settingsRef.current;
      if (!current.enabled) return;
      if (getCurrentNotificationPermission() !== 'granted') return;
      if (current.skippedDate === currentTodayKey) return;

      const weekday = now.getDay() as WeekdayIndex;
      if (!isDayScheduled(current, weekday)) return;

      const h = now.getHours();
      const m = now.getMinutes();
      if (h !== current.hour || m !== current.minute) return;

      const slotKey = `${currentTodayKey}_${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      if (current.lastTriggeredSlot === slotKey) return;

      const { message, nextRecentIds } = pickNextReminderMessage(
        current.recentMessageIds,
        current.lastShownMessageId,
        current.messageTheme
      );

      updateSettings((prev) => ({
        ...prev,
        lastTriggeredSlot: slotKey,
        lastShownMessageId: message.id,
        recentMessageIds: nextRecentIds,
      }));
      setPreviewMessageId(message.id);

      const body = getLocalizedReminderText(message, languageRef.current);
      void deliverSystemNotification(body);
    };

    checkSchedule();
    const intervalId = window.setInterval(checkSchedule, 15000);
    window.addEventListener('focus', checkSchedule);
    document.addEventListener('visibilitychange', checkSchedule);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', checkSchedule);
      document.removeEventListener('visibilitychange', checkSchedule);
    };
  }, [deliverSystemNotification, updateSettings]);

  const requestPermissionExplicitly = useCallback(async () => {
    const currentPerm = getCurrentNotificationPermission();
    setPermission(currentPerm);
    if (currentPerm !== 'default') return currentPerm;

    try {
      const result = await window.Notification.requestPermission();
      setPermission(result);
      return result;
    } catch {
      const after = getCurrentNotificationPermission();
      setPermission(after);
      return after;
    }
  }, []);

  const toggleEnabled = useCallback(
    async (nextEnabled?: boolean) => {
      setMinDayWarning(false);
      const target =
        typeof nextEnabled === 'boolean'
          ? nextEnabled
          : !settingsRef.current.enabled;

      updateSettings((prev) => ({
        ...prev,
        enabled: target,
      }));

      if (target) {
        const perm = await requestPermissionExplicitly();
        return perm;
      }
      return getCurrentNotificationPermission();
    },
    [requestPermissionExplicitly, updateSettings]
  );

  const setTime = useCallback(
    (hour: number, minute: number) => {
      const safeHour = Math.max(0, Math.min(23, Math.floor(hour)));
      const safeMinute = Math.max(0, Math.min(59, Math.floor(minute)));
      updateSettings((prev) => ({
        ...prev,
        hour: safeHour,
        minute: safeMinute,
      }));
    },
    [updateSettings]
  );

  const setDailyMode = useCallback(() => {
    setMinDayWarning(false);
    updateSettings((prev) => ({
      ...prev,
      repeatMode: 'daily',
      daysOfWeek: [...ORDERED_WEEKDAYS],
    }));
  }, [updateSettings]);

  const toggleWeekday = useCallback(
    (day: WeekdayIndex) => {
      setMinDayWarning(false);
      const current = settingsRef.current;

      if (current.repeatMode === 'daily') {
        const nextDays = ORDERED_WEEKDAYS.filter((d) => d !== day);
        updateSettings((prev) => ({
          ...prev,
          repeatMode: 'weekly',
          daysOfWeek: nextDays,
        }));
        return;
      }

      const exists = current.daysOfWeek.includes(day);
      if (exists) {
        if (current.daysOfWeek.length <= 1) {
          setMinDayWarning(true);
          return;
        }
        const nextDays = current.daysOfWeek.filter((d) => d !== day);
        updateSettings((prev) => ({
          ...prev,
          repeatMode: 'weekly',
          daysOfWeek: nextDays,
        }));
        return;
      }

      const nextSet = new Set<WeekdayIndex>([...current.daysOfWeek, day]);
      const ordered = ORDERED_WEEKDAYS.filter((d) => nextSet.has(d));
      const becomesDaily = ordered.length === ORDERED_WEEKDAYS.length;

      updateSettings((prev) => ({
        ...prev,
        repeatMode: becomesDaily ? 'daily' : 'weekly',
        daysOfWeek: becomesDaily ? [...ORDERED_WEEKDAYS] : ordered,
      }));
    },
    [updateSettings]
  );

  const toggleSkipToday = useCallback(() => {
    const today = getLocalDateKey();
    setTodayKey(today);
    updateSettings((prev) => ({
      ...prev,
      skippedDate: prev.skippedDate === today ? null : today,
    }));
  }, [updateSettings]);

  const cyclePreviewMessage = useCallback(() => {
    const { message, nextRecentIds } = pickNextReminderMessage(
      settingsRef.current.recentMessageIds,
      previewMessageId,
      settingsRef.current.messageTheme
    );
    setPreviewMessageId(message.id);
    updateSettings((prev) => ({
      ...prev,
      lastShownMessageId: message.id,
      recentMessageIds: nextRecentIds,
    }));
  }, [previewMessageId, updateSettings]);

  const sendTestNotification = useCallback(async (): Promise<
    'sent' | 'denied' | 'unsupported' | 'blocked'
  > => {
    let perm = getCurrentNotificationPermission();
    if (perm === 'default') {
      perm = await requestPermissionExplicitly();
    }
    if (perm === 'unsupported') return 'unsupported';
    if (perm === 'denied') return 'denied';
    if (perm !== 'granted') return 'blocked';

    const { message, nextRecentIds } = pickNextReminderMessage(
      settingsRef.current.recentMessageIds,
      settingsRef.current.lastShownMessageId,
      settingsRef.current.messageTheme
    );
    setPreviewMessageId(message.id);
    updateSettings((prev) => ({
      ...prev,
      lastShownMessageId: message.id,
      recentMessageIds: nextRecentIds,
    }));

    const body = getLocalizedReminderText(message, languageRef.current);
    return deliverSystemNotification(body);
  }, [deliverSystemNotification, requestPermissionExplicitly, updateSettings]);

  const nextResumeInfo = useMemo(
    () => findNextScheduledWeekday(settings, new Date(), isSkippedToday),
    [settings, isSkippedToday]
  );

  return {
    settings,
    permission,
    todayKey,
    isSkippedToday,
    previewMessage,
    minDayWarning,
    nextResumeInfo,
    toggleEnabled,
    requestPermissionExplicitly,
    setTime,
    setDailyMode,
    toggleWeekday,
    toggleSkipToday,
    cyclePreviewMessage,
    sendTestNotification,
  };
}
