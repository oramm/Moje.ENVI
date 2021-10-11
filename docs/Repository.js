class Repository {
    /*
     * Może być inicjowane z danych z serwera, wtedy argumentem jest name jako string
     * Może być też inicjowane z obiektu SessionStorage, wtedy paremetrem jest ten obiekt
     * @param {type} name
     * @returns {Repository}
     */
    constructor(initParameter) {
        if (initParameter === undefined) throw new SyntaxError("Repository must have a name!");
        this.actionsGASSetup = {
            addNew: (initParameter.actionsGASSetup && initParameter.actionsGASSetup.addNew) ? true : false,
            edit: (initParameter.actionsGASSetup && initParameter.actionsGASSetup.edit) ? true : false,
            delete: (initParameter.actionsGASSetup && initParameter.actionsGASSetup.delete) ? true : false,
        }
        this.actionsNodeJSSetup = {
            addNewRoute: (initParameter.actionsNodeJSSetup) ? initParameter.actionsNodeJSSetup.addNewRoute : undefined,
            editRoute: (initParameter.actionsNodeJSSetup) ? initParameter.actionsNodeJSSetup.editRoute : undefined,
            deleteRoute: (initParameter.actionsNodeJSSetup) ? initParameter.actionsNodeJSSetup.deleteRoute : undefined,
            copyRoute: (initParameter.actionsNodeJSSetup) ? initParameter.actionsNodeJSSetup.copyRoute : undefined,
        }
        this.itemsLocalData;
        this.result;
        //Repository może mieć wiele bieżących elementów (multiselect)
        this.currentItemsLocalData = [];

        if (typeof initParameter === 'string') {
            //przemyśleć i w przyszłości może scalić z currentItemsLocalData[]
            this.name = initParameter;
            this.currentItemLocalData = {};
            //sessionStorage.setItem(this.name, JSON.stringify(this));
        }
        //mamy obiekt z SessionStorage
        else if (typeof initParameter === 'object') {
            this.name = initParameter.name;
            if (initParameter.actionsNodeJSSetup) {
                this.actionsGASSetup = initParameter.actionsGASSetup;
                this.actionsNodeJSSetup = initParameter.actionsNodeJSSetup;
                this.currentItemLocalData = {};
                console.log(this.name + ' NodeJS Repository: %o', this.actionsNodeJSSetup);
            } else {
                this.currentItemLocalData = initParameter.currentItemLocalData;
                this.itemsLocalData = initParameter.itemsLocalData;
                console.log(this.name + ' items from SessionStorage: %o', this.itemsLocalData);
            }
        }
    }

    get items() {
        return (this.itemsLocalData) ? this.itemsLocalData : JSON.parse(sessionStorage.getItem(this.name)).itemsLocalData;
    }
    set items(data) {
        this.itemsLocalData = data;
        sessionStorage.setItem(this.name, JSON.stringify(this));
    }

    get currentItem() {
        return (this.currentItemLocalData) ? this.currentItemLocalData : JSON.parse(sessionStorage.getItem(this.name)).currentItem;
    }
    //używać tylko gdy Repository ma wiele bieżących elementów (multiselect)
    get currentItems() {
        return (this.currentItemsLocalData) ? this.currentItemsLocalData : JSON.parse(sessionStorage.getItem(this.name)).currentItems;
    }

    set currentItems(data) {
        this.currentItemsLocalData = data;
        sessionStorage.setItem(this.name, JSON.stringify(this));
    }

    set currentItem(item) {
        if (typeof item !== 'object' && item !== undefined) throw new Error("Selected repository item must be an object!");
        //nie przesyłamy do repozytorium blobów z FileInput
        if (item !== undefined) {
            delete item._blobEnviObjects;
            this.currentItemId = item.id;
        } else
            this.currentItemId = undefined;
        this.currentItemLocalData = item;
        if (item !== {}) this.addToCurrentItems(item);
        sessionStorage.setItem(this.name, JSON.stringify(this));
    }

    //używać tylko gdy Repository ma wiele bieżących elementów (multiselect)
    addToCurrentItems(newDataItem) {
        if (newDataItem) {
            if (this.currentItemsLocalData && this.currentItemsLocalData[0])
                var wasItemAlreadySelected = this.currentItemsLocalData.filter(existingDataItem => existingDataItem.id == newDataItem.id)[0];
            if (!wasItemAlreadySelected)
                this.currentItemsLocalData.push(newDataItem);
        }
        //sessionStorage.setItem(this.name, JSON.stringify(this));
    }

    //używać tylko gdy Repository ma wiele bieżących elementów (multiselect)
    deleteFromCurrentItems(item) {
        if (!item || typeof item !== 'object') throw new SyntaxError("Selected item must be an object!");

        var index = Tools.arrGetIndexOf(this.currentItemsLocalData, 'id', item.id);
        if (index !== undefined) this.currentItemsLocalData.splice(index, 1)

        sessionStorage.setItem(this.name, JSON.stringify(this));
    }

    setCurrentItemById(id) {
        if (id === undefined) throw new SyntaxError("Selected item id must be specified!");
        this.currentItemId = id;
        this.currentItem = Tools.search(parseInt(id), "id", this.items);
    }

    /*
     * używany do ustawienia repozytorium po stronie klienta (bez obsługi viewObject)
     * gdy edytujemy element nieposiadający listy
     */
    clientSideEditItemHandler(dataItem) {
        return new Promise((resolve, reject) => {
            var newIndex = this.items.findIndex(item => item.id == dataItem.id);
            this.items[newIndex] = dataItem;
            console.log('%s:: wykonano funkcję: %s, %o', this.name, this, dataItem);
            resolve(dataItem);
        });
    }

    /*
     * używany do ustawienia repozytorium po stronie klienta (bez obsługi viewObject)
     * gdy edytujemy element nieposiadający listy
     */
    clientSideAddNewItemHandler(dataItem, serverFunctionName = '') {
        return new Promise((resolve, reject) => {
            this.items.push(dataItem);
            console.log('dodaję obiekt docelowy, jego parent: ,%o', dataItem._parent)
            this.currentItem = dataItem;
            console.log('%s:: wykonano funkcję: %s, %o', this.name, serverFunctionName, dataItem);
            resolve(dataItem);
        });
    }

    /*
     * używany do ustawienia repozytorium po stronie klienta (bez obsługi viewObject)
     * gdy edytujemy element nieposiadający listy
     */
    async clientSideDeleteItemHandler(dataItem) {
        var index = this.items.findIndex(item => item.id == dataItem.id);
        this.items.splice(index, 1);
        this.currentItem = {};
        console.log('%s:: wykonano funkcję: %s, %o', this.name, this.deleteServerFunctionName, dataItem);
        return dataItem;
    }

    doServerFunction(serverFunctionName, serverFunctionParameters) {
        return new Promise((resolve, reject) => {
            // Create an execution request object.
            // Create execution request.
            var request = {
                'function': serverFunctionName,
                'parameters': serverFunctionParameters,
                'devMode': true // Optional.
            };
            // Make the API request.
            var op = gapi.client.request({
                'root': 'https://script.googleapis.com',
                'path': 'v1/scripts/' + SCRIPT_ID + ':run',
                'method': 'POST',
                'body': request
            });

            op
                .then((resp) => this.handleDoServerFunction(resp.result))
                .then((result) => {
                    console.log(this.name + ' ' + serverFunctionName + '() items from db: %o ', result);
                    resolve(result);
                })
                .catch(err => {
                    console.error(serverFunctionName, err);
                    window.alert('Wystąił Błąd! \n ' + err);
                    throw err;
                });
        });
    }

    //TODO: scalić funkcje handleDoServerFunction() z handleAddNewItem
    handleDoServerFunction(resp) {
        return new Promise((resolve, reject) => {
            if (resp.error && resp.error.status) {
                // The API encountered a problem before the script
                // started executing.
                this.result = 'Error calling API:';
                this.result += JSON.stringify(resp);
                console.error(resp.error);
                throw this.result;
                //throw resp.error;
            } else if (resp.error) {
                // The API executed, but the script returned an error.
                // Extract the first (and only) set of error details.
                // The values of this object are the script's 'errorMessage' and
                // 'errorType', and an array of stack trace elements.
                var error = resp.error.details[0];
                this.result = 'Script error message: ' + error.errorMessage;
                console.error(resp.error);
                if (error.scriptStackTraceElements) {
                    // There may not be a stacktrace if the script didn't start
                    // executing.
                    this.result = 'Script error stacktrace:';
                    for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                        var trace = error.scriptStackTraceElements[i];
                        this.result += ('\t' + trace.function + ':' + trace.lineNumber);
                    }
                    throw resp.error.details[0].errorMessage;
                }
            } else {
                // The structure of the result will depend upon what the Apps
                // Script function returns. 
                var serverResponse = resp.response.result;
                if (!serverResponse || Object.keys(serverResponse).length == 0) {
                    this.result = [];
                    resolve(this.result);
                } else {
                    //itemsList = serverResponse;
                    this.result = this.name + '  succes';
                    resolve(serverResponse);
                }
            }
        });
    }

    /*
     * wywoływana przy SUBMIT
     */
    async addNewItem(newItem, serverFunctionName, viewObject) {
        var newItemTmpId = this.items.length + 1 + '_pending';
        newItem._tmpId = newItemTmpId;
        //wstaw roboczy obiekt do repozytorium, żeby obsłużyć widok
        this.items.push(newItem);
        console.log('tworzę obiekt tymczasowy, jego parent: %o', newItem._parent)
        this.currentItem = Tools.cloneOfObject(newItem);
        viewObject.addNewHandler.apply(viewObject, ["PENDING", newItem]);
        try {
            let newItemFromServer = await this.editItemResponseHandlerGAS(newItem, serverFunctionName);
            return this.addNewItemViewOnSuccesHandler(newItemTmpId, newItemFromServer, viewObject, serverFunctionName)
        } catch (err) {
            this.addNewItemViewOnErrorHandler(newItemTmpId, viewObject, newItem, err);
            throw (err);
        };
    }

    async addNewItemNodeJS(newItem, route, viewObject) {
        var newItemTmpId = this.items.length + 1 + '_pending';
        newItem._tmpId = newItemTmpId;
        //wstaw roboczy obiekt do repozytorium, żeby obsłużyć widok
        this.items.push(newItem);
        console.log('tworzę obiekt tymczasowy, jego parent: %o', newItem._parent)
        this.currentItem = Tools.cloneOfObject(newItem);
        viewObject.addNewHandler.apply(viewObject, ["PENDING", newItem]);
        try {
            let newItemFromServer = await this.addNewItemResponseHandlerNodeJS(newItem, route);
            return this.addNewItemViewOnSuccesHandler(newItemTmpId, newItemFromServer, viewObject)
        } catch (err) {
            this.addNewItemViewOnErrorHandler(newItemTmpId, viewObject, newItem, err);
            throw (err);
        };
    }

    addNewItemViewOnSuccesHandler(newItemTmpId, newItemFromServer, viewObject, serverFunctionName = '') {
        //usuń z repozytorium tymczasowy obiekt
        var index = this.items.findIndex(item => item._tmpId == newItemTmpId);
        console.log('usuwam obiekt tymczasowy, jego _parent: %o', this.items[index]._parent);
        this.items.splice(index, 1);

        //wstaw do repozytorium nowy obiekt z serwera
        this.clientSideAddNewItemHandler(newItemFromServer, serverFunctionName);

        //atrybut '_tmpId' jest potrzebny do obsłużenia viewObject
        newItemFromServer._tmpId = newItemTmpId;
        viewObject.addNewHandler.apply(viewObject, ["DONE", newItemFromServer]);
        return newItemFromServer;
    }
    addNewItemViewOnErrorHandler(newItemTmpId, viewObject, newItem, err) {
        //http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
        //usuń z repozytorium pechowy obiekt
        var index = this.items.findIndex(item => item._tmpid == newItemTmpId);
        this.items.splice(index, 1);
        this.currentItem = {};
        viewObject.addNewHandler.apply(viewObject, ["ERROR", newItem, err]);
    }
    async editItemResponseHandlerGAS(newItem, serverFunctionName) {
        // Create an execution request object.
        // Create execution request.
        let request = {
            'function': serverFunctionName,
            'parameters': JSON.stringify(newItem),
            'devMode': true // Optional.
        };
        // Make the API request.
        let resp = (await gapi.client.request({
            'root': 'https://script.googleapis.com',
            'path': 'v1/scripts/' + SCRIPT_ID + ':run',
            'method': 'POST',
            'body': request
        })).result;
        if (resp.error && resp.error.status) {
            // The API encountered a problem before the script
            // started executing.
            this.result = 'Error calling API:';
            this.result += JSON.stringify(resp, null, 2);
            console.error(resp.error);
            throw this.result;
            //throw resp.error;
        } else if (resp.error) {
            // The API executed, but the script returned an error.
            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = resp.error.details[0];
            this.result = 'Script error message: ' + error.errorMessage;
            throw resp.error.details[0].errorMessage;
            if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.
                this.result = 'Script error stacktrace:';
                for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                    var trace = error.scriptStackTraceElements[i];
                    this.result += ('\t' + trace.function + ':' + trace.lineNumber);
                }
                throw resp.error.details[0].errorMessage;
            }
        } else {
            // The structure of the result will depend upon what the Apps
            // Script function returns. 
            if (!resp.done) {
                throw "Nic nie dodano";
            } else {
                this.result = 'Dodano element';
                return (resp.response.result);
            }
        }

    }
    /*
     * wywoływana przy SUBMIT
     * @param {DataItem} newItem
     * @param {String} serverFunctionName
     * @param {Collection | Collapsible} viewObject
     * @returns {Promise}
     */
    async editItem(newItem, serverFunctionName, viewObject) {
        viewObject.editHandler.apply(viewObject, ["PENDING", newItem]);
        try {
            let result = await this.editItemResponseHandlerGAS(newItem, serverFunctionName);

            return this.editItemViewHandler(result, viewObject);
        } catch (err) {
            //http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
            viewObject.editHandler.apply(viewObject, ["ERROR", newItem, err]);
            throw err;
        };
    }
    async editItemNodeJS(newItem, route, viewObject) {
        viewObject.editHandler.apply(viewObject, ["PENDING", newItem]);
        try {
            let newItemFromServer = await this.editItemResponseHandlerNodeJS(newItem, route)
            return this.editItemViewHandler(newItemFromServer, viewObject);
        } catch (err) {
            //http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
            viewObject.editHandler.apply(viewObject, ["ERROR", newItem, err]);
            throw err;
        };
    }

    editItemViewHandler(newItemFromServer, viewObject) {
        if (!newItemFromServer)
            throw new Error('Serwer powinien zwrócić obiekt');
        //usuń z repozytorium tymczasowy obiekt
        var index = this.items.findIndex(item => item.id == newItemFromServer.id);
        this.items.splice(index, 1);
        //wstaw do repozytorium nowy obiekt z serwera
        this.items.push(newItemFromServer);
        this.currentItem = newItemFromServer;
        viewObject.editHandler.apply(viewObject, ["DONE", newItemFromServer]);
        return (newItemFromServer);
    }

    async addNewItemResponseHandlerNodeJS(item, route) {
        let result = await fetch(MainSetup.serverUrl + route, {
            method: 'POST',
            headers: this.makeRequestHeaders(),
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify(item)
        });
        result = await result.text();
        if (result.authorizeUrl)
            window.open(result.authorizeUrl);
        else {
            const parsedResult = Tools.tryParseJSONObject(result);
            if (parsedResult)
                return parsedResult;
            else
                return result;
        }
    }

    async editItemResponseHandlerNodeJS(item, route) {
        let result = await fetch(MainSetup.serverUrl + route + '/' + item.id, {
            method: 'PUT',
            headers: this.makeRequestHeaders(),
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify(item)
        });
        result = await result.text();
        if (result.authorizeUrl)
            window.open(result.authorizeUrl);
        return JSON.parse(result);
    }



    async deleteItemResponseHandlerNodeJS(oldItem, route) {
        let result = await fetch(MainSetup.serverUrl + route + '/' + oldItem.id, {
            method: 'DELETE',
            headers: this.makeRequestHeaders(),
            credentials: 'include',
            withCredentials: true,
            body: JSON.stringify(oldItem)
        });
        if (result.authorizeUrl)
            window.open(result.authorizeUrl);
        return result;
    }

    makeRequestHeaders() {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        return myHeaders;
    }
    /*
     * Do serwera idzie cały Item, do Kroku 3 idzie tylko item.id
     */
    async deleteItem(oldItem, serverFunctionName, viewObject) {
        this.clientSideDeleteItemHandler(oldItem);
        viewObject.removeHandler.apply(viewObject, ["PENDING", oldItem.id]);
        try {
            let result = await this.deleteItemResponseHandlerGAS(oldItem, serverFunctionName)
            viewObject.removeHandler.apply(viewObject, ["DONE", oldItem.id, undefined, result]);
            return oldItem;
        } catch (err) {
            this.items.push(oldItem);
            this.currentItem = oldItem;
            viewObject.removeHandler.apply(viewObject, ["ERROR", oldItem.id, err]);
        }
    }
    async deleteItemNodeJS(oldItem, route, viewObject) {
        this.clientSideDeleteItemHandler(oldItem);
        viewObject.removeHandler.apply(viewObject, ["PENDING", oldItem.id]);
        try {
            let result = await this.deleteItemResponseHandlerNodeJS(oldItem, route);
            viewObject.removeHandler.apply(viewObject, ["DONE", oldItem.id, undefined, result]);
            return oldItem;
        } catch (err) {
            this.items.push(oldItem);
            this.currentItem = oldItem;
            viewObject.removeHandler.apply(viewObject, ["ERROR", oldItem.id, err]);
        }
    }
    async deleteItemResponseHandlerGAS() {
        // Create an execution request object.
        // Create execution request.
        const request = {
            'function': serverFunctionName,
            'parameters': JSON.stringify(oldItem),
            'devMode': true // Optional.
        };
        // Make the API request.
        let resp = (await gapi.client.request({
            'root': 'https://script.googleapis.com',
            'path': 'v1/scripts/' + SCRIPT_ID + ':run',
            'method': 'POST',
            'body': request
        })).result;

        if (resp.error && resp.error.status) {
            // The API encountered a problem before the script
            // started executing.
            this.result = 'Error calling API:';
            this.result += JSON.stringify(resp, null, 2);
            console.error(resp.error);
            throw this.result;
            //throw resp.error;
        } else if (resp.error) {
            // The API executed, but the script returned an error.
            // Extract the first (and only) set of error details.
            // The values of this object are the script's 'errorMessage' and
            // 'errorType', and an array of stack trace elements.
            var error = resp.error.details[0];
            this.result = 'Script error message: ' + error.errorMessage;
            console.error(resp.error);
            if (error.scriptStackTraceElements) {
                // There may not be a stacktrace if the script didn't start
                // executing.
                this.result = 'Script error stacktrace:';
                for (var i = 0; i < error.scriptStackTraceElements.length; i++) {
                    var trace = error.scriptStackTraceElements[i];
                    this.result += ('\t' + trace.function + ':' + trace.lineNumber);
                }
                throw resp.error.details[0].errorMessage;
            }
        } else {
            // The structure of the result will depend upon what the Apps
            // Script function returns. 
            if (!resp.done) {
                throw this.name + ": nic nie usunięto";
            } else {
                //this.result = resp.response.result;
                return (resp.response.result);
            }
        }
    }
}