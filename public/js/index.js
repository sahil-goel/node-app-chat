var socket = io();

socket.on("connect", () => {
  console.log("New Client Connected");

  socket.emit("createMessage", {
    from : 'Sahil',
    text : 'Hey, how r u!'
  });
});

socket.on("disconnect", () => {
  console.log("Client Disconnected");
});

socket.on("newMessage", (msg) => {
  console.log("New Message received", msg);
});
