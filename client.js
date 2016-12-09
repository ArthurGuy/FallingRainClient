var SerialPort = require("serialport");

var socket = require('socket.io/node_modules/socket.io-client')('http://display.arthurguy.co.uk:3000');

var port = new SerialPort("/dev/ttyAMA0", {
  baudRate: 115200
});


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
});

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
});

socket.on('connect', function () {
    console.log('A socket connection was made');
    socket.on('new-data', function(msg){
        port.write(msg, function(err) {
            if (err) {
                return console.log('Error on write: ', err.message);
            }
            console.log('new pixel update sent');
        });
        console.log(msg);
    });
});
