class InventoryItemModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        
        this.statusSelectField = new SelectField(this.id + 'typeSelectField', 'Status', true);
        this.statusSelectField.initialise(InventorySetup.statusNames);
        this.typeSelectField = new SelectField(this.id + 'statusSelectField', 'Typ obiektu', true);
        this.typeSelectField.initialise(InventorySetup.itemsTypesNames);
        
        this.formElements = [
            new InputTextField (this.id + 'nameTextField','Nazwa', undefined, true, 150),
            this.typeSelectField,
            new InputTextField (this.id + 'licensePlateNumberTextField','Nr rejestracyjny pojazdu', undefined, true, 8),
            new ReachTextArea (this.id + 'descriptionReachTextArea','Opis', false, 300),
            this.statusSelectField
        ];
        this.initialise();
    }

    fillWithData(){
        this.form.fillWithData([
            this.connectedResultsetComponent.connectedRepository.currentItem.name,
            InventorySetup.getItemTypeNameById(this.connectedResultsetComponent.connectedRepository.currentItem.type),
            this.connectedResultsetComponent.connectedRepository.currentItem.licensePlateNumber,
            this.connectedResultsetComponent.connectedRepository.currentItem.description,
            InventorySetup.getItemStatusNameById(this.connectedResultsetComponent.connectedRepository.currentItem.status),
        ]);
    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> this.connectedResultsetComponent.connectedRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        tinyMCE.triggerSave();
        this.dataObject = { name: '',
                            type: '',
                            licensePlateNumber: '',
                            description: '',
                            status: ''
                          };
        this.form.submitHandler(this.dataObject);
        if (this.form.validate(this.dataObject)){
            //przerób status.Name na Status.Id
            this.dataObject.status = InventorySetup.getItemStatusIdByName(this.dataObject.status);
            //przerób status.Name na Status.Id
            this.dataObject.type = InventorySetup.getItemTypeIdByName(this.dataObject.type);
            if (this.connectedResultsetComponent.connectedRepository.currentItem)
                this.dataObject.id = this.connectedResultsetComponent.connectedRepository.currentItem.id; //używane tylko przy edycji
            this.connectedResultsetComponent.connectedRepository.setCurrentItem(this.dataObject);
        }
    }
    
};