var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

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

React.render(R('button', {
  onClick: function() {
    console.log('reqwesting');
    reqwest({
      url: 'http://localhost:4417/sendEmail',
      method: 'post',
      data: {
        base64Message: base64Message
      },
      error: function(err) {
        console.log(err);
      },
      success: function (resp) {
        console.log(resp);
      }
    });
  }
}, 'send an email'), document.getElementById('react'));
