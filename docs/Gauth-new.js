class GAuth {
    static async mainWindowInitialise() {
        await google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: this.mainWindowLoadHandler,
            //login_uri: MainSetup.serverUrl + 'login'
        });

        // Display the One Tap prompt
        google.accounts.id.prompt();

        // Display the Sign In With Google Button
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            { theme: 'outline', size: 'large' }
        );
    }

    static async mainWindowLoadHandler(response) {
        console.log("Encoded JWT ID token: %o", response);

        try {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            let result = await fetch(MainSetup.serverUrl + 'login', {
                method: 'POST',
                headers: myHeaders,
                credentials: 'include',
                body: JSON.stringify({ id_token: response.credential })
            })
            result = await result.text();

            console.log(result)
            MainSetup.currentUser = JSON.parse(result).userData;
            console.log('Name: ' + MainSetup.currentUser.name);
            console.log('Email: ' + MainSetup.currentUser.systemEmail); // This is null if the 'email' scope is not present.
            MainController.main();
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    }

    /**
     *  On load, called to load the auth2 library and API client library on sub windows.
     *  Wywoływana na końcu sekcji body właściwego pliku index.html
     *  @param {object} windowControler zawiera funkcję main() z logiką inijcjowania repozytoriów
     */
    static async handleClientLoad(windowController) {
        windowController.main();
    }
}