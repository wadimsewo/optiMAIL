import { createWebHistory, createRouter } from "vue-router";
import Client from '@/pages/Client';

const routes = [
  {
    path: "/",
    name: "Client",
    component: Client,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
