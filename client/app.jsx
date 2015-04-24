var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

var message = {
  to: 'austentalbot@gmail.com',
  from: 'austentalbot@gmail.com',
  subject: 'api test'
};

var base64Message = btoa(message);

React.render(R('button', {
  onClick: function() {
    console.log('send the email');
    // reqwest({
    //   url: 'https://www.googleapis.com/auth/gmail.compose',
    //   method: 'post',
    //   data: { raw: base64Message },
    //   error: function (err) {
    //     console.log(err);
    //   },
    //   success: function (resp) {
    //     console.log(resp);
    //   }
    // });
  }
}, 'send an email'), document.getElementById('react'));
