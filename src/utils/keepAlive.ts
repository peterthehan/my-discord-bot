import http from "http";

http
  .createServer(function (_req, res) {
    res.write("OK");
    res.end();
  })
  .listen(8080);
