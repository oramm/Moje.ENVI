class EntitiesCollection extends SimpleCollection {
    constructor(id){
        super(id, entitiesRepository);
        
        this.$addNewModal = new NewEntityModal('newEntityModal', 'Dodaj podmiot', this);
        this.$editModal = new EditEntityModal('editEntityModal', 'Edytuj dane podmiotu', this);
        
        this.initialise(this.makeList());        
    }
    
    makeItem(dataItem){
        return {    id: dataItem.id,
                        icon:   'business_center',
                        title:  dataItem.name + ' <BR>' + 
                                dataItem.address + '<BR>',
                        description:    dataItem.taxNumber + ' <BR>' +
                                        '<a href="'+ dataItem.www + 'target="_blank">' +dataItem.www + '</a> ' +
                                        '<a href="mailto:'+ dataItem.email +'">' + dataItem.email + '</a>'
                };
    }
}