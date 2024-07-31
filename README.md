# Noom

Zoom Clone using Nodejs, WebRTC and Websockets

- 자동 css 적용을 위한 mvp.css 사용
- html 작성을 위한 pug 사용
- express 서버 사용
- 프로젝트 변경사항이 있을시 서버를 재시작하도록 Nodemon 사용
  - 프로젝트 내에서는 babel-node를 실행하도록 한다.
- 작성한 코드를 일반 Nodejs 코드로 컴파일 해주도록 babel 사용

- websocket을 이용한 간단한 채팅 기능 구현 (feature/websocket)
- socket.io를 이용한 채팅룸 구현(main)
  - 채팅룸 생성 및 join
  - 채팅룸 join 시 알림
  - 채팅룸 내에 닉네임과 메세지 알림
  - 채팅룸 exit 시 알림

### 파일 구조

- 서버는 src/server.js에서 핸들링
- 프론트엔드는 src/public 폴더 내에서 핸들링
