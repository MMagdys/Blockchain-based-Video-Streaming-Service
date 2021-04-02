var WebTorrent = require('webtorrent-hybrid')

var client = new WebTorrent()


exports.seedVideo = (videoPath) => {

    return new Promise ( (resolve, reject) => {

        client.seed(videoPath, (torrent) => {
            console.log('Client is seeding ' + torrent.magnetURI)
            resolve (torrent.magnetURI)
        })
    })
}

// exports.streamVideo = (videoPath) => {

//     client.add(videoPath, (torrent) => {
//         console.log(torrent)
//         var file = torrent.files.find(function (file) {
//             return file.name.endsWith('.mp4')
//         })
//     })

// }

function getVideoInTorrentClient(){

    return new Promise ( (resolve, reject) => {
        let videosList = [];
        client.torrents.filter((videoObject) => {
            console.log(videoObject.name, videoObject.infoHash);
            return videosList.push(String.raw`${videoObject.infoHash.toUpperCase()}`)
        })
        console.log(videosList)
        resolve(videosList)
    })
}


exports.addVideo = function addVideo(VideoId) {

    return new Promise ( (resolve, reject) => {
        // console.log(VideoId)
        try {
            getVideoInTorrentClient()
            .then((addedVideos) => {
                console.log(addedVideos, String.raw`${VideoId.toUpperCase()}`, addedVideos.includes(VideoId))
                if(addedVideos.includes(VideoId)){
                    resolve('Already existing Video')
                }
                else{
                    client.add(VideoId, async function (torrent) {
                        var file = await torrent.files.find(function (file) {
                            console.log(file.name)
                            return file.name.endsWith('.mp4')
                        })
                        resolve('Video Added')
                    });
                }
            })
        } catch (err) {
            console.log(err)
            reject(err)
        }
    }) 
}


exports.streamVideo = function streamVideo(VideoId){

    try {
        var torrent = client.get(VideoId);
        var file = torrent.files.find(function (file) {
            return file.name.endsWith('.mp4')
        })
        return(file)
    } catch (err) {
        console.log(err)
        return(err)
    }
}