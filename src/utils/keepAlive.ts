import http from "http";

http
  .createServer(function (_req, res) {
    res.writeHead(200);
    res.end("OK");
  })
  .listen(8080);
