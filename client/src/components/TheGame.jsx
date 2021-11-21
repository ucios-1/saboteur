import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar";

function TheGame(param) {
    const playingCards = [], playingField = [];
    const [viewWidth, updateClasses] = useState(window.visualViewport.width);
    const [ gameData, setGameData ] = useState({
        gameID: "",
        playerName: "", 
        gameName: "",
        access: "",
        maxPlayersNum: "",
        timeFrame:""
    })
    const pathData = useParams();

    for (let i = 0; i < 6; i++) {
        playingCards.push(<div draggable="true" className="field field-card playing-card"></div>);
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

    function updateViewWidth() {
        updateClasses(window.visualViewport.width)
    }
    window.addEventListener("resize", updateViewWidth);


    
    useEffect(() => {
        param.socket.emit("getGameData", pathData.version, pathData.gameID, (serverResp) => {
            setGameData(serverResp); // render players list
            console.log("log");
        });
    });

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
                        <h5 id="offcanvasTopLabel">Offcanvas top</h5>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ol className="list-group list-group-flush list-small">
                            <h5>Players</h5>
                            { }
                            <li className="list-group-item d-flex justify-content-between align-items-start">An item <span className="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li className="list-group-item">A second item <span className="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li className="list-group-item">A third item <span className="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li className="list-group-item list-group-item-dark">A fourth item <span className="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li className="list-group-item">And a fifth one</li>
                            <li className="list-group-item">An item</li>
                            <li className="list-group-item">A second item</li>
                            <li className="list-group-item">A third item</li>
                            <li className="list-group-item">A fourth item</li>
                            <li className="list-group-item">And a fifth one</li>
                        </ol>
                        <br />
                        <div className="container">
                            <div className="card">
                                <div className="card-header"> { gameData.gameName } chat</div>
                                <div className="dacd-body">
                                    <div className="messanger">
                                        <div className="mssg message-left">
                                            <div className="mssg-header">
                                                <div className="player-name">
                                                    player
                                                </div>
                                                <div className="message-time">
                                                    14:17
                                                </div>
                                            </div>
                                            <div className="message-body">
                                                Hello world!
                                            </div>
                                        </div>
                                        <div className="mssg message-right">
                                            <div className="mssg-header">
                                                <div className="player-name">
                                                    player
                                                </div>
                                                <div className="message-time">
                                                    14:20
                                                </div>
                                            </div>
                                            <div className="message-body">
                                                Hi world!
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    <form>
                                        <div className="mssg-footer">
                                            <textarea className="mssg-text" name="mssgText"></textarea>
                                            <div className="mssg-header">
                                                <div className="">
                                                    <div className="mssg-options"><i className="fas fa-bold"></i></div>
                                                    <div className="mssg-options"><i className="fas fa-italic"></i></div>
                                                    <div className="mssg-options"><i className="fas fa-strikethrough"></i></div>
                                                </div>
                                                <button className="btn btn-outline-secondary"><i className="fas fa-paper-plane"></i></button>
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