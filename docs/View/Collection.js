/* 
 * http://materializecss.com/collections.html
 */
class Collection {
    constructor(id){
        this.id = id;
        
        this.isDeletable = true;
        //this.isEditable = true;
        this.isSelectable = true;
        this.$dom;
        this.$actionsMenu;
        this.$emptyList = $('<H4 class="emptyList">Lista jest pusta</H4>');
        this.$collection = $('<ul class="collection">');
    }
    
    initialise(items, parentViewObject, parentViewObjectSelectHandler){
        this.items = items;
        //this.parentViewObjectSelectHandler = parentViewObjectSelectHandler;
        //this.parentViewObject = parentViewObject;
        
        this.buildDom();
        if (this.items.length === 0) {           
            this.$dom 
                .append(this.$emptyList);    
        }
        
        
        this.actionsMenuInitialise();
        
        Tools.hasFunction(this.addNewHandler);
        Tools.hasFunction(this.makeItem);
    }
    
    buildDom(){
        this.$dom = $('<div>')
                .attr('id', 'container' + '_' + this.id);

        this.$actionsMenu = $('<div >')
               .attr('id', 'actionsMenu' + '_' + this.id);
                        
        this.$dom.append(this.$actionsMenu)
                .append(this.$collection);
        
        for (var i=0; i<this.items.length; i++){
            var $row = this.buildRow(this.items[i]);
            this.$collection.append($row);
        }
        
        if (this.$editModal !== undefined) this.setEditAction();
        if (this.isDeletable) this.setRemoveAction();
        if (this.isSelectable) this.setSelectAction();
    }
    
    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {CollectionItem} item
     * @param {String} errorMessage
     * @returns {Promise}
     */
    addNewHandler(status, item, errorMessage){
        //return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    this.$collection.children('#' + item.tmpId).children('.progress').remove();
                    this.$collection.children('#' + item.tmpId).attr('id',item.id);
                    //.$('#preloader'+item.id).remove();
                    if (this.$editModal !== undefined) this.setEditAction();
                    if (this.isDeletable) this.setRemoveAction();
                    if (this.isSelectable) this.setSelectAction();
                    this.items.push(item);
                    return status;
                    break;
                case "PENDING":  
                    if (this.items.length == 0) {
                        this.$dom.find('.emptyList').remove();
                    }
                    item.id = this.items.length+1 + '_pending';
                    this.$collection.prepend(this.buildRow(item));
                    this.$dom.find('#' + item.id).append(this.makePreloader('preloader'+item.id))
                    return item.id;
                    break;
                case "ERROR":
                    alert(errorMessage);
                    this.$dom.find('#' + item.tmpId).remove();
                    //$('#preloader'+item.id).remove();
                    if (this.items.length == 0) {
                        this.$dom.prepend(this.$emptyList);
                    }
                    return status;
                    break;
                }
            
        //});
    }
    
    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {CollectionItem} item
     * @param {String} errorMessage
     * @returns {Promise}
     */
    editHandler(status, item, errorMessage){
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    $('#preloader'+item.id).remove();
                    this.items = this.items.filter(function(searchItem){return searchItem.id!==item.id});
                    this.items.push(item);
                    this.setEditAction();
                    var $oldRow = this.$collection.find('#' + item.id + '_toDelete');
                    $oldRow.remove();
                    if (this.isDeletable) this.setRemoveAction();
                    if (this.isSelectable) this.setSelectAction();
                    break;
                case "PENDING":  
                    var $oldRow = this.$collection.find('#' + item.id);
                    $oldRow.attr('id',item.id + '_toDelete');
                    var $newRow = this.buildRow(item);
                    $newRow.append(this.makePreloader('preloader'+item.id))
                    $oldRow.after($newRow);
                    $oldRow.hide(1000);
                    
                    break;
                case "ERROR":
                    alert(errorMessage);
                    this.$dom.find('#' + item.id).remove();
                    var $oldRow = this.$collection.find('#' + item.id + '_toDelete');
                    $oldRow.show(1000);
                    $oldRow.attr('id',item.id);
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
                    this.$dom.find('#' + itemId).remove();
                    this.items = this.items.filter(function(item){return item.id!==itemId});
                    if (this.items.length == 0) {
                        this.$dom.prepend(this.$emptyList);
                    }
                    break;
                case "PENDING":
                    this.$dom.find('#' + itemId).append('<span class="new badge red" data-badge-caption="">kasuję...</span>');
                    break;
                case "ERROR":
                    alert(errorMessage);
                    break;
                }
            resolve(status);
        });
    }
    
    setSelectAction(){
        this.$dom.find("li").off('click');
        var _this = this;
        this.$dom.find("li").click(function() {   
                                            _this.$dom.find(".collection-item").attr("class", "collection-item avatar");
                                            $(this).attr("class", "collection-item avatar active");
                                            //_this.parentViewObjectSelectHandler.apply(_this.parentViewObject,[$(this).attr("id")]);
                                            _this.selectTrigger($(this).attr("id"));
                                        });
    }
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę removeTrigger()
     */
    setRemoveAction(){
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
    //-------------------------------------- funkcje prywatne -----------------------------------------------------
    
    buildRow(item){
        var $row = $('<li class="collection-item avatar" id="'+ item.id + '">');
        $row
            .append('<i class="material-icons circle">'+ item.icon +'</i>')
            .append('<span class="title">'+ item.title + '</span>')
            .append('<p>' + item.description + '</p>')
            .append('<div class="secondary-content fixed-action-btn horizontal"></div>');
        
        this.addRowCrudButtons($row,item);
        return $row;        
    }
    
    filterInitialise(){
        this.$actionsMenu.append(FormTools.createFilterInputField("contract-filter",
                                                                  this.$collection.children('li'))
                                );
    }
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę addNewHandler()
     */
    actionsMenuInitialise(){
        //var newItemButton = FormTools.createFlatButton('Dodaj '+ this.itemsName, this.addNewHandler);
        //this.$actionsMenu.append(newItemButton);
        if (this.$addNewModal !== undefined)
            this.$addNewModal.preppendTriggerButtonTo(this.$actionsMenu,"Dodaj wpis");
        this.filterInitialise();

    }
    
    /*
     * Ustawia pryciski edycji wierszy
     */
    addRowCrudButtons($row,item){
        if (this.isDeletable || this.isEditable){
            var button = $row.find('.secondary-content:last-child');
            button
                .append('<a class="btn-floating"><i class="material-icons">menu</i></a>')
                .append('<ul>');
            if (this.$editModal !== undefined) 
                button.children('ul')
                    //data-target="' + this.id + '" class="btn modal-trigger"
                    .append('<li><a data-target="' + this.$editModal.id + '" class="btn-floating blue itemEdit modal-trigger"><i class="material-icons">edit</i></a></li>');
                    //.append('<li><a href ="'+ item.editUrl + '" target="_blank" class="btn-floating blue itemEdit"><i class="material-icons">edit</i></a></li>');
            if (this.isDeletable) 
                button.children('ul')
                    .append('<li><a class="btn-floating red itemDelete"><i class="material-icons">delete</i></a></li>');
        }
    }
    
    makePreloader(id){
        var $preloader = $('<div class="progress">');
        $preloader
                .attr('id',id)
                .append('<div class="indeterminate">');
        return $preloader;
    }
}

class CollectionItem{
    constructor(id, icon, title, description, editUrl){
        this.id = id;
        this. icon = icon;
        this.title = title;
        this.description = description;
        this.editUrl = editUrl;
    }
    
    initialise(paramObject){
        this.id = paramObject.id;
        this.icon = paramObject.icon;
        this.title = paramObject.title;
        this.description = paramObject.description;
        this.editUrl = paramObject.editUrl;
    }   
};