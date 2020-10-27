class InvoicesCollapsible extends SimpleCollapsible {
    constructor(id) {
        super({
            id: id,
            hasFilter: true,
            isEditable: true,
            isAddable: true,
            isDeletable: true,
            hasArchiveSwitch: false,
            connectedRepository: InvoicesSetup.invoicesRepository
            //subitemsCount: 12
        });

        this.addNewModal = new InvoiceModal(id + '_newInvoice', 'Rejestruj fakturę', this, 'ADD_NEW');
        this.editModal = new InvoiceModal(id + '_editInvoice', 'Edytuj fakturę', this, 'EDIT');


        this.addNewInvoiceItemModal = new InvoiceItemModal(this.id + '_newInvoiceItem', 'Dodaj pozycję', this, 'ADD_NEW');
        this.editInvoiceItemModal = new InvoiceItemModal(this.id + '_editInvoiceItem', 'Edytuj pozycję', this, 'EDIT');

        var filterElements = [
            /* tymczasowo ukryte do czasu usnięcia błedu z linkami do plików*/
            {
                inputType: 'SelectField',
                colSpan: 6,
                label: 'Status',
                attributeToCheck: 'status',
                selectItems: InvoicesSetup.statusNames
            }
            //*/
        ];

        this.currencyFormatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

        this.initialise(this.makeCollapsibleItemsList(), filterElements);
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
        var numberLabel = (dataItem.number) ? '<em>' + dataItem.number + '</em> | ' : '';
        var entityLabel = dataItem._entity.name + '<br> ' + dataItem._entity.address + ' NIP: ' + dataItem._entity.taxNumber;
        var valueLabel = ''//'Netto: ' + this.currencyFormatter.format(dataItem.value);
        var ourId = (dataItem._contract.ourId) ? '<strong>' + dataItem._contract.ourId + '</strong> | ' : '';
        var name = numberLabel + ourId + entityLabel + '; ' + valueLabel + '<br>'
        name += 'Data Sprzedaży: <em>' + dataItem.issueDate + '</em>';
        if (dataItem.status.match(/Wysła|Zapła/i))
            name += ', Data nadania: <em>' + dataItem.sentDate + '</em>';
        name += '<br><strong>' + dataItem.status + '</strong>';
        return {
            id: dataItem.id,
            name: name,
            $body: $bodyDom,
            dataItem: dataItem,
            editModal: this.editModal,
            attributes: [{ name: 'status', value: dataItem.status }]
        };
    }

    makeBodyDom(dataItem) {
        var timestamp = (dataItem._lastUpdated) ? Tools.timestampToString(dataItem._lastUpdated) : '[czas wyświetli po odświeżeniu]'
        var $panel = $('<div>')
            .attr('id', 'collapsibleBodyForInvoice' + dataItem.id)
            .append(new InvoiceItemsCollection({
                id: 'invoiceitemsListCollection_' + dataItem.id,
                title: "Pozycje",
                addNewModal: this.addNewInvoiceItemModal,
                editModal: this.editInvoiceItemModal,
                parentDataItem: dataItem,
                parentViewObject: this
            }).$dom)
            .append($('<span class="comment">Uwagi: ' + dataItem.description + '</span><br>'))
            .append($('<span class="comment">Ostania zmiana: ' + timestamp + ' ' +
                'przez&nbsp;' + dataItem._editor.name + '&nbsp;' + dataItem._editor.surname + '</span>'));
        return $panel;
    }
}