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
            this.$addNewModal = new NewExternalAchievementModal('newExternalAchievement', 'Dodaj osiągnięcie', this);
        this.editModal = new EditExternalAchievementModal('editExternalAchievement', 'Edytuj osiągnięcie', this);
        
        this.initialise(this.makeList());        
    }
        
    makeItem(dataItem){
        return {    id: dataItem.id,
                        icon:   'person',
                        title:  dataItem.ownerNameSurnameEmail + ' | ' + 
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