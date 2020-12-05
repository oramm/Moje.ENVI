class EntitiesController {
    main() {
        // Hide auth UI, then load client library.
        var view = new EntitiesView();
        $("#authorize-div").hide();
        view.dataLoaded(false);
        //signoutButton.style.display = 'block';

        entitiesRepository = new SimpleRepository('Entities repository',
            'getEntitiesList',
            'addNewEntityInDb',
            'editEntityInDb',
            'deleteEntity');

        var promises = [
            entitiesRepository.initialiseNodeJS('entities')
        ];

        Promise.all(promises)
            .then((res) => {
                console.log(res);
                view.initialise();
                $('.modal').modal();
                $('select').material_select();
                //ReachTextArea.reachTextAreaInit(); //nie ma tego typu pól w tym formularzu
                Materialize.updateTextFields();
            })
            .catch(err => {
                console.error(err);
            });

    }
}

