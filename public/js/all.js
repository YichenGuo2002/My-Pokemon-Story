const fetchPoke = async (id = 1) => {
    id = Number(id);
    if(!Number.isInteger(id) || id <= 0 || id >= 905)
    {
        return "Input not allowed. Must be a number between 1 and 905.";
    }
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let data = await response.json();
    return data;
}

let allPictures = document.getElementById("allPictures");
const displayPicture = async(pageNumber = 0) =>{
    let img;
    for(let i = 1 + pageNumber * 50; i - pageNumber * 50 < 50; i++){
        img = document.createElement("img");
        let pokemon = await fetchPoke(i);
        img.src = `https://static.pokemonpets.com/images/monsters-images-300-300/${pokemon['id']}-${pokemon['name']}.webp`;
        allPictures.appendChild(img);
    }
}

displayPicture();