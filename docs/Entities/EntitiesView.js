class EntitiesView extends Popup {
    constructor(){
        super();
    }
    initialise(){
        this.collection = new EntitiesCollection('entitiesCollection');
        this.setTittle("Podmioty wpółracujące");
        //this.actionsMenuInitialise();
        
        $('#actionsMenu').after(this.collection.$dom);
        this.dataLoaded(true);
    }
    
    actionsMenuInitialise(){
        //$('#actionsMenu').append(newPersonButton);
    }
}