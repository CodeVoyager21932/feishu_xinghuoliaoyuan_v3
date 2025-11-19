// 英雄长廊页面
const heroesData = require('../../data/heroes.js');

Page({
  data: {
    allHeroes: [],
    filteredHeroes: [],
    currentEra: 'all'
  },

  onLoad(options) {
    this.loadHeroes();
  },

  // 加载英雄数据
  loadHeroes() {
    this.setData({
      allHeroes: heroesData,
      filteredHeroes: heroesData
    });
  },

  // 筛选切换
  onFilterChange(e) {
    const era = e.currentTarget.dataset.era;
    
    let filtered = [];
    if (era === 'all') {
      filtered = this.data.allHeroes;
    } else {
      filtered = this.data.allHeroes.filter(hero => hero.era === era);
    }

    this.setData({
      currentEra: era,
      filteredHeroes: filtered
    });
  },

  // 点击英雄卡片
  onHeroClick(e) {
    const hero = e.currentTarget.dataset.hero;
    wx.navigateTo({
      url: `/pages/hero-detail/hero-detail?heroId=${hero.id}`
    });
  }
});