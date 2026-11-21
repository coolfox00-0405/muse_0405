import { SelectedAttemptItem, TarotCard, TarotSuit } from '../types/reflection';

export type AttemptCategory =
  | '감정 살펴보기'
  | '생각 정리하기'
  | '일상 속 작은 행동'
  | '관계 돌아보기'
  | '새로운 관점 발견하기'
  | '자기 돌봄'
  | '내면의 질문';

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

const THREE_CARD_POSITIONS = ['지금의 마음', '바라볼 시선', '작은 걸음'] as const;

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

// Card-specific nuanced reflections across Major Arcana & key Minor Arcana
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
  // Specific Minor Arcana mentioned or iconic
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

const SUIT_PROFILES: Record<
  TarotSuit,
  {
    themeWord: string;
    emotion: (card: TarotCard, isRev: boolean) => string;
    thought: (card: TarotCard, isRev: boolean) => string;
    relationship: (card: TarotCard, isRev: boolean) => string;
    perspective: (card: TarotCard, isRev: boolean) => string;
    selfCare: (card: TarotCard, isRev: boolean) => string;
    question: (card: TarotCard, isRev: boolean) => string;
  }
> = {
  wands: {
    themeWord: '열정과 의지',
    emotion: (c, isRev) =>
      isRev
        ? `‘${c.keywords[0]}’ 앞에서 주춤거리거나 지쳐 있는 내 마음의 온도를 다정하게 살펴보기`
        : `‘${c.keywords[0]}’과 관련해 지금 내 안에 올라오는 의욕이나 설렘의 크기를 느껴보기`,
    thought: (c, isRev) =>
      isRev
        ? `요즘 에너지를 빼앗기고 있는 일을 한 줄 적고, ‘지금은 속도 조절 중’이라 표시해 보기`
        : `「${c.nameKo}」가 비추는 ${particle(c.keywords[0], '을/를')} 떠올리며 해보고 싶은 작은 시도 한 문장 정리하기`,
    relationship: (c, isRev) =>
      isRev
        ? `타인의 속도나 열정에 휘둘리지 않고 내 호흡을 지키는 거리감 살펴보기`
        : `나에게 긍정적인 자극이나 응원을 주는 사람의 말 한마디 떠올려 보기`,
    perspective: (c, isRev) =>
      isRev
        ? `불씨가 꺼진 것이 아니라 다시 모으기 위해 잠시 쉬어가는 시기일 수 있음을 바라보기`
        : `크게 완성해야 한다는 부담을 내려놓고, 첫 불씨처럼 작게 시작할 수 있는 면을 찾아보기`,
    selfCare: (c, isRev) =>
      isRev
        ? `무리해서 불을 지피기보다 15분 정도 아무것도 하지 않는 충전의 여백 두기`
        : `몸을 가볍게 움직이거나 기지개를 켜며 답답하게 쌓인 에너지 풀어주기`,
    question: (_c, isRev) =>
      isRev
        ? `지금 내가 억지로 애쓰고 있는 것 중, 잠시 내려놓아도 괜찮은 불필요한 짐은 무엇인가요?`
        : `지금 내 안에서 작게라도 반짝이며 시선을 끄는 관심사는 무엇인가요?`,
  },
  cups: {
    themeWord: '감정과 관계',
    emotion: (c, isRev) =>
      isRev
        ? `겉으로는 괜찮아 보이지만 속으로 눌러두었던 ${particle(c.keywords[0], '과/와')} 관련된 감정 알아차리기`
        : `지금 내 마음에 흐르고 있는 ${particle(c.keywords[0], '을/를')} 판단 없이 있는 그대로 느껴보기`,
    thought: (c, isRev) =>
      isRev
        ? `마음이 예민하거나 서운했던 순간을 한 문장으로 적어 내 감정에 이름 붙여 보기`
        : `요즘 내 마음이 가장 편안하거나 따뜻하게 머물렀던 기억 하나를 짧게 적어 보기`,
    relationship: (c, isRev) =>
      isRev
        ? `다른 사람의 감정을 대신 짊어지느라 내 마음을 돌보지 못했는지 조용히 돌아보기`
        : `곁에 있는 사람과 나누고 싶은 진심이나 고마운 마음 하나를 떠올려 보기`,
    perspective: (c, isRev) =>
      isRev
        ? `감정이 흔들리는 순간을 약함이 아니라 내 마음이 보내는 소중한 신호로 바라보기`
        : `합리적인 이유만으로 설명되지 않는 마음의 결도 충분히 존중할 가치가 있음을 떠올리기`,
    selfCare: (_c, isRev) =>
      isRev
        ? `감정이 지친 나를 위해 따뜻한 물이나 포근한 휴식으로 마음의 그릇 비워주기`
        : `좋아하는 음악을 들으며 하루 동안 수고한 내 마음에게 다정한 말 건네기`,
    question: (_c, isRev) =>
      isRev
        ? `지금 내 마음이 다른 사람에게가 아니라, 나 자신에게 먼저 받고 싶은 위로는 무엇인가요?`
        : `말로 다 하지 않았지만 지금 내 마음이 가장 조용히 바라고 있는 온기는 무엇인가요?`,
  },
  swords: {
    themeWord: '생각과 명료함',
    emotion: (c, isRev) =>
      isRev
        ? `생각이 많아져 머리가 무겁거나 날이 서 있던 마음이 언제였는지 가만히 살피기`
        : `‘${c.keywords[0]}’이라는 주제 앞에서 지금 내 안에 드는 솔직한 긴장감이나 개운함 느끼기`,
    thought: (c, isRev) =>
      isRev
        ? `머릿속을 맴도는 걱정을 종이나 메모에 꺼내어 사실과 추측으로 한 줄씩 나누어 보기`
        : `복잡하게 얽힌 생각을 덜어내고, 지금 가장 핵심이 되는 한 문장만 추려 적어 보기`,
    relationship: (_c, isRev) =>
      isRev
        ? `날카로운 말이나 오해 때문에 거리를 두고 싶었던 대화에서 내가 원했던 배려 살펴보기`
        : `상대방의 입장이나 말 이면에 담긴 진짜 의도를 한 번 더 차분히 헤아려 보기`,
    perspective: (c, isRev) =>
      isRev
        ? `반드시 흑백으로 결론 내리지 않고, 회색의 여백을 둔 채 지켜보는 시선 가져보기`
        : `감정에 휩쓸리기보다 한 발짝 떨어져 상황을 담담하게 바라보는 관찰자의 시선 빌려오기`,
    selfCare: (_c, isRev) =>
      isRev
        ? `계속되는 생각의 소음을 잠시 멈추고 창밖을 보며 천천히 숨 내쉬기`
        : `복잡한 생각에서 잠깐 벗어나 단순한 집안일이나 짧은 산책으로 머리 식히기`,
    question: (_c, isRev) =>
      isRev
        ? `내가 스스로에게 너무 가혹한 잣대나 완벽함을 요구하며 몰아세우고 있지는 않은가요?`
        : `불필요한 걱정을 덜어낸다면, 지금 이 상황에서 가장 선명하게 남는 진실은 무엇인가요?`,
  },
  pentacles: {
    themeWord: '일상과 돌봄',
    emotion: (c, isRev) =>
      isRev
        ? `성과나 결과에 대한 조바심 때문에 지금 누릴 수 있는 평온을 놓치고 있지는 않은지 살피기`
        : `‘${c.keywords[0]}’ 속에서 내가 느끼는 현실적인 든든함이나 작은 부담감 알아차리기`,
    thought: (c, isRev) =>
      isRev
        ? `당장 다 해결하려 들지 않고 오늘 할 몫과 내일로 미룰 몫을 가볍게 나누어 적어 보기`
        : `최근 일과 일상 속에서 내가 묵묵히 쌓아온 작은 결실 하나를 한 줄로 기록해 보기`,
    relationship: (_c, isRev) =>
      isRev
        ? `도움을 청하는 것이 민폐라는 생각을 조금 내려놓고, 의지할 수 있는 곁을 떠올려 보기`
        : `일상을 함께 지탱해 주거나 실용적인 도움을 건네준 사람에게 고마움 느껴보기`,
    perspective: (c, isRev) =>
      isRev
        ? `빠른 변화가 보이지 않더라도 바닥에서 조용히 뿌리를 다지는 시간일 수 있음을 믿어보기`
        : `눈에 띄는 큰 도약보다 매일 반복되는 소소한 돌봄이 나를 지켜주는 힘임을 바라보기`,
    selfCare: (_c, isRev) =>
      isRev
        ? `몸이 보내는 피로 신호를 미루지 말고 식사, 수면, 휴식 중 하나를 오늘 우선 챙기기`
        : `내 책상이나 방 한쪽을 정돈하고, 몸이 편안해지는 따뜻한 한 끼 챙겨 먹기`,
    question: (_c, isRev) =>
      isRev
        ? `지금 내 일상의 균형을 지키기 위해 가장 먼저 속도를 늦추고 싶은 부분은 어디인가요?`
        : `거창한 성과가 아니더라도, 요즘 내가 꾸준히 지켜내어 스스로 기특한 일상은 무엇인가요?`,
  },
};

function getMajorDefaultAngle(
  card: TarotCard,
  isRev: boolean
): Omit<CardAngle, 'action' | 'reversedPerspective' | 'reversedSelfCare'> {
  const custom = CARD_SPECIFIC_ANGLES[card.id];
  const kw0 = card.keywords[0] || card.nameKo;
  const kw1 = card.keywords[1] || kw0;

  return {
    emotion:
      custom?.emotion ??
      (isRev
        ? `역방향으로 나온 「${card.nameKo}」의 ${particle(kw0, '이/가')} 내 안에서 어떤 망설임이나 여운으로 느껴지는지 살피기`
        : `「${card.nameKo}」가 비추는 ‘${kw0} · ${kw1}’ 앞에서 지금 내 마음에 올라오는 감정 알아차리기`),
    thought:
      custom?.thought ??
      `「${card.nameKo}」의 메시지를 읽으며 가장 먼저 떠오른 생각이나 단어를 한 문장으로 정리해 보기`,
    relationship:
      custom?.relationship ??
      `주변 사람들과의 관계 속에서 ‘${kw0}’과 관련해 요즘 마음 쓰였던 장면 하나 떠올려 보기`,
    perspective:
      (isRev ? custom?.reversedPerspective : undefined) ??
      custom?.perspective ??
      (isRev
        ? `당장 바깥으로 밀어붙이기보다 한 걸음 물러나 내면의 속도를 다시 살펴보는 시선 가져보기`
        : `익숙한 상황을 ‘${kw1}’이라는 새로운 렌즈로 한 번 더 바라보기`),
    selfCare:
      (isRev ? custom?.reversedSelfCare : undefined) ??
      custom?.selfCare ??
      `오늘 하루 중 5분만이라도 나를 재촉하지 않고 편안하게 숨 고르는 시간 마련하기`,
    question: custom?.question ?? card.reflectionQuestion,
  };
}

function getSuitAngle(
  card: TarotCard,
  isRev: boolean
): Omit<CardAngle, 'action' | 'reversedPerspective' | 'reversedSelfCare'> {
  const custom = CARD_SPECIFIC_ANGLES[card.id];
  const suit: TarotSuit = card.suit ?? 'pentacles';
  const profile = SUIT_PROFILES[suit];

  return {
    emotion: custom?.emotion ?? profile.emotion(card, isRev),
    thought: custom?.thought ?? profile.thought(card, isRev),
    relationship: custom?.relationship ?? profile.relationship(card, isRev),
    perspective:
      (isRev ? custom?.reversedPerspective : undefined) ??
      custom?.perspective ??
      profile.perspective(card, isRev),
    selfCare:
      (isRev ? custom?.reversedSelfCare : undefined) ??
      custom?.selfCare ??
      profile.selfCare(card, isRev),
    question: custom?.question ?? profile.question(card, isRev),
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

/**
 * Generate 5~7 personalized, non-prescriptive selectable attempts tailored to the drawn card(s),
 * upright/reversed orientations, card interpretations, and multi-card synthesis.
 */
export function generatePersonalizedAttempts(
  cards: TarotCard[],
  orientations: ('upright' | 'reversed')[],
  _overallMessage?: string
): SelectedAttemptItem[] {
  if (cards.length === 0) return [];

  // Single-card reading: 6 diverse, deeply personalized items
  if (cards.length === 1) {
    const card = cards[0];
    const isRev = orientations[0] === 'reversed';
    const orientKey = isRev ? 'rev' : 'up';
    const custom = CARD_SPECIFIC_ANGLES[card.id];
    const angle =
      card.arcana === 'minor'
        ? getSuitAngle(card, isRev)
        : getMajorDefaultAngle(card, isRev);

    const primaryActionText =
      (!isRev && custom?.action) || card.gentleAction;

    const allCandidates: Array<{
      key: string;
      categoryLabel: AttemptCategory;
      actionText: string;
    }> = [
      {
        key: 'action',
        categoryLabel: '일상 속 작은 행동',
        actionText: primaryActionText,
      },
      {
        key: 'emotion',
        categoryLabel: '감정 살펴보기',
        actionText: angle.emotion,
      },
      {
        key: 'thought',
        categoryLabel: '생각 정리하기',
        actionText: angle.thought,
      },
      {
        key: 'perspective',
        categoryLabel: '새로운 관점 발견하기',
        actionText: angle.perspective,
      },
      {
        key: 'relationship',
        categoryLabel: '관계 돌아보기',
        actionText: angle.relationship,
      },
      {
        key: 'selfcare',
        categoryLabel: '자기 돌봄',
        actionText: angle.selfCare,
      },
      {
        key: 'question',
        categoryLabel: '내면의 질문',
        actionText: `“${angle.question}” 스스로에게 묻고 잠깐 머물러 보기`,
      },
    ];

    // Always keep primaryActionText + 5 varied categories (total 6 items in 5~7 range)
    // Rotate which 1 optional category is omitted deterministically by card+orientation so lists stay fresh
    const seed = hashSeed(`${card.id}:${orientKey}`);
    const optionalPool = allCandidates.slice(1);
    const omitIndex = seed % optionalPool.length;
    const selectedOptional = optionalPool.filter((_, idx) => idx !== omitIndex);

    // Order naturally while ensuring no static rigid order across cards
    const combined = [allCandidates[0], ...selectedOptional];

    return combined.map((entry, idx) => ({
      attemptId: `${card.id}::${orientKey}::${entry.key}::${idx}`,
      categoryLabel: entry.categoryLabel,
      cardId: card.id,
      cardName: card.nameKo,
      actionText: entry.actionText,
    }));
  }

  // Multi-card (3-card) reading: 6~7 personalized items blending individual cards + overall spread flow
  const c0 = cards[0];
  const c1 = cards[1] ?? cards[0];
  const c2 = cards[2] ?? cards[0];
  const rev0 = orientations[0] === 'reversed';
  const rev1 = orientations[1] === 'reversed';
  const rev2 = orientations[2] === 'reversed';

  const angle0 =
    c0.arcana === 'minor' ? getSuitAngle(c0, rev0) : getMajorDefaultAngle(c0, rev0);
  const angle1 =
    c1.arcana === 'minor' ? getSuitAngle(c1, rev1) : getMajorDefaultAngle(c1, rev1);
  const angle2 =
    c2.arcana === 'minor' ? getSuitAngle(c2, rev2) : getMajorDefaultAngle(c2, rev2);

  const flowSeed = hashSeed(
    cards.map((c, i) => `${c.id}:${orientations[i] ?? 'upright'}`).join('|')
  );

  const items: SelectedAttemptItem[] = [
    // 1. Card 1 emotion/state
    {
      attemptId: `spread::0::emotion::${c0.id}::${rev0 ? 'rev' : 'up'}`,
      categoryLabel: '감정 살펴보기',
      cardId: c0.id,
      cardName: c0.nameKo,
      positionLabel: THREE_CARD_POSITIONS[0],
      actionText: angle0.emotion,
    },
    // 2. Card 2 new perspective
    {
      attemptId: `spread::1::perspective::${c1.id}::${rev1 ? 'rev' : 'up'}`,
      categoryLabel: '새로운 관점 발견하기',
      cardId: c1.id,
      cardName: c1.nameKo,
      positionLabel: THREE_CARD_POSITIONS[1],
      actionText: angle1.perspective,
    },
    // 3. Card 3 gentle daily action (preserves original gentleAction)
    {
      attemptId: `spread::2::action::${c2.id}::${rev2 ? 'rev' : 'up'}`,
      categoryLabel: '일상 속 작은 행동',
      cardId: c2.id,
      cardName: c2.nameKo,
      positionLabel: THREE_CARD_POSITIONS[2],
      actionText: c2.gentleAction,
    },
    // 4. Cross-card synthesis thought
    {
      attemptId: `spread::synthesis::thought::${c0.id}::${c2.id}`,
      categoryLabel: '생각 정리하기',
      cardId: c0.id,
      cardName: `${c0.nameKo} → ${c2.nameKo}`,
      positionLabel: '전체 흐름',
      actionText: `「${c0.nameKo}」(${c0.keywords[0]})에서 시작해 「${c2.nameKo}」(${c2.keywords[0]})로 이어지는 오늘의 흐름을 나만의 한 문장으로 적어 보기`,
    },
    // 5. Relationship or Self-care tailored to middle/third card
    flowSeed % 2 === 0
      ? {
          attemptId: `spread::rel::${c1.id}`,
          categoryLabel: '관계 돌아보기',
          cardId: c1.id,
          cardName: c1.nameKo,
          positionLabel: THREE_CARD_POSITIONS[1],
          actionText: angle1.relationship,
        }
      : {
          attemptId: `spread::rel::${c0.id}`,
          categoryLabel: '관계 돌아보기',
          cardId: c0.id,
          cardName: c0.nameKo,
          positionLabel: THREE_CARD_POSITIONS[0],
          actionText: angle0.relationship,
        },
    // 6. Self-care grounded in card 3 or card 1
    {
      attemptId: `spread::selfcare::${c2.id}`,
      categoryLabel: '자기 돌봄',
      cardId: c2.id,
      cardName: c2.nameKo,
      positionLabel: THREE_CARD_POSITIONS[2],
      actionText: angle2.selfCare,
    },
    // 7. Inner question bridging all 3 cards
    {
      attemptId: `spread::question::${c0.id}::${c1.id}::${c2.id}`,
      categoryLabel: '내면의 질문',
      cardId: c1.id,
      cardName: `${c0.nameKo} · ${c1.nameKo} · ${c2.nameKo}`,
      positionLabel: '세 장의 질문',
      actionText: `세 카드(‘${c0.keywords[0]}’ · ‘${c1.keywords[0]}’ · ‘${c2.keywords[0]}’) 중 지금 가장 마음에 닿은 질문 하나를 골라 조용히 답해 보기`,
    },
  ];

  return items;
}
