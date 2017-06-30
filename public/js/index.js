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
// creating new messages appear on screen using jQuery        
        var li=jQuery('<li></li>');
        li.text(`${message.from}: ${message.text}`);
        jQuery('#messages').append(li);
});

socket.on('newLocationMessage',function(message){
        var li=jQuery('<li></li>');
        var a=jQuery('<a taget="_blank">My current location</a>')
        li.text(`${message.from}: `);
        a.attr('href',message.url);
        li.append(a);
        jQuery('#messages').append(li);
        });

jQuery('#message-form').on('submit',function(e){
        e.preventDefault();
        socket.emit('createMessage',{
                from:'User',
                text:jQuery('[name=message]').val()
},function(){
    
});
        })

//getting location of User
var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  //getting the co-ordinates
  navigator.geolocation.getCurrentPosition(function(position){
   socket.emit('createLocationMessage',{
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
   });
  },function(){
          alert('Unable to fetch location');
  })
})

