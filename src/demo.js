/**计算一个字符串的字节数 */
export const countBytes = (str) => {
  const encoder = new TextEncoder()
  if (!str || typeof str !== "string") return 0
  let bytes = 0
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    if (charCode <= 127) {
      bytes += 1 // 英文字符或者 ASCII 字符
    } else {
      bytes += 2 // 中文字符等
    }
    if (charCode === 45) {
      bytes += 0.2
    }
    if (charCode > 64 && charCode < 91) {
      bytes -= 0.1
    }
  }
  return bytes
}

/**
 * 防抖函数：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @param {boolean} immediate - 是否立即执行（第一次触发时是否立即执行）
 * @returns {Function} 返回防抖后的函数
 */
export const debounce = (func, delay, immediate = false) => {
  let timeoutId;
  let isExecuted = false;

  return function (...args) {
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) {
        func.apply(this, args);
      } else if (isExecuted) {
        isExecuted = false;
      }
    }, delay);

    if (callNow) {
      func.apply(this, args);
      isExecuted = true;
    }
  };
};

/**
 * 节流函数：在指定时间段内只执行一次函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 时间间隔（毫秒）
 * @param {Object} options - 选项配置 { leading: boolean, trailing: boolean }
 * @returns {Function} 返回节流后的函数
 */
export const throttle = (func, delay, options = {}) => {
  let timeoutId;
  let lastExecTime = 0;
  const { leading = true, trailing = true } = options;

  return function (...args) {
    const currentTime = Date.now();

    // 如果是首次执行且设置了首部执行
    if (!lastExecTime && !leading) {
      lastExecTime = currentTime;
    }

    const remainingTime = delay - (currentTime - lastExecTime);

    if (remainingTime <= 0) {
      // 立即执行
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      lastExecTime = currentTime;
      func.apply(this, args);
    } else if (trailing && !timeoutId) {
      // 设置尾部执行的定时器
      timeoutId = setTimeout(() => {
        lastExecTime = leading ? Date.now() : 0;
        timeoutId = null;
        func.apply(this, args);
      }, remainingTime);
    }
  };
};