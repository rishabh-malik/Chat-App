var socket=io();
socket.on('connect',function(){
        console.log('connected to server');

//emitting event from client side
socket.emit('createMessage',{
    from:'me@example.com',
    text:'hie'
});
});
socket.on('disconnect',function(){
        console.log('disconnected from server')
});

//listen to custom event
socket.on('newMessage',function(message){
        console.log('New Message',message);
});

