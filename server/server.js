const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const {generateMessage} = require("./utils/messages");

var publicPath = path.join(__dirname, "../public");
const app = express();

var server  = http.createServer(app);
var io = socketIO(server)

const port = process.env.PORT || 3000;
console.log(port);
app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("New user connected");
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });

  socket.on("createMessage", (msg, callback) => {
    console.log("Message received by server", msg);
    io.emit("newMessage", generateMessage(msg.from, msg.text));
    callback('Acknowledged!');
  });
});
server.listen(port, () => {
  console.log(`Starting application on port ${port}`);
});
