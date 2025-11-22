// pages/hero-detail/index.js
const heroesData = require('../../data/heroes.js');
const { resolveImage } = require('../../utils/image-loader.js');

Page({
  data: {
    hero: null,
    loading: true
  },

  onLoad(options) {
    const { id } = options;
    if (id) {
      this.loadHeroDetail(id);
    } else {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  // 加载英雄详情
  loadHeroDetail(id) {
    const hero = heroesData.find(h => h.id === id);
    
    if (hero) {
      this.setData({
        hero: {
          ...hero,
          avatar: resolveImage(hero.avatar, 'hero')
        },
        loading: false
      });
    } else {
      wx.showToast({
        title: '未找到英雄信息',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  // 与英雄对话
  goToChat() {
    wx.navigateTo({
      url: `/pages/ai-chat/index?heroId=${this.data.hero.id}`
    });
  }
});
