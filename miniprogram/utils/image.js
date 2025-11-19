// utils/image.js
// 图片优化工具

/**
 * 获取优化后的图片URL
 * @param {string} url 原始图片URL
 * @param {number} width 目标宽度
 * @param {number} quality 图片质量 (1-100)
 * @returns {string} 优化后的URL
 */
function getOptimizedImageUrl(url, width = 750, quality = 80) {
  if (!url) return '';
  
  // 如果是本地图片，直接返回
  if (url.startsWith('/') || url.startsWith('cloud://')) {
    return url;
  }
  
  // 如果是网络图片，可以添加压缩参数（根据CDN支持情况）
  // 这里是示例，实际需要根据使用的CDN调整
  return url;
}

/**
 * 预加载图片
 * @param {string|string[]} urls 图片URL或URL数组
 * @returns {Promise} 预加载Promise
 */
function preloadImages(urls) {
  const urlArray = Array.isArray(urls) ? urls : [urls];
  
  const promises = urlArray.map(url => {
    return new Promise((resolve) => {
      wx.getImageInfo({
        src: url,
        success: () => resolve(true),
        fail: () => resolve(false)
      });
    });
  });
  
  return Promise.all(promises);
}

/**
 * 压缩图片
 * @param {string} src 图片路径
 * @param {number} quality 压缩质量 (0-100)
 * @returns {Promise<string>} 压缩后的临时路径
 */
function compressImage(src, quality = 80) {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src,
      quality,
      success: (res) => resolve(res.tempFilePath),
      fail: reject
    });
  });
}

/**
 * 获取图片信息
 * @param {string} src 图片路径
 * @returns {Promise<object>} 图片信息
 */
function getImageInfo(src) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src,
      success: resolve,
      fail: reject
    });
  });
}

/**
 * 图片懒加载配置
 */
const LAZY_LOAD_CONFIG = {
  enabled: true,
  threshold: 100, // 提前100px开始加载
  placeholder: '/images/placeholder.png' // 占位图
};

module.exports = {
  getOptimizedImageUrl,
  preloadImages,
  compressImage,
  getImageInfo,
  LAZY_LOAD_CONFIG
};
