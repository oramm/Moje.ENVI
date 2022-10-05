class GApi {
    /**
     * Callback after api.js is loaded.
     */
    static gapiLoadedHandler() {
        gapi.load('client', this.initialise);
    }

    /**
     * Callback after the API client is loaded. Loads the
     * discovery doc to initialize the API.
     */
    static async initialise() {
        try {
            await gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS,
            });

            console.log('discovery document loaded');
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Callback after Google Identity Services are loaded.
     * @gapiFunction - co wykonać po inicjalizacji
     */
    static gapiLoaded() {
        MainSetup.GApi.tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            prompt: '',
            callback: ''//zdefiniowny w this.#tokenCallback(gapiFunction) 
        });

        MainSetup.GApi.tokenClient.requestAccessToken({ prompt: '' })
    }

    static isAccesTokenValid() {
        if (!MainSetup.GApi.tokenClient)
            throw new Error('gapi not loaded');

        if (gapi === undefined)
            return false;
        const token = gapi.client.getToken();
        if (!token) return false;

        return true;
    }

    static refreshAccesToken() {
        console.log('refreshing acces token');
        // Re-entrant function to request user consent.
        // Returns an access token to the callback specified in google.accounts.oauth2.initTokenClient
        MainSetup.GApi.tokenClient.requestAccessToken({ prompt: '' });
    }

    /**
     *  Sign out the user upon button click.
     */
    static signoutHandler() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token);
            gapi.client.setToken('');
        }
    }
}