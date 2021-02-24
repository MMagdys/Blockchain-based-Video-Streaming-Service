class Input {

    constructor(prevTxHash, outputIndex, signature){
        this.prevTxHash = prevTxHash
        this.outputIndex = outputIndex
        this.signature = signature
    }
        
}


class Output {

    constructor(address){
        this.address = address
    }
        
}


class Transaction {

    /**
     * 
     * IN CASE OF UPLOADING NEW CONTENT OR SHARING ACCESS
     * @param {double} param1 : Media ID
     * @param {address} param2 : aaddress
     * 
     * IN CASE OF NEW CONTENT
     * @param {undefined} param1 
     * @param {undefined} param2 
     * 
     * IN CASE OF EXISTING TX
     * @param {Array of Transactions} param1 
     * @param {undefined} param2 
     */
    constructor(param1, param2) {
        // console.log(param1, param2, typeof(param1), typeof(param2))
        if (param1, param2) {
            // console.log("Constractor 1")
            this.inputs
            this.outputs
            this.hash
            this.contentBase = true
        }
        else if (!param1 && !param2) {
            // console.log("Constractor 2")
            this.inputs = []
            this.outputs = []
            this.hash
            this.contentBase = false
        }
        else if (param1 && !param2) {
            // console.log("Constractor 3")
            this.inputs = param1.inputs
            this.outputs = param1.outputs
            this.hash = param1.hash
            this.contentBase = param1.contentBase
        }
    }

    isContentBase() {
        return this.contentBase 
    }

    addInput(prevHash, index) {
        let newInput = new Input(prevHash, index)
        this.inputs.push(newInput)
    }

    addOutput(address) {
        let newOutput = new Output(address)
        this.outputs.push(newOutput)
    }

    isValid() {
        console.log("Verifing Transaction")
        return true
    }

}

module.exports = Transaction