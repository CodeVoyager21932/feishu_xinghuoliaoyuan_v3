// utils/cache.js
// 数据缓存工具

const CACHE_KEYS = {
  HEROES: 'heroes_data',
  GRAPH: 'graph_data',
  CARDS: 'cards_data',
  USER_INFO: 'userInfo',
  LAST_CHECK_IN: 'lastCheckIn'
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时

/**
 * 设置缓存
 * @param {string} key 缓存键
 * @param {any} data 缓存数据
 */
function setCache(key, data) {
  try {
    wx.setStorageSync(key, {
      data,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('设置缓存失败', error);
  }
}

/**
 * 获取缓存
 * @param {string} key 缓存键
 * @returns {any|null} 缓存数据或null
 */
function getCache(key) {
  try {
    const cache = wx.getStorageSync(key);
    if (!cache) return null;
    
    const isExpired = Date.now() - cache.timestamp > CACHE_DURATION;
    if (isExpired) {
      wx.removeStorageSync(key);
      return null;
    }
    
    return cache.data;
  } catch (error) {
    console.error('获取缓存失败', error);
    return null;
  }
}

/**
 * 清除缓存
 * @param {string} key 缓存键
 */
function clearCache(key) {
  try {
    wx.removeStorageSync(key);
  } catch (error) {
    console.error('清除缓存失败', error);
  }
}

/**
 * 清除所有缓存
 */
function clearAllCache() {
  try {
    wx.clearStorageSync();
  } catch (error) {
    console.error('清除所有缓存失败', error);
  }
}

/**
 * 获取缓存大小
 * @returns {Promise<number>} 缓存大小（KB）
 */
function getCacheSize() {
  return new Promise((resolve) => {
    wx.getStorageInfo({
      success: (res) => {
        resolve(res.currentSize);
      },
      fail: () => {
        resolve(0);
      }
    });
  });
}

/**
 * 检查缓存是否过期
 * @param {string} key 缓存键
 * @returns {boolean} 是否过期
 */
function isCacheExpired(key) {
  try {
    const cache = wx.getStorageSync(key);
    if (!cache) return true;
    return Date.now() - cache.timestamp > CACHE_DURATION;
  } catch (error) {
    return true;
  }
}

module.exports = {
  CACHE_KEYS,
  CACHE_DURATION,
  setCache,
  getCache,
  clearCache,
  clearAllCache,
  getCacheSize,
  isCacheExpired
};
