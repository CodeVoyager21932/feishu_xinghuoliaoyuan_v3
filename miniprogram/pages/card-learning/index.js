// pages/card-learning/index.js
const cardsData = require('../../data/cards.js');

// 艾宾浩斯遗忘曲线复习间隔（毫秒）
const REVIEW_INTERVALS = [
  5 * 60 * 1000,      // 5分钟
  60 * 60 * 1000,     // 1小时
  24 * 60 * 60 * 1000 // 1天
];

Page({
  data: {
    // 卡片数据
    currentCard: null,
    nextCard: null,
    cardQueue: [],
    
    // 状态
    flipped: false,
    swiping: false,
    swipeX: 0,
    swipeRotate: 0,
    swipeDirection: '',
    isLoading: true,
    
    // 进度
    todayCount: 0,
    totalCount: 20,
    progressPercent: 0,
    
    // 统计
    stats: {
      mastered: 0,
      reviewing: 0,
      remaining: 0
    }
  },

  onLoad() {
    this.loadCards();
    this.loadUserProgress();
  },

  onShow() {
    // 每次显示页面时检查是否有需要复习的卡片
    this.checkReviewCards();
  },

  // 加载卡片数据
  loadCards() {
    // 从本地存储获取学习记录
    const learningRecords = wx.getStorageSync('learning_records') || {};
    
    // 分类卡片
    const masteredCards = [];
    const reviewingCards = [];
    const newCards = [];
    
    cardsData.forEach(card => {
      const record = learningRecords[card.id];
      if (!record) {
        newCards.push(card);
      } else if (record.status === 'mastered') {
        masteredCards.push(card);
      } else if (record.status === 'reviewing') {
        reviewingCards.push(card);
      }
    });
    
    // 构建今日学习队列：待复习卡片 + 新卡片
    const todayQueue = [...this.getReviewCards(reviewingCards, learningRecords), ...newCards.slice(0, 10)];
    
    this.setData({
      cardQueue: todayQueue,
      currentCard: todayQueue[0] || null,
      nextCard: todayQueue[1] || null,
      totalCount: todayQueue.length,
      isLoading: false,
      stats: {
        mastered: masteredCards.length,
        reviewing: reviewingCards.length,
        remaining: newCards.length
      }
    });
  },

  // 获取需要复习的卡片
  getReviewCards(reviewingCards, learningRecords) {
    const now = Date.now();
    return reviewingCards.filter(card => {
      const record = learningRecords[card.id];
      return record && new Date(record.next_review_time).getTime() <= now;
    });
  },

  // 加载用户进度
  loadUserProgress() {
    const todayKey = new Date().toISOString().split('T')[0];
    const todayProgress = wx.getStorageSync(`progress_${todayKey}`) || { count: 0 };
    
    this.setData({
      todayCount: todayProgress.count,
      progressPercent: Math.round((todayProgress.count / this.data.totalCount) * 100)
    });
  },

  // 检查复习卡片
  checkReviewCards() {
    const learningRecords = wx.getStorageSync('learning_records') || {};
    const now = Date.now();
    let reviewCount = 0;
    
    Object.values(learningRecords).forEach(record => {
      if (record.status === 'reviewing' && new Date(record.next_review_time).getTime() <= now) {
        reviewCount++;
      }
    });
    
    if (reviewCount > 0 && !this.data.currentCard) {
      wx.showToast({
        title: `有${reviewCount}张卡片待复习`,
        icon: 'none'
      });
      this.loadCards();
    }
  },

  // 触摸开始
  onTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.setData({ swiping: true });
  },

  // 触摸移动
  onTouchMove(e) {
    const deltaX = e.touches[0].clientX - this.startX;
    const deltaY = e.touches[0].clientY - this.startY;
    
    // 只响应水平滑动
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const rotate = deltaX / 10;
      let direction = '';
      
      if (deltaX < -50) {
        direction = 'left';
      } else if (deltaX > 50) {
        direction = 'right';
      }
      
      this.setData({
        swipeX: deltaX,
        swipeRotate: rotate,
        swipeDirection: direction
      });
    }
  },

  // 触摸结束
  onTouchEnd(e) {
    const deltaX = e.changedTouches[0].clientX - this.startX;
    const threshold = 100;
    
    if (deltaX < -threshold) {
      // 左滑：待复习
      this.animateCardOut('left', () => {
        this.markAsReview();
      });
    } else if (deltaX > threshold) {
      // 右滑：已掌握
      this.animateCardOut('right', () => {
        this.markAsMastered();
      });
    } else {
      // 回弹
      this.setData({
        swipeX: 0,
        swipeRotate: 0,
        swipeDirection: '',
        swiping: false
      });
    }
  },

  // 卡片点击（翻转）
  onCardTap() {
    if (!this.data.swiping) {
      this.toggleFlip();
    }
  },

  // 翻转卡片
  toggleFlip() {
    this.setData({
      flipped: !this.data.flipped
    });
  },

  // 卡片飞出动画
  animateCardOut(direction, callback) {
    const distance = direction === 'left' ? -500 : 500;
    
    this.setData({
      swipeX: distance,
      swipeRotate: direction === 'left' ? -30 : 30,
      swiping: true
    });
    
    setTimeout(() => {
      callback && callback();
      this.nextCard();
    }, 300);
  },

  // 下一张卡片
  nextCard() {
    const { cardQueue } = this.data;
    const newQueue = cardQueue.slice(1);
    
    this.setData({
      cardQueue: newQueue,
      currentCard: newQueue[0] || null,
      nextCard: newQueue[1] || null,
      flipped: false,
      swipeX: 0,
      swipeRotate: 0,
      swipeDirection: '',
      swiping: false
    });
    
    // 更新今日进度
    this.updateTodayProgress();
  },

  // 标记为待复习
  markAsReview() {
    const { currentCard } = this.data;
    if (!currentCard) return;
    
    const learningRecords = wx.getStorageSync('learning_records') || {};
    const record = learningRecords[currentCard.id] || { review_count: 0 };
    
    // 计算下次复习时间
    const nextReviewTime = this.calculateNextReviewTime(record.review_count);
    
    learningRecords[currentCard.id] = {
      card_id: currentCard.id,
      status: 'reviewing',
      review_count: record.review_count + 1,
      next_review_time: nextReviewTime,
      last_review_time: new Date().toISOString()
    };
    
    wx.setStorageSync('learning_records', learningRecords);
    
    // 显示提示
    const minutes = Math.round(REVIEW_INTERVALS[record.review_count] / 60000);
    wx.showToast({
      title: `${minutes}分钟后复习`,
      icon: 'none',
      duration: 1500
    });
    
    // 更新统计
    this.updateStats();
    
    // 切换到下一张卡片
    this.nextCard();
  },

  // 标记为已掌握
  markAsMastered() {
    const { currentCard } = this.data;
    if (!currentCard) return;
    
    const learningRecords = wx.getStorageSync('learning_records') || {};
    
    learningRecords[currentCard.id] = {
      card_id: currentCard.id,
      status: 'mastered',
      mastered_time: new Date().toISOString()
    };
    
    wx.setStorageSync('learning_records', learningRecords);
    
    // 显示星火动画
    this.showSparkAnimation();
    
    // 更新统计
    this.updateStats();
    
    // 切换到下一张卡片
    this.nextCard();
  },

  // 计算下次复习时间
  calculateNextReviewTime(reviewCount) {
    if (reviewCount >= REVIEW_INTERVALS.length) {
      // 超过3次复习，标记为已掌握
      return null;
    }
    
    const interval = REVIEW_INTERVALS[reviewCount];
    return new Date(Date.now() + interval).toISOString();
  },

  // 显示星火动画
  showSparkAnimation() {
    wx.showToast({
      title: '🔥 已掌握！',
      icon: 'none',
      duration: 1500
    });
  },

  // 更新今日进度
  updateTodayProgress() {
    const todayKey = new Date().toISOString().split('T')[0];
    const todayProgress = wx.getStorageSync(`progress_${todayKey}`) || { count: 0 };
    
    todayProgress.count++;
    wx.setStorageSync(`progress_${todayKey}`, todayProgress);
    
    this.setData({
      todayCount: todayProgress.count,
      progressPercent: Math.round((todayProgress.count / this.data.totalCount) * 100)
    });
  },

  // 更新统计
  updateStats() {
    const learningRecords = wx.getStorageSync('learning_records') || {};
    let mastered = 0;
    let reviewing = 0;
    
    Object.values(learningRecords).forEach(record => {
      if (record.status === 'mastered') {
        mastered++;
      } else if (record.status === 'reviewing') {
        reviewing++;
      }
    });
    
    const remaining = cardsData.length - mastered - reviewing;
    
    this.setData({
      stats: { mastered, reviewing, remaining }
    });
  },

  // 开始复习
  startReview() {
    this.loadCards();
  },

  // AI详解
  askAI(e) {
    const { currentCard } = this.data;
    const question = `请详细介绍${currentCard.front_title}`;
    
    wx.navigateTo({
      url: `/pages/ai-chat/index?question=${encodeURIComponent(question)}`
    });
  },

  // 阻止冒泡
  stopPropagation() {}
});
