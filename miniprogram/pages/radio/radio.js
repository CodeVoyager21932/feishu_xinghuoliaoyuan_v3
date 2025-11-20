// pages/radio/radio.js
const audioManager = require('../../utils/audio-manager.js');
const { getPlaylist } = require('../../data/radio-playlist.js');

Page({
  data: {
    playlist: [],
    currentAudio: null,
    isPlaying: false
  },

  onLoad() {
    // 加载播放列表
    const playlist = getPlaylist();
    audioManager.setPlaylist(playlist);

    this.setData({ playlist });

    // 获取当前播放状态
    const currentAudio = audioManager.getCurrentAudio();
    const isPlaying = audioManager.getPlayingState();

    if (currentAudio) {
      this.setData({
        currentAudio,
        isPlaying
      });
    }

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
  },

  onUnload() {
    // 移除监听器
    if (this.audioListener) {
      audioManager.removeListener(this.audioListener);
    }
  },

  // 播放指定音频
  onPlayAudio(e) {
    const index = e.currentTarget.dataset.index;
    const audio = this.data.playlist[index];
    
    audioManager.play(audio, index);
  },

  // 播放/暂停
  onTogglePlay() {
    if (this.data.isPlaying) {
      audioManager.pause();
    } else {
      if (this.data.currentAudio) {
        audioManager.resume();
      } else {
        // 如果没有当前音频，播放第一首
        audioManager.play(this.data.playlist[0], 0);
      }
    }
  },

  // 上一首
  onPrev() {
    audioManager.prev();
  },

  // 下一首
  onNext() {
    audioManager.next();
  }
});
