/*
 * @type AutoCompleteTextField
 * Używać tego następująco:
 * 1. tworzymy obiekt
 * 2. dodajemy $dom do formularza
 * 3. wywołujemy initialise();
 */
class AutoCompleteTextField {
    constructor(id, label, icon, isRequired) {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.$dom;
        this.$label;

        this.buildDom(id, icon, isRequired);
    }

    initialise(repository, key, onCompleteCallBack, viewObject) {
        this.repository = repository;
        this.objectList = [];
        this.key = key;
        this.onCompleteCallBack = onCompleteCallBack;
        this.viewObject = viewObject;
        this.chosenItem;
        this.pushData(this.key);
    }

    buildDom(id, icon, isRequired) {
        this.$dom = $('<div class="input-field">');
        var $icon = $('<i class="material-icons prefix">' + icon + '</i>');
        var $input = $('<input name="' + id + '" type="text" class="autocomplete" autocomplete="off">')
            .attr('id', id);

        this.$label = $('<label>');
        this.setLabel(this.label);

        if (isRequired) {
            $input
                .attr('required', 'true')
                .attr('pattern', '[]');
            this.isRequired = isRequired;
        }

        this.$dom
            .append($icon)
            .append($input)
            .append(this.$label);
        return this.$dom;
    }

    setLabel(label) {
        this.label = label;
        //this.$label = $('<label for="'+ id +'">'+ this.label +'</label>');

        this.$label
            .attr('for', this.id)
            .text(this.label);
    }

    pushData(key) {
        var autocompleteList = {};
        Object.keys(this.repository.items).forEach((id) => {
            if (this.repository.items[id][key] !== undefined) {
                this.objectList.push(this.repository.items[id]);
                autocompleteList[this.repository.items[id][key]] = null;
            }
        });
        // Plugin initialization
        this.$dom.children('input.autocomplete').autocomplete({
            data: autocompleteList,
            limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
            onAutocomplete: (inputValue) => {
                this.setValue(inputValue);
            },
            minLength: 1, // The minimum length of the input for the autocomplete to start. Default: 1.
            onChange: () => alert(inputValue)
        });
    }

    setValue(inputValue) {
        if (inputValue !== undefined) {
            //inputValue pochodzi z formularza
            if (typeof inputValue !== 'object') {
                this.chosenItem = Tools.search(inputValue, this.key, this.repository.items);
                this.repository.currentItem = this.chosenItem;
                if (this.chosenItem) this.$dom.children('input').attr('pattern', '^' + inputValue + '$');
                this.$dom.children('input').val(inputValue);
            }
            //inputValue pochodzi z repository i jest obiektem
            else {
                this.chosenItem = inputValue;
                //zakłądam, że oiekt posiada atrybut this.key
                inputValue = inputValue[this.key];
            }
            if (this.chosenItem)
                this.$dom.children('input').attr('pattern', '^' + inputValue + '$');
            this.$dom.children('input').val(inputValue);
            //this.onCompleteCallBack powinien być zadeklarowany w modalu
            if (typeof this.onCompleteCallBack === "function") {
                this.onCompleteCallBack.apply(this.viewObject, [this.chosenItem]);
            }
        }
    }

    setDefaultValue() {
        if (this.objectList.length === 1)
            this.setValue(this.objectList[0])
    }

    clearInput() {
        this.$dom.children('input').val('');
    }
    clearChosenItem() {
        this.chosenItem = undefined;
        this.repository.currentItem = {};
        this.repository.currentItems = [];
        this.clearInput
    }
}

class SelectField {
    /*
     * 
     * @param {type} id
     * @param {type} label
     * @param {type} icon
     * @param {type} isRequired
     * @returns {SelectField}
     */
    constructor(id, label, icon, isRequired, defaultDisabledOption = "Wybierz opcję") {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.chosenItem;
        this.$dom;
        this.$select;
        this.defaultDisabledOption = defaultDisabledOption;
        this.buildDom(id, label, icon, isRequired);
    }

    initialise(optionsData, key, onItemSelectedHandler, viewObject) {
        this.$select.empty();
        this.optionsData = optionsData;
        this.key = key;
        this.onItemSelectedHandler = onItemSelectedHandler;
        this.viewObject = viewObject;

        //this.$select.append('<option value="" disabled selected>' + this.defaultDisabledOption + '</option>');
        var $emptyOption = $('<option>')
            .attr('value', '')
            .attr('selected', '')
            .text(this.defaultDisabledOption);
        if (this.isRequired)
            $emptyOption.attr('disabled', '')
        this.$select.append($emptyOption);
        if (typeof optionsData[0] !== 'object')
            this.pushDataFromStringList();
        else
            this.pushDataFromObjectsList();
        this.$dom.find('select').material_select();
        if (this.isRequired) {
            var regex = new RegExp('^((?!' + this.defaultDisabledOption + ').)*$');
            this.$dom.find('input').attr('pattern', regex);
        }
        this.setOnchangeAction();
    }
    //this.optionsData jest typu Object
    pushDataFromObjectsList() {
        for (var i = 0; i < this.optionsData.length; i++) {
            var $option = $('<option>')
                .attr('value', '' + i)
                .text(this.optionsData[i][this.key]);
            this.$select.append($option);
        }
    }

    pushDataFromStringList() {
        for (var i in this.optionsData) {
            var $option = $('<option>')
                .attr('value', '' + i)
                .text(this.optionsData[i]);
            this.$select.append($option);
        }
    }

    buildDom(id, label) {
        this.$dom = $('<div class="input-field">');
        this.$select = $('<select>');
        this.$select.attr('id', id)
        var $label = $('<label>' + label + '</label>');
        this.$dom
            .append(this.$select)
            .append($label);

        return this.$dom;
    }

    setOnchangeAction() {
        var _this = this;
        //this.$dom.find('li').on("click",function(){_this.onItemChosen(this)});
        if (this.onItemSelectedHandler) {
            this.$select.off('change');
            this.$select.on('change', function () {
                _this.getValue();
                _this.onItemSelectedHandler.apply(_this.viewObject, [_this.chosenItem]);
            });
        }
    }

    getValue() {
        var inputValue = this.$dom.find('input').val();
        if (!this.optionsData && !this.isRequired)
            return;
        if (inputValue !== this.defaultDisabledOption) {
            if (typeof this.optionsData[0] !== 'object') {
                this.chosenItem = inputValue;
            }
            else {
                this.chosenItem = this.optionsData.find(item => item[this.key] == inputValue);
            }
        } else
            this.chosenItem = undefined;
        return this.chosenItem;
    }

    simulateChosenItem(inputValue) {
        if (inputValue !== undefined) {
            var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
            if (inputValue === this.defaultDisabledOption) {
                this.chosenItem = undefined;

                this.$select.val(inputValue).trigger('change');
            } else if (typeof this.optionsData[0] !== 'object') {
                this.chosenItem = inputValue;
                //var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
                //this.$dom.find('li:nth-child('+itemSelectedId+')').click();
            }
            else {
                this.chosenItem = this.optionsData.find(item => item.id == inputValue.id ||
                    item[this.key] == inputValue[this.key]
                );
                if (this.chosenItem) {
                    var optionsString = this.optionsData.map(item => item[this.key]);
                    itemSelectedId = 2 + optionsString.indexOf(this.chosenItem[this.key]);
                } else
                    itemSelectedId = 0;
            }
            this.$dom.find('li:nth-child(' + itemSelectedId + ')').click();
        }
    }

    clearChosenItem() {
        this.chosenItem = undefined;
        this.$dom.find('input').val('');
    }

    validate() {
        if (this.isRequired) {
            return this.chosenItem !== this.defaultDisabledOption && this.chosenItem !== undefined;
        } else
            return true;

    }
}

class Chip {
    constructor(id, caption, dataItem, onDeleteCallBack, viewObject) {
        this.id = id;
        this.caption = caption;
        this.dataItem = dataItem;
        this.onDeleteCallBack = onDeleteCallBack;
        this.viewObject = viewObject;
        this.$dom;
        this.buidDom();
        this.setOnDeleteAction();
    }

    buidDom() {
        this.$dom = $('<div>');
        this.$dom
            .attr('id', 'chip_' + this.id)
            .addClass('chip')
            .html(this.caption);

        if (this.onDeleteCallBack)
            this.$dom.append('<i class="close material-icons">close</i>');
    }

    setOnDeleteAction() {
        this.$dom.children('i').off('change');
        var _this = this;
        this.$dom.children('i').on('click', function (e) {
            _this.onDeleteCallBack.apply(_this.viewObject, [_this.dataItem]);

        });
    }
}


/*
 * value to obiekt, który chcemy wysyłać do serwera np. tablica
 * @type type
 */
class HiddenInput {
    constructor(id, name, value, isRequired) {
        this.id = id;
        this.name = (name) ? name : id;
        this.value = value;
        this.isRequired = isRequired;
        this.$dom;
        this.buildDom();
    }

    buildDom() {
        this.$dom = $('<input>');
        this.$dom
            .attr('type', 'hidden')
            .attr('id', this.id)
            .attr('name', this.name);
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    validate() {
        var test = !this.isRequired || this.value !== undefined && this.value.length > 0 && this.value !== {};
        if (!test) {
            this.$dom.addClass('invalid');
        } else {
            this.$dom.removeClass('invalid');
        }
        return test;
    }
}

/*
 * value to obiekt, który chcemy wysyłać do serwera np. tablica
 * @type type
 */
class FileInput {
    constructor(id, name, viewObject, isRequired) {
        this.id = id;
        this.name = (name) ? name : id;
        this.viewObject = viewObject;
        this.isRequired = isRequired;
        this.$dom;
        this.buildDom();
    }

    buildDom() {
        this.$dom = $('<form action="#">');
        this.$fileField = $('<div>');
        this.$input = $('<input>');
        this.$input
            .attr('type', 'file')
            .attr('id', this.id)
            .attr('multiple', '')
            .attr('name', this.name);

        this.$button = $('<div>');
        this.$button
            .addClass('btn')
            .append($('<span>Plik</span>'))
            .append(this.$input)

        this.$fileField
            .addClass('file-field')
            .addClass('input-field')
            .append(this.$button)
            .append('<div class="file-path-wrapper">').children('.file-path-wrapper')
            .append('<input class="file-path validate" type="text" placeholder="Wybierz jeden lub kilka plików">')

        this.$dom.append(this.$fileField);
    }

    getFiles() {
        return this.$input[0].files;
    }

    readFile(blob) {
        return new Promise((resolve, reject) => {
            //pobierz plik z pickera
            if (!blob)
                resolve();
            else {
                var reader = new FileReader();
                var base64data;

                reader.onloadend = function () {
                    base64data = reader.result.replace(/^data:.+;base64,/, '');
                    resolve({
                        blobBase64String: base64data,
                        name: blob.name,
                        mimeType: blob.type
                    })
                }
                reader.readAsDataURL(blob);
            }
        });
    }

    getValue() {
        return new Promise((resolve, reject) => {
            if (this.getFiles().length == 0) {
                resolve([]);
                return [];
            }
            var promises = [];
            var blobs = [];
            for (var i = 0; i < this.getFiles().length; i++) {
                promises[i] = this.readFile(this.getFiles()[i])
                    .then((result) => blobs.push(result));
            }
            Promise.all(promises)
                .then(() => resolve(blobs));
        });
    }
    validate() {
        var test = true;
        if (this.isRequired && !this.getFiles()[0])
            test = false;
        return test;
    }
}

class ReachTextArea {
    constructor(id, label, isRequired, maxCharacters) {
        this.id = id;
        this.label = label;
        this.isRequired = isRequired;
        this.maxCharacters = maxCharacters;
        this.createReachTextArea();
    }
    /*
     * Używać w klasie XxxxController po XxxxView.initilise()
     */
    static reachTextAreaInit() {
        tinymce.init({
            selector: '.reachTextArea',
            toolbar: 'undo redo | bold italic underline | outdent indent | link',
            menubar: false,
            forced_root_block: false,
            statusbar: true,

            plugins: "autoresize link paste",
            paste_auto_cleanup_on_paste: true,
            paste_as_text: true,

            autoresize_bottom_margin: 20,
            autoresize_min_height: 30,
            //max_chars: 30,
            branding: false,

            setup: function (ed) {
                var allowedKeys = [8, 37, 38, 39, 40, 46]; // backspace, delete and cursor keys
                ed.on('keydown', function (e) {
                    if (allowedKeys.indexOf(e.keyCode) != -1) return true;
                    var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                    if ($(ed.getBody()).text().length + 1 > maxCharacters) {
                        //if (ReachTextArea.tinymce_getContentLength() + 1 > this.settings.max_chars) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                    return true;
                });
                ed.on('keyup', function (e) {
                    var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                    ReachTextArea.tinymce_updateCharCounter(this, ReachTextArea.tinymce_getContentLength(), maxCharacters);
                });
            },
            init_instance_callback: function () { // initialize counter div
                var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                $('#' + this.id).prev().append('<div class="char_count" style="text-align:right"></div>');
                ReachTextArea.tinymce_updateCharCounter(this, ReachTextArea.tinymce_getContentLength(), maxCharacters);
            },
            paste_preprocess: function (plugin, args) {
                return;
                var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                var editor = tinymce.get(tinymce.activeEditor.id);
                var len = editor.contentDocument.body.innerHTML.length;
                var text = $(args.content).text();
                if (len + text.length > editor.settings.max_chars) {
                    alert('Pasting this exceeds the maximum allowed number of ' + editor.settings.max_chars + ' characters.');
                    args.content = '';
                } else {
                    ReachTextArea.tinymce_updateCharCounter(editor, len + text.length, maxCharacters);
                }
            }
        });
    }

    static tinymce_updateCharCounter(el, len, maxCharacters) {
        $('#' + el.id).prev().find('.char_count').text(len + '/' + maxCharacters);
    }

    static tinymce_getContentLength() {
        return tinymce.get(tinymce.activeEditor.id).contentDocument.body.innerHTML.length;
    }

    /*
     * w funkcji fillWithData() użyć:
     *      tinyMCE.get(this.id + 'descriptionTextField').setContent(rolesRepository.currentItem.description);
     *      tinyMCE.triggerSave();
     */
    createReachTextArea() {
        this.$dom = $('<div>');
        this.$input = $('<textarea class="materialize-textarea validate" id="' + this.id + '" name="' + this.id + '" >');
        var $label = $('<label>' + this.label + '</label>');
        $label.addClass('active')

        this.$dom
            .append($label)
            .append(this.$input);

        this.$input
            .attr('max_chars', this.maxCharacters)
            .addClass('reachTextArea')
    }

    setLabel(label) {
        this.label = label;
        this.$dom.find('label').text(label);
    }
}

class SelectFieldBrowserDefault {
    /*
     * Sposób użycia: tworzymy nowy obiekt >> initialise >> w kontrolerze po zbudowaniu DOM >> ()=>{$('select').material_select();
     * @param {type} id
     * @param {type} label
     * @param {type} icon
     * @param {type} isRequired
     * @returns {SelectField}
     */
    constructor(id, label, icon, isRequired) {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.chosenItem;
        this.$dom;
        this.$select;
        this.buildDom(id, label, icon, isRequired);
    }

    initialise(optionsData) {
        this.$select.empty();
        if (optionsData === undefined)
            optionsData = this.optionsData;
        else
            this.optionsData = optionsData;

        this.$select.append('<option value="" disabled selected>' + this.defaultDisabledOption + '</option>')
        for (var i in optionsData) {
            var $option = $('<option>')
                .val(optionsData[i].name)
                .text(optionsData[i].name);
            this.$select.append($option);
        }
        this.setChangeAction();

    }

    buildDom(id, label, icon, isRequired, options) {

        this.$select = $('<select class="browser-default">');
        this.$dom = $('<div>');
        var $label = $('<label>' + label + '</label>');

        this.$dom
            .append($label)
            .append(this.$select);

        //if (isRequired)
        //    $select.attr('required','true')
        return this.$dom;
    }

    getValue() {
        return this.chosenItem;
    }
    //uruchamiana na click
    setValue(inputValue) {
        this.chosenItem = Tools.search(inputValue, 'name', this.optionsData);
    }

    setChangeAction() {
        var _this = this;
        this.$select.change(function () {
            _this.setValue($(this).val());
        });
    }
    simulateChosenItem(inputValue) {
        this.setValue(inputValue);
        var itemSelectedId = this.optionsData.findIndex(x => x.hello === inputValue);
        //var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
        this.$dom.find('li:nth-child(' + itemSelectedId + ')').click();

    }
}

class DatePicker {
    constructor(id, label, icon, isRequired) {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.chosenDate;
        this.$dom;
        this.$input;
        this.createDatePickerField(id, label, icon, isRequired);
    }

    createDatePickerField(id, label, icon, isRequired) {
        this.$dom = $('<div class="input-field">');
        this.$input = $('<input type="text" class="datepicker" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="' + id + '">' + label + '</label>');
        this.$dom
            .append(this.$input)
            .append($label);
        this.$input.pickadate(MainSetup.datePickerSettings);
        return this.$dom;
    }
    //https://stackoverflow.com/questions/30324552/how-to-set-the-date-in-materialize-datepicker
    setValue(date) {
        var $generatedInput = this.$input.pickadate()

        // Use the picker object directly.
        var picker = $generatedInput.pickadate('picker')
        picker.set('select', date, { format: 'yyyy-mm-dd' })
    }
    getValue() {
        return this.$input.val();
    }

    validate() {
        if (!this.isRequired)
            return true;
        var test = $('#' + this.id).val() != '';
        if (test === false) {
            this.$input.addClass('invalid');
        } else {
            this.$input.removeClass('invalid');
        }
        return test;
    }

    setLabel(label) {
        this.label = label;
        this.$dom.find('label').text(label);
    }
}
class InputTextField {
    constructor(id, label, icon, isRequired, maxCharacters, validateRegex, dataError) {
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.maxCharacters = maxCharacters;
        this.validateRegex = validateRegex;
        this.dataError = dataError;
        this.$dom;
        this.$input;
        this.$label;
        this.buildDom();
    }
    //ikony do dodania
    buildDom() {
        this.$dom = $('<div class="input-field">');
        this.$input = $('<input type="text" class="validate" id="' + this.id + '" name="' + this.id + '">');
        this.$label = $('<label for="' + this.id + '">' + this.label + '</label>');
        this.$dom
            .append(this.$input)
            .append(this.$label);

        this.setIsRequired(this.isRequired);

        if (this.maxCharacters > 0) {
            this.$input
                .attr('data-length', this.maxCharacters);
            this.$input.characterCounter();
        }
        if (this.validateRegex) {
            this.$input
                .attr('pattern', this.validateRegex);
        }

        if (this.dataError !== undefined)
            this.$label.attr('data-error', this.dataError);
        else
            this.$label.attr('data-error', 'Niewłaściwy format danych');
    }

    setIsRequired(isRequired) {
        this.isRequired = isRequired;
        if (this.isRequired)
            this.$input.attr('required', this.isRequired);
        else
            this.$input.removeAttr('required');
    }

    getValue() {
        return this.$input.val();
    }

    setValue(inputvalue) {
        this.$input.val(inputvalue);
    }
}
class Tabs {
    constructor(initParameters) {
        this.id = initParameters.id;
        this.itemSelectedNumber = (initParameters.itemSelectedNumber) ? initParameters.itemSelectedNumber : 0;
        this.swipeable = initParameters.swipeable;
        this.parentId = initParameters.parentId;
        this.responsiveThreshold = initParameters.responsiveThreshold;
        this.tabsData = initParameters.tabsData;
        this.contentIFrameId = initParameters.contentIFrameId;
        this.$dom = $('<div class="row">');
        this.$tabs = $('<ul class="tabs">');
        //this.$panels = $('<div class="tabsPanels">');
        this.buildDom();
    }
    //ikony do dodania
    buildDom() {
        this.$dom
            .append('<div class="col s12"')//.children()
            .append(this.$tabs);
        this.$dom.append(this.$panels);
        for (var i = 0; i < this.tabsData.length; i++) {
            var $link = $('<a>');
            $link.html(this.tabsData[i].name);
            this.$tabs
                .append('<li class="tab col s3">').children()
                .append($link);

            (this.contentIFrameId) ? this.makeTabIframe($link, i) : this.makeTabDiv($link, i);


        }
        var _this = this;
        this.$tabs.tabs();
        this.$tabs.on('click', 'a', function (e) {
            _this.tabChosen($(this).closest('li'));
        });

        //this.$dom.tabs({onShow: function(){_this.tabChosen($(this).closest('li'))}});

    }

    makeTabIframe($link, i) {
        $link.attr('href', 'tab_' + this.tabsData[i].url);
    }

    makeTabDiv($link, i) {
        var divId = 'tab_' + this.tabsData[i].name.replace(/ /g, "-") + '-' + this.id;
        var $tabPanel = $('<div id="' + divId + '" class="col s12">')
        $tabPanel.append(this.tabsData[i].panel);
        $link.attr('href', '#' + divId);
        this.$dom.append($tabPanel);
        //if(i==1){
        //    this.$dom.find('.tabs').tabs('select_tab', divId);
        //}
    }

    tabChosen($tab) {
        if (this.contentIFrameId)
            $('#' + this.contentIFrameId)
                .attr('src', this.tabsData[$tab.index()].url);
        else {

        }
    }
}

class Form {
    constructor(id, method, elements, noRows = false, submitCaption = 'Zapisz') {
        this.id = id;
        this.method = method;
        this.elements = elements;
        this.noRows = noRows;
        this.submitCaption = submitCaption;
        this.$dom;
        this.buidDom();
        this.dataObject //do refactoringu w przyszłości przenieść tu obsługę SubmitRrigger() z modali

    }

    buidDom() {
        this.$dom = $('<form id="' + this.id + '" method="' + this.method + '">');
        for (const element of this.elements) {
            var $inputDescription = '';
            if (element.description)
                $inputDescription = $('<span class="envi-input-description">' + element.description + '</span>')
            var $inputContainer = $('<div>')
            if (!this.noRows)
                $inputContainer.addClass('row');
            this.$dom.append($inputContainer);
            $inputContainer
                .append($inputDescription)
                .append(element.input.$dom);
        }
        this.$dom.append(FormTools.createSubmitButton(this.submitCaption));

        if (this.noRows) {
            let $tmpDom = this.$dom;
            this.$dom = $('<div class="row">');
            this.$dom.append($tmpDom);
        }
    }
    /*
     * Ustawia opis elementu formularza
     * @param {String} description
     * @param {FormElement} element
     * @returns {undefined}
     */
    setElementDescription(description, element) {
        var $descriptionLabel = element.input.$dom.parent().find('.envi-input-description')
        if ($descriptionLabel.length == 0) {
            $descriptionLabel = $('<div class="envi-input-description">');
            element.input.$dom.parent().prepend($descriptionLabel);
        }
        $descriptionLabel.html(description);
    }
    /*
     * używane przy edycji modala
     * @param {Array [connectedRepositryCurrentItemValues]} currentItem
     * @returns {undefined}
     */
    fillWithData(currentItem) {
        //określ ile maksymalnie może być elementów do wypełnienia
        var inputElements = Math.min(this.elements.length, Object.keys(currentItem).length);

        for (var i = 0; i < inputElements; i++) {
            var inputvalue = currentItem[this.elements[i].dataItemKeyName];
            switch (this.elements[i].input.constructor.name) {
                case 'InputTextField':
                    //this.elements[i].input.$dom.children('input').val(inputvalue);
                    this.elements[i].input.setValue(inputvalue);
                    break;
                case 'ReachTextArea':
                    if (!inputvalue) inputvalue = '';
                    tinyMCE.get(this.elements[i].input.id).setContent(inputvalue);
                    tinyMCE.triggerSave();
                    break;
                case 'DatePicker':
                    this.elements[i].input.setValue(inputvalue)
                    break;
                case 'SelectField':
                    this.elements[i].input.simulateChosenItem(inputvalue);
                    break;
                case 'AutoCompleteTextField':
                    this.elements[i].input.setValue(inputvalue);
                    break;
                case 'SelectFieldBrowserDefault':
                case 'CollapsibleSelect':
                case 'CollapsibleMultiSelect':
                    this.elements[i].input.simulateChosenItem(inputvalue);
                    break;
                case 'SwitchInput':
                case 'Chips':
                case 'HiddenInput':
                    this.elements[i].input.setValue(inputvalue);
            }
        }
        Materialize.updateTextFields();
    }
    //używane przy SubmitTrigger w Modalu
    validate(dataObject) {
        for (var i = 0; i < this.elements.length; i++) {
            var test;
            switch (this.elements[i].input.constructor.name) {
                case 'DatePicker':
                case 'SelectField':
                case 'HiddenInput':
                case 'FileInput':
                case 'CollapsibleSelect':
                case 'CollapsibleMultiSelect':
                    test = this.elements[i].input.validate(dataObject[this.elements[i].input.dataItemKeyName]);
                    if (!test) {
                        alert('Źle wypełnione pole "' + this.elements[i].input.name + '"');
                        return false;
                    }
                    break;
                default:
                    //w pozostałych przypadkach walidację zostawiamy dla natywnego HTML5
                    test = true;
            }
        }
        return test;
    }
    /*
     * Aktualizuje atrybuty edytowanego obiektu na podstawie pól formularza
     * @param {repositoryData} dataObject
     */
    async submitHandler(dataObject) {
        var i = 0;
        for (var i = 0; i < this.elements.length; i++) {

            switch (this.elements[i].input.constructor.name) {
                case 'InputTextField':
                case 'ReachTextArea':
                case 'TextArea':
                    //TODO: trzeba przenieść TextArea do odrębnej klasy, żeby to zadziałało
                    //$('#' + this.id + 'employerTextArea').val()
                    dataObject[this.elements[i].dataItemKeyName] = $('#' + this.elements[i].input.id).val();
                    break;
                case 'DatePicker':
                    dataObject[this.elements[i].dataItemKeyName] = Tools.dateDMYtoYMD($('#' + this.elements[i].input.id).val());
                    break;
                case 'SelectField':
                case 'SelectFieldBrowserDefault':
                    this.elements[i].input.getValue();
                    if (this.elements[i].input.chosenItem) {
                        if (typeof this.elements[i].input.chosenItem === 'object') {

                            dataObject[this.elements[i].dataItemKeyName] = this.elements[i].input.chosenItem;
                        }
                        else
                            dataObject[this.elements[i].dataItemKeyName] = this.elements[i].input.$dom.find('input').val();
                    }
                    break;
                case 'AutoCompleteTextField':
                    if (this.elements[i].input.chosenItem)
                        //jeżęli nic nie wybrano (pole puste przypisz pusty obiekt)
                        dataObject[this.elements[i].dataItemKeyName] = (this.elements[i].input.$dom.children('input').val()) ? this.elements[i].input.chosenItem : {};
                    break;
                case 'SwitchInput':
                case 'Chips':
                case 'HiddenInput':
                case 'FileInput':
                case 'CollapsibleSelect':
                case 'CollapsibleMultiSelect':
                    dataObject[this.elements[i].dataItemKeyName] = await this.elements[i].input.getValue();
                    break;

            }
        }
    }
}

class AtomicEditForm extends Form {
    constructor(id, method, elements, atomicEditLabel) {
        super(id, method, elements);
        if (this.elements[0].constructor.name !== 'ReachTextArea')
            this.$dom.children(':last-child').remove();
        this.dataObject = { editedParameter: '' };
        this.atomicEditLabel = atomicEditLabel;
        this.setSubmitAction();
        this.setCancelAction();
    }

    /*
     * Funkcja musi być przekazana joko argument, albo obsłużona w klasie pochodnej.
     * Klasa pochodna musi mieć metodę submitTrigger()
     * @param {function} submitTrigger
     */
    setSubmitAction(submitTrigger) {
        this.$dom.submit((event) => {
            this.submitTrigger();
            //(typeof submitTrigger  === 'function')? submitTrigger() : this.submitTrigger();
            // prevent default posting of form
            event.preventDefault();
        });
    }

    setCancelAction() {
        this.$dom.keyup((event) => {
            if (event.keyCode === 13) {
                this.$dom.submit();
            }
            if (event.keyCode === 27) {
                this.atomicEditLabel.switchOffEditMode();
            }
        });

        this.$dom.find('input').focusout((event) => {
            if (this.elements[0].constructor.name !== 'DatePicker')
                this.atomicEditLabel.switchOffEditMode();
        });

    }
    /*
     * Uruchamiana po kliknięciu przesłaniu formularza
     */
    submitTrigger() {
        this.submitHandler(this.dataObject);
        if (this.validate(this.dataObject)) {
            this.atomicEditLabel.caption = this.dataObject.editedParameter;
            this.atomicEditLabel.connectedResultsetComponent.connectedRepository.currentItem[this.atomicEditLabel.editedPropertyName] = this.dataObject.editedParameter;

            this.atomicEditLabel.connectedResultsetComponent.connectedRepository.editItem(this.atomicEditLabel.connectedResultsetComponent.connectedRepository.currentItem,
                this.atomicEditLabel.connectedResultsetComponent);
        }
    }
}

class AtomicEditLabel {
    /*
     * @param {String} caption
     * @param {this.connectedRepository.currentItem} dataObject
     * @param {type} input
     * @param {String} editedPropertyName
     * @param {Collection} connectedResultsetComponent
     * @returns {AtomicEditLabel}
     */
    constructor(caption, dataObject, input, editedPropertyName, connectedResultsetComponent) {
        this.caption = caption;
        this.dataObject = dataObject;
        this.editedPropertyName = editedPropertyName;
        this.connectedResultsetComponent = connectedResultsetComponent;
        this.input = input;
        this.buildStaticDom();
        this.$parent;
    }

    buildStaticDom() {
        if (this.caption) {
            this.$dom = $('<span>');
            this.$dom
                .html(this.caption + '<br>');
            this.setEditLabelAction();
        } else
            this.$dom = '';
    }

    buildEditModeDom() {
        this.$parent = this.$dom.parent();
        this.$parent.children('form').remove();
        this.$dom.remove();
        this.form = new AtomicEditForm("tmpEditForm_" + this.dataObject.id, "GET",
            [this.input], this);
        this.$dom = this.form.$dom;

        this.$dom.addClass('atomicEditForm');
    }
    /*
     * inicjuje i wyświetla formularz edycji pola
     */
    setEditLabelAction() {
        this.$dom.off('dblclick');
        var _this = this;
        this.$dom.dblclick(function (e) {
            //$(this).parent().parent().parent().parent().trigger('click');                                 
            _this.switchOnEditMode();
            _this.$dom.find('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 15, // Creates a dropdown of 15 years to control year,
                today: 'Dzisiaj',
                clear: 'Wyszyść',
                close: 'Ok11',
                closeOnSelect: false, // Close upon selecting a date,
                container: undefined, // ex. 'body' will append picker to body
                format: 'dd-mm-yyyy'
            });
            ReachTextArea.reachTextAreaInit();
            _this.form.fillWithData([_this.dataObject[_this.editedPropertyName]]);
            _this.$dom.find('input').focus();
        });

    }
    switchOnEditMode() {
        this.buildEditModeDom();
        this.$parent.append(this.$dom);
        $('select').material_select();
        Materialize.updateTextFields();


    }

    switchOffEditMode() {
        this.$dom.remove();
        this.buildStaticDom();
        this.$parent
            .append(this.$dom);
    }
}

class SwitchInput {
    constructor(onLabel, offLabel, changeAction, viewObject) {
        this.onLabel = onLabel;
        this.offLabel = offLabel;
        this.changeAction = changeAction;
        this.viewObject = viewObject;
        this.$dom = $('<div class="switch">');
        this.buildDom();
        this.setChangeAction();
        this.value;
    }

    buildDom() {
        this.$dom
            .append('<label>').children()
            .append(this.offLabel)
            .append('<input type="checkbox">')
            .append('<span class="lever">')
            .append(this.onLabel);
    }

    setChangeAction() {
        var _this = this;
        this.$dom.find("input[type=checkbox]").on("change", function () {
            _this.value = $(this).prop('checked');
            if (_this.changeAction)
                _this.changeAction.apply(_this.viewObject, [_this.value]);
        });

    }
    setValue(value) {
        this.value = value;
        this.$dom.find("input[type=checkbox]").prop('checked', value);
    }

    getValue() {
        return (this.value) ? true : false;
    }
}
/*
 * Używana w klasie FIlter jako domyślny komponent
 * @type type
 */
class FilterSwitchInput extends SwitchInput {
    constructor(onLabel, offLabel, connectedFilterObject) {
        super(onLabel, offLabel);
        this.connectedFilterObject = connectedFilterObject;
        this.$dom.find('input').attr('checked', (this.connectedFilterObject.showActiveRows) ? 'true' : 'false');
        this.value = (this.connectedFilterObject.showActiveRows) ? true : false;
    }

    setChangeAction() {
        var _this = this;
        this.$dom.find("input[type=checkbox]").on("change", function () {
            _this.value = $(this).prop('checked');
            _this.connectedFilterObject.changeFilterCriteriaHandler();
        });
    }
}
class Badge {
    constructor(id, caption, bgColor) {
        this.id = id;
        this.caption = caption;
        this.bgColor = bgColor;
        this.$dom = $('<span>');
        this.buidDom();
    }

    buidDom() {
        this.$dom
            .attr('id', 'badge_' + this.id)
            .attr('data-badge-caption', '')
            .addClass('new badge')
            .addClass(this.bgColor)
            .html(this.caption);
    }
}
//kopatybilny z FormTools_mcss1.0
class RaisedButton {
    constructor(caption, onClickFunction, viewObject) {
        this.caption = caption;
        this.onClickFunction = onClickFunction;
        this.viewObject = viewObject;
        this.$dom;
        this.buidDom();
    }
    buidDom() {
        this.$dom = $('<input>');
        this.$dom
            .attr('type', 'button')
            .attr('value', this.caption)
            .addClass('waves-effect waves-teal btn')

        this.$dom.click(() => this.onClickFunction.apply(this.viewObject, []));
    }

    setEnabled(enable) {
        let onClassName = (enable) ? 'enabled' : 'disabled';
        let offClassName = (enable) ? 'disabled' : 'enabled';
        this.$dom
            .addClass(onClassName)
            .removeClass(offClassName);
    }
}

class FlatButton extends RaisedButton {
    constructor(caption, onClickFunction, viewObject) {
        super(caption, onClickFunction, viewObject)
    }
    buidDom() {
        super.buidDom();
        this.$dom
            .removeClass('btn')
            .addClass('btn-flat');
    }
}

//kopatybilny z FormTools_mcss1.0
class IconButton {
    constructor(icon, onClickFunction, viewObject) {
        this.icon = icon;
        this.onClickFunction = onClickFunction;
        this.viewObject = viewObject;
        this.$dom;
        this.buidDom();
    }
    buidDom() {
        switch (this.icon) {
            case 'GD_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Drive-icon.png';
                break;
            case 'GD_DOCUMENT_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Docs-icon.png';
                break;
            case 'GD_SHEET_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Sheets-icon.png';
                break;
            case 'GGROUP_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Groups-icon.png';
                break;
            case 'GCALENDAR_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Calendar-icon.png';
                break;
            case 'ATTACH_FILE':
                this.icon = 'https://ps.envi.com.pl/Resources/View/attach-file-icon.png';
                break;
        }

        this.$dom = $('<a  target="_blank">');
        if (this.url) this.$dom.attr('href', this.url);
        var $img = $('<img height=21px>');
        $img.attr('src', this.icon);

        this.$dom.append($img);

        this.$dom.click(() => this.onClickFunction.apply(this.viewObject, []));
    }
}

class ExternalResourcesIconLink {
    constructor(icon, url) {
        if (!icon) throw new SyntaxError('Icon must be defined!');
        this.icon = icon;
        this.url = url;
        this.buidDom();
        this.$dom;
    }

    buidDom() {
        switch (this.icon) {
            case 'GD_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Drive-icon.png';
                break;
            case 'GD_DOCUMENT_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Docs-icon.png';
                break;
            case 'GD_SHEET_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Sheets-icon.png';
                break;
            case 'GGROUP_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Groups-icon.png';
                break;
            case 'GCALENDAR_ICON':
                this.icon = 'https://ps.envi.com.pl/Resources/View/Google-Calendar-icon.png';
                break;
            case 'ATTACH_FILE':
                this.icon = 'https://ps.envi.com.pl/Resources/View/attach-file-icon.png';
                break;
        }

        this.$dom = $('<a  target="_blank">');
        if (this.url) this.$dom.attr('href', this.url);
        var $img = $('<img height=21px>');
        $img.attr('src', this.icon);

        this.$dom.append($img);
    }
}

class FormTools {
    /* 
     * initiates a radio input
     * it must be wrapped in a HTML element named as #name argument
     * @repository {object} must have .id and .name attribute
     */

    static createRadioButtons(name, repository) {
        var options = repository.items;

        var radioButtons = $('<div></div>');

        for (var i = 0; i < options.length; i++) {
            var id = name + 'Option' + i + 1;
            var radioBtn = $('<p>' +
                '<input type="radio" name="' + name + '1" value="' + options[i].id + '" id="' + id + '" />' +
                '<label for="' + id + '">' + options[i].name + '</label>' +
                '</p>'
            );
            radioBtn.appendTo(radioButtons);
        }

        radioButtons.click = function () {
            alert($(this).val() + "ssssss");
            repository.currentItemId = $(this).val();
        };

        $("[name^=" + name + "]").click(function () {
            alert($(this).val());
            repository.currentItemId = $(this).val();
        });
        return radioButtons;
    }

    static createSubmitButton(caption) {
        var button = $('<Button class="btn waves-effect waves-light" name="action"></button>');
        button.append(caption);
        button.append('<i class="material-icons right">send</i>');
        return button;
    }
    static createEmailInputField(id, label, isRequired, maxCharacters, validateRegex, dataError) {
        var $emailInputField = FormTools.createInputField(id, label, isRequired, maxCharacters)
        $emailInputField.children('input').attr('type', 'email');
        return $emailInputField;
    }

    static createInputField(id, label, isRequired, maxCharacters, validateRegex, dataError) {
        var $textField = $('<div class="input-field">');
        var $input = $('<input type="text" class="validate" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="' + id + '">' + label + '</label>');
        $textField
            .append($input)
            .append($label);
        if (isRequired)
            $input.attr('required', 'true')

        if (maxCharacters > 0) {
            $input
                .attr('data-length', maxCharacters);
            $input.characterCounter();
        }
        if (validateRegex !== undefined) {
            $input
                .attr('pattern', validateRegex);
        }

        if (dataError !== undefined)
            $label.attr('data-error', dataError);
        else
            $label.attr('data-error', 'Niewłaściwy format danych');

        return $textField;
    }

    static createTextArea(id, label, isRequired, maxCharacters, dataError) {
        var $textArea = $('<div class="input-field">');
        var $input = $('<textarea class="materialize-textarea validate" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="' + id + '">' + label + '</label>');
        $textArea
            .append($input)
            .append($label);
        if (isRequired)
            $input.attr('required', 'true')

        if (maxCharacters > 0) {
            $input
                .attr('data-length', maxCharacters);
            $input.characterCounter();
        }

        if (dataError !== undefined)
            $label.attr('data-error', dataError)
        else
            $label.attr('data-error', 'Wpisany tekst jest za długi')

        return $textArea;
    }
    //kopatybilny z FormTools_mcss1.0 
    static createFlatButton(caption, onClickFunction, viewObject) {
        var $button = $('<input type="button" ' +
            'value="' + caption + '" ' +
            'class="waves-effect waves-teal btn-flat"' +
            '/>');
        $button.click(function () { onClickFunction.apply(viewObject, []) });
        return $button;
    }
    static createModalTriggerIcon(id, icon) {
        var $triggerIcon = $('<span>');
        $triggerIcon
            .attr('data-target', id)
            .addClass('collectionItemEdit modal-trigger');
        $triggerIcon
            .append('<span>').children()
            .addClass('material-icons')
            .html(icon);
        //'<span data-target="' + this.projectDetailsCollection.editModal.id + '" class="collectionItemEdit modal-trigger"><i class="material-icons">edit</i></span>'
        return $triggerIcon;
    }
}