const express = require('express');
const app = express();
const http = require('http');
const SocketIO = require('socket.io');

const port = 8864;

app.set('view engine', 'ejs');
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
    socket["nickname"] = "Anon";
    socket.onAny((event)=>{
        console.log(`Socket Event:${event}`);
    })
    socket.on("enter_room", (roomName, done) => {
     socket.join(roomName);
     done();
     socket.to(roomName).emit("welcome", socket.nickname);
    });
    socket.on("disconnecting", ()=>{
        socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
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