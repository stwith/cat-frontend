/*
 * @Author: Aven
 * @Date: 2021-04-02 14:59:50
 * @LastEditors: Aven
 * @LastEditTime: 2021-04-10 19:48:38
 * @Description:
 */
import { RouteConfig } from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        component: () => import('src/pages/Home.vue')
      },
      {
        path: '/battle',
        component: () => import('src/pages/Battle.vue')
      },
      {
        path: '/nfts',
        component: () => import('src/pages/UserNTF.vue')
      },
      { path: '/account', component: () => import('src/pages/CatNtf.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
