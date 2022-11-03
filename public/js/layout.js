const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');


/*
searchButton.onclick = () => {
    window.location = `detail?pId=${searchInput.value}`;
}
*/

searchInput.addEventListener('focus', (event) => {
    searchButton.style = "box-shadow: 0 0 5px  rgba(56,106,187,1);";
    // Cannot use reference css color searchButton.style = "box-shadow: 0 0 5px  var(--main-border-radius):";
  });

  searchInput.addEventListener('blur', (event) => {
    searchButton.style = "box-shadow:none;";
  });