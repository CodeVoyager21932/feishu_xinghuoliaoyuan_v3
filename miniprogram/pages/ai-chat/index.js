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
    mode: 'default', // default | hero
    currentHero: null,
    
    // 消息列表
    messages: [],
    
    // 输入
    inputText: '',
    isLoading: false,
    scrollToId: '',
    
    // 英雄选择
    showHeroModal: false,
    heroList: [
      { id: 'leifeng', name: '雷锋', avatar: '/images/heroes/leifeng.png' },
      { id: 'jiaoyulu', name: '焦裕禄', avatar: '/images/heroes/jiaoyulu.png' },
      { id: 'lengyun', name: '冷云', avatar: '/images/heroes/lengyun.png' },
      { id: 'zhaoyiman', name: '赵一曼', avatar: '/images/heroes/zhaoyiman.png' },
      { id: 'huangjigu', name: '黄继光', avatar: '/images/heroes/huangjigu.png' },
      { id: 'qiujiahe', name: '邱少云', avatar: '/images/heroes/qiujiahe.png' }
    ]
  },

  onLoad(options) {
    // 获取用户信息
    const app = getApp();
    this.setData({
      userAvatar: app.globalData.userInfo?.avatarUrl || '/images/default-avatar.png'
    });
    
    // 如果从英雄详情页跳转，直接切换到英雄模式
    if (options.heroId) {
      const hero = this.data.heroList.find(h => h.id === options.heroId);
      if (hero) {
        this.switchToHeroMode(hero);
      }
    }
    
    // 加载历史对话
    this.loadChatHistory();
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
    
    try {
      // 调用云函数
      const res = await wx.cloud.callFunction({
        name: 'ai-chat',
        data: {
          question: userMessage.content,
          history: this.data.messages.slice(-10), // 只发送最近10轮
          mode: this.data.mode,
          heroId: this.data.currentHero?.id
        }
      });
      
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
      if (question.includes(key)) {
        return replies[key];
      }
    }
    
    // 默认回复
    return `感谢你的提问："${question}"。\n\n这是一个很好的问题！由于当前AI服务未配置，我暂时无法给出详细回答。\n\n你可以尝试问我：\n• 南昌起义\n• 长征\n• 遵义会议\n\n或者配置讯飞星火API后，我就能回答更多问题了！`;
  },

  // 显示英雄选择弹窗
  showHeroSelect() {
    if (this.data.mode === 'hero') {
      // 切换回普通模式
      this.switchToDefaultMode();
    } else {
      // 显示英雄选择
      this.setData({
        showHeroModal: true
      });
    }
  },

  // 隐藏英雄选择弹窗
  hideHeroModal() {
    this.setData({
      showHeroModal: false
    });
  },

  // 阻止冒泡
  stopPropagation() {},

  // 选择英雄
  selectHero(e) {
    const hero = e.currentTarget.dataset.hero;
    this.switchToHeroMode(hero);
    this.hideHeroModal();
  },

  // 切换到英雄模式
  switchToHeroMode(hero) {
    this.setData({
      mode: 'hero',
      currentHero: hero,
      aiName: hero.name,
      aiDesc: '革命英雄 · 时代楷模',
      aiAvatar: hero.avatar,
      messages: [] // 清空对话历史
    });
    
    // 添加欢迎消息
    const welcomeMessage = {
      role: 'assistant',
      content: this.getHeroWelcome(hero.id),
      time: this.formatTime(new Date())
    };
    
    this.setData({
      messages: [welcomeMessage]
    });
  },

  // 切换到普通模式
  switchToDefaultMode() {
    this.setData({
      mode: 'default',
      currentHero: null,
      aiName: '星火同志',
      aiDesc: '党史专家 · 金牌导游',
      aiAvatar: '/images/xinghuo-avatar.png',
      messages: [] // 清空对话历史
    });
    
    this.loadChatHistory();
  },

  // 获取英雄欢迎语
  getHeroWelcome(heroId) {
    const welcomes = {
      leifeng: '同志你好！我是雷锋。毛主席教导我们要全心全意为人民服务，我愿意做一颗永不生锈的螺丝钉。有什么想了解的，尽管问我！',
      jiaoyulu: '你好！我是焦裕禄。我在兰考工作期间，始终把群众的冷暖放在心上。今天很高兴能和你交流。',
      lengyun: '你好，我是冷云。作为东北抗联第五军妇女团指导员，我和战友们为了民族解放事业，献出了宝贵的生命。',
      zhaoyiman: '同志好！我是赵一曼。在抗日战争中，我们女战士同样不怕牺牲，誓死保卫祖国。',
      huangjigu: '同志你好！我是黄继光。在上甘岭战役中，为了战斗的胜利，我用身体堵住了敌人的枪眼。',
      qiujiahe: '你好！我是邱少云。为了保证潜伏任务的成功，我在烈火中纹丝不动，直到牺牲。'
    };
    
    return welcomes[heroId] || '你好！很高兴与你交流。';
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
