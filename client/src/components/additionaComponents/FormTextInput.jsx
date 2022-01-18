function FormTextInput(props) {
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
                type={ props.type } 
                name={ props.inputName } 
                onChange={ props.passFunction } 
                value={ props.passValue } 
                placeholder={ props.placeholder }
            />
        </div>
    );
}

export default FormTextInput;