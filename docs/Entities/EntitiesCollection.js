class EntitiesCollection extends SimpleCollection {
    /*
     * @param {type} id
     * @param {boolean} isPlane - czy lista ma być prosta czy z Avatarem
     * @param {boolean} hasFilter - czy ma być filtr
     * @param {boolean} isAddable - czy można dodować nowe elementy
     */
    constructor(initParamObject){
        super({id: initParamObject.id, 
               title: initParamObject.title,
               isPlain: false, 
               hasFilter: true,
               isEditable: true, 
               isAddable: initParamObject.isAddable, 
               isDeletable: true,
               connectedRepository: EntitiesSetup.entitiesRepository
              })
        this.parentId = initParamObject.parentId;
        this.status = initParamObject.status;
 
        this.addNewModal = new EntityModal(this.id + '_newEntityModal', 'Dodaj podmiot', this, 'ADD_NEW');
        this.editModal = new EntityModal(this.id + '_editEntityModal', 'Edytuj dane podmiotu', this, 'EDIT');
        
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