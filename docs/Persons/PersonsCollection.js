class PersonsCollection extends SimpleCollection {
    constructor(initParamObject){
        super({id: initParamObject.id, 
               title: initParamObject.title,
               isPlain: false, 
               hasFilter: true,
               isEditable: true, 
               isAddable: initParamObject.isAddable, 
               isDeletable: true,
               connectedRepository: PersonsSetup.personsRepository
              })
        this.parentId = initParamObject.parentId;
        
        if (this.isAddable) 
            this.addNewModal = new PersonModal('newPersonModal', 'Dodaj osobę do książki kontaktów', this, 'ADD_NEW');
        this.editModal = new PersonModal('editPersonModal', 'Edytuj dane osoby', this, 'EDIT');
        
        this.initialise(this.makeList());        
    }
        
    makeItem(dataItem){
        return {    id: dataItem.id,
                    icon:   'person',
                    title:  dataItem.name + ' ' + 
                            dataItem.surname + ' <br>' +
                            dataItem._entity.name + ' <br>' +
                            dataItem.position,
                    description:    '<a href="tel:'+ dataItem.cellphone +'">' +dataItem.cellphone + '</a><br> ' +
                                    '<a href="tel:'+ dataItem.phone +'">' +dataItem.phone + '</a><br> ' +
                                    '<a href="mailto:'+ dataItem.email +'">' + dataItem.email + '</a><br><br>' + 
                                    dataItem.comment,
                    dataItem: dataItem
                };
    }
}