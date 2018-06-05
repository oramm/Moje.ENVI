class EditEntityModal extends EntityModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewEntity
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        super.submitTrigger();
        
        if(this.wasChanged(this.dataObject)){
            entitiesRepository.editItem(entitiesRepository.currentItem, this.connectedResultsetComponent);
        } else {
            alert("Taki podmiot już jest w bazie!");
        }
    }
    
    wasChanged(entity){
        var check = entitiesRepository.items.find( item => item.name == entity.name && 
                                                                item.taxNumber == item.taxNumber
                                                      )   
        return (check === undefined)? true : false;
    }
};