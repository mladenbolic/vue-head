import { createApp, createSSRApp } from "vue";

import App from "./App.vue";
import router from "@/router";
import store from "@/store";

import { createHead } from "@vueuse/head";

const isServer = typeof window === "undefined";

export default function buildApp() {
  const app = isServer ? createSSRApp(App) : createApp(App);

  // create head client for creating header meta tags
  const head = createHead();

  app.use(router);
  app.use(store);
  app.use(head);

  return { app, router, store, head };
}
