import { ReflectionRecord } from '../types/reflection';
import { formatKoreanDate } from '../hooks/useReflections';

export type AnalysisRange = 'recent' | 'custom' | 'all';

export interface ReflectionAnalysis {
  recordCount: number;
  dateSpanLabel: string;
  topKeywords: { word: string; count: number }[];
  topCards: { cardName: string; count: number }[];
  themeSummary: string;
  flowItems: {
    id: string;
    dateLabel: string;
    cardName: string;
    excerpt: string;
  }[];
  flowSummary: string;
  recurringQuestions: string[];
  newPerspective: string;
  closingQuestions: string[];
}

const KOREAN_STOPWORDS = new Set([
  '나는', '내가', '나의', '나를', '나에게', '오늘', '지금', '조금', '너무', '정말',
  '그냥', '다시', '계속', '많이', '것을', '것이', '것은', '것이다', '있다', '없다',
  '있는', '없는', '하고', '하는', '해서', '했다', '한다', '싶다', '싶은', '같은',
  '같다', '그리고', '하지만', '그래서', '그런데', '때문에', '대한', '통해', '위해',
  '이런', '저런', '그런', '어떤', '무엇', '어떻게', '어디', '언제', '이것', '그것',
  '여기', '거기', '가장', '매우', '아주', '좀더', '더욱', '역시', '아직', '이미',
  '마음', '생각', '느낌', '시간', '사람', '정도', '부분', '가지', '경우', '때문',
  '자신', '스스로', '우리', '모두', '하나', '다른', '많은', '좋은', '작은', '큰',
]);

function normalizeToken(raw: string): string {
  const cleaned = raw.replace(/[^가-힣a-zA-Z0-9]/g, '').trim();
  if (cleaned.length < 2) return '';
  // Strip common Korean trailing particles softly
  const stripped = cleaned.replace(
    /(에서는|으로는|에게는|까지는|부터는|이라는|에서도|으로도|에게도|은|는|이|가|을|를|에|에서|으로|로|와|과|도|만|의|께|에게|한테|부터|까지)$/,
    ''
  );
  return stripped.length >= 2 ? stripped : cleaned;
}

export function filterRecordsByRange(
  records: ReflectionRecord[],
  range: AnalysisRange,
  startDate: string,
  endDate: string
): ReflectionRecord[] {
  const sortedDesc = [...records].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (range === 'recent') {
    return sortedDesc.slice(0, 5);
  }

  if (range === 'custom') {
    return sortedDesc.filter((r) => {
      if (startDate && r.date < startDate) return false;
      if (endDate && r.date > endDate) return false;
      return true;
    });
  }

  return sortedDesc;
}

export function analyzeReflections(
  filteredRecords: ReflectionRecord[]
): ReflectionAnalysis {
  const chronological = [...filteredRecords].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const first = chronological[0];
  const last = chronological[chronological.length - 1];
  const dateSpanLabel =
    first.date === last.date
      ? formatKoreanDate(first.date)
      : `${formatKoreanDate(first.date)} ~ ${formatKoreanDate(last.date)}`;

  // 1. Keyword frequency from actual userNote text
  const wordCounts = new Map<string, number>();
  for (const rec of chronological) {
    const tokens = rec.userNote.split(/\s+/);
    const seenInRecord = new Set<string>();
    for (const token of tokens) {
      const norm = normalizeToken(token);
      if (!norm || norm.length < 2 || KOREAN_STOPWORDS.has(norm)) continue;
      wordCounts.set(norm, (wordCounts.get(norm) ?? 0) + 1);
      seenInRecord.add(norm);
    }
  }

  const topKeywords = Array.from(wordCounts.entries())
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, 6);

  // Card frequency (excluding freeform)
  const cardCounts = new Map<string, number>();
  for (const rec of chronological) {
    if (rec.cardId === 'freeform') continue;
    cardCounts.set(rec.cardName, (cardCounts.get(rec.cardName) ?? 0) + 1);
  }
  const topCards = Array.from(cardCounts.entries())
    .map(([cardName, count]) => ({ cardName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const repeatedWords = topKeywords.filter((k) => k.count >= 2);
  let themeSummary: string;
  if (repeatedWords.length > 0) {
    const wordsText = repeatedWords
      .slice(0, 3)
      .map((k) => `‘${k.word}’`)
      .join(', ');
    themeSummary = `선택한 범위의 기록에서는 ${wordsText} 같은 표현이 여러 번 나타났습니다. 이 단어들이 지금 마음에 자주 머무는 관심사일 가능성이 있습니다.`;
  } else if (topKeywords.length > 0) {
    const wordsText = topKeywords
      .slice(0, 3)
      .map((k) => `‘${k.word}’`)
      .join(', ');
    themeSummary = `기록마다 서로 다른 이야기가 담겨 있으며, ${wordsText} 등의 표현이 눈에 띕니다. 아직 뚜렷하게 반복되는 단일 주제보다는 다양한 생각을 탐색하는 흐름으로 보입니다.`;
  } else {
    themeSummary =
      '짧은 문장 위주로 기록이 남아 있어 뚜렷한 반복 키워드는 아직 적습니다. 기록이 조금 더 쌓이면 자주 등장하는 주제를 더 선명하게 살펴볼 수 있습니다.';
  }

  // 2. Chronological flow (first, middle if >=3, last)
  const pickIndices =
    chronological.length <= 3
      ? chronological.map((_, i) => i)
      : [0, Math.floor(chronological.length / 2), chronological.length - 1];

  const flowItems = pickIndices.map((idx) => {
    const rec = chronological[idx];
    const cleanText = rec.userNote.replace(/\s+/g, ' ').trim();
    const excerpt =
      cleanText.length > 68 ? `${cleanText.slice(0, 68)}…` : cleanText;
    return {
      id: rec.id,
      dateLabel: formatKoreanDate(rec.date),
      cardName: rec.cardName,
      excerpt,
    };
  });

  const flowSummary =
    chronological.length >= 3
      ? `총 ${chronological.length}개의 기록을 시간순으로 나란히 놓아 보았습니다. 처음 남긴 문장과 가장 최근의 문장을 비교하며 관심사나 시선이 어떻게 이어졌는지 살펴보세요.`
      : `선택한 범위의 ${chronological.length}개 기록을 시간순으로 정리했습니다. 앞선 기록과 다음 기록 사이에 어떤 연결고리가 있는지 천천히 읽어볼 수 있습니다.`;

  // 3. Recurring questions (from userNote sentences ending with '?' or card reflectionQuestions)
  const userQuestions: string[] = [];
  for (const rec of chronological) {
    const matches = rec.userNote.match(/[^.!?\n]+\?/g);
    if (matches) {
      for (const q of matches) {
        const trimmed = q.trim();
        if (trimmed.length >= 5 && !userQuestions.includes(trimmed)) {
          userQuestions.push(trimmed);
        }
      }
    }
  }

  const cardQuestions = Array.from(
    new Set(
      chronological
        .filter((r) => r.cardId !== 'freeform' && r.reflectionQuestion)
        .map((r) => r.reflectionQuestion)
    )
  );

  const recurringQuestions =
    userQuestions.length > 0
      ? userQuestions.slice(0, 3)
      : cardQuestions.slice(0, 2);

  // 4. New perspective (strictly observational connection between records)
  const actionsChosen = chronological.filter((r) => Boolean(r.selectedAction));
  let newPerspective: string;
  if (topCards.length > 0 && topCards[0].count >= 2) {
    newPerspective = `선택한 범위에서 ‘${topCards[0].cardName}’ 카드와 연결된 기록이 ${topCards[0].count}번 남아 있습니다. 같은 카드 앞에서 그때그때 어떤 다른 생각을 적었는지 나란히 비교해 보면 새로운 단서가 보일 수 있습니다.`;
  } else if (actionsChosen.length > 0) {
    newPerspective = `기록 중 ${actionsChosen.length}건에서 작은 시도를 함께 선택하셨습니다. 생각으로만 머문 기록과 작은 시도를 곁들인 기록 사이에 마음의 무게가 어떻게 달랐는지 돌아볼 수 있습니다.`;
  } else if (repeatedWords.length > 0) {
    newPerspective = `서로 다른 날에 남긴 기록 속에서도 ‘${repeatedWords[0].word}’라는 표현이 다시 등장했습니다. 겉으로는 다른 상황처럼 보여도 비슷한 마음의 결이 이어지고 있었을 가능성이 있습니다.`;
  } else {
    newPerspective =
      '각 기록이 서로 다른 카드와 주제로 흩어져 있습니다. 하나의 결론을 찾기보다, 요즘 내가 어떤 다양한 장면들에 마음을 쓰고 있는지 가볍게 바라보는 것만으로도 충분합니다.';
  }

  // 5. Closing reflective questions
  const closingQuestions: string[] = [];
  if (repeatedWords.length > 0) {
    closingQuestions.push(
      `기록에서 자주 등장한 ‘${repeatedWords[0].word}’에 대해, 지금의 나는 어떤 마음으로 바라보고 있나요?`
    );
  } else {
    closingQuestions.push(
      '이 기록들을 다시 읽어 보았을 때, 지금 가장 마음에 오래 머무는 문장은 무엇인가요?'
    );
  }
  closingQuestions.push(
    '그때의 나와 지금의 나 사이에 달라진 점이 있다면, 혹은 여전히 이어지고 있는 마음은 무엇일까요?'
  );

  return {
    recordCount: chronological.length,
    dateSpanLabel,
    topKeywords,
    topCards,
    themeSummary,
    flowItems,
    flowSummary,
    recurringQuestions,
    newPerspective,
    closingQuestions,
  };
}
