class InvoicesController {
    main() {
        // Hide auth UI, then load client library.
        var view = new InvoicesView();
        $("#authorize-div").hide();
        view.dataLoaded(false);
        //signoutButton.style.display = 'block';
        InvoicesSetup.personsRepository = new SimpleRepository({
            name: 'Persons repository',
            actionsNodeJSSetup: { addNewRoute: 'person', editRoute: 'person', deleteRoute: 'person' }
        });

        InvoicesSetup.entitiesRepository = new SimpleRepository({
            name: 'Entities repository',
            actionsNodeJSSetup: { addNewRoute: 'entity', editRoute: 'entity', deleteRoute: 'entity' }
        });

        InvoicesSetup.contractsRepository = new SimpleRepository('Contracts repository');

        InvoicesSetup.invoicesRepository = new SimpleRepository({
            name: 'Invoices repository',
            actionsNodeJSSetup: { addNewRoute: 'invoice', editRoute: 'invoice', deleteRoute: 'invoice', copyRoute: 'copyInvoice' }
        });

        InvoicesSetup.invoiceitemsRepository = new SimpleRepository({
            name: 'InvoiceItems repository',
            actionsNodeJSSetup: { addNewRoute: 'invoiceItem', editRoute: 'invoiceItem', deleteRoute: 'invoiceItem', copyRoute: 'copyInvoiceItem' }
        });

        var promises = [
            InvoicesSetup.personsRepository.initialiseNodeJS('persons'),
            InvoicesSetup.entitiesRepository.initialiseNodeJS('entities'),
            InvoicesSetup.contractsRepository.initialiseNodeJS('contracts/?onlyOur=true&onlyKeyData=true'),
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