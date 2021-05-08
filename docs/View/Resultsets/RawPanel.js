/* 
 * http://materializecss.com/collapsible.html
 * słuzy jako pojemnik na przyciski wykonujące akcję na serwerze bez rezultsetu
 */
class RawPanel extends Resultset {
    constructor(initParamObject) {
        super(initParamObject)
        this.connectedRepository = initParamObject.connectedRepository;
        this.$dom = $('<div>')
            .attr('id', 'container' + '_' + this.id);
        this.$actionsMenu = $('<div>')
            .attr('id', 'actionsMenu' + '_' + this.id)
            .addClass('cyan lighten-5')
            .addClass('actionsMenu');
    }

    /*
     * @param {CollapsibleItems[]} items - generowane m. in. SompleCollapsible
     * @param {type} parentViewObject
     * @param {type} parentViewObjectSelectHandler
     * @returns {undefined}
     */
    initialise(modal, buttonStyle) {
        this.modal = modal;
        this.buildDom(buttonStyle);
    }

    buildDom(buttonStyle) {

        this.$dom
            .append(this.$actionsMenu);
        this.modal.preppendTriggerButtonTo(this.$actionsMenu, this.modal.title, this, buttonStyle);
        if (this.title)
            this.$dom.prepend(this.$title)
    }

    /*
     * funkcja wywoływana w repository, potrzebny trik z appply dla callbacka
     * @param {String} status
     * @param {CollapsibleItem} item
     * @param {String} errorMessage
     * @returns {Promise}
     */
    addNewHandler(status, item, errorMessage) {
        switch (status) {
            case "DONE":
                this.$dom.find('.progress').remove();
                return status;
                break;
            case "PENDING":
                item.id = item._tmpId;
                this.$dom.append(this.makePreloader('preloader' + item.id))
                return item.id;
                break;
            case "ERROR":
                alert(errorMessage);
                this.$dom.find('.progress').remove();
                return status;
                break;
        }
    }
}