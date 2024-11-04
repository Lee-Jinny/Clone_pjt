'use strict'; // js 엄격한 모드, 오류를 최대한 줄이기 위해 사용

const socket = io();
const nickname = document.querySelector('#nickname');
const chatList = document.querySelector('.chatting-list');
const chatInput = document.querySelector('.chatting-input');
const sendButton = document.querySelector('.send-button');
const displayContainer = document.querySelector('.display-container');

chatInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        send();
        chatInput.value = "";
    }
});

function send() {
    const param = {
        name: nickname.value,
        msg: chatInput.value,
    };
    socket.emit('chatting', param);
}

sendButton.addEventListener('click', () => {
    send();
    chatInput.value = "";
});

socket.on('chatting', (data) => {
    const { name, msg, time } = data;
    const item = new LiModel(name, msg, time);
    item.makeLi();
    displayContainer.scrollTo(0, displayContainer.scrollHeight);
});

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
