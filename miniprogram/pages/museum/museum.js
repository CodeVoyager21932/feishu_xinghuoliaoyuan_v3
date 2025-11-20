// pages/museum/museum.js
const { relics, rarityConfig } = require('../../data/relics.js');

Page({
  data: {
    allRelics: [],
    displayRelics: [],
    collectedCount: 0,
    totalCount: 0,
    collectionRate: 0
  },

  onLoad() {
    this.loadAllRelics();
  },

  loadAllRelics() {
    const allRelics = relics.map(relic => ({
      ...relic,
      rarityName: rarityConfig[relic.rarity].name,
      owned: false
    }));

    this.setData({
      allRelics,
      displayRelics: allRelics,
      totalCount: allRelics.length,
      collectedCount: 0,
      collectionRate: 0
    });
  },

  goToMysteryBox() {
    wx.navigateTo({
      url: '/pages/mystery-box/mystery-box'
    });
  }
});
