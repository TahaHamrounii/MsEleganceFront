import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/Produits',
                    name: 'Produits',
                    component: () => import('@/views/Main/Produits.vue')
                },
                {
                    path: '/QuiSommeNous',
                    name: 'QuiSommeNous',
                    component: () => import('@/views/Main/QuiSommeNous.vue')
                },
                {
                    path: '/',
                    name: 'AcceuilEmpty',
                    component: () => import('@/views/Main/Landing.vue')
                },
                {
                    path: '/Acceuil',
                    name: 'Acceuil',
                    component: () => import('@/views/Main/Landing.vue')
                },
            ]
        },
/*
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        */
    ]
});

export default router;
