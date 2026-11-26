import { ReminderMessage, ReminderThemeId } from '../types/reminder';
import { Language } from '../i18n/types';

export const REMINDER_MESSAGES: ReminderMessage[] = [
  {
    id: 'calm_01',
    themeId: 'calm_default',
    text: {
      ko: '오늘은 잠시 멈추어, 내 마음에 귀 기울여 보세요.',
      en: 'Pause for a quiet moment today, and listen gently to your heart.',
      ja: '今日は少し立ち止まって、自分の心の声に耳を傾けてみてください。',
    },
  },
  {
    id: 'calm_02',
    themeId: 'calm_default',
    text: {
      ko: '오늘 나는 무엇에 가장 마음을 쏟았을까요?',
      en: 'What did you pour most of your heart into today?',
      ja: '今日、私は何にいちばん心を注いでいたでしょうか。',
    },
  },
  {
    id: 'calm_03',
    themeId: 'calm_default',
    text: {
      ko: '지금 내 마음은 어떤 이야기를 하고 있나요?',
      en: 'What quiet story is your heart telling you right now?',
      ja: '今、あなたの心はどんな言葉を語りかけていますか。',
    },
  },
  {
    id: 'calm_04',
    themeId: 'calm_default',
    text: {
      ko: '오늘 나에게 조금 더 다정해질 수 있을까요?',
      en: 'Could you offer yourself a little more gentleness today?',
      ja: '今日の自分に、もう少しだけ優しくしてあげられますか。',
    },
  },
  {
    id: 'calm_05',
    themeId: 'calm_default',
    text: {
      ko: '오늘 하루 중 가장 오래 마음에 남은 순간은 무엇인가요?',
      en: 'Which moment from today lingered longest in your heart?',
      ja: '今日一日の中で、いちばん長く心に残った瞬間は何ですか。',
    },
  },
  {
    id: 'calm_06',
    themeId: 'calm_default',
    text: {
      ko: '지금의 나는 무엇을 지키고 무엇을 내려놓고 싶을까요?',
      en: 'What do you wish to hold close right now, and what would you like to set down?',
      ja: '今の私は何を守り、何を手放したいと感じているでしょうか。',
    },
  },
  {
    id: 'calm_07',
    themeId: 'calm_default',
    text: {
      ko: '잠시 숨을 고르고, 오늘의 나를 바라보세요.',
      en: 'Take a slow breath, and gently meet yourself as you are today.',
      ja: 'ひと呼吸おいて、今日の自分をそっと見つめてみてください。',
    },
  },
];

export function getMessagesByTheme(
  themeId: ReminderThemeId = 'calm_default'
): ReminderMessage[] {
  const matched = REMINDER_MESSAGES.filter((m) => m.themeId === themeId);
  return matched.length > 0 ? matched : REMINDER_MESSAGES;
}

export function getReminderMessageById(
  id: string | null | undefined,
  themeId: ReminderThemeId = 'calm_default'
): ReminderMessage {
  const pool = getMessagesByTheme(themeId);
  if (id) {
    const found = pool.find((m) => m.id === id);
    if (found) return found;
  }
  return pool[0];
}

export function getLocalizedReminderText(
  message: ReminderMessage,
  language: Language
): string {
  return message.text[language] ?? message.text.ko;
}

/**
 * Selects the next reminder message without repeating any message
 * until the full pool has been rotated through, and never repeats
 * the immediately preceding message back-to-back on cycle reset.
 */
export function pickNextReminderMessage(
  recentIds: string[],
  lastShownId: string | null,
  themeId: ReminderThemeId = 'calm_default'
): {
  message: ReminderMessage;
  nextRecentIds: string[];
} {
  const pool = getMessagesByTheme(themeId);
  const recentSet = new Set(recentIds);
  const unseen = pool.filter((m) => !recentSet.has(m.id));

  if (unseen.length > 0) {
    // Deterministic-friendly gentle rotation with mild randomness among unseen items
    const idx = Math.floor(Math.random() * unseen.length);
    const chosen = unseen[idx];
    return {
      message: chosen,
      nextRecentIds: [...recentIds, chosen.id],
    };
  }

  // Full cycle completed: start a fresh cycle avoiding back-to-back repeat
  const freshPool =
    pool.length > 1 ? pool.filter((m) => m.id !== lastShownId) : pool;
  const idx = Math.floor(Math.random() * freshPool.length);
  const chosen = freshPool[idx];

  return {
    message: chosen,
    nextRecentIds: [chosen.id],
  };
}
