const socket = io();

const welcome = document.getElementById("welcome");
const roomForm = welcome.querySelector(".room_form");
const inRoom = document.getElementById("inRoom");

inRoom.hidden = true;

let roomName;

function addMessage(message) {
    const ul = inRoom.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit() {
    event.preventDefault();
    const input = inRoom.querySelector(".msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, ()=> {
        addMessage(`YOU : ${value}`);
    });
    input.value="";
}

function showRoom() {
    welcome.hidden = true;
    inRoom.hidden = false;
    const h3 = inRoom.querySelector("h3");
    h3.innerText = `Room ${roomName}`;
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

socket.on("welcome", (user) => {
    addMessage(`${user} joined`);
});

socket.on("bye", (left) => {
    addMessage(`${left} left`);
});

socket.on("new_message", addMessage);