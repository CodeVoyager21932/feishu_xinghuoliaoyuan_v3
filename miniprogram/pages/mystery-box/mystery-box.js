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

      // 触发撒花特效
      this.triggerConfetti();

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

  // 简单的撒花特效
  triggerConfetti() {
    const query = wx.createSelectorQuery();
    query.select('#confetti')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const width = res[0].width;
        const height = res[0].height;

        // 设置画布尺寸
        const dpr = wx.getSystemInfoSync().pixelRatio;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const particles = [];
        const colors = ['#FFD700', '#FF4D4F', '#FFFFFF', '#4CAF50', '#2196F3'];

        // 创建粒子
        for (let i = 0; i < 100; i++) {
          particles.push({
            x: width / 2,
            y: height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            size: Math.random() * 6 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 100
          });
        }

        // 动画循环
        const animate = () => {
          ctx.clearRect(0, 0, width, height);
          let activeParticles = 0;

          particles.forEach(p => {
            if (p.life > 0) {
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.5; // 重力
              p.life--;
              activeParticles++;

              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fill();
            }
          });

          if (activeParticles > 0) {
            canvas.requestAnimationFrame(animate);
          }
        };

        canvas.requestAnimationFrame(animate);
      });
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
