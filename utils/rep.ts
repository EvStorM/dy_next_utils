// 验证是否是手机号码
export function isMobile(value: string): boolean {
  try {
    return /^1[3-9]\d{9}$/.test(value.toString().trim());
  } catch (e) {
    return false;
  }
}
// 验证是否是1开头的
export function isStartWithTel(value: string): boolean {
  try {
    if (value.length === 1) {
      return /^1$/.test(value.toString().trim());
    }
    return /^1[3-9]\d*$/.test(value.toString().trim());
  } catch (e) {
    return false;
  }
}
