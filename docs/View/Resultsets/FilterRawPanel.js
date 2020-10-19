/* 
 * http://materializecss.com/collapsible.html
 */
class FilterRawPanel extends Resultset {
    constructor(initParamObject) {
        super(initParamObject);
        this.formElements = initParamObject.formElements;
        this.createResultset = initParamObject.createResultset;

        this.form = new Form("form_" + this.id, "GET", this.formElements, true, 'Filtruj');
        this.resultset = { $dom: $('<div>') };

        this.$dom = $('<div>')
            .attr('id', 'container' + '_' + this.id);
        this.$actionsMenu = $('<div>')
            .attr('id', 'actionsMenu' + '_' + this.id)
            .addClass('cyan lighten-5')
            .addClass('actionsMenu');
        this.buildDom();
    }

    /*
     * @param {CollapsibleItems[]} items - generowane m. in. SompleCollapsible
     * @param {type} parentViewObject
     * @param {type} parentViewObjectSelectHandler
     * @returns {undefined}
     */
    buildDom() {
        this.$actionsMenu.append(this.form.$dom)
        this.$dom
            .append(this.$actionsMenu)
            .append(this.resultset.$dom);

        this.setSubmitAction();
        this.formElements.map((element) => element.input.$dom.addClass('col s' + element.colSpan));
    }

    refreshResultset() {

    }

    /*
     * Funkcja musi być obsłużona w klasie pochodnej.
     * Klasa pochodna musi mieć metodę submitTrigger()
     */
    setSubmitAction() {
        this.form.$dom.submit((event) => {
            this.submitTrigger();
            // prevent default posting of form
            event.preventDefault();
        });
    }

    submitTrigger() {
        this.resultset.$dom.hide();
        this.$dom.append(this.makePreloader('preloader_' + this.parentViewObject.id))
        var criteriaParameters = {};
        var _this = this;
        this.form.submitHandler(criteriaParameters)
            .then(() => {
                if (this.form.validate(criteriaParameters)) {
                    var promises = [
                        InvoicesSetup.invoicesRepository.initialise(criteriaParameters),
                        InvoicesSetup.invoiceitemsRepository.initialise(criteriaParameters)
                    ]
                    Promise.all(promises)
                        .then((res) => {
                            var oldResultset = _this.resultset;
                            _this.resultset = this.createResultset();
                            oldResultset.$dom.replaceWith(_this.resultset.$dom)

                            $('select').material_select();
                            $('.modal').modal();
                            $('.datepicker').pickadate(MainSetup.datePickerSettings);
                            
                            Materialize.updateTextFields();
                            $('ul.tabs').tabs();
                            iFrameResize({ log: false, heightCalculationMethod: 'taggedElement', checkOrigin: false });
                            this.$dom.find('.progress').remove();
                            ReachTextArea.reachTextAreaInit();
                        })
                } else
                    alert('Podaj prawidłowe kryteria');
            })
    }
}