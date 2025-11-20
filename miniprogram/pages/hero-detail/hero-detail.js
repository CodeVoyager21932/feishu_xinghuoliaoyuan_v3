// 英雄详情页面
const heroesData = require('../../data/heroes.js');

Page({
  data: {
    hero: {}
  },

  onLoad(options) {
    const heroId = options.heroId;
    this.loadHeroDetail(heroId);
  },

  // 加载英雄详情
  loadHeroDetail(heroId) {
    const hero = heroesData.find(h => h.id === heroId);
    if (hero) {
      this.setData({ hero });
      wx.setNavigationBarTitle({
        title: hero.name
      });
    } else {
      wx.showToast({
        title: '英雄信息不存在',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 与英雄对话
  onChatWithHero() {
    const hero = this.data.hero;
    // 修正：传递 heroId 而不是 heroName，匹配 ai-chat/index.js 的逻辑
    wx.navigateTo({
      url: `/pages/ai-chat/index?mode=hero&heroId=${hero.id}`
    });
  },

  // 分享英雄
  onShare() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  // 分享配置
  onShareAppMessage() {
    const hero = this.data.hero;
    return {
      title: `${hero.name} - ${hero.title}`,
      path: `/pages/hero-detail/hero-detail?heroId=${hero.id}`
    };
  }
});