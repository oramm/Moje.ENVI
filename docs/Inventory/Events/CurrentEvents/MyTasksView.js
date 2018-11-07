class MyTasksView extends Popup {
    constructor(){
        super();       
    }
    
    initialise(){
        this.setTittle("Moje zadania");
        this.actionsMenuInitialise();
        
        $('#actionsMenu').after(new MyTasksCollection('myTasksCollection').$dom);  
        this.dataLoaded(true);
    }


    actionsMenuInitialise(){
    }
}