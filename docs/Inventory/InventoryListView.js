class InventoryListView extends Popup {
    constructor(){
        super();       
    }
    
    initialise(){
        this.setTittle("Pojazdy i sprzęt");
        this.actionsMenuInitialise();
        
        $('#actionsMenu').after(new InventoryCollapsible('inventoryCollapsible', InventorySetup.inventoryRepository).$dom);  
        this.dataLoaded(true);
    }


    actionsMenuInitialise(){
    }
}