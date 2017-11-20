const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

var publicPath = path.join(__dirname, "../public");
const app = express();

var server  = http.createServer(app);
var io = socketIO(server)

const port = process.env.PORT || 3000;
console.log(port);
app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("New user connected");

  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

  socket.on("createMessage", (msg) => {
    console.log("Message received by server", msg);
  });

  socket.emit("newMessage", {from:'SahilGoel', text:'am good!!'});
});
server.listen(port, () => {
  console.log(`Starting application on port ${port}`);
});
