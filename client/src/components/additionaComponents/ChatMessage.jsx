function chatMessage (param) {
    return (
        <div className={ param.align }>
            <div className="mssg-header">
                <div className="player-name">
                    { param.name }
                </div>
                <div className="message-time">
                    { param.time }
                </div>
            </div>
            <div className="message-body">
                { param.mssg }
            </div>
        </div>
    )
}

export default chatMessage;