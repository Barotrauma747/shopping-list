// Get everything I want to work with into the global scope:
const itemForm = document.querySelector('#item-form');
const itemInput = document.querySelector('#item-input');
const itemList = document.querySelector('#item-list');
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI(); //We have to add this so we can see the filter and clear all fields again
}
//Explanation: The eventListener listens to DOMContentLoaded on the document itself - so if the page is loading it's checking for the DOM content/the items currently in local storage.
//Then we go and get the items from the local storage again with our getItemsFromStorage() function and attach it to a const so we can use them.
//Finally we loop through each item and add that item to our DOM so they are displayed again
//Since at this point in the course we haven't implemented a function to remove these items from the local storage all the items from the storage will always be displayed on page-reload


function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;

    //Validate Input
    if (newItem === '') {
        alert('Please add an item');
        return;
    }

    //Create item DOM element with the newItem const as argument
    addItemToDOM(newItem);

    //Add item to local storage with the newItem const as argument
    addItemToStorage(newItem);

    checkUI(); //we check the UI if we have any items and then execute the checkUI()-function accordingly - if we don't do that here, we won't have the "clear all" button even after we added items

    itemInput.value = ''; //so the input field clears after submit
}

function addItemToDOM(item) {

    //Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item)); //the argument had to be changed from "newItem" to "item" because now it takes the argument from the addItemToDOM function - which takes the argument from the function call in the onAddItemSubmit function

    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);

    //Add li to the DOM
    itemList.appendChild(li);
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


function addItemToStorage(item) {
    
    const itemsFromStorage = getItemsFromStorage(); //this was implemented to replace the commented out section below

    /*This is the initial way we did it before the getItemsFromSTorage function was implemented

    let itemsFromStorage; //represents the array of items from local storage
    
    //Check if anything is in the local storage
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = []; //'items' is the key of the key/value pair - I could call it 'poop' if I wanted to. If there are none then we set the array to empty
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items')); //without the "JSON.parse()" it would just give us a string instead of an array. but this way it gives us the array (which is called "itemsFromStorage") with the items inside
    }
    */

    // Add the new Item to our array (itemsFromStorage)
    itemsFromStorage.push(item);

    // Convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
    //this turns it back into a string and puts it into local storage - we can't put an array into local storage - only strings - so that's why we're converting back-and-forth
}


function getItemsFromStorage() {

    //The "let" and "if" section is copied from the addItemToStorage function
    let itemsFromStorage;
    
    //Check if anything is in the local storage
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = []; 
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items')); 
    }

    return itemsFromStorage; // This way we have the items to work with

}


function onClickItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        removeItem(e.target.parentElement.parentElement);
    } else {
        setItemToEdit(e.target);
    }
}
//Explanation: First we check if it is the delete button by checking wether it contains the 'remove-item' class. If it is then we remove the entire item by calling our removeItem() function. The item is the parent of our targets parent element - the parent element of our target is the "x" button - and the parent of that is the actual item we want to remove


function setItemToEdit(item) {
    isEditMode = true;

    itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add =('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}


function removeItem(item) {
    if (confirm('Are you sure?')) {
        //Remove item from DOM
        item.remove();

        //Remove item from storage
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}
//Explanation: First we set a confirm alert - if its confirmed then we remove the item - important here is that the "item" we pass as argument for the function is the item that comes from the call in the onClickItem function (so: e.target.parentElement.parentElement) - that's why we can just use the default remove() method on it - this only removes it from the DOM
//Then we remove the item from storage by calling a function we then had to write. There we're passing the text content of our item as argument


function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();

    //Filter out item to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Re-set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
//Explanation: First we get the items from storage (we need to use "let" here so we can work with those items). Then we have to filter which item we actually want to remove - the filter-method returns a new array with all the elements that are NOT equal to the item (the "i" is just what we call it - could name it poop as well). So the "itemsFromStorage" array then has all the items we still want in our local storage
//Then we have to return that array back to local storage - therefor we use localStorage.setItem() and use 'items' as our key and "itemsFromStorage" as our values. 
//Of course in order to get them there we have to JSON.stringify that array

/* - old removeItem function before we had to remove the items from the Storage too

function removeItem(e) {
    if (e.target.parentElement.classList.contains('remove-item')) {
        if (confirm('Are you sure?')) {
        e.target.parentElement.parentElement.remove();

        checkUI();
        }
    }
}
//Explanation: the with the e.target we look at what we click - then we go for the parent element and check the class list of that element - if that element contains 'remove-item' (which our button-class in html does) then that's what we're choosing.
//And if all of that is true, then we want to remove the parent element of the parent element of our target - we target (click) the icon - the parent element of the icon is the button-element and the parent element of the button is the li-element
//Then we added an additional if-part that wrapped the removal method - we added an alert prompt via the "confirm()" method
//finally the checkUI function was called so we can remove the "clear all" and "filter" elements after everything is gone
*/

function clearItems() {
    while (itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    }

    //Clear from localStorage
    localStorage.removeItem('items');
    
    checkUI();
}
//Explanation: we take the entire item List and then make sure it has a firstChild (so the first li) - as long as that is true we remove that li-element. And we're doing that in a while-loop and therefor clear the entire list with the "clear all" button
//Added a call for checkUI() after the while loop so we can remove the buttons if nothing is there anymore
//Added a clear from localStorage section where we call the removeItem() function on our local storage and only pass the key 'items' - that way all the items get removed from the local storage


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
First we select all list-items - we have to do it here and NOT in the global scope - because if it's defined then it's already defined. That means if we add a list item later on then this won't change and therefor our checkUI-function wouldn't be triggered

Then we change the CSS-Style of the button according to the length of our nodeList tha we got with the "itemList.querySelectorAll" method. If the length is 0 then we have no items and therefor the button should disappear
*/

//My Filter-Solution
function filterItems (e) {

    const items = itemList.querySelectorAll('li');
    
    itemFilter.textContent = e.target.value;
    const input = itemFilter.textContent.toLowerCase();

    items.forEach(function(item) {

        const itemName = item.textContent.trimStart().toLowerCase();

        if (!itemName.startsWith(input)) {
            item.style.display = 'none';
        } else {
            item.style.display = 'flex';
        }
    })
    //console.log(input);
    checkUI();
}

/*
TM-Solution
function filterItems (e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex';
        } else {
            item.style.display = '';
        }
    });
}
*/
//Explanation for differences:
//item.firstChild.textContent => I'm just additionally targeting the first Child and then go for the text content
//if(itemName.indexOf(text) != -1) => so the text-const can be passed in and checked if it matches any of the itemName strings - if it does then it's true, if it doesn't then it's false - therefor: If it's true then it won't be "-1" and then we display that item in flex


//Initialize app
function init() {
// Event Listeners
itemForm.addEventListener('submit', onAddItemSubmit);
//itemList.addEventListener('click', removeItem); --> for the old removeItem function
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('keyup', filterItems);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI(); //check when the page loads
}

init();



