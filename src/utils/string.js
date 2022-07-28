import {
  trim
} from 'lodash';

// 字符串工具函数

/**
 * 单元格输出展示
 * @description 如果不存在有效值，则显示一个 - 符号
 * @param {*} value 
 */
export const columnStr = value => {
  if (value === null || trim(value) == '') return '-';
  return value;
};
