
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
    listInput.style="border-top-right-radius:0;border-bottom-right-radius:0; margin-top:15px; margin-bottom:15px;";
    listInput.style.setProperty("--c", "rgb(56, 106, 187)");
    
    let listSubmit = document.createElement('input');
    listSubmit.type = "submit";
    listSubmit.value = "Create new empty list";
    listSubmit.style = "border-top-left-radius:0;border-bottom-left-radius:0;";

    listForm.appendChild(listInput);
    listForm.appendChild(listSubmit);
    displayList.appendChild(listForm);
    createList.style = "display:none;";
}