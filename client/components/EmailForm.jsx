var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

var EmailForm = module.exports = React.createClass({
  getInitialState: function() {
    return {
      people: 1,
      variables: 1
    };
  },
  generateEmailMessage: function() {
    var subject = document.getElementById('email-subject').value;
    var message = document.getElementById('email-message').value;
    var recipient = document.getElementById('email-variables-recipient').value;

    // loop over all key value pairs
    var key, value, re;
    for (var i = 0; i < this.state.variables; i++) {
      key = document.getElementById('email-variables-key' + i).value;
      value = document.getElementById('email-variables-value' + i).value;
      re = new RegExp('{' + key + '}', 'g');
      message = message.replace(re, value);
    }

    console.log(message);

    var email_lines = [];
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
  onAddVariableClick: function() {
    this.setState({variables: this.state.variables + 1});
  },
  render: function() {
    var keyValPairs = [];
    for (var i = 0; i < this.state.variables; i++) {
      keyValPairs.push(
        R('div', {
          className: 'email-variables-pair' + i,
          children: [
            R('input', {
              id: 'email-variables-key' + i,
              className: 'email-variables-key',
              type: 'text',
              placeholder: 'key'
            }),
            R('input', {
              id: 'email-variables-value' + i,
              className: 'email-variables-value',
              type: 'text',
              placeholder: 'value'
            })
          ]
        })
      );
    }
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
                R('div', {
                  id: 'email-variables-container',
                  className: 'email-variables-container',
                  children: keyValPairs
                }),
                R('button', {
                  id: 'email-variables-add-button',
                  className: 'email-variables-add-button',
                  onClick: this.onAddVariableClick
                }, 'Add')
              ]
            })
          ]
        })
      ]
    })
  }
});

