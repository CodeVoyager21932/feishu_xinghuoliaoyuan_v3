// 临时占位页面 - 待删除
Page({
  data: {},
  onLoad() {
    wx.showToast({
      title: '此页面已废弃',
      icon: 'none'
    });
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
});
