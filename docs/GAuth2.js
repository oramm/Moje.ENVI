class GAuth2 {
    constructor(){
        this.initParams = {
                            discoveryDocs: DISCOVERY_DOCS,
                            clientId: CLIENT_ID,
                            scope: SCOPES
                          };
    }

    /**
     *  On load, called to load the auth2 library and API client library on the main window.
     */
    handleClientLoadMainWindow() {
          gapi.load('client:auth2', ()=> this.initClientMainWindow(this));
    }

    /**
     *  On load, called to load the auth2 library and API client library on sub windows.
     *  Wywoływana na końcu sekcji body właściwego pliku index.html
     *  @param {object} windowControler zawiera funkcję main() z logiką inijcjowania repozytoriów
     */
    handleClientLoad(windowController) {
          gapi.load('client:auth2', ()=> this.initClient(this, windowController));
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    initClientMainWindow(_this) {
      (_this==undefined)? _this=this: true;
      gapi.client.init(_this.initParams).then(()=> {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);

        // Handle the initial sign-in state.
        _this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        //authorizeButton.onclick = handleAuthClick;
       // signoutButton.onclick = handleSignoutClick;
      });
    }

    initClient(_this,windowController) {
      (_this==undefined)? _this=this: true;
      gapi.client.init(_this.initParams).then(
        () => {windowController.main();}
        );
    }

    /**
     *  Called only in main Window
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            var mainController = new MainController();
            mainController.main();

            //personRolesController = new PersonRolesController();
            //personRolesController.main();
          } else {
                $("#content").hide();
                $("#authorize-div").show();
                //Button for the user to click to initiate auth sequence
                var newMilestoneButton = FormTools.createRaisedButton('Zaloguj się', ()=> this.handleAuthClick(event) );
                $("#authorize-div .row").append(newMilestoneButton);
                
            
                //signoutButton.style.display = 'none';
          }
    }

    /**
     *  Sign in the user upon button click.
     */
    handleAuthClick(event) {
      gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    handleSignoutClick(event) {
        alert("pa pa");
      gapi.auth2.getAuthInstance().signOut();
    }
}