var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

var EmailForm = module.exports = React.createClass({
  generateEmailMessage: function() {
    var recipient = document.getElementById('email-recipient').value;
    var subject = document.getElementById('email-subject').value;
    var message = document.getElementById('email-message').value;

    var email_lines = [];
    // email_lines.push('From: "Austen Talbot" <austentalbot@gmail.com>');
    email_lines.push('To: ' + recipient);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: ' + subject);
    email_lines.push('');
    email_lines.push(message);

    var email = email_lines.join('\r\n').trim();
    var gmail;
    var base64Message = new Buffer(email).toString('base64');
    base64Message = base64Message.replace(/\+/g, '-').replace(/\//g, '_');

    return base64Message;
  },
  onSendEmailClick: function() {
    var that = this;
    
    console.log('reqwesting');
    reqwest({
      url: 'http://localhost:4417/sendEmail',
      method: 'post',
      data: {
        base64Message: that.generateEmailMessage()
      },
      error: function(err) {
        console.log(err);
      },
      success: function (resp) {
        console.log(resp);
      }
    });
  },
  render: function() {
    return R('div', {
      className: 'email-form',
      children: [
        R('input', {
          id: 'email-recipient',
          className: 'email-form-recipient',
          type: 'text',
          placeholder: 'recipient'
        }),
        R('input', {
          id: 'email-subject',
          className: 'email-form-subject',
          type: 'text',
          placeholder: 'subject'
        }),
        R('input', {
          id: 'email-message',
          className: 'email-form-message',
          type: 'text',
          placeholder: 'message'
        }),
        R('button', {
          onClick: this.onSendEmailClick
        }, 'send an email')
      ]
    })
  }
});

