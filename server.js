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

var email_lines = [];

email_lines.push('From: "Austen Talbot" <austentalbot@gmail.com>');
email_lines.push('To: austentalbot@gmail.com');
email_lines.push('Content-type: text/html;charset=iso-8859-1');
email_lines.push('MIME-Version: 1.0');
email_lines.push('Subject: Gmail API test');
email_lines.push('');
email_lines.push('body text');
email_lines.push('<b>And the bold text goes here</b>');

var email = email_lines.join('\r\n').trim();
var gmail;
var base64Message = new Buffer(email).toString('base64');
base64Message = base64Message.replace(/\+/g, '-').replace(/\//g, '_')

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
      // gmail.users.messages.send({
      //   auth: gapi.client,
      //   userId: 'austentalbot@gmail.com',
      //   resource: {
      //     raw: base64Message
      //   }
      // }, function(err, data, response) {
      //   if (err) {
      //     console.log('err', err);
      //   }
      //   console.log(data);
      // });
    }
  });
  res.status(200).sendFile(__dirname + '/public/index.html');
});

var getData = function() {
  gapi.oauth.userinfo.get().withAuthClient(gapi.client).execute(function(err, results){
    console.log('err', err);
    console.log(results);
  });
  // gapi.cal.calendarList.list().withAuthClient(gapi.client).execute(function(err, results){
  //   console.log(results);
  // });
};

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