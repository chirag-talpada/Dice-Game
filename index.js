const express = require("express");
const app = express();

const path = require("path");
const publicPath = path.join(__dirname, "public");

const hostname = "0.0.0.0";

roomAdmins = [];

app.use(express.static(publicPath));

app.get("", (req, res) => {
  res.send(`${publicPath}/index.html`);
});

const server = app.listen(5000, hostname, () =>
  console.log(`Running in port 5000`)
);

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  //console.log("New Connection: ", socket.id);

  socket.on("join_room", ({ room, name }) => {
    let roomSize = io.sockets.adapter.rooms.get(room)?.size;

    if (roomSize) {
      if (roomSize === 1) {
        socket.join(room);

        let user = {};

        for (let index = 0; index < roomAdmins.length; index++) {
          if (roomAdmins[index].room === room) {
            user.admin = roomAdmins[index].name;
            break;
          }
        }

        user.room = room;
        user.member = name;

        socket.emit("joined", user);
        socket.in(room).emit("joined", user);
      } else {
        socket.emit("full");
      }
    } else {
      socket.join(room);
      roomAdmins.push({ room, name, id: socket.id });
      socket.emit("room_created", name);
    }
  });

  socket.on("senddice", (data) => {
    socket.to(data.room).emit("senddice", data);
  });

  socket.on("sendhold", (data) => {
    socket.to(data.room).emit("sendhold", data);
  });

  socket.on("switchUser", (data) => {
    socket.to(data.room).emit("switchUser", data);
  });

  socket.on("lost_game", (data) => {
    socket.to(data.room).emit("lost_game", data);
  });

  socket.on("disconnecting", () => {
    let roomsSize = roomAdmins.length;
    let id;

    for (let index = 0; index < roomsSize; index++) {
      if (socket.rooms.has(roomAdmins[index]?.id)) {
        id = roomAdmins[index]?.id;
        roomAdmins.splice(index, 1);
        break;
      }
    }

    socket.rooms.forEach((element) => {
      if (element !== id) {
        socket.to(element).emit("user_left");
      }
    });
  });
});
