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
        this.currentItem = {};        
    }
    
    initialise() {
        return new Promise((resolve, reject) => {
            this.initialiseItemsList(this.getItemsListServerFunctionName)
                .then((result) =>   { this.items = result
                                      resolve(this.name + " initialised");
                                    })
                //.then(() => this.initialiseItemsList('getPersonRoleAssociationsPerProject', this.selectedProjectId))
                //.then((result) => { this.personRolesAssociationsRaw = result;
                //                    resolve("Persons initialised");
                //                 });
        });
    }
    
    setCurrentItem(item) {
        this.currentItem = item; 
    }
    
    //Krok 2 - wywoływana przy SUBMIT
    addNewItem(item, viewObject) {
        return new Promise((resolve, reject) => {
            super.addNewItem(item,this.addNewServerFunctionName,viewObject)
                  .then((res) => {  this.items.push(item)
                                    
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
