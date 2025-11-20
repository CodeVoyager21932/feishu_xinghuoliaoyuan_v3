// 英雄详情页面
const heroesData = require('../../data/heroes.js');

Page({
  data: {
    hero: {},
    loading: true // 增加 loading 状态用于骨架屏
  },

  onLoad(options) {
    const heroId = options.heroId;
    this.loadHeroDetail(heroId);
    this.initAmbientSound();
  },

  onUnload() {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm.destroy();
    }
  },

  // 初始化环境音效
  initAmbientSound() {
    this.bgm = wx.createInnerAudioContext();
    // 示例：使用一个极低音量的白噪音或历史氛围音效
    // 实际项目中请替换为合法的音频链接
    this.bgm.src = 'https://down.ear0.com:3321/preview?soundid=38668&type=mp3';
    this.bgm.loop = true;
    this.bgm.volume = 0.1; // 极低音量，不打扰
    this.bgm.play();
  },

  // 加载英雄详情
  loadHeroDetail(heroId) {
    // 模拟网络请求延迟，展示骨架屏效果
    setTimeout(() => {
      const hero = heroesData.find(h => h.id === heroId);
      if (hero) {
        this.setData({
          hero,
          loading: false
        });

        // 触感反馈：内容加载完成
        wx.vibrateShort({ type: 'light' });
      } else {
        wx.showToast({
          title: '英雄信息不存在',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    }, 800); // 800ms 延迟
  },

  // 与英雄对话
  onChatWithHero() {
    wx.vibrateShort({ type: 'medium' }); // 触感反馈
    const hero = this.data.hero;
    wx.navigateTo({
      url: `/pages/ai-chat/index?mode=hero&heroId=${hero.id}`
    });
  },

  // 分享英雄
  onShare() {
    wx.vibrateShort({ type: 'light' }); // 触感反馈
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