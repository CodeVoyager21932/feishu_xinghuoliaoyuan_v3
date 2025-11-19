// pages/index/index.js
const app = getApp();
const heroesData = require('../../data/heroes.js');

Page({
  data: {
    userInfo: {
      nickName: '星火学习者',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    },
    hasCheckedIn: false,
    todayHero: {},
    stats: {
      continuous_days: 7,
      mastered_cards: 25,
      ai_chat_count: 50
    }
  },

  onLoad() {
    this.checkLoginStatus();
    this.loadTodayHero();
    this.loadUserStats();
    this.checkTodayCheckIn();
  },

  onShow() {
    // 每次显示页面时刷新统计数据
    if (app.globalData.userInfo) {
      this.loadUserStats();
    }
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = app.globalData.userInfo;
    if (userInfo) {
      this.setData({ userInfo });
    } else {
      // 未登录，跳转到登录页面或显示登录按钮
      this.getUserProfile();
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        this.setData({ userInfo });
        app.globalData.userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);
        
        // 调用云函数创建用户记录
        this.createUserRecord(userInfo);
      },
      fail: (err) => {
        console.error('获取用户信息失败', err);
        wx.showToast({
          title: '需要授权才能使用',
          icon: 'none'
        });
      }
    });
  },

  // 创建用户记录
  createUserRecord(userInfo) {
    wx.cloud.callFunction({
      name: 'create-user',
      data: {
        nickName: userInfo.nickName,
        avatarUrl: userInfo.avatarUrl
      },
      success: (res) => {
        console.log('用户记录创建成功', res);
        app.globalData.openid = res.result.openid;
      },
      fail: (err) => {
        console.error('创建用户记录失败', err);
      }
    });
  },

  // 加载今日英雄
  loadTodayHero() {
    // 根据日期选择英雄（每天不同）
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const todayHero = heroesData[dayOfYear % heroesData.length];
    
    this.setData({ todayHero });
  },

  // 加载用户统计数据
  loadUserStats() {
    wx.cloud.callFunction({
      name: 'get-user-stats',
      success: (res) => {
        if (res.result && res.result.stats) {
          this.setData({
            stats: res.result.stats
          });
        }
      },
      fail: (err) => {
        console.error('获取用户统计失败', err);
      }
    });
  },

  // 检查今日是否已打卡
  checkTodayCheckIn() {
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = wx.getStorageSync('lastCheckIn');
    
    if (lastCheckIn === today) {
      this.setData({ hasCheckedIn: true });
    }
  },

  // 打卡
  onCheckIn() {
    if (this.data.hasCheckedIn) {
      return;
    }

    wx.cloud.callFunction({
      name: 'check-in',
      success: (res) => {
        const today = new Date().toISOString().split('T')[0];
        wx.setStorageSync('lastCheckIn', today);
        
        this.setData({ hasCheckedIn: true });
        
        wx.showToast({
          title: `打卡成功！连续${res.result.continuous_days}天`,
          icon: 'success'
        });
        
        // 刷新统计数据
        this.loadUserStats();
      },
      fail: (err) => {
        console.error('打卡失败', err);
        wx.showToast({
          title: '打卡失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 跳转到英雄详情
  goToHeroDetail() {
    const heroId = this.data.todayHero.id;
    if (heroId) {
      wx.navigateTo({
        url: `/pages/hero-detail/hero-detail?heroId=${heroId}`
      });
    }
  },

  // 跳转到英雄长廊
  goToHeroes() {
    wx.navigateTo({
      url: '/pages/hero-gallery/hero-gallery'
    });
  },

  // 跳转到AI对话
  goToAIChat() {
    wx.navigateTo({
      url: '/pages/ai-chat/index'
    });
  },

  // 跳转到知识图谱
  goToGraph() {
    wx.navigateTo({
      url: '/pages/knowledge-graph/index'
    });
  },

  // 跳转到卡片学习
  goToCards() {
    wx.navigateTo({
      url: '/pages/card-learning/index'
    });
  },

  // 跳转到英雄长廊
  goToHeroes() {
    wx.navigateTo({
      url: '/pages/hero-gallery/hero-gallery'
    });
  }
});
