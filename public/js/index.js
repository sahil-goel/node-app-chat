var socket = io();

socket.on("connect", () => {
  console.log("New Client Connected");

});

socket.on("disconnect", () => {
  console.log("Client Disconnected");
});

socket.on("newMessage", (msg) => {
  console.log("New Message received", msg);
  var li = jQuery('<li></li>');
  li.text(`${msg.from} - ${msg.text}`);

  jQuery('#messages').append(li);
});

socket.on("locationMessage", (msg) => {
  console.log("New Location Mesage received", msg);
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');
  li.text(`${msg.from} : `);
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
  socket.emit("createMessage", {
    from:'SomeUser',
    text: jQuery('#messageField').val()
  }, function(data) {
    console.log("Got it", data);
  });

});

var sendLocationButton = jQuery("#sendLocationButton");
sendLocationButton.on("click", function() {
  if (!navigator.geolocation) {
    alert("Geolocation service is not supported by your browser");
    return;
  }
  navigator.geolocation.getCurrentPosition(function(position) {
    socket.emit("locationMessage", {
      latitude : position.coords.latitude,
      longitude : position.coords.longitude
    }, function(data) {
      console.log("Server Acknowledged location message", data);
    });
  }, function() {
    alert("Unable to fetch location");
  });
});
