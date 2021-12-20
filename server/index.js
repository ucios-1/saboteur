const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
    cors: {
        origin: "*"
    }, 
    pingTimeout: 60000
});
const e = require("cors");
const _ = require("lodash");
const PORT = process.env.PORT || 4000;

var saboteur1List = [];
var saboteur2List = []; //create list of games to render
var waist = [
                "tunnel-collapse", "tunnel-collapse", "tunnel-collapse", 
                "map-card", "map-card", "map-card", "map-card", "map-card", "map-card",
                "screw-up-latern", "screw-up-latern", "screw-up-latern",
                "screw-up-pickaxe", "screw-up-pickaxe", "screw-up-pickaxe",
                "screw-up-trolley", "screw-up-trolley", "screw-up-trolley",
                "fix-latern", "fix-latern", 
                "fix-pickaxe", "fix-pickaxe", 
                "fix-trolley", "fix-trolley", 
                "fix-pickaxe-and-trolley", "fix-pickaxe-and-latern", "fix-latern-and-trolley",
                "tunnel-crossroads-x", "tunnel-crossroads-x", "tunnel-crossroads-x", "tunnel-crossroads-x", "tunnel-crossroads-x",
                "tunnel-crossroads-t-hor", "tunnel-crossroads-t-hor", "tunnel-crossroads-t-hor", "tunnel-crossroads-t-hor", "tunnel-crossroads-t-hor",
                "tunnel-crossroads-t-ver", "tunnel-crossroads-t-ver", "tunnel-crossroads-t-ver", "tunnel-crossroads-t-ver", "tunnel-crossroads-t-ver",
                "tunnel-straightforward", "tunnel-straightforward", "tunnel-straightforward", "tunnel-straightforward",
                "tunnel-across", "tunnel-across", "tunnel-across",
                "tunnel-turn-right", "tunnel-turn-right", "tunnel-turn-right", "tunnel-turn-right",
                "tunnel-turn-left", "tunnel-turn-left", "tunnel-turn-left", "tunnel-turn-left", "tunnel-turn-left",
                "deadend-up-and-down", "deadend-left-and-right", "deadend-crossroads-x", "deadend-crossroads-t-ver", "deadend-crossroads-t-hor",
                "deadend-down", "deadend-down-and-left", "deadend-down-and-right", "deadend-left"
            ];

function addPlayerToGame(obj, playerID) {
    obj.players = [ { id: playerID, name: obj.playerName } ]; // add socket.id and player name to the list of objects to the particuler game
    return obj;
}

io.on("connection", socket => {
    console.log(socket.id); // remove it later. Check if connected, and log user id (id is generated by socket)

    socket.on("getGamesList", arg => {
        if (arg === "1") {
            socket.emit("sendGamesList1", saboteur1List);
        } else {
            socket.emit("sendGamesList2", saboteur2List);
        }
    });

    socket.on("getGameData", (v, arg, callback) => {
        if (v === "1") {
            const game = _.find(saboteur1List, { gameID: arg });
            if (game) {
                socket.join(game.gameID); // join game room (room name = gameID) if found
                callback(game); //send back data about the game
            } else {
                callback("game not found");
            }
        } else if (v === "2") {
            const game = _.find(saboteur2List, { gameID: arg });
            if (game) {
                socket.join(game.gameID); // join game room if found
                callback(game); //send back data about the game
            } else {
                callback("game not found"); // inform if game not found
            }
        } else {
            callback("version is undefined"); // inform if version undefined, error while emiting message to the server
        }
    });

    socket.on("addGame", (v, arg, callback) => {
        arg = addPlayerToGame(arg, socket.id);
        arg.waist = waist;

        if (v === "1") {
            saboteur1List.push(_.omit(arg, "playerName"));
            io.emit("sendGamesList1", saboteur1List);
            console.log(saboteur1List); // remove it later
        } else if (v === "2") {
            saboteur2List.push(_.omit(arg, "playerName"));
            io.emit("sendGamesList2", saboteur2List);
        } else {
            callback({status: "version is undefined"});
        }

        callback({status: "created"}); // send a callback to the socket with status
    });

    // allow user connect to chosen game
    socket.on("gameConnect", (v, id, playerName, password, callback) => {
        if (v === "1") {
            if (password !== "") {
                // logic for password
            } else {
                saboteur1List.map(el => {
                    if (el.gameID === id) {
                        socket.join(el.gameID); // join the game room
                        el.players.push({ id: socket.id, name: playerName }); // add socket to the list of the game players
                        callback({status: "welcome"}); // allow user redirect to the game page
                        socket.to(el.gameID).emit("joiners update", el, playerName); // send to all sockets in room updated game data 

                        // if game is full (players.lenght === maxPlayersNum) start the game
                        if(el.players.length == el.maxPlayersNum) {
                            el.players.map(player => {
                                const playerCards = [];
                                for (let i = 0; i < 6; i++) {
                                    const num = Math.floor(Math.random() * el.waist.length);
                                    playerCards.push(el.waist[num]);
                                    el.waist = el.waist.filter((card, index) => index !== num);
                                    
                                }
                                player.cards = playerCards;
                                io.to(player.id).emit("game waist update", playerCards);
                            });
                        }
                    }
                });
            }
        } else if (v === "2") {
            if (password !== "") {
                // logic for password
            } else {
                saboteur2List.map(el => {
                    if (el.gameID === id) {
                        socket.join(el.gameID); // join the game room
                        el.players.push({ id: socket.id, name: playerName }); // add socket to the list of the game players
                        callback({status: "welcome"}); // allow user redirect to the game page
                        socket.to(el.gameID).emit("joiners update", el, playerName); // send to all sockets in room updated game data 
                    }
                });
            }
        } else {
            callback({status: "version undefined"});
        }
        
    });

    socket.on("game message", (gameMessage, gameRoom) => {
        gameMessage.align = "mssg message-left";
        socket.to(gameRoom).emit("game message", gameMessage)
    });

    socket.on("disconnecting", () => {
        console.log("Socket disconnected from: " + socket.id) // can be removed later
        
        // remove socket from the game players list
        socket.rooms.forEach((val) => { /* loop through the array of the socket rooms */
            saboteur1List.map(el => {
                if(el.gameID === val) { /* check if any of rooms is equal to gameIDs in saboter array, if true remove socked id from playersIDs array*/
                    // inform sockets in room about disconnecting
                    var somePlayer;
                    el.players.map(player => {somePlayer = player.id === socket.id && player.name}); 
                    // remove player from array if his id = to disconnected socket id
                    el.players = el.players.filter(player => player.id !== socket.id);
                    socket.to(el.gameID).emit("joiners update", el, somePlayer); // send to all sockets in room updated game data 
                }
            });

            saboteur2List.map(el => {
                if(el.gameID === val) { /* check if any of rooms is equal to gameIDs in saboter array, if true remove socked id from playersIDs array*/
                    // inform sockets in room about disconnecting
                    var somePlayer = el.players.map(player => player.id === socket.id && player.name); 
                    // remove player from array if his id = to disconnected socket id
                    el.players = el.players.filter(player => player.id !== socket.id);
                    socket.to(el.gameID).emit("joiners update", el, somePlayer); // send to all sockets in room updated game data 
                }
            });
        });

        // remove game record if players.length === 0
        saboteur1List.map(el => {
            if (el.players.length === 0) {
                saboteur1List = saboteur1List.filter(element => element.players != 0 ); 
                // emit new gamelist to all users
                io.emit("sendGamesList1", saboteur1List);
            }
        });

        saboteur2List.map(el => {
            if (el.players.length === 0) {
                saboteur2List = saboteur2List.filter(element => element.players != 0 ); 
                // emit new gamelist to all users
                io.emit("sendGamesList2", saboteur2List);
            }
        });
        console.log(saboteur1List);
    })

});

http.listen(PORT, () => console.log("listening on port " + PORT));