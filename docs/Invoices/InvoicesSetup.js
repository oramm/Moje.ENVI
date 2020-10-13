class InvoicesSetup {
    static get statusNames() {
        return ['Na później',
            'Do zrobienia',
            'Zrobiona',
            'Wysłana',
            'Zapłacona',
            'Do korekty',
            'Wycofana'
        ];
    }
    static get invoicesRepository() {
        return InvoicesSetup._invoicesRepository;
    }
    static set invoicesRepository(value) {
        InvoicesSetup._invoicesRepository = value;
    }

    static get invoiceitemsRepository() {
        return InvoicesSetup._invoiceitemsRepository;
    }
    static set invoiceitemsRepository(value) {
        InvoicesSetup._invoiceitemsRepository = value;
    }

    static get entitiesRepository() {
        return InvoicesSetup._entitiesRepository;
    }
    static set entitiesRepository(value) {
        InvoicesSetup._entitiesRepository = value;
    }

    static get contractsRepository() {
        return InvoicesSetup._contractsRepository;
    }
    static set contractsRepository(value) {
        InvoicesSetup._contractsRepository = value;
    }

    static get personsRepository() {
        return InvoicesSetup._personsRepository;
    }
    static set personsRepository(value) {
        InvoicesSetup._personsRepository = value;
    }
}

InvoicesSetup._invoicesRepository;
InvoicesSetup._invoiceitemsRepository;
InvoicesSetup._entitiesRepository;
InvoicesSetup._contractsRepository;
InvoicesSetup._personsRepository;