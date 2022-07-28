// 创建水印遮罩
import app from "@/config/app";
import {
  getAuthUser
} from '@/core/grant';

// 配置项
const DEFAULTS = {
  text: '', // 文本内容
  opacity: 0.1, // 透明度
  rotate: 20, // 倾斜角度
  size: 14, // 大小
};

export default (el, options = {}) => {
  // 需要保证当前调用元素的 position 属性为 absolute、relative 或 fixed
  const position = el.style.position;
  if (!['absolute', 'relative', 'fixed'].includes(position)) {
    el.style.position = 'relative';
  }

  // 参数
  const _options = {
    ...DEFAULTS,
    ...options
  };

  // 是否可以创建水印
  if (!options.text) {
    try {
      // 获取用户信息
      const user = getAuthUser();
      _options.text = `${user.realName || '-'} ${user.username || '-'} `;
    } catch (error) {
      _options.text = app.title || document.title;
    }
  }

  // 画布的尺寸
  const rotate = _options.rotate * Math.PI / 180;
  const width = Math.max(_options.text.length * _options.size, 200);
  const height = width;

  // 创建水印图片 ： 创建画布 - 绘制内容 - 获取图片数据 - 显示为背景
  const canvas = document.createElement('canvas');
  canvas.width = width * 3;
  canvas.height = height * 3;
  const ctx = canvas.getContext('2d');
  // ctx.fillStyle = '#eee';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.strokeRect(0, 0, canvas.width, canvas.height);
  ctx.rotate(-rotate);
  ctx.translate(-70, 70);
  ctx.font = `${_options.size * 2}px Arial`;
  ctx.fillStyle = 'black'; // 字体颜色
  ctx.textAlign = "end";
  ctx.fillText(_options.text, canvas.width, canvas.height / 4);
  ctx.textAlign = "start";
  ctx.fillText(_options.text, 0, canvas.height - canvas.height / 3);
  // ctx.fillStyle = '#ddd';
  // ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 追加元素
  const watermark = document.createElement('div');
  watermark.style.position = 'absolute';
  watermark.style.bottom = 0;
  watermark.style.left = 0;
  watermark.style.right = 0;
  watermark.style.top = 0;
  watermark.style.zIndex = 999;
  watermark.style.opacity = _options.opacity;
  watermark.style.background = `url("${canvas.toDataURL('image/png')}") repeat`;
  watermark.style.backgroundSize = `${canvas.width/2}px ${canvas.height/2}px`;
  watermark.style.pointerEvents = 'none';
  el.append(watermark);
};
