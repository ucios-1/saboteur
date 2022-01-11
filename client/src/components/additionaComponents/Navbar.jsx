import { Link } from "react-router-dom";

function Navbar(param) {
    function socketDisconnect() {
        try {
            param.socket.close();
        } catch(err) {
            console.log(err.message);
        }
    }

    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container">
                <div className="navbar-brand">
                    <img className="logo-img" src="https://ucios-1.github.io/WebCV/pictures/logo1.svg" alt="logo" />
                </div>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <Link onClick={ socketDisconnect } to="/"><li className="nav-item text-white">GAMES</li></Link>
                        <li className="nav-item text-white">ABOUT</li>
                        <li className="nav-item text-white">CONTACT</li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;