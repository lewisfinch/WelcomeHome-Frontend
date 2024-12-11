import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/itemView',
        name: 'ItemView',
        component: () => import('@/views/ItemView.vue'),
    },
    {
        path: '/',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
