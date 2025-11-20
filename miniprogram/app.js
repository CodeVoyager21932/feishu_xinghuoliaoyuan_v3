// app.js
App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-0g84030j58680666', // 替换为你的云开发环境ID
        traceUser: true,
      });
    }

    // 初始化全局数据
    this.globalData = {
      userInfo: null,
      hasCheckedIn: false,
      userLevel: 1,
      stats: {
        continuous_days: 7,
        mastered_cards: 25,
        ai_chat_count: 50
      },
      // 导航栏信息
      statusBarHeight: 0,
      navBarHeight: 0,
      menuBottom: 0,
      menuRight: 0,
      menuHeight: 0,
      openid: null
    };

    // 获取用户信息
    this.getUserInfo();
    // 初始化系统信息
    this.initSystemInfo();
  },

  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  initSystemInfo() {
    const systemInfo = wx.getSystemInfoSync();
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();

    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    this.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    this.globalData.menuBottom = menuButtonInfo.top - systemInfo.statusBarHeight;
    this.globalData.menuHeight = menuButtonInfo.height;
    // 导航栏高度 = 状态栏高度 + (胶囊顶部 - 状态栏高度) * 2 + 胶囊高度
    this.globalData.navBarHeight = (menuButtonInfo.top - systemInfo.statusBarHeight) * 2 + menuButtonInfo.height + systemInfo.statusBarHeight;
  }
});
