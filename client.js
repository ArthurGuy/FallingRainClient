var Pusher = require('pusher-client');
var SerialPort = require("serialport");

var pusher = new Pusher(process.env.PUSHER_KEY, {
        secret: process.env.PUSHER_SECRET
});

//var io = require('socket.io');
//var socket = io('https://arthurguy.co.uk:3000');

var port = new SerialPort("/dev/ttyAMA0", {
  baudRate: 115200
});


port.on('open', function() {
    console.log('Serial port opened');
    port.write('*s:1,1*', function () {

    });
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
});

var channel = pusher.subscribe('led-display');
channel.bind('new-data',
  function(data) {
    port.write(data.message, function(err) {
      if (err) {
        return console.log('Error on write: ', err.message);
      }
      console.log('message written');
    });
    console.log(data.message);
  }
);