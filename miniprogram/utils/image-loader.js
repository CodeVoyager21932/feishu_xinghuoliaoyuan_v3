/**
 * 图片加载工具 - 统一管理本地/云端图片路径
 * 提供兜底机制，防止图片缺失导致 UI 裂图
 */

const { AVATAR_SVG, HERO_AVATAR_SVG, EMPTY_STATE_SVG, CARD_COVER_SVG } = require('./assets.js');

/**
 * 解析图片路径
 * @param {string} path - 图片路径
 * @param {string} type - 图片类型: 'local' | 'cloud' | 'avatar' | 'hero' | 'card'
 * @returns {string} 完整的图片 URL 或 Base64
 */
function resolveImage(path, type = 'local') {
  const app = getApp();
  
  // 如果路径为空，返回兜底图标
  if (!path || path === '') {
    switch (type) {
      case 'avatar':
        return AVATAR_SVG;
      case 'hero':
        return HERO_AVATAR_SVG;
      case 'card':
        return CARD_COVER_SVG;
      default:
        return EMPTY_STATE_SVG;
    }
  }

  // 如果已经是完整 URL 或 Base64，直接返回
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('cloud://')) {
    return path;
  }

  // 根据类型拼接路径
  switch (type) {
    case 'cloud':
      return (app.globalData?.cloudImageBase || 'cloud://') + path;
    case 'local':
      return `/images/${path}`;
    default:
      return path;
  }
}

/**
 * 图片加载失败兜底处理
 * @param {Event} e - 图片加载错误事件
 * @param {string} fallbackType - 兜底类型
 */
function handleImageError(e, fallbackType = 'empty') {
  const fallbackMap = {
    avatar: AVATAR_SVG,
    hero: HERO_AVATAR_SVG,
    card: CARD_COVER_SVG,
    empty: EMPTY_STATE_SVG
  };

  if (e && e.target) {
    e.target.src = fallbackMap[fallbackType] || EMPTY_STATE_SVG;
  }
}

module.exports = {
  resolveImage,
  handleImageError,
  // 直接导出 SVG 常量供特殊场景使用
  AVATAR_SVG,
  HERO_AVATAR_SVG,
  EMPTY_STATE_SVG,
  CARD_COVER_SVG
};
