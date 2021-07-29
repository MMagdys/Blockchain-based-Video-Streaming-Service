const SubscriptionModel =  require('../../models/Subscription/Subscription')
const Elliptic = require('../../lib/crypto/Elliptic')

exports.getChannelInfo = (contentTrie, channelId) => {

    return new Promise ( async (resolve, reject) => {

        let channelInfo = await contentTrie.getChannel(channelId)
        if(channelInfo != null){
            SubscriptionModel.findOne({channelId: channelId})
            .then((subscription) => {
                if(subscription)
                    resolve({...channelInfo, subscribed: true})
                else
                    resolve({...channelInfo, subscribed: false})
            })    
        }
        else{
            resolve(null)
        }
           
    })
}

exports.getAllSubscriptions = () => {

    return new Promise ( async (resolve, reject) => {
        SubscriptionModel.find({})
        .then((subscriptions) => {
            resolve(subscriptions)
        })
    })
}


exports.subscrieToChannel = (channelId) => {

    return new Promise ( async (resolve, reject) => {
        let subscription = new SubscriptionModel({channelId: channelId})
        subscription.save()
        .then((subscription) => {
            resolve(subscription)
        })
    })
}


exports.unSubscrieToChannel = (channelId) => {

    return new Promise ( async (resolve, reject) => {
        SubscriptionModel.deleteOne({channelId: channelId})
        .then((subscription) => {
            resolve(true)
        })
    })
}


exports.login = (contentTrie, params) => {

    return new Promise ( async (resolve, reject) => {
        let {pub, pri, username} = params
        let message = "muhammad"
        let result = await Elliptic.verifySignature(message, Elliptic.sign(message, pri), pub)
        if(result === true){
            let channel = await contentTrie.getChannel(username)
            if(channel){
                if(channel.pubKey === pub){
                    resolve({id: channel.id, name: channel.name})
                }
            }
            reject(false)
        }
        else{
            reject(false)
        }
    })
}


