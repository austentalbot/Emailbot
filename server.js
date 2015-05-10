var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var request = require('request');
var btoa = require('btoa');

var gapi = require('./gmailOAuth.js');
var credentials = require('./credentials.js');

var port = process.env.PORT || 4417;

//initialize app and use cors & body parser
var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname));

app.get('/', function(req, res) {
  var locals = {
    title: 'My sample app',
    url: gapi.url
  };
  res.render('./index.jade', locals);
});

app.get('/bundle.js', function(req, res){
  console.log('bundle');
  res.status(200).sendFile(__dirname + '/public/build/bundle.js');
});

app.get('/oauth2callback', function(req, res) {
  var code = req.query.code;
  gapi.client.getToken(code, function(err, tokens) {
    console.log(tokens);
    if(!err) {
      gapi.client.setCredentials(tokens);
      gmail = gapi.gmail({ version: 'v1', auth: gapi.client });
    }
  });
  res.status(200).sendFile(__dirname + '/public/index.html');
});

app.post('/sendEmail', function(req, res) {
  console.log(req.body);
  var base64Message = req.body.base64Message;
  gmail.users.messages.send({
    auth: gapi.client,
    userId: 'austentalbot@gmail.com', // can use "me" to signify authenticated user
    resource: {
      raw: base64Message
    }
  }, function(err, data, response) {
    if (err) {
      console.log('err', err);
      res.status(501).send(err);
    }
    res.status(200).send('Email sent!');
  });
});

var server = app.listen(port, function(){
  console.log('Server is listening on port ' + port);
});