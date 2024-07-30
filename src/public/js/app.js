//브라우저에서 소켓은 서버로의 연결
const socket = new WebSocket(`http://${window.location.host}`);

socket.addEventListener("open", () => {
  console.log("connected to server");
});

socket.addEventListener("message", (message) => {
  console.log("New message", message.data);
});

socket.addEventListener("close", () => {
  console.log("disconnected from server");
});

setTimeout(() => {
  socket.send("hello from th browser!");
}, 10000);
