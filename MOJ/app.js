/*jshint node: true */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();

var memoTablicaRzedow = new Array(4);
for(var i=0;i<memoTablicaRzedow.length; i++){
    memoTablicaRzedow[i] = new Array(memoTablicaRzedow.length);
}

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.static(path.join(__dirname, 'public')));
});

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Serwer nasłuchuje na porcie " + app.get('port'));
});

var io = require('socket.io');
var socket = io.listen(server);

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // miszanie elem.
  while (0 !== currentIndex) {

    // wybranie pomieszanych elem.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // podmiana elem pomieszanych z obecnymi
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  for(var i=0; i< memoTablicaRzedow.length; i++){
    for(var j=0; j< memoTablicaRzedow.length; j++){
        memoTablicaRzedow[i][j] = array[i+j];
    }
  }
  console.log(memoTablicaRzedow);
  return array;
}

socket.on('connection', function (client) {
    'use strict';
    
    var joinedRoom = null;
    var username;

    var array= ["a","a","b","b","c","c","d","d","e","e","f","f","g","g","h","h"];
 shuffle(array);
 console.log(array);
    
    client.send('Witaj!');
    client.send('Podaj nazwę użytkownika: ');

    client.on('join room', function(data) {
            client.join(data);
            joinedRoom = data;
            client.emit('joined', "Dołączyłeś się do pokoju " + data);
            client.broadcast.to(joinedRoom).send('Inny gracz podłączył się do pokoju');
    }); 

    client.on('message', function (msg) {
        if (!username) {
            username = msg;
            client.send('Witaj ' + username + '!');
            client.broadcast.emit('message', 'Nowy użytkownik: ' + username);
            return;
        }
        client.broadcast.emit('message', username + ': ' + msg);
        client.send(username+ ': ' + msg );
    });

    client.on('disconnect', function() {
        client.broadcast.emit('message', 'Użytkownik ' + username + ' rozłączył się');
    });
    client.emit('news', { hello: 'world' });
    client.on('my other event', function (row,col) {
    console.log(memoTablicaRzedow[row-1][col-1]);
  });

    client.on('event', function (data) {
    console.log(data);
 });
});
