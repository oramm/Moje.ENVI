class AppendInvoiceAttachmentsModal extends Modal {
    constructor(id, title, connectedResultsetComponent) {
        super(id, title, connectedResultsetComponent, 'EDIT');
        //this.controller = new AppendInvoiceAttachmentsModalController(this);
        this.doChangeFunctionOnItemName = 'appendInvoiceAttachments';
    
        this.initFormElements();

        this.formElements = [
            this.fileFormElement
        ];
        this.initialise();
    }
    /*
     * uruchamiana po konstruktorze, przed jej wywołąniem musi być ustawiony controller
     */
    initFormElements() {
        this.invoiceFileInput = new FileInput(this.id + '_invoice_FileInput', 'Wybierz pliki', this, true);

        var _this = this;

        
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
