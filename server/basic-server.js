const express = require('express');
const app = express();
const fs = require('fs');
const bodyParse = require('body-parser');
debugger;
app.use(express.static('client'));
app.use(bodyParse.json());
app.use(bodyParse.urlencoded({
  extended: true
}));

app.get('/classes/messages', function (req, res) {
  var messages = fs.readFileSync('./server/message.json');
  messages = JSON.parse(messages);
  res.json({results: messages})
})

app.post('/classes/messages', function (req, res) {
  var messages = fs.readFileSync('./server/message.json');
  messages = JSON.parse(messages);
  console.log(req.body);
  messages.unshift(req.body);
  fs.writeFileSync('./server/message.json', JSON.stringify(messages))
  res.json({results: messages});
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
