class ModalExternalRepository extends Modal {
    constructor(id, title, connectedResultsetComponent, mode, externalRepository) {
        super(id, title, connectedResultsetComponent, mode)
        this.externalRepository = (externalRepository) ? externalRepository : {};
    }
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> this.connectedResultsetComponent.connectedRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    async submitTrigger() {
        try {
            tinyMCE.triggerSave();
        } catch (e) { console.log('Modal.submitTrigger():: TinyMCE not defined') }

        //obiekt z bieżącej pozycji na liście connectedResultsetComponent do zapisania danych z formularza
        var tmpDataObject = Tools.cloneOfObject(this.connectedResultsetComponent.connectedRepository.currentItem);
        //obiekt do zapisania spoza connectedResultsetComponent
        var extRepoDataObject;
        if (this.externalRepository.currentItem) extRepoDataObject = Tools.cloneOfObject(this.externalRepository.currentItem);

        await this.form.submitHandler(extRepoDataObject)
        //do serwera wysyłam edytowany obiekt z zewnerznego repozytorium - trzeba tam używać tej zmiennej
        tmpDataObject._extRepoTmpDataObject = extRepoDataObject;
        if (this.form.validate(extRepoDataObject)) {
            if (this.mode === 'EDIT')
                this.editSubmitTrigger(tmpDataObject);
            else
                this.addNewSubmitTrigger(tmpDataObject)
            this.connectedResultsetComponent.connectedRepository.currentItem = tmpDataObject;
        } else
            alert('Formularz źle wypełniony')
        this.$dom.modal('close');
    }

    async editSubmitTrigger(dataObject) {
        let argument = (this.doChangeFunctionOnItemName) ? this.doChangeFunctionOnItemName : this.doChangeOnItemRoute;
        let editedItem = await this.connectedResultsetComponent.connectedRepository.doChangeFunctionOnItem(dataObject, argument, this.connectedResultsetComponent)
        if (this.externalRepository.currentItem && editedItem._extRepoTmpDataObject) {
            this.externalRepository.clientSideEditItemHandler(dataObject._extRepoTmpDataObject);
        }
    }

    async addNewSubmitTrigger(dataObject) {
        let argument = (this.doAddNewFunctionOnItemName) ? this.doAddNewFunctionOnItemName : this.doAddNewItemRoute;
        let editedItem = await this.connectedResultsetComponent.connectedRepository.doChangeFunctionOnItem(dataObject, argument, this.connectedResultsetComponent)
        if (this.externalRepository.currentItem && dataObject._extRepoTmpDataObject) {
            this.externalRepository.clientSideAddNewItemHandler(editedItem._extRepoTmpDataObject);
        }
    }
    /*
     * używana w this.triggerAction() - po właczeniu modala do edycji
     */
    fillForm() {
        this.form.fillWithData(this.externalRepository.currentItem);
    }
}