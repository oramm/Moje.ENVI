class SimpleCollapsible extends Collapsible {
    constructor(initParamObject) {
        if (initParamObject.subitemsCount && typeof initParamObject.subitemsCount !== 'number') throw SyntaxError('subitemsCount must be a number!');
        super(initParamObject);
        this.connectedRepository = initParamObject.connectedRepository;

        this.$bodyDoms = [];
    }

    makeCollapsibleItemsList() {
        var itemsList = [];
        if (this.connectedRepository.items) {
            var i = 0;
            for (const item of this.connectedRepository.items) {
                itemsList.push(this.makeItem(item, this.$bodyDoms[i++]));
            }
        }
        return itemsList;
    }

    makeBodyDoms() {
        for (var i = 0; i < this.connectedRepository.items.length; i++) {
            this.$bodyDoms[i] = this.makeBody(this.connectedRepository.items[i]).$dom;
        }
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