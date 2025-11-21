// pages/ai-chat/index.js
const { handleError } = require('../../utils/error-handler');

Page({
  data: {
    // 用户信息
    userAvatar: '',
    
    // AI信息
    aiAvatar: '/images/xinghuo-avatar.png',
    aiName: '星火同志',
    aiDesc: '党史专家 · 金牌导游',
    
    // 对话模式
    mode: 'default',
    
    // 消息列表
    messages: [],
    
    // 输入
    inputText: '',
    isLoading: false,
    scrollToId: '',
    
    // 加载提示
    loadingTips: [
      '🔥 星火正在燎原...',
      '📚 正在查阅延安时期的档案...',
      '🎖️ 翻阅革命先烈的英雄事迹...',
      '🚩 追溯红军长征的足迹...',
      '⭐ 回顾井冈山的星星之火...',
      '📖 研读遵义会议的历史文献...',
      '🏛️ 探寻西柏坡的红色记忆...',
      '🎯 分析三大战役的战略部署...',
      '💡 思考"为人民服务"的深刻内涵...',
      '🌟 学习"两弹一星"精神...',
      '🔍 考证党史中的重要细节...',
      '📜 整理建党百年的光辉历程...',
      '🎓 温习毛泽东思想的精髓...',
      '🏅 缅怀革命先烈的丰功伟绩...',
      '🌾 回忆土地革命的峥嵘岁月...'
    ],
    currentTip: '',
    currentTipIndex: 0,

  },

  // 定时器
  tipTimer: null,

  onLoad(options) {
    // 获取用户信息
    const app = getApp();
    this.setData({
      userAvatar: app.globalData.userInfo?.avatarUrl || '/images/default-avatar.png'
    });
    
    // 如果有预设问题，自动发送
    if (options.question) {
      this.setData({
        inputText: decodeURIComponent(options.question)
      });
      // 延迟发送，等待页面渲染完成
      setTimeout(() => {
        this.onSend();
      }, 500);
    }
    
    // 加载历史对话
    this.loadChatHistory();
  },

  onUnload() {
    // 清理定时器
    this.stopLoadingTips();
  },

  // 加载对话历史
  loadChatHistory() {
    // TODO: 从云数据库加载历史对话
    // 暂时使用本地存储
    const history = wx.getStorageSync('chat_history') || [];
    this.setData({
      messages: history.slice(-20) // 只显示最近20条
    });
    this.scrollToBottom();
  },

  // 输入框变化
  onInput(e) {
    this.setData({
      inputText: e.detail.value
    });
  },

  // 发送消息
  async onSend() {
    const { inputText, isLoading } = this.data;
    
    if (!inputText.trim() || isLoading) {
      return;
    }
    
    // 添加用户消息
    const userMessage = {
      role: 'user',
      content: inputText.trim(),
      time: this.formatTime(new Date())
    };
    
    this.setData({
      messages: [...this.data.messages, userMessage],
      inputText: '',
      isLoading: true
    });
    
    this.scrollToBottom();
    
    // 开始加载提示轮播
    this.startLoadingTips();
    
    try {
      // 调用云函数
      const res = await wx.cloud.callFunction({
        name: 'ai-chat',
        data: {
          question: userMessage.content,
          history: this.data.messages.slice(-10), // 只发送最近10轮
          mode: this.data.mode
        }
      });
      
      // 停止加载提示
      this.stopLoadingTips();
      
      // 添加AI回复
      const aiMessage = {
        role: 'assistant',
        content: res.result.answer,
        time: this.formatTime(new Date())
      };
      
      this.setData({
        messages: [...this.data.messages, aiMessage],
        isLoading: false
      });
      
      this.scrollToBottom();
      
      // 保存到本地存储
      this.saveChatHistory();
      
      // 更新用户统计
      this.updateUserStats();
      
    } catch (error) {
      console.error('AI对话失败', error);
      
      // 停止加载提示
      this.stopLoadingTips();
      
      // 如果云函数调用失败，使用模拟回复（用于测试）
      const mockReply = this.getMockReply(userMessage.content);
      const aiMessage = {
        role: 'assistant',
        content: mockReply,
        time: this.formatTime(new Date())
      };
      
      this.setData({
        messages: [...this.data.messages, aiMessage],
        isLoading: false
      });
      
      this.scrollToBottom();
      this.saveChatHistory();
      
      // 显示提示
      wx.showToast({
        title: '使用模拟回复（API未配置）',
        icon: 'none',
        duration: 2000
      });
    }
  },

  // 开始加载提示轮播
  startLoadingTips() {
    const { loadingTips } = this.data;
    
    // 随机选择一个起始提示
    const randomIndex = Math.floor(Math.random() * loadingTips.length);
    
    this.setData({
      currentTip: loadingTips[randomIndex],
      currentTipIndex: randomIndex
    });
    
    // 每2秒切换一次提示
    this.tipTimer = setInterval(() => {
      const nextIndex = (this.data.currentTipIndex + 1) % loadingTips.length;
      this.setData({
        currentTip: loadingTips[nextIndex],
        currentTipIndex: nextIndex
      });
    }, 2000);
  },

  // 停止加载提示轮播
  stopLoadingTips() {
    if (this.tipTimer) {
      clearInterval(this.tipTimer);
      this.tipTimer = null;
    }
  },

  // 获取模拟回复（用于测试）
  getMockReply(question) {
    const replies = {
      '你好': '你好！我是星火同志，一位深耕中共党史五十年的资深研究员。有什么关于红色历史的问题，尽管问我吧！',
      '南昌起义': '南昌起义发生在1927年8月1日，由周恩来、贺龙、叶挺、朱德、刘伯承等领导。这次起义打响了武装反抗国民党反动派的第一枪，标志着中国共产党独立领导武装斗争的开始，是创建人民军队的开端。',
      '长征': '长征是1934年10月至1936年10月间，中国工农红军主力从长江南北各苏区向陕甘革命根据地的战略转移。红军长征历时两年，行程二万五千里，跨越11个省，翻越18座大山，渡过24条大河，经历了无数艰难险阻，最终胜利会师陕北。',
      '遵义会议': '遵义会议是1935年1月15日至17日在贵州遵义召开的中共中央政治局扩大会议。这次会议确立了毛泽东同志在党中央和红军的领导地位，在极其危急的历史关头挽救了党、挽救了红军、挽救了中国革命。'
    };
    
    // 查找匹配的回复
    for (const key in replies) {
      if (question && String(question).includes(key)) {
        return replies[key];
      }
    }
    
    // 默认回复
    return `感谢你的提问："${question}"。\n\n这是一个很好的问题！由于当前AI服务未配置，我暂时无法给出详细回答。\n\n你可以尝试问我：\n• 南昌起义\n• 长征\n• 遵义会议\n\n或者配置讯飞星火API后，我就能回答更多问题了！`;
  },



  // 保存对话历史
  saveChatHistory() {
    wx.setStorageSync('chat_history', this.data.messages);
  },

  // 更新用户统计
  updateUserStats() {
    const app = getApp();
    if (app.globalData.userStats) {
      app.globalData.userStats.ai_chat_count++;
      // TODO: 同步到云数据库
    }
  },

  // 滚动到底部
  scrollToBottom() {
    setTimeout(() => {
      const lastIndex = this.data.messages.length - 1;
      this.setData({
        scrollToId: `msg-${lastIndex}`
      });
    }, 100);
  },

  // 格式化时间
  formatTime(date) {
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
});
