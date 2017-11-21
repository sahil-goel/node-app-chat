var socket = io();

socket.on("connect", () => {
  console.log("New Client Connected");

});

socket.on("disconnect", () => {
  console.log("Client Disconnected");
});

socket.on("newMessage", (msg) => {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var template = jQuery("#message-template").html();
  var renderedMessage = Mustache.render(template, {
    from:msg.from,
    formattedTime : formattedTime,
    text:msg.text
  });
  jQuery('#messages').append(renderedMessage);
});

socket.on("locationMessage", (msg) => {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var template = jQuery("#location-message-template").html();
  var renderedMessage = Mustache.render(template, {
    from:msg.from,
    formattedTime : formattedTime,
    url:msg.url
  });
  jQuery('#locationMessages').append(renderedMessage);
});

socket.emit("createMessage", {
  from:'Sahil',
  text: 'Hi'
}, function(data) {
  console.log("Got it", data);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageField = jQuery('#messageField');
  socket.emit("createMessage", {
    from:'SomeUser',
    text: messageField.val()
  }, function() {
    messageField.val('');
  });

});

var sendLocationButton = jQuery("#sendLocationButton");
sendLocationButton.on("click", function() {

  if (!navigator.geolocation) {
    alert("Geolocation service is not supported by your browser");
    return;
  }
  sendLocationButton.attr("disabled", "disabled").text('Sending location...');
  navigator.geolocation.getCurrentPosition(function(position) {
    sendLocationButton.removeAttr("disabled").text('Send location');
    socket.emit("locationMessage", {
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    }, function(data) {
      console.log("Server Acknowledged location message", data);
    });
  }, function() {
    alert("Unable to fetch location");
    sendLocationButton.removeAttr("disabled").text('Send location');
  });
});
