export default {
  path: '/system',
  name: 'system',
  meta: {
    role: 'bc8ca830-15bf-483f-af7c-4a350a0c545f',
    title: '系统设置',
    icon: 'kd-icon kd-icon-settings',
    hidden: false,
    tag: false
  },
  component: () =>
    import(/* webpackChunkName:"routes_system" */ '@/layout/Main'),
  children: [
    // 权限管理
    {
      path: 'authority',
      name: 'systemAuthority',
      meta: {
        role: '1d7ac35a-e6e9-4f0d-8944-c25c4d97da40',
        title: '权限管理',
        hidden: false,
        tag: true
      },
      component: () =>
        import(
          /* webpackChunkName:"routes_system" */ '@/views/system/authority/Authority'
        )
    },

    // 角色管理
    {
      path: 'role',
      name: 'systemRole',
      meta: {
        role: '4691458b-60d2-4cc6-b397-4d3342d11957',
        title: '角色管理',
        hidden: false,
        tag: true
      },
      component: () =>
        import(
          /* webpackChunkName:"routes_system" */ '@/views/system/role/Role'
        )
    },

    // 操作员管理
    {
      path: 'operator',
      name: 'systemOperator',
      meta: {
        role: 'a3d99fe0-ebfe-4e24-9260-258c78e626b2',
        title: '操作员管理',
        hidden: false,
        tag: true
      },
      component: () =>
        import(
          /* webpackChunkName:"routes_system" */ '@/views/system/operator/Operator'
        )
    },
  ]
};
