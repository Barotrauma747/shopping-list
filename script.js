// Get everything I want to work with into the global scope:
const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');

function addItem(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    //Validate Input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    //Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(newItem));

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    //Add li to the DOM
    itemList.appendChild(li);

    checkUI(); //we check the UI if we have any items and then execute the checkUI()-function accordingly - if we don't do that here, we won't have the "clear all" button even after we added items

    itemInput.value = ''; //so the input field clears after submit
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}


function removeItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        e.target.parentElement.parentElement.remove();
    }
}
//Explanation: the with the e.target we look at what we click - then we go for the parent element and check the class list of that element - if that element contains 'remove-item' (which our button-class in html does) then that's what we're choosing.
//And if all of that is true, then we want to remove the parent element of the parent element of our target - we target (click) the icon - the parent element of the icon is the button-element and the parent element of the button is the li-element


function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }
}
//Explanation: we take the entire item List and then make sure it as a firstChild (so the first li) - as long as that is true we remove that li-element. And we're doing that in a while-loop and therefor clear the entire list with the "clear all" button


//Check UI-Function to check the "state" of the app
function checkUI() {

    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }
}
/*Explanation:
First we select all list-items - we have to do it here and NOT in the global scope - because if it's defined then it's already defined. That means if we add a list item later on then this won't change and therefor our checkUI-function wouldn't be triggered (or not triggered in this case)
Then we change the CSS-Style of the button according to the length of our nodeList tha we got with the "itemList.querySelectorAll" method. If the length is 0 then we have no items and therefor the button should disappear
*/

// Event Listeners
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', removeItem);
clearBtn.addEventListener('click', clearItems);


checkUI(); //check when the page loads