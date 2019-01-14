class EventModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, mode){
        super(id, tittle, connectedResultsetComponent, mode);
        //Id 	Name 	Description 	Date 	ExpiryDate 	Type 	OwnerId 	Status 	LastUpdated 
        this.descriptionReachTextArea = new ReachTextArea (this.id + 'descriptionReachTextArea','Opis', false, 300);
        this.datePicker = new DatePicker(this.id + 'datePickerField','Data wykonania', true);
        this.expiryDatePicker = new DatePicker(this.id + 'expiryDatePickerField','Ważne do', true);
        this.statusSelectField = new SelectField(this.id + 'statusSelectField', 'Status', true);
        this.statusSelectField.initialise(EventsSetup.statusNames);
        
        this.personAutoCompleteTextField = new AutoCompleteTextField(this.id+'_personAutoCompleteTextField',
                                                                     'Imię i nazwisko', 
                                                                     'person', 
                                                                     true, 
                                                                     'Wybierz imię i nazwisko')
        this.personAutoCompleteTextField.initialise(InventorySetup.personsRepository,"nameSurnameEmail", this.onOwnerChosen, this);
        
        this.formElements = [
            {   input: new InputTextField (this.id + '_nameTextField','Nazwa', undefined, true, 150, '.{3,}'),
                dataItemKeyName: 'name'
            },
            {   input: this.descriptionReachTextArea,
                dataItemKeyName: 'description'
            },
            {   input: this.datePicker,
                dataItemKeyName: 'date'
            },
            {   input: this.expiryDatePicker,
                dataItemKeyName: 'expiryDate'
            },
            {   input: this.statusSelectField,
                dataItemKeyName: 'status'
            },
            {   input: this.personAutoCompleteTextField,
                dataItemKeyName: '_owner'
            }
        ];
        this.initialise();
    }
    /*
     * Używana przy włączaniu Modala w celu dodania nowego rekordu
     * @returns {undefined}
     */
    initAddNewData(){
    }
};