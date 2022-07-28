export default [
  {
    path: "/test",
    name: "Test",
    component: () => import("@/layout/Main"),
    children: [
      {
        path: "",
        name: "TestHome",
        component: () =>
          import(/* webpackChunkName: "Test"*/ "_v/Test/Index.vue")
      }
    ]
  }
];
