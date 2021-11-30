
function TableRow(param) {
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
        param.enterGame(prevValue => {
            return {
                ...prevValue, 
                id: param.id,
                access: param.access
            }
        });
    }

    return (
        <tr>
            <th scope="row">{param.num}</th>
            <td>{param.name}</td>
            <td>{param.players + "/" + param.maxPlayers}</td>
            <td>{param.access}</td>
            <td>{isActive(param.maxPlayers, param.players, param.link)}</td>
        </tr>
    )
}

export default TableRow;