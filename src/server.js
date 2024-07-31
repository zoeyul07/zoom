import express from "express";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

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
const wsServer = new Server(httpServer, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(wsServer, { auth: false });

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = wsServer;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    console.log("key", key);
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRooms(roomName) {
  return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}

//현재는 데이터베이스에 저장하지 않고 메모리 adapter를 사용하고 있다.
//서버를 종료하고 다시 시작할 때 모든 Room, message, socket은 없어진다.
//그래서 백엔드 데이터베이스를 갖고있으려고 한다.

//모든 클라이언트 커넥션을 열어두려고 한다., 실시간으로 브라우저 메모리에 있어야함
//브라우저는 서버로 한개의 connection을 열지만 많은 브라우저들은 하나의 서버에 connection들을 열게 된다.
//서베에 많은 커넥션이 들어오고, 그 커넥션들을 메모리에 저장하게된다.
/*현재는 서버 메모리 adapter를 사용하고 있고, 그렇다면 우리가 만든 3개의 서버는 같은 connection이라도 같은 memory pool을 공유하지 않는다. 
그렇게 되면 서버가 분리되어있어 다른 서버 클라이언트에는 메세지를 보낼 수 없게된다.*/

wsServer.on("connection", (socket) => {
  socket["nickname"] = "Anon";
  //all event in socket
  socket.onAny((event) => {
    //roomId socketId 에서 찾을 수 있다면 private room 아니라면 Public room
    console.log(wsServer.sockets.adapter);
    console.log(`SocketEvent:  ${event}`);
  });

  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    //send message to one socket
    socket.to(roomName).emit("welcome", socket.nickname, countRooms(roomName));
    //send message to all socket
    wsServer.sockets.emit("room_change", publicRooms());
  });

  //socket이 방을 떠나기 직전에 발생한다. 아직 떠난게 아님
  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname, countRooms(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    wsServer.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handleListen);
