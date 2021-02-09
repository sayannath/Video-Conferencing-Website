const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();

const cors = require("cors");
const server = require("https").Server(app);
const io = require("socket.io")(server);
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use('/peerjs', peerServer);
app.use(cors());



app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on('message', message =>{
      io.to(roomId).emit('createMessage', message)
    })
  });
});

server.listen(443);
