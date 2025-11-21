// pages/index/index.js
const app = getApp();
const dailyQuotesData = require('../../data/daily-quotes.js');

Page({
  data: {
    userInfo: {
      nickName: '星火学习者',
      avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
    },
    greeting: '早安，传承星火',
    hasCheckedIn: false,
    todayQuote: {
      content: '星星之火，可以燎原。',
      quote: '世界是你们的，也是我们的，但是归根结底是你们的。',
      author: '一位老兵'
    },
    todayDate: '',
    userLevel: 1,
    stats: {
      continuous_days: 7,
      mastered_cards: 25,
      ai_chat_count: 50
    },
    heroCardTransform: '',
    heroCardGlare: '',
    isHeroCardTouching: false,
    showDailySign: false,
    showBadgeModal: false,
    currentBadge: null
  },

  onLoad() {
    this.checkLoginStatus();
    this.setDynamicGreeting();
    this.loadTodayQuote();
    this.loadUserStats();
    this.checkTodayCheckIn();
    this.setTodayDate();
    this.calculateLevel();
  },

  onShow() {
    // 每次显示页面时刷新统计数据和问候语
    this.setDynamicGreeting();
    if (app.globalData.userInfo) {
      this.loadUserStats();
    }
  },

  // 设置动态问候语
  setDynamicGreeting() {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 9) {
      greeting = '早安，传承星火';
    } else if (hour >= 9 && hour < 12) {
      greeting = '上午好，学习进行时';
    } else if (hour >= 12 && hour < 14) {
      greeting = '午安，稍作休息';
    } else if (hour >= 14 && hour < 18) {
      greeting = '下午好，继续前进';
    } else if (hour >= 18 && hour < 22) {
      greeting = '晚上好，温故知新';
    } else {
      greeting = '夜深了，重温历史';
    }

    this.setData({ greeting });
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



  // 加载今日名言
  loadTodayQuote() {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const todayQuote = dailyQuotesData[dayOfYear % dailyQuotesData.length];
    this.setData({ todayQuote });
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
          this.calculateLevel(); // Recalculate level when stats update
        }
      },
      fail: (err) => {
        console.error('获取用户统计失败', err);
      }
    });
  },

  // 检查今日是否已打卡
  checkTodayCheckIn() {
    const today = this.formatDate(new Date());
    const checkInRecords = wx.getStorageSync('checkInRecords') || [];

    if (Array.isArray(checkInRecords) && checkInRecords.includes(today)) {
      this.setData({ hasCheckedIn: true });
    }
  },

  // 打卡
  onCheckIn() {
    if (this.data.hasCheckedIn) {
      wx.showToast({
        title: '今日已打卡',
        icon: 'none'
      });
      return;
    }

    const today = this.formatDate(new Date());
    let checkInRecords = wx.getStorageSync('checkInRecords') || [];

    // 确保是数组
    if (!Array.isArray(checkInRecords)) {
      checkInRecords = [];
    }

    // 添加今日打卡记录
    if (!checkInRecords.includes(today)) {
      checkInRecords.push(today);
      wx.setStorageSync('checkInRecords', checkInRecords);
    }

    // 计算连续天数
    const continuousDays = this.calculateContinuousDays(checkInRecords);

    this.setData({ hasCheckedIn: true });

    // 显示打卡成功动画
    wx.showToast({
      title: `打卡成功！连续${continuousDays}天`,
      icon: 'success',
      duration: 2000
    });

    // 更新统计数据
    let stats = wx.getStorageSync('userStats') || {};
    stats.continuous_days = continuousDays;
    stats.total_days = checkInRecords.length;
    wx.setStorageSync('userStats', stats);

    this.loadUserStats();
  },

  // 计算连续打卡天数
  calculateContinuousDays(records) {
    if (!records || !Array.isArray(records) || records.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let continuous = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = this.formatDate(currentDate);
      if (records.includes(dateStr)) {
        continuous++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return continuous;
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 设置今日日期
  setTodayDate() {
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    this.setData({
      todayDate: `${month}月${day}日 周${weekDay}`
    });
  },

  // 计算用户等级
  calculateLevel() {
    // 简单逻辑：每掌握10张卡片升1级，或者每打卡7天升1级
    const { mastered_cards, continuous_days } = this.data.stats;
    const level = 1 + Math.floor(mastered_cards / 10) + Math.floor(continuous_days / 7);
    this.setData({ userLevel: level });
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



  // 跳转到机密档案
  goToMysteryBox() {
    wx.navigateTo({
      url: '/pages/mystery-box/mystery-box'
    });
  },

  // 跳转到珍藏馆
  goToMuseum() {
    wx.navigateTo({
      url: '/pages/museum/museum'
    });
  },

  // 跳转到PK对战
  goToPKBattle() {
    wx.navigateTo({
      url: '/pages/pk-battle/pk-battle'
    });
  },

  // 跳转到红色电台
  goToRadio() {
    wx.navigateTo({
      url: '/pages/radio/radio'
    });
  },

  // --- 3D Card Tilt Effect ---
  onReady() {
    this.updateHeroCardRect();
  },

  updateHeroCardRect() {
    const query = wx.createSelectorQuery();
    query.select('.today-hero-card').boundingClientRect(rect => {
      if (rect) {
        this.heroCardRect = rect;
      }
    }).exec();
  },

  onHeroCardTouchStart(e) {
    this.setData({ isHeroCardTouching: true });
  },

  onHeroCardTouchMove(e) {
    if (!this.heroCardRect) return;

    const touch = e.touches[0];
    const rect = this.heroCardRect;

    // Calculate center relative to viewport
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const percentX = (touch.clientX - centerX) / (rect.width / 2);
    const percentY = (touch.clientY - centerY) / (rect.height / 2);

    // Limit tilt range
    const maxTilt = 8; // degrees
    const rotateX = -percentY * maxTilt; // Tilt up/down (inverted Y)
    const rotateY = percentX * maxTilt;  // Tilt left/right

    // Glare effect
    const glareX = 50 + (percentX * 50);
    const glareY = 50 + (percentY * 50);
    const glareOpacity = Math.min(0.6, Math.sqrt(percentX * percentX + percentY * percentY) * 0.5);

    this.setData({
      heroCardTransform: `transform: perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(0.98, 0.98, 0.98);`,
      heroCardGlare: `background: radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%); opacity: ${glareOpacity};`
    });
  },

  onHeroCardTouchEnd(e) {
    this.setData({
      isHeroCardTouching: false,
      heroCardTransform: '', // Reset to default
      heroCardGlare: 'opacity: 0;'
    });
  },

  // 打开日签弹窗
  onOpenDailySign() {
    console.log('点击日签按钮');
    console.log('todayQuote:', this.data.todayQuote);

    if (!this.data.todayQuote || !this.data.todayQuote.quote_content) {
      wx.showToast({
        title: '数据加载中...',
        icon: 'none'
      });
      // 重新加载数据
      this.loadTodayQuote();
      return;
    }

    this.setData({ showDailySign: true });
    console.log('弹窗已打开，showDailySign:', this.data.showDailySign);
  },

  // 关闭日签弹窗
  onCloseDailySign() {
    this.setData({ showDailySign: false });
  },

  // 日签打卡回调
  onDailyCheckIn(e) {
    const { date } = e.detail;
    this.setData({ hasCheckedIn: true });

    // 刷新统计数据
    this.loadUserStats();
    this.calculateLevel();

    wx.showToast({
      title: '打卡成功！',
      icon: 'success'
    });
  },

  // 显示徽章详情
  showBadgeDetail() {
    this.setData({
      showBadgeModal: true,
      currentBadge: {
        name: '星火燎原 Lv.1',
        desc: '初入革命征程，点燃理想之火。',
        icon: '🔥',
        date: '2023.11.21'
      }
    });
    wx.vibrateShort({ type: 'medium' });
  },

  onCloseBadgeModal() {
    this.setData({ showBadgeModal: false });
  }
});
