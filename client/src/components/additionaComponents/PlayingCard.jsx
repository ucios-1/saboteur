function PlayingCard (props) {
    var card = "col field field-playing-card playing-card ";

    function activateMe(e) {
        
        // add "playing-card-active" to current element
        const target = e.target;
        target.classList.toggle("playing-card-active");

        // find all elements with class "playing-card" and remove "playing-card-active" from classLIst
        const siblings = document.getElementsByClassName("playing-card");
        for(let i = 0; i < siblings.length; i++) {
            if(siblings[i] !== target) {
                siblings[i].classList.remove("playing-card-active")
            }
        }
    }

    switch(props.cardName) {
        case "tunnel-crossroads-x":
            card += "card-array1 ";
            break;
        case "tunnel-crossroads-t-hor":
            card += "card-array1 ";
            break;
        case "tunnel-crossroads-t-ver":
            card += "card-array1 ";
            break;
        case "tunnel-straightforward":
            card += "card-array1 ";
            break;
        case "tunnel-across":
            card += "card-array1 ";
            break;
        case "tunnel-turn-right":
            card += "card-array1 ";
            break;
        case "tunnel-turn-left":
            card += "card-array1 ";
            break;
        case "deadend-up-and-down":
            card += "card-array1 ";
            break;
        case "deadend-left-and-right":
            card += "card-array1 ";
            break;
        case "deadend-crossroads-x":
            card += "card-array1 ";
            break;
        case "deadend-crossroads-t-ver":
            card += "card-array1 ";
            break;
        case "deadend-crossroads-t-hor":
            card += "card-array1 ";
            break;
        case "deadend-down":
            card += "card-array1 ";
            break;
        case "deadend-down-and-left":
            card += "card-array1 ";
            break;
        case "deadend-down-and-right":
            card += "card-array1 ";
            break;
        case "deadend-left":
            card += "card-array1 ";
            break;
        default:
            card += "card-array2 ";
    }

    card += props.cardName;

    return (
        <div id={props.id} className={card} onClick={activateMe} onDragStart={props.drugFunction} draggable="true"></div>
    )
}

export default PlayingCard;