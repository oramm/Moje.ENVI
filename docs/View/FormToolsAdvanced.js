class CollapsibleSelectCollection extends SimpleCollection {
    constructor(initParamObject) {
        super({
            id: initParamObject.id,
            parentDataItem: initParamObject.parentDataItem,
            title: initParamObject.title,
            isPlain: true,
            hasFilter: true,
            isEditable: false,
            isAddable: false,
            isDeletable: false,
            isSelectable: true,
            connectedRepository: initParamObject.collectionRepository
        });
        this.parentCollapsibleSelect = initParamObject.parentCollapsibleSelect;
        this.initialise(this.makeList());
    }
    /*
     * @dataItem connectedRepository.items[i]
     */
    makeItem(dataItem) {
        (dataItem.description) ? true : dataItem.description = "";
        return {
            id: dataItem.id,
            //icon:   'info',
            $title: this.makeTitle(dataItem),
            $description: this.makeDescription(dataItem),
            editUrl: dataItem.editUrl,
            dataItem: dataItem
        };
    }

    /*
     * @param {dataItem} this.connectedRepository.items[i])
     */
    makeTitle(dataItem) {
        var titleAtomicEditLabel = new AtomicEditLabel(this.parentCollapsibleSelect.makeCollectionItemNameFunction(dataItem),
            dataItem,
            new InputTextField(this.id + '_' + dataItem.id + '_tmpNameEdit_TextField', 'Edytuj', undefined, true, 150),
            'name',
            this);
        return titleAtomicEditLabel.$dom;
    }
    /*
     * @param {dataItem} this.connectedRepository.currentItem
     */
    makeDescription(dataItem) {
        var $collectionElementDescription = $('<span>');

        if (dataItem.description)
            $collectionElementDescription.append('<span>' + dataItem.description + '<br></span>');

        return $collectionElementDescription;
    }

    makeList() {
        return super.makeList().filter((item) => {
            //console.log('this.parentDataItem.id: %s ==? %s', this.parentDataItem.id, item.dataItem._parent.id)
            return item.dataItem._parent.id == this.parentDataItem.id
        });
    }

    selectTrigger(itemId) {
        if (itemId !== undefined && this.connectedRepository.currentItem.id != itemId) {
            super.selectTrigger(itemId);
            this.parentCollapsibleSelect.onItemChosen(this.connectedRepository.currentItems);
            this.hideRow(itemId);
        }
    }
}

class CollapsibleSelect {
    constructor(id, label, isRequired, parentForm) {
        this.id = id;
        this.label = label;
        this.isRequired = isRequired;
        this.parentForm = parentForm;
        this.value;
        this.lastSelectedItem;
        this.$dom;
        this.$label = $('<label>' + this.label + '</label>');
        this.showCollapsibleButton = new RaisedButton('Wybierz opcję', this.showCollapsible, this);
        this.hideCollapsibleButton = new RaisedButton('Nie wybieraj', this.hideCollapsible, this)
        this.buildDom();

        var _this = this;
        //obiekt tworzonony dopiero w this.initialise()
        this.Collapsible = class extends SimpleCollapsible {
            constructor(initParamObject) {
                super({
                    id: _this.id + '_CollapsibleSelect_itemsListCollapsible_' + _this.id,
                    hasFilter: true,
                    isEditable: false,
                    isAddable: false,
                    isDeletable: false,
                    hasArchiveSwitch: false,
                    connectedRepository: _this.collapsibleRepository,
                    parentDataItem: initParamObject.parentDataItem,
                    //subitemsCount: 12
                });
                this.initialise(this.makeCollapsibleItemsList());
            }
            /*
             * Przetwarza surowe dane z repozytorium na item gotowy dla Collapsible.buildRow()
             * @param {type} connectedRepository.items[i]
             * @returns {Collapsible.Item}
             */
            makeItem(dataItem, $bodyDom) {
                return {
                    id: dataItem.id,
                    name: _this.makeCollapsibleItemNameFunction(dataItem),
                    $body: $bodyDom,
                    dataItem: dataItem,
                };
            }

            makeCollapsibleItemsList() {
                return super.makeCollapsibleItemsList().filter(
                    (item) => item.dataItem[_this.parentObjectName]['id'] == this.parentDataItem.id
                );
            }

            makeBodyDom(dataItem) {
                var casesCollection = new CollapsibleSelectCollection({
                    id: _this.id + '_CollapsibleSelect_itemsListCollection_' + dataItem.id,
                    title: '',
                    parentDataItem: dataItem,
                    parentCollapsibleSelect: _this,
                    collectionRepository: _this.collectionRepository
                })
                return casesCollection.$dom;
            }
        }
    }

    buildDom() {
        this.$dom = $('<div>');
        this.$selectedOptionsPanel = $('<div>');
        this.showCollapsibleButton.setEnabled(false);
        this.hideCollapsibleButton.$dom.hide();
        this.$dom
            .append(this.$label)
            .append(this.$selectedOptionsPanel)
            .append(this.showCollapsibleButton.$dom)
            .append(this.hideCollapsibleButton.$dom);
    }
    /*
     * Obiekt musi być inicjowany jak zwykły SelectField - repozytorium wynika z kontektstu
     */
    initialise(parenDataItem, parentObjectName, collapsibleRepository, makeCollapsibleItemNameFunction, collectionRepository, makeCollectionItemNameFunction, itemChosenHandler, itemUnchosenHandler) {
        if (this.collapsible) {
            this.collapsible.$dom.remove();
            delete this.collapsible;
        }
        this.parentObjectName = parentObjectName;
        this.collapsibleRepository = collapsibleRepository;
        this.makeCollapsibleItemNameFunction = makeCollapsibleItemNameFunction;
        this.collectionRepository = collectionRepository;
        this.makeCollectionItemNameFunction = makeCollectionItemNameFunction;
        this.itemChosenHandler = itemChosenHandler;
        this.itemUnchosenHandler = itemUnchosenHandler;

        this.collapsible = new this.Collapsible({ parentDataItem: parenDataItem });
        this.$dom.append(this.collapsible.$dom);
        this.hideCollapsible();
    }

    onItemChosen() {
        this.value = this.connectedRepository.currentItem;
        this.lastSelectedItem = this.connectedRepository.currentItem;
        this.$dom.find('.chip').remove();
        this.hideCollapsible();
        this.addChip(this.lastSelectedItem);
        if (this.itemChosenHandler) this.itemChosenHandler();
    }

    showCollapsible() {
        this.showCollapsibleButton.$dom.hide();
        this.hideCollapsibleButton.$dom.show();
        this.collapsible.$dom.show();
    }

    hideCollapsible() {
        this.collapsible.$dom.hide();
        this.showCollapsibleButton.$dom.show();
        this.hideCollapsibleButton.$dom.hide();
    }

    addChip(dataItem) {
        this.$selectedOptionsPanel
            .append(new Chip('CollapsibleSelect_itemsListCollection_case_' + dataItem.id,
                this.makeCollectionItemNameFunction(this.lastSelectedItem),
                dataItem,
                this.onItemUnchosen,
                this).$dom);
    }

    clear() {
        this.$selectedOptionsPanel.children().remove();
        this.connectedRepository.currentItem = undefined;
        this.connectedRepository.currentItems = undefined;
        this.value = undefined;
    }

    initValue() {

    }

    validate() {
        if (this.isRequired) {
            return this.value !== this.defaultDisabledOption && this.value !== undefined;
        } else
            return true;

    }
    simulateChosenItem(inputvalue) {
        this.value = inputvalue;
        this.lastSelectedItem = inputvalue;
        if (!Tools.search(inputvalue.id, 'id', this.value))
            this.addChip(this.lastSelectedItem);
        this.hideCollapsible();
        if (this.itemChosenHandler) this.itemChosenHandler();
    }

    getValue() {
        return this.value;
    }
}

class CollapsibleMultiSelect extends CollapsibleSelect {
    constructor(id, label, isRequired, parentForm) {
        super(id, label, isRequired, parentForm)
    }
    onItemChosen() {
        this.value = Array.from(this.collectionRepository.currentItems);
        this.lastSelectedItem = this.collectionRepository.currentItem;
        this.hideCollapsible();
        this.addChip(this.lastSelectedItem);
        if (this.itemChosenHandler) this.itemChosenHandler();
    }

    simulateChosenItem(inputvalue) {
        this.value = inputvalue;
        for (const item of inputvalue) {
            this.lastSelectedItem = item;
            if (!Tools.search(item.id, 'id', this.value))
                this.addChip(this.lastSelectedItem);
        }
        this.hideCollapsible();
        this.itemChosenHandler();
    }

    onItemUnchosen(unchosenItem) {
        this.collectionRepository.deleteFromCurrentItems(unchosenItem);
        this.value = Array.from(this.collectionRepository.currentItems);
        if (this.itemUnchosenHandler) this.itemUnchosenHandler();
        this.$dom.find('.collection-item#' + unchosenItem.id).show();
    }
}