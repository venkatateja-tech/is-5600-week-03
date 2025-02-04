const http = require('http');
const url = require('url');

const port = process.env.PORT || 3000;
/**
 * Responds with plain text
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondText(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hi');
  }
  
  /**
   * Responds with JSON
   * 
   * @param {http.IncomingMessage} req
   * @param {http.ServerResponse} res
   */
  function respondJson(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ text: 'hi', numbers: [1, 2, 3] }));
  }
  /**
 * Responds with a 404 not found
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
function respondNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
  function respondEcho(req, res) {
    const urlObj = new URL(req.url, `http://${req.headers.host}`);
    const input = urlObj.searchParams.get('input') || '';

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
        normal: input,
        shouty: input.toUpperCase(),
        charCount: input.length,
        backwards: input.split('').reverse().join(''),
    }));
}

// note that typically the variables here are `req` and `res` but we are using `request` and `response` for clarity
const server = http.createServer(function(request, response) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
  
      console.log("url", pathname);
      if (pathname === '/') return respondText(request, response);
      if (pathname === '/json') return respondJson(request, response);
      if (pathname.match(/^\/echo/)) return respondEcho(request, response);
    respondNotFound(request, response);
  });

server.listen(port, function() {
  console.log(`Server is listening on port ${port}`);
});