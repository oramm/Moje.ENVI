class ExternalAchievementsCollection extends SimpleCollection {
    constructor(initParamObject) {
        super({
            id: initParamObject.id,
            $title: initParamObject.title,
            isPlain: true,
            hasFilter: true,
            isEditable: true,
            isAddable: initParamObject.isAddable,
            isDeletable: true,
            connectedRepository: ExternalAchievementsSetup.externalAchievementsRepository
        })
        this.parentId = initParamObject.parentId;

        this.addNewModal = new ExternalAchievementModal('newExternalAchievement', 'Dodaj osiągnięcie', this, 'ADD_NEW');
        this.editModal = new ExternalAchievementModal('editExternalAchievement', 'Edytuj osiągnięcie', this, 'EDIT');
        this.currencyFormatter = new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' });

        this.initialise(this.makeList());
    }

    makeItem(dataItem) {
        return {
            id: dataItem.id,
            $title: this.makeTitle(dataItem),
            $description: this.makeDescription(dataItem),
            dataItem: dataItem
        };
    }

    /*
     * @param {dataItem} this.connectedRepository.items[i])
     */
    makeTitle(dataItem) {
        return dataItem._owner._nameSurnameEmail + ' | ' +
            dataItem.roleName;
    }

    /*
     * @param {dataItem} this.connectedRepository.currentItem
     */
    makeDescription(dataItem) {
        var descirption = '<br>' +
            'Zamawiający :' + dataItem.employer + '<br>' +
            'Wartość robót: <b>' + this.currencyFormatter.format(dataItem.worksValue) + '</b><BR>' +
            'Wartość projektu: <b>' + this.currencyFormatter.format(dataItem.projectValue) + '</b><BR>' +
            '<b>' + dataItem.startDate + ' - ' +
            dataItem.endDate + '</b>' +
            '<br>' +
            dataItem.description + '<BR>' +
            dataItem.worksScope;
        return descirption;
    }
}