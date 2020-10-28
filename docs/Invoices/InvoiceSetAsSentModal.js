class InvoiceSetAsSentModal extends Modal {
    constructor(id, title, connectedResultsetComponent) {
        super(id, title, connectedResultsetComponent, 'EDIT');
        //this.controller = new AppendInvoiceAttachmentsModalController(this);
        this.doChangeFunctionOnItemName = 'setAsSentInvoice';

        this.initFormElements();

        this.formElements = [
            this.sentDateFormElement
        ];
        this.initialise();
    }
    /*
     * uruchamiana po konstruktorze, przed jej wywołąniem musi być ustawiony controller
     */
    initFormElements() {
        this.sentDateFormElement = {
            input: new DatePicker(this.id + '_sentDatePickerField', 'Data wysłania', undefined, true),
            dataItemKeyName: 'sentDate'
        };
        this.sentDateFormElement.input.setValue(new Date());
    }
};
