// Storage Controller

// Item Controller
const itemCtrl = (function () {
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure / State
    const data = {
        items: [
            {id:0,name:'Steak Dinner',calories:1200},
            {id:1,name:'Eggs',calories:300},
            {id:2,name:'Cookies',calories:700}
        ],
        currentItem : null,
        totalCalories : 0
    }

    // Access data 
    return{
        logData: function(){
            return data;
        }
    }
})();






// UI Controller
const UICtrl = (function () {



})();






// App Controller
const AppCtrl = (function (itemCtrl, UICtrl) {
    
    return{
        init : function(){
            console.log('initializing app..');
        }
    }
})(itemCtrl,UICtrl);


AppCtrl.init();