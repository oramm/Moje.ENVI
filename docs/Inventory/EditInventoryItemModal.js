class EditInventoryItemModal extends InventoryItemModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> casesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        super.submitTrigger();
        
        if(this.wasChanged(this.dataObject)){
            this.connectedResultsetComponent.connectedRepository.editItem(this.connectedResultsetComponent.connectedRepository.currentItem, 
                                                                          this.connectedResultsetComponent
                                                                         );
        } else {
            alert("Taki wpis już jest w bazie!");
        }
    }
    
    wasChanged(externalAchievement){
        var check = this.connectedResultsetComponent.connectedRepository.items.find(item => Tools.areEqualObjects(externalAchievement,item))   
        return (check === undefined)? true : false;
    }
};