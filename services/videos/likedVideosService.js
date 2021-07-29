const LikedVideoModel = require('../../models/videos/LikedVideoModel')


exports.likeVideo = (params) => {

    return new Promise ( (resolve, reject) => {
       let like = new LikedVideoModel({
        metaDataHash: params.hash, 
        channelId: params.channelId
       })
       like.save()
       .then((liked) => {
           resolve(liked)
       })
    })
}


exports.unLikeVideo = (params) => {

    return new Promise ( (resolve, reject) => {
        
        LikedVideoModel.deleteOne({_id: params._id})
        .then((video) => {
           resolve(true)
        })
        .catch((err) => {
            reject(err)
        })
    })
}


exports.getAllLikes = (contentTrie) => {
    return new Promise ( (resolve, reject) => {
        
        LikedVideoModel.find({})
        .then((likedVideos) => {
            populateVideos(likedVideos, contentTrie)
            .then((likedVideosInfo) => {
                resolve(likedVideosInfo)
            })
        }) 
    })
}


function populateVideos(videos, contentTrie){
    
    return new Promise ( (resolve, reject) => {
        videosInfo = []
        for(var i = 0; i < videos.length; i++){
            // console.log(i, videos.length, videos[i].channelId)
            channel = contentTrie.getChannel(videos[i].channelId)
            videosInfo.push({
                metaData: channel.contents.filter((meta) => meta.hash == videos[i].metaDataHash)[0],
                channelId: videos[i].channelId,
                _id: videos[i]._id
            })
        }
        resolve(videosInfo)
    })

}