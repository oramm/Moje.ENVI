class SimpleCollection extends Collection {
    /*
     * 
     * @param {String} id - używane w HTML musi być unikatowe
     * @param {Repository} connectedRepository
     * @param {Boolean} isPlane
     * @returns {SimpleCollection}
     */
    constructor(initParamObject) {
        super(initParamObject);
        this.connectedRepository = initParamObject.connectedRepository;
        //this.initialise(this.makeList());
    }

    makeList() {
        var itemsList = [];
        for (const dataItem of this.connectedRepository.items)
            itemsList.push(this.makeItem(dataItem));
        return itemsList;
    }

    /*
     * Krok 3 -  callback z repository - obsługuje wyświetlanie podczas łączenia z serwerem 
     * przekaż proces do obiektu 'Collection' i obsłuż w zależności od statusu odpowiedzi z serwera
     * Krok 3 jest w obiekcie Collection.addNewHandler
    */
    addNewHandler(status, dataItem, errorMessage) {
        var collectionItem = this.makeItem(dataItem);
        collectionItem._tmpId = dataItem._tmpId;
        return super.addNewHandler(status, collectionItem, errorMessage);
    }

    /*
     * Krok 3 -  callback z repository - obsługuje wyświetlanie podczas łączenia z serwerem 
     * przekaż proces do obiektu 'Collection' i obsłuż w zależności od statusu odpowiedzi z serwera
     * Krok 3 jest w obiekcie Collection.addNewHandler
    */
    editHandler(status, dataItem, errorMessage) {
        var collectionItem = this.makeItem(dataItem);
        super.editHandler(status, collectionItem, errorMessage);
    }

    /*
     * Krok 1 - po kliknięciu w przycisk 'usuń' 
     * Proces: this.removeTrigger >> xxxxRepository.deleteItem()
     *                                      >> repository.deleteItem >> collection.removeHandler[PENDING]
     *                                      >> repository.deleteItem >> collection.removeHandler[DONE]

     */
    removeTrigger(itemId) {
        var item = Tools.search(parseInt(itemId), "id", this.connectedRepository.items);

        this.connectedRepository.deleteItem(item, this)
            .catch(err => {
                console.error(err);
                throw err;

            });
    }


    selectTrigger(itemId) {
        var item = Tools.search(parseInt(itemId), 'id', this.connectedRepository.items);
        this.connectedRepository.currentItem = item;
    }

    /*
     * Edycja jest triggerowana przez submit w modalu
     * Collection >> Modal submitTrigger() >> Repository
     */
}