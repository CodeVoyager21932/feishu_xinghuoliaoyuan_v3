// pages/pk-battle/pk-battle.js
const app = getApp();
const { getRandomQuestions } = require('../../data/quiz-questions.js');

Page({
  data: {
    mode: 'quiz', // quiz | result
    questions: [],
    currentIndex: 0,
    currentQuestion: {},
    selectedIndex: -1,
    answered: false,
    timeLeft: 60,
    totalTime: 60,
    correctCount: 0,
    myScore: 0,
    opponentScore: 0,
    isWin: false,
    myInfo: {},
    opponentInfo: {},
    challengeId: '',
    answers: []
  },

  timer: null,
  startTime: 0,

  onLoad(options) {
    // 获取挑战ID（如果是应战）
    const challengeId = options.challengeId || '';
    const opponentId = options.opponentId || '';

    this.setData({
      challengeId,
      myInfo: app.globalData.userInfo || {
        nickName: '星火学习者',
        avatarUrl: '/images/default-avatar.png'
      }
    });

    // 如果是应战，加载对手信息
    if (challengeId) {
      this.loadChallengeInfo(challengeId);
    }

    // 初始化题目
    this.initQuestions();
    this.startTimer();
  },

  onUnload() {
    this.stopTimer();
  },

  // 初始化题目
  initQuestions() {
    const questions = getRandomQuestions(5);
    this.setData({
      questions,
      currentQuestion: questions[0]
    });
    this.startTime = Date.now();
  },

  // 加载挑战信息
  loadChallengeInfo(challengeId) {
    // 从云端或缓存加载对手信息和分数
    const challengeData = wx.getStorageSync(`challenge_${challengeId}`) || {};
    
    this.setData({
      opponentInfo: challengeData.challenger || {
        nickName: '对手',
        avatarUrl: '/images/default-avatar.png'
      },
      opponentScore: challengeData.score || 0
    });
  },

  // 开始计时
  startTimer() {
    this.timer = setInterval(() => {
      const timeLeft = this.data.timeLeft - 1;
      
      if (timeLeft <= 0) {
        this.stopTimer();
        this.onTimeUp();
      } else {
        this.setData({ timeLeft });
      }
    }, 1000);
  },

  // 停止计时
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  // 时间到
  onTimeUp() {
    wx.showToast({
      title: '时间到！',
      icon: 'none'
    });
    
    // 自动提交当前答案
    if (!this.data.answered) {
      this.onSelectOption({ currentTarget: { dataset: { index: -1 } } });
    }
  },

  // 选择选项
  onSelectOption(e) {
    if (this.data.answered) return;

    const index = e.currentTarget.dataset.index;
    const isCorrect = index === this.data.currentQuestion.correctIndex;

    this.setData({
      selectedIndex: index,
      answered: true,
      correctCount: this.data.correctCount + (isCorrect ? 1 : 0)
    });

    // 记录答案
    this.data.answers.push({
      questionId: this.data.currentQuestion.id,
      selectedIndex: index,
      isCorrect,
      timeSpent: this.data.totalTime - this.data.timeLeft
    });

    // 震动反馈
    wx.vibrateShort();
  },

  // 下一题
  onNextQuestion() {
    const nextIndex = this.data.currentIndex + 1;

    if (nextIndex < this.data.questions.length) {
      // 还有题目
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: this.data.questions[nextIndex],
        selectedIndex: -1,
        answered: false
      });
    } else {
      // 答题结束
      this.stopTimer();
      this.showResult();
    }
  },

  // 显示结果
  showResult() {
    const usedTime = Math.floor((Date.now() - this.startTime) / 1000);
    const correctRate = Math.floor((this.data.correctCount / this.data.questions.length) * 100);
    
    // 计算分数（正确率 * 70 + 速度分 * 30）
    const accuracyScore = correctRate * 0.7;
    const speedScore = Math.max(0, (this.data.totalTime - usedTime) / this.data.totalTime * 30);
    const myScore = Math.floor(accuracyScore + speedScore);

    // 判断胜负
    const isWin = myScore > this.data.opponentScore;

    this.setData({
      mode: 'result',
      myScore,
      correctRate,
      usedTime,
      isWin
    });

    // 保存挑战记录
    this.saveChallengeResult(myScore);
  },

  // 保存挑战结果
  saveChallengeResult(score) {
    const challengeId = `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const challengeData = {
      challengeId,
      challenger: this.data.myInfo,
      score,
      questions: this.data.questions,
      answers: this.data.answers,
      createdAt: Date.now()
    };

    wx.setStorageSync(`challenge_${challengeId}`, challengeData);
    
    this.setData({ challengeId });
  },

  // 发起反击
  onChallenge() {
    // 生成分享参数
    const shareParams = {
      challengeId: this.data.challengeId,
      opponentId: this.data.opponentInfo.openid || 'opponent'
    };

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    wx.showToast({
      title: '点击右上角分享给好友',
      icon: 'none',
      duration: 2000
    });
  },

  // 返回首页
  onBackHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 分享配置
  onShareAppMessage() {
    return {
      title: `我在党史PK中得了${this.data.myScore}分，来挑战我吧！`,
      path: `/pages/pk-battle/pk-battle?challengeId=${this.data.challengeId}`,
      imageUrl: '/images/share-pk.png'
    };
  }
});
