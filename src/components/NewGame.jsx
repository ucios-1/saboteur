import { useParams } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function NewGame(params) {
    const v = useParams();
    var gameID;
    console.log(v.version);

    return (
        <div>
            <Navbar />
            <div className="container">
               <main>
                    <div className="flex-center-hor">
                        <div className="form-container col-md-7 col-lg-8">
                            <form>
                                <div className="form-input-separator col-sm-12">
                                    <label for="playerName" className="form-label">Player name</label>
                                    <input className="form-control" type="text" name="playerName" value="" placeholder="change text to hooks here!!!!"/>
                                </div>
                                <div className="form-input-separator col-sm-12">
                                    <label for="gameName" className="form-label">Game name</label>
                                    <input className="form-control" type="text" name="gameName" value="" placeholder="change text to hooks here!!!!"/>
                                </div>
                                <div className="form-input-separator col-sm-12">
                                    <label for="gameName" className="form-label">Game Access</label>
                                    <select className="form-select" name="gameAccess">
                                        <option value="freeAccess">Free</option>
                                        <option value="passwordAccess">Password</option>
                                    </select>
                                </div>
                                <div className="form-input-separator col-sm-12">
                                    {/* (min) if Saboter - num = 3, if saboteur 2 - num = 2 
                                        (max) if Saboter - num = 10, if saboteur 2 - num = 12 */}
                                    <label for="numOfAPlayers" className="form-label">Number of a players</label>
                                    <input className="form-control" type="number" name="numOfAPlayers" value="" min="3" max="10" placeholder="3 to 10 playes. Max value by default"/>
                                </div>
                                <div className="form-input-separator col-sm-12">
                                    <label for="timeFrame" className="form-label">The timeframe to make a move (min)</label>
                                    <input className="form-control" type="text" name="timeFrame" value="" placeholder="change text to hooks here!!!!"/>
                                </div>
                                <div className="form-input-separator col-sm-12">
                                    <Link className="d-grid gap-2 col-8 mx-auto" to={v.version === 1 ? "/saboteur/1/game/" + gameID : "/saboteur/2/game/" + gameID}>
                                        <button className="btn btn-outline-dark font1-5rem">New Game</button>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
               </main> 
            </div>
        </div>
    )
}

export default NewGame;