// 每日签到名言数据
// 数据结构：date, image_url, quote_content, author, lucky_tips

const dailyQuotes = [
  {
    id: 'quote_001',
    date: '2025-11-20',
    image_url: '/images/daily-bg/bg-1.jpg',
    quote_content: '星星之火，可以燎原',
    author: '毛泽东',
    lucky_tips: {
      suitable: ['学习党史', '传承精神', '分享知识'],
      avoid: ['懈怠', '遗忘历史']
    }
  },
  {
    id: 'quote_002',
    date: '2025-11-21',
    image_url: '/images/daily-bg/bg-2.jpg',
    quote_content: '为有牺牲多壮志，敢教日月换新天',
    author: '毛泽东《七律·到韶山》',
    lucky_tips: {
      suitable: ['坚定信念', '勇于奋斗', '追求理想'],
      avoid: ['畏难', '退缩']
    }
  },
  {
    id: 'quote_003',
    date: '2025-11-22',
    image_url: '/images/daily-bg/bg-3.jpg',
    quote_content: '雄关漫道真如铁，而今迈步从头越',
    author: '毛泽东《忆秦娥·娄山关》',
    lucky_tips: {
      suitable: ['克服困难', '勇往直前', '开拓创新'],
      avoid: ['止步不前', '安于现状']
    }
  },
  {
    id: 'quote_004',
    date: '2025-11-23',
    image_url: '/images/daily-bg/bg-4.jpg',
    quote_content: '红军不怕远征难，万水千山只等闲',
    author: '毛泽东《七律·长征》',
    lucky_tips: {
      suitable: ['坚持不懈', '挑战自我', '团结协作'],
      avoid: ['半途而废', '轻言放弃']
    }
  },
  {
    id: 'quote_005',
    date: '2025-11-24',
    image_url: '/images/daily-bg/bg-5.jpg',
    quote_content: '为人民服务',
    author: '毛泽东',
    lucky_tips: {
      suitable: ['奉献社会', '帮助他人', '志愿服务'],
      avoid: ['自私自利', '损人利己']
    }
  },
  {
    id: 'quote_006',
    date: '2025-11-25',
    image_url: '/images/daily-bg/bg-6.jpg',
    quote_content: '人民，只有人民，才是创造世界历史的动力',
    author: '毛泽东',
    lucky_tips: {
      suitable: ['深入群众', '调查研究', '实事求是'],
      avoid: ['脱离实际', '闭门造车']
    }
  },
  {
    id: 'quote_007',
    date: '2025-11-26',
    image_url: '/images/daily-bg/bg-7.jpg',
    quote_content: '世上无难事，只要肯登攀',
    author: '毛泽东',
    lucky_tips: {
      suitable: ['攻坚克难', '持续学习', '精益求精'],
      avoid: ['畏首畏尾', '浅尝辄止']
    }
  }
];

// 根据日期获取今日名言
function getTodayQuote() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  return dailyQuotes[dayOfYear % dailyQuotes.length];
}

module.exports = {
  dailyQuotes,
  getTodayQuote
};
