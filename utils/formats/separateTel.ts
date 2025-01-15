// 格式化电话号码

import { trimAll } from "./trimAll";

// 格式化电话号码,每4位加一个空格
export const separateTel = (tel: string) => {
  const val = trimAll(tel);

  try {
    switch (val.length) {
      case 4:
      case 5:
      case 6:
      case 7:
        return val.replace(/(\d{3})(\d{1})/, '$1 $2');
      case 8:
      case 9:
      case 10:
        return val.replace(/(\d{3})(\d{4})(\d{1})/, '$1 $2 $3');
      case 11:
        return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
      default:
        return val.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
    }
  } catch (e) {
    return tel;
  }
};
