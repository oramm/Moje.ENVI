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
        this.form;
        this.$dom;
    }
    initialise(){
        this.buildDom();
        Tools.hasFunction(this.submitTrigger);
        
    }
    
    buildDom(){
        this.form = new Form("foo_"+ this.id, "GET", this.formElements);
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
    
    
    preppendTriggerButtonTo($uiElelment,caption){
        var $button = $('<button data-target="' + this.id + '" class="btn modal-trigger">'+ caption +'</button>');
        var _this = this;
        $button.click(    function(){if(_this.fillWithInitData) _this.fillWithInitData() //funkcja dokładana w SpecificNewModal
                                  });
        $uiElelment.prepend($button);
    }
    
    preppendTriggerIconTo($uiElelment,caption){
        var $icon = $('<a data-target="' + this.id + '" class="collectionItemAddNew modal-trigger"><i class="material-icons">add</i></a>')
        var _this = this;
        $icon.click(    function(){if(_this.fillWithInitData) _this.fillWithInitData() //funkcja dokładana w SpecificNewModal
                                  });
        $uiElelment.prepend($icon);                         
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
} 