import Navbar from "./Navbar";
import saboteur1 from "../images/saboteur1_cover.jpg";

function TheGame() {
    const playingCards = [], playingField = [];
    for (let i = 0; i < 6; i++) {
        playingCards.push(<img src={saboteur1} className="playing-card" alt="card to play" />);
    }
    for (let i = 0; i < 1; i++) {
        playingField.push(<img src={saboteur1} className="playing-field" alt="card to play" />);
    }


    return (
        <div>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-8">
                        <div className="row justify-content-md-center">
                            <div className="col-2">
                                {playingField}
                            </div>
                            <div className="col-2">
                                {playingField}
                            </div>
                            <div className="col-2">
                                {playingField}
                            </div>
                            <div className="col-2">
                                {playingField}
                            </div>
                            <div className="col-2">
                                {playingField}
                            </div>
                        </div>
                        <div className="">
                            {playingCards}
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="players">sdsds</div>
                        <div className="chat-ifeld">sdsds</div>
                        <div className="input-field">sdsds</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TheGame;