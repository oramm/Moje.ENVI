// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
//var CLIENT_ID = '336752284630-tljneqr745b11tuq65ktmlhnbedrph4j.apps.googleusercontent.com';
var CLIENT_ID = '386403657277-21tus25hgaoe7jdje73plc2qbgakht05.apps.googleusercontent.com'; //ENVI
//var CLIENT_ID = '369663686128-0q4ccc4crukqi6cg4iinr078k0tf6253.apps.googleusercontent.com'; /// przykłąd
var SCRIPT_ID = 'M1jCQxOsMBQ_tbMmqjqqAx23ed1cy4zrK'; //ENVI
//var SCRIPT_ID = 'M4-wFm_LvxywxkhpIO4s4WZxZ-kvETMHy'; /// przykłąd

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://script.googleapis.com/$discovery/rest?version=v1"];


// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.

SCOPES = 'https://www.google.com/calendar/feeds ' +
    //'https://www.googleapis.com/auth/forms ' +
    'https://www.googleapis.com/auth/drive ' +
    'https://www.googleapis.com/auth/script.external_request ' +
    'https://www.googleapis.com/auth/spreadsheets ' +
    'https://www.googleapis.com/auth/userinfo.email ' +
    'https://www.googleapis.com/auth/userinfo.profile ';

var gAuth;
var mainWindowView;
var user;

class MainSetup {
    static get currentUser() {
        return JSON.parse(sessionStorage.getItem('Current User'));
    }

    static datePickerSettings = {
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        showWeekdaysShort: true,
        monthsFull: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
        monthsShort: ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'],
        weekdaysFull: ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'],
        weekdaysShort: ['nie', 'pon', 'wt', 'śr', 'czw', 'pi', 'sob'],
        firstDay: 1,
        today: 'Dzisiaj',
        clear: 'Wyszyść',
        close: 'Ok',
        closeOnSelect: false, // Close upon selecting a date,
        container: undefined, // ex. 'body' will append picker to body
        format: 'dd-mm-yyyy',
        formatSubmit: 'yyyy-mm-dd'
    }
}