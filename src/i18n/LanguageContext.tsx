import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { Language } from './types';
import { UI_TRANSLATIONS, UIMessages } from './ui';

export const LANGUAGE_STORAGE_KEY = 'lucida_language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: UIMessages;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isValidLanguage(value: unknown): value is Language {
  return value === 'ko' || value === 'en' || value === 'ja';
}

function getInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isValidLanguage(saved)) {
      return saved;
    }
  } catch {
    // Ignore storage access errors
  }
  return 'ko';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const t = useMemo(() => UI_TRANSLATIONS[language], [language]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
    document.title = t.meta.title;
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', t.meta.description);
    }
  }, [language, t]);

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
