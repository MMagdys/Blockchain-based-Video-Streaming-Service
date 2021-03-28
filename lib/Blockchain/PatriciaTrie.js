const SHA256 = require('crypto-js/sha256')

class PatriciaTrie {

    constructor() {
        this.root = {};
        this.nodes = []
    }

    addChannel (channel) {
        let tmpRoot = this.root
        let identifier = channel.id
        let char

        for(var i in identifier){
            char = identifier[i]
            if(!tmpRoot[char]){
                tmpRoot[char] = {}
            }
            tmpRoot = tmpRoot[char]
        }
        tmpRoot['data'] = channel
        this.nodes.push(channel)
    }

    getChannel(identifier) {
        let tmpRoot = this.root
        let char

        for(var i in identifier){
            char = identifier[i]
            if(tmpRoot){
                tmpRoot = tmpRoot[char]
            }
            else return null           
        }
        if(tmpRoot['data']) return tmpRoot['data']
        return null
    }

    traverse(root, found) {

        for(const char in root){
            console.log(`${char}: ${root[char]}`);
        }
    }

    getRootHash(root){
        let tmpRoot = root ? root : this.root
        if(tmpRoot['data']) return 
        for(var i in tmpRoot){
            console.log(tmpRoot[i], " child to ", tmpRoot)
            this.getRootHash(tmpRoot[i])
        }



    }
}

module.exports = PatriciaTrie