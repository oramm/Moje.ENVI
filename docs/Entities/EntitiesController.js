class EntitiesController {
    main(){
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
        
        var promises = [];
        
        promises[0] = entitiesRepository.initialise();
        
        Promise.all(promises)
            .then((res)=>  {   console.log(res); 
                               view.initialise()
                            })
            .catch(err => {
                  console.error(err);
                });
   
    }
}

