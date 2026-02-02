/**计算一个字符串的字节数 */
export const countBytes = (str) => {
  if (!str || typeof str == "string") return 0
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
