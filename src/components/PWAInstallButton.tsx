import { useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card';
}

export function PWAInstallButton({ variant = 'header' }: PWAInstallButtonProps) {
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
          <span>앱 설치</span>
        </button>
      ) : (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src="/apple-touch-icon.png"
              alt="LUCIDA 앱 아이콘"
              className="w-12 h-12 rounded-xl border border-[#E5DED1] object-cover shrink-0"
            />
            <div className="space-y-1">
              <h2 className="font-serif text-lg font-medium text-[#34312D]">
                홈 화면에 LUCIDA 추가하기
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#827B72]">
                앱처럼 홈 화면에 설치해 언제든 가볍게 열어 성찰을 이어갈 수 있습니다.
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
            <span>{isIOS ? '홈 화면 추가 안내' : '앱 설치하기'}</span>
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
                  alt="LUCIDA 앱 아이콘"
                  className="w-11 h-11 rounded-xl border border-[#E5DED1] object-cover shrink-0"
                />
                <div>
                  <h3
                    id="lucida-ios-install-title"
                    className="font-serif text-lg font-medium text-[#34312D]"
                  >
                    홈 화면에 LUCIDA 추가
                  </h3>
                  <p className="text-xs text-[#827B72]">iOS Safari 안내</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="안내 닫기"
                className="p-1.5 rounded-lg text-[#827B72] hover:text-[#34312D] hover:bg-[#E5DED1]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="space-y-2 text-sm leading-relaxed text-[#34312D]/85">
              <li>
                1. Safari 하단 또는 상단의 <strong>공유(Share)</strong> 버튼을 누릅니다.
              </li>
              <li>
                2. 메뉴에서 <strong>홈 화면에 추가</strong>를 선택합니다.
              </li>
              <li>
                3. 오른쪽 상단의 <strong>추가</strong>를 누르면 LUCIDA 아이콘이 생성됩니다.
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full min-h-[42px] rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
