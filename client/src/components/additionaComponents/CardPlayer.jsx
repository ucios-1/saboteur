import MinerStatus from "./subComponent/minerStatus.jsx";

function PlayerCard (props) {
    return (
        <div id={props.id} className={`card card-player ${props.active}`}>
            <div className="card-body flex-center-hor flex-space-beetwen">
                <div className="card-player-name">
                    <h5>{ props.player }</h5>
                    <p>{ props.role }</p>
                </div>
                <div className="player-money flex-center">
                    <div className="money-icon flex-center">
                        <img src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-gold-man-accessories-kiranshastry-lineal-color-kiranshastry.png" alt="icon of gold bar"/>
                    </div>
                    <p className="money-score">{props.money}</p>
                </div>
            </div>
            <hr></hr>
            <div className="card-body flex-center-hor flex-space-around">
                <MinerStatus 
                    key={props.player + "-latern"}
                    crossOut={"hidden"}
                    status={"fixed"}
                    tool={"status-latern"}
                />
                <MinerStatus
                    key={props.player + "-pickaxe"}
                    crossOut={"hidden"}
                    status={"fixed"}
                    tool={"status-pickaxe"}
                />
                <MinerStatus 
                    key={props.player + "-trolley"}
                    crossOut={""}
                    status={"broken"}
                    tool={"status-trolley"}
                />
            </div>
        </div>
    );
}

export default PlayerCard;