/**
 * 水印
 * @description 使用 v-watermark 调用指令，会在指定元素的内容增加一个 watermark 的元素；
 */
import watermark from '@/core/watermark';

export default {
  bind: (el, binding) => {
    watermark(el, binding.value || {});
  }
}
