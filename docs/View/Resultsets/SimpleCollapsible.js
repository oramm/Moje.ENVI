class SimpleCollapsible extends Collapsible {
    constructor(initParamObject) {
        if (initParamObject.subitemsCount && typeof initParamObject.subitemsCount !== 'number') throw SyntaxError('subitemsCount must be a number!');
        super(initParamObject);

        this.$bodyDoms = [];
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
            });
    }

    selectTrigger(itemId) {
        this.connectedRepository.setCurrentItemById(itemId);
    }

}