class EntitiesCollection extends SimpleCollection {
    constructor(id){
        super(id, entitiesRepository);
        
        this.$addNewModal = new NewEntityModal('newEntityModal', 'Dodaj podmiot', this);
        this.$editModal = new EditEntityModal('editEntityModal', 'Edytuj dane podmiotu', this);
        
        this.initialise(this.makeList());        
    }
    
    makeItem(dataItem){
        dataItem.taxNumber = (dataItem.taxNumber)? dataItem.taxNumber : "";
        var taxNumberLabel = (dataItem.taxNumber)? 'NIP: ' + dataItem.taxNumber + '<BR>' : "";
        
        (dataItem.address)? true : dataItem.address="";
        var addressLabel = (dataItem.address)? (dataItem.address)  + '<BR>': "";
        
        (dataItem.www)? true : dataItem.www="";
        (dataItem.email)? true : dataItem.email="";
        
        return {    id: dataItem.id,
                        icon:   'business_center',
                        title:  dataItem.name + ' <BR>' + 
                                addressLabel,
                        description:    taxNumberLabel +
                                        '<a href="'+ dataItem.www + 'target="_blank">' +dataItem.www + '</a> ' +
                                        '<a href="mailto:'+ dataItem.email +'">' + dataItem.email + '</a>'
                };
    }
}