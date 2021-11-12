import {useEffect, useState} from "react";
import Navbar from "./Navbar";
import saboteur1 from "../images/saboteur1_cover.jpg";

function TheGame() {
    const playingCards = [], playingField = [];
    const [viewWidth, updateClasses] = useState(window.visualViewport.width);
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
                        <div className={(viewWidth < 700) ? "flex-center" : "row" }>
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
                </div>
            </div>
        </div>
    );
}

export default TheGame;