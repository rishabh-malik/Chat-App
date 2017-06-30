const path=require('path');
const http=require('http');
const express=require('express')
//for setting the app for heroku
const port=process.env.PORT || 3000;
const socketIO=require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const  {Users}=require('./utils/users');
const {isRealString} = require('./utils/validation');

//for going into the public folder where index.html is
const publicPath = path.join(__dirname,'../public');

var app=express();
var server=http.createServer(app);
var io=socketIO(server);
var users=new Users(); 

//creating middleware
app.use(express.static(publicPath));

// whenever a new user is connected
io.on('connection',(socket)=>{
    console.log('User connected');

socket.on('join',(params,callback)=>{
    if(!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room name are required');
    } 
    //socket.io rooms
    socket.join(params.room);
    // leaving the room - socket.leave('room-name')
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

// event emitted by admin to welcome the user who joins
socket.emit('newMessage',generateMessage('Admin','Welcome to the chat app'));

//alert all users except the one who joined that someone has joined the chatroom
socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));
 callback();
});

socket.on('createLocationMessage', (coords) => {
    var user=users.getUser(socket.id);
    if(user){
    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  }});

socket.on('disconnect', () => {
    var user=users.removeUser(socket.id);
    if(user){
      io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));

    }
  });

  //listening to event
  socket.on('createMessage',(message,callback)=>{
    var user=users.getUser(socket.id);
    if(user && isRealString(message.text)){
    //io.emit emits the event to every single connection
    //so that when the server receives a message it emits to every single connection
    
      io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
    }
     callback('This is from the server');
  });
});

server.listen(port,()=>{
    console.log(`Server is up at port ${port}`);
});