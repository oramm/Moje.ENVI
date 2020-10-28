class InvoiceModalController {
    constructor(modal) {
        this.modal = modal;
    }

    /*
     * Przed dodaniem nowego obiektu trzeba wyczyścić currentItem np. z ourId
     */
    initAddNewDataHandler() {
        InvoicesSetup.invoicesRepository.currentItem = {
            //Ustaw tu parametry kontekstowe jeśli konieczne
            _editor: {
                name: MainSetup.currentUser.name,
                surname: MainSetup.currentUser.surname,
                systemEmail: MainSetup.currentUser.systemEmail
            },
            _lastUpdated: ''
        };
        InvoicesSetup.entitiesRepository.currentItems = [];
        InvoicesSetup.contractsRepository.currentItems = [];

        this.modal.issueDateFormElement.input.setValue(new Date());
    }
};