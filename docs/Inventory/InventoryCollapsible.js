class InventoryCollapsible extends SimpleCollapsible {
    constructor(id, connectedRepository){
        super(id, 'Pojazd lub sprzęt', connectedRepository) ;
        
        this.addNewModal = new InventoryItemModal(id + '_newInventoryItem', 'Dodaj pojazd lub sprzęt', this, 'ADD_NEW');
        this.editModal = new InventoryItemModal(id + '_editInventoryItem', 'Edytuj dane pojazdu lub sprzętu', this, 'EDIT'); 
        this.addNewEventModal = new EventModal(this.id + '_newEvent', 'Dodaj', this,'ADD_NEW');
        this.editEventModal = new EventModal(this.id + '_editEvent', 'Edytuj', this, 'EDIT');
        
        this.initialise(this.makeCollapsibleItemsList());
    }
    /*
     * Przetwarza surowe dane z repozytorium na item gotowy dla Collapsible.buildRow()
     * @param {type} connectedRepository.items[i]
     * @returns {Collapsible.Item}
     */
    makeItem(dataItem, $bodyDom){
        var licensePlateNumber = (dataItem.licensePlateNumber)? dataItem.licensePlateNumber : ''
        return {    id: dataItem.id,
                    name: dataItem.name + ' ' + dataItem.status + ' ' +
                          licensePlateNumber,
                    $body: $bodyDom
                    };
    }
   
    makeBodyDom(dataItem){
        var normalEventsCollection = new EventsCollection({ id: 'eventsCollection_' + dataItem.id, 
                                                        parentId: dataItem.id,
                                                        addNewModal: this.addNewEventModal,
                                                        editModal: this.editEventModal,
                                                        eventsType: 'NORMAL',
                                                        title: 'Przeglądy techniczne',
                                                        eventsType: 'NORMAL'
                                                     });
        //normalEventsCollection.$dom.children('.collection').attr("status", TasksSetup.statusNames[0]);

        var damagesCollection = new EventsCollection({  id: 'damagesCollection_' + dataItem.id, 
                                                        parentId: dataItem.id,
                                                        addNewModal: this.addNewEventModal,
                                                        editModal: this.editEventModal,
                                                        eventsType: 'DAMAGES',
                                                        title: 'Usterki',
                                                        eventsType: 'DAMAGE'
                                                    });    
        var $bodyDom = $('<div class="row scrumBoard">')
                .attr('id', 'InventoryItem_' + dataItem.id)
                .attr('InventoryItemId',dataItem.id);

        var $normalEvents = $('<div class=" col s12 m6 l6">');
        var $damagesEvents = $('<div class=" col s12 m6 l6">');
        $normalEvents
            .append(normalEventsCollection.$dom);
        $damagesEvents
            .append(damagesCollection.$dom);
        $bodyDom
            .append($normalEvents)
            .append($damagesEvents);
        return $bodyDom;
    }   
}