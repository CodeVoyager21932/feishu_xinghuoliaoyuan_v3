// pages/mystery-box/mystery-box.js
const { relics, rarityConfig } = require('../../data/relics.js');

Page({
  data: {
    userPoints: 500,
    drawCost: 100,
    isDrawing: false,
    showResult: false,
    resultRelic: {},
    resultIsNew: false
  },

  onLoad() {
    this.loadUserPoints();
  },

  loadUserPoints() {
    const userStats = wx.getStorageSync('userStats') || {};
    const points = userStats.points || 500;
    this.setData({ userPoints: points });
  },

  // 抽取信物（本地模拟）
  onDrawRelic() {
    if (this.data.isDrawing) return;

    if (this.data.userPoints < this.data.drawCost) {
      wx.showModal({
        title: '积分不足',
        content: '需要 100 积分才能开启机密档案',
        showCancel: false
      });
      return;
    }

    this.setData({ isDrawing: true });
    wx.vibrateShort();

    // 模拟抽奖
    setTimeout(() => {
      const drawnRelic = this.performDraw();
      const rarityInfo = rarityConfig[drawnRelic.rarity];

      this.setData({
        isDrawing: false,
        showResult: true,
        resultRelic: {
          ...drawnRelic,
          rarityName: rarityInfo.name
        },
        resultIsNew: true,
        userPoints: this.data.userPoints - this.data.drawCost
      });

      // 保存积分
      const userStats = wx.getStorageSync('userStats') || {};
      userStats.points = this.data.userPoints;
      wx.setStorageSync('userStats', userStats);

      wx.vibrateShort();
    }, 2000);
  },

  // 权重随机抽取
  performDraw() {
    const random = Math.random() * 100;
    let rarity = 'R';
    
    if (random < 5) {
      rarity = 'SSR';
    } else if (random < 30) {
      rarity = 'SR';
    }

    const relicsInRarity = relics.filter(r => r.rarity === rarity);
    const randomIndex = Math.floor(Math.random() * relicsInRarity.length);
    return relicsInRarity[randomIndex];
  },

  closeResult() {
    this.setData({ showResult: false });
  },

  goToMuseum() {
    wx.navigateTo({
      url: '/pages/museum/museum'
    });
  }
});
