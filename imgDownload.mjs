import download from 'image-downloader';

function downloadImage(url, filepath) {
    return download.image({
       url,
       dest: filepath 
    });
}