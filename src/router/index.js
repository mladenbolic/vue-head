import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import(/* webpackChunkName: "home" */ "../views/Home.vue"),
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const isServer = typeof window === "undefined";

const router = createRouter({
  history: isServer
    ? createMemoryHistory()
    : createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
