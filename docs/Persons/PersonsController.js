class PersonsController {
    main() {
        // Hide auth UI, then load client library.
        var personsView = new PersonsView();
        $("#authorize-div").hide();
        personsView.dataLoaded(false);
        //signoutButton.style.display = 'block';
        

        personsRepository = new SimpleRepository('Persons repository',
            'getPersonsList',
            'addNewPersonInDb',
            'editPersonInDb',
            'deletePerson');

        entitiesRepository = new SimpleRepository('Entities repository',
            'getEntitiesList',
            'addNewEntityInDb',
            'editEntityInDb',
            'deleteEntity');

        var promises = [
            personsRepository.initialiseNodeJS('persons'),
            entitiesRepository.initialiseNodeJS('entities')
        ]

        Promise.all(promises)
            .then((res) => {
                console.log(res);
                personsView.initialise();
                $('.modal').modal();
                ReachTextArea.reachTextAreaInit();
                Materialize.updateTextFields();
            })
            .catch(err => {
                console.error(err);
            });

    }
}

