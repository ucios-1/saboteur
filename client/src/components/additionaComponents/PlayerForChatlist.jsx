function returnPlayer (param) {
    return <li className="list-group-item d-flex justify-content-between align-items-start">
                { param.name }
                <span className="badge bg-warning text-dark rounded-pill">
                    { param.gold }
                </span>
            </li>
}

export default returnPlayer;