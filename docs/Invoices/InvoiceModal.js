class InvoiceModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, mode) {
        super(id, tittle, connectedResultsetComponent, mode);
        this.controller = new InvoiceModalController(this);
        this.initFormElements();

        this.formElements = [];
        //if (this.mode === 'EDIT')
        //    this.formElements.push(this.numberFormElement);
        this.formElements.push(this.contractFormElement);
        this.formElements.push(this.issueDateFormElement);
        this.formElements.push(this.daysToPayFormElement);
        this.formElements.push(this.entityFormElement);
        this.formElements.push(this.statusFormElement);
        this.formElements.push(this.ownerFormElement);
        //if (this.mode === 'EDIT')
        //    this.formElements.push(this.fileFormElement);
        this.formElements.push(this.descriptionFormElement);

        this.initialise();
    }

    /*
     * uruchamiana po konstruktorze, przed jej wywołąniem musi być ustawiony controller
     */
    initFormElements() {
        this.contractSelectField = new SelectField(this.id + '_contractSelectField', 'Kontrakt', undefined, this.mode === 'ADD_NEW');
        if (InvoicesSetup.contractsRepository)
            this.contractSelectField.initialise(InvoicesSetup.contractsRepository.items, '_ourIdOrNumber_Name', undefined, this.controller);

        this.entityAutoCompleteTextField = new AutoCompleteTextField(this.id + '_entityAutoCompleteTextField',
            '',
            'business',
            false,
            'Wybierz nazwę')
        this.entityAutoCompleteTextField.initialise(InvoicesSetup.entitiesRepository, 'name', undefined, this.controller);

        this.statusSelectField = new SelectField(this.id + '_status_SelectField', 'Status', undefined, true);
        this.statusSelectField.initialise(InvoicesSetup.statusNames);

        this.ownerAutoCompleteTextField = new AutoCompleteTextField(this.id + '_ownerAutoCompleteTextField',
            'Koordynator',
            'person',
            false,
            'Wybierz imię i nazwisko')
        this.ownerAutoCompleteTextField.initialise(InvoicesSetup.personsRepository, "_nameSurnameEmail", undefined, this);

        this.invoiceFileInput = new FileInput(this.id + '_invoice_FileInput', 'Wybierz plik', this, this.mode === 'ADD_NEW');

        var _this = this;

        this.numberFormElement = {
            input: new InputTextField(this.id + 'numberTextField', 'Numer', undefined, false, 9, '.{6,}'),
            description: (this.mode == 'EDIT') ? 'Numer podajemy dopiero podczas wystawiania faktury' : '',
            dataItemKeyName: 'number',
        };

        this.contractFormElement = {
            input: this.contractSelectField,
            description: (this.mode == 'EDIT') ? 'Jeżeli nie chcesz przypisywać kolejnej sprawy do pisma, możesz to pole zignorować' : '',
            dataItemKeyName: '_contract',
        };

        this.issueDateFormElement = {
            input: new DatePicker(this.id + '_issueDatePickerField', 'Data sprzedaży', undefined, true),
            dataItemKeyName: 'issueDate'
        };

        this.daysToPayFormElement = {
            input: new InputTextField(this.id + 'daysToPayTextField', 'Dni do zapłaty', undefined, true, 2, '.{1,}'),
            description: (this.mode == 'EDIT') ? 'Podaj termin płatności jako liczna dni od daty dostarczenia faktury' : '',
            dataItemKeyName: 'daysToPay',
        };

        this.statusFormElement = {
            input: this.statusSelectField,
            dataItemKeyName: 'status'
        };

        this.ownerFormElement = {
            input: this.ownerAutoCompleteTextField,
            dataItemKeyName: '_owner'
        };

        this.entityFormElement = {
            input: this.entityAutoCompleteTextField,
            description: 'Jeśli podmiotu nie ma na liście nalezy dodać go w zakładce "Podmioty"',
            dataItemKeyName: '_entity',
        };

        this.fileFormElement = {
            input: this.invoiceFileInput,
            description: '',
            dataItemKeyName: '_blobEnviObjects',

        };
        this.descriptionFormElement = {
            input: new ReachTextArea(this.id + '_descriptonReachTextArea', 'Uwagi', false, 300),
            description: 'Tutaj podaj uwagi do uwzględnienia przy tej fakturze. Nie znajdą się one na fakturze. Nie myl tego pola z opisem pozycji faktury',
            dataItemKeyName: 'description'
        };
    }

    /*
     * Używana przy włączaniu Modala w celu dodania nowego rekordu
     * @returns {undefined}
     */
    initAddNewData() {
        this.controller.initAddNewDataHandler();
    }
};