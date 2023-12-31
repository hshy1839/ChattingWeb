const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');

const port = 8864;

app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer, {
    cors: {
      origin: ['https://admin.socket.io'],
      Credentials: true,
    },
  })
  instrument(wsServer, {
    auth: false,
  });

function publicRooms() {
    const {
        sockets: {
            adapter: { sids, rooms },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_, key)=> {
        if(sids.get(key) === undefined) {
        publicRooms.push(key);
        }
    });
    return publicRooms;
}

function countRoom(roomName) {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
    socket["nickname"] = "누군가";
    socket.onAny((event)=>{
        console.log(wsServer.sockets.adapter); //API 연결을 위한 Adapter
        console.log(`Socket Event:${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
     socket.join(roomName);
     done();
     socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
     wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
        wsServer.sockets.emit("room_change", publicRooms());
    });
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);
});