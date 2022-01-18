function returnPlayer (props) {
    return <li className="list-group-item d-flex justify-content-between align-items-start">
                { props.name }
                <span className="badge bg-warning text-dark rounded-pill">
                    { props.gold }
                </span>
            </li>
}

export default returnPlayer;