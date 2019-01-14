class InventoryController {
    main(){
        // Hide auth UI, then load client library.
        var inventoryListView = new InventoryListView();
        $("#authorize-div").hide();
        inventoryListView.dataLoaded(false);
        //signoutButton.style.display = 'block';
        

        
        inventoryRepository = new SimpleRepository('Inventory repository',
                                                    'getInventoryList',
                                                    'addNewInventoryItem',
                                                    'editInventoryItem',
                                                    'deleteInventoryItem');
        
        eventsRepository = new SimpleRepository('InventoryEvents repository',
                                                'getInventoryEventsList',
                                                'addNewInventoryEvent',
                                                'editInventoryEvent',
                                                'deleteInventoryEvent');
        
        personsRepository = new SimpleRepository('Persons repository',
                                                 'getPersonsNameSurnameEmailList',
                                                );
        var promises = [];
        promises[0] = inventoryRepository.initialise();
        promises[1] = eventsRepository.initialise();
        promises[2] = personsRepository.initialise('ENVI_EMPLOYEE|MANAGER');
        
        Promise.all(promises)
            .then(()=>  {   console.log("Repositories initialised");
                            inventoryListView.initialise();
                        })            
            .then(  ()=>{   $('select').material_select();
                            $('.modal').modal();
                            $('.datepicker').pickadate({
                                selectMonths: true, // Creates a dropdown to control month
                                selectYears: 15, // Creates a dropdown of 15 years to control year,
                                today: 'Dzisiaj',
                                clear: 'Wyszyść',
                                close: 'Ok',
                                closeOnSelect: false, // Close upon selecting a date,
                                container: undefined, // ex. 'body' will append picker to body
                                format: 'dd-mm-yyyy'
                            });
                            ReachTextArea.reachTextAreaInit();
                            Materialize.updateTextFields();
                            $('ul.tabs').tabs();
                        }
            )
            .catch(err => {
                console.error(err);
            });
    }
}

