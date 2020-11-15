class ExternalAchievementModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, mode) {
        super(id, tittle, connectedResultsetComponent, mode);
        this.roleNames = ['Kierownik Projektu - Inżynier Rezydent',
            'Inspektor Nadzoru - Sanitarny',
            'Inspektor Nadzoru - Drogowiec',
            'Inspektor Nadzoru - Konstruktor',
            'Inspektor Nadzoru - Konstruktor',
            'Inspektor Nadzoru - Elektryk',
            'Inspektor Nadzoru - AKPiA, automatyk',
            'Inspektor Nadzoru - Telekomunikacyjny',
            'Rozliczeniowiec - Roboty',
            'Kierownik Robót/budowy - Sanitarny',
            'Kierownik Robót/budowy - Drogowiec',
            'Kierownik Robót/budowy - Konstruktor',
            'Kierownik Robót/budowy - Elektryk',
            'Kierownik Robót/budowy - AKPiA',
            'Kierownik Robót/budowy - Telekomunikacyjny',
            'Rozliczeniowiec - wnioski o płatność, dotacje',
            'Analityk finansowy',
            'Architekt',
            'Ekspert Pzp',
            'Szkoleniowiec',
            'Radca Prawny',
            'Archeolog'
        ];

        this.ownerAutoCompleteTextField = new AutoCompleteTextField(this.id + 'ownerAutoCompleteTextField',
            'Imię i nazwisko',
            'person',
            true,
            'Wybierz imię i nazwisko')
        this.ownerAutoCompleteTextField.initialise(personsRepository, "_nameSurnameEmail", this.onOwnerChosen, this);
        this.roleSelectField = new SelectField(this.id + '_roleSelectField', 'Pełniona rola', true);
        this.roleSelectField.initialise(this.roleNames);
        this.descriptionReachTextArea = new ReachTextArea(this.id + 'descriptionReachTextArea', 'Wykonywane czynności', true, 500);
        this.worksScopeReachTextArea = new ReachTextArea(this.id + 'worksScopeReachTextArea', 'Opis robót, których dotyczy doświadczenie', true, 800);

        this.startDatePicker = new DatePicker(this.id + 'startDatePickerField', 'Początek', true);
        this.endDatePicker = new DatePicker(this.id + 'endDatePickerField', 'Koniec', true);

        this.formElements = [
            {
                input: this.ownerAutoCompleteTextField,
                dataItemKeyName: '_owner'
            },
            {
                input: this.roleSelectField,
                dataItemKeyName: 'roleName'
            },
            {
                input: this.descriptionReachTextArea,
                dataItemKeyName: 'description'
            },
            {
                input: this.worksScopeReachTextArea,
                dataItemKeyName: 'worksScope'
            },
            {
                input: new InputTextField(this.id + 'worksValueTextField', 'Wartość obsługiwanych robót', undefined, true, 20),
                dataItemKeyName: 'worksValue'
            },
            {
                input: new InputTextField(this.id + 'projectValueTextField', 'Wartość całego projektu', undefined, true, 50),
                dataItemKeyName: 'projectValue'
            },
            {
                input: this.startDatePicker,
                dataItemKeyName: 'startDate'
            },
            {
                input: this.endDatePicker,
                dataItemKeyName: 'endDate'
            },
            {
                input: FormTools.createTextArea(this.id + 'employerTextArea', 'Zamawiający', true, 300),
                dataItemKeyName: 'employer'
            }
        ];
        this.initialise();
    }

    /*
     * Używana przy włączaniu Modala w celu dodania nowego rekordu
     * @returns {undefined}
     */
    initAddNewData() {

    }
};