class PersonModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, connectedResultsetComponentAddNewHandler){
        super(id, tittle, connectedResultsetComponent, connectedResultsetComponentAddNewHandler);
        
        this.entityAutocompleteTextField = new AutoCompleteTextField(this.id+'entityAutoCompleteTextField',
                                                                     'Firma', 
                                                                     'business_center', 
                                                                     true, 
                                                                     'Wybierz nazwę podmiotu z listy')
        this.entityAutocompleteTextField.initialise(entitiesRepository,"name", this.onEntityChosen, this);
        this.$formElements = [
            FormTools.createInputField(this.id+'nameTextField','Imię', true, 50, '.{3,}'),
            FormTools.createInputField(this.id+'surnameTextField','Nazwisko', true, 50, '.{3,}'),
            FormTools.createInputField(this.id+'positionTextField','Stanowisko', true, 50),
            FormTools.createEmailInputField(this.id+'emailTextField','E-mail', true, 80),
            this.entityAutocompleteTextField.$dom,
            FormTools.createInputField(this.id+'cellphoneTextField','Tel. kom.', false, 25, '.{3,}'),
            FormTools.createInputField(this.id+'phoneTextField','Tel.', false, 25, '.{3,}'),
            FormTools.createInputField(this.id+'commentTextField','Uwagi', false, 200, '.{3,}'),
            
            FormTools.createSubmitButton("Zapisz")
        ];
        
        
        this.initialise();

    }
    fillWithData(){
        this.$formElements[0].children('input').val(personsRepository.currentItem.name);
        this.$formElements[1].children('input').val(personsRepository.currentItem.surname);
        this.$formElements[2].children('input').val(personsRepository.currentItem.position);
        this.$formElements[3].children('input').val(personsRepository.currentItem.email);
        this.$formElements[4].children('input').val(personsRepository.currentItem.entityName);
        this.entityAutocompleteTextField.setChosenItem(personsRepository.currentItem.entityName);
        this.$formElements[5].children('input').val(personsRepository.currentItem.cellphone);
        this.$formElements[6].children('input').val(personsRepository.currentItem.phone);
        this.$formElements[7].children('input').val(personsRepository.currentItem.comment);
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        this.dataObject = { id: personsRepository.currentItem.id, //używane tylko przy edycji
                            entityId: this.entityAutocompleteTextField.chosenItem.id,
                            entityName: this.entityAutocompleteTextField.chosenItem.name,
                            name: $('#'+this.id + 'nameTextField').val(),
                            surname: $('#' + this.id + 'surnameTextField').val(),
                            position: $('#' + this.id + 'positionTextField').val(),
                            email: $('#' + this.id + 'emailTextField').val(),
                            cellphone: $('#' + this.id + 'cellphoneTextField').val(),
                            phone: $('#' + this.id + 'phoneTextField').val(),
                            comment: $('#' + this.id + 'commentTextField').val()

                          };
        personsRepository.setCurrentItem(this.dataObject);
    }
    
};