// utils/error-handler.js
// 错误处理工具

/**
 * 处理错误
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 */
function handleError(error, context = '') {
  console.error(`[${context}] Error:`, error);
  
  // 用户友好的错误提示
  const userMessage = getUserFriendlyMessage(error);
  wx.showToast({
    title: userMessage,
    icon: 'none',
    duration: 2000
  });
  
  // 上报错误日志（可选）
  reportError(error, context);
}

/**
 * 获取用户友好的错误信息
 * @param {Error} error 错误对象
 * @returns {string} 用户友好的错误信息
 */
function getUserFriendlyMessage(error) {
  if (!error) return '操作失败，请重试';
  
  const errorCode = error.code || error.errCode;
  const errorMsg = error.message || error.errMsg || '';
  
  // 网络错误
  if (errorCode === 'NETWORK_ERROR' || errorMsg.includes('network')) {
    return '网络连接失败，请检查网络';
  }
  
  // API限流
  if (errorCode === 'API_LIMIT' || errorMsg.includes('limit')) {
    return 'AI服务繁忙，请稍后再试';
  }
  
  // 云函数错误
  if (errorCode === 'CLOUD_FUNCTION_ERROR') {
    return '服务暂时不可用，请稍后再试';
  }
  
  // 权限错误
  if (errorMsg.includes('permission') || errorMsg.includes('auth')) {
    return '权限不足，请重新授权';
  }
  
  // 默认错误
  return '操作失败，请重试';
}

/**
 * 上报错误日志
 * @param {Error} error 错误对象
 * @param {string} context 错误上下文
 */
function reportError(error, context) {
  // TODO: 实现错误日志上报
  // 可以调用云函数将错误日志保存到数据库
  try {
    wx.cloud.callFunction({
      name: 'logger',
      data: {
        level: 'error',
        message: error.message || error.errMsg,
        context,
        timestamp: new Date().toISOString(),
        stack: error.stack
      }
    });
  } catch (err) {
    console.error('上报错误日志失败', err);
  }
}

module.exports = {
  handleError,
  getUserFriendlyMessage,
  reportError
};
