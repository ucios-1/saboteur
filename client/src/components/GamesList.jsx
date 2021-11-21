import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar.jsx";
import TableRow from "./additionaComponents/TableRow";



function GamesList(param){
    const saboteurVersion = useParams(); // check the game version to request correct list of games from server
    const [gamesList, setGamesList] = useState();
    const socketListener = "sendGamesList" + saboteurVersion.version;
    
    useEffect(() => {
        param.socket.once(socketListener, (arg) => {
            setGamesList(
                arg.map(
                    (element, indx) => <TableRow key={indx} num={indx + 1} name={element.gameName} playersNum={element.maxPlayersNum} access={element.access} />
                )
            );
        }); // listen to respond from the server and update gamesList from useState render automaticaly list of games
    
        param.socket.emit("getGamesList",saboteurVersion.version); // send request to the server for list of games
    });
    
    
    return (
        <div>
            <Navbar />
            <div className="container flex-centered-two-demention">
                <table className="table table-light table-hover table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Game name</th>
                            <th scope="col">number of players</th>
                            <th scope="col">Accsessable</th>
                        </tr>
                    </thead>
                    <tbody>
                        { gamesList /* render games list here */ }
                    </tbody>
                </table>
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