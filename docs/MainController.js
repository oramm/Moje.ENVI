class MainController {
    async main() {
        // Hide auth UI, then load client library.
        mainWindowView = new MainWindowView();
        $("#authorize-div").hide();
        mainWindowView.dataLoaded(false);
        mainWindowView.initialise();
        mainWindowView.dataLoaded(true);
        sessionStorage.setItem('Current User', JSON.stringify({
            name: gAuth.userName,
            surname: '',
            systemEmail: gAuth.userEmail,
            googleImage: gAuth.userGoogleImage
        })
        );
    }
}