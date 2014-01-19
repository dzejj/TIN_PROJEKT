/*jshint node: true, browser: true, jquery: true */
/*global io: false */
$(document).ready(function () {
    'use strict';
    var socket = io.connect('http://localhost:3000'),

    entry_el = $('#entry');

    console.log('Próbuję połączyć się z serwerem…');

    socket.on('connect', function () {
        console.log('Połączony!');
        socket.emit('join room');
    });

    socket.on('joined', function (msg) {
    var data = msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        $('#log ul').append('<li>' + data + '</li>');
        entry_el.focus();
    });

    socket.on('message', function (msg) {
        var data = msg.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        $('#log ul').append('<li>' + data + '</li>');
        entry_el.focus();
    });

    entry_el.keypress(function (event) {
        if (event.keyCode !== 13) {
            return;
        }
        var msg = entry_el.attr('value');
        if (msg) {
            socket.send(msg);
            entry_el.attr('value', '');
        }
    });

  socket.on('news', function (data) {
  console.log(data);

  //socket.emit('my other event', { my: 'data' });
   $('div[id^=polet]').css('cursor','pointer');
   $('div[id^=polet]').click(function() {  
    alert($(this).attr('id'));
    var s= ($(this).attr('id'));
   // var col = $(this).parent().children().index($(this));
    //  var row = $(this).parent().parent().children().index($(this).parent());
    //alert('Row: ' + row + ', Column: ' + col);
 
    var $td = $(this).closest('td');
    var col = $td.index();
    var $tr = $(this).closest('tr');
    var row = $tr.index();
    socket.emit('event',  s.substring(5) );
    socket.emit('my other event',  row, col );
    alert('Row: ' + row + ', Column: ' + col);
});
});

});
$(function() {
    function iterateAlphabet() {
       for(var i=0; i<str.length; i++)
       {
          return(nextChar);
       }
    }
    
    var buildMap=function (id){
        var tmp = "#"+id;
        var html = '<table id="tabela">';
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (var x=0; x<=4; x++){
            html += '<tr>';
            for (var y=0; y<=4; y++) {
                if (x==0 && y==0) {
                    html += '<td></td>';
                }
                else if(x==0 && y!=0) {
                    var char = alphabet.charAt(y-1);
                    html += '<td>'+char+'</td>';
                }
                else if(x!=0 && y==0) {
                    html += '<td>'+x+'</td>';
                }
                else {
                    var char = alphabet.charAt(y-1);
                    html += '<td><div id=polet'+char+x+'>'+x+char+'</div></td>';
                }
            }
            html += '</tr>';
        }
        html += '</table>';
        $(tmp).append(html);
    }
    buildMap("console");
    $('console').click(function(){alert('A1');});
});

  //  $(function() {
 //       $('div[id^=polet]').css('cursor','pointer'); // wszystkie divy ktorych id zaczyna sie od "polep"
  //      $('div[id^=polet]').click(function() {  
   //         alert($(this).attr('id'));
             //socket.emit('pos', $(this).attr('id'));
           // socket.emit('pos', {hello: 'world'});
           // socket.emit('my other event', { my: 'data' });
      //  });
  //  });

