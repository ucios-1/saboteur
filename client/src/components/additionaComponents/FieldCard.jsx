function FieldCard (promp) {
    return (
        <div key={promp.key} id={promp.id} className={promp.className} onDragOver={promp.allowDrag} onDrop={promp.endDrop}></div>
    )
}

export default FieldCard;