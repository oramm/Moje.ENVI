class InvoicesController {
    main() {
        // Hide auth UI, then load client library.
        var view = new InvoicesView();
        $("#authorize-div").hide();
        view.dataLoaded(false);
        //signoutButton.style.display = 'block';
        InvoicesSetup.personsRepository = new SimpleRepository('Persons repository',
            'getPersonsList',
            'addNewPersonInDb',
            'editPersonInDb',
            'deletePerson');

        InvoicesSetup.entitiesRepository = new SimpleRepository('Entities repository',
            'getEntitiesList',
            'addNewEntityInDb',
            'editEntityInDb',
            'deleteEntity');

        InvoicesSetup.contractsRepository = new SimpleRepository('Contracts repository',
            'getContractsListPerProject',
            'addNewContract',
            'editContract',
            'deleteContract'
        );

        InvoicesSetup.invoicesRepository = new SimpleRepository('Invoices repository',
            'getInvoicesList',
            'addNewInvoice',
            'editInvoice',
            'deleteInvoice');

        InvoicesSetup.invoiceitemsRepository = new SimpleRepository('InvoiceItems repository',
            'getInvoiceItemsList',
            'addNewInvoiceItem',
            'editInvoiceItem',
            'deleteInvoiceItem');

        var promises = [
            InvoicesSetup.personsRepository.initialise(),
            InvoicesSetup.entitiesRepository.initialise(),
            InvoicesSetup.contractsRepository.initialise({ onlyOur: true, onlyKeyData: true }),
        ];

        Promise.all(promises)
            .then(() => {
                console.log("Repositories initialised");
                return view.initialise();
            })
            .then(() => {
                $('select').material_select();
                $('.modal').modal();
                ReachTextArea.reachTextAreaInit();
                Materialize.updateTextFields();
                $('ul.tabs').tabs();
                iFrameResize({ log: false, heightCalculationMethod: 'taggedElement', checkOrigin: false });
            }
            )
            .catch(err => {
                console.error(err);
            });

    }
}

