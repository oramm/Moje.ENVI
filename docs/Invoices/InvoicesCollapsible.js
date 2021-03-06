class InvoicesCollapsible extends SimpleCollapsible {
    constructor(id) {
        super({
            id: id,
            hasFilter: true,
            isEditable: true,
            isAddable: true,
            isDeletable: true,
            isCopyable: true,
            hasArchiveSwitch: false,
            connectedRepository: InvoicesSetup.invoicesRepository,
            //subitemsCount: 12
        });

        this.addNewModal = new InvoiceModal(id + '_newInvoice', 'Rejestruj fakturę', this, 'ADD_NEW');
        this.editModal = new InvoiceModal(id + '_editInvoice', 'Edytuj fakturę', this, 'EDIT');

        this.appendInvoiceAttachmentsModal = new AppendInvoiceAttachmentsModal(id + '_appendInvoiceAttachmentModal', 'Wystaw fakturę', this, 'EDIT');
        this.invoiceSetAsSentModal = new InvoiceSetAsSentModal(id + '_invoiceSetAsSentModal', 'Ustaw jako wysłana', this, 'EDIT');

        this.addNewInvoiceItemModal = new InvoiceItemModal(this.id + '_newInvoiceItem', 'Dodaj pozycję', this, 'ADD_NEW');
        this.editInvoiceItemModal = new InvoiceItemModal(this.id + '_editInvoiceItem', 'Edytuj pozycję', this, 'EDIT');

        var filterElements = [
            {
                inputType: 'SelectField',
                colSpan: 6,
                label: 'Status',
                attributeToCheck: 'status',
                selectItems: InvoicesSetup.statusNames
            }
        ];

        this.currencyFormatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

        this.initialise(this.makeCollapsibleItemsList(), filterElements);

    }
    /*
     * Przetwarza surowe dane z repozytorium na item gotowy dla Collapsible.buildRow()
     * @param {type} connectedRepository.items[i]
     * @returns {Collapsible.Item}
     */
    makeItem(dataItem, body) {
        var numberLabel = (dataItem.number) ? '<em>' + dataItem.number + '</em> | ' : '';
        var entityLabel = dataItem._entity.name + '<br> ' + dataItem._entity.address + ' NIP: ' + dataItem._entity.taxNumber;
        var valueLabel = ''//'Netto: ' + this.currencyFormatter.format(dataItem.value);
        var ourId = (dataItem._contract.ourId) ? '<strong>' + dataItem._contract.ourId + '</strong> | ' : '';
        var name = numberLabel + ourId + entityLabel + '; ' + valueLabel + '<br>'
        name += 'Data sprzedaży: <em>' + dataItem.issueDate + '</em>';
        if (dataItem.status.match(/Wysła|Zapła/i)) {
            name += ' Data nadania: <em>' + dataItem.sentDate + '</em>';
            name += ' Termin płatności: <em>' + dataItem.paymentDeadline + '</em>';
        }
        name += '<br><strong>' + dataItem.status + '</strong>';
        return {
            id: dataItem.id,
            name: name,
            body: body,
            dataItem: dataItem,
            editModal: this.editModal,
            attributes: [{ name: 'status', value: dataItem.status }]
        };
    }

    makeBody(dataItem) {
        var $actionButtons = $('<div class="row">')
        if (dataItem.status.match(/Na późn/i))
            $actionButtons.append(new RaisedButton('Ustaw jako do zrobienia', this.setAsToMakeHandler, this).$dom)
        if (dataItem.status.match(/Do zrob/i))
            this.appendInvoiceAttachmentsModal.preppendTriggerButtonTo($actionButtons, 'Wystaw fakturę', this);
        else if (dataItem.status.match(/Zrobiona/i))
            this.invoiceSetAsSentModal.preppendTriggerButtonTo($actionButtons, 'Ustaw jako wysłana', this);
        else if (dataItem.status.match(/Wysła/i))
            $actionButtons.append(new RaisedButton('Ustaw jako zapłacona', this.setAsPaidHandler, this).$dom)

        var subCollection = new InvoiceItemsCollection({
            id: 'invoiceitemsListCollection_' + dataItem.id,
            title: "Pozycje",
            addNewModal: this.addNewInvoiceItemModal,
            editModal: this.editInvoiceItemModal,
            parentDataItem: dataItem,
            parentViewObject: this
        });

        var timestamp = (dataItem._lastUpdated) ? Tools.timestampToString(dataItem._lastUpdated) : '[czas wyświetli po odświeżeniu]'
        var $panel = $('<div>')
            .attr('id', 'collapsibleBodyForInvoice' + dataItem.id)
            .append($actionButtons)
            .append(subCollection.$dom)
            .append($('<span class="comment">Uwagi: ' + dataItem.description + '</span><br>'))
            .append($('<span class="comment">Ostania zmiana: ' + timestamp + ' ' +
                'przez&nbsp;' + dataItem._editor.name + '&nbsp;' + dataItem._editor.surname + '</span>'));
        return {
            collection: subCollection,
            $dom: $panel
        };
    }

    setAsPaidHandler() {
        this.connectedRepository.doChangeFunctionOnItem(this.connectedRepository.currentItem, 'setAsPaidInvoice', this);
    }

    setAsToMakeHandler() {
        this.connectedRepository.doChangeFunctionOnItem(this.connectedRepository.currentItem, 'setAsToMakeInvoice', this);
    }

    copyHandler(originalItemId, newItemId) {
        var invoiceItemsList = InvoicesSetup.invoiceitemsRepository.items.filter(
            item => item._parent.id == originalItemId
        );

        for (var item of invoiceItemsList) {
            item = Tools.cloneOfObject(item);
            item._parent.id = newItemId;
            InvoicesSetup.invoiceitemsRepository.copyItem(item, this.items[this.items.length - 1].body.collection);
        }
    }
}