import saboteur1 from "../images/saboteur1_cover.jpg";
import saboteur2 from "../images/saboteur2_cover.png";
import { Link } from "react-router-dom";
import Navbar from "./additionaComponents/Navbar";

function Games(){
    return(
        <div>
            <Navbar />
            <div className="container">
                <header className="games">
                    <Link to="/saboteur/1"><img src={saboteur1} className="saboteur-cover" alt="Saboteur cover page" /></Link>
                    {/* <Link className="disabled-link" to="/saboteur/2"> */ }<img src={saboteur2} className="saboteur-cover disabled-link" alt="Saboteur second part cover page" /> { /* </Link>              */}
                </header>
            </div>
        </div>
    );
}

export default Games;