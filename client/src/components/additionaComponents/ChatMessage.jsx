function chatMessage (props) {
    return (
        <div className={ props.align }>
            <div className="mssg-header">
                <div className="player-name">
                    { props.name }
                </div>
                <div className="message-time">
                    { props.time }
                </div>
            </div>
            <div className="message-body">
                { props.mssg }
            </div>
        </div>
    )
}

export default chatMessage;