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
        $('input.autocomplete').autocomplete({
        //this.$dom.children('input.autocomplete').autocomplete({
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

class FormTools{
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
}