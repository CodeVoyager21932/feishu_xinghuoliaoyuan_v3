// 云函数：获取每日名言
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  try {
    // 获取今天的日期（YYYY-MM-DD格式）
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 查询今日名言
    const result = await db.collection('daily_quotes')
      .where({
        date: dateStr
      })
      .get();

    if (result.data && result.data.length > 0) {
      return {
        success: true,
        data: result.data[0]
      };
    } else {
      // 如果没有今日数据，返回随机一条
      const countResult = await db.collection('daily_quotes').count();
      const total = countResult.total;
      
      if (total > 0) {
        const randomIndex = Math.floor(Math.random() * total);
        const randomResult = await db.collection('daily_quotes')
          .skip(randomIndex)
          .limit(1)
          .get();
        
        return {
          success: true,
          data: randomResult.data[0],
          isRandom: true
        };
      } else {
        // 返回默认数据
        return {
          success: true,
          data: {
            date: dateStr,
            image_url: '/images/daily-sign-bg/default.jpg',
            quote_content: '为有牺牲多壮志，敢教日月换新天。',
            author: '毛泽东',
            lucky_tips: '学习党史，传承红色基因'
          },
          isDefault: true
        };
      }
    }
  } catch (err) {
    console.error('获取每日名言失败', err);
    return {
      success: false,
      error: err.message
    };
  }
};
