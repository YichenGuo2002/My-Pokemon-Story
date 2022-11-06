// Optimized jw-paginate.js to add pagination. Source code:https://jasonwatmore.com/post/2018/08/07/javascript-pure-pagination-logic-in-vanilla-js-typescript
function paginate(totalItems, currentPage, pageSize, maxPages) {
    if (currentPage === void 0) { currentPage = 1; }
    if (pageSize === void 0) { pageSize = 10; }
    if (maxPages === void 0) { maxPages = 10; }
    // calculate total pages
    var totalPages = Math.ceil(totalItems / pageSize);
    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    }
    else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    var startPage, endPage;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    }
    else {
        // total pages more than max so calculate start and end pages
        var maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        var maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        }
        else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        }
        else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }
    // calculate start and end item indexes
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
    // create an array of pages to ng-repeat in the pager control
    var pages = Array.from(Array((endPage + 1) - startPage).keys()).map(function (i) { return startPage + i; });
    // return object with all pager properties required by the view
    let result = {
        totalItems: totalItems,
        currentPage: currentPage,
        pageSize: pageSize,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        startIndex: startIndex,
        endIndex: endIndex,
        pages: pages
    };
    return result;
}

//Algorithm ends here.
//---------------------------------------------------------------------------------------------------------

const nameAddUpperCase = (pName) =>{
    return pName.slice(0,1).toUpperCase() + pName.slice(1).toLowerCase();
}

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

const typeConvertToTcpPicture = (pokemon) => {
    const allTypes = {
        Grass: ['Grass', 'Bug'],
        Fire:['Fire'],
        Water:[	'Water','Ice'],
        Lightning:['Electric'],
        Fighting:['Fighting','Rock', 'Ground'],
        Psychic:['Psychic','Ghost','Poison','Fairy'],
        Colorless:['Normal', 'Flying'],
        Darkness:['Dark', 'Poison'],
        Metal:['Steel'],
        Dragon:['Dragon']
    };
    let type = nameAddUpperCase(pokemon['types'][0]['type']['name']);
    let tcpType;
    Object.keys(allTypes).forEach((eachKey, eachIndex) =>{
        allTypes[eachKey].forEach((eachType) => {
            if(type == eachType){
                tcpType = eachKey;
            }
        })
    });
    if(tcpType){
        return `../public/image/types/${tcpType}.png`;
    }
    else{
        return null;
    }
}

let allPictures = document.getElementById("allPictures");
const displayPicture = async(pageNumber = 1) =>{
    pageNumber = Number(pageNumber) - 1;
    let pImg;
    let pText;
    let pDiv;
    for(let i = 1 + pageNumber * 50; i - pageNumber * 50 <= 50; i++){
        pImg = document.createElement("img");
        pText = document.createElement("p");
        pLink = document.createElement("a");
        pDiv = document.createElement("div");
        let pokemon = await fetchPoke(i);
        if(pokemon){
            /*pImg.src = `https://static.pokemonpets.com/images/monsters-images-300-300/${pokemon['id']}-${pokemon['name']}.webp`;*/
            pImg.src=`https://img.yakkun.com/poke/icon960/n${pokemon['id']}.png`;
            pImg.style = "width:300px; height: 300px;object-fit: contain;"
            pText.innerText = `${pokemon['id']} - ${nameAddUpperCase(pokemon.name)}`;
            pLink.href = `detail?pId=${pokemon['id']}`;
            pDiv.style = `width:420px; height: 590px; margin: 15px; border: 2px dotted black; background-image:url("${typeConvertToTcpPicture(pokemon)}")`;
            pLink.appendChild(pImg);
            pLink.appendChild(pText);
            pDiv.appendChild(pLink);
            allPictures.appendChild(pDiv);
        }
    }
}

const displayPagination = async (pagination)=>{
    displayPicture(Number(pagination['currentPage']));
    pagination['pages'].forEach((pageNumber) =>{
        pageLink = document.createElement("a");
        pageList = document.createElement("li");
        pageLink.innerText = `${pageNumber}`;
        pageLink.href = `all?page=${pageNumber}`;
        pageList.appendChild(pageLink);
        document.getElementById('paginationList').append(pageList);
    });
    document.getElementById('currentPage').innerText = pagination['currentPage'];
    if(pagination['currentPage'] === 1){
        document.getElementById('previousPage').style = "display:none";
    }
    else{
        document.getElementById('previousPage').href = `all?page=${pagination['currentPage']-1}`;
    }
    if(pagination['currentPage'] === pagination['totalPages']){
        document.getElementById('nextPage').style = "display:none";
    }
    else{
        document.getElementById('nextPage').href = `all?page=${pagination['currentPage']+1}`;
    }
}

window.onload = async function(){
    let urlQueryStrings = new URLSearchParams(window.location.search); //All query strings passed in
    let pagination;
    if(urlQueryStrings.has('page'))
    {
        pagination = paginate(905,Number(urlQueryStrings.get('page')),50,6);
        displayPagination(pagination);
    }
    else
    {
        pagination = paginate(905,1,50,6);
        displayPagination(pagination);
    }
}