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
        this.ownerAutoCompleteTextField.initialise(personsRepository,"nameSurname", this.onOwnerChosen, this);
        this.roleSelectField = new SelectField('roleSelectField', 'Pełniona rola', true);
        this.roleSelectField.initialise(this.roleNames);
        this.startDatePicker = new DatePicker('startDatePickerField','Początek', true);
        
        this.$formElements = [
            this.ownerAutoCompleteTextField.$dom,
            this.roleSelectField.$dom,
            FormTools.createInputField('descriptionTextField','Opis doświadczenia', true, 20),
            FormTools.createInputField('worksScopeTextField','Zakres robót', true, 20),
            FormTools.createInputField('worksValueTextField','Wartość obsługiwanych robót', true, 20),
            FormTools.createInputField('projectValueTextField','Wartość całego projektu', true, 20),
            this.startDatePicker.$dom,
            FormTools.createSubmitButton("Przypisz")
        ];
        
        
        this.initialise();

    }
    fillWithData(){
        this.ownerAutoCompleteTextField.setChosenItem(externalAchievementsRepository.currentItem.ownerNameSurname);
        this.roleSelectField.setChosenItem(externalAchievementsRepository.currentItem.roleName);

        this.$formElements[2].children('input').val(externalAchievementsRepository.currentItem.description);
        this.$formElements[3].children('input').val(externalAchievementsRepository.currentItem.worksScope);
        this.$formElements[4].children('input').val(externalAchievementsRepository.currentItem.worksValue);
        this.$formElements[5].children('input').val(externalAchievementsRepository.currentItem.projectValue);
        this.startDatePicker.setChosenDate(externalAchievementsRepository.currentItem.startDate);
        //this.$formElements[6].children('input').val(externalAchievementsRepository.currentItem.startDate);
        this.$formElements[7].children('input').val(externalAchievementsRepository.currentItem.endDate);

    }
        
    /*
     * Krok 1 - po kliknięciu 'Submit' formularza dodawania
     * Proces: this.submitTrigger >> rolesRepository.addNewPerson
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[PENDING]
     *                                  >> repository. addNewHandler >> personsRolesCollection.addNewHandler[DONE]
    */
    submitTrigger(){
        this.dataObject = { id: externalAchievementsRepository.currentItem.id, //używane tylko przy edycji
                            ownerId: this.entityAutocompleteTextField.chosenItem.id,
                            roleName: $('#' + this.id + 'roleNameTextField option:selected').val(),
                            description: $('#'+this.id + 'descriptionTextField').val(),
                            worksScope: $('#' + this.id + 'worksScopeTextField').val()
                            
                            //position: $('#' + this.id + 'positionTextField').val(),
                            //email: $('#' + this.id + 'emailTextField').val(),
                            //cellphone: $('#' + this.id + 'cellphoneTextField').val(),
                            //phone: $('#' + this.id + 'phoneTextField').val(),
                            //comment: $('#' + this.id + 'commentTextField').val()

                          };
        personsRepository.setCurrentItem(this.dataObject);
    }
    
};