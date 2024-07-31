//io는 backend의 socket.io와 연결해주는 function
//socket.io를 실행하는 서버를 자동으로 찾음
const socket = io();

const welcome = document.getElementById("welcome");
const room = document.getElementById("room");
const form = welcome.querySelector("form");

room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("mgs input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  //querySelector는 첫번째걸 가져옴
  const input = room.querySelector("name input");
  socket.emit("nickname", input.value);
}
function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `room ${roomName}`;

  const messageForm = room.querySelector("#mgs");
  const nameForm = room.querySelector("#name");
  messageForm.addEventListener("submit", handleMessageSubmit);
  nameeForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const input = form.querySelector("input");
  //callback은 서버에서 호출되지만 내부 로직은 프론트에서 실행된다.
  //callback은 마지막 argument 여야함
  socket.emit("enter_room", { payload: input.value }, showRoom);
  roomName = input.value;
  input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);
//socket.io에서 모든 유저는 socket과 private 룸이 있다.

socket.on("welcome", (user) => {
  addMessage(`${user} arrived`);
});

socket.on("bye", (left) => {
  addMessage(`${left} left`);
});

socket.on("new_message", addMessage);
