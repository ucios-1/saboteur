import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar";
import Player from "./additionaComponents/PlayerForChatlist";
import Message from "./additionaComponents/ChatMessage";
import PlayingCard from "./additionaComponents/PlayingCard";
import FieldCard from "./additionaComponents/FieldCard";



function TheGame(param) {
    const playingField = [], goldDestination = [];
    const pathData = useParams();
    const [ viewWidth, updateClasses ] = useState(window.visualViewport.width);
    const [ chat, updateChat ] = useState([]);
    const [ playerMssg, setPlayerMssg ] = useState("");
    const [ playerCards, setPlayerCards ] = useState([]);
    const [ playerRole, setPlayerRole ] = useState("");
    const [ field, setField ] = useState(playingField);
    const [ gameData, setGameData ] = useState({
        gameID: "",
        playerName: "", 
        gameName: "",
        access: "",
        maxPlayersNum: "",
        timeFrame:"", 
        players: [{name: ""}]
    });
    const thisPlayer =  pathData.player;
    

    /*
        trzeba zrobic liste z 45 elementow
        kazdy element musi miec swoje id
        do kazdego elementu trzeba przepisac karte
        karte mozna zmieniac w odniesieniu do elementu

        potrzebuję jeszcze liste kart w talii 

        dokończyć logikę gry!!!!!!!!!!!!!!!!!!!!!!!!!
        - jak karty w tali skończyły się, to nie dobierać więcej kart
        - jeszcze trzeba ogarnąc zmiane kart przez click!!! 
        - pass
        !!! sprawdzanie, czy karta tu może leżeć - jak??????

        - wysyłanie wiadomości po wciśnięciu ENTER, ENTER + SHIFT przejście na nową linijkę

        zaciemnić karty pola gry
 
        sprawdzić różne szerokości ekranów

        napisac logikę, że jak szerokość ekranu jest < niż 700 to:
        - aktywnych graczy przenieść do offcanvas
            - kazdy gracz powinien miec:
                - ikonki pokazujące co zepsute, a co nie
                - ile ma złota
            - trzeba pokazać, który jest aktywny, a który jest następny
        - króra jest runda
        - ile zostało kart w talii
        -przenieść czat do offcanvas

        jeżeli szerokośc jest > niż 700, wyłączyc offcanvas i pokazać wszystko na polu
    */
    for (let i = 0; i < 5; i++){
        if(i === 0 || i === 2 || i === 4) {
            goldDestination.push(<div key={"gold" + i} id={"gold" + i} className="col field field-card card-array2 gold-hidden"></div>);
        } else {
            goldDestination.push(<div key={"gold" + i} id={"gold" + i} className="col field"></div>);
        }
    }
    for (let i = 0; i < 45; i++) {
        if(i === 3 || i === 1) {
            playingField.push({id: "fieldCard-" + i, class: "col field"}); // black field 
        } else if (i === 0 || i === 2 || i === 4) {
            playingField.push({id: "fieldCard-" + i, class: "col field field-card card-array1 gold-rewers"}); // gold cards
        } else if (i === 42) {
            playingField.push({id: "fieldCard-" + i, class: "col field field-card card-array2 card-enter"}); // enter to the tunnel
        } else {
            playingField.push({id: "fieldCard-" + i, class: "col field field-card card-array1 card-tunnel-rewers"}); // tunnel card
        }
    }

    // adjust classes to the view port width
    function updateViewWidth() {
        updateClasses(window.visualViewport.width)
    }
    window.addEventListener("resize", updateViewWidth);

    // funtion that store all chat messages
    function updateChatMessgs(e) {
        e.preventDefault();
        const time = new Date();
        const mssg = {
            name: thisPlayer, 
            time: time.getHours() + ":" + time.getMinutes(), 
            mssg: playerMssg, 
            align: "mssg message-right"
        }

        updateChat((prevMssg) => [mssg, ...prevMssg]);
        setPlayerMssg("");

        // send message to other players 
        param.socket.emit("game message", mssg, gameData.gameID);
    }

    // do Click event if Enter are pressed
    function hundlePress(e) {
        if (e.key === 'Enter') {
            const mssgForm = document.getElementById("submitMssgForm");
            mssgForm.click();
        }
    }

    function handleChange(e) {
        setPlayerMssg(e.target.value);
    }

    // drug and drop logic
    function allowDrag(ev) {
        ev.preventDefault();
    }

    function startDrag(ev) {
        if(ev.target.classList.contains("playing-card-active")) {
            ev.target.classList.remove("playing-card-active");
            ev.dataTransfer.setData("text", ev.target.className);
        } else {
            ev.dataTransfer.setData("text", ev.target.className);
        }
    }

    function endDrop(ev) {
        ev.preventDefault();
        let newClassName = ev.dataTransfer.getData("text");

        // remove unnesessary classNames
        newClassName = newClassName.replace("field-playing-card", "field-card").replace(" playing-card", "");

        // update specific element in array if equal to ID
        field.map(el => {
            if (el.id === ev.target.id) {
                el.class = newClassName;
            }
        });



        // remove this card from player's waist
        const removeFromPlayerCards = newClassName.slice(33, newClassName.length);
        const indexToRemove = playerCards.findIndex(el => el === removeFromPlayerCards);
        const updatedWaist = playerCards.filter((el, indx) => indx !== indexToRemove);
        setPlayerCards(updatedWaist);

        // request new cards from game waist
        param.socket.emit("get card", pathData.version, gameData.gameID, updatedWaist);

        // update playing field for all players
        param.socket.emit("game field update", field, gameData.gameID);
    }

    const updateField = useCallback((playingField) => {
        setField(playingField);
    }, [setField]);
    
    
    useEffect(() => {
        // test - teraz mogę zmieniać karty an polu!!!
        document.getElementById("fieldCard-2").className = "col ";
        // end test
        const modalBttn = document.getElementById("toggleModal");
        const modalTxt = document.getElementById("joinORleft");
        const modalTxt2 = document.getElementById("letTheGameBegin");
    
        param.socket.emit("getGameData", pathData.version, pathData.gameID, (serverResp) => {
            setGameData(serverResp); // render players list
            //setPlayerCards();
            if(serverResp.players.length == serverResp.maxPlayersNum) {
                serverResp.players.map(el => {
                    if(el.name === thisPlayer) {
                        setPlayerCards(el.cards);
                    }
                });
            }
        });

        // update gameData when new player join the game
        param.socket.on("joiners update", (newGameData, playerName) => {
            if(newGameData.maxPlayersNum == newGameData.players.length) {
                modalTxt.innerHTML = "Player " + playerName + " joined the game";
                modalTxt2.innerHTML = "Let the game BEGIN!";
                modalBttn.click();
            } else if (gameData.players.length < newGameData.players.length) {
                modalTxt.innerHTML = "Player " + playerName + " joined the game";
                modalBttn.click();
            } else {
                modalTxt.innerHTML = "Player " + playerName + " left the game";
                modalTxt2.innerHTML = "";
                modalBttn.click();
            }

            setGameData(newGameData);
        });

        // update fields
        param.socket.on("game field update", field => {
            setField(field);
        });

        // update playing cards
        param.socket.on("game waist update", cardArray => {
            setPlayerCards(prevValue => {
                return [
                    ...prevValue, 
                    ...cardArray
                ]
            });
            
        });

        // listen for messages from other users and update the chat
        param.socket.on("game message", mssg => {
            const time = new Date();
            mssg.time = time.getHours() + ":" + time.getMinutes();
            updateChat((prevMssg) => [mssg, ...prevMssg]);
        });

        // listen for new cards
        param.socket.on("get cards", cards => {
            setPlayerCards(cards);
        });

        // listen for roles and change it
        param.socket.on("get role", role => {
            setPlayerRole(role);
        });
        
        // remove listeners to avoid multiple echoes
        return () => {
            param.socket.off("game message");
            param.socket.off("joiners update");
            param.socket.off("game field update");
            param.socket.off("game waist update");
            param.socket.off("get cards");
            param.socket.off("get role");
        }
    }, [param.socket, gameData.players.length, pathData.gameID, pathData.version, thisPlayer, field, updateField]);

    return (
        <div>
            <Navbar />
            {/* Modal part */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Player update</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p id="joinORleft"></p>
                            <p id="letTheGameBegin"></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Games List part */}
            <div className="container">
                <div className="row row-cols-1 row-cols-sm-3 flex-center-hor">
                    <div className="col-sm-12 col-md-1">
                        { /* row with game status icons */ }
                        <div className={(viewWidth < 700) ? "" : "row" }>  
                            <i className="icon icon-active fas fa-dolly-flatbed"></i>
                            <i className="icon icon-deactive fas fa-hammer"></i>
                            <i className="icon icon-active far fa-lightbulb"></i>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-1">
                        <div className={(viewWidth < 700) ? "flex-center flex-wrap" : "row row-cols-sm-3" }>
                            <div className="player player-active">
                                <i className="icon fas fa-user"></i>
                                <p>user name</p>
                            </div>
                            <div className="player player-deactive">
                                <i className="icon fas fa-user"></i>
                                <p>user name</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6"> { /* game field */ }
                        <div className="flex-center-hor col">
                            <div className={(viewWidth < 700) ? "board add-space-bottom position-absolute" : "board position-absolute" }>
                                {field.map(el => {
                                    return (
                                        <FieldCard 
                                            key={el.id}
                                            id={el.id}
                                            className={el.class}
                                            allowDrag={allowDrag}
                                            endDrop={endDrop}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                        <div className="flex-center-hor col">
                            <div className= "board">
                                {goldDestination}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-1"> { /* game playing cards */ }
                        <div className={(viewWidth < 700) ? "row fixed-bottom" : "row row-cols-1" }>
                            { playerCards.map((el, indx) => {
                                return (
                                    <PlayingCard 
                                        key = {"playingCard-" + indx }
                                        id = {"playingCard-" + indx }
                                        cardName = { el }
                                        drugFunction = { startDrag } 
                                    />
                                )
                            }) }
                        </div>
                    </div>
                    <button className="btn btn-light fixed-right-leftrounded" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
                        <i className="icon fas fa-user"></i>
                    </button>

                    <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                    <div className="offcanvas-header">
                        <h5 id="offcanvasTopLabel">{ gameData.gameName }</h5>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ol className="list-group list-group-flush list-small">
                            <h5>Players</h5>
                            { gameData.players.map((el, indx) => {
                                // + create logic to track who is active player now
                                // by adding class to list-group-item-dark
                                if (el) {
                                    return <Player key={indx} name={ el.name } gold={ indx } />
                                }
                                else {
                                    return null
                                }
                            }) }
                            
                            <li className="list-group-item list-group-item-dark">A fourth item <span className="badge bg-warning text-dark rounded-pill">14</span></li>
                        </ol>
                        <br />
                        <div className="container-flex">
                            <div className="card">
                                <div className="card-header">Chat</div>
                                <div className="card-body">
                                    <div className="messanger">
                                        { chat.map((mssg, indx) => {
                                            return (
                                                <Message 
                                                    key= { "message: " + indx }
                                                    name={ mssg.name }
                                                    time={ mssg.time }
                                                    mssg={ mssg.mssg }
                                                    align={ mssg.align } 
                                                />
                                            )
                                        }) }
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <form onSubmit={ updateChatMessgs }>
                                        <div className="mssg-footer">
                                            <textarea 
                                                className="mssg-text" 
                                                onChange={ handleChange } 
                                                onKeyUp={ hundlePress }
                                                value={ playerMssg }
                                                name="mssg-txt">
                                            </textarea>
                                            <div className="mssg-header">
                                                <div className="">
                                                    <div className="mssg-options"><i className="fas fa-bold"></i></div>
                                                    <div className="mssg-options"><i className="fas fa-italic"></i></div>
                                                    <div className="mssg-options"><i className="fas fa-strikethrough"></i></div>
                                                </div>
                                                <button id="submitMssgForm" className="btn btn-outline-secondary" type="submit"><i className="fas fa-paper-plane"></i></button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
            <button style={{display: "none"}} id="toggleModal" data-bs-toggle="modal" data-bs-target="#exampleModal"></button>
        </div>
    );
}

export default TheGame;