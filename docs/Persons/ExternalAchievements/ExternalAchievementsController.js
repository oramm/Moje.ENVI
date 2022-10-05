class ExternalAchievementsController {
    static main() {
        // Hide auth UI, then load client library.
        var externalAchievementsView = new ExternalAchievementsView();
        $("#authorize-div").hide();
        externalAchievementsView.dataLoaded(false);
        //signoutButton.style.display = 'block';

        externalAchievementsRepository = new SimpleRepository('ExternalAchievements repository',
            'getExternalAchievementsList',
            'addNewExternalAchievement',
            'editExternalAchievement',
            'deleteExternalAchievement');
        personsRepository = new SimpleRepository('Persons repository',
            'getPersonsNameSurnameEmailList',
            'addNewPersonInDb',
            'editPersonInDb',
            'deletePerson');

        var promises = [
            externalAchievementsRepository.initialise(),
            personsRepository.initialise()
        ];

        Promise.all(promises)
            .then((res) => {
                console.log(res);
                externalAchievementsView.initialise();
            })
            .then(() => {
                $('.modal').modal();
                $('select').material_select();
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
            })
            .catch(err => {
                console.error(err);
            });
    }
}