var inventoryRepository;
var eventsRepository;
var personsRepository;


class InventorySetup {
    static get statuses() {
        return [{id: 'AVAILABLE', name:'Dostępny'},
                {id: 'SERVICE_REQUIRED', name: 'Wymagany serwis'}, 
                {id: 'SERVICE_REQUIRED', name: 'W naprawie'},      
                {id: 'DISABLED', name: 'Nie działa'}
               ];
    }
    static get statusNames(){
        var statusNames=[];
        for (var i=0; i< this.statuses.length; i++)
            statusNames.push(this.statuses[i].name)
        return statusNames;
    }
    static get itemsTypes() {
        return [{id: 'CAR', name:'Pojazd'},
                {id: 'COMPUTER', name: 'Komputer'}, 
                {id: 'PRINTER', name: 'Drukarka'},      
                {id: 'OTHER', name: 'Pozostałe'}
               ];
    }
    static get itemsTypesNames(){
        var itemsTypesNames=[];
        for (var i=0; i< this.itemsTypes.length; i++)
            itemsTypesNames.push(this.itemsTypes[i].name)
        return itemsTypesNames;
    }
    
    static getItemStatusNameById(statusId){
        return InventorySetup.statuses.filter(item=>item.id==statusId)[0].name;
    }
    
    static getItemStatusIdByName(statusName){
        return InventorySetup.statuses.filter(item=>item.name==statusName)[0].id;
    }
    
    static getItemTypeNameById(statusId){
        return InventorySetup.itemsTypes.filter(item=>item.id==statusId)[0].name;
    }
    
    static getItemTypeIdByName(statusName){
        return InventorySetup.itemsTypes.filter(item=>item.name==statusName)[0].id;
    }
    
    static get inventoryRepository() {
        return inventoryRepository;
    }
    static get eventsRepository() {
        return eventsRepository;
    }
    static get personsRepository() {
        return personsRepository;
    }
}