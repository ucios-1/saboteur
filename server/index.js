const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }
});

const saboteur1List = [];
const saboteur2List = []; //create list of games to render

saboteur1List.push({
    gameid: "1", 
    gameName: "new test game", 
    playerNum: "12/15", 
    access: "free"
});
saboteur1List.push({
    gameid: "2", 
    gameName: "second test game", 
    playerNum: "12/15", 
    access: "free"
});


io.on("connection", socket => {
    console.log("new user connected"); // remove it later. Check if connected

    socket.once("getGamesList", (arg) => {
        if (arg === "1") {
            socket.emit("sendGamesList", saboteur1List);
        } else {
            socket.emit("sendGamesList", saboteur2List);
        }
    });
});

http.listen(4000, () => { console.log("listening on port 4000") });