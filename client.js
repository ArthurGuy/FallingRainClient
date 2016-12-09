var SerialPort = require("serialport");
var isOnline   = require('is-online');
var socket     = require('socket.io/node_modules/socket.io-client')('http://display.arthurguy.co.uk:3000');

var port = new SerialPort("/dev/ttyAMA0", {
  baudRate: 115200
});

// Are we connected to the internet?
var systemOnline = false;

// Is the teensy connected?
var displayConnected = false;

// Monitor the internet connection to see if we are online
function checkOnlineStatus() { 
  isOnline(function(err, online) {
    systemOnline = online;
    setTimeout(checkOnlineStatus, 1000); 
  });	
}

function randomMovement() {
  setTimeout(randomMovement, 100); 
  
  if (!displayConnected) {
    return;
  }
  
  port.write('*S:' + getRandomIntInclusive(0, 7) + ',0*');
}


function init() {
  checkOnlineStatus();
  
  randomMovement();
  
  // Connect to the serial port
  port.on('open', function() {
      console.log('Serial port opened');
      //Display an animation when the system boots
      port.write('*S:0,0*');
      port.write('*S:1,0*');
      port.write('*S:2,0*');
      port.write('*S:3,0*');
      port.write('*S:4,0*');
      port.write('*S:5,0*');
      port.write('*S:6,0*');
      port.write('*S:7,0*');

      displayConnected = true;
  });

  // open errors will be emitted as an error event
  port.on('error', function(err) {
    console.log('Error: ', err.message);
    displayConnected = false;
  });
  
  // Listen for websocket messages
  
  socket.on('connect', function(){
    console.log('A socket connection was made');
    socket.emit('display-connected', {}); 
  });
  
  socket.on('new-data', function(data){
      var msg = '*S:' + data.x + ',' + data.y + '*';
      port.write(msg, function(err) {
          if (err) {
              return console.log('Error on write: ', err.message);
          }
          //console.log('new pixel update sent');
      });
      console.log(data);
  });
  
}

init();


function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
