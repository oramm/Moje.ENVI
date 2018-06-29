/* 
 * http://materializecss.com/collapsible.html
 */
class Collapsible {
    constructor(itemsName){
        this.itemsName = itemsName;
        this.$dom;
        this.$collapsible;
        this.$actionsMenu;
    }
    
    initialise(id, items, parentViewObject, parentViewObjectSelectHandler){
        this.id = id;
        this.items = items;
        this.parentViewObject = parentViewObject;
        this.parentViewObjectSelectHandler = parentViewObjectSelectHandler;
        this.buildDom();
        this.actionsMenuInitialise();
        Tools.hasFunction(this.addNewHandler);
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
        
        if (this.parentViewObjectRemoveHandler !== undefined)
            this.setRemoveAction();
        if (this.parentViewObjectSelectHandler !== undefined)
            this.setClickAction();

    }
    
    buildRow(item){
        var $row = $('<li>');
        $row
                .append('<div class="collapsible-header"><i class="material-icons">filter_list</i>'+ item.name +'</div>')
                .append('<div class="collapsible-body">');
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
     */
    actionsMenuInitialise(){
        var newItemButton = FormTools.createFlatButton('Dodaj '+ this.itemsName, this.addNewHandler);
        this.$actionsMenu.append(newItemButton);
        this.filterInitialise();

    }
    
    setClickAction(){
        var _this = this;
        this.$dom.find(".collapsible > li").click(function() {   
                                            _this.$dom.find(".collapsible > li").attr("class", "collection-item avatar");
                                            $(this).attr("class", "collection-item avatar active");
                                            _this.parentViewObjectSelectHandler.apply(_this.parentViewObject,[$(this).attr("id")]);
                                        });
    }
    
    setRemoveAction(){
        var _this = this;
        this.$dom.find(".itemDelete").click(function() {   
                                            _this.parentViewObjectRemoveHandler.apply(_this.parentViewObject,[$(this).parent().parent().parent().parent().attr("id")]);
                                        });
    }
}

