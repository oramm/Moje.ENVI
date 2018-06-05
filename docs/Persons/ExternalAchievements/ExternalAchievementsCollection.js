class ExternalAchievementsCollection extends SimpleCollection {
    constructor(id){
        super(id, externalAchievementsRepository);
        
        this.$addNewModal = new NewExternalAchievementModal('newExternalAchievement', 'Dodaj osiągnięcie', this);
        this.$editModal = new EditExternalAchievementModal('editExternalAchievement', 'Edytuj osiągnięcie', this);
        
        this.initialise(this.makeList());        
    }
    
    makeItem(dataItem){
        return {    id: dataItem.id,
                        icon:   'person',
                        title:  dataItem.ownerNameSurname + ' | ' + 
                                dataItem.ownerEmail + ': ' +
                                dataItem.roleName,
                        description:    '<br>' + 
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