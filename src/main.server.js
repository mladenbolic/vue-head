import { renderHeadToString } from "@vueuse/head";
import { renderToString } from "@vue/server-renderer";
import buildApp from "@/app";

export default async (url) => {
  const { app, router, store, head } = buildApp();

  // set server-side router's location
  // On page refresh router isReady() resolves immediately, but current path is still not
  // available as a matched component (previous path is still matched) so we need to wait until push
  // promise resolves
  try {
    await router.push(url);
    await router.isReady();
  } catch (err) {
    console.log("Router error:", err);
    throw new Error(err);
  }

  const matchedComponents = router.currentRoute.value.matched;
  console.log("matchedComponents=", matchedComponents);

  if (!matchedComponents.length) {
    throw new Error("404");
  }

  const context = {};
  const content = await renderToString(app, context);
  const { headTags: meta } = renderHeadToString(head);
  const state = store.state;

  // return application content, meta tags and initial state for server side rendering
  return { content, meta, state };
};
