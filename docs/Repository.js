class Repository {
    constructor(name){
        if (name === undefined) throw new SyntaxError("Repository must have a name!");

        this.name = name;
        this.items;
        this.result;
    }

      
    //@deprecated
    setItemSelectedItemIdFromURL(itemName) {
        var item = getUrlVars()[itemName];
        if (item!= undefined)
            this.selectedItem = Tools.search(item,"id", this.items);
    }
    
    itemSelected(id) {
        if (id === undefined) throw new SyntaxError("Selected item id must be specified!");
        this.selectedItemId = id;
        this.currentItem = Tools.search(parseInt(id),"id", this.items);
        
    }

    initialiseItemsList(serverFunctionName,serverFunctionParameters) {
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
              .then((resp) => this.handleInitialiseItemsList(resp.result))
              .then((result) => {   console.log(result);
                                    resolve(result);
                                })
              .catch(err => console.error ("test 2 ", err)
                    );
        });
    }
    
    //TODO: scalić funkcje handleInitialiseItemsList() z handleAddNewItem
    handleInitialiseItemsList(resp) {
        return new Promise((resolve, reject) => {
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
                        this.result += ('\t' + trace.function+':' + trace.lineNumber);
                    }
                throw resp.error.details[0].errorMessage;
                }
            } else {
                // The structure of the result will depend upon what the Apps
                // Script function returns. 
                var serverResponse = resp.response.result;
                if (Object.keys(serverResponse).length == 0) {
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
    
    //wywoływana przy SUBMIT
    addNewItem(newItem, serverFunctionName, viewObject) {
        return new Promise((resolve, reject) => {
            newItem.tmpId = viewObject.addNewHandler.apply(viewObject,["PENDING",newItem]);
            // Create an execution request object.
            // Create execution request.
            var request = {
                'function': serverFunctionName,
                'parameters': JSON.stringify(newItem),
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
              .then(resp => {  
                  this.handleAddNewItem(resp.result)
                      .then((result) => { 
                        newItem.id = result;
                        viewObject.addNewHandler.apply(viewObject, ["DONE", newItem])
                        resolve(newItem);
                      })
                      .catch(err => {
                          //http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
                          viewObject.addNewHandler.apply(viewObject,["ERROR",newItem, err]);
                          //reject(err);
                      });
                  })
              .catch(err => {
                    console.error ("test 2 ", err);
                    viewObject.addNewHandler.apply(viewObject,["ERROR",newItem, err]);
                    throw err;
              });
        });
    }

    handleAddNewItem(resp) {
        return new Promise((resolve, reject) => {
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
                        this.result += ('\t' + trace.function+':' + trace.lineNumber);
                    }
                throw resp.error.details[0].errorMessage;
                }
            } else {
                // The structure of the result will depend upon what the Apps
                // Script function returns. 
                if (!resp.done) {
                    throw "Nic nie dodano";
                } else {
                    this.result = 'Dodano rolę';
                    resolve(resp.response.result);
                }
            }
        });
    }
    /*
     * wywoływana przy SUBMIT
     * @param {DataItem} newItem
     * @param {String} serverFunctionName
     * @param {Collection | Collapsible} viewObject
     * @returns {Promise}
     */
    editItem(newItem, serverFunctionName, viewObject) {
        return new Promise((resolve, reject) => {
            viewObject.editHandler.apply(viewObject,["PENDING",newItem]);
            // Create an execution request object.
            // Create execution request.
            var request = {
                'function': serverFunctionName,
                'parameters': JSON.stringify(newItem),
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
              .then(resp => {  
                  this.handleAddNewItem(resp.result)
                      .then(() => { 
                        viewObject.editHandler.apply(viewObject, ["DONE", newItem])
                        resolve(newItem);
                      })
                      .catch(err => {
                          //http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
                          viewObject.editHandler.apply(viewObject,["ERROR",newItem, err]);
                          //reject(err);
                      });
                  })
              .catch(err => {
                    console.error ("test 2 ", err);
                    viewObject.editHandler.apply(viewObject,["ERROR",newItem, err]);
                    throw err;
              });
        });
    }
    /*
     * Do serwera idzie cały Item, do Kroku 3 idzie tylko item.id
     */
    deleteItem(item,serverFunctionName, viewObject) {
        return new Promise((resolve, reject) => {
            viewObject.removeHandler.apply(viewObject,["PENDING",item.id]);
            // Create an execution request object.
            // Create execution request.
            var request = {
                'function': serverFunctionName,
                'parameters': JSON.stringify(item),
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
              .then(resp => {  
                  this.handleDeleteItem(resp.result)
                      .then(() => { 
                        //viewHandler.apply(viewObject, ["DONE", item.id]);
                        viewObject.removeHandler.apply(viewObject, ["DONE", item.id]);
                        resolve(item);
                      })
                      .catch(err => {
                          //http://javascriptissexy.com/understand-javascript-callback-functions-and-use-them/
                          viewObject.removeHandler.apply(viewObject,["ERROR",item.id, err]);
                      });
                  })
              .catch(err => {
                    console.error ("test 1 ", err);
                    throw err;
              });
        });

    }
    
    handleDeleteItem(resp) {
        return new Promise((resolve, reject) => {
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
                        this.result += ('\t' + trace.function+':' + trace.lineNumber);
                    }
                throw resp.error.details[0].errorMessage;
                }
            } else {
                // The structure of the result will depend upon what the Apps
                // Script function returns. 
                if (!resp.done) {
                    throw this.name + ": nic nie usunięto";
                } else {
                    this.result = this.name + "item deleted!";
                    resolve(this.result);
                }
            }
        });
    }
}