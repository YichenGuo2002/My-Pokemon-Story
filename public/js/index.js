let homeButton = document.getElementById('homeButton');

homeButton.onclick = () =>{
    window.location = `all`;
}
/*
let imageLimit = 1000;
let image
let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

function disableScroll() {
    // Get the current page scroll position 
        // if any scroll is attempted, set this to the previous value
        window.onscroll = function() {
            scrollLeft += scrollTop - imageLimit;
            window.scrollTo(scrollLeft, scrollTop);
        };
}
  
function enableScroll() {
    window.onscroll = function() {};
}

if(scrollTop = &&){
    disableScroll();
}
*/

