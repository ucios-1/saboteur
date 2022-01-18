import MinerStatus from "./subComponent/minerStatus.jsx";

function PlayerCard (props) {
    return (
        <div className="card card-player">
            <div className="card-body flex-center-hor flex-space-beetwen">
                <h5>{ props.player }</h5>
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
                <div className="player-money flex-center">
                    <div className="money-icon flex-center">
                        <img src="https://img.icons8.com/external-kiranshastry-lineal-color-kiranshastry/64/000000/external-gold-man-accessories-kiranshastry-lineal-color-kiranshastry.png" alt="icon of gold bar"/>
                    </div>
                    <p className="money-score">12</p>
                </div>
            </div>
        </div>
    );
}

export default PlayerCard;