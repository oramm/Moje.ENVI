class SimpleRepository extends Repository {
    /*
     * 
     * @param {String || Object} initParameter może to być nazwa repozytorim, albo obiekt z session Strorage
     * @param {String} getItemsListServerFunctionName
     * @param {String} addNewServerFunctionName
     * @param {String} editServerFunctionName
     * @param {String} deleteServerFunctionName
     * @returns {SimpleRepository}
     */
    constructor(initParameter,
        getItemsListServerFunctionName,
        addNewServerFunctionName,
        editServerFunctionName,
        deleteServerFunctionName) {
        super(initParameter);
        this.parentItemId = initParameter.parentItemId;
        if (typeof initParameter === 'string') {
            this.parentItemIdFromURL();
            
            this.getItemsListServerFunctionName = getItemsListServerFunctionName
            this.addNewServerFunctionName = addNewServerFunctionName;
            this.editServerFunctionName = editServerFunctionName;
            this.deleteServerFunctionName = deleteServerFunctionName;
            sessionStorage.setItem(this.name, JSON.stringify(this));
        }
        //mamy obiekt z SessionStorage
        else if (typeof initParameter === 'object') {
            this.getItemsListServerFunctionName = initParameter.getItemsListServerFunctionName
            this.addNewServerFunctionName = initParameter.addNewServerFunctionName;
            this.editServerFunctionName = initParameter.editServerFunctionName;
            this.deleteServerFunctionName = initParameter.deleteServerFunctionName;
        }
        
    }

    initialise(serverFunctionParameters) {
        return new Promise((resolve, reject) => {
            this.doServerFunction(this.getItemsListServerFunctionName, serverFunctionParameters)
                .then(result => {
                    this.items = result;
                    sessionStorage.setItem(this.name, JSON.stringify(this));
                    resolve(this.name + " initialised");
                });
        });
    }
    //najczęściej jest to projectId
    parentItemIdFromURL() {
        return new Promise((resolve, reject) => {
            this.parentItemId = Tools.getUrlVars()['parentItemId'];

        });
    }

    //Krok 2 - wywoływana przy SUBMIT
    addNewItem(dataItem, viewObject) {
        return this.doAddNewFunctionOnItem(dataItem, this.addNewServerFunctionName, viewObject);
    }

    //Krok 2 - wywoływana przy SUBMIT
    editItem(dataItem, viewObject) {
        return this.doChangeFunctionOnItem(dataItem, this.editServerFunctionName, viewObject);
    }

    /*
     * Krok 2 - Wywoływane przez trigger w klasie pochodnej po Collection
     */
    deleteItem(item, viewObject) {
        return new Promise((resolve, reject) => {
            super.deleteItem(item, this.deleteServerFunctionName, viewObject)
                .then((res) => {
                    console.log('usunięto: ', res)
                    resolve(this.name + ': item deleted');
                });
        });
    }

    /*
     * wykonuje dowolną funkcję z serwera dotyczącą danej pozycji na liście viewObject
     */
    doChangeFunctionOnItem(dataItem, serverFunctionName, viewObject) {
        return new Promise((resolve, reject) => {
            super.editItem(dataItem, serverFunctionName, viewObject)
                .then((res) => {
                    var newIndex = this.items.findIndex(item => item.id == res.id);
                    this.items[newIndex] = res;
                    console.log('%s:: wykonano funkcję: %s', this.name, serverFunctionName, res);
                    resolve(res);
                })
        });
    }

    /*
     * wykonuje dowolną funkcję  z serwera polegającą na utworzeniu pozycji na liście viewObject
     */
    doAddNewFunctionOnItem(dataItem, serverFunctionName, viewObject) {
        return new Promise((resolve, reject) => {
            super.addNewItem(dataItem, serverFunctionName, viewObject)
                .then((res) => {
                    console.log('%s:: wykonano funkcję: %s, %o', this.name, serverFunctionName, res);
                    resolve(res);
                })
        });
    }
};