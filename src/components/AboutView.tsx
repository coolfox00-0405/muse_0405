import { BookOpen } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { LucidaBrandMark } from './LucidaBrandMark';
import { useLanguage } from '../i18n/LanguageContext';

interface AboutViewProps {
  onOpenEncyclopedia?: () => void;
}

export function AboutView({ onOpenEncyclopedia }: AboutViewProps) {
  const { t } = useLanguage();

  return (
    <section
      aria-label={t.about.sectionAria}
      className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-2 sm:pt-6 pb-12 space-y-10"
    >
      <div>
        <LucidaBrandMark variant="compact" className="mb-3 sm:mb-4" />
        <header className="space-y-2 border-b border-[#E7E0D5] pb-6">
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#34312D]">
            {t.about.title}
          </h1>
        </header>
      </div>

      <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
        <p className="font-serif text-lg sm:text-xl leading-[1.7] text-[#34312D]">
          {t.about.tagline}
        </p>
        <p className="text-[15px] leading-[1.8] text-[#34312D]/85">
          {t.about.introBody}
        </p>
      </div>

      {onOpenEncyclopedia && (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-medium text-[#34312D]">
              {t.about.encyclopediaTitle}
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#827B72]">
              {t.about.encyclopediaDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenEncyclopedia}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>{t.about.encyclopediaButton}</span>
          </button>
        </div>
      )}

      <PWAInstallButton variant="card" />

      <div className="space-y-5 px-1">
        <h2 className="font-serif text-xl font-medium text-[#34312D]">
          {t.about.howToTitle}
        </h2>
        <ol className="space-y-4 text-[15px] leading-relaxed text-[#34312D]/85">
          {t.about.howToSteps.map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="font-serif text-base text-[#777B61] tabular-nums shrink-0">
                0{idx + 1}.
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-[#E7E0D5] pt-6 px-1 space-y-4 text-xs leading-relaxed text-[#827B72]">
        <div className="space-y-1.5">
          <p className="font-medium text-[#34312D]/80">{t.about.noticeReflectionTitle}</p>
          <p>{t.about.noticeReflectionBody}</p>
        </div>

        <div className="space-y-1.5">
          <p className="font-medium text-[#34312D]/80">{t.about.noticeStorageTitle}</p>
          <p>{t.about.noticeStorageBody}</p>
        </div>
      </div>
    </section>
  );
}
