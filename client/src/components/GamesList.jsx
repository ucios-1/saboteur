import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar.jsx";
import TableRow from "./additionaComponents/TableRow";
import FormTextInput from "./additionaComponents/FormTextInput";
import supervillains from "supervillains"; // create random user name


function GamesList(props){
    const user = supervillains.random(); // set name for user
    const saboteurVersion = useParams(); // check the game version to request correct list of games from server
    const [gamesList, setGamesList] = useState();
    const [userCredentials, setUserCredentials] = useState({
        id: "",
        name: "", 
        password: "",
        access: "free"
    });
    const socketListener = "sendGamesList" + saboteurVersion.version;
    const navigate = useNavigate();

    function handleChange(e) {
        const {name, value} = e.target;
        setUserCredentials(prevValue => {
            return {
                ...prevValue, 
                [name]: value
            }
        });
    }

    // when button "Join" is clicked check if name field is feeled. If not assign a random value
    const checkUserName = useCallback( userName => {
        return userName === "" ?  user : userName 
    }, [user]);

    const gameEnter = useCallback(() => {
        userCredentials.name = checkUserName(userCredentials.name);

        props.socket.emit("gameConnect", saboteurVersion.version, userCredentials.id, userCredentials.name, userCredentials.password, serverResp => {
            if (serverResp.status === "welcome") {
                navigate("/saboteur/" + saboteurVersion.version + "/game/" + userCredentials.id + "/player/" + userCredentials.name );
            }
        });
    },[userCredentials, props.socket, navigate, saboteurVersion.version, checkUserName]);
    
    useEffect(() => {
        props.socket.emit("getGamesList",saboteurVersion.version); // send request to the server for list of games

        // listen to respond from the server and update gamesList from useState render automaticaly list of games
        props.socket.on(socketListener, (arg) => {
            setGamesList(
                arg.map((element, indx) => {
                    return <TableRow 
                                key={indx}
                                id={element.gameID} 
                                num={indx + 1} 
                                name={element.gameName} 
                                players={element.players.length} 
                                maxPlayers={element.maxPlayersNum}
                                access={element.access} 
                                link={element.access === "free" && <i className="fas fa-sign-in-alt"></i>}
                                enterGame={setUserCredentials} 
                            />
                })
            );
        }); 
        // remove listener to avoid multiple echoes
        return () => props.socket.off(socketListener);
        // update page only if one of the paramenters below has been changed
    }, [props.socket, saboteurVersion, socketListener, navigate, gameEnter]);
    
    
    return (
        <div>
            <Navbar />
            {/* Modal part */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Please enter your credentials</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <FormTextInput 
                                forInput="name" 
                                labelText="Player name" 
                                type="text" 
                                inputName="name" 
                                passFunction={ handleChange } 
                                passValue={ userCredentials.name }
                                placeholder={ user }
                            />
                            { userCredentials.access === "password" && <FormTextInput 
                                                                            forInput="password" 
                                                                            labelText="Password" 
                                                                            type="password" 
                                                                            inputName="password" 
                                                                            passFunction={ handleChange } 
                                                                            passValue={ userCredentials.password }
                                                                            placeholder={ "" }
                                                                        /> 
                            }
                        </div>
                        <div className="modal-footer">
                            <button onClick={ gameEnter } type="button" className="btn btn-secondary" data-bs-dismiss="modal">Join</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Games List part */}
            <div className="container flex-centered-two-demention">
                <div className="table-container">
                    <table className="table table-light table-hover table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Game name</th>
                                <th scope="col">Players quantity</th>
                                <th scope="col">Access</th>
                                <th scope="col">Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            { gamesList /* render games list here */ }
                        </tbody>
                    </table>
                </div>
                <Link 
                    className="d-grid gap-2 col-6 mx-auto" 
                    to={ useLocation().pathname === "/saboteur/1" ? "/saboteur/1/new%20game" : "/saboteur/2/new%20game" 
                        /* check the current path and link button to appopriate path
                            can do it with game version, but wanted to show different options */
                        }
                >
                    <button className="btn btn-outline-light font1-5rem">New Game</button>
                </Link>
            </div>
        </div>
    );
}

export default GamesList;