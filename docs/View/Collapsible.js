/* 
 * http://materializecss.com/collapsible.html
 */
class Collapsible {
    constructor(id, itemsName){
        this.id = id;
        this.itemsName = itemsName;
        this.$dom;
        this.$collapsible;
        this.$actionsMenu;
    }
    
    initialise(items, parentViewObject, parentViewObjectSelectHandler){
        this.items = items;
        this.parentViewObject = parentViewObject;
        this.parentViewObjectSelectHandler = parentViewObjectSelectHandler;
        
        this.isDeletable = true;
        this.isEditable = (this.$editModal !== undefined)? true : false;
        this.isSelectable = true;
        
        this.buildDom();
        this.actionsMenuInitialise();

        Tools.hasFunction(this.makeItem);
    }
    
    buildDom(){
        this.$collapsible = $('<ul class="collapsible" data-collapsible="accordion">')
        this.$collapsible.attr("id",this.id);
        this.$actionsMenu = $('<div >')
               .attr('id', 'actionsMenu' + '_' + this.id);
        
        this.$dom = $('<div>')
                .attr('id', 'container' + '_' + this.id)
                .append(this.$actionsMenu)
                .append(this.$collapsible);
        
        for (var i=0; i<this.items.length; i++){
            var $row = this.buildRow(this.items[i]);
            this.$collapsible
                .append($row);
        }
        this.$collapsible.collapsible();//inicjacja wg instrukcji materialisecss
        
        if (this.isEditable) this.setEditAction();
        if (this.isDeletable) this.setDeleteAction();
        if (this.isSelectable) this.setSelectAction();
    }
    /*
     * Tworzy element listy
     * @param {type} item - to gotowy item dla Collapsible (na podstawie surowych danych w repozytorium)s 
     * @returns {Collapsible.buildRow.$row|$}
     */
    buildRow(item){
        var $row = $('<li>');
        
        $row
            .append('<div class="collapsible-header"><i class="material-icons">filter_list</i>'+ item.name)
            .append('<div class="collapsible-body">');
        $row.children('.collapsible-header').attr('itemId', item.id);
                
            
       (item.$body!==undefined)? $row.children(':last').append(item.$body) : $row.children(':last').append('lista jest pusta');
        
        return $row;
        
    }
    
    filterInitialise(){
        this.$actionsMenu.append(FormTools.createFilterInputField("contract-filter",
                                                                  this.$collapsible.children('li'),
                                                                  "Znajdź " + this.itemsName)
                                );
    }
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę addNewHandler()
     * do usunięcia
     */
    actionsMenuInitialise(){
        //do usunięcia ten if
        if (this.addNewHandler !== undefined){
            var newItemButton = FormTools.createFlatButton('Dodaj '+ this.itemsName, this.addNewHandler);
            this.$actionsMenu.append(newItemButton);
        }
        
        if (this.$addNewModal !== undefined)
            this.$addNewModal.preppendTriggerButtonTo(this.$actionsMenu,"Dodaj wpis");
        this.filterInitialise();

    }
    
    setSelectAction(){
        var _this = this;
        this.$dom.find(".collapsible-header").click(function() {   
                                            _this.selectTrigger($(this).attr("itemId"));
                                            //_this.parentViewObjectSelectHandler.apply(_this.parentViewObject,[$(this).attr("id")]);
                                        });
    }
    
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę removeTrigger()
     */
    setDeleteAction(){
        this.$dom.find(".itemDelete").off('click');
        var _this = this;
        this.$dom.find(".itemDelete").click(function() {   
                                        _this.removeTrigger($(this).parent().parent().parent().parent().attr("id"));   
                                        });
    }
    
    setEditAction(){
        this.$dom.find(".itemEdit").off('click');
        var _this = this;
        this.$dom.find(".itemEdit").click(function() { 
                                        $(this).parent().parent().parent().parent().trigger('click');
                                        _this.$editModal.fillWithData();
                                        Materialize.updateTextFields();
                                        });
    }
}

