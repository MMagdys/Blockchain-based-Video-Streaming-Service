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
}

module.exports = PatriciaTrie