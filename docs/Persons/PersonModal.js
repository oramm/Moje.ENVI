class PersonModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, mode){
        super(id, tittle, connectedResultsetComponent, mode);
        
        this.commentReachTextArea = new ReachTextArea (this.id + 'commentReachTextArea','Uwagi', false, 300);
                
        this.entityAutocompleteTextField = new AutoCompleteTextField(this.id+'entityAutoCompleteTextField',
                                                                     'Firma', 
                                                                     'business_center', 
                                                                     true, 
                                                                     'Wybierz nazwę podmiotu z listy')
        this.entityAutocompleteTextField.initialise(entitiesRepository,"name", this.onEntityChosen, this);
        
        this.formElements = [
            {   input: new InputTextField (this.id + 'nameTextField','Imię', undefined,  true, 50, '.{3,}'),
                dataItemKeyName: 'name'
            },
            {   input: new InputTextField (this.id + 'surnameTextField','Nazwisko', undefined, true, 50, '.{3,}'),
                dataItemKeyName: 'surname'
            },
            {   input: new InputTextField (this.id + 'positionTextField','Stanowisko', undefined, true, 50, '.{3,}'),
                dataItemKeyName: 'position'
            },
            {   input: new InputTextField (this.id + 'emailTextField','E-mail', undefined, true, 50),
                dataItemKeyName: 'email'
            },
            {   input: this.entityAutocompleteTextField,
                dataItemKeyName: '_entity'
            },
            {   input: new InputTextField (this.id + 'cellphoneTextField','Tel. kom.', undefined, false, 25, '.{7,}'),
                dataItemKeyName: 'cellphone'
            },
            {   input: new InputTextField (this.id + 'phoneTextField','Tel.', undefined, false, 25, '.{7,}'),
                dataItemKeyName: 'phone'
            },
            {   input: this.commentReachTextArea,
                dataItemKeyName: 'comment'
            }
        ];
        this.initialise();
    }
    /*
     * Używana przy włączaniu Modala w celu dodania nowego rekordu
     * @returns {undefined}
     */
    initAddNewData(){
        this.connectedResultsetComponent.connectedRepository.currentItem = {}; 
    }    
};