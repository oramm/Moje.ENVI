class NewEntityModal extends EntityModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        this.fillWithInitData();
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
            this.dataObject.status = this.connectedResultsetComponent.status;
            EntitiesSetup.entitiesRepository.setCurrentItem(this.dataObject);
            
            if(this.isReallyNew(this.dataObject)){
                EntitiesSetup.entitiesRepository.addNewItem(EntitiesSetup.entitiesRepository.currentItem, this.connectedResultsetComponent);
            } else {
                alert("Taki wpis już jest w bazie");
            }
        }
    }
    
    
    isReallyNew(entity){
        var duplicateItem = EntitiesSetup.entitiesRepository.items.find( item => item.name == entity.name && 
                                                                item.taxNumber == item.taxNumber
                                                      )   
        return (!duplicateItem)? true : false;
    }
    
    fillWithInitData(){
        //this.formElements[0].$dom.children('input').val('nazwa testoWA');
        //tinyMCE.get(this.id + 'descriptionReachTextArea').setContent('OPIS TESOTWY');
        //tinyMCE.triggerSave();
        //this.startDatePicker.setChosenDate("2018-02-06");
        //this.endDatePicker.setChosenDate("2018-02-06");
        //this.statusSelectField.setChosenItem(this.connectedResultsetComponent.status); 
    }
};