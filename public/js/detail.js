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

const urlQueryStrings = new URLSearchParams(window.location.search); //All query strings passed in

const findP = async function(id = 1){
    let pokemon = await fetchPoke(id);
    if(pokemon){
        document.getElementById('pimage').src = `https://static.pokemonpets.com/images/monsters-images-300-300/${pokemon['id']}-${pokemon['name']}.webp`;
        document.getElementById('pname').innerText = toAddUpperCase(pokemon['name']);
        document.getElementById('pid').innerText = pokemon['id'];
        document.getElementById('ptype').innerText = pokemon['types'].reduce((typeString, eachType) => {
            return typeString + toAddUpperCase(eachType['type']['name']) + ` `;
        }, '');

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

        document.getElementById('pheight').innerText = `${pokemon['height']/10} m`;
        document.getElementById('pweight').innerText = `${pokemon['weight']/10} kg`;
        
        // Get base stats section
        const getStats = async (pokemon) => {
            let statsString = '';
            let statsTotal = 0;
            for(const eachStats of pokemon['stats']) {
                statsString += '<tr>';
                statsString += `<td> ${eachStats['stat']['name']} </td>`
                statsString += `<td> ${toAddUpperCase(eachStats['base_stat'].toString())} </td>`
                statsString += `<td> ${eachStats['effort']} </td>`
                statsString += '</tr>';
                statsTotal += eachStats['base_stat'];
            };
            statsString += '<tr>';
            statsString += `<td>Total</td>`;
            statsString += `<td> ${statsTotal} </td>`;
            statsString += `<td> </td>`;
            statsString += '</tr>';
            return statsString;
        }
        document.getElementById('pstats').innerHTML = await getStats(pokemon);
        // Get base stats section ends

        // Get evolution charts section
        const getEvolution = async () => { 
            let evolutionString = '';
            let speciesData = await fetchUrl(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
            let evolutionUrl = speciesData['evolution_chain']['url'];
            let evolutionData = await fetchUrl(evolutionUrl);
            evolutionString += toAddUpperCase(evolutionData['chain']['species']['name'].toString());
            evolutionData = evolutionData['chain']['evolves_to'];
            while(evolutionData.length != 0){
                evolutionString += " " + toAddUpperCase(evolutionData[0]['species']['name'].toString());
                evolutionData = evolutionData[0]['evolves_to'];
            }
            return {evolutionString:evolutionString, speciesData:speciesData};
        }
        let returnedEvolutionData = await getEvolution();
        document.getElementById('pevolution').innerHTML = returnedEvolutionData.evolutionString;
        // Get evolution charts sectiion ends

        document.getElementById('pbase').innerText = `${pokemon['base_experience']}`;

        // Get properties that are accessible through pokemon-species data
        let speciesData = returnedEvolutionData.speciesData;
        if(speciesData['gender_rate'] === -1){
            document.getElementById('pgender').innerHTML = `Genderless`;
        }
        else if (speciesData['gender_rate'] == 'NaN'){
            document.getElementById('pgender').innerHTML = `Unknown`;
        }
        else{
            document.getElementById('pgender').innerHTML = `${speciesData['gender_rate'] * 12.5}% female`;
        }
        document.getElementById('pcapture').innerHTML = `${speciesData['capture_rate']}/255`;
        let eggString ="";
        for(const eachEggGroup of speciesData['egg_groups']){
            eggString += toAddUpperCase(eachEggGroup['name'].toString()) + " ";
        }
        document.getElementById('pegg').innerHTML = `${eggString}`;
        document.getElementById('phatch').innerHTML = `${255 * (speciesData['hatch_counter'] + 1)} steps`;
        document.getElementById('pcolor').innerHTML = `${speciesData['color']['name']}`;
        document.getElementById('pshape').innerHTML = `${speciesData['shape']['name']}`;
        document.getElementById('pgrowth').innerHTML = `${speciesData['growth_rate']['name']}`;
        // Get properties that are accessible through pokemon-species data ends
    }
    else{
        document.getElementById('result').style = "display:none";
        let noText = document.createElement("p");
        noText.innerText = "Pokemon not found. Please try an id number between 1 and 905."
        document.getElementById('noResult').appendChild(noText);
    }
}

window.onload = function(){
    if(urlQueryStrings.has('pId')){
        findP(Number(urlQueryStrings.get('pId')));
    }
    else{
        document.getElementById('result').style = "display:none";
    }
}