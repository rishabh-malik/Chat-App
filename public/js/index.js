var socket=io();
socket.on('connect',function(){
        console.log('connected to server');

});
socket.on('disconnect',function(){
        console.log('disconnected from server')
});

//listen to custom event
socket.on('newMessage',function(message){
        console.log('New Message',message);
});

socket.emit('createMessage',{
    from:'frank',
    text:'hi'
},function(data){
    console.log('Got it',data);
});

