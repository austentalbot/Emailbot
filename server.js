var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
var btoa = require('btoa');

var goauth = require('./gmailOAuth.js');
var credentials = require('./credentials.js');

var port = process.env.PORT || 4417;

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.get('/', function(req, res) {
  var locals = {
    title: 'My sample app',
    url: goauth.url
  };
  res.render('index.jade', locals);
});

app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  console.log(code);
  var locals = {
    title: 'My sample app',
    url: goauth.url
  };
  res.render('index.jade', locals);
});

// var message = {
//   to: 'austentalbot@gmail.com',
//   from: 'austentalbot@gmail.com',
//   subject: 'api test'
// };

// var base64Message = btoa(message);

// var parameters = {
//   method: 'POST',
//   url: 'https://www.googleapis.com/gmail/v1/users/austentalbot%40gmail.com/messages/send?key='
//     + credentials.key,
//   formData: {
//     raw: base64Message
//   }
// };

// request(parameters, function(err, response, payload) {
//   if (err) {
//     console.log('err', err);
//   }
//   console.log('payload', payload);
// });


var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});