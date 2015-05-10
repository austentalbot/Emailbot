var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

var EmailForm = module.exports = React.createClass({
  generateEmailMessage: function() {
    var subject = document.getElementById('email-subject').value;
    var messageTemplate = document.getElementById('email-message').value;
    var recipient = document.getElementById('email-variables-recipient').value;
    var key = document.getElementById('email-variables-key').value;
    var value = document.getElementById('email-variables-value').value;

    var re = new RegExp('{' + key + '}', 'g');
    var fullMessage = messageTemplate.replace(re, value);

    var email_lines = [];
    email_lines.push('To: ' + recipient);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: ' + subject);
    email_lines.push('');
    email_lines.push(fullMessage);

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
      className: 'email',
      children: [
        R('div', {
          className: 'email-form',
          children: [
            R('div', {
              children: [
                R('input', {
                  id: 'email-subject',
                  className: 'email-form-subject',
                  type: 'text',
                  placeholder: 'subject'
                })
              ]
            }),
            R('div', {
              children: [
                R('textarea', {
                  id: 'email-message',
                  className: 'email-form-message',
                  placeholder: 'message'
                })
              ]
            }),
            R('button', {
              className: 'email-message-send-button button-primary',
              onClick: this.onSendEmailClick
            }, 'send an email')
          ]
        }),
        R('div', {
          className: 'email-variables',
          children: [
            R('div', {
              children: [
                R('input', {
                  id: 'email-variables-recipient',
                  className: 'email-variables-recipient',
                  type: 'text',
                  placeholder: 'recipient'
                }),
                R('input', {
                  id: 'email-variables-key',
                  className: 'email-variables-key',
                  type: 'text',
                  placeholder: 'key'
                }),
                R('input', {
                  id: 'email-variables-value',
                  className: 'email-variables-value',
                  type: 'text',
                  placeholder: 'value'
                })
              ]
            })
          ]
        })
      ]
    })
  }
});

