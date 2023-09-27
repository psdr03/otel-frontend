const next = require("next");
const { parse } = require("url");
// import { createServer as httpServer } from "http";
const { createServer } = require("http");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const PORT = process.env.PORT || 3000;
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT);
});
