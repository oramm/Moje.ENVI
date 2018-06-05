class ExternalAchievementsController {
    main(){
        // Hide auth UI, then load client library.
        var externalAchievementsView = new ExternalAchievementsView();
        $("#authorize-div").hide();
        externalAchievementsView.dataLoaded(false);
        //signoutButton.style.display = 'block';
        
        externalAchievementsRepository = new SimpleRepository('ExternalAchievements repository',
                                                 'getExternalAchievementsList',
                                                 'addxternalAchievementInDb',
                                                 'editxternalAchievementInDb',
                                                 'deletexternalAchievement');
        personsRepository = new SimpleRepository('Persons repository',
                                                 'getPersonsNameSurnameEmailList',
                                                 'addNewPersonInDb',
                                                 'editPersonInDb',
                                                 'deletePerson');
        var promises = [];
        
        promises[0] = externalAchievementsRepository.initialise();
        promises[1] = personsRepository.initialise();
        
        Promise.all(promises)
            .then((res)=>  {   console.log(res); 
                               externalAchievementsView.initialise()
                            })
            .then(  ()=>{$('select').material_select();
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
                 })
            .catch(err => {
                  console.error(err);
                });
    }
}