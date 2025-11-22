// pages/hero-gallery/index.js
const heroesData = require('../../data/heroes.js');
const { resolveImage } = require('../../utils/image-loader.js');

Page({
  data: {
    heroes: [],
    filteredHeroes: [],
    currentEra: 'all',
    eraList: [
      { key: 'all', name: '全部' },
      { key: 'revolution', name: '革命时期' },
      { key: 'construction', name: '建设时期' },
      { key: 'reform', name: '改革时期' },
      { key: 'newera', name: '新时代' }
    ]
  },

  onLoad() {
    this.loadHeroes();
  },

  // 加载英雄数据
  loadHeroes() {
    const heroes = heroesData.map(hero => ({
      ...hero,
      avatar: resolveImage(hero.avatar, 'hero')
    }));

    this.setData({
      heroes,
      filteredHeroes: heroes
    });
  },

  // 切换时期筛选
  onEraChange(e) {
    const era = e.currentTarget.dataset.era;
    this.setData({ currentEra: era });
    this.filterHeroes(era);
  },

  // 筛选英雄
  filterHeroes(era) {
    if (era === 'all') {
      this.setData({ filteredHeroes: this.data.heroes });
    } else {
      const filtered = this.data.heroes.filter(hero => hero.era === era);
      this.setData({ filteredHeroes: filtered });
    }
  },

  // 跳转到英雄详情
  goToDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/hero-detail/index?id=${id}`
    });
  }
});
