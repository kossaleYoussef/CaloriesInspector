// Storage Controller

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
        items: [
            //{ id: 0, name: 'Steak Dinner', calories: 1200 },
            // { id: 1, name: 'Eggs', calories: 300 },
            //{ id: 2, name: 'Cookies', calories: 700 }
        ],
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
        addItem : function(name, calories){
            // Create ID
            let ID;
            if(data.items.length > 0){
                ID = data.items[data.items.length -1].id + 1;
            }else{
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
        getTotalCalories: function(){
            let total = 0;
            // loop through items and calculate calories
            data.items.forEach(item=>{ total += item.calories});
            data.totalCalories = total;
            return data.totalCalories;
        }
        
    }
})();


// UI Controller
const UICtrl = (function () {

    const UISelectors = {
        itemList : '#item-list',
        addBtn : '.add-btn',
        itemNameInput : '#item-name',
        itemCaloriesInput : '#item-calories',
        totalcaloriesSpan: '.total-calories'
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
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem: function(itemToAdd){
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
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend',li);
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(total){
            document.querySelector(UISelectors.totalcaloriesSpan).innerHTML = total;
        }
    }

})();


// App Controller
const AppCtrl = (function (itemCtrl, UICtrl) {
    // load event listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        //add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
    }

    //Add item submit
    const itemAddSubmit = function(e){
        // Get form input
        const input = UICtrl.getItemInput();
        // check for name and calories input
        if(input.name !== '' && input.calories !== ''){
            // add item
            const newItem = itemCtrl.addItem(input.name,input.calories);
            // Add item to UI
            UICtrl.addListItem(newItem);
            // get total Calories
            const totalCalories = itemCtrl.getTotalCalories();
            // add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);
            //Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }


    return {
        init: function () {

            // get items from Data Structure
            const items = itemCtrl.getItems();

            

            // Load event listeners
            loadEventListeners();

            //hide list if empty
            if(items.length === 0){
                UICtrl.hideList();
            }else{
                // Populate list with Items
                UICtrl.populateItemList(items);
            }

            // get total Calories
            const totalCalories = itemCtrl.getTotalCalories();
            // add total calories to the UI
            UICtrl.showTotalCalories(totalCalories);

        }
    }
})(itemCtrl, UICtrl);

// initialize the app 
AppCtrl.init();