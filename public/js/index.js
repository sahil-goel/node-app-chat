var socket = io();

socket.on("connect", () => {
  console.log("New Client Connected");

});

socket.on("disconnect", () => {
  console.log("Client Disconnected");
});

socket.on("newMessage", (msg) => {
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text(`${msg.from} ${formattedTime} - ${msg.text}`);

  jQuery('#messages').append(li);
});

socket.on("locationMessage", (msg) => {
  console.log("New Location Mesage received", msg);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');
  var formattedTime = moment(msg.createdAt).format('h:mm a');
  li.text(`${msg.from}  ${formattedTime} :`);
  a.attr("href", msg.url);
  li.append(a);
  jQuery('#locationMessages').append(li);
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
