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
    obj.players = [ { id: playerID, name: obj.playerName } ]; // add socket.id and player name to the list of objects to the particaler game
    return obj;
}

function takeCard (numb, waist, playerCards) {

    for (let i = 0; i < numb; i++) {
        const num = Math.floor(Math.random() * waist.length);
        playerCards.push(waist[num]);
        waist = waist.filter((card, index) => index !== num);
    }

    return [waist, playerCards];
}

function distributeRoles (roles) {
    const num = Math.floor(Math.random() * roles.length);
    const role = roles.filter((el, indx) => indx === num);
    roles = roles.filter((el, indx) => indx !== num);
    return [role, roles];
}

function assignRolesToTheGame(num) {
    var roles;

    switch (num) {
        case "10":
            roles = ["saboteur", "saboteur", "saboteur", "saboteur", "dwarf", "dwarf",  "dwarf", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        case "9":
            roles = ["saboteur", "saboteur", "saboteur", "dwarf", "dwarf",  "dwarf", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        case "8":
            roles = ["saboteur", "saboteur", "saboteur", "dwarf",  "dwarf", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        case "7":
            roles = ["saboteur", "saboteur", "saboteur", "dwarf", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        case "6":
            roles = ["saboteur", "saboteur", "dwarf", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        case "5":
            roles = ["saboteur", "saboteur", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        case "4":
            roles = ["saboteur", "dwarf", "dwarf", "dwarf", "dwarf"];
            break;
        default:
            roles = ["saboteur", "dwarf", "dwarf", "dwarf"];
    }

    if((roles.length - 1) != num) {
        console.log("Error: games roles are not equal to number of players!");
    }

    return roles; 
}

function findSaboteur1Element(id) {
    var toReturn;
    saboteur1List.map(el => {
        if(el.gameID === id) {
            toReturn = el;
        }
    })

    return toReturn;
}

function setPlayerAsActive(num) {
    return Math.floor(Math.random() * num);
}

function updateSaboteur1Element(id, update) {
    saboteur1List.map(el => {
        if(el.gameID === id) {
            el = update;
        }
    });
}

function updateActivePlayer(activeNum, maxPlayersNum) {
    activeNum += 1;
    if(activeNum < maxPlayersNum) {
        return activeNum;
    } else {
        return 0;
    }
}

io.on("connection", socket => {

    console.log(socket.id);

    socket.on("getGamesList", v => {
        if (v === "1") {
            socket.emit("sendGamesList1", saboteur1List);
        } else {
            socket.emit("sendGamesList2", saboteur2List);
        }
    });

    socket.on("getGameData", (v, id, callback) => {
        if (v === "1") {
            const game = findSaboteur1Element(id);;
            if (game) {
                socket.join(game.gameID); // join game room (room name = gameID) if found
                callback(game); //send back data about the game
            } else {
                callback("game not found");
            }
        } else if (v === "2") {
            const game = _.find(saboteur2List, { gameID: id });
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
                const el = findSaboteur1Element(id);                    
                socket.join(el.gameID); // join the game room
                el.players.push({ id: socket.id, name: playerName }); // add socket to the list of the game players
                callback({status: "welcome"}); // allow user redirect to the game page
                socket.to(el.gameID).emit("joiners update", el, playerName); // send to all sockets in room updated game data 

                // if game is full start the game / first round
                if(el.players.length == el.maxPlayersNum) {
                    // check how namy cards to send
                    var cardsNum;
                    if(el.maxPlayersNum < 6) {
                        cardsNum = 6;
                    } else if (el.maxPlayersNum > 5 && el.maxPlayersNum < 8) {
                        cardsNum = 5;
                    } else {
                        cardsNum = 4;
                    }

                    // set some player as active randomply
                    el.active = setPlayerAsActive(el.players.length);

                    // create game roles
                    el.roles = assignRolesToTheGame(el.maxPlayersNum);
                    
                    // send cards and roles to players depending on how many players
                    var rolesForRound = el.roles;
                    el.players.map(player => {
                                
                        const cardsArray = takeCard(cardsNum, el.waist, []);
                        const rolesArray = distributeRoles(rolesForRound);

                        el.waist = cardsArray[0];
                        player.cards = cardsArray[1];
                        player.role = rolesArray[0];
                        rolesForRound = rolesArray[1];

                        socket.emit("game waist update", player.cards);
                        socket.emit("get role", player.role);
                        socket.emit("active player", el.active);
                    });
                    // io.to(el.gameID).emit("active player", el.active);
                }

                updateSaboteur1Element(id, el);
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

    // send message to all particimants except sender
    socket.on("game message", (gameMessage, gameRoom) => {
        gameMessage.align = "mssg message-left";
        socket.to(gameRoom).emit("game message", gameMessage);
    });

    // distribute cards for players in the game
    socket.on("get card", (v, id, playerCardsArray) => {
        if(v === "1") {
            const el = findSaboteur1Element(id);
            el.players.map(player => {
                if(player.id === socket.id) {

                    const cardsArray = takeCard(1, el.waist, playerCardsArray);
                    el.waist = cardsArray[0];
                    player.cards = cardsArray[1];

                    socket.emit("get cards", player.cards);
                }
            });
            updateSaboteur1Element(id, el);
        } else if (v === "2") {
            // finish it!
        } else {
            // finish it!
        }
    });

    // update playing field to all particimants except sender
    socket.on("game field update", (field, gameRoom) => {
        socket.to(gameRoom).emit("game field update", field);
    });

    // change active player
    socket.on("update active", id => {
        const el = findSaboteur1Element(id);

        el.active = updateActivePlayer(el.active, el.maxPlayersNum);
        io.to(id).emit("active player", el.active);

        updateSaboteur1Element(id, el);
    });

    socket.on("disconnecting", (reason) => {
        console.log(reason);
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
    })

});

http.listen(PORT, () => console.log("listening on port " + PORT));