const path = require("path");
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const {isRealString} = require("./utils/validation");
const {generateMessage, generateLocationMessage} = require("./utils/messages");
const {Users} = require("./utils/users");

var publicPath = path.join(__dirname, "../public");
const app = express();
var users = new Users();
var server  = http.createServer(app);
var io = socketIO(server)

const port = process.env.PORT || 3000;
console.log(port);
app.use(express.static(publicPath));

io.on("connection", (socket) => {
  console.log("New user connected");
  socket.on("disconnect", () => {
    console.log("User Disconnected");
    var removedUser = users.removeUser(socket.id);
    if (removedUser) {
      io.to(removedUser.room).emit('updateUsersList', users.getUserList(removedUser.room));
      io.to(removedUser.room).emit('newMessage', generateMessage('Admin', `User ${removedUser.name} has left`));
    }
  });

  socket.on("join", (msg, callback) => {
    if (!isRealString(msg.name) || !isRealString(msg.room)) {
      return callback('Room and name both must be provided');
    }
    socket.join(msg.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, msg.name, msg.room);

    socket.emit('updateUsersList', users.getUserList(msg.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(msg.room).emit('newMessage', generateMessage('Admin', `User ${msg.name} has joined`));

    callback();
  });

  socket.on("createMessage", (msg, callback) => {
    console.log("Message received by server", msg);
    io.emit("newMessage", generateMessage(msg.from, msg.text));
    callback();
  });

  socket.on("locationMessage", (msg, callback) => {
    console.log("Message received by server", msg);
    io.emit("locationMessage", generateLocationMessage('Admin', msg.latitude, msg.longitude));
    callback(`Location longitude ${msg.longitude}, latitude ${msg.latitude}`);
  });
});
server.listen(port, () => {
  console.log(`Starting application on port ${port}`);
});
