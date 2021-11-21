function FormTextInput(promp) {
    return (
        <div className="form-input-separator col-sm-12">
            <label 
                for={ promp.forInput } 
                className="form-label"
            >
                { promp.labelText }
            </label>
            <input 
                className="form-control" 
                type="text" 
                name={ promp.inputName } 
                onChange={ promp.passFunction } 
                value={ promp.passValue } 
                placeholder={ promp.placeholder }
            />
        </div>
    );
}

export default FormTextInput;