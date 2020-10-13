class InvoiceItemModal extends Modal {
    constructor(id, title, connectedResultsetComponent, mode) {
        super(id, title, connectedResultsetComponent, mode);
        this.initFormElements();
        var _this = this;
        this.formElements = [
            this.descriptionFormElement,
            this.quantityFormElement,
            this.unitPriceFormElement,
            this.vatTaxFormElement
        ];

        this.initialise();
    }

    initFormElements() {

        this.descriptionFormElement = {
            input: new InputTextField(this.id + '_descriptionTextField', 'Opis', undefined, true, 300, '.{6,}'),
            description: '',
            dataItemKeyName: 'description',
        };

        this.quantityFormElement = {
            input: new InputTextField(this.id + '_quantityTextField', 'Ilość', undefined, true, 2),
            description: 'Podaj liczbę całkowitą',
            dataItemKeyName: 'quantity',
        };

        this.unitPriceFormElement = {
            input: new InputTextField(this.id + '_unitPriceTextField', 'Cena jednostkowa', undefined, true, 9, '.{1,}'),
            description: 'Podając kwotę zamiast przecinka użyj kropki',
            dataItemKeyName: 'unitPrice',
        };

        this.vatTaxFormElement = {
            input: new InputTextField(this.id + '_vatTaxTextField', 'Stawka VAT', undefined, true, 2, '.{2,}'),
            description: 'Podaj stawkę w % - standardowo wynosi ona 23',
            dataItemKeyName: 'vatTax',
        };
    }
    /*
     * inicjuje dane przed dodaniem nowego elementu - czyści CurrentItem i ew. ustawia zmienne kontekstowe niewyświetlane w modalu
     */
    initAddNewData() {
        this.connectedResultsetComponent.connectedRepository.currentItem = {
            _parent: InvoicesSetup.invoicesRepository.currentItem,
            _editor: {
                name: MainSetup.currentUser.name,
                surname: MainSetup.currentUser.surname,
                systemEmail: MainSetup.currentUser.systemEmail
            },
        };
        this.quantityFormElement.input.setValue('1');
        this.vatTaxFormElement.input.setValue('23')
    }
};