class MeNavigationBar extends NavigationBar {
    constructor(parentViewObject){
        super('Moje ENVI', parentViewObject)
        
        this.addNewHref = 'https://docs.google.com/forms/d/e/1FAIpQLSd6H8zXQwsKmVIxia6hTlv03Hhz6Ae7GvIUV-PDm4If5BqVXQ/viewform'
        $( document ).ready(this.initialise());
    }
    
    initialise(){        
        super.initialise();
        this.initialiseMenuItems();
    }
    
    initialiseMenuItems(){
        this.menuItems = [{ caption: "Podmioty", 
                            link: 'Entities/entities.html'
                          },
                          { caption: "Kontakty", 
                            link: 'Persons/persons.html'
                          },
                          { caption: "Doświadczenie osób", 
                            link: 'Persons/ExternalAchievements/externalAchievements.html'
                          }
                         ];
        this.addMenuItems($('#main-nav ul'));
        this.addMenuItems($('#mobile-demo'));
    }
      
    menuItemClickHandler(link){
        this.parentViewObject.loadIframe("iframeMain", link);
    }
}