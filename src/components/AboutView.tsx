import { BookOpen } from 'lucide-react';

interface AboutViewProps {
  onOpenEncyclopedia?: () => void;
}

export function AboutView({ onOpenEncyclopedia }: AboutViewProps) {
  return (
    <section
      aria-label="앱 소개"
      className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-6 sm:pt-12 pb-12 space-y-10"
    >
      <header className="space-y-3 border-b border-[#E7E0D5] pb-8">
        <p className="font-serif text-sm tracking-[0.2em] text-[#827B72]">
          LUCIDA
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#34312D]">
          LUCIDA에 대하여
        </h1>
      </header>

      <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
        <p className="font-serif text-lg sm:text-xl leading-[1.7] text-[#34312D]">
          내 안의 빛을 발견하는 시간.
        </p>
        <p className="text-[15px] leading-[1.8] text-[#34312D]/85">
          LUCIDA는 미래를 예측하거나 운세를 단정하는 앱이 아니라, 타로 카드를
          매개로 지금의 나를 돌아보는 자기성찰 도구입니다. 마음이 복잡할 때나
          생각을 환기하고 싶을 때, 특정 시간대에 얽매이지 않고 언제든 카드를
          섞고 뽑아 볼 수 있습니다.
        </p>
      </div>

      {onOpenEncyclopedia && (
        <div className="bg-[#FFFCF6] border border-[#E7E0D5] rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-medium text-[#34312D]">
              78장 타로 카드 도감
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-[#827B72]">
              메이저 22장과 마이너 56장 각각의 고유한 일러스트와 상징, 내가 남긴 카드별 기록을 한눈에 살펴볼 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenEncyclopedia}
            className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-[#777B61] hover:bg-[#646850] text-[#FFFCF6] text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>78장 도감 열기</span>
          </button>
        </div>
      )}

      <div className="space-y-5 px-1">
        <h2 className="font-serif text-xl font-medium text-[#34312D]">
          함께하는 방법
        </h2>
        <ol className="space-y-4 text-[15px] leading-relaxed text-[#34312D]/85">
          <li className="flex gap-4">
            <span className="font-serif text-base text-[#777B61] tabular-nums shrink-0">
              01.
            </span>
            <span>
              잠시 숨을 고르고, 지금 마음속에 머무는 생각이나 질문을 떠올려
              봅니다.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-serif text-base text-[#777B61] tabular-nums shrink-0">
              02.
            </span>
            <span>
              카드를 섞고 한 장을 선택해 ‘나에게 온 메시지’와 질문을 천천히 읽어
              봅니다.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-serif text-base text-[#777B61] tabular-nums shrink-0">
              03.
            </span>
            <span>
              떠오른 생각이 있다면 인사이트 노트에 남겨 두고, 기록하지 않고
              그대로 머물러도 괜찮습니다.
            </span>
          </li>
        </ol>
      </div>

      <div className="border-t border-[#E7E0D5] pt-6 px-1 space-y-4 text-xs leading-relaxed text-[#827B72]">
        <div className="space-y-1.5">
          <p className="font-medium text-[#34312D]/80">성찰 참고 안내</p>
          <p>
            타로 해석은 참고와 자기성찰을 위한 것이며, 의료·법률·재정 등
            전문적인 판단을 대신하지 않습니다.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="font-medium text-[#34312D]/80">기록 저장 안내</p>
          <p>
            작성하신 인사이트 노트는 외부 서버로 전송되지 않고 사용 중인
            브라우저(localStorage)에만 보관됩니다. 브라우저 데이터를 삭제하거나
            기기를 변경하면 기록이 사라질 수 있습니다.
          </p>
        </div>
      </div>
    </section>
  );
}
