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
        deleteServerFunctionName,
        copyServerFunctionName = addNewServerFunctionName) {
        super(initParameter);
        this.parentItemId = initParameter.parentItemId;
        if (typeof initParameter === 'string') {
            this.parentItemIdFromURL();

            this.getItemsListServerFunctionName = getItemsListServerFunctionName
            this.addNewServerFunctionName = addNewServerFunctionName;
            this.editServerFunctionName = editServerFunctionName;
            this.deleteServerFunctionName = deleteServerFunctionName;
            this.copyServerFunctionName = copyServerFunctionName;
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

    initialiseNodeJS(requestParams) {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'GET',
                url: 'https://erp-envi.herokuapp.com/' + requestParams, //http://localhost:3000/
                success: (response) => {
                    this.items = response;
                    sessionStorage.setItem(this.name, JSON.stringify(this));
                    console.log(this.name + ' NodeJS: %o', response);
                    resolve(this.name + " initialised");
                },
                error: (xhr, status, err) => {
                    console.log(xhr.responseText);
                }
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
        return super.addNewItem(dataItem, this.addNewServerFunctionName, viewObject);
    }

    //Krok 2 - wywoływana przy SUBMIT
    editItem(dataItem, viewObject) {
        return this.doChangeFunctionOnItem(dataItem, this.editServerFunctionName, viewObject);
    }

    /*
     * Krok 2 - Wywoływane przez trigger w klasie pochodnej po Resultset
     */
    deleteItem(item, viewObject) {
        return new Promise((resolve, reject) => {
            super.deleteItem(item, this.deleteServerFunctionName, viewObject)
                .then((res) => {
                    resolve(this.name + ': item deleted');
                });
        });
    }

    copyCurrentItem(viewObject) {
        return new Promise((resolve) => {
            var tmpDataObject = Tools.cloneOfObject(this.currentItem);
            tmpDataObject.id = undefined;
            resolve(super.addNewItem(tmpDataObject, this.copyServerFunctionName, viewObject));
        });
    }

    copyItem(item, viewObject) {
        var tmpDataObject = Tools.cloneOfObject(item);
        tmpDataObject.id = undefined;
        return super.addNewItem(tmpDataObject, this.copyServerFunctionName, viewObject);

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