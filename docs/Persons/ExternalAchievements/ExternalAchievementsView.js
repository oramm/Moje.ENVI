class ExternalAchievementsView extends Popup {
    constructor(){
        super();
    }
    initialise(){
        return new Promise((resolve, reject) => {
            this.externalAchievementsCollection = new ExternalAchievementsCollection('externalAchievementsCollection');
            this.setTittle("Doświadczenie spoza ENVI");

            $('#actionsMenu').after(this.externalAchievementsCollection.$dom);
            this.dataLoaded(true);
            resolve('ExternalAchievementsView ok');
        })
    }
    
    actionsMenuInitialise(){
    }
}