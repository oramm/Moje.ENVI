class InvoicesView extends Popup {
    constructor() {
        super();
    }
    initialise() {
        this.collapsible = new InvoicesCollapsible('invoicesListCollapsipble');
        this.setTittle("Rejestr faktur");
        //this.actionsMenuInitialise();

        $('#actionsMenu').after(this.collapsible.$dom);
        this.dataLoaded(true);
    }

    actionsMenuInitialise() {
        //$('#actionsMenu').append(newPersonButton);
    }
}