var socket=io();

function scrollToBottom(){
        //Selectors
        var messages=jQuery('#messages');
        var newMessage=messages.children('li:last-child');
        //heights
        var clientHeight=messages.prop('clientHeight');
        var scrollTop=messages.prop('scrollTop');
        var scrollHeight=messages.prop('scrollHeight');
        var newMessageHeight=newMessage.innerHeight();
        var lastMessageHeight=newMessage.prev().innerHeight();

        if(clientHeight+scrollTop+newMessageHeight+lastMessageHeight >= scrollHeight){
                messages.scrollTop(scrollHeight);
        } 
}

socket.on('connect',function(){
        var params=jQuery.deparam(window.location.search);

        socket.emit('join',params,function(error){
          if(error){
               alert(error) 
               window.location.href='/'
                
          }else{
            console.log('No error');

          }
        });

});
socket.on('disconnect',function(){
        console.log('disconnected from server')
});

//listen to custom event

socket.on('updateUserList',function(users){
  var ol=jQuery('<ol></ol>');
  users.forEach(function(user){
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});
        
//         var formattedTime=moment(message.createdAt).format("h:mm a")
// // creating new messages appear on screen using jQuery        
//         var li=jQuery('<li></li>');
//         li.text(`${message.from} ${formattedTime}: ${message.text}`);
//         jQuery('#messages').append(li);




socket.on('newLocationMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('')
  });
});

//getting location of User
var locationButton=jQuery('#send-location');
locationButton.on('click',function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled','disabled').text('Sendling location..');
  //getting the co-ordinates
  navigator.geolocation.getCurrentPosition(function(position){
   locationButton.removeAttr('disabled').text('Send location');
   socket.emit('createLocationMessage',{
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
   });
  },function(){
          locationButton.removeAttr('disabled').text('Send location');
          alert('Unable to fetch location');
  })
})

