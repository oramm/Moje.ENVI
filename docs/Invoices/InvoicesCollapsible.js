class InvoicesCollapsible extends SimpleCollapsible {
    constructor(id) {
        super({
            id: id,
            hasFilter: true,
            isEditable: true,
            isAddable: true,
            isDeletable: true,
            hasArchiveSwitch: true,
            connectedRepository: InvoicesSetup.invoicesRepository
            //subitemsCount: 12
        });

        this.addNewModal = new InvoiceModal(id + '_newInvoice', 'Rejestruj fakturę', this, 'ADD_NEW');
        this.editModal = new InvoiceModal(id + '_editInvoice', 'Edytuj fakturę', this, 'EDIT');


        this.addNewInvoiceItemModal = new InvoiceItemModal(this.id + '_newInvoiceItem', 'Dodaj pozycję', this, 'ADD_NEW');
        this.editInvoiceItemModal = new InvoiceItemModal(this.id + '_editInvoiceItem', 'Edytuj pozycję', this, 'EDIT');

        this.initialise(this.makeCollapsibleItemsList());
        //trzeba zainicjować dane parentów na wypadek dodania nowego obiektu
        //funkcja Modal.submitTrigger() bazuje na danych w this.connectedRepository.currentItem
        this.connectedRepository.currentItem.projectId = this.connectedRepository.parentItemId;
    }
    /*
     * Przetwarza surowe dane z repozytorium na item gotowy dla Collapsible.buildRow()
     * @param {type} connectedRepository.items[i]
     * @returns {Collapsible.Item}
     */
    makeItem(dataItem, $bodyDom) {
        var numberLabel = (dataItem.number) ? dataItem.number : '';
        var entityLabel = dataItem._entity.name
        var valueLabel = 'Netto: ' + new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(dataItem.value);
        var ourId = (dataItem._contract.ourId) ? '<strong>' + dataItem._contract.ourId + '</strong>; ' : '';
        var name = numberLabel + '; ' + ourId + ', ' + entityLabel + ', ' + dataItem.description + '; ' + valueLabel + '<br>'
        name += 'Data Sprzedaży: ' + dataItem.issueDate;
        if (dataItem.status.match(/Zrobion|Wysła|Zapła/i)) {
            name += ', Data wystawienia: ' + dataItem.creationDate;
            if (dataItem.status.match(/Wysła|Zapła/i))
                name += ', Data nadania: ' + dataItem.sentDate;
        }
        name += '<br><strong>' + dataItem.status + '</strong>';
        return {
            id: dataItem.id,
            name: name,
            $body: $bodyDom,
            dataItem: dataItem,
            editModal: this.editModal
        };
    }

    makeBodyDom(dataItem) {
        var timestamp = (dataItem._lastUpdated) ? Tools.timestampToString(dataItem._lastUpdated) : '[czas wyświetli po odświeżeniu]'
        
        var $panel = $('<div>')
            .attr('id', 'collapsibleBodyForInvoice' + dataItem.id)
            .attr('invoiceid', dataItem.id)
            .append(new InvoiceItemsCollection({
                id: 'invoiceitemsListCollection_' + dataItem.id,
                title: "Pozycje",
                addNewModal: this.addNewInvoiceItemModal,
                editModal: this.editInvoiceItemModal,
                parentDataItem: dataItem
            }).$dom)
            .append($('<span class="comment">Ostania zmiana: ' + timestamp + ' ' +
                'przez&nbsp;' + dataItem._editor.name + '&nbsp;' + dataItem._editor.surname + '</span>'));
        return $panel;
    }



}