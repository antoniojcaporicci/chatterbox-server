var fs = require('fs');
var mime = require('mime-types');
var stream = require('stream');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);


  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/JSON';

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end(JSON.stringify(headers));
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    var messages = fs.readFileSync('./server/message.json');
    messages = JSON.parse(messages);
    response.writeHead(200, headers);
    response.end(JSON.stringify({'results': messages}));
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    response.writeHead(201, headers);
    request.on('data', function (chunk) {
      var messages = fs.readFileSync('./server/message.json');
      messages = JSON.parse(messages);
      var createdAt = JSON.stringify(Date.now());
      var message = JSON.parse(chunk.toString());
      message.objectId = createdAt;
      messages.unshift(message);
      fs.writeFileSync('./server/message.json', JSON.stringify(messages))
    });
    request.on('end', function () {
      response.end(JSON.stringify({'results': messages}));
    });
  } else if (request.method === 'GET') {
    console.log(request.url);
    var path = './client' + request.url.split('?')[0];
    if(request.url.split('?')[0] === '/') {
      path = './client/index.html'
    }
    if (fs.existsSync(path)) {
      console.log('here')
      var contentType = mime.lookup(path);
      console.log(contentType);
      headers['Content-Type'] = contentType
      response.writeHead(200, headers);
      response.end(fs.readFileSync(path));
    }
  } else {
    response.writeHead(404, headers);
    response.end('error');
  }
};

exports.requestHandler = requestHandler;
