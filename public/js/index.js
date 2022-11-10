let homeButton = document.getElementById('homeButton');
let registerButton = document.getElementById('registerButton');
let friendButton = document.getElementById('friendButton');

homeButton.onclick = () =>{
    window.location = `all`;
}
registerButton.onclick = () =>{
    window.location = `register`;
}
friendButton.onclick = () =>{
    window.location = `fyp`;
}


const see = () => {
    let windowTop = window.pageYOffset || document.documentElement.scrollTop;
    let elementTop = document.getElementById('login').offsetTop;
    let leftPosition = windowTop - elementTop + 470;
    if(leftPosition < 350){
        document.getElementById("loginPicture").style.left = `${leftPosition}`;
    }
    else{
        document.getElementById("loginPicture").style.left = `350px`;
    }
}

const see2 = () =>{
    let windowTop = window.pageYOffset || document.documentElement.scrollTop;
    let elementTop = document.getElementById('friend').offsetTop;
    let rightPosition = windowTop - elementTop + 150;
    if(rightPosition < 250){
        document.getElementById("friendPicture").style.right = `${rightPosition}`;
    }
    else{
        document.getElementById("friendPicture").style.right = `250px`;
    }
}

window.addEventListener("scroll", see);
window.addEventListener("scroll", see2);
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

