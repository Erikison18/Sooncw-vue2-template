import {
  get
} from "@/http";

/**
 * 接口示例
 * 
 * 注意事项：
 * 
 * 1、接口尽量按功能（或后端业务领域）分类，文件名使用 大写驼峰组合；
 * 2、单个接口方法使用 export 导出，尽量避免全量 import，如需可使用 import * as DemoApi from '@/api/Demo';
 * 3、每个方法均为 async 修饰的同步方法；
 * 4、在接口层处理入参、格式化出参；
 * 5、接口层需要对数据进行错误判断和修正，如：预期 []，后端返回 null，接口层应处理为  [] 返回。
 * 
 */

// 模拟延时
export const sleep = async (time = 600) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// 静态枚举定义，一般不需要，枚举应尽量由后端提供
export const DemoEnumUserTypes = [{
  value: 'Member',
  label: '会员'
}, {
  value: 'Supilier',
  label: '服务商'
}, ];

// GET 请求
export const DemoGet = async () => {
  // 接收数据
  //   const data = new Array(~~(Math.random() * 50)).fill('');
  const res = await get('https://cnodejs.org/api/v1/topics');

  // 加工数据
  //   const dataParsed = [...data].map(() => {
  //     return {
  //       username: 'admin',
  //       createAt: '2021-01-21 11:27:13'
  //     };
  //   });

  // 模拟接口响应延时
  await sleep();

  return {
    data: res.data,
    total: res.data.length,
  };
};

// POST 入参定义，通常拷贝自 Swagger 文档
// 如果一个对象需要在多个页面使用，为了避免多次定义，可以在此单独定义
export const DemoPostParams = {
  username: null,
  signture: null,
};

// POST 请求
export const DemoPost = async (params) => {
  if (!params) throw '参数错误，请检查';

  // 此处做参数合并，避免出现后端参数错误
  // 在 http 层，我们会清除其中的 null 值
  const _params = {
    ...DemoPostParams,
    ...(params || {}),
  };

  // 参数校验
  if (!_params.username) throw '用户名无效，请重新填写';
  if (!_params.signture) throw '用户签名无效，请重新填写';

  // 模拟接口响应延时
  await sleep();

  return _params;
};
