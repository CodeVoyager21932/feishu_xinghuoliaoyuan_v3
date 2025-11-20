// components/audio-player/audio-player.js
const audioManager = require('../../utils/audio-manager.js');

Component({
  data: {
    currentAudio: null,
    isPlaying: false,
    showPanel: false
  },

  lifetimes: {
    attached() {
      // 添加音频状态监听
      this.audioListener = (event, data) => {
        switch (event) {
          case 'play':
            this.setData({ isPlaying: true });
            break;
          case 'pause':
          case 'stop':
            this.setData({ isPlaying: false });
            break;
          case 'change':
            this.setData({ currentAudio: data });
            break;
        }
      };

      audioManager.addListener(this.audioListener);

      // 获取当前播放信息
      const currentAudio = audioManager.getCurrentAudio();
      const isPlaying = audioManager.getPlayingState();
      
      if (currentAudio) {
        this.setData({
          currentAudio,
          isPlaying
        });
      }
    },

    detached() {
      // 移除监听器
      if (this.audioListener) {
        audioManager.removeListener(this.audioListener);
      }
    }
  },

  methods: {
    // 切换面板显示
    onTogglePanel() {
      this.setData({
        showPanel: !this.data.showPanel
      });
    },

    // 面板点击（阻止冒泡）
    onPanelTap(e) {
      e.stopPropagation();
    },

    // 播放/暂停
    onTogglePlay() {
      if (this.data.isPlaying) {
        audioManager.pause();
      } else {
        audioManager.resume();
      }
    },

    // 上一首
    onPrev() {
      audioManager.prev();
    },

    // 下一首
    onNext() {
      audioManager.next();
    },

    // 打开电台页面
    onOpenRadio() {
      wx.navigateTo({
        url: '/pages/radio/radio'
      });
      this.setData({ showPanel: false });
    }
  }
});
