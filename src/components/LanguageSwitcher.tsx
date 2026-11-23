import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/types';

const LANGUAGE_ORDER: Language[] = ['ko', 'en', 'ja'];

const SHORT_CODE: Record<Language, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
};

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { language, setLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={t.languageSwitcher.ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center gap-1.5 h-8 sm:h-9 px-2.5 rounded-lg border border-[#E5DED1] bg-[#FFFCF6]/95 hover:bg-[#E5DED1]/45 text-[#6B645C] hover:text-[#34312D] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61]"
      >
        <Globe className="w-3.5 h-3.5 text-[#777B61] shrink-0" aria-hidden="true" />
        <span className="text-[11px] font-medium tracking-wider uppercase leading-none">
          {SHORT_CODE[language]}
        </span>
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t.languageSwitcher.menuLabel}
          className="absolute right-0 mt-2 w-36 rounded-xl bg-[#FFFCF6] border border-[#E5DED1] shadow-[0_12px_30px_-10px_rgba(52,49,45,0.2)] py-1.5 z-50"
        >
          {LANGUAGE_ORDER.map((lang) => {
            const isSelected = language === lang;
            return (
              <button
                key={lang}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
                className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#777B61]/10 text-[#34312D] font-medium'
                    : 'text-[#6B645C] hover:bg-[#F7F3EA] hover:text-[#34312D]'
                }`}
              >
                <span>{t.languageSwitcher.options[lang]}</span>
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 text-[#777B61] shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
