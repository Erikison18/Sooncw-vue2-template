import moment from 'moment';
import * as _ from 'lodash';

moment.locale('zh-cn');

/**
 * 日期格式化
 * @description 基于 moment 的日期格式化
 * @param {Number|String|Date} value
 * @param {String} format 更多配置参考 moment 文档 <https://momentjs.com/docs/>
 * @param {String} unlimitedText
 * @returns String
 */
export const dateFormat = (
  value,
  format = 'YYYY-MM-DD HH:mm:ss',
  unlimitedText = ''
) => {
  if (!value) return '';
  let date = moment(value).toDate();
  if (Number.isNaN(date.getTime())) return '';
  if (date.getFullYear() === 9999) return unlimitedText;
  return moment(date).format(format);
};

/**
 * 千分位数字格式化
 * @param {Number|String} value
 * @param {int} fixed 修正位数
 * @returns {null|String}
 */
export const amount = (value, fixed = 2) => {
  if (isNaN(value)) return null;
  if ([null, undefined, ''].includes(value)) return null;
  if (value === 0) return parseFloat(0).toFixed(fixed);
  let num = value.toString().replace(/,/g, '');
  num = parseFloat(num || 0);
  num = num.toFixed(+fixed || 0).toString();
  num = num.split('.');
  if (num.length === 1) return num[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  return [num[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'), num[1]].join('.');
};

/**
 * 单元格金额处理
 * @param {Number|String} value
 * @param {int} placeholder 值为空时的占位符
 * @param {int} fixed 修正位数
 * @returns String
 */
export const columnAmount = (
  value,
  { placeholder = '-', fixed = 2, prefix = '', suffix = '' } = {}
) => {
  if (value === 0) return 0;
  if (isNaN(value)) return placeholder;
  const _amount = amount(value, fixed);
  return _amount === null ? placeholder : prefix + _amount + suffix;
};

// 去除左右空格
export const trimValue = value => {
  // 以下参数不予处理

  const _trim = val => val.trimLeft().trimRight();

  // 字符串直接过滤
  if (typeof value === 'string') return _trim(value);

  // 对象递归过滤
  if (Object.prototype.toString.call(value) === '[object Object]') {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        let _value = value[key];
        if (typeof _value === 'string') {
          value[key] = trimValue(_value);
        }
      }
    }
    return value;
  }

  // 数组
  if (Array.isArray(value)) {
    value = [...value].map(set => trimValue(set));
  }

  // 其他不予处理
  return value;
};

// 去除空值参数，包含空字符串、空数组、空对象
// value 仅支持 对象 和 数组 类型
export const removeEmpty = value => {
  const _empty = data => {
    if (data === '') return true;
    if (Array.isArray(data) && !data.length) return true;
    if (JSON.stringify(data) === '{}') return true;
    return false;
  };

  if (value instanceof Object) {
    for (const key in value) {
      if (
        Object.prototype.hasOwnProperty.call(value, key) &&
        _empty(value[key])
      ) {
        delete value[key];
      }
    }
    return value;
  } else if (Array.isArray(value)) {
    // 数组处理
    return [...value].filter(set => !_empty(set));
  } else {
    return value;
  }
};

// 传入指定字符，和字符串
// 帮字符串删掉最后一个指定字符
export const removeLastCharFromString = (char, str) => {
  let lastIndex = str.lastIndexOf(char);

  if (lastIndex > -1) {
    let string =
      str.substring(0, lastIndex) + str.substring(lastIndex + 1, str.length);
    return string;
  }
};

// 手机号脱敏
export const operatePhoneNumb = str => {
  var pat = /(\d{3})\d*(\d{4})/;
  var b = str.replace(pat, '$1****$2');
  return b;
};

/**
 * 根据枚举 key 返回 value
 * @param {*} key
 * @param {*} enums
 */
export const enumMessage = (key, enums) => {
  if (!enums || !enums.length) {
    return key;
  }
  for (const $enum of enums) {
    if ($enum.key === key) {
      return $enum.value;
    }
  }
  if (/,/.test(key)) {
    const keyArr = key.split(',');
    return keyArr.map(item => enumMessage(item, enums)).join(',');
  }
  return key;
};

/**
 * 默认横杠
 * @param {*} value
 */
 export const dash = (value, placeholder = '-') => {
  if (value == null || _.trim(value) === '') {
    return placeholder
  }
  return value
}

/**
 * 判断重复时间段
 * @param {Array} timeList
 */
 export const isBetweenTime = (timeList = []) => {
   let format = 'HH:mm:ss'
   for (let i = 0; i < timeList.length; i++) {
     const el = timeList[i];
     let starTime = moment(el[0], format)
     let endTime = moment(el[1], format)
     for (let j = 0; j < timeList.length; j++) {
       if (i !== j) {
         const elOther = timeList[j];
         let starTimeOther = moment(elOther[0], format)
         let endTimeOther = moment(elOther[1], format)
         // 重复时间判断
         if (starTime.isBetween(starTimeOther, endTimeOther) || endTime.isBetween(starTimeOther, endTimeOther)) {
           return true
         }
       }
     }
   }

  return false
}

/**
 * 数组扁平化
 * @param {Array} arr 
 */
export const flatten = (arr = []) => {
  //声明空数组
  let result = [];
  //遍历数组
  arr.forEach(item => {
      //判断
      if(Array.isArray(item)){
          result = result.concat(flatten(item));
      }else{
          result = result.concat(item);
      }
  });
  //返回结果
  return result;
}

/**
 * 数组每一项值是否唯一
 * @param {Array} arr 
 */
export const isUnique = (arr = []) => {
   //声明一个空数组
   const result = [];
   //遍历原始数组
   arr.forEach(item => {
       //检测 result 数组中是否包含这个元素
       if(result.indexOf(item) === -1) {
           //若没有该元素 则插入到result中
           result.push(item);
       }
   });
   //返回
   return result.length === arr.length;
}
