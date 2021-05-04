/* 
 * http://materializecss.com/collapsible.html
 */
class Collapsible extends Resultset {
    constructor(initParamObject) {
        super(initParamObject)
        this.isExpandable = (initParamObject.isExpandable === undefined) ? false : initParamObject.isExpandable;
        this.isMultiSelectable = initParamObject.isMultiSelectable;
        this.hasArchiveSwitch = initParamObject.hasArchiveSwitch;
        this.subitemsCount = initParamObject.subitemsCount;
        this.currentItems = []; //wybrany wiersz
        this.$collapsible;

        //buduję szkielet, żeby podpiąć modale do $dom, 
        //na założeniu, że dom powstaje w konstruktorze bazuje Modal.buildDom()
        this.$dom = $('<div>')
            .attr('id', 'container' + '_' + this.id);
        this.$collapsible = $('<ul class="collapsible">');
        this.$collapsible.attr('id', this.id);
        this.$collapsible.attr('data-collapsible', (this.isExpandable) ? 'expandable' : 'accordion');
        this.$title = $('<div class="resultset-title">')
        this.$title.text(this.title);
        this.$actionsMenu = $('<div>')
            .attr('id', 'actionsMenu' + '_' + this.id)
            .addClass('cyan lighten-5')
            .addClass('actionsMenu');


        this.filter = new Filter(this);
    }

    $rowEditIcon(modalId) {
        var $icon = $('<span class="collapsibleItemEdit modal-trigger"><i class="material-icons">edit</i></span>');;
        $icon.attr('data-target', modalId);
        return $icon;
    }

    $rowCopyIcon() {
        return $('<span class="collapsibleItemCopy"><i class="material-icons">content_copy</i></span>');
    }

    $rowDeleteIcon() {
        return $('<span class="collapsibleItemDelete"><i class="material-icons">delete</i></span>');
    }
    /*
     * @param {CollapsibleItems[]} items - generowane m. in. SompleCollapsible
     * @param {type} parentViewObject
     * @param {type} parentViewObjectSelectHandler
     * @returns {undefined}
     */
    initialise(items, filterElements) {
        this.items = items;
        this.isSelectable = true;

        this.actionsMenuInitialise(filterElements);
        this.buildDom();

        Tools.hasFunction(this.makeItem);
        Tools.hasFunction(this.makeBody);
    }

    reloadRows() {
        this.items = this.makeCollapsibleItemsList();
        this.buildRows();
    }
    async reloadRepositories() {
        const promises = [];
        let query = this.connectedRepositoryGetRoute + this.filter.makeRequestParams();
        console.log(query);
        promises.push(this.connectedRepository.initialiseNodeJS(query));
        return await Promise.all(promises);
    }

    async reload() {
        let $preloader = this.makePreloader(this.filter.id + 'preloader');
        this.$collapsible.empty();
        this.$actionsMenu.append($preloader);
        await this.reloadRepositories();
        this.reloadRows();
        $preloader.remove();
    }

    makeCollapsibleItemsList() {
        var itemsList = [];
        var i = 0;
        for (const item of this.connectedRepository.items) {
            itemsList.push(this.makeItem(item,
                this.$bodyDoms[i++])
            );
        }
        return itemsList;
    }

    makeBodyDoms() {
        for (let i = 0; i < this.connectedRepository.items.length; i++) {
            this.$bodyDoms[i] = this.makeBodyDom(this.connectedRepository.items[i]);
        }
    }

    buildDom() {
        this.$dom.append(this.$actionsMenu);
        this.buildRows();

        this.$dom.append(this.$collapsible);
        if (this.title)
            this.$dom.prepend(this.$title)

    }
    buildRows() {
        this.$collapsible.empty();

        for (const item of this.items) {
            var row = this.buildRow(item);
            this.$collapsible
                .append(row.$dom);
        }
        this.$collapsible.collapsible();//inicjacja wg instrukcji materialisecss

        if (this.isEditable)
            this.setEditAction();
        if (this.isDeletable)
            this.setDeleteAction();
        if (this.isSelectable)
            this.setSelectAction();
    }

    /*
     * Tworzy element listy
     * @param {type} item - to gotowy item dla Collapsible (na podstawie surowych danych w repozytorium)
     * @returns {Collapsible.buildRow.row}
     */
    buildRow(item) {
        //każdy wiersz może mieć inny modal, domyślnie jest standardowy this.editModal
        if (this.isEditable) {
            if (!item.editModal && this.editModal)
                item.editModal = this.editModal;
        }
        var row = {
            $dom: $('<li>'),
            $crudButtons: $('<span class="crudButtons right">'),
            dataItem: item.dataItem,
            editModal: item.editModal
        };
        row.$crudButtons
            .css('visibility', 'hidden');

        if (item.attributes)
            for (const attribute of item.attributes) {
                row.$dom.attr(attribute.name, attribute.value);
            }
        row.$dom
            .append('<div class="collapsible-header"><i class="material-icons">filter_list</i>' + item.name)
            .append('<div class="collapsible-body">')
            .attr('itemId', item.id)
            .addClass('collapsible-item');
        //obsłuż status - potrzebne np. przy filtrowaniu
        for (const element of this.filter.filterElements) {
            if (element.inputType == 'FilterSwitchInput')
                row.$dom.attr(element.attributeToCheck, item.dataItem[element.attributeToCheck]);
        }
        if (!this.filter.checkIfRowMatchesFilters(row.$dom))
            row.$dom.hide();

        if (item.subitemsCount)
            row.$dom.children('.collapsible-header').append(new Badge(item.id, item.subitemsCount, 'teal lighten-2').$dom);
        row.$dom.children('.collapsible-header')
            .css('display', 'block')
            .append(row.$crudButtons);

        if (!item.body)
            item.body = this.makeBody(item.dataItem);
        row.$dom.children(':last').append(item.body.$dom);
        this.addRowCrudButtons(row);
        return row;
    }

    /*
     * Ustawia pryciski edycji wierszy
     */
    addRowCrudButtons(row) {
        if (row.dataItem._gdFolderUrl)
            row.$crudButtons.append(new ExternalResourcesIconLink('GD_ICON', row.dataItem._gdFolderUrl).$dom);
        if (row.dataItem._documentOpenUrl)
            row.$crudButtons.append(new ExternalResourcesIconLink('GD_DOCUMENT_ICON', row.dataItem._documentOpenUrl).$dom);
        if (row.dataItem._documentEditUrl)
            row.$crudButtons.append(new ExternalResourcesIconLink('GD_DOCUMENT_ICON', row.dataItem._documentEditUrl).$dom);

        if (this.isDeletable || this.isEditable) {
            row.$crudButtons
                .append(this.$rowEditIcon(row.editModal.id));
            if (this.isDeletable)
                row.$crudButtons
                    .append(this.$rowDeleteIcon());
        }
        if (this.isCopyable)
            row.$crudButtons.append(this.$rowCopyIcon());
    }

    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {dataItem} item
     * @param {String} errorMessage
     * @returns {Promise}
     */
    addNewHandler(status, dataItem, errorMessage) {
        switch (status) {
            case "DONE":
                this.$collapsible.children('[itemid=' + dataItem._tmpId + ']').remove();
                var newCollapsibleItem = this.makeItem(dataItem);
                this.$collapsible.prepend(this.buildRow(newCollapsibleItem).$dom);
                //this.$collapsible.children('[itemid=' + item.tmpId +']').attr('itemid',item.id);
                if (this.isEditable) this.setEditAction();
                if (this.isDeletable) this.setDeleteAction();
                if (this.isCopyable) this.setCopyAction();
                if (this.isSelectable) this.setSelectAction();
                this.items.push(newCollapsibleItem);
                return status;
                break;
            case "PENDING":
                if (this.items.length == 0) {
                    this.$dom.find('.emptyList').remove();
                }
                dataItem.id = dataItem._tmpId;
                this.$collapsible.prepend(this.buildRow(this.makeItem(dataItem)).$dom);
                this.$collapsible.find('[itemid=' + dataItem.id + ']').append(this.makePreloader('preloader' + dataItem.id))
                return dataItem.id;
                break;
            case "ERROR":
                alert(errorMessage);
                console.error(errorMessage)
                this.$collapsible.find('[itemid=' + dataItem._tmpId + ']').remove();
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
    editHandler(status, dataItem, errorMessage) {
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    $('#preloader' + dataItem.id).remove();
                    this.items = this.items.filter(function (searchItem) { return searchItem.id !== dataItem.id });
                    var newItem = this.makeItem(dataItem, this.makeBody(dataItem));
                    var $newRow = this.buildRow(newItem).$dom;
                    this.items.push(newItem);

                    var $oldRow = this.$collapsible.find('[itemid^=' + dataItem.id + ']');
                    $oldRow.last().after($newRow);
                    $oldRow.remove();
                    this.setEditAction();
                    if (this.isCopyable) this.setCopyAction();
                    if (this.isDeletable) this.setDeleteAction();
                    if (this.isSelectable) this.setSelectAction();
                    break;
                case "PENDING":
                    var $oldRow = this.$collapsible.find('[itemid=' + dataItem.id + ']');
                    $oldRow.attr('itemid', dataItem.id + '_toDelete');
                    var $newRow = this.buildRow(this.makeItem(dataItem, this.makeBody(dataItem))).$dom;
                    $newRow.append(this.makePreloader('preloader' + dataItem.id))
                    $oldRow.after($newRow);
                    $oldRow.hide(1000);

                    break;
                case "ERROR":
                    alert(errorMessage);
                    this.$collapsible.find('[itemid=' + dataItem.id + ']').remove();
                    var $oldRow = this.$collapsible.find('[itemid=' + dataItem.id + '_toDelete]');
                    $oldRow.show(1000);
                    $oldRow.attr('itemid', dataItem.id);
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
    removeHandler(status, itemId, errorMessage, serveResponse) {
        return new Promise((resolve, reject) => {
            switch (status) {
                case "DONE":
                    this.$dom.find('[itemid=' + itemId + ']').remove();
                    this.items = this.items.filter(function (item) { return item.id !== itemId });
                    if (this.items.length == 0) {
                        this.$dom.prepend(this.$emptyList);
                    }
                    if (serveResponse) {
                        if (serveResponse.message)
                            alert(serveResponse.message);
                        if (serveResponse.externalUrl)
                            window.open(serveResponse.externalUrl, '_blank');

                    }
                    break;
                case "PENDING":
                    this.$dom.find('[itemid=' + itemId + ']').append('<span class="new badge red" data-badge-caption="">kasuję...</span>');
                    break;
                case "ERROR":
                    alert(errorMessage);
                    this.$dom.find('.new.badge.red').remove();
                    break;
            }
            resolve(status);
        });
    }
    hasArchivedElements() {
        return this.items.filter(item => item.dataItem.status && item.dataItem.status.match(/Zamknięt|Archiw/i)).length > 0
    }

    filterInitialise(filterElements) {
        this.filter.initialise(filterElements);
        if (this.items.length >= this.minimumItemsToFilter || this.hasArchivedElements()) {
            this.$actionsMenu.append(this.filter.$dom);
        }
    }
    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę addNewHandler()
     * TODO: do usunięcia
     */
    actionsMenuInitialise(filterElements) {
        //var $buttonsPanel = $('<div class="row">');
        //this.$actionsMenu.append($buttonsPanel);
        //if (this.addNewModal !== undefined)
        //    this.addNewModal.preppendTriggerButtonTo($buttonsPanel,"Dodaj wpis", this);

        if (this.isAddable) {
            this.$actionsMenu.prepend(this.addNewModal.createTriggerIcon());
            this.setAddNewAction();
        }
        if (this.hasFilter)
            this.filterInitialise(filterElements);
    }

    setSelectAction() {
        var _this = this;
        this.$collapsible.find(".collapsible-header").click(function () {
            var selectedItemId = $(this).parent().attr("itemId");
            if (_this.isMultiSelectable)
                _this.multiSelectAction(selectedItemId);
            else
                _this.defaultSelectAction(selectedItemId);

            _this.selectTrigger(selectedItemId);
            $('.collapsible').find('.collapsible-header > .crudButtons')
                .css('visibility', 'hidden');
            $(this).children('.crudButtons')
                .css('visibility', 'visible');

            $(this).closest('.collapsible').children('.collapsible-item').removeClass('selected');
            $(this).parent().addClass('selected')
        });
    }

    defaultSelectAction(selectedItemId) {
        this.currentItems[0] = this.items.filter(item => item.id == selectedItemId)[0];
    }

    multiSelectAction(selectedItemId) {
        var wasItemAlreadySelected = this.currentItems.filter(item => item.id == selectedItemId)[0];
        var selectedItem = this.items.filter(item => item.id == selectedItemId)[0]
        if (wasItemAlreadySelected) {
            var index = Tools.arrGetIndexOf(this.currentItems, 'id', selectedItem);
            this.currentItems.splice(index, 1)
        }
        else
            this.currentItems.push();
    }

    /*
     * Klasa pochodna musi mieć zadeklarowaną metodę removeTrigger()
     */
    setDeleteAction() {
        this.$dom.find(".collapsibleItemDelete").off('click');
        var _this = this;
        this.$collapsible.find(".collapsibleItemDelete").click(function () {
            if (confirm("Czy na pewno chcesz usunąć ten element?")) {
                _this.connectedRepository.deleteItem(_this.connectedRepository.currentItem, _this);
                if (_this.currentItems[0].body.collection)
                    for (const collectIonItem of _this.currentItems[0].body.collection.items)
                        _this.currentItems[0].body.collection.connectedRepository.clientSideDeleteItemHandler(collectIonItem);

                //_this.removeTrigger(_this.connectedRepository.currentItem.id);
            }
        });
    }

    setCopyAction() {
        this.$dom.find(".collapsibleItemCopy").off('click');
        var _this = this;
        this.$collapsible.find(".collapsibleItemCopy").click(function () {
            if (confirm("Chcesz skopiować ten element?")) {
                var originalItemId = _this.connectedRepository.currentItem.id;
                console.log('Id Oryginału: %s', originalItemId)
                _this.connectedRepository.copyCurrentItem(_this)
                    .then((copiedDataItem) => {
                        console.log('Id Kopii: %s', copiedDataItem.id)
                        _this.defaultSelectAction(copiedDataItem.id);
                        if (_this.copyHandler) _this.copyHandler(originalItemId, copiedDataItem.id)
                    })
            }

        });
    }

    setAddNewAction() {
        this.$actionsMenu.find(".addNewItemIcon").off('click');
        this.$actionsMenu.find(".addNewItemIcon").click(
            () => this.addNewModal.triggerAction(this)
        );
    }

    setEditAction() {
        this.$collapsible.find(".collapsibleItemEdit").off('click');
        var _this = this;
        this.$collapsible.find(".collapsibleItemEdit").click(function () {
            $(this).closest('.collapsible-header').trigger('click');
            _this.currentItems[0].editModal.triggerAction(_this);
            Materialize.updateTextFields();
        });
    }
}