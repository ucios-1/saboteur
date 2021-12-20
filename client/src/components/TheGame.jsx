import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar";
import Player from "./additionaComponents/PlayerForChatlist";
import Message from "./additionaComponents/ChatMessage";
import PlayingCard from "./additionaComponents/PlayingCard";



function TheGame(param) {
    const playingField = [], goldDestination = [];
    const pathData = useParams();
    const [ viewWidth, updateClasses ] = useState(window.visualViewport.width);
    const [ chat, updateChat ] = useState([]);
    const [ playerMssg, setPlayerMssg ] = useState("");
    const [ playerCards, setPlayerCards ] = useState([]);
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
        przeciąganie kart na pole! - działa. Trzeba jeszcze poprawić pozyciowanie kart
        jeszcze trzeba ogarnąc zmiane kart przez click!!! 
        pass
        sprawdzanie, czy karta tu może leżeć - jak??????

        zaciemnić karty pola gry

        dopasować rozmiar kart do pola 
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

        jeżeli szerokośc jest > niż 700, wyłoczyc offcanvas i pokazać wszystko na polu
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
            playingField.push(<div key={i} id={i} className="col field" onDragOver={allowDrag} onDrop={endDrop}></div>); // clack field 
        } else if (i === 0 || i === 2 || i === 4) {
            playingField.push(<div key={i} id={i} className="col field field-card card-array1 gold-rewers" onDragOver={allowDrag} onDrop={endDrop}></div>); // gold cards
        } else if (i === 42) {
            playingField.push(<div key={i} id={i} className="col field field-card card-array2 card-enter" onDragOver={allowDrag} onDrop={endDrop}></div>); // enter to the tunnel
        } else {
            playingField.push(<div key={i} id={i} className="col field field-card card-array1 card-tunnel-rewers" onDragOver={allowDrag} onDrop={endDrop}></div>); // tunnel card
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

        updateChat((prevMssg) => [...prevMssg, mssg]);
        setPlayerMssg("");

        param.socket.emit("game message", mssg, gameData.gameID);
    }

    // do Click event if Shift and Enter are pressed
    function hundlePress(e) {
        if (e.key === 'Enter' && e.shiftKey) {
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
        newClassName = newClassName.replace("field-playing-card", "field-card").replace(" playing-card", "");
        ev.target.className = newClassName;
    }
    
    useEffect(() => {
        // test - teraz mogę zmieniać karty an polu!!!
        document.getElementById("2").className = "col ";
        // end test
        const modalBttn = document.getElementById("toggleModal");
        const modalTxt = document.getElementById("joinORleft");
        const modalTxt2 = document.getElementById("letTheGameBegin");
    
        param.socket.emit("getGameData", pathData.version, pathData.gameID, (serverResp) => {
            setGameData(serverResp); // render players list
            console.log(serverResp);
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
        param.socket.on("game field update", () => {});
        // update playing cards
        param.socket.on("game waist update", (cardArray) => {
            setPlayerCards(prevValue => {
                return [
                    ...prevValue, 
                    ...cardArray
                ]
            });
            
        });

        // listen for messages from other users and update the chat
        param.socket.on("game message", (mssg) => {
            const time = new Date();
            mssg.time = time.getHours() + ":" + time.getMinutes();
            updateChat((prevMssg) => [...prevMssg, mssg]);
        });

        
        // remove listeners to avoid multiple echoes
        return () => {
            param.socket.off("game message");
            param.socket.off("joiners update");
            param.socket.off("game field update");
            param.socket.off("game waist update");
        }
    }, [param.socket, gameData.players.length, pathData.gameID, pathData.version]);

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
                                {playingField}
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
                                <div className="crad-body">
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