var personsRepository;
var entitiesRepository;
var entitiesAutocompleteList={};

class PersonsSetup {
    static get personsRepository() {
        return personsRepository;
    }
    
    static get entitiesRepository() {
        return entitiesRepository;
    }
    
    static get entitiesAutocompleteList() {
        return entitiesAutocompleteList;
    }
}