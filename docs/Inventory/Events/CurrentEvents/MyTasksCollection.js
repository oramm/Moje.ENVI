class MyTasksCollection extends SimpleCollection {
    constructor(id){
        super({id: id, 
               isPlain: true, 
               isEditable: true, 
               isAddable: true, 
               isDeletable: true,
               connectedRepository: tasksRepository
              });

        this.addNewModal = new NewTaskModal(this.id + '_newTask', 'Dodaj zadanie', this);
        this.editModal = new EditTaskModal(this.id + '_editTask', 'Edytuj zadanie', this);
        
        this.initialise(this.makeList());        
    }    
    /*
     * Dodano atrybut z caseId_Hidden, żeby szybciej filtorwac widok po stronie klienta zamiast przez SELECT z db
    */
    makeItem(dataItem){
        (dataItem.nameSurnameEmail)? true : dataItem.nameSurnameEmail="";
        var nameSurnameEmailLabel = (dataItem.nameSurnameEmail)? (dataItem.nameSurnameEmail)  + '<BR>': "";
        
        (dataItem.description)? true : dataItem.description="";
        var descriptionLabel = (dataItem.description)? (dataItem.description)  + '<BR>': "";
        
        (dataItem.status)? true : dataItem.status="";
        var statusLabel = (dataItem.status)? (dataItem.status)  + '<BR>': "";
        
        //(dataItem.description)? true : dataItem.description="";
        return {    id: dataItem.id,
                    $title:  this.makeTitle(dataItem),
                    $description:    this.makeDescription(dataItem),
                    userEmail_Hidden:  dataItem.nameSurnameEmail
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
        
        
        var deadlineAtomicEditLabel = new AtomicEditLabel(dataItem.deadline, 
                                                        dataItem, 
                                                        new DatePicker(this.id + '_' + dataItem.id + '_deadLinePickerField','Termin wykonania', true),
                                                        'deadline',
                                                        this);
        
        
        (dataItem.status)? true : dataItem.status="";
        
        var personAutoCompleteTextField = new AutoCompleteTextField(this.id+'personAutoCompleteTextField',
                                                                     'Imię i nazwisko', 
                                                                     'person', 
                                                                     false, 
                                                                     'Wybierz imię i nazwisko')
        personAutoCompleteTextField.initialise(personsRepository,"nameSurnameEmail", this.onOwnerChosen, this);
        
        var personAtomicEditLabel = new AtomicEditLabel(dataItem.nameSurnameEmail, 
                                                        dataItem, 
                                                        personAutoCompleteTextField,
                                                        'nameSurnameEmail',
                                                        this);
        
       
        $collectionElementDescription
            .append(descriptionAtomicEditLabel.$dom)
            .append(deadlineAtomicEditLabel.$dom)
            .append(personAtomicEditLabel.$dom)
            .append('<span>' + dataItem.status + '<br></span>');
        
        return $collectionElementDescription;
    }
    
    makeList(){
        return super.makeList().filter((item)=>item.userEmail_Hidden.includes(user.getEmail()));
    }
    
    selectTrigger(itemId){
        super.selectTrigger(itemId);
        //$('#contractDashboard').attr('src','../Cases/CasesList.html?milestoneId=' + this.connectedRepository.currentItem.projectId  + '&contractId=' + this.connectedRepository.currentItem.contractId);
    }
}