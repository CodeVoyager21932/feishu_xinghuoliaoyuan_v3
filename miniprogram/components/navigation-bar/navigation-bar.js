const app = getApp();

Component({
  properties: {
    title: {
      type: String,
      value: '星火'
    },
    showBack: {
      type: Boolean,
      value: false
    },
    showHome: {
      type: Boolean,
      value: false
    },
    color: {
      type: String,
      value: '#000000'
    },
    backgroundColor: {
      type: String,
      value: 'transparent'
    },
    backgroundClass: {
      type: String,
      value: ''
    },
    fixed: {
      type: Boolean,
      value: true
    }
  },

  data: {
    statusBarHeight: 0,
    navBarHeight: 0,
    capsuleHeight: 0,
    capsuleTop: 0,
    capsuleLeft: 0,
    capsuleMaxWidth: 0
  },

  lifetimes: {
    attached() {
      this.initNavBarData();
    }
  },

  methods: {
    initNavBarData() {
      const globalData = app.globalData;
      
      // 获取精确的导航栏数据
      const statusBarHeight = globalData.statusBarHeight || 0;
      const navBarHeight = globalData.navBarHeight || 0;
      const customCapsule = globalData.customCapsule || {};
      const screenWidth = globalData.screenWidth || 375;

      // 自定义胶囊的样式数据
      const capsuleHeight = customCapsule.height || 32;
      const capsuleTop = customCapsule.top || 0;
      const capsuleLeft = customCapsule.left || 12;
      
      // 计算自定义胶囊的最大宽度（不能超过原生胶囊的左边界）
      const capsuleMaxWidth = customCapsule.right ? (customCapsule.right - capsuleLeft - 24) : (screenWidth * 0.4);

      this.setData({
        statusBarHeight,
        navBarHeight,
        capsuleHeight,
        capsuleTop,
        capsuleLeft,
        capsuleMaxWidth
      });
    },

    onBack() {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          // 如果返回失败，跳转到首页
          this.onHome();
        }
      });
    },

    onHome() {
      wx.reLaunch({
        url: '/pages/index/index'
      });
    }
  }
});
