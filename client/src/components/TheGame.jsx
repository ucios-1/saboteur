import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar";
import Player from "./additionaComponents/PlayerForChatlist";
import Message from "./additionaComponents/ChatMessage";



function TheGame(param) {
    const playingCards = [], playingField = [];
    const pathData = useParams();
    const [ viewWidth, updateClasses ] = useState(window.visualViewport.width);
    const [ chat, updateChat ] = useState([]);
    const [ playerMssg, setPlayerMssg ] = useState("");
    const [ gameData, setGameData ] = useState({
        gameID: "",
        playerName: "", 
        gameName: "",
        access: "",
        maxPlayersNum: "",
        timeFrame:"", 
        players: [{name: "" }]
    });
    const thisPlayer =  pathData.player;
    

    for (let i = 0; i < 6; i++) {
        playingCards.push(<div draggable="true" className="field field-card playing-card card-array1 field-playing-card"></div>);
    }
    for (let i = 0; i < 45; i++) {
        if(i === 3 || i === 1 || i === 40 || i === 41 || i === 43 || i === 44) {
            playingField.push(<div className="col field"></div>); // clack field 
        } else if (i === 0 || i === 2 || i === 4) {
            playingField.push(<div className="col field field-card card-array1 card-gold-rewers"></div>); // gold cards
        } else if (i === 42) {
            playingField.push(<div className="col field field-card card-array2 card-enter"></div>); // enter to the tunnel
        } else {
            playingField.push(<div className="col field field-card card-array1 card-tunnel-rewers"></div>); // tunnel card
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

    useEffect(() => {
        param.socket.on("new joiner", (arg) => {
            console.log("listen");
            setGameData(arg);
        });
        // remove listener to avoid multiple echoes
        return param.socket.off("new joiner");
    });
    
    useEffect(() => {
        param.socket.emit("getGameData", pathData.version, pathData.gameID, (serverResp) => {
            setGameData(serverResp); // render players list
        });
    }, [param.socket, pathData.gameID, pathData.version]);

    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row row-cols-1 row-cols-sm-3 flex-center-hor">
                    <div className="col-sm-12 col-md-1">
                        <div className={(viewWidth < 700) ? "" : "row" }>  { /* roww with game status icons */ }
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
                            <div className={(viewWidth < 700) ? "board add-space-bottom" : "board" }>
                                {playingField}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-1"> { /* game playing cards */ }
                        <div className={(viewWidth < 700) ? "row fixed-bottom" : "row" }>
                            {playingCards}
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
        </div>
    );
}

export default TheGame;