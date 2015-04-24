var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
var btoa = require('btoa');

var port = process.env.PORT || 4417;

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


var message = {
  to: 'austentalbot@gmail.com',
  from: 'austentalbot@gmail.com',
  subject: 'api test'
};

var base64Message = btoa(message);

var parameters = {
  method: 'POST',
  url: 'https://www.googleapis.com/auth/gmail.compose',
  formData: {
    raw: base64Message
  }
};

request(parameters, function(err, response, payload) {
  if (err) {
    console.log('err', err);
  }
  console.log('payload', payload);
});


var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});