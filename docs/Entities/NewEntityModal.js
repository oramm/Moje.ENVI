class NewEntityModal extends EntityModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        this.fillWithTestData();

    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewEntity
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        super.submitTrigger();
        if(this.isReallyNew(this.dataObject)){
            entitiesRepository.addNewItem(entitiesRepository.currentItem, this.connectedResultsetComponent);
        } else {
            alert("Taka osoba już jest w bazie");
        }
    }
    
    isReallyNew(person){
        var isReallyNew = entitiesRepository.items.find( item => item.name == entity.name && 
                                                                item.taxNumber == item.taxNumber
                                                      )   
        return (isReallyNew === undefined)? true : false;
    }
    
    fillWithTestData(){
        this.$formElements[0].children('input').val('nazwa');
        this.$formElements[1].children('input').val('adres');
        this.$formElements[2].children('input').val('1231');
        this.$formElements[3].children('input').val('www.s.pl');
        this.$formElements[4].children('input').val('t@t.pl');
        this.$formElements[5].children('input').val('111');
        this.$formElements[5].children('input').val('222');
    }
};