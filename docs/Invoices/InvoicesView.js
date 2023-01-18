class InvoicesView extends Popup {
    constructor() {
        super();
    }
    initialise() {
        this.setTittle("Rejestr faktur");
        this.actionsMenuInitialise();
        this.dataLoaded(true);
    }

    actionsMenuInitialise() {
        this.startDateFormElement = {
            input: new DatePicker(this.id + '_startDatePickerField', 'Od', undefined, true),
            dataItemKeyName: 'startDate',
            colsPan: 4
        };
        this.endDateFormElement = {
            input: new DatePicker(this.id + '_endDatePickerField', 'Do', undefined, true),
            dataItemKeyName: 'endDate',
            colsPan: 4
        };
        this.startDateFormElement.input.setValue(new Date(new Date().getTime() - Tools.daysToMilliseconds(365)));
        this.endDateFormElement.input.setValue(new Date(new Date().getTime() + Tools.daysToMilliseconds(15)));

        this.filterRawPanel = new FilterRawPanel({
            formElements: [
                this.startDateFormElement,
                this.endDateFormElement
            ],
            parentViewObject: this,
            resultsetData: [
                { repository: InvoicesSetup.invoicesRepository, route: 'invoices/' },
                { repository: InvoicesSetup.invoiceitemsRepository, route: 'invoiceItems/' }
            ],
            createResultset: () => new InvoicesCollapsible('invoicesCollapsibleMainView')
        });
        $('#actionsMenu').append(this.filterRawPanel.$dom)
    }
}