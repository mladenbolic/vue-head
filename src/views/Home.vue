<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { useHead } from "@vueuse/head";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  setup() {
    useHead({
      title: "Home Page",
      meta: [
        {
          key: "description",
          property: "description",
          content: "You’ve come to the right place. This is our Home page.",
        },
        { key: "og:site_name", property: "og:site_name", content: "sixhours" },
        { key: "og:type", property: "og:type", content: "website" },
        {
          key: "og:title",
          property: "og:title",
          content: "Home Page",
        },
        {
          key: "og:description",
          property: "og:description",
          content: "You’ve come to the right place. This is our Home page.",
        },
        { key: "og:url", property: "og:url", content: "https://sixhours.io" },
        {
          key: "og:image",
          property: "og:image",
          content: require("@/assets/home.jpg"),
        },
        { key: "og:image:width", property: "og:image:width", content: "1200" },
        { key: "og:image:height", property: "og:image:height", content: "630" },
      ],
    });
  },
};
</script>
