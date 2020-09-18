class Resultset{
    constructor(initParamObject) {
        this.id = initParamObject.id;
        this.parentDataItem = initParamObject.parentDataItem;
        this.title = (initParamObject.title === undefined) ? "" : initParamObject.title;
        this.isSelectable = (initParamObject.isSelectable === undefined) ? true : initParamObject.isSelectable;
        this.hasFilter = (initParamObject.hasFilter === undefined) ? true : initParamObject.hasFilter;
        this.minimumItemsToFilter = (initParamObject.minimumItemsToFilter) ? initParamObject.minimumItemsToFilter : 6;
        this.isAddable = (initParamObject.isAddable === undefined) ? true : initParamObject.isAddable;
        this.isDeletable = (initParamObject.isDeletable === undefined) ? true : initParamObject.isDeletable;
        this.isEditable = initParamObject.isEditable;
        this.hasArchiveSwitch = false;//initParamObject.hasArchiveSwitch;
        this.editModal = initParamObject.editModal;
        this.addNewModal = initParamObject.addNewModal;
        
        this.$dom;
        this.$actionsMenu;
    }
    
    makePreloader(id) {
        var $preloader = $('<div class="progress">');
        $preloader
            .attr('id', id)
            .append('<div class="indeterminate">');
        return $preloader;
    }
}