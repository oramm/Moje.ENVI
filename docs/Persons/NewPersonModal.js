class NewPersonModal extends PersonModal {
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
            personsRepository.addNewItem(personsRepository.currentItem, this.connectedResultsetComponent);
        } else {
            alert("Taka osoba już jest w bazie");
        }
    }
    
    isReallyNew(person){
        var isReallyNew = personsRepository.items.find( item => item.name == person.name && 
                                                                item.surname == person.surname && 
                                                                item.email == person.email
                                                      )   
        return (isReallyNew === undefined)? true : false;
    }
    
    fillWithTestData(){
        this.$formElements[0].children('input').val('Imię');
        this.$formElements[1].children('input').val('Nazwisko');
        this.$formElements[2].children('input').val('Stanowisko');
        this.$formElements[3].children('input').val('t@t.pl');
        this.$formElements[4].children('input').val('nazwa firmy');
        this.$formElements[5].children('input').val('600222');
        this.$formElements[6].children('input').val('77111');
        this.$formElements[7].children('input').val('opis');
    }
};