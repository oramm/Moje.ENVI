class Filter {
    constructor(connectedResultsetComponent, showActiveRows) {
        this.id = connectedResultsetComponent.id + "-filter";
        this.connectedResultsetComponent = connectedResultsetComponent;
        this.showActiveRows = (showActiveRows === undefined) ? true : showActiveRows;
        this.filterElements = [];
        if (this.connectedResultsetComponent.hasArchiveSwitch === undefined)
            this.connectedResultsetComponent.hasArchiveSwitch = false;
        this.$dom = $('<div class="row">');

    }
    initialise(filterElements = []) {
        this.addDefaultFilter();
        for (const element of filterElements)
            this.addInput(element)
        if (this.connectedResultsetComponent.hasArchiveSwitch) {
            this.addArchiveSwitch();
        }
    }

    addDefaultFilter() {
        var filterElement = {
            inputType: 'InputTextField',
            colSpan: 12,
            label: 'Filtruj listę'
        };
        this.addInput(filterElement);
    }

    addArchiveSwitch() {
        var filterElement = {
            inputType: 'FilterSwitchInput',
            colSpan: 3,
            onLabel: 'Aktualne',
            offLabel: 'Archiwum',
            attributeToCheck: 'status',
            searchedRegex: /^((?!Zamknięt|Archiw).)*$/
        };
        this.addInput(filterElement);
    }
    /*
     * Uruchamiana po kliknięciu w Switch Archiwum
     * @param {boolean} showArchive
     * @returns {undefined}
     */
    changeFilterCriteriaHandler() {
        var _this = this;
        var $filteredListObject;
        if (this.connectedResultsetComponent.$collapsible)
            $filteredListObject = this.connectedResultsetComponent.$collapsible;
        else if (this.connectedResultsetComponent.$collection)
            $filteredListObject = this.connectedResultsetComponent.$collection;
        $filteredListObject.children("li").map(function () {
            if (!_this.checkIfRowMatchesFilters($(this)))
                $(this).hide()
            else
                $(this).show();
        });
    }
    /*
     * Sprawdza czy wiersz connectedResultsetComponent pasuje do kreyteriów wyszukiwania
     * @param {type} $row
     * @returns {Filter@call;isRowArchived|Boolean}
     * 
     * //TODO: obsłużyć dodatkowe pola
     * https://www.w3schools.com/bootstrap/bootstrap_filters.asp
     */
    checkIfRowMatchesFilters($row) {
        for (var i = 0; i < this.filterElements.length; i++)
            switch (this.filterElements[i].inputType) {
                case 'InputTextField':
                    if (!$row.text().toLowerCase().includes(this.filterElements[i].input.getValue().toLowerCase()))
                        return false;
                    break;
                case 'FilterSwitchInput':
                    if ($row.attr(this.filterElements[i].attributeToCheck) !== undefined) {
                        var attrValueIsPositive = $row.attr(this.filterElements[i].attributeToCheck).match(this.filterElements[i].searchedRegex);
                        attrValueIsPositive = (!attrValueIsPositive) ? false : true;
                        var valeshouldBepositive = this.filterElements[this.filterElements.length - 1].input.getValue()
                        if (attrValueIsPositive != valeshouldBepositive)
                            return false;
                    }
                    break;
            }
        return true;
    }

    /*
     * dodaje nistandardowy element do filtra (lista i $dom)
     */
    addInput(filterElement) {
        switch (filterElement.inputType) {
            case 'InputTextField':
                filterElement.input = this.createInputTextField(filterElement);
                break;
            case 'FilterSwitchInput':
                filterElement.input = new FilterSwitchInput(filterElement.onLabel, filterElement.offLabel, this);
                break;
            default:
                throw new Error(filterElement.inputType + " to niewłaściwy typ pola filtrującego!")
        }
        var $col = $('<div>');
        this.filterElements.push(filterElement);
        this.$dom
            .append($col).children(':last-child')
            .append(filterElement.input.$dom);
        this.setElementSpan(filterElement, filterElement.colSpan);
        //skoryguj szerokość gównego pola filtrowania
        var newDefaultElementColspan = 12 - this.totalElementsColsPan()
        this.filterElements[0].input.$dom.removeClass('col s' + this.filterElements[0].colSpan);
        this.setElementSpan(this.filterElements[0], newDefaultElementColspan);
    }
    /*
     * Ustawia szerokość elementu w siatce GUI
     */
    setElementSpan(filterElement, colSpan) {
        filterElement.colSpan = colSpan;
        filterElement.input.$dom.addClass('col s' + filterElement.colSpan);
    }
    /*
     * Podstawowe pole filtrowania
     */
    createInputTextField(filterElement) {
        var textField = new InputTextField(this.id + this.filterElements.length, filterElement.label);
        var _this = this;
        textField.$input.on("keyup", function () {
            _this.changeFilterCriteriaHandler();
        });
        return textField;
    }

    totalElementsColsPan() {
        var colSpan = 0;
        for (var i = 1; i < this.filterElements.length; i++) {
            colSpan += this.filterElements[i].colSpan;
        }
        return colSpan;
    }
}