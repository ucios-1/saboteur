function minerStatus (props) {
    return (
        <div className={`card-array2 player-status ${props.status} ${props.tool} flex-center-hor`}>
            <div className={`broken-cross ${props.crossOut}`}></div>
        </div>
    );
}

export default minerStatus;