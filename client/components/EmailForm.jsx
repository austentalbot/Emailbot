var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

var EmailForm = module.exports = React.createClass({
  getInitialState: function() {
    return {
      recipients: 1,
      variables: 1
    };
  },
  sendEmailMessage: function(recipientNum) {
    var subject = document.getElementById('email-subject').value;
    var message = document.getElementById('email-message').value;
    var recipient = document.getElementById('email-variables-recipient' + recipientNum).value;

    // loop over all key value pairs
    var key, value, re;
    for (var i = 0; i < this.state.variables; i++) {
      key = document.getElementById('email-variables-key' + i).value;
      value = document.getElementById('email-variables-value' + i + 'recipient' + recipientNum).value;
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
    for (var i = 0; i < this.state.recipients; i++) {
      console.log('reqwesting') + i;
      reqwest({
        url: 'http://localhost:4417/sendEmail',
        method: 'post',
        data: {
          base64Message: that.sendEmailMessage(i)
        },
        error: function(err) {
          console.log(err);
        },
        success: function (resp) {
          console.log(resp);
        }
      });
    }
  },
  onAddVariableClick: function() {
    this.setState({variables: this.state.variables + 1});
  },
  onAddRecipientClick: function() {
    this.setState({recipients: this.state.recipients + 1});
  },
  onClearClick: function() {
    this.setState({recipients: 1, variables: 1});
    document.getElementById('email-subject').value = '';
    document.getElementById('email-message').value = '';
    document.getElementById('email-variables-key0').value = '';
    document.getElementById('email-variables-value0recipient0').value = '';
    document.getElementById('email-variables-recipient0').value = '';
  },
  render: function() {
    var that = this;
    var keysAndAllVals = function(pairNum) {
      var keysAndVals = [
        R('input', {
          id: 'email-variables-key' + pairNum,
          className: 'email-variables-key',
          type: 'text',
          placeholder: 'key'
        })
      ];
      for (var j = 0; j < that.state.recipients; j++) {
        keysAndVals.push(
          R('input', {
            id: 'email-variables-value' + pairNum + 'recipient' + j,
            className: 'email-variables-value',
            type: 'text',
            placeholder: 'value'
          })
        );
      }
      return keysAndVals;
    };
    var keyValSets = [];
    for (var i = 0; i < this.state.variables; i++) {
      keyValSets.push(
        R('div', {
          className: 'email-variables-pair' + i,
          children: keysAndAllVals(i)
        })
      );
    }
    var recipientInputs = [];
    for (var i = 0; i < this.state.recipients; i++) {
      recipientInputs.push(
        R('input', {
          id: 'email-variables-recipient' + i,
          className: 'email-variables-recipient' + i,
          type: 'text',
          placeholder: 'recipient'
        })
      );
    }
    return R('div', {
      className: 'email',
      children: [
        R('div', {
          className: 'email-message',
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
                }, 'send emails')
              ]
            }),
            R('div', {
              className: 'email-directions',
              children: [
                R('div', {className: 'email-directions-header'}, 'Directions:'),
                R('div', {}, 'Write a message with variables wrapped in handlebars (e.g. Hello {name}, how have you been?). Add more recipients and variables, and specify values for each combination.')
              ]
            })
          ]
        }),
        R('div', {
          className: 'email-variables',
          children: [
            R('div', {
              children: [
                R('button', {
                  id: 'email-variables-add-var-button',
                  className: 'email-variables-add-var-button',
                  onClick: this.onAddVariableClick
                }, 'Add variable'),
                R('button', {
                  id: 'email-variables-add-recipient-button',
                  className: 'email-variables-add-recipient-button',
                  onClick: this.onAddRecipientClick
                }, 'Add recipient'),
                R('button', {
                  id: 'email-variables-clear-button',
                  className: 'email-variables-clear-button',
                  onClick: this.onClearClick
                }, 'Clear'),
                R('div', {
                  id: 'email-recipient-container',
                  className: 'email-recipient-container',
                  children: recipientInputs
                }),
                R('div', {
                  id: 'email-variables-container',
                  className: 'email-variables-container',
                  children: keyValSets
                })
              ]
            })
          ]
        })
      ]
    })
  }
});

