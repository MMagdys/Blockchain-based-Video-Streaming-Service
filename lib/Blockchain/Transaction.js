const MetaData =  require('./MetaData')

class Input {

    constructor(meta, channelId, signature){
        this.metadata = meta
        this.channelId = channelId
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
     * @param {double} param1 : MetaData ID
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
    constructor(param1, param2, param3, param4) {
        // console.log(param1, param2, typeof(param1), typeof(param2))
        if (param1, param2, param3, param4) {
            // console.log("Constractor 1")
            this.inputs = new Input(param1, param2, param3)
            this.outputs = new Output(param4)
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

    addInput(meta, sig) {
        let newInput = new Input(meta, sig)
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