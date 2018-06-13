class ExternalAchievementModal extends Modal {
    constructor(id, tittle, connectedResultsetComponent, connectedResultsetComponentAddNewHandler){
        super(id, tittle, connectedResultsetComponent, connectedResultsetComponentAddNewHandler);
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
        
        this.ownerAutoCompleteTextField = new AutoCompleteTextField(this.id+'ownerAutoCompleteTextField',
                                                                     'Imię i nazwisko', 
                                                                     'person', 
                                                                     true, 
                                                                     'Wybierz imię i nazwisko')
        this.ownerAutoCompleteTextField.initialise(personsRepository,"nameSurnameEmail", this.onOwnerChosen, this);
        this.roleSelectField = new SelectField(this.id + 'roleSelectField', 'Pełniona rola', true);
        this.roleSelectField.initialise(this.roleNames);
        this.startDatePicker = new DatePicker(this.id + 'startDatePickerField','Początek', true);
        this.endDatePicker = new DatePicker(this.id + 'endDatePickerField','Koniec', true);
        
        this.$formElements = [
            this.ownerAutoCompleteTextField.$dom,
            this.roleSelectField.$dom,
            FormTools.createInputField(this.id + 'descriptionTextField','Opis doświadczenia', true, 300),
            FormTools.createInputField(this.id + 'worksScopeTextField','Zakres robót', true, 2000),
            FormTools.createInputField(this.id + 'worksValueTextField','Wartość obsługiwanych robót', true, 20),
            FormTools.createInputField(this.id + 'projectValueTextField','Wartość całego projektu', true, 20),
            this.startDatePicker.$dom,
            this.endDatePicker.$dom,
            FormTools.createInputField(this.id + 'employerTextField','Zamawiający', true, 300),
            FormTools.createSubmitButton("Przypisz")
        ];
        
        
        this.initialise();

    }
    fillWithData(){
        this.ownerAutoCompleteTextField.setChosenItem(externalAchievementsRepository.currentItem.ownerNameSurnameEmail);
        this.roleSelectField.setChosenItem(externalAchievementsRepository.currentItem.roleName);
        this.$formElements[2].children('input').val(externalAchievementsRepository.currentItem.description);
        this.$formElements[3].children('input').val(externalAchievementsRepository.currentItem.worksScope);
        this.$formElements[4].children('input').val(externalAchievementsRepository.currentItem.worksValue);
        this.$formElements[5].children('input').val(externalAchievementsRepository.currentItem.projectValue);
        this.startDatePicker.setChosenDate(externalAchievementsRepository.currentItem.startDate);
        this.endDatePicker.setChosenDate(externalAchievementsRepository.currentItem.endDate);
        this.$formElements[8].children('input').val(externalAchievementsRepository.currentItem.employer);

    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        this.dataObject = { id: externalAchievementsRepository.currentItem.id, //używane tylko przy edycji
                            ownerId: this.ownerAutoCompleteTextField.chosenItem.id,
                            ownerNameSurnameEmail: this.ownerAutoCompleteTextField.chosenItem.nameSurnameEmail,
                            roleName: this.$formElements[1].find('input').val(),
                            description: $('#'+this.id + 'descriptionTextField').val(),
                            worksScope: $('#' + this.id + 'worksScopeTextField').val(),
                            worksValue: $('#' + this.id + 'worksValueTextField').val(),
                            projectValue: $('#' + this.id + 'projectValueTextField').val(),
                            startDate: $('#' + this.id + 'startDatePickerField').val(),
                            endDate: $('#' + this.id + 'endDatePickerField').val(),
                            employer: $('#' + this.id + 'employerTextField').val()
                          };
        externalAchievementsRepository.setCurrentItem(this.dataObject);
    }
    
};