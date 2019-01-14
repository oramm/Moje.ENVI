class EntityModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, mode){
        super(id, tittle, connectedResultsetComponent, mode);
        
        this.formElements = [
            {   input: new InputTextField (this.id + 'nameTextField','Nazwa', undefined, true, 150, '.{3,}'),
                dataItemKeyName: 'name'
            },
            {   input: new InputTextField (this.id + 'addressTextField','Adres', undefined, false, 250, '.{3,}'),
                dataItemKeyName: 'address'
            },
            {   input: new InputTextField (this.id + 'taxNumberTextField','NIP', undefined, false, 13, '([0-9]{3})(-|)([0-9]{3})(-|)([0-9]{2})(-|)([0-9]{2})'),
                dataItemKeyName: 'taxNumber'
            },
            {   input: new InputTextField (this.id + 'wwwTextField','Strona www', undefined, false, 150, '.{3,}'),
                dataItemKeyName: 'www'
            },
            {   input: new InputTextField (this.id + 'emailTextField','E-mail', undefined, false, 80, '.{3,}'),
                dataItemKeyName: 'email'
            },
            {   input: new InputTextField (this.id + 'phoneTextField','Tel.', undefined, false, 25, '.{3,}'),
                dataItemKeyName: 'phone'
            }
        ];
        this.initialise();
    }
    
    /*
     * Używana przy włączaniu Modala w celu dodania nowego rekordu
     * @returns {undefined}
     */
    initAddNewData(){
        this.connectedResultsetComponent.connectedRepository.currentItem.projectId = RolesSetup.rolesRepository.parentItemId; 
    }
};