import { Link } from "react-router-dom";

function About(){
    return(
        <div className="App">
            <header className="App-header">
                <p>
                Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
                >
                Learn React
                </a>

                <button><Link to="/">CLick me!</Link></button>
                
            </header>
        </div>
    );
}

export default About;