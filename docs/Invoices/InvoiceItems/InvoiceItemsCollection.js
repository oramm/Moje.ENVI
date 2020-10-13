class InvoiceItemsCollection extends SimpleCollection {
    constructor(initParamObject) {
        super({
            id: initParamObject.id,
            parentDataItem: initParamObject.parentDataItem,
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
            editUrl: dataItem.editUrl,
            dataItem: dataItem
        };
    }

    /*
     * @param {dataItem} this.connectedRepository.items[i])
     */
    makeTitle(dataItem) {
        var netValueLabel = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(dataItem._netValue);
        var grossValueLabel = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(dataItem._grossValue);
        return dataItem.description + ', netto ' + netValueLabel + ' | brutto: ' + grossValueLabel;
    }
    /*
     * @param {dataItem} this.connectedRepository.currentItem
     */
    makeDescription(dataItem) {
        
        return '';
    }

    makeList() {
        return super.makeList().filter((item) => {
            //console.log('this.parentDataItem.id: %s ==? %s', this.parentDataItem.id, item.dataItem._parent.id)
            return item.dataItem._parent.id == this.parentDataItem.id
        });
    }
}