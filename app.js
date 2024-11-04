const { Socket } = require('dgram');
const express = require('express'); // 필요한 express 라이브러리 가져오기
const http = require('http');  // 3. 웹 소켓이므로 http를 통해 이뤄져야 함
const app = express(); // express 실행한 내용 담기
const path = require('path'); // url을 만들기 쉽도록 도와주는 도구
const server = http.createServer(app);
const moment = require('moment');

const socketIO = require('socket.io');

const io = socketIO(server);

// 서버가 실행되면 서버가 보여줄 폴더를 지정
// __dirname -> 프로젝트 폴더
// path.join을 사용하는 이유는 운영체제마다 / , \가 다르기 때문
app.use(express.static(path.join(__dirname, 'src')));
const PORT = process.env.PORT || 8000;

io.on('connection', (socket) => {
  socket.on('chatting', (data) => {
    const { name, msg } = data;
    io.emit('chatting', {
        name,
        msg,
        time: moment(new Date()).format("h:ss A")
    });
  });
});

server.listen(PORT, () => console.log(`server is running ${PORT}`));
