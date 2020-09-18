class MainController {
    main() {
        // Hide auth UI, then load client library.
        mainWindowView = new MainWindowView();
        $("#authorize-div").hide();
        mainWindowView.dataLoaded(false);
        mainWindowView.initialise();
        mainWindowView.dataLoaded(true);
    }
}