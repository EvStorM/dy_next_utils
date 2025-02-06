interface UrlParamsContextValue {
  url: string;
  scheme: string;
  slash: string;
  host: string;
  suffix: string;
  port: string;
  path: string;
  query: any;
  hash: string;
}

// 解析url,返回解析结果
export const getUrlArgObject = (query: string): UrlParamsContextValue => {
  var parse_url =
    /^(?:([A-Za-z]+):)?(\/{2,3})?([0-9.\-A-Za-z]+(\.[0-9.\-A-Za-z]+))?(?::(\d+))?(?:(\/?[^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  let result: any = parse_url.exec(query);
  let fields = [
    "url",
    "scheme",
    "slash",
    "host",
    "suffix",
    "port",
    "path",
    "query",
    "hash",
  ];
  let res: any = {};
  fields.forEach(function (field, i) {
    if (field === "query") {
      res[field] = getQuery(result[i]);

      return;
    }
    res[field] = result[i];
  });
  return res;
};

const getQuery = (url: string): Object => {
  // str为？之后的参数部分字符串
  const str = url.substr(url.indexOf("?") + 1);
  // arr每个元素都是完整的参数键值
  const arr = str.split("&");
  // result为存储参数键值的集合
  const result: any = {};
  for (let i = 0; i < arr.length; i++) {
    // item的两个元素分别为参数名和参数值
    const item = arr[i].split("=");
    result[item[0]] = item[1];
  }
  return result;
};
