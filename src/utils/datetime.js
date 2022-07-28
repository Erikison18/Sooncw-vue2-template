import moment from 'moment';

moment.locale("zh-cn");

// 日期工具函数

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
  format = "YYYY-MM-DD HH:mm:ss"
) => {
  if (!value) return "";
  return moment(value).format(format);
};
