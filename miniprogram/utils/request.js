// utils/request.js
// 统一请求工具

const { handleNetworkError, handleCloudError } = require('./error-handler');
const { monitorAPICall } = require('./performance');

/**
 * 云函数调用封装
 * @param {string} name 云函数名称
 * @param {object} data 请求数据
 * @param {object} options 配置选项
 * @returns {Promise} 请求Promise
 */
function callCloudFunction(name, data = {}, options = {}) {
  const {
    showLoading = false,
    loadingText = '加载中...',
    showError = true
  } = options;

  // 显示加载提示
  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    });
  }

  // 开始性能监控
  const perfMonitor = monitorAPICall(`云函数-${name}`);

  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data,
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }
        perfMonitor.end();
        resolve(res.result);
      },
      fail: (error) => {
        if (showLoading) {
          wx.hideLoading();
        }
        perfMonitor.end();
        
        if (showError) {
          handleCloudError(error, name);
        }
        reject(error);
      }
    });
  });
}

/**
 * HTTP请求封装
 * @param {object} config 请求配置
 * @returns {Promise} 请求Promise
 */
function request(config) {
  const {
    url,
    method = 'GET',
    data = {},
    header = {},
    showLoading = false,
    loadingText = '加载中...',
    showError = true
  } = config;

  // 显示加载提示
  if (showLoading) {
    wx.showLoading({
      title: loadingText,
      mask: true
    });
  }

  // 开始性能监控
  const perfMonitor = monitorAPICall(`HTTP-${method}-${url}`);

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method,
      data,
      header: {
        'content-type': 'application/json',
        ...header
      },
      success: (res) => {
        if (showLoading) {
          wx.hideLoading();
        }
        perfMonitor.end();

        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          const error = {
            statusCode: res.statusCode,
            message: res.data.message || '请求失败'
          };
          
          if (showError) {
            const errorMsg = handleNetworkError(error);
            wx.showToast({
              title: errorMsg,
              icon: 'none'
            });
          }
          reject(error);
        }
      },
      fail: (error) => {
        if (showLoading) {
          wx.hideLoading();
        }
        perfMonitor.end();
        
        if (showError) {
          const errorMsg = handleNetworkError(error);
          wx.showToast({
            title: errorMsg,
            icon: 'none'
          });
        }
        reject(error);
      }
    });
  });
}

/**
 * GET请求
 * @param {string} url 请求URL
 * @param {object} data 请求参数
 * @param {object} options 配置选项
 * @returns {Promise} 请求Promise
 */
function get(url, data = {}, options = {}) {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
}

/**
 * POST请求
 * @param {string} url 请求URL
 * @param {object} data 请求数据
 * @param {object} options 配置选项
 * @returns {Promise} 请求Promise
 */
function post(url, data = {}, options = {}) {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
}

module.exports = {
  callCloudFunction,
  request,
  get,
  post
};
