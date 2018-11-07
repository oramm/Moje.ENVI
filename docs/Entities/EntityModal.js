class EntityModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent){
        super(id, tittle, connectedResultsetComponent);
        
        this.formElements = [
            new InputTextField (this.id + 'nameTextField','Nazwa', undefined, true, 150, '.{3,}'),
            new InputTextField (this.id + 'addressTextField','Adres', undefined, false, 250, '.{3,}'),
            new InputTextField (this.id + 'taxNumberTextField','NIP', undefined, false, 13, '([0-9]{3})(-|)([0-9]{3})(-|)([0-9]{2})(-|)([0-9]{2})'),
            new InputTextField (this.id + 'wwwTextField','Strona www', undefined, false, 150, '.{3,}'),
            new InputTextField (this.id + 'emailTextField','E-mail', undefined, false, 80, '.{3,}'),
            new InputTextField (this.id + 'phoneTextField','Tel.', undefined, false, 25, '.{3,}'),
        ];
        this.initialise();
    }

    fillWithData(){
        this.form.fillWithData([
            EntitiesSetup.entitiesRepository.currentItem.name,
            EntitiesSetup.entitiesRepository.currentItem.address,
            EntitiesSetup.entitiesRepository.currentItem.taxNumber,
            EntitiesSetup.entitiesRepository.currentItem.www,
            EntitiesSetup.entitiesRepository.currentItem.email,
            EntitiesSetup.entitiesRepository.currentItem.phone,
            EntitiesSetup.entitiesRepository.currentItem.fax
        ]);
    }
    
    
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewEntity
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> entitiesRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        this.dataObject = { name: '',
                            address: '',
                            taxNumber: '',
                            www: '',
                            email: '',
                            phone: '',
                            fax: ''
                          };
        this.form.submitHandler(this.dataObject);
        if (this.form.validate(this.dataObject)){
            
            this.dataObject.id = EntitiesSetup.entitiesRepository.currentItem.id;
        }
    }
    
};