import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import TableRow from "./TableRow";

function GamesList(){
    
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
                        <TableRow id="1" num="1" name="game name" playersNum="12/15" access="free" />
                        <TableRow id="2" num="2" name="game name" playersNum="5/15" access="closed" />
                        <TableRow id="3" num="3" name="game name" playersNum="8/15" access="free" />
                    </tbody>
                </table>
                <Link 
                    className="d-grid gap-2 col-6 mx-auto" 
                    to={useLocation().pathname === "/saboteur/1" ? "/saboteur/1/new%20game" : "/saboteur/2/new%20game"}
                >
                    <button className="btn btn-outline-light font1-5rem">New Game</button>
                </Link>
            </div>
        </div>
    );
}

export default GamesList;