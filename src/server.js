import express from "express";
import http from "http";
import SocketIO from "socket.io";

const app = express();

//setView
//pug 로 view engine 설정
app.set("view engine", "pug");
//express 에 template 이 어디있을건지 지정
app.set("views", __dirname + "/views");
//public url을 생성해서 유저에게 파일 공유
app.use("/public", express.static(__dirname + "/public"));

//render view
//home.pug 를 render 해주는 Route handler 생성
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));
const handleListen = () => console.log(`Listening on http://localhost:3000`);

const httpServer = http.createServer(app);

//socket.io가 url을 줌 (http://localhost:3000/socket.io/socket.io.js)
const wsServer = SocketIO(httpServer);

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  //all event in socket
  socket.onAny((event) => {
    console.log(`SocketEvent:  ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
    socket.on("disconnecting", () => {
      socket.rooms.forEach((room) =>
        socket.to(room).emit("bye", socket.nickname)
      );
    });

    socket.on("new_message", (msg, room, done) => {
      socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
      done();
    });

    socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
  });
});

httpServer.listen(3000, handleListen);
