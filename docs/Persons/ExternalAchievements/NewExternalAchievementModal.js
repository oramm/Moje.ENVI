class NewExternalAchievementModal extends ExternalAchievementModal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        this.fillWithTestData();
        

    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        super.submitTrigger();
        if(this.isReallyNew(this.dataObject)){
            externalAchievementsRepository.addNewItem(externalAchievementsRepository.currentItem, this.connectedResultsetComponent);
        } else {
            alert("Taki wpis już jest w bazie");
        }
    }
    
    isReallyNew(externalAchievement){
        var isReallyNew = externalAchievementsRepository.items.find( item => Tools.areEqualObjects(item, externalAchievement)
                                                      )   
        return (isReallyNew === undefined)? true : false;
    }
    
    fillWithTestData(){
        this.$formElements[0].children('input').val('');
        this.$formElements[1].children('input').val('Nazwisko');
        this.$formElements[2].children('input').val('opis doświadczxenie');
        this.$formElements[3].children('input').val('zakres robót');
        this.$formElements[4].children('input').val('11111');
        this.$formElements[5].children('input').val('22222');
        this.$formElements[6].children('input').val('12-06-2018');
        this.$formElements[7].children('input').val('12-08-2019');
        this.$formElements[8].children('input').val('PWoK testowe');
    }
};