// utils/performance.js
// 性能监控工具

/**
 * 页面性能监控
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {};
  }

  /**
   * 开始计时
   * @param {string} name 计时名称
   */
  start(name) {
    this.metrics[name] = {
      startTime: Date.now(),
      endTime: null,
      duration: null
    };
  }

  /**
   * 结束计时
   * @param {string} name 计时名称
   * @returns {number} 持续时间（毫秒）
   */
  end(name) {
    if (!this.metrics[name]) {
      console.warn(`计时器 ${name} 不存在`);
      return 0;
    }

    this.metrics[name].endTime = Date.now();
    this.metrics[name].duration = this.metrics[name].endTime - this.metrics[name].startTime;

    return this.metrics[name].duration;
  }

  /**
   * 获取计时结果
   * @param {string} name 计时名称
   * @returns {number} 持续时间（毫秒）
   */
  getDuration(name) {
    return this.metrics[name]?.duration || 0;
  }

  /**
   * 获取所有计时结果
   * @returns {object} 所有计时结果
   */
  getAllMetrics() {
    return this.metrics;
  }

  /**
   * 清除计时器
   * @param {string} name 计时名称
   */
  clear(name) {
    if (name) {
      delete this.metrics[name];
    } else {
      this.metrics = {};
    }
  }

  /**
   * 记录性能日志
   * @param {string} name 日志名称
   * @param {number} duration 持续时间
   */
  log(name, duration) {
    console.log(`[性能] ${name}: ${duration}ms`);
    
    // 如果超过阈值，记录警告
    if (duration > 3000) {
      console.warn(`[性能警告] ${name} 耗时过长: ${duration}ms`);
    }
  }
}

// 创建全局实例
const monitor = new PerformanceMonitor();

/**
 * 监控页面加载性能
 * @param {string} pageName 页面名称
 */
function monitorPageLoad(pageName) {
  const startTime = Date.now();
  
  return {
    end: () => {
      const duration = Date.now() - startTime;
      monitor.log(`${pageName} 页面加载`, duration);
      
      // 记录到本地
      recordPerformance('pageLoad', pageName, duration);
    }
  };
}

/**
 * 监控API调用性能
 * @param {string} apiName API名称
 */
function monitorAPICall(apiName) {
  const startTime = Date.now();
  
  return {
    end: () => {
      const duration = Date.now() - startTime;
      monitor.log(`${apiName} API调用`, duration);
      
      // 记录到本地
      recordPerformance('apiCall', apiName, duration);
    }
  };
}

/**
 * 记录性能数据
 * @param {string} type 类型
 * @param {string} name 名称
 * @param {number} duration 持续时间
 */
function recordPerformance(type, name, duration) {
  try {
    const performanceData = wx.getStorageSync('performanceData') || [];
    performanceData.push({
      type,
      name,
      duration,
      timestamp: new Date().toISOString()
    });
    
    // 只保留最近100条记录
    if (performanceData.length > 100) {
      performanceData.shift();
    }
    
    wx.setStorageSync('performanceData', performanceData);
  } catch (error) {
    console.error('记录性能数据失败', error);
  }
}

/**
 * 获取性能统计
 * @returns {object} 性能统计数据
 */
function getPerformanceStats() {
  try {
    const performanceData = wx.getStorageSync('performanceData') || [];
    
    const stats = {
      pageLoad: {},
      apiCall: {},
      total: performanceData.length
    };
    
    performanceData.forEach(item => {
      if (!stats[item.type][item.name]) {
        stats[item.type][item.name] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          maxDuration: 0,
          minDuration: Infinity
        };
      }
      
      const stat = stats[item.type][item.name];
      stat.count++;
      stat.totalDuration += item.duration;
      stat.maxDuration = Math.max(stat.maxDuration, item.duration);
      stat.minDuration = Math.min(stat.minDuration, item.duration);
      stat.avgDuration = stat.totalDuration / stat.count;
    });
    
    return stats;
  } catch (error) {
    console.error('获取性能统计失败', error);
    return {};
  }
}

/**
 * 清除性能数据
 */
function clearPerformanceData() {
  try {
    wx.removeStorageSync('performanceData');
  } catch (error) {
    console.error('清除性能数据失败', error);
  }
}

/**
 * 节流函数
 * @param {Function} fn 要节流的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

/**
 * 防抖函数
 * @param {Function} fn 要防抖的函数
 * @param {number} delay 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

module.exports = {
  monitor,
  monitorPageLoad,
  monitorAPICall,
  getPerformanceStats,
  clearPerformanceData,
  throttle,
  debounce
};
