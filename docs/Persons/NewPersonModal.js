class NewPersonModal extends PersonModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        this.fillWithInitData();

    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        super.submitTrigger();
        if (this.form.validate(this.dataObject)){
            PersonsSetup.personsRepository.setCurrentItem(this.dataObject);
            
            if(this.isReallyNew(this.dataObject)){
                PersonsSetup.personsRepository.addNewItem(PersonsSetup.personsRepository.currentItem, this.connectedResultsetComponent);
            } else {
                alert("Taki wpis już jest w bazie");
            }
        }
    }
    
    isReallyNew(person){
        var duplicateItem = personsRepository.items.find( item => item.name == person.name && 
                                                                item.surname == person.surname && 
                                                                item.email == person.email
                                                      )   
        return (!duplicateItem)? true : false;
    }
    
    fillWithInitData(){
    
    }
};