import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    // 登录页面，独立的页面
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/Login.vue'), // 登录组件
    },
    
    // 父级布局组件，登录后访问
    {
      path: '/dashboard', // 父级布局路径
      name: 'Dashboard',
      component: () => import('@/views/MainLayout.vue'), // 父级布局组件
    //   meta: { requiresAuth: true }, // 需要登录才能访问
      children: [
        {
            path: 'popularCategories',
            name: 'PopularCategories',
            component: () => import('@/views/PopularCategories.vue'),
          },
        {
            path: 'usersTasks',
            name: 'User\'s Tasks',
            component: () => import('@/views/UsersTasks.vue'),
          },
        {
          path: 'findSingleItem',
          name: 'FindSingleItem',
          component: () => import('@/views/FindSingleItem.vue'),
        },
        {
            path: 'shopping',
            name: 'Shopping',
            component: () => import('@/views/Shopping.vue'),
          },
        {
          path: 'findOrderItems',
          name: 'FindOrderItems',
          component: () => import('@/views/FindOrderItems.vue'),
        }, 
        {
            path: 'startAnOrder',
            name: 'StartAnOrder',
            component: () => import('@/views/StartAnOrder.vue'),
          },
          
        {
          path: 'acceptDonation',
          name: 'AcceptDonation',
          component: () => import('@/views/AcceptDonation.vue'),
        },
      ],
    },
  ];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
