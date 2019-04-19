// Storage Controller
const StorageCtrl = (function () {

    // Public Methods
    return {
        storeItem: function (newitem) {
            let items;
            // Ckech if there is items in local storage
            if (localStorage.getItem('items') === null) {
                items = [];
                items.push(newitem);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(newitem);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },
        getStoreditems: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (updatedItem.id === item.id) {
                    items.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach((item, index) => {
                if (id === item.id) {
                    items.splice(index, 1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        ClearLocalStorage: function () {
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const itemCtrl = (function () {

    // Item Constructor
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: StorageCtrl.getStoreditems(),
        currentItem: null,
        totalCalories: 0
    }

    // Access data 
    return {
        getItems: function () {
            return data.items;
        },
        logData: function () {
            return data;
        },
        addItem: function (name, calories) {
            // Create ID
            let ID;
            if (data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Calories to number
            calories = parseInt(calories);

            // Create a new Item
            let newItem = new Item(ID, name, calories);

            //Add to Items array
            data.items.push(newItem);

            return newItem;
        },
        getTotalCalories: function () {
            let total = 0;
            // loop through items and calculate calories
            data.items.forEach(item => { total += item.calories });
            data.totalCalories = total;
            return data.totalCalories;
        },
        getItembyId: function (id) {
            let found = null;
            //loop through items array
            data.items.forEach(item => {
                if (item.id === id) {
                    found = item
                }
            });
            return found;
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        getCurrentItem: function () {
            return data.currentItem;
        },
        updateItem: function (name, calories) {
            // calories to number 
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(item => {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })
            return found;
        },
        deleteItem: function (id) {
            // Get ids
            const ids = data.items.map(function (item) {
                return item.id;
            });

            // Get index
            const index = ids.indexOf(id);

            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function () {
            data.items = [];
        }

    }
})();


// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        editBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalcaloriesSpan: '.total-calories',
        clearBtn: '.clear-btn'

    }
    
    return {
        populateItemList: function (items) {
            let html = '';

            items.forEach(item => {
                html += `<li class="collection-item" id="item-${item.id}">
                            <strong>${item.name} =></strong> ${item.calories} Calories
                            <a href="" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>
                        </li>`;
            });

            // Show items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getSelectors: function () {
            return UISelectors;
        },
        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function (itemToAdd) {
            //Show list if hidden
            document.querySelector(UISelectors.itemList).style.display = 'block';
            //Create li element
            const li = document.createElement('li');
            // add Class
            li.className = 'collection-item';
            //add Id
            li.id = `item-${itemToAdd.id}`;
            li.innerHTML = `<strong>${itemToAdd.name} =></strong> ${itemToAdd.calories} Calories
                            <a href="" class="secondary-content">
                                <i class="edit-item fa fa-pencil"></i>
                            </a>`;
            // insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function (total) {
            document.querySelector(UISelectors.totalcaloriesSpan).innerHTML = total;
        },
        setInitialState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.editBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        addItemtoForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = itemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = itemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState: function () {
            document.querySelector(UISelectors.editBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        updateListItem: function (updatedItem) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            //Convert node list into array
            listItems = Array.from(listItems);

            listItems.forEach(listItem => {
                const itemId = listItem.getAttribute('id');
                if (itemId === `item-${updatedItem.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${updatedItem.name} =></strong> ${updatedItem.calories} Calories
                    <a href="" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`
                }

            });
        },
        deleteListItem: function (id) {
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // turn it into array
            listItems = Array.from(listItems);

            listItems.forEach(function (item) {
                item.remove();
            });
        }
    }

})();


// App Controller
const AppCtrl = (function (itemCtrl, UICtrl, StorageCtrl) {

    // load event listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });
        // edit icon Click
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateClick);

        // edit item event
        document.querySelector(UISelectors.editBtn).addEventListener('click', itemUpdateSubmit);

        // Delete button submit
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', backEvent);

        // Clear button event
        document.querySelector(UISelectors.clearBtn).addEventListener('click', ClearAllItemsClick);

    }

    //Add item submit
    const itemAddSubmit = function (e) {
        // Get form input
        const input = UICtrl.getItemInput();
        // check for name and calories input
        if (input.name !== '' && input.calories !== '') {
            // add item
            const newItem = itemCtrl.addItem(input.name, input.calories);
            // Add item to UI
            UICtrl.addListItem(newItem);
            // get total Calories
            const totalCalories = itemCtrl.getTotalCalories();
            // add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in local Storage
            StorageCtrl.storeItem(newItem);

            //Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // Click edit item
    const itemUpdateClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // get list item Id
            const listId = e.target.parentNode.parentNode.id;

            // explode listIf (item-0) to get array index
            const listIdArray = listId.split('-');
            // get the index 
            const id = parseInt(listIdArray[1]);

            // get item to update
            const itemToEdit = itemCtrl.getItembyId(id);

            //set Current item
            itemCtrl.setCurrentItem(itemToEdit);

            // add item to the form
            UICtrl.addItemtoForm();
        }
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();

        // Update item
        const updatedItem = itemCtrl.updateItem(input.name, input.calories);
        e.preventDefault();

        // Update UI
        UICtrl.updateListItem(updatedItem);

        // get total Calories
        const totalCalories = itemCtrl.getTotalCalories();
        // add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //Update locale Storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.setInitialState();
    }

    // Item delete Submit
    const itemDeleteSubmit = function (e) {
        e.preventDefault();
        // get current item
        const currentItem = itemCtrl.getCurrentItem();

        // Delete from Data structure
        itemCtrl.deleteItem(currentItem.id);

        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // get total Calories
        const totalCalories = itemCtrl.getTotalCalories();
        // add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        //delete from locale Storage
        StorageCtrl.deleteItemStorage(currentItem.id);

        UICtrl.setInitialState();

        if (itemCtrl.getItems().length === 0) {
            UICtrl.hideList();
        }


    }

    // back btn event
    const backEvent = function (e) {
        e.preventDefault();
        UICtrl.setInitialState();

    }

    // Clear items event
    const ClearAllItemsClick = function (e) {
        e.preventDefault();
        // Delete all items from DataSctructure
        itemCtrl.clearAllItems();

        //remove from UI
        UICtrl.removeItems();

        // get total Calories
        const totalCalories = itemCtrl.getTotalCalories();
        // add total calories to the UI
        UICtrl.showTotalCalories(totalCalories);

        // Clear from localStorage
        StorageCtrl.ClearLocalStorage();

        UICtrl.setInitialState();

        UICtrl.hideList();
    }



    return {
        init: function () {
            //set Initial State
            UICtrl.setInitialState();

            // get items from Data Structure
            const items = itemCtrl.getItems();

            // Load event listeners
            loadEventListeners();

            //hide list if empty
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with Items
                UICtrl.populateItemList(items);
            }

            // get total Calories
            const totalCalories = itemCtrl.getTotalCalories();
            // add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

        }
    }


})(itemCtrl, UICtrl, StorageCtrl);


// initialize the app 
AppCtrl.init();