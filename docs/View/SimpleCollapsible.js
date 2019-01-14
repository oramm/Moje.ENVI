class SimpleCollapsible extends Collapsible {
    constructor(id, itemsName, connectedRepository){
        if (typeof itemsName  !== 'string') throw SyntaxError('itemsName must be specified as a second argument!');
        super(id, itemsName);
        this.connectedRepository = connectedRepository;
        this.$bodyDoms=[];  
    }
    initialize(){
        super.initialise();
        this.makeBodyDoms();
    }
    makeCollapsibleItemsList(){
        var itemsList = [];
        for (var i=0; i<this.connectedRepository.items.length; i++){
            itemsList.push(this.makeItem(this.connectedRepository.items[i],
                           this.$bodyDoms[i])
                          );
            }
        return itemsList;
    }
    
    makeBodyDoms(){
        for(var i=0; i<this.connectedRepository.items.length; i++){
            this.$bodyDoms[i] = this.makeBodyDom(this.connectedRepository.items[i]);
        }
    }    
    
    actionsMenuInitialise(){
        super.actionsMenuInitialise();
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
        this.connectedRepository.itemSelected(itemId);
    }
    
}