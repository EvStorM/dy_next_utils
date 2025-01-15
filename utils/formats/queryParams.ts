/**
 * 对象转url参数
 * @param data
 * @param isPrefix
 * @param arrayFormat
 */
function queryParams(
  data: any = {},
  isPrefix = false,
  arrayFormat = 'brackets',
) {
  let prefix = isPrefix ? '?' : '';
  let _result = [];
  if (['indices', 'brackets', 'repeat', 'comma'].indexOf(arrayFormat) == -1)
    arrayFormat = 'brackets';
  for (let key in data) {
    let value = data[key];
    // 去掉为空的参数
    if (['', undefined, null].indexOf(value) < 0) {
      if (value.constructor === Array) {
        // e.g. {ids: [1, 2, 3]}
        switch (arrayFormat) {
          case 'indices':
            // 结果: ids[0]=1&ids[1]=2&ids[2]=3
            for (let i = 0; i < value.length; i++) {
              _result.push(key + '[' + i + ']=' + value[i]);
            }
            break;
          case 'brackets':
            // 结果: ids[]=1&ids[]=2&ids[]=3
            value.forEach((_value) => {
              _result.push(key + '[]=' + _value);
            });
            break;
          case 'repeat':
            // 结果: ids=1&ids=2&ids=3
            value.forEach((_value) => {
              _result.push(key + '=' + _value);
            });
            break;
          case 'comma':
            // 结果: ids=1,2,3
            let commaStr = '';
            value.forEach((_value) => {
              commaStr += (commaStr ? ',' : '') + _value;
            });
            _result.push(key + '=' + commaStr);
            break;
          default:
            value.forEach((_value) => {
              _result.push(key + '[]=' + _value);
            });
        }
      } else {
        _result.push(key + '=' + value);
      }
    } else {
      continue;
    }
    // 如果值为数组，另行处理
  }
  return _result.length ? prefix + _result.join('&') : '';
}

export default queryParams;
