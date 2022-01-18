
function TableRow(props) {
    // disable button if players queue is full 
    function isActive (num1, num2, link) {
        return (
            num1 > num2 ? 
                <button type="button" onClick={handleClick} className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal">{link}</button>
                :
                <button type="button" className="btn btn-outline-dark" data-bs-toggle="modal" data-bs-target="#exampleModal" disabled>{link}</button>
        )
    }

    // call function from gameList level
    function handleClick() {
        props.enterGame(prevValue => {
            return {
                ...prevValue, 
                id: props.id,
                access: props.access
            }
        });
    }

    return (
        <tr>
            <th scope="row">{props.num}</th>
            <td>{props.name}</td>
            <td>{props.players + "/" + props.maxPlayers}</td>
            <td>{props.access}</td>
            <td>{isActive(props.maxPlayers, props.players, props.link)}</td>
        </tr>
    )
}

export default TableRow;