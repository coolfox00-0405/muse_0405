import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../i18n/LanguageContext';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card';
}

export function PWAInstallButton({ variant = 'header' }: PWAInstallButtonProps) {
  const { t } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      void install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  return (
    <>
      {variant === 'header' ? (
        <button
          type="button"
          onClick={handleClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5DED1] bg-[#FFFCF6] hover:bg-[#E5DED1]/45 text-xs font-medium text-[#777B61] hover:text-[#34312D] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#777B61]"
        >
          <Download className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.pwa.headerInstall}</span>
        </button>
      ) : (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/apple-touch-icon.png"
              alt={t.pwa.appIconAlt}
              className="w-12 h-12 rounded-xl border border-[#E5DED1] object-cover shrink-0"
            />
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-medium text-[#34312D]">
                {t.pwa.cardTitle}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#827B72]">
                {t.pwa.cardDesc}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl border border-[#E5DED1] bg-[#F7F3EA] hover:bg-[#E5DED1]/60 text-[#34312D] text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isIOS ? (
              <Share className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
            ) : (
              <Download className="w-4 h-4 text-[#777B61]" aria-hidden="true" />
            )}
            <span>{isIOS ? t.pwa.cardButtonIOS : t.pwa.cardButtonInstall}</span>
          </button>
        </div>
      )}

      {showIOSGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="lucida-ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#34312D]/40 backdrop-blur-[2px] p-5"
        >
          <div className="w-full max-w-sm rounded-2xl bg-[#FFFCF6] border border-[#E5DED1] p-6 shadow-xl space-y-4 text-left">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/apple-touch-icon.png"
                  alt={t.pwa.appIconAlt}
                  className="w-11 h-11 rounded-xl border border-[#E5DED1] object-cover shrink-0"
                />
                <div>
                  <h3
                    id="lucida-ios-install-title"
                    className="font-serif text-lg font-medium text-[#34312D]"
                  >
                    {t.pwa.iosModalTitle}
                  </h3>
                  <p className="text-xs text-[#827B72]">{t.pwa.iosModalSubtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label={t.pwa.iosModalCloseAria}
                className="p-1.5 rounded-lg text-[#827B72] hover:text-[#34312D] hover:bg-[#E5DED1]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="space-y-2 text-sm leading-relaxed text-[#34312D]/85">
              <li>
                {t.pwa.iosStep1Before}
                <strong>{t.pwa.iosStep1Bold}</strong>
                {t.pwa.iosStep1After}
              </li>
              <li>
                {t.pwa.iosStep2Before}
                <strong>{t.pwa.iosStep2Bold}</strong>
                {t.pwa.iosStep2After}
              </li>
              <li>
                {t.pwa.iosStep3Before}
                <strong>{t.pwa.iosStep3Bold}</strong>
                {t.pwa.iosStep3After}
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[42px] rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors cursor-pointer"
            >
              {t.pwa.confirm}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
