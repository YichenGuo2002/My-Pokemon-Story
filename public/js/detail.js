const fetchPoke = async (id = 1) => {
    id = Number(id);
    if(!Number.isInteger(id) || id <= 0 || id >= 905)
    {
        return null;
    }
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let data = await response.json();
    return data;
}

const nameAddUpperCase = (pName) =>{
    return pName.slice(0,1).toUpperCase() + pName.slice(1).toLowerCase();
}

const searchBtn = document.getElementById('searchBtn');
const searchIpt = document.getElementById('searchIpt');
const urlQueryStrings = new URLSearchParams(window.location.search); //All query strings passed in
const findP = async function(id = 1){
    let pokemon = await fetchPoke(id);
    if(pokemon){
        document.getElementById('pimage').src = `https://static.pokemonpets.com/images/monsters-images-300-300/${pokemon['id']}-${pokemon['name']}.webp`;
        document.getElementById('pname').innerText = nameAddUpperCase(pokemon['name']);
        document.getElementById('pid').innerText = pokemon['id'];
        document.getElementById('ptype').innerText = pokemon['types'][0]['type']['name'];
        document.getElementById('pweight').innerText = pokemon['weight'].toString();
    }
    else{
        document.getElementById('result').style = "display:none";
        let noText = document.createElement("p");
        noText.innerText = "Pokemon not found. Please try an id number between 1 and 905."
        document.getElementById('noResult').appendChild(noText);
    }
}
searchBtn.onclick = function(){
    window.location = `detail?pId=${searchIpt.value}`;
}

window.onload = function(){
    if(urlQueryStrings.has('pId')){
        findP(Number(urlQueryStrings.get('pId')));
    }
    else{
        document.getElementById('result').style = "display:none";
    }
}