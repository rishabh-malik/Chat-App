const path=require('path');
const http=require('http');
const express=require('express')
//for setting the app for heroku
const port=process.env.PORT || 3000;
const socketIO=require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');

const {isRealString} = require('./utils/validation');

//for going into the public folder where index.html is
const publicPath = path.join(__dirname,'../public');

var app=express();
var server=http.createServer(app);
var io=socketIO(server);

//creating middleware
app.use(express.static(publicPath));

// whenever a new user is connected
io.on('connection',(socket)=>{
    console.log('User connected');

socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and Room name are required');
    } 
    callback();
});

socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

// event emitted by admin to welcome the user who joins
socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

//alert all users except the one who joined that someone has joined the chatroom
socket.broadcast.emit('newMessage',generateMessage('Admin','Someone has joined'));


  //listening to event
  socket.on('createMessage',(message,callback)=>{
    console.log('create Message',message);
    //io.emit emits the event to every single connection
    //so that when the server receives a message it emits to every single connection
    
    io.emit('newMessage',generateMessage(message.from,message.text));
    callback('This is from the server');
  });
});

server.listen(port,()=>{
    console.log(`Server is up at port ${port}`);
});