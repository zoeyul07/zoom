import express from "express";

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
app.listen(3000, handleListen);
