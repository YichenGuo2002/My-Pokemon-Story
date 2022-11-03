
const createList = document.getElementById('createList');
const displayList = document.getElementById('displayList');
createList.onclick = () =>{
    let listForm = document.createElement('form');
    listForm.method = "POST";
    listForm.action = "addList";
    let listInput = document.createElement('input');
    listInput.type="text";
    listInput.name="listTitle";
    listInput.placeholder="Title";
    let listSubmit = document.createElement('input');
    listSubmit.type = "submit";
    listSubmit.value = "Create new empty list";

    listForm.appendChild(listInput);
    listForm.appendChild(listSubmit);
    displayList.appendChild(listForm);
    createList.style = "display:none;";
}