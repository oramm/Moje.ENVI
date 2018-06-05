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

