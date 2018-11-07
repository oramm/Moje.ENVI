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
            this.$addNewModal = new NewPersonModal('newPersonModal', 'Dodaj osobę do książki kontaktów', this);
        this.editModal = new EditPersonModal('editPersonModal', 'Edytuj dane osoby', this);
        
        this.initialise(this.makeList());        
    }
        
    makeItem(dataItem){
        return {    id: dataItem.id,
                        icon:   'person',
                        title:  dataItem.name + ' ' + 
                                dataItem.surname + ' <br>' +
                                dataItem.entityName + ' <br>' +
                                dataItem.position,
                        description:    '<a href="callto:'+ dataItem.phone +'">' +dataItem.phone + '</a> ' +
                                        '<a href="mailto:'+ dataItem.email +'">' + dataItem.email + '</a><br><br>' + 
                                        dataItem.comment
                };
    }
}