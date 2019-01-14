class ExternalAchievementsCollection extends SimpleCollection {
    constructor(initParamObject){
        super({id: initParamObject.id, 
               title: initParamObject.title,
               isPlain: false, 
               hasFilter: true,
               isEditable: true, 
               isAddable: initParamObject.isAddable, 
               isDeletable: true,
               connectedRepository: ExternalAchievementsSetup.externalAchievementsRepository
              })
        this.parentId = initParamObject.parentId;
        
        if (this.isAddable) 
            this.addNewModal = new ExternalAchievementModal('newExternalAchievement', 'Dodaj osiągnięcie', this, 'ADD_NEW');
        this.editModal = new ExternalAchievementModal('editExternalAchievement', 'Edytuj osiągnięcie', this, 'EDIT');
        
        this.initialise(this.makeList());        
    }
        
    makeItem(dataItem){
        return {    id: dataItem.id,
                        icon:   'person',
                        title:  dataItem._owner.nameSurnameEmail + ' | ' + 
                                dataItem.roleName,
                        description:    '<br>' + 
                                        'Zamawiający :' + dataItem.employer + '<br>' + 
                                        'Wartość robót: <b>' + new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(dataItem.worksValue) + '</b><BR>' +
                                        'Wartość projektu: <b>' + new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(dataItem.projectValue) + '</b><BR>' +
                                        '<b>' + dataItem.startDate + ' - ' +
                                        dataItem.endDate + '</b>' +
                                        '<br>' +
                                        dataItem.description + '<BR>' +
                                        dataItem.worksScope
                };
    }
}