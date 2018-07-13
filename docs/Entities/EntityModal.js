class EntityModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, connectedResultsetComponentAddNewHandler){
        super(id, tittle, connectedResultsetComponent, connectedResultsetComponentAddNewHandler);
        this.$formElements = [
            FormTools.createInputField(this.id+'nameTextField','Nazwa', true, 150, '.{3,}'),
            FormTools.createInputField(this.id+'addressTextField','Adres', false, 250, '.{3,}'),
            FormTools.createInputField(this.id+'taxNumberTextField','NIP', false, 13, '([0-9]{3})(-|)([0-9]{3})(-|)([0-9]{2})(-|)([0-9]{2})'),
            FormTools.createInputField(this.id+'wwwTextField','Strona www', false, 150, '.{3,}'),
            FormTools.createEmailInputField(this.id+'emailTextField','E-mail', false, 80, '.{3,}'),
            FormTools.createInputField(this.id+'phoneTextField','Tel.', false, 25, '.{3,}'),
            FormTools.createInputField(this.id+'faxTextField','Fax', false, 25, '.{3,}'),
            FormTools.createSubmitButton("Zapisz")
        ];
        this.initialise();
        //$('#' + this.id + 'nameTextField').keyup(function() {
        //    alert($(this).val())})
    }
    fillWithData(){
        this.$formElements[0].children('input').val(entitiesRepository.currentItem.name);
        this.$formElements[1].children('input').val(entitiesRepository.currentItem.address);
        this.$formElements[2].children('input').val(entitiesRepository.currentItem.taxNumber);
        this.$formElements[3].children('input').val(entitiesRepository.currentItem.www);
        this.$formElements[4].children('input').val(entitiesRepository.currentItem.email);
        this.$formElements[5].children('input').val(entitiesRepository.currentItem.phone);
        this.$formElements[6].children('input').val(entitiesRepository.currentItem.fax)
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewEntity
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        this.dataObject = { id: entitiesRepository.currentItem.id, //używane tylko przy edycji
                            name: $('#'+this.id + 'nameTextField').val(),
                            address: $('#' + this.id + 'addressTextField').val(),
                            taxNumber: $('#' + this.id + 'taxNumberTextField').val(),
                            www: $('#' + this.id + 'wwwTextField').val(),
                            email: $('#' + this.id + 'emailTextField').val(),
                            phone: $('#' + this.id + 'phoneTextField').val(),
                            fax: $('#' + this.id + 'faxTextField').val()

                          };
        entitiesRepository.setCurrentItem(this.dataObject);
    }
    
};