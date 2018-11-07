class EventModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        //Id 	Name 	Description 	Date 	ExpiryDate 	Type 	OwnerId 	Status 	LastUpdated 
        this.descriptionReachTextArea = new ReachTextArea (this.id + 'descriptionReachTextArea','Opis', false, 300);
        this.datePicker = new DatePicker(this.id + 'datePickerField','Data wykonania', true);
        this.expiryDatePicker = new DatePicker(this.id + 'expiryDatePickerField','Ważne do', true);
        this.statusSelectField = new SelectField(this.id + 'statusSelectField', 'Status', true);
        this.statusSelectField.initialise(EventsSetup.statusNames);
        
        this.personAutoCompleteTextField = new AutoCompleteTextField(this.id+'personAutoCompleteTextField',
                                                                     'Imię i nazwisko', 
                                                                     'person', 
                                                                     true, 
                                                                     'Wybierz imię i nazwisko')
        this.personAutoCompleteTextField.initialise(InventorySetup.personsRepository,"nameSurnameEmail", this.onOwnerChosen, this);
        
        this.formElements = [
            new InputTextField (this.id + 'nameTextField','Nazwa', undefined, true, 150),
            this.descriptionReachTextArea,
            this.datePicker,
            this.expiryDatePicker,
            this.statusSelectField,
            this.personAutoCompleteTextField
        ];
        this.initialise();
    }

    fillWithData(){
        this.form.fillWithData([
            this.connectedResultsetComponent.connectedRepository.currentItem.name,
            this.connectedResultsetComponent.connectedRepository.currentItem.description,
            this.connectedResultsetComponent.connectedRepository.currentItem.date,
            this.connectedResultsetComponent.connectedRepository.currentItem.expiryDate,
            this.connectedResultsetComponent.connectedRepository.currentItem.status,
            this.connectedResultsetComponent.connectedRepository.currentItem.nameSurnameEmail,
        ]);
    }
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> connectedResultsetComponent.connectedRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        tinyMCE.triggerSave();
        this.dataObject = { name: '',
                            description: '',
                            date: '',
                            expiryDate: '',
                            status: '',
                            chosenPerson: ''
                          };
        this.form.submitHandler(this.dataObject);
        if (this.form.validate(this.dataObject)){
            if (this.connectedResultsetComponent.connectedRepository.currentItem)
                this.dataObject.id = this.connectedResultsetComponent.connectedRepository.currentItem.id; //używane tylko przy edycji
            
            this.dataObject.status = connectedResultsetComponent.connectedRepository.currentItem.status;
            this.dataObject.type = this.connectedResultsetComponent.eventsType;
            this.dataObject.inventoryItemId = InventorySetup.inventoryRepository.currentItem.id;
            this.dataObject.nameSurnameEmail = this.dataObject.chosenPerson.nameSurnameEmail;
            this.dataObject.ownerId = this.dataObject.chosenPerson.id;
            
        }
    }    
};