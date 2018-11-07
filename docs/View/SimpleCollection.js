class SimpleCollection extends Collection {
    /*
     * 
     * @param {String} id - używane w HTML musi być unikatowe
     * @param {Repository} connectedRepository
     * @param {Boolean} isPlane
     * @returns {SimpleCollection}
     */
    constructor(initParamObject){
        super({id: initParamObject.id,
               title: initParamObject.title,
               isPlain: initParamObject.isPlain, 
               hasFilter: initParamObject.hasFilter,
               isEditable: initParamObject.isEditable, 
               isAddable: initParamObject.isAddable, 
               isDeletable: initParamObject.isDeletable,
              });
        this.connectedRepository = initParamObject.connectedRepository;
        //this.initialise(this.makeList());
    }
    
    makeList(){
        var itemsList = [];
        for (var i=0; i<this.connectedRepository.items.length; i++){
            itemsList.push(this.makeItem(this.connectedRepository.items[i]));
            }
        return itemsList;
    }
    
    /*
     * Krok 3 -  callback z repository - obsługuje wyświetlanie podczas łączenia z serwerem 
     * przekaż proces do obiektu 'Collection' i obsłuż w zależności od statusu odpowiedzi z serwera
     * Krok 3 jest w obiekcie Collection.addNewHandler
    */
    addNewHandler(status, dataItem, errorMessage){                                 
        var collectionItem = this.makeItem(dataItem);
        collectionItem.tmpId = dataItem.tmpId;
        return super.addNewHandler(status, collectionItem, errorMessage);
    } 
    
    /*
     * Krok 3 -  callback z repository - obsługuje wyświetlanie podczas łączenia z serwerem 
     * przekaż proces do obiektu 'Collection' i obsłuż w zależności od statusu odpowiedzi z serwera
     * Krok 3 jest w obiekcie Collection.addNewHandler
    */
    editHandler(status, dataItem, errorMessage){
        var collectionItem = this.makeItem(dataItem);
        super.editHandler(status, collectionItem, errorMessage);            
    } 
    
    /*
     * Krok 1 - po kliknięciu w przycisk 'usuń' 
     * Proces: this.removeTrigger >> xxxxRepository.deleteItem()
     *                                      >> repository.deleteItem >> collection.removeHandler[PENDING]
     *                                      >> repository.deleteItem >> collection.removeHandler[DONE]

     */
    removeTrigger(itemId){
        var item = search(parseInt(itemId),"id", this.connectedRepository.items);

        this.connectedRepository.deleteItem(item, this)
            .catch(err => {
                      console.error(err);
                    });
    }
    
    
    selectTrigger(itemId){
        var item = Tools.search(parseInt(itemId), 'id', this.connectedRepository.items);   
        this.connectedRepository.setCurrentItem(item);
    }
    
    /*
     * Edycja jest triggerowana przez submit w modalu
     * Collection >> Modal submitTrigger() >> Repository
     */
}