/* 
 * http://materializecss.com/collections.html
 */
class Collection extends Resultset {
    /*
     * @param {Object} initParamObject {
     *      @param {String} id
     *      @param {String} title
     *      @param {boolean} isPlain - czy lista ma być prosta czy z Avatarem
     *      @param {boolean} hasFilter - czy ma być filtr
     *      @param {boolean} isAddable - czy można dodować nowe elementy
     *      @param {boolean} isDeletable - czy można usuwać elementy
     *      [@param {boolean} addNewModal]
     *      [@param {boolean} EditModal]
     * }
     * @returns {Collection}
     */
    constructor(initParamObject) {
        super(initParamObject);
        this.isPlain = initParamObject.isPlain;
        this.hasArchiveSwitch = false;//initParamObject.hasArchiveSwitch;
        this.$addNewTriggerIcon;
        this.title = initParamObject.title;
        this.$emptyList = $('<div class="emptyList">Lista jest pusta</div>');


        //buduję szkielet, żeby podpiąć modale do $dom, 
        //na założeniu, że dom powstaje w konstruktorze bazuje Modal.buildDom()
        this.$dom = $('<div>')
            .attr('id', 'container' + '_' + this.id)
            .addClass('collection-container');
        this.$title = $('<div class="resultset-title">')
        this.$title.text(this.title);

        this.$actionsMenu = $('<div>')
            .attr('id', 'actionsMenu' + '_' + this.id)
            .addClass('cyan lighten-5')
            .addClass('actionsMenu');
        this.filter = new Filter(this);
    }
    /*
     * 
     * @param {connectedRepository.items} items
     * @param {type} parentViewObject - nie używane
     * @param {function} parentViewObjectSelectHandler - nie używane
     */
    initialise(items, filterElements = []) {
        this.items = items;

        this.buildDom();
        if (this.items.length === 0) {
            this.$dom
            //.append(this.$emptyList);    
        }
        this.actionsMenuInitialise(filterElements);

        if (this.isAddable) Tools.hasFunction(this.addNewHandler);
        Tools.hasFunction(this.makeItem);
    }

    buildDom() {
        this.$collection = $('<ul class="collection">');
        if (this.title)
            this.$dom.prepend(this.$title);
        this.$dom
            .append(this.$actionsMenu)
            .append(this.$collection);
        this.buildCollectionDom();
    }

    buildCollectionDom() {
        for (var i = 0; i < this.items.length; i++) {
            var $row = (this.isPlain) ? this.buildPlainRow(this.items[i]).$dom : this.buildRow(this.items[i]);
            this.$collection.append($row);
        }

        if (this.isEditable) this.setEditAction();
        if (this.isDeletable) this.setDeleteAction();
        if (this.isSelectable) this.setSelectAction();
    }

    showRow(id) {
        this.$dom.find('.collection-item#' + id).show();
    }
    
    hideRow(id) {
        this.$dom.find('.collection-item#' + id).hide();
    }
    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {CollectionItem} item
     * @param {String} errorMessage
     * @returns {Promise}
     */
    addNewHandler(status, item, errorMessage) {
        //return new Promise((resolve, reject) => {
        switch (status) {
            case "DONE":
                this.$dom.find('#' + item._tmpId).remove();
                var $newRow = (this.isPlain) ? this.buildPlainRow(item).$dom : this.buildRow(item);
                this.$collection.prepend($newRow);
                if (this.editModal) this.setEditAction();
                if (this.isDeletable) this.setDeleteAction();
                if (this.isSelectable) this.setSelectAction();
                this.items.push(item);
                //czasami ilość pozycji na liście jest limotowana i trzeba wyłaczyć dodawanie kolejnych
                if (typeof this.setAddableMode === 'function') this.setAddableMode();
                return status;
                break;
            case "PENDING":
                if (this.items.length == 0) {
                    this.$dom.find('.emptyList').remove();
                }
                item.id = item._tmpId;
                var $newRow = (this.isPlain) ? this.buildPlainRow(item).$dom : this.buildRow(item);
                this.$collection.prepend($newRow);
                this.$dom.find('#' + item.id).append(this.makePreloader('preloader' + item.id))
                if (typeof this.setAddableMode === 'function') this.setAddableMode();
                //return item.id;
                break;
            case "ERROR":
                alert(errorMessage);
                this.$dom.find('#' + item._tmpId).remove();
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
    editHandler(status, item, errorMessage) {
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    this.items = this.items.filter(function (searchItem) { return searchItem.id !== item.id });
                    this.items.push(item);
                    var $oldRow = this.$collection.find('#' + item.id);
                    var $newRow = (this.isPlain) ? this.buildPlainRow(item).$dom : this.buildRow(item);
                    $oldRow.after($newRow);
                    $oldRow.remove();
                    if (this.isDeletable) this.setDeleteAction();
                    if (this.isSelectable) this.setSelectAction();
                    if (this.isEditable) this.setEditAction();
                    break;
                case "PENDING":
                    var $oldRow = this.$collection.find('#' + item.id);
                    $oldRow.attr('id', item.id + '_toDelete');
                    var $newRow = (this.isPlain) ? this.buildPlainRow(item).$dom : this.buildRow(item);
                    $newRow.append(this.makePreloader('preloader' + item.id))
                    $oldRow.after($newRow);
                    $oldRow.hide(1000);

                    break;
                case "ERROR":
                    alert(errorMessage);
                    this.$dom.find('#' + item.id).remove();
                    var $oldRow = this.$collection.find('#' + item.id + '_toDelete');
                    $oldRow.show(1000);
                    $oldRow.attr('id', item.id);
                    if (this.items.length == 0) {
                        //this.$dom.prepend(this.$emptyList);
                    }

                    break;
            }
            resolve(status)
        });
    }
    /*
     * Krok 3 - funkcja wywoływana w rolesRepository.unasoosciatePersonRole potrzebny trik z appply dla callbacka
     */
    removeHandler(status, itemId, errorMessage) {
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    this.$dom.find('#' + itemId).remove();
                    this.items = this.items.filter(function (item) { return item.id !== itemId });
                    if (this.items.length == 0) {
                        this.$actionsMenu.after(this.$emptyList);
                    }
                    if (typeof this.setAddableMode === 'function') this.setAddableMode();
                    break;
                case "PENDING":
                    var $deleteBadge = $('<span>')
                    $deleteBadge
                        .attr('id', 'deleteBadge_' + this.id + '_' + itemId)
                        .attr('data-badge-caption', '')
                        .addClass('new badge red')
                        .html('kasuję...')
                    this.$dom.find('#' + itemId).append($deleteBadge);
                    if (typeof this.setAddableMode === 'function') this.setAddableMode();
                    break;
                case "ERROR":
                    alert(errorMessage);
                    $('#deleteBadge_' + this.id + '_' + itemId).remove();
                    break;
            }
            resolve(status);
        });
    }

    setSelectAction() {
        this.$dom.find("li").off('click');
        this.$dom.find("li").off('mousedown');
        var _this = this;
        //wyłącz klasę active
        this.$dom.find("li").mousedown(function () {
            //jeżeli collection nalezy do collapsible trzeba wyczyścić pozostałe kolekcie w innych pozycjach collapsible
            if ($(this).closest('.collapsible-item').length > 0) {
                $(this).closest('.collapsible').find('.collection-item.active').removeClass('active');
                $(this).closest('.collapsible').find('.collection-item > .crudButtons').css('display', 'none');
            }
            //jeżeli collection jest bez collapsible zajmuje się tylko sama sobą
            else {
                $(this).closest('.collection').children('.active').removeClass('active');
                $(this).closest('.collection').find('.collection-item > .crudButtons').css('display', 'none');
            }
            $(this)
                .addClass('active')
                .children('.crudButtons')
                .css('display', 'initial');
            //_this.parentViewObjectSelectHandler.apply(_this.parentViewObject,[$(this).attr("id")]);
            _this.selectTrigger($(this).attr("id"));
        });
    }
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę removeTrigger()
     */
    setDeleteAction() {
        this.$dom.find(".itemDelete").off('click');
        var _this = this;
        this.$dom.find(".itemDelete").click(function () {
            if (confirm("Czy na pewno chcesz usunąć ten element?"))
                _this.removeTrigger($(this).closest('.collection-item').attr("id"));
        });
    }

    setAddNewAction() {
        this.$dom.find(".addNewItemIcon").click(
            () => this.addNewModal.triggerAction(this)
        );
    }

    setEditAction() {
        //this.$dom.find(".collectionItemEdit").off('click');
        var _this = this;
        this.$dom.find(".collectionItemEdit").click(function (e) {
            $(this).parent().parent().parent().parent().trigger('click');
            _this.editModal.triggerAction(_this);
            //e.stopPropagation();
            //e.preventDefault();
        });
    }
    //-------------------------------------- funkcje prywatne -----------------------------------------------------
    /*
     * Tworzy element listy
     * @param {type} item - to gotowy item dla Collapsible (na podstawie surowych danych w repozytorium)
     * @returns {Collection.buildRow.$row}
     */
    buildRow(item) {
        var $row = $('<li class="collection-item avatar" id="' + item.id + '">');
        var $titleContainer = $('<span class="title">'),
            $descriptionContainer = $('<p>');

        if (item.$title instanceof jQuery)
            $titleContainer.
                append(item.$title);
        else if (typeof item.title === 'string')
            $titleContainer
                .html(item.title);

        if (item.$description instanceof jQuery)
            $descriptionContainer.
                append(item.$description);
        else if (typeof item.description === 'string')
            $descriptionContainer
                .html(item.description);
        $row
            .append('<i class="material-icons circle">' + item.icon + '</i>')
            .append($titleContainer)
            .append($descriptionContainer)
            .append('<div class="secondary-content fixed-action-btn horizontal"></div>');

        this.addRowCrudButtons($row, item);

        return $row;
    }
    /*
     * TODO: bezpieczniej jest używać parametru 'itemId zamiast ID w css bo nr id mogąsię powtarzać przy kilku kolecjach na jednej stronie
     *       to jest już zaimplenentowane w Collapsible
     * @param {type} item - to gotowy item dla Collapsible (na podstawie surowych danych w repozytorium)
     * @returns {Collection.buildPlainRow.row.$dom|row.$dom}
     */
    buildPlainRow(item) {
        var row = {
            $dom: $('<li class="collection-item" id="' + item.id + '">'),
            $crudButtons: $('<span class="crudButtons">'),
            dataItem: item.dataItem
        };

        row.$crudButtons
            .css('display', 'none');
        var $titleContainer = $('<span class="title">'),
            $descriptionContainer = $('<p>');

        $titleContainer.
            append(item.$title);
        $descriptionContainer.
            append(item.$description);

        row.$dom
            .append($titleContainer)
            .append($descriptionContainer)
            .append(row.$crudButtons);

        this.addPlainRowCrudButtons(row);
        //do uspójnienia z Collapsible - tam zwracany jest obiekt typu row
        return row;
    }

    /*
     * Ustawia pryciski edycji wierszy
     */

    addPlainRowCrudButtons(row) {
        if (this.isEditable)
            row.$crudButtons.append(this.editModal.createTriggerIcon());

        if (row.dataItem._gdFolderUrl)
            row.$crudButtons.append(new ExternalResourcesIconLink('GD_ICON', row.dataItem._gdFolderUrl).$dom);

        if (row.dataItem._documentOpenUrl)
            row.$crudButtons.append(new ExternalResourcesIconLink('GD_DOCUMENT_ICON', row.dataItem._documentOpenUrl).$dom);

        if (row.dataItem._documentEditUrl)
            row.$crudButtons.append(new ExternalResourcesIconLink('GD_DOCUMENT_ICON', row.dataItem._documentEditUrl).$dom);

        if (this.isDeletable)
            row.$crudButtons.append('<span class="itemDelete"><i class="material-icons">delete</i></span>');
    }

    addRowCrudButtons($row, item) {
        if (this.isDeletable || this.isEditable) {
            var button = $row.find('.secondary-content:last-child');
            button
                .append('<a class="btn-floating"><i class="material-icons">menu</i></a>')
                .append('<ul>');
            if (this.editModal)
                button.children('ul')
                    //data-target="' + this.id + '" class="btn modal-trigger"
                    .append('<li><a data-target="' + this.editModal.id + '" class="btn-floating blue collectionItemEdit modal-trigger"><i class="material-icons">edit</i></a></li>');
            //.append('<li><a href ="'+ item.editUrl + '" target="_blank" class="btn-floating blue collectionItemEdit"><i class="material-icons">edit</i></a></li>');
            if (this.isDeletable)
                button.children('ul')
                    .append('<li><a class="btn-floating red itemDelete"><i class="material-icons">delete</i></a></li>');
        }
    }


    filterInitialise(filterElements) {
        if (this.items.length >= this.minimumItemsToFilter) {
            this.filter.initialise(filterElements);
            this.$actionsMenu.append(this.filter.$dom);
        }
    }

    actionsMenuInitialise(filterElements) {
        if (this.isAddable) {
            this.$addNewTriggerIcon = this.addNewModal.createTriggerIcon();
            this.$actionsMenu.prepend(this.$addNewTriggerIcon);
            this.setAddNewAction();
        }
        //this.addNewModal.preppendTriggerIconTo(this.$actionsMenu,this);
        if (this.hasFilter)
            this.filterInitialise(filterElements);

    }

    refreshAddableMode() {
        if (this.isAddable)
            this.$addNewTriggerIcon.show();
        else
            this.$addNewTriggerIcon.hide();
    }
}

class CollectionItem {
    constructor(id, icon, title, description, editUrl) {
        this.id = id;
        this.icon = icon;
        this.title = title;
        this.description = description;
        this.editUrl = editUrl;
    }

    initialise(paramObject) {
        this.id = paramObject.id;
        this.icon = paramObject.icon;
        this.title = paramObject.title;
        this.description = paramObject.description;
        this.editUrl = paramObject.editUrl;
    }
};