import { ReflectionRecord } from '../types/reflection';
import { formatKoreanDate } from '../hooks/useReflections';

export type AnalysisRange = 'recent' | 'custom' | 'all';

export interface EvidenceSnippet {
  id: string;
  dateLabel: string;
  cardName: string;
  excerpt: string;
}

export interface KeywordObservation {
  word: string;
  recordCount: number; // distinct records containing this word
  totalCount: number; // total occurrences across records
  evidence: EvidenceSnippet[];
}

export interface ReflectionAnalysis {
  recordCount: number;
  dateSpanLabel: string;
  hasClearPattern: boolean;
  topKeywords: KeywordObservation[];
  topCards: { cardName: string; count: number }[];
  themeSummary: string;
  flowItems: EvidenceSnippet[];
  flowSummary: string;
  recurringQuestions: { question: string; sourceRecordId: string; dateLabel: string }[];
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
  '있어', '있고', '없어', '같아', '되는', '된다', '했다', '했어', '보면', '보니',
]);

function normalizeToken(raw: string): string {
  const cleaned = raw.replace(/[^가-힣a-zA-Z0-9]/g, '').trim();
  if (cleaned.length < 2) return '';
  const stripped = cleaned.replace(
    /(에서는|으로는|에게는|까지는|부터는|이라는|에서도|으로도|에게도|은|는|이|가|을|를|에|에서|으로|로|와|과|도|만|의|께|에게|한테|부터|까지)$/,
    ''
  );
  return stripped.length >= 2 ? stripped : cleaned;
}

function makeExcerpt(note: string, maxLen = 68): string {
  const cleanText = note.replace(/\s+/g, ' ').trim();
  return cleanText.length > maxLen
    ? `${cleanText.slice(0, maxLen)}…`
    : cleanText;
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

  // 1. Deduplicated per-record keyword frequency (prevents inflation within a single note)
  const wordStats = new Map<
    string,
    { recordIds: Set<string>; totalCount: number; evidence: EvidenceSnippet[] }
  >();

  for (const rec of chronological) {
    const tokens = rec.userNote.split(/\s+/);
    const seenInThisRecord = new Set<string>();

    for (const token of tokens) {
      const norm = normalizeToken(token);
      if (!norm || norm.length < 2 || KOREAN_STOPWORDS.has(norm)) continue;

      let entry = wordStats.get(norm);
      if (!entry) {
        entry = { recordIds: new Set(), totalCount: 0, evidence: [] };
        wordStats.set(norm, entry);
      }

      entry.totalCount += 1;

      if (!seenInThisRecord.has(norm)) {
        seenInThisRecord.add(norm);
        entry.recordIds.add(rec.id);
        entry.evidence.push({
          id: rec.id,
          dateLabel: formatKoreanDate(rec.date),
          cardName: rec.cardName,
          excerpt: makeExcerpt(rec.userNote, 58),
        });
      }
    }
  }

  const topKeywords: KeywordObservation[] = Array.from(wordStats.entries())
    .map(([word, stat]) => ({
      word,
      recordCount: stat.recordIds.size,
      totalCount: stat.totalCount,
      evidence: stat.evidence.slice(0, 3),
    }))
    .sort(
      (a, b) =>
        b.recordCount - a.recordCount ||
        b.totalCount - a.totalCount ||
        a.word.localeCompare(b.word)
    )
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

  // Only treat as a recurring theme if it appeared in 2+ DISTINCT records
  const multiRecordKeywords = topKeywords.filter((k) => k.recordCount >= 2);
  const hasClearPattern = multiRecordKeywords.length > 0;

  let themeSummary: string;
  if (hasClearPattern) {
    const wordsText = multiRecordKeywords
      .slice(0, 3)
      .map((k) => `‘${k.word}’(${k.recordCount}개 기록)`)
      .join(', ');
    themeSummary = `선택한 범위의 여러 기록에서 ${wordsText} 같은 표현이 반복적으로 나타났습니다. 한 기록 안에서의 중복은 제외하고, 서로 다른 기록에 걸쳐 등장한 횟수를 기준으로 정리했습니다.`;
  } else {
    themeSummary =
      '아직 여러 기록에 걸쳐 뚜렷하게 반복되는 흐름을 판단하기 어렵습니다. 기록마다 서로 다른 이야기가 담겨 있으므로, 조금 더 기록이 쌓인 뒤 다시 살펴보셔도 좋습니다.';
  }

  // 2. Chronological flow
  const pickIndices =
    chronological.length <= 3
      ? chronological.map((_, i) => i)
      : [0, Math.floor(chronological.length / 2), chronological.length - 1];

  const flowItems: EvidenceSnippet[] = pickIndices.map((idx) => {
    const rec = chronological[idx];
    return {
      id: rec.id,
      dateLabel: formatKoreanDate(rec.date),
      cardName: rec.cardName,
      excerpt: makeExcerpt(rec.userNote, 68),
    };
  });

  const flowSummary =
    chronological.length >= 3
      ? `총 ${chronological.length}개의 기록 중 처음·중간·최근 기록을 시간순으로 나란히 놓아 보았습니다. 각 항목을 누르면 원본 기록으로 바로 이동해 전체 문맥을 확인할 수 있습니다.`
      : `선택한 범위의 ${chronological.length}개 기록을 시간순으로 정리했습니다. 앞선 기록과 다음 기록 사이에 어떤 연결고리가 있는지 직접 확인해 보세요.`;

  // 3. Recurring questions with source record links
  const userQuestions: { question: string; sourceRecordId: string; dateLabel: string }[] = [];
  const seenQ = new Set<string>();
  for (const rec of chronological) {
    const matches = rec.userNote.match(/[^.!?\n]+\?/g);
    if (matches) {
      for (const q of matches) {
        const trimmed = q.trim();
        if (trimmed.length >= 5 && !seenQ.has(trimmed)) {
          seenQ.add(trimmed);
          userQuestions.push({
            question: trimmed,
            sourceRecordId: rec.id,
            dateLabel: formatKoreanDate(rec.date),
          });
        }
      }
    }
  }

  const cardQuestions = chronological
    .filter((r) => r.cardId !== 'freeform' && r.reflectionQuestion)
    .reduce<{ question: string; sourceRecordId: string; dateLabel: string }[]>(
      (acc, r) => {
        if (!acc.some((item) => item.question === r.reflectionQuestion)) {
          acc.push({
            question: r.reflectionQuestion,
            sourceRecordId: r.id,
            dateLabel: formatKoreanDate(r.date),
          });
        }
        return acc;
      },
      []
    );

  const recurringQuestions =
    userQuestions.length > 0
      ? userQuestions.slice(0, 3)
      : cardQuestions.slice(0, 2);

  // 4. Observational new perspective
  const actionsChosen = chronological.filter((r) => Boolean(r.selectedAction));
  let newPerspective: string;
  if (topCards.length > 0 && topCards[0].count >= 2) {
    newPerspective = `선택한 범위에서 ‘${topCards[0].cardName}’ 카드와 연결된 기록이 ${topCards[0].count}건 확인됩니다. 같은 카드 앞에서 서로 다른 시점에 어떤 생각을 남겼는지 비교해 볼 수 있습니다.`;
  } else if (actionsChosen.length > 0) {
    newPerspective = `기록 중 ${actionsChosen.length}건에서 작은 시도를 함께 선택하셨습니다. 생각만 남긴 기록과 작은 시도를 곁들인 기록을 나란히 읽어 보며 어떤 차이가 있었는지 돌아볼 수 있습니다.`;
  } else if (hasClearPattern) {
    newPerspective = `서로 다른 기록에서도 ‘${multiRecordKeywords[0].word}’라는 표현이 다시 나타났습니다. 겉으로는 다른 상황처럼 보여도 비슷한 관심사가 이어지고 있었을 가능성이 있습니다.`;
  } else {
    newPerspective =
      '기록들이 서로 다른 주제와 카드로 펼쳐져 있습니다. 하나의 패턴으로 묶기보다, 지금 어떤 다양한 생각들이 지나가고 있는지 가볍게 바라보는 참고 자료로 삼아 보세요.';
  }

  // 5. Closing reflective questions
  const closingQuestions: string[] = [];
  if (hasClearPattern) {
    closingQuestions.push(
      `여러 기록에서 반복해 등장한 ‘${multiRecordKeywords[0].word}’는 지금 나에게 어떤 의미로 다가오나요?`
    );
  } else {
    closingQuestions.push(
      '이 기록들을 다시 읽어 보았을 때, 지금 가장 마음에 오래 머무는 문장은 무엇인가요?'
    );
  }
  closingQuestions.push(
    '이전 기록과 가장 최근 기록 사이에서 달라진 시선이나 여전히 남아 있는 질문은 무엇인가요?'
  );

  return {
    recordCount: chronological.length,
    dateSpanLabel,
    hasClearPattern,
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
