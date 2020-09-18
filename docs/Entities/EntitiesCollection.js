class EntitiesCollection extends SimpleCollection {
    /*
     * @param {type} id
     * @param {boolean} isPlane - czy lista ma być prosta czy z Avatarem
     * @param {boolean} hasFilter - czy ma być filtr
     * @param {boolean} isAddable - czy można dodować nowe elementy
     */
    constructor(initParamObject) {
        super({
            id: initParamObject.id,
            title: initParamObject.title,
            isPlain: true,
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


    makeItem(dataItem) {

        return {
            id: dataItem.id,
            $title: this.makeTitle(dataItem),
            $description: this.makeDescription(dataItem),
            dataItem: dataItem
        };
    }

    makeTitle(dataItem) {
        (dataItem.address) ? true : dataItem.address = "";
        var addressLabel = (dataItem.address) ? (dataItem.address) + '<BR>' : "";

        var label = dataItem.name + ' <BR>' +
            addressLabel;
        return label;
    }

    makeDescription(dataItem) {
        dataItem.taxNumber = (dataItem.taxNumber) ? dataItem.taxNumber : "";
        var taxNumberLabel = (dataItem.taxNumber) ? 'NIP: ' + dataItem.taxNumber + '<BR>' : "";

        (dataItem.www) ? true : dataItem.www = "";
        (dataItem.email) ? true : dataItem.email = "";

        return taxNumberLabel +
            '<a href="' + dataItem.www + 'target="_blank">' + dataItem.www + '</a> ' +
            '<a href="mailto:' + dataItem.email + '">' + dataItem.email + '</a>'
    }
}