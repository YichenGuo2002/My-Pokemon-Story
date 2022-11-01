const fetchUrl = async(url) =>{
    let response = await fetch(url);
    let data = await response.json()
    return data;
}

const fetchPoke = async (id = 1) => {
    id = Number(id);
    if(!Number.isInteger(id) || id <= 0 || id >= 905)
    {
        return null;
    }
    return await fetchUrl(`https://pokeapi.co/api/v2/pokemon/${id}/`);
}

const toAddUpperCase = (pName) =>{
    return pName.slice(0,1).toUpperCase() + pName.slice(1).toLowerCase();
}

const searchBtn = document.getElementById('searchBtn');
const searchIpt = document.getElementById('searchIpt');
const urlQueryStrings = new URLSearchParams(window.location.search); //All query strings passed in

const findP = async function(id = 1){
    let pokemon = await fetchPoke(id);
    if(pokemon){
        document.getElementById('pimage').src = `https://static.pokemonpets.com/images/monsters-images-300-300/${pokemon['id']}-${pokemon['name']}.webp`;
        document.getElementById('pname').innerText = toAddUpperCase(pokemon['name']);
        document.getElementById('pid').innerText = pokemon['id'];

        //Get ability and ability description section
        //Solved running async function in each ability loop. Source: https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
        //Basically, I need to use for(of) structure instead of forEach()
        const getAbility = async (pokemon) => {
            let abilityString = '';
            for (const eachAbility of pokemon['abilities']){
                abilityString += '<br>' + toAddUpperCase(eachAbility['ability']['name']);
                if(eachAbility['is_hidden']){
                    abilityString += '(hidden ability)';
                }
                abilityString += '<br>';
                let abilityData = await fetchUrl(eachAbility['ability']['url']);
                let filteredData = abilityData['effect_entries'].filter((eachEntry) =>{
                        return eachEntry['language']['name'] == 'en';
                    })
                abilityString = abilityString + filteredData[0]['effect'];
            };
            return abilityString;
        }
        document.getElementById('pability').innerHTML = await getAbility(pokemon);
        // Get ability and ability description section ends

        document.getElementById('ptype').innerText = pokemon['types'].reduce((typeString, eachType) => {
            return typeString + toAddUpperCase(eachType['type']['name']) + ` `;
        }, '');
        document.getElementById('pheight').innerText = `${pokemon['height']/10}m`;
        document.getElementById('pweight').innerText = `${pokemon['weight']/10}kg`;
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