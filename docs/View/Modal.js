/* 
 * http://materializecss.com/modals.html#!
 * na końcu ww. strony jedt przykład jak obsłużyć zamykanie okna
 */
class Modal {
    constructor(id, tittle, connectedResultsetComponent, mode){
        this.id = id;
        this.tittle = tittle;
        this.connectedResultsetComponent = connectedResultsetComponent;
        this.mode=mode;
        if (!mode && mode !== 'ADD_NEW' && mode !== 'EDIT') throw new SyntaxError('Zła wartość mode');
        this.dataObject;
        this.form;
        this.$dom;
    }
    initialise(){
        this.buildDom();
        Tools.hasFunction(this.submitTrigger);       
    }
    
    buildDom(){
        this.form = new Form("form_"+ this.id, "GET", this.formElements);
        this.$dom = $('<div id="' + this.id + '" class="modal modal-fixed-footer">');
        this.connectedResultsetComponent.$dom
            .append(this.$dom).children(':last-child')
                .append('<div class="modal-content">').children()
                    .append(this.form.$dom);
        this.connectedResultsetComponent.$dom.children(':last-child')
                .append('<div class="modal-footer">').children(':last-child')
                    .append('<button class="modal-action modal-close waves-effect waves-green btn-flat ">ZAMKNIJ</a>');
        this.setTittle(this.tittle);
        this.setSubmitAction();
    }
    
    setTittle(tittle){
        this.$dom.children('.modal-content').prepend('<h4>'+ tittle +'</h4>');
    }
    /*
     * Tworzy ikonę edycji lub dodania rekordu do listy
     * @param {Collection | Collapsible} resultsetComponent
     * @returns {Modal.createTriggerIcon.$icon}
     */
    createTriggerIcon(){
        var iconType = (this.mode==='ADD_NEW')? 'add' : 'edit';
        var $triggerIcon = $('<SPAN data-target="' + this.id + '" ><i class="material-icons">' + iconType + '</i></SPAN>');
        //var _this = this;
        $triggerIcon
            .addClass((this.mode==='ADD_NEW')? 'collectionItemAddNew' : 'collectionItemEdit')
            .addClass('modal-trigger')
        return $triggerIcon;                     
    }
    /*
     * Akcja po włączeniu modala. Funkcja używana w connectedResultsetComponent.setEditAction()
     */
    triggerAction(connectedResultsetComponent){
        this.connectWithResultsetComponent(connectedResultsetComponent);
        if(this.mode=='EDIT') 
            this.form.fillWithData(this.connectedResultsetComponent.connectedRepository.currentItem);
        else
            this.initAddNewData();
        Materialize.updateTextFields();
    }
    /*
     * TODO do przeobienia anlogicznie jak z Icon. Do użycia tylko w Collapsible
     */
    preppendTriggerButtonTo($uiElelment,caption, resultsetComponent){
        var $button = $('<button data-target="' + this.id + '" class="btn modal-trigger">'+ caption +'</button>');
        var _this = this;
        $button.click(    function(){   //if(!_this.connectedResultsetComponent.constructor.name.includes('Collapsible')) {
                                            _this.connectWithResultsetComponent(resultsetComponent);
                                            _this.initAddNewData();
                                        //}
                                    });
        $uiElelment.prepend($button);
    }
    
    /*
     * wywoływana przed pokazaniem modala
     * @param {Collection | Collapsible} component
     * @returns {undefined}
     */
    connectWithResultsetComponent(component){
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
    isDuplicate(currentEditedItem){
        var duplicate = this.connectedResultsetComponent.connectedRepository.items.find(item => _.isEqual(item, currentEditedItem));
        return (duplicate)? true : false;
    }
    
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> this.connectedResultsetComponent.connectedRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        //var tinyMCE = tinyMCE || undefined;
        //if (tinyMCE) 
            try {
                tinyMCE.triggerSave();
            } catch (e){console.log('Modal.submitTrigger():: TinyMCE not defined')}
        var repository = this.connectedResultsetComponent.connectedRepository;
        //obiekt do zapisania danych z formularza
        var tmpDataObject = Tools.cloneOfObject(repository.currentItem);
        
        this.form.submitHandler(tmpDataObject);
        if (this.form.validate(tmpDataObject)){
            // usatawić tutaj dodatkowe pola jrśli potrzebne
            
                
            //if(!this.isDuplicate(tmpDataObject)){
                repository.setCurrentItem(tmpDataObject);
                if(this.mode==='EDIT')
                    repository.editItem(repository.currentItem, this.connectedResultsetComponent);
                else
                   repository.addNewItem(repository.currentItem, this.connectedResultsetComponent); 
            //} else {
            //    alert("Taki wpis już jest w bazie!");
            //}
        }
    }
} 