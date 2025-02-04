
const EventEmitter = require('events');

const chatEmitter = new EventEmitter();
const path = require('path');
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
app.use(express.static(__dirname + '/public'))


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
    // express has a built in json method that will set the content type header
    res.json({
      text: 'hi',
      numbers: [1, 2, 3],
    });
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

  /**
 * Responds with the input string in various formats
 * 
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
  function respondEcho (req, res) {
    // req.query is an object that contains the query parameters
    const { input = '' } = req.query;

    // here we make use of res.json to send a json response with less code
    res.json({
      normal: input,
      shouty: input.toUpperCase(),
      charCount: input.length,
      backwards: input.split('').reverse().join(''),
    });
  }

app.get('/json', respondJson);
app.get('/echo', respondEcho);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function chatApp(req, res) {
    res.sendFile(path.join(__dirname, '/chat.html'));
  }

  // register the endpoint with the app (make sure to remove the old binding to the `/` route)
app.get('/', chatApp);

app.get('/chat', respondChat);

function respondChat (req, res) {
  const { message } = req.query;

  chatEmitter.emit('message', message);
  res.end();
}


/**
 * This endpoint will respond to the client with a stream of server sent events
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
app.get('/sse', respondSSE);

function respondSSE (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
  });

  const onMessage = message => res.write(`data: ${message}\n\n`);
  chatEmitter.on('message', onMessage);

  res.on('close', () => {
    chatEmitter.off('message', onMessage);
  });
}