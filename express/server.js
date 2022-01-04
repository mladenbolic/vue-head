const path = require("path");
const express = require("express");
const serverless = require("serverless-http");
const serialize = require("serialize-javascript");
const fs = require("fs");
const manifest = require(path.join(__dirname, "./dist/server/ssr-manifest.json"));

const server = express();

const appPath = path.join(__dirname, "./dist", "server", manifest["app.js"]);
const renderApp = require(appPath).default;

const clientDistPath = "./dist/client";
server.use("/img", express.static(path.join(__dirname, clientDistPath, "img")));
server.use("/js", express.static(path.join(__dirname, clientDistPath, "js")));
server.use("/css", express.static(path.join(__dirname, clientDistPath, "css")));
server.use("/fonts", express.static(path.join(__dirname, clientDistPath, "fonts")));
server.use("/favicon.ico", express.static(path.join(__dirname, clientDistPath, "favicon.ico")));

// handle all routes in our application
server.get("*", async (req, res) => {
  const { content, meta, state } = await renderApp(req.url);

  let baseUrl = req.protocol + "://" + req.get("host");
  if (req.headers["x-forwarded-proto"] && req.headers["host"]) {
    baseUrl = req.headers["x-forwarded-proto"] + "://" + req.headers["host"];
  }
  if (req.headers["x-forwarded-proto"] && req.headers["x-original-host"]) {
    baseUrl = req.headers["x-forwarded-proto"] + "://" + req.headers["x-original-host"];
  }
  const fullUrl = baseUrl + req.originalUrl.split(/[?#]/)[0];

  const renderState = `
    <script>
      window.INITIAL_DATA = ${serialize(state)}
    </script>`;

  fs.readFile(path.join(__dirname, clientDistPath, "index.html"), (err, html) => {
    if (err) {
      throw err;
    }

    // eslint-disable-next-line no-param-reassign
    html = html
      .toString()
      .replace('<div id="app"></div>', `${renderState}<div id="app">${content}</div>`)
      .replace("</head>", `${meta || ""}</head>`)
      .replace(
        '<meta property="og:url" content="https://sixhours.io">',
        `<meta property="og:url" content="${fullUrl}">`
      )
      .replace(/content="\/img\//g, `content="${baseUrl}/img/`);
    res.setHeader("Content-Type", "text/html");
    res.send(html);
  });
});

// path must route to lambda
server.use("/.netlify/functions/server", server.Router());

module.exports = server;
module.exports.handler = serverless(server);
