class PersonsView extends Popup {
    constructor(){
        super();
    }
    initialise(){
        this.personsCollection = new PersonsCollection('personsCollection');
        this.setTittle("Kontakty ENVI");
        //this.actionsMenuInitialise();
        
        $('#actionsMenu').after(this.personsCollection.$dom);
        this.dataLoaded(true);
    }
    
    actionsMenuInitialise(){
        //$('#actionsMenu').append(newPersonButton);
    }
}