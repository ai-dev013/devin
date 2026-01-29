import { Chapter, Dialogue } from '../types/game';

export const STORY_DIALOGUES: Record<string, Dialogue[]> = {
  intro: [
    { speaker: 'ナレーター', text: 'むかしむかし、平和な王国がありました...' },
    { speaker: 'ナレーター', text: 'しかし、闇竜王ダークネスが現れ、王国に闇をもたらしました。' },
    { speaker: 'ナレーター', text: '勇敢な猫の戦士ニャン太は、王国を救うため旅に出ることを決意しました。' },
    { speaker: '王様', text: 'ニャン太よ、お前だけが頼りじゃ。闇竜王を倒し、王国に光を取り戻してくれ！' },
    { speaker: 'ニャン太', text: 'にゃ！必ず闘竜王を倒して、王国を救ってみせるにゃ！' },
  ],
  chapter1_start: [
    { speaker: 'ナレーター', text: '第1章：始まりの森' },
    { speaker: 'ニャン太', text: 'まずは森を抜けて、次の町を目指すにゃ！' },
    { speaker: '村人', text: '気をつけてね。最近、森には凶暴なモンスターが出るようになったの。' },
    { speaker: 'ニャン太', text: '大丈夫にゃ！僕は勇者だからにゃ！' },
  ],
  chapter1_boss: [
    { speaker: 'ナレーター', text: '森の奥深くで、巨大な影が現れた...' },
    { speaker: '闇のオオカミ王', text: 'グルルル...この森は我が領域だ。通りたければ、我を倒してみせよ！' },
    { speaker: 'ニャン太', text: 'にゃんと！でも負けないにゃ！' },
  ],
  chapter1_clear: [
    { speaker: 'ニャン太', text: 'やったにゃ！闇のオオカミ王を倒したにゃ！' },
    { speaker: 'ナレーター', text: '森の鍵を手に入れた！これで次のエリアに進める。' },
    { speaker: '精霊', text: '勇者よ、よくぞ闇の獣を倒した。この先の洞窟には、さらなる試練が待っている。' },
    { speaker: 'ニャン太', text: 'ありがとうにゃ！頑張るにゃ！' },
  ],
  chapter2_start: [
    { speaker: 'ナレーター', text: '第2章：暗黒の洞窟' },
    { speaker: 'ニャン太', text: 'この洞窟は暗いにゃ...でも進むしかないにゃ！' },
    { speaker: '旅人', text: 'この洞窟には強力なモンスターがいる。気をつけて進むんだ。' },
  ],
  chapter2_boss: [
    { speaker: 'ナレーター', text: '洞窟の最深部で、巨大なクマが立ちはだかった...' },
    { speaker: '闇のクマ王', text: 'グオオオ！小さな猫が何の用だ！ここは我の縄張りだ！' },
    { speaker: 'ニャン太', text: '僕は王国を救うために進むにゃ！邪魔はさせないにゃ！' },
  ],
  chapter2_clear: [
    { speaker: 'ニャン太', text: 'やったにゃ！闇のクマ王も倒したにゃ！' },
    { speaker: 'ナレーター', text: '洞窟の鍵を手に入れた！' },
    { speaker: '賢者', text: '勇者よ、お前の力は確かに成長している。だが、闇竜王はさらに強大だ。' },
    { speaker: '賢者', text: 'この魔法書を受け取れ。新しい魔法を覚えることができるだろう。' },
    { speaker: 'ニャン太', text: 'ありがとうにゃ！もっと強くなるにゃ！' },
  ],
  chapter3_start: [
    { speaker: 'ナレーター', text: '第3章：試練の山' },
    { speaker: 'ニャン太', text: 'この山を越えれば、闇の城が見えるはずにゃ！' },
    { speaker: '山の番人', text: '若き勇者よ、この山には多くの試練がある。心して進め。' },
  ],
  chapter3_mid: [
    { speaker: 'ニャン太', text: 'はぁはぁ...山道は険しいにゃ...' },
    { speaker: '謎の声', text: '諦めるな、勇者よ。お前には王国を救う力がある。' },
    { speaker: 'ニャン太', text: '誰にゃ？...でも、ありがとうにゃ！頑張るにゃ！' },
  ],
  chapter4_start: [
    { speaker: 'ナレーター', text: '最終章：闇の城' },
    { speaker: 'ニャン太', text: 'ついに闇の城に着いたにゃ...ここに闘竜王がいるにゃ！' },
    { speaker: '城の門番', text: 'ここは闇竜王様の城だ！引き返せ！' },
    { speaker: 'ニャン太', text: '引き返さないにゃ！王国を救うために来たにゃ！' },
  ],
  final_boss: [
    { speaker: 'ナレーター', text: '闇の城の最上階、玉座の間...' },
    { speaker: '闇竜王ダークネス', text: 'フハハハ！ついに来たか、小さな猫の勇者よ！' },
    { speaker: 'ニャン太', text: '闇竜王！お前を倒して、王国に光を取り戻すにゃ！' },
    { speaker: '闇竜王ダークネス', text: '面白い！その勇気、試してやろう！我が闇の力を受けてみよ！' },
  ],
  ending: [
    { speaker: 'ナレーター', text: '激しい戦いの末、ニャン太は闇竜王を倒した！' },
    { speaker: '闇竜王ダークネス', text: 'バカな...この我が...小さな猫に...' },
    { speaker: 'ニャン太', text: 'やったにゃ！ついに闇竜王を倒したにゃ！' },
    { speaker: 'ナレーター', text: '闇が晴れ、王国に再び光が戻った。' },
    { speaker: '王様', text: 'ニャン太よ、よくぞ王国を救ってくれた！お前は真の勇者じゃ！' },
    { speaker: '村人たち', text: '勇者ニャン太万歳！' },
    { speaker: 'ニャン太', text: 'みんなのおかげにゃ！これからも王国を守るにゃ！' },
    { speaker: 'ナレーター', text: 'こうして、勇者ニャン太の冒険は幕を閉じた。' },
    { speaker: 'ナレーター', text: '王国には平和が戻り、人々は幸せに暮らしましたとさ。' },
    { speaker: 'ナレーター', text: 'めでたし、めでたし。' },
  ],
};

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    name: '第1章：始まりの森',
    description: '王国を救うため、まずは森を抜けて次の町を目指そう。',
    maps: ['village', 'forest'],
    bossId: 'darkWolf',
    unlocked: true,
    completed: false,
  },
  {
    id: 2,
    name: '第2章：暗黒の洞窟',
    description: '森を抜けた先には、暗い洞窟が待っている。',
    maps: ['cave'],
    bossId: 'darkBear',
    unlocked: false,
    completed: false,
  },
  {
    id: 3,
    name: '第3章：試練の山',
    description: '闇の城へ向かうため、険しい山を越えなければならない。',
    maps: ['mountain'],
    bossId: '',
    unlocked: false,
    completed: false,
  },
  {
    id: 4,
    name: '最終章：闇の城',
    description: '闇竜王が待つ城へ、最後の戦いに挑む。',
    maps: ['darkCastle'],
    bossId: 'dragon',
    unlocked: false,
    completed: false,
  },
];

export const NPC_DIALOGUES: Record<string, Dialogue[]> = {
  villager1: [
    { speaker: '村人', text: '勇者様、頑張ってください！' },
    { speaker: '村人', text: '森には危険なモンスターがいるので気をつけて。' },
  ],
  villager2: [
    { speaker: '老人', text: 'わしが若い頃は、この辺りも平和じゃったのう...' },
    { speaker: '老人', text: '闇竜王が現れてから、すべてが変わってしまった。' },
  ],
  shopkeeper: [
    { speaker: '店主', text: 'いらっしゃい！何をお求めですか？' },
  ],
  innkeeper: [
    { speaker: '宿屋の主人', text: '一晩泊まっていきますか？HPとMPが全回復しますよ。' },
  ],
  sage: [
    { speaker: '賢者', text: '勇者よ、魔法は戦いの重要な要素だ。' },
    { speaker: '賢者', text: 'MPを消費して強力な攻撃や回復ができる。うまく使いこなすのだ。' },
  ],
  spirit: [
    { speaker: '精霊', text: '勇者よ、あなたの勇気は本物です。' },
    { speaker: '精霊', text: 'この先も困難が待っていますが、諦めないでください。' },
  ],
};

export function getStoryDialogue(storyId: string): Dialogue[] {
  return STORY_DIALOGUES[storyId] || [];
}

export function getNpcDialogue(npcId: string): Dialogue[] {
  return NPC_DIALOGUES[npcId] || [];
}
