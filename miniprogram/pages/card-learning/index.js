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
    // loadUserProgress 必须在 loadCards 之后，因为需要正确的 totalCount
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
        // 没有学习记录，是新卡片
        newCards.push(card);
      } else if (record.status === 'mastered') {
        // 已掌握
        masteredCards.push(card);
      } else if (record.status === 'reviewing') {
        // 待复习
        reviewingCards.push(card);
      }
    });
    
    // 构建今日学习队列：需要复习的卡片 + 新卡片（最多10张）
    const needReviewCards = this.getReviewCards(reviewingCards, learningRecords);
    const todayQueue = [...needReviewCards, ...newCards.slice(0, Math.max(0, 10 - needReviewCards.length))];
    
    // 获取今日学习记录
    const todayKey = new Date().toISOString().split('T')[0];
    const todayRecords = wx.getStorageSync(`today_records_${todayKey}`) || {
      mastered: [],
      reviewing: []
    };
    
    // 计算今日统计：只统计今天学习的卡片
    const todayMastered = todayRecords.mastered.length;
    const todayReviewing = todayRecords.reviewing.length;
    const todayRemaining = Math.max(0, todayQueue.length - todayMastered - todayReviewing);
    
    this.setData({
      cardQueue: todayQueue,
      currentCard: todayQueue[0] || null,
      nextCard: todayQueue[1] || null,
      totalCount: todayQueue.length > 0 ? todayQueue.length : 10,
      isLoading: false,
      stats: {
        mastered: todayMastered,
        reviewing: todayReviewing,
        remaining: todayRemaining
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
    
    // 确保 totalCount 不为0，避免除以0
    const totalCount = this.data.totalCount || 10;
    const todayCount = todayProgress.count;
    
    // 如果今日已完成的数量超过队列长度，说明已经完成了
    const actualCount = Math.min(todayCount, totalCount);
    const percent = totalCount > 0 ? Math.round((actualCount / totalCount) * 100) : 0;
    
    this.setData({
      todayCount: actualCount,
      progressPercent: percent
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
        this.saveReviewRecord(this.data.currentCard);
      });
    } else if (deltaX > threshold) {
      // 右滑：已掌握
      this.animateCardOut('right', () => {
        this.saveMasteredRecord(this.data.currentCard);
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
      swiping: false,
      totalCount: newQueue.length || this.data.totalCount
    });
    
    // 更新今日进度
    this.updateTodayProgress();
  },

  // 标记为待复习（按钮点击）
  markAsReview() {
    const { currentCard } = this.data;
    if (!currentCard) return;
    
    // 先执行动画
    this.animateCardOut('left', () => {
      this.saveReviewRecord(currentCard);
    });
  },

  // 保存待复习记录
  saveReviewRecord(card) {
    const learningRecords = wx.getStorageSync('learning_records') || {};
    const record = learningRecords[card.id] || { review_count: 0 };
    
    // 计算下次复习时间
    const nextReviewTime = this.calculateNextReviewTime(record.review_count);
    
    learningRecords[card.id] = {
      card_id: card.id,
      status: 'reviewing',
      review_count: record.review_count + 1,
      next_review_time: nextReviewTime,
      last_review_time: new Date().toISOString()
    };
    
    wx.setStorageSync('learning_records', learningRecords);
    
    // 记录到今日统计
    const todayKey = new Date().toISOString().split('T')[0];
    const todayRecords = wx.getStorageSync(`today_records_${todayKey}`) || {
      mastered: [],
      reviewing: []
    };
    
    if (!todayRecords.reviewing.includes(card.id)) {
      todayRecords.reviewing.push(card.id);
      wx.setStorageSync(`today_records_${todayKey}`, todayRecords);
    }
    
    // 显示提示
    const minutes = Math.round(REVIEW_INTERVALS[record.review_count] / 60000);
    wx.showToast({
      title: `${minutes}分钟后复习`,
      icon: 'none',
      duration: 1500
    });
    
    // 更新统计
    this.updateStats();
  },

  // 标记为已掌握（按钮点击）
  markAsMastered() {
    const { currentCard } = this.data;
    if (!currentCard) return;
    
    // 先执行动画
    this.animateCardOut('right', () => {
      this.saveMasteredRecord(currentCard);
    });
  },

  // 保存已掌握记录
  saveMasteredRecord(card) {
    const learningRecords = wx.getStorageSync('learning_records') || {};
    
    learningRecords[card.id] = {
      card_id: card.id,
      status: 'mastered',
      mastered_time: new Date().toISOString()
    };
    
    wx.setStorageSync('learning_records', learningRecords);
    
    // 记录到今日统计
    const todayKey = new Date().toISOString().split('T')[0];
    const todayRecords = wx.getStorageSync(`today_records_${todayKey}`) || {
      mastered: [],
      reviewing: []
    };
    
    if (!todayRecords.mastered.includes(card.id)) {
      todayRecords.mastered.push(card.id);
      wx.setStorageSync(`today_records_${todayKey}`, todayRecords);
    }
    
    // 显示星火动画
    this.showSparkAnimation();
    
    // 更新统计
    this.updateStats();
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
    
    // 计算进度百分比，确保不超过100%
    const totalCount = this.data.totalCount || 10;
    const currentCount = Math.min(todayProgress.count, totalCount);
    const percent = Math.min(100, Math.round((currentCount / totalCount) * 100));
    
    this.setData({
      todayCount: currentCount,
      progressPercent: percent
    });
  },

  // 更新统计
  updateStats() {
    // 获取今日学习记录
    const todayKey = new Date().toISOString().split('T')[0];
    const todayRecords = wx.getStorageSync(`today_records_${todayKey}`) || {
      mastered: [],
      reviewing: []
    };
    
    // 计算今日统计
    const todayMastered = todayRecords.mastered.length;
    const todayReviewing = todayRecords.reviewing.length;
    const todayRemaining = Math.max(0, this.data.totalCount - todayMastered - todayReviewing);
    
    this.setData({
      stats: {
        mastered: todayMastered,
        reviewing: todayReviewing,
        remaining: todayRemaining
      }
    });
  },

  // 开始复习
  startReview() {
    // 重新加载卡片
    this.loadCards();
    // 重新加载进度
    this.loadUserProgress();
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
