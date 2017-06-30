var socket=io();
socket.on('connect',function(){
        console.log('connected to server');

//emitting event from client side
socket.emit('createEmail',{
    to:'me@example.com',
    text:'hie'
});
});
socket.on('disconnect',function(){
        console.log('disconnected from server')
});

//listen to custom event
socket.on('newEmail',function(email){
        console.log('New Email',email);
});

