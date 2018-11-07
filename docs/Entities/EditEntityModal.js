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
        if (this.form.validate(this.dataObject)){
            this.dataObject.id = EntitiesSetup.entitiesRepository.currentItem.id, //używane tylko przy edycji
            EntitiesSetup.entitiesRepository.setCurrentItem(this.dataObject);
            
            if(this.wasChanged(this.dataObject)){
                EntitiesSetup.entitiesRepository.editItem(EntitiesSetup.entitiesRepository.currentItem, this.connectedResultsetComponent);
            } else {
                alert("Taki wpis już jest w bazie!");
            }
        }
    }
    
    wasChanged(entity){
        var check = EntitiesSetup.entitiesRepository.items.find( item => Tools.areEqualObjects(item, entity)
                                                      )   
        return (!check)? true : false;
    }
};