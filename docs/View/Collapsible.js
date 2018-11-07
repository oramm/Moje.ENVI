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
        
        //buduję szkielet, żeby podpiąć modale do $dom, 
        //na założeniu, że dom powstaje w konstruktorze bazuje Modal.buildDom()
        this.$collapsible = $('<ul class="collapsible" data-collapsible="accordion">')
        this.$collapsible.attr("id",this.id);
        this.$actionsMenu = $('<div >')
               .attr('id', 'actionsMenu' + '_' + this.id);
        
        this.$dom = $('<div>')
                .attr('id', 'container' + '_' + this.id)
                .append(this.$actionsMenu)
                .append(this.$collapsible);
    }
    
    initialise(items, parentViewObject, parentViewObjectSelectHandler){
        this.items = items;
        this.parentViewObject = parentViewObject;
        this.parentViewObjectSelectHandler = parentViewObjectSelectHandler;
        
        this.isDeletable = true;
        this.isEditable = (this.editModal !== undefined)? true : false;
        this.isSelectable = true;
        
        this.buildDom();
        this.actionsMenuInitialise();

        Tools.hasFunction(this.makeItem);
        Tools.hasFunction(this.makeBodyDom);
    }
    
    buildDom(){
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
     * @param {type} item - to gotowy item dla Collapsible (na podstawie surowych danych w repozytorium)
     * @returns {Collapsible.buildRow.$row|$}
     */
    buildRow(item){
        var $row = $('<li>');
        var $crudButtons = $('<span class="crudButtons right">');
        $crudButtons
            .css('visibility', 'hidden')
        
        $row
            .append('<div class="collapsible-header"><i class="material-icons">filter_list</i>'+ item.name)
            .append('<div class="collapsible-body">')
            .attr('itemId', item.id)
            .addClass('collapsible-item');
        $row.children('.collapsible-header')
            .css('display', 'block')
            .append($crudButtons);

        $row.children(':last').append((item.$body!==undefined)? item.$body : this.makeBodyDom(item));
        this.addRowCrudButtons($row);
        return $row;
        
    }
    
     /*
     * Ustawia pryciski edycji wierszy
     */
    addRowCrudButtons($row){
        if (this.isDeletable || this.isEditable){
            var $crudMenu = $row.find('.collapsible-header > .crudButtons');
            if (this.editModal !== undefined) 
                $crudMenu
                    .append('<span data-target="' + this.editModal.id + '" class="collapsibleItemEdit modal-trigger"><i class="material-icons">edit</i></span>')
            if (this.isDeletable) 
                $crudMenu
                    .append('<span class="collapsibleItemDelete"><i class="material-icons">delete</i></span>');
        }
    }
    
    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {CollapsibleItem} item
     * @param {String} errorMessage
     * @returns {Promise}
     */
    addNewHandler(status, item, errorMessage){
        switch (status) {
            case "DONE":
                this.$collapsible.children('[itemid=' + item.tmpId +']').children('.progress').remove();
                this.$collapsible.children('[itemid=' + item.tmpId +']').attr('itemid',item.id);
                //.$('#preloader'+item.id).remove();
                if (this.editModal !== undefined) this.setEditAction();
                if (this.isDeletable) this.setDeleteAction();
                if (this.isSelectable) this.setSelectAction();
                this.items.push(this.makeItem(item));
                return status;
                break;
            case "PENDING":  
                if (this.items.length == 0) {
                    this.$dom.find('.emptyList').remove();
                }
                item.id = this.items.length+1 + '_pending';
                this.$collapsible.prepend(this.buildRow(this.makeItem(item)));
                this.$collapsible.find('[itemid=' + item.id +']').append(this.makePreloader('preloader'+item.id))
                return item.id;
                break;
            case "ERROR":
                alert(errorMessage);
                this.$collapsible.find('[itemid=' + item.tmpId +']').remove();
                //$('#preloader'+item.id).remove();
                if (this.items.length == 0) {
                    this.$dom.prepend(this.$emptyList);
                }
                return status;
                break;
            }
    }
    
    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {dataItem} item surowe dane, które trzeba przetworzyć przez this.makeItem()
     * @param {String} errorMessage
     * @returns {Promise}
     */
    editHandler(status, item, errorMessage){
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    $('#preloader'+item.id).remove();
                    this.items = this.items.filter(function(searchItem){return searchItem.id!==item.id});
                    this.items.push(this.makeItem(item));
                    this.setEditAction();
                    var $oldRow = this.$collapsible.find('[itemid=' + item.id + '_toDelete]');
                    $oldRow.remove();
                    if (this.isDeletable) this.setDeleteAction();
                    if (this.isSelectable) this.setSelectAction();
                    break;
                case "PENDING":  
                    var $oldRow = this.$collapsible.find('[itemid=' + item.id +']');
                    $oldRow.attr('itemid',item.id + '_toDelete');
                    var $newRow = this.buildRow(this.makeItem(item));
                    $newRow.append(this.makePreloader('preloader'+item.id))
                    $oldRow.after($newRow);
                    $oldRow.hide(1000);
                    
                    break;
                case "ERROR":
                    alert(errorMessage);
                    this.$collapsible.find('[itemid=' + item.id +']').remove();
                    var $oldRow = this.$collapsible.find('[itemid=' + item.id + '_toDelete]');
                    $oldRow.show(1000);
                    $oldRow.attr('itemid',item.id);
                    if (this.items.length == 0) {
                        this.$dom.prepend(this.$emptyList);
                    }

                    break;
                }
            resolve(status)
        });
    }
    
    /*
     * Krok 3 - funkcja wywoływana w rolesRepository.unasoosciatePersonRole potrzebny trik z appply dla callbacka
     */
    removeHandler(status,itemId, errorMessage){
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    this.$dom.find('[itemid=' + itemId +']').remove();
                    this.items = this.items.filter(function(item){return item.id!==itemId});
                    if (this.items.length == 0) {
                        this.$dom.prepend(this.$emptyList);
                    }
                    break;
                case "PENDING":
                    this.$dom.find('[itemid=' + itemId +']').append('<span class="new badge red" data-badge-caption="">kasuję...</span>');
                    break;
                case "ERROR":
                    alert(errorMessage);
                    break;
                }
            resolve(status);
        });
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
        if (this.$addNewModal !== undefined)
            this.$addNewModal.preppendTriggerButtonTo(this.$actionsMenu,"Dodaj wpis");
        this.filterInitialise();

    }
    
    setSelectAction(){
        var _this = this;
        this.$dom.find(".collapsible-header").click(function() {   
                                            _this.selectTrigger($(this).parent().attr("itemId"));
                                            $('.collapsible').find('.collapsible-header > .crudButtons')
                                                .css('visibility', 'hidden')
                                            $(this).children('.crudButtons')
                                                .css('visibility', 'visible');
                                            //_this.parentViewObjectSelectHandler.apply(_this.parentViewObject,[$(this).attr("id")]);
                                        });
    }
    
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę removeTrigger()
     */
    setDeleteAction(){
        this.$dom.find(".collapsibleItemDelete").off('click');
        var _this = this;
        this.$dom.find(".collapsibleItemDelete").click(function() {   
                                        _this.removeTrigger($(this).parent().parent().parent().attr("itemId"));   
                                        });
    }
    
    setEditAction(){
        this.$dom.find(".collapsibleItemEdit").off('click');
        var _this = this;
        this.$dom.find(".collapsibleItemEdit").click(function() { 
                                        $(this).parent().parent().parent().trigger('click');
                                        _this.editModal.fillWithData();
                                        Materialize.updateTextFields();
                                        });
    }
    
    makePreloader(id){
        var $preloader = $('<div class="progress">');
        $preloader
                .attr('id',id)
                .append('<div class="indeterminate">');
        return $preloader;
    }
}

