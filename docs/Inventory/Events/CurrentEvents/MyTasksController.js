class MyTasksController {
    main(){
        // Hide auth UI, then load client library.
        var myTasksView = new MyTasksView();
        $("#authorize-div").hide();
        myTasksView.dataLoaded(false);
        //signoutButton.style.display = 'block';
        
        tasksRepository = new SimpleRepository('Cases repository',
                                                    'getTasksListPerMilestone',
                                                    'addNewTask',
                                                    'editTask',
                                                    'deleteTask');
        
        personsRepository = new SimpleRepository('Persons repository',
                                                    'getPersonsNameSurnameEmailList',
                                                );
        
        var promises = [];
        
        promises[0] = tasksRepository.initialise(tasksRepository.parentItemId);
        promises[1] = personsRepository.initialise();
        
        Promise.all(promises)
            .then(()=>  {   console.log("Repositories initialised");
                            myTasksView.initialise();
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
                        }
            )
            .catch(err => {
                console.error(err);
            });
   
    }
}

