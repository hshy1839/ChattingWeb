const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector(".room_form");
const inRoom = document.getElementById("inRoom");

inRoom.hidden = true;

let roomName;

function addMessage(message) {
    const ul = inRoom.querySelector("ul");
    const li = document.createElement("li");
    const messageSpan = document.createElement("span");
    messageSpan.innerText = message;
    li.appendChild(messageSpan);

    if (message.includes('나 :')) {
        li.classList.add('your-message');
    } else {
        li.classList.add('other-message');
    }
    li.innerText = message;
    ul.appendChild(li);
}


function handleMessageSubmit() {
    event.preventDefault();
    const input = inRoom.querySelector(".msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, ()=> {
        addMessage(`나 : ${value}`);
    });
    input.value="";
}

function showRoom() {
    welcome.hidden = true;
    inRoom.hidden = false;
    const h3 = inRoom.querySelector("h3");
    h3.innerText = `방: ${roomName}`;
    const msgForm = inRoom.querySelector(".msg");
    const nameForm = inRoom.querySelector(".nickname");
    msgForm.addEventListener("submit", handleMessageSubmit);   
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleNicknameSubmit(event) {
    event.preventDefault();
    const input = inRoom.querySelector(".nickname input");
    socket.emit("nickname", input.value);
}
function handleRoomSubmit(event) {
    event.preventDefault();
    const input = roomForm.querySelector("input");
    socket.emit("enter_room", input.value , showRoom);
    //first argument = event name, second = payload, third = callback function
    roomName = input.value;
    input.value = "";
}

roomForm.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
    const h3 = inRoom.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`-----${user} 참여했습니다.-----`);
});

socket.on("bye", (left, newCount) => {
    const h3 = inRoom.querySelector("h3");
    h3.innerText = `Room ${roomName} (${newCount})`;
    addMessage(`-----${left}님이 나갔습니다.-----`);
});

socket.on("new_message", addMessage);
socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length == 0) {
        return;
    }
    rooms.forEach((room) => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    }) ;
} );