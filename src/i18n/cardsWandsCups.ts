import { LocalizedCardDictionary } from './types';

const WANDS_THEME_EN = 'Passion · Will · Creative Impulse';
const WANDS_THEME_JA = '情熱 · 意志 · 創造的な試み';
const CUPS_THEME_EN = 'Emotion · Connection · Care of Heart';
const CUPS_THEME_JA = '感情 · つながり · 心へのケア';

export const WANDS_CUPS_TRANSLATIONS: LocalizedCardDictionary = {
  // === WANDS (01..14) ===
  'minor-wands-01': {
    en: {
      name: 'Ace of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['First Spark', 'Inspiration', 'Will to Begin'],
      insight:
        'When a small curiosity lights up inside you, tending that first spark matters more than drafting a flawless plan.',
      reflectionQuestion:
        'What new idea or impulse has been quietly tugging at your curiosity lately?',
      gentleAction:
        'Jot down one fresh idea that came to mind in three short lines or less.',
      meaningGuide:
        'The Ace of Wands symbolizes pure initial enthusiasm and a seed of possibility before action even starts.',
    },
    ja: {
      name: 'ワンドのエース',
      suitTheme: WANDS_THEME_JA,
      keywords: ['最初の火種', 'ひらめき', '始まりの意志'],
      insight:
        '心の中で小さくきらめく好奇心があるなら、完璧な計画よりもその最初の火種を大切に見守ってみるのがよさそうです。',
      reflectionQuestion:
        '最近あなたの中で、不思議と心が惹かれている新しいアイデアや試みは何ですか？',
      gentleAction:
        'ふと浮かんだアイデアをひとつ、3行以内で短くメモに残してみる',
      meaningGuide:
        'ワンドのエースは、行動が生まれる前の純粋な情熱と可能性の種を象徴します。',
    },
  },
  'minor-wands-02': {
    en: {
      name: 'Two of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Horizon', 'Crossroads', 'Wider View'],
      insight:
        'Looking beyond your familiar fence can help today’s choice come into clearer, wider focus.',
      reflectionQuestion:
        'From where you stand right now, in which direction would you like to widen your view one step?',
      gentleAction:
        'Write down two paths you are considering side by side to compare how each feels.',
      meaningGuide:
        'The Two of Wands reflects standing firmly in the present while calmly gauging what lies ahead.',
    },
    ja: {
      name: 'ワンドの2',
      suitTheme: WANDS_THEME_JA,
      keywords: ['見通し', '選択の岐路', '視野の広がり'],
      insight:
        '慣れた枠の向こう側に目を向けると、今の選択がもう少し広く穏やかに見えてくることがあります。',
      reflectionQuestion:
        '今立っている場所から、あと一歩だけ広げて見てみたい視野はどこですか？',
      gentleAction:
        '迷っている事柄のふたつの方向を並べて書き出し、比べてみる',
      meaningGuide:
        'ワンドの2は、今いる場所を踏みしめながら次の方向を落ち着いて見定めるまなざしを示します。',
    },
  },
  'minor-wands-03': {
    en: {
      name: 'Three of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Patient Waiting', 'Expansion', 'Far Sight'],
      insight:
        'Instead of rushing the efforts you have already sent out, this is a moment to prepare calmly for the next stage.',
      reflectionQuestion:
        'Among the efforts you have already planted, what would benefit from a little more patient trust?',
      gentleAction:
        'Shift from checking immediate outcomes to picturing one small thing you want to try next week.',
      meaningGuide:
        'The Three of Wands symbolizes a wide horizon and unhurried patience after the first step has been taken.',
    },
    ja: {
      name: 'ワンドの3',
      suitTheme: WANDS_THEME_JA,
      keywords: ['待つ力', '広がり', '遠くを見る目'],
      insight:
        'すでに送り出した努力の結果を急いで追い立てるよりも、次の段階を静かに整えていくときかもしれません。',
      reflectionQuestion:
        'これまで注いできた労力の中で、もう少し時間をかけて見守ってあげたいものは何ですか？',
      gentleAction:
        '今すぐ結果を確かめる代わりに、来週やってみたい小さなことをひとつ思い浮かべる',
      meaningGuide:
        'ワンドの3は、最初の一歩を踏み出したあとの広い展望とゆとりある待機を象徴します。',
    },
  },
  'minor-wands-04': {
    en: {
      name: 'Four of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Small Celebration', 'Steadiness', 'Breather'],
      insight:
        'Even if a larger goal is still unfolding, it is completely okay to pause and celebrate how far you have come.',
      reflectionQuestion:
        'When did you recently feel quietly proud of yourself, even over something small?',
      gentleAction:
        'Think of one small thing you finished today and silently thank yourself for the effort.',
      meaningGuide:
        'The Four of Wands signifies a warm moment of relief and a gentle pause for celebration along the journey.',
    },
    ja: {
      name: 'ワンドの4',
      suitTheme: WANDS_THEME_JA,
      keywords: ['小さな祝福', '安定', 'ひと息'],
      insight:
        '大きな目標がまだ道半ばでも、ここまで歩いてきた歩みをひとまず祝ってあげてよいのです。',
      reflectionQuestion:
        '最近、ささやかでも「自分なりによくやったな」と感じられた瞬間はいつでしたか？',
      gentleAction:
        '今日やり終えた小さなことをひとつ思い出し、自分に「お疲れさま」と声をかける',
      meaningGuide:
        'ワンドの4は、旅の途中に訪れる温かな安堵感と小さな祝祭のひと息を意味します。',
    },
  },
  'minor-wands-05': {
    en: {
      name: 'Five of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Friction', 'Different Views', 'Tuning Energy'],
      insight:
        'Moments of clashing viewpoints are not always bad omens—they often reveal what each person truly values.',
      reflectionQuestion:
        'In a recent moment where opinions or feelings rubbed against each other, what were you really hoping to protect?',
      gentleAction:
        'Reframe an uncomfortable disagreement not as winning or losing, but as differing priorities in one brief line.',
      meaningGuide:
        'The Five of Wands illuminates how friction and competing energies can sharpen your awareness of your real intent.',
    },
    ja: {
      name: 'ワンドの5',
      suitTheme: WANDS_THEME_JA,
      keywords: ['摩擦', '異なる意見', 'エネルギーの調整'],
      insight:
        '考えがぶつかる瞬間は必ずしも悪いサインではなく、それぞれの基準が表に現れる過程なのかもしれません。',
      reflectionQuestion:
        '最近、意見や気持ちがすれ違った場面で、あなたが本当に守りたかったものは何ですか？',
      gentleAction:
        '居心地の悪かった対立を勝ち負けではなく「互いの基準の違い」として一行で整理してみる',
      meaningGuide:
        'ワンドの5は、競争や小さな摩擦の中で自分の本当の意図を磨き直す過程を映し出します。',
    },
  },
  'minor-wands-06': {
    en: {
      name: 'Six of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Recognition', 'Confidence', 'Measured Progress'],
      insight:
        'Before waiting for someone else’s applause, honoring your own effort builds a quieter, steadier confidence.',
      reflectionQuestion:
        'Setting aside others’ opinions, what part of what you have done feels genuinely well-earned to you?',
      gentleAction:
        'Write down one personal strength or quiet win you noticed in yourself recently.',
      meaningGuide:
        'The Six of Wands symbolizes healthy recognition of your efforts and the quiet strength to keep moving.',
    },
    ja: {
      name: 'ワンドの6',
      suitTheme: WANDS_THEME_JA,
      keywords: ['承認', '自信', '一歩の手応え'],
      insight:
        '誰かの評価より先に、自分が積み上げてきた過程を自ら認めてあげるとき、ぶれない自信が育ちます。',
      reflectionQuestion:
        '人の目を離れたところで、「これは自分なりによくできた」と感じる部分はどこですか？',
      gentleAction:
        '自分の強みや、最近の小さな達成をひとつだけノートに書き留めてみる',
      meaningGuide:
        'ワンドの6は、努力への健やかな承認とこれから先へ進む力を象徴します。',
    },
  },
  'minor-wands-07': {
    en: {
      name: 'Seven of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Standing Ground', 'Conviction', 'Holding Boundaries'],
      insight:
        'You do not have to accommodate every demand around you—clearly holding your own ground is allowed.',
      reflectionQuestion:
        'What personal boundary of yours has felt stretched or compromised just to keep the peace lately?',
      gentleAction:
        'Think of one gentle phrase you could use to pause or decline a request that feels too heavy.',
      meaningGuide:
        'The Seven of Wands invites you to reflect on protecting your energy and convictions under outside pressure.',
    },
    ja: {
      name: 'ワンドの7',
      suitTheme: WANDS_THEME_JA,
      keywords: ['自分を守る', '信念', '境界線の維持'],
      insight:
        'すべての求めに応えようと無理をするよりも、今の自分が守りたい場所をはっきりさせてよいのです。',
      reflectionQuestion:
        '最近、無理して譲ったり揺らいだりしている、あなた自身の大切な基準は何ですか？',
      gentleAction:
        '負担に感じる頼みごとに対して、丁寧に断ったり保留にしたりするための言葉を思い浮かべてみる',
      meaningGuide:
        'ワンドの7は、周囲のプレッシャーの中で自分の立場とエネルギーを守る姿勢を振り返らせてくれます。',
    },
  },
  'minor-wands-08': {
    en: {
      name: 'Eight of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Momentum', 'Riding the Flow', 'Clear Movement'],
      insight:
        'If overthinking has kept you frozen, moving lightly now may let you feel the natural momentum return.',
      reflectionQuestion:
        'What small task have you been putting off that might actually feel surprisingly easy once started?',
      gentleAction:
        'Send one overdue short reply or clear a tiny five-minute task off your mind.',
      meaningGuide:
        'The Eight of Wands symbolizes unobstructed flow and crisp, uncomplicated forward motion.',
    },
    ja: {
      name: 'ワンドの8',
      suitTheme: WANDS_THEME_JA,
      keywords: ['スピード感', '流れに乗る', '軽やかな動き'],
      insight:
        '考えすぎて立ち止まっていたのなら、今は軽く動きながら自然な流れを感じてみるときかもしれません。',
      reflectionQuestion:
        'ずっと先送りにしていたけれど、始めてみたら案外すぐ終わりそうなことは何ですか？',
      gentleAction:
        '後回しにしていた短い連絡や用事をひとつだけ、5分以内に片づけてみる',
      meaningGuide:
        'ワンドの8は、滞りなく流れるエネルギーと簡潔な実行力を象徴します。',
    },
  },
  'minor-wands-09': {
    en: {
      name: 'Nine of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Weariness', 'Endurance', 'Need for Rest'],
      insight:
        'If you have been holding on for a long time, it is okay to lower your guard and catch your breath before pushing again.',
      reflectionQuestion:
        'What kind of genuine rest are your body and mind asking for most right now?',
      gentleAction:
        'Cross one item off today’s to-do list and take fifteen unscheduled minutes of quiet.',
      meaningGuide:
        'The Nine of Wands reflects steady endurance through fatigue alongside the care required to recover.',
    },
    ja: {
      name: 'ワンドの9',
      suitTheme: WANDS_THEME_JA,
      keywords: ['疲れ', '持ちこたえる力', '休息の必要'],
      insight:
        'もう十分長く踏ん張ってきたのなら、さらに力を振り絞る前にいったん肩の荷を下ろして息をついてよいのです。',
      reflectionQuestion:
        '今のあなたの心と身体がいちばん求めている休息は、どんな時間ですか？',
      gentleAction:
        '今日やるべきことリストからひとつ消して、15分間何もしない時間をつくる',
      meaningGuide:
        'ワンドの9は、緊張の中でも諦めずに続けてきた忍耐と、同じくらい必要なセルフケアを映し出します。',
    },
  },
  'minor-wands-10': {
    en: {
      name: 'Ten of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Overload', 'Responsibility', 'Putting Down Weight'],
      insight:
        'When you try to carry everything alone, it becomes easy to lose sight of where you actually wanted to go.',
      reflectionQuestion:
        'Among the responsibilities sitting on your shoulders, which one could you set down or share for a while?',
      gentleAction:
        'Write down the heaviest obligation on your mind and name one small way to lighten it.',
      meaningGuide:
        'The Ten of Wands invites honest awareness of carrying too much and gently rebalancing the load.',
    },
    ja: {
      name: 'ワンドの10',
      suitTheme: WANDS_THEME_JA,
      keywords: ['荷の重さ', '責任感', '下ろす勇気'],
      insight:
        'ひとりで全部背負おうとしているうちに、本当に行きたかった方向を見失ってしまうことがあります。',
      reflectionQuestion:
        '今あなたが抱えている重荷の中で、少しの間おろしたり誰かと分け合ったりできそうなものは何ですか？',
      gentleAction:
        'いちばん重く感じている役割をひとつ書き出し、軽くする方法をひとつ見つけてみる',
      meaningGuide:
        'ワンドの10は、抱えすぎた責任感に気づき、荷物の重さを結び直す内省を助けてくれます。',
    },
  },
  'minor-wands-11': {
    en: {
      name: 'Page of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Curiosity', 'Fresh Excitement', 'Beginner’s Mind'],
      insight:
        'Letting go of the pressure to be good right away opens space to enjoy learning again.',
      reflectionQuestion:
        'If it were totally fine to be a clumsy beginner, what field or experience makes you curious right now?',
      gentleAction:
        'Read or watch one brief piece just out of pure curiosity about a topic that intrigues you.',
      meaningGuide:
        'The Page of Wands represents open-hearted exploration that enjoys discovery more than perfection.',
    },
    ja: {
      name: 'ワンドのペイジ',
      suitTheme: WANDS_THEME_JA,
      keywords: ['探究心', 'ときめき', '初心'],
      insight:
        '「うまくやらなければ」という重荷をおろして学ぶ人の目で眺めると、世界の新しさが見えてきます。',
      reflectionQuestion:
        '不器用なままでも大丈夫だとしたら、今あなたが興味を惹かれている分野や体験は何ですか？',
      gentleAction:
        '気になっていたテーマについて、気軽に資料や記事をひとつだけ読んでみる',
      meaningGuide:
        'ワンドのペイジは、結果よりも探求そのものを楽しむ開かれた好奇心を象徴します。',
    },
  },
  'minor-wands-12': {
    en: {
      name: 'Knight of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Drive', 'Boldness', 'Pacing'],
      insight:
        'Fiery momentum can carry you far, yet pausing occasionally to check your compass keeps your energy aligned.',
      reflectionQuestion:
        'In something you are pushing forward rapidly right now, what detail might deserve one calm check-in?',
      gentleAction:
        'Pause briefly in the middle of a fast-moving task and confirm your main intention in one sentence.',
      meaningGuide:
        'The Knight of Wands reflects unhesitating drive balanced with a steady sense of direction.',
    },
    ja: {
      name: 'ワンドのナイト',
      suitTheme: WANDS_THEME_JA,
      keywords: ['推進力', '大胆さ', 'ペース配分'],
      insight:
        '熱い行動力は大きな力になりますが、ときどき「自分はどこへ向かっているのか」と呼吸を合わせることも大切です。',
      reflectionQuestion:
        '今、勢いよく進めていることの中で、一度立ち止まって確かめておくとよさそうな部分は何ですか？',
      gentleAction:
        '気持ちが先行している事柄の前で一息つき、いちばん大切な目的を一文で確認してみる',
      meaningGuide:
        'ワンドのナイトは、迷いのない行動力と方向感覚のバランスを見つめさせてくれます。',
    },
  },
  'minor-wands-13': {
    en: {
      name: 'Queen of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Warm Confidence', 'Presence', 'Self-Trust'],
      insight:
        'When you trust who you naturally are without straining to prove it, a quiet warmth shines through.',
      reflectionQuestion:
        'In which everyday moments do you feel most comfortable and unmistakably yourself?',
      gentleAction:
        'Spend part of today doing something in a way that genuinely lifts your own spirits rather than pleasing expectations.',
      meaningGuide:
        'The Queen of Wands embodies warm vitality, quiet radiance, and unforced self-trust.',
    },
    ja: {
      name: 'ワンドのクイーン',
      suitTheme: WANDS_THEME_JA,
      keywords: ['温かな自信', '魅力', '自己信頼'],
      insight:
        '無理に証明しようとしなくても、自分らしさを穏やかに信じられるとき、自然な輝きが滲み出ます。',
      reflectionQuestion:
        'あなたが「いちばん自分らしく、心地よくいられる」と感じるのはどんな瞬間ですか？',
      gentleAction:
        '誰かの目線ではなく、自分の気分が心地よくなるやり方で今日の一部を過ごしてみる',
      meaningGuide:
        'ワンドのクイーンは、温かさの中に揺るぎない芯を持つ内面の活力と自己信頼を象徴します。',
    },
  },
  'minor-wands-14': {
    en: {
      name: 'King of Wands',
      suitTheme: WANDS_THEME_EN,
      keywords: ['Vision', 'Mature Agency', 'Grounded Passion'],
      insight:
        'Directing your energy with a long-term horizon rather than a passing mood brings steadier calm.',
      reflectionQuestion:
        'Looking ahead a few months, where does your future self most thank you for investing your energy now?',
      gentleAction:
        'Write down one guiding direction you want to stand by over the coming season.',
      meaningGuide:
        'The King of Wands signifies channeling passion into steady vision and thoughtful leadership.',
    },
    ja: {
      name: 'ワンドのキング',
      suitTheme: WANDS_THEME_JA,
      keywords: ['ビジョン', '成熟した主体性', '揺るがぬ情熱'],
      insight:
        'その場限りの気分ではなく少し遠くを見つめる目でエネルギーを使うと、心はずっと落ち着いてきます。',
      reflectionQuestion:
        '数か月後の自分のために、今いちばん大切に注いでおきたいエネルギーは何ですか？',
      gentleAction:
        'これから先も大事にしたい自分なりの方向性を、ノートに一行書き留めてみる',
      meaningGuide:
        'ワンドのキングは、情熱を成熟したビジョンと安定したリーダーシップへ育てていく姿勢を意味します。',
    },
  },

  // === CUPS (01..14) ===
  'minor-cups-01': {
    en: {
      name: 'Ace of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Fresh Feeling', 'Open Heart', 'Warm Resonance'],
      insight:
        'Notice the quiet moments that gently stir your heart without brushing them aside as too small.',
      reflectionQuestion:
        'What person, scene, or small gesture touched your heart softly in recent days?',
      gentleAction:
        'Bring back one moment that felt warm or thankful and linger with it for a few breaths.',
      meaningGuide:
        'The Ace of Cups represents an uncluttered emotional beginning and the grace of keeping your heart open.',
    },
    ja: {
      name: 'カップのエース',
      suitTheme: CUPS_THEME_JA,
      keywords: ['新しい感情', '心をひらく', '温かな余韻'],
      insight:
        '心が静かに動くささやかな感動を、見過ごさずにそのまま感じてみてよいのです。',
      reflectionQuestion:
        '最近、あなたの心をそっと揺らした出来事や人は何でしたか？',
      gentleAction:
        'ありがたかったことや温かかった記憶をひとつ思い浮かべ、しばらくその余韻に浸ってみる',
      meaningGuide:
        'カップのエースは、澄んだ感情の始まりと心をひらくゆとりを象徴します。',
    },
  },
  'minor-cups-02': {
    en: {
      name: 'Two of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Empathy', 'Honest Connection', 'Mutual Respect'],
      insight:
        'Deep connection grows less from polished speeches and more from listening to each other as you are.',
      reflectionQuestion:
        'Who would you like to share an honest heart with right now—or how is your conversation with yourself lately?',
      gentleAction:
        'Check in warmly with someone you care about, or offer yourself one gentle, reassuring sentence.',
      meaningGuide:
        'The Two of Cups reflects equal, heartfelt understanding and quiet harmony between two hearts.',
    },
    ja: {
      name: 'カップの2',
      suitTheme: CUPS_THEME_JA,
      keywords: ['共感', '誠実なつながり', '相互の尊重'],
      insight:
        '深い結びつきは、立派な言葉よりもお互いの気持ちをそのまま受け止め合う瞬間に育ちます。',
      reflectionQuestion:
        '今、正直な気持ちを分かち合いたい相手や、あるいは自分自身との対話はどんな状態ですか？',
      gentleAction:
        '大切な人にちょっとした近況を尋ねるか、自分自身にやさしい一言をかけてあげる',
      meaningGuide:
        'カップの2は、対等で温かな共感と心の調和を映し出します。',
    },
  },
  'minor-cups-03': {
    en: {
      name: 'Three of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Shared Joy', 'Friendship', 'Lightness Together'],
      insight:
        'Sharing even a sliver of what you have been carrying alone can bring immediate breathing room.',
      reflectionQuestion:
        'With the people around whom you feel most at ease, what simple story or laugh would you like to share?',
      gentleAction:
        'Send a light, no-pressure hello to someone who brings comfort, or recall a happy memory together.',
      meaningGuide:
        'The Three of Cups celebrates warm camaraderie and the quiet relief of feeling supported.',
    },
    ja: {
      name: 'カップの3',
      suitTheme: CUPS_THEME_JA,
      keywords: ['分かち合う喜び', '友情', '気楽なつながり'],
      insight:
        'ひとりで抱え込もうとしていた気持ちを誰かと軽く分かち合うと、ふっと息がつけることがあります。',
      reflectionQuestion:
        '一緒にいると心がほぐれる人たちと、今どんな話をしてみたいですか？',
      gentleAction:
        '気の置けない知人に短い挨拶を送ったり、楽しかった記憶を思い出したりしてみる',
      meaningGuide:
        'カップの3は、人とのつながりの中で得られる軽やかな喜びや安心感を象徴します。',
    },
  },
  'minor-cups-04': {
    en: {
      name: 'Four of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Quiet Apathy', 'Emotional Fatigue', 'Shifting Gaze'],
      insight:
        'When everything feels oddly flat, notice emotional tiredness first rather than forcing yourself to feel excited.',
      reflectionQuestion:
        'Amid familiar routines lately, is there a quiet comfort or kindness nearby that you have been overlooking?',
      gentleAction:
        'Notice one tiny unfamiliar detail in an everyday room or street you usually pass on autopilot.',
      meaningGuide:
        'The Four of Cups highlights emotional weariness while gently nudging you to look up when ready.',
    },
    ja: {
      name: 'カップの4',
      suitTheme: CUPS_THEME_JA,
      keywords: ['倦怠感', '心の疲れ', '視線の切り替え'],
      insight:
        '何をしてもしっくりこないと感じるときは、さらに何かを足す前に、心が疲れていることに気づいてあげてください。',
      reflectionQuestion:
        '慣れた日常の中で、当たり前として見過ごしている小さな慰めや恵みはありませんか？',
      gentleAction:
        '普段なんとなく通り過ぎていた風景や暮らしの中から、新しい発見をひとつ探してみる',
      meaningGuide:
        'カップの4は、心の倦怠感の中で本当に求めているものや身近な贈り物をもう一度見つめさせます。',
    },
  },
  'minor-cups-05': {
    en: {
      name: 'Five of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Disappointment', 'Sense of Loss', 'What Remains'],
      insight:
        'It is natural for your heart to linger on what spilled; once you honor that ache, slowly glance toward what still stands.',
      reflectionQuestion:
        'Behind what feels disappointing right now, what steady, meaningful thing still remains beside you?',
      gentleAction:
        'Acknowledge a feeling of hurt honestly, then jot down one quiet thing that is still intact today.',
      meaningGuide:
        'The Five of Cups honors grief and regret gently while keeping the door open toward quiet recovery.',
    },
    ja: {
      name: 'カップの5',
      suitTheme: CUPS_THEME_JA,
      keywords: ['名残惜しさ', '喪失感', '残っているもの'],
      insight:
        'こぼれてしまったものに心が留まるのは自然なことです。十分に惜しんだあと、まだ手元に残っているものにもそっと目を向けてみてください。',
      reflectionQuestion:
        '残念だった出来事のすぐ後ろに、今もあなたのそばに変わらず残っている大切なものは何ですか？',
      gentleAction:
        '傷ついた気持ちを無理に押さえ込まず認めたうえで、今残っている感謝をひとつだけ書いてみる',
      meaningGuide:
        'カップの5は、喪失感や後悔の感情を尊重しながらも、回復へのまなざしをそっと手渡してくれます。',
    },
  },
  'minor-cups-06': {
    en: {
      name: 'Six of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Memory', 'Innocence', 'Warm Nostalgia'],
      insight:
        'Pure memories from earlier seasons can become a quiet well of comfort for who you are today.',
      reflectionQuestion:
        'What did a younger version of you love wholeheartedly, long before obligations got in the way?',
      gentleAction:
        'Listen to an old favorite song or note one warm memory that still brings ease.',
      meaningGuide:
        'The Six of Cups draws upon genuine warmth from the past to soften and restore the present.',
    },
    ja: {
      name: 'カップの6',
      suitTheme: CUPS_THEME_JA,
      keywords: ['思い出', '純粋さ', '温かな回想'],
      insight:
        '過ぎた日々の純粋な記憶は、今の自分をそっと撫でてくれる静かな支えになることがあります。',
      reflectionQuestion:
        '子どもの頃や昔のあなたが、心から好きだったものは何でしたか？',
      gentleAction:
        '昔よく聴いていた音楽を流したり、温かな記憶をひとつノートに残したりしてみる',
      meaningGuide:
        'カップの6は、過去のやさしい記憶を通して今の心を癒やす象徴です。',
    },
  },
  'minor-cups-07': {
    en: {
      name: 'Seven of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Many Possibilities', 'Imagination', 'Priority'],
      insight:
        'When too many wishes pull your mind in every direction, choose just the one that touches your heart most deeply.',
      reflectionQuestion:
        'Out of all the hopes floating in your mind right now, which single one feels most genuine to you?',
      gentleAction:
        'List the ideas swirling in your head and draw a quiet circle around the one that resonates most.',
      meaningGuide:
        'The Seven of Cups invites clarity amidst rich imagination, helping you ground what truly matters.',
    },
    ja: {
      name: 'カップの7',
      suitTheme: CUPS_THEME_JA,
      keywords: ['多くの選択肢', '想像', '優先順位'],
      insight:
        'やりたいことが多すぎて心が落ち着かないときは、すべての中から今いちばん心に響くひとつだけを選んでみてください。',
      reflectionQuestion:
        '頭の中に浮かぶたくさんの願いの中で、今いちばん心から望んでいるひとつは何ですか？',
      gentleAction:
        '浮かぶ考えをすべて書き出し、その中からいちばん惹かれるものに丸をつけてみる',
      meaningGuide:
        'カップの7は、豊かな想像と多くの選択肢の中で現実的な中心を見つけていく過程を映します。',
    },
  },
  'minor-cups-08': {
    en: {
      name: 'Eight of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Moving On', 'Deeper Meaning', 'Emotional Shift'],
      insight:
        'Even if things look fine on the surface, stepping toward deeper meaning makes sense when your heart no longer feels nourished here.',
      reflectionQuestion:
        'Where are you staying purely out of habit, even though a part of you knows you are ready for the next chapter?',
      gentleAction:
        'Quietly name one habit or attachment that no longer feels fulfilling and write why.',
      meaningGuide:
        'The Eight of Cups honors the quiet courage to walk away from what is merely familiar in search of truth.',
    },
    ja: {
      name: 'カップの8',
      suitTheme: CUPS_THEME_JA,
      keywords: ['旅立ち', 'より深い意味', '心の転機'],
      insight:
        '見た目には問題がなさそうでも、心がもう満たされていないと感じるなら、新しい意味を求めて歩き出すときかもしれません。',
      reflectionQuestion:
        '慣れているからそこに留まっているけれど、本当は次の段階へ進みたいと感じている部分はどこですか？',
      gentleAction:
        'もう自分の心を満たしてくれなくなった習慣やこだわりをひとつ、静かに書き留めてみる',
      meaningGuide:
        'カップの8は、慣れ親しんだものを後にして、より誠実な充足を探しに出る静かな勇気を象徴します。',
    },
  },
  'minor-cups-09': {
    en: {
      name: 'Nine of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Contentment', 'Gratitude', 'Simple Fullness'],
      insight:
        'You do not have to wait for distant perfection to enjoy the quiet contentment already resting in your hands.',
      reflectionQuestion:
        'What area of your life already feels surprisingly settled and enough just as it is right now?',
      gentleAction:
        'Pause to savor one ordinary comfort you enjoyed today instead of rushing past it.',
      meaningGuide:
        'The Nine of Cups invites gratitude and genuine satisfaction independent of comparison.',
    },
    ja: {
      name: 'カップの9',
      suitTheme: CUPS_THEME_JA,
      keywords: ['満足感', '感謝の心', '素朴な充実'],
      insight:
        '遠い場所の完璧さを待たなくても、今すでに手の中にあるささやかな満足を味わってよいのです。',
      reflectionQuestion:
        '今のあなたの暮らしの中で、「すでに十分うまく根づいているな」と感じられる部分は何ですか？',
      gentleAction:
        '今日受け取った小さな心地よさをひとつ、意識してじっくり味わってみる',
      meaningGuide:
        'カップの9は、外との比較を離れて今ここにある満ち足りた感覚を味わう姿勢を意味します。',
    },
  },
  'minor-cups-10': {
    en: {
      name: 'Ten of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Emotional Peace', 'Belonging', 'Harmony'],
      insight:
        'Simply picturing the spaces and relationships where your heart feels safe already makes your direction clearer.',
      reflectionQuestion:
        'When you think of true emotional ease and belonging, what quiet scene comes to mind?',
      gentleAction:
        'Write a few words describing the traits of places or people that let your shoulders drop.',
      meaningGuide:
        'The Ten of Cups represents heartfelt peace, belonging, and harmony woven into everyday life.',
    },
    ja: {
      name: 'カップの10',
      suitTheme: CUPS_THEME_JA,
      keywords: ['心の平穏', '安心できる居場所', '調和'],
      insight:
        '心が安心してくつろげる人間関係や空間をイメージするだけでも、進みたい方向はすっと見えてきます。',
      reflectionQuestion:
        'あなたにとって「心がほっとほどける安らぎ」とは、どんな風景として浮かびますか？',
      gentleAction:
        '一緒にいて安心できる人や空間の特徴を、短く書き留めてみる',
      meaningGuide:
        'カップの10は、人とのつながりと心の内面が調和する温かな平穏と帰属感を象徴します。',
    },
  },
  'minor-cups-11': {
    en: {
      name: 'Page of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Gentle Sensitivity', 'Intuitive Whisper', 'Candor'],
      insight:
        'Even the smallest ripple of feeling may carry a quiet story worth noticing with kindness.',
      reflectionQuestion:
        'What honest, tender feeling has been rising quietly inside you lately?',
      gentleAction:
        'Describe your mood right now as a color or type of weather in one line without analyzing it.',
      meaningGuide:
        'The Page of Cups reflects soft receptivity and expressing honest emotion lightly.',
    },
    ja: {
      name: 'カップのペイジ',
      suitTheme: CUPS_THEME_JA,
      keywords: ['繊細な感性', '直感のささやき', '素直さ'],
      insight:
        '些細に見える気持ちの揺らぎの中にも、今の自分へそっと語りかける小さな物語が込められていることがあります。',
      reflectionQuestion:
        '最近、心の中で小さく芽生えている素直な感情は何ですか？',
      gentleAction:
        '今の気分を評価せずに、色や天気にたとえて一行だけ書き留めてみる',
      meaningGuide:
        'カップのペイジは、柔らかな感受性と気持ちを素直に表現する姿勢を映し出します。',
    },
  },
  'minor-cups-12': {
    en: {
      name: 'Knight of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Heartfelt Gesture', 'Idealism', 'Following Heart'],
      insight:
        'Set aside pure efficiency for a moment and listen gently to whatever draws your genuine affection.',
      reflectionQuestion:
        'If practical conditions were quiet for a while, what warms your heart most effortlessly?',
      gentleAction:
        'Carve out even ten intentional minutes today for something you love purely because it moves you.',
      meaningGuide:
        'The Knight of Cups symbolizes moving sincerely toward what your heart truly cares about.',
    },
    ja: {
      name: 'カップのナイト',
      suitTheme: CUPS_THEME_JA,
      keywords: ['真心の表現', 'ロマン', '心に従う'],
      insight:
        '効率や計算を少しお休みして、心が本当に惹かれるほうへ耳を傾けてみるときかもしれません。',
      reflectionQuestion:
        '条件をいったん抜きにしたら、今あなたの心がいちばん温かく反応することは何ですか？',
      gentleAction:
        '好きなことのために、ほんの少しの時間でも意識的にとってみる',
      meaningGuide:
        'カップのナイトは、理想や感情を大切にしながら真心に向かって歩む姿を象徴します。',
    },
  },
  'minor-cups-13': {
    en: {
      name: 'Queen of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Deep Empathy', 'Self-Tending', 'Emotional Calm'],
      insight:
        'As attentively as you notice others’ feelings, your own inner peace deserves the same tender protection.',
      reflectionQuestion:
        'What feeling of your own got quietly pushed aside while you were busy caring for everyone else?',
      gentleAction:
        'Check in with yourself first today—ask gently how your heart is actually doing.',
      meaningGuide:
        'The Queen of Cups embodies compassionate depth paired with steady emotional boundaries.',
    },
    ja: {
      name: 'カップのクイーン',
      suitTheme: CUPS_THEME_JA,
      keywords: ['深い共感', '自己ケア', '心の安定'],
      insight:
        '人の気持ちを細かく気遣うのと同じくらい、自分の心の境界線や平穏も大切に守ってあげてください。',
      reflectionQuestion:
        '誰かに配慮するあまり、少し後回しにしていたあなた自身の感情は何ですか？',
      gentleAction:
        '今の自分の心がどんな状態にあるのか、まず自分自身に優しく尋ねてみる',
      meaningGuide:
        'カップのクイーンは、深い共感力と揺るぎない心のケアを象徴します。',
    },
  },
  'minor-cups-14': {
    en: {
      name: 'King of Cups',
      suitTheme: CUPS_THEME_EN,
      keywords: ['Emotional Maturity', 'Generosity', 'Equanimity'],
      insight:
        'Even when strong waves rise inside, you can watch them gently without letting them sweep you away.',
      reflectionQuestion:
        'In a situation stirring your emotions lately, what steadier, kinder perspective helps you stay centered?',
      gentleAction:
        'When a strong feeling rises today, take three slow breaths before responding.',
      meaningGuide:
        'The King of Cups signifies calm emotional balance—honoring feelings deeply while staying anchored.',
    },
    ja: {
      name: 'カップのキング',
      suitTheme: CUPS_THEME_JA,
      keywords: ['成熟した感情', '寛容さ', '平常心'],
      insight:
        '感情が大きく波打つときでも、その波に飲み込まれず一歩引いて見つめることができます。',
      reflectionQuestion:
        '最近心が揺れ動く場面で、もう少し寛容で落ち着いた視点から眺めるとしたらどう見えますか？',
      gentleAction:
        '感情が湧き上がったとき、すぐ反応せずに深く三回息を吸って吐いてみる',
      meaningGuide:
        'カップのキングは、感情を抑え込むのではなく受け止めながら中心を保つ成熟した平常心を意味します。',
    },
  },
};
