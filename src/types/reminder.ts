export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sun, 1 = Mon, ..., 6 = Sat

export type ReminderRepeatMode = 'daily' | 'weekly';

export type ReminderThemeId = 'calm_default';

export type NotificationPermissionState =
  | 'granted'
  | 'denied'
  | 'default'
  | 'unsupported';

export interface ReminderMessage {
  id: string;
  themeId: ReminderThemeId;
  text: {
    ko: string;
    en: string;
    ja: string;
  };
}

export interface ReminderSettings {
  version: 1;
  enabled: boolean;
  hour: number; // 0..23
  minute: number; // 0..59
  repeatMode: ReminderRepeatMode;
  daysOfWeek: WeekdayIndex[]; // Active days when weekly; synced to all 7 when daily
  skippedDate: string | null; // Local YYYY-MM-DD for "skip today"
  messageTheme: ReminderThemeId;
  lastShownMessageId: string | null;
  recentMessageIds: string[];
  lastTriggeredSlot: string | null; // "YYYY-MM-DD_HH:mm" to prevent duplicate same-minute triggers
  updatedAt: string; // ISO-8601
  // Extensible fields reserved for future updates (custom prompts, cloud sync)
  customMessage?: string | null;
}
