class SimpleRepository extends Repository {
    constructor(name, 
                getItemsListServerFunctionName, 
                addNewServerFunctionName, 
                editServerFunctionName, 
                deleteServerFunctionName){
        super(name);
        this.getItemsListServerFunctionName = getItemsListServerFunctionName
        this.addNewServerFunctionName = addNewServerFunctionName;
        this.editServerFunctionName = editServerFunctionName;
        this.deleteServerFunctionName = deleteServerFunctionName;
        this.currentItem={};
        this.parentItemId; 
        this.parentItemIdFromURL();
    }
    
    initialise(serverFunctionParameters) {
        return new Promise((resolve, reject) => {
            this.doServerFunction(this.getItemsListServerFunctionName,serverFunctionParameters)
                .then(result => {   this.items = result;
                                    
                                    resolve(this.name + " initialised");  
                                });
        });
    }
    //najczęściej jest to projectId
    parentItemIdFromURL() {
        return new Promise((resolve, reject) => {
            this.parentItemId = getUrlVars()['parentItemId'];
            
        });
    }
    
    setCurrentItem(item) {
        this.currentItem = item; 
    }
    
    //Krok 2 - wywoływana przy SUBMIT
    addNewItem(item, viewObject) {
        return new Promise((resolve, reject) => {
            this.currentItem = item;
            super.addNewItem(item,this.addNewServerFunctionName,viewObject)
                  .then((res) => {  this.items.push(item)
                                    this.currentItem = item;
                                    console.log('dodano element: ', item);
                                 });
        });
    }
    
    //Krok 2 - wywoływana przy SUBMIT
    editItem(person, viewObject) {
        return new Promise((resolve, reject) => {
            super.editItem(person,this.editServerFunctionName, viewObject)
                  .then((res) => {  var newIndex = this.items.findIndex( item => item.id == res.id
                                                      ); 
                                    this.items[newIndex] = res;
                                    console.log('zmieniono dane : ', res);
                                 })
        });
    }
    
    /*
     * Krok 2 - Wywoływane przez trigger w klasie pochodnej po Collection
     */
    deleteItem(item, viewObject) {
        return new Promise((resolve, reject) => {
            super.deleteItem(item,this.deleteServerFunctionName, viewObject)
                    .then ((res)=> {   var index = this.items.findIndex( item => item.id == res.id
                                                      ); 
                                    this.items.splice(index,1);
                                    console.log('usunięto: ', res)
                                    resolve(this.name + ': item deleted');
                                });
        });
    }
};
