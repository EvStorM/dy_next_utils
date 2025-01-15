// 清除所有空格
export const trimAll = (str: string | undefined): string => {
  if (!str) return '';
  try {
    return str.trim().replace(/\s+/g, '');
  } catch (e) {
    return str;
  }
};
