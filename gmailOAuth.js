var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var credentials = require('./credentials.js');

var oauth2Client = new OAuth2(
  credentials.gmailCliendId,
  credentials.gmailClientSecret,
  'http://localhost:4417/oauth2callback'
);

var scopes = [
  'https://www.googleapis.com/auth/gmail.modify'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
});

module.exports.url = url;
