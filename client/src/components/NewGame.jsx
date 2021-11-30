import { useState } from "react";
import { useParams, useNavigate  } from "react-router-dom";
import { v4 as uuidv4} from "uuid"; // create random ID
import Navbar from "./additionaComponents/Navbar";
import FormTextInput from "./additionaComponents/FormTextInput";
import FormNumInput from "./additionaComponents/FormNumInput";
import supervillains from "supervillains"; // create random user name
import _ from "lodash";


// napisać logikę, która będzie przyjmować dane z serwera o nowej grze 

function NewGame(param) {
    const user = supervillains.random(); // sent name for user
    const v = useParams(); //check game version
    const navigate = useNavigate();

    const [gameCard, updateState] = useState({
        gameID: _.snakeCase(supervillains.random()) + "_" + uuidv4(),
        playerName: user, 
        gameName: supervillains.random(),
        access: "free",
        maxPlayersNum: "10",
        timeFrame: "0"
    }); // js object with data to be send to server for new game registration

    function handleChange(event) {
        const {name, value} = event.target;
        updateState(prevState => {
            return {
                ...prevState, 
                [name]: value
            }
        }); // update states
    }

    function createGame(e) {
        e.preventDefault();

        param.socket.emit("addGame", v.version, gameCard, (serverResp) => {
            if (serverResp.status === "created") {
                // go to Game page
                navigate("/saboteur/" + v.version + "/game/" + gameCard.gameID + "/player/" + gameCard.playerName);
            } else {
                console.log("wrong server respond");
            }
        }); // send data with game details to the servver and wait for respond
    }

    return (
        <div>
            <Navbar />
            <div className="container">
               <main>
                    <div className="flex-center-hor">
                        <div className="form-container col-md-7 col-lg-8">
                            <form onSubmit={createGame}>
                                <FormTextInput 
                                    forInput="playerName" 
                                    labelText="Player name" 
                                    type="text" 
                                    inputName="playerName" 
                                    passFunction={ handleChange } 
                                    passValue={ gameCard.playerName }
                                    placeholder={ user }
                                />
                                <FormTextInput 
                                    forInput="gameName" 
                                    labelText="Game name" 
                                    type="text" 
                                    inputName="gameName" 
                                    passFunction={ handleChange } 
                                    passValue={ gameCard.gameName }
                                    placeholder={ gameCard.gameName }
                                />
                                <div className="form-input-separator col-sm-12">
                                    <label htmlFor="gameName" className="form-label">Game Access</label>
                                    <select className="form-select" name="gameAccess" onChange={handleChange} value={gameCard.gameAccess}>
                                        <option value="free">Free</option>
                                        {/* password option disabled. waiting for implementation */}
                                        <option value="password" disabled>Password</option>
                                    </select>
                                </div>
                                <FormNumInput 
                                    forInput="maxPlayersNum"
                                    labelText="Number of players"
                                    inputName="maxPlayersNum"
                                    passFunction={ handleChange } 
                                    passValue={ gameCard.maxPlayersNum }
                                    placeholder={ v.version === "1" ? "3 to 10 playes. Max value by default" : "2 to 12 playes. Max value by default" }
                                    minValue={ v.version === "1" ? "3" : "2" }
                                    maxValue={ v.version === "1" ? "10" : "12" }
                                />
                                <FormNumInput 
                                    forInput="timeFrame"
                                    labelText="Set timeframe for a move (min)"
                                    inputName="timeFrame"
                                    passFunction={ handleChange } 
                                    passValue={ gameCard.timeFrame }
                                    placeholder="0 mean No time frame"
                                    minValue="0"
                                    maxValue="10"
                                />
                                <div className="form-input-separator col-sm-12">
                                    <button  className="btn btn-outline-dark d-grid gap-2 col-8 mx-auto font1-5rem">Create</button>
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