import { TarotCard } from '../types/reflection';
import { MINOR_ARCANA_DECK } from './minorArcana';
import { dedupeDeck, fisherYatesShuffle } from '../utils/deckShuffle';

export const TAROT_CARD_BACK_IMAGE =
  '/src/assets/images/lucida_card_back_final_1795529400087.jpg';

export const TAROT_DECK: TarotCard[] = [
  {
    id: 'major-00-fool',
    arcanaNumber: '0',
    nameKo: '바보',
    nameEn: 'The Fool',
    keywords: ['열린 시작', '호기심', '가벼운 걸음'],
    insight: '완벽히 준비되지 않았더라도, 가벼운 한 걸음이 새로운 시선을 열어줄 수 있습니다.',
    reflectionQuestion: '결과를 미리 걱정하지 않는다면, 지금 가장 해보고 싶은 작은 시도는 무엇인가요?',
    gentleAction: '익숙한 방식 대신 평소와 조금 다른 선택을 하나만 가볍게 시도해 보기',
    meaningGuide:
      '바보는 익숙한 계산을 잠시 내려놓고 처음의 호기심으로 세상을 바라보는 상징입니다. 무모함이 아니라 열린 마음으로 출발하는 태도를 돌아보게 합니다.',
    symbolKey: 'fool',
    frontImageUrl: '/src/assets/images/fool_card_art_1795405536295.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-01-magician',
    arcanaNumber: 'I',
    nameKo: '마법사',
    nameEn: 'The Magician',
    keywords: ['집중', '주도성', '이미 가진 자원'],
    insight: '필요한 도구는 멀리 있지 않고, 이미 지금 내 손안에 놓여 있을지도 모릅니다.',
    reflectionQuestion: '지금 내가 가진 경험이나 자원 중, 바로 꺼내 써볼 수 있는 것은 무엇인가요?',
    gentleAction: '머릿속에 맴도는 생각 하나를 5분 안에 시작할 수 있는 작은 행동으로 적어 보기',
    meaningGuide:
      '마법사는 생각을 현실의 작은 행동으로 옮기는 집중력과 주도성을 상징합니다. 부족한 것을 세기보다 이미 가진 것에 시선을 두는 관점을 제안합니다.',
    symbolKey: 'magician',
    frontImageUrl: '/src/assets/images/magician_card_art_clean_1795405556365.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-02-high-priestess',
    arcanaNumber: 'II',
    nameKo: '여사제',
    nameEn: 'The High Priestess',
    keywords: ['직관', '고요한 관찰', '내면의 신호'],
    insight: '서둘러 결론을 내리기보다, 말로 다 설명되지 않는 감각에 잠시 머물러 볼 때일 수 있습니다.',
    reflectionQuestion: '머리는 괜찮다고 하지만, 마음이 조용히 신호를 보내고 있는 일은 무엇인가요?',
    gentleAction: '잠시 화면을 내려놓고 3분간 내 마음속 감각을 판단 없이 지켜보기',
    meaningGuide:
      '여사제는 겉으로 드러난 정보 너머의 직관과 고요한 관찰을 상징합니다. 당장 행동하기 전에 한 박자 쉬며 내면의 결을 살피는 시간과 닿아 있습니다.',
    symbolKey: 'high-priestess',
    frontImageUrl: '/src/assets/images/priestess_card_art_1795405538403.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-03-empress',
    arcanaNumber: 'III',
    nameKo: '여황제',
    nameEn: 'The Empress',
    keywords: ['돌봄', '풍요로운 감각', '자연스러운 성장'],
    insight: '무언가를 억지로 밀어붙이기보다, 잘 자랄 수 있도록 돌보는 여유가 필요할 때일 수 있습니다.',
    reflectionQuestion: '지금 나를 조금 더 따뜻하고 편안하게 대접할 수 있는 방법은 무엇일까요?',
    gentleAction: '따뜻한 차 한 잔이나 짧은 산책처럼 몸이 편안해지는 시간 선물하기',
    meaningGuide:
      '여황제는 감각의 풍요로움, 돌봄, 그리고 자연스러운 성장을 상징합니다. 효율과 성과에서 잠시 벗어나 몸과 마음의 편안함을 챙기는 관점을 건넵니다.',
    symbolKey: 'empress',
    frontImageUrl: '/src/assets/images/major_03_empress_art_1795405816541.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-04-emperor',
    arcanaNumber: 'IV',
    nameKo: '황제',
    nameEn: 'The Emperor',
    keywords: ['중심', '분명한 기준', '안정감'],
    insight: '흐트러진 마음을 다잡는 힘은 거창한 결심이 아니라 분명한 기준 하나에서 시작될 수 있습니다.',
    reflectionQuestion: '지금 내가 지키고 싶은 나만의 경계나 원칙은 무엇인가요?',
    gentleAction: '지금 가장 우선순위가 높은 일 한 가지만 남기고 나머지는 잠시 미뤄두기',
    meaningGuide:
      '황제는 안정적인 질서와 책임감, 스스로 세운 구조를 상징합니다. 외부의 흔들림 속에서 중심을 잡기 위해 무엇을 정리하면 좋을지 생각해 보게 합니다.',
    symbolKey: 'emperor',
    frontImageUrl: '/src/assets/images/major_04_emperor_art_1795405816797.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-05-hierophant',
    arcanaNumber: 'V',
    nameKo: '교황',
    nameEn: 'The Hierophant',
    keywords: ['신뢰', '오래된 지혜', '배움'],
    insight: '오래된 지혜와 익숙한 가치 속에서 지금 나에게 여전히 유효한 것을 골라 볼 수 있습니다.',
    reflectionQuestion: '내가 당연하게 따르고 있는 기준 중, 진심으로 소중하게 여기는 것은 무엇인가요?',
    gentleAction: '신뢰하는 사람이나 오래 기억에 남는 책의 한 문장을 떠올려 보기',
    meaningGuide:
      '교황은 배움, 전통, 그리고 신뢰할 수 있는 조언을 상징합니다. 혼자 모든 답을 만들기보다 그동안 쌓아온 경험과 신뢰의 바탕을 돌아보게 합니다.',
    symbolKey: 'hierophant',
    frontImageUrl: '/src/assets/images/major_05_hierophant_art_1795405817359.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-06-lovers',
    arcanaNumber: 'VI',
    nameKo: '연인',
    nameEn: 'The Lovers',
    keywords: ['진심', '가치의 정렬', '조화로운 선택'],
    insight: '좋은 선택은 남의 기준이 아니라, 내가 진심으로 동의하는 마음에서 비롯됩니다.',
    reflectionQuestion: '지금 고민 중인 선택 앞에서, 나의 진심은 어느 쪽을 향하고 있나요?',
    gentleAction: '선택지마다 내가 느끼는 솔직한 감정을 한 단어씩 적어 보기',
    meaningGuide:
      '연인은 관계의 조화뿐만 아니라 자신의 가치와 일치하는 선택을 상징합니다. 억지 타협보다 솔직한 마음의 정렬을 살펴보는 관점을 제시합니다.',
    symbolKey: 'lovers',
    frontImageUrl: '/src/assets/images/major_06_lovers_art_1795405818046.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-07-chariot',
    arcanaNumber: 'VII',
    nameKo: '전차',
    nameEn: 'The Chariot',
    keywords: ['방향성', '조율', '나아감'],
    insight: '서로 다른 마음이 동시에 들더라도, 방향을 정하면 천천히 앞으로 나아갈 수 있습니다.',
    reflectionQuestion: '에너지가 흩어지지 않도록, 지금 가장 먼저 집중하고 싶은 한 가지는 무엇인가요?',
    gentleAction: '지금 향하고 싶은 방향을 짧은 한 문장으로 정리해 보기',
    meaningGuide:
      '전차는 상반된 감정이나 조건을 조율하며 스스로 고삐를 쥐고 나아가는 추진력을 상징합니다. 속도보다 방향을 의식하는 태도를 돌아보게 합니다.',
    symbolKey: 'chariot',
    frontImageUrl: '/src/assets/images/major_07_chariot_art_1795405819301.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-08-strength',
    arcanaNumber: 'VIII',
    nameKo: '힘',
    nameEn: 'Strength',
    keywords: ['온화한 용기', '인내', '부드러운 단단함'],
    insight: '진짜 단단함은 감정을 억누르는 것이 아니라, 부드럽게 다루며 머물러 주는 데 있을 수 있습니다.',
    reflectionQuestion: '지금 나를 흔드는 감정이나 상황을 힘으로 누르지 않고 다독인다면 어떤 모습일까요?',
    gentleAction: '스스로에게 건네고 싶은 가장 부드러운 위로 한 문장 떠올려 보기',
    meaningGuide:
      '힘 카드는 거친 통제 대신 인내와 온화함으로 내면의 불안을 다루는 용기를 상징합니다. 스스로에게 조금 더 너그러운 시선을 건네도록 돕습니다.',
    symbolKey: 'strength',
    frontImageUrl: '/src/assets/images/major_08_strength_art_1795405818682.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-09-hermit',
    arcanaNumber: 'IX',
    nameKo: '은둔자',
    nameEn: 'The Hermit',
    keywords: ['잠시 멈춤', '내면의 빛', '혼자만의 시간'],
    insight:
      '지금은 모든 답을 서둘러 찾기보다, 잠시 멈추어 자신이 무엇을 느끼는지 살펴볼 때일 수 있습니다.',
    reflectionQuestion:
      '다른 사람의 기대를 잠시 내려놓는다면, 나는 지금 무엇을 선택하고 싶을까요?',
    gentleAction: '외부의 소음을 잠시 줄이고, 혼자 조용히 숨을 고르는 5분 가져 보기',
    meaningGuide:
      '은둔자는 잠시 멈추어 자신에게 집중하고, 외부의 소음에서 벗어나 내면의 생각을 살펴보는 상징입니다. 혼자만의 시간이 필요한 것은 회피가 아니라 자신에게 집중하는 과정일 수도 있습니다.',
    symbolKey: 'hermit',
    frontImageUrl: '/src/assets/images/major_09_hermit_art_1795405815854.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-10-wheel',
    arcanaNumber: 'X',
    nameKo: '운명의 수레바퀴',
    nameEn: 'Wheel of Fortune',
    keywords: ['순환', '전환점', '유연한 태도'],
    insight: '흐름은 늘 바뀌고, 지금의 자리도 영원히 멈춰 있지 않습니다.',
    reflectionQuestion: '내가 통제할 수 없는 변화 앞에서, 지금 내가 선택할 수 있는 태도는 무엇인가요?',
    gentleAction: '내 힘으로 바꿀 수 있는 것과 그대로 두어도 될 것을 조용히 구분해 보기',
    meaningGuide:
      '운명의 수레바퀴는 삶의 순환과 예상치 못한 전환점을 상징합니다. 상황을 억지로 고정하려 하기보다 변화의 리듬을 유연하게 바라보게 합니다.',
    symbolKey: 'wheel',
    frontImageUrl: '/src/assets/images/major_10_wheel_art_1795405816866.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-11-justice',
    arcanaNumber: 'XI',
    nameKo: '정의',
    nameEn: 'Justice',
    keywords: ['균형', '정직한 시선', '명료함'],
    insight: '감정의 안개를 잠시 걷어내고, 있는 그대로의 사실을 차분히 마주해 볼 수 있습니다.',
    reflectionQuestion: '지금 내가 겪고 있는 일을 한 걸음 떨어져 공정하게 바라본다면 어떻게 보이나요?',
    gentleAction: '복잡한 상황에서 확인된 사실과 나의 해석을 두 줄로 나누어 적어 보기',
    meaningGuide:
      '정의는 균형과 정직한 판단, 그리고 자신의 선택에 대한 투명한 시선을 상징합니다. 스스로를 과하게 탓하거나 합리화하지 않고 담담히 살피게 합니다.',
    symbolKey: 'justice',
    frontImageUrl: '/src/assets/images/major_11_justice_art_1795405818923.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-12-hanged-man',
    arcanaNumber: 'XII',
    nameKo: '매달린 사람',
    nameEn: 'The Hanged Man',
    keywords: ['관점 전환', '의도적 멈춤', '여백'],
    insight: '길이 막힌 것처럼 보일 때는, 잠시 멈춰 서서 전혀 다른 각도로 바라볼 차례일 수 있습니다.',
    reflectionQuestion: '지금 당장 해결하려 애쓰는 일을 잠시 내려놓고 다르게 본다면 무엇이 달라질까요?',
    gentleAction: '당장 결론을 내리지 않고 하루 정도 판단을 보류해 두기',
    meaningGuide:
      '매달린 사람은 의도적인 멈춤과 관점의 전환을 상징합니다. 아무것도 하지 않는 시간이 낭비가 아니라 새로운 이해를 위한 여백이 될 수 있음을 보여줍니다.',
    symbolKey: 'hanged-man',
    frontImageUrl: '/src/assets/images/major_12_hanged_man_art_1795405905704.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-13-death',
    arcanaNumber: 'XIII',
    nameKo: '죽음',
    nameEn: 'Death',
    keywords: ['마무리', '자연스러운 전환', '비움'],
    insight: '이미 역할을 다한 것을 보내줄 때, 비로소 다음 계절이 들어올 자리가 생깁니다.',
    reflectionQuestion: '이제는 습관처럼 붙잡고 있지만, 조용히 놓아주어도 괜찮은 것은 무엇인가요?',
    gentleAction: '더 이상 필요하지 않은 물건이나 미련 하나를 가볍게 정리해 보기',
    meaningGuide:
      '죽음 카드는 불길한 예언이 아니라 한 시기의 자연스러운 마무리와 전환을 상징합니다. 끝맺음을 인정하고 새로운 여백을 준비하는 성찰을 돕습니다.',
    symbolKey: 'death',
    frontImageUrl: '/src/assets/images/major_13_death_art_1795405904496.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-14-temperance',
    arcanaNumber: 'XIV',
    nameKo: '절제',
    nameEn: 'Temperance',
    keywords: ['조율', '나만의 호흡', '적당한 균형'],
    insight: '지나치지도 모자라지도 않은 나만의 호흡을 찾을 때, 마음이 한결 편안해질 수 있습니다.',
    reflectionQuestion: '요즘 내 일상에서 조금 덜어내거나, 반대로 조금 더 채우고 싶은 것은 무엇인가요?',
    gentleAction: '서두르던 일의 속도를 한 단계만 늦추고 호흡을 가다듬어 보기',
    meaningGuide:
      '절제는 서로 다른 요소가 부드럽게 섞이며 균형을 이루는 상태를 상징합니다. 극단적인 변화보다 차분한 조율의 가치를 떠올리게 합니다.',
    symbolKey: 'temperance',
    frontImageUrl: '/src/assets/images/major_14_temperance_art_1795405904425.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-15-devil',
    arcanaNumber: 'XV',
    nameKo: '악마',
    nameEn: 'The Devil',
    keywords: ['알아차림', '습관의 이면', '자유의 선택'],
    insight: '나를 묶고 있는 줄은 생각보다 느슨할지도 모릅니다. 먼저 무엇에 끌리고 있는지 알아차려 보세요.',
    reflectionQuestion: '알면서도 반복하게 되는 습관이나 집착 뒤에는 어떤 마음의 필요가 숨어 있나요?',
    gentleAction: '습관적으로 하던 행동 앞에서 딱 10초만 멈추고 이유를 물어보기',
    meaningGuide:
      '악마 카드는 우리를 사로잡는 욕구, 불안, 혹은 익숙한 굴레를 정직하게 비추는 상징입니다. 스스로를 비난하기보다 그 패턴을 알아차리는 첫걸음을 제안합니다.',
    symbolKey: 'devil',
    frontImageUrl: '/src/assets/images/major_15_devil_art_1795405906528.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-16-tower',
    arcanaNumber: 'XVI',
    nameKo: '탑',
    nameEn: 'The Tower',
    keywords: ['깨달음', '낡은 틀의 해체', '본질'],
    insight: '예상치 못한 흔들림은 오래된 착각을 걷어내고 진짜 중요한 것만 남기기도 합니다.',
    reflectionQuestion: '최근 계획대로 되지 않았던 일 속에서, 오히려 분명해진 나의 진짜 바람은 무엇인가요?',
    gentleAction: '흔들림 이후에도 여전히 내 곁에 남아 있는 소중한 것 하나 떠올려 보기',
    meaningGuide:
      '탑은 낡은 틀이 깨지며 진실이 드러나는 순간을 상징합니다. 흔들림을 두려워하기보다 그 이후에 남는 단단한 본질을 살펴보는 관점을 건넵니다.',
    symbolKey: 'tower',
    frontImageUrl: '/src/assets/images/major_16_tower_art_1795405904606.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-17-star',
    arcanaNumber: 'XVII',
    nameKo: '별',
    nameEn: 'The Star',
    keywords: ['회복', '잔잔한 희망', '본래의 나'],
    insight: '큰 확신이 없어도 괜찮습니다. 멀리서 잔잔히 비추는 작은 희망 하나면 충분합니다.',
    reflectionQuestion: '요즘 지친 마음 속에서도 여전히 조용히 기대하고 있는 것은 무엇인가요?',
    gentleAction: '조급한 마음을 잠시 내려놓고 창밖이나 하늘을 잠깐 바라보기',
    meaningGuide:
      '별은 소란이 지나간 뒤 찾아오는 맑은 회복과 고요한 희망을 상징합니다. 서두르지 않고 본래의 나다움을 천천히 되찾는 시간을 떠올리게 합니다.',
    symbolKey: 'star',
    frontImageUrl: '/src/assets/images/star_card_art_1795405538331.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-18-moon',
    arcanaNumber: 'XVIII',
    nameKo: '달',
    nameEn: 'The Moon',
    keywords: ['모호함', '깊은 감정', '천천히 걷기'],
    insight: '모든 것이 선명하지 않을 때는, 상상이 만든 그림자와 실제 사실을 천천히 구분해 볼 수 있습니다.',
    reflectionQuestion: '지금 나를 불안하게 만드는 생각 중, 사실이 아니라 추측에서 비롯된 부분은 무엇인가요?',
    gentleAction: '불분명한 걱정을 머릿속에 두기보다 종이나 메모에 짧게 꺼내어 보기',
    meaningGuide:
      '달은 모호함과 깊은 무의식, 그리고 불확실한 감정의 결을 상징합니다. 안개가 걷힐 때까지 성급히 단정하지 않는 태도를 살펴보게 합니다.',
    symbolKey: 'moon',
    frontImageUrl: '/src/assets/images/major_18_moon_art_1795405905320.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-19-sun',
    arcanaNumber: 'XIX',
    nameKo: '태양',
    nameEn: 'The Sun',
    keywords: ['명료함', '따뜻한 기쁨', '솔직한 생동감'],
    insight: '복잡하게 생각하지 않아도, 지금 나를 웃게 하는 단순한 기쁨은 분명히 존재합니다.',
    reflectionQuestion: '최근 내 일상에서 가장 밝고 솔직하게 마음이 열렸던 순간은 언제였나요?',
    gentleAction: '최근 고마웠거나 기분 좋았던 아주 작은 순간 하나를 떠올려 보기',
    meaningGuide:
      '태양은 명료함, 따뜻함, 그리고 꾸밈없는 생동감을 상징합니다. 부족한 점을 분석하기보다 지금 빛나고 있는 순간을 온전히 누리는 관점을 제안합니다.',
    symbolKey: 'sun',
    frontImageUrl: '/src/assets/images/major_19_sun_art_1795405905237.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-20-judgement',
    arcanaNumber: 'XX',
    nameKo: '심판',
    nameEn: 'Judgement',
    keywords: ['자각', '경험의 통합', '새로운 부름'],
    insight: '지나온 시간을 후회로 덮기보다, 지금까지의 경험이 나를 어디로 이끄는지 들어 볼 수 있습니다.',
    reflectionQuestion: '과거의 나에게 건네고 싶은 가장 너그러운 한마디는 무엇인가요?',
    gentleAction: '지나온 선택 중 나를 성장시켜 준 경험 한 가지를 인정해 주기',
    meaningGuide:
      '심판은 지나온 선택을 돌아보고 한 단계 깨어나는 자각의 순간을 상징합니다. 스스로를 심판하기보다 경험을 통합해 다음 장으로 나아가는 시선을 돕습니다.',
    symbolKey: 'judgement',
    frontImageUrl: '/src/assets/images/major_20_judgement_art_1795405907087.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
  {
    id: 'major-21-world',
    arcanaNumber: 'XXI',
    nameKo: '세계',
    nameEn: 'The World',
    keywords: ['조화로운 매듭', '충만함', '인정'],
    insight: '아직 완벽하지 않더라도, 여기까지 걸어온 지금의 나 자체로 하나의 완성일 수 있습니다.',
    reflectionQuestion: '최근 내가 묵묵히 해내어 스스로에게 수고했다고 말해주고 싶은 일은 무엇인가요?',
    gentleAction: '다음 목표를 세우기 전에 지금까지 해온 걸음에 짧은 박수 보내기',
    meaningGuide:
      '세계는 하나의 여정이 맺는 조화로운 매듭과 충만함을 상징합니다. 다음 목표를 서두르기 전에 지금 이룬 걸음을 충분히 인정해 주는 시간을 제안합니다.',
    symbolKey: 'world',
    frontImageUrl: '/src/assets/images/major_21_world_art_1795405908993.jpg',
    backImageUrl: TAROT_CARD_BACK_IMAGE,
  },
];

export const MAJOR_ARCANA_DECK: TarotCard[] = TAROT_DECK.map((c) => ({
  ...c,
  arcana: 'major',
}));

export const FULL_TAROT_DECK: TarotCard[] = [
  ...MAJOR_ARCANA_DECK,
  ...MINOR_ARCANA_DECK,
];

const CARD_BY_ID_MAP = new Map<string, TarotCard>(
  FULL_TAROT_DECK.map((card) => [card.id, card])
);

export function getCardById(cardId: string): TarotCard | undefined {
  return CARD_BY_ID_MAP.get(cardId);
}

export { MINOR_ARCANA_DECK };

export function shuffleDeck(deck: TarotCard[] = FULL_TAROT_DECK): TarotCard[] {
  return fisherYatesShuffle(dedupeDeck(deck));
}
