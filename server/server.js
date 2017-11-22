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
    var user = users.getUser(socket.id);
    if (user && isRealString(msg.text)) {
      io.to(user.room).emit("newMessage", generateMessage(user.name, msg.text));
    }
    callback();
  });

  socket.on("locationMessage", (msg, callback) => {
    var user = users.getUser(socket.id);
    if (user) {
      io.to(user.room).emit("locationMessage", generateLocationMessage(user.name, msg.latitude, msg.longitude));
    }
  });
});
server.listen(port, () => {
  console.log(`Starting application on port ${port}`);
});
