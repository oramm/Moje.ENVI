class AppendInvoiceAttachmentsModal extends Modal {
    constructor(id, title, connectedResultsetComponent) {
        super(id, title, connectedResultsetComponent, 'EDIT');
        //this.controller = new AppendInvoiceAttachmentsModalController(this);
        this.doChangeFunctionOnItemName = 'issueInvoice';

        this.initFormElements();

        this.formElements = [
            this.numberFormElement,
            this.fileFormElement

        ];
        this.initialise();
    }
    /*
     * uruchamiana po konstruktorze, przed jej wywołąniem musi być ustawiony controller
     */
    initFormElements() {
        this.numberFormElement = {
            input: new InputTextField(this.id + 'numberTextField', 'Numer faktury', undefined, true, 9, '.{6,}'),
            description: '',
            dataItemKeyName: 'number',
        };

        this.invoiceFileInput = new FileInput(this.id + '_invoice_FileInput', 'Wybierz pliki', this, true);
        this.fileFormElement = {
            input: this.invoiceFileInput,
            description: '',
            dataItemKeyName: '_blobEnviObjects',
            refreshDataSet() {
                //_this.controller.initFileInput();
            }
        };
    }
};
