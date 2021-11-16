import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import saboteur1 from "../images/saboteur1_cover.jpg";

function TheGame() {
    const playingCards = [], playingField = [];
    const [viewWidth, updateClasses] = useState(window.visualViewport.width);
    var roomName;

    for (let i = 0; i < 6; i++) {
        playingCards.push(<div draggable="true" className="field field-card playing-card"></div>);
    }
    for (let i = 0; i < 45; i++) {
        if(i === 3 || i === 1 || i === 40 || i === 41 || i === 43 || i === 44) {
            playingField.push(<div className="col field"></div>);
        } else {
            playingField.push(<div className="col field field-card"></div>);
        }
        
    }

    function update() {
        updateClasses(window.visualViewport.width)
    }
    window.addEventListener("resize", update);


    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row row-cols-1 row-cols-sm-3 flex-center-hor">
                    <div className="col-sm-12 col-md-1">
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
                    <div className="col-sm-12 col-md-6">
                        <div className="flex-center-hor col">
                            <div className={(viewWidth < 700) ? "board add-space-bottom" : "board" }>
                                {playingField}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-1">
                        <div className={(viewWidth < 700) ? "row fixed-bottom" : "row" }>
                            {playingCards}
                        </div>
                    </div>
                    <button class="btn btn-light fixed-right-leftrounded" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop">
                        <i className="icon fas fa-user"></i>
                    </button>

                    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                    <div class="offcanvas-header">
                        <h5 id="offcanvasTopLabel">Offcanvas top</h5>
                        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body">
                        <ol className="list-group list-group-flush list-small">
                            <h5>Players</h5>
                            <li class="list-group-item d-flex justify-content-between align-items-start">An item <span class="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li class="list-group-item">A second item <span class="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li class="list-group-item">A third item <span class="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li class="list-group-item list-group-item-dark">A fourth item <span class="badge bg-warning text-dark rounded-pill">14</span></li>
                            <li class="list-group-item">And a fifth one</li>
                            <li class="list-group-item">An item</li>
                            <li class="list-group-item">A second item</li>
                            <li class="list-group-item">A third item</li>
                            <li class="list-group-item">A fourth item</li>
                            <li class="list-group-item">And a fifth one</li>
                        </ol>
                        <br />
                        <div classNmame="container">
                            <div className="card">
                                <div className="card-header">{roomName} chat</div>
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
                                                    <div className="mssg-options"><i class="fas fa-bold"></i></div>
                                                    <div className="mssg-options"><i class="fas fa-italic"></i></div>
                                                    <div className="mssg-options"><i class="fas fa-strikethrough"></i></div>
                                                </div>
                                                <button className="btn btn-outline-secondary"><i class="fas fa-paper-plane"></i></button>
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