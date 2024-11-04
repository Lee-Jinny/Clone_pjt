# Vanilia JS 채팅 앱

#### 라이브러리: Nodejs, Socket.io, Vanilla JS, Flexbox, ~~ngrock~~

### 1. pakage.json 생성 명령어
```
npm init -y
```
: app의 설정이나 기록 등 중요한 정보를 담고 있음

```
npm install express socket.io moment
```
: 설치후 node_modules라는 폴더가 생성됨


### 2. node js 서버 만들기
#### 2.1 newfile app.js 생성
: 서버를 구동해주는 js 파일
- require를 사용하면 자동적으로 node modules를 본다. 이름만 적어줘도 경로 없이 가져올 수 있게 된다.

#### 2.2 src 폴더
: html, css 등을 관리하기 쉽도록 생성하는 폴더

```js
// app.js
app.use(express.static(path.join(__dirname, 'src')));
const PORT = process.env.PORT || 8000;
```

- 서버가 실행되면 서버가 보여줄 폴더를 지정
- __dirname -> 프로젝트 폴더
- path.join을 사용하는 이유는 운영체제마다 / , \가 다르기 때문

- PORT : 서버를 실행하기 위한 포트
  - 프로세스 환경에 지정이 되어있다면 그걸 사용하고 아니면 8000
  
```js
server.listen(PORT, () => console.log(`server is running ${PORT}`));
```
- 서버 실행 명령어


### 3. Socket.io 
```js
// 3. 웹 소켓이므로 http를 통해 이뤄져야 함
const http = require('http'); 
const server = http.createServer(app); 

```
- http : node js의 기본 모듈
- 서버변수 생성후 express로 구현한 앱을 담아서 express가 http로 실행될 수 있도록 함

```js
const socketIO = require('socket.io');

const io = socketIO(server);
```
- 변수 선언뒤 설치한 라이브 러리 불러오기
- socketIO에서 서버를 담아간 내용을 다시 한번 변수에 담아준다
- 그리고 io를 통해 생성되는 데이터(메세지 등)을 제어를 할 것이다.
```js
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
```
- io의 on이라는 함수, connection 메서드 
  - 커넥션이 이뤄지면 커넥션에 대한 객체(연결에 대한 모든 것을 소켓에 담을 것)
  - 그리고 이 소켓에 담긴 정보에 접근해서 내용을 다루게 된다.

```html
<!-- index.html -->
<script src="/socket.io/socket.io.js"></script>
<script src="js/chat.js"></script>
```
- 클라이언트 측에서 모듈 불러올 때 사용

### 4. chat.js
src 폴더 안에 new 폴더 js -> chat.js 따로 관리
```js
// chat.js

const socket = io();
```
- socket에 클라이언트 socket io가 담기게 된다.

```js
// chat.js
socket.emit("chatting", "from front")


// app.js
io.on('connection', (socket) => {
  socket.on('chatting', (data) => {
    console.log(data) // 바로 출력해보기
    io.emit("chatting", `그래 반가워 ${data}`)
  })
})


// chat.js
socket.on("chatting", (data) => {
  console.log(data)
})


```
- 채널 이름과 내용 -> 보냄
- 서버에서 받아주려면 채팅아이디와 실행할 함수 적어주면 된다
- 클라이언트에서 보낸 내용을 data라는 파라미터를 받음
- 클라이언트에서 다시 내용 돌려 보내기
- 서버에서 돌려 받은 내용 출력

### 채팅 chat.js 
```js
function LiModel(name, msg, time) {
    this.name = name; // 초기화, 할당
    this.msg = msg;
    this.time = time;

    // 여기서 값들에 접근해서 사용하기 위해
    this.makeLi = () => {
        const li = document.createElement('li');
        li.classList.add(nickname.value === this.name ? "sent" : "received");
        const dom = `<span class="profile">
                        <span class="user">${this.name}</span>
                        <img class="img" src="https://picsum.photos/50/50/" alt="any" />
                    </span>
                    <span class="message">${this.msg}</span>
                    <span class="time">${this.time}</span>`;
        li.innerHTML = dom;
        chatList.appendChild(li);
    };
}

```
- 닉네임 벨류에 따라 클래스 달라짐


#### > 위 내용을 서버에서 내용을 받을 때 마다 계속 적용해야함
```js
socket.on('chatting', (data) => {
    const { name, msg, time } = data;
    const item = new LiModel(name, msg, time); 
    item.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});
```
- new 키워드를 통해 Li모델을 인스턴스화 


### 채팅 app.js
```js
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
```
- 넘겨 받은 데이터를 destructuring을 통해 쪼갬
-  보내는 부분을 object형태로
-  시간은 기본 자바스크립트 기능으로 현재 시간을 가져오고 moment로 formatting