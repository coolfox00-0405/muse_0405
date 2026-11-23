import { LocalizedCardDictionary } from './types';

const SWORDS_THEME_EN = 'Thought · Clarity · Honest Discernment';
const SWORDS_THEME_JA = '思考 · 判断 · 澄んだ明晰さ';
const PENTACLES_THEME_EN = 'Daily Life · Resources · Steady Grounding';
const PENTACLES_THEME_JA = '日常 · 資源 · 着実な実り';

export const SWORDS_PENTACLES_TRANSLATIONS: LocalizedCardDictionary = {
  // === SWORDS (01..14) ===
  'minor-swords-01': {
    en: {
      name: 'Ace of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Clarity', 'Truth', 'Fresh Insight'],
      insight:
        'Even tangled thoughts can turn surprisingly clear once distilled into one honest sentence.',
      reflectionQuestion:
        'If you boiled down whatever is cluttering your mind right now into one plain sentence, what would it be?',
      gentleAction:
        'Write down the core of a complicated worry in a single unadorned sentence.',
      meaningGuide:
        'The Ace of Swords represents crisp mental clarity that cuts gently through fog and confusion.',
    },
    ja: {
      name: 'ソードのエース',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['明晰さ', '真実', '新しい視点'],
      insight:
        '複雑に絡み合っていた考えも、核心の一行に整理してみると意外なほどすっきり見えてくることがあります。',
      reflectionQuestion:
        '今頭の中を散らかしている気がかりの本当の中心を、一文にまとめるなら何になりますか？',
      gentleAction:
        '複雑な悩みを、紙にたった一文だけで要約してみる',
      meaningGuide:
        'ソードのエースは、霧を晴らす澄んだ理性と明快な気づきを象徴します。',
    },
  },
  'minor-swords-02': {
    en: {
      name: 'Two of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Hesitation', 'Weighing Options', 'Paused Judgment'],
      insight:
        'Difficulty deciding rarely means weakness—it often means you care sincerely about what both paths protect.',
      reflectionQuestion:
        'What choice have you quietly kept blindfolded and postponed, knowing you will eventually want to face it?',
      gentleAction:
        'Name honestly in one sentence the biggest fear keeping you from choosing.',
      meaningGuide:
        'The Two of Swords reflects pausing between two competing truths to hear what your heart actually knows.',
    },
    ja: {
      name: 'ソードの2',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['迷い', '均衡をとる', '判断の保留'],
      insight:
        '決めきれないのは優柔不断だからではなく、ふたつの大切な価値をどちらも守りたいと感じているからかもしれません。',
      reflectionQuestion:
        '今は目を閉じて先送りしているけれど、そろそろ向き合ってみたい選択は何ですか？',
      gentleAction:
        '決断を遠ざけているいちばん大きな心配を、正直にひとつ書き出してみる',
      meaningGuide:
        'ソードの2は、相対する考えの間で少し立ち止まり、本心を確かめる瞬間を映し出します。',
    },
  },
  'minor-swords-03': {
    en: {
      name: 'Three of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Honest Ache', 'Facing Reality', 'Start of Healing'],
      insight:
        'Healing often begins in the exact moment you stop pretending something did not sting.',
      reflectionQuestion:
        'Is there something you brushed off as fine even though it quietly left your heart sore?',
      gentleAction:
        'Write one plain, unvarnished sentence admitting how something actually felt.',
      meaningGuide:
        'The Three of Swords honors facing painful honesty directly so real healing has room to start.',
    },
    ja: {
      name: 'ソードの3',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['素直な痛み', '現実直視', '癒やしの始まり'],
      insight:
        '胸が痛む事実から目を逸らさず認めた瞬間から、むしろ回復は静かに始まっていきます。',
      reflectionQuestion:
        '「大丈夫」とやり過ごそうとしたけれど、本当は心が痛かった出来事はありませんか？',
      gentleAction:
        'つらかった気持ちを飾らず、ありのまま一文だけ言葉にして書いてみる',
      meaningGuide:
        'ソードの3は、痛む感情を誠実に受け止めて通り抜けていく内省の過程を意味します。',
    },
  },
  'minor-swords-04': {
    en: {
      name: 'Four of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Mental Rest', 'Stillness', 'Recharge'],
      insight:
        'Thinking harder does not solve everything—sometimes your mind simply needs permission to lie down and rest.',
      reflectionQuestion:
        'Which worry could safely stay off your mind for just twenty-four hours without needing an answer today?',
      gentleAction:
        'Mute notifications for five quiet minutes, close your eyes, and let your mind go idle.',
      meaningGuide:
        'The Four of Swords symbolizes restorative stillness—a necessary pause after heavy mental effort.',
    },
    ja: {
      name: 'ソードの4',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['思考の休息', '静けさ', '再充電'],
      insight:
        '考え続ければ必ず答えが出るわけではありません。思考を少し休ませてあげる時間が必要です。',
      reflectionQuestion:
        '今日すぐ結論を出さず、一日だけ頭の中から降ろしておいてもよさそうな悩みは何ですか？',
      gentleAction:
        '少しだけ通知を切って目を閉じ、5分間頭を休ませてみる',
      meaningGuide:
        'ソードの4は、激しい思考のあとに欠かせない静かな回復のひと息を象徴します。',
    },
  },
  'minor-swords-05': {
    en: {
      name: 'Five of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Worn-Out Conflict', 'Pride', 'Wisdom to Step Back'],
      insight:
        'Winning an argument does not always leave you at peace—stepping back to save your spirit can be wiser.',
      reflectionQuestion:
        'Where might you be draining your peace just trying to prove a point or come out ahead?',
      gentleAction:
        'Step one pace back from an exhausting debate or comparison and choose calm instead.',
      meaningGuide:
        'The Five of Swords invites noticing futile battles and protecting what actually matters.',
    },
    ja: {
      name: 'ソードの5',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['消耗戦', 'プライド', '引く知恵'],
      insight:
        '勝つことがいつも心を楽にしてくれるとは限りません。エネルギーを守るために一歩引くことも大切な知恵です。',
      reflectionQuestion:
        '無理に証明しようとしたり張り合ったりして、心の余力をすり減らしていることはありませんか？',
      gentleAction:
        '消耗する議論や比較から一歩離れて、自分の平穏を優先してみる',
      meaningGuide:
        'ソードの5は、不要な葛藤に気づき、より大切な価値を守る視点を差し出してくれます。',
    },
  },
  'minor-swords-06': {
    en: {
      name: 'Six of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Calm Crossing', 'Transition', 'Healthy Distance'],
      insight:
        'Even if you cannot erase rough waters overnight, you can slowly steer toward calmer shores.',
      reflectionQuestion:
        'What small shift in surroundings could help you step back slightly from a tangled situation?',
      gentleAction:
        'Change scenery briefly with a short walk or tidy the corner of your desk.',
      meaningGuide:
        'The Six of Swords marks a quiet, gradual passage away from turbulence toward steadier ground.',
    },
    ja: {
      name: 'ソードの6',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['穏やかな移動', '移行', '距離を置く'],
      insight:
        '荒れた波を一瞬で消すことはできなくても、少しずつ穏やかなほうへ舵を切ることはできます。',
      reflectionQuestion:
        '込み入った状況から一歩離れるために、今変えられる小さな環境は何ですか？',
      gentleAction:
        '少し場所を変えて散歩したり、机の上を軽く整えたりしてみる',
      meaningGuide:
        'ソードの6は、混乱を後にしてもう少し落ち着いた状態へと渡っていく移行を象徴します。',
    },
  },
  'minor-swords-07': {
    en: {
      name: 'Seven of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Detour', 'Checking Honesty', 'Strategy'],
      insight:
        'Clever workarounds have their place, yet it helps to check quietly whether you are being honest with yourself.',
      reflectionQuestion:
        'What gentle excuse have you been telling yourself lately just to avoid an uncomfortable truth?',
      gentleAction:
        'Write down in one candid line the real reason behind something you keep delaying.',
      meaningGuide:
        'The Seven of Swords invites calm discernment between thoughtful strategy and subtle self-avoidance.',
    },
    ja: {
      name: 'ソードの7',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['回り道', '正直さの確認', '工夫'],
      insight:
        '正面からぶつかる代わりに賢いやり方を選ぶのもよいですが、自分自身に対しては誠実でいられているか確かめてみてください。',
      reflectionQuestion:
        '気まずさを避けるために、自分自身にそっと言い訳していることはありませんか？',
      gentleAction:
        '先延ばしにしていたことの本当の理由を、素直に一行だけ書いてみる',
      meaningGuide:
        'ソードの7は、賢明な対処と自己欺瞞との境界を静かに見つめ直させてくれます。',
    },
  },
  'minor-swords-08': {
    en: {
      name: 'Eight of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Mental Bounds', 'Self-Limitation', 'Opening View'],
      insight:
        'When every exit feels sealed shut, inner worry may be narrowing what you allow yourself to see.',
      reflectionQuestion:
        'Among the thoughts telling you "it won’t work," which assumption might not actually be true?',
      gentleAction:
        'Look for just one tiny alternative option you have not ruled out in a stuck area.',
      meaningGuide:
        'The Eight of Swords sheds gentle light on self-made mental fences and the possibility of looking again.',
    },
    ja: {
      name: 'ソードの8',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['思考の枠', '自らへの制限', '視界をひらく'],
      insight:
        '道が完全に塞がれているように感じるときでも、実は心の中の不安が視界を狭めているだけかもしれません。',
      reflectionQuestion:
        '「どうせ無理」と先に決めつけている考えの中で、事実とは違う部分はどこですか？',
      gentleAction:
        '行き詰まりを感じる状況の中で、試してみられそうなとても小さな代替案をひとつ探してみる',
      meaningGuide:
        'ソードの8は、自分でつくってしまった思考の囲いに気づき、視界をひらくきっかけを映します。',
    },
  },
  'minor-swords-09': {
    en: {
      name: 'Nine of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Night Worries', 'Overthinking', 'Reassurance'],
      insight:
        'Worries replayed alone in the quiet often swell far larger in thought than they stand in daylight.',
      reflectionQuestion:
        'Of everything tiring you out right now, how much belongs to imagined scenarios that have not happened?',
      gentleAction:
        'Write down the worries circling your head and set aside anything that needs no action tonight.',
      meaningGuide:
        'The Nine of Swords suggests soothing anxiety by gently separating real facts from spiraling fears.',
    },
    ja: {
      name: 'ソードの9',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['夜の心配事', '考えすぎ', '安心する'],
      insight:
        'ひとりで頭の中に何度も浮かべる心配は、現実よりもずっと大きく膨らんで見えがちです。',
      reflectionQuestion:
        '今あなたを疲れさせている不安の中で、まだ起きていない出来事への想像はどれくらいありますか？',
      gentleAction:
        '頭の中の心配を紙に書き出し、今すぐ解決しなくてよいものは線を引いて置いておく',
      meaningGuide:
        'ソードの9は、不安を押さえ込むのではなく事実と想像を切り分けて心をなだめる視点を示します。',
    },
  },
  'minor-swords-10': {
    en: {
      name: 'Ten of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Clear Ending', 'First Light', 'Releasing'],
      insight:
        'Once you stop holding onto what has already passed, the first quiet light of morning can finally arrive.',
      reflectionQuestion:
        'What exhausting worry have you lived through enough that it is finally okay to place a gentle period after it?',
      gentleAction:
        'Write down one lingering thought you want to close and silently say "that chapter is done."',
      meaningGuide:
        'The Ten of Swords marks the unmistakable end of an old strain and the dawn waiting beyond it.',
    },
    ja: {
      name: 'ソードの10',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['完全な区切り', '夜明けの光', '手放し'],
      insight:
        'すでに過ぎ去ったことに心を留め続けるのをやめたとき、ようやく新しい朝が始まります。',
      reflectionQuestion:
        'もう十分に味わい尽くしたから、ここで静かにピリオドを打ってもよいと思える悩みは何ですか？',
      gentleAction:
        '終わらせたい考えをひとつ書き出し、「ここまで」と自分で区切りをつけてみる',
      meaningGuide:
        'ソードの10は、ひとつの段階の確かな終わりと、その向こうに訪れる新しい夜明けを象徴します。',
    },
  },
  'minor-swords-11': {
    en: {
      name: 'Page of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Keen Curiosity', 'Questions', 'Observation'],
      insight:
        'Asking "is that really so?" even about what looks obvious opens a fresher way of seeing.',
      reflectionQuestion:
        'What question or subject are you feeling quietly curious to look into more closely lately?',
      gentleAction:
        'Write down one crisp, honest question you want to stay curious about this week.',
      meaningGuide:
        'The Page of Swords symbolizes alert curiosity and looking at facts with fresh eyes.',
    },
    ja: {
      name: 'ソードのペイジ',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['鋭い好奇心', '問い', '観察'],
      insight:
        '当たり前に見えることにも「本当にそうかな？」ともう一度問いかけてみると、新しい理解がひらけます。',
      reflectionQuestion:
        '最近あなたがもう少し詳しく知ってみたい、確かめてみたいと感じているテーマは何ですか？',
      gentleAction:
        '気になっていることについて、自分への問いかけをひとつはっきりと書き出してみる',
      meaningGuide:
        'ソードのペイジは、澄んだ好奇心と物事を客観的に見つめる探求心を意味します。',
    },
  },
  'minor-swords-12': {
    en: {
      name: 'Knight of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Decisiveness', 'Direct Words', 'Mindful Pace'],
      insight:
        'Sharp clarity speeds up words and action—yet pausing a second helps keep warmth in view too.',
      reflectionQuestion:
        'In something you feel ready to resolve decisively, how could you keep gentleness alongside clarity?',
      gentleAction:
        'Soften a blunt thought into an "I feel / I think" sentence to clarify what you truly mean.',
      meaningGuide:
        'The Knight of Swords reflects clear resolve balanced with thoughtful, considerate communication.',
    },
    ja: {
      name: 'ソードのナイト',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['決断力', '率直な表現', '急ぎすぎない'],
      insight:
        '思考が明快なほど言葉や行動も速くなります。ただ、急ぐあまり見落としている気持ちがないか確かめてみてください。',
      reflectionQuestion:
        '今きっぱり整理したい事柄の中で、厳しさだけでなく柔らかさも添える方法はありますか？',
      gentleAction:
        '断定的な言葉ではなく「私はこう思う」という語り口で考えを整えてみる',
      meaningGuide:
        'ソードのナイトは、明快な決断力と丁寧な対話のバランスを振り返らせてくれます。',
    },
  },
  'minor-swords-13': {
    en: {
      name: 'Queen of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Independent Mind', 'Honest Boundaries', 'Discernment'],
      insight:
        'Drawing clear boundaries without getting swept away by guilt is healthy self-respect, not coldness.',
      reflectionQuestion:
        'What personal standard or boundary would feel relieving to name clearly and honestly right now?',
      gentleAction:
        'Put one vague boundary into clear, calm words written in your own voice.',
      meaningGuide:
        'The Queen of Swords embodies lucid insight and dignified independence of mind.',
    },
    ja: {
      name: 'ソードのクイーン',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['自立した思考', '誠実な境界線', '洞察'],
      insight:
        '感情に振り回されずはっきり線を引く姿勢は、冷たさではなく健やかな自己尊重です。',
      reflectionQuestion:
        '今の暮らしの中で、もう少し明確かつ誠実に伝えたい境界線は何ですか？',
      gentleAction:
        '曖昧にしていた自分の基準をひとつ、自分の言葉ではっきり書き出してみる',
      meaningGuide:
        'ソードのクイーンは、明晰な洞察と揺るぎない自立した基準を象徴します。',
    },
  },
  'minor-swords-14': {
    en: {
      name: 'King of Swords',
      suitTheme: SWORDS_THEME_EN,
      keywords: ['Fairness', 'Calm Wisdom', 'Principle'],
      insight:
        'Stepping back to view the whole picture fairly lets steady principle surface above emotional noise.',
      reflectionQuestion:
        'If a calm, fair observer looked at your present situation, what grounded advice might they share?',
      gentleAction:
        'Jot down one fair point on each side of a dilemma you have been weighing.',
      meaningGuide:
        'The King of Swords symbolizes unbiased clarity and calm, principled perspective.',
    },
    ja: {
      name: 'ソードのキング',
      suitTheme: SWORDS_THEME_JA,
      keywords: ['公正さ', '冷静な知恵', '原則'],
      insight:
        '一歩引いて全体を公平に眺めてみると、感情の雑音の向こうに確かな基準が浮かび上がります。',
      reflectionQuestion:
        '今の状況を第三者の目で落ち着いて眺めたら、どんな助言をかけてあげたいですか？',
      gentleAction:
        '迷っている事柄について、賛成側と反対側の視点をそれぞれ一行ずつ書いてみる',
      meaningGuide:
        'ソードのキングは、偏りのない公正な判断と明瞭な原則を象徴します。',
    },
  },

  // === PENTACLES (01..14) ===
  'minor-pentacles-01': {
    en: {
      name: 'Ace of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Grounded Seed', 'Small Opening', 'Foundation'],
      insight:
        'Planting one tangible, bite-sized seed today builds more lasting ground than chasing dramatic leaps.',
      reflectionQuestion:
        'What small, practical habit or opportunity feels ready to plant in your everyday routine right now?',
      gentleAction:
        'Pick one tiny daily practice that takes only five quiet minutes to begin.',
      meaningGuide:
        'The Ace of Pentacles symbolizes real-world potential and a steady, tangible beginning.',
    },
    ja: {
      name: 'ペンタクルのエース',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['現実の種', '小さな機会', '土台'],
      insight:
        '大げさな変化よりも、今日手に取れる小さく具体的な種をひとつ蒔くことがいちばん確かな力になります。',
      reflectionQuestion:
        '今の日常の中ですぐに蒔いてみられそうな小さな習慣やきっかけは何ですか？',
      gentleAction:
        '毎日5分だけ続けられそうな、ごく小さな日常習慣をひとつ決めてみる',
      meaningGuide:
        'ペンタクルのエースは、現実の中で着実に育っていく具体的な始まりと資源を象徴します。',
    },
  },
  'minor-pentacles-02': {
    en: {
      name: 'Two of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Flexible Balance', 'Rhythm', 'Adjusting'],
      insight:
        'Instead of juggling everything flawlessly, shift your weight gently in tune with today’s rhythm.',
      reflectionQuestion:
        'What two demands in your daily life could use a softer adjustment to feel better balanced?',
      gentleAction:
        'Lighten one overly tight item in today’s schedule so you have breathing room.',
      meaningGuide:
        'The Two of Pentacles highlights staying nimble and balanced amidst changing daily responsibilities.',
    },
    ja: {
      name: 'ペンタクルの2',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['しなやかな均衡', 'リズム', '調整'],
      insight:
        'いくつものことを完璧にこなそうとするより、今の自分のリズムに合わせて軽やかに重心を移してみてください。',
      reflectionQuestion:
        '最近の日々の中で、バランスを整えるために少し調整してみたいふたつの事柄は何ですか？',
      gentleAction:
        '今日の予定の中から無理のある計画をひとつだけ軽く見直してみる',
      meaningGuide:
        'ペンタクルの2は、移り変わる日常の中で柔軟に中心をとらえる感覚を映し出します。',
    },
  },
  'minor-pentacles-03': {
    en: {
      name: 'Three of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Careful Craft', 'Collaboration', 'Building Skill'],
      insight:
        'Lasting work grows through patient care and sharing strengths with others rather than rushing solo.',
      reflectionQuestion:
        'What craft, project, or everyday practice would you enjoy refining steadily with genuine care?',
      gentleAction:
        'Invite one thoughtful outside perspective or piece of feedback on something you have been tending.',
      meaningGuide:
        'The Three of Pentacles honors dedicated craftsmanship and building something worthwhile together.',
    },
    ja: {
      name: 'ペンタクルの3',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['丁寧さ', '協力', '力を磨く'],
      insight:
        '派手な成果よりも、黙々と心を込めて取り組み、互いの良さを持ち寄ることで確かな形が生まれます。',
      reflectionQuestion:
        '今あなたが手間を惜しまず、もう少し丁寧に育てていきたい仕事や技術は何ですか？',
      gentleAction:
        'ひとりで悩んでいたことについて、周囲の意見や感想を気軽に尋ねてみる',
      meaningGuide:
        'ペンタクルの3は、誠実なプロセスと協力を通して価値を積み重ねる姿勢を象徴します。',
    },
  },
  'minor-pentacles-04': {
    en: {
      name: 'Four of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Holding Tight', 'Need for Safety', 'Loosening Grip'],
      insight:
        'Clutching too tightly out of fear of losing ground leaves very little room for fresh air to enter.',
      reflectionQuestion:
        'What habit, worry, or routine are you gripping extra tightly right now just to feel safe?',
      gentleAction:
        'Leave a tiny pocket of unscheduled space around one thing you usually try to control completely.',
      meaningGuide:
        'The Four of Pentacles examines the balance between healthy security and knowing when to soften your grip.',
    },
    ja: {
      name: 'ペンタクルの4',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['守りたい心', '安定への願い', '余白'],
      insight:
        '持っているものを失うまいとぎゅっと握りしめすぎると、新しい風が吹き込む隙間まで狭まってしまいます。',
      reflectionQuestion:
        '安心感を保とうとするあまり、必要以上に強く握りしめている習慣や考えは何ですか？',
      gentleAction:
        '完璧に管理しようとしていたことをひとつだけ選び、小さな余白を残してみる',
      meaningGuide:
        'ペンタクルの4は、安定への自然な欲求とほどよい手放しとのバランスを見つめさせます。',
    },
  },
  'minor-pentacles-05': {
    en: {
      name: 'Five of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Feeling Scarce', 'Asking for Help', 'Warm Window'],
      insight:
        'During seasons that feel scarce or lonely, remember to glance up toward the warm windows of support nearby.',
      reflectionQuestion:
        'What feels too heavy to carry alone right now where accepting gentle support would be okay?',
      gentleAction:
        'Name one person, community, or practical resource you could lean on if things feel stretched.',
      meaningGuide:
        'The Five of Pentacles gently reminds us that connection and warmth remain accessible even in lean times.',
    },
    ja: {
      name: 'ペンタクルの5',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['心細さ', '助けを借りる', '温かい窓辺'],
      insight:
        'つらく心細い時期ほど、ひとりで耐え続けようとせず、すぐそばに開いている助けの窓に目を向けてみてください。',
      reflectionQuestion:
        '今あなたがひとりで抱えきれず、誰かの手を借りてもよさそうな部分は何ですか？',
      gentleAction:
        '困ったときに頼れる人や支えとなる場所をひとつ思い浮かべてみる',
      meaningGuide:
        'ペンタクルの5は、苦しさの中でも孤立せず、つながりと回復を見いだすまなざしを届けてくれます。',
    },
  },
  'minor-pentacles-06': {
    en: {
      name: 'Six of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Give and Receive', 'Generosity', 'Healthy Exchange'],
      insight:
        'Receiving kindness and help gracefully is just as much a part of healthy balance as offering it.',
      reflectionQuestion:
        'How does the balance between giving and receiving feel in your relationships and days lately?',
      gentleAction:
        'Thank someone sincerely for a small kindness—or pass along a simple, unhurried gesture of care.',
      meaningGuide:
        'The Six of Pentacles reflects mutual generosity and an even circulation of support.',
    },
    ja: {
      name: 'ペンタクルの6',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['やりとり', '分かち合い', '健やかな均衡'],
      insight:
        '誰かに与えることと同じくらい、差し出された親切や助けを素直に受け取ることも健やかなバランスのうちです。',
      reflectionQuestion:
        '最近の人間関係や日々の中で、「与えること」と「受け取ること」のバランスはどんな状態ですか？',
      gentleAction:
        '誰かの小さな親切に心から「ありがとう」と伝えるか、ささやかな思いやりを届けてみる',
      meaningGuide:
        'ペンタクルの6は、資源や想いの健やかな循環と互いへの敬意を象徴します。',
    },
  },
  'minor-pentacles-07': {
    en: {
      name: 'Seven of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Midway Pause', 'Value of Waiting', 'Steadiness'],
      insight:
        'Not seeing ripe fruit yet does not mean your time was wasted—pause quietly to appreciate how roots are growing.',
      reflectionQuestion:
        'Among the things you have tended steadily over time, what deserves a little more trust and patience?',
      gentleAction:
        'Jot down two or three quiet efforts you have kept up over the past few weeks.',
      meaningGuide:
        'The Seven of Pentacles encourages patient stocktaking rather than rushing premature judgment.',
    },
    ja: {
      name: 'ペンタクルの7',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['中間点検', '待つ価値', 'コツコツと'],
      insight:
        'すぐに実りが見えなくても無駄な時間ではありません。立ち止まって今の歩みを静かに確かめてみてください。',
      reflectionQuestion:
        'これまで地道に続けてきたことの中で、もう少し信じて待ってあげたいものは何ですか？',
      gentleAction:
        'この数週間で積み重ねてきた小さな取り組みを2〜3個書き出して確かめてみる',
      meaningGuide:
        'ペンタクルの7は、性急な評価ではなく、育ちゆく過程を落ち着いて振り返るまなざしを意味します。',
    },
  },
  'minor-pentacles-08': {
    en: {
      name: 'Eight of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Absorption', 'Faithful Practice', 'Craftsmanship'],
      insight:
        'Steady skill and quiet peace grow when you pour calm attention into ordinary daily repetitions.',
      reflectionQuestion:
        'What activity would feel grounding simply to immerse yourself in today without rushing the outcome?',
      gentleAction:
        'Give ten undivided, unhurried minutes to a single small task right in front of you.',
      meaningGuide:
        'The Eight of Pentacles celebrates patient immersion and the quiet dignity of steady practice.',
    },
    ja: {
      name: 'ペンタクルの8',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['没頭', '誠実な反復', '職人気質'],
      insight:
        '派手な飛躍よりも日々の小さな繰り返しに心を込めるとき、いつの間にか揺るがない力が身につきます。',
      reflectionQuestion:
        '結果を急がず、ただ静かに集中して向き合ってみたいことは何ですか？',
      gentleAction:
        '今取り組んでいることのうちひとつだけに、10分間じっくり向き合ってみる',
      meaningGuide:
        'ペンタクルの8は、地道な練習と誠実な集中がもたらす静かな充実感を象徴します。',
    },
  },
  'minor-pentacles-09': {
    en: {
      name: 'Nine of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Self-Reliance', 'Quiet Abundance', 'Your Own Garden'],
      insight:
        'You deserve to actually enjoy the calm order and space you have patiently cultivated for yourself.',
      reflectionQuestion:
        'Within the life you have tended through your own care, which personal ritual or quiet hour do you treasure most?',
      gentleAction:
        'Tend to yourself as if tending a beloved garden—enjoy a calm, unhurried meal or restful hour.',
      meaningGuide:
        'The Nine of Pentacles symbolizes grounded self-reliance and savoring the garden you grew.',
    },
    ja: {
      name: 'ペンタクルの9',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['自立', 'ゆとりの実り', '自分だけの庭'],
      insight:
        '自分自身の力で育ててきた暮らしの秩序とゆとりを、遠慮なく味わってよいのです。',
      reflectionQuestion:
        '自分で整えてきた日々の中で、いちばん大切に守り続けたいひとりの時間は何ですか？',
      gentleAction:
        '自分のための小さな庭を手入れするように、丁寧で心地よい休息の時間をとる',
      meaningGuide:
        'ペンタクルの9は、健やかな自立心と自分で育てた日常の豊かさを象徴します。',
    },
  },
  'minor-pentacles-10': {
    en: {
      name: 'Ten of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Enduring Value', 'Roots', 'Continuity'],
      insight:
        'Look slightly past fleeting achievements toward the roots and values that remain steady across seasons.',
      reflectionQuestion:
        'What values or quiet foundations do you hope will still anchor your life years from now?',
      gentleAction:
        'Bring to mind one enduring habit or cherished relationship you want to keep nurturing long-term.',
      meaningGuide:
        'The Ten of Pentacles represents lasting stability, belonging, and abundance that endures across time.',
    },
    ja: {
      name: 'ペンタクルの10',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['長く息づく価値', '基盤', 'つながりの継承'],
      insight:
        '目先の成果を超えて、時間が経っても揺るがず残り続ける暮らしの土台に目を向けてみるときかもしれません。',
      reflectionQuestion:
        '年月が流れても、人生の中にしっかり残っていてほしい価値観や支えは何ですか？',
      gentleAction:
        'これからもずっと大切にしたい生活習慣や、かけがえのない関係をひとつ思い浮かべてみる',
      meaningGuide:
        'ペンタクルの10は、時間や世代を越えて続く安心感と持続可能な豊かさを意味します。',
    },
  },
  'minor-pentacles-11': {
    en: {
      name: 'Page of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Willing Learner', 'Grounded Start', 'Making Real'],
      insight:
        'A patient willingness to learn step by step often carries you further than sudden bursts of speed.',
      reflectionQuestion:
        'What practical skill or steady daily habit feels rewarding to begin learning quietly right now?',
      gentleAction:
        'Break something you want to learn down into one very small first step on paper.',
      meaningGuide:
        'The Page of Pentacles embodies an earnest, grounded learner taking careful first steps.',
    },
    ja: {
      name: 'ペンタクルのペイジ',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['学ぶ姿勢', '誠実な始まり', '具体化'],
      insight:
        '小さなことから少しずつ学び身につけようとする姿勢こそ、結局いちばん遠くまで連れて行ってくれます。',
      reflectionQuestion:
        '今の現実の中で、落ち着いて学んでみたい実践的なスキルや習慣は何ですか？',
      gentleAction:
        '身につけたいことの最初の一歩を、ごく小さな単位にわけて書き出してみる',
      meaningGuide:
        'ペンタクルのペイジは、地に足をつけて誠実に学ぶ初心の姿勢を象徴します。',
    },
  },
  'minor-pentacles-12': {
    en: {
      name: 'Knight of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Consistency', 'Reliability', 'Step by Step'],
      insight:
        'It is completely fine not to move fast; keeping a steady rhythm you can trust carries real quiet strength.',
      reflectionQuestion:
        'What are you quietly keeping up better than you give yourself credit for, even if progress feels slow?',
      gentleAction:
        'Finish one basic, grounding task today at an unhurried, steady pace.',
      meaningGuide:
        'The Knight of Pentacles honors dependable consistency and honoring your own unhurried pace.',
    },
    ja: {
      name: 'ペンタクルのナイト',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['粘り強さ', '信頼', '一歩ずつ'],
      insight:
        '速くなくても大丈夫です。立ち止まりすぎず自分の歩幅で歩き続ける姿勢がいちばん頼りになります。',
      reflectionQuestion:
        '「ペースが遅いかも」と焦っているけれど、実はきちんと続けられていることは何ですか？',
      gentleAction:
        '今日取り組むことの中から最も基本的なひとつを、落ち着いて最後まで終えてみる',
      meaningGuide:
        'ペンタクルのナイトは、変わらぬ誠実さと信頼できる足取りを象徴します。',
    },
  },
  'minor-pentacles-13': {
    en: {
      name: 'Queen of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Warm Care', 'Practical Wisdom', 'Grounded Ease'],
      insight:
        'Real-world tending—a warm meal, clean air, an orderly corner—often steadies the heart better than grand theories.',
      reflectionQuestion:
        'What practical, everyday care would make your body and surroundings feel most supported right now?',
      gentleAction:
        'Drink a glass of warm water or spend five quiet minutes tidying the space around you.',
      meaningGuide:
        'The Queen of Pentacles represents nurturing daily life through warm, down-to-earth care.',
    },
    ja: {
      name: 'ペンタクルのクイーン',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['温かな世話', '現実的な知恵', '安心感'],
      insight:
        '立派な慰めよりも、温かい食事や整った空間といった日常の具体的なケアが心をいちばん守ってくれます。',
      reflectionQuestion:
        '今のあなたの身体と暮らしを、いちばん現実的に心地よく支えてあげられることは何ですか？',
      gentleAction:
        '温かい飲み物を飲んだり、身の回りを5分だけ整えて身体をいたわってみる',
      meaningGuide:
        'ペンタクルのクイーンは、日常を温かくしっかり整える現実的なケアを象徴します。',
    },
  },
  'minor-pentacles-14': {
    en: {
      name: 'King of Pentacles',
      suitTheme: PENTACLES_THEME_EN,
      keywords: ['Steady Mastery', 'Responsibility', 'Generous Ground'],
      insight:
        'A foundation built patiently without rushing holds steady even when surroundings shift.',
      reflectionQuestion:
        'Among the experience and resources you have gathered so far, what feels like your sturdiest anchor going forward?',
      gentleAction:
        'Check one steady way to invest your time, energy, or resources where they truly matter.',
      meaningGuide:
        'The King of Pentacles signifies durable stability and calm stewardship built through patience.',
    },
    ja: {
      name: 'ペンタクルのキング',
      suitTheme: PENTACLES_THEME_JA,
      keywords: ['安定した実り', '責任感', '豊かな土台'],
      insight:
        '焦らず丁寧に積み上げてきた土台の上では、どんな変化が訪れても簡単には揺らぎません。',
      reflectionQuestion:
        'これまで培ってきた経験や力の中で、これからも頼もしい支えとなってくれそうなものは何ですか？',
      gentleAction:
        '自分の時間・体力・資源をいちばん安定して活かせる使い方をひとつ見直してみる',
      meaningGuide:
        'ペンタクルのキングは、地道な努力の先にある揺るぎない安定とゆとりある責任感を意味します。',
    },
  },
};
