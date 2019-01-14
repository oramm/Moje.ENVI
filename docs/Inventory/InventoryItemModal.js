class InventoryItemModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, mode){
        super(id, tittle, connectedResultsetComponent, mode);
        
        this.statusSelectField = new SelectField(this.id + 'typeSelectField', 'Status', true);
        this.statusSelectField.initialise(InventorySetup.statusNames);
        this.typeSelectField = new SelectField(this.id + 'statusSelectField', 'Typ obiektu', true);
        this.typeSelectField.initialise(InventorySetup.itemsTypesNames);
        
        this.formElements = [
            {   input: new InputTextField (this.id + 'nameTextField','Nazwa', undefined, true, 150, '.{3,}'),
                dataItemKeyName: 'name'
            },
            {   input: this.typeSelectField,
                dataItemKeyName: 'type'
            },
            {   input: new InputTextField (this.id + 'licensePlateNumberTextField','Nr rejestracyjny pojazdu', undefined, true, 8),
                dataItemKeyName: 'licensePlateNumber'
            },
            {   input: new ReachTextArea (this.id + 'descriptionReachTextArea','Opis', false, 300),
                dataItemKeyName: 'description'
            },
            {   input: this.statusSelectField,
                dataItemKeyName: 'status'
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