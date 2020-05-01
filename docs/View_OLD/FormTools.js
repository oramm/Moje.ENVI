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
        this.isRequired = false;
        
        this.pushData(this.key); 
    }
    
    createAutoCompleteTextField(id, label, icon, isRequired){
        this.$dom = $('<div class="input-field">');
        var $icon = $('<i class="material-icons prefix">' + icon + '</i>');
        var $input = $('<input name="' + id + '" type="text" class="autocomplete" autocomplete="off">')
                .attr('id',id)
        
        var $label = $('<label for="'+ id +'">'+ label +'</label>');

        if (isRequired) {
            $input
                .attr('required','true')
                .attr('pattern','[]');
            this.isRequired = true;
        }
        
        this.$dom
            .append($icon)
            .append($input)
            .append($label);
        return this.$dom;
    }
    
    pushData(key){
        var autocompleteList = {};
        var _this = this;
        Object.keys(this.objectList).forEach((id) => {
                    _this;
                    autocompleteList[this.objectList[id][key]] = null;
                });
        // Plugin initialization
        this.$dom.children('input.autocomplete').autocomplete({
           data: autocompleteList,
           limit: 20, // The max amount of results that can be shown at once. Default: Infinity.
           onAutocomplete: (inputValue) => {
                                this.setChosenItem(inputValue);
                                if (typeof this.onCompleteCallBack === "function") { 
                                    this.onCompleteCallBack.apply(this.viewObject,[inputValue]);
                                }
                            },
           minLength: 1 // The minimum length of the input for the autocomplete to start. Default: 1.
             });
        }

    setChosenItem(inputValue){
            this.chosenItem = search(inputValue, this.key, this.repository.items);
            this.repository.selectedItem = this.chosenItem;
            if (this.chosenItem !== undefined) this.$dom.children('input').attr('pattern','^' + inputValue + '$')
            this.$dom.children('input').val(inputValue);
            
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
                                .attr('value',''+ i)
                                .text(optionsData[i]);
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
        
        //if (isRequired)
        //    $select.attr('required','true')
        return this.$dom;
    }
    setChosenItem(inputValue){
        var itemSelectedId = 2 + this.optionsData.indexOf(inputValue);
        this.$dom.find('li:nth-child('+itemSelectedId+')').click();
        this.chosenItem = inputValue;
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
        //var $textArea;
        //$textArea = FormTools.createTextArea(this.id, this.label, this.isRequired);
        this.$dom = $('<div>');
        
        var $label = $('<label>'+ this.label +'</label>');
        var $textArea = $('<div class="input-field reachTextArea">');
        $textArea
            .attr('max_chars',this.maxCharacters);
        //var $input = $('<textarea id="' + this.id + '" name="' + this.id + '">');
        //$textArea
        //    .append($input);
        this.$dom
            .append($label)
            .append($textArea);
    
        
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
    
    checkDate() {
        var test = $('#' + this.id).val() != '';
        if (test === false) {
            this.$input.addClass('invalid');
        } else {
            this.$input.removeClass('invalid');
        }
        return test;
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
                repository.currentItemId = $(this).val();
                };
                
        $("[name^="+ name +"]").click(function() {
                alert($(this).val());
                repository.currentItemId = $(this).val();
                });
        return radioButtons;
    }

    static createForm(id, method){
        var form = $('<form id="'+ id +'" method="'+ method +'">');
        return form;
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
                .attr('pattern',validateRegex)            
        }

        if (dataError !== undefined) 
            $label.attr('data-error',dataError)
        else
            $label.attr('data-error','Niewłaściwy format danych')
        
        return $textField;
    }
    
    static createFilterInputField(id, $filteredObject){
        var $textField = this.createInputField(id, 'Filtruj listę');
        
        $textField.children().on("keyup", function() {
            var value = $(this).val().toLowerCase();
            $filteredObject.filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
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

    static createFlatButton(caption, onClickFunction){
        var $button = $('<input type="button" ' +
                               'value="' + caption  +'" ' + 
                               'class="waves-effect waves-teal btn-flat"' +
                        '/>');
        $button.click(onClickFunction);
        return $button;
    }

    static createRaisedButton(caption, onClickFunction){
        var $button = $('<input type="button" ' +
                               'value="' + caption  +'" ' + 
                               'class="waves-effect waves-teal btn"' +
                        '/>');
        $button.click(onClickFunction);
        return $button;
    }

    static appendButtonTo(parentNode, onClickFunction, value, className){
        var $input = $('<input type="button" ' +
                               'value="' + value  +'" ' + 
                               'class="' + className + '" ' +
                        '/>');
        $input.click(onClickFunction);

        $input.appendTo(parentNode);
    }
}