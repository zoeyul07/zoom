import express from "express";
import http from "http";
import WebSocket from "ws";

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
//listen
// app.listen(3000, handleListen);

//server 위에서 websocket을 만들 수 있다.
const server = http.createServer(app);
//같은 서버에서 http, websocket을 둘다 동작 시킨다.
const wss = new WebSocket.Server({ server });

//wss는 전체 서버이고, socket은 백엔드와 연결된 브라우저
//socket은 브라우저와의 contact 라인
//연결된 유저, 저장해야함
wss.on("connection", (socket) => {
  //서버에서 소켓은 연결된 브라우저
  console.log("connected to browser");
  socket.on("close", () => {
    console.log("disconnected from the browser");
  });
  socket.on("message", (message) => {
    console.log(message);
  });
  socket.send("hello!");
});

server.listen(3000, handleListen);
