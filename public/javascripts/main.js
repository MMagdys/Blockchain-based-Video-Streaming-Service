const api = 'http://localhost:3000/videos/';


function stream(){
    window.infoHash = $('input').val().split('btih:')[1].split('&')[0];
    $.post(api  , {torrent: $('input').val()}, function(data) {
        var video = api + 'stream/' + infoHash;
        $('video').attr('src', video);
        // $('.input').hide();
        $('.video').show();
    });
}

function stopStreaming(){
    // $.get(api, function(data) {
        $('video').attr('src', '');
        $('input').val('');
        window.infoHash = '';
        $('.input').show();
        $('.video').hide();
    // });
}

function addToLibrary(){
    $.post(api , {torrent: $('input').val()}, function(data) {
        $.get(api, function(data) {
            console.log(data)
            data.videos.filter((vide) => {
                VideoThumbnail(vide)
            })
            
        })
    });
}

function myLibrary(){
    $.get(api + 'latest/', function(data) {
        console.log(data)
        VideoThumbnail(data.videos)
    });
}

function streamVideo(infoHash){
    console.log(infoHash)
    window.infoHash = infoHash;
    var video = api + 'stream/' + infoHash ;
    $('video').attr('src', video);
    $('.input').hide();
    $('.video').show();
}


function VideoThumbnail(videos) {

    document.getElementById("content").innerHTML = ''
    videos.filter((videoDetails) => {
        document.getElementById("content").innerHTML +='\
        <div class="col-sm-3">\
        <div class="card mb-3">\
        <svg xmlns="http://www.w3.org/2000/svg" class="d-block user-select-none"  aria-label="Placeholder: Some Images" focusable="false" role="img" preserveAspectRatio="xMidYMid slice" viewBox="0 0 318 180" style="font-size:1.125rem;text-anchor:middle">\
            <rect width="100%" height="100%" fill="#868e96"></rect>\
            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>\
        </svg>\
        <div class="card-body">\
            <h4 class="card-text">' + videoDetails.name + '</h4>\
        </div>\
        <div class="card-body">\
            <button type="button" onclick="streamVideo(this.value);" value="' + videoDetails.infoHash  + '" class="btn btn-link">stream</button>\
        </div>\
        </div>\
        </div>'
    })
}