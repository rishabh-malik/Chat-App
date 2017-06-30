const path=require('path');
const http=require('http');
const express=require('express')
//for setting the app for heroku
const port=process.env.PORT || 3000;
const socketIO=require('socket.io');

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

//emittin event from server
socket.emit('newEmail',{
    from: 'rishabh@example.com',
    text:'Hey whats up',
    createdAt:123
});

socket.on('disconnect', () => {
    console.log('User was disconnected');
  });

  //listening to event
  socket.on('createEmail',(newEmail)=>{
    console.log('create Email',newEmail)
  });
});

server.listen(port,()=>{
    console.log(`Server is up at port ${port}`);
});