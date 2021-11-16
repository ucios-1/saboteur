function TableRow(props) {
    return (
        <tr>
            <th scope="row">{props.num}</th>
            <td>{props.name}</td>
            <td>{props.playersNum}</td>
            <td>{props.access}</td>
        </tr>
    )
}

export default TableRow;