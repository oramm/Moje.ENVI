class PersonModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        
        this.commentReachTextArea = new ReachTextArea (this.id + 'commentReachTextArea','Uwagi', false, 300);
                
        this.entityAutocompleteTextField = new AutoCompleteTextField(this.id+'entityAutoCompleteTextField',
                                                                     'Firma', 
                                                                     'business_center', 
                                                                     true, 
                                                                     'Wybierz nazwę podmiotu z listy')
        this.entityAutocompleteTextField.initialise(entitiesRepository,"name", this.onEntityChosen, this);
        
        this.formElements = [
            new InputTextField (this.id + 'nameTextField','Imię', undefined,  true, 50, '.{3,}'),
            new InputTextField (this.id + 'surnameTextField','Nazwisko', undefined, true, 50, '.{3,}'),
            new InputTextField (this.id + 'positionTextField','Stanowisko', undefined, true, 50, '.{3,}'),
            new InputTextField (this.id + 'emailTextField','E-mail', undefined, true, 50),
            this.entityAutocompleteTextField,
            new InputTextField (this.id + 'cellphoneTextField','Tel. kom.', undefined, false, 25, '.{7,}'),
            new InputTextField (this.id + 'phoneTextField','Tel.', undefined, false, 25, '.{7,}'),
            this.commentReachTextArea
        ];
        this.initialise();
    }

    fillWithData(){
        this.form.fillWithData([
            PersonsSetup.personsRepository.currentItem.name,
            PersonsSetup.personsRepository.currentItem.surname,
            PersonsSetup.personsRepository.currentItem.position,
            PersonsSetup.personsRepository.currentItem.email,
            PersonsSetup.personsRepository.currentItem.entityName,
            PersonsSetup.personsRepository.currentItem.cellphone,
            PersonsSetup.personsRepository.currentItem.phone,
            PersonsSetup.personsRepository.currentItem.comment
        ]);
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        tinyMCE.triggerSave();
        this.dataObject = { name: '',
                            surname: '',
                            position: '',
                            email: '',
                            chosenEntity: '',
                            cellphone: '',
                            phone: '',
                            comment: ''
                          };
        this.form.submitHandler(this.dataObject);
        if (this.form.validate(this.dataObject)){
            
            this.dataObject.entityName = this.dataObject.chosenEntity.name;
            this.dataObject.entityId = this.dataObject.chosenEntity.id;
            
        }
    }
    
};