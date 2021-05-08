class SearchNavigationBar {
    constructor(id) {
        this.id = id;

        var $nav = $('<nav class="green lighten-3">');
        $nav
            .append('<div class="nav-wrapper">').attr('id', this.id).children()
            .append('<form>').children()
            .append('<div class="input-field"></div>').children()
            .append('<i class="material-icons prefix">search</i>')
            .append('<input name="projectPicker" type="search" id="autocomplete-input" class="autocomplete" autocomplete="off" required>')
            //.append('<label class="label-icon" for="autocomplete-input"><i class="material-icons">search</i></label>')
            .append('<label for="autocomplete-input">Wybierz projekt</label>')
            .append('<i class="material-icons">close</i>');

        return $nav;
    }
}