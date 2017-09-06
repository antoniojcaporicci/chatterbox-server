
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var messages = [{username: 'ross', objectId: '12:22', text: 'cats', roomname: 'lobby'}];
var rooms = [];

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);


  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/JSON';

  if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end(JSON.stringify(headers));
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    response.writeHead(200, headers);
    response.end(JSON.stringify({'results': messages}));
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    response.writeHead(201, headers);
    request.on('data', function (chunk) {
      var createdAt = Date.now();
      var message = JSON.parse(chunk.toString());
      message.objectId = createdAt;
      messages.unshift(message);
    });
    request.on('end', function () {
      response.end(JSON.stringify({'results': messages}));
    });
  } else {
    response.writeHead(404, headers);
    response.end('error');
  }
};

exports.requestHandler = requestHandler;
