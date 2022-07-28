// 数学工具函数

/**
 * 单元格数字展示
 * @description 如果不存在有效值，则显示一个 - 符号
 * @param {*} num 
 * @param {*} placeholder 
 */
export const columnNum = (num, placeholder = '-') => {
  if ([null, false, ''].includes(num) || !['string', 'number'].includes(typeof num)) return placeholder;
  return isNaN(+num) ? placeholder : num;
}
