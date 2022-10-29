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

console.log("connected");
const searchBtn = document.getElementById('searchBtn');
const searchIpt = document.getElementById('searchIpt');
searchBtn.onclick = async function(){
    let pokemon = await fetchPoke(searchIpt.value);
    document.getElementById('pimage').src = `https://static.pokemonpets.com/images/monsters-images-300-300/${pokemon['id']}-${pokemon['name']}.webp`;
    document.getElementById('pname').innerText = pokemon['name'];
    document.getElementById('pid').innerText = pokemon['id'];
    document.getElementById('ptype').innerText = pokemon['types'][0]['type']['name'];
    document.getElementById('pweight').innerText = pokemon['weight'].toString();
}