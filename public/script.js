const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const usersList = document.getElementById("usersList");
const chatList = document.getElementById("chat-list");

socket.emit("login", document.getElementById("first-person").innerText);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (input.value.trim()) {
    socket.emit("chat", {
      from: document.getElementById("first-person").innerText,
      message: input.value.trim(),
    });
    input.value = "";
  }
});


socket.on("userList", (users) => {
  let ul = ``;
  for (let user of users) {
    if (document.getElementById("first-person").innerText != user) {
      const li = `<li class="clearfix active">
                            <div class="about">
                                <div class="name">${user}</div>
                            </div>
                        </li>`;
      ul += li;
    }
  }
  usersList.innerHTML = ul;
});

socket.on("chat", (msg) => {
  let li;
  if (msg.from == document.getElementById("first-person").innerText) {
    li = `<li class="clearfix">
                            <div class="message other-message float-right"> ${msg.message} </div>
                        </li>`;
  } else {
    li = `<li class="clearfix">
                <span>${msg.from}</span>
                            <div class="message my-message">${msg.message}</div>                                    
                        </li>`;
  }
  chatList.innerHTML += li;
});
