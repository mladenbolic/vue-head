import buildApp from "@/app";

const { app, router, store } = buildApp();

// initialize the store with server-initialized state.
// the state is determined during SSR and inlined in the page markup.
if (window && window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.isReady().then(() => {
  app.mount("#app", true);
});
