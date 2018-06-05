class NavigationBar {
    constructor(tittle, parentViewObject){
        this.parentViewObject = parentViewObject;
        this.tittle = tittle;
    }
    
    /*
     * Musi być wywołana w klasie pochodnej 
     */
    initialise(){
        this.$mainNavDom = $('<nav class="green darken-1">');
        this.$sideNavDom = $('<ul class="sidenav" id="mobile-demo">');
        $('#content').prepend(this.$sideNavDom);
        $('#content').prepend(this.$mainNavDom);
        $('nav').append('<div class="nav-wrapper" id="main-nav">');
        $('.nav-wrapper')
            .append('<a href="#!" class="brand-logo">'+ this.tittle +'</a>')
            .append('<a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>')
            .append('<ul class="right hide-on-med-and-down">');
                
        $(".sidenav").sidenav(); //funkcja z css Materialise
    }
    
    addMenuItems($element){
        $element.empty();
        for (var i =0; i<this.menuItems.length;i++) {
            $element.append('<li>').children(':last')
                    .append('<a>').children(':last')
                    .attr("link", this.menuItems[i].link)
                    .html(this.menuItems[i].caption);
        }
        this.menuItemSetClickAction();
    }
    
    menuItemSetClickAction(){
        this.$mainNavDom.find("li > a").off('click');
        this.$sideNavDom.find("li > a").off('click');
        var _this = this;
        this.$mainNavDom.find("li > a").click(function() {   
                                            //_this.$dom.find(".collection-item").attr("class", "collection-item avatar");
                                            //$(this).attr("class", "collection-item avatar active");
                                            _this.menuItemClickHandler($(this).attr("link"));
                                        });
        this.$sideNavDom.find("li > a").click(function() {   
                                            //_this.$dom.find(".collection-item").attr("class", "collection-item avatar");
                                            //$(this).attr("class", "collection-item avatar active");
                                            _this.menuItemClickHandler($(this).attr("link"));
                                        });
    }
    /*
     * @this.addNewHref musi być zaimplenetowana w klasie pochodnej
     */
    halfwayButton(){
        var $button = $('<a class="btn-floating btn-large halfway-fab waves-effect waves-light teal">')
                .attr('href', this.addNewHref)
                .attr('target', '_blank')
                .append('<i class="material-icons">add</i>');
        return $button;
      }
}

class MenuItem{
    constructor(caption, link){
        this.caption = caption;
        this.link = link;
    }
}