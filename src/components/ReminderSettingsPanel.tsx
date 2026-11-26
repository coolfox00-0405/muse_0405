import { useState } from 'react';
import {
  Bell,
  BellOff,
  Clock,
  RefreshCw,
  Send,
  Sparkles,
  AlertCircle,
  PauseCircle,
  Info,
} from 'lucide-react';
import {
  NotificationPermissionState,
  ReminderSettings,
  WeekdayIndex,
} from '../types/reminder';
import { ORDERED_WEEKDAYS } from '../hooks/useReminderSettings';
import { useLanguage } from '../i18n/LanguageContext';

export interface ReminderSettingsController {
  settings: ReminderSettings;
  permission: NotificationPermissionState;
  isSkippedToday: boolean;
  previewMessage: { id: string; text: string };
  minDayWarning: boolean;
  nextResumeInfo: { dayOffset: number; weekday: WeekdayIndex };
  toggleEnabled: (nextEnabled?: boolean) => Promise<NotificationPermissionState>;
  requestPermissionExplicitly: () => Promise<NotificationPermissionState>;
  setTime: (hour: number, minute: number) => void;
  setDailyMode: () => void;
  toggleWeekday: (day: WeekdayIndex) => void;
  toggleSkipToday: () => void;
  cyclePreviewMessage: () => void;
  sendTestNotification: () => Promise<'sent' | 'denied' | 'unsupported' | 'blocked'>;
}

interface ReminderSettingsPanelProps {
  reminder: ReminderSettingsController;
  compact?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export function ReminderSettingsPanel({
  reminder,
  compact = false,
}: ReminderSettingsPanelProps) {
  const { t } = useLanguage();
  const {
    settings,
    permission,
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
  } = reminder;

  const [testFeedback, setTestFeedback] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const formattedTime = t.reminder.formatTimeDisplay(settings.hour, settings.minute);

  const scheduleSummary =
    settings.repeatMode === 'daily'
      ? t.reminder.scheduleSummaryDaily(formattedTime)
      : t.reminder.scheduleSummaryWeekly(
          settings.daysOfWeek
            .map((d) => t.reminder.weekdaysShort[d])
            .join(' · '),
          formattedTime
        );

  const nextResumeLabel =
    nextResumeInfo.dayOffset === 1
      ? t.reminder.skipTodayTomorrowLabel
      : t.reminder.skipTodayWeekdayLabel(
          t.reminder.weekdaysFull[nextResumeInfo.weekday]
        );

  const handleTestNotification = async () => {
    const result = await sendTestNotification();
    if (result === 'sent') {
      setTestFeedback({ type: 'success', text: t.reminder.testSentFeedback });
    } else if (result === 'unsupported') {
      setTestFeedback({ type: 'error', text: t.reminder.testUnsupportedFeedback });
    } else {
      setTestFeedback({ type: 'error', text: t.reminder.testDeniedFeedback });
    }
  };

  return (
    <section
      aria-label={t.reminder.title}
      className={`bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl ${
        compact ? 'p-5 sm:p-6 space-y-5' : 'p-6 sm:p-8 space-y-6'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#E7E0D5] pb-5">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#B59457]/12 text-[#9B7B3E] shrink-0">
              {settings.enabled ? (
                <Bell className="w-3.5 h-3.5" aria-hidden="true" />
              ) : (
                <BellOff className="w-3.5 h-3.5 text-[#827B72]" aria-hidden="true" />
              )}
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#34312D]">
              {t.reminder.title}
            </h2>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap ${
                !settings.enabled
                  ? 'bg-[#F7F3EA] text-[#827B72] border border-[#E7E0D5]'
                  : isSkippedToday
                    ? 'bg-[#B59457]/12 text-[#866831] border border-[#B59457]/30'
                    : 'bg-[#777B61]/12 text-[#5B6047] border border-[#777B61]/25'
              }`}
            >
              {!settings.enabled
                ? t.reminder.statusPausedBadge
                : isSkippedToday
                  ? t.reminder.statusSkippedBadge
                  : t.reminder.statusActiveBadge}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-[#827B72]">
            {t.reminder.subtitle}
          </p>
          {settings.enabled && (
            <p className="text-xs font-medium text-[#777B61] pt-0.5 tabular-nums">
              {scheduleSummary}
            </p>
          )}
        </div>
      </div>

      {/* Master On/Off Switch */}
      <div className="flex items-center justify-between gap-4 rounded-xl bg-[#F7F3EA]/70 border border-[#E7E0D5] px-4 py-3.5">
        <div className="space-y-0.5 min-w-0">
          <p className="text-sm font-medium text-[#34312D]">
            {t.reminder.toggleLabel}
          </p>
          <p className="text-xs leading-relaxed text-[#827B72]">
            {settings.enabled
              ? t.reminder.toggleDescActive
              : t.reminder.toggleDescPaused}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={settings.enabled}
          aria-label={t.reminder.toggleAria}
          onClick={() => {
            setTestFeedback(null);
            void toggleEnabled();
          }}
          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
            settings.enabled
              ? 'bg-[#777B61] border-[#777B61]'
              : 'bg-[#E5DED1] border-[#D8CFC0]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 transform rounded-full bg-[#FFFCF6] shadow-sm transition-transform ${
              settings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Permission Guidance (only when needed) */}
      {settings.enabled && permission === 'denied' && (
        <div
          role="status"
          className="rounded-xl bg-[#A65D4E]/8 border border-[#A65D4E]/25 p-4 flex items-start gap-3"
        >
          <AlertCircle
            className="w-4 h-4 text-[#8C493B] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1 text-xs leading-relaxed">
            <p className="font-medium text-[#7A3B2E]">
              {t.reminder.permissionDeniedTitle}
            </p>
            <p className="text-[#7A3B2E]/90">{t.reminder.permissionDeniedBody}</p>
          </div>
        </div>
      )}

      {settings.enabled && permission === 'default' && (
        <div
          role="status"
          className="rounded-xl bg-[#B59457]/10 border border-[#B59457]/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <div className="space-y-0.5 text-xs leading-relaxed">
            <p className="font-medium text-[#6C5225]">
              {t.reminder.permissionDefaultTitle}
            </p>
            <p className="text-[#6C5225]/90">{t.reminder.permissionDefaultBody}</p>
          </div>
          <button
            type="button"
            onClick={() => void requestPermissionExplicitly()}
            className="min-h-[38px] px-4 py-1.5 rounded-lg bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.reminder.permissionAllowButton}
          </button>
        </div>
      )}

      {settings.enabled && permission === 'unsupported' && (
        <div
          role="status"
          className="rounded-xl bg-[#F7F3EA] border border-[#E7E0D5] p-3.5 text-xs leading-relaxed text-[#827B72]"
        >
          {t.reminder.permissionUnsupportedBody}
        </div>
      )}

      {/* Time Picker */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium text-[#34312D]">
            <Clock className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
            <span>{t.reminder.timeTitle}</span>
          </div>
          <span className="text-xs text-[#777B61] font-medium tabular-nums">
            {formattedTime}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label
              htmlFor="reminder-hour-select"
              className="block text-[11px] text-[#827B72] px-0.5"
            >
              {t.reminder.hourLabel}
            </label>
            <select
              id="reminder-hour-select"
              value={settings.hour}
              onChange={(e) => setTime(Number(e.target.value), settings.minute)}
              className="w-full min-h-[44px] rounded-xl bg-[#F7F3EA]/80 border border-[#E5DED1] px-3.5 py-2 text-sm text-[#34312D] tabular-nums focus:outline-none focus:border-[#777B61] cursor-pointer"
            >
              {HOURS.map((h) => (
                <option key={h} value={h}>
                  {t.reminder.formatHourOption(h)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="reminder-minute-select"
              className="block text-[11px] text-[#827B72] px-0.5"
            >
              {t.reminder.minuteLabel}
            </label>
            <select
              id="reminder-minute-select"
              value={settings.minute}
              onChange={(e) => setTime(settings.hour, Number(e.target.value))}
              className="w-full min-h-[44px] rounded-xl bg-[#F7F3EA]/80 border border-[#E5DED1] px-3.5 py-2 text-sm text-[#34312D] tabular-nums focus:outline-none focus:border-[#777B61] cursor-pointer"
            >
              {MINUTES.map((m) => (
                <option key={m} value={m}>
                  {t.reminder.formatMinuteOption(m)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Repeat Schedule: Daily + Individual Weekdays */}
      <div className="space-y-2.5">
        <p className="text-sm font-medium text-[#34312D]">
          {t.reminder.repeatTitle}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={setDailyMode}
            aria-pressed={settings.repeatMode === 'daily'}
            className={`min-h-[40px] px-4 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
              settings.repeatMode === 'daily'
                ? 'bg-[#777B61] border-[#777B61] text-[#FFFCF6]'
                : 'bg-[#F7F3EA]/70 border-[#E5DED1] text-[#6B645C] hover:border-[#777B61]/50 hover:text-[#34312D]'
            }`}
          >
            {t.reminder.dailyOption}
          </button>

          <div
            role="group"
            aria-label={t.reminder.repeatTitle}
            className="grid grid-cols-7 gap-1.5 flex-1 min-w-[240px]"
          >
            {ORDERED_WEEKDAYS.map((day) => {
              const isSelected =
                settings.repeatMode === 'daily' ||
                settings.daysOfWeek.includes(day);
              const isCustomMode = settings.repeatMode === 'weekly';
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleWeekday(day)}
                  aria-label={t.reminder.weekdaysFull[day]}
                  aria-pressed={isSelected}
                  className={`min-h-[40px] rounded-xl border text-xs font-medium transition-colors flex items-center justify-center cursor-pointer ${
                    isSelected
                      ? isCustomMode
                        ? 'bg-[#777B61] border-[#777B61] text-[#FFFCF6]'
                        : 'bg-[#777B61]/15 border-[#777B61]/45 text-[#494D38]'
                      : 'bg-[#FFFCF6] border-[#E5DED1] text-[#827B72] hover:border-[#777B61]/45 hover:text-[#34312D]'
                  }`}
                >
                  {t.reminder.weekdaysShort[day]}
                </button>
              );
            })}
          </div>
        </div>

        {minDayWarning && (
          <p className="text-xs text-[#9B7B3E]" role="status">
            {t.reminder.minDayWarning}
          </p>
        )}
      </div>

      {/* Skip Today Option */}
      <div className="rounded-xl bg-[#F7F3EA]/55 border border-[#E7E0D5] px-4 py-3.5 space-y-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-2.5 min-w-0">
            <PauseCircle
              className={`w-4 h-4 shrink-0 mt-0.5 ${
                isSkippedToday ? 'text-[#9B7B3E]' : 'text-[#827B72]'
              }`}
              aria-hidden="true"
            />
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-[#34312D]">
                {t.reminder.skipTodayTitle}
              </p>
              <p className="text-xs leading-relaxed text-[#827B72]">
                {t.reminder.skipTodayDesc}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isSkippedToday}
            aria-label={t.reminder.skipTodayTitle}
            onClick={toggleSkipToday}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61] ${
              isSkippedToday
                ? 'bg-[#B59457] border-[#B59457]'
                : 'bg-[#E5DED1] border-[#D8CFC0]'
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-block h-5 w-5 transform rounded-full bg-[#FFFCF6] shadow-sm transition-transform ${
                isSkippedToday ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {isSkippedToday && (
          <p className="text-xs text-[#866831] pl-6 leading-relaxed">
            {t.reminder.skipTodayActiveNote(nextResumeLabel)}
          </p>
        )}
      </div>

      {/* Mobile Phone Notification Preview */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm font-medium text-[#34312D]">
            <Sparkles className="w-4 h-4 text-[#B59457]" aria-hidden="true" />
            <span>{t.reminder.previewTitle}</span>
          </div>
        </div>

        {/* Simulated Mobile Banner */}
        <div className="rounded-2xl bg-[#ECE5D7]/80 border border-[#DFD5C3] p-3.5 sm:p-4">
          <div className="rounded-2xl bg-[#FFFCF6]/95 border border-[#E5DED1] shadow-[0_6px_18px_-8px_rgba(52,49,45,0.16)] p-3.5 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/apple-touch-icon.png"
                  alt=""
                  aria-hidden="true"
                  className="w-5 h-5 rounded-md border border-[#E5DED1] object-cover shrink-0"
                />
                <span className="font-display text-xs font-medium tracking-[0.16em] text-[#34312D]">
                  LUCIDA
                </span>
              </div>
              <span className="text-[11px] text-[#827B72] tabular-nums shrink-0">
                {formattedTime} · {t.reminder.previewPhoneNow}
              </span>
            </div>

            <p className="text-[13.5px] sm:text-sm leading-relaxed text-[#34312D] font-serif pl-0.5">
              “{previewMessage.text}”
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={cyclePreviewMessage}
            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-[#E5DED1] bg-[#FFFCF6] hover:bg-[#F7F3EA] text-xs font-medium text-[#34312D] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
            <span>{t.reminder.previewCycleButton}</span>
          </button>

          <button
            type="button"
            onClick={() => void handleTestNotification()}
            className="inline-flex items-center justify-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl border border-[#777B61]/35 bg-[#777B61]/10 hover:bg-[#777B61]/18 text-xs font-medium text-[#4F533E] transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-[#777B61]" aria-hidden="true" />
            <span>{t.reminder.previewTestButton}</span>
          </button>
        </div>

        {testFeedback && (
          <p
            role="status"
            className={`text-xs leading-relaxed ${
              testFeedback.type === 'success' ? 'text-[#5B6047]' : 'text-[#8C493B]'
            }`}
          >
            {testFeedback.text}
          </p>
        )}
      </div>

      {/* Honest Scope Notice */}
      <div className="border-t border-[#E7E0D5] pt-4 flex items-start gap-2.5 text-xs leading-relaxed text-[#827B72]">
        <Info className="w-4 h-4 text-[#777B61] shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-0.5">
          <p className="font-medium text-[#34312D]/80">
            {t.reminder.scopeNoticeTitle}
          </p>
          <p>{t.reminder.scopeNoticeBody}</p>
        </div>
      </div>
    </section>
  );
}
