/* 
 * http://materializecss.com/modals.html#!
 * na końcu ww. strony jedt przykład jak obsłużyć zamykanie okna
 */
class Modal {
    constructor(id, tittle, connectedResultsetComponent){
        this.id = id;
        this.tittle = tittle;
        this.connectedResultsetComponent = connectedResultsetComponent;
        
        this.dataObject;
        this.$formElements;
        this.$form;
        this.$dom;
    }
    initialise(){
        this.buildDom();
        this.addFormElements();
        Tools.hasFunction(this.submitTrigger);
    }
    
    buildDom(){
        this.$form = FormTools.createForm("foo_"+ this.id, "GET");
        $('body')
            .append('<div id="' + this.id + '" class="modal modal-fixed-footer">');
        $('#' + this.id).append('<div class="modal-content">');
        $('#' + this.id + ' .modal-content').append(this.$form)
        $('#' + this.id).append('<div class="modal-footer">');
        $('#' + this.id + ' .modal-footer').append('<button class="modal-action modal-close waves-effect waves-green btn-flat ">OK</a>');
        this.setTittle(this.tittle);
        this.setSubmitAction();

        $('#' + this.id).modal();
    }
    
    addFormElements(){
        for (var i = 0; i<this.$formElements.length; i++){
            this.appendUiElement(this.$formElements[i])
        }
    }
    
    setTittle(tittle){
        $('#' + this.id + ' .modal-content' ).prepend('<h4>'+ tittle +'</h4>');
    }
    /*
     * @param {String} uiElement html Code for JQUERY Append.
     */
    appendUiElement($uiElelment){
        return new Promise((resolve, reject) => {
            this.$form
                    .append('<div class="row">').children(':last-child')
                        .append($uiElelment);
            resolve($uiElelment + "appended prpoperly");
        })
     }
    
    preppendTriggerButtonTo($uiElelment,caption){
        $uiElelment.prepend('<button data-target="' + this.id + '" class="btn modal-trigger">'+ caption +'</button>');
    }
    
    /*
     * Funkcja musi być obsłużona w klasie pochodnej.
     * Klasa pochodna musi mieć metodę submitTrigger()
     */
    setSubmitAction() {
        this.$form.submit((event) => {
            this.submitTrigger();
            // prevent default posting of form
            event.preventDefault();
        });
    }
} 