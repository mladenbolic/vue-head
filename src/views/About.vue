<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<script>
import { useHead } from "@vueuse/head";

export default {
  name: "About",
  setup() {
    useHead({
      title: "About Page",
      meta: [
        {
          key: "description",
          property: "description",
          content: "You’ve come to the right place. This is our About page.",
        },
        { key: "og:site_name", property: "og:site_name", content: "sixhours" },
        { key: "og:type", property: "og:type", content: "website" },
        {
          key: "og:title",
          property: "og:title",
          content: "About Page",
        },
        {
          key: "og:description",
          property: "og:description",
          content: "You’ve come to the right place. This is our About page.",
        },
        { key: "og:url", property: "og:url", content: "https://sixhours.io" },
        {
          key: "og:image",
          property: "og:image",
          content: require("@/assets/about.jpg"),
        },
        { key: "og:image:width", property: "og:image:width", content: "1200" },
        { key: "og:image:height", property: "og:image:height", content: "630" },
      ],
    });
  },
};
</script>
