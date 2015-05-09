var React = require('react');
var R = React.createElement;
var reqwest = require('reqwest');

React.render(R('button', {
  onClick: function() {
    console.log('send the email');
  }
}, 'send an email'), document.getElementById('react'));
