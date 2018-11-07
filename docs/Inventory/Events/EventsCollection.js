class EventsCollection extends SimpleCollection {
    /*
     * @param {type} id
     * @param {boolean} isPlane - czy lista ma być prosta czy z Avatarem
     * @param {boolean} hasFilter - czy ma być filtr
     * @param {boolean} isAddable - czy można dodować nowe elementy
     */
    constructor(initParamObject){
        super({id: initParamObject.id, 
               title: initParamObject.title,
               isPlain: true, 
               hasFilter: false,
               isEditable: true, 
               isAddable: initParamObject.isAddable, 
               isDeletable: true,
               connectedRepository: InventorySetup.eventsRepository
              })
        this.parentId = initParamObject.parentId;
        this.eventsType = initParamObject.eventsType;
        
        if (this.isAddable) 
            this.$addNewModal = new NewEventModal(this.id + '_newEvent', 'Dodaj', this);
        
        this.editModal = new EditEventModal(this.id + '_editEvent', 'Edytuj', this);
        
        this.initialise(this.makeList());        
    }    
    /*
     * Dodano atrybut z caseId_Hidden, żeby szybciej filtorwać widok po stronie klienta zamiast przez SELECT z db
     * @param {dataItem} this.connectedRepository.items[i])
     */
    makeItem(dataItem){
        return {    id: dataItem.id,
                    icon:   undefined,
                    $title:  this.makeTitle(dataItem),
                    $description: this.makeDescription(dataItem),
                    parentId_Hidden:  dataItem.inventoryItemId,
                    eventsType_Hidden:  dataItem.type                    
                };
    }
    /*
     * @param {dataItem} this.connectedRepository.items[i])
     */
    makeTitle(dataItem){
        var titleAtomicEditLabel = new AtomicEditLabel( dataItem.name, 
                                                        dataItem, 
                                                        new InputTextField (this.id +  '_' + dataItem.id + '_tmpNameEdit_TextField','Edytuj', undefined, true, 150),
                                                        'name',
                                                        this);
        return titleAtomicEditLabel.$dom
    }
    /*
     * @param {dataItem} this.connectedRepository.currentItem
     */
    makeDescription(dataItem){
        (dataItem.description)? true : dataItem.description="";
        
        var $collectionElementDescription = $('<span>');
        var descriptionAtomicEditLabel = new AtomicEditLabel(dataItem.description, 
                                                        dataItem, 
                                                        new InputTextField (this.id +  '_' + dataItem.id + '_tmpEditDescription_TextField','Edytuj', undefined, true, 150),
                                                        'description',
                                                        this);
        
        
        var dateAtomicEditLabel = new AtomicEditLabel(dataItem.date, 
                                                        dataItem, 
                                                        new DatePicker(this.id + '_' + dataItem.id + '_datePickerField','Data wykonania', true),
                                                        'date',
                                                        this);
        var expiryDateAtomicEditLabel = new AtomicEditLabel(dataItem.expiryDate, 
                                                        dataItem, 
                                                        new DatePicker(this.id + '_' + dataItem.id + '_expiryDatePickerField','Ważne do', true),
                                                        'date',
                                                        this);

        (dataItem.status)? true : dataItem.status="";
        
        var personAutoCompleteTextField = new AutoCompleteTextField(this.id+'personAutoCompleteTextField',
                                                                     'Imię i nazwisko', 
                                                                     'person', 
                                                                     false, 
                                                                     'Wybierz imię i nazwisko')
        personAutoCompleteTextField.initialise(InventorySetup.personsRepository,"nameSurnameEmail", this.onOwnerChosen, this);
        
        var personAtomicEditLabel = new AtomicEditLabel(dataItem.nameSurnameEmail, 
                                                        dataItem, 
                                                        personAutoCompleteTextField,
                                                        'nameSurnameEmail',
                                                        this);
        
        //var statusSelectField = new SelectField(this.id + '_' + dataItem.id + '_statusSelectField', 'Status', true);
        //statusSelectField.initialise(TasksSetup.statusNames);        
        //var statusAtomicEditLabel = new AtomicEditLabel(dataItem.status, 
        //                                                dataItem, 
        //                                               statusSelectField,
        //                                                'status',
        //                                                this);
        
        $collectionElementDescription
            .append(descriptionAtomicEditLabel.$dom)
            .append(dateAtomicEditLabel.$dom)
            .append(expiryDateAtomicEditLabel.$dom)
            .append(personAtomicEditLabel.$dom)
            .append('<span>' + dataItem.status + '<br></span>');
        
        return $collectionElementDescription;
    }
    
    makeList(){
        return super.makeList().filter((item)=>item.parentId_Hidden==this.parentId && item.eventsType_Hidden == this.eventsType);
    }
    
    selectTrigger(itemId){
        super.selectTrigger(itemId);
        //$('#iframeCases').attr('src','../Cases/CasesList.html?milestoneId=' + this.connectedRepository.currentItem.projectId  + '&contractId=' + this.connectedRepository.currentItem.contractId);
    }
}