function FormNumInput (props) {
    return (
        <div className="form-input-separator col-sm-12">
            <label 
                htmlFor={ props.forInput }
                className="form-label"
            >
                { props.labelText }
            </label>
            <input 
                className="form-control" 
                type="number" 
                name={ props.inputName } 
                onChange={props.passFunction} 
                value={ props.passValue } 
                min={ props.minValue } 
                max={ props.maxValue } 
                placeholder={ props.placeholder }
            />
        </div>
    )
}

export default FormNumInput;