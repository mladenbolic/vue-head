const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = {
  productionSourceMap: process.env.NODE_ENV !== "production",
  transpileDependencies: ["vue-meta"],
  chainWebpack: (config) => {
    // disable cache loader, otherwise the client build will use cached components from the server build
    config.module.rule("vue").uses.delete("cache-loader");
    config.module.rule("js").uses.delete("cache-loader");
    config.module.rule("ts").uses.delete("cache-loader");
    config.module.rule("tsx").uses.delete("cache-loader");

    // inline all images smaller than 5KB as base64 data
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap((options) => Object.assign(options, { limit: 5120 }));

    // do not prefetch assets (performance optimization)
    config.plugins.delete("prefetch");

    // disable gzip compression for non-production builds
    if (process.env.NODE_ENV !== "production") {
      config.plugins.delete("brotli-compression");
      config.plugins.delete("gzip-compression");
    }

    if (!process.env.SSR) {
      // this is required for ngrok to play nicely with dev server
      config.devServer.disableHostCheck(true);

      config.entry("app").clear().add("./src/main.js");
      return;
    }

    config.entry("app").clear().add("./src/main.server.js");

    config.target("node");
    config.output.libraryTarget("commonjs2");

    config
      .plugin("manifest")
      .use(new WebpackManifestPlugin({ fileName: "ssr-manifest.json" }));

    if (process.env.SSR_NODE_EXTERNALS) {
      config.externals(
        nodeExternals({
          allowlist: [
            /^jquery*/,
            /^bootstrap*/,
            /\.(css|sass|scss|less)$/,
            /\.(vue)$/,
            /\.(html)$/,
          ],
        })
      );
    }

    config.optimization.splitChunks(false).minimize(false);

    config.plugins.delete("hmr");
    config.plugins.delete("preload");
    config.plugins.delete("prefetch");
    config.plugins.delete("progress");
    config.plugins.delete("friendly-errors");

    config.plugin("limit").use(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      })
    );
  },
  devServer: {
    disableHostCheck: true, // for ngrok
  },
};
