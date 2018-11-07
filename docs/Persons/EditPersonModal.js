class EditPersonModal extends PersonModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
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
            this.dataObject.id = PersonsSetup.personsRepository.currentItem.id, //używane tylko przy edycji
            PersonsSetup.personsRepository.setCurrentItem(this.dataObject);
            
            if(this.wasChanged(this.dataObject)){
                PersonsSetup.personsRepository.editItem(PersonsSetup.personsRepository.currentItem, this.connectedResultsetComponent);
            } else {
                alert("Taki wpis już jest w bazie!");
            }
        }
    }
    
    wasChanged(person){
        var check = personsRepository.items.find(item => Tools.areEqualObjects(person,item))   
        return (check === undefined)? true : false;
    }
};