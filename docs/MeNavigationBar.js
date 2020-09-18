class MeNavigationBar extends NavigationBar {
  constructor(parentViewObject) {
    super('Moje ENVI', parentViewObject)

    this.addNewHref = 'https://docs.google.com/forms/d/e/1FAIpQLSd6H8zXQwsKmVIxia6hTlv03Hhz6Ae7GvIUV-PDm4If5BqVXQ/viewform'
    $(document).ready(this.initialise());
  }

  initialise() {
    super.initialise();
    this.initialiseMenuItems();
  }

  initialiseMenuItems() {
    this.menuItems = [{
      caption: "Podmioty",
      link: 'Entities/entities.html'
    },
    {
      caption: "Kontakty",
      link: 'Persons/persons.html'
    },
    {
      caption: "Doświadczenie osób",
      link: 'Persons/ExternalAchievements/externalAchievements.html'
    },
    {
      caption: "Pojazdy i sprzęt",
      link: 'Inventory/Inventory.html'
    },
    {
      caption: "Witryna projektów",
      link: 'https://ps.envi.com.pl/'
    }
    ];
    this.addMenuItems($('#main-nav ul'));
    this.addMenuItems($('#mobile-demo'));
  }

  menuItemClickHandler(link) {
    if (link.includes('http'))
      window.open(link, 'link');
    else
      this.parentViewObject.loadIframe("iframeMain", link);
  }
}