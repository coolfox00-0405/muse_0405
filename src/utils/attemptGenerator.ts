import { SelectedAttemptItem, TarotCard, TarotSuit } from '../types/reflection';
import { Language } from '../i18n/types';
import { getLocalizedCard } from '../i18n/cardHelpers';
import { CARD_SPECIFIC_ANGLES_I18N } from '../i18n/cardAngles';

export type AttemptCategory =
  | '감정 알아차리기'
  | '생각 정리하기'
  | '작은 행동 시도하기'
  | '관계와 자기 돌봄'
  | '새로운 관점'
  | '내면의 질문';

export type AttemptCategoryKey =
  | 'emotion'
  | 'thought'
  | 'action'
  | 'relationship'
  | 'perspective'
  | 'question';

const CATEGORY_LABELS: Record<Language, Record<AttemptCategoryKey, string>> = {
  ko: {
    emotion: '감정 알아차리기',
    thought: '생각 정리하기',
    action: '작은 행동 시도하기',
    relationship: '관계와 자기 돌봄',
    perspective: '새로운 관점',
    question: '내면의 질문',
  },
  en: {
    emotion: 'Noticing Feelings',
    thought: 'Clearing Thoughts',
    action: 'A Gentle Step',
    relationship: 'Care & Connection',
    perspective: 'Fresh Perspective',
    question: 'Inner Question',
  },
  ja: {
    emotion: '感情に気づく',
    thought: '考えを整理する',
    action: '小さな行動を試す',
    relationship: 'つながりと自己ケア',
    perspective: '新しい視点',
    question: '内なる問い',
  },
};

const THREE_CARD_POSITIONS_BY_LANG: Record<Language, [string, string, string]> = {
  ko: ['지금의 마음', '바라볼 시선', '작은 걸음'],
  en: ['Present Heart', 'A Fresh Lens', 'A Gentle Step'],
  ja: ['今の心', '見つめる視点', '小さな一歩'],
};

const OVERALL_FLOW_LABEL: Record<Language, string> = {
  ko: '전체 흐름',
  en: 'Overall Flow',
  ja: '全体の流れ',
};

interface CardAngle {
  emotion: string;
  thought: string;
  action?: string;
  relationship: string;
  perspective: string;
  selfCare: string;
  question: string;
  reversedPerspective: string;
  reversedSelfCare: string;
}

function hasBatchim(word: string): boolean {
  const trimmed = word.trim();
  if (!trimmed) return false;
  const lastChar = trimmed.charCodeAt(trimmed.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return false;
  return (lastChar - 0xac00) % 28 !== 0;
}

function particle(
  word: string,
  pair: '을/를' | '이/가' | '은/는' | '과/와'
): string {
  const b = hasBatchim(word);
  if (pair === '을/를') return b ? `${word}을` : `${word}를`;
  if (pair === '이/가') return b ? `${word}이` : `${word}가`;
  if (pair === '은/는') return b ? `${word}은` : `${word}는`;
  return b ? `${word}과` : `${word}와`;
}

// Card-specific nuanced reflections across Major Arcana & key Minor Arcana (Korean base)
const CARD_SPECIFIC_ANGLES: Record<string, Partial<CardAngle>> = {
  'major-00-fool': {
    emotion: '새로운 출발 앞에서 설렘과 망설임이 어느 비율로 섞여 있는지 느껴보기',
    thought: '완벽한 준비를 기다리느라 미루고 있던 생각 하나를 짧게 적어 보기',
    relationship: '나를 섣불리 평가하지 않는 편안한 시선을 떠올리며 마음 놓아보기',
    perspective: '지금 상황을 “꼭 잘해야 하는 시험” 대신 “처음 둘러보는 산책길”로 바라보기',
    selfCare: '어깨에 들어간 힘을 빼고 가벼운 호흡 세 번으로 긴장 내려놓기',
    question: '실패나 평가를 잠시 잊는다면, 지금 가장 호기심이 가는 방향은 어디인가요?',
  },
  'major-01-magician': {
    emotion: '무언가 해낼 수 있다는 기대감이나 반대로 조급함이 올라오는지 살피기',
    thought: '지금 내게 부족한 것 말고, 이미 갖추고 있는 경험이나 재료 세 가지 적어 보기',
    relationship: '상대에게 보여주고 싶은 모습보다 지금 내가 실제로 건넬 수 있는 진심 살피기',
    perspective: '모든 조건이 갖춰져야 시작할 수 있다는 생각을 잠시 옆에 두어 보기',
    selfCare: '집중이 흐트러지지 않도록 주변 물건 한두 가지만 단정히 정리해 두기',
    question: '지금 내 손에 이미 들려 있는데도 작게 여겨 지나치고 있던 힘은 무엇인가요?',
  },
  'major-02-high-priestess': {
    emotion: '설명하기 어렵지만 유독 마음에 걸리거나 편안하게 느껴지는 감각 알아차리기',
    thought: '남들의 의견과 내 안의 조용한 감각을 구분해서 한 줄씩 적어 보기',
    relationship: '말을 아끼고 상대의 표정과 분위기를 차분히 지켜보는 시간 갖기',
    perspective: '당장 결론을 내려야 한다는 압박에서 한 발짝 뒤로 물러나 보기',
    selfCare: '알림이나 소음을 잠시 끄고 5분 정도 조용한 침묵 속에 머물러 보기',
    question: '머리는 그럴듯하다고 말하지만, 마음 깊은 곳에서는 다르게 느끼는 일이 있나요?',
  },
  'major-03-empress': {
    emotion: '최근 내 마음이 메말라 있었는지, 아니면 따뜻하게 채워졌는지 살펴보기',
    thought: '스스로를 다그치던 말 대신, 나에게 건네고 싶은 다정한 문장 하나 적어 보기',
    relationship: '곁에 있는 사람에게 받았던 작은 따뜻함 하나를 떠올려 보기',
    perspective: '성과나 속도보다 지금 내 일상이 잘 숨 쉬고 있는지 먼저 살펴보기',
    selfCare: '좋아하는 향, 따뜻한 음료, 포근한 촉감처럼 감각이 편안해지는 시간 갖기',
    question: '지금의 내가 가장 편안하고 안전하다고 느끼기 위해 필요한 돌봄은 무엇인가요?',
  },
  'major-04-emperor': {
    emotion: '흔들리는 상황 속에서 내가 지키고 싶은 안정감이 어디서 오는지 살피기',
    thought: '지금 당장 내가 책임질 수 있는 영역과 그렇지 않은 영역을 선으로 나누어 보기',
    relationship: '타인의 기대를 떠안기보다 내 경계를 차분하게 지킬 수 있는 방법 떠올리기',
    perspective: '통제하려는 긴장을 조금 풀고, 핵심 기준 한 가지만 분명히 세워 보기',
    selfCare: '복잡한 일정을 한 번에 다 처리하려 하지 않고 오늘의 마감 시간 정해두기',
    question: '다른 무엇을 양보하더라도 지금 꼭 지켜내고 싶은 나만의 원칙은 무엇인가요?',
  },
  'major-05-hierophant': {
    emotion: '익숙한 기준을 따를 때 느껴지는 안도감과 답답함을 함께 들여다보기',
    thought: '오래 믿어온 말이나 가치 중 지금의 나에게도 여전히 힘이 되는 문장 적어 보기',
    relationship: '조언을 구할 수 있거나 존재만으로도 든든한 사람 한 분 떠올려 보기',
    perspective: '당연하다고 여겨온 규칙 중 나에게 맞게 조율해도 좋은 부분이 있는지 보기',
    selfCare: '익숙한 루틴 하나를 천천히 지키며 마음에 안정적인 리듬 돌려주기',
    question: '누군가의 기준이 아니라 내 삶에서 진심으로 소중하게 여기는 가치는 무엇인가요?',
  },
  'major-06-lovers': {
    emotion: '어떤 선택이나 사람 앞에서 내 마음이 진심으로 끌리는지, 혹은 머뭇거리는지 느끼기',
    thought: '머리로 계산한 이유와 마음이 원하는 이유를 나란히 한 줄씩 적어 보기',
    relationship: '가까운 관계에서 솔직히 전하지 못했던 마음이나 고마움을 떠올려 보기',
    perspective: '옳고 그름의 문제를 넘어 “나다운 선택은 어느 쪽인가” 물어보기',
    selfCare: '억지로 맞추느라 지친 마음을 알아주고 나에게 솔직할 수 있는 여백 두기',
    question: '체면이나 눈치를 내려놓는다면, 내 진심은 어느 쪽을 향해 있나요?',
  },
  'major-07-chariot': {
    emotion: '앞으로 나아가려는 의욕과 멈추고 싶은 피로감 중 어느 쪽이 큰지 느껴보기',
    thought: '지금 내 에너지를 분산시키는 두 가지 요소와 집중할 한 가지를 정리해 보기',
    relationship: '서로 다른 속도를 가진 사람과의 호흡을 맞추며 내 페이스도 지켜보기',
    perspective: '빠르게 달리는 것보다 방향이 내 마음과 맞는지 확인하는 편이 중요함을 떠올리기',
    selfCare: '몰입한 시간 뒤에 짧은 스트레칭이나 물 한 잔으로 속도 조절하기',
    question: '지금 내가 애써 몰고 가려는 방향은 누구의 속도에 맞추어져 있나요?',
  },
  'major-08-strength': {
    emotion: '거친 감정이나 불안을 억누르기보다 부드럽게 달래며 바라보기',
    thought: '내가 스스로를 가장 엄격하게 대하던 순간을 떠올리고, 조금 너그러운 문장으로 바꿔 보기',
    relationship: '강하게 맞서기보다 차분하고 단단한 어조로 내 마음을 지키는 모습 그려보기',
    perspective: '버티는 힘만이 아니라, 흔들리면서도 다정함을 잃지 않는 태도를 강함으로 보기',
    selfCare: '오늘 하루 지친 마음을 손으로 감싸듯 스스로에게 수고했다는 말 건네기',
    question: '지금 내 안에서 가장 부드러운 인내와 다독임을 기다리는 부분은 무엇인가요?',
  },
  'major-09-hermit': {
    emotion: '바깥의 소음에서 벗어나 혼자 있을 때 비로소 올라오는 감정을 살펴보기',
    thought: '누구에게 보여주기 위한 글이 아니라, 오직 나만 읽을 솔직한 한 줄 적어 보기',
    relationship: '잠시 사람들과 거리를 두는 것이 단절이 아니라 숨 고르기임을 알아차리기',
    action: '혼자 생각할 수 있는 조용한 시간을 10~15분 정도 마련해 보기',
    perspective: '남들의 속도에서 잠시 빠져나와 지금 내 길에 비춘 작은 등불 하나만 보기',
    selfCare: '스마트폰을 잠시 멀리 두고 산책이나 조용한 차 마시기로 혼자만의 쉼 지키기',
    question: '외부의 답을 잠시 덮어둔다면, 지금 내 안의 고요한 목소리는 무엇을 말하고 있나요?',
    reversedPerspective: '혼자만의 동굴에 너무 오래 머물며 스스로를 고립시키고 있지는 않은지 살피기',
  },
  'major-10-wheel': {
    emotion: '예상치 못한 변화 앞에서 당황스러움과 기대감 중 어떤 감정이 먼저 드는지 살피기',
    thought: '지금 내 힘으로 바꿀 수 있는 부분과 흐름에 맡겨둘 부분을 가볍게 적어 보기',
    relationship: '우연히 이어진 대화나 만남 속에서 스쳐 지나간 의미 하나 떠올려 보기',
    perspective: '지금의 정체나 변동도 영원히 멈춰 있지 않고 다음 계절로 이어지는 과정으로 보기',
    selfCare: '변화 속에서 흔들리지 않도록 수면이나 식사 같은 기본 리듬 챙기기',
    question: '지금 내 삶에서 자연스럽게 바뀌어 가고 있는 흐름을 있는 그대로 받아들인다면 어떤가요?',
  },
  'major-11-justice': {
    emotion: '억울함, 미안함, 혹은 균형을 맞추고 싶은 마음이 내 안에 남아 있는지 살피기',
    thought: '감정적 추측과 실제 사실로 확인된 내용을 두 줄로 나누어 객관적으로 적어 보기',
    relationship: '상대에게만 엄격하거나 나에게만 가혹했던 기준이 없었는지 돌아보기',
    perspective: '누구의 탓을 가리기보다 지금 가장 공정하고 균형 잡힌 선택이 무엇인지 보기',
    selfCare: '지나친 죄책감이나 자책을 내려놓고 나 자신에게도 공정한 시선 건네기',
    question: '지금 이 상황에서 나 자신과 상대 모두에게 솔직하고 공정한 태도는 무엇일까요?',
  },
  'major-12-hanged-man': {
    emotion: '멈춰 선 듯한 답답함 속에서 오히려 새롭게 보이기 시작한 감각이 있는지 살피기',
    thought: '당장 풀리지 않는 고민 하나를 “지금은 숙성 중”이라고 이름 붙여 적어 보기',
    relationship: '상대의 입장을 거꾸로 내 자리에서 상상해 보며 굳어 있던 마음 풀어보기',
    perspective: '아무것도 못 하는 시간이 아니라 시선을 180도 돌려보는 멈춤의 시간으로 바라보기',
    selfCare: '무언가를 억지로 밀어붙이지 않고 잠시 눕거나 자세를 바꾸어 휴식하기',
    question: '이 상황을 정반대 방향에서 바라본다면, 지금의 멈춤은 나에게 무엇을 보여주고 있나요?',
  },
  'major-13-death': {
    emotion: '이미 끝났거나 달라진 것을 놓아줄 때 느껴지는 서운함과 홀가분함 함께 살피기',
    thought: '이제 내 일상에 맞지 않는 습관이나 미련 하나를 조용히 정리해 적어 보기',
    relationship: '예전과 달라진 관계의 거리감을 억지로 되돌리기보다 자연스럽게 받아들여 보기',
    perspective: '마무리는 상실로만 끝나는 것이 아니라 새로운 싹이 자랄 빈자리를 여는 일로 보기',
    selfCare: '오래 쌓여 있던 메신저 알림이나 책상 위 불필요한 물건 하나 비워내기',
    question: '이제 고마웠다고 인사하며 조용히 보내주어도 괜찮을 생각이나 역할은 무엇인가요?',
  },
  'major-14-temperance': {
    emotion: '마음이 한쪽으로 쏠려 지쳐 있지는 않은지, 감정의 온도 가만히 재어보기',
    thought: '극단적인 두 생각 사이에서 오늘 내가 택할 수 있는 부드러운 중간 지점 적어 보기',
    relationship: '다름을 억지로 없애기보다 서로의 온도가 섞이는 속도를 기다려 보기',
    perspective: '전부 아니면 전무라는 기준을 내려놓고 조금씩 섞이고 조율되는 흐름 믿어보기',
    selfCare: '뜨겁지도 차갑지도 않은 미지근한 물 한 잔 마시며 호흡 고르기',
    question: '지금 내 하루에서 조금 덜어내고, 조금 더 채워 넣으면 균형이 맞을 부분은 어디인가요?',
  },
  'major-15-devil': {
    emotion: '습관처럼 반복되면서도 마음을 무겁게 누르는 집착이나 불안이 무엇인지 살피기',
    thought: '“어쩔 수 없다”고 여겼던 생각 뒤에 내가 진짜 두려워하는 것이 무엇인지 적어 보기',
    relationship: '의무감이나 눈치 때문에 억지로 이어가며 지치게 되는 연결이 있는지 돌아보기',
    perspective: '나를 묶고 있는 줄이 사실은 언제든 조금 느슨하게 풀 수 있는 매듭일지 떠올려 보기',
    selfCare: '피곤할수록 찾게 되는 습관 대신, 5분만 몸을 움직이거나 창문을 열어 환기하기',
    question: '지금 내가 놓지 못하고 쥐고 있는 것 중, 사실은 나를 가장 지치게 하는 것은 무엇인가요?',
  },
  'major-16-tower': {
    emotion: '갑작스러운 변화나 깨달음 뒤의 놀람을 억지로 감추지 않고 그대로 인정해 주기',
    thought: '무너진 듯 보이지만, 그 덕분에 오히려 선명해진 진실 한 가지를 적어 보기',
    relationship: '겉치레로 유지되던 오해 대신 정말 중요한 관계가 무엇인지 돌아보기',
    perspective: '불안정한 껍데기가 벗겨진 자리에서 다시 튼튼한 바닥을 볼 수 있음을 기억하기',
    selfCare: '큰 파도가 지나간 날처럼 자극적인 정보를 줄이고 조용히 안정을 우선하기',
    question: '기존의 틀이 흔들리고 난 뒤, 오히려 가벼워지거나 선명해진 부분이 있다면 무엇인가요?',
  },
  'major-17-star': {
    emotion: '어두웠던 마음 한켠에 잔잔하게 스며드는 안도감이나 희망의 기색 느껴보기',
    thought: '최근 나에게 작은 희망이나 위로가 되었던 순간이나 문장 하나를 떠올려 적어 보기',
    relationship: '나를 조용히 믿어주거나 맑은 기운을 건네준 사람에게 마음속으로 감사 전하기',
    action: '최근 나에게 작은 희망이 되었던 순간 하나를 떠올려 보고 기록으로 남기기',
    perspective: '당장 큰 결과가 보이지 않아도, 멀리서 빛나는 별처럼 방향이 살아 있음을 믿어보기',
    selfCare: '밤하늘이나 창밖의 바람을 잠깐 바라보며 지친 마음에 맑은 숨 불어넣기',
    question: '크지 않아도 괜찮으니, 요즘 나를 다시 숨 쉬게 해주는 작은 빛은 무엇인가요?',
  },
  'major-18-moon': {
    emotion: '막연한 불안이나 모호함 때문에 커진 상상이 지금 내 기분을 흔들고 있는지 살피기',
    thought: '지금 걱정하는 일 중 실제 사실과 머릿속 상상을 나누어 짧게 적어 보기',
    relationship: '상대의 침묵이나 표정을 혼자 부정적으로 해석하고 있지는 않은지 돌아보기',
    perspective: '밤길의 그림자가 실제보다 커 보이듯, 불확실함은 밝아지면 자연히 작아짐을 떠올리기',
    selfCare: '생각이 꼬리를 무는 밤에는 조명을 낮추고 따뜻한 이불이나 음악으로 감각 달래기',
    question: '지금 나를 불안하게 만드는 그림자 중, 사실 아직 일어나지 않은 일은 무엇인가요?',
  },
  'major-19-sun': {
    emotion: '마음이 밝아지거나 솔직하게 웃을 수 있었던 소박한 기쁨의 감각 떠올리기',
    thought: '오늘 나를 미소 짓게 했거나 감사하게 만든 작고 선명한 일 한 가지 적어 보기',
    relationship: '가까운 사람과 꾸밈없이 나눌 수 있는 가볍고 따뜻한 이야기 하나 떠올리기',
    perspective: '어렵게 꼬아 생각하기보다, 지금 내 앞에 있는 단순하고 맑은 기쁨을 그대로 누려보기',
    selfCare: '잠시라도 햇살 아래를 걷거나 밝은 빛이 드는 자리에서 깊게 숨 들이마시기',
    question: '애쓰지 않아도 자연스럽게 내 마음이 환해지는 순간은 언제인가요?',
  },
  'major-20-judgement': {
    emotion: '과거의 나를 탓하던 마음이 조금 누그러지고 새로운 부름이 들리는지 살피기',
    thought: '예전의 실수나 후회 하나를 꺼내어 “그때는 그게 최선이었다”고 다시 써보기',
    relationship: '마음속에 오래 미뤄 둔 화해나 용서가 필요한 대상(나 자신 포함)을 떠올리기',
    perspective: '지나간 일을 심판하는 자리가 아니라, 지난 경험이 내게 건네는 깨달음을 듣는 순간으로 보기',
    selfCare: '묵은 짐을 털어내듯 오래된 메모나 걱정을 정리하고 가벼운 산책하기',
    question: '지금까지의 나를 지나, 이제 새롭게 응답해 보고 싶은 내 안의 부름은 무엇인가요?',
  },
  'major-21-world': {
    emotion: '한 시기를 지나오며 느낀 충만함과 동시에 느껴지는 다음 여정의 기운 살피기',
    thought: '최근 내가 마무리했거나 한 바퀴 잘 돌아온 경험 한 가지를 적어 스스로 격려하기',
    relationship: '그동안 함께 걸어온 주변 사람들과 연결되어 있음에 조용히 감사 느껴보기',
    perspective: '완벽한 끝이 아니라, 지금까지의 모든 조각이 제자리를 찾은 온전한 순환으로 바라보기',
    selfCare: '한 매듭을 지은 나에게 조용하고 근사한 휴식 시간 선물하기',
    question: '지금까지 걸어온 시간을 하나의 이야기로 묶는다면, 어떤 이름을 붙여주고 싶나요?',
  },
  'minor-swords-02': {
    emotion: '결정을 내리지 못한 채 마음이 팽팽하게 맞서 있을 때의 피로감 알아차리기',
    thought: '양쪽 선택지가 각각 내게 지켜주려는 것이 무엇인지 한 단어씩 나란히 적어 보기',
    relationship: '상대에게 상처를 주지 않으려다 내 마음의 기준까지 가리고 있지는 않은지 살피기',
    action: '미뤄 둔 선택에서 내가 망설이는 이유를 한 줄로 가볍게 살펴보기',
    perspective: '눈가리개를 벗듯 “두 선택지 모두 완벽할 수 없음”을 인정하며 마음 가볍게 하기',
    selfCare: '결정을 당장 재촉하지 말고, 10분간 생각 스위치를 끄고 눈을 감아 쉬기',
    question: '두 선택지 중 어느 쪽이 두려워서라기보다, 정말 알고 싶지 않았던 진실은 무엇인가요?',
  },
  'minor-cups-03': {
    emotion: '함께 나누었을 때 마음이 환해졌던 기쁨이나 연결감을 떠올리며 미소 지어보기',
    thought: '내 주변에서 고마움을 느꼈던 얼굴 한두 명과 그 이유를 짧게 적어 보기',
    relationship: '최근 나와 편안한 시간을 함께 보내준 이들의 얼굴을 떠올리며 연결감 느껴보기',
    action: '고마운 사람 한 명에게 부담 없는 짧은 안부 전해보기',
    perspective: '혼자 다 짊어지지 않아도 기쁨과 마음을 나눌 수 있는 곁이 있음을 기억하기',
    selfCare: '좋아하는 사람과 나누고 싶은 차, 음악, 풍경 하나 떠올리며 마음 데우기',
    question: '요즘 내 일상에 작은 웃음이나 온기를 더해 준 사람은 누구인가요?',
  },
  'minor-pentacles-09': {
    emotion: '지금까지 묵묵히 쌓아 온 시간 덕분에 느끼는 잔잔한 자부심과 여유 살펴보기',
    thought: '요즘 내가 스스로 꾸려 가며 잔잔한 여유를 느끼는 일상의 조각 하나 적어 보기',
    relationship: '남과 비교하지 않고 나만의 속도와 정원을 가꾸어 온 시간을 인정해 주기',
    action: '지금까지 스스로 해낸 일 한 가지를 돌아보고 조용히 인정해 주기',
    perspective: '더 채워야만 인정받는 것이 아니라, 이미 가꾼 정원을 누릴 자격이 있음을 바라보기',
    selfCare: '오롯이 나 자신을 위해 정성스러운 식사나 편안한 시간 선물하기',
    question: "누구의 평가가 아니라 나 스스로 '참 잘 가꾸어 왔다'고 말해주고 싶은 것은 무엇인가요?",
  },
};

type SuitProfileFn = (
  cardName: string,
  kw0: string,
  kw1: string,
  question: string,
  isRev: boolean
) => string;

interface SuitProfileSet {
  emotion: SuitProfileFn;
  thought: SuitProfileFn;
  relationship: SuitProfileFn;
  perspective: SuitProfileFn;
  selfCare: SuitProfileFn;
  question: SuitProfileFn;
}

const SUIT_PROFILES_BY_LANG: Record<
  Language,
  Record<TarotSuit, SuitProfileSet>
> = {
  ko: {
    wands: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’ 앞에서 주춤거리거나 지쳐 있는 내 마음의 온도를 다정하게 살펴보기`
          : `‘${kw0}’과 관련해 지금 내 안에 올라오는 의욕이나 설렘의 크기를 느껴보기`,
      thought: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${name}」가 비추는 ‘${kw0}’의 부담을 줄이고, ‘지금은 속도 조절 중’이라 적어 보기`
          : `「${name}」가 비추는 ${particle(kw0, '을/를')} 떠올리며 해보고 싶은 작은 시도 한 문장 정리하기`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `타인의 속도에 흔들리지 않고 ‘${kw1}’에 관한 내 호흡과 거리감 살펴보기`
          : `‘${kw1}’과 관련해 나에게 긍정적인 자극이나 응원을 준 사람의 말 떠올려 보기`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’의 불씨가 꺼진 것이 아니라 다시 모으기 위해 잠시 쉬어가는 시기일 수 있음을 바라보기`
          : `크게 완성해야 한다는 부담을 내려놓고, ‘${kw1}’처럼 작게 시작할 수 있는 면 찾아보기`,
      selfCare: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’을 향한 조급함을 내려놓고 15분 정도 아무것도 하지 않는 충전의 여백 두기`
          : `몸을 가볍게 움직이거나 기지개를 켜며 ‘${kw0}’의 답답한 에너지 풀어주기`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    cups: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `겉으로는 괜찮아 보이지만 속으로 눌러두었던 ${particle(kw0, '과/와')} 관련된 감정 알아차리기`
          : `지금 내 마음에 흐르고 있는 ${particle(kw0, '을/를')} 판단 없이 있는 그대로 느껴보기`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `「${name}」처럼 마음이 예민하거나 서운했던 순간을 한 문장으로 적어 감정에 이름 붙여 보기`
          : `‘${kw1}’이 가장 편안하고 따뜻하게 머물렀던 기억 하나를 짧게 적어 보기`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’ 때문에 다른 사람의 감정을 대신 짊어지느라 내 마음을 놓쳤는지 돌아보기`
          : `‘${kw1}’의 온기를 나누고 싶은 사람이나 고마운 마음 하나 떠올려 보기`,
      perspective: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’ 앞에서 마음이 흔들리는 순간을 약함이 아니라 소중한 신호로 바라보기`
          : `합리적 이유만으로 설명되지 않는 ‘${kw0}’의 마음결도 충분히 존중할 가치가 있음을 떠올리기`,
      selfCare: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’으로 지친 나를 위해 따뜻한 물이나 포근한 휴식으로 마음의 그릇 비워주기`
          : `좋아하는 음악을 들으며 ‘${kw1}’을 품고 수고한 내 마음에 다정한 말 건네기`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    swords: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’ 때문에 생각이 많아져 머리가 무겁거나 날이 서 있던 마음 가만히 살피기`
          : `‘${kw0}’이라는 주제 앞에서 지금 내 안에 드는 솔직한 긴장감이나 개운함 느끼기`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `「${name}」가 비추는 걱정을 종이나 메모에 꺼내어 사실과 추측으로 한 줄씩 나누어 보기`
          : `‘${kw1}’을 두고 복잡하게 얽힌 생각을 덜어낸 핵심 한 문장 추려 적어 보기`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’으로 거리를 두고 싶었던 대화에서 내가 진짜 원했던 배려 살펴보기`
          : `‘${kw1}’과 관련해 상대의 말 이면에 담긴 진짜 의도를 차분히 헤아려 보기`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’을 반드시 흑백으로 결론 내리지 않고, 회색의 여백을 둔 채 지켜보는 시선 가져보기`
          : `감정에 휩쓸리기보다 ‘${kw1}’을 한 발짝 떨어져 바라보는 관찰자의 시선 빌려오기`,
      selfCare: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’으로 이어지는 생각의 소음을 잠시 멈추고 창밖을 보며 천천히 숨 내쉬기`
          : `「${name}」의 복잡한 생각에서 잠깐 벗어나 단순한 집안일이나 짧은 산책으로 머리 식히기`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    pentacles: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’에 대한 조바심 때문에 지금 누릴 수 있는 평온을 놓치고 있지는 않은지 살피기`
          : `‘${kw0}’ 속에서 내가 느끼는 현실적인 든든함이나 작은 부담감 알아차리기`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `「${name}」의 무게를 덜어 오늘 할 몫과 내일로 미룰 몫을 가볍게 나누어 적어 보기`
          : `일상 속에서 ‘${kw1}’과 관련해 내가 묵묵히 쌓아온 작은 결실 한 줄 기록하기`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’을 혼자 다 해내야 한다는 부담을 내려놓고, 의지할 수 있는 곁 떠올려 보기`
          : `‘${kw1}’의 일상을 함께 지탱해 주거나 실용적 도움을 준 사람에게 고마움 느끼기`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `빠른 변화가 보이지 않더라도 ‘${kw0}’의 자리에서 조용히 뿌리를 다지는 시간일 수 있음을 믿어보기`
          : `큰 도약보다 매일 반복되는 ‘${kw1}’의 소소한 돌봄이 나를 지키는 힘임을 바라보기`,
      selfCare: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `‘${kw0}’에 매달리느라 미룬 식사, 수면, 휴식 중 하나를 오늘 우선 챙기기`
          : `「${name}」의 기운처럼 내 책상이나 방 한쪽을 정돈하고, 몸이 편안해지는 따뜻한 한 끼 챙겨 먹기`,
      question: (_n, _kw0, _kw1, q) => q,
    },
  },
  en: {
    wands: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Notice gently where you feel hesitant or weary around "${kw0}" right now`
          : `Sense how much spark or quiet eagerness is rising inside you around "${kw0}"`,
      thought: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Ease the weight of "${kw0}" shown in ${name} by writing: "Right now I am adjusting my pace"`
          : `With ${name} illuminating "${kw0}", write one short line about a small step you feel curious to try`,
      relationship: (_n, _kw0, kw1, _q, isRev) =>
        isRev
          ? `Notice your own breathing room and distance around "${kw1}" instead of rushing to match others’ speed`
          : `Recall one encouraging word or spark someone shared with you around "${kw1}"`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `Remember the ember of "${kw0}" has not gone out—it may simply be gathering warmth in quiet rest`
          : `Drop the pressure to finish everything big and look for a tiny way to start with "${kw1}"`,
      selfCare: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Set aside urgency around "${kw0}" and claim 15 minutes of unscheduled rest to recharge`
          : `Stretch gently or move around lightly to loosen pent-up tension around "${kw0}"`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    cups: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Notice quietly what feelings around "${kw0}" you have been smoothing over on the surface`
          : `Feel whatever quiet tide of "${kw0}" is moving through your heart right now without judging it`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `Name one moment that felt tender or bruised—as reflected in ${name}—in a single honest sentence`
          : `Write down one warm memory where "${kw1}" felt especially safe and effortless`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `Check whether carrying someone else’s mood around "${kw0}" left your own heart unattended`
          : `Bring to mind someone with whom you want to share warmth or gratitude around "${kw1}"`,
      perspective: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `View a moment of emotional wavering before "${kw0}" not as weakness, but as an honest signal`
          : `Honor feelings around "${kw0}" as worthy of care even when logic cannot neatly explain them`,
      selfCare: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `Pour a glass of warm water or rest comfortably to soothe a heart worn thin by "${kw0}"`
          : `Listen to comforting music and offer yourself a gentle word for carrying "${kw1}"`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    swords: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Notice gently if overthinking around "${kw0}" has left your head heavy or on edge`
          : `Feel the honest tension or crisp relief surfacing around "${kw0}" right now`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `Put the worries stirred by ${name} onto paper in two brief lines: known facts vs. guesses`
          : `Distill tangled thoughts around "${kw1}" into one clear, plain sentence`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `In a conversation you wanted to step back from around "${kw0}", look at what care you truly needed`
          : `Consider calmly the quiet intention behind someone’s words around "${kw1}"`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `Instead of forcing "${kw0}" into strict black-and-white today, allow room for gray nuances`
          : `Borrow a calm observer’s distance to look at "${kw1}" from one step back`,
      selfCare: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Pause the mental chatter around "${kw0}", look out a window, and exhale slowly`
          : `Step out of ${name}’s heavy thoughts for a moment with a simple chore or short walk`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    pentacles: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Check if impatience over "${kw0}" has kept you from noticing the calm already here`
          : `Notice the quiet steadiness—or small practical weight—you feel inside "${kw0}"`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `Lighten the load of ${name} by separating what belongs to today from what can wait until tomorrow`
          : `Jot down one small everyday fruit you have steadily nurtured around "${kw1}"`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `Release the pressure to handle "${kw0}" solo and think of one person or place you can lean on`
          : `Notice quiet gratitude for someone who steadies your day or helps practically with "${kw1}"`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `Even without rapid results visible yet, trust this season of quietly putting down roots in "${kw0}"`
          : `See that steady daily tending around "${kw1}" protects you more than dramatic leaps`,
      selfCare: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `Prioritize one basic need—a proper meal, sleep, or rest—you postponed while chasing "${kw0}"`
          : `In the grounded spirit of ${name}, tidy one corner of your desk and nourish yourself warmly`,
      question: (_n, _kw0, _kw1, q) => q,
    },
  },
  ja: {
    wands: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」を前にためらったり少し疲れたりしている心の温度を、やさしく確かめてみる`
          : `「${kw0}」に関して、今自分の中に湧いてくる意欲やときめきの大きさを感じてみる`,
      thought: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${name}」が映す「${kw0}」の気負いを緩め、「今はペース調整中」と書いてみる`
          : `「${name}」が照らす「${kw0}」を思い浮かべ、試してみたい小さな一歩を一文にまとめてみる`,
      relationship: (_n, _kw0, kw1, _q, isRev) =>
        isRev
          ? `他人の速さに揺さぶられず、「${kw1}」に関する自分の呼吸と距離感を確かめてみる`
          : `「${kw1}」について、自分に心地よい刺激や応援をくれた人の言葉を思い出してみる`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」の火が消えたのではなく、再び力を集めるために少し休む時期なのかもしれないと見つめてみる`
          : `立派にやり遂げる重荷をおろし、「${kw1}」のように小さく始められる面を探してみる`,
      selfCare: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」への焦りをいったんおろし、15分ほど何もしない充電の余白をつくる`
          : `軽く体を動かしたり伸びをしたりして、「${kw0}」の滞った空気をほぐしてみる`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    cups: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `表向きは平気そうに見えても、心の奥に押し込めていた「${kw0}」にまつわる感情に気づいてみる`
          : `今あなたの心に流れている「${kw0}」という感覚を、評価せずそのまま感じてみる`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `「${name}」のように心が敏感になったり寂しかったりした瞬間を一文で書き、感情に名前をつけてみる`
          : `「${kw1}」がいちばん心地よく温かく息づいていた記憶をひとつ短く書いてみる`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」のせいで誰かの感情まで代わりに背負い込み、自分の心を置き去りにしていないか振り返る`
          : `「${kw1}」の温もりを分かち合いたい人や、感謝を向けたい相手をひとり思い浮かべてみる`,
      perspective: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」の前で心が揺れる瞬間を弱さではなく、大切なサインとして眺めてみる`
          : `理屈だけでは説明しきれない「${kw0}」の心の揺れも、十分に敬う価値があると思い出してみる`,
      selfCare: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」で疲れた自分のために、温かい飲み物や穏やかな休息で心の器を空けてあげる`
          : `好きな音楽を聴きながら、「${kw1}」を抱えてよくやってきた自分へやさしい言葉をかけてみる`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    swords: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」のことで考えすぎて頭が重くなったり尖っていたりした心をそっと見つめてみる`
          : `「${kw0}」というテーマを前に、今自分の中に浮かぶ正直な緊張感やすっきり感を感じてみる`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `「${name}」が映す心配を紙やメモに出し、事実と推測で一行ずつ分けてみる`
          : `「${kw1}」をめぐって絡まっていた考えをほどき、核心の一文だけを書き出してみる`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」で距離を置きたくなった会話の中で、自分が本当に望んでいた配慮は何だったか見つめる`
          : `「${kw1}」に関して、相手の言葉の裏にある本当の意図を落ち着いて汲み取ってみる`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」を白黒はっきり結論づけず、灰色の余白を残したまま見守るまなざしを持ってみる`
          : `感情に巻き込まれるより、「${kw1}」を一歩離れて眺める観察者の視点を借りてみる`,
      selfCare: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」へと続く思考の雑音を少し止め、窓の外を眺めながらゆっくり息を吐く`
          : `「${name}」の複雑な思考から少し離れ、簡単な片づけや短い散歩で頭を冷やしてみる`,
      question: (_n, _kw0, _kw1, q) => q,
    },
    pentacles: {
      emotion: (_n, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」への焦りのせいで、今味わえるはずの穏やかさを見逃していないか確かめてみる`
          : `「${kw0}」の中で自分が感じている現実的な安心感や小さな負担に気づいてみる`,
      thought: (name, _kw0, kw1, _q, isRev) =>
        isRev
          ? `「${name}」の重みを軽くするために、今日やることと明日に回すことを分けて書いてみる`
          : `日々の中で「${kw1}」に関して自分が静かに積み上げてきた小さな実りを一行残してみる`,
      relationship: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」をひとりで全部抱えなければという重荷をおろし、頼れるそばの人を思い浮かべてみる`
          : `「${kw1}」の日々を一緒に支えてくれたり、実務的に助けてくれたりした人へ感謝を感じてみる`,
      perspective: (_n, kw0, kw1, _q, isRev) =>
        isRev
          ? `すぐ目に見える変化がなくても、「${kw0}」の場所で静かに根を張る時間なのかもしれないと信じてみる`
          : `大きな飛躍よりも、毎日続く「${kw1}」のささやかなケアが自分を守る力だと見つめてみる`,
      selfCare: (name, kw0, _kw1, _q, isRev) =>
        isRev
          ? `「${kw0}」に追われて後回しにしていた食事・睡眠・休息のうちひとつを今日優先して整える`
          : `「${name}」の落ち着きのように机や部屋の片隅を整え、身体がほっとする温かな一食をとる`,
      question: (_n, _kw0, _kw1, q) => q,
    },
  },
};

function getCustomAngle(cardId: string, language: Language): Partial<CardAngle> | undefined {
  if (language === 'ko') {
    return CARD_SPECIFIC_ANGLES[cardId];
  }
  return CARD_SPECIFIC_ANGLES_I18N[cardId]?.[language];
}

function getMajorDefaultAngle(
  card: TarotCard,
  isRev: boolean,
  language: Language
): Omit<CardAngle, 'action' | 'reversedPerspective' | 'reversedSelfCare'> {
  const custom = isRev ? undefined : getCustomAngle(card.id, language);
  const revCustom = isRev ? getCustomAngle(card.id, language) : undefined;
  const orientation = isRev ? 'reversed' : 'upright';
  const loc = getLocalizedCard(card, language, orientation);
  const kw0 = loc.keywords[0] || loc.displayName;
  const kw1 = loc.keywords[1] || kw0;

  if (language === 'en') {
    return {
      emotion:
        custom?.emotion ??
        (isRev
          ? `Notice slowly how "${kw0}" of ${loc.displayName} feels inside you right now`
          : `Notice what feeling surfaces right now in front of "${kw0} · ${kw1}" from ${loc.displayName}`),
      thought:
        custom?.thought ??
        (isRev
          ? `Write one honest line about where "${kw0}" or "${kw1}" feels tangled or held back today`
          : `Write one brief line naming the first thought or word that surfaced while reading ${loc.displayName}`),
      relationship:
        custom?.relationship ??
        (isRev
          ? `Notice quietly whether "${kw0}" has made you pull back or push too hard with someone nearby`
          : `Bring to mind one recent moment with people around you that felt touched by "${kw0}"`),
      perspective:
        revCustom?.reversedPerspective ??
        custom?.perspective ??
        (isRev
          ? `Step back a pace from forcing outcomes and check what "${kw1}" asks of your pace today`
          : `Look once more at a familiar situation through the fresh lens of "${kw1}"`),
      selfCare:
        revCustom?.reversedSelfCare ??
        custom?.selfCare ??
        `Set aside just five unhurried minutes today to breathe steadily without rushing yourself`,
      question: custom?.question ?? loc.reflectionQuestion,
    };
  }

  if (language === 'ja') {
    return {
      emotion:
        custom?.emotion ??
        (isRev
          ? `「${loc.displayName}」の「${kw0}」が、今心の中でどんな引っかかりや余韻として響いているかゆっくり確かめてみる`
          : `「${loc.displayName}」が映す「${kw0} · ${kw1}」の前で、今心の中に浮かんでくる感情に気づいてみる`),
      thought:
        custom?.thought ??
        (isRev
          ? `「${kw0}」や「${kw1}」をめぐって今の自分が気負っていたり抱え込んだりしている思いを、一文で整理してみる`
          : `「${loc.displayName}」のメッセージを読みながら最初に浮かんだ考えや言葉を、一文で整理してみる`),
      relationship:
        custom?.relationship ??
        (isRev
          ? `周囲の人との関わりの中で、「${kw0}」から距離を取ったり無理に抱え込んだりしていないか振り返ってみる`
          : `周囲の人との関わりの中で、「${kw0}」に関して最近心に残っていた場面をひとつ思い出してみる`),
      perspective:
        revCustom?.reversedPerspective ??
        custom?.perspective ??
        (isRev
          ? `すぐに外へ押し進めようとせず、一歩引いて「${kw1}」の視点から今の自分のペースを見つめ直してみる`
          : `見慣れた状況を、「${kw1}」という新しいレンズを通してもっと静かに眺め直してみる`),
      selfCare:
        revCustom?.reversedSelfCare ??
        custom?.selfCare ??
        `今日一日の中で5分だけでも自分を急かさず、心地よく息を整える時間をつくってみる`,
      question: custom?.question ?? loc.reflectionQuestion,
    };
  }

  return {
    emotion:
      custom?.emotion ??
      (isRev
        ? `「${loc.displayName}」의 ${particle(kw0, '이/가')} 내 안에서 어떤 망설임이나 피로로 느껴지는지 천천히 살피기`
        : `「${loc.displayName}」가 비추는 ‘${kw0} · ${kw1}’ 앞에서 지금 내 마음에 올라오는 감정 알아차리기`),
    thought:
      custom?.thought ??
      (isRev
        ? `‘${kw0}’이나 ‘${kw1}’ 앞에서 지금 내가 유독 애쓰거나 머뭇거리고 있는 마음을 한 문장으로 적어 보기`
        : `「${loc.displayName}」의 메시지를 읽으며 가장 먼저 떠오른 생각이나 단어를 한 문장으로 정리해 보기`),
    relationship:
      custom?.relationship ??
      (isRev
        ? `주변 사람들과의 관계 속에서 ‘${kw0}’ 때문에 움츠러들거나 혼자 다 감당하려 하지는 않았는지 돌아보기`
        : `주변 사람들과의 관계 속에서 ‘${kw0}’과 관련해 요즘 마음 쓰였던 장면 하나 떠올려 보기`),
    perspective:
      revCustom?.reversedPerspective ??
      custom?.perspective ??
      (isRev
        ? `당장 바깥으로 밀어붙이기보다 한 걸음 물러나 ‘${kw1}’의 시선으로 내면의 속도를 다시 살펴보기`
        : `익숙한 상황을 ‘${kw1}’이라는 새로운 렌즈로 한 번 더 바라보기`),
    selfCare:
      revCustom?.reversedSelfCare ??
      custom?.selfCare ??
      `오늘 하루 중 5분만이라도 나를 재촉하지 않고 편안하게 숨 고르는 시간 마련하기`,
    question: custom?.question ?? loc.reflectionQuestion,
  };
}

function getSuitAngle(
  card: TarotCard,
  isRev: boolean,
  language: Language
): Omit<CardAngle, 'action' | 'reversedPerspective' | 'reversedSelfCare'> {
  const custom = isRev ? undefined : getCustomAngle(card.id, language);
  const revCustom = isRev ? getCustomAngle(card.id, language) : undefined;
  const orientation = isRev ? 'reversed' : 'upright';
  const loc = getLocalizedCard(card, language, orientation);
  const suit: TarotSuit = card.suit ?? 'pentacles';
  const profile = SUIT_PROFILES_BY_LANG[language][suit];
  const kw0 = loc.keywords[0] || loc.displayName;
  const kw1 = loc.keywords[1] || kw0;

  return {
    emotion:
      custom?.emotion ??
      profile.emotion(loc.displayName, kw0, kw1, loc.reflectionQuestion, isRev),
    thought:
      custom?.thought ??
      profile.thought(loc.displayName, kw0, kw1, loc.reflectionQuestion, isRev),
    relationship:
      custom?.relationship ??
      profile.relationship(
        loc.displayName,
        kw0,
        kw1,
        loc.reflectionQuestion,
        isRev
      ),
    perspective:
      revCustom?.reversedPerspective ??
      custom?.perspective ??
      profile.perspective(
        loc.displayName,
        kw0,
        kw1,
        loc.reflectionQuestion,
        isRev
      ),
    selfCare:
      revCustom?.reversedSelfCare ??
      custom?.selfCare ??
      profile.selfCare(loc.displayName, kw0, kw1, loc.reflectionQuestion, isRev),
    question:
      custom?.question ??
      profile.question(loc.displayName, kw0, kw1, loc.reflectionQuestion, isRev),
  };
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

type AngleKey =
  | 'emotion'
  | 'thought'
  | 'perspective'
  | 'action'
  | 'relationship'
  | 'selfcare'
  | 'question';

const SINGLE_CARD_PATTERNS: Record<string, AngleKey[][]> = {
  cups: [
    ['emotion', 'relationship', 'thought', 'selfcare'],
    ['emotion', 'perspective', 'selfcare', 'question'],
    ['emotion', 'action', 'relationship', 'thought'],
  ],
  swords: [
    ['thought', 'perspective', 'emotion', 'question'],
    ['emotion', 'thought', 'action', 'selfcare'],
    ['perspective', 'thought', 'relationship', 'question'],
  ],
  wands: [
    ['action', 'emotion', 'perspective', 'thought'],
    ['emotion', 'action', 'selfcare', 'question'],
    ['perspective', 'action', 'relationship', 'thought'],
  ],
  pentacles: [
    ['action', 'selfcare', 'thought', 'relationship'],
    ['emotion', 'action', 'selfcare', 'perspective'],
    ['thought', 'selfcare', 'action', 'question'],
  ],
  major: [
    ['emotion', 'perspective', 'action', 'selfcare'],
    ['thought', 'emotion', 'relationship', 'question'],
    ['action', 'thought', 'perspective', 'selfcare'],
    ['emotion', 'question', 'action', 'relationship'],
  ],
  reversed: [
    ['emotion', 'perspective', 'action', 'selfcare'],
    ['thought', 'action', 'selfcare', 'question'],
    ['selfcare', 'action', 'emotion', 'perspective'],
  ],
};

function formatPrimaryAction(
  card: TarotCard,
  isRev: boolean,
  language: Language
): string {
  const loc = getLocalizedCard(
    card,
    language,
    isRev ? 'reversed' : 'upright'
  );
  if (isRev) {
    return loc.gentleAction;
  }
  const custom = getCustomAngle(card.id, language);
  return custom?.action || loc.gentleAction;
}

function formatQuestionAttempt(questionText: string, language: Language): string {
  if (language === 'en') {
    return `Sit quietly for a moment asking yourself: "${questionText}"`;
  }
  if (language === 'ja') {
    return `「${questionText}」と自分自身にそっと問いかけて少し留まってみる`;
  }
  return `“${questionText}” 스스로에게 묻고 잠깐 머물러 보기`;
}

function buildSingleCardPool(
  card: TarotCard,
  isRev: boolean,
  language: Language
): Record<AngleKey, { categoryLabel: string; actionText: string }> {
  const angle =
    card.arcana === 'minor'
      ? getSuitAngle(card, isRev, language)
      : getMajorDefaultAngle(card, isRev, language);
  const labels = CATEGORY_LABELS[language];

  return {
    emotion: {
      categoryLabel: labels.emotion,
      actionText: angle.emotion,
    },
    thought: {
      categoryLabel: labels.thought,
      actionText: angle.thought,
    },
    perspective: {
      categoryLabel: labels.perspective,
      actionText: angle.perspective,
    },
    action: {
      categoryLabel: labels.action,
      actionText: formatPrimaryAction(card, isRev, language),
    },
    relationship: {
      categoryLabel: labels.relationship,
      actionText: angle.relationship,
    },
    selfcare: {
      categoryLabel: labels.relationship,
      actionText: angle.selfCare,
    },
    question: {
      categoryLabel: labels.question,
      actionText: formatQuestionAttempt(angle.question, language),
    },
  };
}

/**
 * Generate exactly 4 personalized, non-prescriptive selectable attempts tailored to
 * the drawn card(s), upright/reversed orientations, card symbolism, and overall synthesis.
 */
export function generatePersonalizedAttempts(
  cards: TarotCard[],
  orientations: ('upright' | 'reversed')[],
  overallMessage?: string,
  language: Language = 'ko'
): SelectedAttemptItem[] {
  if (cards.length === 0) return [];

  if (cards.length === 1) {
    const card = cards[0];
    const isRev = orientations[0] === 'reversed';
    const orientation = isRev ? 'reversed' : 'upright';
    const loc = getLocalizedCard(card, language, orientation);
    const orientKey = isRev ? 'rev' : 'up';
    const pool = buildSingleCardPool(card, isRev, language);

    const patternGroup = isRev
      ? SINGLE_CARD_PATTERNS.reversed
      : card.arcana === 'major'
      ? SINGLE_CARD_PATTERNS.major
      : SINGLE_CARD_PATTERNS[card.suit ?? 'pentacles'];

    const seed = hashSeed(`${card.id}:${orientKey}`);
    const chosenKeys = patternGroup[seed % patternGroup.length];

    const fallbackOrder: AngleKey[] = [
      'emotion',
      'thought',
      'action',
      'selfcare',
      'perspective',
      'relationship',
      'question',
    ];
    const picked: AngleKey[] = [];
    const seenText = new Set<string>();
    const seenCategories = new Set<string>();

    for (const k of [...chosenKeys, ...fallbackOrder]) {
      if (picked.length >= 4) break;
      const entry = pool[k];
      if (seenText.has(entry.actionText)) continue;
      if (seenCategories.has(entry.categoryLabel) && picked.length < 3) continue;
      picked.push(k);
      seenText.add(entry.actionText);
      seenCategories.add(entry.categoryLabel);
    }

    return picked.map((key, idx) => {
      const entry = pool[key];
      return {
        attemptId: `${card.id}::${orientKey}::${key}::${idx}`,
        categoryLabel: entry.categoryLabel,
        cardId: card.id,
        cardName: loc.displayName,
        actionText: entry.actionText,
      };
    });
  }

  // Multi-card (3-card) reading
  const c0 = cards[0];
  const c1 = cards[1] ?? cards[0];
  const c2 = cards[2] ?? cards[0];
  const rev0 = orientations[0] === 'reversed';
  const rev1 = orientations[1] === 'reversed';
  const rev2 = orientations[2] === 'reversed';

  const loc0 = getLocalizedCard(c0, language, rev0 ? 'reversed' : 'upright');
  const loc1 = getLocalizedCard(c1, language, rev1 ? 'reversed' : 'upright');
  const loc2 = getLocalizedCard(c2, language, rev2 ? 'reversed' : 'upright');

  const angle0 =
    c0.arcana === 'minor'
      ? getSuitAngle(c0, rev0, language)
      : getMajorDefaultAngle(c0, rev0, language);
  const angle1 =
    c1.arcana === 'minor'
      ? getSuitAngle(c1, rev1, language)
      : getMajorDefaultAngle(c1, rev1, language);
  const angle2 =
    c2.arcana === 'minor'
      ? getSuitAngle(c2, rev2, language)
      : getMajorDefaultAngle(c2, rev2, language);

  const flowSeed = hashSeed(
    cards.map((c, i) => `${c.id}:${orientations[i] ?? 'upright'}`).join('|')
  );

  const labels = CATEGORY_LABELS[language];
  const positions = THREE_CARD_POSITIONS_BY_LANG[language];

  const firstItem: SelectedAttemptItem =
    flowSeed % 2 === 0
      ? {
          attemptId: `spread::0::emotion::${c0.id}::${rev0 ? 'rev' : 'up'}`,
          categoryLabel: labels.emotion,
          cardId: c0.id,
          cardName: loc0.displayName,
          positionLabel: positions[0],
          actionText: angle0.emotion,
        }
      : {
          attemptId: `spread::0::thought::${c0.id}::${rev0 ? 'rev' : 'up'}`,
          categoryLabel: labels.emotion,
          cardId: c0.id,
          cardName: loc0.displayName,
          positionLabel: positions[0],
          actionText: angle0.thought,
        };

  const secondItem: SelectedAttemptItem =
    rev1 || flowSeed % 3 === 1
      ? {
          attemptId: `spread::1::perspective::${c1.id}::${rev1 ? 'rev' : 'up'}`,
          categoryLabel: labels.thought,
          cardId: c1.id,
          cardName: loc1.displayName,
          positionLabel: positions[1],
          actionText: angle1.perspective,
        }
      : {
          attemptId: `spread::1::relationship::${c1.id}::${rev1 ? 'rev' : 'up'}`,
          categoryLabel: labels.relationship,
          cardId: c1.id,
          cardName: loc1.displayName,
          positionLabel: positions[1],
          actionText: angle1.relationship,
        };

  const thirdItem: SelectedAttemptItem = rev2
    ? {
        attemptId: `spread::2::action::${c2.id}::rev`,
        categoryLabel: labels.action,
        cardId: c2.id,
        cardName: loc2.displayName,
        positionLabel: positions[2],
        actionText: loc2.gentleAction || angle2.selfCare,
      }
    : {
        attemptId: `spread::2::action::${c2.id}::up`,
        categoryLabel: labels.action,
        cardId: c2.id,
        cardName: loc2.displayName,
        positionLabel: positions[2],
        actionText: getCustomAngle(c2.id, language)?.action || loc2.gentleAction,
      };

  const hasOverallContext = Boolean(overallMessage?.trim());
  const synthesisItem = buildSynthesisAttemptItem(
    flowSeed % 2 === 0 ? 'flow' : 'question',
    c0,
    c1,
    c2,
    hasOverallContext,
    language,
    [
      rev0 ? 'reversed' : 'upright',
      rev1 ? 'reversed' : 'upright',
      rev2 ? 'reversed' : 'upright',
    ]
  );

  return [firstItem, secondItem, thirdItem, synthesisItem];
}

function buildSynthesisAttemptItem(
  kind: 'flow' | 'question',
  c0: TarotCard,
  c1: TarotCard,
  c2: TarotCard,
  hasOverallContext: boolean,
  language: Language,
  orientations: ('upright' | 'reversed')[] = ['upright', 'upright', 'upright']
): SelectedAttemptItem {
  const o0 = orientations[0] ?? 'upright';
  const o1 = orientations[1] ?? 'upright';
  const o2 = orientations[2] ?? 'upright';
  const loc0 = getLocalizedCard(c0, language, o0);
  const loc1 = getLocalizedCard(c1, language, o1);
  const loc2 = getLocalizedCard(c2, language, o2);
  const labels = CATEGORY_LABELS[language];
  const overallLabel = OVERALL_FLOW_LABEL[language];

  const kw0 = loc0.keywords[0] || loc0.displayName;
  const kw1 = loc1.keywords[0] || loc1.displayName;
  const kw2 = loc2.keywords[0] || loc2.displayName;

  const orientSuffix = `::${o0 === 'reversed' ? 'rev' : 'up'}::${
    o1 === 'reversed' ? 'rev' : 'up'
  }::${o2 === 'reversed' ? 'rev' : 'up'}`;

  if (kind === 'flow') {
    const synthesisFlowText =
      language === 'en'
        ? `Across the flow from ${loc0.displayName} (${kw0}) through ${loc1.displayName} (${kw1}) toward ${loc2.displayName} (${kw2}), write one short line on which moment stays with you most today`
        : language === 'ja'
        ? `「${loc0.displayName}」（${kw0}）から「${loc1.displayName}」（${kw1}）を経て「${loc2.displayName}」（${kw2}）へ続く流れの中で、今日いちばん心に残る地点を一行書いてみる`
        : `「${loc0.displayName}」(${kw0})에서 「${loc1.displayName}」(${kw1})을 지나 「${loc2.displayName}」(${kw2})로 이어지는 흐름 중, 오늘 가장 마음에 남는 지점 한 줄 적어 보기`;

    return {
      attemptId: `spread::synthesis::flow::${c0.id}::${c1.id}::${c2.id}${orientSuffix}`,
      categoryLabel: hasOverallContext ? labels.thought : labels.question,
      cardId: c0.id,
      cardName: `${loc0.displayName} → ${loc2.displayName}`,
      positionLabel: overallLabel,
      actionText: synthesisFlowText,
    };
  }

  const synthesisQuestionText =
    language === 'en'
      ? `Among the questions from these three cards ("${kw0}" · "${kw1}" · "${kw2}"), gently answer whichever single question feels closest to your day`
      : language === 'ja'
      ? `3枚のカード（「${kw0}」·「${kw1}」·「${kw2}」）が差し出す言葉の中で、今の自分の状況にいちばん近い問いにひとつだけ軽く答えてみる`
      : `세 카드(‘${kw0}’ · ‘${kw1}’ · ‘${kw2}’)가 함께 건네는 이야기 중, 지금 내 상황에 가장 가까운 질문 하나에만 가볍게 답해 보기`;

  return {
    attemptId: `spread::synthesis::question::${c0.id}::${c1.id}::${c2.id}${orientSuffix}`,
    categoryLabel: labels.question,
    cardId: c1.id,
    cardName: `${loc0.displayName} · ${loc1.displayName} · ${loc2.displayName}`,
    positionLabel: overallLabel,
    actionText: synthesisQuestionText,
  };
}

/**
 * Re-resolve a stored SelectedAttemptItem in the current UI language using its attemptId.
 * Falls back cleanly to stored fields for legacy records without attemptId.
 */
export function resolveLocalizedAttemptItem(
  item: SelectedAttemptItem,
  getCardByIdFn: (id: string) => TarotCard | undefined,
  language: Language
): SelectedAttemptItem {
  if (!item.attemptId) return item;

  const parts = item.attemptId.split('::');
  if (parts[0] === 'spread') {
    if (parts[1] === 'synthesis' && parts.length >= 6) {
      const kind = parts[2] === 'flow' ? 'flow' : 'question';
      const c0 = getCardByIdFn(parts[3]);
      const c1 = getCardByIdFn(parts[4]);
      const c2 = getCardByIdFn(parts[5]);
      const o0 = parts[6] === 'rev' ? 'reversed' : 'upright';
      const o1 = parts[7] === 'rev' ? 'reversed' : 'upright';
      const o2 = parts[8] === 'rev' ? 'reversed' : 'upright';
      if (c0 && c1 && c2) {
        return buildSynthesisAttemptItem(kind, c0, c1, c2, true, language, [
          o0,
          o1,
          o2,
        ]);
      }
      return item;
    }

    // spread::<slotIdx>::<angleKey>::<cardId>::<up|rev>
    if (parts.length >= 5) {
      const slotIdx = Number(parts[1]);
      const angleKey = parts[2] as AngleKey;
      const card = getCardByIdFn(parts[3]);
      const isRev = parts[4] === 'rev';
      if (card && !Number.isNaN(slotIdx)) {
        const loc = getLocalizedCard(
          card,
          language,
          isRev ? 'reversed' : 'upright'
        );
        const pool = buildSingleCardPool(card, isRev, language);
        const resolved = pool[angleKey];
        if (resolved) {
          return {
            ...item,
            categoryLabel: resolved.categoryLabel,
            cardName: loc.displayName,
            positionLabel:
              THREE_CARD_POSITIONS_BY_LANG[language][slotIdx] ?? item.positionLabel,
            actionText: resolved.actionText,
          };
        }
      }
    }
    return item;
  }

  // Single card format: <cardId>::<up|rev>::<angleKey>::<idx>
  if (parts.length >= 3) {
    const card = getCardByIdFn(parts[0]);
    const isRev = parts[1] === 'rev';
    const angleKey = parts[2] as AngleKey;
    if (card) {
      const loc = getLocalizedCard(
        card,
        language,
        isRev ? 'reversed' : 'upright'
      );
      const pool = buildSingleCardPool(card, isRev, language);
      const resolved = pool[angleKey];
      if (resolved) {
        return {
          ...item,
          categoryLabel: resolved.categoryLabel,
          cardName: loc.displayName,
          actionText: resolved.actionText,
        };
      }
    }
  }

  return item;
}
