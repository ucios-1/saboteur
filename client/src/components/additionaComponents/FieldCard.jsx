function FieldCard (props) {
    return (
        <div key={props.key} id={props.id} className={props.className} onDragOver={props.allowDrag} onDrop={props.endDrop}></div>
    )
}

export default FieldCard;