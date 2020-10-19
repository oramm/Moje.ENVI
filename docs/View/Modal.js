/* 
 * http://materializecss.com/modals.html#!
 * na końcu ww. strony jedt przykład jak obsłużyć zamykanie okna
 * externalrepository - jeżeli edytujemy obiekt spoza listy - inne repo niż connectedResultsetComponent.connectedRepository
 */
class Modal {
    constructor(id, title, connectedResultsetComponent, mode) {
        this.id = id;
        this.title = title;
        this.connectedResultsetComponent = connectedResultsetComponent;
        this.mode = mode;
        this.formElements = [];
        if (!mode && mode !== 'ADD_NEW' && mode !== 'EDIT') throw new SyntaxError('Zła wartość mode');
        this.dataObject;
        this.form;
        this.$dom;
        this.$title = $('<h4 class="modalTitle">');
    }

    initialise() {
        this.buildDom();
        Tools.hasFunction(this.submitTrigger);
    }

    buildDom() {
        this.form = new Form("form_" + this.id, "GET", this.formElements);
        this.$dom = $('<div id="' + this.id + '" class="modal modal-fixed-footer">');
        this.connectedResultsetComponent.$dom
            .append(this.$dom).children(':last-child')
            .append('<div class="modal-content">').children()
            .append(this.form.$dom);
        this.connectedResultsetComponent.$dom.children(':last-child')
            .append('<div class="modal-footer">').children(':last-child')
            .append('<button class="modal-action modal-close waves-effect waves-green btn-flat ">ZAMKNIJ</a>');
        this.$dom.children('.modal-content').prepend(this.$title);
        this.setTitle(this.title);
        this.setSubmitAction();
    }

    setTitle(title) {
        this.$title.text(title);
    }
    /*
     * Tworzy ikonę edycji lub dodania rekordu do listy
     * @param {Collection | Collapsible} resultsetComponent
     * @returns {Modal.createTriggerIcon.$icon}
     */
    createTriggerIcon() {
        var iconType = (this.mode === 'ADD_NEW') ? 'add' : 'edit';
        var $triggerIcon = $('<SPAN data-target="' + this.id + '" ><i class="material-icons">' + iconType + '</i></SPAN>');
        //var _this = this;
        $triggerIcon
            .addClass((this.mode === 'ADD_NEW') ? 'addNewItemIcon' : 'collectionItemEdit')
            .addClass('modal-trigger')
        return $triggerIcon;
    }
    /*
     * Akcja po włączeniu modala. 
     * Funkcja używana w connectedResultsetComponent.setEditAction() oraz connectedResultsetComponent.addNewAction()
     */
    triggerAction(connectedResultsetComponent) {
        ReachTextArea.reachTextAreaInit();
        if (Object.getPrototypeOf(connectedResultsetComponent).constructor.name !== 'RawPanel')
            $(connectedResultsetComponent.$dom.css('min-height', '300px'));
        this.connectWithResultsetComponent(connectedResultsetComponent);
        this.refreshDataSets();
        if (this.mode == 'EDIT')
            this.fillForm();
        else
            this.initAddNewData();
        Materialize.updateTextFields();
    }
    fillForm() {
        this.form.fillWithData(this.connectedResultsetComponent.connectedRepository.currentItem);
    }
    /*
     * Aktualizuje dane np. w selectach. Jest uruchamiana w this.triggerAction();
     */
    refreshDataSets() {
        for (var element of this.formElements) {
            if (typeof element.refreshDataSet === 'function')
                element.refreshDataSet();
        }
    }
    /*
     * TODO do przeobienia anlogicznie jak z Icon. Do użycia tylko w Collapsible
     */
    preppendTriggerButtonTo($uiElelment, caption, connectedResultsetComponent, buttonStyle) {
        var $button = $('<button data-target="' + this.id + '">' + caption + '</button>');
        $button
        .addClass((buttonStyle === 'FLAT') ? 'btn-flat' : 'btn')  
        .addClass('modal-trigger');
        var _this = this;
        $button.click(function () {
            _this.triggerAction(connectedResultsetComponent)
        });
        $uiElelment.prepend($button);
    }

    /*
     * wywoływana przed pokazaniem modala
     * @param {Collection | Collapsible} component
     * @returns {undefined}
     */
    connectWithResultsetComponent(component) {
        this.connectedResultsetComponent = component;
    }
    /*
     * Funkcja musi być obsłużona w klasie pochodnej.
     * Klasa pochodna musi mieć metodę submitTrigger()
     */
    setSubmitAction() {
        this.form.$dom.submit((event) => {
            this.submitTrigger();
            // prevent default posting of form
            event.preventDefault();
        });
    }
    /*
     * Używana przy Submit
     * @param {repositoryItem} currentEditedItem
     * @returns {undefined}
     */
    isDuplicate(currentEditedItem) {
        var duplicate = this.connectedResultsetComponent.connectedRepository.items.find(item => _.isEqual(item, currentEditedItem));
        return (duplicate) ? true : false;
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
        var tmpDataObject = Tools.cloneOfObject(this.connectedResultsetComponent.connectedRepository.currentItem);

        this.form.submitHandler(tmpDataObject)
            .then(() => {
                if (this.form.validate(tmpDataObject)) {
                    if (this.mode === 'EDIT')
                        this.editSubmitTrigger(tmpDataObject);
                    else
                        this.addNewSubmitTrigger(tmpDataObject)
                    this.connectedResultsetComponent.connectedRepository.currentItem = tmpDataObject;
                } else
                    alert('Formularz źle wypełniony')
                this.$dom.modal('close');
            })
    }

    editSubmitTrigger(dataObject) {
        if (this.doChangeFunctionOnItemName)
            this.connectedResultsetComponent.connectedRepository.doChangeFunctionOnItem(dataObject, this.doChangeFunctionOnItemName, this.connectedResultsetComponent)
        else
            this.connectedResultsetComponent.connectedRepository.editItem(dataObject, this.connectedResultsetComponent);
    }

    addNewSubmitTrigger(dataObject) {
        if (this.doAddNewFunctionOnItemName)
            this.connectedResultsetComponent.connectedRepository.doAddNewFunctionOnItem(dataObject, this.doAddNewFunctionOnItemName, this.connectedResultsetComponent)
        else
            this.connectedResultsetComponent.connectedRepository.addNewItem(dataObject, this.connectedResultsetComponent);
    }
} 