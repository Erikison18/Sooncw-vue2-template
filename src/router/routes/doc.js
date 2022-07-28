// 首页控制台
export default {
  path: '/test',
  name: 'Test',
  meta: {
    role: '8687b80e-88ae-4102-a715-3ab1e2b72cf9',
    title: '测试',
    icon: 'kd-icon kd-icon-home',
    hidden: false,
    tag: false
  },
  component: () => import(/* webpackChunkName:"routes" */ '@/layout/Main'),
  children: [
    {
      path: '',
      name: 'TestHome',
      meta: {
        role: '433e9275-9c85-4da4-87b2-fd1add5aecc0',
        title: '测试',
        hidden: true,
        tag: false
      },
      component: () =>
        import(/* webpackChunkName:"routes" */ '@/views/Test/Index')
    }
  ]
};
