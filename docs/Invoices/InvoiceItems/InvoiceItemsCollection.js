class InvoiceItemsCollection extends SimpleCollection {
    constructor(initParamObject) {
        super({
            id: initParamObject.id,
            parentDataItem: initParamObject.parentDataItem,
            parentViewObject: initParamObject.parentViewObject,
            title: initParamObject.title,
            addNewModal: initParamObject.addNewModal,
            editModal: initParamObject.editModal,
            isPlain: true,
            hasFilter: true,
            isEditable: true,
            isAddable: true,
            isDeletable: true,
            isSelectable: true,

            connectedRepository: InvoicesSetup.invoiceitemsRepository
        });
        this.initialise(this.makeList());
    }

    makeItem(dataItem) {
        (dataItem.description) ? true : dataItem.description = "";
        return {
            id: dataItem.id,
            $title: this.makeTitle(dataItem),
            $description: this.makeDescription(dataItem),
            dataItem: dataItem
        };
    }

    /*
     * @param {dataItem} this.connectedRepository.items[i])
     */
    makeTitle(dataItem) {
        //return 'test'
        var netValueLabel = this.parentViewObject.currencyFormatter.format(dataItem._netValue);
        var grossValueLabel = this.parentViewObject.currencyFormatter.format(dataItem._grossValue);
        return dataItem.description + '<br>Netto: <em>' + netValueLabel + '</em><br>' +
            'Brutto: <em>' + grossValueLabel + '</em>';
    }
    /*
     * @param {dataItem} this.connectedRepository.currentItem
     */
    makeDescription(dataItem) {

        return '';
    }

    makeList() {
        var itemsList = [];
        for (const dataItem of this.connectedRepository.items)
            if (dataItem._parent.id == this.parentDataItem.id)
                itemsList.push(this.makeItem(dataItem));
        return itemsList;
    }
}