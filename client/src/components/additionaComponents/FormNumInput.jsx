function FormNumInput (promp) {
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
                type="number" 
                name={ promp.inputName } 
                onChange={promp.passFunction} 
                value={ promp.passValue } 
                min={ promp.minValue } 
                max={ promp.maxValue } 
                placeholder={ promp.placeholder }
            />
        </div>
    )
}

export default FormNumInput;