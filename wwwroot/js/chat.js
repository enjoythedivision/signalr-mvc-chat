"use strict";

const sendButton = document.getElementById("sendButton");
const userInput = document.getElementById("userInput");
const messageInput = document.getElementById("messageInput");
const messagesList = document.getElementById("messagesList");

if (!window.signalR) {
    throw new Error("SignalR client library failed to load.");
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .build();

if (sendButton) {
    sendButton.disabled = true;
}

connection.on("ReceiveMessage", function (user, message) {
    const li = document.createElement("li");
    if (messagesList) {
        messagesList.appendChild(li);
    }
    li.textContent = `${user} says ${message}`;
});

connection.start()
    .then(function () {
        if (sendButton) {
            sendButton.disabled = false;
        }
    })
    .catch(function (err) {
        console.error(err.toString());
    });

if (sendButton) {
    sendButton.addEventListener("click", function (event) {
        const user = userInput ? userInput.value : "";
        const message = messageInput ? messageInput.value : "";

        connection.invoke("SendMessage", user, message)
            .catch(function (err) {
                console.error(err.toString());
            });

        event.preventDefault();
    });
}