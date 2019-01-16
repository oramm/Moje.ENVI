/*
 * @type AutoCompleteTextField
 * Używać tego następująco:
 * 1. tworzymy obiekt
 * 2. dodajemy $dom do formularza
 * 3. wywołujemy initialise();
 */
class AutoCompleteTextField {
    constructor(id, label, icon, isRequired){
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.$dom;
      
        this.createAutoCompleteTextField(id, label, icon, isRequired);
    }
    
    initialise(repository, key, onCompleteCallBack,viewObject){
        this.repository = repository;
        this.objectList = repository.items;
        this.key=key;
        this.onCompleteCallBack = onCompleteCallBack;
        this.viewObject = viewObject;
        this.chosenItem;
        
        this.pushData(this.key); 
    }
    
    createAutoCompleteTextField(id, label, icon, isRequired){
        this.$dom = $('<div class="input-field">');
        var $icon = $('<i class="material-icons prefix">' + icon + '</i>');
        var $input = $('<input name="' + id + '" type="text" class="autocomplete" autocomplete="off">')
                .attr('id',id);
        
        var $label = $('<label for="'+ id +'">'+ label +'</label>');

        if (isRequired) {
            $input
                .attr('required','true')
                .attr('pattern','[]');
            this.isRequired = isRequired;
        }
        
        this.$dom
            .append($icon)
            .append($input)
            .append($label);
        return this.$dom;
    }
    
    pushData(key){
        var autocompleteList = {};
        Object.keys(this.objectList).forEach((id) => {
                    autocompleteList[this.objectList[id][key]] = null;
                });
        // Plugin initialization
        this.$dom.children('input.autocomplete').autocomplete({
           data: autocompleteList,
           limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
           onAutocomplete: (inputValue) => {
                                this.setChosenItem(inputValue);
                            },
           minLength: 1 // The minimum length of the input for the autocomplete to start. Default: 1.
             });
        }
    
    setChosenItem(inputValue){
        //inputValue pochodzi z formularza
        if (typeof inputValue !== 'object'){
            this.chosenItem = search(inputValue, this.key, this.repository.items);
            this.repository.currentItem = this.chosenItem;
            if (this.chosenItem) this.$dom.children('input').attr('pattern','^' + inputValue + '$');
            this.$dom.children('input').val(inputValue);
        }
        //inputValue pochodzi z repository i jest obiektem
        else {
            this.chosenItem = inputValue;
            //zakłądam, że oiekt posiada atrybut this.key
            inputValue = inputValue[this.key];
        }
        if (this.chosenItem) 
            this.$dom.children('input').attr('pattern','^' + inputValue + '$');
        this.$dom.children('input').val(inputValue);
        //this.onCompleteCallBack powinien być zadeklarowany w modalu
        if (typeof this.onCompleteCallBack === "function") { 
                                    this.onCompleteCallBack.apply(this.viewObject,[this.chosenItem]);
                                }
    }
}

class SelectField{
    /*
     * 
     * @param {type} id
     * @param {type} label
     * @param {type} icon
     * @param {type} isRequired
     * @returns {SelectField}
     */
    constructor(id, label, icon, isRequired){
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.chosenItem;
        this.$dom;
        this.$select;
        this.defaultDisabledOption = "Wybierz opcję";
        this.createSelectField(id, label, icon, isRequired);
    }
    
    initialise(optionsData, key){
        this.$select.empty();
        this.optionsData = optionsData;
        this.key=key;
        
        this.$select.append('<option value="" disabled selected>Wybierz opcję</option>');
        if(typeof optionsData[0] !== 'object')
            this.pushDataFromStringList();
        else 
            this.pushDataFromObjectsList();
        this.$dom.find('select').material_select();
        if (this.isRequired){
            var regex = new RegExp('^((?!' + this.defaultDisabledOption + ').)*$');
            this.$dom.find('input').attr('pattern', regex);
        }
        //var _this = this;
        //this.$dom.find('li').on("click",function(){_this.onItemChosen(this)});
    }
    //this.optionsData jest typu Object
    pushDataFromObjectsList(){
        for (var i=0; i<this.optionsData.length; i++){
            var $option = $('<option>')
                                .attr('value',''+ i)
                                .text(this.optionsData[i][this.key]);
            this.$select.append($option);
        }
    }
    
    pushDataFromStringList(){
        for (var i in this.optionsData){
            var $option = $('<option>')
                                .attr('value',''+ i)
                                .text(this.optionsData[i]);
            this.$select.append($option);
        }
    }
    createSelectField(id, label, icon, isRequired, options){
        this.$dom = $('<div class="input-field">');
        this.$select = $('<select>');
        var $label = $('<label>'+ label +'</label>');
        this.$dom
            .append(this.$select)
            .append($label);
        
        return this.$dom;
    }

    getChosenItem(){
        var inputValue = this.$dom.find('input').val();
        if(typeof this.optionsData[0] !== 'object'){
            
            //var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
            //this.$dom.find('li:nth-child('+itemSelectedId+')').click();
            this.chosenItem = inputValue;
            //---
        }
        else {
            //var optionsString = this.optionsData.map(item=>item[this.key]); 
            //var itemSelectedId = 2 + optionsString.indexOf(inputValue[this.key]);
            //this.$dom.find('li:nth-child('+itemSelectedId+')').click();
            this.chosenItem = this.optionsData.find(item=> item[this.key]==inputValue);
        }
    }
    
    simulateChosenItem(inputValue){
        if(typeof this.optionsData[0] !== 'object'){
            this.chosenItem = inputValue;
            var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
            //this.$dom.find('li:nth-child('+itemSelectedId+')').click();
        }
        else {
            this.chosenItem = this.optionsData.find(item=> item[this.key]==inputValue[this.key]);
            var optionsString = this.optionsData.map(item=>item[this.key]); 
            var itemSelectedId = 2 + optionsString.indexOf(inputValue[this.key]);
        }
        this.$dom.find('li:nth-child('+itemSelectedId+')').click();
    }
    
    validate(){
        if (this.isRequired)
            if(typeof this.optionsData[0] !== 'object')
                return this.chosenItem !== this.defaultDisabledOption;
            else 
                return this.chosenItem;
    }
} 

class ReachTextArea {
    constructor(id, label, isRequired, maxCharacters){
        this.id = id;
        this.label = label;
        this.isRequired = isRequired;
        this.maxCharacters = maxCharacters;
        this.createReachTextArea();
    }
    /*
     * Używać w klasie XxxxController po XxxxView.initilise()
     */
    static reachTextAreaInit(){
        tinymce.init({  selector: '.reachTextArea',
                        toolbar: 'undo redo | bold italic underline | outdent indent | link',
                        menubar: false,
                        forced_root_block : false,
                        statusbar: true,
                        plugins: "autoresize link",
                        autoresize_bottom_margin: 20,
                        autoresize_min_height: 30,
                        max_chars: 30,
                        branding: false,
                        setup: function (ed) {
                            var allowedKeys = [8, 37, 38, 39, 40, 46]; // backspace, delete and cursor keys
                            ed.on('keydown', function (e) {
                                if (allowedKeys.indexOf(e.keyCode) != -1) return true;
                                var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                                if ( $(ed.getBody()).text().length+1 > maxCharacters){
                                //if (ReachTextArea.tinymce_getContentLength() + 1 > this.settings.max_chars) {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    return false;
                                }
                                return true;
                            });
                            ed.on('keyup', function (e) {
                                var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                                ReachTextArea.tinymce_updateCharCounter(this, ReachTextArea.tinymce_getContentLength(),maxCharacters);
                            });
                        },
                        init_instance_callback: function () { // initialize counter div
                            var maxCharacters = $(tinyMCE.get(tinyMCE.activeEditor.id).getElement()).attr('max_chars');
                            $('#' + this.id).prev().append('<div class="char_count" style="text-align:right"></div>');
                            ReachTextArea.tinymce_updateCharCounter(this, ReachTextArea.tinymce_getContentLength(), maxCharacters);
                        },
                        paste_preprocess: function (plugin, args) {
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
     * Używać w klasie z formularzem (XxxxModal)
     * w funkcji fillWithData() użyć:
     *      tinyMCE.get(this.id + 'descriptionTextField').setContent(rolesRepository.currentItem.description);
     *      tinyMCE.triggerSave();
     */
    createReachTextArea(){
        this.$dom = $('<div>');
        var $input = $('<textarea class="materialize-textarea validate" id="' + this.id + '" name="' + this.id + '" >');
        var $label = $('<label>'+ this.label +'</label>');
        $label.addClass('active')
        
        this.$dom
            .append($label)
            .append($input);
    
        $input
            .attr('max_chars',this.maxCharacters)
            .addClass('reachTextArea')
            //.append($input);
    }
}

class SelectFieldBrowserDefault{
    /*
     * Sposób użycia: tworzymy nowy obiekt >> initialise >> w kontrolerze po zbudowaniu DOM >> ()=>{$('select').material_select();
     * @param {type} id
     * @param {type} label
     * @param {type} icon
     * @param {type} isRequired
     * @returns {SelectField}
     */
    constructor(id, label, icon, isRequired){
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.chosenItem;
        this.$dom;
        this.$select;
        this.createSelectField(id, label, icon, isRequired);
    }
    
    initialise(optionsData){
        this.$select.empty();
        if (optionsData===undefined) 
            optionsData = this.optionsData;
        else
            this.optionsData = optionsData;
        
        this.$select.append('<option value="" disabled selected>Wybierz opcję</option>')
        for (var i in optionsData){
            var $option = $('<option>')
                                .val(optionsData[i].name)
                                .text(optionsData[i].name);
            this.$select.append($option);
        }
        this.setChangeAction();
        
    }
    
    createSelectField(id, label, icon, isRequired, options){
        
        this.$select = $('<select class="browser-default">');
        this.$dom = $('<div>');
        var $label = $('<label>'+ label +'</label>');
        
        this.$dom
            .append($label)
            .append(this.$select)
          
        //if (isRequired)
        //    $select.attr('required','true')
        return this.$dom;
    }
    
    getChosenItem(){
        return this.chosenItem;
    }
    //uruchamiana na click
    setChosenItem(inputValue){
        this.chosenItem = search(inputValue, 'name', this.optionsData);
    }
    
    setChangeAction(){
        var _this=this;
        this.$select.change(function(){ _this.setChosenItem($(this).val());
                                      });
    }
    simulateChosenItem(inputValue){
        this.setChosenItem(inputValue);
        var itemSelectedId = this.optionsData.findIndex(x => x.hello === inputValue);
        //var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
        this.$dom.find('li:nth-child('+itemSelectedId+')').click();
        
    }
}

class DatePicker {
    constructor(id, label, icon, isRequired){
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.chosenDate;
        this.$dom;
        this.$input;
        this.createDatePickerField(id, label, icon, isRequired);
    }
    
    createDatePickerField(id, label, icon, isRequired){
        this.$dom = $('<div class="input-field">');
        this.$input = $('<input type="text" class="datepicker" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="'+ id +'">'+ label +'</label>');
        this.$dom
            .append(this.$input)
            .append($label);
        return this.$dom;
    }
    //https://stackoverflow.com/questions/30324552/how-to-set-the-date-in-materialize-datepicker
    setChosenDate(date){
        var $generatedInput = this.$input.pickadate()
    
        // Use the picker object directly.
        var picker = $generatedInput.pickadate('picker')
        picker.set('select', date, { format: 'yyyy-mm-dd' })
    }
    
    validate() {
        var test = $('#' + this.id).val() != '';
        if (test === false) {
            this.$input.addClass('invalid');
        } else {
            this.$input.removeClass('invalid');
        }
        return test;
    }
}
class InputTextField {
    constructor(id, label, icon, isRequired, maxCharacters, validateRegex, dataError){
        this.id = id;
        this.label = label;
        this.icon = icon;
        this.isRequired = isRequired;
        this.$dom;
        this.createInputField(id, label, icon, isRequired, maxCharacters, validateRegex, dataError);
    }
    //ikony do dodania
    createInputField(id, label, icon, isRequired, maxCharacters, validateRegex, dataError){
        this.$dom = $('<div class="input-field">');
        var $input = $('<input type="text" class="validate" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="'+ id +'">'+ label +'</label>');
        this.$dom
            .append($input)
            .append($label);
        if (isRequired)
            $input.attr('required','true');
      
        if (maxCharacters >0){
            $input
                .attr('data-length', maxCharacters);
            $input.characterCounter();
        }
        if (validateRegex){
            $input
                .attr('pattern',validateRegex);         
        }

        if (dataError !== undefined) 
            $label.attr('data-error',dataError);
        else
            $label.attr('data-error','Niewłaściwy format danych');
    }
}
class Tabs {
    constructor(initParameters){
        this.id = initParameters.id;
        this.swipeable = initParameters.swipeable;
        this.onShow = initParameters.onShow;
        this.responsiveThreshold = initParameters.responsiveThreshold;
        this.tabsData = initParameters.tabsData;
        this.$dom = $('<div class="row">');
        this.$tabs = $('<ul class="tabs">');
        this.$panels = $('<div class="tabsPanels">');
        this.buildDom();
    }
    //ikony do dodania
    buildDom(){
        this.$dom
            .append('<div class="col s12"').children()
                .append(this.$tabs);
        this.$dom.append(this.$panels);
        for (var i=0; i<this.tabs.length; i++){
            var $link = $('<a>');
            $link
                .attr('href','tab_'+this.tabsData[i].name)
                .html(this.tabsData[i].name);
            this.$tabs
                .append('<li class="tab col s3">').children()
                    .append($link);
            this.$panels.append('<div id="'+ this.tabsData[i].name + '" class="col s12">');
        }
        this.$tabs[0].children('a').addClass('active');
        //if(this.swipeable) this.$tabs.attr('id', "tabs-swipe-demo");
    }
}

class Form {
    constructor(id, method,elements){
        this.id = id;
        this.method = method;
        this.elements = elements;
        this.$dom;
        this.buidDom();
        this.dataObject //do refactoringu w przyszłości przenieść tu obsługę SubmitRrigger() z modali
    }
    
    buidDom(){
        this.$dom = $('<form id="'+ this.id +'" method="'+ this.method +'">');
        for (var i = 0; i<this.elements.length; i++){
            this.$dom
                    .append('<div class="row">').children(':last-child')
                        .append(this.elements[i].input.$dom);
        }
        this.$dom.append(FormTools.createSubmitButton("Zapisz"));
    }
    /*
     * używane przy edycji modala
     * @param {Array [connectedRepositryCurrentItemValues]} currentItem
     * @returns {undefined}
     */
    fillWithData(currentItem){
        for (var i =0; i < this.elements.length; i++){
            var inputvalue = currentItem[this.elements[i].dataItemKeyName];
            switch (this.elements[i].input.constructor.name) {
                case 'InputTextField' :
                    this.elements[i].input.$dom.children('input').val(inputvalue);
                    break;
                case 'ReachTextArea' :
                    if (!inputvalue) inputvalue='';
                    tinyMCE.get(this.elements[i].input.id).setContent(inputvalue);
                    tinyMCE.triggerSave();
                    break;
                case 'DatePicker' :
                    this.elements[i].input.setChosenDate(inputvalue)
                    break;
                case 'SelectField' :
                    this.elements[i].input.simulateChosenItem(inputvalue);
                    break;
                case 'AutoCompleteTextField' :
                    this.elements[i].input.setChosenItem(inputvalue);
                    break;
                case 'SelectFieldBrowserDefault' :
                    this.elements[i].input.simulateChosenItem(inputvalue);
                    break
            }
        }
        Materialize.updateTextFields();
    }
    //używane przy SubmitTrigger w Modalu
    validate(dataObject){
        for (var i =0; i < this.elements.length; i++){
            switch (this.elements[i].input.constructor.name) {
                case 'DatePicker' :
                case 'SelectField' :
                    return this.elements[i].input.validate(dataObject[this.elements[i].input.dataItemKeyName]);
                  
                default :
                    //w pozostałych przypadkach walidację zostawiamy dla natywnego HTML5
                    return true;
            }
        }
    }
    /*
     * Aktualizuje atrybuty edytowanego obiektu na podstawie pól formularza
     * @param {repositoryData} dataObject
     */
    submitHandler(dataObject){
        var i = 0;
        for (var i =0; i < this.elements.length; i++){

            switch (this.elements[i].input.constructor.name) {
                case 'InputTextField' : 
                case 'ReachTextArea' :
                case 'TextArea':
                    //TODO: trzeba przenieść TextArea do odrębnej klasy, żeby to zadziałało
                    //$('#' + this.id + 'employerTextArea').val()
                    dataObject[this.elements[i].dataItemKeyName] = $('#'+ this.elements[i].input.id).val();
                    break;
                case 'DatePicker' :
                    dataObject[this.elements[i].dataItemKeyName] = Tools.dateDMYtoYMD($('#'+ this.elements[i].input.id).val());
                    break;
                case 'SelectField' :
                case 'SelectFieldBrowserDefault' :
                    this.elements[i].input.getChosenItem();
                    if (typeof this.elements[i].input.chosenItem === 'object'){ 
                        
                        dataObject[this.elements[i].dataItemKeyName] =  this.elements[i].input.chosenItem; 
                    }
                    else
                        dataObject[this.elements[i].dataItemKeyName] =  this.elements[i].input.$dom.find('input').val();
                    break;
                case 'AutoCompleteTextField' :
                    if (this.elements[i].input.chosenItem) 
                        dataObject[this.elements[i].dataItemKeyName] =  this.elements[i].input.chosenItem;
                    break;
            }
        }
    }
}

class AtomicEditForm extends Form {
    constructor(id, method, elements, atomicEditLabel){
        super(id, method, elements);
        if(this.elements[0].constructor.name !== 'ReachTextArea')
            this.$dom.children(':last-child').remove();
        this.dataObject = {editedParameter: ''};
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
            if(this.elements[0].constructor.name !== 'DatePicker')
                this.atomicEditLabel.switchOffEditMode();
        });
        
    }
    /*
     * Uruchamiana po kliknięciu przesłaniu formularza
     */
    submitTrigger(){
        this.submitHandler(this.dataObject);
        if (this.validate(this.dataObject)){    
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
    constructor(caption, dataObject, input, editedPropertyName, connectedResultsetComponent){
        this.caption = caption;
        this.dataObject = dataObject;
        this.editedPropertyName = editedPropertyName;
        this.connectedResultsetComponent = connectedResultsetComponent;
        this.input = input;
        this.buildStaticDom();
        this.$parent;
    }
    
    buildStaticDom(){
        this.$dom = $('<span>');
        this.$dom
            .html(this.caption+'<br>');
        this.setEditLabelAction();
    }
    
    buildEditModeDom(){
        this.$parent = this.$dom.parent(); 
        this.$parent.children('form').remove();
        this.$dom.remove();
        this.form = new AtomicEditForm("tmpEditForm_"+ this.dataObject.id, "GET", 
                        [this.input], this);
        this.$dom = this.form.$dom;

        this.$dom.addClass('atomicEditForm');          
    }
    /*
     * inicjuje i wyświetla formularz edycji pola
     */
    setEditLabelAction(){
        this.$dom.off('dblclick');
        var _this = this;
        this.$dom.dblclick(function(e) { 
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
    switchOnEditMode(){
        this.buildEditModeDom();
        this.$parent.append(this.$dom);
        $('select').material_select();
        Materialize.updateTextFields();
                                            
        
    }
    
    switchOffEditMode(){
        this.$dom.remove();
        this.buildStaticDom();
        this.$parent
            .append(this.$dom);
    }
}

class switchInput{
    constructor(onLabel, offLabel){
        this.onLabe = onLabel;
        this.offLabel = offLabel;
        this.$dom;
        this.$label;
    }
    
    buildDom(){
        this.$dom = $('<div class="switch">');
        this.$dom
            .append(this.$label);
        this.$label
            .append('this.onLabel')
            .append('<input type="checkbox">')
            .append('<span class="lever">')
            .append('this.offLabel');
    }
}

class FormTools{    
    /* 
     * initiates a radio input
     * it must be wrapped in a HTML element named as #name argument
     * @repository {object} must have .id and .name attribute
     */
    
    static createRadioButtons(name, repository){
        var options = repository.items;
        
        var radioButtons = $('<div></div>');
        
        for (var i = 0; i < options.length; i++) {
            var id = name + 'Option' + i+1;
            var radioBtn = $('<p>' +
                                '<input type="radio" name="' + name + '1" value="' + options[i].id + '" id="' + id + '" />' +
                                '<label for="' + id + '">' + options[i].name + '</label>' +
                            '</p>'
                            );
            radioBtn.appendTo(radioButtons);
        }
        
        radioButtons.click = function() {
                alert($(this).val()+ "ssssss");
                repository.selectedItemId = $(this).val();
                };
                
        $("[name^="+ name +"]").click(function() {
                alert($(this).val());
                repository.selectedItemId = $(this).val();
                });
        return radioButtons;
    }

    static createSubmitButton(caption){
        var button = $('<Button class="btn waves-effect waves-light" name="action"></button>');
        button.append(caption);
        button.append('<i class="material-icons right">send</i>');
        return button;
    }
    static createEmailInputField(id, label, isRequired, maxCharacters, validateRegex, dataError){
        var $emailInputField = FormTools.createInputField(id, label, isRequired, maxCharacters)
        $emailInputField.children('input').attr('type','email');
        return $emailInputField;
    }
    
    static createInputField(id, label, isRequired, maxCharacters, validateRegex, dataError){
        var $textField = $('<div class="input-field">');
        var $input = $('<input type="text" class="validate" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="'+ id +'">'+ label +'</label>');
        $textField
            .append($input)
            .append($label);
        if (isRequired)
            $input.attr('required','true')
      
        if (maxCharacters >0){
            $input
                .attr('data-length', maxCharacters);
            $input.characterCounter();
        }
        if (validateRegex !== undefined){
            $input
                .attr('pattern',validateRegex)   ;         
        }

        if (dataError !== undefined) 
            $label.attr('data-error',dataError);
        else
            $label.attr('data-error','Niewłaściwy format danych');
        
        return $textField;
    }
    
    static createFilterInputField(id, $filteredObject){
        var $textField = this.createInputField(id, 'Filtruj listę');
        
        $textField.children('input').on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $filteredObject.filter(function() {
                //https://stackoverflow.com/questions/3041320/regex-and-operator?noredirect=1&lq=1
                //var regex = /^(?=.*my)(?=.*word).*$/igm;
                //var words = value.split(' ');
                //console.log(words);
                //return regex.test($(this).toggle($(this).text().toLowerCase()));
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
            });
        });
        
        return $textField;
    }
    
    static createTextArea(id, label, isRequired, maxCharacters, dataError){
        var $textArea = $('<div class="input-field">');
        var $input = $('<textarea class="materialize-textarea validate" id="' + id + '" name="' + id + '">');
        var $label = $('<label for="'+ id +'">'+ label +'</label>');
        $textArea
            .append($input)
            .append($label);
        if (isRequired)
            $input.attr('required','true')
      
        if (maxCharacters >0){
            $input
                .attr('data-length', maxCharacters);
            $input.characterCounter();
        }

        if (dataError !== undefined) 
            $label.attr('data-error',dataError)
        else
            $label.attr('data-error','Wpisany tekst jest za długi')
        
        return $textArea;
    }

    static createFlatButton(caption, onClickFunction,viewObject){
        var $button = $('<input type="button" ' +
                               'value="' + caption  +'" ' + 
                               'class="waves-effect waves-teal btn-flat"' +
                        '/>');
        $button.click(function() {onClickFunction.apply(viewObject,[])});
        return $button;
    }

    static createRaisedButton(caption, onClickFunction,viewObject){
        var $button = $('<input type="button" ' +
                               'value="' + caption  +'" ' + 
                               'class="waves-effect waves-teal btn"' +
                        '/>');
        
        $button.click(onClickFunction.apply(viewObject,[]));
        return $button;
    }
    static createModalTriggerIcon(id, icon){
        var $triggerIcon = $('<span>');
        $triggerIcon
            .attr('data-target',id)
            .addClass('collectionItemEdit modal-trigger');
        $triggerIcon
            .append('<span>').children()
            .addClass('material-icons')
            .html(icon);
        //'<span data-target="' + this.projectDetailsCollection.editModal.id + '" class="collectionItemEdit modal-trigger"><i class="material-icons">edit</i></span>'
        return $triggerIcon;
    }
}