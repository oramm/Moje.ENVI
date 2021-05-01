class GAuth2 {
  constructor() {
    this.userEmail;
    this.initParams = {
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES,
      immediate: false
    };
  }

  /**
   *  On load, called to load the auth2 library and API client library on the main window.
   */
  handleClientLoadMainWindow() {
    gapi.load('client:auth2', () => this.initClientMainWindow(this));
  }

  /**
   *  On load, called to load the auth2 library and API client library on sub windows.
   *  Wywoływana na końcu sekcji body właściwego pliku index.html
   *  @param {object} windowControler zawiera funkcję main() z logiką inijcjowania repozytoriów
   */
  handleClientLoad(windowController) {
    gapi.load('client:auth2', () => this.initClient(this, windowController));
  }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  initClientMainWindow(_this) {
    (_this == undefined) ? _this = this : true;
    gapi.client.init(_this.initParams).then(() => {
      // Listen for sign-in state changes.
      gapi.auth2.getAuthInstance().isSignedIn.listen(_this.updateSigninStatus);

      // Handle the initial sign-in state.
      _this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      //authorizeButton.onclick = handleAuthClick;
      // signoutButton.onclick = handleSignoutClick;
    });
  }

  initClient(_this, windowController) {
    (_this == undefined) ? _this = this : true;
    gapi.client.init(_this.initParams).then(
      () => {
        user = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        windowController.main();
      }
    );
  }

  /**
   *  Called only in main Window
   *  Called when the signed in status changes, to update the UI
   *  appropriately. After a sign-in, the API is called.
   */
  updateSigninStatus(isSignedIn) {
    var _this = this;
    if (isSignedIn) {
      var mainController = new MainController();

      _this.onSignIn(gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile())
      mainController.main();
      //personRolesController = new PersonRolesController();
      //personRolesController.main();
    } else {
      $("#content").hide();
      $("#authorize-div").show();
      //Button for the user to click to initiate auth sequence
      var loginButton = new RaisedButton('Zaloguj się', () => _this.handleAuthClick(event)).$dom;
      $("#authorize-div .row").append(loginButton);

      //signoutButton.style.display = 'none';
    }
  }
  /*
   * https://developers.google.com/identity/sign-in/web/sign-in
   * @param {type} googleUser - gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile()
   */
  onSignIn(googleUser) {
    console.log('ID: ' + googleUser.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + googleUser.getName());
    console.log('Image URL: ' + googleUser.getImageUrl());
    console.log('Email: ' + googleUser.getEmail()); // This is null if the 'email' scope is not present.

    this.userName = googleUser.getName();
    this.userEmail = googleUser.getEmail();
    this.userGoogleImage = googleUser.getImageUrl();

  }

  /**
   *  Sign in the user upon button click.
   */
  handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn()
      //dodano na podsktawie:https://stackoverflow.com/questions/45624572/detect-error-popup-blocked-by-browser-for-google-auth2-in-javascript
      .then(() => { }, error => {
        if (error)
          alert('Odblokuj wyskakujące okienko, żeby się zalogować (w pasku adresu na górze)\n\n' +
            'Ten komunikat wyświetla z jednej z poniższych przyczyn:\n' +
            ' 1. Wylogowałeś(łaś) się konta Google\n' +
            ' 2. System został gruntownie zaktualizowany i wymaga Twoich zgód aby Ci nadal służyć')
      });
  }

  /**
   *  Sign out the user upon button click.
   */
  handleSignoutClick(event) {
    alert("pa pa");
    gapi.auth2.getAuthInstance().signOut();
  }
}