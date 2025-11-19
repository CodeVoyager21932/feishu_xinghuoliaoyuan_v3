// utils/validator.js
// 数据验证工具

/**
 * 验证是否为空
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为空
 */
function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

/**
 * 验证字符串长度
 * @param {string} str 字符串
 * @param {number} min 最小长度
 * @param {number} max 最大长度
 * @returns {boolean} 是否符合长度要求
 */
function validateLength(str, min, max) {
  if (isEmpty(str)) return false;
  const len = str.length;
  return len >= min && len <= max;
}

/**
 * 验证手机号
 * @param {string} phone 手机号
 * @returns {boolean} 是否为有效手机号
 */
function validatePhone(phone) {
  const reg = /^1[3-9]\d{9}$/;
  return reg.test(phone);
}

/**
 * 验证邮箱
 * @param {string} email 邮箱
 * @returns {boolean} 是否为有效邮箱
 */
function validateEmail(email) {
  const reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return reg.test(email);
}

/**
 * 验证数字
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为数字
 */
function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * 验证整数
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为整数
 */
function isInteger(value) {
  return Number.isInteger(value);
}

/**
 * 验证数字范围
 * @param {number} value 数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {boolean} 是否在范围内
 */
function validateRange(value, min, max) {
  if (!isNumber(value)) return false;
  return value >= min && value <= max;
}

/**
 * 验证数组
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为数组
 */
function isArray(value) {
  return Array.isArray(value);
}

/**
 * 验证对象
 * @param {any} value 要验证的值
 * @returns {boolean} 是否为对象
 */
function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 * @param {string} date 日期字符串
 * @returns {boolean} 是否为有效日期
 */
function validateDate(date) {
  const reg = /^\d{4}-\d{2}-\d{2}$/;
  if (!reg.test(date)) return false;
  
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
}

/**
 * 验证URL
 * @param {string} url URL字符串
 * @returns {boolean} 是否为有效URL
 */
function validateUrl(url) {
  const reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return reg.test(url);
}

/**
 * 表单验证
 * @param {object} data 表单数据
 * @param {object} rules 验证规则
 * @returns {object} 验证结果 {valid: boolean, errors: object}
 */
function validateForm(data, rules) {
  const errors = {};
  let valid = true;

  for (const field in rules) {
    const rule = rules[field];
    const value = data[field];

    // 必填验证
    if (rule.required && isEmpty(value)) {
      errors[field] = rule.message || `${field}不能为空`;
      valid = false;
      continue;
    }

    // 如果不是必填且为空，跳过其他验证
    if (!rule.required && isEmpty(value)) {
      continue;
    }

    // 长度验证
    if (rule.minLength || rule.maxLength) {
      const min = rule.minLength || 0;
      const max = rule.maxLength || Infinity;
      if (!validateLength(value, min, max)) {
        errors[field] = rule.message || `${field}长度应在${min}-${max}之间`;
        valid = false;
        continue;
      }
    }

    // 自定义验证函数
    if (rule.validator && typeof rule.validator === 'function') {
      const result = rule.validator(value);
      if (!result) {
        errors[field] = rule.message || `${field}格式不正确`;
        valid = false;
      }
    }
  }

  return { valid, errors };
}

module.exports = {
  isEmpty,
  validateLength,
  validatePhone,
  validateEmail,
  isNumber,
  isInteger,
  validateRange,
  isArray,
  isObject,
  validateDate,
  validateUrl,
  validateForm
};
