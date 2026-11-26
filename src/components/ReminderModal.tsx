import { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  ReminderSettingsController,
  ReminderSettingsPanel,
} from './ReminderSettingsPanel';
import { useLanguage } from '../i18n/LanguageContext';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderSettingsController;
}

export function ReminderModal({
  isOpen,
  onClose,
  reminder,
}: ReminderModalProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.reminder.title}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#34312D]/40 backdrop-blur-[2px] p-0 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#F7F3EA] border border-[#E5DED1] shadow-2xl p-4 sm:p-5">
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onClose}
            aria-label={t.reminder.modalCloseAria}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[#E5DED1] bg-[#FFFCF6] text-[#827B72] hover:text-[#34312D] hover:bg-[#E5DED1]/40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <ReminderSettingsPanel reminder={reminder} compact />
      </div>
    </div>
  );
}
