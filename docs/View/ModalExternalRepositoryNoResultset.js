class ModalExternalRepositoryNoResultset extends Modal {
    constructor(id, title, mode, repository) {
        super(id, title, undefined, mode)
        this.repository = (repository) ? repository : {};
    }
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> this.connectedResultsetComponent.connectedRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger() {
        try {
            tinyMCE.triggerSave();
        } catch (e) { console.log('Modal.submitTrigger():: TinyMCE not defined') }

        //obiekt z bieżącej pozycji na liście connectedResultsetComponent do zapisania danych z formularza
        var tmpDataObject = Tools.cloneOfObject(this.repository.currentItem);

        this.form.submitHandler(tmpDataObject)
            .then(() => {
                if (this.form.validate(tmpDataObject)) {
                    if (this.mode === 'EDIT')
                        this.editSubmitTrigger(tmpDataObject);
                    else
                        this.addNewSubmitTrigger(tmpDataObject)
                    this.repository.currentItem = tmpDataObject;
                } else
                    alert('Formularz źle wypełniony')
                this.$dom.modal('close');
            })
    }

    editSubmitTrigger(dataObject) {
        if (this.doChangeFunctionOnItemName)
            this.repository.doChangeFunctionOnItem(dataObject, this.doChangeFunctionOnItemName, this.connectedResultsetComponent)
        else
            this.repository.editItem(dataObject, this.connectedResultsetComponent);
    }

    addNewSubmitTrigger(dataObject) {
        if (this.doAddNewFunctionOnItemName)
            this.repository.doAddNewFunctionOnItem(dataObject, this.doAddNewFunctionOnItemName, this.connectedResultsetComponent)
        else
            this.repository.addNewItem(dataObject, this.connectedResultsetComponent);
    }
    /*
     * używana w this.triggerAction() - po właczeniu modala do edycji
     */
    fillForm() {
        this.form.fillWithData(this.repository.currentItem);
    }
}